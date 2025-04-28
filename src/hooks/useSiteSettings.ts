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
        
        // Preencher com os valores do servidor
        data.forEach((setting: { key: string; value: string }) => {
          if (setting.key === 'site_title') settingsObj.siteTitle = setting.value;
          if (setting.key === 'site_description') settingsObj.siteDescription = setting.value;
          if (setting.key === 'site_url') settingsObj.siteUrl = setting.value;
          if (setting.key === 'admin_email') settingsObj.adminEmail = setting.value;
          if (setting.key === 'language') settingsObj.language = setting.value;
          if (setting.key === 'timezone') settingsObj.timezone = setting.value;
          if (setting.key === 'logo_url') settingsObj.logoUrl = setting.value;
        });
        
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
