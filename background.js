chrome.runtime.onInstalled.addListener(() => {
    console.log("GPT-4o Mini Extension installée.");
    
    // Créer l'élément de menu contextuel
    chrome.contextMenus.create({
        id: "checkSpelling",
        title: "Vérifier l'orthographe",
        contexts: ["selection"]
    });
});

// Gérer le clic sur le menu contextuel
chrome.contextMenus.onClicked.addListener((info, tab) => {
    if (info.menuItemId === "checkSpelling") {
        chrome.tabs.sendMessage(tab.id, {
            action: "highlightErrors",
            text: info.selectionText
        });
    }
});

// Gérer les messages du content script
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    if (request.action === "checkText") {
        detectFaults(request.text)
            .then(result => {
                sendResponse({ fautes: result });
            })
            .catch(error => {
                sendResponse({ error: error.message });
            });
        return true; // Important pour l'async
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
                content: "Repère uniquement les fautes dans le texte suivant. Réponds uniquement avec les mots en faute, rien d'autre."
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
  