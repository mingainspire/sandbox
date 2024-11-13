import React, { useState } from 'react';
import { useOrchestrator } from '../orchestrator/OrchestratorProvider';
import AgentDevelopment from './AgentDevelopment';
import AgentCreation from './AgentCreation';
import { Agent } from '../orchestrator/types';

const AgentMonitor: React.FC = () => {
  const { agents, getActiveAgents } = useOrchestrator();
  const activeAgents = getActiveAgents();
  const [selectedAgent, setSelectedAgent] = useState<Agent | null>(null);
  const [showCreateAgent, setShowCreateAgent] = useState(false);

  const getAgentMetrics = (agentId: string) => {
    const agent = agents.find(a => a.id === agentId);
    return {
      tasksCompleted: agent?.metadata?.performance?.tasksCompleted || 0,
      successRate: agent?.metadata?.performance?.successRate || 0,
      lastActive: new Date().toISOString()
    };
  };

  return (
    <div className="bg-gray-800 rounded-lg shadow p-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-bold text-gray-100">Agent Activity Monitor</h2>
        <div className="flex items-center space-x-4">
          <div className="text-sm text-gray-400">
            Active Agents: {activeAgents.length} / Total: {agents.length}
          </div>
          <button
            onClick={() => setShowCreateAgent(true)}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            Create New Agent
          </button>
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {agents.map((agent) => {
          const metrics = getAgentMetrics(agent.id);
          return (
            <div
              key={agent.id}
              className="border border-gray-700 bg-gray-900 rounded-lg p-4 hover:shadow-lg transition-shadow"
            >
              <div className="flex justify-between items-start mb-3">
                <div>
                  <h3 className="font-semibold text-lg text-gray-100">{agent.name}</h3>
                  <p className="text-sm text-gray-400">Type: {agent.type}</p>
                </div>
                <span
                  className={`px-2 py-1 rounded-full text-sm ${
                    agent.status === 'active'
                      ? 'bg-green-900 text-green-100'
                      : agent.status === 'idle'
                      ? 'bg-yellow-900 text-yellow-100'
                      : 'bg-gray-700 text-gray-300'
                  }`}
                >
                  {agent.status}
                </span>
              </div>

              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-400">Tasks Completed:</span>
                  <span className="font-medium text-gray-200">{metrics.tasksCompleted}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-400">Success Rate:</span>
                  <span className="font-medium text-gray-200">{metrics.successRate}%</span>
                </div>
              </div>

              <div className="mt-4">
                <h4 className="text-sm font-medium text-gray-300 mb-2">Capabilities</h4>
                <div className="flex flex-wrap gap-2">
                  {agent.capabilities.map((capability, index) => (
                    <span
                      key={index}
                      className="px-2 py-1 bg-blue-900 text-blue-100 rounded-full text-xs"
                    >
                      {capability}
                    </span>
                  ))}
                </div>
              </div>

              {agent.metadata?.behaviorControls && (
                <div className="mt-4">
                  <h4 className="text-sm font-medium text-gray-300 mb-2">Behavior Controls</h4>
                  <div className="space-y-2 text-sm">
                    <div>
                      <span className="text-gray-400">Approval Required For:</span>
                      <div className="flex flex-wrap gap-1 mt-1">
                        {agent.metadata.behaviorControls.requireApprovalFor.map((action, index) => (
                          <span
                            key={index}
                            className="px-2 py-1 bg-purple-900 text-purple-100 rounded-full text-xs"
                          >
                            {action.replace('_', ' ')}
                          </span>
                        ))}
                      </div>
                    </div>
                    {agent.metadata.behaviorControls.automatedTasks.length > 0 && (
                      <div>
                        <span className="text-gray-400">Automated Tasks:</span>
                        <div className="flex flex-wrap gap-1 mt-1">
                          {agent.metadata.behaviorControls.automatedTasks.map((task, index) => (
                            <span
                              key={index}
                              className="px-2 py-1 bg-green-900 text-green-100 rounded-full text-xs"
                            >
                              {task}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              )}

              <div className="mt-4 flex justify-between">
                <button
                  className="px-3 py-1 text-sm bg-blue-600 text-white rounded hover:bg-blue-700"
                  onClick={() => setSelectedAgent(agent)}
                >
                  Develop Agent
                </button>
                <button
                  className="px-3 py-1 text-sm bg-purple-600 text-white rounded hover:bg-purple-700"
                  onClick={() => {/* Implement task assignment */}}
                >
                  Assign Task
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {agents.length === 0 && (
        <div className="text-center py-8 text-gray-400">
          No agents currently registered in the system.
          Create a new agent to get started.
        </div>
      )}

      {selectedAgent && (
        <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center p-4">
          <div className="bg-gray-800 rounded-lg max-w-3xl w-full">
            <AgentDevelopment
              agent={selectedAgent}
              onClose={() => setSelectedAgent(null)}
            />
          </div>
        </div>
      )}

      {showCreateAgent && (
        <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center p-4">
          <div className="bg-gray-800 rounded-lg max-w-3xl w-full">
            <AgentCreation onClose={() => setShowCreateAgent(false)} />
          </div>
        </div>
      )}
    </div>
  );
};

export default AgentMonitor;
