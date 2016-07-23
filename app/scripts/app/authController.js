(function(){

    angular
        .module('app', ['ngMaterial', 'ngAnimate'])
        .controller('AuthController', ['$scope', '$window', '$mdToast', 'logger', 'ipcRenderer',  AuthController]);

    function AuthController($scope, $window, $mdToast, logger, ipcRenderer) {

        // List of bindable properties and methods
        var ctrl = this;
        // Get username and password from localstorage
        ctrl.username = $window.localStorage.getItem('ldap_username');
        ctrl.password = $window.localStorage.getItem('ldap_password');
        ctrl.mode = 'nfw';
        ctrl.loading = false;
        ctrl.connected = false;
        ctrl.login = login;
        ctrl.logout = logout;
        ctrl.shouldConnect = true;

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

        // Define ui login and logout functions
        function login() {
            $window.localStorage.setItem('ldap_username', ctrl.username);
            $window.localStorage.setItem('ldap_password', ctrl.password);
            ctrl.loading = true;
            ipcRenderer.send('do-log-in', ctrl.username, ctrl.password);
        }
        function logout() {
            ctrl.loading = true;
            ctrl.shouldConnect = false;
            ipcRenderer.send('do-log-out'); 
        }

        // Helper function to show simple toasts
        function showToast(message) {
            $mdToast.show(
                $mdToast.simple()
                .textContent(message)                       
                .hideDelay(3000)
            ); 
        }

        // Logout and start a new session when app opens
        ipcRenderer.send('do-log-out'); 
    }

})();
