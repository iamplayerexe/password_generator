import { setupEventListeners } from './events.js';
import { setupModalEventListeners } from './modals.js';
import * as ui from './ui.js';

document.addEventListener('DOMContentLoaded', () => {
    // --- State Management ---
    let appState = 'LOCKED';
    
    // --- Element Gathering ---
    const elements = {
        // Main UI
        lockVaultBtn: document.getElementById('lock-vault-btn'),
        settingsBtn: document.getElementById('settings-btn'),
        vaultControls: document.querySelector('.vault-controls'),
        savedPasswordsList: document.getElementById('saved-passwords-list'),
        appNameInput: document.getElementById('app-name-input'),
        usernameInput: document.getElementById('username-input'),
        sentenceInput: document.getElementById('sentence-input'),
        symbolsCheckbox: document.getElementById('symbols-checkbox'),
        generateBtn: document.getElementById('generate-btn'),
        passwordOutput: document.getElementById('password-output'),
        copyBtn: document.getElementById('copy-btn'),
        errorMessageEl: document.getElementById('error-message'),
        savePasswordBtn: document.getElementById('save-password-btn'),
        exportSelectedBtn: document.getElementById('export-selected-btn'),
        deleteSelectedBtn: document.getElementById('delete-selected-btn'),
        importBtn: document.getElementById('import-btn'),
        pdfBtn: document.getElementById('pdf-btn'),
        vaultActionStatus: document.getElementById('vault-action-status'),
        unselectAllBtn: document.getElementById('unselect-all-btn'),
        searchInput: document.getElementById('search-input'),
        vaultColumn: document.getElementById('vault-column'),

        // Success Popup
        popupOverlay: document.getElementById('popup-overlay'),
        popupCloseBtn: document.getElementById('popup-close-btn'),
        popupShowBtn: document.getElementById('popup-show-btn'),
        
        // Generic Prompt Modal
        promptOverlay: document.getElementById('prompt-overlay'),
        promptTitle: document.getElementById('prompt-title'),
        promptMessage: document.getElementById('prompt-message'),
        promptInput: document.getElementById('prompt-input'),
        promptConfirmBtn: document.getElementById('prompt-confirm-btn'),
        promptCancelBtn: document.getElementById('prompt-cancel-btn'),
        promptError: document.getElementById('prompt-error-message'),

        // Settings Modal
        settingsModalOverlay: document.getElementById('settings-modal-overlay'),
        settingsCloseBtn: document.getElementById('settings-close-btn'),
        oldPasswordInput: document.getElementById('old-password-input'),
        newPasswordInput: document.getElementById('new-password-input'),
        confirmNewPasswordInput: document.getElementById('confirm-new-password-input'),
        changePasswordBtn: document.getElementById('change-password-btn'),
        settingsErrorMessage: document.getElementById('settings-error-message'),
    };

    const getAppState = () => appState;
    const updateAppState = (newState) => {
        appState = newState;
        ui.updateUIForState(elements, appState);
    };

    // --- Initialization ---
    const initializeApp = async () => {
        const isInitialized = await window.api.isVaultInitialized();
        if (!isInitialized) {
            await window.api.initializeVault('0000');
            updateAppState('UNLOCKED');
            ui.setActionStatus(elements, "Vault created with default password '0000'. Please change it in Settings.", false);
        } else {
            updateAppState('LOCKED');
        }
        
        setupEventListeners(elements, getAppState, updateAppState);
        setupModalEventListeners(elements);

        window.api.getAppVersion().then(version => {
            const el = document.getElementById('app-version');
            if (el) el.textContent = `v${version}`;
        });
        
        window.api.onWindowStateChange(isMaximized => {
            document.body.classList.toggle('windowed-mode', !isMaximized)
        });
    };

    // --- API Listeners ---
    window.api.onTriggerPdfGeneration((passwords, filePath) => {
        const { jsPDF } = window.jspdf;
        const doc = new jsPDF();
        
        const isLightMode = document.body.classList.contains('light-mode');
        const theme = {
            light: { bg: [255, 255, 255], text: [30, 30, 30], subtle: [150, 150, 150], line: [220, 220, 220], cardBg: [240, 240, 240] },
            dark: { bg: [45, 45, 48], text: [212, 212, 212], subtle: [160, 160, 160], line: [68, 68, 68], cardBg: [37, 37, 38] }
        };
        const currentTheme = isLightMode ? theme.light : theme.dark;

        doc.setFillColor(...currentTheme.bg);
        doc.rect(0, 0, doc.internal.pageSize.width, doc.internal.pageSize.height, 'F');
        
        doc.setFontSize(18);
        doc.setTextColor(...currentTheme.text);
        doc.text("Password Vault Export", 14, 22);

        let y = 35;
        const cardMargin = 5;
        const pageMargin = 14;
        const pageBottom = doc.internal.pageSize.height - pageMargin;

        passwords.forEach((p, index) => {
            const cardHeight = 35;
            if (y + cardHeight > pageBottom) {
                doc.addPage();
                doc.setFillColor(...currentTheme.bg);
                doc.rect(0, 0, doc.internal.pageSize.width, doc.internal.pageSize.height, 'F');
                y = pageMargin;
            }
            
            doc.setFillColor(...currentTheme.cardBg);
            doc.setDrawColor(...currentTheme.line);
            doc.roundedRect(pageMargin, y, doc.internal.pageSize.width - (pageMargin * 2), cardHeight, 3, 3, 'FD');

            doc.setTextColor(...currentTheme.text);
            doc.setFont('helvetica', 'bold');
            doc.setFontSize(12);
            doc.text(p.name, pageMargin + 5, y + 10);

            doc.setFont('helvetica', 'normal');
            doc.setFontSize(9);
            doc.setTextColor(...currentTheme.subtle);
            doc.text(p.username, pageMargin + 5, y + 16);
            
            doc.setDrawColor(...currentTheme.line);
            doc.line(pageMargin + 3, y + 20, doc.internal.pageSize.width - pageMargin - 3, y + 20);

            doc.setTextColor(...currentTheme.text);
            doc.setFont('courier', 'normal');
            doc.setFontSize(10);
            doc.text(p.password, pageMargin + 5, y + 27);

            y += cardHeight + cardMargin;
        });
        
        window.api.sendPdfData({ filePath, dataUri: doc.output('datauristring') });
    });

    window.api.onExportSuccess((filePath) => {
        elements.popupOverlay.style.display = 'flex';
        elements.popupShowBtn.onclick = () => window.api.showItemInFolder(filePath);
    });

    initializeApp();
});