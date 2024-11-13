export type IntegrationType = 
  | 'system' 
  | 'tool' 
  | 'agent' 
  | 'framework' 
  | 'swarm' 
  | 'api' 
  | 'database' 
  | 'service' 
  | 'cloud'
  | 'ai-assistant';

export type AIModel = 
  | 'gpt-4'
  | 'gpt-3.5-turbo'
  | 'claude-2'
  | 'claude-instant'
  | 'ollama'
  | 'local'
  | 'custom';

export interface Integration {
  id: string;
  name: string;
  type: IntegrationType;
  status: 'active' | 'inactive' | 'error';
  description: string;
  endpoint?: string;
  lastSync?: string;
  config?: {
    maxRetries?: number;
    timeout?: number;
    rateLimit?: number;
    authentication?: {
      type: 'apiKey' | 'oauth2' | 'basic';
      credentials?: Record<string, string>;
    };
    // System specific configurations
    system?: {
      version: string;
      requirements: string[];
      capabilities: string[];
    };
    // Tool specific configurations
    tool?: {
      version: string;
      commandPrefix?: string;
      supportedPlatforms: string[];
      dependencies?: string[];
    };
    // Agent specific configurations
    agent?: {
      capabilities: string[];
      model: string;
      parameters?: Record<string, any>;
      memory?: {
        type: string;
        capacity: number;
      };
    };
    // Framework specific configurations
    framework?: {
      version: string;
      language: string;
      dependencies: string[];
      compatibleSystems: string[];
    };
    // Swarm specific configurations
    swarm?: {
      agentCount: number;
      coordination: 'centralized' | 'decentralized';
      roles: string[];
      communicationProtocol: string;
    };
    // AI Assistant specific configurations
    aiAssistant?: {
      model: AIModel;
      modelEndpoint?: string;
      temperature?: number;
      maxTokens?: number;
      role?: string;
      capabilities: string[];
      contextWindow?: number;
      systemPrompt?: string;
      supportedLanguages?: string[];
      customInstructions?: string;
      // For Ollama or local models
      localSettings?: {
        modelPath?: string;
        serverUrl?: string;
        quantization?: '4bit' | '8bit' | 'none';
        gpuLayers?: number;
      };
    };
  };
  metrics?: {
    uptime: number;
    latency: number;
    requests: number;
    errors?: number;
    successRate?: number;
    resourceUsage?: {
      cpu: number;
      memory: number;
      storage: number;
    };
    // AI specific metrics
    aiMetrics?: {
      averageResponseTime: number;
      tokensUsed: number;
      completionRate: number;
      errorRate: number;
      costPerRequest?: number;
    };
  };
  permissions?: string[];
  tags?: string[];
}

export interface IntegrationState {
  integrations: Integration[];
}

export interface IntegrationAction {
  type: 'ADD_INTEGRATION' | 'REMOVE_INTEGRATION' | 'UPDATE_INTEGRATION' | 'RESET_INTEGRATIONS' | 'IMPORT_INTEGRATIONS';
  payload?: any;
}
