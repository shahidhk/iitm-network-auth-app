// Handle Squirrel events for Windows immediately on start
if(require('electron-squirrel-startup')) return;

const electron = require('electron');
const {app} = electron;
const {BrowserWindow} = electron;
const {autoUpdater} = electron;
const {ipcMain} = electron;
const os = require('os');

const logger = require('winston');
logger.level = 'debug';
global.logger = logger;

// Keep reference of main window because of GC
var mainWindow = null;

var updateFeed = 'http://localhost:3000/updates/latest';
var isDevelopment = process.env.NODE_ENV === 'development';
var feedURL = "";

// Don't use auto-updater if we are in development 
if (!isDevelopment) {
    if (os.platform() === 'darwin') {
        updateFeed = 'https://server.waviness63.hasura-app.io/update/darwin/' + app.getVersion();
    }
    else if (os.platform() === 'win32') {
        updateFeed = 'https://server.waviness63.hasura-app.io/update/win32/' +app.getVersion();
    }

    autoUpdater.addListener("update-available", function(event) {
        logger.debug("A new update is available");
        if (mainWindow) {
            mainWindow.webContents.send('update-message', 'update-available');
        }
    });
    autoUpdater.addListener("update-downloaded", function(event, releaseNotes, releaseName, releaseDate, updateURL) {
        logger.debug("A new update is ready to install", `Version ${releaseName} is downloaded and will be automatically installed on Quit`);
        if (mainWindow) {
            mainWindow.webContents.send('update-message', 'update-downloaded');
        }
    });
    autoUpdater.addListener("error", function(error) {
        logger.error(error);
        if (mainWindow) {
            mainWindow.webContents.send('update-message', 'update-error');
        }
    });
    autoUpdater.addListener("checking-for-update", function(event) {
        logger.debug("Checking for update");
        if (mainWindow) {
            mainWindow.webContents.send('update-message', 'checking-for-update');
        }
    });
    autoUpdater.addListener("update-not-available", function() {
        logger.debug("Update not available");
        if (mainWindow) {
            mainWindow.webContents.send('update-message', 'update-not-available');
        }
    });
    
    autoUpdater.setFeedURL(updateFeed);
}

// Quit when all windows are closed
app.on('window-all-closed', function() {
	app.quit();
});

// When application is ready, create application window
app.on('ready', function() {

    logger.debug("Starting application");

    // Create main window
    // Other options available at:
    // http://electron.atom.io/docs/latest/api/browser-window/#new-browserwindow-options
    var w = 400;
    var h = 650; 
    mainWindow = new BrowserWindow({
        name: "iitm-network-auth",
        width: w,
        height: h,
        minWidth: w,
        minHeight: h,
        darkTheme: true,
        fullscreenable: true,
        toolbar: false
    });

    mainWindow.setMenu(null);

    // Target HTML file which will be opened in window
    mainWindow.loadURL('file://' + __dirname + "/index.html");

    if (isDevelopment) {
        mainWindow.webContents.openDevTools({detach:true});
    }

    // Cleanup when window is closed
    mainWindow.on('closed', function() {
        mainWindow = null;
    });
    
    if (!isDevelopment) {
        mainWindow.webContents.on('did-frame-finish-load', function() {
            logger.debug("Checking for updates: " + feedURL);
            autoUpdater.checkForUpdates();
        });
    }

});


const IITMNetworkAuth = require('iitm-network-auth');
const auth = new IITMNetworkAuth('','','nfw')

// Initialise the auth object
var shouldConnect = true; 
// Add listener on events (refer https://github.com/shahidhk/iitm-network-auth for complete list of events)
var emitter = auth.get_emitter();
emitter.on('log_in', function (e) {
    logger.debug(e.data);
    if (e.data.status) {
        auth.start_refresh();
        mainWindow.webContents.send('log-in-done', e);
    } else {
        auth.login();
    }
});
emitter.on('error', function (e) {
    logger.error(e.data);
    mainWindow.webContents.send('error-happened', e);
});
emitter.on('log_out', function (e) {
    logger.debug(e.data);
    mainWindow.webContents.send('log-out-done', e);
});
emitter.on('session_refresh', function (e) {
    logger.debug(e.data);
    mainWindow.webContents.send('session-refreshed', e);
});

ipcMain.on('do-log-out', function (event) {
    auth.logout();
});

ipcMain.on('do-log-in', function (event, username, password) {
    auth.set_credentials(username, password);
    auth.login()
});

ipcMain.on('get-app-details', function() {
    var details = {};
    details.version = app.getVersion();
    details.platform = os.platform();
    mainWindow.webContents.send('app-details', details);
});
