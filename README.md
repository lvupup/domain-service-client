# domain-service-client

## 設置本機端開發環境

### Step 1. 啟用 Consul

1. 打開 Teminal，切到專案 (domain-service-client) 根目錄
2. 執行以下命令，啟用 Consul Docker Container
```sh
> cd consul
> docker compose up -d
```
3. 打開瀏覽器，瀏覽 http://localhost:8500/，確認 Consul 如預期運行

### Step 2. 啟用 MongoDB

1. 打開 Teminal，切到專案 (domain-service-client) 根目錄
2. 執行以下命令，啟用 MongoDB Docker Container
```sh
> sh ./database/start.sh
```

### Step 3. 安裝第三方依賴

1. 打開 Teminal，切到專案 (domain-service-client) 根目錄
2. 執行 yarn install，下載 NPM 依賴庫

### Step 4. 執行專案

1. 打開 Teminal，切到專案 (domain-service-client) 根目錄
2. 執行 yarn dev，啟用專案
