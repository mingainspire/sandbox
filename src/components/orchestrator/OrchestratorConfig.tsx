import React, { useState } from 'react';
import { useOrchestratorState } from './useOrchestratorState';
import { OrchestratorConfigProps } from './types';

const OrchestratorConfig: React.FC<OrchestratorConfigProps> = ({ onConfigChange }) => {
  const { state, dispatch } = useOrchestratorState();
  const [selectedModel, setSelectedModel] = useState(state.selectedModel);

  const handleModelChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const newModel = event.target.value;
    setSelectedModel(newModel);
    dispatch({ type: 'SET_MODEL', payload: newModel });
    onConfigChange({ selectedModel: newModel });
  };

  return (
    <div className="orchestrator-config">
      <h2>Orchestrator Configuration</h2>
      <div>
        <label htmlFor="model-select">Select Model:</label>
        <select 
          id="model-select" 
          value={selectedModel} 
          onChange={handleModelChange}
        >
          <option value="grok">Grok</option>
          <option value="mistral-7b-instruct">Mistral 7B Instruct</option>
          <option value="nous-hermes-13b">Nous Hermes 13B</option>
          <option value="openchat-7b">OpenChat 7B</option>
          <option value="mythomist-7b">MythoMist 7B</option>
          <option value="gpt-neo-2.7b">GPT-Neo 2.7B</option>
          <option value="gpt-j-6b">GPT-J 6B</option>
          <option value="bloom">BLOOM</option>
          <option value="llama-70b">Llama 70B</option>
          <option value="llama-405b">Llama 405B</option>
        </select>
      </div>
      <p>System Prompt: Act as a co-pilot, focusing on building systems, skills, tools, and agents. Provide helpful, solutions-focused, and patient assistance to no end.</p>
    </div>
  );
};

export default OrchestratorConfig;
