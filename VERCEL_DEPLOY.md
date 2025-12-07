# Vercelデプロイ時のエラー対応

## エラーの原因
`app/api/topics/route.ts`で`request.url`を使用していたため、静的生成時にエラーが発生していました。

## 対応内容
1. `request.url`を`request.nextUrl.searchParams`に変更
2. `export const dynamic = 'force-dynamic'`を追加して動的レンダリングを明示

## デプロイ方法

### 1. キャッシュをクリアして再デプロイ（推奨）
Vercelのダッシュボードで：
- Settings → General → Clear Build Cache
- または、デプロイ時に「Clear Cache and Redeploy」を選択

### 2. ローカルでビルドを確認
```bash
rm -rf .next
npm run build
```

### 3. 変更をコミットしてプッシュ
```bash
git add .
git commit -m "Fix: Remove request.url usage in topics API route"
git push
```

## 確認事項
- [ ] `app/api/topics/route.ts`に`request.url`が使われていない
- [ ] `export const dynamic = 'force-dynamic'`が設定されている
- [ ] ローカルビルドが成功する

