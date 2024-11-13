import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import AppWithSkills from './AppWithSkills';
import './index.css';

console.log('Initializing Skills Evolution System...');

const container = document.getElementById('root');
if (!container) {
  throw new Error('Failed to find root element');
}

const root = createRoot(container);

root.render(
  <StrictMode>
    <AppWithSkills />
  </StrictMode>
);
