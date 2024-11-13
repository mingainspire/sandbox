import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import AppWithSkills from './AppWithSkills';
import './index.css';
import { IntegrationProvider } from './components/providers/IntegrationProvider';
import { OrchestratorProvider } from './components/orchestrator/OrchestratorProvider';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <OrchestratorProvider>
      <IntegrationProvider>
        <AppWithSkills />
      </IntegrationProvider>
    </OrchestratorProvider>
  </StrictMode>
);
