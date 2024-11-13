import React, { useState, useEffect } from 'react';
import { useOrchestrator } from '../orchestrator/OrchestratorProvider';
import { useKnowledge, useOrchestratorKnowledge, useConversationFlow } from '../knowledge/KnowledgeProvider';
import { llmService } from '../../services/llm';
import { AgentType } from '../orchestrator/types';

interface ConversationalAgentCreationProps {
  onClose: () => void;
}

type MessageRole = 'user' | 'assistant' | 'system';

interface Message {
  role: MessageRole;
  content: string;
}

interface ConversationState {
  messages: Message[];
  currentStep: string;
  agentConfig: {
    goal?: string;
    name?: string;
    type?: AgentType;
    capabilities?: string[];
    specialization?: string;
    promptSequences?: string[];
    testScenarios?: string[];
  };
}

const ConversationalAgentCreation: React.FC<ConversationalAgentCreationProps> = ({ onClose }) => {
  const { createAgent } = useOrchestrator();
  const { getAgentCreationKnowledge } = useOrchestratorKnowledge();
  const { getNextPrompt, processResponse } = useConversationFlow();
  const [isThinking, setIsThinking] = useState(false);
  const [userInput, setUserInput] = useState('');
  const [conversation, setConversation] = useState<ConversationState>({
    messages: [
      {
        role: 'assistant',
        content: "Hello! I'm here to help you create a new agent. What specific task or problem are you trying to solve?"
      }
    ],
    currentStep: 'initial',
    agentConfig: {}
  });

  const addMessage = (role: MessageRole, content: string) => {
    return {
      role,
      content
    } as Message;
  };

  const handleUserInput = async () => {
    if (!userInput.trim() || isThinking) return;

    setIsThinking(true);
    const newMessages = [...conversation.messages, addMessage('user', userInput)];
    setConversation(prev => ({
      ...prev,
      messages: newMessages
    }));
    setUserInput('');

    try {
      // Process user input based on current step
      switch (conversation.currentStep) {
        case 'initial': {
          // User has provided the goal
          const suggestedCapabilities = await llmService.suggestAgentCapabilities(userInput);
          if ('error' in suggestedCapabilities) {
            throw new Error(suggestedCapabilities.error);
          }

          const response = await llmService.chat([
            ...newMessages.map(m => ({ role: m.role, content: m.content })),
            {
              role: 'system',
              content: `Based on the user's goal, suggest these capabilities: ${suggestedCapabilities.join(', ')}. Ask the user to confirm or modify the suggested capabilities.`
            }
          ]);

          if ('error' in response) {
            throw new Error(response.error);
          }

          setConversation(prev => ({
            messages: [...newMessages, addMessage('assistant', response.content)],
            currentStep: 'capabilities',
            agentConfig: {
              ...prev.agentConfig,
              goal: userInput,
              capabilities: suggestedCapabilities
            }
          }));
          break;
        }

        case 'capabilities': {
          // User has confirmed/modified capabilities, generate prompt sequences
          const promptSequences = await llmService.generateAgentPrompts({
            goal: conversation.agentConfig.goal!,
            type: 'specialist',
            capabilities: conversation.agentConfig.capabilities!
          });

          if ('error' in promptSequences) {
            throw new Error(promptSequences.error);
          }

          const response = await llmService.chat([
            ...newMessages.map(m => ({ role: m.role, content: m.content })),
            {
              role: 'system',
              content: `Based on the confirmed capabilities, suggest these prompt sequences: ${promptSequences.join(', ')}. Ask the user to review and confirm the prompt sequences.`
            }
          ]);

          if ('error' in response) {
            throw new Error(response.error);
          }

          setConversation(prev => ({
            messages: [...newMessages, addMessage('assistant', response.content)],
            currentStep: 'prompts',
            agentConfig: {
              ...prev.agentConfig,
              promptSequences
            }
          }));
          break;
        }

        case 'prompts': {
          // User has confirmed prompt sequences, suggest test scenarios
          const testScenarios = await llmService.suggestTestScenarios({
            goal: conversation.agentConfig.goal!,
            type: 'specialist',
            capabilities: conversation.agentConfig.capabilities!,
            promptSequences: conversation.agentConfig.promptSequences!
          });

          if ('error' in testScenarios) {
            throw new Error(testScenarios.error);
          }

          const response = await llmService.chat([
            ...newMessages.map(m => ({ role: m.role, content: m.content })),
            {
              role: 'system',
              content: `Based on the confirmed prompt sequences, suggest these test scenarios: ${testScenarios.join(', ')}. Ask the user to review and confirm the test scenarios.`
            }
          ]);

          if ('error' in response) {
            throw new Error(response.error);
          }

          setConversation(prev => ({
            messages: [...newMessages, addMessage('assistant', response.content)],
            currentStep: 'tests',
            agentConfig: {
              ...prev.agentConfig,
              testScenarios
            }
          }));
          break;
        }

        case 'tests': {
          // User has confirmed test scenarios, ask for agent name
          const response = await llmService.chat([
            ...newMessages.map(m => ({ role: m.role, content: m.content })),
            {
              role: 'system',
              content: 'Ask the user to provide a name for the agent.'
            }
          ]);

          if ('error' in response) {
            throw new Error(response.error);
          }

          setConversation(prev => ({
            messages: [...newMessages, addMessage('assistant', response.content)],
            currentStep: 'name',
            agentConfig: prev.agentConfig
          }));
          break;
        }

        case 'name': {
          // Create the agent with all configured parameters
          const config = {
            name: userInput,
            type: 'specialist' as AgentType,
            capabilities: conversation.agentConfig.capabilities || [],
            specialization: conversation.agentConfig.goal,
            behaviorControls: {
              requireApprovalFor: ['task_execution', 'capability_modification', 'integration'],
              automatedTasks: [],
              restrictedActions: [],
              userOverrides: true,
              promptSequences: conversation.agentConfig.promptSequences || [],
              testScenarios: conversation.agentConfig.testScenarios || []
            }
          };

          createAgent(config);

          const response = await llmService.chat([
            ...newMessages.map(m => ({ role: m.role, content: m.content })),
            {
              role: 'system',
              content: `Agent "${userInput}" has been created successfully. Provide a summary of the agent's configuration.`
            }
          ]);

          if ('error' in response) {
            throw new Error(response.error);
          }

          setConversation(prev => ({
            messages: [...newMessages, addMessage('assistant', response.content)],
            currentStep: 'complete',
            agentConfig: {
              ...prev.agentConfig,
              name: userInput
            }
          }));

          // Close the dialog after a brief delay
          setTimeout(onClose, 5000);
          break;
        }

        default:
          break;
      }
    } catch (err) {
      const error = err as Error;
      setConversation(prev => ({
        ...prev,
        messages: [
          ...prev.messages,
          addMessage('assistant', `I apologize, but I encountered an error: ${error.message}. Please try again or start over.`)
        ]
      }));
    } finally {
      setIsThinking(false);
    }
  };

  return (
    <div className="p-6 bg-gray-800 text-gray-100 rounded-lg max-h-[80vh] flex flex-col">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-bold">Create New Agent</h2>
        <button onClick={onClose} className="text-gray-400 hover:text-gray-200">✕</button>
      </div>

      <div className="flex-1 overflow-y-auto mb-4 space-y-4">
        {conversation.messages.map((message, index) => (
          <div
            key={index}
            className={`p-3 rounded-lg ${
              message.role === 'user'
                ? 'bg-blue-900 ml-8'
                : 'bg-gray-700 mr-8'
            }`}
          >
            {message.content}
          </div>
        ))}
        {isThinking && (
          <div className="bg-gray-700 p-3 rounded-lg mr-8 animate-pulse">
            Thinking...
          </div>
        )}
      </div>

      <div className="flex space-x-2">
        <input
          type="text"
          value={userInput}
          onChange={(e) => setUserInput(e.target.value)}
          onKeyPress={(e) => e.key === 'Enter' && handleUserInput()}
          placeholder="Type your response..."
          className="flex-1 rounded-md bg-gray-700 border-gray-600 text-gray-100 focus:border-blue-500 focus:ring-blue-500"
          disabled={isThinking || conversation.currentStep === 'complete'}
        />
        <button
          onClick={handleUserInput}
          disabled={isThinking || conversation.currentStep === 'complete'}
export default ConversationalAgentCreation;
