# ボランティアプラットフォーム

ボランティア同士がつながり、活動記録を共有するプラットフォームです。

## 機能

- ✅ ユーザー登録・ログイン（ID/パスワード）
- ✅ マイページ（プロフィール編集＋自分の投稿一覧）
- ✅ 活動記録の投稿 / 一覧 / 詳細表示（最大5枚の画像アップロード対応）
- ✅ コメント機能・いいね機能
- ✅ ボランティア募集ページ（イベント紹介）
- ✅ ユーザー一覧・プロフィール表示
- ✅ カテゴリー別の分類 / 活動場所の記録

## 技術スタック

- **フレームワーク**: Next.js 14 (App Router)
- **言語**: TypeScript
- **スタイリング**: Tailwind CSS
- **データベース**: AirTable（Users / Posts テーブル）

## セットアップ

1. 依存関係のインストール:
```bash
npm install
```

2. 開発サーバーの起動:
```bash
npm run dev
```

3. `.env.local` に AirTable の認証情報を追加
```bash
AIRTABLE_API_KEY=your_personal_access_token
AIRTABLE_BASE_ID=apps9fjjYlntgLXww
AIRTABLE_USERS_AVATAR_FIELD_ID=fldXXXXXXXXXXXXXX
# （投稿に画像を添付する場合のみ）
AIRTABLE_POSTS_IMAGE_FIELD_ID=fldZZZZZZZZZZZZZ
```

> フィールドID (`fld...`) は AirTable の「Explore / API ドキュメント」画面の Field IDs セクションで確認できます。

4. ブラウザで http://localhost:3000 を開く

### AirTable テーブル構成

#### Users
| Field | Type | 備考 |
| --- | --- | --- |
| Name | Single line text | 表示名 |
| Email | Single line text | ログイン用（ユニーク） |
| PasswordHash | Long text | bcrypt でハッシュ化 |
| Avatar | Attachment | プロフィール画像（アップロード） |
| Headline | Single line text | 一言メッセージ |
| Bio | Long text | 自己紹介 |
| Interests | Multiple select | 関心テーマ |
| Location | Single line text | 活動エリア |
| Website | Single line text | 外部リンク |
| CreatedAt | Date/Time | 作成日時 |
| Badge | Formula | 表彰バッジ（自動） |

#### Posts
| Field | Type | 備考 |
| --- | --- | --- |
| Title | Single line text | タイトル |
| Type | Multiple select | `記録投稿` / `募集投稿` |
| Author | Single line text | Users.Name を参照 |
| Content | Long text | 本文 |
| Image | Attachment | 任意の添付画像 |
| Location | Single line text | 活動場所 |
| Organization | Single line text | 団体名 |
| Tag | Multiple select | カテゴリ分類 |
| CreatedAt | Date/Time | 投稿日 |
| Likes | Number | いいね数 |
| Comments | Long text | JSON 配列として保存（バックエンドで更新） |

### アカウントの作成

1. `/register` で名前・メールアドレス・パスワードを登録
2. 登録完了後は自動的にログインし、`/mypage` へリダイレクト
3. `/login` から既存アカウントでログイン可能

### マイページでできること

- プロフィール（自己紹介・活動エリア・関心テーマ等）の編集
- 自分の投稿のみを一覧表示
- 活動記録投稿ページへのショートカット

## プロジェクト構造

```
├── app/              # Next.js App Router
│   ├── api/         # API ルート
│   ├── posts/       # 投稿関連ページ
│   └── users/       # ユーザー関連ページ
├── components/       # React コンポーネント
├── lib/             # Airtable クライアント/ユーティリティ
└── data/            # ローカルイベントのスタブデータ
```

## 今後の拡張予定

- フォロー機能
- 投稿／イベントの検索・フィルター
- お気に入りイベント／ブックマーク

