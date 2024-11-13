import { useReducer, useCallback } from 'react';
import { orchestratorReducer } from './orchestratorReducer';
import { TaskCreationParams, TaskUpdateParams, SystemStatus, OrchestratorState, AgentCreationParams, Agent } from './types';

const initialState: OrchestratorState = {
  activeConversation: false,
  tasks: [],
  agents: [],
  systemStatus: {
    agents: 0,
    activeTasks: 0,
    completedTasks: 0,
    systemLoad: 0,
    lastUpdate: new Date().toISOString()
  },
  userPreferences: {
    autoApprove: false,
    notificationLevel: 'important',
    defaultPriority: 'medium'
  }
};

export function useOrchestratorState() {
  const [state, dispatch] = useReducer(orchestratorReducer, initialState);

  // Agent-related actions
  const createAgent = useCallback((params: AgentCreationParams) => {
    dispatch({ type: 'CREATE_AGENT', payload: params });
  }, []);

  const updateAgent = useCallback((agentId: string, updates: Partial<Agent>) => {
    dispatch({ type: 'UPDATE_AGENT', payload: { agentId, updates } });
  }, []);

  const deleteAgent = useCallback((agentId: string) => {
    dispatch({ type: 'DELETE_AGENT', payload: agentId });
  }, []);

  // Task-related actions
  const createTask = useCallback((params: TaskCreationParams) => {
    dispatch({ type: 'CREATE_TASK', payload: params });
  }, []);

  const updateTask = useCallback((taskId: string, updates: TaskUpdateParams) => {
    dispatch({ type: 'UPDATE_TASK', payload: { taskId, updates } });
  }, []);

  const deleteTask = useCallback((taskId: string) => {
    dispatch({ type: 'DELETE_TASK', payload: taskId });
  }, []);

  const updateSystemStatus = useCallback((updates: Partial<SystemStatus>) => {
    dispatch({ type: 'UPDATE_SYSTEM_STATUS', payload: updates });
  }, []);

  const setUserPreferences = useCallback((preferences: Partial<OrchestratorState['userPreferences']>) => {
    dispatch({ type: 'SET_USER_PREFERENCES', payload: preferences });
  }, []);

  // Helper methods for common task operations
  const approveTask = useCallback((taskId: string) => {
    updateTask(taskId, {
      metadata: {
        approvalStatus: 'approved',
        approvedBy: 'user',
      }
    });
  }, [updateTask]);

  const startTask = useCallback((taskId: string) => {
    updateTask(taskId, {
      status: 'in_progress',
      progress: 0,
      metadata: {
        logs: ['Task started']
      }
    });
  }, [updateTask]);

  const completeTask = useCallback((taskId: string) => {
    updateTask(taskId, {
      status: 'completed',
      progress: 100,
      metadata: {
        logs: ['Task completed']
      }
    });
  }, [updateTask]);

  const failTask = useCallback((taskId: string, reason: string) => {
    updateTask(taskId, {
      status: 'failed',
      metadata: {
        logs: [`Task failed: ${reason}`]
      }
    });
  }, [updateTask]);

  const updateTaskProgress = useCallback((taskId: string, progress: number) => {
    updateTask(taskId, {
      progress,
      metadata: {
        logs: [`Progress updated to ${progress}%`]
      }
    });
  }, [updateTask]);

  // Task query methods
  const getPendingTasks = useCallback(() => {
    return state.tasks.filter(task => task.status === 'pending');
  }, [state.tasks]);

  const getActiveTasks = useCallback(() => {
    return state.tasks.filter(task => task.status === 'in_progress');
  }, [state.tasks]);

  const getCompletedTasks = useCallback(() => {
    return state.tasks.filter(task => task.status === 'completed');
  }, [state.tasks]);

  const getTasksByType = useCallback((type: string) => {
    return state.tasks.filter(task => task.type === type);
  }, [state.tasks]);

  const getTaskById = useCallback((taskId: string) => {
    return state.tasks.find(task => task.id === taskId);
  }, [state.tasks]);

  // Agent query methods
  const getAgentsByType = useCallback((type: string) => {
    return state.agents.filter(agent => agent.type === type);
  }, [state.agents]);

  const getAgentById = useCallback((agentId: string) => {
    return state.agents.find(agent => agent.id === agentId);
  }, [state.agents]);

  const getActiveAgents = useCallback(() => {
    return state.agents.filter(agent => agent.status === 'active');
  }, [state.agents]);

  return {
    state,
    // Agent actions
    createAgent,
    updateAgent,
    deleteAgent,
    agents: state.agents,
    // Core actions
    createTask,
    updateTask,
    deleteTask,
    updateSystemStatus,
    setUserPreferences,
    // Task operations
    approveTask,
    startTask,
    completeTask,
    failTask,
    updateTaskProgress,
    // Task query methods
    getPendingTasks,
    getActiveTasks,
    getCompletedTasks,
    getTasksByType,
    getTaskById,
    // Agent query methods
    getAgentsByType,
    getAgentById,
    getActiveAgents
  };
}
