// src/js/main/window-manager.js
const { BrowserWindow } = require('electron');
const path = require('path');
const { APP_DIMENSIONS, APP_ROOT_PATH } = require('./constants');

let mainWindow;

function createMainWindow() {
    mainWindow = new BrowserWindow({
        ...APP_DIMENSIONS,
        resizable: false,
        frame: false,
        webPreferences: {
            preload: path.join(APP_ROOT_PATH, 'preload.js'),
            contextIsolation: true,
            nodeIntegration: false,
            enableRemoteModule: false,
        }
    });

    // MODIFIED: These listeners are added to correctly report the window state.
    mainWindow.on('maximize', () => mainWindow.webContents.send('window-state-changed', true));
    mainWindow.on('unmaximize', () => mainWindow.webContents.send('window-state-changed', false));
    
    // Send the INITIAL window state once the page has loaded
    mainWindow.webContents.on('did-finish-load', () => {
        mainWindow.webContents.send('window-state-changed', mainWindow.isMaximized());
    });

    mainWindow.loadFile(path.join(APP_ROOT_PATH, 'src', 'index.html'));

    return mainWindow;
}

function getMainWindow() { return mainWindow; }

module.exports = {
    createMainWindow,
    getMainWindow,
};