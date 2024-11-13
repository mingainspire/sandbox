import { LLMConfig, LLMResponse, LLMError, LLMProvider, SystemPrompt, LLMServiceOptions, ProviderConfig } from './types';
import { createAdapter, LLMAdapter } from './adapters';

export class LLMService {
  private adapter: LLMAdapter | null = null;
  private config: LLMConfig | null = null;
  private systemPrompts: Map<string, SystemPrompt> = new Map();
  private activeSystemPrompts: string[] = [];
  private options: LLMServiceOptions;

  constructor(options: LLMServiceOptions) {
    this.options = options;
    if (options.systemPrompts) {
      options.systemPrompts.forEach(prompt => {
        this.systemPrompts.set(prompt.id, prompt);
      });
    }
    if (options.defaultSystemPrompt) {
      this.activeSystemPrompts = [options.defaultSystemPrompt];
    }
  }

  async initialize(provider?: LLMProvider, config?: Partial<LLMConfig>): Promise<void> {
    const selectedProvider = provider || this.options.defaultProvider;
    const providerConfig = this.getProviderConfig(selectedProvider);

    if (!providerConfig) {
      throw new Error(`No configuration found for provider: ${selectedProvider}`);
    }

    this.config = {
      provider: selectedProvider,
      model: providerConfig.model,
      apiKey: providerConfig.apiKey,
      baseUrl: providerConfig.baseUrl,
      temperature: config?.temperature ?? 0.7,
      maxTokens: config?.maxTokens ?? 1000,
      topP: config?.topP ?? 0.9,
      frequencyPenalty: config?.frequencyPenalty ?? 0,
      presencePenalty: config?.presencePenalty ?? 0,
      systemPrompts: this.activeSystemPrompts
    };

    this.adapter = createAdapter(selectedProvider);
    await this.adapter.initialize(this.config);
  }

  private getProviderConfig(provider: LLMProvider): { model: string; apiKey?: string; baseUrl?: string } | undefined {
    switch (provider) {
      case 'openai':
        return this.options.providers.openai;
      case 'anthropic':
        return this.options.providers.anthropic;
      case 'openrouter':
        return this.options.providers.openrouter;
      case 'ollama':
        return this.options.providers.ollama;
      case 'grok':
        return this.options.providers.grok;
      case 'custom':
        return this.options.providers.custom;
      default:
        return undefined;
    }
  }

  async switchProvider(provider: LLMProvider, config?: Partial<LLMConfig>): Promise<void> {
    await this.initialize(provider, config);
  }

  addSystemPrompt(prompt: SystemPrompt): void {
    this.systemPrompts.set(prompt.id, prompt);
  }

  removeSystemPrompt(promptId: string): void {
    this.systemPrompts.delete(promptId);
    this.activeSystemPrompts = this.activeSystemPrompts.filter(id => id !== promptId);
  }

  activateSystemPrompt(promptId: string): void {
    if (this.systemPrompts.has(promptId) && !this.activeSystemPrompts.includes(promptId)) {
      this.activeSystemPrompts.push(promptId);
    }
  }

  deactivateSystemPrompt(promptId: string): void {
    this.activeSystemPrompts = this.activeSystemPrompts.filter(id => id !== promptId);
  }

  getActiveSystemPrompts(): SystemPrompt[] {
    return this.activeSystemPrompts
      .map(id => this.systemPrompts.get(id))
      .filter((prompt): prompt is SystemPrompt => prompt !== undefined);
  }

  private prepareMessages(messages: Array<{ role: string; content: string }>): Array<{ role: string; content: string }> {
    const activePrompts = this.getActiveSystemPrompts();
    const systemMessages = activePrompts.map(prompt => ({
      role: 'system',
      content: prompt.content
    }));

    return [...systemMessages, ...messages];
  }

  async chat(messages: Array<{ role: string; content: string }>): Promise<LLMResponse | LLMError> {
    if (!this.adapter || !this.config) {
      throw new Error('LLM service not initialized');
    }

    const preparedMessages = this.prepareMessages(messages);
    return this.adapter.chat(preparedMessages);
  }

  async generateAgentPrompts(context: {
    goal: string;
    type: string;
    capabilities: string[];
    specialization?: string;
  }): Promise<string[] | LLMError> {
    const response = await this.chat([
      {
        role: 'system',
        content: 'You are an AI orchestrator expert at designing prompt sequences for specialized agents.'
      },
      {
        role: 'user',
        content: `
          Generate appropriate prompt sequences for an agent with the following characteristics:
          
          Goal: ${context.goal}
          Type: ${context.type}
          Capabilities: ${context.capabilities.join(', ')}
          ${context.specialization ? `Specialization: ${context.specialization}` : ''}
          
          Format the response as a JSON array of strings, each representing a prompt in the sequence.
        `
      }
    ]);

    if ('error' in response) {
      return response;
    }

    try {
      return JSON.parse(response.content);
    } catch (error) {
      return {
        error: 'Failed to parse response as prompt sequence',
        code: 'PARSE_ERROR'
      };
    }
  }

  getProviderInfo() {
    if (!this.adapter || !this.config) {
      throw new Error('LLM service not initialized');
    }
    return this.adapter.getModelInfo();
  }

  getCurrentConfig(): LLMConfig | null {
    return this.config;
  }
}

// Default system prompts for the orchestrator
const defaultSystemPrompts: SystemPrompt[] = [
  {
    id: 'orchestrator-core',
    name: 'Orchestrator Core Behavior',
    content: `You are an AI Orchestrator responsible for managing and coordinating AI agents in a complex system. Your core responsibilities include:

1. Understanding user requirements and creating appropriate agents
2. Coordinating tasks between multiple agents
3. Monitoring agent performance and system health
4. Suggesting improvements and optimizations
5. Ensuring safety and ethical operation

Always maintain awareness of system state and agent capabilities.
Provide clear, actionable responses and maintain a helpful, professional demeanor.`,
    tags: ['core', 'behavior', 'orchestration'],
    metadata: {
      author: 'system',
      version: '1.0.0',
      category: 'core'
    }
  },
  {
    id: 'agent-creation',
    name: 'Agent Creation Expertise',
    content: `As an expert in agent creation, follow these principles:

1. Thoroughly understand the user's requirements before suggesting agent configurations
2. Recommend appropriate capabilities based on the agent's intended purpose
3. Design effective prompt sequences that guide the agent's behavior
4. Suggest comprehensive test scenarios to validate agent functionality
5. Consider safety measures and ethical implications
6. Ensure proper integration with existing system components

Always explain your recommendations and seek user confirmation for important decisions.`,
    tags: ['agent-creation', 'design', 'safety'],
    metadata: {
      author: 'system',
      version: '1.0.0',
      category: 'agent-creation'
    }
  }
];

// Create and export a singleton instance
export const llmService = new LLMService({
  defaultProvider: 'openrouter',
  providers: {
    openrouter: {
      apiKey: import.meta.env.VITE_OPENROUTER_API_KEY || '',
      model: 'anthropic/claude-2'
    },
    ollama: {
      baseUrl: 'http://localhost:11434',
      model: 'llama2'
    }
  },
  systemPrompts: defaultSystemPrompts,
  defaultSystemPrompt: 'orchestrator-core'
});
