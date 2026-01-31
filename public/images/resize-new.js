const sharp = require('sharp');
const path = require('path');

const src = path.join(__dirname, 'shutterstock 2376870443.jpg');
const dest = path.join(__dirname, 'slider-6.jpg');

sharp(src)
  .resize(1200, 400, { fit: 'cover', position: 'center' })
  .jpeg({ quality: 85 })
  .toFile(dest)
  .then(() => console.log('Resized to slider-6.jpg'))
  .catch(err => console.error('Error resizing:', err.message));
