require('dotenv').config();
const express = require('express');
const cors = require('cors');
const path = require('path');
const { sequelize } = require('./models');

// Importação das rotas
const userRoutes = require('./routes/userRoutes');
const categoryRoutes = require('./routes/categoryRoutes');
const articleRoutes = require('./routes/articleRoutes');
const authRoutes = require('./routes/authRoutes');
const uploadRoutes = require('./routes/uploadRoutes');

const app = express();
const PORT = process.env.PORT || 3001;

// Middlewares
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Servir arquivos estáticos da pasta uploads
app.use('/uploads', express.static(path.join(__dirname, '../uploads')));

// Rotas
app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/categories', categoryRoutes);
app.use('/api/articles', articleRoutes);
app.use('/api/upload', uploadRoutes);

// Rota de teste
app.get('/', (req, res) => {
  res.json({ message: 'Bem-vindo à API do Risada News Hub!' });
});

// Sincronização com o banco de dados e inicialização do servidor
async function startServer() {
  try {
    // Sincroniza os modelos com o banco de dados
    // Em ambiente de produção, use { force: false }
    await sequelize.sync({ alter: true });
    console.log('Banco de dados sincronizado com sucesso.');

    // Inicia o servidor
    app.listen(PORT, () => {
      console.log(`Servidor rodando na porta ${PORT}`);
    });
  } catch (error) {
    console.error('Erro ao iniciar o servidor:', error);
  }
}

startServer();
