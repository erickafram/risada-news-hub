import { API_URL } from '@/config/api';

// Função para verificar se uma imagem existe
export const checkImageExists = async (imageUrl: string): Promise<boolean> => {
  try {
    // Se a URL for absoluta (começa com http:// ou https://)
    if (imageUrl.startsWith('http')) {
      const response = await fetch(imageUrl, { method: 'HEAD' });
      return response.ok;
    }
    
    // Se for uma URL relativa, verificar no backend
    const response = await fetch(`${API_URL}/check-file?path=${encodeURIComponent(imageUrl)}`);
    const data = await response.json();
    return data.exists;
  } catch (error) {
    console.error('Erro ao verificar se a imagem existe:', error);
    return false;
  }
};

// Função para obter a URL completa de uma imagem
export const getFullImageUrl = (imageUrl: string): string => {
  if (imageUrl.startsWith('http')) {
    return imageUrl;
  }
  
  // Se for uma URL relativa, adicionar o domínio do backend
  return `${API_URL.replace('/api', '')}${imageUrl}`;
};
