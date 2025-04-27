import React, { useEffect, useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { getPublicSettings } from '@/services/settingsService';

interface SiteTitleProps {
  pageTitle?: string;
  metaDescription?: string;
  ogImage?: string;
}

const SiteTitle: React.FC<SiteTitleProps> = ({ 
  pageTitle, 
  metaDescription,
  ogImage
}) => {
  const [siteTitle, setSiteTitle] = useState('Risada News Hub');
  const [siteDescription, setSiteDescription] = useState('Portal de notícias e entretenimento');
  
  useEffect(() => {
    const fetchSettings = async () => {
      try {
        const settings = await getPublicSettings();
        
        if (settings && settings.site_title) {
          setSiteTitle(settings.site_title);
        }
        
        if (settings && settings.site_description) {
          setSiteDescription(settings.site_description);
        }
      } catch (error) {
        console.error('Erro ao buscar configurações do site:', error);
      }
    };
    
    fetchSettings();
  }, []);
  
  // Formatar o título da página
  const fullTitle = pageTitle 
    ? `${pageTitle} | ${siteTitle}` 
    : siteTitle;
  
  // Usar a descrição da página ou a descrição padrão do site
  const description = metaDescription || siteDescription;
  
  return (
    <Helmet>
      <title>{fullTitle}</title>
      <meta name="description" content={description} />
      
      {/* Meta tags para compartilhamento em redes sociais */}
      <meta property="og:title" content={fullTitle} />
      <meta property="og:description" content={description} />
      {ogImage && <meta property="og:image" content={ogImage} />}
      
      {/* Meta tags para Twitter */}
      <meta name="twitter:title" content={fullTitle} />
      <meta name="twitter:description" content={description} />
      {ogImage && <meta name="twitter:image" content={ogImage} />}
    </Helmet>
  );
};

export default SiteTitle;
