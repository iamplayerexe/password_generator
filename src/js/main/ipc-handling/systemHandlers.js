// <-- comment (.js file)(src/js/main/ipc-handling/systemHandlers.js) -->
const { ipcMain, app } = require('electron');
const windowManager = require('../window-manager');

function setupSystemHandlers() {
    ipcMain.on('window-minimize', () => windowManager.getMainWindow()?.minimize());
    ipcMain.on('window-toggle-maximize', () => {
        const win = windowManager.getMainWindow();
        win.isMaximized() ? win.unmaximize() : win.maximize();
    });
    ipcMain.on('window-close', () => windowManager.getMainWindow()?.close());
    
    ipcMain.handle('get-app-version', () => app.getVersion());

    ipcMain.handle('generate-password', (event, { sentence, appName, includeSymbols }) => {
        if (!sentence || !appName) return { success: false, message: 'Please provide both a sentence and an app name.' };
        const appLetters = (appName.match(/[A-Z0-9]/g) || []).join('');
        const cleanSentence = sentence.replace(/\s+/g, '');
        if (cleanSentence.length < 6) return { success: false, message: `Sentence must be at least 6 characters long.` };
        let sentenceLetters = '';
        for (let i = 0; i < 6; i++) {
            const index = Math.floor(i * (cleanSentence.length - 1) / 5);
            sentenceLetters += cleanSentence[index];
        }
        sentenceLetters = sentenceLetters.split('').map(char => (Math.random() > 0.5 ? char.toUpperCase() : char.toLowerCase())).join('');
        const baseLength = appLetters.length + sentenceLetters.length + 2;
        const minTotalLength = Math.max(12, baseLength + 5);
        const maxTotalLength = 20;
        if (minTotalLength > maxTotalLength) return { success: false, message: "Inputs are too long. Shorten app name or sentence." };
        const desiredLength = Math.floor(Math.random() * (maxTotalLength - minTotalLength + 1)) + minTotalLength;
        const fillerLength = desiredLength - baseLength;
        const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789' + (includeSymbols ? '!@#$%^&*()_+-=[]{}|;' : '');
        let randomFiller = Array.from({ length: fillerLength }, () => chars[Math.floor(Math.random() * chars.length)]).join('');
        if (includeSymbols && !randomFiller.split('').some(c => '!@#$%^&*()_+-=[]{}|;'.includes(c))) {
            const fillerArr = randomFiller.split('');
            fillerArr[Math.floor(Math.random() * fillerArr.length)] = '!@#$%^&*()_+-=[]{}|;'.charAt(Math.floor(Math.random() * 17));
            randomFiller = fillerArr.join('');
        }
        return { success: true, password: `${appLetters}_${sentenceLetters}_${randomFiller}`.slice(0, 20) };
    });
}

module.exports = { setupSystemHandlers };
// <-- end comment (.js file)(src/js/main/ipc-handling/systemHandlers.js) -->