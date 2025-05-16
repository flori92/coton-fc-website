/**
 * Billetterie Coton Sport
 * Script de gestion de la billetterie en ligne
 * Version 2.0 - Mai 2024
 */

// Configuration des prix des billets par catégorie (en FCFA)
const TICKET_PRICES = {
    football: {
        standard: 3000,
        premium: 5000,
        vip: 10000,
        tribune: 20000
    },
    basketball: {
        standard: 2000,
        premium: 4000,
        vip: 8000
    }
};

// Configuration des abonnements saisonniers
const SUBSCRIPTION_PRICES = {
    standard: 50000,
    premium: 80000,
    vip: 150000,
    tribune: 250000
};

// Avantages des abonnements
const SUBSCRIPTION_BENEFITS = {
    standard: [
        'Accès à tous les matchs de championnat à domicile',
        'Réduction de 10% sur la boutique officielle',
        'Newsletter exclusive'
    ],
    premium: [
        'Tous les avantages Standard',
        'Accès aux matchs de coupe à domicile',
        'Réduction de 15% sur la boutique officielle',
        'Accès prioritaire aux billets pour les matchs à l\'extérieur'
    ],
    vip: [
        'Tous les avantages Premium',
        'Place numérotée en tribune d\'honneur',
        'Parking VIP',
        'Invitation aux rencontres avec les joueurs',
        'Cadeau de bienvenue'
    ],
    tribune: [
        'Tous les avantages VIP',
        'Accès au salon VIP',
        'Service de restauration inclus',
        'Rencontre privilégiée avec les joueurs',
        'Parking couvert sécurisé'
    ]
};

// Variables globales
let selectedMatch = null;
let selectedSeats = [];
let selectedCategory = 'standard';
let currentSport = 'football';
let cart = [];

// Configuration des places du stade
const STADIUM_SECTIONS = {
    football: {
        tribune: { rows: 10, seats: 20, available: 200, price: 20000 },
        vip: { rows: 5, seats: 15, available: 75, price: 10000 },
        premium: { rows: 10, seats: 30, available: 300, price: 5000 },
        standard: { rows: 15, seats: 40, available: 600, price: 3000 }
    },
    basketball: {
        vip: { rows: 3, seats: 10, available: 30, price: 8000 },
        premium: { rows: 5, seats: 20, available: 100, price: 4000 },
        standard: { rows: 10, seats: 30, available: 300, price: 2000 }
    }
};

// Génération des places disponibles en temps réel
function generateAvailableSeats() {
    const sections = STADIUM_SECTIONS[currentSport];
    const seats = {};
    
    Object.keys(sections).forEach(section => {
        const sectionData = sections[section];
        seats[section] = generateRandomSeats(
            sectionData.available, 
            Math.floor(Math.random() * (sectionData.available * 0.3)) // Jusqu'à 30% de places occupées
        );
    });
    
    return seats;
}

let availableSeats = generateAvailableSeats();

/**
 * Initialisation de la page de billetterie
 */
document.addEventListener('DOMContentLoaded', function() {
    // Afficher le loader
    document.querySelector('.page-loader').classList.remove('hidden');
    
    // Charger les matchs à venir
    loadUpcomingMatches()
        .then(() => {
            // Initialiser les gestionnaires d'événements
            setupEventListeners();
            
            // Initialiser les formulaires de paiement
            initPaymentForms();
            
            // Initialiser les animations au défilement
            initScrollAnimations();
            
            // Vérifier s'il y a un paramètre de match dans l'URL
            const urlParams = new URLSearchParams(window.location.search);
            const matchId = urlParams.get('match');
            
            if (matchId) {
                // Faire défiler jusqu'à la section des matchs
                setTimeout(() => {
                    const matchElement = document.getElementById(`match-${matchId}`);
                    if (matchElement) {
                        matchElement.scrollIntoView({ behavior: 'smooth' });
                        matchElement.classList.add('highlight');
                        
                        // Retirer la mise en évidence après 3 secondes
                        setTimeout(() => {
                            matchElement.classList.remove('highlight');
                        }, 3000);
                    }
                }, 500);
            }
            
            // Cacher le loader une fois tout chargé
            setTimeout(() => {
                document.querySelector('.page-loader').classList.add('hidden');
            }, 500);
        })
        .catch(error => {
            console.error('Erreur lors du chargement des matchs :', error);
            document.querySelector('.page-loader').classList.add('hidden');
            
            // Afficher un message d'erreur
            Toastify({
                text: "Erreur lors du chargement des matchs. Veuillez réessayer.",
                duration: 5000,
                gravity: "top",
                position: 'right',
                backgroundColor: "#dc3545",
                stopOnFocus: true
            }).showToast();
            
            // Afficher des données de démonstration en cas d'erreur
            renderDemoMatches('football');
            setupEventListeners();
        });
});

/**
 * Charge les prochains matchs depuis le fichier JSON local
 * @returns {Promise<Array>} Une promesse résolue avec la liste des matchs à venir
 */
async function loadUpcomingMatches() {
    const CACHE_DURATION = 5 * 60 * 1000; // 5 minutes de cache
    const CACHE_KEY = 'cotonfc_matches_cache';
    const container = document.getElementById('footballMatchesTickets');
    
    // Afficher un indicateur de chargement
    if (container) {
        container.innerHTML = `
            <div class="d-flex justify-content-center py-5">
                <div class="spinner-border text-primary" role="status">
                    <span class="visually-hidden">Chargement des matchs...</span>
                </div>
                <p class="ms-3 my-auto">Chargement des prochains matchs...</p>
            </div>`;
    }
    
    try {
        // Vérifier le cache
        const cachedData = localStorage.getItem(CACHE_KEY);
        const now = new Date().getTime();
        
        if (cachedData) {
            const { data, timestamp } = JSON.parse(cachedData);
            
            // Utiliser les données en cache si elles sont récentes
            if (now - timestamp < CACHE_DURATION && data && Array.isArray(data.matches)) {
                console.log('Utilisation des matchs en cache');
                const upcomingMatches = filterUpcomingMatches(data.matches);
                renderMatchesTickets(upcomingMatches, 'football');
                return upcomingMatches;
            }
        }
        
        // Récupérer les matchs depuis le fichier JSON local
        const response = await fetch('assets/data/football-calendar-new.json', {
            headers: {
                'Cache-Control': 'no-cache',
                'Pragma': 'no-cache'
            }
        });
        
        if (!response.ok) {
            throw new Error(`Erreur HTTP: ${response.status} - ${response.statusText}`);
        }
        
        const data = await response.json();
        
        // Valider la structure des données
        if (!data || !Array.isArray(data.matches)) {
            throw new Error('Format de données invalide: le fichier JSON doit contenir un tableau "matches"');
        }
        
        // Mettre en cache les données
        try {
            localStorage.setItem(CACHE_KEY, JSON.stringify({
                data,
                timestamp: now
            }));
        } catch (e) {
            console.warn('Impossible de mettre en cache les données des matchs:', e);
        }
        
        // Filtrer et afficher les matchs à venir
        const upcomingMatches = filterUpcomingMatches(data.matches);
        renderMatchesTickets(upcomingMatches, 'football');
        
        return upcomingMatches;
        
    } catch (error) {
        console.error('Erreur dans loadUpcomingMatches:', error);
        
        // Essayer d'utiliser les données en cache même si elles sont périmées
        try {
            const cachedData = localStorage.getItem(CACHE_KEY);
            if (cachedData) {
                const { data } = JSON.parse(cachedData);
                if (data && Array.isArray(data.matches)) {
                    console.warn('Utilisation des données en cache (périmées) en raison d\'une erreur');
                    const upcomingMatches = filterUpcomingMatches(data.matches);
                    renderMatchesTickets(upcomingMatches, 'football');
                    
                    // Afficher un avertissement
                    showToast('Données en cache utilisées (connexion limitée)', 'warning');
                    return upcomingMatches;
                }
            }
        } catch (cacheError) {
            console.error('Erreur lors de la récupération du cache:', cacheError);
        }
        
        // Afficher un message d'erreur convivial
        if (container) {
            container.innerHTML = `
                <div class="alert alert-danger">
                    <div class="d-flex align-items-center">
                        <i class="fas fa-exclamation-triangle fa-2x me-3"></i>
                        <div>
                            <h5 class="alert-heading">Erreur de chargement</h5>
                            <p class="mb-0">Impossible de charger les prochains matchs. Veuillez vérifier votre connexion et réessayer.</p>
                            ${process.env.NODE_ENV === 'development' ? 
                                `<div class="mt-2 small text-muted">${error.message}</div>` : ''}
                        </div>
                    </div>
                </div>
                <div class="text-center mt-3">
                    <button class="btn btn-outline-primary" onclick="window.location.reload()">
                        <i class="fas fa-sync-alt me-2"></i>Réessayer
                    </button>
                </div>`;
        }
        
        // Afficher des matchs de démonstration en dernier recours
        renderDemoMatches('football');
        
        // Propager l'erreur pour le catch principal
        throw new Error(`Échec du chargement des matchs: ${error.message}`);
    }
}

/**
 * Affiche une notification toast
 * @param {string} message - Message à afficher
 * @param {string} type - Type de notification (success, error, warning, info)
 */
function showToast(message, type = 'info') {
    const toastContainer = document.getElementById('toast-container') || createToastContainer();
    const toastId = 'toast-' + Date.now();
    const icon = {
        success: 'check-circle',
        error: 'exclamation-circle',
        warning: 'exclamation-triangle',
        info: 'info-circle'
    }[type] || 'info-circle';
    
    const toast = document.createElement('div');
    toast.id = toastId;
    toast.className = `toast show align-items-center text-white bg-${type} border-0`;
    toast.role = 'alert';
    toast.setAttribute('aria-live', 'assertive');
    toast.setAttribute('aria-atomic', 'true');
    
    toast.innerHTML = `
        <div class="d-flex">
            <div class="toast-body d-flex align-items-center">
                <i class="fas fa-${icon} me-2"></i>
                ${message}
            </div>
            <button type="button" class="btn-close btn-close-white me-2 m-auto" data-bs-dismiss="toast" aria-label="Fermer"></button>
        </div>`;
    
    toastContainer.appendChild(toast);
    
    // Fermer automatiquement après 5 secondes
    setTimeout(() => {
        const bsToast = new bootstrap.Toast(toast);
        toast.addEventListener('hidden.bs.toast', () => {
            toast.remove();
        });
        bsToast.hide();
    }, 5000);
}

/**
 * Crée un conteneur pour les toasts s'il n'existe pas
 * @returns {HTMLElement} Le conteneur de toasts
 */
function createToastContainer() {
    const container = document.createElement('div');
    container.id = 'toast-container';
    container.className = 'toast-container position-fixed bottom-0 end-0 p-3';
    container.style.zIndex = '1100'; // Au-dessus de la modale Bootstrap
    document.body.appendChild(container);
    return container;
}

/**
 * Affiche les matchs dans la section billetterie
 * @param {Array} matches - Liste des matchs
 * @param {string} sport - Type de sport (football ou basketball)
 */
function renderMatchesTickets(matches, sport) {
    try {
        const container = document.getElementById(`${sport}MatchesTickets`);
        if (!container) {
            console.error(`Conteneur pour les matchs de ${sport} introuvable`);
            return;
        }
        
        // Afficher un indicateur de chargement
        container.innerHTML = `
            <div class="d-flex justify-content-center py-5">
                <div class="spinner-border text-primary" role="status">
                    <span class="visually-hidden">Chargement...</span>
                </div>
            </div>`;
        
        // S'assurer que matches est un tableau
        if (!matches || !Array.isArray(matches)) {
            throw new Error('Format de données invalide pour les matchs');
        }
        
        // Filtrer pour ne garder que les matchs à venir
        const upcomingMatches = filterUpcomingMatches(matches);
        
        // Vérifier s'il y a des matchs à afficher
        if (upcomingMatches.length === 0) {
            container.innerHTML = `
                <div class="no-matches text-center py-5">
                    <div class="alert alert-info">
                        <i class="fas fa-info-circle me-2"></i>
                        Aucun match à domicile prévu pour le moment. Revenez bientôt pour découvrir les prochaines rencontres !
                    </div>
                </div>`;
            return;
        }
        
        // Limiter à 6 matchs maximum
        const matchesToShow = upcomingMatches.slice(0, 6);
        let matchesHTML = '';
        
        // Générer le HTML pour chaque match
        matchesToShow.forEach(match => {
            try {
                const isHome = match.isHome || (match.location && match.location.includes('Stade'));
                const isSoldOut = match.ticketAvailable === false || Math.random() > 0.8; // 20% de chance d'être complet
                
                if (isHome) {
                    const matchDate = match.date ? formatMatchDate(match.date) : 'Date à confirmer';
                    const matchTime = match.time || '--:--';
                    const matchLocation = match.location || 'Lieu à confirmer';
                    
                    matchesHTML += `
                        <div class="col-md-6 col-lg-4 mb-4" data-match-id="${match.id || generateMatchId(match)}" data-sport="${sport}">
                            <div class="match-card h-100">
                                <div class="match-header">
                                    <span class="badge bg-primary">${match.competition || 'Championnat'}</span>
                                    <span class="match-date">${matchDate}</span>
                                </div>
                                <div class="match-body p-3">
                                    <div class="match-teams text-center">
                                        <div class="team mb-3">
                                            <img src="${getTeamLogo(match.homeTeam)}" 
                                                 alt="${match.homeTeam}" 
                                                 class="team-logo" 
                                                 onerror="this.onerror=null; this.src='assets/images/teams/default.png'"
                                            >
                                            <div class="team-name">${match.homeTeam}</div>
                                        </div>
                                        <div class="match-vs mb-3">VS</div>
                                        <div class="team">
                                            <img src="${getTeamLogo(match.awayTeam)}" 
                                                 alt="${match.awayTeam}" 
                                                 class="team-logo"
                                                 onerror="this.onerror=null; this.src='assets/images/teams/default.png'"
                                            >
                                            <div class="team-name">${match.awayTeam}</div>
                                        </div>
                                    </div>
                                    <div class="match-info mt-3">
                                        <div class="d-flex align-items-center mb-2">
                                            <i class="far fa-clock me-2"></i>
                                            <span>${matchTime}</span>
                                        </div>
                                        <div class="d-flex align-items-center">
                                            <i class="fas fa-map-marker-alt me-2"></i>
                                            <span>${matchLocation}</span>
                                        </div>
                                    </div>
                                </div>
                                <div class="match-footer text-center p-3">
                                    <button class="btn ${isSoldOut ? 'btn-secondary' : 'btn-primary'} w-100" 
                                            onclick="openTicketSelection(this)" 
                                            ${isSoldOut ? 'disabled' : ''}>
                                        <i class="fas ${isSoldOut ? 'fa-times-circle' : 'fa-ticket-alt'} me-2"></i>
                                        ${isSoldOut ? 'COMPLET' : 'RÉSERVER DES BILLETS'}
                                    </button>
                                </div>
                            </div>
                        </div>`;
                }
            } catch (error) {
                console.error('Erreur lors du rendu d\'un match:', error, match);
            }
        });
        
        // Mettre à jour le conteneur avec les matchs
        if (matchesHTML) {
            container.innerHTML = `
                <div class="row g-4">
                    ${matchesHTML}
                </div>`;
        } else {
            container.innerHTML = `
                <div class="alert alert-warning">
                    <i class="fas fa-exclamation-triangle me-2"></i>
                    Aucun match à domicile prévu pour le moment.
                </div>`;
        }
        
        // Initialiser les tooltips Bootstrap
        if (typeof bootstrap !== 'undefined' && bootstrap.Tooltip) {
            const tooltipTriggerList = [].slice.call(container.querySelectorAll('[data-bs-toggle="tooltip"]'));
            tooltipTriggerList.map(function (tooltipTriggerEl) {
                return new bootstrap.Tooltip(tooltipTriggerEl);
            });
        }
        
    } catch (error) {
        console.error('Erreur dans renderMatchesTickets:', error);
        const container = document.getElementById(`${sport}MatchesTickets`);
        if (container) {
            container.innerHTML = `
                <div class="alert alert-danger">
                    <i class="fas fa-exclamation-triangle me-2"></i>
                    Une erreur est survenue lors du chargement des matchs. Veuillez réessayer plus tard.
                    ${process.env.NODE_ENV === 'development' ? `<div class="mt-2 small">${error.message}</div>` : ''}
                </div>`;
        }
    }
}

/**
 * Affiche des matchs de démonstration en cas d'erreur de chargement
 * @param {string} sport - Type de sport (football ou basketball)
 */
function renderDemoMatches(sport) {
    const container = document.getElementById(`${sport}MatchesTickets`);
    container.innerHTML = '';
    
    const demoMatches = [];
    
    if (sport === 'football') {
        demoMatches.push(
            {
                id: 'f1',
                homeTeam: 'Coton FC',
                awayTeam: 'AS Cotonou',
                date: new Date(2025, 5, 20),
                time: '16:00',
                competition: 'Championnat National',
                location: 'Stade Charles de Gaulle'
            },
            {
                id: 'f2',
                homeTeam: 'Coton FC',
                awayTeam: 'Dadje FC',
                date: new Date(2025, 5, 27),
                time: '15:00',
                competition: 'Coupe du Bénin',
                location: 'Stade Charles de Gaulle'
            },
            {
                id: 'f3',
                homeTeam: 'Coton FC',
                awayTeam: 'Energie FC',
                date: new Date(2025, 6, 5),
                time: '17:30',
                competition: 'Championnat National',
                location: 'Stade Charles de Gaulle'
            }
        );
    } else {
        demoMatches.push(
            {
                id: 'b1',
                homeTeam: 'Elan Coton BC',
                awayTeam: 'Espoir BC',
                date: new Date(2025, 5, 22),
                time: '19:00',
                competition: 'Championnat National',
                location: 'Palais des Sports'
            },
            {
                id: 'b2',
                homeTeam: 'Elan Coton BC',
                awayTeam: 'Phénix BC',
                date: new Date(2025, 5, 29),
                time: '18:30',
                competition: 'Coupe du Bénin',
                location: 'Palais des Sports'
            }
        );
    }
    
    renderMatchesTickets(demoMatches, sport);
}

/**
 * Filtre les matchs pour ne garder que ceux à venir
 * @param {Array} matches - Liste des matchs
 * @returns {Array} - Liste des matchs à venir
 */
function filterUpcomingMatches(matches) {
    if (!matches || !Array.isArray(matches)) {
        console.error('filterUpcomingMatches: Paramètre invalide, tableau attendu');
        return [];
    }
    
    const today = new Date();
    today.setHours(0, 0, 0, 0); // Réinitialiser l'heure à minuit pour la comparaison
    
    return matches.filter(match => {
        try {
            if (!match || !match.date) return false;
            
            // Gérer à la fois les chaînes de caractères et les objets Date
            const matchDate = new Date(match.date);
            
            // Vérifier si la date est valide
            if (isNaN(matchDate.getTime())) {
                console.warn('Date de match invalide:', match.date, 'pour le match', match.id || match.homeTeam + ' vs ' + match.awayTeam);
                return false;
            }
            
            // Réinitialiser l'heure à minuit pour la comparaison
            const matchDateOnly = new Date(matchDate);
            matchDateOnly.setHours(0, 0, 0, 0);
            
            return matchDateOnly >= today;
        } catch (error) {
            console.error('Erreur lors du filtrage des matchs:', error, match);
            return false;
        }
    }).sort((a, b) => {
        // Trier par date croissante
        return new Date(a.date) - new Date(b.date);
    });
}

/**
 * Formate la date d'un match
 * @param {string|Date} dateStr - Date du match
 * @returns {string} - Date formatée
 */
function formatMatchDate(dateStr) {
    const date = new Date(dateStr);
    const options = { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' };
    
    return date.toLocaleDateString('fr-FR', options).replace(/^\w/, c => c.toUpperCase());
}

/**
 * Récupère le logo d'une équipe
 * @param {string} teamName - Nom de l'équipe
 * @returns {string} - URL du logo
 */
function getTeamLogo(teamName) {
    // À remplacer par une logique de récupération des logos réels
    if (teamName.includes('Coton')) {
        return 'assets/images/logo.png';
    }
    
    // Logo générique pour les autres équipes
    return 'https://via.placeholder.com/70?text=' + teamName.substring(0, 2);
}

/**
 * Génère un identifiant unique pour un match
 * @param {Object} match - Données du match
 * @returns {string} - Identifiant unique
 */
function generateMatchId(match) {
    const dateStr = new Date(match.date).toISOString().split('T')[0];
    return `match-${match.homeTeam.substring(0, 3)}-${match.awayTeam.substring(0, 3)}-${dateStr}`;
}

/**
 * Ouvre la modal de sélection des places
 * @param {HTMLElement} button - Bouton cliqué
 */
function openTicketSelection(button) {
    const matchCard = button.closest('.match-card');
    const matchId = matchCard.getAttribute('data-match-id');
    const sport = matchCard.getAttribute('data-sport');
    
    // Récupération des informations du match
    const matchHeader = matchCard.querySelector('.match-header');
    const matchTeams = matchCard.querySelector('.match-teams');
    const matchInfo = matchCard.querySelector('.match-info');
    
    // Stockage des informations du match sélectionné
    selectedMatch = {
        id: matchId,
        sport: sport,
        competition: matchHeader.querySelector('.competition').textContent,
        date: matchHeader.querySelector('.match-date').textContent,
        homeTeam: matchTeams.querySelector('.team:first-child .team-name').textContent,
        awayTeam: matchTeams.querySelector('.team:last-child .team-name').textContent,
        location: matchInfo.querySelector('.info-item:first-child span').textContent,
        time: matchInfo.querySelector('.info-item:last-child span').textContent
    };
    
    currentSport = sport;
    
    // Mise à jour des prix selon le sport
    updateTicketPrices();
    
    // Affichage des détails du match dans la modal
    document.getElementById('modalMatchDetails').innerHTML = `
        <div class="match-title">${selectedMatch.homeTeam} vs ${selectedMatch.awayTeam}</div>
        <div class="match-subtitle">${selectedMatch.competition} | ${selectedMatch.date} à ${selectedMatch.time}</div>
    `;
    
    // Réinitialisation de la sélection
    selectedSeats = [];
    selectedCategory = 'standard';
    updateSelectedSeatsDisplay();
    
    // Génération du plan du stade
    generateStadiumMap();
    
    // Ouverture de la modal
    const modal = new bootstrap.Modal(document.getElementById('seatSelectionModal'));
    modal.show();
}

/**
 * Met à jour les prix des billets selon le sport sélectionné
 */
function updateTicketPrices() {
    const categoryItems = document.querySelectorAll('.category-item');
    
    categoryItems.forEach(item => {
        const categoryName = item.querySelector('.category-name').textContent.toLowerCase();
        const priceElement = item.querySelector('.category-price');
        
        if (priceElement) {
            priceElement.textContent = `${TICKET_PRICES[currentSport][categoryName]} FCFA`;
        }
    });
}

/**
 * Sélectionne une catégorie de billets
 * @param {string} category - Catégorie sélectionnée
 */
function selectCategory(category) {
    selectedCategory = category;
    
    // Mise à jour visuelle de la catégorie sélectionnée
    document.querySelectorAll('.category-item').forEach(item => {
        item.classList.remove('active');
    });
    
    document.querySelector(`.category-item[onclick="selectCategory('${category}')"]`).classList.add('active');
    
    // Mise à jour du plan du stade
    generateStadiumMap();
}

/**
 * Génère le plan du stade avec les places disponibles
 */
function generateStadiumMap() {
    const stadiumMap = document.getElementById('stadiumMap');
    stadiumMap.innerHTML = '';
    
    // Création du conteneur pour les sièges
    const seatsContainer = document.createElement('div');
    seatsContainer.className = 'seats-container';
    
    // Génération des sièges selon la catégorie sélectionnée
    const seats = availableSeats[selectedCategory];
    
    // Création de la scène (terrain)
    const field = document.createElement('div');
    field.className = 'stadium-field';
    field.innerHTML = '<div class="field-label">TERRAIN</div>';
    stadiumMap.appendChild(field);
    
    // Création des rangées de sièges
    const rows = Math.ceil(seats.length / 10);
    
    for (let i = 0; i < rows; i++) {
        const row = document.createElement('div');
        row.className = 'seat-row';
        
        // Étiquette de rangée
        const rowLabel = document.createElement('div');
        rowLabel.className = 'row-label';
        rowLabel.textContent = String.fromCharCode(65 + i); // A, B, C, etc.
        row.appendChild(rowLabel);
        
        // Sièges de la rangée
        for (let j = 0; j < 10; j++) {
            const seatIndex = i * 10 + j;
            
            if (seatIndex < seats.length) {
                const seat = document.createElement('div');
                seat.className = `stadium-seat ${seats[seatIndex].status}`;
                seat.setAttribute('data-seat-id', `${selectedCategory}-${String.fromCharCode(65 + i)}${j + 1}`);
                seat.setAttribute('data-row', String.fromCharCode(65 + i));
                seat.setAttribute('data-number', j + 1);
                
                // Ajouter un gestionnaire d'événements uniquement pour les sièges disponibles
                if (seats[seatIndex].status === 'available') {
                    seat.addEventListener('click', function() {
                        toggleSeatSelection(this);
                    });
                }
                
                row.appendChild(seat);
            }
        }
        
        seatsContainer.appendChild(row);
    }
    
    stadiumMap.appendChild(seatsContainer);
}

/**
 * Bascule la sélection d'un siège
 * @param {HTMLElement} seatElement - Élément du siège
 */
function toggleSeatSelection(seatElement) {
    const seatId = seatElement.getAttribute('data-seat-id');
    const row = seatElement.getAttribute('data-row');
    const number = seatElement.getAttribute('data-number');
    
    // Vérifier si le siège est déjà sélectionné
    const seatIndex = selectedSeats.findIndex(seat => seat.id === seatId);
    
    if (seatIndex === -1) {
        // Ajouter le siège à la sélection
        seatElement.classList.remove('available');
        seatElement.classList.add('selected');
        
        selectedSeats.push({
            id: seatId,
            category: selectedCategory,
            row: row,
            number: number,
            price: TICKET_PRICES[currentSport][selectedCategory]
        });
    } else {
        // Retirer le siège de la sélection
        seatElement.classList.remove('selected');
        seatElement.classList.add('available');
        
        selectedSeats.splice(seatIndex, 1);
    }
    
    // Mettre à jour l'affichage des sièges sélectionnés
    updateSelectedSeatsDisplay();
}

/**
 * Met à jour l'affichage des sièges sélectionnés
 */
function updateSelectedSeatsDisplay() {
    const summaryElement = document.getElementById('selectedSeatsSummary');
    
    if (selectedSeats.length === 0) {
        summaryElement.innerHTML = '<p>Aucune place sélectionnée</p>';
        return;
    }
    
    let totalPrice = 0;
    let summaryHTML = `
        <h4>Places sélectionnées</h4>
        <ul class="selected-seats-list">
    `;
    
    selectedSeats.forEach(seat => {
        summaryHTML += `
            <li>
                <span>Siège ${seat.row}${seat.number} (${capitalizeFirstLetter(seat.category)})</span>
                <span>${seat.price} FCFA</span>
            </li>
        `;
        
        totalPrice += seat.price;
    });
    
    summaryHTML += `
        </ul>
        <div class="selected-seats-total">
            <span>Total</span>
            <span>${totalPrice} FCFA</span>
        </div>
    `;
    
    summaryElement.innerHTML = summaryHTML;
}

/**
 * Passe à l'étape de paiement
 */
function proceedToCheckout() {
    if (selectedSeats.length === 0) {
        alert('Veuillez sélectionner au moins une place.');
        return;
    }
    
    // Fermer la modal de sélection des places
    const seatModal = bootstrap.Modal.getInstance(document.getElementById('seatSelectionModal'));
    seatModal.hide();
    
    // Préparer le résumé de la commande
    let totalPrice = 0;
    let summaryHTML = `
        <div class="checkout-summary-header">
            <div class="match-info">${selectedMatch.homeTeam} vs ${selectedMatch.awayTeam}</div>
            <div class="ticket-count">${selectedSeats.length} billet(s)</div>
        </div>
        <div class="checkout-summary-items">
    `;
    
    selectedSeats.forEach(seat => {
        summaryHTML += `
            <div class="checkout-item">
                <span>Siège ${seat.row}${seat.number} (${capitalizeFirstLetter(seat.category)})</span>
                <span>${seat.price} FCFA</span>
            </div>
        `;
        
        totalPrice += seat.price;
    });
    
    summaryHTML += `
        </div>
        <div class="checkout-total">
            <span>Total</span>
            <span>${totalPrice} FCFA</span>
        </div>
    `;
    
    document.getElementById('checkoutSummary').innerHTML = summaryHTML;
    
    // Ouvrir la modal de paiement
    const checkoutModal = new bootstrap.Modal(document.getElementById('checkoutModal'));
    checkoutModal.show();
}

/**
 * Finalise le paiement et affiche la confirmation
 */
function completePayment() {
    // Validation du formulaire
    const form = document.getElementById('checkoutForm');
    
    if (!form.checkValidity()) {
        form.reportValidity();
        return;
    }
    
    // Simuler un traitement de paiement
    const checkoutModal = bootstrap.Modal.getInstance(document.getElementById('checkoutModal'));
    checkoutModal.hide();
    
    // Générer une référence de commande
    const orderReference = generateOrderReference();
    document.getElementById('orderReference').textContent = orderReference;
    
    // Afficher la modal de confirmation
    const confirmationModal = new bootstrap.Modal(document.getElementById('confirmationModal'));
    confirmationModal.show();
    
    // Réinitialiser les sélections
    selectedSeats = [];
    selectedMatch = null;
}

/**
 * Sélectionne un abonnement
 * @param {string} type - Type d'abonnement
 */
function selectSubscription(type) {
    // Simuler une sélection d'abonnement
    const subscriptionData = {
        type: type,
        price: SUBSCRIPTION_PRICES[type],
        name: capitalizeFirstLetter(type)
    };
    
    // Préparer le résumé de la commande
    const summaryHTML = `
        <div class="checkout-summary-header">
            <div class="match-info">Abonnement ${subscriptionData.name}</div>
            <div class="ticket-count">Saison 2024-2025</div>
        </div>
        <div class="checkout-summary-items">
            <div class="checkout-item">
                <span>Abonnement ${subscriptionData.name}</span>
                <span>${subscriptionData.price} FCFA</span>
            </div>
        </div>
        <div class="checkout-total">
            <span>Total</span>
            <span>${subscriptionData.price} FCFA</span>
        </div>
    `;
    
    document.getElementById('checkoutSummary').innerHTML = summaryHTML;
    
    // Ouvrir la modal de paiement
    const checkoutModal = new bootstrap.Modal(document.getElementById('checkoutModal'));
    checkoutModal.show();
}

/**
 * Initialise les formulaires de paiement
 */
function initPaymentForms() {
    // Basculer entre les méthodes de paiement
    document.getElementById('paymentCard').addEventListener('change', function() {
        document.getElementById('cardPaymentForm').style.display = 'block';
        document.getElementById('mobilePaymentForm').style.display = 'none';
    });
    
    document.getElementById('paymentMobile').addEventListener('change', function() {
        document.getElementById('cardPaymentForm').style.display = 'none';
        document.getElementById('mobilePaymentForm').style.display = 'block';
    });
}

/**
 * Configure les gestionnaires d'événements
 */
function setupEventListeners() {
    // Défilement fluide pour les liens d'ancrage
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            e.preventDefault();
            
            const targetId = this.getAttribute('href');
            const targetElement = document.querySelector(targetId);
            
            if (targetElement) {
                window.scrollTo({
                    top: targetElement.offsetTop - 100,
                    behavior: 'smooth'
                });
            }
        });
    });
}

/**
 * Initialise les animations au défilement
 */
function initScrollAnimations() {
    // Animation des cartes au défilement
    const animateOnScroll = () => {
        const elements = document.querySelectorAll('.match-card, .subscription-card');
        
        elements.forEach(element => {
            const elementPosition = element.getBoundingClientRect().top;
            const screenPosition = window.innerHeight / 1.2;
            
            if (elementPosition < screenPosition) {
                element.style.opacity = '1';
                element.style.transform = 'translateY(0)';
            }
        });
    };
    
    // Initialiser les éléments avec une opacité de 0
    document.querySelectorAll('.match-card, .subscription-card').forEach(element => {
        element.style.opacity = '0';
        element.style.transform = 'translateY(20px)';
        element.style.transition = 'opacity 0.5s ease, transform 0.5s ease';
    });
    
    // Ajouter l'événement de défilement
    window.addEventListener('scroll', animateOnScroll);
    
    // Déclencher une fois au chargement
    animateOnScroll();
}

/**
 * Génère une référence de commande unique
 * @returns {string} - Référence de commande
 */
function generateOrderReference() {
    const date = new Date();
    const timestamp = date.getTime().toString().slice(-6);
    const random = Math.floor(Math.random() * 10000).toString().padStart(4, '0');
    
    return `COTON-${timestamp}${random}`;
}

/**
 * Génère aléatoirement des sièges disponibles ou occupés
 * @param {number} total - Nombre total de sièges
 * @param {number} occupied - Nombre de sièges occupés
 * @returns {Array} - Liste des sièges avec leur statut
 */
function generateRandomSeats(total, occupied) {
    const seats = [];
    
    // Créer tous les sièges comme disponibles
    for (let i = 0; i < total; i++) {
        seats.push({ id: i, status: 'available' });
    }
    
    // Marquer aléatoirement certains sièges comme occupés
    const occupiedIndices = [];
    while (occupiedIndices.length < occupied) {
        const index = Math.floor(Math.random() * total);
        if (!occupiedIndices.includes(index)) {
            occupiedIndices.push(index);
            seats[index].status = 'occupied';
        }
    }
    
    return seats;
}

/**
 * Met en majuscule la première lettre d'une chaîne
 * @param {string} string - Chaîne à formater
 * @returns {string} - Chaîne formatée
 */
function capitalizeFirstLetter(string) {
    return string.charAt(0).toUpperCase() + string.slice(1);
}
