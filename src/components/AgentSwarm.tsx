import React, { useState } from 'react';
import { Brain, GitBranch, Network, Target, Users, MessageSquare, Workflow, Zap, Settings } from 'lucide-react';

interface SwarmAgent {
  id: string;
  name: string;
  model: string;
  type: 'primary' | 'specialist' | 'coordinator';
  status: 'active' | 'idle' | 'learning';
  instructions: string;
  capabilities: string[];
  functions: {
    name: string;
    description: string;
    trigger: string;
  }[];
  connections: string[];
  metrics: {
    tasksCompleted: number;
    avgResponseTime: number;
    successRate: number;
  };
  tools: string[];
  skills: string[];
}

interface SwarmTask {
  id: string;
  title: string;
  status: 'pending' | 'in_progress' | 'completed' | 'transferred';
  assignedAgent: string;
  priority: 'low' | 'medium' | 'high';
  context: string;
  createdAt: string;
  completedAt?: string;
  transferHistory?: {
    from: string;
    to: string;
    reason: string;
    timestamp: string;
  }[];
}

const initialAgents: SwarmAgent[] = [
  {
    id: 'agent-1',
    name: 'Primary Coordinator',
    model: 'gpt-4',
    type: 'coordinator',
    status: 'active',
    instructions: 'Coordinate task distribution and agent collaboration',
    capabilities: ['task_distribution', 'workflow_optimization', 'agent_coordination'],
    functions: [
      {
        name: 'transfer_task',
        description: 'Transfer task to specialist agent',
        trigger: 'complexity_threshold'
      },
      {
        name: 'initiate_collaboration',
        description: 'Start multi-agent collaboration',
        trigger: 'task_requirements'
      }
    ],
    connections: ['agent-2', 'agent-3'],
    metrics: {
      tasksCompleted: 145,
      avgResponseTime: 0.8,
      successRate: 0.95
    },
    tools: ['Tool A', 'Tool B'],
    skills: ['Skill A', 'Skill B']
  },
  {
    id: 'agent-2',
    name: 'Analysis Specialist',
    model: 'gpt-3.5-turbo',
    type: 'specialist',
    status: 'idle',
    instructions: 'Specialize in data analysis and pattern recognition',
    capabilities: ['data_analysis', 'pattern_recognition', 'insight_generation'],
    functions: [
      {
        name: 'analyze_data',
        description: 'Perform deep data analysis',
        trigger: 'data_complexity'
      }
    ],
    connections: ['agent-1'],
    metrics: {
      tasksCompleted: 89,
      avgResponseTime: 1.2,
      successRate: 0.92
    },
    tools: ['Tool C', 'Tool D'],
    skills: ['Skill C', 'Skill D']
  }
];

const initialTasks: SwarmTask[] = [
  {
    id: 'task-1',
    title: 'Complex Data Analysis',
    status: 'in_progress',
    assignedAgent: 'agent-2',
    priority: 'high',
    context: 'Analyze customer behavior patterns',
    createdAt: new Date().toISOString(),
    transferHistory: [
      {
        from: 'agent-1',
        to: 'agent-2',
        reason: 'Specialized analysis required',
        timestamp: new Date().toISOString()
      }
    ]
  }
];

export default function AgentSwarm() {
  const [agents, setAgents] = useState<SwarmAgent[]>(initialAgents);
  const [tasks, setTasks] = useState<SwarmTask[]>(initialTasks);
  const [selectedAgent, setSelectedAgent] = useState<SwarmAgent | null>(null);
  const [showMetrics, setShowMetrics] = useState(true);

  const handleAgentSelect = (agent: SwarmAgent) => {
    setSelectedAgent(selectedAgent?.id === agent.id ? null : agent);
  };

  const renderAgentMetrics = (agent: SwarmAgent) => (
    <div className="grid grid-cols-3 gap-4 mt-4">
      <div className="p-3 bg-blue-50 rounded-lg">
        <div className="text-sm text-blue-600">Tasks Completed</div>
        <div className="text-lg font-semibold text-blue-900">
          {agent.metrics.tasksCompleted}
        </div>
      </div>
      <div className="p-3 bg-green-50 rounded-lg">
        <div className="text-sm text-green-600">Avg Response Time</div>
        <div className="text-lg font-semibold text-green-900">
          {agent.metrics.avgResponseTime}s
        </div>
      </div>
      <div className="p-3 bg-purple-50 rounded-lg">
        <div className="text-sm text-purple-600">Success Rate</div>
        <div className="text-lg font-semibold text-purple-900">
          {(agent.metrics.successRate * 100).toFixed(0)}%
        </div>
      </div>
    </div>
  );

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100">
      <div className="p-6 border-b border-gray-100">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-semibold text-gray-900">Agent Swarm</h2>
          <div className="flex items-center gap-2">
            <button
              onClick={() => setShowMetrics(!showMetrics)}
              className={`px-4 py-2 rounded-lg flex items-center gap-2 transition-colors ${
                showMetrics 
                  ? 'bg-blue-100 text-blue-700' 
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              <Target className="w-4 h-4" />
              <span className="text-sm">Metrics</span>
            </button>
          </div>
        </div>
      </div>

      <div className="p-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Agent List */}
          <div>
            <h3 className="text-sm font-medium text-gray-900 mb-4">Active Agents</h3>
            <div className="space-y-4">
              {agents.map(agent => (
                <div
                  key={agent.id}
                  className={`p-4 rounded-lg border transition-colors cursor-pointer ${
                    selectedAgent?.id === agent.id
                      ? 'border-blue-200 bg-blue-50'
                      : 'border-gray-200 hover:border-blue-200'
                  }`}
                  onClick={() => handleAgentSelect(agent)}
                >
                  <div className="flex items-start justify-between">
                    <div className="flex items-start gap-3">
                      {agent.type === 'coordinator' ? (
                        <Brain className="w-5 h-5 text-purple-500 mt-0.5" />
                      ) : agent.type === 'specialist' ? (
                        <Target className="w-5 h-5 text-blue-500 mt-0.5" />
                      ) : (
                        <Users className="w-5 h-5 text-green-500 mt-0.5" />
                      )}
                      <div>
                        <h4 className="font-medium text-gray-900">{agent.name}</h4>
                        <div className="flex items-center gap-2 mt-1">
                          <span className={`px-2 py-0.5 rounded-full text-xs ${
                            agent.status === 'active' ? 'bg-green-100 text-green-800' :
                            agent.status === 'learning' ? 'bg-blue-100 text-blue-800' :
                            'bg-gray-100 text-gray-800'
                          }`}>
                            {agent.status}
                          </span>
                          <span className="text-sm text-gray-500">{agent.model}</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {showMetrics && renderAgentMetrics(agent)}

                  {selectedAgent?.id === agent.id && (
                    <div className="mt-4 space-y-4">
                      <div>
                        <h4 className="text-sm font-medium text-gray-900 mb-2">Capabilities</h4>
                        <div className="flex flex-wrap gap-2">
                          {agent.capabilities.map((cap, idx) => (
                            <span
                              key={idx}
                              className="px-2 py-1 bg-gray-100 text-gray-700 rounded-full text-xs"
                            >
                              {cap}
                            </span>
                          ))}
                        </div>
                      </div>

                      <div>
                        <h4 className="text-sm font-medium text-gray-900 mb-2">Functions</h4>
                        <div className="space-y-2">
                          {agent.functions.map((fn, idx) => (
                            <div
                              key={idx}
                              className="p-2 bg-gray-50 rounded-lg border border-gray-200"
                            >
                              <div className="flex items-start gap-2">
                                <Workflow className="w-4 h-4 text-gray-400 mt-0.5" />
                                <div>
                                  <div className="text-sm font-medium text-gray-900">
                                    {fn.name}
                                  </div>
                                  <div className="text-xs text-gray-500 mt-1">
                                    {fn.description}
                                  </div>
                                  <div className="text-xs text-gray-400 mt-1">
                                    Trigger: {fn.trigger}
                                  </div>
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>

                      <div>
                        <h4 className="text-sm font-medium text-gray-900 mb-2">Connections</h4>
                        <div className="flex flex-wrap gap-2">
                          {agent.connections.map((conn, idx) => {
                            const connectedAgent = agents.find(a => a.id === conn);
                            return (
                              <div
                                key={idx}
                                className="px-3 py-1.5 bg-blue-50 text-blue-700 rounded-full text-xs flex items-center gap-2"
                              >
                                <Network className="w-3 h-3" />
                                {connectedAgent?.name || conn}
                              </div>
                            );
                          })}
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Task Queue */}
          <div>
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-sm font-medium text-gray-900">Active Tasks</h3>
              <button className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors flex items-center gap-2">
                <Zap className="w-4 h-4" />
                New Task
              </button>
            </div>

            <div className="space-y-4">
              {tasks.map(task => (
                <div
                  key={task.id}
                  className="p-4 rounded-lg border border-gray-200 bg-white"
                >
                  <div className="flex items-start justify-between mb-3">
                    <div>
                      <h4 className="font-medium text-gray-900">{task.title}</h4>
                      <div className="flex items-center gap-2 mt-1">
                        <span className={`px-2 py-0.5 rounded-full text-xs ${
                          task.status === 'in_progress' ? 'bg-blue-100 text-blue-800' :
                          task.status === 'completed' ? 'bg-green-100 text-green-800' :
                          task.status === 'transferred' ? 'bg-yellow-100 text-yellow-800' :
                          'bg-gray-100 text-gray-800'
                        }`}>
                          {task.status}
                        </span>
                        <span className={`px-2 py-0.5 rounded-full text-xs ${
                          task.priority === 'high' ? 'bg-red-100 text-red-800' :
                          task.priority === 'medium' ? 'bg-yellow-100 text-yellow-800' :
                          'bg-blue-100 text-blue-800'
                        }`}>
                          {task.priority} priority
                        </span>
                      </div>
                    </div>
                    <Settings className="w-5 h-5 text-gray-400 hover:text-gray-600 cursor-pointer" />
                  </div>

                  <p className="text-sm text-gray-600 mb-3">{task.context}</p>

                  <div className="flex items-center gap-2 text-sm text-gray-500">
                    <Users className="w-4 h-4" />
                    Assigned to: {agents.find(a => a.id === task.assignedAgent)?.name}
                  </div>

                  {task.transferHistory && task.transferHistory.length > 0 && (
                    <div className="mt-3 pt-3 border-t border-gray-100">
                      <div className="text-sm font-medium text-gray-900 mb-2">Transfer History</div>
                      <div className="space-y-2">
                        {task.transferHistory.map((transfer, idx) => (
                          <div
                            key={idx}
                            className="flex items-start gap-2 text-sm"
                          >
                            <GitBranch className="w-4 h-4 text-gray-400 mt-0.5" />
                            <div>
                              <div className="text-gray-600">
                                Transferred from {agents.find(a => a.id === transfer.from)?.name} to{' '}
                                {agents.find(a => a.id === transfer.to)?.name}
                              </div>
                              <div className="text-gray-500 text-xs mt-0.5">
                                Reason: {transfer.reason}
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* System Overview */}
        <div className="mt-8 p-6 bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg border border-blue-100">
          <div className="flex items-center gap-3 mb-4">
            <Brain className="w-6 h-6 text-blue-600" />
            <h3 className="text-lg font-medium text-blue-900">Swarm Intelligence</h3>
          </div>
          <p className="text-sm text-blue-800 mb-4">
            The agent swarm operates as a coordinated system, with specialized agents collaborating
            on complex tasks. Each agent can transfer tasks based on expertise and workload.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="p-4 bg-white rounded-lg border border-blue-200">
              <div className="flex items-center gap-2 mb-2">
                <MessageSquare className="w-4 h-4 text-blue-500" />
                <h4 className="font-medium text-blue-900">Communication</h4>
              </div>
              <p className="text-sm text-blue-700">
                Agents communicate through a structured protocol, sharing context and insights
              </p>
            </div>
            <div className="p-4 bg-white rounded-lg border border-blue-200">
              <div className="flex items-center gap-2 mb-2">
                <GitBranch className="w-4 h-4 text-blue-500" />
                <h4 className="font-medium text-blue-900">Task Distribution</h4>
              </div>
              <p className="text-sm text-blue-700">
                Dynamic task allocation based on agent capabilities and current workload
              </p>
            </div>
            <div className="p-4 bg-white rounded-lg border border-blue-200">
              <div className="flex items-center gap-2 mb-2">
                <Target className="w-4 h-4 text-blue-500" />
                <h4 className="font-medium text-blue-900">Learning</h4>
              </div>
              <p className="text-sm text-blue-700">
                Continuous improvement through pattern recognition and feedback loops
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
