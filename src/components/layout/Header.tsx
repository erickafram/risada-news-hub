
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Search, Menu, X } from 'lucide-react';

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  const toggleMenu = () => setIsMenuOpen(!isMenuOpen);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Searching for:', searchQuery);
    // In a real app, you would implement search functionality here
  };

  const categories = [
    { name: 'Top Stories', path: '/' },
    { name: 'Technology', path: '/category/technology' },
    { name: 'Business', path: '/category/business' },
    { name: 'Politics', path: '/category/politics' },
    { name: 'Health', path: '/category/health' },
    { name: 'Entertainment', path: '/category/entertainment' },
    { name: 'Sports', path: '/category/sports' },
  ];

  return (
    <header className="bg-risada shadow-md">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <div className="flex items-center">
            <Link to="/" className="text-2xl font-bold text-white">
              Risada<span className="text-risada-accent">News</span>
            </Link>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-6">
            {categories.map((category) => (
              <Link
                key={category.name}
                to={category.path}
                className="text-gray-200 hover:text-risada-accent transition-colors"
              >
                {category.name}
              </Link>
            ))}
          </nav>

          {/* Search Form */}
          <div className="hidden md:block">
            <form onSubmit={handleSearch} className="flex">
              <Input
                type="search"
                placeholder="Search news..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-64 bg-white/10 text-white placeholder:text-gray-300 border-none"
              />
              <Button type="submit" variant="ghost" size="icon" className="ml-1 text-white">
                <Search className="h-5 w-5" />
              </Button>
            </form>
          </div>

          {/* Mobile Menu Button */}
          <Button
            variant="ghost"
            size="icon"
            className="md:hidden text-white"
            onClick={toggleMenu}
          >
            {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </Button>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="md:hidden mt-4 py-3 border-t border-gray-700 animate-fade-in">
            <form onSubmit={handleSearch} className="mb-4">
              <div className="flex">
                <Input
                  type="search"
                  placeholder="Search news..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="bg-white/10 text-white placeholder:text-gray-300 border-none"
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
                  className="text-gray-200 hover:text-risada-accent transition-colors py-1"
                  onClick={() => setIsMenuOpen(false)}
                >
                  {category.name}
                </Link>
              ))}
            </nav>
          </div>
        )}
      </div>
    </header>
  );
};

export default Header;
