import { API_URL } from '@/config/api';

// Interfaces para as configurações
export interface GeneralSettings {
  site_title: string;
  site_description: string;
  site_url: string;
  admin_email: string;
  language: string;
  timezone: string;
}

export interface ContentSettings {
  posts_per_page: string;
  enable_comments: string;
  moderate_comments: string;
  enable_rss: string;
  enable_social_sharing: string;
}

export interface AppearanceSettings {
  theme: string;
  primary_color: string;
  primary_text_color: string;
  content_text_color: string;
  logo_url: string;
  favicon_url: string;
  header_start_color: string;
  header_end_color: string;
  footer_start_color: string;
  footer_end_color: string;
}

export interface AllSettings {
  general: GeneralSettings;
  content: ContentSettings;
  appearance: AppearanceSettings;
  [key: string]: any;
}

// Função para obter todas as configurações
export const getAllSettings = async (): Promise<AllSettings> => {
  try {
    const token = localStorage.getItem('token');
    
    if (!token) {
      throw new Error('Usuário não autenticado');
    }
    
    const response = await fetch(`${API_URL}/settings`, {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });
    
    if (!response.ok) {
      throw new Error(`Erro ao buscar configurações: ${response.status}`);
    }
    
    return await response.json();
  } catch (error) {
    console.error('Erro ao buscar configurações:', error);
    throw error;
  }
};

// Função para obter configurações por grupo
export const getSettingsByGroup = async (group: string): Promise<any> => {
  try {
    const token = localStorage.getItem('token');
    
    if (!token) {
      throw new Error('Usuário não autenticado');
    }
    
    const response = await fetch(`${API_URL}/settings/group/${group}`, {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });
    
    if (!response.ok) {
      throw new Error(`Erro ao buscar configurações do grupo ${group}: ${response.status}`);
    }
    
    return await response.json();
  } catch (error) {
    console.error(`Erro ao buscar configurações do grupo ${group}:`, error);
    throw error;
  }
};

// Função para obter configurações públicas (aparência)
export const getPublicSettings = async (): Promise<any> => {
  try {
    const response = await fetch(`${API_URL}/settings/public/appearance`);
    
    if (!response.ok) {
      throw new Error(`Erro ao buscar configurações públicas: ${response.status}`);
    }
    
    return await response.json();
  } catch (error) {
    console.error('Erro ao buscar configurações públicas:', error);
    throw error;
  }
};

// Função para atualizar configurações
export const updateSettings = async (settings: Record<string, string>): Promise<any> => {
  try {
    const token = localStorage.getItem('token');
    
    if (!token) {
      throw new Error('Usuário não autenticado');
    }
    
    // Agrupar as configurações por grupo (aparência, geral, conteúdo)
    const groupedSettings: Record<string, Record<string, string>> = {};
    
    // Configurações gerais
    groupedSettings.general = {
      site_title: settings.site_title || '',
      site_description: settings.site_description || '',
      site_url: settings.site_url || '',
      admin_email: settings.admin_email || '',
      language: settings.language || '',
      timezone: settings.timezone || ''
    };
    
    // Configurações de conteúdo
    groupedSettings.content = {
      posts_per_page: settings.posts_per_page || '',
      enable_comments: settings.enable_comments || '',
      moderate_comments: settings.moderate_comments || '',
      enable_rss: settings.enable_rss || '',
      enable_social_sharing: settings.enable_social_sharing || ''
    };
    
    // Configurações de aparência
    groupedSettings.appearance = {
      theme: settings.theme || '',
      primary_color: settings.primary_color || '',
      primary_text_color: settings.primary_text_color || '',
      content_text_color: settings.content_text_color || '',
      logo_url: settings.logo_url || '',
      favicon_url: settings.favicon_url || '',
      header_start_color: settings.header_start_color || '',
      header_end_color: settings.header_end_color || '',
      footer_start_color: settings.footer_start_color || '',
      footer_end_color: settings.footer_end_color || ''
    };
    
    const response = await fetch(`${API_URL}/settings`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify({ settings: groupedSettings })
    });
    
    if (!response.ok) {
      throw new Error(`Erro ao atualizar configurações: ${response.status}`);
    }
    
    return await response.json();
  } catch (error) {
    console.error('Erro ao atualizar configurações:', error);
    throw error;
  }
};

// Função para restaurar configurações padrão
export const resetSettings = async (): Promise<any> => {
  try {
    const token = localStorage.getItem('token');
    
    if (!token) {
      throw new Error('Usuário não autenticado');
    }
    
    const response = await fetch(`${API_URL}/settings/reset`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });
    
    if (!response.ok) {
      throw new Error(`Erro ao restaurar configurações: ${response.status}`);
    }
    
    return await response.json();
  } catch (error) {
    console.error('Erro ao restaurar configurações:', error);
    throw error;
  }
};
