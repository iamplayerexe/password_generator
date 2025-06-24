// preload.js
const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('api', {
  // Window controls and password generation
  generatePassword: (data) => ipcRenderer.invoke('generate-password', data),
  windowControls: {
    minimize: () => ipcRenderer.send('window-minimize'),
    toggleMaximize: () => ipcRenderer.send('window-toggle-maximize'),
    close: () => ipcRenderer.send('window-close'),
  },
  getAppVersion: () => ipcRenderer.invoke('get-app-version'),
  // MODIFIED: This listener is now exposed
  onWindowStateChange: (callback) => ipcRenderer.on('window-state-changed', (_event, isMaximized) => callback(isMaximized)),
  
  // --- Secure Vault API ---
  isVaultInitialized: () => ipcRenderer.invoke('vault-is-initialized'),
  initializeVault: (masterPassword) => ipcRenderer.invoke('vault-initialize', masterPassword),
  unlockVault: (masterPassword) => ipcRenderer.invoke('vault-unlock', masterPassword),
  lockVault: () => ipcRenderer.send('vault-lock'),
  changePassword: (passwords) => ipcRenderer.invoke('vault-change-password', passwords),
  getSavedPasswords: () => ipcRenderer.invoke('vault-get-passwords'),
  savePassword: (passwordData) => ipcRenderer.invoke('vault-save-password', passwordData),
  deletePassword: (id) => ipcRenderer.invoke('vault-delete-password', id),
  deletePasswords: (ids) => ipcRenderer.invoke('vault-delete-passwords', ids),

  // --- Export/Import/PDF API ---
  exportPasswords: (passwords, password) => ipcRenderer.invoke('export-passwords', { passwords, password }),
  importPasswords: (password, fileContents) => ipcRenderer.invoke('import-passwords', { password, fileContents }),
  generatePdf: (passwords) => ipcRenderer.invoke('generate-pdf', passwords),

  // --- UI Feedback & Listeners ---
  onExportSuccess: (callback) => ipcRenderer.on('export-success', (event, filePath) => callback(filePath)),
  showItemInFolder: (filePath) => ipcRenderer.send('show-item-in-folder', filePath),
  onTriggerPdfGeneration: (callback) => ipcRenderer.on('trigger-pdf-generation', (event, passwords, filePath) => callback(passwords, filePath)),
  sendPdfData: (pdfData) => ipcRenderer.send('pdf-generated', pdfData),
});