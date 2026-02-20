
import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import { mockDb } from './services/mockDb';

// Inicializa o banco de dados antes de qualquer renderização
mockDb.init();

const rootElement = document.getElementById('root');
if (!rootElement) {
  throw new Error("Could not find root element to mount to");
}

const root = ReactDOM.createRoot(rootElement);
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
