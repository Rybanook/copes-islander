#!/usr/bin/env node
// One-shot: resize/compress the 14 referenced photos from dev-assets/ into public/photos/.
// Read-only on dev-assets. Run: node scripts/optimize-photos.mjs

import sharp from 'sharp';
import { mkdir, stat } from 'node:fs/promises';
import { join, extname, basename } from 'node:path';

const SRC_DIR = 'dev-assets';
const OUT_DIR = 'public/photos';
const MAX_DIMENSION = 1600;
const JPEG_QUALITY = 80;

const FILES = [
  'logo2.png',
  'map-osm.png',
  'IMG_0284.JPG',
  'IMG_0278.JPG',
  'IMG_0267.JPG',
  'IMG_0234.JPG',
  'livingroom.JPG',
  'bedroom.JPG',
  'steps_to_beach.JPG',
  'twilight_sky.JPG',
  'corner_window.JPG',
  'pink_sunset.JPG',
  'bluesky_water_grass.JPG',
  'BBQ.JPG',
];

function formatBytes(b) {
  if (b < 1024) return `${b} B`;
  if (b < 1024 * 1024) return `${(b / 1024).toFixed(1)} KB`;
  return `${(b / (1024 * 1024)).toFixed(2)} MB`;
}

await mkdir(OUT_DIR, { recursive: true });

let totalIn = 0;
let totalOut = 0;

for (const file of FILES) {
  const inputPath = join(SRC_DIR, file);
  const base = basename(file, extname(file));

  let outFile;
  let pipeline = sharp(inputPath);

  if (file === 'map-osm.png') {
    outFile = `${base}.png`;
    pipeline = pipeline.rotate().png({ palette: true, quality: 80, compressionLevel: 9 });
  } else if (file === 'logo2.png') {
    outFile = 'Logo.png';
    pipeline = pipeline
      .rotate()
      .trim()
      .resize({ width: 400, height: 400, fit: 'inside', withoutEnlargement: true })
      .png({ palette: true, quality: 80, compressionLevel: 9 });
  } else {
    outFile = `${base}.jpg`;
    pipeline = pipeline
      .rotate()
      .resize({ width: MAX_DIMENSION, height: MAX_DIMENSION, fit: 'inside', withoutEnlargement: true })
      .jpeg({ quality: JPEG_QUALITY, mozjpeg: true });
  }

  const outputPath = join(OUT_DIR, outFile);
  await pipeline.toFile(outputPath);

  const inStat = await stat(inputPath);
  const outStat = await stat(outputPath);
  totalIn += inStat.size;
  totalOut += outStat.size;

  const reduction = ((1 - outStat.size / inStat.size) * 100).toFixed(0);
  console.log(
    `${file.padEnd(30)} → ${outFile.padEnd(30)} ${formatBytes(inStat.size).padStart(10)} → ${formatBytes(outStat.size).padStart(10)}  (${reduction}% smaller)`
  );
}

console.log('---');
console.log(`Total: ${formatBytes(totalIn)} → ${formatBytes(totalOut)}  (${((1 - totalOut / totalIn) * 100).toFixed(0)}% smaller)`);
