const sharp = require('sharp');
const fs = require('fs');
const path = require('path');

const svgBuffer = Buffer.from(`
<svg width="512" height="512" viewBox="0 0 512 512" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <linearGradient id="grad" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" style="stop-color:#4f46e5;stop-opacity:1" />
      <stop offset="100%" style="stop-color:#7c3aed;stop-opacity:1" />
    </linearGradient>
  </defs>
  <rect width="512" height="512" rx="120" fill="url(#grad)" />
  <text x="50%" y="50%" font-family="Arial, sans-serif" font-size="280" font-weight="bold" fill="white" text-anchor="middle" dy=".35em">PP</text>
</svg>
`);

const outputDir = path.join(__dirname, '../public/icons');

async function generateIcons() {
  if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir, { recursive: true });
  }

  // Generate 192x192
  await sharp(svgBuffer)
    .resize(192, 192)
    .png()
    .toFile(path.join(outputDir, 'icon-192x192.png'));
    
  console.log('Generated icon-192x192.png');

  // Generate 512x512
  await sharp(svgBuffer)
    .resize(512, 512)
    .png()
    .toFile(path.join(outputDir, 'icon-512x512.png'));
    
  console.log('Generated icon-512x512.png');

  // Generate Maskable 512x512 (Safe zone padding)
  // For maskable, we just use the same one for now or add padding. 
  // A simple rect without rounding is better for maskable, but let's reuse the same one for simplicity or make a specific one.
  // Actually, standard icon is usually fine if it has background.
  await sharp(svgBuffer)
    .resize(512, 512)
    .png()
    .toFile(path.join(outputDir, 'maskable-icon-512x512.png'));

  console.log('Generated maskable-icon-512x512.png');
}

generateIcons().catch(console.error);
