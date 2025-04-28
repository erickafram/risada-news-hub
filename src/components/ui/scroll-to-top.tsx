import React, { useState, useEffect } from 'react';
import { ArrowUp } from 'lucide-react';

interface ScrollToTopProps {
  scrollThreshold?: number;
  className?: string;
}

const ScrollToTop: React.FC<ScrollToTopProps> = ({ 
  scrollThreshold = 300,
  className = ''
}) => {
  const [isVisible, setIsVisible] = useState(false);

  // Função para verificar a posição do scroll
  const checkScrollPosition = () => {
    if (window.pageYOffset > scrollThreshold) {
      setIsVisible(true);
    } else {
      setIsVisible(false);
    }
  };

  // Função para rolar para o topo
  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  };

  useEffect(() => {
    window.addEventListener('scroll', checkScrollPosition);
    
    // Verificar posição inicial
    checkScrollPosition();
    
    // Limpeza do event listener
    return () => {
      window.removeEventListener('scroll', checkScrollPosition);
    };
  }, [scrollThreshold]);

  return (
    <button
      onClick={scrollToTop}
      className={`fixed bottom-6 right-6 p-3 rounded-full shadow-lg transition-all duration-300 transform ${
        isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10 pointer-events-none'
      } bg-gradient-to-r from-purple-600 to-pink-500 hover:from-purple-700 hover:to-pink-600 text-white z-50 ${className}`}
      aria-label="Voltar ao topo"
    >
      <ArrowUp className="h-5 w-5" />
    </button>
  );
};

export default ScrollToTop;
