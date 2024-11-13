import React from 'react';
import { Play, Pause, AlertCircle, Circle } from 'lucide-react';
import type { Agent } from '../types';

const agents: Agent[] = [
  {
    id: '1',
    name: 'Task Processor',
    status: 'working',
    type: 'Processing',
    currentTask: 'Data Analysis',
    performance: 95,
    lastActive: '2024-03-10T10:30:00Z',
    tasksCompleted: 234,
    tools: ['Tool A', 'Tool B'],
    skills: ['Skill A', 'Skill B'],
    functions: ['Function A', 'Function B'],
  },
  {
    id: '2',
    name: 'Content Generator',
    status: 'idle',
    type: 'Generation',
    performance: 88,
    lastActive: '2024-03-10T09:45:00Z',
    tasksCompleted: 189,
    tools: ['Tool C', 'Tool D'],
    skills: ['Skill C', 'Skill D'],
    functions: ['Function C', 'Function D'],
  },
  {
    id: '3',
    name: 'Data Collector',
    status: 'error',
    type: 'Collection',
    performance: 76,
    lastActive: '2024-03-10T08:15:00Z',
    tasksCompleted: 156,
    tools: ['Tool E', 'Tool F'],
    skills: ['Skill E', 'Skill F'],
    functions: ['Function E', 'Function F'],
  },
];

const statusColors = {
  working: 'text-green-500',
  idle: 'text-gray-400',
  paused: 'text-yellow-500',
  error: 'text-red-500',
};

const StatusIcon = ({ status }: { status: Agent['status'] }) => {
  switch (status) {
    case 'working':
      return <Play className={`w-4 h-4 ${statusColors[status]}`} />;
    case 'paused':
      return <Pause className={`w-4 h-4 ${statusColors[status]}`} />;
    case 'error':
      return <AlertCircle className={`w-4 h-4 ${statusColors[status]}`} />;
    default:
      return <Circle className={`w-4 h-4 ${statusColors[status]}`} />;
  }
};

export default function AgentsList() {
  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100">
      <div className="p-6 border-b border-gray-100">
        <h2 className="text-lg font-semibold text-gray-900">Active Agents</h2>
      </div>
      <div className="divide-y divide-gray-100">
        {agents.map((agent) => (
          <div key={agent.id} className="p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center space-x-3">
                <StatusIcon status={agent.status} />
                <span className="font-medium text-gray-900">{agent.name}</span>
                <span className="text-sm text-gray-500">({agent.type})</span>
              </div>
              <button className="px-3 py-1 text-sm bg-gray-100 hover:bg-gray-200 rounded-full">
                Manage
              </button>
            </div>
            <div className="grid grid-cols-3 gap-4">
              <div>
                <p className="text-sm text-gray-500">Current Task</p>
                <p className="font-medium">
                  {agent.currentTask || 'No active task'}
                </p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Performance</p>
                <p className="font-medium">{agent.performance}%</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Tasks Completed</p>
                <p className="font-medium">{agent.tasksCompleted}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Tools</p>
                <p className="font-medium">{agent.tools.join(', ')}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Skills</p>
                <p className="font-medium">{agent.skills.join(', ')}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Functions</p>
                <p className="font-medium">{agent.functions.join(', ')}</p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
