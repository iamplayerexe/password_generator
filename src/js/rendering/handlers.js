import { customPrompt } from './modals.js';
import * as ui from './ui.js';

// No alert(), handles focus on error.
export async function handleLockUnlockClick(elements, appState, updateAppState) {
    if (appState === 'UNLOCKED') {
        await window.api.lockVault();
        updateAppState('LOCKED');
        return;
    }

    let password = '';
    let result = { success: false, message: '' };

    while (!result.success) {
        password = await customPrompt(elements, {
            title: 'Unlock Vault',
            message: 'Enter your master password.',
            errorMessage: result.message
        });

        if (password === null) return; 

        result = await window.api.unlockVault(password);
    }
    
    const { success, passwords } = await window.api.getSavedPasswords();
    if(success) ui.renderPasswords(elements, passwords);
    updateAppState('UNLOCKED');
}

// Now correctly updates the UI after deletion.
export async function handleDeletePassword(elements, id) {
    const result = await window.api.deletePassword(id);
    if (result && result.success) {
        ui.renderPasswords(elements, result.passwords);
    } else {
        ui.setActionStatus(elements, result.message || 'Failed to delete password.', true);
    }
}

// Uses the correct modal and handles errors.
export async function handleOpenSettings(elements, appState) {
    if (appState !== 'UNLOCKED') {
        ui.setActionStatus(elements, "Please unlock the vault to change settings.", true);
        return;
    }

    const { 
        settingsModalOverlay, oldPasswordInput, newPasswordInput, 
        confirmNewPasswordInput, changePasswordBtn, settingsErrorMessage 
    } = elements;

    // Show the modal
    settingsModalOverlay.style.display = 'flex';
    oldPasswordInput.focus();

    // Clear previous errors
    settingsErrorMessage.textContent = '';

    changePasswordBtn.onclick = async () => {
        const passwords = {
            oldPassword: oldPasswordInput.value,
            newPassword: newPasswordInput.value,
            confirmPassword: confirmNewPasswordInput.value
        };

        const result = await window.api.changePassword(passwords);

        if (result.success) {
            settingsModalOverlay.style.display = 'none';
            ui.setActionStatus(elements, "Master password changed successfully!", false);
            // Clear inputs for next time
            oldPasswordInput.value = '';
            newPasswordInput.value = '';
            confirmNewPasswordInput.value = '';
        } else {
            settingsErrorMessage.textContent = result.message;
        }
    };
}

// --- Other handlers remain the same ---

export async function handleBulkDelete(elements) {
    const selectedCheckboxes = [...document.querySelectorAll('.password-select-checkbox:checked')];
    const idsToDelete = selectedCheckboxes.map(cb => cb.dataset.id);

    if (idsToDelete.length === 0 && ui.getCurrentPasswords().length === 0) {
        ui.setActionStatus(elements, 'Vault is already empty.', true);
        return;
    }

    const isDeletingAll = idsToDelete.length === 0;
    const count = isDeletingAll ? ui.getCurrentPasswords().length : idsToDelete.length;
    
    const confirmationMessage = isDeletingAll 
        ? 'Are you sure you want to delete ALL passwords in the vault? This cannot be undone.'
        : `Are you sure you want to delete the selected ${count} password(s)?`;

    if (!confirm(confirmationMessage)) {
        return;
    }

    const result = await window.api.deletePasswords(idsToDelete);
    if (result && result.success) {
        ui.renderPasswords(elements, result.passwords);
        ui.setActionStatus(elements, `Successfully deleted ${count} item(s).`, false);
    } else {
        ui.setActionStatus(elements, result.message || 'Failed to delete passwords.', true);
    }
}

export function handleSearch(elements) {
    const searchTerm = elements.searchInput.value.toLowerCase().trim();
    const allPasswords = ui.getCurrentPasswords();

    if (!searchTerm) {
        ui.renderPasswords(elements, allPasswords);
        return;
    }

    const filteredPasswords = allPasswords.filter(p => 
        p.name.toLowerCase().includes(searchTerm) || 
        p.username.toLowerCase().includes(searchTerm)
    );
    
    ui.renderPasswords(elements, filteredPasswords, true);
}

export async function handleGeneratePassword(elements) {
    const result = await window.api.generatePassword({ 
        sentence: elements.sentenceInput.value, 
        appName: elements.appNameInput.value, 
        includeSymbols: elements.symbolsCheckbox.checked 
    });
    elements.errorMessageEl.textContent = result.success ? '' : result.message;
    elements.passwordOutput.value = result.success ? result.password : '';
}

export async function handleSavePassword(elements, appState) {
    if (appState !== 'UNLOCKED') {
        ui.setActionStatus(elements, 'Please unlock the vault to save passwords.', true);
        return;
    }
    const { appNameInput, usernameInput, passwordOutput, errorMessageEl } = elements;
    if (!appNameInput.value || !usernameInput.value || !passwordOutput.value) {
        errorMessageEl.textContent = 'App Name, Username, and Password are required to save.';
        return;
    }
    const result = await window.api.savePassword({ name: appNameInput.value, username: usernameInput.value, password: passwordOutput.value });
    if (result.success) {
        errorMessageEl.textContent = '';
        appNameInput.value = '';
        usernameInput.value = '';
        passwordOutput.value = '';
        ui.renderPasswords(elements, result.passwords);
    } else {
        ui.setActionStatus(elements, result.message, true);
    }
}

export async function handleExport(elements) {
    const selectedIds = new Set([...document.querySelectorAll('.password-select-checkbox:checked')].map(cb => cb.dataset.id));
    const allPasswords = ui.getCurrentPasswords();
    
    const passwordsToExport = selectedIds.size > 0 ? allPasswords.filter(p => selectedIds.has(p.id)) : allPasswords;

    if (passwordsToExport.length === 0) {
        ui.setActionStatus(elements, 'No passwords to export.', true);
        return;
    }

    const password = await customPrompt(elements, { title: 'Create Export Password', message: 'Enter a password to encrypt the export file.'});
    if (!password) {
        ui.setActionStatus(elements, 'Export cancelled: No password provided.', true);
        return;
    }
    await window.api.exportPasswords(passwordsToExport, password);
}

export async function handleImport(elements, files) {
    const password = await customPrompt(elements, { title: 'Enter Import Password', message: 'Enter the password for the file(s) you are importing.'});
    if (!password) {
        ui.setActionStatus(elements, 'Import cancelled: No password provided.', true);
        return;
    }
    
    const fileContents = await Promise.all(
        Array.from(files).map(file => file.text())
    );

    const result = await window.api.importPasswords(password, fileContents);
    if (result.success) ui.renderPasswords(elements, result.passwords);
    ui.setActionStatus(elements, result.message, !result.success);
}

export async function handlePdfGeneration(elements) {
    const selectedIds = new Set([...document.querySelectorAll('.password-select-checkbox:checked')].map(cb => cb.dataset.id));
    const passwordsToPrint = selectedIds.size > 0 ? ui.getCurrentPasswords().filter(p => selectedIds.has(p.id)) : ui.getCurrentPasswords();

    if (passwordsToPrint.length === 0) {
        ui.setActionStatus(elements, 'Vault is empty, nothing to generate.', true);
        return;
    }
    await window.api.generatePdf(passwordsToPrint);
}