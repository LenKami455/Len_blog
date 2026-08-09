// 那智勝浦・太地フォトログ生成（4-vol構成、キャプションなし）
import fs from 'fs';

const vols = JSON.parse(fs.readFileSync('nachi-vols.json', 'utf8'));

// 各volの冒頭を飾る印象的なワイドショット（手動指定）
const WIDE = new Set([
  'a7c05214', 'a7c05269', // vol1: 電車、港町
  'a7c05456', 'a7c05505', // vol2: 三重塔+滝、那智御瀧
  'a7c05740', 'a7c06000', // vol3: クジラジャンプ、ハナゴンドウ
  'a7c06987', 'a7c07267', // vol4: イルカトンネル、終盤
]);

function key(f) { return f.replace('.webp', ''); }

function gridItem(volSlug, item) {
  const k = key(item.f);
  let cls = 'pl-item';
  if (item.portrait) cls += ' pl-item--portrait';
  else if (WIDE.has(k)) cls += ' pl-item--wide';
  return `  <div class="${cls}">
    <img src="/images/photolog/${volSlug}/${item.f}" alt="" />
  </div>`;
}

const VOL_META = [
  {
    vol: 1, slug: 'nachikatsuura-vol1', postId: '044-nachikatsuura-photolog-vol1',
    title: '那智勝浦 photo log vol.1',
    desc: '4周年記念旅行、那智勝浦・太地のフォトログ前半。くろしお1号の車窓、港町勝浦、大門坂の杉並木ハイキングの記録。',
    hero: 'a7c05269',
    lead: '4周年記念旅行、那智勝浦・太地へ。前半は電車の車窓から、港町を歩いて大門坂の杉並木を登るまで。',
    section: 'Jul. 25 — 勝浦 → 大門坂',
    relatedArticle: '042-nachikatsuura-vol1',
    relatedTitle: '4周年記念、那智勝浦・太地へ。vol.1',
    pubDateSec: '00:44:00',
  },
  {
    vol: 2, slug: 'nachikatsuura-vol2', postId: '045-nachikatsuura-photolog-vol2',
    title: '那智勝浦 photo log vol.2',
    desc: '那智勝浦・太地フォトログ、続き。熊野那智大社・青岸渡寺・三重塔、落差日本一の那智御瀧、亀の井ホテルの夕食・朝食、星空撮影まで。',
    hero: 'a7c05456',
    lead: '熊野那智大社と那智御瀧、そして亀の井ホテルでの食事と星空。1日目の後半戦。',
    section: 'Jul. 25 — 熊野那智大社 → 那智御瀧 → 宿',
    relatedArticle: '042-nachikatsuura-vol1',
    relatedTitle: '4周年記念、那智勝浦・太地へ。vol.1',
    pubDateSec: '00:45:00',
  },
  {
    vol: 3, slug: 'nachikatsuura-vol3', postId: '046-nachikatsuura-photolog-vol3',
    title: '那智勝浦 photo log vol.3',
    desc: '那智勝浦・太地フォトログ、2日目前半。太地町立くじらの博物館、クジラショー、ハナゴンドウ、餌やりの記録。',
    hero: 'a7c05740',
    lead: '2日目は太地町くじらの博物館へ。クジラショーとお気に入りハナゴンドウ、餌やりまで。',
    section: 'Jul. 26 — くじらの博物館',
    relatedArticle: '043-nachikatsuura-vol2',
    relatedTitle: '4周年記念、那智勝浦・太地へ。vol.2',
    pubDateSec: '00:46:00',
  },
  {
    vol: 4, slug: 'nachikatsuura-vol4', postId: '047-nachikatsuura-photolog-vol4',
    title: '那智勝浦 photo log vol.4',
    desc: '那智勝浦・太地フォトログ、2日目後半。イルカのトンネル、海水浴場でのクジラとの遊泳、道の駅たいじ、帰路までの記録。',
    hero: 'a7c06987',
    lead: 'イルカのトンネルから、クジラと泳いだ海、そして帰路まで。4周年旅行の締めくくり。',
    section: 'Jul. 26 — イルカのトンネル → 帰路',
    relatedArticle: '043-nachikatsuura-vol2',
    relatedTitle: '4周年記念、那智勝浦・太地へ。vol.2',
    pubDateSec: '00:47:00',
  },
];

for (const meta of VOL_META) {
  const items = vols[String(meta.vol)];
  const bodyGrid = `<div class="pl-header">
  <span class="pl-month">${meta.section}</span>
</div>

<div class="pl-grid">
${items.map(it => gridItem(meta.slug, it)).join('\n')}
</div>`;

  const md = `---
title: '${meta.title}'
description: '${meta.desc}'
pubDate: '2026-08-10T${meta.pubDateSec}'
heroImage: '/images/photolog/${meta.slug}/${meta.hero}.webp'
tags: ['フォトログ', '那智勝浦', '和歌山', '旅行']
category: 'フォトログ'
---

<p class="post-no">No. ${meta.postId.slice(0,3)} &nbsp;·&nbsp; photo log · Nachikatsuura vol.${meta.vol} / 4</p>

---

> ${meta.lead}

<div class="trip-link-card">
  <p class="tlc-label">旅行記事はこちら</p>
  <a href="/blog/${meta.relatedArticle}/" class="tlc-link">${meta.relatedTitle} →</a>
</div>

${bodyGrid}

<div class="sign-off">
  <p class="s-name">— Len</p>
  <p class="s-message">旅と写真とコーヒーと。</p>
</div>
`;

  const outPath = `src/content/blog/${meta.postId}.md`;
  fs.writeFileSync(outPath, md);
  console.log('Wrote', outPath, '(' + items.length + ' photos)');
}
