# Coton Football Club - Site Web Officiel

Ce projet est une refonte du site web officiel du Coton Football Club, club de football béninois triple champion national et participant régulier aux compétitions africaines.

## Caractéristiques

- Design moderne et responsive inspiré des sites des grands clubs européens
- Présentation dynamique des matchs à venir et des résultats
- Section dédiée à l'équipe avec filtres par poste
- Actualités du club avec mise en page attractive
- Présentation du stade et des infrastructures
- Section partenaires
- Intégration complète des réseaux sociaux
- Billetterie en ligne

## Technologies utilisées

- HTML5, CSS3, JavaScript
- Bootstrap 5
- jQuery
- Webpack (pour le build)

## Structure du projet

```
cotonfc/
├── public/              # Fichiers statiques
│   ├── index.html       # Page d'accueil
│   ├── assets/
│   │   ├── css/         # Feuilles de style
│   │   ├── js/          # Scripts JavaScript
│   │   └── images/      # Images et ressources
├── package.json         # Configuration npm
└── README.md            # Documentation
```

## Installation

1. Cloner le dépôt
```bash
git clone https://github.com/flori92/cotonfc.git
cd cotonfc
```

2. Installer les dépendances
```bash
npm install
```

3. Lancer le serveur de développement
```bash
npm start
```

## Déploiement

Le site peut être déployé sur n'importe quel service d'hébergement statique comme Netlify, Vercel, GitHub Pages, ou AWS S3 + CloudFront.

### Déploiement sur Netlify

1. Créer un compte sur [Netlify](https://www.netlify.com/)
2. Connecter votre compte GitHub
3. Sélectionner le dépôt `cotonfc`
4. Configurer les paramètres de build:
   - Build command: `npm run build`
   - Publish directory: `public`
5. Cliquer sur "Deploy site"

## Personnalisation

### Couleurs et thème

Les couleurs principales du site sont définies dans le fichier `public/assets/css/style.css` avec des variables CSS:

```css
:root {
    --primary-color: #c91c20; /* Rouge Coton FC */
    --secondary-color: #ffffff; /* Blanc */
    /* ... autres couleurs ... */
}
```

### Images

Remplacer les images dans le dossier `public/assets/images/` par les images officielles du club:
- Logo: `logo.png`
- Joueurs: `players/player1.jpg`, `players/player2.jpg`, etc.
- Actualités: `news/news1.jpg`, `news/news2.jpg`, etc.
- Bannière: `hero-bg.jpg`
- Stade: `stadium.jpg`

## Maintenance

Pour ajouter de nouveaux contenus:
- **Matchs**: Mettre à jour la section correspondante dans `index.html`
- **Joueurs**: Ajouter de nouvelles cartes joueur dans la section équipe
- **Actualités**: Ajouter de nouveaux articles dans la section actualités

## Licence

Tous droits réservés © Coton Football Club 2025
