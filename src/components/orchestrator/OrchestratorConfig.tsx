import React, { useState, useEffect } from 'react';
import { LLMProvider, SystemPrompt, LLMConfig } from '../../services/llm/types';
import { llmService } from '../../services/llm/service';

interface ProviderOption {
  id: LLMProvider;
  name: string;
  description: string;
  models: Array<{
    id: string;
    name: string;
    description: string;
    isFree: boolean;
    contextLength?: number;
  }>;
  requiresApiKey: boolean;
  requiresBaseUrl: boolean;
}

const PROVIDER_OPTIONS: ProviderOption[] = [
  {
    id: 'openrouter',
    name: 'OpenRouter',
    description: 'Access to multiple LLM providers through a single API',
    models: [
      {
        id: 'mistralai/mistral-7b-instruct',
        name: 'Mistral 7B Instruct',
        description: 'Efficient open-source model with strong reasoning capabilities',
        isFree: true,
        contextLength: 8000
      },
      {
        id: 'nousresearch/nous-hermes-llama2-13b',
        name: 'Nous Hermes 13B',
        description: 'Enhanced Llama 2 model with improved instruction following',
        isFree: true,
        contextLength: 4096
      },
      {
        id: 'openchat/openchat-7b',
        name: 'OpenChat 7B',
        description: 'Open-source model optimized for dialogue',
        isFree: true,
        contextLength: 8192
      },
      {
        id: 'gryphe/mythomist-7b',
        name: 'MythoMist 7B',
        description: 'Creative and engaging conversational model',
        isFree: true,
        contextLength: 4096
      },
      {
        id: 'anthropic/claude-2',
        name: 'Claude 2',
        description: 'Advanced model with strong reasoning and coding abilities',
        isFree: false,
        contextLength: 100000
      }
    ],
    requiresApiKey: true,
    requiresBaseUrl: false
  },
  {
    id: 'ollama',
    name: 'Ollama',
    description: 'Run large language models locally',
    models: [
      {
        id: 'llama2',
        name: 'Llama 2',
        description: 'Meta\'s open-source large language model',
        isFree: true
      },
      {
        id: 'mistral',
        name: 'Mistral',
        description: 'Efficient and powerful open-source model',
        isFree: true
      },
      {
        id: 'codellama',
        name: 'Code Llama',
        description: 'Specialized for code generation and analysis',
        isFree: true
      }
    ],
    requiresApiKey: false,
    requiresBaseUrl: true
  }
];

const DEFAULT_SYSTEM_PROMPT = `You are an AI Orchestrator, a highly capable assistant focused on helping users create and manage AI skills, tools, and agents. Your core traits include:

1. Helpfulness: You proactively guide users through complex tasks, breaking them down into manageable steps.
2. Technical Expertise: You understand software development, AI systems, and best practices.
3. Clear Communication: You explain concepts clearly and provide relevant examples.
4. Problem-Solving: You help users think through challenges and find effective solutions.
5. Safety-Conscious: You prioritize responsible AI development and ethical considerations.

When helping users:
- Ask clarifying questions to fully understand their needs
- Provide specific, actionable suggestions
- Share relevant examples and best practices
- Consider edge cases and potential issues
- Guide users toward scalable, maintainable solutions

Remember that you're building a collaborative system where skills and tools can be combined and reused. Help users create components that work well together and follow consistent patterns.`;

const OrchestratorConfig: React.FC = () => {
  const [selectedProvider, setSelectedProvider] = useState<LLMProvider>('openrouter');
  const [apiKey, setApiKey] = useState('');
  const [baseUrl, setBaseUrl] = useState('http://localhost:11434');
  const [selectedModel, setSelectedModel] = useState('');
  const [temperature, setTemperature] = useState(0.7);
  const [maxTokens, setMaxTokens] = useState(1000);
  const [systemPrompt, setSystemPrompt] = useState(DEFAULT_SYSTEM_PROMPT);
  const [isConfiguring, setIsConfiguring] = useState(false);
  const [showFreeOnly, setShowFreeOnly] = useState(true);

  useEffect(() => {
    const config = llmService.getCurrentConfig();
    if (config) {
      setSelectedProvider(config.provider);
      setTemperature(config.temperature || 0.7);
      setMaxTokens(config.maxTokens || 1000);
      if (config.systemPrompts?.[0]) {
        setSystemPrompt(config.systemPrompts[0]);
      }
    }
  }, []);

  const handleProviderChange = (provider: LLMProvider) => {
    setSelectedProvider(provider);
    const providerOption = PROVIDER_OPTIONS.find(p => p.id === provider);
    if (providerOption) {
      const defaultModel = providerOption.models.find(m => m.isFree || !showFreeOnly);
      if (defaultModel) {
        setSelectedModel(defaultModel.id);
      }
    }
  };

  const handleSaveConfig = async () => {
    setIsConfiguring(true);
    try {
      const config: Partial<LLMConfig> = {
        provider: selectedProvider,
        temperature,
        maxTokens,
        model: selectedModel,
        systemPrompts: [systemPrompt]
      };

      if (selectedProvider === 'ollama') {
        config.baseUrl = baseUrl;
      } else {
        config.apiKey = apiKey;
      }

      await llmService.initialize(selectedProvider, config);
    } catch (error) {
      console.error('Failed to update configuration:', error);
    } finally {
      setIsConfiguring(false);
    }
  };

  const filteredModels = PROVIDER_OPTIONS.find(p => p.id === selectedProvider)?.models.filter(
    m => !showFreeOnly || m.isFree
  ) || [];

  return (
    <div className="bg-gray-800 rounded-lg p-6 space-y-6">
      <h2 className="text-xl font-bold text-gray-100">Orchestrator Configuration</h2>

      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-300">Provider</label>
          <select
            value={selectedProvider}
            onChange={(e) => handleProviderChange(e.target.value as LLMProvider)}
            className="mt-1 block w-full rounded-md bg-gray-700 border-gray-600 text-gray-100 focus:border-blue-500 focus:ring-blue-500"
          >
            {PROVIDER_OPTIONS.map(provider => (
              <option key={provider.id} value={provider.id}>
                {provider.name}
              </option>
            ))}
          </select>
          <p className="mt-1 text-sm text-gray-400">
            {PROVIDER_OPTIONS.find(p => p.id === selectedProvider)?.description}
          </p>
        </div>

        <div className="flex items-center">
          <input
            type="checkbox"
            checked={showFreeOnly}
            onChange={(e) => setShowFreeOnly(e.target.checked)}
            className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-600 bg-gray-700 rounded"
          />
          <label className="ml-2 block text-sm text-gray-300">
            Show only free models
          </label>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-300">Model</label>
          <select
            value={selectedModel}
            onChange={(e) => setSelectedModel(e.target.value)}
            className="mt-1 block w-full rounded-md bg-gray-700 border-gray-600 text-gray-100 focus:border-blue-500 focus:ring-blue-500"
          >
            {filteredModels.map(model => (
              <option key={model.id} value={model.id}>
                {model.name} {model.isFree ? '(Free)' : '(Paid)'}
              </option>
            ))}
          </select>
          <p className="mt-1 text-sm text-gray-400">
            {filteredModels.find(m => m.id === selectedModel)?.description}
            {filteredModels.find(m => m.id === selectedModel)?.contextLength && 
              ` (Context: ${filteredModels.find(m => m.id === selectedModel)?.contextLength} tokens)`
            }
          </p>
        </div>

        {PROVIDER_OPTIONS.find(p => p.id === selectedProvider)?.requiresApiKey && (
          <div>
            <label className="block text-sm font-medium text-gray-300">API Key</label>
            <input
              type="password"
              value={apiKey}
              onChange={(e) => setApiKey(e.target.value)}
              className="mt-1 block w-full rounded-md bg-gray-700 border-gray-600 text-gray-100 focus:border-blue-500 focus:ring-blue-500"
              placeholder="Enter API key"
            />
          </div>
        )}

        {PROVIDER_OPTIONS.find(p => p.id === selectedProvider)?.requiresBaseUrl && (
          <div>
            <label className="block text-sm font-medium text-gray-300">Base URL</label>
            <input
              type="text"
              value={baseUrl}
              onChange={(e) => setBaseUrl(e.target.value)}
              className="mt-1 block w-full rounded-md bg-gray-700 border-gray-600 text-gray-100 focus:border-blue-500 focus:ring-blue-500"
              placeholder="Enter base URL"
            />
          </div>
        )}

        <div>
          <label className="block text-sm font-medium text-gray-300">Temperature</label>
          <input
            type="range"
            min="0"
            max="1"
            step="0.1"
            value={temperature}
            onChange={(e) => setTemperature(parseFloat(e.target.value))}
            className="mt-1 block w-full"
          />
          <div className="mt-1 text-sm text-gray-400">
            {temperature} (Higher values make the output more random)
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-300">Max Tokens</label>
          <input
            type="number"
            value={maxTokens}
            onChange={(e) => setMaxTokens(parseInt(e.target.value))}
            className="mt-1 block w-full rounded-md bg-gray-700 border-gray-600 text-gray-100 focus:border-blue-500 focus:ring-blue-500"
            min="100"
            max="4000"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-300">System Prompt</label>
          <textarea
            value={systemPrompt}
            onChange={(e) => setSystemPrompt(e.target.value)}
            className="mt-1 block w-full rounded-md bg-gray-700 border-gray-600 text-gray-100 focus:border-blue-500 focus:ring-blue-500"
            rows={8}
            placeholder="Enter the system prompt that defines the orchestrator's behavior"
          />
        </div>

        <button
          onClick={handleSaveConfig}
          disabled={isConfiguring}
          className="w-full px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:bg-gray-600 disabled:cursor-not-allowed"
        >
          {isConfiguring ? 'Updating Configuration...' : 'Save Configuration'}
        </button>
      </div>
    </div>
  );
};

export default OrchestratorConfig;
