// src/js/rendering/modals.js

// This function handles the generic prompt used for unlock, export, etc.
export function customPrompt(elements, { title, message, errorMessage = '' }) {
    return new Promise((resolve) => {
        // MODIFIED: Destructuring the new close button element
        const { promptOverlay, promptTitle, promptMessage, promptInput, promptConfirmBtn, promptCancelBtn, promptCloseBtn, promptError } = elements;
        
        promptTitle.textContent = title;
        promptMessage.textContent = message;
        promptError.textContent = errorMessage;
        promptInput.value = '';
        
        if (promptOverlay.style.display !== 'flex') {
            promptOverlay.style.display = 'flex';
        }

        setTimeout(() => promptInput.focus(), 50);

        const closePrompt = (value) => {
            promptConfirmBtn.onclick = null;
            promptCancelBtn.onclick = null;
            // MODIFIED: Clear the new close button's listener
            promptCloseBtn.onclick = null;
            promptInput.onkeyup = null;
            promptOverlay.onclick = null;
            
            if (value !== 'error') {
                promptOverlay.style.display = 'none';
            }
            resolve(value);
        };

        promptConfirmBtn.onclick = () => closePrompt(promptInput.value);
        promptCancelBtn.onclick = () => closePrompt(null);
        // MODIFIED: Added a listener for the new close button
        promptCloseBtn.onclick = () => closePrompt(null);
        promptInput.onkeyup = (e) => {
            if (e.key === 'Enter') closePrompt(promptInput.value);
            if (e.key === 'Escape') closePrompt(null);
        };
        promptOverlay.onclick = (e) => {
            if (e.target === promptOverlay) {
                closePrompt(null);
            }
        };
    });
}

// This function sets up listeners for ALL modals that can be closed.
export function setupModalEventListeners(elements) {
    // Success Popup
    if (elements.popupOverlay) {
        elements.popupOverlay.addEventListener('click', (e) => {
            if (e.target === elements.popupOverlay) {
                elements.popupOverlay.style.display = 'none';
            }
        });
    }
    if (elements.popupCloseBtn) {
        elements.popupCloseBtn.addEventListener('click', () => {
            elements.popupOverlay.style.display = 'none';
        });
    }
    
    // Settings Modal
    if (elements.settingsModalOverlay) {
        elements.settingsModalOverlay.addEventListener('click', (e) => {
            if(e.target === elements.settingsModalOverlay) {
                elements.settingsModalOverlay.style.display = 'none';
            }
        });
    }
    if (elements.settingsCloseBtn) {
        elements.settingsCloseBtn.addEventListener('click', () => {
            elements.settingsModalOverlay.style.display = 'none';
        });
    }
}