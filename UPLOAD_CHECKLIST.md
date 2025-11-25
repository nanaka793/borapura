# アップロードファイルチェックリスト

外部サーバーにデプロイする際にアップロードすべきファイルの一覧です。

## ✅ アップロードするファイル/フォルダ

### 必須ファイル
```
✓ app/                    # Next.jsアプリケーションコード（全ファイル）
✓ components/             # Reactコンポーネント（全ファイル）
✓ lib/                    # ユーティリティ関数（全ファイル）
✓ data/                   # データファイル（存在する場合）
✓ package.json            # 依存関係の定義
✓ package-lock.json       # 依存関係のロックファイル
✓ next.config.js         # Next.js設定
✓ tsconfig.json          # TypeScript設定
✓ tailwind.config.ts     # Tailwind CSS設定
✓ postcss.config.js      # PostCSS設定
```

### オプションファイル
```
✓ README.md              # ドキュメント
✓ DEPLOY.md              # デプロイ手順書
```

## ❌ アップロードしないファイル/フォルダ

```
✗ node_modules/          # サーバーでnpm installを実行するため不要
✗ .next/                # ビルド時に自動生成されるため不要
✗ .env.local            # 環境変数（サーバーで別途設定）
✗ .DS_Store            # macOSのシステムファイル
✗ *.pem                # 証明書ファイル
✗ .git/                # Gitリポジトリ（GitHub経由でデプロイする場合は不要）
```

## 📦 アップロード方法

### 方法1: ZIPファイルでアップロード

```bash
# プロジェクトディレクトリで実行
zip -r deploy.zip \
  app/ \
  components/ \
  lib/ \
  data/ \
  package.json \
  package-lock.json \
  next.config.js \
  tsconfig.json \
  tailwind.config.ts \
  postcss.config.js \
  README.md
```

### 方法2: Git経由（推奨）

```bash
# GitHubにプッシュ
git add .
git commit -m "Prepare for deployment"
git push origin main

# サーバーでクローン
git clone https://github.com/your-username/your-repo.git
cd your-repo
npm install
npm run build
npm start
```

### 方法3: SCP/FTPで直接アップロード

```bash
# SCPを使用する場合
scp -r app/ components/ lib/ data/ package*.json *.config.* tsconfig.json user@server:/path/to/app/
```

## 🔧 サーバーでの作業

アップロード後、サーバーで以下を実行：

```bash
# 1. 依存関係のインストール
npm install --production

# 2. 環境変数の設定
# .env.localファイルを作成して環境変数を設定

# 3. ビルド
npm run build

# 4. 起動
npm start
# または PM2を使用
pm2 start npm --name "volunteer-platform" -- start
```

## ⚠️ 重要な注意事項

1. **`.env.local`は絶対にアップロードしない**
   - 機密情報（APIキーなど）が含まれています
   - サーバー上で新規作成してください

2. **`node_modules`はアップロードしない**
   - サイズが大きく、サーバーで`npm install`を実行する方が確実です

3. **`.next`フォルダはアップロードしない**
   - ビルド時に自動生成されます
   - サーバーで`npm run build`を実行してください

4. **環境変数の設定を忘れない**
   - AirTableのAPIキーやテーブルIDは必須です
   - サーバー上で`.env.local`を作成して設定してください


