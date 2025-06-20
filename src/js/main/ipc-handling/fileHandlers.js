const { ipcMain, dialog, shell } = require('electron');
const fs = require('fs');
const windowManager = require('../window-manager');
const { logErrorToFile } = require('../utils');

// --- File Handler Setup ---
function setupFileHandlers() {
    ipcMain.handle('generate-pdf', async (event, passwords) => {
        const win = windowManager.getMainWindow();
        const { filePath } = await dialog.showSaveDialog(win, {
            title: 'Save PDF', defaultPath: 'Password-Vault.pdf',
            filters: [{ name: 'PDF', extensions: ['pdf'] }]
        });
        if (!filePath) return;
        win.webContents.send('trigger-pdf-generation', passwords, filePath);
    });

    ipcMain.on('pdf-generated', (event, { filePath, dataUri }) => {
        const win = windowManager.getMainWindow();
        const data = Buffer.from(dataUri.split('base64,')[1], 'base64');
        try {
            fs.writeFileSync(filePath, data);
            win.webContents.send('export-success', filePath);
        } catch (error) { logErrorToFile(error); }
    });

    ipcMain.on('show-item-in-folder', (event, filePath) => {
        shell.showItemInFolder(filePath);
    });
}

module.exports = { setupFileHandlers };