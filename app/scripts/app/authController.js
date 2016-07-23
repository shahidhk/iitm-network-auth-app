(function(){

    angular
        .module('app', ['ngMaterial', 'ngAnimate'])
        .controller('AuthController', ['$scope', '$window', '$mdToast', 'logger', 'authenticator', AuthController]);

    function AuthController($scope, $window, $mdToast, logger, authenticator) {

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

        // Initialise the auth object
        var auth = new authenticator(ctrl.username, ctrl.password, ctrl.mode);
        var emitter = auth.get_emitter();

        // Add listener on events (refer https://github.com/shahidhk/iitm-network-auth for complete list of events)
        emitter.on('log_in', function (e) {
            ctrl.loading = false;
            ctrl.connected = true;
            logger.log(e.data);
            showToast('Logged in with id: ' + e.data.message);
            auth.start_refresh();
            $scope.$apply();
        });
        emitter.on('error', function (e) {
            ctrl.loading = false;
            logger.error(e.data);
            showToast('ERROR: ' + e.data.error);
            $scope.$apply();
        });
        emitter.on('log_out', function (e) {
            ctrl.loading = false;
            ctrl.connected = false;
            logger.log(e.data);
            showToast('Logged out');
            $scope.$apply();
            if (ctrl.shouldConnect) {
                auth.login();
            }
        });
        emitter.on('session_refresh', function (e) {
            logger.log(e.data);
            showToast('Session refreshed');
        });

        // Define ui login and logout functions
        function login() {
            $window.localStorage.setItem('ldap_username', ctrl.username);
            $window.localStorage.setItem('ldap_password', ctrl.password);
            ctrl.loading = true;
            auth.set_credentials(ctrl.username, ctrl.password);
            auth.login();
        }
        function logout() {
            ctrl.loading = true;
            ctrl.shouldConnect = false;
            auth.logout(); 
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
        auth.logout();
    }

})();
