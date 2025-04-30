const express = require('express');
const router = express.Router();
const fetch = require('node-fetch');

// Rota para compartilhamento de artigos com meta tags estáticas
router.get('/article/:id', async (req, res) => {
  try {
    const articleId = req.params.id;
    
    // Buscar artigo na API
    const apiUrl = process.env.VITE_API_URL || 'http://localhost:3001';
    const response = await fetch(`${apiUrl}/api/articles/${articleId}`);
    
    if (!response.ok) {
      throw new Error(`Erro ao buscar artigo: ${response.status}`);
    }
    
    const article = await response.json();
    
    // Preparar dados para meta tags
    const title = article.title || 'Artigo | Meme PMW';
    const summary = article.summary || 'Leia este artigo no Meme PMW';
    
    // Garantir que a URL da imagem seja absoluta e use HTTPS
    let image = article.featuredImage || 'https://memepmw.online/logo.png';
    if (image.includes('167.172.152.174:3001')) {
      image = image.replace('http://167.172.152.174:3001', 'https://memepmw.online');
    }
    if (image.startsWith('/')) {
      image = `https://memepmw.online${image}`;
    }
    if (image.startsWith('http://')) {
      image = image.replace('http://', 'https://');
    }
    
    // URL canônica do artigo
    const articleUrl = `https://memepmw.online/article/${articleId}`;
    
    // Gerar HTML com meta tags
    const html = `
      <!DOCTYPE html>
      <html lang="pt-BR">
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>${title}</title>
        
        <!-- Meta tags OpenGraph para Facebook, WhatsApp -->
        <meta property="og:title" content="${title}" />
        <meta property="og:description" content="${summary}" />
        <meta property="og:image" content="${image}" />
        <meta property="og:image:secure_url" content="${image}" />
        <meta property="og:image:width" content="1200" />
        <meta property="og:image:height" content="630" />
        <meta property="og:type" content="article" />
        <meta property="og:url" content="${articleUrl}" />
        <meta property="og:site_name" content="Meme PMW" />
        <meta property="og:locale" content="pt_BR" />
        
        <!-- Meta tags Twitter Card -->
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:site" content="@memepmw" />
        <meta name="twitter:title" content="${title}" />
        <meta name="twitter:description" content="${summary}" />
        <meta name="twitter:image" content="${image}" />
        
        <style>
          body {
            font-family: Arial, sans-serif;
            margin: 0;
            padding: 20px;
            display: flex;
            justify-content: center;
            align-items: center;
            min-height: 100vh;
            background-color: #f5f5f5;
            text-align: center;
          }
          .container {
            max-width: 800px;
            background: white;
            padding: 30px;
            border-radius: 10px;
            box-shadow: 0 4px 15px rgba(0, 0, 0, 0.1);
          }
          img {
            max-width: 100%;
            height: auto;
            border-radius: 8px;
            margin-bottom: 20px;
          }
          h1 {
            color: #333;
            margin-bottom: 15px;
          }
          p {
            color: #666;
            line-height: 1.6;
            margin-bottom: 25px;
          }
          .loading {
            margin-top: 20px;
            color: #888;
          }
        </style>
      </head>
      <body>
        <div class="container">
          <img src="${image}" alt="${title}">
          <h1>${title}</h1>
          <p>${summary || 'Clique para ler o artigo completo.'}</p>
          <p class="loading">Redirecionando para o artigo...</p>
        </div>
        
        <script>
          // Redireciona após 1 segundo para garantir que os crawlers capturem as meta tags
          setTimeout(() => {
            window.location.href = "${articleUrl}";
          }, 1000);
        </script>
      </body>
      </html>
    `;
    
    res.send(html);
  } catch (error) {
    console.error('Erro na rota de compartilhamento:', error);
    res.status(500).send(`
      <!DOCTYPE html>
      <html>
        <head>
          <title>Erro | Meme PMW</title>
          <meta http-equiv="refresh" content="3;url=https://memepmw.online" />
        </head>
        <body>
          <h1>Ocorreu um erro</h1>
          <p>Redirecionando para a página inicial...</p>
        </body>
      </html>
    `);
  }
});

module.exports = router;
