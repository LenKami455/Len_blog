// 須磨フォトログ生成（単発、キャプションなし）
import fs from 'fs';

const slug = 'suma';

const portraitSet = new Set([
  'a7c07545', 'a7c07623', 'a7c07627', 'a7c07647', 'a7c07651', 'a7c07658',
]);
const wideSet = new Set([
  'a7c07450', 'a7c07629',
]);

const dir = 'public/images/photolog/' + slug + '/';
const files = fs.readdirSync(dir).sort();

function key(f) { return f.replace('.webp', ''); }

function gridItem(f) {
  const k = key(f);
  let cls = 'pl-item';
  if (portraitSet.has(k)) cls += ' pl-item--portrait';
  else if (wideSet.has(k)) cls += ' pl-item--wide';
  return `  <div class="${cls}">
    <img src="/images/photolog/${slug}/${f}" alt="" />
  </div>`;
}

const bodyGrid = `<div class="pl-header">
  <span class="pl-month">Aug. 11 — 須磨浦公園 → 須磨海岸</span>
</div>

<div class="pl-grid">
${files.map(gridItem).join('\n')}
</div>`;

const md = `---
title: '須磨 photo log vol.1'
description: '須磨浦公園から山上遊園のリフト、回転展望閣、須磨海岸まで。明石海峡大橋を望む夏の日帰りフォトログ。'
pubDate: '2026-08-13T22:00:00'
heroImage: '/images/photolog/${slug}/a7c07450.webp'
tags: ['フォトログ', '須磨', '神戸', '兵庫']
category: 'フォトログ'
---

<p class="post-no">No. 048 &nbsp;·&nbsp; photo log · Suma vol.1</p>

---

> 須磨浦公園から山の上のリフトへ、そして須磨の海へ。明石海峡大橋を望む、夏の日帰り。

${bodyGrid}

<div class="sign-off">
  <p class="s-name">— Len</p>
  <p class="s-message">旅と写真とコーヒーと。</p>
</div>
`;

fs.writeFileSync('src/content/blog/048-suma-photolog-vol1.md', md);
console.log('Wrote 048-suma-photolog-vol1.md (' + files.length + ' photos)');
