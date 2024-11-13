import React, { createContext, useContext, useReducer } from 'react';
import { orchestratorReducer } from './orchestratorReducer';
import { OrchestratorState, TaskCreationParams, TaskUpdateParams, AgentCreationParams, Agent, OrchestratorAction } from './types';

interface OrchestratorContextValue {
  state: OrchestratorState;
  dispatch: React.Dispatch<OrchestratorAction>;
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
  const [state, dispatch] = useReducer(orchestratorReducer, orchestratorReducer(undefined, { type: 'UPDATE_SYSTEM_STATUS', payload: null }));

  const createAgent = (params: AgentCreationParams) => {
    dispatch({ type: 'CREATE_AGENT', payload: params });
  };

  const updateAgent = (agentId: string, updates: Partial<Agent>) => {
    dispatch({ type: 'UPDATE_AGENT', payload: { agentId, updates } });
  };

  const deleteAgent = (agentId: string) => {
    dispatch({ type: 'DELETE_AGENT', payload: agentId });
  };

  const createTask = (params: TaskCreationParams) => {
    dispatch({ type: 'CREATE_TASK', payload: params });
  };

  const updateTask = (taskId: string, updates: TaskUpdateParams) => {
    dispatch({ type: 'UPDATE_TASK', payload: { taskId, updates } });
  };

  const deleteTask = (taskId: string) => {
    dispatch({ type: 'DELETE_TASK', payload: taskId });
  };

  const getAgentsByType = (type: string) => {
    return state.agents.filter(agent => agent.type === type);
  };

  const getAgentById = (agentId: string) => {
    return state.agents.find(agent => agent.id === agentId);
  };

  const getActiveAgents = () => {
    return state.agents.filter(agent => agent.status === 'active');
  };

  const value = {
    state,
    dispatch,
    createAgent,
    updateAgent,
    deleteAgent,
    createTask,
    updateTask,
    deleteTask,
    agents: state.agents,
    getAgentsByType,
    getAgentById,
    getActiveAgents
  };

  return (
    <OrchestratorContext.Provider value={value}>
      {children}
    </OrchestratorContext.Provider>
  );
};
