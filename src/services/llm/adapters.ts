import { LLMConfig, LLMResponse, LLMError, SystemPrompt } from './types';

export interface LLMAdapter {
  initialize(config: LLMConfig): Promise<void>;
  chat(messages: Array<{ role: string; content: string }>): Promise<LLMResponse | LLMError>;
  getModelInfo(): { provider: string; model: string; capabilities: string[] };
}

export class OpenAIAdapter implements LLMAdapter {
  private config!: LLMConfig;

  async initialize(config: LLMConfig): Promise<void> {
    this.config = config;
  }

  async chat(messages: Array<{ role: string; content: string }>): Promise<LLMResponse | LLMError> {
    try {
      const response = await fetch('https://api.openai.com/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${this.config.apiKey}`
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
          error: error.message || 'OpenAI API error',
          code: error.code || response.status.toString()
        };
      }

      const data = await response.json();
      return {
        content: data.choices[0].message.content,
        role: 'assistant',
        metadata: {
          model: data.model,
          tokens: data.usage?.total_tokens,
          provider: 'openai'
        }
      };
    } catch (err) {
      const error = err as Error;
      return {
        error: error.message || 'Failed to communicate with OpenAI',
        code: 'NETWORK_ERROR'
      };
    }
  }

  getModelInfo() {
    return {
      provider: 'openai',
      model: this.config.model,
      capabilities: ['chat', 'function-calling', 'system-messages']
    };
  }
}

export class AnthropicAdapter implements LLMAdapter {
  private config!: LLMConfig;

  async initialize(config: LLMConfig): Promise<void> {
    this.config = config;
  }

  async chat(messages: Array<{ role: string; content: string }>): Promise<LLMResponse | LLMError> {
    try {
      const response = await fetch('https://api.anthropic.com/v1/messages', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-api-key': this.config.apiKey!,
          'anthropic-version': '2023-06-01'
        },
        body: JSON.stringify({
          model: this.config.model,
          messages,
          max_tokens: this.config.maxTokens,
          temperature: this.config.temperature
        })
      });

      if (!response.ok) {
        const error = await response.json();
        return {
          error: error.message || 'Anthropic API error',
          code: error.code || response.status.toString()
        };
      }

      const data = await response.json();
      return {
        content: data.content[0].text,
        role: 'assistant',
        metadata: {
          model: this.config.model,
          provider: 'anthropic'
        }
      };
    } catch (err) {
      const error = err as Error;
      return {
        error: error.message || 'Failed to communicate with Anthropic',
        code: 'NETWORK_ERROR'
      };
    }
  }

  getModelInfo() {
    return {
      provider: 'anthropic',
      model: this.config.model,
      capabilities: ['chat', 'system-messages']
    };
  }
}

export class OpenRouterAdapter implements LLMAdapter {
  private config!: LLMConfig;

  async initialize(config: LLMConfig): Promise<void> {
    this.config = config;
  }

  async chat(messages: Array<{ role: string; content: string }>): Promise<LLMResponse | LLMError> {
    try {
      const response = await fetch('https://openrouter.ai/api/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${this.config.apiKey}`,
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
          error: error.message || 'OpenRouter API error',
          code: error.code || response.status.toString()
        };
      }

      const data = await response.json();
      return {
        content: data.choices[0].message.content,
        role: 'assistant',
        metadata: {
          model: data.model,
          tokens: data.usage?.total_tokens,
          provider: 'openrouter'
        }
      };
    } catch (err) {
      const error = err as Error;
      return {
        error: error.message || 'Failed to communicate with OpenRouter',
        code: 'NETWORK_ERROR'
      };
    }
  }

  getModelInfo() {
    return {
      provider: 'openrouter',
      model: this.config.model,
      capabilities: ['chat', 'system-messages', 'multiple-providers']
    };
  }
}

export class OllamaAdapter implements LLMAdapter {
  private config!: LLMConfig;

  async initialize(config: LLMConfig): Promise<void> {
    this.config = config;
  }

  async chat(messages: Array<{ role: string; content: string }>): Promise<LLMResponse | LLMError> {
    try {
      const response = await fetch(`${this.config.baseUrl}/api/chat`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          model: this.config.model,
          messages,
          stream: false,
          options: {
            temperature: this.config.temperature,
            num_predict: this.config.maxTokens
          }
        })
      });

      if (!response.ok) {
        const error = await response.json();
        return {
          error: error.message || 'Ollama API error',
          code: error.code || response.status.toString()
        };
      }

      const data = await response.json();
      return {
        content: data.message.content,
        role: 'assistant',
        metadata: {
          model: this.config.model,
          provider: 'ollama'
        }
      };
    } catch (err) {
      const error = err as Error;
      return {
        error: error.message || 'Failed to communicate with Ollama',
        code: 'NETWORK_ERROR'
      };
    }
  }

  getModelInfo() {
    return {
      provider: 'ollama',
      model: this.config.model,
      capabilities: ['chat', 'local-execution', 'system-messages']
    };
  }
}

export const createAdapter = (provider: string): LLMAdapter => {
  switch (provider) {
    case 'openai':
      return new OpenAIAdapter();
    case 'anthropic':
      return new AnthropicAdapter();
    case 'openrouter':
      return new OpenRouterAdapter();
    case 'ollama':
      return new OllamaAdapter();
    default:
      throw new Error(`Unsupported provider: ${provider}`);
  }
};
