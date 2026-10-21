import {mkdir, writeFile} from 'node:fs/promises';

const out = new URL('../assets/navigation/', import.meta.url);
await mkdir(out, {recursive: true});
const links = [
  ['research', 'Research', '<path d="M2 3 12 5 6 13Z"/><circle cx="2" cy="3" r="1.5"/><circle cx="12" cy="5" r="1.5"/><circle cx="6" cy="13" r="1.5"/>'],
  ['skills', 'Skills', '<path d="m4 3-4 5 4 5m6-10 4 5-4 5M8 1 6 15"/>'],
  ['activity', 'Activity', '<path d="M1 12V8m4 4V3m4 9V6m4 6V1"/>'],
  ['projects', 'Projects', '<rect x="1" y="1" width="5" height="5" rx="1"/><rect x="9" y="1" width="5" height="5" rx="1"/><rect x="1" y="9" width="5" height="5" rx="1"/><rect x="9" y="9" width="5" height="5" rx="1"/>'],
  ['portfolio', 'Portfolio', '<path d="M6 2h7v7M3 12 13 2M3 3H1v12h12v-2"/>'],
];
for (const [slug, label, icon] of links) {
  await writeFile(new URL(`${slug}.svg`, out), `<svg xmlns="http://www.w3.org/2000/svg" width="104" height="36" viewBox="0 0 104 36" role="img" aria-labelledby="title">
<title id="title">${label}</title>
<defs><linearGradient id="surface" x2="0" y2="1"><stop stop-color="#152132"/><stop offset="1" stop-color="#0D1117"/></linearGradient></defs>
<rect x=".5" y="2.5" width="103" height="31" rx="10" fill="url(#surface)" stroke="#314359"/>
<g transform="translate(11 10)" fill="none" stroke="#7DD3FC" stroke-width="1.2" stroke-linecap="round" stroke-linejoin="round">${icon}</g>
<text x="33" y="22" fill="#DDEAF7" font-family="Arial, Helvetica, sans-serif" font-size="12.5" font-weight="600">${label}</text>
</svg>\n`);
}
console.log('Built five navigation buttons.');
