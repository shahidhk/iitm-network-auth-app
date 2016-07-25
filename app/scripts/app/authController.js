(function(){

    angular
        .module('app', ['ngMaterial', 'ngAnimate', 'angulartics', 'angulartics.google.analytics'])
        .controller('AuthController', ['$scope', '$window', '$mdToast', 'logger', 'ipcRenderer', '$analytics', '$http',  AuthController]);

    function AuthController($scope, $window, $mdToast, logger, ipcRenderer, $analytics, $http) {
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
        ctrl.pageOpened = false;
        ctrl.updateData = {};
        ctrl.updateAvailable = false;
        ctrl.appDetails = {};

        ipcRenderer.on('log-in-done', function (e, arg) {
            $analytics.eventTrack('login', {page: '/app'});
            ctrl.loading = false;
            ctrl.connected = true;
            showToast('Logged in with id: ' + arg.data.message);
            ipcRenderer.send('get-app-details');
            $scope.$apply();
        });
        ipcRenderer.on('error-happened', function (e, a) {
            $analytics.eventTrack('error', {page: '/app', error: a});
            ctrl.loading = false;
            var reason = a.data.error.name || a.data.error;
            if (reason == "RequestError") {
                reason = "Not connected";
            }
            showToast('ERROR: ' + reason);
            $scope.$apply();
        });
        ipcRenderer.on('log-out-done', function (event, arg) {
            $analytics.eventTrack('logout', {page: '/app'});
            ctrl.loading = false;
            ctrl.connected = false;
            showToast('Logged out');
            $scope.$apply();
            if (ctrl.shouldConnect) {
                login();
            }
        });
        ipcRenderer.on('session-refreshed', function (e) {
            $analytics.eventTrack('refresh', {page: '/app'});
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
            $analytics.eventTrack('forget', {page: '/app'});
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

        ipcRenderer.on('app-details', function(event, args){
            ctrl.appDetails = args; 
            ctrl.appDetails.vversion = 'v' + ctrl.appDetails.version;
            if (!ctrl.pageOpened) {
                $analytics.pageTrack('/app/v' + args.version);
                $http.get('https://server.waviness63.hasura-app.io/update/'+ args.platform + '/' + args.version).then(
                    function(resp) {
                        if (resp.data) {
                            ctrl.updateAvailable = true;
                            ctrl.updateData = resp.data;
                            showToast('Update available');
                        }
                    },
                    function(error) {
                        showToast('ERROR: Unable to reach update server');
                    }
                );
                ctrl.pageOpened = true;
            }
        });
    }

})();
