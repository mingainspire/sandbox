import React, { useState, useEffect } from 'react';
import { useOrchestrator } from './OrchestratorProvider';
import { useKnowledge } from '../knowledge/KnowledgeProvider';
import { llmService } from '../../services/llm/service';
import OrchestratorConfig from './OrchestratorConfig';

interface OrchestratorMessage {
  role: 'user' | 'assistant' | 'system';
  content: string;
  timestamp: string;
}

interface OrchestratorState {
  isActive: boolean;
  isProcessing: boolean;
  showConfig: boolean;
  context: {
    currentTask?: string;
    activeAgents?: string[];
    recentActions?: string[];
    systemLoad?: number;
  };
  conversationHistory: OrchestratorMessage[];
}

const skillCreationPrompt = `As an AI Orchestrator, I can help you create skills that can be used by agents in our system. A skill is a reusable piece of functionality with:

1. Clear inputs and outputs
2. Well-defined behavior
3. Test scenarios
4. Implementation details

Would you like me to help you create a new skill? Just describe what you want the skill to do, and I'll guide you through the process.`;

const skillExamples = [
  "text-analysis: Analyze text for sentiment, entities, or key phrases",
  "data-transformation: Convert data between different formats",
  "api-integration: Interact with external APIs",
  "validation: Validate data against specific rules or schemas",
  "calculation: Perform complex calculations or data processing"
];

export const OrchestratorAPI: React.FC = () => {
  const { state: orchestratorState } = useOrchestrator();
  const { getEntriesByType } = useKnowledge();
  const [state, setState] = useState<OrchestratorState>({
    isActive: false,
    isProcessing: false,
    showConfig: false,
    context: {},
    conversationHistory: []
  });
  const [userInput, setUserInput] = useState('');

  const activateOrchestrator = async () => {
    setState(prev => ({ ...prev, isActive: true }));
    const behaviorTemplates = getEntriesByType('behavior');
    const promptTemplates = getEntriesByType('prompt');

    const activationMessage: OrchestratorMessage = {
      role: 'system',
      content: 'Orchestrator activated. Loading behavior templates and knowledge base...',
      timestamp: new Date().toISOString()
    };

    const welcomeMessage: OrchestratorMessage = {
      role: 'assistant',
      content: `I'm here to help you create and manage skills, tools, and agents. Let's start with creating some basic skills that can be used as building blocks.

Here are some example skill categories:
${skillExamples.map(ex => `• ${ex}`).join('\n')}

${skillCreationPrompt}`,
      timestamp: new Date().toISOString()
    };

    setState(prev => ({
      ...prev,
      conversationHistory: [...prev.conversationHistory, activationMessage, welcomeMessage]
    }));
  };

  const handleSendMessage = async () => {
    if (!userInput.trim() || state.isProcessing) return;

    setState(prev => ({
      ...prev,
      isProcessing: true,
      conversationHistory: [
        ...prev.conversationHistory,
        {
          role: 'user',
          content: userInput,
          timestamp: new Date().toISOString()
        }
      ]
    }));

    setUserInput('');

    try {
      // Add context about skills to the system prompt
      const skillContext = `Current Skills: ${orchestratorState.skills.length}
Available Categories: ${Array.from(new Set(orchestratorState.skills.map(s => s.category))).join(', ')}`;

      const response = await llmService.chat([
        {
          role: 'system',
          content: `You are an AI Orchestrator expert at creating and managing skills. ${skillContext}`
        },
        ...state.conversationHistory.map(msg => ({
          role: msg.role,
          content: msg.content
        })),
        { role: 'user', content: userInput }
      ]);

      if ('error' in response) {
        throw new Error(response.error);
      }

      setState(prev => ({
        ...prev,
        isProcessing: false,
        conversationHistory: [
          ...prev.conversationHistory,
          {
            role: 'assistant',
            content: response.content,
            timestamp: new Date().toISOString()
          }
        ]
      }));
    } catch (error) {
      setState(prev => ({
        ...prev,
        isProcessing: false,
        conversationHistory: [
          ...prev.conversationHistory,
          {
            role: 'system',
            content: `Error: ${error instanceof Error ? error.message : 'Unknown error occurred'}`,
            timestamp: new Date().toISOString()
          }
        ]
      }));
    }
  };

  const toggleConfig = () => {
    setState(prev => ({ ...prev, showConfig: !prev.showConfig }));
  };

  return (
    <div className="bg-gray-800 rounded-lg p-6 space-y-4">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-bold text-gray-100">Orchestrator Interface</h2>
        <div className="flex space-x-2">
          <button
            onClick={toggleConfig}
            className="px-4 py-2 bg-gray-700 text-white rounded-md hover:bg-gray-600"
          >
            {state.showConfig ? 'Hide Config' : 'Configure'}
          </button>
          <button
            onClick={() => state.isActive ? null : activateOrchestrator()}
            className={`px-4 py-2 rounded-md ${
              state.isActive
                ? 'bg-green-600 text-white cursor-default'
                : 'bg-blue-600 text-white hover:bg-blue-700'
            }`}
          >
            {state.isActive ? 'Active' : 'Activate Orchestrator'}
          </button>
        </div>
      </div>

      {state.showConfig && (
        <OrchestratorConfig />
      )}

      <div className="h-96 overflow-y-auto bg-gray-900 rounded-lg p-4 space-y-4">
        {state.conversationHistory.map((message, index) => (
          <div
            key={index}
            className={`p-3 rounded-lg ${
              message.role === 'user'
                ? 'bg-blue-900 ml-8'
                : message.role === 'system'
                ? 'bg-purple-900'
                : 'bg-gray-700 mr-8'
            }`}
          >
            <div className="text-gray-100 whitespace-pre-wrap">{message.content}</div>
            <div className="text-xs text-gray-400 mt-1">
              {new Date(message.timestamp).toLocaleTimeString()}
            </div>
          </div>
        ))}
        {state.isProcessing && (
          <div className="bg-gray-700 p-3 rounded-lg mr-8 animate-pulse">
            Processing...
          </div>
        )}
      </div>

      {state.isActive && (
        <div className="flex space-x-2">
          <input
            type="text"
            value={userInput}
            onChange={(e) => setUserInput(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
            placeholder="Describe the skill you want to create..."
            className="flex-1 bg-gray-700 text-gray-100 rounded-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <button
            onClick={handleSendMessage}
            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:bg-gray-600"
            disabled={state.isProcessing}
          >
            Send
          </button>
        </div>
      )}
    </div>
  );
};

export default OrchestratorAPI;
