export interface OrchestratorState {
  selectedModel: string;
  agents: Agent[];
  skills: Skill[];
  systemStatus: string;
  tasks: Task[];
  isLoading: boolean;
}

export interface Agent {
  id: string;
  name: string;
  type: string;
  status: string;
  // ... other agent properties
}

export interface AgentCreationParams {
  name: string;
  // ... other agent creation parameters
}

export interface Skill {
  id: string;
  name: string;
  // ... other skill properties
}

export interface Task {
  id: string;
  name: string;
  // ... other task properties
}

export interface OrchestratorConfigProps {
  onConfigChange: (config: OrchestratorState) => void;
}

export type OrchestratorAction =
  | { type: 'SET_MODEL'; payload: string }
  | { type: 'UPDATE_SYSTEM_STATUS'; payload: string }
  | { type: 'CREATE_AGENT'; payload: Agent }
  | { type: 'UPDATE_AGENT'; payload: { agentId: string; updates: Partial<Agent> } }
  | { type: 'DELETE_AGENT'; payload: string }
  | { type: 'CREATE_TASK'; payload: Task }
  | { type: 'UPDATE_TASK'; payload: { taskId: string; updates: Partial<Task> } }
  | { type: 'DELETE_TASK'; payload: string }
  | { type: 'CREATE_SKILL'; payload: Skill }
  | { type: 'SET_LOADING'; payload: boolean }
  // ... other action types
