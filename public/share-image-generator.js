/**
 * Gerador de imagens para compartilhamento no WhatsApp
 * Este script cria uma imagem com o título do artigo sobreposto à imagem original
 */

// Função para gerar uma imagem de compartilhamento
function generateShareImage(title, imageUrl) {
  return new Promise((resolve, reject) => {
    // Cria um elemento canvas
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    
    // Define o tamanho do canvas (1200x630 é o tamanho recomendado para OpenGraph)
    canvas.width = 1200;
    canvas.height = 630;
    
    // Cria uma imagem para carregar a imagem do artigo
    const img = new Image();
    img.crossOrigin = 'anonymous'; // Permite carregar imagens de outros domínios
    
    // Manipula erros de carregamento da imagem
    img.onerror = () => {
      // Em caso de erro, usa uma cor de fundo
      ctx.fillStyle = '#6d28d9'; // Cor roxa
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      
      // Adiciona o logo
      const logo = new Image();
      logo.src = '/logo.png';
      logo.onload = () => {
        // Desenha o logo centralizado na parte superior
        const logoWidth = 200;
        const logoHeight = 200;
        ctx.drawImage(logo, (canvas.width - logoWidth) / 2, 50, logoWidth, logoHeight);
        
        // Adiciona o título
        addTitleToCanvas(ctx, title, canvas.width, canvas.height);
        
        // Retorna a URL da imagem gerada
        resolve(canvas.toDataURL('image/jpeg', 0.9));
      };
      
      logo.onerror = () => {
        // Se o logo não carregar, apenas adiciona o título
        addTitleToCanvas(ctx, title, canvas.width, canvas.height);
        resolve(canvas.toDataURL('image/jpeg', 0.9));
      };
    };
    
    // Quando a imagem carregar
    img.onload = () => {
      // Calcula as dimensões para manter a proporção da imagem
      const aspectRatio = img.width / img.height;
      let drawWidth = canvas.width;
      let drawHeight = canvas.width / aspectRatio;
      let drawX = 0;
      let drawY = 0;
      
      // Se a altura calculada for menor que a altura do canvas
      if (drawHeight < canvas.height) {
        drawHeight = canvas.height;
        drawWidth = canvas.height * aspectRatio;
        drawX = (canvas.width - drawWidth) / 2;
      } else {
        drawY = (canvas.height - drawHeight) / 2;
      }
      
      // Desenha a imagem no canvas
      ctx.drawImage(img, drawX, drawY, drawWidth, drawHeight);
      
      // Adiciona um overlay gradiente para melhorar a legibilidade do texto
      const gradient = ctx.createLinearGradient(0, 0, 0, canvas.height);
      gradient.addColorStop(0, 'rgba(0, 0, 0, 0.7)');
      gradient.addColorStop(0.5, 'rgba(0, 0, 0, 0.3)');
      gradient.addColorStop(1, 'rgba(0, 0, 0, 0.7)');
      ctx.fillStyle = gradient;
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      
      // Adiciona o título
      addTitleToCanvas(ctx, title, canvas.width, canvas.height);
      
      // Adiciona o logo do site
      const logo = new Image();
      logo.src = '/logo.png';
      logo.onload = () => {
        // Desenha o logo no canto inferior direito
        const logoSize = 100;
        ctx.drawImage(logo, canvas.width - logoSize - 30, canvas.height - logoSize - 30, logoSize, logoSize);
        
        // Retorna a URL da imagem gerada
        resolve(canvas.toDataURL('image/jpeg', 0.9));
      };
      
      logo.onerror = () => {
        // Se o logo não carregar, apenas retorna a imagem com o título
        resolve(canvas.toDataURL('image/jpeg', 0.9));
      };
    };
    
    // Define a URL da imagem
    img.src = imageUrl;
  });
}

// Função auxiliar para adicionar o título ao canvas
function addTitleToCanvas(ctx, title, canvasWidth, canvasHeight) {
  // Configura o estilo do texto
  ctx.fillStyle = 'white';
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  
  // Limita o título a um comprimento razoável
  let displayTitle = title;
  if (displayTitle.length > 100) {
    displayTitle = displayTitle.substring(0, 97) + '...';
  }
  
  // Quebra o título em linhas
  const words = displayTitle.split(' ');
  const lines = [];
  let currentLine = '';
  
  // Determina o tamanho da fonte com base no comprimento do título
  let fontSize = displayTitle.length > 50 ? 48 : 60;
  ctx.font = `bold ${fontSize}px Arial, sans-serif`;
  
  // Quebra o texto em linhas
  for (let i = 0; i < words.length; i++) {
    const testLine = currentLine + words[i] + ' ';
    const metrics = ctx.measureText(testLine);
    
    if (metrics.width > canvasWidth - 100 && i > 0) {
      lines.push(currentLine);
      currentLine = words[i] + ' ';
    } else {
      currentLine = testLine;
    }
  }
  lines.push(currentLine);
  
  // Ajusta o tamanho da fonte se houver muitas linhas
  if (lines.length > 3) {
    fontSize = 42;
    ctx.font = `bold ${fontSize}px Arial, sans-serif`;
  }
  
  // Calcula a altura total do texto
  const lineHeight = fontSize * 1.2;
  const textHeight = lineHeight * lines.length;
  let textY = (canvasHeight - textHeight) / 2;
  
  // Desenha cada linha de texto
  for (let i = 0; i < lines.length; i++) {
    ctx.fillText(lines[i], canvasWidth / 2, textY + i * lineHeight);
  }
  
  // Adiciona o nome do site na parte inferior
  ctx.font = '30px Arial, sans-serif';
  ctx.fillText('Meme PMW', canvasWidth / 2, canvasHeight - 50);
}

// Exporta a função para uso global
window.generateShareImage = generateShareImage;
