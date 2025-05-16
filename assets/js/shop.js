// Données des maillots de la saison en cours (2024-2025)
const productsData = {
    jerseys: [
        {
            id: 'cfc-home-2025',
            name: 'Maillot Domicile 24/25',
            category: 'football',
            price: 25000,
            oldPrice: 28000,
            image: 'assets/images/boutique/maillot-domicile-2025.jpg',
            sizes: ['S', 'M', 'L', 'XL', 'XXL'],
            colors: [
                { name: 'Rouge', code: '#D40000' },
                { name: 'Noir', code: '#000000' }
            ],
            isNew: true,
            isOnSale: true,
            stock: 50,
            description: 'Maillot domicile officiel de Coton FC pour la saison 2024-2025. Matière respirante et légère pour un confort optimal sur le terrain.'
        },
        {
            id: 'cfc-away-2025',
            name: 'Maillot Extérieur 24/25',
            category: 'football',
            price: 25000,
            oldPrice: 28000,
            image: 'assets/images/boutique/maillot-exterieur-2025.jpg',
            sizes: ['S', 'M', 'L', 'XL', 'XXL'],
            colors: [
                { name: 'Blanc', code: '#FFFFFF' },
                { name: 'Noir', code: '#000000' }
            ],
            isNew: true,
            stock: 45,
            description: 'Maillot extérieur officiel de Coton FC pour la saison 2024-2025. Conçu pour les performances avec une coupe ajustée.'
        },
        {
            id: 'cfc-third-2025',
            name: 'Maillot Third 24/25',
            category: 'football',
            price: 25000,
            image: 'assets/images/boutique/maillot-third-2025.jpg',
            sizes: ['S', 'M', 'L', 'XL'],
            colors: [
                { name: 'Noir', code: '#000000' },
                { name: 'Or', code: '#FFD700' }
            ],
            isNew: true,
            stock: 35,
            description: 'Troisième maillot officiel de Coton FC pour la saison 2024-2025. Design exclusif et limité.'
        },
        {
            id: 'ecbc-home-2025',
            name: 'Maillot Domicile Elan Coton 24/25',
            category: 'basketball',
            price: 22000,
            oldPrice: 25000,
            image: 'assets/images/boutique/maillot-elan-home-2025.jpg',
            sizes: ['S', 'M', 'L', 'XL'],
            colors: [
                { name: 'Bleu', code: '#0000FF' },
                { name: 'Blanc', code: '#FFFFFF' }
            ],
            isNew: true,
            isOnSale: true,
            stock: 30,
            description: 'Maillot domicile officiel de l\'Elan Coton BC pour la saison 2024-2025. Confort et style pour les performances sur le parquet.'
        }
    ],
    
    // Fonction pour afficher les maillots
    displayJerseys: function(category = 'all') {
        const container = document.getElementById('jerseysGrid');
        if (!container) return;
        
        let filteredJerseys = category === 'all' 
            ? this.jerseys 
            : this.jerseys.filter(jersey => jersey.category === category);
        
        container.innerHTML = filteredJerseys.map(jersey => `
            <div class="col-md-4 col-lg-3 mb-4" data-category="${jersey.category}">
                <div class="product-card">
                    ${jersey.isNew ? '<span class="badge bg-danger">Nouveau</span>' : ''}
                    ${jersey.isOnSale ? '<span class="badge bg-success">Promo</span>' : ''}
                    <div class="product-img">
                        <img src="${jersey.image}" alt="${jersey.name}" class="img-fluid">
                        <div class="product-actions">
                            <button class="btn-action" onclick="addToCart('${jersey.id}')">
                                <i class="fas fa-shopping-cart"></i>
                            </button>
                            <button class="btn-action" onclick="addToWishlist('${jersey.id}')">
                                <i class="far fa-heart"></i>
                            </button>
                            <button class="btn-action" onclick="quickView('${jersey.id}')">
                                <i class="fas fa-eye"></i>
                            </button>
                        </div>
                    </div>
                    <div class="product-info">
                        <h3>${jersey.name}</h3>
                        <div class="price">
                            ${jersey.oldPrice ? `<span class="old-price">${jersey.oldPrice.toLocaleString()} FCFA</span>` : ''}
                            <span class="current-price">${jersey.price.toLocaleString()} FCFA</span>
                        </div>
                        <div class="size-selector">
                            ${jersey.sizes.map(size => 
                                `<button class="size-option" data-size="${size}">${size}</button>`
                            ).join('')}
                        </div>
                        <button class="btn-add-to-cart" onclick="addToCart('${jersey.id}')">
                            Ajouter au panier
                        </button>
                    </div>
                </div>
            </div>
        `).join('');
    },
    
    // Initialisation de la boutique
    init: function() {
        // Afficher les maillots au chargement
        this.displayJerseys('football');
        
        // Gérer le changement d'onglet
        const tabs = document.querySelectorAll('.tab');
        tabs.forEach(tab => {
            tab.addEventListener('click', (e) => {
                // Mettre à jour l'onglet actif
                document.querySelector('.tab.active').classList.remove('active');
                e.target.classList.add('active');
                
                // Filtrer les maillots
                const category = e.target.getAttribute('onclick').match(/'([^']+)'/)[1];
                this.displayJerseys(category);
            });
        });
    }
};

// Initialiser la boutique lorsque le DOM est chargé
document.addEventListener('DOMContentLoaded', () => {
    productsData.init();
});

// Fonctions utilitaires (à implémenter)
function addToCart(productId) {
    console.log('Ajout au panier:', productId);
    // Implémentation de l'ajout au panier
}

function addToWishlist(productId) {
    console.log('Ajout aux favoris:', productId);
    // Implémentation de l'ajout aux favoris
}

function quickView(productId) {
    console.log('Vue rapide:', productId);
    // Implémentation de la vue rapide
}

// Filtrer les maillots par catégorie
function filterJerseys(category) {
    productsData.displayJerseys(category);
}

// Filtrer les produits par catégorie
function filterProducts(category) {
    console.log('Filtrer les produits par catégorie:', category);
    // Implémentation du filtrage des produits
}
