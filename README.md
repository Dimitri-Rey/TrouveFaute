# Trouve faute - Extension Chrome

Une extension Chrome pour la correction orthographique qui utilise l'API GPT pour analyser vos textes.

## Fonctionnalités

- 🔍 Analyse orthographique via une fenêtre popup
- ✨ Correction contextuelle par clic droit sur du texte sélectionné
- 💬 Chat intégré pour des corrections instantanées

## Installation

1. Clonez ce dépôt ou téléchargez les fichiers
2. Ouvrez Chrome et allez dans `chrome://extensions/`
3. Activez le "Mode développeur" en haut à droite
4. Cliquez sur "Charger l'extension non empaquetée" et sélectionnez le dossier du projet

## Configuration requise

### Clé API OpenAI

Pour utiliser l'extension, vous devez ajouter votre clé API OpenAI :

1. Obtenez une clé API sur [OpenAI](https://platform.openai.com/api-keys)
2. Ouvrez l'extension
3. Cliquez sur l'icône des paramètres
4. Collez votre clé API dans le champ prévu

## Utilisation

### Mode Popup
1. Cliquez sur l'icône de l'extension
2. Saisissez ou collez votre texte
3. Cliquez sur "Analyser le texte"

### Menu contextuel
1. Sélectionnez du texte sur n'importe quelle page web
2. Clic droit > "Trouve faute" > "Corriger la sélection"

## Remarque

Cette extension nécessite une connexion internet active pour fonctionner car elle utilise l'API OpenAI.

## Confidentialité

Les textes analysés sont envoyés à l'API OpenAI. Veuillez ne pas soumettre d'informations sensibles ou confidentielles. 