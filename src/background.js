// Création du menu contextuel
chrome.runtime.onInstalled.addListener(() => {
  chrome.contextMenus.create({
    id: "analyseTexte",
    title: "Analyser le texte",
    contexts: ["selection"]
  });
});

// Gestion du clic sur le menu contextuel
chrome.contextMenus.onClicked.addListener((info, tab) => {
  if (info.menuItemId === "analyseTexte") {
    chrome.tabs.sendMessage(tab.id, {
      action: "analyseTexte",
      text: info.selectionText
    });
  }
}); 