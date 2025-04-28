import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Search, Menu, X, LogIn } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import logoImage from '@/assets/images/logo.png';
import { getPublicSettings } from '@/services/settingsService';
import { checkImageExists, getFullImageUrl } from '@/services/imageService';
import { cn } from '@/lib/utils';

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [logoUrl, setLogoUrl] = useState(logoImage);
  const [headerStartColor, setHeaderStartColor] = useState('#9333ea'); // purple-600 padrão
  const [headerEndColor, setHeaderEndColor] = useState('#db2777'); // pink-600 padrão
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();
  
  // Buscar configurações de aparência
  useEffect(() => {
    const fetchAppearanceSettings = async () => {
      try {
        const settings = await getPublicSettings();
        
        // Configurar logo
        if (settings && settings.logo_url) {
          // Verificar se a imagem existe antes de definir a URL
          const imageExists = await checkImageExists(settings.logo_url);
          
          if (imageExists) {
            // Obter a URL completa da imagem
            const fullImageUrl = getFullImageUrl(settings.logo_url);
            console.log('Logomarca encontrada:', fullImageUrl);
            setLogoUrl(fullImageUrl);
          } else {
            console.warn('Logomarca não encontrada:', settings.logo_url);
            // Manter a imagem padrão
          }
        }
        
        // Configurar cores do header
        if (settings && settings.header_start_color) {
          setHeaderStartColor(settings.header_start_color);
        }
        
        if (settings && settings.header_end_color) {
          setHeaderEndColor(settings.header_end_color);
        }
        
        // Configurar cor primária
        if (settings && settings.primary_color) {
          document.documentElement.style.setProperty('--primary', settings.primary_color);
        }
      } catch (error) {
        console.error('Erro ao buscar configurações de aparência:', error);
      }
    };
    
    fetchAppearanceSettings();
  }, []);

  const toggleMenu = () => setIsMenuOpen(!isMenuOpen);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Searching for:', searchQuery);
    
    if (searchQuery.trim()) {
      // Redirecionar para a página inicial com o parâmetro de pesquisa
      navigate(`/?search=${encodeURIComponent(searchQuery.trim())}`);
      setIsMenuOpen(false); // Fechar o menu móvel se estiver aberto
    }
  };

  const categories = [
    { name: 'Entretenimento', path: '/category/entretenimento' },
    { name: 'Jogos', path: '/category/jogos' },
    { name: 'Filmes', path: '/category/filmes' },
    { name: 'Música', path: '/category/musica' },
    { name: 'Celebridades', path: '/category/celebridades' },
    { name: 'Estilo de Vida', path: '/category/estilo-de-vida' },
  ];

  return (
    <header 
      className={cn("shadow-lg fixed top-0 left-0 right-0 z-50 header-gradient")} 
    >
      <div className="container mx-auto px-4 py-0">
        <div className="flex items-center justify-between">
          <Link to="/" className="hover:scale-105 transition-transform flex items-center">
            <img 
              src={logoUrl} 
              alt="Risada News Hub Logo" 
              className="h-16 site-logo" 
              onError={(e) => {
                const target = e.target as HTMLImageElement;
                target.onerror = null;
                target.src = logoImage; // Fallback para a imagem padrão
                console.error('Erro ao carregar a logomarca:', logoUrl);
              }}
            />
          </Link>

          <nav className="hidden md:flex items-center space-x-8">
            {categories.map((category) => (
              <Link
                key={category.name}
                to={category.path}
                className="text-white hover:text-pink-200 transition-colors font-medium"
              >
                {category.name}
              </Link>
            ))}
          </nav>

          <div className="hidden md:flex items-center space-x-4">
            <form onSubmit={handleSearch} className="relative">
              <Input
                type="search"
                placeholder="Pesquisar diversão..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-64 bg-white/10 text-white placeholder:text-pink-100 border-none focus:ring-pink-400"
              />
              <Button type="submit" variant="ghost" size="icon" className="absolute right-0 top-0 text-white">
                <Search className="h-5 w-5" />
              </Button>
            </form>
            <Button
              variant="ghost"
              size="icon"
              className="text-white"
              onClick={() => navigate('/login')}
            >
              <LogIn className="h-5 w-5" />
            </Button>
          </div>

          <Button
            variant="ghost"
            size="icon"
            className="md:hidden text-white"
            onClick={toggleMenu}
          >
            {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </Button>
        </div>

        {isMenuOpen && (
          <div className="md:hidden mt-4 py-3 border-t border-pink-400/30 animate-fade-in">
            <form onSubmit={handleSearch} className="mb-4">
              <div className="flex">
                <Input
                  type="search"
                  placeholder="Pesquisar diversão..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="bg-white/10 text-white placeholder:text-pink-100 border-none"
                />
                <Button type="submit" variant="ghost" size="icon" className="ml-1 text-white">
                  <Search className="h-5 w-5" />
                </Button>
              </div>
            </form>
            <nav className="flex flex-col space-y-3">
              {categories.map((category) => (
                <Link
                  key={category.name}
                  to={category.path}
                  className="text-white hover:text-pink-200 transition-colors py-1"
                  onClick={() => setIsMenuOpen(false)}
                >
                  {category.name}
                </Link>
              ))}
              
              <Link
                to="/login"
                className="text-white hover:text-pink-200 transition-colors py-1 flex items-center gap-2"
                onClick={() => setIsMenuOpen(false)}
              >
                <LogIn className="h-5 w-5" />
                Entrar
              </Link>
            </nav>
          </div>
        )}
      </div>
    </header>
  );
};

export default Header;
