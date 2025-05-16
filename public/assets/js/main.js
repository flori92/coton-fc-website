// Script principal pour le site Coton FC

document.addEventListener('DOMContentLoaded', function() {
    // Initialisation du compte à rebours
    initCountdown();
    
    // Gestion des onglets
    initTabs();
    
    // Filtres de joueurs
    initPlayerFilters();
    
    // Carrousel de bannière
    initBannerCarousel();
    
    // Animation au défilement
    initScrollAnimations();
});

/**
 * Initialise le compte à rebours pour le prochain match
 */
function initCountdown() {
    const countdownElements = {
        days: document.querySelector('.countdown-item:nth-child(1) .number'),
        hours: document.querySelector('.countdown-item:nth-child(2) .number'),
        minutes: document.querySelector('.countdown-item:nth-child(3) .number')
    };
    
    if (!countdownElements.days) return;
    
    // Date du prochain match (12 Juin 2025 à 17:00)
    const matchDate = new Date('2025-06-12T17:00:00');
    
    function updateCountdown() {
        const now = new Date();
        const diff = matchDate - now;
        
        if (diff <= 0) {
            // Le match a commencé
            countdownElements.days.textContent = '0';
            countdownElements.hours.textContent = '0';
            countdownElements.minutes.textContent = '0';
            return;
        }
        
        const days = Math.floor(diff / (1000 * 60 * 60 * 24));
        const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
        
        countdownElements.days.textContent = days;
        countdownElements.hours.textContent = hours;
        countdownElements.minutes.textContent = minutes;
    }
    
    // Mise à jour initiale
    updateCountdown();
    
    // Mise à jour toutes les minutes
    setInterval(updateCountdown, 60000);
}

/**
 * Initialise les onglets dans les sections
 */
function initTabs() {
    const tabButtons = document.querySelectorAll('.tab');
    
    tabButtons.forEach(button => {
        button.addEventListener('click', function() {
            // Retirer la classe active de tous les onglets
            const siblings = Array.from(this.parentElement.children);
            siblings.forEach(sibling => sibling.classList.remove('active'));
            
            // Ajouter la classe active à l'onglet cliqué
            this.classList.add('active');
            
            // Ici, vous pouvez ajouter la logique pour afficher le contenu correspondant
            // Par exemple, charger les résultats ou le calendrier des matchs
            const tabType = this.textContent.trim();
            console.log(`Onglet ${tabType} activé`);
            
            // Simuler un chargement de données
            const matchesTable = document.querySelector('.matches-table');
            if (matchesTable) {
                matchesTable.style.opacity = '0.5';
                setTimeout(() => {
                    matchesTable.style.opacity = '1';
                }, 500);
            }
        });
    });
}

/**
 * Initialise les filtres de joueurs
 */
function initPlayerFilters() {
    const filterButtons = document.querySelectorAll('.filter');
    const playerCards = document.querySelectorAll('.player-card');
    
    filterButtons.forEach(button => {
        button.addEventListener('click', function() {
            // Retirer la classe active de tous les filtres
            filterButtons.forEach(btn => btn.classList.remove('active'));
            
            // Ajouter la classe active au filtre cliqué
            this.classList.add('active');
            
            // Filtrer les joueurs
            const filterType = this.textContent.trim();
            console.log(`Filtre ${filterType} activé`);
            
            // Simuler un filtrage
            playerCards.forEach(card => {
                card.style.opacity = '0.5';
                setTimeout(() => {
                    card.style.opacity = '1';
                }, Math.random() * 300 + 200);
            });
        });
    });
}

/**
 * Initialise le carrousel de la bannière principale
 */
function initBannerCarousel() {
    const indicators = document.querySelectorAll('.banner-indicators span');
    
    indicators.forEach((indicator, index) => {
        indicator.addEventListener('click', function() {
            // Retirer la classe active de tous les indicateurs
            indicators.forEach(ind => ind.classList.remove('active'));
            
            // Ajouter la classe active à l'indicateur cliqué
            this.classList.add('active');
            
            // Ici, vous pouvez ajouter la logique pour changer la bannière
            console.log(`Bannière ${index + 1} activée`);
            
            // Simuler un changement de bannière
            const heroBanner = document.querySelector('.hero-banner');
            if (heroBanner) {
                heroBanner.style.opacity = '0.8';
                setTimeout(() => {
                    // Changer l'image de fond (à implémenter avec de vraies images)
                    heroBanner.style.opacity = '1';
                }, 300);
            }
        });
    });
}

/**
 * Initialise les animations au défilement
 */
function initScrollAnimations() {
    // Détecter les éléments à animer
    const animatedElements = document.querySelectorAll('.section-header, .player-card, .news-card');
    
    // Fonction pour vérifier si un élément est visible
    function isElementInViewport(el) {
        const rect = el.getBoundingClientRect();
        return (
            rect.top >= 0 &&
            rect.left >= 0 &&
            rect.bottom <= (window.innerHeight || document.documentElement.clientHeight) &&
            rect.right <= (window.innerWidth || document.documentElement.clientWidth)
        );
    }
    
    // Fonction pour animer les éléments visibles
    function animateOnScroll() {
        animatedElements.forEach(element => {
            if (isElementInViewport(element) && !element.classList.contains('animated')) {
                element.classList.add('animated');
                element.style.opacity = '1';
                element.style.transform = 'translateY(0)';
            }
        });
    }
    
    // Initialiser les styles pour l'animation
    animatedElements.forEach(element => {
        element.style.opacity = '0';
        element.style.transform = 'translateY(20px)';
        element.style.transition = 'opacity 0.5s ease, transform 0.5s ease';
    });
    
    // Écouter l'événement de défilement
    window.addEventListener('scroll', animateOnScroll);
    
    // Déclencher une fois au chargement
    animateOnScroll();
}

/**
 * Fonction pour charger plus de matchs
 */
function loadMoreMatches() {
    console.log('Chargement de plus de matchs...');
    // Ici, vous pouvez implémenter une requête AJAX pour charger plus de matchs
}

/**
 * Fonction pour charger plus d'actualités
 */
function loadMoreNews() {
    console.log('Chargement de plus d\'actualités...');
    // Ici, vous pouvez implémenter une requête AJAX pour charger plus d'actualités
}

/**
 * Fonction pour s'abonner à la newsletter
 */
function subscribeNewsletter(event) {
    event.preventDefault();
    const emailInput = document.querySelector('.newsletter input');
    const email = emailInput.value.trim();
    
    if (email && isValidEmail(email)) {
        console.log(`Inscription à la newsletter avec l'email: ${email}`);
        alert('Merci de vous être inscrit à notre newsletter !');
        emailInput.value = '';
    } else {
        alert('Veuillez entrer une adresse email valide.');
    }
}

/**
 * Valide une adresse email
 */
function isValidEmail(email) {
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return regex.test(email);
}

// Ajouter l'événement pour le formulaire de newsletter
document.addEventListener('DOMContentLoaded', function() {
    const newsletterForm = document.querySelector('.newsletter form');
    if (newsletterForm) {
        newsletterForm.addEventListener('submit', subscribeNewsletter);
    }
});
