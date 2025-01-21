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
      <button class="voltaire-close" onclick="this.closest('.voltaire-overlay').remove()">×</button>
    </div>
    <div class="voltaire-text"></div>
  `;
  
  overlay.appendChild(content);
  document.body.appendChild(overlay);
  return overlay;
}

// Configuration de l'API OpenAI
const apiUrl = "https://api.openai.com/v1/completions";
const apiKey = "sk-XXXXXXXXXXXXXXXXXXXXXXXXXXXX"; // Remplacez par votre clé API

// Fonction pour appeler l'API OpenAI
async function callOpenAI(text) {
  try {
    const response = await fetch(apiUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${apiKey}`
      },
      body: JSON.stringify({
        model: "gpt-4o-mini",
        prompt: `Analyse cette phrase et retourne uniquement les mots mal orthographiés ou les erreurs grammaticales, séparés par des virgules: "${text}"`,
        max_tokens: 100,
        temperature: 0.7
      })
    });

    if (!response.ok) {
      throw new Error(`Erreur ${response.status}: ${response.statusText}`);
    }

    const data = await response.json();
    return data.choices[0].text.trim();
  } catch (error) {
    console.error("Erreur lors de l'appel à l'API :", error);
    throw error;
  }
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
    const textContainer = overlay.querySelector('.voltaire-text');
    
    try {
      textContainer.innerHTML = "Analyse en cours...";
      
      // Appel à l'API OpenAI
      const erreurs = await callOpenAI(request.text);
      
      // Mise en évidence des erreurs dans le texte
      let textHTML = request.text;
      const erreursMots = erreurs.split(',').map(e => e.trim());
      
      erreursMots.forEach(mot => {
        if (mot) {
          const regex = new RegExp(`\\b${mot}\\b`, 'gi');
          textHTML = textHTML.replace(regex, `<span class="voltaire-erreur" onclick="window.open('https://www.reverso.net/orthographe/correcteur-francais/?text=${encodeURIComponent(mot)}', '_blank')">${mot}</span>`);
        }
      });
      
      textContainer.innerHTML = textHTML;
    } catch (error) {
      textContainer.innerHTML = `<p class="error">Erreur: ${error.message}</p>`;
    }
  }
}); 