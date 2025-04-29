import React from 'react';
import { createRoot } from 'react-dom/client';
import App from './App.tsx';
import './index.css';

// Importando estilos de otimização
import './styles/responsive-text.css';
import './styles/image-optimization.css';

// Importando o otimizador de imagens
import initImageOptimization from './utils/imageOptimizer';

// Suprimir avisos de findDOMNode para o React Quill
// Isso é apenas um workaround temporário até que a biblioteca seja atualizada
const originalConsoleError = console.error;
console.error = function(msg: any, ...args: any[]) {
  if (typeof msg === 'string' && msg.includes('findDOMNode')) {
    return;
  }
  originalConsoleError(msg, ...args);
};

// Renderiza a aplicação
const root = createRoot(document.getElementById("root")!);
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
);

// Inicializa a otimização de imagens após o carregamento da aplicação
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initImageOptimization);
} else {
  // Se o DOM já estiver carregado, inicializa imediatamente
  setTimeout(initImageOptimization, 100);
}
