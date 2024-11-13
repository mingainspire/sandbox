import React from 'react';
import { Brain, Network, Database, GitBranch, Users, Wrench, Zap } from 'lucide-react';

interface MetricCard {
  title: string;
  value: string;
  change: number;
  icon: React.ReactNode;
}

interface ProjectCard {
  id: string;
  title: string;
  status: string;
  matchScore: number;
  tools: string[];
  skills: string[];
  agents: string[];
}

const Dashboard = () => {
  const metrics: MetricCard[] = [
    { 
      title: 'Active Skills',
      value: '24',
      change: 8,
      icon: <Zap className="w-6 h-6 text-blue-400" />
    },
    {
      title: 'Tool Usage',
      value: '156',
      change: 12,
      icon: <Wrench className="w-6 h-6 text-purple-400" />
    },
    {
      title: 'Agent Interactions',
      value: '1,234',
      change: 23,
      icon: <Users className="w-6 h-6 text-green-400" />
    },
    {
      title: 'Memory Access',
      value: '892',
      change: 15,
      icon: <Database className="w-6 h-6 text-yellow-400" />
    }
  ];

  const projects: ProjectCard[] = [
    {
      id: '1',
      title: 'Data Analysis Pipeline',
      status: 'In Progress',
      matchScore: 92,
      tools: ['RAG Memory', 'Data Processor', 'Visualizer'],
      skills: ['Data Analysis', 'Pattern Recognition'],
      agents: ['Data Analyst', 'Visualization Expert']
    },
    {
      id: '2',
      title: 'Content Generation System',
      status: 'Active',
      matchScore: 88,
      tools: ['Content Generator', 'Language Model'],
      skills: ['Content Creation', 'SEO Optimization'],
      agents: ['Content Writer', 'Editor']
    },
    {
      id: '3',
      title: 'Customer Support Enhancement',
      status: 'Planning',
      matchScore: 95,
      tools: ['Support Bot', 'Knowledge Base'],
      skills: ['Customer Service', 'Problem Resolution'],
      agents: ['Support Agent', 'Knowledge Manager']
    }
  ];

  return (
    <div className="space-y-6">
      {/* Metrics Overview */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {metrics.map((metric, index) => (
          <div key={index} className="bg-gray-800 rounded-lg p-6 border border-gray-700">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-400 text-sm">{metric.title}</p>
                <p className="text-2xl font-semibold text-white mt-1">{metric.value}</p>
              </div>
              {metric.icon}
            </div>
            <div className="mt-2">
              <span className={`text-sm ${metric.change > 0 ? 'text-green-400' : 'text-red-400'}`}>
                {metric.change > 0 ? '+' : ''}{metric.change}%
              </span>
              <span className="text-gray-400 text-sm ml-1">vs last week</span>
            </div>
          </div>
        ))}
      </div>

      {/* System Integration Visualization */}
      <div className="bg-gray-800 rounded-lg p-6 border border-gray-700">
        <h2 className="text-lg font-semibold text-white mb-4">System Integration</h2>
        <div className="flex items-center justify-between p-4 bg-gray-900 rounded-lg">
          <div className="flex items-center space-x-8">
            <div className="text-center">
              <Database className="w-8 h-8 text-blue-400 mx-auto" />
              <p className="mt-2 text-sm text-gray-300">RAG Memory</p>
            </div>
            <GitBranch className="w-6 h-6 text-gray-600" />
            <div className="text-center">
              <Brain className="w-8 h-8 text-purple-400 mx-auto" />
              <p className="mt-2 text-sm text-gray-300">Skills</p>
            </div>
            <GitBranch className="w-6 h-6 text-gray-600" />
            <div className="text-center">
              <Wrench className="w-8 h-8 text-green-400 mx-auto" />
              <p className="mt-2 text-sm text-gray-300">Tools</p>
            </div>
            <GitBranch className="w-6 h-6 text-gray-600" />
            <div className="text-center">
              <Users className="w-8 h-8 text-yellow-400 mx-auto" />
              <p className="mt-2 text-sm text-gray-300">Agents</p>
            </div>
          </div>
        </div>
      </div>

      {/* AI-Matched Projects */}
      <div className="space-y-4">
        <h2 className="text-lg font-semibold text-white">AI-Matched Projects</h2>
        {projects.map((project) => (
          <div key={project.id} className="bg-gray-800 rounded-lg p-6 border border-gray-700">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="text-lg font-medium text-white">{project.title}</h3>
                <p className="text-sm text-gray-400">{project.status}</p>
              </div>
              <div className="bg-blue-900 text-blue-200 px-3 py-1 rounded-full text-sm">
                {project.matchScore}% Match
              </div>
            </div>
            <div className="grid grid-cols-3 gap-4">
              <div>
                <p className="text-sm text-gray-400 mb-2">Tools</p>
                <div className="flex flex-wrap gap-2">
                  {project.tools.map((tool, index) => (
                    <span key={index} className="bg-gray-700 text-gray-300 px-2 py-1 rounded text-sm">
                      {tool}
                    </span>
                  ))}
                </div>
              </div>
              <div>
                <p className="text-sm text-gray-400 mb-2">Skills</p>
                <div className="flex flex-wrap gap-2">
                  {project.skills.map((skill, index) => (
                    <span key={index} className="bg-purple-900 text-purple-200 px-2 py-1 rounded text-sm">
                      {skill}
                    </span>
                  ))}
                </div>
              </div>
              <div>
                <p className="text-sm text-gray-400 mb-2">Agents</p>
                <div className="flex flex-wrap gap-2">
                  {project.agents.map((agent, index) => (
                    <span key={index} className="bg-green-900 text-green-200 px-2 py-1 rounded text-sm">
                      {agent}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Dashboard;
