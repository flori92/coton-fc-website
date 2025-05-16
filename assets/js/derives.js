// Gestion des interactions des produits dérivés
document.addEventListener('DOMContentLoaded', function() {
    // Filtrage des produits par catégorie
    const categoryTabs = document.querySelectorAll('.category-tab');
    const productCards = document.querySelectorAll('.derived-card');
    
    categoryTabs.forEach(tab => {
        tab.addEventListener('click', function() {
            // Mettre à jour l'onglet actif
            categoryTabs.forEach(t => t.classList.remove('active'));
            this.classList.add('active');
            
            const category = this.getAttribute('data-category');
            
            // Filtrer les produits
            productCards.forEach(card => {
                if (category === 'all' || card.getAttribute('data-category') === category) {
                    card.style.display = 'block';
                } else {
                    card.style.display = 'none';
                }
            });
        });
    });
    
    // Gestion des sélecteurs de quantité
    const quantityInputs = document.querySelectorAll('.quantity-input');
    
    quantityInputs.forEach(input => {
        const minusBtn = input.previousElementSibling;
        const plusBtn = input.nextElementSibling;
        
        minusBtn.addEventListener('click', () => {
            let value = parseInt(input.value);
            if (value > 1) {
                input.value = value - 1;
            }
        });
        
        plusBtn.addEventListener('click', () => {
            let value = parseInt(input.value);
            input.value = value + 1;
        });
    });
    
    // Gestion du changement de couleur
    const colorOptions = document.querySelectorAll('.color-option');
    
    colorOptions.forEach(option => {
        option.addEventListener('click', function() {
            const parent = this.closest('.color-options');
            parent.querySelectorAll('.color-option').forEach(opt => {
                opt.classList.remove('active');
            });
            this.classList.add('active');
        });
    });
    
    // Gestion du changement de taille
    const sizeOptions = document.querySelectorAll('.size-option');
    
    sizeOptions.forEach(option => {
        option.addEventListener('click', function() {
            const parent = this.closest('.size-options');
            if (parent) {
                parent.querySelectorAll('.size-option').forEach(opt => {
                    opt.classList.remove('active');
                });
                this.classList.add('active');
            }
        });
    });
    
    // Gestion de l'ajout au panier
    const addToCartButtons = document.querySelectorAll('.add-to-cart-btn');
    let cartCount = 0;
    const cartCountElement = document.querySelector('.cart-count');
    
    addToCartButtons.forEach(button => {
        button.addEventListener('click', function() {
            const productCard = this.closest('.derived-card');
            const productName = productCard.querySelector('h3').textContent;
            const productPrice = productCard.querySelector('.product-price').textContent;
            
            // Mettre à jour le compteur du panier
            cartCount++;
            cartCountElement.textContent = cartCount;
            
            // Afficher une notification
            showNotification(`"${productName}" a été ajouté à votre panier`);
            
            // Ajouter l'animation du panier
            animateCartIcon();
        });
    });
    
    // Fonction pour afficher les notifications
    function showNotification(message, type = 'success') {
        const notification = document.createElement('div');
        notification.className = `alert alert-${type}`;
        notification.innerHTML = `
            <i class="fas fa-${type === 'success' ? 'check-circle' : 'exclamation-circle'}"></i>
            ${message}
        `;
        
        document.body.appendChild(notification);
        
        // Ajouter la classe pour l'animation d'entrée
        setTimeout(() => {
            notification.style.opacity = '1';
            notification.style.transform = 'translateY(0)';
        }, 10);
        
        // Supprimer la notification après 3 secondes
        setTimeout(() => {
            notification.style.opacity = '0';
            notification.style.transform = 'translateY(-20px)';
            
            // Supprimer l'élément après l'animation
            setTimeout(() => {
                notification.remove();
            }, 300);
        }, 3000);
    }
    
    // Fonction pour animer l'icône du panier
    function animateCartIcon() {
        const cartIcon = document.querySelector('.cart-btn');
        cartIcon.classList.add('animate');
        
        // Supprimer la classe après l'animation
        setTimeout(() => {
            cartIcon.classList.remove('animate');
        }, 1000);
    }
    
    // Initialisation des tooltips
    const tooltipTriggerList = [].slice.call(document.querySelectorAll('[data-bs-toggle="tooltip"]'));
    tooltipTriggerList.map(function (tooltipTriggerEl) {
        return new bootstrap.Tooltip(tooltipTriggerEl);
    });
});

// Gestion du filtre de prix
const priceRange = document.querySelector('.price-range');
if (priceRange) {
    priceRange.addEventListener('input', function() {
        const value = this.value;
        const min = this.min;
        const max = this.max;
        const percentage = ((value - min) / (max - min)) * 100;
        
        // Mettre à jour le style de la barre de progression
        this.style.background = `linear-gradient(to right, var(--primary-color) 0%, var(--primary-color) ${percentage}%, #ddd ${percentage}%, #ddd 100%)`;
    });
}
