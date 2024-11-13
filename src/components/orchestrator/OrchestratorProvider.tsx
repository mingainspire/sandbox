import React, { createContext, useReducer, useContext, useEffect } from 'react';
import { OrchestratorState, OrchestratorAction } from './types';

const initialState: OrchestratorState = {
  selectedModel: 'gpt-3.5-turbo',
  agents: [],
  skills: [],
  systemStatus: '',
  tasks: [],
  isLoading: true
};

const OrchestratorContext = createContext<{
  state: OrchestratorState;
  dispatch: React.Dispatch<OrchestratorAction>;
} | undefined>(undefined);

const orchestratorReducer = (state: OrchestratorState, action: OrchestratorAction): OrchestratorState => {
  switch (action.type) {
    case 'SET_MODEL':
      return { ...state, selectedModel: action.payload };
    case 'UPDATE_SYSTEM_STATUS':
      return { ...state, systemStatus: action.payload };
    case 'CREATE_AGENT':
      return { ...state, agents: [...state.agents, action.payload] };
    case 'UPDATE_AGENT':
      return {
        ...state,
        agents: state.agents.map(agent => 
          agent.id === action.payload.agentId ? { ...agent, ...action.payload.updates } : agent
        ),
      };
    case 'DELETE_AGENT':
      return { ...state, agents: state.agents.filter(agent => agent.id !== action.payload) };
    case 'CREATE_TASK':
      return { ...state, tasks: [...state.tasks, action.payload] };
    case 'UPDATE_TASK':
      return {
        ...state,
        tasks: state.tasks.map(task => 
          task.id === action.payload.taskId ? { ...task, ...action.payload.updates } : task
        ),
      };
    case 'DELETE_TASK':
      return { ...state, tasks: state.tasks.filter(task => task.id !== action.payload) };
    case 'CREATE_SKILL':
      return { ...state, skills: [...state.skills, action.payload] };
    case 'SET_LOADING':
      return { ...state, isLoading: action.payload };
    default:
      return state;
  }
};

export const OrchestratorProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [state, dispatch] = useReducer(orchestratorReducer, initialState);

  useEffect(() => {
    // Simulate initial loading
    setTimeout(() => {
      dispatch({ type: 'SET_LOADING', payload: false });
    }, 2000);
  }, []);

  return (
    <OrchestratorContext.Provider value={{ state, dispatch }}>
      {children}
    </OrchestratorContext.Provider>
  );
};

export const useOrchestratorState = () => {
  const context = useContext(OrchestratorContext);
  if (context === undefined) {
    throw new Error('useOrchestratorState must be used within an OrchestratorProvider');
  }
  return context;
};
