/**
 * Script pour la boutique en ligne de Coton Sport
 * Gestion des produits, du panier et de la personnalisation
 * @author Coton Sport
 */

// Initialisation au chargement de la page
document.addEventListener('DOMContentLoaded', function() {
    // Initialisation de Lenis pour le smooth scroll
    initLenisScroll();
    
    // Chargement des produits
    loadNewProducts();
    loadJerseys('football'); // Par défaut, on affiche les maillots de football
    loadPopularProducts('all');
    
    // Initialisation du panier
    initCart();
    
    // Initialisation de la personnalisation
    initCustomization();
});

/**
 * Données des produits (simulation d'une API)
 * Dans une version réelle, ces données viendraient d'une API ou d'une base de données
 */
const products = {
    // Maillots de football
    footballJerseys: [
        {
            id: 'cfcj-1',
            name: 'Maillot Domicile Coton FC 2024-2025',
            category: 'Maillots',
            price: 20000,
            oldPrice: 25000,
            image: 'assets/images/boutique/maillot-domicile.jpg',
            badge: 'new',
            team: 'football',
            type: 'home',
            inStock: true
        },
        {
            id: 'cfcj-2',
            name: 'Maillot Extérieur Coton FC 2024-2025',
            category: 'Maillots',
            price: 20000,
            oldPrice: null,
            image: 'assets/images/boutique/maillot-exterieur.jpg',
            badge: 'new',
            team: 'football',
            type: 'away',
            inStock: true
        },
        {
            id: 'cfcj-3',
            name: 'Maillot Third Coton FC 2024-2025',
            category: 'Maillots',
            price: 20000,
            oldPrice: null,
            image: 'assets/images/boutique/maillot-third.jpg',
            badge: null,
            team: 'football',
            type: 'third',
            inStock: true
        },
        {
            id: 'cfcj-4',
            name: 'Maillot Gardien Coton FC 2024-2025',
            category: 'Maillots',
            price: 22000,
            oldPrice: null,
            image: 'assets/images/boutique/maillot-gardien.jpg',
            badge: null,
            team: 'football',
            type: 'goalkeeper',
            inStock: true
        }
    ],
    
    // Maillots de basketball
    basketballJerseys: [
        {
            id: 'ecbj-1',
            name: 'Maillot Domicile Elan Coton BC 2024-2025',
            category: 'Maillots',
            price: 18000,
            oldPrice: null,
            image: 'assets/images/boutique/maillot-basket-domicile.jpg',
            badge: 'new',
            team: 'basketball',
            type: 'home',
            inStock: true
        },
        {
            id: 'ecbj-2',
            name: 'Maillot Extérieur Elan Coton BC 2024-2025',
            category: 'Maillots',
            price: 18000,
            oldPrice: null,
            image: 'assets/images/boutique/maillot-basket-exterieur.jpg',
            badge: 'new',
            team: 'basketball',
            type: 'away',
            inStock: true
        }
    ],
    
    // Produits d'entraînement
    training: [
        {
            id: 'tr-1',
            name: 'Survêtement Coton FC 2024-2025',
            category: 'Training',
            price: 30000,
            oldPrice: null,
            image: 'assets/images/boutique/survetement.jpg',
            badge: null,
            team: 'football',
            inStock: true
        },
        {
            id: 'tr-2',
            name: 'Maillot d\'Entraînement Coton FC',
            category: 'Training',
            price: 15000,
            oldPrice: 18000,
            image: 'assets/images/boutique/maillot-entrainement.jpg',
            badge: 'sale',
            team: 'football',
            inStock: true
        },
        {
            id: 'tr-3',
            name: 'Short d\'Entraînement Coton FC',
            category: 'Training',
            price: 12000,
            oldPrice: null,
            image: 'assets/images/boutique/short-entrainement.jpg',
            badge: null,
            team: 'football',
            inStock: true
        },
        {
            id: 'tr-4',
            name: 'Veste de Présentation Coton FC',
            category: 'Training',
            price: 25000,
            oldPrice: null,
            image: 'assets/images/boutique/veste-presentation.jpg',
            badge: 'new',
            team: 'football',
            inStock: true
        }
    ],
    
    // Accessoires
    accessories: [
        {
            id: 'acc-1',
            name: 'Écharpe Coton FC',
            category: 'Accessoires',
            price: 8000,
            oldPrice: null,
            image: 'assets/images/boutique/echarpe.jpg',
            badge: null,
            team: 'football',
            inStock: true
        },
        {
            id: 'acc-2',
            name: 'Casquette Coton Sport',
            category: 'Accessoires',
            price: 7000,
            oldPrice: null,
            image: 'assets/images/boutique/casquette.jpg',
            badge: null,
            team: 'both',
            inStock: true
        },
        {
            id: 'acc-3',
            name: 'Ballon Officiel Coton FC',
            category: 'Accessoires',
            price: 15000,
            oldPrice: 18000,
            image: 'assets/images/boutique/ballon.jpg',
            badge: 'sale',
            team: 'football',
            inStock: true
        },
        {
            id: 'acc-4',
            name: 'Gourde Coton Sport',
            category: 'Accessoires',
            price: 5000,
            oldPrice: null,
            image: 'assets/images/boutique/gourde.jpg',
            badge: null,
            team: 'both',
            inStock: true
        },
        {
            id: 'acc-5',
            name: 'Sac de Sport Coton FC',
            category: 'Accessoires',
            price: 20000,
            oldPrice: null,
            image: 'assets/images/boutique/sac.jpg',
            badge: 'new',
            team: 'football',
            inStock: true
        }
    ]
};

/**
 * Génère le HTML pour une carte produit
 * @param {Object} product - Les données du produit
 * @returns {string} - Le HTML généré
 */
function generateProductCardHTML(product) {
    return `
    <div class="col-md-3 col-sm-6">
        <div class="product-card">
            <div class="product-image">
                ${product.badge ? `<div class="product-badge ${product.badge}">${product.badge === 'new' ? 'NOUVEAU' : 'PROMO'}</div>` : ''}
                <img src="${product.image}" alt="${product.name}">
                <div class="product-actions">
                    <div class="product-action-btn" onclick="quickView('${product.id}')">
                        <i class="fas fa-eye"></i>
                    </div>
                    <div class="product-action-btn" onclick="addToWishlist('${product.id}')">
                        <i class="fas fa-heart"></i>
                    </div>
                </div>
            </div>
            <div class="product-info">
                <div class="product-category">${product.category}</div>
                <h3 class="product-title">${product.name}</h3>
                <div class="product-price">
                    <span class="current-price">${formatPrice(product.price)}</span>
                    ${product.oldPrice ? `<span class="old-price">${formatPrice(product.oldPrice)}</span>` : ''}
                </div>
                <button class="add-to-cart-btn" onclick="addToCart('${product.id}')">
                    <i class="fas fa-shopping-cart"></i> AJOUTER AU PANIER
                </button>
            </div>
        </div>
    </div>
    `;
}

/**
 * Formate un prix en FCFA
 * @param {number} price - Le prix à formater
 * @returns {string} - Le prix formaté
 */
function formatPrice(price) {
    return `${price.toLocaleString('fr-FR')} FCFA`;
}

/**
 * Charge les nouveaux produits
 */
function loadNewProducts() {
    const newProductsGrid = document.getElementById('newProductsGrid');
    if (!newProductsGrid) return;
    
    // Récupérer tous les produits avec le badge "new"
    const newProducts = [
        ...products.footballJerseys.filter(p => p.badge === 'new'),
        ...products.basketballJerseys.filter(p => p.badge === 'new'),
        ...products.training.filter(p => p.badge === 'new'),
        ...products.accessories.filter(p => p.badge === 'new')
    ].slice(0, 4); // Limiter à 4 produits
    
    let html = '';
    newProducts.forEach(product => {
        html += generateProductCardHTML(product);
    });
    
    newProductsGrid.innerHTML = html;
}

/**
 * Charge les maillots par équipe
 * @param {string} team - L'équipe (football ou basketball)
 */
function loadJerseys(team) {
    const jerseysGrid = document.getElementById('jerseysGrid');
    if (!jerseysGrid) return;
    
    // Mettre à jour les onglets actifs
    document.querySelectorAll('#maillots .tab').forEach(tab => {
        if (tab.textContent.trim().toLowerCase().includes(team)) {
            tab.classList.add('active');
        } else {
            tab.classList.remove('active');
        }
    });
    
    // Charger les maillots correspondants
    const jerseys = team === 'football' ? products.footballJerseys : products.basketballJerseys;
    
    let html = '';
    jerseys.forEach(jersey => {
        html += generateProductCardHTML(jersey);
    });
    
    jerseysGrid.innerHTML = html;
}

/**
 * Filtre les maillots par équipe
 * @param {string} team - L'équipe (football ou basketball)
 */
function filterJerseys(team) {
    loadJerseys(team);
}

/**
 * Charge les produits populaires par catégorie
 * @param {string} category - La catégorie (all, training, accessoires)
 */
function loadPopularProducts(category) {
    const popularProductsGrid = document.getElementById('popularProductsGrid');
    if (!popularProductsGrid) return;
    
    // Mettre à jour les onglets actifs
    document.querySelectorAll('.shop-popular .tab').forEach(tab => {
        if (tab.textContent.trim().toLowerCase().includes(category) || 
            (category === 'all' && tab.textContent.trim().toLowerCase() === 'tous')) {
            tab.classList.add('active');
        } else {
            tab.classList.remove('active');
        }
    });
    
    // Charger les produits correspondants
    let popularProducts = [];
    
    if (category === 'all') {
        popularProducts = [
            ...products.training.slice(0, 2),
            ...products.accessories.slice(0, 2)
        ];
    } else if (category === 'training') {
        popularProducts = products.training;
    } else if (category === 'accessoires') {
        popularProducts = products.accessories;
    }
    
    let html = '';
    popularProducts.forEach(product => {
        html += generateProductCardHTML(product);
    });
    
    popularProductsGrid.innerHTML = html;
}

/**
 * Filtre les produits populaires par catégorie
 * @param {string} category - La catégorie (all, training, accessoires)
 */
function filterPopular(category) {
    loadPopularProducts(category);
}

/**
 * Filtre les produits par catégorie
 * @param {string} category - La catégorie (maillots, training, accessoires)
 */
function filterProducts(category) {
    // Scroll jusqu'à la section correspondante
    const section = document.getElementById(category === 'maillots' ? 'maillots' : 
                                           category === 'training' ? 'popular' : 'popular');
    
    if (section) {
        const lenis = window.lenis;
        if (lenis) {
            lenis.scrollTo(section, {
                offset: -100,
                duration: 1.5
            });
        } else {
            section.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
    }
    
    // Filtrer les produits
    if (category === 'maillots') {
        // Déjà géré par le scroll
    } else if (category === 'training') {
        filterPopular('training');
    } else if (category === 'accessoires') {
        filterPopular('accessoires');
    }
}

/**
 * Initialise le système de personnalisation des maillots
 */
function initCustomization() {
    // Écouter les changements de type de maillot
    const jerseyTypeSelect = document.getElementById('jerseyType');
    if (jerseyTypeSelect) {
        jerseyTypeSelect.addEventListener('change', function() {
            updateJerseyPreview();
        });
    }
    
    // Initialiser l'aperçu
    updateJerseyPreview();
}

/**
 * Met à jour l'aperçu du maillot personnalisé
 */
function updateJerseyPreview() {
    const jerseyType = document.getElementById('jerseyType').value;
    const jerseyName = document.getElementById('jerseyName').value || 'VOTRE NOM';
    const jerseyNumber = document.getElementById('jerseyNumber').value || '10';
    
    // Mettre à jour l'image du maillot
    const jerseyPreview = document.getElementById('jerseyPreview');
    if (jerseyPreview) {
        // Déterminer l'image à afficher en fonction du type de maillot
        let imagePath = 'assets/images/boutique/maillot-preview.png';
        
        switch (jerseyType) {
            case 'cotonfc-home':
                imagePath = 'assets/images/boutique/maillot-domicile-preview.png';
                break;
            case 'cotonfc-away':
                imagePath = 'assets/images/boutique/maillot-exterieur-preview.png';
                break;
            case 'cotonfc-third':
                imagePath = 'assets/images/boutique/maillot-third-preview.png';
                break;
            case 'elancoton-home':
                imagePath = 'assets/images/boutique/maillot-basket-domicile-preview.png';
                break;
            case 'elancoton-away':
                imagePath = 'assets/images/boutique/maillot-basket-exterieur-preview.png';
                break;
        }
        
        jerseyPreview.src = imagePath;
    }
    
    // Mettre à jour le nom et le numéro
    const previewName = document.getElementById('previewName');
    const previewNumber = document.getElementById('previewNumber');
    
    if (previewName) {
        previewName.textContent = jerseyName.toUpperCase();
    }
    
    if (previewNumber) {
        previewNumber.textContent = jerseyNumber;
    }
}

/**
 * Met à jour l'aperçu du maillot lors de la saisie du nom ou du numéro
 */
function updatePreview() {
    updateJerseyPreview();
}

/**
 * Ajoute un maillot personnalisé au panier
 */
function addCustomJerseyToCart() {
    const jerseyType = document.getElementById('jerseyType').value;
    const jerseySize = document.getElementById('jerseySize').value;
    const jerseyName = document.getElementById('jerseyName').value || '';
    const jerseyNumber = document.getElementById('jerseyNumber').value || '';
    const jerseyBadge = document.getElementById('jerseyBadge').value;
    
    // Déterminer le type de maillot et son nom
    let jerseyTypeName = '';
    let jerseyTeam = '';
    let jerseyImage = '';
    let jerseyPrice = 25000; // Prix de base
    
    switch (jerseyType) {
        case 'cotonfc-home':
            jerseyTypeName = 'Maillot Domicile Coton FC';
            jerseyTeam = 'Coton FC';
            jerseyImage = 'assets/images/boutique/maillot-domicile.jpg';
            break;
        case 'cotonfc-away':
            jerseyTypeName = 'Maillot Extérieur Coton FC';
            jerseyTeam = 'Coton FC';
            jerseyImage = 'assets/images/boutique/maillot-exterieur.jpg';
            break;
        case 'cotonfc-third':
            jerseyTypeName = 'Maillot Third Coton FC';
            jerseyTeam = 'Coton FC';
            jerseyImage = 'assets/images/boutique/maillot-third.jpg';
            break;
        case 'elancoton-home':
            jerseyTypeName = 'Maillot Domicile Elan Coton BC';
            jerseyTeam = 'Elan Coton BC';
            jerseyImage = 'assets/images/boutique/maillot-basket-domicile.jpg';
            break;
        case 'elancoton-away':
            jerseyTypeName = 'Maillot Extérieur Elan Coton BC';
            jerseyTeam = 'Elan Coton BC';
            jerseyImage = 'assets/images/boutique/maillot-basket-exterieur.jpg';
            break;
    }
    
    // Ajouter un supplément pour le badge
    if (jerseyBadge !== 'none') {
        jerseyPrice += 2000;
    }
    
    // Créer l'objet produit personnalisé
    const customJersey = {
        id: `custom-${Date.now()}`,
        name: `${jerseyTypeName} Personnalisé`,
        price: jerseyPrice,
        image: jerseyImage,
        quantity: 1,
        customization: {
            size: jerseySize,
            name: jerseyName,
            number: jerseyNumber,
            badge: jerseyBadge
        }
    };
    
    // Ajouter au panier
    addToCartCustom(customJersey);
    
    // Afficher une confirmation
    alert(`${jerseyTypeName} personnalisé ajouté au panier !`);
}

/**
 * Initialise le panier
 */
function initCart() {
    // Récupérer le panier depuis le localStorage
    let cart = JSON.parse(localStorage.getItem('cotonSportCart')) || [];
    
    // Mettre à jour l'affichage du panier
    updateCartDisplay(cart);
}

/**
 * Ajoute un produit au panier
 * @param {string} productId - L'ID du produit à ajouter
 */
function addToCart(productId) {
    // Récupérer le panier actuel
    let cart = JSON.parse(localStorage.getItem('cotonSportCart')) || [];
    
    // Trouver le produit dans les données
    let product = findProductById(productId);
    
    if (product) {
        // Vérifier si le produit est déjà dans le panier
        const existingProductIndex = cart.findIndex(item => item.id === productId);
        
        if (existingProductIndex !== -1) {
            // Incrémenter la quantité
            cart[existingProductIndex].quantity += 1;
        } else {
            // Ajouter le produit au panier
            cart.push({
                id: product.id,
                name: product.name,
                price: product.price,
                image: product.image,
                quantity: 1
            });
        }
        
        // Sauvegarder le panier dans le localStorage
        localStorage.setItem('cotonSportCart', JSON.stringify(cart));
        
        // Mettre à jour l'affichage du panier
        updateCartDisplay(cart);
        
        // Afficher une confirmation
        alert(`${product.name} ajouté au panier !`);
    }
}

/**
 * Ajoute un produit personnalisé au panier
 * @param {Object} product - Le produit personnalisé à ajouter
 */
function addToCartCustom(product) {
    // Récupérer le panier actuel
    let cart = JSON.parse(localStorage.getItem('cotonSportCart')) || [];
    
    // Ajouter le produit personnalisé au panier
    cart.push(product);
    
    // Sauvegarder le panier dans le localStorage
    localStorage.setItem('cotonSportCart', JSON.stringify(cart));
    
    // Mettre à jour l'affichage du panier
    updateCartDisplay(cart);
}

/**
 * Trouve un produit par son ID
 * @param {string} productId - L'ID du produit
 * @returns {Object|null} - Le produit trouvé ou null
 */
function findProductById(productId) {
    // Chercher dans toutes les catégories de produits
    const allProducts = [
        ...products.footballJerseys,
        ...products.basketballJerseys,
        ...products.training,
        ...products.accessories
    ];
    
    return allProducts.find(product => product.id === productId) || null;
}

/**
 * Met à jour l'affichage du panier
 * @param {Array} cart - Le contenu du panier
 */
function updateCartDisplay(cart) {
    // Mettre à jour le compteur du panier
    const cartCount = document.querySelector('.cart-count');
    if (cartCount) {
        const totalItems = cart.reduce((total, item) => total + item.quantity, 0);
        cartCount.textContent = totalItems;
    }
    
    // Mettre à jour le contenu du panier
    const cartItems = document.getElementById('cartItems');
    if (cartItems) {
        if (cart.length === 0) {
            cartItems.innerHTML = '<div class="empty-cart-message">Votre panier est vide</div>';
        } else {
            let html = '';
            
            cart.forEach((item, index) => {
                html += `
                <div class="cart-item">
                    <img src="${item.image}" alt="${item.name}" class="cart-item-image">
                    <div class="cart-item-details">
                        <div class="cart-item-title">${item.name}</div>
                        ${item.customization ? `
                            <div class="cart-item-variant">
                                Taille: ${item.customization.size}
                                ${item.customization.name ? `, Nom: ${item.customization.name}` : ''}
                                ${item.customization.number ? `, Numéro: ${item.customization.number}` : ''}
                                ${item.customization.badge !== 'none' ? `, Badge: ${item.customization.badge}` : ''}
                            </div>
                        ` : ''}
                        <div class="cart-item-price">${formatPrice(item.price)}</div>
                        <div class="cart-item-quantity">
                            <button class="quantity-btn" onclick="updateCartItemQuantity(${index}, -1)">-</button>
                            <input type="number" class="quantity-input" value="${item.quantity}" min="1" onchange="updateCartItemQuantity(${index}, 0, this.value)">
                            <button class="quantity-btn" onclick="updateCartItemQuantity(${index}, 1)">+</button>
                            <span class="cart-item-remove" onclick="removeCartItem(${index})">
                                <i class="fas fa-trash"></i>
                            </span>
                        </div>
                    </div>
                </div>
                `;
            });
            
            cartItems.innerHTML = html;
        }
    }
    
    // Mettre à jour le total du panier
    const cartTotal = document.getElementById('cartTotal');
    if (cartTotal) {
        const total = cart.reduce((total, item) => total + (item.price * item.quantity), 0);
        cartTotal.textContent = formatPrice(total);
    }
}

/**
 * Met à jour la quantité d'un article du panier
 * @param {number} index - L'index de l'article dans le panier
 * @param {number} change - La variation de quantité (-1, 0, 1)
 * @param {number} newValue - La nouvelle valeur (utilisée si change = 0)
 */
function updateCartItemQuantity(index, change, newValue) {
    // Récupérer le panier actuel
    let cart = JSON.parse(localStorage.getItem('cotonSportCart')) || [];
    
    if (index >= 0 && index < cart.length) {
        if (change === 0 && newValue) {
            // Définir une nouvelle valeur
            cart[index].quantity = parseInt(newValue);
        } else {
            // Incrémenter ou décrémenter
            cart[index].quantity += change;
        }
        
        // S'assurer que la quantité est au moins 1
        if (cart[index].quantity < 1) {
            cart[index].quantity = 1;
        }
        
        // Sauvegarder le panier dans le localStorage
        localStorage.setItem('cotonSportCart', JSON.stringify(cart));
        
        // Mettre à jour l'affichage du panier
        updateCartDisplay(cart);
    }
}

/**
 * Supprime un article du panier
 * @param {number} index - L'index de l'article dans le panier
 */
function removeCartItem(index) {
    // Récupérer le panier actuel
    let cart = JSON.parse(localStorage.getItem('cotonSportCart')) || [];
    
    if (index >= 0 && index < cart.length) {
        // Supprimer l'article
        cart.splice(index, 1);
        
        // Sauvegarder le panier dans le localStorage
        localStorage.setItem('cotonSportCart', JSON.stringify(cart));
        
        // Mettre à jour l'affichage du panier
        updateCartDisplay(cart);
    }
}

/**
 * Affiche un aperçu rapide du produit
 * @param {string} productId - L'ID du produit
 */
function quickView(productId) {
    // Trouver le produit
    const product = findProductById(productId);
    
    if (product) {
        // Afficher une alerte simple pour l'instant
        // Dans une version réelle, on afficherait une modal avec plus de détails
        alert(`Aperçu rapide: ${product.name}\nPrix: ${formatPrice(product.price)}`);
    }
}

/**
 * Ajoute un produit à la liste de souhaits
 * @param {string} productId - L'ID du produit
 */
function addToWishlist(productId) {
    // Trouver le produit
    const product = findProductById(productId);
    
    if (product) {
        // Afficher une alerte simple pour l'instant
        // Dans une version réelle, on gérerait une vraie liste de souhaits
        alert(`${product.name} ajouté à votre liste de souhaits !`);
    }
}

/**
 * Procède au paiement
 */
function proceedToCheckout() {
    // Récupérer le panier actuel
    let cart = JSON.parse(localStorage.getItem('cotonSportCart')) || [];
    
    if (cart.length === 0) {
        alert('Votre panier est vide !');
        return;
    }
    
    // Calculer le total
    const total = cart.reduce((total, item) => total + (item.price * item.quantity), 0);
    
    // Afficher une confirmation
    alert(`Commande en cours de traitement...\nTotal: ${formatPrice(total)}\n\nDans une version réelle, vous seriez redirigé vers une page de paiement sécurisée.`);
    
    // Vider le panier (simulation d'une commande réussie)
    localStorage.removeItem('cotonSportCart');
    
    // Mettre à jour l'affichage du panier
    updateCartDisplay([]);
}
