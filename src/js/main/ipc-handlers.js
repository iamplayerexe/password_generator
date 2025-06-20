// <-- comment (.js file)(src/js/main/ipc-handlers.js) -->
const { setupVaultHandlers } = require('./ipc-handling/vaultHandlers');
const { setupFileHandlers } = require('./ipc-handling/fileHandlers');
const { setupSystemHandlers } = require('./ipc-handling/systemHandlers');

function setupIpcHandlers() {
    setupVaultHandlers();
    setupFileHandlers();
    setupSystemHandlers();
}

module.exports = { setupIpcHandlers };
// <-- end comment (.js file)(src/js/main/ipc-handlers.js) -->