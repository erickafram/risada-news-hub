/**
 * Utilitário para gerar meta tags para compartilhamento em redes sociais
 * Este script cria páginas HTML específicas para cada artigo com as meta tags corretas
 * para garantir que as imagens apareçam quando compartilhadas no WhatsApp e outras plataformas
 */

import fs from 'fs';
import path from 'path';

/**
 * Gera uma página HTML com meta tags para compartilhamento em redes sociais
 * @param {Object} article - O artigo para o qual gerar as meta tags
 * @param {string} article.id - ID do artigo
 * @param {string} article.title - Título do artigo
 * @param {string} article.summary - Resumo do artigo
 * @param {string} article.featuredImage - URL da imagem de destaque do artigo
 * @returns {string} - Caminho para o arquivo HTML gerado
 */
export const generateMetaTags = async (article) => {
  try {
    // Lê o template HTML
    const templatePath = path.resolve(process.cwd(), 'public', 'article-meta.html');
    let template = fs.readFileSync(templatePath, 'utf8');
    
    // Substitui os placeholders pelos dados do artigo
    const articleUrl = `${window.location.origin}/article/${article.id}`;
    const imageUrl = article.featuredImage.startsWith('http') 
      ? article.featuredImage 
      : `${window.location.origin}${article.featuredImage}`;
    
    // Corrige URLs com IP para usar o domínio
    const fixedImageUrl = imageUrl.includes('167.172.152.174:3001')
      ? imageUrl.replace('http://167.172.152.174:3001', 'https://memepmw.online')
      : imageUrl;
    
    template = template
      .replace(/__ARTICLE_TITLE__/g, article.title)
      .replace(/__ARTICLE_SUMMARY__/g, article.summary || '')
      .replace(/__ARTICLE_IMAGE__/g, fixedImageUrl)
      .replace(/__ARTICLE_URL__/g, articleUrl);
    
    // Cria o diretório se não existir
    const outputDir = path.resolve(process.cwd(), 'public', 'meta');
    if (!fs.existsSync(outputDir)) {
      fs.mkdirSync(outputDir, { recursive: true });
    }
    
    // Salva o arquivo HTML
    const outputPath = path.resolve(outputDir, `article-${article.id}.html`);
    fs.writeFileSync(outputPath, template);
    
    return `/meta/article-${article.id}.html`;
  } catch (error) {
    console.error('Erro ao gerar meta tags:', error);
    return null;
  }
};

/**
 * Modifica as funções de compartilhamento para usar a página de meta tags
 * @param {Object} article - O artigo a ser compartilhado
 * @returns {Object} - Funções de compartilhamento atualizadas
 */
export const getShareFunctions = (article) => {
  const metaUrl = `${window.location.origin}/meta/article-${article.id}.html`;
  const title = article.title;
  
  return {
    shareOnWhatsApp: () => {
      window.open(`https://api.whatsapp.com/send?text=${encodeURIComponent(title + ': ' + metaUrl)}`, '_blank');
    },
    shareOnFacebook: () => {
      window.open(`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(metaUrl)}&quote=${encodeURIComponent(title)}`, '_blank');
    },
    shareOnTwitter: () => {
      window.open(`https://twitter.com/intent/tweet?url=${encodeURIComponent(metaUrl)}&text=${encodeURIComponent(title)}`, '_blank');
    }
  };
};
