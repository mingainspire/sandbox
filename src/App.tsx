import React from 'react';
import { OrchestratorProvider } from './components/orchestrator/OrchestratorProvider';
import OrchestratorAPI from './components/orchestrator/OrchestratorAPI';
import OrchestratorConfig from './components/orchestrator/OrchestratorConfig';
import LoadingScreen from './components/LoadingScreen';
import { OrchestratorState } from './components/orchestrator/types';
import { useOrchestratorState } from './components/orchestrator/OrchestratorProvider';

const AppContent: React.FC = () => {
  const { state, dispatch } = useOrchestratorState();
  
  const handleConfigChange = (newState: OrchestratorState) => {
    console.log('Configuration changed:', newState);
  };

  if (state.isLoading) {
    return <LoadingScreen />;
  }

  return (
    <div className="App">
      <h1>Orchestrator</h1>
      <OrchestratorConfig onConfigChange={handleConfigChange} />
      <OrchestratorAPI onConfigChange={handleConfigChange} />
    </div>
  );
};

const App: React.FC = () => {
  return (
    <OrchestratorProvider>
      <AppContent />
    </OrchestratorProvider>
  );
};

export default App;
