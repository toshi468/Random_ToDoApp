## Laravel バックエンド環境構築手順

このディレクトリに、Laravel ベースのバックエンド API を構築します。  
以下は **Windows (PowerShell)** 前提の手順です。

---

### 1. 事前準備（ローカル環境）

- **PHP**: 8.1 以上
  - 例: `php -v` で確認
- **Composer**: PHP の依存管理ツール
  - 例: `composer -V` で確認

まだ入っていない場合:

- PHP: `XAMPP` や `php for Windows` などをインストール
- Composer: 公式インストーラを実行
  - `https://getcomposer.org/download/`

---

### 2. Laravel プロジェクトの作成

`Random_ToDoApp` プロジェクト直下で、`backend` ディレクトリに移動して実行します。

```powershell
cd C:\Users\yuu12\Documents\Random_ToDoApp\Random_ToDoApp
cd backend
composer create-project laravel/laravel .
```

※ これで `backend` 直下に Laravel 一式（`app`, `bootstrap`, `config`, `routes` など）が展開されます。

---

### 3. 環境変数ファイルの設定

```powershell
cd backend
copy .env.example .env
```

`.env` を開いて、最低限次の項目を確認・変更します（DB は最初は sqlite がおすすめです）。

```env
APP_NAME="Random ToDo Backend"
APP_ENV=local
APP_DEBUG=true
APP_URL=http://localhost:8000

DB_CONNECTION=sqlite
DB_DATABASE=${PWD}\database\database.sqlite
```

sqlite 用のファイルを作成します:

```powershell
mkdir database -Force
New-Item -Path database\database.sqlite -ItemType File -Force
```

アプリケーションキーの生成:

```powershell
php artisan key:generate
```

---

### 4. 開発サーバーの起動

```powershell
cd backend
php artisan serve --host=127.0.0.1 --port=8000
```

ブラウザで `http://127.0.0.1:8000` にアクセスして Laravel の初期画面が出れば成功です。

---

### 5. フロントエンドとの連携（ToDo API 用の想定）

後で以下のような形で API を作成していきます（例）:

- `routes/api.php` に ToDo 用ルートを定義
- `app/Models/Todo.php` モデルとマイグレーションを作成
- `app/Http/Controllers/TodoController.php` に CRUD 実装
- フロントエンドからは `http://localhost:8000/api/todos` などにアクセス

この README の手順に従って Laravel プロジェクトを作成したら、次に **ToDo 用 API の実装** も一緒に進めていきましょう。
