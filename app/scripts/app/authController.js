(function(){

    angular
        .module('app', ['ngMaterial', 'ngAnimate'])
        .controller('AuthController', ['$scope', '$window', '$mdToast', 'logger', 'ipcRenderer',  AuthController]);

    function AuthController($scope, $window, $mdToast, logger, ipcRenderer) {

        // List of bindable properties and methods
        var ctrl = this;
        // Get username and password from localstorage
        ctrl.username = $window.localStorage.getItem('ldap_username') || '';
        ctrl.password = $window.localStorage.getItem('ldap_password') || '';
        ctrl.remember = JSON.parse($window.localStorage.getItem('remember')) || false;
        ctrl.credentials = ctrl.username && ctrl.password;
        ctrl.mode = 'nfw';
        ctrl.loading = false;
        ctrl.connected = false;
        ctrl.login = login;
        ctrl.logout = logout;
        ctrl.forget = forget;
        ctrl.shouldConnect = true;
        ctrl.updateRemember = updateRemember;

        ipcRenderer.on('log-in-done', function (e, arg) {
            ctrl.loading = false;
            ctrl.connected = true;
            showToast('Logged in with id: ' + arg.data.message);
            $scope.$apply();
        });
        ipcRenderer.on('error-happened', function (e, a) {
            ctrl.loading = false;
            showToast('ERROR: ' + a.data.error);
            $scope.$apply();
        });
        ipcRenderer.on('log-out-done', function (event, arg) {
            ctrl.loading = false;
            ctrl.connected = false;
            showToast('Logged out');
            $scope.$apply();
            if (ctrl.shouldConnect) {
                login();
            }
        });
        ipcRenderer.on('session-refreshed', function (e) {
            showToast('Session refreshed');
        });
        ipcRenderer.on('update-message', function(event, method) {
            // Do not trigger an alert, rather notify in some other manner
            // alert(method);
            showToast(method);
        });
        // Define ui login and logout functions
        function login() {
            if (ctrl.remember) {
                $window.localStorage.setItem('ldap_username', ctrl.username);
                $window.localStorage.setItem('ldap_password', ctrl.password);
            }
            ctrl.loading = true;
            ipcRenderer.send('do-log-in', ctrl.username, ctrl.password);
        }
        function logout() {
            ctrl.loading = true;
            ctrl.shouldConnect = false;
            ipcRenderer.send('do-log-out'); 
        }

        function forget() {
            logout();
            ctrl.username = '';
            ctrl.password = '';
            ctrl.remember = false;
            $window.localStorage.setItem('ldap_username', ctrl.username);
            $window.localStorage.setItem('ldap_password', ctrl.password);
            $window.localStorage.setItem('remember', ctrl.remember);
            showToast('Removed user from this system');
        }
        function updateRemember() {
            $window.localStorage.setItem('remember', ctrl.remember);
        }

        // Helper function to show simple toasts
        function showToast(message) {
            $mdToast.show(
                $mdToast.simple()
                .textContent(message)                       
                .hideDelay(3000)
                .position('top right')
            ); 
        }

        // Logout and start a new session when app opens
        if (ctrl.credentials) { 
            ipcRenderer.send('do-log-out');
        } else {
            showToast("Enter credentials");
        }
    }

})();
