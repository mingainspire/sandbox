import React, { useState } from 'react';
import { AgentType, AgentCreationParams } from '../orchestrator/types';
import { useOrchestrator } from '../orchestrator/OrchestratorProvider';

interface AgentCreationProps {
  onClose: () => void;
}

const AgentCreation: React.FC<AgentCreationProps> = ({ onClose }) => {
  const { createAgent } = useOrchestrator();
  const [newAgent, setNewAgent] = useState<AgentCreationParams>({
    name: '',
    type: 'specialist',
    capabilities: [],
    specialization: '',
    permissions: [],
    behaviorControls: {
      requireApprovalFor: ['task_execution', 'capability_modification', 'integration'],
      automatedTasks: [],
      restrictedActions: [],
      userOverrides: true,
      promptSequences: [],
      testScenarios: []
    }
  });
  const [capability, setCapability] = useState('');
  const [automatedTask, setAutomatedTask] = useState('');
  const [restrictedAction, setRestrictedAction] = useState('');
  const [promptSequence, setPromptSequence] = useState('');
  const [testScenario, setTestScenario] = useState('');

  const handleAddCapability = () => {
    if (capability.trim()) {
      setNewAgent({
        ...newAgent,
        capabilities: [...newAgent.capabilities, capability.trim()]
      });
      setCapability('');
    }
  };

  const handleAddAutomatedTask = () => {
    if (automatedTask.trim() && newAgent.behaviorControls) {
      setNewAgent({
        ...newAgent,
        behaviorControls: {
          ...newAgent.behaviorControls,
          automatedTasks: [...newAgent.behaviorControls.automatedTasks, automatedTask.trim()]
        }
      });
      setAutomatedTask('');
    }
  };

  const handleAddRestrictedAction = () => {
    if (restrictedAction.trim() && newAgent.behaviorControls) {
      setNewAgent({
        ...newAgent,
        behaviorControls: {
          ...newAgent.behaviorControls,
          restrictedActions: [...newAgent.behaviorControls.restrictedActions, restrictedAction.trim()]
        }
      });
      setRestrictedAction('');
    }
  };

  const handleAddPromptSequence = () => {
    if (promptSequence.trim() && newAgent.behaviorControls) {
      setNewAgent({
        ...newAgent,
        behaviorControls: {
          ...newAgent.behaviorControls,
          promptSequences: [...(newAgent.behaviorControls.promptSequences || []), promptSequence.trim()]
        }
      });
      setPromptSequence('');
    }
  };

  const handleAddTestScenario = () => {
    if (testScenario.trim() && newAgent.behaviorControls) {
      setNewAgent({
        ...newAgent,
        behaviorControls: {
          ...newAgent.behaviorControls,
          testScenarios: [...(newAgent.behaviorControls.testScenarios || []), testScenario.trim()]
        }
      });
      setTestScenario('');
    }
  };

  const handleCreateAgent = () => {
    if (newAgent.name && newAgent.type) {
      createAgent(newAgent);
      onClose();
    }
  };

  return (
    <div className="p-6 bg-gray-800 text-gray-100">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-bold text-gray-100">Create New Agent</h2>
        <button onClick={onClose} className="text-gray-400 hover:text-gray-200">✕</button>
      </div>

      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-300">Name</label>
          <input
            type="text"
            value={newAgent.name}
            onChange={(e) => setNewAgent({ ...newAgent, name: e.target.value })}
            className="mt-1 block w-full rounded-md bg-gray-700 border-gray-600 text-gray-100 focus:border-blue-500 focus:ring-blue-500"
            placeholder="Agent Name"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-300">Type</label>
          <select
            value={newAgent.type}
            onChange={(e) => setNewAgent({ ...newAgent, type: e.target.value as AgentType })}
            className="mt-1 block w-full rounded-md bg-gray-700 border-gray-600 text-gray-100 focus:border-blue-500 focus:ring-blue-500"
          >
            <option value="orchestrator">Orchestrator</option>
            <option value="coder">Coder</option>
            <option value="specialist">Specialist</option>
            <option value="analyst">Analyst</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-300">Specialization</label>
          <input
            type="text"
            value={newAgent.specialization}
            onChange={(e) => setNewAgent({ ...newAgent, specialization: e.target.value })}
            className="mt-1 block w-full rounded-md bg-gray-700 border-gray-600 text-gray-100 focus:border-blue-500 focus:ring-blue-500"
            placeholder="Agent Specialization"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-300">Capabilities</label>
          <div className="flex space-x-2">
            <input
              type="text"
              value={capability}
              onChange={(e) => setCapability(e.target.value)}
              className="mt-1 block w-full rounded-md bg-gray-700 border-gray-600 text-gray-100 focus:border-blue-500 focus:ring-blue-500"
              placeholder="Add capability"
            />
            <button
              onClick={handleAddCapability}
              className="mt-1 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
            >
              Add
            </button>
          </div>
          <div className="mt-2 flex flex-wrap gap-2">
            {newAgent.capabilities.map((cap, index) => (
              <span
                key={index}
                className="px-2 py-1 bg-blue-900 text-blue-100 rounded-full text-sm"
              >
                {cap}
              </span>
            ))}
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-300">Prompt Sequences</label>
          <div className="flex space-x-2">
            <input
              type="text"
              value={promptSequence}
              onChange={(e) => setPromptSequence(e.target.value)}
              className="mt-1 block w-full rounded-md bg-gray-700 border-gray-600 text-gray-100 focus:border-blue-500 focus:ring-blue-500"
              placeholder="Add prompt sequence"
            />
            <button
              onClick={handleAddPromptSequence}
              className="mt-1 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
            >
              Add
            </button>
          </div>
          <div className="mt-2 flex flex-wrap gap-2">
            {newAgent.behaviorControls?.promptSequences?.map((sequence, index) => (
              <span
                key={index}
                className="px-2 py-1 bg-purple-900 text-purple-100 rounded-full text-sm"
              >
                {sequence}
              </span>
            ))}
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-300">Test Scenarios</label>
          <div className="flex space-x-2">
            <input
              type="text"
              value={testScenario}
              onChange={(e) => setTestScenario(e.target.value)}
              className="mt-1 block w-full rounded-md bg-gray-700 border-gray-600 text-gray-100 focus:border-blue-500 focus:ring-blue-500"
              placeholder="Add test scenario"
            />
            <button
              onClick={handleAddTestScenario}
              className="mt-1 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
            >
              Add
            </button>
          </div>
          <div className="mt-2 flex flex-wrap gap-2">
            {newAgent.behaviorControls?.testScenarios?.map((scenario, index) => (
              <span
                key={index}
                className="px-2 py-1 bg-green-900 text-green-100 rounded-full text-sm"
              >
                {scenario}
              </span>
            ))}
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-300">Automated Tasks</label>
          <div className="flex space-x-2">
            <input
              type="text"
              value={automatedTask}
              onChange={(e) => setAutomatedTask(e.target.value)}
              className="mt-1 block w-full rounded-md bg-gray-700 border-gray-600 text-gray-100 focus:border-blue-500 focus:ring-blue-500"
              placeholder="Add automated task"
            />
            <button
              onClick={handleAddAutomatedTask}
              className="mt-1 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
            >
              Add
            </button>
          </div>
          <div className="mt-2 flex flex-wrap gap-2">
            {newAgent.behaviorControls?.automatedTasks.map((task, index) => (
              <span
                key={index}
                className="px-2 py-1 bg-green-900 text-green-100 rounded-full text-sm"
              >
                {task}
              </span>
            ))}
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-300">Restricted Actions</label>
          <div className="flex space-x-2">
            <input
              type="text"
              value={restrictedAction}
              onChange={(e) => setRestrictedAction(e.target.value)}
              className="mt-1 block w-full rounded-md bg-gray-700 border-gray-600 text-gray-100 focus:border-blue-500 focus:ring-blue-500"
              placeholder="Add restricted action"
            />
            <button
              onClick={handleAddRestrictedAction}
              className="mt-1 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
            >
              Add
            </button>
          </div>
          <div className="mt-2 flex flex-wrap gap-2">
            {newAgent.behaviorControls?.restrictedActions.map((action, index) => (
              <span
                key={index}
                className="px-2 py-1 bg-red-900 text-red-100 rounded-full text-sm"
              >
                {action}
              </span>
            ))}
          </div>
        </div>

        <div className="flex items-center">
          <input
            type="checkbox"
            checked={newAgent.behaviorControls?.userOverrides}
            onChange={(e) => setNewAgent({
              ...newAgent,
              behaviorControls: {
                ...newAgent.behaviorControls!,
                userOverrides: e.target.checked
              }
            })}
            className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-600 bg-gray-700 rounded"
          />
          <label className="ml-2 block text-sm text-gray-300">
            Allow User Overrides
          </label>
        </div>

        <button
          onClick={handleCreateAgent}
          className="w-full px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700"
        >
          Create Agent
        </button>
      </div>
    </div>
  );
};

export default AgentCreation;
