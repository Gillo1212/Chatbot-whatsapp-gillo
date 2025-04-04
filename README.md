
# Assistant IA WhatsApp avec OpenAI et Firebase
Ce projet implémente un assistant virtuel qui interagit avec les utilisateurs via WhatsApp en utilisant l'API OpenAI (GPT-4) et Firebase pour la persistance des données.

# Fonctionnalités
Réception de messages WhatsApp via Twilio
Génération de réponses intelligentes avec GPT-4 d'OpenAI
Stockage des interactions dans Firebase Firestore
Envoi automatique de rappels aux utilisateurs inactifs

# Prérequis
Node.js v14+ et npm
Compte OpenAI avec clé API
Compte Twilio avec numéro WhatsApp configuré
Projet Firebase avec Firestore configuré

# Installation
Clonez ce dépôt :
Cloner mon projet sur : https://drive.google.com/file/d/1BqYuJJGR1vcZZs2WKGAlmJ3hDtSXlF5h/view?usp=sharing
cd whatsapp-gpt-assistant

# Installer les dépendances :
npm install
Copiez le fichier .env. et remplissez-le avec vos informations

# Configurez vos variables d'environnement dans le fichier.env

1. Configuration de Twilio
Créez un compte Twilio et activez le service WhatsApp Sandbox
Configurez le webhook pour pointer vers votre serveur :https://votre-domaine.com/webhook
Assurez-vous que les méthodes HTTP POST sont prises en charge

2. Configuration de Firebase
Créez un projet Firebase et activez Firestore
Générez une clé privée pour le compte de service Firebase Admin SDK
Ajoutez les détails du compte de service dans votre fichier.env

3. Démarrage du serveur : 
npm start ou node serveur.js
Le serveur démarrera sur le port spécifié dans votre fichier .env(3000 par défaut).

# Architecture du projet
server.js- Point d'entrée principal, configuration du serveur Express
openai.js- Intégration avec l'API OpenAI GPT-4
twilio.js- Intégration avec l'API Twilio pour WhatsApp
firestore.js- Configuration et fonctions pour Firebase Firestore
automation.js- Tâches automatisées (rappels aux utilisateurs inactifs)

# Fonctionnement des automatisations
Le système vérifie toutes les heures les utilisateurs qui n'ont pas interagi depuis plus de 24 heures et leur envoie un message de rappel. Cette fonctionnalité est implémentée dans le fichier automation.js.
# Déploiement
Pour le déploiement en production, vous pouvez utiliser :
Heroku
Google Cloud Run
AWS Elastic Beanstalk
Tout autre service qui supporte Node.js

# A Faire
N'oubliez pas de configurer les variables d'environnement sur votre plateforme de déploiement.
Sécurité
Ne publiez jamais vos clés API ou secrets dans le code source
Utilisez des variables d'environnement pour toutes les informations sensibles
Limitez les autorisations de votre compte de service Firebase

# Licence
ISC