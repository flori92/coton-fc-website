// Script principal pour le site Coton FC

document.addEventListener('DOMContentLoaded', function() {
    // Initialisation de Lenis pour le smooth scroll
    initLenisScroll();
    
    // Initialisation des animations avec anime.js
    initAnimeAnimations();
    
    // Initialisation du compte à rebours
    initCountdown();
    
    // Gestion des onglets
    initTabs();
    
    // Filtres de joueurs
    initPlayerFilters();
    
    // Carrousel de bannière
    initBannerCarousel();
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
            // Identifier la section parente (football ou basketball)
            const section = this.closest('.matches-section');
            if (!section) return;
            
            const matchesTable = section.querySelector('.matches-table');
            const matchesCalendar = section.querySelector('.matches-calendar');
            
            if (!matchesTable || !matchesCalendar) return;
            
            // Retirer la classe active de tous les onglets de cette section
            const siblings = Array.from(this.parentElement.children);
            siblings.forEach(sibling => sibling.classList.remove('active'));
            
            // Ajouter la classe active à l'onglet cliqué
            this.classList.add('active');
            
            // Afficher le contenu correspondant à l'onglet
            const tabType = this.textContent.trim();
            console.log(`Onglet ${tabType} activé dans ${section.id}`);
            
            if (tabType === 'RÉSULTATS') {
                // Afficher les résultats
                matchesTable.style.display = 'block';
                matchesCalendar.style.display = 'none';
                
                // Animation de transition
                matchesTable.style.opacity = '0';
                setTimeout(() => {
                    matchesTable.style.opacity = '1';
                }, 100);
            } else if (tabType === 'CALENDRIER') {
                // Afficher le calendrier
                matchesTable.style.display = 'none';
                matchesCalendar.style.display = 'block';
                
                // Animation de transition
                matchesCalendar.style.opacity = '0';
                setTimeout(() => {
                    matchesCalendar.style.opacity = '1';
                }, 100);
            }
        });
    });
    
    // Initialisation : afficher les résultats par défaut dans toutes les sections
    document.querySelectorAll('.matches-section').forEach(section => {
        const matchesTable = section.querySelector('.matches-table');
        const matchesCalendar = section.querySelector('.matches-calendar');
        
        if (matchesTable && matchesCalendar) {
            matchesTable.style.display = 'block';
            matchesCalendar.style.display = 'none';
        }
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
 * Initialise Lenis pour le smooth scroll
 */
function initLenisScroll() {
    // Vérifier si la librairie Lenis est chargée
    if (typeof Lenis === 'undefined') {
        console.error('La librairie Lenis n\'est pas chargée');
        return;
    }
    
    // Initialiser Lenis
    const lenis = new Lenis({
        duration: 1.2,
        easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
        direction: 'vertical',
        gestureDirection: 'vertical',
        smooth: true,
        mouseMultiplier: 1,
        smoothTouch: false,
        touchMultiplier: 2,
        infinite: false
    });
    
    // Fonction pour mettre à jour Lenis à chaque frame
    function raf(time) {
        lenis.raf(time);
        requestAnimationFrame(raf);
    }
    
    // Démarrer la boucle d'animation
    requestAnimationFrame(raf);
    
    // Ajouter des événements pour les liens d'ancrage
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            e.preventDefault();
            const targetId = this.getAttribute('href');
            if (targetId === '#') return;
            
            const targetElement = document.querySelector(targetId);
            if (targetElement) {
                lenis.scrollTo(targetElement, {
                    offset: -100,
                    duration: 1.5
                });
            }
        });
    });
    
    console.log('Lenis smooth scroll initialisé');
}

/**
 * Initialise les animations avec anime.js
 */
function initAnimeAnimations() {
    // Vérifier si la librairie anime.js est chargée
    if (typeof anime === 'undefined') {
        console.error('La librairie anime.js n\'est pas chargée');
        return;
    }
    
    // Animation des cartes de joueurs
    animatePlayerCards();
    
    // Animation des cartes de staff
    animateStaffCards();
    
    // Animation des cartes de trophées
    animateTrophyCards();
    
    // Animation des cartes de partenaires
    animatePartnerCards();
    
    // Animation des éléments au scroll
    initScrollAnimations();
    
    console.log('Animations anime.js initialisées');
}

/**
 * Anime les cartes de joueurs
 */
function animatePlayerCards() {
    const playerCards = document.querySelectorAll('.player-card');
    if (!playerCards.length) return;
    
    playerCards.forEach((card, index) => {
        card.style.opacity = '0';
        card.style.transform = 'translateY(50px)';
        
        // Observer pour déclencher l'animation au scroll
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    anime({
                        targets: card,
                        opacity: 1,
                        translateY: 0,
                        duration: 800,
                        easing: 'easeOutExpo',
                        delay: index * 100
                    });
                    observer.unobserve(card);
                }
            });
        }, { threshold: 0.1 });
        
        observer.observe(card);
    });
}

/**
 * Anime les cartes de staff
 */
function animateStaffCards() {
    const staffCards = document.querySelectorAll('.staff-card');
    if (!staffCards.length) return;
    
    staffCards.forEach((card, index) => {
        card.style.opacity = '0';
        card.style.transform = 'translateY(50px)';
        
        // Observer pour déclencher l'animation au scroll
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    anime({
                        targets: card,
                        opacity: 1,
                        translateY: 0,
                        duration: 800,
                        easing: 'easeOutExpo',
                        delay: index * 150
                    });
                    observer.unobserve(card);
                }
            });
        }, { threshold: 0.1 });
        
        observer.observe(card);
    });
}

/**
 * Anime les cartes de trophées
 */
function animateTrophyCards() {
    const trophyCards = document.querySelectorAll('.trophy-card');
    if (!trophyCards.length) return;
    
    trophyCards.forEach((card, index) => {
        card.style.opacity = '0';
        card.style.transform = 'scale(0.8)';
        
        // Observer pour déclencher l'animation au scroll
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    anime({
                        targets: card,
                        opacity: 1,
                        scale: 1,
                        duration: 800,
                        easing: 'easeOutElastic(1, .5)',
                        delay: index * 200
                    });
                    observer.unobserve(card);
                }
            });
        }, { threshold: 0.1 });
        
        observer.observe(card);
    });
}

/**
 * Anime les cartes de partenaires
 */
function animatePartnerCards() {
    const partnerCards = document.querySelectorAll('.partner-card');
    if (!partnerCards.length) return;
    
    partnerCards.forEach((card, index) => {
        card.style.opacity = '0';
        
        // Observer pour déclencher l'animation au scroll
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    anime({
                        targets: card,
                        opacity: 1,
                        duration: 600,
                        easing: 'easeInOutQuad',
                        delay: index * 100
                    });
                    observer.unobserve(card);
                }
            });
        }, { threshold: 0.1 });
        
        observer.observe(card);
    });
}

/**
 * Initialise les animations au défilement
 */
function initScrollAnimations() {
    // Détecter les éléments à animer
    const animatedElements = document.querySelectorAll('.section-header, .news-card');
    if (!animatedElements.length) return;
    
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
    
    // Initialiser les styles pour l'animation
    animatedElements.forEach(element => {
        element.style.opacity = '0';
        element.style.transform = 'translateY(20px)';
    });
    
    // Observer pour déclencher l'animation au scroll
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                anime({
                    targets: entry.target,
                    opacity: 1,
                    translateY: 0,
                    duration: 800,
                    easing: 'easeOutExpo'
                });
                observer.unobserve(entry.target);
            }
        });
    }, { threshold: 0.1 });
    
    animatedElements.forEach(element => {
        observer.observe(element);
    });
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
