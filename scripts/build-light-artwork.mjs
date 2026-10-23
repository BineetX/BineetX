// Separate light assets keep the original dark SVGs byte-for-byte intact.
import { mkdir, readFile, writeFile } from 'node:fs/promises';
import { pathToFileURL } from 'node:url';

const assets = new URL('../assets/', import.meta.url);
const palette = {
  '#0D1117': '#FFFFFF', '#131E2B': '#F1F6FB', '#152132': '#F1F6FB',
  '#253347': '#D1D9E0', '#2B3B50': '#C5D2DF', '#314359': '#B8C9D9',
  '#1D2B3B': '#E2EAF2', '#38566C': '#9AAFC2', '#28465B': '#A5BED1',
  '#F0F6FC': '#1F2937', '#DDEAF7': '#243B53', '#A7B6CA': '#526579',
  '#7DD3FC': '#0369A1', '#487891': '#48748B', '#647D95': '#647D95',
  '#DDF6FF': '#075985', '#B4C6E7': '#5965A6', '#5EEAD4': '#0F766E',
  '#A5B4FC': '#6366B1',
};

export function lightArtwork(svg) {
  // Only presentation attributes change. Embedded brand logos, screenshots,
  // mask luminance, geometry, accessible text, and animation remain intact.
  return svg.replace(/<(?:rect|path|circle|ellipse|line|polyline|polygon|g|text|stop)\b[^>]*>/g, tag =>
    tag.replace(/\b(fill|stroke|stop-color)="(#[\da-f]{6})"/gi, (attribute, name, color) => {
      const key = color.toUpperCase();
      // White backing plates belong to the raster logos and screenshots.
      if (tag.startsWith('<rect ') && name === 'fill' && key === '#F0F6FC') return attribute;
      return palette[key] ? `${name}="${palette[key]}"` : attribute;
    }));
}

export async function writeLightArtwork(file, svg) {
  const output = new URL(`light/${file}`, assets);
  await mkdir(new URL('.', output), { recursive: true });
  await writeFile(output, lightArtwork(svg));
}

export async function buildLightArtwork() {
  const variants = name => ['', '-mobile', '-still', '-mobile-still'].map(suffix => `${name}${suffix}.svg`);
  const files = [
    ...['banner', 'research-motion', 'skills'].flatMap(variants),
    ...['genocular', 'gememiom', 'myocircbase', 'bioinformatica'].flatMap(name => variants(`projects/${name}`)),
    ...['linkedin', 'googlescholar', 'orcid', 'researchgate', 'x', 'youtube'].flatMap(name =>
      [`socials/${name}.svg`, `socials/${name}-still.svg`]),
    ...['research', 'skills', 'activity', 'projects', 'portfolio'].map(name => `navigation/${name}.svg`),
    'activity.svg', 'activity-mobile.svg',
  ];
  for (const file of files) await writeLightArtwork(file, await readFile(new URL(file, assets), 'utf8'));
  console.log(`Built ${files.length} light-mode artwork variants.`);
}

if (process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href) await buildLightArtwork();
