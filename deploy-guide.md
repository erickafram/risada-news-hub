# Guia de Implantação do Risada News Hub na DigitalOcean

Este guia descreve como implantar o projeto Risada News Hub em um servidor da DigitalOcean de forma simples e eficiente.

## 1. Preparação do Droplet na DigitalOcean

### 1.1 Criar um Droplet

1. Faça login na sua conta da DigitalOcean
2. Clique em "Create" e selecione "Droplets"
3. Escolha uma imagem: **Ubuntu 22.04 LTS**
4. Selecione um plano: Recomendado o plano **Basic** com pelo menos 2GB de RAM
5. Escolha uma região próxima ao seu público-alvo (ex: São Paulo para Brasil)
6. Adicione sua chave SSH ou crie uma senha
7. Nomeie seu droplet (ex: risada-news-hub)
8. Clique em "Create Droplet"

### 1.2 Configuração Inicial do Servidor

Conecte-se ao seu droplet via SSH:

```bash
ssh root@seu_ip_do_droplet
```

Atualize o sistema:

```bash
apt update && apt upgrade -y
```

## 2. Instalação de Dependências

### 2.1 Instalar Node.js e npm

```bash
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
apt install -y nodejs
npm install -g pm2
```

### 2.2 Instalar MySQL

```bash
apt install -y mysql-server
mysql_secure_installation
```

Durante a configuração do MySQL, defina uma senha forte para o usuário root.

### 2.3 Criar Banco de Dados e Usuário

```bash
mysql -u root -p
```

No prompt do MySQL:

```sql
CREATE DATABASE risada_news_hub;
CREATE USER 'seu_usuario_db'@'localhost' IDENTIFIED BY 'sua_senha_db';
GRANT ALL PRIVILEGES ON risada_news_hub.* TO 'seu_usuario_db'@'localhost';
FLUSH PRIVILEGES;
EXIT;
```

### 2.4 Instalar Nginx

```bash
apt install -y nginx
```

## 3. Implantação do Projeto

### 3.1 Clonar o Repositório (ou transferir via SCP/SFTP)

```bash
mkdir -p /var/www
cd /var/www
git clone https://github.com/seu-usuario/risada-news-hub.git
cd risada-news-hub
```

Alternativa: Transfira os arquivos via SCP:

```bash
# Execute este comando no seu computador local
scp -r /caminho/para/risada-news-hub root@seu_ip_do_droplet:/var/www/
```

### 3.2 Configurar o Backend

```bash
cd /var/www/risada-news-hub/backend
npm install
```

Crie o arquivo .env:

```bash
cp .env.production .env
nano .env
```

Edite as configurações conforme necessário (DB_USER, DB_PASSWORD, JWT_SECRET, etc.).

Execute as migrações:

```bash
npx sequelize-cli db:migrate
```

### 3.3 Configurar o Frontend

```bash
cd /var/www/risada-news-hub
npm install
npm run build
```

## 4. Configurar o PM2 para o Backend

Crie um arquivo de configuração para o PM2:

```bash
cd /var/www/risada-news-hub/backend
```

Crie um arquivo chamado `ecosystem.config.js`:

```bash
nano ecosystem.config.js
```

Adicione o seguinte conteúdo:

```javascript
module.exports = {
  apps: [{
    name: "risada-news-api",
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

## 5. Configurar o Nginx

### 5.1 Configuração para o Frontend

```bash
nano /etc/nginx/sites-available/risada-frontend
```

Adicione:

```nginx
server {
    listen 80;
    server_name seudominio.com.br www.seudominio.com.br;
    root /var/www/risada-news-hub/dist;
    index index.html;

    location / {
        try_files $uri $uri/ /index.html;
    }

    # Configurações de cache para arquivos estáticos
    location ~* \.(js|css|png|jpg|jpeg|gif|ico|svg)$ {
        expires 30d;
        add_header Cache-Control "public, no-transform";
    }
}
```

### 5.2 Configuração para o Backend (API)

```bash
nano /etc/nginx/sites-available/risada-api
```

Adicione:

```nginx
server {
    listen 80;
    server_name api.seudominio.com.br;

    location / {
        proxy_pass http://localhost:3001;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }
}
```

### 5.3 Ativar as Configurações

```bash
ln -s /etc/nginx/sites-available/risada-frontend /etc/nginx/sites-enabled/
ln -s /etc/nginx/sites-available/risada-api /etc/nginx/sites-enabled/
nginx -t
systemctl restart nginx
```

## 6. Configurar HTTPS com Certbot

```bash
apt install -y certbot python3-certbot-nginx
certbot --nginx -d seudominio.com.br -d www.seudominio.com.br
certbot --nginx -d api.seudominio.com.br
```

## 7. Configurar Uploads

Certifique-se de que a pasta de uploads tenha as permissões corretas:

```bash
mkdir -p /var/www/risada-news-hub/backend/uploads
chmod -R 755 /var/www/risada-news-hub/backend/uploads
chown -R www-data:www-data /var/www/risada-news-hub/backend/uploads
```

## 8. Manutenção e Atualizações

Para atualizar o backend:

```bash
cd /var/www/risada-news-hub/backend
git pull
npm install
pm2 restart risada-news-api
```

Para atualizar o frontend:

```bash
cd /var/www/risada-news-hub
git pull
npm install
npm run build
```

## 9. Monitoramento

Verifique o status do backend:

```bash
pm2 status
pm2 logs risada-news-api
```

## 10. Backups

Configure backups automáticos do banco de dados:

```bash
mkdir -p /var/backups/risada
nano /root/backup-db.sh
```

Adicione:

```bash
#!/bin/bash
TIMESTAMP=$(date +"%Y%m%d-%H%M%S")
BACKUP_DIR="/var/backups/risada"
mysqldump -u seu_usuario_db -p'sua_senha_db' risada_news_hub > $BACKUP_DIR/risada_news_hub_$TIMESTAMP.sql
find $BACKUP_DIR -name "risada_news_hub_*.sql" -type f -mtime +7 -delete
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

## Considerações Finais

Esta configuração fornece uma base sólida para executar o Risada News Hub em um ambiente de produção na DigitalOcean. Lembre-se de:

1. Manter o sistema atualizado regularmente
2. Monitorar o uso de recursos do servidor
3. Verificar os logs periodicamente
4. Realizar backups regularmente
5. Configurar um firewall (UFW) para maior segurança

Para qualquer problema ou dúvida, consulte a documentação da DigitalOcean ou entre em contato com o suporte.
