import { API_URL } from '@/config/api';

// Função para fazer upload de um arquivo
export const uploadFile = async (file: File): Promise<string> => {
  try {
    const token = localStorage.getItem('token');
    
    if (!token) {
      throw new Error('Usuário não autenticado');
    }
    
    const formData = new FormData();
    formData.append('image', file); // Alterado de 'file' para 'image' para corresponder ao backend
    
    const response = await fetch(`${API_URL}/upload/image`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`
      },
      body: formData
    });
    
    if (!response.ok) {
      throw new Error(`Erro ao fazer upload do arquivo: ${response.status}`);
    }
    
    const data = await response.json();
    return data.imageUrl; // Alterado de fileUrl para imageUrl para corresponder ao backend
  } catch (error) {
    console.error('Erro ao fazer upload do arquivo:', error);
    throw error;
  }
};

// Função para fazer upload de uma imagem
export const uploadImage = async (file: File): Promise<string> => {
  // Validar se o arquivo é uma imagem
  if (!file.type.startsWith('image/')) {
    throw new Error('O arquivo selecionado não é uma imagem');
  }
  
  return uploadFile(file);
};
