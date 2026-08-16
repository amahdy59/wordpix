const sharp = require('sharp');
const fs = require('fs');
const path = require('path');

const imagesDir = 'C:/Users/AhmedMahdy/OneDrive - Advansys IS/Documents/Antigravity/WordPix/public/word-images';

async function processImages() {
  const files = fs.readdirSync(imagesDir);
  
  for (const file of files) {
    if (!file.endsWith('.webp')) continue;
    
    const filePath = path.join(imagesDir, file);
    const stats = fs.statSync(filePath);
    
    if (stats.size > 150 * 1024) {
      console.log(`Resizing ${file} (${Math.round(stats.size/1024)}KB)...`);
      
      const buffer = fs.readFileSync(filePath);
      
      await sharp(buffer)
        .resize({ width: 500, height: 500, fit: 'inside' })
        .webp({ quality: 70 })
        .toFile(filePath);
        
      const newStats = fs.statSync(filePath);
      console.log(` -> Resized to ${Math.round(newStats.size/1024)}KB`);
    }
  }
}

processImages().catch(console.error);
