/**
 * Utilitário para otimização de imagens
 * Implementa lazy loading, blur-up e redimensionamento automático
 */

// Verifica se o IntersectionObserver é suportado
const hasIntersectionObserver = 'IntersectionObserver' in window;

/**
 * Inicializa o lazy loading para todas as imagens
 */
export function initLazyLoading() {
  if (!hasIntersectionObserver) {
    // Fallback para navegadores que não suportam IntersectionObserver
    loadAllImages();
    return;
  }

  const options = {
    root: null, // viewport
    rootMargin: '200px 0px', // carrega imagens 200px antes de entrarem na viewport
    threshold: 0.01 // 1% da imagem visível
  };

  const observer = new IntersectionObserver((entries, observer) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const img = entry.target;
        const src = img.getAttribute('data-src');
        
        if (src) {
          // Cria uma imagem temporária para pré-carregar
          const tempImg = new Image();
          
          tempImg.onload = () => {
            img.src = src;
            img.classList.remove('lazy-load');
            img.classList.add('lazy-loaded');
            
            // Encontra o container pai e adiciona a classe de carregado
            const container = img.closest('.image-container');
            if (container) {
              container.classList.add('image-loaded');
            }
          };
          
          tempImg.onerror = () => {
            // Em caso de erro, tenta carregar a imagem diretamente
            img.src = src;
            img.classList.remove('lazy-load');
            
            // Adiciona classe de erro para possível estilização
            img.classList.add('image-error');
          };
          
          tempImg.src = src;
        }
        
        // Para de observar a imagem após o carregamento
        observer.unobserve(img);
      }
    });
  }, options);

  // Seleciona todas as imagens com data-src
  document.querySelectorAll('img[data-src]').forEach(img => {
    img.classList.add('lazy-load');
    observer.observe(img);
  });
}

/**
 * Carrega todas as imagens imediatamente (fallback)
 */
function loadAllImages() {
  document.querySelectorAll('img[data-src]').forEach(img => {
    const src = img.getAttribute('data-src');
    if (src) {
      img.src = src;
      img.classList.remove('lazy-load');
      img.classList.add('lazy-loaded');
    }
  });
}

/**
 * Prepara as imagens para lazy loading
 * Deve ser chamado quando novas imagens são adicionadas ao DOM
 */
export function prepareImages() {
  document.querySelectorAll('img:not(.lazy-load):not(.lazy-loaded)').forEach(img => {
    // Pula imagens que já têm data-src
    if (img.hasAttribute('data-src')) return;
    
    // Salva o src original em data-src
    const originalSrc = img.getAttribute('src');
    if (originalSrc && !originalSrc.includes('data:image')) {
      img.setAttribute('data-src', originalSrc);
      
      // Define um placeholder ou mantém a imagem original para dispositivos que não suportam JS
      if (hasIntersectionObserver) {
        // Placeholder de baixa qualidade ou cor sólida
        img.src = 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1 1"%3E%3C/svg%3E';
        img.classList.add('lazy-load');
      }
    }
  });
  
  // Inicializa o lazy loading para as novas imagens
  initLazyLoading();
}

/**
 * Cria um container de imagem com efeito blur-up
 * @param {string} src - URL da imagem
 * @param {string} alt - Texto alternativo
 * @param {string} className - Classes adicionais
 * @param {number} width - Largura da imagem
 * @param {number} height - Altura da imagem
 * @returns {HTMLElement} - Elemento div contendo a imagem
 */
export function createOptimizedImageContainer(src, alt, className = '', width = 0, height = 0) {
  // Cria o container
  const container = document.createElement('div');
  container.className = `image-container ${className}`;
  
  // Gera um placeholder de baixa qualidade (10% do tamanho original)
  const placeholderWidth = Math.max(32, Math.floor(width * 0.1));
  const placeholderHeight = Math.max(32, Math.floor(height * 0.1));
  const placeholderSrc = generatePlaceholder(src, placeholderWidth, placeholderHeight);
  
  // Cria o placeholder
  const placeholder = document.createElement('img');
  placeholder.className = 'image-placeholder';
  placeholder.src = placeholderSrc || src;
  placeholder.alt = '';
  
  // Cria a imagem principal
  const img = document.createElement('img');
  img.className = 'image-full lazy-load';
  img.setAttribute('data-src', src);
  img.alt = alt || '';
  
  if (width) img.width = width;
  if (height) img.height = height;
  
  // Adiciona ao container
  container.appendChild(placeholder);
  container.appendChild(img);
  
  return container;
}

/**
 * Gera um placeholder de baixa qualidade
 * @param {string} src - URL da imagem original
 * @param {number} width - Largura do placeholder
 * @param {number} height - Altura do placeholder
 * @returns {string} - URL do placeholder
 */
function generatePlaceholder(src, width, height) {
  // Em um ambiente real, você poderia usar um serviço de redimensionamento de imagens
  // como Cloudinary, Imgix, etc.
  // Para este exemplo, retornamos a URL original
  return src;
}

/**
 * Otimiza todas as imagens na página
 */
export function optimizeAllImages() {
  // Prepara todas as imagens para lazy loading
  prepareImages();
  
  // Inicializa o lazy loading
  initLazyLoading();
  
  // Observa novas imagens adicionadas ao DOM
  if ('MutationObserver' in window) {
    const observer = new MutationObserver(mutations => {
      let hasNewImages = false;
      
      mutations.forEach(mutation => {
        if (mutation.type === 'childList') {
          mutation.addedNodes.forEach(node => {
            // Verifica se o nó é um elemento
            if (node.nodeType === 1) {
              // Verifica se o elemento é uma imagem
              if (node.tagName === 'IMG') {
                hasNewImages = true;
              } else if (node.querySelectorAll) {
                // Verifica se o elemento contém imagens
                const images = node.querySelectorAll('img');
                if (images.length > 0) {
                  hasNewImages = true;
                }
              }
            }
          });
        }
      });
      
      if (hasNewImages) {
        prepareImages();
      }
    });
    
    observer.observe(document.body, {
      childList: true,
      subtree: true
    });
  }
}

// Função para redimensionar imagens no servidor (simulação)
export function getResizedImageUrl(url, width) {
  // Em um ambiente real, você usaria um serviço como Cloudinary, Imgix, etc.
  // Exemplo: return `https://res.cloudinary.com/your-cloud/image/fetch/w_${width},q_auto,f_auto/${url}`;
  return url;
}

// Exporta uma função para inicializar tudo
export default function initImageOptimization() {
  // Aguarda o carregamento do DOM
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', optimizeAllImages);
  } else {
    optimizeAllImages();
  }
}
