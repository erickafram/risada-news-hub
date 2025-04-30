const express = require('express');
const cors = require('cors');
const fetch = require('node-fetch');
const fs = require('fs');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3020;

// Habilitar CORS para todas as rotas
app.use(cors());

// Template HTML para compartilhamento
const shareTemplate = fs.readFileSync(path.join(__dirname, '../public/whatsapp-share.html'), 'utf8');

// Rota para compartilhamento de artigos
app.get('/share/:id', async (req, res) => {
  try {
    const { id } = req.params;
    
    // Buscar dados do artigo na API
    const response = await fetch(`http://167.172.152.174:3001/api/articles/${id}`);
    const article = await response.json();
    
    if (!article) {
      return res.status(404).send('Artigo não encontrado');
    }
    
    // Preparar dados para o template
    const title = article.title || 'Artigo | Meme PMW';
    const description = article.summary || 'Leia este artigo no Meme PMW';
    
    // Garantir que a URL da imagem seja absoluta
    let imageUrl = article.featured_image || 'https://memepmw.online/assets/logo-36miSCX6.png';
    if (imageUrl.startsWith('/')) {
      imageUrl = `https://memepmw.online${imageUrl}`;
    }
    if (imageUrl.includes('167.172.152.174:3001')) {
      imageUrl = imageUrl.replace('http://167.172.152.174:3001', 'https://memepmw.online');
    }
    
    // Criar slug para URL amigável
    const date = new Date(article.createdAt || new Date());
    const formattedDate = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`;
    
    const createSlug = (text) => {
      return text
        .toString()
        .normalize('NFD')
        .replace(/[\u0300-\u036f]/g, '')
        .toLowerCase()
        .trim()
        .replace(/\s+/g, '-')
        .replace(/[^\w-]+/g, '')
        .replace(/--+/g, '-')
        .substring(0, 100);
    };
    
    const slug = createSlug(article.title);
    const friendlyUrl = `http://memepmw.online/article/${slug}-${formattedDate}-${id}`;
    
    // Substituir placeholders no template
    let html = shareTemplate
      .replace(/__META_TITLE__/g, title)
      .replace(/__META_DESCRIPTION__/g, description)
      .replace(/__META_IMAGE__/g, imageUrl)
      .replace(/__META_URL__/g, friendlyUrl);
    
    // Enviar resposta HTML
    res.send(html);
  } catch (error) {
    console.error('Erro ao gerar página de compartilhamento:', error);
    res.status(500).send('Erro ao gerar página de compartilhamento');
  }
});

// Iniciar servidor
app.listen(PORT, () => {
  console.log(`Servidor de compartilhamento rodando na porta ${PORT}`);
});
