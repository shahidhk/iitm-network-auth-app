(function() {

	angular
		.module('app')
		.config(['$mdThemingProvider', configure])
        .config(['$analyticsProvider', analyticsConfigure]);

    function analyticsConfigure($analyticsProvider) {
        $analyticsProvider.virtualPageviews(false);
    }

	function configure($mdThemingProvider) {
	    // Configure a dark theme with primary foreground yellow
	    $mdThemingProvider
	    	.theme('docs-dark', 'default')
	    	.primaryPalette('yellow')
	    	.dark()
    		.foregroundPalette['3'] = 'yellow';
	}

})();
