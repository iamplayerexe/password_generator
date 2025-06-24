// src/js/main/constants.js
const { app } = require('electron');
const path = require('path');

const userDataPath = app.getPath('userData');

module.exports = {
    LOGS_PATH: path.join(userDataPath, 'logs'),
    // MODIFIED: Increased window height and minimum height to prevent overflow.
    APP_DIMENSIONS: { width: 1200, height: 850, minWidth: 980, minHeight: 750 },
    APP_ROOT_PATH: app.getAppPath(),
};