export type TaskType = 'skill' | 'function' | 'agent' | 'system' | 'framework';
export type TaskStatus = 'pending' | 'in_progress' | 'completed' | 'failed';
export type AgentType = 'orchestrator' | 'coder' | 'specialist' | 'analyst';
export type AgentStatus = 'active' | 'idle' | 'offline';
export type ApprovalStatus = 'pending' | 'approved' | 'rejected';
export type TrainingStatus = 'untrained' | 'in_training' | 'trained' | 'needs_review';

export interface Agent {
  id: string;
  name: string;
  type: AgentType;
  status: AgentStatus;
  capabilities: string[];
  createdAt: string;
  lastActive: string;
  metadata?: {
    specialization?: string;
    performance?: {
      tasksCompleted: number;
      successRate: number;
    };
    permissions: string[];
    creator?: string;
    approvalStatus?: {
      status: ApprovalStatus;
      approvedBy?: string;
      approvedAt?: string;
      feedback?: string;
    };
    training?: {
      status: TrainingStatus;
      lastTrainingDate?: string;
      completedModules: string[];
      pendingModules: string[];
      performance: {
        accuracy: number;
        reliability: number;
        efficiency: number;
      };
    };
    behaviorControls?: {
      requireApprovalFor: string[];
      automatedTasks: string[];
      restrictedActions: string[];
      userOverrides: boolean;
    };
    developmentHistory?: Array<{
      id: string;
      type: 'capability' | 'specialization' | 'integration' | 'behavior';
      description: string;
      status: ApprovalStatus;
      approvedBy?: string;
      timestamp: string;
      changes: Record<string, any>;
    }>;
  };
}

export interface Task {
  id: string;
  type: TaskType;
  status: TaskStatus;
  description: string;
  progress: number;
  createdAt: string;
  updatedAt: string;
  metadata?: {
    priority?: 'low' | 'medium' | 'high';
    dependencies?: string[];
    assignedAgent?: string;
    estimatedCompletion?: string;
    requirements?: string[];
    approvalStatus?: ApprovalStatus;
    approvedBy?: string;
    logs?: string[];
  };
}

export interface SystemStatus {
  agents: number;
  activeTasks: number;
  completedTasks: number;
  systemLoad: number;
  memory?: {
    used: number;
    total: number;
  };
  lastUpdate: string;
}

export interface OrchestratorState {
  activeConversation: boolean;
  tasks: Task[];
  agents: Agent[];
  systemStatus: SystemStatus;
  userPreferences?: {
    autoApprove?: boolean;
    notificationLevel?: 'all' | 'important' | 'none';
    defaultPriority?: 'low' | 'medium' | 'high';
    approvalSettings?: {
      requireApprovalFor: ('creation' | 'modification' | 'deletion' | 'training')[];
      autoApproveTypes?: AgentType[];
      restrictedActions?: string[];
    };
  };
}

export interface TaskCreationParams {
  type: TaskType;
  description: string;
  priority?: 'low' | 'medium' | 'high';
  requirements?: string[];
  dependencies?: string[];
}

export interface AgentCreationParams {
  name: string;
  type: AgentType;
  capabilities: string[];
  specialization?: string;
  permissions?: string[];
  behaviorControls?: {
    requireApprovalFor: string[];
    automatedTasks: string[];
    restrictedActions: string[];
    userOverrides: boolean;
  };
}

export interface TaskUpdateParams {
  status?: TaskStatus;
  progress?: number;
  metadata?: Partial<Task['metadata']>;
}

export interface AgentUpdateParams {
  status?: AgentStatus;
  capabilities?: string[];
  metadata?: Partial<Agent['metadata']>;
  behaviorControls?: Partial<NonNullable<Agent['metadata']>['behaviorControls']>;
}

export interface OrchestratorAction {
  type: 'CREATE_TASK' | 'UPDATE_TASK' | 'DELETE_TASK' | 'CREATE_AGENT' | 'UPDATE_AGENT' | 'DELETE_AGENT' | 'UPDATE_SYSTEM_STATUS' | 'SET_USER_PREFERENCES';
  payload: any;
}
