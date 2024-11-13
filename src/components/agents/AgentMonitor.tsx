import React, { useState } from 'react';
import { useOrchestrator } from '../orchestrator/OrchestratorProvider';
import AgentDevelopment from './AgentDevelopment';
import { Agent } from '../orchestrator/types';

const AgentMonitor: React.FC = () => {
  const { agents, getActiveAgents } = useOrchestrator();
  const activeAgents = getActiveAgents();
  const [selectedAgent, setSelectedAgent] = useState<Agent | null>(null);

  const getAgentMetrics = (agentId: string) => {
    const agent = agents.find(a => a.id === agentId);
    return {
      tasksCompleted: agent?.metadata?.performance?.tasksCompleted || 0,
      successRate: agent?.metadata?.performance?.successRate || 0,
      lastActive: new Date().toISOString()
    };
  };

  return (
    <div className="bg-white rounded-lg shadow p-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-bold">Agent Activity Monitor</h2>
        <div className="text-sm text-gray-500">
          Active Agents: {activeAgents.length} / Total: {agents.length}
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {agents.map((agent) => {
          const metrics = getAgentMetrics(agent.id);
          return (
            <div
              key={agent.id}
              className="border rounded-lg p-4 hover:shadow-lg transition-shadow"
            >
              <div className="flex justify-between items-start mb-3">
                <div>
                  <h3 className="font-semibold text-lg">{agent.name}</h3>
                  <p className="text-sm text-gray-600">Type: {agent.type}</p>
                </div>
                <span
                  className={`px-2 py-1 rounded-full text-sm ${
                    agent.status === 'active'
                      ? 'bg-green-100 text-green-800'
                      : agent.status === 'idle'
                      ? 'bg-yellow-100 text-yellow-800'
                      : 'bg-gray-100 text-gray-800'
                  }`}
                >
                  {agent.status}
                </span>
              </div>

              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Tasks Completed:</span>
                  <span className="font-medium">{metrics.tasksCompleted}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Success Rate:</span>
                  <span className="font-medium">{metrics.successRate}%</span>
                </div>
              </div>

              <div className="mt-4">
                <h4 className="text-sm font-medium text-gray-700 mb-2">Capabilities</h4>
                <div className="flex flex-wrap gap-2">
                  {agent.capabilities.map((capability, index) => (
                    <span
                      key={index}
                      className="px-2 py-1 bg-blue-50 text-blue-600 rounded-full text-xs"
                    >
                      {capability}
                    </span>
                  ))}
                </div>
              </div>

              <div className="mt-4 flex justify-between">
                <button
                  className="px-3 py-1 text-sm bg-blue-500 text-white rounded hover:bg-blue-600"
                  onClick={() => setSelectedAgent(agent)}
                >
                  Develop Agent
                </button>
                <button
                  className="px-3 py-1 text-sm bg-purple-500 text-white rounded hover:bg-purple-600"
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
        <div className="text-center py-8 text-gray-500">
          No agents currently registered in the system.
          Create a new agent to get started.
        </div>
      )}

      {selectedAgent && (
        <AgentDevelopment
          agent={selectedAgent}
          onClose={() => setSelectedAgent(null)}
        />
      )}
    </div>
  );
};

export default AgentMonitor;
