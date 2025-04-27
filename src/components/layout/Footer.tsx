
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { getMenuPages, MenuPage } from '@/services/pageService';
import { getPublicSettings } from '@/services/settingsService';
import { cn } from '@/lib/utils';

const Footer = () => {
  const [menuPages, setMenuPages] = useState<MenuPage[]>([]);
  const [footerStartColor, setFooterStartColor] = useState('#9333ea'); // purple-600 padrão
  const [footerEndColor, setFooterEndColor] = useState('#db2777'); // pink-600 padrão
  
  // Buscar configurações e páginas do menu
  useEffect(() => {
    const fetchMenuPages = async () => {
      try {
        const pages = await getMenuPages();
        setMenuPages(pages);
      } catch (error) {
        console.error('Erro ao buscar páginas do menu:', error);
      }
    };
    
    const fetchAppearanceSettings = async () => {
      try {
        const settings = await getPublicSettings();
        
        // Configurar cores do footer
        if (settings && settings.footer_start_color) {
          setFooterStartColor(settings.footer_start_color);
        }
        
        if (settings && settings.footer_end_color) {
          setFooterEndColor(settings.footer_end_color);
        }
      } catch (error) {
        console.error('Erro ao buscar configurações de aparência:', error);
      }
    };
    
    fetchMenuPages();
    fetchAppearanceSettings();
  }, []);
  return (
    <footer className={cn("text-white py-8 footer-gradient")}>
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div>
            <Link to="/" className="text-2xl font-bold">
              <span className="text-white">memp</span><span className="text-pink-300">mw</span>
            </Link>
            <p className="mt-3 text-pink-100">
              Sua dose diária de entretenimento e diversão!
            </p>
          </div>

          <div>
            <h3 className="text-lg font-semibold mb-4">Categorias</h3>
            <div className="grid grid-cols-2 gap-2">
              <Link to="/category/entertainment" className="text-pink-100 hover:text-white transition-colors">Entretenimento</Link>
              <Link to="/category/gaming" className="text-pink-100 hover:text-white transition-colors">Jogos</Link>
              <Link to="/category/movies" className="text-pink-100 hover:text-white transition-colors">Filmes</Link>
              <Link to="/category/music" className="text-pink-100 hover:text-white transition-colors">Música</Link>
              <Link to="/category/celebrity" className="text-pink-100 hover:text-white transition-colors">Celebridades</Link>
              <Link to="/category/lifestyle" className="text-pink-100 hover:text-white transition-colors">Estilo de Vida</Link>
            </div>
          </div>

          <div>
            <h3 className="text-lg font-semibold mb-4">Páginas</h3>
            <div className="space-y-2">
              {menuPages.length > 0 ? (
                menuPages.map((page) => (
                  <Link 
                    key={`footer-page-${page.id}`}
                    to={`/${page.slug}`} 
                    className="block text-pink-100 hover:text-white transition-colors"
                  >
                    {page.title}
                  </Link>
                ))
              ) : (
                <>
                  <Link to="/about" className="block text-pink-100 hover:text-white transition-colors">Sobre Nós</Link>
                  <Link to="/contact" className="block text-pink-100 hover:text-white transition-colors">Contato</Link>
                  <Link to="/privacy" className="block text-pink-100 hover:text-white transition-colors">Política de Privacidade</Link>
                </>
              )}
            </div>
          </div>
        </div>

        <div className="border-t border-pink-400/30 mt-8 pt-6 text-center text-pink-100">
          <p>© {new Date().getFullYear()} memepmw. Todos os direitos reservados.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
