// Deterministic, dependency-free vector artwork. Run: node scripts/build-artwork.mjs
import { mkdir, readFile, writeFile } from 'node:fs/promises';
import './build-skills.mjs';
import './build-research.mjs';
import './build-projects.mjs';
import './build-socials.mjs';

const out = new URL('../assets/', import.meta.url);
await mkdir(out, { recursive: true });
const C = { bg: '#0D1117', line: '#253347', ink: '#F0F6FC', dim: '#A7B6CA', mint: '#7DD3FC', green: '#487891' };
const text = (x, y, value, size = 14, color = C.dim, attrs = '') => `<text x="${x}" y="${y}" fill="${color}" font-family="Arial, Helvetica, sans-serif" font-size="${size}" ${attrs}>${value}</text>`;
const label = (x, y, value, color = C.dim) => text(x, y, value, 12, color, 'letter-spacing="2"');
const line = (x1, y1, x2, y2, color = C.line, attrs = '') => `<line x1="${x1}" y1="${y1}" x2="${x2}" y2="${y2}" stroke="${color}" ${attrs}/>`;
const circle = (x, y, r, color = C.mint, attrs = '') => `<circle cx="${x}" cy="${y}" r="${r}" fill="${color}" ${attrs}/>`;
function svg(height, title, desc, body, width = 1000) {
  return `<svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${height}" viewBox="0 0 ${width} ${height}" role="img" aria-labelledby="title desc">
<title id="title">${title}</title><desc id="desc">${desc}</desc>
<style>
  .globe { transform-origin: 799px 181px; animation: orbit 45s linear infinite; }
  .rotor { transform-origin: 776px 74px; animation: orbit 24s linear infinite; }
  .reverse { animation-direction: reverse; animation-duration: 32s; }
  .signal { animation: signal 4s ease-in-out infinite alternate; }
  .flow { stroke-dasharray: 18 7 2 7; animation: flow 6s linear infinite; }
  @keyframes orbit { to { transform: rotate(360deg); } }
  @keyframes signal { from { opacity: .3; } to { opacity: 1; } }
  @keyframes flow { to { stroke-dashoffset: -204; } }
  @media (prefers-reduced-motion: reduce) { .globe, .rotor, .signal, .flow { animation: none; } }
</style>
<defs><radialGradient id="ambient"><stop stop-color="${C.mint}" stop-opacity=".09"/><stop offset="1" stop-color="${C.mint}" stop-opacity="0"/></radialGradient><linearGradient id="rim"><stop stop-color="${C.mint}" stop-opacity="0"/><stop offset=".5" stop-color="${C.mint}" stop-opacity=".4"/><stop offset="1" stop-color="${C.mint}" stop-opacity="0"/></linearGradient></defs>
<rect x=".5" y=".5" width="${width - 1}" height="${height - 1}" rx="16" fill="${C.bg}" stroke="${C.line}"/>
<path d="M 24 1 H ${width - 24}" stroke="url(#rim)"/>
${body}
</svg>\n`;
}

// Projected Fibonacci sphere, with depth-weighted nodes and connections.
const nodes = Array.from({ length: 155 }, (_, i) => {
  const y = 1 - (i / 154) * 2;
  const r = Math.sqrt(1 - y * y);
  const a = i * Math.PI * (3 - Math.sqrt(5));
  const x = Math.cos(a) * r;
  const z = Math.sin(a) * r;
  return { x, y, z, px: 799 + (x * .92 + y * .23) * 127, py: 181 + (y * .92 - x * .23) * 127 };
});
let globe = '';
for (let i = 0; i < nodes.length; i++) {
  const a = nodes[i];
  for (let j = i + 1; j < nodes.length; j++) {
    const b = nodes[j];
    if (Math.hypot(a.x - b.x, a.y - b.y, a.z - b.z) < .34) {
      globe += line(a.px, a.py, b.px, b.py, C.mint, `opacity="${(.10 + (a.z + b.z + 2) * .045).toFixed(2)}" stroke-width=".7"`);
    }
  }
}
for (const n of [...nodes].sort((a, b) => a.z - b.z)) globe += circle(n.px, n.py, n.z > .6 ? 2.3 : 1.3, C.mint, `opacity="${(.24 + (n.z + 1) * .35).toFixed(2)}"`);
let banner = '<ellipse cx="799" cy="181" rx="198" ry="166" fill="url(#ambient)"/>';
banner += label(42, 40, 'BINEETX', C.mint);
banner += line(42, 60, 958, 60);
banner += text(40, 139, 'Bineet Kumar', 54, C.ink, 'font-weight="600" letter-spacing="-2"');
banner += text(37, 218, 'Mohanta', 86, C.ink, 'font-weight="700" letter-spacing="-4"');
banner += `<ellipse cx="799" cy="181" rx="154" ry="53" transform="rotate(-28 799 181)" fill="none" stroke="${C.green}" stroke-width=".8"/><g class="globe">${globe}</g>`;
banner += circle(937, 113, 4, C.mint, 'class="signal"') + circle(937, 113, 9, 'none', `stroke="${C.mint}" opacity=".35"`);
banner += line(42, 296, 958, 296);
banner += label(42, 326, 'COMPUTATIONAL BIOLOGY');
banner += label(379, 326, 'BIOINFORMATICS');
banner += label(715, 326, 'SCIENTIFIC SOFTWARE');
await writeFile(new URL('banner.svg', out), svg(350, 'Bineet Kumar Mohanta', 'Computational biology, bioinformatics, and scientific software. A decorative geometric network sphere accompanies the name.', banner));
let compactBanner = label(24, 30, 'BINEETX', C.mint);
compactBanner += line(24, 46, 396, 46);
compactBanner += text(23, 98, 'Bineet Kumar', 34, C.ink, 'font-weight="600" letter-spacing="-1"');
compactBanner += text(21, 157, 'Mohanta', 62, C.ink, 'font-weight="700" letter-spacing="-3"');
compactBanner += `<g transform="translate(104 56) scale(.32)"><g class="globe">${globe}</g></g>`;
compactBanner += line(24, 213, 396, 213);
compactBanner += text(24, 239, 'Computational biology · Bioinformatics', 13, C.mint);
compactBanner += text(24, 260, 'Scientific software', 13);
await writeFile(new URL('banner-mobile.svg', out), svg(282, 'Bineet Kumar Mohanta', 'Computational biology, bioinformatics, and scientific software.', compactBanner, 420));

function arc(cx, cy, r, start, end) {
  const point = a => [cx + r * Math.cos(a * Math.PI / 180), cy + r * Math.sin(a * Math.PI / 180)];
  const [x1, y1] = point(start), [x2, y2] = point(end);
  return `M ${x1} ${y1} A ${r} ${r} 0 ${end - start > 180 ? 1 : 0} 1 ${x2} ${y2}`;
}
// Project names live in artwork; descriptions and links remain editable Markdown.
const projects = [
  { name: 'GENOCULAR', file: 'genocular', accent: C.mint },
  { name: 'GeMemiOM', file: 'gememiom', accent: C.mint },
  { name: 'MyoCircBase', file: 'myocircbase', accent: C.mint },
];
for (const [index, project] of projects.entries()) {
  let body = '<ellipse cx="776" cy="74" rx="158" ry="72" fill="url(#ambient)"/>';
  body += label(36, 36, `0${index + 1}`, project.accent);
  body += text(33, 104, project.name, 51, C.ink, 'font-weight="600" letter-spacing="-1.5"');
  body += line(595, 24, 595, 124);
  body += `<path d="M 936 40 H 954 V 58 M 935 59 L 954 40" fill="none" stroke="${project.accent}" stroke-width="1.5"/>`;
  if (index === 0) {
    body += '<g class="rotor">';
    for (let ring = 0; ring < 3; ring++) for (let i = 0; i < 24; i++) {
      body += `<path d="${arc(776, 74, 56 - ring * 12, i * 15 + 2, i * 15 + 12)}" fill="none" stroke="${[project.accent, C.green, C.ink][(i + ring) % 3]}" stroke-width="${ring === 0 ? 5 : 3}"/>`;
    }
    body += '</g>';
    body += circle(776, 74, 16, 'none', `stroke="${C.green}"`);
    body += line(771, 74, 781, 74, project.accent) + line(776, 69, 776, 79, project.accent);
  } else if (index === 1) {
    // Abstract interleaved waves; decorative, not a claim about project features.
    for (let i = 0; i < 14; i++) body += `<path class="flow" style="animation-delay: -${i * .25}s" d="M 655 ${35 + i * 5} C 724 ${-20 + i * 10}, 811 ${168 - i * 10}, 893 ${45 + i * 4}" fill="none" stroke="${project.accent}" stroke-width="1" opacity="${.2 + i * .045}"/>`;
  } else {
    body += '<g class="rotor reverse">';
    for (let i = 0; i < 4; i++) body += `<ellipse cx="776" cy="74" rx="${64 - i * 8}" ry="${38 + i * 6}" transform="rotate(${i * 30} 776 74)" fill="none" stroke="${project.accent}" opacity="${.3 + i * .15}"/>`;
    body += '</g>';
    body += circle(776, 74, 4, project.accent) + circle(839, 74, 3, C.ink);
  }
  await writeFile(new URL(`${project.file}.svg`, out), svg(148, project.name, `${project.name}. Decorative project artwork; descriptions and links are in the README.`, body));
}

// SVG image documents do not consistently inherit reduced-motion media queries.
// Native picture sources select these still versions in the README instead.
for (const name of ['banner', 'banner-mobile', 'genocular', 'gememiom', 'myocircbase']) {
  const animated = await readFile(new URL(`${name}.svg`, out), 'utf8');
  await writeFile(new URL(`${name}-still.svg`, out), animated.replace(/<style>[\s\S]*?<\/style>/, ''));
}
console.log('Built animated artwork, mobile variants, and reduced-motion alternatives.');
