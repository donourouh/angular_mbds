# Application de Gestion des Devoirs

## Description
Cette application web développée avec Angular permet de gérer les devoirs et les assignments dans un contexte éducatif. Elle offre une interface moderne et intuitive pour les enseignants et les étudiants.

## Fonctionnalités Principales

### Gestion des Devoirs
- Création de nouveaux devoirs avec dates de rendu
- Modification des devoirs existants
- Suppression des devoirs
- Consultation détaillée des devoirs
- Marquage des devoirs comme rendus/non rendus
- Attribution de notes et remarques

### Tableau de Bord et Statistiques
- Vue d'ensemble des devoirs
- Statistiques en temps réel
- Graphiques de répartition par matière
- Suivi des devoirs rendus/non rendus
- Calcul de la moyenne générale

### Système d'Authentification
- Connexion sécurisée
- Gestion des rôles (professeurs/étudiants)
- Protection des routes
- Tokens JWT pour la sécurité

## Technologies Utilisées
- Frontend : Angular 17
- Backend : Node.js avec Express
- Base de données : MongoDB
- UI/UX : Angular Material
- Graphiques : Chart.js

## Installation

### Prérequis
- Node.js (v20.16.0 ou supérieur)
- Angular CLI
- MongoDB

### Étapes d'Installation

1. Cloner le repository :
\`\`\`bash
git clone [URL_DU_REPO]
\`\`\`

2. Installer les dépendances du Frontend :
\`\`\`bash
cd Front
npm install
\`\`\`

3. Installer les dépendances du Backend :
\`\`\`bash
cd Back
npm install
\`\`\`

4. Configuration :
- Créer un fichier .env dans le dossier Back
- Ajouter les variables d'environnement nécessaires :
\`\`\`
PORT=8010
MONGODB_URI=votre_uri_mongodb
JWT_SECRET=votre_secret_jwt
\`\`\`

## Lancement de l'Application

1. Démarrer le serveur Backend :
\`\`\`bash
cd Back
npm start
\`\`\`

2. Démarrer le Frontend :
\`\`\`bash
cd Front
ng serve
\`\`\`

L'application sera accessible à l'adresse : http://localhost:4200

## Structure du Projet

### Frontend (Angular)
- `src/app/assignments` : Composants de gestion des devoirs
- `src/app/shared` : Services et modèles partagés
- `src/app/auth` : Composants d'authentification
- `src/app/stats` : Composants des statistiques

### Backend (Node.js)
- `routes/` : Définition des routes API
- `models/` : Modèles de données MongoDB
- `middleware/` : Middlewares d'authentification et de validation

## Fonctionnalités Détaillées

### Gestion des Matières
- Association des devoirs à des matières spécifiques
- Images personnalisées pour chaque matière
- Attribution des professeurs aux matières

### Système de Notation
- Notes sur 20
- Commentaires et remarques
- Historique des modifications

### Interface Utilisateur
- Design responsive
- Thème personnalisé
- Animations fluides
- Messages de confirmation
- Gestion des erreurs

## Contribution
Les contributions sont les bienvenues ! N'hésitez pas à :
- Signaler des bugs
- Proposer des nouvelles fonctionnalités
- Améliorer la documentation
- Soumettre des pull requests

## Auteur
KINDO Bamba

## Licence
Ce projet est sous licence MIT. 