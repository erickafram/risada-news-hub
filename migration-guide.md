# Guia para Migrações e Implantação no DigitalOcean App Platform

Este guia explica como executar migrações do banco de dados e implantar o projeto Meme PMW (Risada News Hub) no DigitalOcean App Platform.

## 1. Preparação do Banco de Dados

### 1.1 Criar Banco de Dados na DigitalOcean

1. No painel da DigitalOcean, vá para "Databases"
2. Clique em "Create Database Cluster"
3. Selecione MySQL
4. Escolha um plano (recomendado: Basic)
5. Escolha uma região próxima ao Brasil
6. Dê um nome ao cluster (ex: memepmw-mysql)
7. Clique em "Create Database Cluster"

### 1.2 Configurar o Banco de Dados

Após a criação do banco de dados:

1. Anote as credenciais fornecidas (host, porta, usuário, senha)
2. Crie um novo banco de dados chamado `memepmw_db`:
   - Vá para a seção "Users & Databases"
   - Crie um novo banco de dados chamado `memepmw_db`

## 2. Configuração do Projeto para Migrações

### 2.1 Atualizar o Arquivo de Configuração do Sequelize

Crie ou atualize o arquivo `backend/config/config.json` para incluir as configurações de produção:

```json
{
  "development": {
    "username": "root",
    "password": null,
    "database": "risada_news_hub",
    "host": "127.0.0.1",
    "dialect": "mysql"
  },
  "test": {
    "username": "root",
    "password": null,
    "database": "risada_news_hub_test",
    "host": "127.0.0.1",
    "dialect": "mysql"
  },
  "production": {
    "username": "SEU_USUARIO_DO_BANCO",
    "password": "SUA_SENHA_DO_BANCO",
    "database": "memepmw_db",
    "host": "SEU_HOST_DO_BANCO",
    "dialect": "mysql",
    "dialectOptions": {
      "ssl": {
        "require": true,
        "rejectUnauthorized": false
      }
    }
  }
}
```

### 2.2 Criar Script de Migração

Crie um arquivo `backend/migrate.js`:

```javascript
const { exec } = require('child_process');
const path = require('path');

// Definir o ambiente como produção
process.env.NODE_ENV = 'production';

console.log('Iniciando migrações do banco de dados...');

// Executar as migrações
exec('npx sequelize-cli db:migrate', {
  cwd: path.join(__dirname)
}, (error, stdout, stderr) => {
  if (error) {
    console.error(`Erro ao executar migrações: ${error.message}`);
    return;
  }
  if (stderr) {
    console.error(`Stderr: ${stderr}`);
    return;
  }
  console.log(`Migrações concluídas com sucesso: ${stdout}`);
  
  // Executar seeds se necessário
  exec('npx sequelize-cli db:seed:all', {
    cwd: path.join(__dirname)
  }, (error, stdout, stderr) => {
    if (error) {
      console.error(`Erro ao executar seeds: ${error.message}`);
      return;
    }
    if (stderr) {
      console.error(`Stderr: ${stderr}`);
      return;
    }
    console.log(`Seeds concluídos com sucesso: ${stdout}`);
  });
});
```

## 3. Executando Migrações Localmente

Para testar as migrações localmente antes de implantar:

```bash
# Navegue até a pasta do backend
cd c:\wamp64\www\site\risada-news-hub\backend

# Execute as migrações
npx sequelize-cli db:migrate

# Se quiser adicionar dados iniciais (seeds)
npx sequelize-cli db:seed:all
```

## 4. Implantação no DigitalOcean App Platform

### 4.1 Preparar o Repositório

1. Certifique-se de que seu código está no GitHub
2. Adicione os arquivos de configuração atualizados
3. Faça commit e push das alterações

### 4.2 Criar o App no DigitalOcean

1. No painel da DigitalOcean, vá para "Apps"
2. Clique em "Create App"
3. Selecione o repositório GitHub do seu projeto
4. Configure o app:
   - Selecione o branch (geralmente `main` ou `master`)
   - Tipo de componente: Web Service
   - Fonte: GitHub
   - Tipo de serviço: Node.js
   - Diretório raiz: `/backend` (para a API)
   - Comando de execução: `npm start`
   - HTTP Port: 3001

### 4.3 Configurar Variáveis de Ambiente

Adicione as seguintes variáveis de ambiente:

```
NODE_ENV=production
DB_HOST=seu-host-do-banco
DB_USER=seu-usuario-do-banco
DB_PASSWORD=sua-senha-do-banco
DB_NAME=memepmw_db
JWT_SECRET=chave_jwt_muito_segura_para_producao
RECAPTCHA_SECRET_KEY=sua_chave_secreta_recaptcha
```

### 4.4 Configurar Componente para o Frontend

Adicione um segundo componente para o frontend:

1. Clique em "Add Component"
2. Selecione "Static Site"
3. Diretório raiz: `/` (raiz do projeto)
4. Comando de build: `npm install && npm run build`
5. Diretório de saída: `/dist`

### 4.5 Configurar Domínios

1. Vá para a aba "Domains"
2. Adicione seus domínios:
   - `memepmw.online` para o frontend
   - `api.memepmw.online` para o backend

### 4.6 Executar Migrações

Após a implantação, você pode executar as migrações de duas maneiras:

#### Método 1: Via Console

1. No painel do App, vá para a aba "Console"
2. Acesse o console do componente da API
3. Execute:
   ```bash
   cd /backend
   NODE_ENV=production npx sequelize-cli db:migrate
   ```

#### Método 2: Via Job Pré-implantação

Adicione um job de pré-implantação no arquivo `app.yaml`:

```yaml
jobs:
- name: migrate
  kind: PRE_DEPLOY
  github:
    repo: seu-usuario/risada-news-hub
    branch: main
    deploy_on_push: true
  envs:
  - key: NODE_ENV
    value: production
  - key: DB_HOST
    value: ${seu-host-do-banco}
  - key: DB_USER
    value: ${seu-usuario-do-banco}
  - key: DB_PASSWORD
    value: ${sua-senha-do-banco}
  - key: DB_NAME
    value: memepmw_db
  run_command: cd backend && npx sequelize-cli db:migrate
```

## 5. Verificação e Solução de Problemas

### 5.1 Verificar Status das Migrações

Para verificar se as migrações foram executadas com sucesso:

```bash
# No console do DigitalOcean App
cd /backend
NODE_ENV=production npx sequelize-cli db:migrate:status
```

### 5.2 Problemas Comuns e Soluções

#### Erro de Conexão com o Banco de Dados

Verifique:
- Se as credenciais do banco de dados estão corretas
- Se o banco de dados está acessível a partir do App (verifique as regras de firewall)
- Se o SSL está configurado corretamente

#### Erro nas Migrações

Se uma migração falhar:
1. Verifique os logs para identificar o erro
2. Corrija o problema no código
3. Se necessário, desfaça a última migração:
   ```bash
   NODE_ENV=production npx sequelize-cli db:migrate:undo
   ```

#### Problemas com Seeds

Se os seeds falharem:
1. Verifique se os dados nos seeds são válidos
2. Tente executar os seeds individualmente:
   ```bash
   NODE_ENV=production npx sequelize-cli db:seed --seed nome-do-arquivo-seed
   ```

## 6. Manutenção Contínua

### 6.1 Adicionando Novas Migrações

Para criar uma nova migração:

```bash
npx sequelize-cli migration:generate --name nome-da-migracao
```

Edite o arquivo gerado e implante novamente.

### 6.2 Atualizações do Banco de Dados

Após cada atualização do modelo de dados:
1. Crie uma nova migração
2. Teste localmente
3. Implante no DigitalOcean
4. Execute a migração no ambiente de produção

## 7. Backup do Banco de Dados

Configure backups regulares do seu banco de dados:

1. No painel do banco de dados na DigitalOcean, vá para "Backups"
2. Configure backups automáticos
3. Defina a frequência (diária, semanal)
4. Defina o período de retenção
