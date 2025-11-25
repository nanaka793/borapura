# デプロイ手順書

このドキュメントでは、ボランティアプラットフォームを外部サーバーにデプロイする方法を説明します。

## デプロイ方法の選択

### 推奨: Vercel（最も簡単）

Next.jsの開発元が提供するホスティングサービスで、設定が最も簡単です。

### その他の選択肢

- **Netlify**: Vercelと同様の使いやすさ
- **AWS / GCP / Azure**: より高度な設定が可能
- **独自サーバー**: VPSや専用サーバーを使用

---

## 方法1: Vercelにデプロイ（推奨）

### 前提条件

- GitHubアカウント
- Vercelアカウント（無料）

### 手順

1. **GitHubにリポジトリを作成**
   ```bash
   # プロジェクトディレクトリで実行
   git init
   git add .
   git commit -m "Initial commit"
   git branch -M main
   git remote add origin https://github.com/your-username/your-repo-name.git
   git push -u origin main
   ```

2. **Vercelにログイン**
   - https://vercel.com にアクセス
   - GitHubアカウントでログイン

3. **プロジェクトをインポート**
   - 「Add New Project」をクリック
   - GitHubリポジトリを選択
   - プロジェクトをインポート

4. **環境変数を設定**
   Vercelのプロジェクト設定で、以下の環境変数を追加：
   ```
   AIRTABLE_API_KEY=your_personal_access_token
   AIRTABLE_BASE_ID=apps9fjjYlntgLXww
   AIRTABLE_USERS_TABLE_ID=your_users_table_id
   AIRTABLE_POSTS_TABLE_ID=your_posts_table_id
   AIRTABLE_EVENTS_TABLE_ID=your_events_table_id
   AIRTABLE_USERS_AVATAR_FIELD_ID=fldXXXXXXXXXXXXXX
   AIRTABLE_POSTS_IMAGE_FIELD_ID=fldZZZZZZZZZZZZZ
   ```

5. **デプロイ**
   - 「Deploy」をクリック
   - 数分でデプロイが完了
   - 自動的にURLが発行されます（例: `your-project.vercel.app`）

### 注意事項

- `.env.local`ファイルはGitにコミットしないでください（`.gitignore`に含まれています）
- 環境変数はVercelのダッシュボードで設定してください
- デプロイ後、自動的にHTTPSが有効になります

---

## 方法2: Netlifyにデプロイ

### 手順

1. **GitHubにリポジトリを作成**（Vercelと同じ）

2. **Netlifyにログイン**
   - https://www.netlify.com にアクセス
   - GitHubアカウントでログイン

3. **プロジェクトをインポート**
   - 「Add new site」→「Import an existing project」
   - GitHubリポジトリを選択

4. **ビルド設定**
   - Build command: `npm run build`
   - Publish directory: `.next`

5. **環境変数を設定**
   Netlifyの「Site settings」→「Environment variables」で設定

6. **デプロイ**
   - 「Deploy site」をクリック

---

## 方法3: 独自サーバーにデプロイ

### 前提条件

- Node.js 18以上がインストールされたサーバー
- PM2などのプロセス管理ツール（推奨）

### 手順

1. **サーバーにファイルをアップロード**
   ```bash
   # ローカルでビルド
   npm run build
   
   # サーバーにアップロード（.gitignoreに含まれていないファイルのみ）
   # 以下のファイル/フォルダをアップロード：
   # - app/
   # - components/
   # - lib/
   # - data/
   # - public/（存在する場合）
   # - package.json
   # - package-lock.json
   # - next.config.js
   # - tsconfig.json
   # - tailwind.config.ts
   # - postcss.config.js
   # - .env.local（サーバー上で作成）
   ```

2. **サーバーで依存関係をインストール**
   ```bash
   npm install --production
   ```

3. **環境変数を設定**
   ```bash
   # .env.localファイルを作成
   nano .env.local
   # 必要な環境変数を設定
   ```

4. **アプリケーションを起動**
   ```bash
   # PM2を使用する場合
   npm install -g pm2
   pm2 start npm --name "volunteer-platform" -- start
   pm2 save
   pm2 startup
   ```

5. **Nginxでリバースプロキシを設定**（オプション）
   ```nginx
   server {
       listen 80;
       server_name your-domain.com;
       
       location / {
           proxy_pass http://localhost:3000;
           proxy_http_version 1.1;
           proxy_set_header Upgrade $http_upgrade;
           proxy_set_header Connection 'upgrade';
           proxy_set_header Host $host;
           proxy_cache_bypass $http_upgrade;
       }
   }
   ```

---

## アップロードすべきファイル/フォルダ

### ✅ アップロードする必要があるもの

```
app/                    # Next.jsアプリケーションコード
components/             # Reactコンポーネント
lib/                    # ユーティリティ関数
data/                   # データファイル（存在する場合）
package.json            # 依存関係の定義
package-lock.json       # 依存関係のロックファイル
next.config.js         # Next.js設定
tsconfig.json          # TypeScript設定
tailwind.config.ts     # Tailwind CSS設定
postcss.config.js      # PostCSS設定
README.md              # ドキュメント（オプション）
```

### ❌ アップロードしないもの（.gitignoreに含まれている）

```
node_modules/          # サーバーでnpm installを実行
.next/                # ビルド時に自動生成
.env.local            # 環境変数（サーバーで別途設定）
.DS_Store            # macOSのシステムファイル
*.pem                # 証明書ファイル
```

---

## 環境変数の設定

本番環境では、以下の環境変数を設定してください：

```bash
# AirTable認証情報
AIRTABLE_API_KEY=your_personal_access_token
AIRTABLE_BASE_ID=apps9fjjYlntgLXww

# テーブルID
AIRTABLE_USERS_TABLE_ID=your_users_table_id
AIRTABLE_POSTS_TABLE_ID=your_posts_table_id
AIRTABLE_EVENTS_TABLE_ID=your_events_table_id

# フィールドID（Attachment用）
AIRTABLE_USERS_AVATAR_FIELD_ID=fldXXXXXXXXXXXXXX
AIRTABLE_POSTS_IMAGE_FIELD_ID=fldZZZZZZZZZZZZZ

# Node.js環境（本番環境）
NODE_ENV=production
```

---

## トラブルシューティング

### ビルドエラーが発生する場合

```bash
# ローカルでビルドをテスト
npm run build
```

### 環境変数が読み込まれない場合

- 環境変数が正しく設定されているか確認
- サーバーを再起動
- `.env.local`ファイルのパスを確認

### パフォーマンスの問題

- Next.jsのキャッシュを有効活用
- 画像最適化を設定（`next.config.js`）
- CDNの使用を検討

---

## セキュリティチェックリスト

- [ ] `.env.local`がGitにコミットされていない
- [ ] 環境変数が本番環境で正しく設定されている
- [ ] HTTPSが有効になっている（Vercel/Netlifyは自動）
- [ ] AirTable APIキーが適切に保護されている
- [ ] パスワードハッシュがbcryptで正しく処理されている

---

## サポート

問題が発生した場合は、以下を確認してください：

1. エラーログを確認
2. 環境変数が正しく設定されているか確認
3. AirTableのAPIキーとテーブルIDが正しいか確認
4. Node.jsのバージョンが18以上か確認


