const electron = require('electron');
const {ipcRenderer} = electron;
const {remote} = electron;
const IITMNetworkAuth = require('iitm-network-auth');

function boot() {

	// Get logger instance and inject it in Angular
	const logger = remote.getGlobal('logger');
	angular
		.module('app')
		.value('logger', logger)
		.value('authenticator', IITMNetworkAuth);

	angular.bootstrap(document, ['app'], {
		strictDi: true
	});
}

document.addEventListener('DOMContentLoaded', boot);

ipcRenderer.on('update-message', function(event, method) {
    alert(method);
});
