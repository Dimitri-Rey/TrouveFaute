document.addEventListener('DOMContentLoaded', () => {
  const inputText = document.getElementById('inputText');
  const sendBtn = document.getElementById('sendBtn');
  const responseContainer = document.getElementById('responseContainer');

  const API_KEY = 'VOTRE_CLE_API';
  const API_URL = 'URL_DE_VOTRE_API';

  sendBtn.addEventListener('click', async () => {
    const text = inputText.value.trim();
    
    if (!text) {
      responseContainer.innerHTML = '<p class="error">Veuillez entrer du texte</p>';
      return;
    }

    try {
      responseContainer.innerHTML = 'Analyse en cours...';
      sendBtn.disabled = true;

      const response = await fetch(API_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${API_KEY}`
        },
        body: JSON.stringify({
          prompt: text,
          max_tokens: 150
        })
      });

      if (!response.ok) {
        throw new Error('Erreur lors de la requête API');
      }

      const data = await response.json();
      responseContainer.innerHTML = `<p>${data.choices[0].text}</p>`;
    } catch (error) {
      responseContainer.innerHTML = `<p class="error">Erreur: ${error.message}</p>`;
    } finally {
      sendBtn.disabled = false;
    }
  });
}); 