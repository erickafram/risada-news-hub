# Guia de Implantação do Meme PMW na DigitalOcean

Este guia fornece instruções passo a passo para implantar o projeto Meme PMW (Risada News Hub) em um servidor DigitalOcean com o domínio memepmw.online.

## 1. Configuração do Droplet na DigitalOcean

### 1.1 Criar um Droplet

1. Faça login na sua conta da DigitalOcean
2. Clique em "Create" e selecione "Droplets"
3. Escolha uma imagem: **Ubuntu 22.04 LTS**
4. Selecione um plano: Recomendado o plano **Basic** com pelo menos 2GB de RAM
5. Escolha uma região próxima ao Brasil (São Paulo, se disponível)
6. Adicione sua chave SSH ou crie uma senha
7. Nomeie seu droplet (ex: memepmw)
8. Clique em "Create Droplet"

### 1.2 Configuração do Domínio

1. No painel da DigitalOcean, vá para "Networking" e selecione "Domains"
2. Adicione seu domínio `memepmw.online` se ainda não estiver adicionado
3. Crie os seguintes registros DNS:
   - Registro A: `memepmw.online` apontando para o IP do seu Droplet
   - Registro A: `api.memepmw.online` apontando para o IP do seu Droplet
   - Registro CNAME: `www.memepmw.online` apontando para `memepmw.online`

## 2. Configuração Inicial do Servidor

### 2.1 Conectar ao Servidor

```bash
ssh root@SEU_IP_DO_DROPLET
```

### 2.2 Atualizar o Sistema

```bash
apt update && apt upgrade -y
```

### 2.3 Instalar Dependências Básicas

```bash
apt install -y curl git build-essential
```

## 3. Instalação do Node.js

```bash
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
apt install -y nodejs
npm install -g pm2
```

## 4. Instalação do MySQL

```bash
apt install -y mysql-server
mysql_secure_installation
```

Durante a configuração do MySQL, defina uma senha forte para o usuário root e responda "Y" para todas as perguntas de segurança.

### 4.1 Criar Banco de Dados e Usuário

```bash
mysql -u root -p
```

No prompt do MySQL, execute:

```sql
CREATE DATABASE memepmw_db;
CREATE USER 'memepmw_user'@'localhost' IDENTIFIED BY 'senha_segura_aqui';
GRANT ALL PRIVILEGES ON memepmw_db.* TO 'memepmw_user'@'localhost';
FLUSH PRIVILEGES;
EXIT;
```

## 5. Instalação do Nginx

```bash
apt install -y nginx
```

## 6. Configuração do Firewall

```bash
ufw allow OpenSSH
ufw allow 'Nginx Full'
ufw enable
```

## 7. Clonar o Repositório do GitHub

```bash
mkdir -p /var/www
cd /var/www
git clone https://github.com/SEU_USUARIO/risada-news-hub.git memepmw
cd memepmw
```

## 8. Configuração do Backend

```bash
cd /var/www/memepmw/backend
npm install
```

### 8.1 Configurar Variáveis de Ambiente

```bash
cp .env.production .env
nano .env
```

Certifique-se de que o arquivo .env contenha:

```
PORT=3001
DB_HOST=localhost
DB_USER=memepmw_user
DB_PASSWORD=senha_segura_aqui
DB_NAME=memepmw_db
JWT_SECRET=chave_jwt_muito_segura_para_producao
RECAPTCHA_SECRET_KEY=sua_chave_secreta_recaptcha
```

### 8.2 Executar Migrações do Banco de Dados

```bash
npx sequelize-cli db:migrate
```

### 8.3 Configurar PM2 para o Backend

Crie um arquivo de configuração para o PM2:

```bash
nano ecosystem.config.js
```

Adicione o seguinte conteúdo:

```javascript
module.exports = {
  apps: [{
    name: "memepmw-api",
    script: "src/server.js",
    env: {
      NODE_ENV: "production",
    },
    instances: "max",
    exec_mode: "cluster",
    max_memory_restart: "300M"
  }]
};
```

Inicie o backend com PM2:

```bash
pm2 start ecosystem.config.js
pm2 save
pm2 startup
```

## 9. Configuração do Frontend

```bash
cd /var/www/memepmw
npm install
```

### 9.1 Configurar Variáveis de Ambiente

```bash
cp .env.production .env
nano .env
```

Certifique-se de que o arquivo contenha:

```
VITE_API_URL=https://api.memepmw.online
```

### 9.2 Compilar o Frontend

```bash
npm run build
```

## 10. Configuração do Nginx

### 10.1 Configuração para o Frontend

```bash
nano /etc/nginx/sites-available/memepmw-frontend
```

Adicione:

```nginx
server {
    listen 80;
    server_name memepmw.online www.memepmw.online;
    root /var/www/memepmw/dist;
    index index.html;

    location / {
        try_files $uri $uri/ /index.html;
    }

    location ~* \.(js|css|png|jpg|jpeg|gif|ico|svg)$ {
        expires 30d;
        add_header Cache-Control "public, no-transform";
    }
}
```

### 10.2 Configuração para o Backend (API)

```bash
nano /etc/nginx/sites-available/memepmw-api
```

Adicione:

```nginx
server {
    listen 80;
    server_name api.memepmw.online;

    location / {
        proxy_pass http://localhost:3001;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }

    location /uploads {
        alias /var/www/memepmw/backend/uploads;
    }
}
```

### 10.3 Ativar as Configurações

```bash
ln -s /etc/nginx/sites-available/memepmw-frontend /etc/nginx/sites-enabled/
ln -s /etc/nginx/sites-available/memepmw-api /etc/nginx/sites-enabled/
rm /etc/nginx/sites-enabled/default
nginx -t
systemctl restart nginx
```

## 11. Configurar HTTPS com Certbot

```bash
apt install -y certbot python3-certbot-nginx
certbot --nginx -d memepmw.online -d www.memepmw.online
certbot --nginx -d api.memepmw.online
```

## 12. Configurar Diretório de Uploads

```bash
mkdir -p /var/www/memepmw/backend/uploads
chmod -R 755 /var/www/memepmw/backend/uploads
chown -R www-data:www-data /var/www/memepmw/backend/uploads
```

## 13. Reiniciar Serviços

```bash
systemctl restart nginx
pm2 restart all
```

## 14. Verificação da Instalação

Acesse os seguintes URLs para verificar se a instalação foi bem-sucedida:
- Frontend: https://memepmw.online
- API: https://api.memepmw.online

## 15. Manutenção e Atualizações

### 15.1 Atualizar o Backend

```bash
cd /var/www/memepmw/backend
git pull
npm install
npx sequelize-cli db:migrate
pm2 restart memepmw-api
```

### 15.2 Atualizar o Frontend

```bash
cd /var/www/memepmw
git pull
npm install
npm run build
```

## 16. Monitoramento

Verifique o status do backend:

```bash
pm2 status
pm2 logs memepmw-api
```

## 17. Backups

Configure backups automáticos do banco de dados:

```bash
mkdir -p /var/backups/memepmw
nano /root/backup-db.sh
```

Adicione:

```bash
#!/bin/bash
TIMESTAMP=$(date +"%Y%m%d-%H%M%S")
BACKUP_DIR="/var/backups/memepmw"
mysqldump -u memepmw_user -p'senha_segura_aqui' memepmw_db > $BACKUP_DIR/memepmw_db_$TIMESTAMP.sql
find $BACKUP_DIR -name "memepmw_db_*.sql" -type f -mtime +7 -delete
```

Torne o script executável e adicione ao crontab:

```bash
chmod +x /root/backup-db.sh
crontab -e
```

Adicione:

```
0 2 * * * /root/backup-db.sh
```

## Solução de Problemas Comuns

### Erro de Permissão nos Uploads
```bash
chmod -R 755 /var/www/memepmw/backend/uploads
chown -R www-data:www-data /var/www/memepmw/backend/uploads
```

### Erro de Conexão com o Banco de Dados
Verifique se o MySQL está em execução:
```bash
systemctl status mysql
```

Verifique as credenciais no arquivo .env do backend.

### Erro 502 Bad Gateway
Verifique os logs do Nginx:
```bash
tail -f /var/log/nginx/error.log
```

Verifique se o backend está em execução:
```bash
pm2 status
```

### Frontend não Carrega Corretamente
Verifique se o build foi gerado corretamente:
```bash
ls -la /var/www/memepmw/dist
```

Verifique os logs do Nginx:
```bash
tail -f /var/log/nginx/access.log
```
