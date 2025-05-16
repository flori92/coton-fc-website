const fs = require('fs');
const path = require('path');
const https = require('https');

// Créer le dossier des images s'il n'existe pas
const imagesDir = path.join(__dirname, 'assets', 'images', 'boutique');
if (!fs.existsSync(imagesDir)) {
    fs.mkdirSync(imagesDir, { recursive: true });
}

// Liste des images à télécharger avec leurs URLs
const images = [
    {
        url: 'https://example.com/images/echarpe-officielle.jpg',
        filename: 'echarpe-officielle.jpg'
    },
    {
        url: 'https://example.com/images/casquette-officielle.jpg',
        filename: 'casquette-officielle.jpg'
    },
    {
        url: 'https://example.com/images/gourde-isotherme.jpg',
        filename: 'gourde-isotherme.jpg'
    },
    {
        url: 'https://example.com/images/porte-cles-metal.jpg',
        filename: 'porte-cles-metal.jpg'
    },
    {
        url: 'https://example.com/images/tasse-officielle.jpg',
        filename: 'tasse-officielle.jpg'
    },
    {
        url: 'https://example.com/images/sac-sport.jpg',
        filename: 'sac-sport.jpg'
    },
    {
        url: 'https://example.com/images/bonnet-officiel.jpg',
        filename: 'bonnet-officiel.jpg'
    },
    {
        url: 'https://example.com/images/epinglette.jpg',
        filename: 'epinglette.jpg'
    }
];

// Fonction pour télécharger une image
function downloadImage(url, filepath) {
    return new Promise((resolve, reject) => {
        const file = fs.createWriteStream(filepath);
        
        https.get(url, response => {
            response.pipe(file);
            
            file.on('finish', () => {
                file.close();
                console.log(`Téléchargement terminé: ${path.basename(filepath)}`);
                resolve();
            });
        }).on('error', error => {
            fs.unlink(filepath, () => {}); // Supprimer le fichier en cas d'erreur
            console.error(`Erreur lors du téléchargement de ${url}:`, error.message);
            reject(error);
        });
    });
}

// Télécharger toutes les images
async function downloadAllImages() {
    console.log('Début du téléchargement des images...');
    
    for (const image of images) {
        const filepath = path.join(imagesDir, image.filename);
        
        // Vérifier si le fichier existe déjà
        if (fs.existsSync(filepath)) {
            console.log(`L'image existe déjà: ${image.filename}`);
            continue;
        }
        
        try {
            await downloadImage(image.url, filepath);
        } catch (error) {
            console.error(`Échec du téléchargement de ${image.filename}:`, error.message);
        }
    }
    
    console.log('Téléchargement des images terminé.');
}

// Exécuter le téléchargement
downloadAllImages().catch(console.error);
