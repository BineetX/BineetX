// Self-contained SVG animations: no scripts, fonts, or remote image dependencies.
import { mkdir, writeFile } from 'node:fs/promises';

const out = new URL('../assets/', import.meta.url);
await mkdir(out, { recursive: true });
const ink = '#F0F6FC', dim = '#A7B6CA', cyan = '#7DD3FC', line = '#253347';
const text = (x, y, value, size = 13, color = dim, extra = '') =>
  `<text x="${x}" y="${y}" fill="${color}" font-family="Arial, Helvetica, sans-serif" font-size="${size}" ${extra}>${value}</text>`;
const path = (d, color, extra = '') => `<path d="${d}" fill="none" stroke="${color}" ${extra}/>`;
const dot = (x, y, r, fill, extra = '') => `<circle cx="${x}" cy="${y}" r="${r}" fill="${fill}" ${extra}/>`;

// Shared node/edge coordinates keep the constellation connected as it moves.
const nodes = [[28,92],[65,45],[75,137],[120,79],[151,29],[162,126],[202,65],[240,119],[272,45],[282,153]];
const edges = [[0,1],[0,2],[0,3],[1,3],[1,4],[2,3],[2,5],[3,4],[3,5],[3,6],[4,6],[5,6],[5,7],[6,7],[6,8],[7,8],[7,9],[8,9]];
let graph = '<g class="constellation">';
for (const [i, [a, b]] of edges.entries()) {
  const d = `M ${nodes[a].join(' ')} L ${nodes[b].join(' ')}`;
  graph += path(d, '#38566C', 'stroke-width="1"');
  graph += path(d, cyan, `class="message" pathLength="100" stroke-width="1.5" stroke-dasharray="8 92" style="animation-delay:-${i * .43}s"`);
}
for (const [i, [x, y]] of nodes.entries()) {
  const color = [cyan, '#B4C6E7', '#5EEAD4'][i % 3];
  graph += dot(x, y, 12, 'none', `class="halo" stroke="${color}" stroke-width="1" opacity=".25" style="transform-origin:${x}px ${y}px;animation-delay:-${i * .51}s"`);
  if (i % 3 === 0) graph += `<rect x="${x - 4}" y="${y - 4}" width="8" height="8" rx="1.5" fill="${color}"/>`;
  else graph += dot(x, y, 4, color);
}
graph += '</g>';
graph += text(22, 190, 'DRUG', 9, cyan, 'letter-spacing="1.4"') + text(113, 190, 'GENE', 9, '#B4C6E7', 'letter-spacing="1.4"') + text(202, 190, 'CONTEXT', 9, '#5EEAD4', 'letter-spacing="1.4"');

// Deliberately schematic, without scores or quantitative experimental claims.
let matrix = '';
for (let row = 0; row < 6; row++) for (let col = 0; col < 8; col++) {
  const opacity = (.18 + ((row * 3 + col * 5) % 9) * .075).toFixed(3);
  matrix += `<rect x="${44 + col * 29}" y="${26 + row * 23}" width="23" height="17" rx="3" fill="${cyan}" opacity="${opacity}" class="cell" style="animation-delay:-${(row + col) * .47}s"/>`;
}
matrix += '<g clip-path="url(#matrix-clip)"><rect class="scan" x="38" y="20" width="37" height="143" fill="url(#scan-light)"/><path class="scan" d="M 73 20 V 163" stroke="#DDF6FF" opacity=".6"/></g>';
matrix += path('M 38 22 V 168 H 278', '#38566C');
matrix += text(122, 190, 'DRUG B', 9, dim, 'letter-spacing="1.4"');
matrix += text(19, 112, 'DRUG A', 9, dim, 'letter-spacing="1.4" transform="rotate(-90 19 112)"');

const modelPoint = t => [37 + t * 241, 157 - 119 / (1 + Math.exp(-9 * (t - .48)))];
const curve = Array.from({ length: 61 }, (_, i) => modelPoint(i / 60));
const distances = [0];
for (let i = 1; i < curve.length; i++) {
  distances.push(distances[i - 1] + Math.hypot(curve[i][0] - curve[i - 1][0], curve[i][1] - curve[i - 1][1]));
}
const drawFrames = distances.map((distance, i) => `${(i / 60 * 100).toFixed(3)}%{stroke-dashoffset:${(100 - distance / distances.at(-1) * 100).toFixed(3)}}`).join('');
const modelPath = curve.map(([x,y], i) => `${i ? 'L' : 'M'} ${x.toFixed(2)} ${y.toFixed(2)}`).join(' ');
let model = '';
for (let i = 0; i < 5; i++) model += path(`M 37 ${35 + i * 31} H 278`, '#1D2B3B');
for (let i = 0; i < 5; i++) model += path(`M ${37 + i * 60} 23 V 166`, '#1D2B3B');
model += path('M 37 23 V 166 H 278', '#487891');
model += `<path d="${modelPath} L 278 166 H 37 Z" fill="url(#model-fill)"/>`;
model += path('M 37 155 C 95 156 120 134 161 110 S 235 66 278 27', '#647D95', 'stroke-width="1.5" stroke-dasharray="4 6"');
model += path(modelPath, '#28465B', 'stroke-width="2"');
model += path(modelPath, cyan, 'class="trajectory" pathLength="100" stroke-width="2.5" stroke-linecap="round"');
const [startX, startY] = modelPoint(0);
model += `<g class="tracer" style="transform:translate(${startX}px,${startY}px)">${dot(0,0,10,cyan,'opacity=".12"')}${dot(0,0,4,ink)}</g>`;
model += text(124, 190, 'MODEL TIME', 9, dim, 'letter-spacing="1.4"');
model += text(18, 125, 'RESPONSE', 9, dim, 'letter-spacing="1.4" transform="rotate(-90 18 125)"');

const tracerFrames = curve.map(([x,y], i) => {
  return `${(i / 60 * 100).toFixed(3)}%{transform:translate(${x.toFixed(2)}px,${y.toFixed(2)}px)}`;
}).join('');
const styles = `<style>
  .constellation{transform-origin:155px 91px;animation:drift 12s ease-in-out infinite alternate}
  .message{animation:transmit 5s linear infinite}
  .halo{animation:breathe 5s ease-in-out infinite}
  .cell{animation:heat 6s ease-in-out infinite}
  .scan{animation:scan 7s ease-in-out infinite alternate}
  .trajectory{stroke-dasharray:100;animation:draw 9s linear infinite}
  .tracer{animation:trace 9s linear infinite}
  @keyframes drift{from{transform:rotate(-4deg) translateY(-2px)}to{transform:rotate(4deg) translateY(3px)}}
  @keyframes transmit{to{stroke-dashoffset:-100}}
  @keyframes breathe{0%,100%{opacity:.15;transform:scale(.8)}50%{opacity:.5;transform:scale(1.25)}}
  @keyframes heat{0%,100%{fill:#487891}50%{fill:#A7E5FF}}
  @keyframes scan{from{transform:translateX(0)}to{transform:translateX(205px)}}
  @keyframes draw{${drawFrames}}
  @keyframes trace{${tracerFrames}}
  @media(prefers-reduced-motion:reduce){.constellation,.message,.halo,.cell,.scan,.trajectory,.tracer{animation:none}}
</style>`;

const panels = [
  { number:'01', title:'Graph constellations', subtitle:'Heterogeneous message passing', art:graph },
  { number:'02', title:'Drug synergy', subtitle:'Learning across combinations', art:matrix },
  { number:'03', title:'Mathematical models', subtitle:'Tracing a system over time', art:model },
];
const description = 'Animated illustrative research diagrams: a connected graph constellation with travelling signals, a changing drug-combination matrix, and a traced mathematical response curve. Conceptual illustrations, not experimental results.';

function render(mobile, animated) {
  const width = mobile ? 420 : 1000, height = mobile ? 908 : 326;
  let body = '';
  for (const [i, panel] of panels.entries()) {
    const x = mobile ? 55 : 22 + i * 333, y = mobile ? 23 + i * 288 : 23;
    if (i) body += mobile ? path(`M 30 ${y - 9} H 390`,line) : path(`M ${i * 333} 28 V 280`,line);
    body += `<g transform="translate(${x} ${y})" data-panel="${i}">`;
    body += text(8, 9, panel.number, 10, cyan, 'letter-spacing="2"');
    body += `<ellipse cx="155" cy="110" rx="145" ry="95" fill="url(#ambient)"/>`;
    body += `<g transform="translate(0 14)">${panel.art}</g>`;
    body += text(8, 235, panel.title, 21, ink, 'font-weight="600"');
    body += text(8, 256, panel.subtitle, 12);
    body += '</g>';
  }
  body += text(mobile ? 63 : 30, height - 16, 'CONCEPTUAL MOTION · NOT EXPERIMENTAL DATA', mobile ? 10 : 9, '#8094AA', 'letter-spacing="1"');
  return `<svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${height}" viewBox="0 0 ${width} ${height}" role="img" aria-labelledby="title desc">
<title id="title">Research in motion${animated ? '' : ' — still view'}</title>
<desc id="desc">${animated ? description : description.replace('Animated illustrative', 'Static illustrative').replace('with travelling signals', 'with signal paths').replace('changing drug-combination', 'drug-combination')}</desc>
${animated ? styles : ''}
<defs>
  <radialGradient id="ambient"><stop stop-color="${cyan}" stop-opacity=".09"/><stop offset="1" stop-color="${cyan}" stop-opacity="0"/></radialGradient>
  <linearGradient id="rim"><stop stop-color="${cyan}" stop-opacity="0"/><stop offset=".5" stop-color="${cyan}" stop-opacity=".5"/><stop offset="1" stop-color="${cyan}" stop-opacity="0"/></linearGradient>
  <linearGradient id="model-fill" x1="0" y1="0" x2="0" y2="1"><stop stop-color="${cyan}" stop-opacity=".16"/><stop offset="1" stop-color="${cyan}" stop-opacity="0"/></linearGradient>
  <linearGradient id="scan-light"><stop stop-color="${cyan}" stop-opacity="0"/><stop offset="1" stop-color="${cyan}" stop-opacity=".16"/></linearGradient>
  <clipPath id="matrix-clip"><rect x="38" y="20" width="240" height="143"/></clipPath>
</defs>
<rect x=".5" y=".5" width="${width - 1}" height="${height - 1}" rx="16" fill="#0D1117" stroke="${line}"/>
<path d="M 24 1 H ${width - 24}" stroke="url(#rim)"/>
${body}
</svg>\n`;
}

for (const mobile of [false, true]) for (const animated of [true, false]) {
  const name = `research${mobile ? '-mobile' : ''}${animated ? '' : '-still'}.svg`;
  await writeFile(new URL(name, out), render(mobile, animated));
}
console.log('Built research animations and desktop/mobile still alternatives.');
