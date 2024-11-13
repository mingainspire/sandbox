import React, { createContext, useContext } from 'react';
import { useOrchestratorState } from './useOrchestratorState';
import { OrchestratorState, TaskCreationParams, TaskUpdateParams, AgentCreationParams, Agent } from './types';

interface OrchestratorContextValue {
  state: OrchestratorState;
  createAgent: (params: AgentCreationParams) => void;
  updateAgent: (agentId: string, updates: Partial<Agent>) => void;
  deleteAgent: (agentId: string) => void;
  createTask: (params: TaskCreationParams) => void;
  updateTask: (taskId: string, updates: TaskUpdateParams) => void;
  deleteTask: (taskId: string) => void;
  agents: Agent[];
  getAgentsByType: (type: string) => Agent[];
  getAgentById: (agentId: string) => Agent | undefined;
  getActiveAgents: () => Agent[];
}

const OrchestratorContext = createContext<OrchestratorContextValue | undefined>(undefined);

export const useOrchestrator = () => {
  const context = useContext(OrchestratorContext);
  if (!context) {
    throw new Error('useOrchestrator must be used within an OrchestratorProvider');
  }
  return context;
};

export const OrchestratorProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const orchestratorState = useOrchestratorState();

  return (
    <OrchestratorContext.Provider value={orchestratorState}>
      {children}
    </OrchestratorContext.Provider>
  );
};
