interface LLMResponse {
  content: string;
  role: 'assistant';
  metadata?: {
    confidence?: number;
    tokens?: number;
    model?: string;
  };
}

interface LLMError {
  error: string;
  code: string;
  details?: any;
}

interface LLMConfig {
  model: string;
  temperature?: number;
  maxTokens?: number;
  topP?: number;
  frequencyPenalty?: number;
  presencePenalty?: number;
}

const DEFAULT_CONFIG: LLMConfig = {
  model: 'openai/gpt-3.5-turbo',
  temperature: 0.7,
  maxTokens: 1000,
  topP: 0.9,
  frequencyPenalty: 0,
  presencePenalty: 0
};

export class LLMService {
  private config: LLMConfig;
  private apiKey: string;
  private baseUrl: string;

  constructor(apiKey: string, config: Partial<LLMConfig> = {}) {
    this.apiKey = apiKey;
    this.config = { ...DEFAULT_CONFIG, ...config };
    this.baseUrl = 'https://openrouter.ai/api/v1';
  }

  async chat(messages: Array<{ role: string; content: string }>): Promise<LLMResponse | LLMError> {
    try {
      const response = await fetch(`${this.baseUrl}/chat/completions`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${this.apiKey}`,
          'HTTP-Referer': window.location.origin,
          'X-Title': 'System Orchestrator'
        },
        body: JSON.stringify({
          model: this.config.model,
          messages,
          temperature: this.config.temperature,
          max_tokens: this.config.maxTokens,
          top_p: this.config.topP,
          frequency_penalty: this.config.frequencyPenalty,
          presence_penalty: this.config.presencePenalty
        })
      });

      if (!response.ok) {
        const error = await response.json();
        return {
          error: error.message || 'Failed to get response from LLM',
          code: error.code || response.status.toString(),
          details: error
        };
      }

      const data = await response.json();
      return {
        content: data.choices[0].message.content,
        role: 'assistant',
        metadata: {
          model: data.model,
          tokens: data.usage?.total_tokens
        }
      };
    } catch (err) {
      const error = err as Error;
      return {
        error: error.message || 'Failed to communicate with LLM service',
        code: 'NETWORK_ERROR',
        details: error
      };
    }
  }

  async generateAgentPrompts(context: {
    goal: string;
    type: string;
    capabilities: string[];
    specialization?: string;
  }): Promise<string[] | LLMError> {
    const prompt = `
      As an AI orchestrator, generate appropriate prompt sequences for an agent with the following characteristics:
      
      Goal: ${context.goal}
      Type: ${context.type}
      Capabilities: ${context.capabilities.join(', ')}
      ${context.specialization ? `Specialization: ${context.specialization}` : ''}
      
      Generate a sequence of prompts that will help this agent effectively accomplish its goal.
      Format the response as a JSON array of strings, each representing a prompt in the sequence.
    `;

    const response = await this.chat([
      { role: 'system', content: 'You are an AI orchestrator expert at designing prompt sequences for specialized agents.' },
      { role: 'user', content: prompt }
    ]);

    if ('error' in response) {
      return response;
    }

    try {
      return JSON.parse(response.content);
    } catch (error) {
      return {
        error: 'Failed to parse LLM response as prompt sequence',
        code: 'PARSE_ERROR',
        details: error
      };
    }
  }

  async suggestAgentCapabilities(goal: string): Promise<string[] | LLMError> {
    const prompt = `
      As an AI orchestrator, suggest appropriate capabilities for an agent with the following goal:
      
      ${goal}
      
      Generate a list of capabilities that would help this agent effectively accomplish its goal.
      Format the response as a JSON array of strings, each representing a capability.
    `;

    const response = await this.chat([
      { role: 'system', content: 'You are an AI orchestrator expert at determining agent capabilities based on goals.' },
      { role: 'user', content: prompt }
    ]);

    if ('error' in response) {
      return response;
    }

    try {
      return JSON.parse(response.content);
    } catch (error) {
      return {
        error: 'Failed to parse LLM response as capabilities list',
        code: 'PARSE_ERROR',
        details: error
      };
    }
  }

  async suggestTestScenarios(context: {
    goal: string;
    type: string;
    capabilities: string[];
    promptSequences: string[];
  }): Promise<string[] | LLMError> {
    const prompt = `
      As an AI orchestrator, suggest appropriate test scenarios for an agent with the following characteristics:
      
      Goal: ${context.goal}
      Type: ${context.type}
      Capabilities: ${context.capabilities.join(', ')}
      Prompt Sequences: ${context.promptSequences.join(', ')}
      
      Generate a list of test scenarios that would validate this agent's functionality and reliability.
      Format the response as a JSON array of strings, each representing a test scenario.
    `;

    const response = await this.chat([
      { role: 'system', content: 'You are an AI orchestrator expert at designing test scenarios for specialized agents.' },
      { role: 'user', content: prompt }
    ]);

    if ('error' in response) {
      return response;
    }

    try {
      return JSON.parse(response.content);
    } catch (error) {
      return {
        error: 'Failed to parse LLM response as test scenarios',
        code: 'PARSE_ERROR',
        details: error
      };
    }
  }
}

// Create and export a singleton instance
export const llmService = new LLMService(import.meta.env.VITE_OPENROUTER_API_KEY || '');
