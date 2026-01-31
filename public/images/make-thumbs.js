const sharp = require('sharp');
const path = require('path');

const mappings = [
  { src: 'WhatsApp Image 2026-02-01 at 12.34.54 AM.jpeg', dest: 'wtp-parvati.jpg' },
  { src: 'WhatsApp Image 2026-02-01 at 12.35.53 AM.jpeg', dest: 'reservoir-1.jpg' },
  { src: 'WhatsApp Image 2026-02-01 at 12.36.54 AM.jpeg', dest: 'reservoir-2.jpg' }
];

(async () => {
  for (const m of mappings) {
    const src = path.join(__dirname, m.src);
    const dest = path.join(__dirname, m.dest);
    try {
      console.log('Processing', m.src, '->', m.dest);
      await sharp(src)
        .resize(800, 400, { fit: 'cover', position: 'center' })
        .jpeg({ quality: 85 })
        .toFile(dest);
      console.log('Saved', m.dest);
    } catch (err) {
      console.error('Error processing', m.src, err.message);
    }
  }
})();
