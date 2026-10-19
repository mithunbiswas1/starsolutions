import sharp from 'sharp';
import fs from 'fs';
import path from 'path';

const outDir = path.resolve('public');

// 1. Sleek Star Emblem SVG Definition
// Modern faceted geometric 8-ray compass star with neon cyber-emerald gradient
function getStarEmblem(size, isDarkBackground = true) {
  const scale = size / 160;
  return `
    <g transform="scale(${scale})">
      <!-- Ambient Glow Behind Star -->
      <circle cx="80" cy="80" r="64" fill="${isDarkBackground ? '#10b981' : '#059669'}" opacity="${isDarkBackground ? '0.22' : '0.12'}" filter="url(#emblemGlow)" />
      
      <!-- Tech Orbital Precision Rings -->
      <circle cx="80" cy="80" r="68" fill="none" stroke="url(#accentGrad)" stroke-width="2.5" stroke-dasharray="14 18" opacity="0.7" />
      <circle cx="80" cy="80" r="54" fill="none" stroke="${isDarkBackground ? '#34d399' : '#059669'}" stroke-width="1.5" opacity="0.45" />
      
      <!-- Orbital Nodes -->
      <circle cx="128" cy="32" r="4.5" fill="#34d399" />
      <circle cx="32" cy="128" r="3.5" fill="#06b6d4" />
      
      <!-- 4 Main Points (North, South, East, West) with 3D Shading Facets -->
      <!-- North Point (80, 14) -->
      <polygon points="80,14 80,80 62,80" fill="#34d399" />
      <polygon points="80,14 98,80 80,80" fill="#10b981" />

      <!-- South Point (80, 146) -->
      <polygon points="80,146 62,80 80,80" fill="#059669" />
      <polygon points="80,146 80,80 98,80" fill="#047857" />

      <!-- East Point (146, 80) -->
      <polygon points="146,80 80,80 80,62" fill="#34d399" />
      <polygon points="146,80 80,98 80,80" fill="#10b981" />

      <!-- West Point (14, 80) -->
      <polygon points="14,80 80,62 80,80" fill="#059669" />
      <polygon points="14,80 80,80 80,98" fill="#047857" />

      <!-- 4 Diagonal Secondary Rays -->
      <polygon points="122,38 80,80 90,70" fill="#6ee7b7" opacity="0.95" />
      <polygon points="38,122 80,80 70,90" fill="#059669" opacity="0.95" />
      <polygon points="122,122 80,80 90,90" fill="#047857" opacity="0.95" />
      <polygon points="38,38 80,80 70,70" fill="#34d399" opacity="0.95" />

      <!-- Central Core Faceted Jewel -->
      <polygon points="80,58 102,80 80,102 58,80" fill="url(#coreGrad)" />
      <polygon points="80,66 94,80 80,94 66,80" fill="#ecfdf5" />
      <circle cx="80" cy="80" r="4" fill="#ffffff" />
    </g>
  `;
}

// 2. White Logo (for Dark Navbar / Footer / Dark Backgrounds)
function buildLogoWhiteSvg() {
  return `
<svg width="680" height="150" viewBox="0 0 680 150" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <linearGradient id="accentGrad" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#34d399" />
      <stop offset="60%" stop-color="#2ed06e" />
      <stop offset="100%" stop-color="#059669" />
    </linearGradient>
    <linearGradient id="coreGrad" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#6ee7b7" />
      <stop offset="100%" stop-color="#10b981" />
    </linearGradient>
    <filter id="emblemGlow" x="-20%" y="-20%" width="140%" height="140%">
      <feGaussianBlur stdDeviation="6" result="blur" />
      <feComposite in="SourceGraphic" in2="blur" operator="over" />
    </filter>
  </defs>

  <!-- Star Emblem positioned on the left -->
  <g transform="translate(18, 15)">
    ${getStarEmblem(120, true)}
  </g>

  <!-- Wordmark -->
  <!-- "STAR" in bold crisp white -->
  <text x="156" y="74" font-family="-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif" font-weight="900" font-size="46" fill="#ffffff" letter-spacing="2.5">STAR</text>
  
  <!-- "SOLUTIONS" in emerald gradient accent -->
  <text x="282" y="74" font-family="-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif" font-weight="500" font-size="46" fill="#2ed06e" letter-spacing="2.5">SOLUTIONS</text>

  <!-- Subtitle with BD Badge -->
  <g transform="translate(158, 93)">
    <rect x="0" y="0" width="34" height="19" rx="4" fill="url(#accentGrad)" />
    <text x="17" y="14" font-family="-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif" font-weight="900" font-size="11.5" fill="#042f1a" text-anchor="middle" letter-spacing="0.5">BD</text>
    
    <text x="44" y="14" font-family="-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif" font-weight="600" font-size="12" fill="#94a3b8" letter-spacing="3.2">ENTERPRISE TECH &amp; CLOUD</text>
  </g>
</svg>
`;
}

// 3. Black Logo (for Light Navbar / Light backgrounds)
function buildLogoBlackSvg() {
  return `
<svg width="680" height="150" viewBox="0 0 680 150" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <linearGradient id="accentGrad" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#10b981" />
      <stop offset="60%" stop-color="#059669" />
      <stop offset="100%" stop-color="#047857" />
    </linearGradient>
    <linearGradient id="coreGrad" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#34d399" />
      <stop offset="100%" stop-color="#059669" />
    </linearGradient>
    <filter id="emblemGlow" x="-20%" y="-20%" width="140%" height="140%">
      <feGaussianBlur stdDeviation="5" result="blur" />
      <feComposite in="SourceGraphic" in2="blur" operator="over" />
    </filter>
  </defs>

  <!-- Star Emblem positioned on the left -->
  <g transform="translate(18, 15)">
    ${getStarEmblem(120, false)}
  </g>

  <!-- Wordmark -->
  <!-- "STAR" in sleek slate-900 -->
  <text x="156" y="74" font-family="-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif" font-weight="900" font-size="46" fill="#0f172a" letter-spacing="2.5">STAR</text>
  
  <!-- "SOLUTIONS" in emerald accent -->
  <text x="282" y="74" font-family="-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif" font-weight="600" font-size="46" fill="#059669" letter-spacing="2.5">SOLUTIONS</text>

  <!-- Subtitle with BD Badge -->
  <g transform="translate(158, 93)">
    <rect x="0" y="0" width="34" height="19" rx="4" fill="url(#accentGrad)" />
    <text x="17" y="14" font-family="-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif" font-weight="900" font-size="11.5" fill="#ffffff" text-anchor="middle" letter-spacing="0.5">BD</text>
    
    <text x="44" y="14" font-family="-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif" font-weight="600" font-size="12" fill="#475569" letter-spacing="3.2">ENTERPRISE TECH &amp; CLOUD</text>
  </g>
</svg>
`;
}

// 4. Favicon Icon (Square emblem with rounded dark container for contrast)
function buildFaviconSvg(size = 512) {
  return `
<svg width="${size}" height="${size}" viewBox="0 0 512 512" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <linearGradient id="bgGrad" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#0a101d" />
      <stop offset="100%" stop-color="#040810" />
    </linearGradient>
    <linearGradient id="accentGrad" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#34d399" />
      <stop offset="50%" stop-color="#2ed06e" />
      <stop offset="100%" stop-color="#059669" />
    </linearGradient>
    <linearGradient id="coreGrad" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#a7f3d0" />
      <stop offset="100%" stop-color="#10b981" />
    </linearGradient>
    <filter id="emblemGlow" x="-20%" y="-20%" width="140%" height="140%">
      <feGaussianBlur stdDeviation="16" result="blur" />
      <feComposite in="SourceGraphic" in2="blur" operator="over" />
    </filter>
  </defs>

  <!-- Squircle rounded background -->
  <rect x="16" y="16" width="480" height="480" rx="112" fill="url(#bgGrad)" stroke="#1e293b" stroke-width="6" />
  
  <!-- Outer subtle emerald border ring -->
  <rect x="22" y="22" width="468" height="468" rx="106" fill="none" stroke="#10b981" stroke-width="2.5" opacity="0.3" />

  <!-- Center Star Emblem scaled to fill canvas -->
  <g transform="translate(256, 256) scale(2.7) translate(-80, -80)">
    <!-- Ambient glow -->
    <circle cx="80" cy="80" r="64" fill="#10b981" opacity="0.28" filter="url(#emblemGlow)" />
    
    <!-- Precision orbits -->
    <circle cx="80" cy="80" r="68" fill="none" stroke="url(#accentGrad)" stroke-width="2.5" stroke-dasharray="14 18" opacity="0.75" />
    <circle cx="80" cy="80" r="54" fill="none" stroke="#34d399" stroke-width="1.5" opacity="0.45" />
    
    <!-- Nodes -->
    <circle cx="128" cy="32" r="4.5" fill="#34d399" />
    <circle cx="32" cy="128" r="3.5" fill="#06b6d4" />
    
    <!-- North Point (80, 14) -->
    <polygon points="80,14 80,80 62,80" fill="#34d399" />
    <polygon points="80,14 98,80 80,80" fill="#10b981" />

    <!-- South Point (80, 146) -->
    <polygon points="80,146 62,80 80,80" fill="#059669" />
    <polygon points="80,146 80,80 98,80" fill="#047857" />

    <!-- East Point (146, 80) -->
    <polygon points="146,80 80,80 80,62" fill="#34d399" />
    <polygon points="146,80 80,98 80,80" fill="#10b981" />

    <!-- West Point (14, 80) -->
    <polygon points="14,80 80,62 80,80" fill="#059669" />
    <polygon points="14,80 80,80 80,98" fill="#047857" />

    <!-- Diagonal Secondary Rays -->
    <polygon points="122,38 80,80 90,70" fill="#6ee7b7" opacity="0.95" />
    <polygon points="38,122 80,80 70,90" fill="#059669" opacity="0.95" />
    <polygon points="122,122 80,80 90,90" fill="#047857" opacity="0.95" />
    <polygon points="38,38 80,80 70,70" fill="#34d399" opacity="0.95" />

    <!-- Central Diamond Gem -->
    <polygon points="80,58 102,80 80,102 58,80" fill="url(#coreGrad)" />
    <polygon points="80,66 94,80 80,94 66,80" fill="#ecfdf5" />
    <circle cx="80" cy="80" r="4" fill="#ffffff" />
  </g>
</svg>
`;
}

async function run() {
  console.log('Regenerating Star Solutions Logo & Favicons with refined dimensions...');

  // 1. Generate White Logo
  const logoWhiteSvg = buildLogoWhiteSvg();
  fs.writeFileSync(path.join(outDir, 'logo_white.svg'), logoWhiteSvg);
  fs.writeFileSync(path.join(outDir, 'star_logo_white.svg'), logoWhiteSvg);
  const whitePng = await sharp(Buffer.from(logoWhiteSvg), { density: 300 })
    .resize(680, 150)
    .png()
    .toBuffer();
  fs.writeFileSync(path.join(outDir, 'logo_white.png'), whitePng);
  fs.writeFileSync(path.join(outDir, 'logo_white3.png'), whitePng);
  fs.writeFileSync(path.join(outDir, 'star_logo_white.png'), whitePng);
  console.log('✓ Created logo_white.png, star_logo_white.png & SVGs');

  // 2. Generate Black Logo
  const logoBlackSvg = buildLogoBlackSvg();
  fs.writeFileSync(path.join(outDir, 'logo_black.svg'), logoBlackSvg);
  fs.writeFileSync(path.join(outDir, 'star_logo_black.svg'), logoBlackSvg);
  const blackPng = await sharp(Buffer.from(logoBlackSvg), { density: 300 })
    .resize(680, 150)
    .png()
    .toBuffer();
  fs.writeFileSync(path.join(outDir, 'logo_black.png'), blackPng);
  fs.writeFileSync(path.join(outDir, 'logo_black3.png'), blackPng);
  fs.writeFileSync(path.join(outDir, 'star_logo_black.png'), blackPng);
  console.log('✓ Created logo_black.png, star_logo_black.png & SVGs');

  // 3. Generate Favicon Assets
  const favSvg = buildFaviconSvg(512);
  fs.writeFileSync(path.join(outDir, 'favicon.svg'), favSvg);
  const favBuf = Buffer.from(favSvg);

  await sharp(favBuf, { density: 300 })
    .resize(16, 16)
    .png()
    .toFile(path.join(outDir, 'favicon-16x16.png'));

  await sharp(favBuf, { density: 300 })
    .resize(32, 32)
    .png()
    .toFile(path.join(outDir, 'favicon-32x32.png'));

  await sharp(favBuf, { density: 300 })
    .resize(180, 180)
    .png()
    .toFile(path.join(outDir, 'apple-touch-icon.png'));

  await sharp(favBuf, { density: 300 })
    .resize(192, 192)
    .png()
    .toFile(path.join(outDir, 'android-chrome-192x192.png'));

  await sharp(favBuf, { density: 300 })
    .resize(512, 512)
    .png()
    .toFile(path.join(outDir, 'android-chrome-512x512.png'));

  // 4. Create multi-size favicon.ico
  const p16 = await sharp(favBuf, { density: 300 }).resize(16, 16).png().toBuffer();
  const p32 = await sharp(favBuf, { density: 300 }).resize(32, 32).png().toBuffer();
  const p48 = await sharp(favBuf, { density: 300 }).resize(48, 48).png().toBuffer();

  const icoBuffer = createIco([
    { size: 16, buffer: p16 },
    { size: 32, buffer: p32 },
    { size: 48, buffer: p48 }
  ]);
  fs.writeFileSync(path.join(outDir, 'favicon.ico'), icoBuffer);
  console.log('✓ Created multi-resolution favicon.ico');

  console.log('Brand assets complete!');
}

function createIco(images) {
  const count = images.length;
  const header = Buffer.alloc(6);
  header.writeUInt16LE(0, 0);
  header.writeUInt16LE(1, 2);
  header.writeUInt16LE(count, 4);

  const dirSize = count * 16;
  const dirEntries = Buffer.alloc(dirSize);

  let currentOffset = 6 + dirSize;
  const buffers = [header, dirEntries];

  for (let i = 0; i < count; i++) {
    const img = images[i];
    const offset = i * 16;
    dirEntries.writeUInt8(img.size >= 256 ? 0 : img.size, offset + 0);
    dirEntries.writeUInt8(img.size >= 256 ? 0 : img.size, offset + 1);
    dirEntries.writeUInt8(0, offset + 2);
    dirEntries.writeUInt8(0, offset + 3);
    dirEntries.writeUInt16LE(1, offset + 4);
    dirEntries.writeUInt16LE(32, offset + 6);
    dirEntries.writeUInt32LE(img.buffer.length, offset + 8);
    dirEntries.writeUInt32LE(currentOffset, offset + 12);

    buffers.push(img.buffer);
    currentOffset += img.buffer.length;
  }

  return Buffer.concat(buffers);
}

run().catch((err) => {
  console.error(err);
  process.exit(1);
});
