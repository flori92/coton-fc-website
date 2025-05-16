# Boutique en ligne Coton Sport

Cette section contient le code source de la boutique en ligne officielle de Coton Sport.

## Fichiers importants

- `boutique.html` - Page principale de la boutique
- `assets/js/shop.js` - Logique JavaScript de la boutique
- `assets/css/derives.css` - Styles pour les produits dérivés
- `assets/css/boutique.css` - Styles spécifiques à la boutique

## Fonctionnalités implémentées

### 1. Affichage des maillots
- Maillots domicile, extérieur et third de la saison 2024-2025
- Filtrage par catégorie (Coton FC / Elan Coton BC)
- Affichage des prix, tailles et couleurs disponibles

### 2. Panier d'achat
- Ajout/retrait de produits
- Calcul du total
- Gestion des quantités

### 3. Personnalisation
- Personnalisation des maillots avec nom et numéro
- Prévisualisation en temps réel

## Images requises

Les images suivantes doivent être placées dans le dossier `assets/images/boutique/` :

- `maillot-domicile-2025.jpg`
- `maillot-exterieur-2025.jpg`
- `maillot-third-2025.jpg`
- `maillot-elan-home-2025.jpg`

## Intégration du paiement

La boutique utilise KKiaPay pour le traitement des paiements en ligne. La configuration est déjà en place dans le fichier `boutique.html`.

## Développement

Pour ajouter de nouveaux produits, mettez à jour le tableau `productsData.jerseys` dans `shop.js` avec les informations du produit.

## Prochaines étapes

1. Ajouter plus de produits (survêtements, accessoires)
2. Implémenter la recherche de produits
3. Ajouter des filtres avancés (taille, couleur, prix)
4. Intégrer un système de gestion des stocks en temps réel
