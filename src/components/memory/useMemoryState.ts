import { useReducer, useCallback } from 'react';
import { 
  MemoryState,
  Pattern,
  InteractionPattern,
  KnowledgeBase,
  Directive,
  LearningObjective,
  SystemMetrics
} from './types';
import { memoryReducer, initialMemoryState } from './memoryReducer';

type CreatePattern = Omit<Pattern, 'id' | 'createdAt' | 'updatedAt' | 'version' | 'isEncrypted'>;
type CreateInteraction = Omit<InteractionPattern, 'id' | 'createdAt' | 'updatedAt' | 'version' | 'isEncrypted'>;
type CreateKnowledgeBase = Omit<KnowledgeBase, 'id' | 'createdAt' | 'updatedAt' | 'version' | 'isEncrypted'>;
type CreateDirective = Omit<Directive, 'id' | 'createdAt' | 'updatedAt' | 'version' | 'isEncrypted'>;

export function useMemoryState() {
  const [state, dispatch] = useReducer(memoryReducer, initialMemoryState);

  // Knowledge Base Management
  const getKnowledgeBasesByType = useCallback((type: KnowledgeBase['type'] | 'all') => {
    return type === 'all' 
      ? state.knowledgeBases
      : state.knowledgeBases.filter(kb => kb.type === type);
  }, [state.knowledgeBases]);

  const getSystemTenets = useCallback(() => {
    return state.knowledgeBases.find(kb => kb.name === 'System Tenets');
  }, [state.knowledgeBases]);

  const addKnowledgeBase = useCallback((knowledge: CreateKnowledgeBase) => {
    dispatch({ type: 'ADD_KNOWLEDGE', payload: knowledge });
  }, []);

  const updateKnowledgeRelevance = useCallback((id: string, relevanceScore: number) => {
    const knowledge = state.knowledgeBases.find(kb => kb.id === id);
    if (knowledge) {
      dispatch({
        type: 'UPDATE_KNOWLEDGE',
        payload: {
          ...knowledge,
          metrics: {
            ...knowledge.metrics,
            relevanceScore,
            lastAccessed: Date.now()
          }
        }
      });
    }
  }, [state.knowledgeBases]);

  // Directive Management
  const getActiveDirectives = useCallback(() => {
    return state.directives.filter(d => d.status === 'active');
  }, [state.directives]);

  const getDirectivesByPriority = useCallback((priority: Directive['priority'] | 'all') => {
    return priority === 'all'
      ? state.directives
      : state.directives.filter(d => d.priority === priority);
  }, [state.directives]);

  const addDirective = useCallback((directive: CreateDirective) => {
    dispatch({ type: 'ADD_DIRECTIVE', payload: directive });
  }, []);

  const updateDirectiveStatus = useCallback((id: string, status: Directive['status']) => {
    const directive = state.directives.find(d => d.id === id);
    if (directive) {
      dispatch({
        type: 'UPDATE_DIRECTIVE',
        payload: {
          ...directive,
          status,
          metrics: {
            ...directive.metrics,
            completionRate: status === 'completed' ? 1 : directive.metrics?.completionRate || 0
          }
        }
      });
    }
  }, [state.directives]);

  // Pattern Learning and Optimization
  const learnFromInteraction = useCallback((interaction: CreateInteraction) => {
    // Track the interaction
    dispatch({ type: 'ADD_INTERACTION', payload: interaction });

    // Analyze interaction for patterns
    const patterns = analyzeInteractionPatterns(interaction, state.interactions);
    patterns.forEach(pattern => {
      dispatch({ type: 'ADD_PATTERN', payload: pattern });
    });

    // Update knowledge base with learned insights
    const knowledge = extractKnowledge(interaction, patterns);
    if (knowledge) {
      dispatch({ type: 'ADD_KNOWLEDGE', payload: knowledge });
    }

    // Optimize system based on learned patterns
    const optimizations = generateOptimizations(patterns, state.metrics);
    applyOptimizations(optimizations);

    // Update metrics with optimization results
    dispatch({ type: 'UPDATE_METRICS', payload: optimizations.metrics });
  }, [state.interactions, state.metrics]);

  // Pattern Analysis and Learning
  const analyzeInteractionPatterns = (
    interaction: CreateInteraction,
    pastInteractions: InteractionPattern[]
  ): CreatePattern[] => {
    const patterns: CreatePattern[] = [];
    
    // Identify user behavior patterns
    if (interaction.type === 'command' || interaction.type === 'query') {
      const similarInteractions = pastInteractions.filter(past => 
        past.type === interaction.type &&
        past.context.userIntent === interaction.context.userIntent
      );

      if (similarInteractions.length > 0) {
        patterns.push({
          type: 'behavior',
          description: `Repeated ${interaction.type} pattern: ${interaction.context.userIntent}`,
          confidence: calculateConfidence(similarInteractions.length),
          context: [interaction.type, interaction.context.userIntent || ''],
          metrics: {
            frequency: similarInteractions.length + 1,
            successRate: calculateSuccessRate(similarInteractions),
            userAdoption: calculateAdoptionRate(similarInteractions, pastInteractions)
          }
        });
      }
    }

    // Identify system optimization opportunities
    if (interaction.metrics?.responseTime && interaction.metrics.responseTime > 1000) {
      patterns.push({
        type: 'skill',
        description: 'Performance optimization opportunity identified',
        confidence: 0.8,
        context: ['performance', 'optimization'],
        metrics: {
          frequency: 1,
          successRate: 0,
          userAdoption: 0
        }
      });
    }

    return patterns;
  };

  // Knowledge Extraction and Analysis
  const extractKnowledge = (
    interaction: CreateInteraction,
    patterns: CreatePattern[]
  ): CreateKnowledgeBase | null => {
    if (patterns.length === 0) return null;

    return {
      name: `Interaction Pattern Analysis - ${new Date().toISOString()}`,
      description: 'Extracted knowledge from interaction patterns',
      content: JSON.stringify({
        interaction: {
          type: interaction.type,
          context: interaction.context,
          metrics: interaction.metrics
        },
        patterns: patterns
      }),
      type: 'interaction',
      metrics: {
        usageCount: 0,
        relevanceScore: calculateRelevance(patterns),
        lastAccessed: Date.now()
      }
    };
  };

  // System Optimization
  const generateOptimizations = (
    patterns: CreatePattern[],
    currentMetrics: SystemMetrics
  ) => {
    const optimizations = {
      metrics: { ...currentMetrics },
      actions: new Set<string>()
    };

    patterns.forEach(pattern => {
      if (pattern.type === 'skill' && pattern.context.includes('optimization')) {
        optimizations.actions.add('performance_optimization');
        optimizations.metrics.systemPerformance *= 1.1; // 10% improvement target
      }

      if (pattern.type === 'behavior' && pattern.metrics?.successRate) {
        optimizations.actions.add('interaction_optimization');
        optimizations.metrics.interactionQuality = 
          (optimizations.metrics.interactionQuality + pattern.metrics.successRate) / 2;
      }
    });

    return optimizations;
  };

  // Utility Functions
  const calculateConfidence = (frequency: number): number => {
    return Math.min(0.5 + (frequency * 0.1), 1);
  };

  const calculateSuccessRate = (interactions: InteractionPattern[]): number => {
    const successful = interactions.filter(i => i.context.outcome === 'success').length;
    return successful / interactions.length;
  };

  const calculateAdoptionRate = (
    similarInteractions: InteractionPattern[],
    allInteractions: InteractionPattern[]
  ): number => {
    return similarInteractions.length / allInteractions.length;
  };

  const calculateRelevance = (patterns: CreatePattern[]): number => {
    return patterns.reduce((acc, pattern) => acc + pattern.confidence, 0) / patterns.length;
  };

  const applyOptimizations = (optimizations: { actions: Set<string>; metrics: SystemMetrics }) => {
    optimizations.actions.forEach(action => {
      switch (action) {
        case 'performance_optimization':
          // Implement performance optimizations
          console.log('Applying performance optimizations');
          break;
        case 'interaction_optimization':
          // Implement interaction optimizations
          console.log('Applying interaction optimizations');
          break;
      }
    });
  };

  // Analysis Functions
  const getPatternsByType = useCallback((type: Pattern['type']) => {
    return state.patterns.filter(p => p.type === type);
  }, [state.patterns]);

  const getRecentInteractions = useCallback((limit: number = 10) => {
    return [...state.interactions]
      .sort((a, b) => b.createdAt - a.createdAt)
      .slice(0, limit);
  }, [state.interactions]);

  const getOptimizationInsights = useCallback(() => {
    const patterns = state.patterns.filter(p => 
      p.type === 'skill' && p.context.includes('optimization')
    );
    
    return {
      patterns,
      metrics: state.metrics,
      recommendations: patterns.map(p => ({
        type: p.context.find(c => c !== 'optimization') || 'general',
        confidence: p.confidence,
        impact: p.metrics?.successRate || 0
      }))
    };
  }, [state.patterns, state.metrics]);

  return {
    state,
    learnFromInteraction,
    getPatternsByType,
    getRecentInteractions,
    getOptimizationInsights,
    // Knowledge Base functions
    getKnowledgeBasesByType,
    getSystemTenets,
    addKnowledgeBase,
    updateKnowledgeRelevance,
    // Directive functions
    getActiveDirectives,
    getDirectivesByPriority,
    addDirective,
    updateDirectiveStatus
  };
}
