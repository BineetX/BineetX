import {mkdir,readFile,writeFile} from 'node:fs/promises';

const assets=new URL('../assets/',import.meta.url);
const output=new URL('socials/',assets);
await mkdir(output,{recursive:true});
const socials=[
 ['linkedin','LinkedIn'], ['googlescholar','Google Scholar'], ['orcid','ORCID'],
 ['researchgate','ResearchGate'], ['x','X / Twitter'], ['youtube','YouTube'],
];

for(const [index,[slug,name]] of socials.entries()){
 const original=await readFile(new URL(`social-logos/${slug}.svg`,assets),'utf8');
 // Only the brand's path geometry is reused inside the custom button.
 const paths=original.match(/<path\b[^>]*\/>/g);
 if(!paths?.length)throw Error(`No icon paths for ${slug}`);
 for(const still of [false,true]){
  const svg=`<svg xmlns="http://www.w3.org/2000/svg" width="88" height="72" viewBox="0 0 88 72" role="img" aria-labelledby="title">
<title id="title">${name}</title>
${still?'':`<style>
.rim{animation:rim 12s linear infinite;animation-delay:-${index*2}s}
.light{animation:light 6s ease-in-out infinite alternate;animation-delay:-${index}s}
@keyframes rim{to{stroke-dashoffset:-100}}
@keyframes light{from{opacity:.4}to{opacity:.85}}
@media(prefers-reduced-motion:reduce){.rim,.light{animation:none}}
</style>`}
<defs>
 <linearGradient id="surface" x2="0" y2="1"><stop stop-color="#152132"/><stop offset="1" stop-color="#0D1117"/></linearGradient>
 <radialGradient id="light"><stop stop-color="#7DD3FC" stop-opacity=".2"/><stop offset="1" stop-color="#7DD3FC" stop-opacity="0"/></radialGradient>
</defs>
<rect x="4.5" y="4.5" width="79" height="63" rx="16" fill="url(#surface)" stroke="#2B3B50"/>
<ellipse class="light" cx="44" cy="37" rx="32" ry="28" fill="url(#light)"/>
<rect class="rim" x="4.5" y="4.5" width="79" height="63" rx="16" pathLength="100" fill="none" stroke="#7DD3FC" stroke-width="1" stroke-dasharray="9 91" stroke-linecap="round" opacity=".55"/>
<g transform="translate(30 22) scale(1.1666667)" fill="#DDEAF7">${paths.join('')}</g>
<path d="M 68 15 H 73 V 20 M 68 20 L 73 15" fill="none" stroke="#7DD3FC" stroke-width="1" opacity=".55"/>
</svg>\n`;
  await writeFile(new URL(`${slug}${still?'-still':''}.svg`,output),svg);
 }
}
console.log('Built six social buttons and reduced-motion alternatives.');
