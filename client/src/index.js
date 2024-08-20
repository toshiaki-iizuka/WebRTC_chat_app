import React from 'react';
import { createRoot } from 'react-dom/client';

import App from './App';
import { ContextProvider } from './SocketContext';
import './styles.css';

createRoot(document.getElementById('root')).render(
  <ContextProvider>
    <App />
  </ContextProvider>,
);
