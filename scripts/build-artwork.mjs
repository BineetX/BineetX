// Deterministic, dependency-free vector artwork. Run: node scripts/build-artwork.mjs
import { mkdir, writeFile } from 'node:fs/promises';

const out = new URL('../assets/', import.meta.url);
await mkdir(out, { recursive: true });
const C = { bg: '#101615', line: '#2A3632', ink: '#F2F0E7', dim: '#A9B6AE', mint: '#B5E8C3', green: '#688F7A' };
const text = (x, y, value, size = 14, color = C.dim, attrs = '') => `<text x="${x}" y="${y}" fill="${color}" font-family="Arial, Helvetica, sans-serif" font-size="${size}" ${attrs}>${value}</text>`;
const label = (x, y, value, color = C.dim) => text(x, y, value, 12, color, 'letter-spacing="2"');
const line = (x1, y1, x2, y2, color = C.line, attrs = '') => `<line x1="${x1}" y1="${y1}" x2="${x2}" y2="${y2}" stroke="${color}" ${attrs}/>`;
const circle = (x, y, r, color = C.mint, attrs = '') => `<circle cx="${x}" cy="${y}" r="${r}" fill="${color}" ${attrs}/>`;
function svg(height, title, desc, body, width = 1000) {
  return `<svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${height}" viewBox="0 0 ${width} ${height}" role="img" aria-labelledby="title desc">
<title id="title">${title}</title><desc id="desc">${desc}</desc>
<rect x=".5" y=".5" width="${width - 1}" height="${height - 1}" rx="6" fill="${C.bg}" stroke="${C.line}"/>
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
let banner = label(42, 40, 'BINEETX     /     RESEARCH &amp; ENGINEERING', C.mint);
banner += line(42, 60, 958, 60);
banner += text(40, 139, 'Bineet Kumar', 54, C.ink, 'font-weight="600" letter-spacing="-2"');
banner += text(37, 218, 'Mohanta', 86, C.ink, 'font-weight="700" letter-spacing="-4"');
banner += text(42, 260, 'Biological questions. Computational thinking.', 18, C.dim);
banner += `<ellipse cx="799" cy="181" rx="154" ry="53" transform="rotate(-28 799 181)" fill="none" stroke="${C.green}" stroke-width=".8"/>${globe}`;
banner += circle(937, 113, 4) + circle(937, 113, 9, 'none', `stroke="${C.mint}" opacity=".35"`);
banner += line(42, 296, 958, 296);
banner += label(42, 326, 'COMPUTATIONAL BIOLOGY');
banner += label(379, 326, 'BIOINFORMATICS');
banner += label(715, 326, 'SCIENTIFIC SOFTWARE');
await writeFile(new URL('banner.svg', out), svg(350, 'Bineet Kumar Mohanta', 'Computational biology, bioinformatics, and scientific software. A decorative geometric network sphere accompanies the name.', banner));
let compactBanner = label(24, 30, 'BINEETX / RESEARCH &amp; ENGINEERING', C.mint);
compactBanner += line(24, 46, 396, 46);
compactBanner += text(23, 98, 'Bineet Kumar', 34, C.ink, 'font-weight="600" letter-spacing="-1"');
compactBanner += text(21, 157, 'Mohanta', 62, C.ink, 'font-weight="700" letter-spacing="-3"');
compactBanner += `<g transform="translate(104 56) scale(.32)">${globe}</g>`;
compactBanner += text(24, 192, 'Biological questions. Computational thinking.', 14);
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
  { name: 'GemeMiom', file: 'gememiom', accent: '#B6CCC9' },
  { name: 'MyoCircBase', file: 'myocircbase', accent: '#D9CEA9' },
];
for (const [index, project] of projects.entries()) {
  let body = label(36, 36, `PROJECT / 0${index + 1}`, project.accent);
  body += text(33, 104, project.name, 51, C.ink, 'font-weight="600" letter-spacing="-1.5"');
  body += line(595, 24, 595, 124);
  body += `<path d="M 936 40 H 954 V 58 M 935 59 L 954 40" fill="none" stroke="${project.accent}" stroke-width="1.5"/>`;
  if (index === 0) {
    for (let ring = 0; ring < 3; ring++) for (let i = 0; i < 24; i++) {
      body += `<path d="${arc(776, 74, 56 - ring * 12, i * 15 + 2, i * 15 + 12)}" fill="none" stroke="${[project.accent, C.green, C.ink][(i + ring) % 3]}" stroke-width="${ring === 0 ? 5 : 3}"/>`;
    }
    body += circle(776, 74, 16, 'none', `stroke="${C.green}"`);
    body += line(771, 74, 781, 74, project.accent) + line(776, 69, 776, 79, project.accent);
  } else if (index === 1) {
    // Abstract interleaved waves; decorative, not a claim about project features.
    for (let i = 0; i < 14; i++) body += `<path d="M 655 ${35 + i * 5} C 724 ${-20 + i * 10}, 811 ${168 - i * 10}, 893 ${45 + i * 4}" fill="none" stroke="${project.accent}" stroke-width="1" opacity="${.2 + i * .045}"/>`;
  } else {
    for (let i = 0; i < 4; i++) body += `<ellipse cx="776" cy="74" rx="${64 - i * 8}" ry="${38 + i * 6}" transform="rotate(${i * 30} 776 74)" fill="none" stroke="${project.accent}" opacity="${.3 + i * .15}"/>`;
    body += circle(776, 74, 4, project.accent) + circle(839, 74, 3, C.ink);
  }
  await writeFile(new URL(`${project.file}.svg`, out), svg(148, project.name, `${project.name}. Decorative project artwork; descriptions and links are in the README.`, body));
}

let research = line(333, 28, 333, 231) + line(666, 28, 666, 231);
const graph = [[49,79],[97,44],[121,111],[174,67],[216,108],[261,51],[283,123]];
for (const [i,j] of [[0,1],[0,2],[1,2],[1,3],[2,3],[2,4],[3,4],[3,5],[4,5],[4,6],[5,6]]) research += line(...graph[i], ...graph[j], C.green);
for (const [i, p] of graph.entries()) research += circle(...p, i === 3 ? 7 : 4, i === 3 ? C.ink : C.mint);
research += label(30, 166, '01 / REPRESENT');
research += text(30, 198, 'Learning on graphs', 22, C.ink, 'font-weight="600"');
research += text(30, 223, 'Neural networks · Biological knowledge', 14);
// Schematic interaction matrix: no numeric scale or invented experimental results.
for (let row = 0; row < 5; row++) for (let col = 0; col < 8; col++) research += `<rect x="${376 + col * 30}" y="${32 + row * 20}" width="25" height="15" rx="2" fill="${C.mint}" opacity="${(.12 + ((row + col * 3) % 7) * .11).toFixed(2)}"/>`;
research += label(363, 166, '02 / PREDICT');
research += text(363, 198, 'Drug combinations', 22, C.ink, 'font-weight="600"');
research += text(363, 223, 'Multimodal learning · Synergy prediction', 14);
research += line(708, 130, 951, 130) + line(708, 130, 708, 31);
research += `<path d="M 708 124 C 751 123 764 99 799 78 S 874 52 951 35" fill="none" stroke="${C.mint}" stroke-width="2"/>`;
research += `<path d="M 708 124 C 755 124 781 123 816 102 S 894 84 951 43" fill="none" stroke="${C.green}" stroke-width="1.5" stroke-dasharray="4 5"/>`;
research += circle(799, 78, 4) + circle(900, 47, 4);
research += label(696, 166, '03 / UNDERSTAND');
research += text(696, 198, 'Models &amp; workflows', 22, C.ink, 'font-weight="600"');
research += text(696, 223, 'Mathematical modelling · Reproducibility', 14);
await writeFile(new URL('research.svg', out), svg(255, 'Research directions', 'Illustrative research diagrams for graph learning, biological knowledge graphs, multimodal drug-combination prediction, mathematical modelling, and reproducible workflows. Not experimental results.', research));
let compactResearch = '';
const researchRows = [
  ['01 / REPRESENT', 'Learning on graphs', 'Neural networks', 'Biological knowledge graphs'],
  ['02 / PREDICT', 'Drug combinations', 'Multimodal learning', 'Synergy prediction'],
  ['03 / UNDERSTAND', 'Models &amp; workflows', 'Mathematical modelling', 'Reproducible bioinformatics'],
];
for (const [i, [eyebrow, title, first, second]] of researchRows.entries()) {
  const y = i * 142;
  if (i) compactResearch += line(24, y, 396, y);
  compactResearch += label(24, y + 29, eyebrow, C.mint);
  compactResearch += text(24, y + 63, title, 24, C.ink, 'font-weight="600"');
  compactResearch += text(24, y + 91, first, 15) + text(24, y + 113, second, 15);
  compactResearch += circle(371, y + 29, 4, C.mint) + circle(371, y + 29, 10, 'none', `stroke="${C.green}"`);
}
await writeFile(new URL('research-mobile.svg', out), svg(426, 'Research directions', 'Graph learning, drug-combination prediction, mathematical modelling, and reproducible workflows.', compactResearch, 420));
console.log('Built banner, three project covers, and research artwork.');
