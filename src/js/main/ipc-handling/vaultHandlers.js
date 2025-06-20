const { ipcMain, dialog } = require('electron');
const crypto = require('crypto');
const Store = require('electron-store');
const fs = require('fs');
const windowManager = require('../window-manager');
const { logErrorToFile } = require('../utils');

const store = new Store();
const ALGO = 'aes-256-gcm';
let encryptionKey = null;

// --- Key Derivation (Used for both vault and file encryption) ---
function deriveKey(password, salt) {
    return crypto.scryptSync(password, salt, 32);
}

// --- Vault Encryption/Decryption ---
function encrypt(data, key) {
    const finalKey = key || encryptionKey;
    if (!finalKey) throw new Error("Vault is locked. Cannot encrypt.");
    const iv = crypto.randomBytes(12);
    const cipher = crypto.createCipheriv(ALGO, finalKey, iv);
    const encrypted = Buffer.concat([cipher.update(JSON.stringify(data)), cipher.final()]);
    const authTag = cipher.getAuthTag();
    return Buffer.concat([iv, authTag, encrypted]).toString('hex');
}

function decrypt(hexData, key) {
    const finalKey = key || encryptionKey;
    if (!finalKey) throw new Error("Vault is locked. Cannot decrypt.");
    try {
        const data = Buffer.from(hexData, 'hex');
        const iv = data.slice(0, 12);
        const authTag = data.slice(12, 28);
        const encrypted = data.slice(28);
        const decipher = crypto.createDecipheriv(ALGO, finalKey, iv);
        decipher.setAuthTag(authTag);
        const decrypted = Buffer.concat([decipher.update(encrypted), decipher.final()]);
        return JSON.parse(decrypted.toString());
    } catch (error) { return null; }
}

// --- Import/Export File Encryption/Decryption ---
function encryptForExport(data, password) {
    const salt = crypto.randomBytes(16);
    const key = deriveKey(password, salt);
    const iv = crypto.randomBytes(12);
    const cipher = crypto.createCipheriv(ALGO, key, iv);
    const encrypted = Buffer.concat([cipher.update(JSON.stringify(data)), cipher.final()]);
    const authTag = cipher.getAuthTag();
    return Buffer.concat([salt, iv, authTag, encrypted]).toString('hex');
}

function decryptFromImport(hexData, password) {
    try {
        const data = Buffer.from(hexData, 'hex');
        const salt = data.slice(0, 16);
        const iv = data.slice(16, 28);
        const authTag = data.slice(28, 44);
        const encrypted = data.slice(44);
        const key = deriveKey(password, salt);
        const decipher = crypto.createDecipheriv(ALGO, key, iv);
        decipher.setAuthTag(authTag);
        const decrypted = Buffer.concat([decipher.update(encrypted), decipher.final()]);
        return JSON.parse(decrypted.toString());
    } catch (error) { return null; }
}


// --- Vault Handler Setup ---
function setupVaultHandlers() {
    ipcMain.handle('vault-is-initialized', () => store.has('vault'));

    ipcMain.handle('vault-initialize', (event, masterPassword) => {
        const salt = crypto.randomBytes(16).toString('hex');
        const initialKey = deriveKey(masterPassword, salt);
        const encryptedVault = encrypt([], initialKey);
        store.set('vault', encryptedVault);
        store.set('salt', salt);
        encryptionKey = initialKey;
        return { success: true };
    });

    ipcMain.handle('vault-unlock', (event, masterPassword) => {
        const salt = store.get('salt');
        const testKey = deriveKey(masterPassword, salt);
        const vaultData = decrypt(store.get('vault'), testKey);
        
        if (vaultData === null) {
            return { success: false, message: 'Incorrect master password.' };
        }
        encryptionKey = testKey;
        return { success: true };
    });

    ipcMain.on('vault-lock', () => { encryptionKey = null; });
    
    ipcMain.handle('vault-change-password', (event, { oldPassword, newPassword, confirmPassword }) => {
        if (!encryptionKey) return { success: false, message: 'Vault must be unlocked to change the password.' };
        // UPDATED: Changed length check and error message
        if (!newPassword || newPassword.length < 6) return { success: false, message: 'New password must be at least 6 characters.' };
        if (newPassword !== confirmPassword) return { success: false, message: 'New passwords do not match.' };

        const salt = store.get('salt');
        const testOldKey = deriveKey(oldPassword, salt);
        
        if (!crypto.timingSafeEqual(testOldKey, encryptionKey)) {
            return { success: false, message: 'Incorrect old password.' };
        }

        const currentPasswords = decrypt(store.get('vault'));
        const newKey = deriveKey(newPassword, salt);
        const newEncryptedVault = encrypt(currentPasswords, newKey);
        store.set('vault', newEncryptedVault);
        encryptionKey = newKey;
        return { success: true };
    });

    ipcMain.handle('vault-get-passwords', () => {
        if (!encryptionKey) return { success: false, passwords: [] };
        return { success: true, passwords: decrypt(store.get('vault')) };
    });

    ipcMain.handle('vault-save-password', (event, passwordData) => {
        if (!encryptionKey) return { success: false, message: 'Vault is locked.' };
        const passwords = decrypt(store.get('vault'));
        passwords.push({ id: crypto.randomUUID(), ...passwordData });
        store.set('vault', encrypt(passwords));
        return { success: true, passwords };
    });
    
    ipcMain.handle('vault-delete-password', (event, id) => {
        if (!encryptionKey) return { success: false, message: 'Vault is locked.' };
        let passwords = decrypt(store.get('vault'));
        passwords = passwords.filter(p => p.id !== id);
        store.set('vault', encrypt(passwords));
        return { success: true, passwords };
    });

    ipcMain.handle('vault-delete-passwords', (event, ids) => {
        if (!encryptionKey) return { success: false, message: 'Vault is locked.' };
        let passwords = decrypt(store.get('vault'));
        
        if (ids.length === 0) { // If no IDs are provided, delete all
            passwords = [];
        } else { // Otherwise, delete the selected ones
            const idSet = new Set(ids);
            passwords = passwords.filter(p => !idSet.has(p.id));
        }

        store.set('vault', encrypt(passwords));
        return { success: true, passwords };
    });

    // --- MOVED AND CORRECTED HANDLERS ---
    ipcMain.handle('export-passwords', async (event, { passwords, password }) => {
        const win = windowManager.getMainWindow();
        const { filePath } = await dialog.showSaveDialog(win, {
            title: 'Export Passwords', defaultPath: 'password-vault-export.dat',
            filters: [{ name: 'Encrypted Vault', extensions: ['dat'] }]
        });
        if (!filePath) return;

        try {
            const encryptedData = encryptForExport(passwords, password);
            fs.writeFileSync(filePath, encryptedData);
            win.webContents.send('export-success', filePath);
        } catch (error) { logErrorToFile(error); }
    });

    ipcMain.handle('import-passwords', async (event, { password, fileContents }) => {
        if (!encryptionKey) {
            return { success: false, message: 'Vault must be unlocked to import.' };
        }
        
        const currentPasswords = decrypt(store.get('vault'));
        if (currentPasswords === null) {
            return { success: false, message: 'Failed to read existing vault data.' };
        }

        const existingEntries = new Set(currentPasswords.map(p => `${p.name.toLowerCase()}:${p.username.toLowerCase()}`));
        let totalNewPasswords = 0;

        for (const content of fileContents) {
            const importedPasswords = decryptFromImport(content, password);
            if (importedPasswords === null) {
                return { success: false, message: 'Import failed: Incorrect password or corrupt file.' };
            }
            
            importedPasswords.forEach(importedPass => {
                const entryKey = `${importedPass.name.toLowerCase()}:${importedPass.username.toLowerCase()}`;
                if (!existingEntries.has(entryKey)) {
                    currentPasswords.push({ id: crypto.randomUUID(), ...importedPass });
                    existingEntries.add(entryKey);
                    totalNewPasswords++;
                }
            });
        }
        
        // Re-encrypt and save the updated password list
        store.set('vault', encrypt(currentPasswords));
        
        return { success: true, passwords: currentPasswords, message: `Import complete. Added ${totalNewPasswords} new passwords.` };
    });
}

module.exports = { setupVaultHandlers };