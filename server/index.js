const express = require('express');
const cors = require('cors');
const path = require('path');
const shareRoutes = require('./routes/shareRoutes');

// Configuração do servidor
const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());

// Servir arquivos estáticos do build do React
app.use(express.static(path.join(__dirname, '../dist')));

// Rotas de compartilhamento
app.use('/share', shareRoutes);

// Rota para todas as outras solicitações - serve o app React
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, '../dist/index.html'));
});

// Iniciar o servidor
app.listen(PORT, () => {
  console.log(`Servidor rodando na porta ${PORT}`);
});
