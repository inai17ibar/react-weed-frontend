# Dockerfile (frontend/Dockerfile)

# ベースイメージ
FROM node:18

# 作業ディレクトリを設定
WORKDIR /src/App

# 依存関係をコピー
COPY package*.json ./
RUN npm install

# ソースをコピー
COPY . .

# 開放するポートを指定
EXPOSE 3000

# アプリをビルド
RUN npm run build

# 起動コマンド
CMD [ "npm", "start" ]
