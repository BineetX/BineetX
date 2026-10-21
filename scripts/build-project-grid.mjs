import { mkdir, readFile, writeFile } from 'node:fs/promises';

const assets = new URL('../assets/', import.meta.url);
const output = new URL('projects/', assets);
await mkdir(output, { recursive: true });
const projects = [
  { name: 'GENOCULAR', file: 'genocular', preview: true },
  { name: 'GeMemiOM', file: 'gememiom', preview: true },
  { name: 'MyoCircBase', file: 'myocircbase' },
  { name: 'Bioinformatica', file: 'bioinformatica' },
];

for (const [index, project] of projects.entries()) {
  const preview = project.preview
    ? await readFile(new URL(`project_screenshots/${project.file}-preview.webp`, assets)) : null;
  for (const mobile of [false, true]) for (const still of [false, true]) {
    const width = mobile ? 240 : 480, height = mobile ? 220 : 300;
    const inset = mobile ? 12 : 18, top = mobile ? 76 : 88;
    const screenWidth = width - inset * 2, screenHeight = height - top - inset;
    const cx = width / 2, cy = top + screenHeight / 2;
    const radius = mobile ? 47 : 65;
    const motif = index === 2
      ? `<g class="orbit">${[0, 60, 120].map(angle => `<ellipse cx="${cx}" cy="${cy}" rx="${radius}" ry="${radius * .55}" transform="rotate(${angle} ${cx} ${cy})" fill="none" stroke="#7DD3FC" opacity=".65"/>`).join('')}</g>
         <circle cx="${cx}" cy="${cy}" r="5" fill="#DDEAF7"/>`
      : `<g fill="none" stroke="#7DD3FC" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
         <path d="M ${cx} ${cy - 28} Q ${cx - 28} ${cy - 42} ${cx - 56} ${cy - 28} V ${cy + 34} Q ${cx - 28} ${cy + 20} ${cx} ${cy + 34} Q ${cx + 28} ${cy + 20} ${cx + 56} ${cy + 34} V ${cy - 28} Q ${cx + 28} ${cy - 42} ${cx} ${cy - 28} V ${cy + 34}"/>
         <path class="signal" d="M ${cx - 29} ${cy - 12} l -10 10 10 10 M ${cx + 29} ${cy - 12} l 10 10 -10 10"/>
         </g>`;
    const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${height}" viewBox="0 0 ${width} ${height}" role="img" aria-labelledby="title desc">
<title id="title">${project.name}</title>
<desc id="desc">${preview ? 'Interface thumbnail. Select to open the original screenshot.' : 'Decorative project illustration. Select to open the repository.'}</desc>
${still ? '' : `<style>
.orbit{transform-origin:${cx}px ${cy}px;animation:orbit 28s linear infinite}
.signal{animation:signal 4s ease-in-out infinite alternate}
.rim{animation:rim 18s linear infinite;animation-delay:-${index * 4}s}
@keyframes orbit{to{transform:rotate(360deg)}}
@keyframes signal{from{opacity:.35}to{opacity:1}}
@keyframes rim{to{stroke-dashoffset:-100}}
@media(prefers-reduced-motion:reduce){.orbit,.signal,.rim{animation:none}}
</style>`}
<defs>
 <linearGradient id="surface" x2="0" y2="1"><stop stop-color="#152132"/><stop offset="1" stop-color="#0D1117"/></linearGradient>
 <radialGradient id="glow"><stop stop-color="#7DD3FC" stop-opacity=".14"/><stop offset="1" stop-color="#7DD3FC" stop-opacity="0"/></radialGradient>
 <clipPath id="screen"><rect x="${inset}" y="${top}" width="${screenWidth}" height="${screenHeight}" rx="8"/></clipPath>
</defs>
<rect x=".5" y=".5" width="${width - 1}" height="${height - 1}" rx="14" fill="url(#surface)" stroke="#253347"/>
<rect class="rim" x="1" y="1" width="${width - 2}" height="${height - 2}" rx="14" pathLength="100" fill="none" stroke="#7DD3FC" stroke-dasharray="8 92" opacity=".4"/>
<text x="${inset}" y="26" fill="#7DD3FC" font-family="Arial, Helvetica, sans-serif" font-size="10" letter-spacing="2">0${index + 1}</text>
<text x="${inset}" y="${mobile ? 57 : 64}" fill="#F0F6FC" font-family="Arial, Helvetica, sans-serif" font-size="${mobile ? 24 : 30}" font-weight="600" letter-spacing="-.6">${project.name}</text>
<path d="M ${width - 28} 19 H ${width - 19} V 28 M ${width - 28} 28 L ${width - 19} 19" fill="none" stroke="#7DD3FC" opacity=".65"/>
${preview ? `<g clip-path="url(#screen)">
 <rect x="${inset}" y="${top}" width="${screenWidth}" height="${screenHeight}" fill="#F0F6FC"/>
 <image x="${inset}" y="${top}" width="${screenWidth}" height="${screenHeight}" preserveAspectRatio="xMidYMin slice" href="data:image/webp;base64,${preview.toString('base64')}"/>
 </g>
 <rect x="${inset}" y="${top}" width="${screenWidth}" height="${screenHeight}" rx="8" fill="none" stroke="#314359"/>`
 : `<ellipse cx="${cx}" cy="${cy}" rx="${screenWidth / 2}" ry="${screenHeight / 2}" fill="url(#glow)"/>${motif}`}
</svg>\n`;
    await writeFile(new URL(`${project.file}${mobile ? '-mobile' : ''}${still ? '-still' : ''}.svg`, output), svg);
  }
}
console.log('Built four compact project cards with mobile and reduced-motion variants.');
