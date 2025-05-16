/**
 * Animations et effets pour le site Coton FC
 * Inspiré par les grands clubs européens comme le FC Barcelone
 */

document.addEventListener('DOMContentLoaded', function() {
    // Initialisation des animations au chargement
    initAnimations();
    
    // Animation au défilement
    window.addEventListener('scroll', handleScrollAnimations);
    
    // Initialiser le smooth scroll avec Lenis
    initSmoothScroll();
    
    // Animation des cartes au survol
    initHoverEffects();
    
    // Initialiser le carrousel du hero banner
    initHeroCarousel();
});

/**
 * Initialise les animations de la page
 */
function initAnimations() {
    // Animation du header au chargement
    anime({
        targets: '.navbar',
        translateY: [-100, 0],
        opacity: [0, 1],
        duration: 1000,
        easing: 'easeOutExpo'
    });

    // Animation du hero
    anime({
        targets: '.hero-content',
        translateY: [50, 0],
        opacity: [0, 1],
        duration: 1200,
        delay: 300,
        easing: 'easeOutExpo'
    });
}

/**
 * Gère les animations au défilement
 */
function handleScrollAnimations() {
    // Animation des sections au scroll
    const sections = document.querySelectorAll('.animate-on-scroll');
    
    sections.forEach(section => {
        const sectionTop = section.getBoundingClientRect().top;
        const windowHeight = window.innerHeight;
        
        if (sectionTop < windowHeight * 0.85) {
            section.classList.add('animated');
        }
    });
    
    // Effet de parallaxe sur la bannière
    const hero = document.querySelector('.hero-section');
    if (hero) {
        const scrollPosition = window.pageYOffset;
        hero.style.backgroundPositionY = scrollPosition * 0.5 + 'px';
    }
}

/**
 * Initialise le défilement fluide avec Lenis
 */
function initSmoothScroll() {
    // Vérifier si Lenis est chargé
    if (typeof Lenis === 'undefined') {
        console.warn('Lenis n\'est pas chargé. Le défilement fluide sera désactivé.');
        return;
    }
    
    try {
        const lenis = new Lenis({
            duration: 1.2,
            easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
            direction: 'vertical',
            gestureDirection: 'vertical',
            smooth: true,
            smoothTouch: false,
            touchMultiplier: 2,
        });

        function raf(time) {
            if (lenis) {
                lenis.raf(time);
                requestAnimationFrame(raf);
            }
        }

        requestAnimationFrame(raf);

        // Mise à jour des positions au redimensionnement
        const handleResize = () => {
            if (lenis) lenis.resize();
        };
        
        window.addEventListener('resize', handleResize);

        // Gestion des ancres
        document.querySelectorAll('a[href^="#"]').forEach(anchor => {
            const href = anchor.getAttribute('href');
            if (href !== '#') { // Ne pas intercepter les liens vides
                anchor.addEventListener('click', function(e) {
                    e.preventDefault();
                    const target = document.querySelector(href);
                    if (target && lenis) {
                        lenis.scrollTo(target, {
                            offset: -80, // Ajuster selon la hauteur du header
                            duration: 1.2
                        });
                    }
                });
            }
        });
        
        // Nettoyage
        return () => {
            window.removeEventListener('resize', handleResize);
        };
    } catch (error) {
        console.error('Erreur lors de l\'initialisation de Lenis:', error);
    }
}

/**
 * Initialise les effets de survol sur les cartes
 */
function initHoverEffects() {
    // Effet sur les cartes de joueurs
    const playerCards = document.querySelectorAll('.player-card');
    playerCards.forEach(card => {
        card.addEventListener('mousemove', (e) => {
            const rect = card.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            
            const centerX = rect.width / 2;
            const centerY = rect.height / 2;
            
            const angleX = (y - centerY) / 20;
            const angleY = (centerX - x) / 20;
            
            card.style.transform = `perspective(1000px) rotateX(${angleX}deg) rotateY(${angleY}deg) scale3d(1.05, 1.05, 1.05)`;
            card.style.transition = 'transform 0.1s ease-out';
        });
        
        card.addEventListener('mouseleave', () => {
            card.style.transform = 'perspective(1000px) rotateX(0) rotateY(0) scale3d(1, 1, 1)';
            card.style.transition = 'transform 0.5s ease-out';
        });
    });
    
    // Effet sur les cartes d'actualités
    const newsCards = document.querySelectorAll('.news-card');
    newsCards.forEach(card => {
        card.addEventListener('mouseenter', () => {
            const image = card.querySelector('img');
            if (image) {
                image.style.transform = 'scale(1.1)';
                image.style.transition = 'transform 0.5s ease-out';
            }
        });
        
        card.addEventListener('mouseleave', () => {
            const image = card.querySelector('img');
            if (image) {
                image.style.transform = 'scale(1)';
                image.style.transition = 'transform 0.5s ease-out';
            }
        });
    });
}

/**
 * Animation des chiffres (compteurs)
 */
function animateCounters() {
    const counters = document.querySelectorAll('.counter');
    const speed = 200;
    
    counters.forEach(counter => {
        const target = +counter.getAttribute('data-count');
        const count = +counter.innerText;
        const increment = target / speed;
        
        if (count < target) {
            counter.innerText = Math.ceil(count + increment);
            setTimeout(animateCounters, 1);
        } else {
            counter.innerText = target;
        }
    });
}

/**
 * Initialise le carrousel du hero banner
 */
function initHeroCarousel() {
    const heroCarousel = document.querySelector('#heroCarousel');
    if (!heroCarousel) return;
    
    // Initialiser le carrousel avec des options personnalisées
    const carousel = new bootstrap.Carousel(heroCarousel, {
        interval: 5000, // Changement toutes les 5 secondes
        touch: true,   // Activer le support tactile
        ride: 'carousel',
        wrap: true,    // Boucler les diapositives
        keyboard: true // Navigation au clavier
    });
    
    // Démarrer le carrousel automatiquement
    carousel.cycle();
    
    // Ajouter des animations aux indicateurs
    const indicators = heroCarousel.querySelectorAll('.carousel-indicators button');
    indicators.forEach((indicator, index) => {
        indicator.addEventListener('click', () => {
            // Animation de l'indicateur cliqué
            indicator.style.transform = 'scale(1.3)';
            setTimeout(() => {
                indicator.style.transform = 'scale(1.2)';
            }, 200);
        });
    });
}

// Exposer les fonctions pour une utilisation globale
window.animateCounters = animateCounters;
