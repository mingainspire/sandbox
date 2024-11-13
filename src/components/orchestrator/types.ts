export type TaskType = 'skill' | 'function' | 'agent' | 'system' | 'framework' | 'tool';
export type TaskStatus = 'pending' | 'in_progress' | 'completed' | 'failed';
export type AgentType = 'orchestrator' | 'coder' | 'specialist' | 'analyst';
export type AgentStatus = 'active' | 'idle' | 'offline';
export type ApprovalStatus = 'pending' | 'approved' | 'rejected';
export type TrainingStatus = 'untrained' | 'in_training' | 'trained' | 'needs_review';

// Base interface for all orchestrated components
interface BaseComponent {
  id: string;
  name: string;
  description: string;
  createdAt: string;
  lastActive: string;
  status: 'active' | 'inactive' | 'error';
  metadata?: {
    version?: string;
    author?: string;
    documentation?: string;
    dependencies?: string[];
    tags?: string[];
  };
}

// Skill definition
export interface Skill extends BaseComponent {
  type: 'skill';
  category: string;
  inputs: {
    name: string;
    type: string;
    description: string;
    required: boolean;
  }[];
  outputs: {
    name: string;
    type: string;
    description: string;
  }[];
  implementation: string;
  testCases: {
    input: Record<string, any>;
    expectedOutput: Record<string, any>;
    description: string;
  }[];
}

// Tool definition
export interface Tool extends BaseComponent {
  type: 'tool';
  category: string;
  capabilities: string[];
  requirements: string[];
  configuration: Record<string, any>;
  usage: {
    examples: string[];
    limitations: string[];
    bestPractices: string[];
  };
}

// System definition
export interface System extends BaseComponent {
  type: 'system';
  components: string[]; // IDs of related components
  architecture: {
    description: string;
    diagram?: string;
    components: {
      id: string;
      type: string;
      role: string;
    }[];
  };
  configuration: Record<string, any>;
  monitoring: {
    metrics: string[];
    alerts: string[];
    healthChecks: string[];
  };
}

// Framework definition
export interface Framework extends BaseComponent {
  type: 'framework';
  purpose: string;
  principles: string[];
  components: {
    id: string;
    type: string;
    role: string;
    required: boolean;
  }[];
  guidelines: {
    category: string;
    rules: string[];
    examples: string[];
  }[];
  templates: {
    name: string;
    description: string;
    content: string;
  }[];
}

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
      promptSequences?: string[];
      testScenarios?: string[];
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
  skills: Skill[];
  tools: Tool[];
  systems: System[];
  frameworks: Framework[];
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
    promptSequences?: string[];
    testScenarios?: string[];
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
  type: 'CREATE_TASK' | 'UPDATE_TASK' | 'DELETE_TASK' | 
        'CREATE_AGENT' | 'UPDATE_AGENT' | 'DELETE_AGENT' |
        'CREATE_SKILL' | 'UPDATE_SKILL' | 'DELETE_SKILL' |
        'CREATE_TOOL' | 'UPDATE_TOOL' | 'DELETE_TOOL' |
        'CREATE_SYSTEM' | 'UPDATE_SYSTEM' | 'DELETE_SYSTEM' |
        'CREATE_FRAMEWORK' | 'UPDATE_FRAMEWORK' | 'DELETE_FRAMEWORK' |
        'UPDATE_SYSTEM_STATUS' | 'SET_USER_PREFERENCES';
  payload: any;
}
