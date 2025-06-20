// <-- comment (.js file)(src/js/main/app-lifecycle.js) -->
const { app, BrowserWindow } = require('electron');
const { createMainWindow } = require('./window-manager');
const { cleanupOldLogs } = require('./utils');

function initializeApp() {
    cleanupOldLogs();
    createMainWindow();

    app.on('activate', () => {
        if (BrowserWindow.getAllWindows().length === 0) {
            createMainWindow();
        }
    });
}

app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') {
        app.quit();
    }
});

module.exports = { initializeApp };
// <-- end comment (.js file)(src/js/main/app-lifecycle.js) -->