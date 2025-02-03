# RealizeLearning backend

## 開発環境

### 各種バージョン情報

* Node.js
    * 20.15.1
* MySQL
    * 8.0.20
* Redis
    * 5.0.14

## 開発環境初回構築手順

### 1. nvm インストール

* Node.js のバージョン管理のため [nvm](https://github.com/nvm-sh/nvm|nvm) を使用している
* インストール方法
    * [Mac, Linux, Windows WSL](https://github.com/nvm-sh/nvm?tab=readme-ov-file#installing-and-updating)
    * [Windows](https://github.com/coreybutler/nvm-windows/releases)

### 2. Node.js インストール
```
nvm install v20.15.1
nvm alias default v20.15.1
```

### 3. .env ファイル作成
```
cp sample.env .env
```
.env 内に記述する値は別途お知らせします。

### 4. Docker compose 起動
```
cd docker
cp sample.env .env
./start_docker.sh
```

sample.env にヤバそうな情報がありますが、あくまでローカル開発環境でのみ使うものなので秘匿情報ではありません。

### 5. 各種パッケージインストール
```
npm install
```

### 6. ビルド
```
npm run build
```

### 7. DB マイグレーション
```
npm run migration:run
```

### 8. サーバ起動
```
npm run start_auth_server
npm run start_api_server
npm run start_admin_api_server
```

## 通常の開発手順

### 開始時

#### 1. Docker Compose でコンテナ起動

##### Linux, Mac, Windows WSL
```
cd docker
./start_docker.sh
```

##### Windows
```
cd docker
start_docker.bat
```

#### 2. git で最新の main ブランチ取得
```
git checkout main
git pull
```

#### 3. モジュール追加・更新対応
```
npm install
```

#### 4. ビルド
```
npm run build
```

#### 5. DB マイグレーション
```
npm run migration:run
```

#### 6. サーバ起動
```
npm run start_auth_server
npm run start_api_server
npm run start_admin_api_server
```

#### 7. サーバ起動完了

### 終了時

#### 1. Docker Compose コンテナ停止

##### Linux, Mac, Windows WSL
```
cd docker
./stop_docker.sh
```

##### Windows
```
cd docker
stop_docker.bat
```

* 注意点
    * 明示的にコンテナ停止を行わないとデータ破損が起きることがある

#### 2. 終了完了
