const fs = require('fs');
const https = require('https');
const path = require('path');

// Créer le dossier s'il n'existe pas
const imagesDir = path.join(__dirname, 'assets', 'images', 'hero');
if (!fs.existsSync(imagesDir)) {
    fs.mkdirSync(imagesDir, { recursive: true });
}

// URLs des images du carrousel
const images = [
    {
        url: 'https://scontent-cdg4-2.xx.fbcdn.net/v/t39.30808-6/448052413_1088442829071139_1000000000000000000_n.jpg',
        filename: 'hero1.jpg'
    },
    {
        url: 'https://scontent-cdg4-2.xx.fbcdn.net/v/t39.30808-6/448052413_1088442829071139_1000000000000000000_n.jpg',
        filename: 'hero2.jpg'
    },
    {
        url: 'https://scontent-cdg4-2.xx.fbcdn.net/v/t39.30808-6/448052413_1088442829071139_1000000000000000000_n.jpg',
        filename: 'hero3.jpg'
    },
    {
        url: 'https://scontent-cdg4-2.xx.fbcdn.net/v/t39.30808-6/448052413_1088442829071139_1000000000000000000_n.jpg',
        filename: 'hero4.jpg'
    },
    {
        url: 'https://scontent-cdg4-2.xx.fbcdn.net/v/t39.30808-6/448052413_1088442829071139_1000000000000000000_n.jpg',
        filename: 'hero5.jpg'
    }
];

// Fonction pour télécharger une image
function downloadImage(imageUrl, filename) {
    return new Promise((resolve, reject) => {
        const filePath = path.join(imagesDir, filename);
        const file = fs.createWriteStream(filePath);
        
        https.get(imageUrl, (response) => {
            response.pipe(file);
            
            file.on('finish', () => {
                file.close();
                console.log(`Téléchargement de ${filename} terminé`);
                resolve();
            });
        }).on('error', (err) => {
            fs.unlink(filePath, () => {});
            console.error(`Erreur lors du téléchargement de ${filename}:`, err.message);
            reject(err);
        });
    });
}

// Télécharger toutes les images
async function downloadAllImages() {
    console.log('Début du téléchargement des images...');
    
    try {
        for (const image of images) {
            await downloadImage(image.url, image.filename);
        }
        console.log('Tous les téléchargements sont terminés !');
    } catch (error) {
        console.error('Une erreur est survenue lors du téléchargement des images:', error);
    }
}

// Exécuter le téléchargement
downloadAllImages();
