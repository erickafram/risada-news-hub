import React from 'react';
import { createRoot } from 'react-dom/client';
import App from './App.tsx';
import './index.css';

// Suprimir avisos de findDOMNode para o React Quill
// Isso é apenas um workaround temporário até que a biblioteca seja atualizada
const originalConsoleError = console.error;
console.error = function(msg: any, ...args: any[]) {
  if (typeof msg === 'string' && msg.includes('findDOMNode')) {
    return;
  }
  originalConsoleError(msg, ...args);
};

createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
);
