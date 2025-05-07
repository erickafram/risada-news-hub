import { useState, useEffect } from 'react';

interface SiteSettings {
  siteTitle: string;
  siteDescription: string;
  siteUrl: string;
  adminEmail: string;
  language: string;
  timezone: string;
  logoUrl?: string;
}

export const useSiteSettings = () => {
  const [settings, setSettings] = useState<SiteSettings | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchSettings = async () => {
      try {
        setLoading(true);
        const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:3001';
        // Use the public endpoint that doesn't require authentication
        const response = await fetch(`${apiUrl}/api/settings/public/appearance`);
        
        if (!response.ok) {
          throw new Error('Falha ao carregar configurações do site');
        }
        
        const data = await response.json();
        
        // Transformar o array de configurações em um objeto
        const settingsObj: SiteSettings = {
          siteTitle: 'Meme PMW', // Valor padrão
          siteDescription: 'Portal de notícias e entretenimento',
          siteUrl: 'https://risadanews.com.br',
          adminEmail: 'admin@risadanews.com.br',
          language: 'pt-BR',
          timezone: 'America/Sao_Paulo',
        };
        
        // Preencher com os valores do servidor - data é um objeto agora, não um array
        if (data) {
          if (data.site_title) settingsObj.siteTitle = data.site_title;
          if (data.site_description) settingsObj.siteDescription = data.site_description;
          if (data.site_url) settingsObj.siteUrl = data.site_url;
          if (data.admin_email) settingsObj.adminEmail = data.admin_email;
          if (data.language) settingsObj.language = data.language;
          if (data.timezone) settingsObj.timezone = data.timezone;
          if (data.logo_url) settingsObj.logoUrl = data.logo_url;
        }
        
        setSettings(settingsObj);
      } catch (err) {
        console.error('Erro ao buscar configurações:', err);
        setError(err instanceof Error ? err.message : 'Erro desconhecido');
        
        // Usar valores padrão em caso de erro
        setSettings({
          siteTitle: 'Meme PMW',
          siteDescription: 'Portal de notícias e entretenimento',
          siteUrl: 'https://risadanews.com.br',
          adminEmail: 'admin@risadanews.com.br',
          language: 'pt-BR',
          timezone: 'America/Sao_Paulo',
        });
      } finally {
        setLoading(false);
      }
    };

    fetchSettings();
  }, []);

  return { settings, loading, error };
};
