const unlockedIcon = `<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="icon"><rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect><path d="M7 11V7a5 5 0 0 1 9.9-1"></path></svg>`;
const lockedIcon = `<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="icon"><rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect><path d="M7 11V7a5 5 0 0 1 10 0v4"></path></svg>`;

let currentPasswords = [];

export function updateUIForState(elements, appState) {
    const isUnlocked = appState === 'UNLOCKED';
    
    if (elements.vaultControls) elements.vaultControls.style.display = isUnlocked ? 'flex' : 'none';
    if (elements.settingsBtn) elements.settingsBtn.style.display = isUnlocked ? 'flex' : 'none';
    if (elements.lockVaultBtn) {
        elements.lockVaultBtn.innerHTML = isUnlocked ? unlockedIcon : lockedIcon;
        elements.lockVaultBtn.title = isUnlocked ? 'Lock Vault' : 'Unlock Vault';
    }
    
    if (elements.searchInput) {
        if (!isUnlocked) {
            if (elements.savedPasswordsList) elements.savedPasswordsList.innerHTML = `<p class="no-passwords-message">Vault is locked.</p>`;
            elements.searchInput.style.display = 'none';
        } else {
            elements.searchInput.style.display = 'block';
        }
    }
}

export function renderPasswords(elements, passwordsToRender, isSearchResult = false) {
    if (!isSearchResult) {
        currentPasswords = passwordsToRender.sort((a, b) => a.name.localeCompare(b.name));
    }
    
    if (!elements.savedPasswordsList) return;
    
    elements.savedPasswordsList.innerHTML = '';
    
    const listToRender = isSearchResult ? passwordsToRender : currentPasswords;

    if (!listToRender || listToRender.length === 0) {
        const searchTerm = elements.searchInput ? elements.searchInput.value : '';
        if (searchTerm) {
            elements.savedPasswordsList.innerHTML = `<p class="no-passwords-message">No passwords match your search.</p>`;
        } else {
            elements.savedPasswordsList.innerHTML = `<p class="no-passwords-message">Your vault is empty.</p>`;
        }
    } else {
        listToRender.forEach(p => {
            const item = document.createElement('div');
            item.className = 'password-item';
            item.dataset.id = p.id;
            item.innerHTML = `
                <div class="password-item-header">
                    <label class="password-item-name"><input type="checkbox" class="password-select-checkbox" data-id="${p.id}" /> ${p.name}</label>
                </div>
                <p class="password-item-username">${p.username}</p>
                <div class="password-value-container">
                    <span class="password-item-value" data-visible="false">••••••••••••</span>
                    <button class="action-btn toggle-vis-btn">Show</button>
                </div>
                <div class="password-item-actions">
                    <button class="action-btn copy-username-btn">Copy User</button>
                    <button class="action-btn copy-password-btn">Copy Pass</button>
                    <button class="action-btn delete-btn">Delete</button>
                </div>
            `;
            elements.savedPasswordsList.appendChild(item);
        });
    }
    // FIXED: Call the function directly as it's in the same file.
    updateSelectionDependentButtons(elements);
}

export function updateSelectionDependentButtons(elements) {
    const count = document.querySelectorAll('.password-select-checkbox:checked').length;
    
    if (elements.exportSelectedBtn) {
        elements.exportSelectedBtn.textContent = count > 0 ? `Export Selected (${count})` : 'Export All';
    }
    if (elements.deleteSelectedBtn) {
        elements.deleteSelectedBtn.textContent = count > 0 ? `Delete Selected (${count})` : 'Delete All';
    }
    if (elements.pdfBtn) {
        elements.pdfBtn.textContent = count > 0 ? `PDF Selected (${count})` : 'PDF All';
    }
    if (elements.unselectAllBtn) {
        elements.unselectAllBtn.textContent = count > 0 ? `Unselect (${count})` : 'Select All';
    }
}

export function copyToClipboard(text, button) {
    if (!text) return;
    navigator.clipboard.writeText(text).then(() => {
        const originalText = button.textContent;
        button.textContent = 'Copied!';
        setTimeout(() => { button.textContent = originalText; }, 1500);
    });
}

export function setActionStatus(elements, message, isError = false) {
    if (elements.vaultActionStatus) {
        elements.vaultActionStatus.textContent = message;
        elements.vaultActionStatus.style.color = isError ? 'var(--error-text-color)' : '#2ecc71';
        setTimeout(() => {
            if(elements.vaultActionStatus) {
                elements.vaultActionStatus.textContent = '';
            }
        }, 4000);
    }
}

export function getCurrentPasswords() {
    return currentPasswords;
}