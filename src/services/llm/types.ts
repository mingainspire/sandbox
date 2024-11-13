export type LLMProvider = 
  | 'openai'
  | 'anthropic'
  | 'openrouter'
  | 'ollama'
  | 'local'
  | 'grok'
  | 'custom';

export interface LLMResponse {
  content: string;
  role: 'assistant';
  metadata?: {
    confidence?: number;
    tokens?: number;
    model?: string;
    provider?: LLMProvider;
  };
}

export interface LLMError {
  error: string;
  code: string;
  details?: any;
}

export interface LLMConfig {
  provider: LLMProvider;
  model: string;
  apiKey?: string;
  baseUrl?: string;
  temperature?: number;
  maxTokens?: number;
  topP?: number;
  frequencyPenalty?: number;
  presencePenalty?: number;
  systemPrompts?: string[];
}

export interface ProviderConfig {
  openai?: {
    apiKey: string;
    model: string;
    baseUrl?: string;
  };
  anthropic?: {
    apiKey: string;
    model: string;
  };
  openrouter?: {
    apiKey: string;
    model: string;
  };
  ollama?: {
    baseUrl: string;
    model: string;
  };
  grok?: {
    apiKey: string;
    model: string;
  };
  custom?: {
    apiKey?: string;
    baseUrl: string;
    model: string;
  };
}

export interface SystemPrompt {
  id: string;
  name: string;
  content: string;
  description?: string;
  tags?: string[];
  metadata?: {
    author?: string;
    version?: string;
    lastModified?: string;
    category?: string;
  };
}

export interface LLMServiceOptions {
  defaultProvider: LLMProvider;
  providers: ProviderConfig;
  systemPrompts?: SystemPrompt[];
  defaultSystemPrompt?: string;
}
