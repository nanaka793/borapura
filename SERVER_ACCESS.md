# サーバー上でのサイトアクセス方法

サーバーにアップロードした後、サイトを開く方法を説明します。

## 📁 重要なファイル

### エントリーポイント（サイトの起点となるファイル）

```
app/layout.tsx    # サイト全体のレイアウト（HTMLの基本構造）
app/page.tsx      # トップページ（ホームページ）
```

これらのファイルがサイトの起点となりますが、**ファイルを直接開くのではなく、サーバーを起動してブラウザでアクセス**します。

---

## 🚀 サーバーでの起動手順

### 1. サーバーにSSHで接続

```bash
ssh user@your-server-ip
```

### 2. プロジェクトディレクトリに移動

```bash
cd /path/to/your/project
```

### 3. 依存関係のインストール（初回のみ）

```bash
npm install --production
```

### 4. 環境変数の設定

```bash
# .env.localファイルを作成
nano .env.local
```

以下の内容を入力：
```bash
AIRTABLE_API_KEY=your_api_key
AIRTABLE_BASE_ID=apps9fjjYlntgLXww
AIRTABLE_USERS_TABLE_ID=your_table_id
AIRTABLE_POSTS_TABLE_ID=your_table_id
AIRTABLE_EVENTS_TABLE_ID=your_table_id
AIRTABLE_USERS_AVATAR_FIELD_ID=your_field_id
AIRTABLE_POSTS_IMAGE_FIELD_ID=your_field_id
NODE_ENV=production
```

### 5. ビルド（初回のみ、またはコードを更新した後）

```bash
npm run build
```

### 6. サーバーを起動

```bash
npm start
```

または、PM2を使用する場合：
```bash
pm2 start npm --name "volunteer-platform" -- start
pm2 save
```

---

## 🌐 ブラウザでアクセス

### 方法1: 直接IPアドレスでアクセス

```
http://サーバーのIPアドレス:3000
```

例：
```
http://192.168.1.100:3000
http://203.0.113.45:3000
```

### 方法2: ドメイン名でアクセス（設定済みの場合）

```
http://your-domain.com:3000
```

### 方法3: リバースプロキシ経由（推奨）

Nginxなどのリバースプロキシを設定している場合：

```
http://your-domain.com
https://your-domain.com
```

ポート番号を指定する必要はありません。

---

## 🔍 確認方法

### サーバーが起動しているか確認

```bash
# プロセスを確認
ps aux | grep node

# またはPM2を使用している場合
pm2 list

# ポート3000が開いているか確認
netstat -tuln | grep 3000
# または
lsof -i :3000
```

### ログを確認

```bash
# PM2を使用している場合
pm2 logs volunteer-platform

# 直接起動している場合
# ターミナルにエラーメッセージが表示されます
```

---

## 📍 ファイル構造の確認

サーバー上で以下のファイルが存在することを確認：

```
your-project/
├── app/
│   ├── layout.tsx      ← サイト全体のレイアウト
│   ├── page.tsx        ← トップページ
│   └── ...
├── components/         ← Reactコンポーネント
├── lib/               ← ユーティリティ関数
├── package.json       ← 依存関係の定義
├── .env.local         ← 環境変数（サーバー上で作成）
└── .next/             ← ビルド結果（npm run build後に生成）
```

---

## ⚠️ よくある問題と解決方法

### 問題1: "Cannot GET /" エラー

**原因**: サーバーが起動していない、またはビルドされていない

**解決方法**:
```bash
npm run build
npm start
```

### 問題2: ポート3000にアクセスできない

**原因**: ファイアウォールでポートがブロックされている

**解決方法**:
```bash
# Ubuntu/Debianの場合
sudo ufw allow 3000

# CentOS/RHELの場合
sudo firewall-cmd --add-port=3000/tcp --permanent
sudo firewall-cmd --reload
```

### 問題3: 環境変数が読み込まれない

**原因**: `.env.local`ファイルが存在しない、またはパスが間違っている

**解決方法**:
```bash
# プロジェクトのルートディレクトリに.env.localがあるか確認
ls -la .env.local

# ファイルが存在しない場合は作成
nano .env.local
```

### 問題4: 外部からアクセスできない

**原因**: サーバーがlocalhost（127.0.0.1）のみでリッスンしている

**解決方法**:
`package.json`の`start`スクリプトを変更：
```json
{
  "scripts": {
    "start": "next start -H 0.0.0.0"
  }
}
```

または環境変数で設定：
```bash
HOSTNAME=0.0.0.0 npm start
```

---

## 🔒 本番環境での推奨設定

### Nginxリバースプロキシの設定例

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
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;
    }
}
```

### SSL証明書の設定（Let's Encrypt）

```bash
sudo certbot --nginx -d your-domain.com
```

---

## 📝 まとめ

1. **エントリーポイント**: `app/layout.tsx`と`app/page.tsx`
2. **起動コマンド**: `npm start`（ビルド後）
3. **アクセスURL**: `http://サーバーのIP:3000` または `http://ドメイン名:3000`
4. **本番環境**: Nginxなどのリバースプロキシを使用してポート80/443でアクセス

**重要**: ファイルを直接開くのではなく、必ずサーバーを起動してからブラウザでアクセスしてください。


