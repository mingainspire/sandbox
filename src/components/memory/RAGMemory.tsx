import React, { useState, useEffect, useCallback } from 'react';
import { Brain, CheckCircle2, XCircle, MessageSquare, Target, Book, Zap, RefreshCcw, Upload, MessageCircle, Settings, Trash2, Plus, Download, AlertTriangle, Clock, Filter, Save, Share2, TrendingUp, Activity, BookOpen, Shield } from 'lucide-react';
import { Pattern, KnowledgeBase, SystemMetrics, Directive } from './types';
import { useMemoryState } from './useMemoryState';
import NetworkGraph from './NetworkGraph';

const RAGMemory: React.FC = () => {
  const { state, learnFromInteraction, getPatternsByType, getOptimizationInsights } = useMemoryState();
  const [activeTab, setActiveTab] = useState<'patterns' | 'knowledge' | 'optimization' | 'visualization'>('knowledge');
  const [activePattern, setActivePattern] = useState<'all' | 'preference' | 'behavior' | 'skill' | 'directive'>('all');
  const [activeKnowledgeType, setActiveKnowledgeType] = useState<'all' | 'system' | 'task' | 'user' | 'interaction'>('all');
  const [showResetConfirm, setShowResetConfirm] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');
  const [filterPriority, setFilterPriority] = useState<'all' | 'low' | 'medium' | 'high'>('all');

  // Get optimization insights periodically
  const [insights, setInsights] = useState(getOptimizationInsights());
  useEffect(() => {
    const interval = setInterval(() => {
      setInsights(getOptimizationInsights());
    }, 5000);
    return () => clearInterval(interval);
  }, [getOptimizationInsights]);

  // Network graph handlers
  const handleNodeShare = useCallback((node: any, sharingLevel: 'private' | 'team' | 'public') => {
    console.log(`Sharing node ${node.id} with level ${sharingLevel}`);
    // Implement sharing logic here
  }, []);

  const handleNodeEncrypt = useCallback((node: any, secretKey: string) => {
    console.log(`Encrypting node ${node.id}`);
    // Implement encryption logic here
  }, []);

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

  const renderKnowledgeAndDirectives = () => (
    <div className="space-y-6">
      <div className="flex items-center gap-2 mb-4">
        {['all', 'system', 'task', 'user', 'interaction'].map(type => (
          <button
            key={type}
            onClick={() => setActiveKnowledgeType(type as typeof activeKnowledgeType)}
            className={`px-3 py-1.5 rounded-lg text-sm transition-colors ${
              activeKnowledgeType === type
                ? 'bg-blue-900 text-blue-100'
                : 'text-gray-300 hover:bg-gray-700'
            }`}
          >
            {type.charAt(0).toUpperCase() + type.slice(1)}
          </button>
        ))}
      </div>

      {/* System Tenets Section */}
      {(activeKnowledgeType === 'all' || activeKnowledgeType === 'system') && (
        <div className="bg-gray-800 rounded-lg p-6">
          <div className="flex items-center gap-2 mb-4">
            <Shield className="w-5 h-5 text-blue-400" />
            <h3 className="text-lg font-medium text-white">System Tenets</h3>
          </div>
          <div className="space-y-2">
            {state.knowledgeBases
              .filter(kb => kb.name === 'System Tenets')
              .map(kb => (
                <div key={kb.id} className="space-y-2">
                  {kb.content.split('\n').map((tenet, idx) => (
                    <div key={idx} className="flex items-center gap-2 p-2 bg-gray-700 rounded-lg">
                      <div className="w-6 h-6 flex items-center justify-center bg-blue-900 rounded-full text-xs text-white">
                        {idx + 1}
                      </div>
                      <p className="text-gray-200">{tenet.substring(2)}</p>
                    </div>
                  ))}
                </div>
              ))}
          </div>
        </div>
      )}

      {/* Knowledge Bases Section */}
      <div className="bg-gray-800 rounded-lg p-6">
        <div className="flex items-center gap-2 mb-4">
          <BookOpen className="w-5 h-5 text-green-400" />
          <h3 className="text-lg font-medium text-white">Knowledge Bases</h3>
        </div>
        <div className="space-y-4">
          {state.knowledgeBases
            .filter(kb => kb.name !== 'System Tenets' && (activeKnowledgeType === 'all' || kb.type === activeKnowledgeType))
            .map(kb => (
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
                <p className="text-gray-300 text-sm mb-2">{kb.description}</p>
                <p className="text-gray-400 text-sm">{kb.content}</p>
              </div>
            ))}
        </div>
      </div>

      {/* Active Directives Section */}
      <div className="bg-gray-800 rounded-lg p-6">
        <div className="flex items-center gap-2 mb-4">
          <Zap className="w-5 h-5 text-yellow-400" />
          <h3 className="text-lg font-medium text-white">Active Directives</h3>
        </div>
        <div className="space-y-4">
          {state.directives
            .filter(d => d.status === 'active')
            .map(directive => (
              <div key={directive.id} className="p-4 bg-gray-700 rounded-lg">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <span className={`px-2 py-0.5 rounded-full text-xs ${
                      directive.priority === 'high'
                        ? 'bg-red-900 text-red-100'
                        : directive.priority === 'medium'
                        ? 'bg-yellow-900 text-yellow-100'
                        : 'bg-green-900 text-green-100'
                    }`}>
                      {directive.priority}
                    </span>
                    <span className="font-medium text-white">{directive.name}</span>
                  </div>
                  {directive.metrics && (
                    <span className="text-sm text-gray-400">
                      Success Rate: {(directive.metrics.successRate * 100).toFixed(1)}%
                    </span>
                  )}
                </div>
                <p className="text-gray-300 text-sm">{directive.description}</p>
              </div>
            ))}
        </div>
      </div>
    </div>
  );

  const renderOptimizationInsights = () => (
    <div className="space-y-6">
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {renderMetricsCard('System Performance', state.metrics.systemPerformance)}
        {renderMetricsCard('Learning Progress', state.metrics.learningProgress)}
        {renderMetricsCard('Interaction Quality', state.metrics.interactionQuality)}
        {renderMetricsCard('Task Completion', state.metrics.taskCompletion)}
      </div>

      <div className="bg-gray-800 rounded-lg p-6">
        <h3 className="text-lg font-medium text-white mb-4">Optimization Patterns</h3>
        <div className="space-y-4">
          {insights.patterns.map(pattern => (
            <div key={pattern.id} className="p-4 bg-gray-700 rounded-lg">
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                  <Activity className="w-5 h-5 text-blue-400" />
                  <span className="font-medium text-white">{pattern.description}</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-sm text-gray-400">
                    Confidence: {(pattern.confidence * 100).toFixed(1)}%
                  </span>
                  {pattern.metrics && (
                    <span className="text-sm text-gray-400">
                      Success Rate: {(pattern.metrics.successRate * 100).toFixed(1)}%
                    </span>
                  )}
                </div>
              </div>
              <div className="flex flex-wrap gap-2">
                {pattern.context.map((ctx, idx) => (
                  <span
                    key={idx}
                    className="px-2 py-1 bg-gray-600 text-gray-300 rounded-full text-xs"
                  >
                    {ctx}
                  </span>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="bg-gray-800 rounded-lg p-6">
        <h3 className="text-lg font-medium text-white mb-4">Recommendations</h3>
        <div className="space-y-4">
          {insights.recommendations.map((rec, idx) => (
            <div key={idx} className="flex items-center justify-between p-4 bg-gray-700 rounded-lg">
              <div className="flex items-center gap-3">
                <TrendingUp className="w-5 h-5 text-green-400" />
                <div>
                  <div className="font-medium text-white capitalize">
                    {rec.type} Optimization
                  </div>
                  <div className="text-sm text-gray-400">
                    Potential impact: {(rec.impact * 100).toFixed(1)}%
                  </div>
                </div>
              </div>
              <div className="text-sm text-gray-400">
                Confidence: {(rec.confidence * 100).toFixed(1)}%
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
          <h2 className="text-xl font-semibold text-white">System Memory</h2>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={() => setActiveTab('knowledge')}
            className={`px-3 py-2 rounded-lg flex items-center gap-2 ${
              activeTab === 'knowledge' ? 'bg-blue-900 text-blue-100' : 'text-gray-400 hover:bg-gray-700'
            }`}
          >
            <BookOpen className="w-4 h-4" />
            Knowledge & Directives
          </button>
          <button
            onClick={() => setActiveTab('patterns')}
            className={`px-3 py-2 rounded-lg flex items-center gap-2 ${
              activeTab === 'patterns' ? 'bg-purple-900 text-purple-100' : 'text-gray-400 hover:bg-gray-700'
            }`}
          >
            <Target className="w-4 h-4" />
            Patterns
          </button>
          <button
            onClick={() => setActiveTab('optimization')}
            className={`px-3 py-2 rounded-lg flex items-center gap-2 ${
              activeTab === 'optimization' ? 'bg-green-900 text-green-100' : 'text-gray-400 hover:bg-gray-700'
            }`}
          >
            <Activity className="w-4 h-4" />
            Optimization
          </button>
          <button
            onClick={() => setActiveTab('visualization')}
            className={`px-3 py-2 rounded-lg flex items-center gap-2 ${
              activeTab === 'visualization' ? 'bg-yellow-900 text-yellow-100' : 'text-gray-400 hover:bg-gray-700'
            }`}
          >
            <Share2 className="w-4 h-4" />
            Visualization
          </button>
        </div>
      </div>

      {activeTab === 'knowledge' ? (
        renderKnowledgeAndDirectives()
      ) : activeTab === 'optimization' ? (
        renderOptimizationInsights()
      ) : activeTab === 'visualization' ? (
        <div className="bg-gray-800 rounded-lg p-6">
          <h3 className="text-lg font-medium text-white mb-4">System Relationships</h3>
          <NetworkGraph 
            memoryState={state} 
            currentUserId="system-user"
            onNodeShare={handleNodeShare}
            onNodeEncrypt={handleNodeEncrypt}
          />
        </div>
      ) : (
        <div className="space-y-4">
          <div className="flex items-center gap-2">
            {['all', 'preference', 'behavior', 'skill', 'directive'].map(type => (
              <button
                key={type}
                onClick={() => setActivePattern(type as typeof activePattern)}
                className={`px-3 py-1.5 rounded-lg text-sm transition-colors ${
                  activePattern === type
                    ? type === 'all'
                      ? 'bg-gray-700 text-white'
                      : type === 'preference'
                      ? 'bg-blue-900 text-blue-100'
                      : type === 'behavior'
                      ? 'bg-purple-900 text-purple-100'
                      : type === 'skill'
                      ? 'bg-green-900 text-green-100'
                      : 'bg-yellow-900 text-yellow-100'
                    : 'text-gray-300 hover:bg-gray-700'
                }`}
              >
                {type.charAt(0).toUpperCase() + type.slice(1)}s
              </button>
            ))}
          </div>

          <div className="space-y-4">
            {state.patterns
              .filter(p => activePattern === 'all' || p.type === activePattern)
              .map(pattern => (
                <div key={pattern.id} className="p-4 bg-gray-800 rounded-lg border border-gray-700">
                  <div className="flex items-start justify-between">
                    <div>
                      <div className="flex items-center gap-2 mb-2">
                        <span className={`px-2 py-0.5 rounded-full text-xs ${
                          pattern.type === 'preference'
                            ? 'bg-blue-900 text-blue-100'
                            : pattern.type === 'behavior'
                            ? 'bg-purple-900 text-purple-100'
                            : pattern.type === 'skill'
                            ? 'bg-green-900 text-green-100'
                            : 'bg-yellow-900 text-yellow-100'
                        }`}>
                          {pattern.type}
                        </span>
                        <span className="text-sm text-gray-400">
                          Confidence: {(pattern.confidence * 100).toFixed(1)}%
                        </span>
                      </div>
                      <p className="text-gray-200">{pattern.description}</p>
                      {pattern.impact && (
                        <div className="mt-2">
                          <h4 className="text-sm font-medium text-gray-300 mb-1">Impact:</h4>
                          <ul className="list-disc list-inside text-sm text-gray-400">
                            {pattern.impact.map((imp, idx) => (
                              <li key={idx}>{imp}</li>
                            ))}
                          </ul>
                        </div>
                      )}
                      <div className="flex flex-wrap gap-2 mt-2">
                        {pattern.context.map((ctx, idx) => (
                          <span
                            key={idx}
                            className="px-2 py-1 bg-gray-700 text-gray-300 rounded-full text-xs"
                          >
                            {ctx}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default RAGMemory;
