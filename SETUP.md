# Life Suite (Next.js版) セットアップ手順

## 1. Firebaseプロジェクトを新規作成(あなたが行う操作)

1. https://console.firebase.google.com/ で新規プロジェクトを作成(名前は「Life Suite」など。travel-osとは別プロジェクト)
2. 「ビルド」→「Authentication」→「始める」→ Sign-in method で「メール/パスワード」を有効化
3. Authentication > Users > 「ユーザーを追加」で、メールアドレス `ym2007cv@gmail.com` + 好きな合言葉(パスワード)でユーザーを1人作成
4. 「ビルド」→「Firestore Database」→「データベースを作成」(本番モードでOK。ルールは後で `firestore.rules` を反映)
5. プロジェクトの概要 → 「</> (ウェブ)」アイコンでウェブアプリを登録し、表示される設定値(`apiKey` 等)をコピーしてClaudeに共有する

## 2. Claude側で行う作業(自動)

1. 共有された設定値を `.env.local` に反映
2. `npm run dev` でローカル起動して動作確認
3. Firestoreルールの反映(Firebase Consoleの「ルール」タブに `firestore.rules` の内容を貼り付けてもらう案内、またはFirebase CLIがあれば自動)

## 3. Vercelへのデプロイ(あなたが行う操作)

travel-osと同じ要領です。

1. このプロジェクト(`life-suite-web`)をGitHubリポジトリにpush(または `vercel` CLIで直接デプロイ)
2. https://vercel.com/new でリポジトリをインポート
3. 環境変数(`.env.local`の内容)をVercelのプロジェクト設定に追加
4. デプロイ実行 → 発行されたURLで外部からアクセス可能に
