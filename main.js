// main.js
const { app, dialog, shell } = require('electron');
const { initializeApp } = require('./src/js/main/app-lifecycle');
const { setupIpcHandlers } = require('./src/js/main/ipc-handlers');

// --- THIS IS THE FIX: Development Mode Toggle ---
// Set to 'true' when running with `npm start` to bypass the launcher check.
// Set to 'false' before creating a production build.
const IN_DEVELOPMENT_MODE = false; 

// This argument will be passed by the launcher when it starts the app.
const LAUNCHER_ARG = '--launched-by-xutron';
// This is the custom protocol the launcher will register.
// The appId should match the one used in the launcher's configuration.
const LAUNCHER_PROTOCOL_URI = 'xutron-launcher://relaunch?appId=passwordgenerator';

// Check if the app was launched directly in production
// MODIFIED: This condition now uses the new boolean toggle.
if (!IN_DEVELOPMENT_MODE && !process.argv.includes(LAUNCHER_ARG)) {
    // If not launched by the launcher, try to open the launcher via its protocol and quit.
    console.log('Not launched by XutronCore Launcher. Attempting to open launcher...');
    try {
        shell.openExternal(LAUNCHER_PROTOCOL_URI);
    } catch (e) {
        dialog.showErrorBox(
            'Launcher Required',
            'Could not start the XutronCore Launcher. Please ensure it is installed correctly and try again.'
        );
    }
    app.quit();
} else {
    // --- ALL ORIGINAL APP INITIALIZATION CODE IS PLACED INSIDE THIS ELSE BLOCK ---
    
    // This must be called first for windows installers, but is safe to keep.
    if (require('electron-squirrel-startup')) {
        app.quit();
    }

    // Set up all IPC listeners before the app is ready
    setupIpcHandlers();

    // Start the application lifecycle
    app.whenReady().then(() => {
        initializeApp();
    });
}