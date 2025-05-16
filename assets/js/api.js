/**
 * API pour récupérer dynamiquement les données des matchs
 * @author Coton Sport
 */

// Configuration des URLs des API (à remplacer par les vraies URLs quand disponibles)
const API_CONFIG = {
    football: {
        results: 'assets/data/football-results.json',
        calendar: 'assets/data/football-calendar.json',
        standings: 'assets/data/football-standings.json'
    },
    basketball: {
        results: 'assets/data/basketball-results.json',
        calendar: 'assets/data/basketball-calendar.json',
        standings: 'assets/data/basketball-standings.json'
    }
};

/**
 * Récupère les données depuis une API ou un fichier JSON
 * @param {string} url - L'URL de l'API ou du fichier JSON
 * @returns {Promise} - Une promesse contenant les données
 */
async function fetchData(url) {
    try {
        const response = await fetch(url);
        if (!response.ok) {
            throw new Error(`Erreur HTTP: ${response.status}`);
        }
        return await response.json();
    } catch (error) {
        console.error(`Erreur lors de la récupération des données: ${error.message}`);
        return null;
    }
}

/**
 * Récupère les résultats des matchs de football
 * @returns {Promise} - Une promesse contenant les résultats
 */
async function getFootballResults() {
    return await fetchData(API_CONFIG.football.results);
}

/**
 * Récupère le calendrier des matchs de football
 * @returns {Promise} - Une promesse contenant le calendrier
 */
async function getFootballCalendar() {
    return await fetchData(API_CONFIG.football.calendar);
}

/**
 * Récupère le classement de l'équipe de football
 * @returns {Promise} - Une promesse contenant le classement
 */
async function getFootballStandings() {
    return await fetchData(API_CONFIG.football.standings);
}

/**
 * Récupère les résultats des matchs de basketball
 * @returns {Promise} - Une promesse contenant les résultats
 */
async function getBasketballResults() {
    return await fetchData(API_CONFIG.basketball.results);
}

/**
 * Récupère le calendrier des matchs de basketball
 * @returns {Promise} - Une promesse contenant le calendrier
 */
async function getBasketballCalendar() {
    return await fetchData(API_CONFIG.basketball.calendar);
}

/**
 * Récupère le classement de l'équipe de basketball
 * @returns {Promise} - Une promesse contenant le classement
 */
async function getBasketballStandings() {
    return await fetchData(API_CONFIG.basketball.standings);
}

/**
 * Génère le HTML pour un résultat de match de football
 * @param {Object} match - Les données du match
 * @returns {string} - Le HTML généré
 */
function generateFootballResultHTML(match) {
    return `
    <div class="match-row">
        <div class="col date">
            <span class="day">${new Date(match.date).getDate()}</span>
            <span class="month-year">${new Date(match.date).toLocaleDateString('fr-FR', { month: 'short', year: 'numeric' })}</span>
        </div>
        <div class="col competition">
            <span class="badge">${match.competition}</span>
        </div>
        <div class="col match">
            <div class="teams">
                <span class="team home">${match.homeTeam}</span>
                <span class="score">${match.homeScore} - ${match.awayScore}</span>
                <span class="team away">${match.awayTeam}</span>
            </div>
        </div>
        <div class="col venue">${match.venue}</div>
        <div class="col more">
            <a href="${match.detailsLink}" class="details-link">Détails</a>
        </div>
    </div>
    `;
}

/**
 * Génère le HTML pour un match à venir de football
 * @param {Object} match - Les données du match
 * @returns {string} - Le HTML généré
 */
function generateFootballFixtureHTML(match) {
    return `
    <div class="match-row">
        <div class="col date">
            <span class="day">${new Date(match.date).getDate()}</span>
            <span class="month-year">${new Date(match.date).toLocaleDateString('fr-FR', { month: 'short', year: 'numeric' })}</span>
        </div>
        <div class="col competition">
            <span class="badge">${match.competition}</span>
        </div>
        <div class="col match">
            <div class="teams">
                <span class="team home">${match.homeTeam}</span>
                <span class="score">vs</span>
                <span class="team away">${match.awayTeam}</span>
            </div>
        </div>
        <div class="col venue">${match.venue}</div>
        <div class="col more">
            <a href="${match.ticketLink}" class="details-link">${match.ticketAvailable ? 'Billets' : 'Détails'}</a>
        </div>
    </div>
    `;
}

/**
 * Génère le HTML pour un résultat de match de basketball
 * @param {Object} match - Les données du match
 * @returns {string} - Le HTML généré
 */
function generateBasketballResultHTML(match) {
    return `
    <div class="match-row">
        <div class="col date">
            <span class="day">${new Date(match.date).getDate()}</span>
            <span class="month-year">${new Date(match.date).toLocaleDateString('fr-FR', { month: 'short', year: 'numeric' })}</span>
        </div>
        <div class="col competition">
            <span class="badge">${match.competition}</span>
        </div>
        <div class="col match">
            <div class="teams">
                <span class="team home">${match.homeTeam}</span>
                <span class="score">${match.homeScore} - ${match.awayScore}</span>
                <span class="team away">${match.awayTeam}</span>
            </div>
        </div>
        <div class="col venue">${match.venue}</div>
        <div class="col more">
            <a href="${match.detailsLink}" class="details-link">Détails</a>
        </div>
    </div>
    `;
}

/**
 * Génère le HTML pour un match à venir de basketball
 * @param {Object} match - Les données du match
 * @returns {string} - Le HTML généré
 */
function generateBasketballFixtureHTML(match) {
    return `
    <div class="match-row">
        <div class="col date">
            <span class="day">${new Date(match.date).getDate()}</span>
            <span class="month-year">${new Date(match.date).toLocaleDateString('fr-FR', { month: 'short', year: 'numeric' })}</span>
        </div>
        <div class="col competition">
            <span class="badge">${match.competition}</span>
        </div>
        <div class="col match">
            <div class="teams">
                <span class="team home">${match.homeTeam}</span>
                <span class="score">vs</span>
                <span class="team away">${match.awayTeam}</span>
            </div>
        </div>
        <div class="col venue">${match.venue}</div>
        <div class="col more">
            <a href="${match.ticketLink}" class="details-link">${match.ticketAvailable ? 'Billets' : 'Détails'}</a>
        </div>
    </div>
    `;
}

/**
 * Met à jour la section des résultats de football
 */
async function updateFootballResults() {
    const resultsContainer = document.querySelector('#football-matches .matches-table');
    if (!resultsContainer) return;
    
    const headerHTML = `
    <div class="table-header">
        <div class="col date">DATE</div>
        <div class="col competition">COMPÉTITION</div>
        <div class="col match">MATCH</div>
        <div class="col venue">LIEU</div>
        <div class="col more">PLUS</div>
    </div>
    `;
    
    try {
        const results = await getFootballResults();
        if (!results || !results.matches) {
            throw new Error('Données de résultats non disponibles');
        }
        
        let html = headerHTML;
        results.matches.forEach(match => {
            html += generateFootballResultHTML(match);
        });
        
        // Ajouter le classement
        if (results.standings) {
            html += `
            <div class="standing">
                <h3>CLASSEMENT ${results.standings.competition}</h3>
                <div class="standing-info">
                    <div class="standing-position">${results.standings.position}<sup>${results.standings.position === 1 ? 'er' : 'e'}</sup></div>
                    <div class="standing-details">
                        <div class="standing-points">${results.standings.points} pts</div>
                        <div class="standing-stats">${results.standings.stats}</div>
                    </div>
                </div>
            </div>
            `;
        }
        
        resultsContainer.innerHTML = html;
    } catch (error) {
        console.error(`Erreur lors de la mise à jour des résultats de football: ${error.message}`);
    }
}

/**
 * Met à jour la section du calendrier de football
 */
async function updateFootballCalendar() {
    const calendarContainer = document.querySelector('#football-matches .matches-calendar');
    if (!calendarContainer) return;
    
    const headerHTML = `
    <div class="table-header">
        <div class="col date">DATE</div>
        <div class="col competition">COMPÉTITION</div>
        <div class="col match">MATCH</div>
        <div class="col venue">LIEU</div>
        <div class="col more">PLUS</div>
    </div>
    `;
    
    try {
        const calendar = await getFootballCalendar();
        if (!calendar || !calendar.matches) {
            throw new Error('Données de calendrier non disponibles');
        }
        
        let html = headerHTML;
        calendar.matches.forEach(match => {
            html += generateFootballFixtureHTML(match);
        });
        
        calendarContainer.innerHTML = html;
    } catch (error) {
        console.error(`Erreur lors de la mise à jour du calendrier de football: ${error.message}`);
    }
}

/**
 * Met à jour la section des résultats de basketball
 */
async function updateBasketballResults() {
    const resultsContainer = document.querySelector('#basketball-matches .matches-table');
    if (!resultsContainer) return;
    
    const headerHTML = `
    <div class="table-header">
        <div class="col date">DATE</div>
        <div class="col competition">COMPÉTITION</div>
        <div class="col match">MATCH</div>
        <div class="col venue">LIEU</div>
        <div class="col more">PLUS</div>
    </div>
    `;
    
    try {
        const results = await getBasketballResults();
        if (!results || !results.matches) {
            throw new Error('Données de résultats non disponibles');
        }
        
        let html = headerHTML;
        results.matches.forEach(match => {
            html += generateBasketballResultHTML(match);
        });
        
        // Ajouter le classement
        if (results.standings) {
            html += `
            <div class="standing">
                <h3>CLASSEMENT ${results.standings.competition}</h3>
                <div class="standing-info">
                    <div class="standing-position">${results.standings.position}<sup>${results.standings.position === 1 ? 'er' : 'e'}</sup></div>
                    <div class="standing-details">
                        <div class="standing-points">${results.standings.points} pts</div>
                        <div class="standing-stats">${results.standings.stats}</div>
                    </div>
                </div>
            </div>
            `;
        }
        
        resultsContainer.innerHTML = html;
    } catch (error) {
        console.error(`Erreur lors de la mise à jour des résultats de basketball: ${error.message}`);
    }
}

/**
 * Met à jour la section du calendrier de basketball
 */
async function updateBasketballCalendar() {
    const calendarContainer = document.querySelector('#basketball-matches .matches-calendar');
    if (!calendarContainer) return;
    
    const headerHTML = `
    <div class="table-header">
        <div class="col date">DATE</div>
        <div class="col competition">COMPÉTITION</div>
        <div class="col match">MATCH</div>
        <div class="col venue">LIEU</div>
        <div class="col more">PLUS</div>
    </div>
    `;
    
    try {
        const calendar = await getBasketballCalendar();
        if (!calendar || !calendar.matches) {
            throw new Error('Données de calendrier non disponibles');
        }
        
        let html = headerHTML;
        calendar.matches.forEach(match => {
            html += generateBasketballFixtureHTML(match);
        });
        
        calendarContainer.innerHTML = html;
    } catch (error) {
        console.error(`Erreur lors de la mise à jour du calendrier de basketball: ${error.message}`);
    }
}

/**
 * Initialise les données dynamiques
 */
function initDynamicData() {
    // Mise à jour des résultats et calendriers au chargement de la page
    updateFootballResults();
    updateFootballCalendar();
    updateBasketballResults();
    updateBasketballCalendar();
    
    // Mise à jour automatique toutes les 5 minutes (300000 ms)
    setInterval(() => {
        updateFootballResults();
        updateFootballCalendar();
        updateBasketballResults();
        updateBasketballCalendar();
    }, 300000);
}

// Exporter les fonctions pour les rendre accessibles depuis d'autres fichiers
window.cotonSportAPI = {
    getFootballResults,
    getFootballCalendar,
    getFootballStandings,
    getBasketballResults,
    getBasketballCalendar,
    getBasketballStandings,
    initDynamicData
};
