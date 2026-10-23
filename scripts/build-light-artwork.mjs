// Separate light assets keep the original dark SVGs byte-for-byte intact.
import { mkdir, readFile, writeFile } from 'node:fs/promises';
import { pathToFileURL } from 'node:url';

const assets = new URL('../assets/', import.meta.url);
const palette = {
  // Mirror the original surface hierarchy: raised highlights above the base,
  // then frame lines, supporting strokes, accents, and foreground ink.
  '#0D1117': '#F6F8FA', '#131E2B': '#FFFFFF', '#152132': '#FFFFFF',
  '#253347': '#C7D2DE', '#2B3B50': '#BDCBD9', '#314359': '#AEBFD0',
  '#1D2B3B': '#E0E7EE', '#38566C': '#8CA6BC', '#28465B': '#AEC5D7',
  '#F0F6FC': '#0D1117', '#DDEAF7': '#1D2E42', '#A7B6CA': '#465B72',
  '#7DD3FC': '#0879B0', '#487891': '#527D96', '#647D95': '#637F98',
  '#DDF6FF': '#034F7A', '#B4C6E7': '#657AA6', '#5EEAD4': '#0D9488',
  '#A5B4FC': '#6573B9',
  // Heatmap keyframes use CSS fills instead of presentation attributes.
  '#29445D': '#C5E4F1', '#C3F0FF': '#0879B0',
};

export function lightArtwork(svg) {
  // Keep the original drawing and effects. Change only paint colors, including
  // animated fills; embedded brands, screenshots, and mask luminance stay intact.
  const artwork = svg.replace(/<(?:rect|path|circle|ellipse|line|polyline|polygon|g|text|stop)\b[^>]*>/g, tag =>
    tag.replace(/\b(fill|stroke|stop-color)="(#[\da-f]{6})"/gi, (attribute, name, color) => {
      const key = color.toUpperCase();
      // White backing plates belong to the raster logos and screenshots.
      if (tag.startsWith('<rect ') && name === 'fill' && key === '#F0F6FC') return attribute;
      return palette[key] ? `${name}="${palette[key]}"` : attribute;
    }));
  return artwork
    .replace(/<style>[\s\S]*?<\/style>/g, style =>
      style.replace(/\b(fill|stroke|stop-color)\s*:\s*(#[\da-f]{6})\b/gi,
        (declaration, property, color) => palette[color.toUpperCase()]
          ? `${property}:${palette[color.toUpperCase()]}` : declaration))
    // Ambient light stays cyan light, rather than becoming an ink-colored haze.
    // The original gradient shapes, opacity, falloff, and motion are unchanged.
    .replace(/<radialGradient\b[^>]*>[\s\S]*?<\/radialGradient>/g, gradient =>
      gradient.replaceAll('stop-color="#0879B0"', 'stop-color="#38BDF8"'));
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
