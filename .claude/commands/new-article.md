---
description: 新しい通常記事を作成するワークフロー
---

# 新規記事作成

通常記事（旅行記、ガジェット紹介、コーヒー器具紹介など、フォトログ以外）を作成します。

## ワークフロー

### 1. 事前確認

ユーザーに以下を確認：

- **記事の種別**：旅行記？ ガジェット紹介？ コラム？
- **タイトル**
- **カテゴリ**（`'コーヒー'` `'旅'` `'ガジェット'` など、既存の値に揃えるのが基本）
- **画像はある？** ある場合は `public/images/` 直下や別フォルダにあるか確認

### 2. 番号決定

`src/content/blog/` を確認し、最大番号+1で `NNN-slug.md` のslugを決める。

### 3. 画像処理（必要なら）

未処理JPGがあれば、WebP変換 → `public/images/{NNN-slug}/` に配置：

```bash
cd /c/Users/kanad/blog && node -e "
const sharp = require('./node_modules/sharp');
const fs = require('fs');
const src = './public/images/';
const dst = './public/images/{NNN-slug}/';
if (!fs.existsSync(dst)) fs.mkdirSync(dst, { recursive: true });
const files = [...];  // ファイル名列挙
(async () => {
  for (const f of files) {
    await sharp(src + f).webp({ quality: 85 }).toFile(dst + f.replace(/\.(jpg|jpeg|png)$/i, '.webp').toLowerCase());
  }
})();
"
```

### 4. 記事ファイル作成

`src/content/blog/CLAUDE.md` の規約に従う。Frontmatter は最低限：

```yaml
---
title: ''
description: ''
pubDate: ''           # ISO 8601
heroImage: ''         # /images/{NNN-slug}/hero.webp
tags: []
category: ''
---
```

### 5. コンテンツ作成

記事タイプに応じて適切な構造で：

- **ガジェット紹介系**：`<div class="dripper-block">` ベース（カップ記事 010-cups.md 参考）
- **旅行記**：`<div class="day-info">` `<div class="trip-card">` `<h2 class="section-title">` 使用（cebu vol.1〜3 参考）
- **コラム系**：シンプルにマークダウン + 必要に応じてHTML

⚠️ **HTMLブロック内に空行を入れない**。`src/content/blog/CLAUDE.md` 参照。

### 6. ローカル確認

ユーザーに `localhost:4321/blog/NNN-slug/` で確認してもらう。

### 7. コミット＆プッシュ

```bash
git add src/content/blog/NNN-slug.md public/images/NNN-slug/
git commit -m "新記事: タイトル (No.NNN)..."
git push
```

## チェックリスト

記事作成完了前に確認：

- [ ] `pubDate` を正しい時刻に設定（既存記事と被らないように）
- [ ] `heroImage` のパスが正しい
- [ ] `tags` を3-5個
- [ ] 末尾に `<div class="sign-off">` 入れた
- [ ] アフィリエイトリンクは `rel="noopener noreferrer nofollow"`（Amazon）
- [ ] HTMLブロック内に空行ない
- [ ] WebP画像のみコミット、元JPGは除外
