// JR福知山線廃線跡フォトログ生成（2-vol構成）
import fs from 'fs';

const plan = JSON.parse(fs.readFileSync('haisen-plan.json', 'utf8'));

// 確認済み写真の具体キャプション
const CAPS = {
  'a7c04953': '入口からすぐ、緑のトンネルみたいな遊歩道。',
  'a7c04960': '朽ちかけた枕木のベンチ。廃線らしさが早速。',
  'a7c04974': '武庫川渓谷、巨岩とエメラルドの流れ。',
  'a7c04988': '緑に飲み込まれかけたトンネルの入口。',
  'a7c05000': '緑の額縁の奥に、真っ黒なトンネルの口。',
  'a7c05024': 'トンネルの中、懐中電灯がないと本当に真っ暗。',
  'a7c05050': '線路跡の枕木と石積み。時間が止まってる。',
  'a7c05055': '真夏の青空と山。とにかく暑い。',
  'a7c05074': '見上げれば深い緑の山。大阪の隣とは思えない。',
  'a7c05085': '石とレンガで組まれたトンネル内部。渋い。',
  'a7c05094': '鉄橋の鉄骨越しに武庫川渓谷。',
  'a7c05105': '錆びた鉄橋の先に、また黒いトンネル。',
  'a7c05152': '暗闇の先、額縁みたいに広がる緑。',
  'a7c05196': '武田尾方面へ、渓谷の眺め。',
  'a7c05203': 'トンネルの中に作られた武田尾駅のホーム。',
  'a7c05207': '武田尾駅、たけだお。トンネル尽くしの締め。',
};

// 文脈ベースの汎用キャプション（番号帯）
function defaultCap(num) {
  if (num < 4970) return '生瀬から歩き出してすぐの遊歩道。';
  if (num < 4995) return '武庫川渓谷を横目に歩く。';
  if (num < 5010) return 'トンネルの入口、緑と闇のコントラスト。';
  if (num < 5045) return 'トンネルの中。ひんやり涼しくて真っ暗。';
  if (num < 5075) return '線路跡の枕木、渓谷、夏の光。';
  if (num < 5084) return '石造りのトンネルと渓谷沿いの道。';
  if (num < 5120) return '錆びた鉄橋と、その先のトンネル。';
  if (num < 5160) return 'トンネルを抜けた先の緑。';
  if (num < 5200) return '武田尾へ向かう武庫川渓谷。';
  return '武田尾駅、トンネルの中の駅。';
}

// wide指定したい横長の印象カット
const WIDE = new Set([
  'a7c04953','a7c04960','a7c04974','a7c05055','a7c05074',
  'a7c05085','a7c05105','a7c05196','a7c05203','a7c05207',
]);

function num(f) { return parseInt(f.match(/a7c0(\d+)/)[1]); }
function key(f) { return f.replace('.webp', ''); }

function gridItem(volSlug, item) {
  const k = key(item.f);
  const n = num(item.f);
  const cap = CAPS[k] || defaultCap(n);
  let cls = 'pl-item';
  if (item.portrait) cls += ' pl-item--portrait';
  else if (WIDE.has(k)) cls += ' pl-item--wide';
  return `  <div class="${cls}">
    <img src="/images/photolog/${volSlug}/${item.f}" alt="" />
    <span class="pl-cap">${cap}</span>
  </div>`;
}

const VOL_META = [
  {
    vol: 1, slug: 'haisen-vol1', postId: '040-haisen-photolog-vol1',
    title: '福知山線廃線跡 photo log vol.1',
    desc: 'JR福知山線廃線跡ハイキングのフォトログ、前半。生瀬駅から武庫川渓谷沿いの遊歩道、緑に飲まれるトンネル群、真っ暗な内部まで。',
    hero: 'a7c05000',
    lead: '前夜の旅トークの勢いで、思い立って福知山線廃線跡へ。前半は渓谷とトンネル群の記録。',
    section: 'Jul. 20 — 生瀬 → トンネル群',
    pubDateSec: '00:40:00',
  },
  {
    vol: 2, slug: 'haisen-vol2', postId: '041-haisen-photolog-vol2',
    title: '福知山線廃線跡 photo log vol.2',
    desc: 'JR福知山線廃線跡ハイキングのフォトログ、後半。錆びた鉄橋、渓谷の絶景、トンネルを抜けた先の緑、そしてトンネル内構造の武田尾駅まで。',
    hero: 'a7c05105',
    lead: 'トンネルを抜けて、錆びた鉄橋と渓谷の絶景、トンネルの中の武田尾駅まで。後半戦。',
    section: 'Jul. 20 — 鉄橋 → 武田尾',
    pubDateSec: '00:41:00',
  },
];

for (const meta of VOL_META) {
  const bucket = plan.find(b => b.vol === meta.vol);
  const bodyGrid = `<div class="pl-header">
  <span class="pl-month">${meta.section}</span>
</div>

<div class="pl-grid">
${bucket.items.map(it => gridItem(meta.slug, it)).join('\n')}
</div>`;

  const md = `---
title: '${meta.title}'
description: '${meta.desc}'
pubDate: '2026-07-20T${meta.pubDateSec}'
heroImage: '/images/photolog/${meta.slug}/${meta.hero}.webp'
tags: ['フォトログ', '福知山線廃線跡', '兵庫', '旅行']
category: 'フォトログ'
---

<p class="post-no">No. ${meta.postId.slice(0,3)} &nbsp;·&nbsp; photo log · Fukuchiyama Ruins vol.${meta.vol} / 2</p>

---

> ${meta.lead}

<div class="trip-link-card">
  <p class="tlc-label">旅行記事はこちら</p>
  <a href="/blog/039-fukuchiyama-haisen/" class="tlc-link">思い立って、JR福知山線廃線跡を歩いてきた。 →</a>
</div>

${bodyGrid}

<div class="sign-off">
  <p class="s-name">— Len</p>
  <p class="s-message">旅と写真とコーヒーと。</p>
</div>
`;

  const outPath = `src/content/blog/${meta.postId}.md`;
  fs.writeFileSync(outPath, md);
  console.log('Wrote', outPath, '(' + bucket.items.length + ' photos)');
}
