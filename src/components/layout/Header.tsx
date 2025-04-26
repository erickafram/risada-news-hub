
import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Search, Menu, X, LogIn } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import logoImage from '@/assets/images/logo.png';

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();

  const toggleMenu = () => setIsMenuOpen(!isMenuOpen);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Searching for:', searchQuery);
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
    <header className="bg-gradient-to-r from-purple-600 to-pink-600 shadow-lg fixed top-0 left-0 right-0 z-50">
      <div className="container mx-auto px-4 py-0">
        <div className="flex items-center justify-between">
          <Link to="/" className="hover:scale-105 transition-transform flex items-center">
            <img src={logoImage} alt="Risada News Hub Logo" className="h-16" />
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
