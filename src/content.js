// Création de l'overlay pour l'analyse
function createAnalyseOverlay(text, position) {
  const overlay = document.createElement('div');
  overlay.className = 'voltaire-overlay';
  overlay.style.left = `${position.x}px`;
  overlay.style.top = `${position.y}px`;
  
  const content = document.createElement('div');
  content.className = 'voltaire-content';
  content.innerHTML = `
    <div class="voltaire-header">
      <span>Analyse de texte</span>
      <button class="voltaire-close">×</button>
    </div>
    <div class="voltaire-text"></div>
  `;
  
  overlay.appendChild(content);
  document.body.appendChild(overlay);
  return overlay;
}

// Gestion des messages depuis le background
chrome.runtime.onMessage.addListener(async (request, sender, sendResponse) => {
  if (request.action === "analyseTexte") {
    const selection = window.getSelection();
    const range = selection.getRangeAt(0);
    const rect = range.getBoundingClientRect();
    
    // Position de l'overlay
    const position = {
      x: rect.left + window.scrollX,
      y: rect.top + window.scrollY - 10
    };
    
    // Création de l'overlay
    const overlay = createAnalyseOverlay(request.text, position);
    
    try {
      // Appel à l'API GPT
      const response = await fetch('URL_DE_VOTRE_API', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer VOTRE_CLE_API`
        },
        body: JSON.stringify({
          prompt: `Analyse cette phrase et indique uniquement les erreurs grammaticales ou orthographiques: "${request.text}"`,
          max_tokens: 150
        })
      });
      
      const data = await response.json();
      const erreurs = data.choices[0].text;
      
      // Mise en évidence des erreurs dans le texte
      let textHTML = request.text;
      const erreursMots = erreurs.split(',').map(e => e.trim());
      
      erreursMots.forEach(mot => {
        if (mot) {
          const regex = new RegExp(`\\b${mot}\\b`, 'gi');
          textHTML = textHTML.replace(regex, `<span class="voltaire-erreur" onclick="window.open('https://www.reverso.net/orthographe/correcteur-francais/?text=${encodeURIComponent(mot)}', '_blank')">${mot}</span>`);
        }
      });
      
      overlay.querySelector('.voltaire-text').innerHTML = textHTML;
    } catch (error) {
      overlay.querySelector('.voltaire-text').innerHTML = "Une erreur est survenue lors de l'analyse.";
    }
  }
}); 