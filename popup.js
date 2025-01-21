document.getElementById("analyzeBtn").addEventListener("click", async () => {
    const inputText = document.getElementById("inputText").value;
    const loadingElement = document.getElementById("loading");
    const responseElement = document.getElementById("responseText");
    const analyzeBtn = document.getElementById("analyzeBtn");
  
    if (!inputText) {
      responseElement.innerHTML = `
        <div class="error-msg">
          <i class="fas fa-exclamation-circle"></i>
          Veuillez entrer un texte à analyser
        </div>`;
      return;
    }
  
    try {
      analyzeBtn.disabled = true;
      loadingElement.style.display = "flex";
      responseElement.textContent = "";
      
      const result = await detectFaults(inputText);
      
      responseElement.classList.add('fade');
      
      if (result && result.trim()) {
        const fautes = result.split(',').map(f => f.trim()).filter(f => f);
        responseElement.innerHTML = `
          <div class="error-msg">
            <i class="fas fa-exclamation-triangle"></i>
            Fautes détectées :
          </div>
          <div class="error-chips">
            ${fautes.map(faute => `
              <span class="error-chip">
                <i class="fas fa-times-circle fa-xs"></i>
                ${faute}
              </span>
            `).join('')}
          </div>`;
      } else {
        responseElement.innerHTML = `
          <div class="success-msg">
            <i class="fas fa-check-circle"></i>
            Aucune faute détectée
          </div>`;
      }
    } catch (error) {
      responseElement.innerHTML = `
        <div class="error-msg">
          <i class="fas fa-exclamation-circle"></i>
          ${error.message}
        </div>`;
    } finally {
      loadingElement.style.display = "none";
      analyzeBtn.disabled = false;
      
      setTimeout(() => {
        responseElement.classList.remove('fade');
      }, 200);
    }
});

const apiKey = "";
const url = "https://api.openai.com/v1/chat/completions";

async function detectFaults(inputText) {
  const requestBody = {
    model: "gpt-4o-mini",
    messages: [
      {
        role: "system",
        content: "Repère uniquement les fautes dans le texte suivant. Réponds uniquement avec les mots en faute, rien d’autre."
      },
      {
        role: "user",
        content: inputText
      }
    ],
    max_tokens: 50
  };

  try {
    const response = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${apiKey}`
      },
      body: JSON.stringify(requestBody)
    });

    if (response.ok) {
      const data = await response.json();
      return data.choices[0].message.content;
    } else {
      throw new Error(`Erreur API : ${response.status}`);
    }
  } catch (error) {
    throw new Error(`Erreur de connexion : ${error.message}`);
  }
}
  