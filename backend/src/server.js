require('dotenv').config();
const express = require('express');
const cors = require('cors');
const path = require('path');
const fs = require('fs');
const { sequelize } = require('./models');

// Importação das rotas
const userRoutes = require('./routes/userRoutes');
const categoryRoutes = require('./routes/categoryRoutes');
const articleRoutes = require('./routes/articleRoutes');
const authRoutes = require('./routes/authRoutes');
const uploadRoutes = require('./routes/uploadRoutes');
const reactionRoutes = require('./routes/reactionRoutes');
const commentRoutes = require('./routes/commentRoutes');
const seedRoutes = require('./routes/seedRoutes');
const statsRoutes = require('./routes/statsRoutes');
const settingRoutes = require('./routes/settingRoutes');
const pageRoutes = require('./routes/pageRoutes');
const analyticsRoutes = require('./routes/analyticsRoutes');

const app = express();
const PORT = process.env.PORT || 3001;

// Middlewares
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Servir arquivos estáticos da pasta uploads
app.use('/uploads', express.static(path.join(__dirname, '../uploads')));

// Rota para verificar se um arquivo existe
app.get('/check-file', (req, res) => {
  const filePath = req.query.path;
  if (!filePath) {
    return res.status(400).json({ exists: false, message: 'Caminho do arquivo não fornecido' });
  }
  
  // Remover a barra inicial se existir
  const normalizedPath = filePath.startsWith('/') ? filePath.substring(1) : filePath;
  const fullPath = path.join(__dirname, '..', normalizedPath);
  
  if (fs.existsSync(fullPath)) {
    return res.status(200).json({ exists: true, path: filePath });
  } else {
    return res.status(404).json({ exists: false, message: 'Arquivo não encontrado' });
  }
});

// Rotas
app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/categories', categoryRoutes);
app.use('/api/articles', articleRoutes);
app.use('/api/upload', uploadRoutes);
app.use('/api/reactions', reactionRoutes);
app.use('/api/comments', commentRoutes);
app.use('/api/seed', seedRoutes);
app.use('/api/stats', statsRoutes);
app.use('/api/settings', settingRoutes);
app.use('/api/pages', pageRoutes);
app.use('/api/analytics', analyticsRoutes);

// Rota de teste
app.get('/', (req, res) => {
  res.json({ message: 'Bem-vindo à API do memepmw!' });
});

// Inicialização do servidor
async function startServer() {
  try {
    // Testar conexão com o banco de dados
    await sequelize.authenticate();
    console.log('Conexão com o banco de dados estabelecida com sucesso.');
    
    // Não usamos mais sync({ alter: true }) para evitar problemas com índices
    // Em vez disso, use migrations para gerenciar o esquema do banco de dados:
    // npm run db:migrate

    // Inicia o servidor
    app.listen(PORT, () => {
      console.log(`Servidor rodando na porta ${PORT}`);
    });
  } catch (error) {
    console.error('Erro ao iniciar o servidor:', error);
  }
}

startServer();
