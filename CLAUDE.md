# Len's Blog — Project Guide

個人ブログサイト（Astro + Markdown）。旅・写真・コーヒーを軸に、記事とフォトログを発信。

## プロジェクト構成

- **Framework**: Astro 5.x（静的サイト生成）
- **デプロイ**: Cloudflare Pages
- **リポジトリ**: github.com/LenKami455/Len_blog
- **ライブ**: メインブランチを push すると自動デプロイ

## 主要ディレクトリ

```
src/
├── content/blog/          # 記事＆フォトログのMarkdown（詳細: src/content/blog/CLAUDE.md）
├── layouts/
│   ├── BlogPost.astro     # 通常記事のレイアウト（CSS in style block）
│   └── PhotologPost.astro # フォトログのレイアウト
├── pages/
│   ├── index.astro        # トップページ
│   ├── blog/index.astro   # 記事一覧
│   └── photolog/index.astro # フォトログ一覧
└── components/            # Header, Footer, BaseHead など共通コンポーネント

public/images/             # 画像ファイル（詳細: public/images/photolog/CLAUDE.md）
```

## よく使うコマンド

```bash
npm run dev -- --host      # ローカルプレビュー http://localhost:4321
npm run build              # 本番ビルド
```

## Git ワークフロー

- ブランチ: `main` 一本（feature branch なし）
- 確認 → コミット → push の流れ
- コミットメッセージは日本語、概要 + 箇条書きで詳細
- 末尾に Co-Authored-By（Claude）を入れる

## デザイン規約

### カラーパレット（`src/styles/global.css`）

| 用途 | 変数 | 色 |
|---|---|---|
| 背景 | `--color-bg` | `#F8F5F0`（クリーム） |
| 背景alt | `--color-bg-alt` | `#EFE9DE` |
| サーフェス | `--color-surface` | `#FFFFFF` |
| ボーダー | `--color-border` | `#E0D8CC` |
| テキスト | `--color-text` | `#1E1A16` |
| アクセント | `--color-accent` | `#8B5E3C`（コーヒーブラウン） |
| サブアクセント | `--color-sage` | `#6B8C6E`（自然なグリーン） |

### フォント

- **日本語セリフ**: `Noto Serif JP`（本文・見出し）
- **欧文セリフ**: `Cormorant Garamond`（photologの大文字・volナンバー）※BlogPost層では未ロード
- **サンセリフ**: `Noto Sans JP`、`BIZ UDPGothic`

## 命名規則

- 記事ファイル: `NNN-slug.md`（NNNは3桁通し番号）
  - 通常記事: `010-cups.md`, `003-dripper-hario.md`
  - フォトログ: `008-photolog-vol1.md`, `012-cebu-photolog-vol1.md`
- 画像フォルダ: `public/images/{記事番号-slug}/` or `public/images/photolog/{vol-name}/`

## 進め方の慣習

- ローカルで確認 → 「OK」をもらってからコミット
- 画像追加は必ず WebP 変換（quality 85）してからコミット、元JPGはコミットしない
- 大きい変更は適宜ユーザーに確認を取る
- TodoWrite は使わない（ユーザーから明示要請がない限り）

## ネストされたCLAUDE.md

より詳細なルールは各ディレクトリにあります：
- `src/content/blog/CLAUDE.md` — 記事の書き方・HTML構造の落とし穴
- `public/images/photolog/CLAUDE.md` — 画像変換・EXIF処理
