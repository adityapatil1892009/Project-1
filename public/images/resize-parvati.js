const sharp = require('sharp');
const path = require('path');

const imagePath = path.join(__dirname, 'download.jpg');
const outputPath = path.join(__dirname, 'parvati-wtp.jpg');

sharp(imagePath)
  .resize(800, 450, {
    fit: 'contain',
    background: { r: 245, g: 245, b: 245 }
  })
  .jpeg({ quality: 85 })
  .toFile(outputPath)
  .then(info => {
    console.log('✅ Resized to parvati-wtp.jpg');
    console.log('Size:', (info.size / 1024).toFixed(2), 'KB');
  })
  .catch(err => console.error('❌ Error:', err));
