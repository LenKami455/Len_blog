// 箕面フォトログ生成スクリプト（2-vol構成）
import fs from 'fs';

const plan = JSON.parse(fs.readFileSync('minoh-plan.json', 'utf8'));

const CAPS = {
  'a7c04659': '箕面公園の入口あたり、古い佇まいの建物と新緑。',
  'a7c04700': '緑のトンネルへ吸い込まれていく感じ。',
  'a7c04718': '大きな岩のあいだを抜ける、アトラクション感ある道。',
  'a7c04728': '渓流の岩・苔、見るたびに色が違う。',
  'a7c04737': '見上げると新緑のキャノピー。秋は紅葉だけど、初夏の緑も負けてない。',
  'a7c04754': '曇り予報どこ行った、というレベルの晴れ。',
  'a7c04777': '浅瀬の岩肌に差す木漏れ日。',
  'a7c04790': 'エメラルドの川面、新緑の樹々が映る。ずっと居られる。',
  'a7c04812': '箕面大滝、落差33m。生で見るスケールがやばい。',
  'a7c04847': '帰りは行きと違うルートで、行きより険しい山道だったけど涼しくて景色も最高。',
  'a7c04848': '滝のすぐ近く、石垣と丸太のテクスチャ。',
  'a7c04855': '麓近くまで降りてきたあたり、水面に新緑が映り込んでフィナーレ。',
  'a7c04862': '参道の古い建物、白い日傘の並ぶテラスが涼しげ。',
};

function defaultCap(num) {
  if (num < 4700) return '箕面公園の入口、ここから散策スタート。';
  if (num < 4720) return '遊歩道、緑のトンネル。';
  if (num < 4750) return '渓流沿い、岩と苔のテクスチャ。';
  if (num < 4780) return '木漏れ日と水、ずっと撮っていられる。';
  if (num < 4805) return '川の表情、滝に近づくほど水音が増す。';
  if (num < 4820) return '箕面大滝の周辺、水しぶきの近く。';
  if (num < 4850) return '帰りの山道、行きとは違う表情。';
  return '麓に近づく、静かな川。';
}

const WIDE = new Set([
  'a7c04700','a7c04728','a7c04737','a7c04754','a7c04777','a7c04790',
  'a7c04812','a7c04847','a7c04855','a7c04862',
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
    vol: 1, slug: 'minoh-vol1', postId: '037-minoh-photolog-vol1',
    title: '箕面 photo log vol.1',
    desc: '箕面大滝への日帰り、前半の散策フォトログ。公園入口から渓流沿い、新緑のキャノピー、エメラルドの川面まで。',
    hero: 'a7c04700',
    lead: '雨予報をひっくり返して晴れた一日、彼女と箕面大滝へ。前半は入口から渓流沿いを歩いた記録。',
    section: 'Jun. 6 — approach → 渓流',
    pubDateSec: '00:37:00',
  },
  {
    vol: 2, slug: 'minoh-vol2', postId: '038-minoh-photolog-vol2',
    title: '箕面 photo log vol.2',
    desc: '箕面大滝、後半のフォトログ。落差33mの滝と、行きと違う山道で帰る道のり、麓の静かな川面まで。',
    hero: 'a7c04812',
    lead: '前半の散策を経て、箕面大滝のクライマックスと、行きと違うルートで帰った道。',
    section: 'Jun. 6 — 大滝 → 帰路',
    pubDateSec: '00:38:00',
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
pubDate: '2026-06-07T${meta.pubDateSec}'
heroImage: '/images/photolog/${meta.slug}/${meta.hero}.webp'
tags: ['フォトログ', '箕面', '旅行']
category: 'フォトログ'
---

<p class="post-no">No. ${meta.postId.slice(0,3)} &nbsp;·&nbsp; photo log · Minoh vol.${meta.vol} / 2</p>

---

> ${meta.lead}

<div class="trip-link-card">
  <p class="tlc-label">旅行記事はこちら</p>
  <a href="/blog/036-minoh-otaki/" class="tlc-link">雨予報を覆して、彼女と箕面大滝。 →</a>
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
