import React, { createContext, useContext, useEffect, useState } from 'react';
import { getPublicSettings } from '@/services/settingsService';

interface ThemeContextType {
  primaryColor: string;
  primaryTextColor: string;
  contentTextColor: string;
  headerStartColor: string;
  headerEndColor: string;
  footerStartColor: string;
  footerEndColor: string;
  isDarkTheme: boolean;
}

const defaultTheme: ThemeContextType = {
  primaryColor: '#9333ea', // Cor roxa padrão
  primaryTextColor: '#ffffff', // Cor branca padrão para texto em botões
  contentTextColor: '#1f2937', // Cor cinza escura padrão para texto de conteúdo
  headerStartColor: '#9333ea',
  headerEndColor: '#db2777',
  footerStartColor: '#9333ea',
  footerEndColor: '#db2777',
  isDarkTheme: false
};

const ThemeContext = createContext<ThemeContextType>(defaultTheme);

export const useTheme = () => useContext(ThemeContext);

export const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [theme, setTheme] = useState<ThemeContextType>(defaultTheme);

  useEffect(() => {
    const fetchThemeSettings = async () => {
      try {
        const settings = await getPublicSettings();
        
        if (settings) {
          setTheme({
            primaryColor: settings.primary_color || defaultTheme.primaryColor,
            primaryTextColor: settings.primary_text_color || defaultTheme.primaryTextColor,
            contentTextColor: settings.content_text_color || defaultTheme.contentTextColor,
            headerStartColor: settings.header_start_color || defaultTheme.headerStartColor,
            headerEndColor: settings.header_end_color || defaultTheme.headerEndColor,
            footerStartColor: settings.footer_start_color || defaultTheme.footerStartColor,
            footerEndColor: settings.footer_end_color || defaultTheme.footerEndColor,
            isDarkTheme: settings.theme === 'dark'
          });
        }
      } catch (error) {
        console.error('Erro ao buscar configurações de tema:', error);
      }
    };

    fetchThemeSettings();
  }, []);

  // Aplicar as cores CSS personalizadas
  useEffect(() => {
    const root = document.documentElement;
    
    // Definir variáveis CSS para as cores
    // Aplicar as cores diretamente no estilo para garantir que sejam aplicadas
    const style = document.createElement('style');
    style.innerHTML = `
      :root {
        --primary: ${theme.primaryColor};
        --primary-foreground: ${theme.primaryTextColor};
        --content-text: ${theme.contentTextColor};
        --header-start-color: ${theme.headerStartColor};
        --header-end-color: ${theme.headerEndColor};
        --footer-start-color: ${theme.footerStartColor};
        --footer-end-color: ${theme.footerEndColor};
      }
      
      .bg-primary {
        background-color: ${theme.primaryColor} !important;
      }
      
      .text-primary {
        color: ${theme.primaryColor} !important;
      }
      
      .text-primary-foreground {
        color: ${theme.primaryTextColor} !important;
      }
      
      /* Aplicar cor de texto ao conteúdo */
      .content-text {
        color: ${theme.contentTextColor} !important;
      }
      
      /* Aplicar cor de texto às categorias e notícias */
      .news-card .title {
        color: ${theme.contentTextColor} !important;
      }
      
      .news-card .excerpt {
        color: ${adjustColorBrightness(theme.contentTextColor, 20)} !important;
      }
      
      /* Corrigir estilo das abas */
      [data-state="active"].radix-tabs-trigger {
        background-color: ${theme.primaryColor} !important;
        color: ${theme.primaryTextColor} !important;
        border-color: ${theme.primaryColor} !important;
      }
      
      .tabs-list {
        border-bottom: 1px solid #e5e7eb;
      }
      
      /* Corrigir estilo do switch */
      [data-state="checked"].switch-root {
        background-color: ${theme.primaryColor} !important;
      }
      
      [data-state="checked"] .switch-thumb {
        background-color: white !important;
      }
      
      .hover\:bg-primary\/90:hover {
        background-color: ${adjustColorBrightness(theme.primaryColor, -10)} !important;
      }
      
      .border-primary {
        border-color: ${theme.primaryColor} !important;
      }
      
      /* Aplicar gradientes ao cabeçalho e rodapé */
      .header-gradient {
        background: linear-gradient(to right, ${theme.headerStartColor}, ${theme.headerEndColor}) !important;
      }
      
      .footer-gradient {
        background: linear-gradient(to right, ${theme.footerStartColor}, ${theme.footerEndColor}) !important;
      }
    `;
    
    // Remover estilos anteriores
    const oldStyle = document.getElementById('theme-style');
    if (oldStyle) {
      oldStyle.remove();
    }
    
    // Adicionar o novo estilo
    style.id = 'theme-style';
    document.head.appendChild(style);
    
    // Aplicar tema claro/escuro
    if (theme.isDarkTheme) {
      document.body.classList.add('dark-theme');
    } else {
      document.body.classList.remove('dark-theme');
    }
  }, [theme]);

  return (
    <ThemeContext.Provider value={theme}>
      {children}
    </ThemeContext.Provider>
  );
};

// Função para ajustar o brilho de uma cor (para hover)
function adjustColorBrightness(hex: string, percent: number): string {
  // Remover o # se existir
  hex = hex.replace(/^#/, '');
  
  // Converter para RGB
  let r = parseInt(hex.substring(0, 2), 16);
  let g = parseInt(hex.substring(2, 4), 16);
  let b = parseInt(hex.substring(4, 6), 16);
  
  // Ajustar o brilho
  r = Math.max(0, Math.min(255, r + Math.round(percent * 2.55)));
  g = Math.max(0, Math.min(255, g + Math.round(percent * 2.55)));
  b = Math.max(0, Math.min(255, b + Math.round(percent * 2.55)));
  
  // Converter de volta para hex
  return `#${((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1)}`;
}

// Função para determinar se o texto deve ser claro ou escuro com base na cor de fundo
function getContrastColor(hexColor: string): string {
  // Remover o # se existir
  const hex = hexColor.replace(/^#/, '');
  
  // Converter para RGB
  const r = parseInt(hex.substring(0, 2), 16);
  const g = parseInt(hex.substring(2, 4), 16);
  const b = parseInt(hex.substring(4, 6), 16);
  
  // Calcular a luminosidade (fórmula YIQ)
  const yiq = ((r * 299) + (g * 587) + (b * 114)) / 1000;
  
  // Retornar branco ou preto dependendo da luminosidade
  return yiq >= 128 ? '#000000' : '#ffffff';
}
