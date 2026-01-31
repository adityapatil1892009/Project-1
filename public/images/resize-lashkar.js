const sharp = require('sharp');
const path = require('path');

const imagePath = path.join(__dirname, 'download (1).jpg');
const outputPath = path.join(__dirname, 'lashkar-wtp.jpg');

sharp(imagePath)
  .resize(800, 450, {
    fit: 'cover',
    position: 'center'
  })
  .jpeg({ quality: 85 })
  .toFile(outputPath)
  .then(info => {
    console.log('✅ Resized to lashkar-wtp.jpg');
    console.log('Size:', (info.size / 1024).toFixed(2), 'KB');
  })
  .catch(err => console.error('❌ Error:', err));
