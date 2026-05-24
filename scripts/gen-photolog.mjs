// 飛騨高山フォトログのマークダウンを生成（3-vol構成）
// 既知の写真には具体的キャプション、未確認の写真は文脈に応じた汎用キャプションを付与。
import fs from 'fs';

const plan = JSON.parse(fs.readFileSync('photolog-plan.json', 'utf8'));

// 確認済み写真のキャプション（具体的内容）
const CAPS = {
  'a7c02651': '名古屋駅で見送った、別ホームの東海線車両。',
  'a7c02655': 'ひだ3号 高山行き、指定席。これに乗る。',
  'a7c02663': '車窓、川と山がずっと続く。',
  'a7c02670': '車窓、川面が深い緑。',
  'a7c02681': 'もう少し開けてきた車窓。',
  'a7c02688': '黄色い鉄仮面。',
  'a7c02691': '高山駅前の高山祭オブジェ。',
  'a7c02692': 'JR高山駅、立派になってる。',
  'a7c02693': 'BRAND NEW DAY COFFEE。後で寄ることになる。',
  'a7c02695': '飛騨牛せいろの全体像。',
  'a7c02696': 'つけ汁には飛騨牛がごろっと。',
  'a7c02697': '飛騨そば 小舟、駅近の老舗。',
  'a7c02701': '今回の宿。荷物だけ預けた。',
  'a7c02704': 'でか招き猫。',
  'a7c02708': '古い町並みへ続く通り。',
  'a7c02709': '中橋の真下、川面が近い。',
  'a7c02710': '川の急流、水音がいい。',
  'a7c02711': '川が気持ちいい。',
  'a7c02714': '軒下のひょうたん。',
  'a7c02716': 'ごみステーションの脇にも品がある。',
  'a7c02717': '茶寮の入口、雰囲気よし。',
  'a7c02723': '古い町並み、人混みも込みでこれ。',
  'a7c02729': '「古い町並」の標柱。',
  'a7c02738': 'SWAY COFFEE 店内、和紙の照明と土間。',
  'a7c02740': 'SWAY のドリップカウンター。',
  'a7c02746': 'SWAY COFFEE ROASTERY 外観、古民家。',
  'a7c02756': '飛騨牛指定店の木札。風格。',
  'a7c02757': '飛騨牛寿司、煎餅の上に2貫。',
  'a7c02764': 'みたらし団子。香ばしい。',
  'a7c02765': '午後の古い町並み。',
  'a7c02781': '飛騨の酒、運搬箱が転がってる。',
  'a7c02786': '川が気持ちいい。',
  'a7c02789': 'bagpipe というレトロな喫茶看板。',
  'a7c02802': 'どこかのお寺。',
  'a7c02809': '杉と灯籠、夕方の影。',
  'a7c02810': '杉が立ち並ぶ。花粉症が限界突破。',
  'a7c02812': '双子杉。',
  'a7c02813': '杉に囲まれた拝殿。',
  'a7c02819': '高山市政記念館、緑と白の洋風建築。',
  'a7c02821': '同じく市政記念館、表門から松ごしに。',
  'a7c02828': '白壁の細い路地、人がいない。',
  'a7c02836': 'Falò Coffee、マグの奥にMahlkönig。',
  'a7c02843': 'BRAND NEW DAY のコーヒーと、高山プリン亭のなめらかプリン。',
  'a7c02853': '味の与平、飛騨牛ステーキ。手前にわさび。',
  'a7c02865': '夜の薬局、オロナインの看板に時代を感じる。',
  'a7c02877': '夜の高山駅前、人がいない。',
  'a7c02878': '夜の街と交番、静か。',
  'a7c02887': '宮川沿いの橋、緑欄干が昭和の温度。',
  'a7c02895': '飛騨高山 宮川朝市の通り。',
  'a7c02903': '朝市の一角、300円コーヒー。',
  'a7c02919': 'haiz coffee TAKAYAMA、コンクリのカウンター。',
  'a7c02921': '深いブルーグレーの壁に Isamu Noguchi のアカリ。',
  'a7c02925': '湯気の立つ陶器とガラスサーバー。',
  'a7c02928': 'haiz coffee の OPEN サイン。',
  'a7c02931': '高山陣屋、表門。',
  'a7c02947': '陣屋の梁の装飾金具。',
  'a7c02970': '宮川の中橋下、流れと石。',
  'a7c02981': '陣屋裏手の庭の流れ。',
  'a7c03011': '米蔵に積まれた米俵、年貢の量。',
  'a7c03041': '高山ラーメン。醤油と鶏の奥深い味わい。',
  'a7c03073': '人が引いた裏通り、COFFEEの看板。',
  'a7c03118': '宮川と桜山八幡宮へ向かう道。',
  'a7c03126': '鳥居が青空にすこっと映える。',
  'a7c03129': '境内の大樹、空が抜ける。',
  'a7c03143': '境内の小さなお社、石灯籠と杉。',
  'a7c03169': '帰路の特急ひだ、車窓も最高。',
  // 追加分（ユーザー指定）
  'a7c02724': '古い町並み。',
  'a7c02726': '古い町並み。',
  'a7c02730': '古い町並み。',
  'a7c02731': '古い町並み。',
  'a7c02733': 'SWAY COFFEE',
  'a7c02734': 'SWAY COFFEE',
  'a7c02741': 'SWAY COFFEE',
  'a7c02745': 'SWAY COFFEE',
  'a7c02835': 'Falò Coffee',
  'a7c02837': 'Falò Coffee',
  'a7c02838': 'Falò Coffee',
  'a7c02841': 'Falò Coffee',
  'a7c02844': '夕暮れ時の古い町並み。',
  'a7c02845': '夕暮れ時の古い町並み。',
  'a7c02847': '夕暮れ時の古い町並み。',
  'a7c02856': '味の与平、飛騨牛ステーキ。',
  'a7c02867': '夜の高山、人が引いた通り。',
  'a7c02902': '朝市の一角、300円コーヒー。',
  'a7c02904': '朝市の一角、300円コーヒー。',
  'a7c02911': '朝市の一角、美味しそうなクロワッサン。',
  'a7c02915': '朝市の一角。',
  'a7c02916': '気になる看板。',
  'a7c02918': '朝市の一角。',
  'a7c03005': '陣屋裏手、庭と蔵まわり。',
  'a7c03027': '陣屋裏手、庭と蔵まわり。',
  'a7c03030': '陣屋裏手、庭と蔵まわり。',
  'a7c03037': '陣屋裏手、庭と蔵まわり。',
  'a7c03038': '高山ラーメン。醤油と鶏の奥深い味わい。',
  'a7c03039': '高山ラーメン。醤油と鶏の奥深い味わい。',
  'a7c03162': '駅までの帰路。',
  'a7c03163': '駅までの帰路。',
  'a7c03166': '高山駅。旅の終わり。',
  'a7c03167': '高山駅。旅の終わり。',
};

// 文脈ベースの汎用キャプション（ファイル番号で範囲指定）
function defaultCap(num) {
  if (num < 2670) return '車窓、ずっと山と川。';
  if (num < 2697) return '高山に着いた、駅周辺。';
  if (num < 2740) return '古い町並みへ向かう途中。';
  if (num < 2780) return '古い町並みの一角。';
  if (num < 2820) return '町並みの細部、いい味出してる。';
  if (num < 2845) return '午後の散策、洋風建築が残る一画。';
  if (num < 2872) return 'カフェ周辺、夕暮れ前。';
  if (num < 2887) return '夜の高山、人が引いた通り。';
  if (num < 2920) return '朝の宮川沿い、朝市方面へ。';
  if (num < 2932) return 'haiz coffee の店内、空間が完成してる。';
  if (num < 2990) return '高山陣屋、廊下と部屋の連続。';
  if (num < 3005) return '陣屋裏手、庭と蔵まわり。';
  if (num < 3050) return '街歩き、お昼を済ませて午後。';
  if (num < 3105) return '通り過ぎる町、写真を撮りながら。';
  if (num < 3160) return '桜山八幡宮、境内を歩く。';
  return '帰路の車窓、来た道を逆向きに。';
}

// wide指定したい印象的なランドスケープショット
const WIDE = new Set([
  'a7c02663', 'a7c02670', 'a7c02681', // 車窓
  'a7c02723', 'a7c02729', 'a7c02765', // 古い町並みの引き
  'a7c02819', 'a7c02821', // 洋風建築
  'a7c02836', // Falò
  'a7c02877', 'a7c02878', // 夜
  'a7c02895', // 朝市の通り
  'a7c02919', 'a7c02921', // haiz
  'a7c02931', // 陣屋 表門
  'a7c03011', // 米蔵
  'a7c03041', // ラーメン
  'a7c03073', // 静かな町並み
  'a7c03118', // 宮川
  'a7c03126', 'a7c03129', // 八幡 鳥居 / 大樹
  'a7c03169', // 帰路
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
    vol: 1, slug: 'takayama-vol1', postId: '032-takayama-photolog-vol1',
    title: '飛騨高山 photo log vol.1',
    desc: '飛騨高山1日目前半のフォトログ。新幹線+特急ひだの車窓、飛騨そば小舟の飛騨牛せいろ、古い町並み、SWAY COFFEE ROASTERYと食べ歩きまで。',
    hero: 'a7c02723',
    lead: '思いつき2日後、急遽ふらっと飛騨高山。1日目前半は車窓と古い町並みと食べ歩き。',
    section: 'Day 1 — 旅立ち〜古い町並み',
    relatedArticle: '030-takayama-vol1',
    relatedTitle: '飛騨高山に行ってきた。vol.1',
    pubDateSec: '00:32:00',
  },
  {
    vol: 2, slug: 'takayama-vol2', postId: '033-takayama-photolog-vol2',
    title: '飛騨高山 photo log vol.2',
    desc: '飛騨高山旅のフォトログ、Day 1夜→Day 2朝。Falò Coffee、高山市政記念館、味の与平の飛騨牛ステーキ、夜の街並み、宮川朝市、haiz coffee TAKAYAMA、高山陣屋まで。',
    hero: 'a7c02921',
    lead: '1日目後半のカフェと夜歩きから、2日目の朝市・haiz coffee・高山陣屋まで。',
    section: 'Day 1 PM 〜 Day 2 AM',
    relatedArticle: '030-takayama-vol1',
    relatedTitle: '飛騨高山に行ってきた。vol.1 / vol.2',
    pubDateSec: '00:33:00',
  },
  {
    vol: 3, slug: 'takayama-vol3', postId: '034-takayama-photolog-vol3',
    title: '飛騨高山 photo log vol.3',
    desc: '飛騨高山2日目後半のフォトログ。高山ラーメン、街歩き、桜山八幡宮、帰路の特急ひだから車窓まで。',
    hero: 'a7c03126',
    lead: '2日目後半、ラーメンと街歩きと桜山八幡宮、帰り道の車窓まで。',
    section: 'Day 2 — 高山ラーメン〜桜山八幡宮〜帰路',
    relatedArticle: '031-takayama-vol2',
    relatedTitle: '飛騨高山に行ってきた。vol.2',
    pubDateSec: '00:34:00',
  },
];

for (const meta of VOL_META) {
  const bucket = plan.find(b => b.vol === meta.vol);
  // For vol.2, split by Day boundary (night before a7c02887)
  let bodyGrid;
  if (meta.vol === 2) {
    const day1 = bucket.items.filter(it => num(it.f) < 2887);
    const day2 = bucket.items.filter(it => num(it.f) >= 2887);
    bodyGrid = `<div class="pl-header">
  <span class="pl-month">Day 1 — afternoon → night</span>
</div>

<div class="pl-grid">
${day1.map(it => gridItem(meta.slug, it)).join('\n')}
</div>

<div class="pl-header">
  <span class="pl-month">Day 2 — morning → midday</span>
</div>

<div class="pl-grid">
${day2.map(it => gridItem(meta.slug, it)).join('\n')}
</div>`;
  } else {
    bodyGrid = `<div class="pl-header">
  <span class="pl-month">${meta.section}</span>
</div>

<div class="pl-grid">
${bucket.items.map(it => gridItem(meta.slug, it)).join('\n')}
</div>`;
  }

  const md = `---
title: '${meta.title}'
description: '${meta.desc}'
pubDate: '2026-05-24T${meta.pubDateSec}'
heroImage: '/images/photolog/${meta.slug}/${meta.hero}.webp'
tags: ['フォトログ', '飛騨高山', '旅行']
category: 'フォトログ'
---

<p class="post-no">No. ${meta.postId.slice(0,3)} &nbsp;·&nbsp; photo log · Takayama vol.${meta.vol} / 3</p>

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
  console.log('Wrote', outPath, '(' + bucket.items.length + ' photos)');
}
