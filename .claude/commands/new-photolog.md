---
description: 新しいフォトログ記事を作成するワークフロー
---

# 新規フォトログ作成

`public/images/photolog/` に置かれた未処理JPG（`A7CXXXXX.jpg`）から新しいフォトログ記事を作成します。

## ワークフロー

ユーザーから引数で指示があれば優先、なければ以下を確認しながら進める：

### 1. 事前確認

- **シリーズ種別**：通常フォトログ（`photolog vol.X`）か、旅行フォトログ（`okinawa-vol1` のような専用シリーズ）か？
- **vol番号**：既存の最大番号+1（`src/content/blog/` を確認）
- **対象画像**：`public/images/photolog/` 直下のJPGをユーザーに確認
- **不要画像**：削除したい画像があるか確認

### 2. EXIF撮影日時を読み取り、日付ごとに整理

```bash
node -e "
const fs = require('fs');
const dir = 'public/images/photolog/';
const files = fs.readdirSync(dir).filter(f => f.match(/^A7C\d+\.jpg$/i)).sort();
files.forEach(f => {
  const buf = fs.readFileSync(dir + f);
  const str = buf.slice(0, 65536).toString('latin1');
  const re = /\d{4}:\d{2}:\d{2} \d{2}:\d{2}:\d{2}/g;
  const dates = [];
  let m;
  while ((m = re.exec(str)) !== null) dates.push({date: m[0], offset: m.index});
  const original = dates.find(d => d.offset > 400 && !d.date.startsWith('2026'));
  console.log(f + ': ' + (original ? original.date : 'unknown'));
});
"
```

日付別の写真リストをユーザーに提示し、何vol構成か（枚数バランスや日付区切り）を相談。

### 3. 画像を確認してキャプション素案を作る

各画像を `Read` ツールで開いて内容を確認し、ユーザーに「①②③…→こんな感じ？」とキャプション素案を提示してフィードバックをもらう。

### 4. WebP変換

```bash
cd /c/Users/kanad/blog && node -e "
const sharp = require('./node_modules/sharp');
const fs = require('fs');
const src = './public/images/photolog/';
const groups = {
  '{VOL_FOLDER_NAME}': ['A7C00388','A7C00393', ...],  // vol別にグループ化
};
(async () => {
  for (const [folder, files] of Object.entries(groups)) {
    const dst = src + folder + '/';
    if (!fs.existsSync(dst)) fs.mkdirSync(dst, { recursive: true });
    for (const f of files) {
      await sharp(src + f + '.jpg').webp({ quality: 85 }).toFile(dst + f.toLowerCase() + '.webp');
    }
    console.log(folder + ': done');
  }
})();
"
```

### 5. 縦横サイズチェック（縦長画像だけ抽出）

```bash
node -e "
const sharp = require('./node_modules/sharp');
const fs = require('fs');
const dir = 'public/images/photolog/{VOL_FOLDER}/';
const files = fs.readdirSync(dir).filter(f => f.endsWith('.webp'));
Promise.all(files.map(f => sharp(dir + f).metadata().then(m => ({
  f, w: m.width, h: m.height, portrait: m.height > m.width
})))).then(rs => rs.forEach(r => console.log(r.f + ': ' + r.w + 'x' + r.h + (r.portrait ? ' [PORTRAIT]' : ''))));
"
```

縦長と判定された画像にだけ `pl-item--portrait` を付ける。

### 6. 記事ファイル作成

`src/content/blog/NNN-{slug}.md` を作成。`src/content/blog/CLAUDE.md` の規約に従う。

- 旅行フォトログなら `<div class="trip-link-card">` で対応する旅行記事へのリンクを冒頭に
- 日付セクションごとに `<div class="pl-header">` で見出し
- `<div class="pl-grid">` 内に `<div class="pl-item">` を並べる
- **HTMLブロック内に空行を入れない**（コードブロック化バグ防止）
- 末尾に `<div class="sign-off">`

### 7. ヒーロー画像選定

横長の中で印象的な1枚を `heroImage` に指定。一覧ページで見栄え重視。

### 8. 旅行フォトログの場合：旅行記事側にCTAを追加

対応する旅行記事の末尾（`series-nav` の前）に `<div class="photolog-cta">` を追加。

### 9. ローカル確認

ユーザーに `localhost:4321/blog/NNN-slug/` で確認してもらう。OKをもらってからコミット。

### 10. コミット

```bash
git add src/content/blog/NNN-slug.md public/images/photolog/{vol-folder}/
git commit -m "..."
git push
```

元JPGは絶対にステージしない（`git add .` 禁止、個別指定で）。
