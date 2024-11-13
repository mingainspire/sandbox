import { OrchestratorState, OrchestratorAction, Task, Agent, TaskCreationParams, AgentCreationParams, TaskUpdateParams, AgentUpdateParams, ApprovalStatus } from './types';

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
    defaultPriority: 'medium',
    approvalSettings: {
      requireApprovalFor: ['creation', 'modification', 'deletion', 'training'],
      restrictedActions: ['system_modification', 'external_communication']
    }
  }
};

type DevelopmentHistoryEntry = {
  id: string;
  type: 'capability' | 'specialization' | 'integration' | 'behavior';
  description: string;
  status: ApprovalStatus;
  approvedBy?: string;
  timestamp: string;
  changes: Record<string, any>;
};

export function orchestratorReducer(state: OrchestratorState = initialState, action: OrchestratorAction): OrchestratorState {
  switch (action.type) {
    case 'CREATE_AGENT': {
      const params = action.payload as AgentCreationParams;
      const newAgent: Agent = {
        id: Date.now().toString(),
        name: params.name,
        type: params.type,
        status: 'idle',
        capabilities: params.capabilities || [],
        createdAt: new Date().toISOString(),
        lastActive: new Date().toISOString(),
        metadata: {
          specialization: params.specialization,
          performance: {
            tasksCompleted: 0,
            successRate: 100
          },
          permissions: params.permissions || [],
          creator: 'user',
          approvalStatus: {
            status: 'pending',
            approvedBy: undefined,
            approvedAt: undefined
          },
          training: {
            status: 'untrained',
            completedModules: [],
            pendingModules: ['basic_operations', 'safety_protocols', 'user_interaction'],
            performance: {
              accuracy: 0,
              reliability: 0,
              efficiency: 0
            }
          },
          behaviorControls: {
            requireApprovalFor: params.behaviorControls?.requireApprovalFor || ['task_execution', 'capability_modification', 'integration'],
            automatedTasks: params.behaviorControls?.automatedTasks || [],
            restrictedActions: params.behaviorControls?.restrictedActions || [],
            userOverrides: params.behaviorControls?.userOverrides ?? true
          },
          developmentHistory: []
        }
      };

      return {
        ...state,
        agents: [...state.agents, newAgent],
        systemStatus: {
          ...state.systemStatus,
          agents: state.systemStatus.agents + 1,
          lastUpdate: new Date().toISOString()
        }
      };
    }

    case 'UPDATE_AGENT': {
      const { agentId, updates } = action.payload as { agentId: string; updates: AgentUpdateParams };
      const updatedAgents = state.agents.map(agent => {
        if (agent.id === agentId) {
          const currentMetadata = agent.metadata || {
            permissions: [],
            developmentHistory: []
          };

          const newHistoryEntry: DevelopmentHistoryEntry = {
            id: Date.now().toString(),
            type: 'behavior',
            description: 'Agent updated',
            status: 'pending',
            timestamp: new Date().toISOString(),
            changes: updates
          };

          const updatedMetadata = {
            ...currentMetadata,
            ...updates.metadata,
            developmentHistory: [
              ...(currentMetadata.developmentHistory || []),
              newHistoryEntry
            ],
            behaviorControls: updates.behaviorControls ? {
              requireApprovalFor: updates.behaviorControls.requireApprovalFor || currentMetadata.behaviorControls?.requireApprovalFor || [],
              automatedTasks: updates.behaviorControls.automatedTasks || currentMetadata.behaviorControls?.automatedTasks || [],
              restrictedActions: updates.behaviorControls.restrictedActions || currentMetadata.behaviorControls?.restrictedActions || [],
              userOverrides: updates.behaviorControls.userOverrides ?? currentMetadata.behaviorControls?.userOverrides ?? true
            } : currentMetadata.behaviorControls
          };

          return {
            ...agent,
            ...updates,
            lastActive: new Date().toISOString(),
            metadata: updatedMetadata
          };
        }
        return agent;
      });

      return {
        ...state,
        agents: updatedAgents
      };
    }

    case 'DELETE_AGENT': {
      const agentId = action.payload as string;
      const updatedAgents = state.agents.filter(agent => agent.id !== agentId);
      
      return {
        ...state,
        agents: updatedAgents,
        systemStatus: {
          ...state.systemStatus,
          agents: state.systemStatus.agents - 1,
          lastUpdate: new Date().toISOString()
        }
      };
    }

    case 'CREATE_TASK': {
      const params = action.payload as TaskCreationParams;
      const newTask: Task = {
        id: Date.now().toString(),
        type: params.type,
        status: 'pending',
        description: params.description,
        progress: 0,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        metadata: {
          priority: params.priority || state.userPreferences?.defaultPriority || 'medium',
          requirements: params.requirements || [],
          dependencies: params.dependencies || [],
          approvalStatus: 'pending',
          logs: []
        }
      };

      return {
        ...state,
        tasks: [...state.tasks, newTask],
        systemStatus: {
          ...state.systemStatus,
          activeTasks: state.systemStatus.activeTasks + 1,
          lastUpdate: new Date().toISOString()
        }
      };
    }

    case 'UPDATE_TASK': {
      const { taskId, updates } = action.payload as { taskId: string; updates: TaskUpdateParams };
      const updatedTasks = state.tasks.map(task => {
        if (task.id === taskId) {
          const updatedTask = {
            ...task,
            ...updates,
            updatedAt: new Date().toISOString(),
            metadata: {
              ...task.metadata,
              ...updates.metadata
            }
          };

          if (updates.status && updates.status !== task.status) {
            updatedTask.metadata = {
              ...updatedTask.metadata,
              logs: [
                ...(updatedTask.metadata?.logs || []),
                `Status changed from ${task.status} to ${updates.status} at ${new Date().toISOString()}`
              ]
            };
          }

          return updatedTask;
        }
        return task;
      });

      const completedTasks = updatedTasks.filter(t => t.status === 'completed').length;
      const activeTasks = updatedTasks.filter(t => t.status === 'in_progress').length;

      return {
        ...state,
        tasks: updatedTasks,
        systemStatus: {
          ...state.systemStatus,
          activeTasks,
          completedTasks,
          lastUpdate: new Date().toISOString()
        }
      };
    }

    case 'DELETE_TASK': {
      const taskId = action.payload as string;
      const updatedTasks = state.tasks.filter(task => task.id !== taskId);
      
      return {
        ...state,
        tasks: updatedTasks,
        systemStatus: {
          ...state.systemStatus,
          activeTasks: updatedTasks.filter(t => t.status === 'in_progress').length,
          completedTasks: updatedTasks.filter(t => t.status === 'completed').length,
          lastUpdate: new Date().toISOString()
        }
      };
    }

    case 'UPDATE_SYSTEM_STATUS': {
      return {
        ...state,
        systemStatus: {
          ...state.systemStatus,
          ...action.payload,
          lastUpdate: new Date().toISOString()
        }
      };
    }

    case 'SET_USER_PREFERENCES': {
      return {
        ...state,
        userPreferences: {
          ...state.userPreferences,
          ...action.payload
        }
      };
    }

    default:
      return state;
  }
}
