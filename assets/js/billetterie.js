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
 * Charge les prochains matchs depuis l'API
 * @returns {Promise} Une promesse résolue lorsque les matchs sont chargés
 */
async function loadUpcomingMatches() {
    try {
        // Récupérer les matchs depuis le fichier JSON local
        const response = await fetch('assets/data/football-calendar-new.json');
        
        if (!response.ok) {
            throw new Error('Erreur lors du chargement des matchs');
        }
        
        const data = await response.json();
        
        if (!data || !data.matches || !Array.isArray(data.matches)) {
            throw new Error('Format de données invalide');
        }
        
        // Filtrer les matchs à venir
        const upcomingMatches = filterUpcomingMatches(data.matches);
        
        // Afficher les matchs dans l'interface
        if (upcomingMatches.length > 0) {
            renderMatchesTickets(upcomingMatches, 'football');
        } else {
            // Aucun match à venir, afficher un message
            const container = document.getElementById('matchs-football');
            if (container) {
                container.innerHTML = `
                    <div class="container">
                        <div class="section-header">
                            <h2>PROCHAINS MATCHS</h2>
                            <p>Découvrez les prochaines rencontres à domicile</p>
                        </div>
                        <div class="alert alert-info">
                            <i class="fas fa-info-circle me-2"></i>
                            Aucun match à venir pour le moment. Revenez plus tard pour découvrir les prochaines rencontres.
                        </div>
                    </div>
                `;
            }
        }
        
        return upcomingMatches;
    } catch (error) {
        console.error('Erreur dans loadUpcomingMatches:', error);
        
        // Afficher un message d'erreur
        const container = document.getElementById('matchs-football');
        if (container) {
            container.innerHTML = `
                <div class="container">
                    <div class="alert alert-danger">
                        <i class="fas fa-exclamation-triangle me-2"></i>
                        Une erreur est survenue lors du chargement des matchs. Veuillez réessayer plus tard.
                        <div class="mt-2 small">${error.message}</div>
                    </div>
                </div>
            `;
        }
        
        // Afficher des matchs de démonstration en cas d'erreur
        renderDemoMatches('football');
        throw error; // Propager l'erreur pour le catch principal
    }
}

/**
 * Affiche les matchs dans la section billetterie
 * @param {Array} matches - Liste des matchs
 * @param {string} sport - Type de sport (football ou basketball)
 */
function renderMatchesTickets(matches, sport) {
    const container = document.getElementById(`${sport}MatchesTickets`);
    container.innerHTML = '';
    
    // Filtrer pour ne garder que les matchs à venir
    const upcomingMatches = filterUpcomingMatches(matches);
    
    if (upcomingMatches.length === 0) {
        container.innerHTML = `<div class="no-matches">
            <p>Aucun match à venir pour le moment. Revenez bientôt !</p>
        </div>`;
        return;
    }
    
    // Limiter à 6 matchs maximum
    const matchesToShow = upcomingMatches.slice(0, 6);
    
    matchesToShow.forEach(match => {
        const isHome = match.isHome || match.location.includes('Stade');
        const isSoldOut = Math.random() > 0.8; // Simulation de matchs complets (20% de chance)
        
        if (isHome) {
            const matchCard = document.createElement('div');
            matchCard.className = 'match-card';
            matchCard.setAttribute('data-match-id', match.id || generateMatchId(match));
            matchCard.setAttribute('data-sport', sport);
            
            matchCard.innerHTML = `
                <div class="match-header">
                    <div class="competition">${match.competition || 'Championnat'}</div>
                    <div class="match-date">${formatMatchDate(match.date)}</div>
                </div>
                <div class="match-content">
                    <div class="match-teams">
                        <div class="team">
                            <img src="${getTeamLogo(match.homeTeam)}" alt="${match.homeTeam}" class="team-logo">
                            <div class="team-name">${match.homeTeam}</div>
                        </div>
                        <div class="match-vs">VS</div>
                        <div class="team">
                            <img src="${getTeamLogo(match.awayTeam)}" alt="${match.awayTeam}" class="team-logo">
                            <div class="team-name">${match.awayTeam}</div>
                        </div>
                    </div>
                    <div class="match-info">
                        <div class="info-item">
                            <i class="fas fa-map-marker-alt"></i>
                            <span>${match.location || 'Stade Charles de Gaulle'}</span>
                        </div>
                        <div class="info-item">
                            <i class="far fa-clock"></i>
                            <span>${match.time || '15:00'}</span>
                        </div>
                    </div>
                    <div class="match-actions">
                        <button class="btn-tickets ${isSoldOut ? 'sold-out' : ''}" 
                                onclick="openTicketSelection(this)" 
                                ${isSoldOut ? 'disabled' : ''}>
                            ${isSoldOut ? 'COMPLET' : 'RÉSERVER DES BILLETS'}
                        </button>
                    </div>
                </div>
            `;
            
            container.appendChild(matchCard);
        }
    });
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
    const today = new Date();
    
    return matches.filter(match => {
        const matchDate = new Date(match.date);
        return matchDate >= today;
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
