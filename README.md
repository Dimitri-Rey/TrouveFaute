# Assistant Voltaire GPT - Extension Chrome

Une extension Chrome qui utilise l'API GPT pour améliorer votre français, parfaite pour les utilisateurs du Projet Voltaire.

## 🌟 Fonctionnalités

- Analyse de texte en temps réel
- Suggestions d'amélioration grammaticale et orthographique
- Interface simple et intuitive
- Intégration transparente avec Chrome

## 📁 Structure du Projet 

## 📥 Installation de l'extension

1. **Téléchargez les fichiers**
   - Clonez ce repository ou téléchargez-le en ZIP
   ```bash
   git clone https://github.com/votre-username/assistant-voltaire-gpt.git
   ```

2. **Ouvrez Chrome**
   - Tapez `chrome://extensions/` dans la barre d'adresse
   - Ou allez dans Menu (⋮) > Plus d'outils > Extensions

3. **Activez le mode développeur**
   - Activez le bouton "Mode développeur" en haut à droite

4. **Chargez l'extension**
   - Cliquez sur "Charger l'extension non empaquetée"
   - Sélectionnez le dossier contenant votre extension

5. **Configuration de l'API**
   - Ouvrez le fichier `src/content.js`
   - Remplacez `URL_DE_VOTRE_API` par l'URL de votre API GPT
   - Remplacez `VOTRE_CLE_API` par votre clé API

## 🎯 Utilisation

1. Sélectionnez du texte sur n'importe quelle page web
2. Faites un clic droit sur la sélection
3. Choisissez "Analyser le texte"
4. Un overlay apparaîtra avec l'analyse
5. Cliquez sur les mots soulignés pour voir les détails sur Reverso

## 🔄 Mise à jour de l'extension

1. Modifiez les fichiers source
2. Retournez dans `chrome://extensions/`
3. Cliquez sur l'icône de rechargement ↻ sur la carte de l'extension

## ⚠️ Dépannage

Si l'extension ne fonctionne pas :
1. Vérifiez que le mode développeur est activé
2. Assurez-vous que l'API key est correctement configurée
3. Consultez la console (clic droit > Inspecter sur l'icône de l'extension)
4. Réinstallez l'extension si nécessaire 