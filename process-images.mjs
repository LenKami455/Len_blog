/**
 * process-images.mjs
 *
 * Usage:
 *   node process-images.mjs          # convert new images only (skip if .webp already exists)
 *   node process-images.mjs --all    # reconvert everything
 *
 * - Skips original/ subdirectories
 * - JPG/JPEG → WebP quality 82
 * - PNG → WebP lossless (preserves transparency)
 */

import sharp from 'sharp';
import fs from 'fs';
import path from 'path';

const ROOT = './public/images';
const FORCE = process.argv.includes('--all');

function walk(dir) {
  const entries = fs.readdirSync(dir, { withFileTypes: true });
  const files = [];
  for (const e of entries) {
    const full = path.join(dir, e.name);
    if (e.isDirectory()) {
      if (e.name === 'original') continue; // skip originals
      files.push(...walk(full));
    } else if (/\.(jpg|jpeg|png)$/i.test(e.name)) {
      files.push(full);
    }
  }
  return files;
}

const files = walk(ROOT);
let converted = 0, skipped = 0;

for (const src of files) {
  const ext = path.extname(src);
  const dst = src.replace(new RegExp(ext + '$', 'i'), '.webp');

  if (!FORCE && fs.existsSync(dst)) {
    skipped++;
    continue;
  }

  const isPng = /\.png$/i.test(src);
  const origSize = fs.statSync(src).size;

  try {
    let pipeline = sharp(src);
    if (isPng) {
      pipeline = pipeline.webp({ lossless: true });
    } else {
      pipeline = pipeline.webp({ quality: 82 });
    }
    const info = await pipeline.toFile(dst);
    const ratio = Math.round((1 - info.size / origSize) * 100);
    console.log(`✓ ${path.relative(ROOT, src).padEnd(45)} ${Math.round(origSize/1024)}KB → ${Math.round(info.size/1024)}KB (-${ratio}%)`);
    converted++;
  } catch (e) {
    console.error(`✗ ${src}: ${e.message}`);
  }
}

console.log(`\nDone. Converted: ${converted}, Skipped (already exist): ${skipped}`);
