// src/js/rendering/events.js
import * as handlers from './handlers.js';
import * as ui from './ui.js';

export function setupEventListeners(elements, getAppState, updateAppState) {
    elements.lockVaultBtn?.addEventListener('click', () => handlers.handleLockUnlockClick(elements, getAppState(), updateAppState));
    elements.generateBtn?.addEventListener('click', () => handlers.handleGeneratePassword(elements));
    elements.savePasswordBtn?.addEventListener('click', () => handlers.handleSavePassword(elements, getAppState()));
    elements.copyBtn?.addEventListener('click', () => ui.copyToClipboard(elements.passwordOutput.value, elements.copyBtn));
    
    elements.toggleGeneratedVisBtn?.addEventListener('click', () => {
        const isPassword = elements.passwordOutput.type === 'password';
        elements.passwordOutput.type = isPassword ? 'text' : 'password';
        elements.toggleGeneratedVisBtn.textContent = isPassword ? 'Hide' : 'Show';
    });

    elements.settingsBtn?.addEventListener('click', () => handlers.handleOpenSettings(elements, getAppState()));
    elements.exportSelectedBtn?.addEventListener('click', () => handlers.handleExport(elements));
    elements.deleteSelectedBtn?.addEventListener('click', () => handlers.handleBulkDelete(elements));
    elements.pdfBtn?.addEventListener('click', () => handlers.handlePdfGeneration(elements));
    elements.unselectAllBtn?.addEventListener('click', () => {
        const checkboxes = document.querySelectorAll('.password-select-checkbox');
        const isAnySelected = [...checkboxes].some(cb => cb.checked);
        checkboxes.forEach(cb => cb.checked = !isAnySelected);
        ui.updateSelectionDependentButtons(elements);
    });
    elements.searchInput?.addEventListener('input', () => handlers.handleSearch(elements));
    elements.importBtn?.addEventListener('click', () => {
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
    elements.savedPasswordsList?.addEventListener('click', (e) => {
        const target = e.target;
        if (target.classList.contains('delete-btn')) {
            const id = target.closest('.password-item').dataset.id;
            handlers.handleDeletePassword(elements, id);
        } else if (target.classList.contains('toggle-vis-btn')) {
            const passValueEl = target.closest('.password-value-container').querySelector('.password-item-value');
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

    elements.savedPasswordsList?.addEventListener('change', (e) => {
        if (e.target.classList.contains('password-select-checkbox')) {
            ui.updateSelectionDependentButtons(elements);
        }
    });
}