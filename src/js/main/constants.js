// <-- comment (.js file)(src/js/main/constants.js) -->
const { app } = require('electron');
const path = require('path');

const userDataPath = app.getPath('userData');

module.exports = {
    LOGS_PATH: path.join(userDataPath, 'logs'),
    // Adjusted dimensions for a better two-column layout
    APP_DIMENSIONS: { width: 1000, height: 780, minWidth: 940, minHeight: 700 },
    APP_ROOT_PATH: app.getAppPath(),
};
// <-- end comment (.js file)(src/js/main/constants.js) -->