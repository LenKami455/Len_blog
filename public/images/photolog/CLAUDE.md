# 画像処理 — フォトログ用ガイド

カメラから出力された `A7CXXXXX.jpg` ファイルをWebPに変換して、フォトログ用フォルダに配置するワークフロー。

## 🚨 大事なルール

1. **WebP変換必須** — 元のJPGは絶対にコミットしない（リポジトリが肥大化する）
2. **ファイル名は小文字** — `A7C00388.jpg` → `a7c00388.webp`
3. **vol別フォルダに分ける** — `vol1/`, `vol2/`, `cebu-vol1/` のような構造
4. **品質85** — `sharp.webp({ quality: 85 })` で十分

## フォルダ構成

```
public/images/photolog/
├── vol1/           # 通常フォトログ vol.1
├── vol2/           # 通常フォトログ vol.2 ※実は009-photolog-vol2.mdは間違ってvol1/参照中（互換維持）
├── vol3/           # 通常フォトログ vol.3
├── cebu-vol1/      # セブ島旅行フォトログ vol.1
├── cebu-vol2/      # セブ島旅行フォトログ vol.2
├── cebu-vol3/      # セブ島旅行フォトログ vol.3
└── A7C*.jpg        # 未処理の元画像（コミット対象外）
```

新しい旅行などのフォトログを作るときは、新しいフォルダ名を決める（例: `okinawa-vol1/`）。

## EXIF撮影日時の読み取り

ファイル単独で正確な撮影日が必要なとき：

```js
node -e "
const fs = require('fs');
const files = ['A7C00388','A7C00393'];  // 対象ファイル名
files.forEach(f => {
  const buf = fs.readFileSync('public/images/photolog/' + f + '.jpg');
  const str = buf.slice(0, 65536).toString('latin1');
  const re = /\d{4}:\d{2}:\d{2} \d{2}:\d{2}:\d{2}/g;
  const dates = [];
  let m;
  while ((m = re.exec(str)) !== null) dates.push({date: m[0], offset: m.index});
  // 2026年（今日）の日付は処理日時、その後の日付が撮影日
  const original = dates.find(d => d.offset > 400 && !d.date.startsWith('2026'));
  console.log(f + ': ' + (original ? original.date : 'unknown'));
});
"
```

## WebP一括変換スクリプト

```js
cd /c/Users/kanad/blog && node -e "
const sharp = require('./node_modules/sharp');
const fs = require('fs');

const src = './public/images/photolog/';
const dst = './public/images/photolog/{VOL_FOLDER}/';   // ← ここを変更

if (!fs.existsSync(dst)) fs.mkdirSync(dst, { recursive: true });

const files = ['A7C00388','A7C00393'];  // ← ここに対象ファイル列挙

(async () => {
  for (const f of files) {
    await sharp(src + f + '.jpg').webp({ quality: 85 }).toFile(dst + f.toLowerCase() + '.webp');
  }
  console.log('Done!');
})();
"
```

複数フォルダに分ける場合は `groups` オブジェクトでまとめて処理。

## サイズチェック（縦横判定）

`pl-item--portrait` を付けるかどうかの判断：

```js
node -e "
const sharp = require('./node_modules/sharp');
sharp('public/images/photolog/cebu-vol2/a7c00545.webp').metadata().then(m =>
  console.log(m.width + 'x' + m.height + ' → ' + (m.width > m.height ? 'landscape' : 'portrait'))
);
"
```

α7C II の典型的なサイズ：
- 横長: `2048×1365`
- 縦長: `1365×2048`

## コミット時の注意

```bash
# OK: WebPと記事だけステージ
git add src/content/blog/NNN-photolog-xxx.md public/images/photolog/vol-folder/

# NG: 元JPG含めない
# 必要なら .gitignore に `public/images/photolog/*.jpg` を追加してもいい
```

`.gitignore` には現状追加してないので、`git add .` ではなく **個別ファイル指定で add** すること。
