import { API_URL } from '@/config/api';

// Interfaces para as páginas
export interface Page {
  id: number;
  title: string;
  slug: string;
  content: string;
  metaTitle?: string;
  metaDescription?: string;
  featuredImage?: string;
  status: 'draft' | 'published';
  showInMenu: boolean;
  menuOrder: number;
  authorId?: number;
  author?: {
    id: number;
    fullName: string;
    email?: string;
  };
  createdAt: string;
  updatedAt: string;
}

export interface PageListResponse {
  pages: Page[];
  pagination: {
    page: number;
    limit: number;
    totalItems: number;
    totalPages: number;
    hasNext: boolean;
    hasPrev: boolean;
  };
}

export interface MenuPage {
  id: number;
  title: string;
  slug: string;
  menuOrder: number;
}

// Função para obter todas as páginas (com paginação e filtros)
export const getAllPages = async (
  page = 1,
  limit = 10,
  status?: string,
  search?: string
): Promise<PageListResponse> => {
  try {
    const token = localStorage.getItem('token');
    
    if (!token) {
      throw new Error('Usuário não autenticado');
    }
    
    let url = `${API_URL}/pages?page=${page}&limit=${limit}`;
    
    if (status) {
      url += `&status=${status}`;
    }
    
    if (search) {
      url += `&search=${encodeURIComponent(search)}`;
    }
    
    const response = await fetch(url, {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });
    
    if (!response.ok) {
      throw new Error(`Erro ao buscar páginas: ${response.status}`);
    }
    
    return await response.json();
  } catch (error) {
    console.error('Erro ao buscar páginas:', error);
    throw error;
  }
};

// Função para obter uma página pelo ID
export const getPageById = async (id: number): Promise<Page> => {
  try {
    const token = localStorage.getItem('token');
    
    if (!token) {
      throw new Error('Usuário não autenticado');
    }
    
    const response = await fetch(`${API_URL}/pages/${id}`, {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });
    
    if (!response.ok) {
      throw new Error(`Erro ao buscar página: ${response.status}`);
    }
    
    return await response.json();
  } catch (error) {
    console.error(`Erro ao buscar página com ID ${id}:`, error);
    throw error;
  }
};

// Função para obter uma página pelo slug (para exibição pública)
export const getPageBySlug = async (slug: string): Promise<Page> => {
  try {
    const response = await fetch(`${API_URL}/pages/slug/${slug}`);
    
    if (!response.ok) {
      throw new Error(`Erro ao buscar página: ${response.status}`);
    }
    
    return await response.json();
  } catch (error) {
    console.error(`Erro ao buscar página com slug ${slug}:`, error);
    throw error;
  }
};

// Função para obter páginas para o menu
export const getMenuPages = async (): Promise<MenuPage[]> => {
  try {
    const response = await fetch(`${API_URL}/pages/menu`);
    
    if (!response.ok) {
      throw new Error(`Erro ao buscar páginas do menu: ${response.status}`);
    }
    
    return await response.json();
  } catch (error) {
    console.error('Erro ao buscar páginas do menu:', error);
    throw error;
  }
};

// Função para criar uma nova página
export const createPage = async (pageData: Partial<Page>): Promise<Page> => {
  try {
    const token = localStorage.getItem('token');
    
    if (!token) {
      throw new Error('Usuário não autenticado');
    }
    
    const response = await fetch(`${API_URL}/pages`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify(pageData)
    });
    
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || `Erro ao criar página: ${response.status}`);
    }
    
    const data = await response.json();
    return data.page;
  } catch (error) {
    console.error('Erro ao criar página:', error);
    throw error;
  }
};

// Função para atualizar uma página existente
export const updatePage = async (id: number, pageData: Partial<Page>): Promise<Page> => {
  try {
    const token = localStorage.getItem('token');
    
    if (!token) {
      throw new Error('Usuário não autenticado');
    }
    
    const response = await fetch(`${API_URL}/pages/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify(pageData)
    });
    
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || `Erro ao atualizar página: ${response.status}`);
    }
    
    const data = await response.json();
    return data.page;
  } catch (error) {
    console.error(`Erro ao atualizar página com ID ${id}:`, error);
    throw error;
  }
};

// Função para excluir uma página
export const deletePage = async (id: number): Promise<void> => {
  try {
    const token = localStorage.getItem('token');
    
    if (!token) {
      throw new Error('Usuário não autenticado');
    }
    
    const response = await fetch(`${API_URL}/pages/${id}`, {
      method: 'DELETE',
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });
    
    if (!response.ok) {
      throw new Error(`Erro ao excluir página: ${response.status}`);
    }
  } catch (error) {
    console.error(`Erro ao excluir página com ID ${id}:`, error);
    throw error;
  }
};
