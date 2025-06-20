// <-- comment (.js file)(src/js/main/utils.js) -->
const fs = require('fs');
const path = require('path');
const crypto = require('crypto');
const { LOGS_PATH } = require('./constants');

function logErrorToFile(error) {
    try {
        if (!fs.existsSync(LOGS_PATH)) {
            fs.mkdirSync(LOGS_PATH, { recursive: true });
        }
        const errorId = crypto.randomUUID();
        const logFilePath = path.join(LOGS_PATH, `error_${errorId}.txt`);
        const errorContent = `Timestamp: ${new Date().toISOString()}\n\nError: ${error.message}\n\nStack Trace:\n${error.stack || 'No stack available'}\n`;
        fs.writeFileSync(logFilePath, errorContent);
        console.error(`Error logged to: ${logFilePath}`);
    } catch (logError) {
        console.error("Failed to write to log file:", logError);
    }
}

function cleanupOldLogs() {
    try {
        if (!fs.existsSync(LOGS_PATH)) return;
        const files = fs.readdirSync(LOGS_PATH);
        const fifteenDaysAgo = Date.now() - (15 * 24 * 60 * 60 * 1000);

        for (const file of files) {
            const filePath = path.join(LOGS_PATH, file);
            const stats = fs.statSync(filePath);
            if (stats.mtime.getTime() < fifteenDaysAgo) {
                fs.unlinkSync(filePath);
            }
        }
    } catch (cleanupError) {
        console.error("Failed to clean up old logs:", cleanupError);
    }
}

module.exports = {
    logErrorToFile,
    cleanupOldLogs,
};
// <-- end comment (.js file)(src/js/main/utils.js) -->