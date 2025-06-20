import * as handlers from './handlers.js';
import * as ui from './ui.js';

export function setupEventListeners(elements, getAppState, updateAppState) {
    // Defensive checks on ALL event listeners
    if (elements.lockVaultBtn) {
        elements.lockVaultBtn.addEventListener('click', () => handlers.handleLockUnlockClick(elements, getAppState(), updateAppState));
    }
    if (elements.generateBtn) {
        elements.generateBtn.addEventListener('click', () => handlers.handleGeneratePassword(elements));
    }
    if (elements.savePasswordBtn) {
        elements.savePasswordBtn.addEventListener('click', () => handlers.handleSavePassword(elements, getAppState()));
    }
    if (elements.copyBtn) {
        elements.copyBtn.addEventListener('click', () => ui.copyToClipboard(elements.passwordOutput.value, elements.copyBtn));
    }
    if (elements.settingsBtn) {
        elements.settingsBtn.addEventListener('click', () => handlers.handleOpenSettings(elements, getAppState()));
    }
    if (elements.exportSelectedBtn) {
        elements.exportSelectedBtn.addEventListener('click', () => handlers.handleExport(elements));
    }
    if (elements.deleteSelectedBtn) {
        elements.deleteSelectedBtn.addEventListener('click', () => handlers.handleBulkDelete(elements));
    }
    if (elements.pdfBtn) {
        elements.pdfBtn.addEventListener('click', () => handlers.handlePdfGeneration(elements));
    }
    if (elements.unselectAllBtn) {
        // RE-IMPLEMENTED: This button now intelligently toggles between selecting all and unselecting all.
        elements.unselectAllBtn.addEventListener('click', () => {
            const checkboxes = document.querySelectorAll('.password-select-checkbox');
            const isAnySelected = [...checkboxes].some(cb => cb.checked);
            checkboxes.forEach(cb => cb.checked = !isAnySelected);
            ui.updateSelectionDependentButtons(elements);
        });
    }
    if (elements.searchInput) {
        elements.searchInput.addEventListener('input', () => handlers.handleSearch(elements));
    }
    if (elements.importBtn) {
        elements.importBtn.addEventListener('click', () => {
            if (getAppState() !== 'UNLOCKED') {
                ui.setActionStatus(elements, 'Please unlock the vault to import.', true);
                return;
            }
            const fileInput = document.createElement('input');
            fileInput.type = 'file';
            fileInput.multiple = true;
            fileInput.accept = '.dat';
            fileInput.onchange = (e) => handlers.handleImport(elements, e.target.files);
            fileInput.click();
        });
    }
    if (elements.savedPasswordsList) {
        elements.savedPasswordsList.addEventListener('click', (e) => {
            const target = e.target;
            if (target.classList.contains('delete-btn')) {
                const id = target.closest('.password-item').dataset.id;
                handlers.handleDeletePassword(elements, id);
            } else if (target.classList.contains('toggle-vis-btn')) {
                const passValueEl = target.previousElementSibling;
                const isVisible = passValueEl.dataset.visible === 'true';
                const password = ui.getCurrentPasswords().find(p => p.id === target.closest('.password-item').dataset.id)?.password;
                passValueEl.textContent = isVisible ? '••••••••••••' : password;
                target.textContent = isVisible ? 'Show' : 'Hide';
                passValueEl.dataset.visible = !isVisible;
            } else if (target.classList.contains('copy-username-btn')) {
                const username = target.closest('.password-item').querySelector('.password-item-username').textContent;
                ui.copyToClipboard(username, target);
            } else if (target.classList.contains('copy-password-btn')) {
                const password = ui.getCurrentPasswords().find(p => p.id === target.closest('.password-item').dataset.id)?.password;
                ui.copyToClipboard(password, target);
            }
        });

        elements.savedPasswordsList.addEventListener('change', (e) => {
            if (e.target.classList.contains('password-select-checkbox')) {
                ui.updateSelectionDependentButtons(elements);
            }
        });
    }

    // --- Theme and Window Controls ---
    const themeToggleBtn = document.getElementById('theme-toggle');
    if (themeToggleBtn) {
        const applyTheme = (theme) => document.body.classList.toggle('light-mode', theme === 'light');
        applyTheme(localStorage.getItem('theme') || 'dark');
        themeToggleBtn.addEventListener('click', () => {
            const newTheme = document.body.classList.contains('light-mode') ? 'dark' : 'light';
            localStorage.setItem('theme', newTheme);
            applyTheme(newTheme);
        });
    }
    const minimizeBtn = document.getElementById('minimize-btn');
    if (minimizeBtn) minimizeBtn.addEventListener('click', () => window.api.windowControls.minimize());

    const maximizeBtn = document.getElementById('maximize-btn');
    if (maximizeBtn) maximizeBtn.addEventListener('click', () => window.api.windowControls.toggleMaximize());

    const closeBtn = document.getElementById('close-btn');
    if (closeBtn) closeBtn.addEventListener('click', () => window.api.windowControls.close());
}