import { readFile, writeFile } from 'node:fs/promises';

// The checked-in sources keep generation offline and independent of icon APIs.
const logos = [
  ['Python', 'Python-Dark.svg'], ['R', 'R-Dark.svg'], ['Rust', 'Rust.svg'],
  ['Perl', 'Perl.svg'], ['Java', 'Java-Dark.svg'], ['JavaScript', 'JavaScript.svg'],
  ['TypeScript', 'TypeScript.svg'], ['HTML', 'HTML.svg'], ['React', 'React-Dark.svg'],
  ['PyTorch', 'PyTorch-Dark.svg'], ['PyTorch Geometric', 'PyG.svg'], ['DGL', 'DGL-small.png'],
  ['Scikit-learn', 'ScikitLearn-Dark.svg'], ['FastAPI', 'FastAPI.svg'],
  ['PostgreSQL', 'PostgreSQL-Dark.svg'], ['Snakemake', 'Snakemake.svg'],
  ['Docker', 'Docker.svg'], ['Linux', 'Linux-Dark.svg'], ['Slurm', 'Slurm.png'],
  ['Git', 'Git.svg'], ['GitHub', 'Github-Dark.svg'], ['LaTeX', 'LaTeX-Dark.svg'],
  ['Illustrator', 'Illustrator.svg'], ['InDesign', 'InDesign.svg'],
  ['Photoshop', 'Photoshop.svg'], ['After Effects', 'AfterEffects.svg'],
  ['Audition', 'Audition.svg'], ['Premiere Pro', 'Premiere.svg'],
];
const assets = new URL('../assets/', import.meta.url);
const images = await Promise.all(logos.map(async ([name, file]) => {
  let bytes = await readFile(new URL(`skill-logos/${file}`, assets));
  if (file === 'InDesign.svg') bytes = Buffer.from(bytes.toString().replace('<path ', '<path fill="#FF3366" '));
  const type = file.endsWith('.svg') ? 'svg+xml' : file.endsWith('.png') ? 'png' : 'jpeg';
  const plate = ['Slurm.png', 'DGL-small.png'].includes(file) ? '#F0F6FC' : ['PyG.svg', 'Snakemake.svg'].includes(file) ? '#242938' : null;
  return { name, plate, uri: `data:image/${type};base64,${bytes.toString('base64')}` };
}));

function render(mobile, still) {
  const width = mobile ? 420 : 1000;
  const size = mobile ? 44 : 52;
  const columns = mobile ? 7 : 14;
  const height = still ? (Math.ceil(images.length / columns) * 72 + 24) : 172;
  const step = mobile ? 84 : 96;
  const span = 14 * step;
  const icon = (i, x, y, side = size) => {
    const { name, plate, uri } = images[i];
    const inset = plate ? side * .1 : 0;
    return `<g><title>${name}</title>${plate ? `<rect x="${x}" y="${y}" width="${side}" height="${side}" rx="${side * .22}" fill="${plate}"/>` : ''}<image x="${x + inset}" y="${y + inset}" width="${side - inset * 2}" height="${side - inset * 2}" preserveAspectRatio="xMidYMid meet" href="${uri}"/></g>`;
  };
  let body = '';
  if (still) {
    const cell = (width - 32) / columns;
    const side = mobile ? 38 : 48;
    body = images.map((_, i) => icon(i, 16 + (i % columns) * cell + (cell - side) / 2, 24 + Math.floor(i / columns) * 72, side)).join('');
  } else {
    for (let row = 0; row < 2; row++) {
      const content = Array.from({ length: 14 }, (_, i) => icon(row * 14 + i, i * step + (step - size) / 2, 0)).join('');
      // Exactly one period separates duplicates, so the wrap has no jump or gap.
      body += `<g transform="translate(0 ${25 + row * 72})"><g class="track row-${row}">${content}<g transform="translate(${span} 0)" aria-hidden="true">${content}</g></g></g>`;
    }
    body = `<g mask="url(#fade)">${body}</g>`;
  }
  return `<svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${height}" viewBox="0 0 ${width} ${height}" role="img" aria-labelledby="title desc">
<title id="title">Skills</title>
<desc id="desc">${images.map(i => i.name).join(', ')}. ${still ? 'Static logo grid.' : 'Two continuous rows of equally sized logos drift from right to left.'}</desc>
<defs>
  <linearGradient id="surface" x2="0" y2="1"><stop stop-color="#131E2B"/><stop offset="1" stop-color="#0D1117"/></linearGradient>
  <linearGradient id="edge"><stop stop-color="#7DD3FC" stop-opacity="0"/><stop offset=".5" stop-color="#7DD3FC" stop-opacity=".35"/><stop offset="1" stop-color="#7DD3FC" stop-opacity="0"/></linearGradient>
  <linearGradient id="fade-gradient"><stop stop-color="white" stop-opacity="0"/><stop offset="${mobile ? '.09' : '.045'}" stop-color="white"/><stop offset="${mobile ? '.91' : '.955'}" stop-color="white"/><stop offset="1" stop-color="white" stop-opacity="0"/></linearGradient>
  <mask id="fade" maskUnits="userSpaceOnUse" x="0" y="0" width="${width}" height="${height}"><rect width="${width}" height="${height}" fill="url(#fade-gradient)"/></mask>
</defs>
${still ? '' : `<style>
  .track { animation: drift ${span / 20}s linear infinite; }
  .row-1 { animation-duration: ${span / 17}s; }
  @keyframes drift { to { transform: translateX(-${span}px); } }
  @media (prefers-reduced-motion: reduce) { .track { animation: none; } }
</style>`}
<rect x=".5" y=".5" width="${width - 1}" height="${height - 1}" rx="16" fill="url(#surface)" stroke="#253347"/>
<path d="M 24 1 H ${width - 24}" stroke="url(#edge)"/>
${body}
</svg>\n`;
}

for (const mobile of [false, true]) for (const still of [false, true]) {
  await writeFile(new URL(`skills${mobile ? '-mobile' : ''}${still ? '-still' : ''}.svg`, assets), render(mobile, still));
}
console.log(`Built skills marquee and complete reduced-motion grids (${images.length} logos).`);
