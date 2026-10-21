import { readFile, writeFile } from 'node:fs/promises';

const assets=new URL('../assets/',import.meta.url);
const projects=[{name:'GENOCULAR',file:'genocular'},{name:'GeMemiOM',file:'gememiom'},{name:'MyoCircBase',file:'myocircbase',preview:false}];
for(const [index,project] of projects.entries()){
 const hasPreview=project.preview!==false;
 const png=hasPreview?await readFile(new URL(`project_screenshots/${project.file}.png`,assets)):null;
 const ratio=hasPreview?png.readUInt32BE(20)/png.readUInt32BE(16):0;
 const preview=hasPreview?await readFile(new URL(`project_screenshots/${project.file}-preview.webp`,assets)):null;
 for(const mobile of [false,true])for(const still of [false,true]){
  const width=mobile?420:1000, inset=mobile?14:24, top=mobile?90:110, chrome=mobile?20:28;
  const screenWidth=width-inset*2, screenHeight=Math.round(screenWidth*ratio);
  const imageTop=top+chrome, height=hasPreview?imageTop+screenHeight+inset:top;
  const cx=mobile?344:884, cy=mobile?45:57, radius=mobile?23:30;
  const accent='#7DD3FC';
  const motif=index===0
   ? `<g class="orbit">${[radius,radius*.66].map((r,i)=>`<circle cx="${cx}" cy="${cy}" r="${r}" fill="none" stroke="${i?'#487891':accent}" stroke-width="${i?2:3}" stroke-dasharray="${i?'3 8':'12 5 2 5'}"/>`).join('')}</g><circle cx="${cx}" cy="${cy}" r="3" fill="${accent}"/>`
   : index===1 ? Array.from({length:5},(_,i)=>`<path class="wave" style="animation-delay:-${i*.3}s" d="M ${cx-43} ${cy-14+i*7} C ${cx-18} ${cy-36+i*8} ${cx+18} ${cy+36-i*8} ${cx+43} ${cy-14+i*7}" fill="none" stroke="${accent}" stroke-width="1.2" opacity="${.3+i*.13}"/>`).join('')
   : `<g class="orbit">${[0,60,120].map(angle=>`<ellipse cx="${cx}" cy="${cy}" rx="${radius}" ry="${radius*.55}" transform="rotate(${angle} ${cx} ${cy})" fill="none" stroke="${accent}" opacity=".65"/>`).join('')}</g><circle cx="${cx}" cy="${cy}" r="3" fill="${accent}"/>`;
  const svg=`<svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${height}" viewBox="0 0 ${width} ${height}" role="img" aria-labelledby="title desc">
<title id="title">${project.name}</title><desc id="desc">${project.name}. ${hasPreview?'Interface preview; select to open the original screenshot.':'Select to open the repository.'} ${still?'Static':'Animated'} decorative header.</desc>
${still?'':`<style>
.orbit{transform-origin:${cx}px ${cy}px;animation:orbit 24s linear infinite}
.wave{stroke-dasharray:12 5 2 5;animation:wave 5s linear infinite}
.rim{stroke-dasharray:100 1900;animation:rim 18s linear infinite}
@keyframes orbit{to{transform:rotate(360deg)}}
@keyframes wave{to{stroke-dashoffset:-144}}
@keyframes rim{to{stroke-dashoffset:-2000}}
@media(prefers-reduced-motion:reduce){.orbit,.wave,.rim{animation:none}}
</style>`}
<defs>
 <linearGradient id="surface" x2="0" y2="1"><stop stop-color="#152132"/><stop offset="1" stop-color="#0D1117"/></linearGradient>
 <radialGradient id="glow"><stop stop-color="${accent}" stop-opacity=".12"/><stop offset="1" stop-color="${accent}" stop-opacity="0"/></radialGradient>
 <clipPath id="screen"><rect x="${inset}" y="${top}" width="${screenWidth}" height="${screenHeight+chrome}" rx="8"/></clipPath>
</defs>
<rect x=".5" y=".5" width="${width-1}" height="${height-1}" rx="16" fill="url(#surface)" stroke="#253347"/>
<path class="rim" d="M 24 1 H ${width-24}" fill="none" stroke="${accent}" opacity=".4"/>
<ellipse cx="${cx}" cy="${cy}" rx="${mobile?62:90}" ry="${cy-3}" fill="url(#glow)"/>
<text x="${inset+8}" y="${mobile?27:31}" fill="${accent}" font-family="Arial, Helvetica, sans-serif" font-size="10" letter-spacing="2">0${index+1}</text>
<text x="${inset+6}" y="${mobile?65:80}" fill="#F0F6FC" font-family="Arial, Helvetica, sans-serif" font-size="${mobile?29:42}" font-weight="600" letter-spacing="-1">${project.name}</text>
${motif}
${hasPreview?`<g clip-path="url(#screen)">
 <rect x="${inset}" y="${top}" width="${screenWidth}" height="${screenHeight+chrome}" fill="#1A2533"/>
 ${[0,1,2].map(i=>`<circle cx="${inset+14+i*12}" cy="${top+chrome/2}" r="3" fill="${i===2?'#487891':'#526175'}"/>`).join('')}
 <image x="${inset}" y="${imageTop}" width="${screenWidth}" height="${screenHeight}" preserveAspectRatio="xMidYMid meet" href="data:image/webp;base64,${preview.toString('base64')}"/>
</g>
<rect x="${inset}" y="${top}" width="${screenWidth}" height="${screenHeight+chrome}" rx="8" fill="none" stroke="#314359"/>`:''}
</svg>\n`;
  const name=`${project.file}-showcase${mobile?'-mobile':''}${still?'-still':''}.svg`;
  await writeFile(new URL(name,assets),svg);
 }
}
console.log('Built project showcase cards with desktop/mobile and reduced-motion variants.');
