let lastSelectedText = '';

// Créer un indicateur de statut flottant
function showStatus(message, type = 'loading') {
    removeStatus();
    
    const status = document.createElement('div');
    status.id = 'voltaire-status';
    status.className = `voltaire-status ${type}`;
    
    status.innerHTML = `
        <div class="voltaire-status-content">
            ${type === 'loading' ? '<div class="voltaire-spinner"></div>' : ''}
            ${type === 'success' ? '<i class="fas fa-check-circle"></i>' : ''}
            ${type === 'error' ? '<i class="fas fa-exclamation-circle"></i>' : ''}
            ${message}
        </div>
    `;
    
    document.body.appendChild(status);
}

function removeStatus() {
    const status = document.getElementById('voltaire-status');
    if (status) {
        status.remove();
    }
}

// Gérer le clic droit
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    if (request.action === "highlightErrors") {
        showStatus('Analyse en cours...', 'loading');
        
        chrome.runtime.sendMessage(
            { action: "checkText", text: request.text },
            (response) => {
                if (chrome.runtime.lastError) {
                    showStatus('Erreur : ' + chrome.runtime.lastError.message, 'error');
                    return;
                }
                
                if (response && response.fautes) {
                    const fautesList = response.fautes.split(',').map(f => f.trim()).filter(f => f);
                    if (fautesList.length > 0) {
                        showStatus(`Fautes trouvées : ${fautesList.join(', ')}`, 'error');
                    } else {
                        showStatus('Texte correct !', 'success');
                    }
                }
            }
        );
    }
    return true;
});

function highlightErrors(text, fautes) {
    try {
        const selection = window.getSelection();
        const range = selection.getRangeAt(0);
        
        // Créer un conteneur pour le texte
        const container = document.createElement('span');
        container.className = 'voltaire-container';
        
        // Remplacer le texte avec les mots surlignés
        let htmlContent = text;
        fautes.forEach(faute => {
            const regex = new RegExp(`\\b${faute}\\b`, 'gi');
            htmlContent = htmlContent.replace(regex, `<span class="voltaire-error-glow">$&</span>`);
        });
        
        container.innerHTML = htmlContent;
        
        // Remplacer le contenu sélectionné
        range.deleteContents();
        range.insertNode(container);
        
        // Scroll vers la première erreur
        const firstError = container.querySelector('.voltaire-error-glow');
        if (firstError) {
            setTimeout(() => {
                firstError.scrollIntoView({ behavior: 'smooth', block: 'center' });
            }, 100);
        }
    } catch (error) {
        console.debug('Impossible de surligner le texte');
        return;
    }
}

// Écouter les messages du background script
chrome.runtime.onMessage.addListener(async (request, sender, sendResponse) => {
    if (request.action === "highlightErrors") {
        try {
            const response = await chrome.runtime.sendMessage({
                action: "checkText",
                text: request.text
            });
            
            if (response && response.fautes) {
                highlightErrors(request.text, response.fautes);
            }
        } catch (error) {
            console.error('Erreur:', error);
        }
    }
});

function showSuggestions(element) {
    const error = element.dataset.error;
    const rect = element.getBoundingClientRect();
    
    const suggestions = document.createElement('div');
    suggestions.className = 'voltaire-suggestions';
    suggestions.style.top = `${rect.bottom + window.scrollY + 5}px`;
    suggestions.style.left = `${rect.left + window.scrollX}px`;
    
    suggestions.innerHTML = `
        <div class="voltaire-error-msg">
            <i class="fas fa-exclamation-triangle"></i>
            Erreur : "${error}"
        </div>
    `;
    
    document.body.appendChild(suggestions);
    
    // Fermer les suggestions au clic ailleurs
    document.addEventListener('click', removeSuggestions);
}

function removeSuggestions() {
    const suggestions = document.querySelector('.voltaire-suggestions');
    if (suggestions) {
        suggestions.remove();
    }
    document.removeEventListener('click', removeSuggestions);
}

// Ajouter Font Awesome
if (!document.querySelector('link[href*="font-awesome"]')) {
    const link = document.createElement('link');
    link.rel = 'stylesheet';
    link.href = 'https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0/css/all.min.css';
    document.head.appendChild(link);
} 