const fs = require('fs');
const https = require('https');
const path = require('path');

// Créer le dossier s'il n'existe pas
const imageDir = path.join(__dirname, 'cotonfc', 'assets', 'images', 'boutique');
if (!fs.existsSync(imageDir)) {
    fs.mkdirSync(imageDir, { recursive: true });
}

// URLs des images à télécharger
const images = [
    {
        url: 'https://example.com/maillot-domicile-2025.jpg', // Remplacez par une URL réelle
        filename: 'maillot-domicile-2025.jpg'
    },
    {
        url: 'https://example.com/maillot-exterieur-2025.jpg', // Remplacez par une URL réelle
        filename: 'maillot-exterieur-2025.jpg'
    },
    {
        url: 'https://example.com/maillot-third-2025.jpg', // Remplacez par une URL réelle
        filename: 'maillot-third-2025.jpg'
    },
    {
        url: 'https://example.com/maillot-elan-home-2025.jpg', // Remplacez par une URL réelle
        filename: 'maillot-elan-home-2025.jpg'
    }
];

// Fonction pour télécharger une image
function downloadImage(url, filename) {
    return new Promise((resolve, reject) => {
        const file = fs.createWriteStream(path.join(imageDir, filename));
        
        https.get(url, response => {
            response.pipe(file);
            
            file.on('finish', () => {
                file.close();
                console.log(`Téléchargement terminé: ${filename}`);
                resolve();
            });
        }).on('error', error => {
            fs.unlink(path.join(imageDir, filename), () => {}); // Supprimer le fichier en cas d'erreur
            console.error(`Erreur lors du téléchargement de ${filename}:`, error.message);
            reject(error);
        });
    });
}

// Télécharger toutes les images
async function downloadAllImages() {
    console.log('Début du téléchargement des images...');
    
    for (const image of images) {
        try {
            await downloadImage(image.url, image.filename);
        } catch (error) {
            console.error(`Échec du téléchargement de ${image.filename}`);
        }
    }
    
    console.log('Tous les téléchargements sont terminés.');
}

// Exécuter le téléchargement
downloadAllImages().catch(console.error);
