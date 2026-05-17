# 記事＆フォトログ — 執筆ガイド

このディレクトリは Astro Content Collection の `blog` コレクション。記事もフォトログも全部ここに `.md` で置く。`category` で振り分け。

## ファイル命名

`NNN-slug.md` 形式。NNN は3桁の通し番号。

| 番号 | 種類 | 例 |
|---|---|---|
| 001-007 | 通常記事 | `005-cebu-vol1.md`（旅行記） |
| 008, 009, 011 | 通常フォトログ | `008-photolog-vol1.md` |
| 010 | 通常記事 | `010-cups.md` |
| 012-014 | セブ島フォトログ | `012-cebu-photolog-vol1.md` |

新規番号は **最大番号+1** で付ける。

## Frontmatter

```yaml
---
title: '記事タイトル'
description: 'OG description（短く、検索結果に出る）'
pubDate: '2026-05-18T00:10:00'         # ISO 8601、ソート用
heroImage: '/images/cups/hero.webp'    # OG画像、一覧でも使用
tags: ['コーヒー', 'カップ']            # 配列
category: 'コーヒー'                    # 'フォトログ' で振り分け判定
---
```

### category の使い分け

- `'フォトログ'` → `PhotologPost.astro` レイアウト、`/photolog` 一覧に表示
- それ以外 → `BlogPost.astro` レイアウト、`/blog` 一覧に表示

## 🚨 重要：HTMLブロック内に空行を入れない

Markdown仕様で **HTMLブロック（`<div>` など）内に空行があるとHTMLブロックが終了** する。その後の4スペースインデント要素が**コードブロックとして解釈される**。

### ❌ ダメな例

```html
<div class="dripper-body">
  <p class="img-caption">キャプション</p>
                                          ← 空行
  <p>
    本文...
  </p>
</div>
```

→ `<p>` がコードブロック化して `<p>` というタグがそのまま表示される。

### ✅ 正しい例

```html
<div class="dripper-body">
  <p class="img-caption">キャプション</p>
  <p>
    本文...
  </p>
</div>
```

HTMLブロック内では空行を **絶対に** 入れない。視覚的に区切りたいときは `<!-- comment -->` を使うか、インデントだけで対応。

## 通常記事の構造（BlogPost用）

末尾には必ず sign-off：

```html
<div class="sign-off">
  <p class="s-name">— Len</p>
  <p class="s-message">旅と写真とコーヒーと。</p>
</div>
```

### よく使うクラス（BlogPost.astro のCSSにあり）

| クラス | 用途 |
|---|---|
| `.post-no` | 記事冒頭の `No. 010 · coffee · cups` |
| `.dripper-block` | アイテム紹介ブロック（ドリッパー/カップ等） |
| `.dripper-header` `.dripper-num` `.dripper-name` | アイテムヘッダー部 |
| `.dripper-body` | 本文部分 |
| `.dripper-links` | Amazon/楽天リンク群 |
| `.dripper-link--amazon` `.dripper-link--rakuten` `.dripper-link--shop` | リンクボタン |
| `.gear-specs` `.spec` `.spec.highlight` | スペック表示 |
| `.personal-note` | 💬 アイコン付きメモ |
| `.pg-2` `.pg-3` | 2枚/3枚並び画像 |
| `.img-caption` | 画像キャプション |
| `.trip-card` | 旅行記事のサマリーカード |
| `.day-info` | 旅行記事の日程情報 |
| `.tip-box` | 💡 ヒントボックス |
| `.series-nav` `.series-btn` | 連載記事のprev/nextナビ |
| `.photolog-cta` | 旅行記事内のフォトログ誘導 |

## フォトログの構造（PhotologPost用）

```html
<p class="post-no">No. NNN &nbsp;·&nbsp; photo log · vol.X</p>

---

> リード文（任意）

<div class="trip-link-card">  <!-- 関連旅行記事がある場合 -->
  <p class="tlc-label">旅行記事はこちら</p>
  <a href="/blog/NNN-slug/" class="tlc-link">タイトル →</a>
</div>

<div class="pl-header">
  <span class="pl-month">Sep. 14 — Day 1</span>
</div>

<div class="pl-grid">
  <div class="pl-item">           <!-- 通常（横長基本） -->
    <img src="/images/photolog/vol-folder/aXXX.webp" alt="" />
    <span class="pl-cap">キャプション</span>
  </div>
  <div class="pl-item pl-item--wide">      <!-- ワイド（横ぶち抜き感） -->
  <div class="pl-item pl-item--portrait">  <!-- 縦長専用！横画像に付けると小さくなる -->
</div>
```

### orientation判定のコツ

`pl-item--portrait` は **実際に縦長の写真にだけ** 付ける。横長に付けると幅が縮んで表示されるバグっぽい見た目になる。判断に迷ったら：

```bash
node -e "require('./node_modules/sharp')('path/to/img.webp').metadata().then(m => console.log(m.width + 'x' + m.height))"
```

## キャプションのトーン

口語・カジュアル・短め。例：

- 「うおあああああ！！」
- 「ぐううまい」
- 「カメラ持ってると撮ってくれって言われる。」
- 「ぶくぶくぶくぶく」

完全文じゃなくて感想だけでもOK。
