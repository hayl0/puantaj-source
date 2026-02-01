const sharp = require('sharp');
const fs = require('fs');
const path = require('path');

const assetsDir = path.join(__dirname, 'assets');
if (!fs.existsSync(assetsDir)) {
    fs.mkdirSync(assetsDir);
}

// Modern, Professional "Puantaj Pro" Icon
// Style: "Tahoe" / iOS Glassmorphism / Deep Indigo Gradient
const iconSvg = `
<svg width="1024" height="1024" viewBox="0 0 1024 1024" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <linearGradient id="bg" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" style="stop-color:#312e81;stop-opacity:1" />
      <stop offset="50%" style="stop-color:#4338ca;stop-opacity:1" />
      <stop offset="100%" style="stop-color:#6366f1;stop-opacity:1" />
    </linearGradient>
    <linearGradient id="glass" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" style="stop-color:#ffffff;stop-opacity:0.25" />
      <stop offset="100%" style="stop-color:#ffffff;stop-opacity:0.05" />
    </linearGradient>
    <filter id="shadow" x="-50%" y="-50%" width="200%" height="200%">
      <feDropShadow dx="0" dy="15" stdDeviation="25" flood-color="#000" flood-opacity="0.4"/>
    </filter>
    <filter id="inner-glow">
        <feGaussianBlur stdDeviation="5" result="blur"/>
        <feComposite in="SourceGraphic" in2="blur" operator="arithmetic" k2="-1" k3="1" result="shadowDiff"/>
        <feFlood flood-color="white" flood-opacity="0.2"/>
        <feComposite in2="shadowDiff" operator="in"/>
        <feComposite in2="SourceGraphic" operator="over"/>
    </filter>
  </defs>
  
  <!-- Background Container -->
  <rect width="1024" height="1024" fill="url(#bg)" />
  
  <!-- Abstract "Time/Attendance" Elements (Grid/Calendar hint) -->
  <path d="M112 112 H 912 V 912 H 112 Z" fill="none" stroke="rgba(255,255,255,0.03)" stroke-width="2" />
  <path d="M112 312 H 912" stroke="rgba(255,255,255,0.03)" stroke-width="2" />
  <path d="M112 512 H 912" stroke="rgba(255,255,255,0.03)" stroke-width="2" />
  <path d="M112 712 H 912" stroke="rgba(255,255,255,0.03)" stroke-width="2" />
  <path d="M312 112 V 912" stroke="rgba(255,255,255,0.03)" stroke-width="2" />
  <path d="M512 112 V 912" stroke="rgba(255,255,255,0.03)" stroke-width="2" />
  <path d="M712 112 V 912" stroke="rgba(255,255,255,0.03)" stroke-width="2" />

  <!-- Central Glass Card -->
  <rect x="212" y="212" width="600" height="600" rx="140" fill="url(#glass)" filter="url(#shadow)" stroke="rgba(255,255,255,0.3)" stroke-width="3" />

  <!-- Logo Symbol: Stylized "P" with checkmark integration -->
  <g transform="translate(512, 512) scale(1.2)">
      <!-- The P shape formed by a checkmark and a loop -->
      <path d="M-80 -120 L -80 120" stroke="white" stroke-width="50" stroke-linecap="round" fill="none" />
      <path d="M-80 -60 C 20 -60, 100 -20, 100 60 C 100 140, 20 180, -80 180" stroke="white" stroke-width="50" stroke-linecap="round" fill="none" opacity="0.9" />
      
      <!-- Checkmark accent -->
      <path d="M40 0 L 80 40 L 140 -40" stroke="#a5b4fc" stroke-width="30" stroke-linecap="round" stroke-linejoin="round" fill="none" filter="url(#shadow)" />
  </g>
  
</svg>
`;

// Splash screen with larger background and centered logo
const splashSvg = `
<svg width="2732" height="2732" viewBox="0 0 2732 2732" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <linearGradient id="bg-splash" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" style="stop-color:#1e1b4b;stop-opacity:1" />
      <stop offset="100%" style="stop-color:#312e81;stop-opacity:1" />
    </linearGradient>
  </defs>
  <rect width="2732" height="2732" fill="url(#bg-splash)" />
  
  <!-- Center the icon content -->
  <g transform="translate(854, 854)">
    ${iconSvg.replace('<svg width="1024" height="1024" viewBox="0 0 1024 1024" xmlns="http://www.w3.org/2000/svg">', '<svg width="1024" height="1024" viewBox="0 0 1024 1024">')}
  </g>
  
  <!-- Brand Name at bottom -->
  <text x="1366" y="2200" font-family="system-ui, -apple-system, sans-serif" font-weight="600" font-size="120" fill="white" text-anchor="middle" letter-spacing="20" opacity="0.8">PUANTAJ PRO</text>
</svg>
`;

async function generate() {
    console.log('Generating assets/icon.png...');
    await sharp(Buffer.from(iconSvg))
        .resize(1024, 1024)
        .png()
        .toFile(path.join(assetsDir, 'icon.png'));
        
    console.log('Generating assets/splash.png...');
    await sharp(Buffer.from(splashSvg))
        .resize(2732, 2732)
        .png()
        .toFile(path.join(assetsDir, 'splash.png'));
        
    console.log('Assets generated successfully.');
}

generate().catch(console.error);
