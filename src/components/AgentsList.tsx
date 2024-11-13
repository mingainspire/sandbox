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
    connections: ['2', '3']
  },
  {
    id: '2',
    name: 'Content Generator',
    status: 'idle',
    type: 'Generation',
    performance: 88,
    lastActive: '2024-03-10T09:45:00Z',
    tasksCompleted: 189,
    connections: ['1']
  },
  {
    id: '3',
    name: 'Data Collector',
    status: 'error',
    type: 'Collection',
    performance: 76,
    lastActive: '2024-03-10T08:15:00Z',
    tasksCompleted: 156,
    connections: ['1']
  },
];

const statusColors = {
  working: 'text-green-400',
  idle: 'text-gray-400',
  paused: 'text-yellow-400',
  error: 'text-red-400',
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
    <div className="bg-gray-800 rounded-xl shadow-sm border border-gray-700">
      <div className="p-6 border-b border-gray-700">
        <h2 className="text-lg font-semibold text-white">Active Agents</h2>
      </div>
      <div className="divide-y divide-gray-700">
        {agents.map((agent) => (
          <div key={agent.id} className="p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center space-x-3">
                <StatusIcon status={agent.status} />
                <span className="font-medium text-white">{agent.name}</span>
                <span className="text-sm text-gray-400">({agent.type})</span>
              </div>
              <button className="px-3 py-1 text-sm bg-gray-700 hover:bg-gray-600 text-gray-200 rounded-full transition-colors">
                Manage
              </button>
            </div>
            <div className="grid grid-cols-3 gap-4">
              <div>
                <p className="text-sm text-gray-400">Current Task</p>
                <p className="font-medium text-gray-200">
                  {agent.currentTask || 'No active task'}
                </p>
              </div>
              <div>
                <p className="text-sm text-gray-400">Performance</p>
                <p className="font-medium text-gray-200">{agent.performance}%</p>
              </div>
              <div>
                <p className="text-sm text-gray-400">Tasks Completed</p>
                <p className="font-medium text-gray-200">{agent.tasksCompleted}</p>
              </div>
              <div>
                <p className="text-sm text-gray-400">Last Active</p>
                <p className="font-medium text-gray-200">
                  {new Date(agent.lastActive).toLocaleString()}
                </p>
              </div>
              <div>
                <p className="text-sm text-gray-400">Connected Agents</p>
                <p className="font-medium text-gray-200">
                  {agent.connections.length} connections
                </p>
              </div>
              <div>
                <p className="text-sm text-gray-400">Status</p>
                <p className={`font-medium ${statusColors[agent.status]} capitalize`}>
                  {agent.status}
                </p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
