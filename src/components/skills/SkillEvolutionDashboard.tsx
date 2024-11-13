import React, { useState, useEffect } from 'react';
import { Brain, Book, Users, GitBranch, Activity, Target, TrendingUp } from 'lucide-react';
import { useMemoryState } from '../memory/useMemoryState';
import { Pattern, KnowledgeBase, SystemMetrics } from '../memory/types';
import NetworkGraph from '../memory/NetworkGraph';
import RAGMemory from '../memory/RAGMemory';

interface SkillMetrics {
  usageCount: number;
  successRate: number;
  teamAdoption: number;
  learningProgress: number;
}

interface SkillEvolution {
  id: string;
  name: string;
  description: string;
  type: 'function' | 'pattern' | 'concept' | 'technique';
  complexity: number;
  metrics: SkillMetrics;
  relatedSkills: string[];
  knowledgeBases: string[];
  patterns: string[];
}

const SkillEvolutionDashboard: React.FC = () => {
  const { state, learnFromInteraction } = useMemoryState();
  const [activeView, setActiveView] = useState<'metrics' | 'knowledge' | 'team' | 'evolution'>('metrics');
  const [skills, setSkills] = useState<SkillEvolution[]>([]);

  useEffect(() => {
    // Sync skills with memory patterns
    const skillPatterns = state.patterns.filter(p => p.type === 'skill');
    const updatedSkills = skillPatterns.map(pattern => ({
      id: pattern.id,
      name: pattern.description.split(':')[0] || pattern.description,
      description: pattern.description,
      type: pattern.context.find(c => 
        ['function', 'pattern', 'concept', 'technique'].includes(c)
      ) as SkillEvolution['type'] || 'function',
      complexity: pattern.metrics?.frequency || 1,
      metrics: {
        usageCount: pattern.metrics?.frequency || 0,
        successRate: pattern.metrics?.successRate || 0,
        teamAdoption: pattern.metrics?.userAdoption || 0,
        learningProgress: 0
      },
      relatedSkills: pattern.relatedPatterns || [],
      knowledgeBases: state.knowledgeBases
        .filter(kb => kb.tags?.some(tag => pattern.context.includes(tag)))
        .map(kb => kb.id),
      patterns: [pattern.id]
    }));
    setSkills(updatedSkills);
  }, [state.patterns, state.knowledgeBases]);

  const renderMetricsCard = (label: string, value: number, trend?: number) => (
    <div className="p-4 bg-gray-700 rounded-lg">
      <div className="text-sm text-gray-400 mb-1">{label}</div>
      <div className="flex items-center gap-2">
        <div className="text-xl font-semibold text-white">
          {(value * 100).toFixed(1)}%
        </div>
        {trend && (
          <div className={`text-sm ${trend > 0 ? 'text-green-400' : 'text-red-400'}`}>
            {trend > 0 ? '↑' : '↓'} {Math.abs(trend).toFixed(1)}%
          </div>
        )}
      </div>
    </div>
  );

  const renderSkillMetrics = () => (
    <div className="space-y-6">
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {renderMetricsCard('Overall Progress', state.metrics.learningProgress)}
        {renderMetricsCard('Team Adoption', state.metrics.userSatisfaction)}
        {renderMetricsCard('Success Rate', state.metrics.taskCompletion)}
        {renderMetricsCard('System Integration', state.metrics.systemPerformance)}
      </div>

      <div className="bg-gray-800 rounded-lg p-6">
        <h3 className="text-lg font-medium text-white mb-4 flex items-center gap-2">
          <Activity className="w-5 h-5 text-blue-400" />
          Skill Performance
        </h3>
        <div className="space-y-4">
          {skills.map(skill => (
            <div key={skill.id} className="p-4 bg-gray-700 rounded-lg">
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                  <span className="font-medium text-white">{skill.name}</span>
                  <span className="px-2 py-0.5 bg-gray-600 rounded-full text-xs text-gray-300">
                    {skill.type}
                  </span>
                </div>
                <div className="flex items-center gap-4">
                  <span className="text-sm text-gray-400">
                    Usage: {skill.metrics.usageCount}
                  </span>
                  <span className="text-sm text-gray-400">
                    Success: {(skill.metrics.successRate * 100).toFixed(1)}%
                  </span>
                </div>
              </div>
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-400">Learning Progress</span>
                  <span className="text-blue-400">
                    {(skill.metrics.learningProgress * 100).toFixed(1)}%
                  </span>
                </div>
                <div className="w-full bg-gray-600 rounded-full h-2">
                  <div
                    className="bg-blue-500 rounded-full h-2 transition-all duration-500"
                    style={{ width: `${skill.metrics.learningProgress * 100}%` }}
                  />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  const renderKnowledgeIntegration = () => (
    <div className="space-y-6">
      <div className="bg-gray-800 rounded-lg p-6">
        <h3 className="text-lg font-medium text-white mb-4 flex items-center gap-2">
          <Book className="w-5 h-5 text-green-400" />
          Knowledge Base Integration
        </h3>
        <div className="space-y-4">
          {state.knowledgeBases.map(kb => (
            <div key={kb.id} className="p-4 bg-gray-700 rounded-lg">
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                  <span className="font-medium text-white">{kb.name}</span>
                  <span className="px-2 py-0.5 bg-gray-600 rounded-full text-xs text-gray-300">
                    {kb.type}
                  </span>
                </div>
                {kb.metrics && (
                  <span className="text-sm text-gray-400">
                    Relevance: {(kb.metrics.relevanceScore * 100).toFixed(1)}%
                  </span>
                )}
              </div>
              <p className="text-gray-300 text-sm">{kb.description}</p>
              <div className="mt-2 flex flex-wrap gap-2">
                {kb.tags?.map((tag, idx) => (
                  <span
                    key={idx}
                    className="px-2 py-1 bg-gray-600 text-gray-300 rounded-full text-xs"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  const renderTeamCollaboration = () => (
    <div className="space-y-6">
      <div className="bg-gray-800 rounded-lg p-6">
        <h3 className="text-lg font-medium text-white mb-4 flex items-center gap-2">
          <Users className="w-5 h-5 text-purple-400" />
          Team Collaboration
        </h3>
        <div className="space-y-4">
          {skills
            .filter(skill => skill.metrics.teamAdoption > 0)
            .map(skill => (
              <div key={skill.id} className="p-4 bg-gray-700 rounded-lg">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <span className="font-medium text-white">{skill.name}</span>
                    <span className="px-2 py-0.5 bg-purple-900 text-purple-100 rounded-full text-xs">
                      Team Skill
                    </span>
                  </div>
                  <span className="text-sm text-gray-400">
                    Adoption: {(skill.metrics.teamAdoption * 100).toFixed(1)}%
                  </span>
                </div>
                <div className="mt-2">
                  <div className="text-sm text-gray-400 mb-1">Team Progress</div>
                  <div className="w-full bg-gray-600 rounded-full h-2">
                    <div
                      className="bg-purple-500 rounded-full h-2 transition-all duration-500"
                      style={{ width: `${skill.metrics.teamAdoption * 100}%` }}
                    />
                  </div>
                </div>
              </div>
            ))}
        </div>
      </div>
    </div>
  );

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Brain className="w-6 h-6 text-blue-400" />
          <h2 className="text-xl font-semibold text-white">Skill Evolution</h2>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={() => setActiveView('metrics')}
            className={`px-3 py-2 rounded-lg flex items-center gap-2 ${
              activeView === 'metrics' ? 'bg-blue-900 text-blue-100' : 'text-gray-400 hover:bg-gray-700'
            }`}
          >
            <Activity className="w-4 h-4" />
            Metrics
          </button>
          <button
            onClick={() => setActiveView('knowledge')}
            className={`px-3 py-2 rounded-lg flex items-center gap-2 ${
              activeView === 'knowledge' ? 'bg-green-900 text-green-100' : 'text-gray-400 hover:bg-gray-700'
            }`}
          >
            <Book className="w-4 h-4" />
            Knowledge
          </button>
          <button
            onClick={() => setActiveView('team')}
            className={`px-3 py-2 rounded-lg flex items-center gap-2 ${
              activeView === 'team' ? 'bg-purple-900 text-purple-100' : 'text-gray-400 hover:bg-gray-700'
            }`}
          >
            <Users className="w-4 h-4" />
            Team
          </button>
          <button
            onClick={() => setActiveView('evolution')}
            className={`px-3 py-2 rounded-lg flex items-center gap-2 ${
              activeView === 'evolution' ? 'bg-yellow-900 text-yellow-100' : 'text-gray-400 hover:bg-gray-700'
            }`}
          >
            <GitBranch className="w-4 h-4" />
            Evolution
          </button>
        </div>
      </div>

      {activeView === 'metrics' && renderSkillMetrics()}
      {activeView === 'knowledge' && renderKnowledgeIntegration()}
      {activeView === 'team' && renderTeamCollaboration()}
      {activeView === 'evolution' && (
        <div className="bg-gray-800 rounded-lg p-6">
          <h3 className="text-lg font-medium text-white mb-4">Skill Relationships</h3>
          <NetworkGraph 
            memoryState={state}
            currentUserId="system-user"
            onNodeShare={() => {}}
            onNodeEncrypt={() => {}}
          />
        </div>
      )}
    </div>
  );
};

export default SkillEvolutionDashboard;
