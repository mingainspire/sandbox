import React, { useState } from 'react';
import { AgentType, AgentCreationParams } from '../orchestrator/types';
import { useOrchestrator } from '../orchestrator/OrchestratorProvider';

const AgentCreation: React.FC = () => {
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
      userOverrides: true
    }
  });
  const [capability, setCapability] = useState('');
  const [automatedTask, setAutomatedTask] = useState('');
  const [restrictedAction, setRestrictedAction] = useState('');

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

  const handleCreateAgent = () => {
    if (newAgent.name && newAgent.type) {
      createAgent(newAgent);
      setNewAgent({
        name: '',
        type: 'specialist',
        capabilities: [],
        specialization: '',
        permissions: [],
        behaviorControls: {
          requireApprovalFor: ['task_execution', 'capability_modification', 'integration'],
          automatedTasks: [],
          restrictedActions: [],
          userOverrides: true
        }
      });
    }
  };

  return (
    <div className="p-4 bg-white rounded-lg shadow">
      <h2 className="text-xl font-bold mb-4">Create New Agent</h2>
      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700">Name</label>
          <input
            type="text"
            value={newAgent.name}
            onChange={(e) => setNewAgent({ ...newAgent, name: e.target.value })}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            placeholder="Agent Name"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">Type</label>
          <select
            value={newAgent.type}
            onChange={(e) => setNewAgent({ ...newAgent, type: e.target.value as AgentType })}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
          >
            <option value="orchestrator">Orchestrator</option>
            <option value="coder">Coder</option>
            <option value="specialist">Specialist</option>
            <option value="analyst">Analyst</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">Specialization</label>
          <input
            type="text"
            value={newAgent.specialization}
            onChange={(e) => setNewAgent({ ...newAgent, specialization: e.target.value })}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            placeholder="Agent Specialization"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">Capabilities</label>
          <div className="flex space-x-2">
            <input
              type="text"
              value={capability}
              onChange={(e) => setCapability(e.target.value)}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              placeholder="Add capability"
            />
            <button
              onClick={handleAddCapability}
              className="mt-1 px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600"
            >
              Add
            </button>
          </div>
          <div className="mt-2 flex flex-wrap gap-2">
            {newAgent.capabilities.map((cap, index) => (
              <span
                key={index}
                className="px-2 py-1 bg-blue-100 text-blue-800 rounded-full text-sm"
              >
                {cap}
              </span>
            ))}
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">Automated Tasks</label>
          <div className="flex space-x-2">
            <input
              type="text"
              value={automatedTask}
              onChange={(e) => setAutomatedTask(e.target.value)}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              placeholder="Add automated task"
            />
            <button
              onClick={handleAddAutomatedTask}
              className="mt-1 px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600"
            >
              Add
            </button>
          </div>
          <div className="mt-2 flex flex-wrap gap-2">
            {newAgent.behaviorControls?.automatedTasks.map((task, index) => (
              <span
                key={index}
                className="px-2 py-1 bg-green-100 text-green-800 rounded-full text-sm"
              >
                {task}
              </span>
            ))}
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">Restricted Actions</label>
          <div className="flex space-x-2">
            <input
              type="text"
              value={restrictedAction}
              onChange={(e) => setRestrictedAction(e.target.value)}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              placeholder="Add restricted action"
            />
            <button
              onClick={handleAddRestrictedAction}
              className="mt-1 px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600"
            >
              Add
            </button>
          </div>
          <div className="mt-2 flex flex-wrap gap-2">
            {newAgent.behaviorControls?.restrictedActions.map((action, index) => (
              <span
                key={index}
                className="px-2 py-1 bg-red-100 text-red-800 rounded-full text-sm"
              >
                {action}
              </span>
            ))}
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">Approval Requirements</label>
          <div className="mt-2 space-y-2">
            {newAgent.behaviorControls?.requireApprovalFor.map((action, index) => (
              <div key={index} className="flex items-center">
                <span className="text-sm text-gray-600">{action.replace('_', ' ').toUpperCase()}</span>
              </div>
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
            className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
          />
          <label className="ml-2 block text-sm text-gray-900">
            Allow User Overrides
          </label>
        </div>

        <button
          onClick={handleCreateAgent}
          className="w-full px-4 py-2 bg-green-500 text-white rounded-md hover:bg-green-600"
        >
          Create Agent
        </button>
      </div>
    </div>
  );
};

export default AgentCreation;
