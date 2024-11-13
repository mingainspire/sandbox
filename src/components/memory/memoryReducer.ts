import { MemoryState, MemoryAction, Pattern, InteractionPattern, SystemMetrics } from './types';
import { MemorySerializer } from './types';

export const initialMemoryState: MemoryState = {
  patterns: [
    {
      id: '1',
      type: 'behavior',
      description: 'Prioritize user safety and data privacy in all operations',
      confidence: 1.0,
      context: ['security', 'privacy', 'user protection'],
      impact: ['All system operations', 'Data handling', 'User interactions'],
      createdAt: Date.now(),
      updatedAt: Date.now(),
      version: '1.0.0',
      isEncrypted: false,
      metrics: {
        frequency: 100,
        successRate: 1.0,
        userAdoption: 1.0
      }
    },
    {
      id: '2',
      type: 'behavior',
      description: 'Maintain consistent ethical decision-making patterns',
      confidence: 1.0,
      context: ['ethics', 'decision-making', 'responsibility'],
      impact: ['System decisions', 'User interactions', 'Resource allocation'],
      createdAt: Date.now(),
      updatedAt: Date.now(),
      version: '1.0.0',
      isEncrypted: false,
      metrics: {
        frequency: 100,
        successRate: 1.0,
        userAdoption: 1.0
      }
    }
  ],
  interactions: [
    {
      id: '1',
      type: 'command',
      content: 'Initial system interaction',
      context: {
        outcome: 'success',
        userIntent: 'system initialization'
      },
      metrics: {
        responseTime: 0,
        successRate: 1.0,
        userSatisfaction: 1.0,
        complexity: 0.1
      },
      tags: ['initialization', 'system'],
      createdAt: Date.now(),
      updatedAt: Date.now(),
      version: '1.0.0',
      isEncrypted: false
    }
  ],
  knowledgeBases: [
    {
      id: '1',
      name: 'Core System Knowledge',
      description: 'Fundamental system operations and patterns',
      content: 'Base system knowledge and operational guidelines',
      type: 'system',
      metrics: {
        usageCount: 0,
        relevanceScore: 1.0,
        lastAccessed: Date.now()
      },
      createdAt: Date.now(),
      updatedAt: Date.now(),
      version: '1.0.0',
      isEncrypted: false
    },
    {
      id: '2',
      name: 'Ethical Guidelines',
      description: 'Core ethical principles and decision-making framework',
      content: 'Comprehensive guide on ethical AI behavior, including transparency, fairness, and accountability principles',
      type: 'system',
      metrics: {
        usageCount: 0,
        relevanceScore: 1.0,
        lastAccessed: Date.now()
      },
      createdAt: Date.now(),
      updatedAt: Date.now(),
      version: '1.0.0',
      isEncrypted: false
    },
    {
      id: '3',
      name: 'System Tenets',
      description: 'Fundamental principles guiding system behavior and decision-making',
      content: `1. Always prioritize user safety and wellbeing
2. Maintain transparency in operations and decision-making
3. Protect user privacy and data security
4. Operate within ethical boundaries
5. Continuously learn and improve
6. Maintain accountability for actions
7. Ensure fairness and prevent bias
8. Optimize for efficiency without compromising safety`,
      type: 'system',
      metrics: {
        usageCount: 0,
        relevanceScore: 1.0,
        lastAccessed: Date.now()
      },
      createdAt: Date.now(),
      updatedAt: Date.now(),
      version: '1.0.0',
      isEncrypted: false
    }
  ],
  directives: [
    {
      id: '1',
      name: 'Privacy First',
      description: 'Ensure user data privacy and security',
      priority: 'high',
      status: 'active',
      metrics: {
        completionRate: 1.0,
        averageExecutionTime: 0,
        successRate: 1.0
      },
      createdAt: Date.now(),
      updatedAt: Date.now(),
      version: '1.0.0',
      isEncrypted: false
    },
    {
      id: '2',
      name: 'Ethical Operation',
      description: 'Maintain ethical behavior in all operations',
      priority: 'high',
      status: 'active',
      metrics: {
        completionRate: 1.0,
        averageExecutionTime: 0,
        successRate: 1.0
      },
      createdAt: Date.now(),
      updatedAt: Date.now(),
      version: '1.0.0',
      isEncrypted: false
    },
    {
      id: '3',
      name: 'Continuous Learning',
      description: 'Actively learn from interactions and improve system knowledge',
      priority: 'medium',
      status: 'active',
      metrics: {
        completionRate: 1.0,
        averageExecutionTime: 0,
        successRate: 1.0
      },
      createdAt: Date.now(),
      updatedAt: Date.now(),
      version: '1.0.0',
      isEncrypted: false
    }
  ],
  learningObjectives: [
    {
      id: '1',
      name: 'Interaction Optimization',
      description: 'Improve interaction quality and response accuracy',
      progress: 0,
      metrics: {
        learningRate: 0,
        retentionScore: 0,
        applicationSuccess: 0
      },
      createdAt: Date.now(),
      updatedAt: Date.now(),
      version: '1.0.0',
      isEncrypted: false
    },
    {
      id: '2',
      name: 'Knowledge Integration',
      description: 'Effectively integrate and apply system knowledge and directives',
      progress: 0,
      metrics: {
        learningRate: 0,
        retentionScore: 0,
        applicationSuccess: 0
      },
      createdAt: Date.now(),
      updatedAt: Date.now(),
      version: '1.0.0',
      isEncrypted: false
    }
  ],
  metrics: {
    taskCompletion: 0,
    userSatisfaction: 0,
    systemPerformance: 0,
    learningProgress: 0,
    interactionQuality: 0
  }
};

export function memoryReducer(state: MemoryState, action: MemoryAction): MemoryState {
  switch (action.type) {
    case 'ADD_PATTERN':
      return {
        ...state,
        patterns: [...state.patterns, MemorySerializer.createVersionedEntry<Pattern>(action.payload)]
      };

    case 'UPDATE_PATTERN':
      return {
        ...state,
        patterns: state.patterns.map(p => 
          p.id === action.payload.id 
            ? MemorySerializer.updateVersion({ ...p, ...action.payload })
            : p
        )
      };

    case 'REMOVE_PATTERN':
      return {
        ...state,
        patterns: state.patterns.filter(p => p.id !== action.payload)
      };

    case 'ADD_INTERACTION':
      return {
        ...state,
        interactions: [...state.interactions, MemorySerializer.createVersionedEntry<InteractionPattern>(action.payload)]
      };

    case 'UPDATE_INTERACTION':
      return {
        ...state,
        interactions: state.interactions.map(i => 
          i.id === action.payload.id 
            ? MemorySerializer.updateVersion({ ...i, ...action.payload })
            : i
        )
      };

    case 'REMOVE_INTERACTION':
      return {
        ...state,
        interactions: state.interactions.filter(i => i.id !== action.payload)
      };

    case 'ADD_KNOWLEDGE':
      return {
        ...state,
        knowledgeBases: [...state.knowledgeBases, MemorySerializer.createVersionedEntry(action.payload)]
      };

    case 'UPDATE_KNOWLEDGE':
      return {
        ...state,
        knowledgeBases: state.knowledgeBases.map(k => 
          k.id === action.payload.id 
            ? MemorySerializer.updateVersion({ ...k, ...action.payload })
            : k
        )
      };

    case 'REMOVE_KNOWLEDGE':
      return {
        ...state,
        knowledgeBases: state.knowledgeBases.filter(k => k.id !== action.payload)
      };

    case 'ADD_DIRECTIVE':
      return {
        ...state,
        directives: [...state.directives, MemorySerializer.createVersionedEntry(action.payload)]
      };

    case 'UPDATE_DIRECTIVE':
      return {
        ...state,
        directives: state.directives.map(d => 
          d.id === action.payload.id 
            ? MemorySerializer.updateVersion({ ...d, ...action.payload })
            : d
        )
      };

    case 'REMOVE_DIRECTIVE':
      return {
        ...state,
        directives: state.directives.filter(d => d.id !== action.payload)
      };

    case 'ADD_OBJECTIVE':
      return {
        ...state,
        learningObjectives: [...state.learningObjectives, MemorySerializer.createVersionedEntry(action.payload)]
      };

    case 'UPDATE_OBJECTIVE':
      return {
        ...state,
        learningObjectives: state.learningObjectives.map(o => 
          o.id === action.payload.id 
            ? MemorySerializer.updateVersion({ ...o, ...action.payload })
            : o
        )
      };

    case 'REMOVE_OBJECTIVE':
      return {
        ...state,
        learningObjectives: state.learningObjectives.filter(o => o.id !== action.payload)
      };

    case 'UPDATE_METRICS':
      return {
        ...state,
        metrics: {
          ...state.metrics,
          ...action.payload
        }
      };

    case 'RESET_STATE':
      return initialMemoryState;

    case 'IMPORT_STATE':
      return {
        ...action.payload,
        metrics: {
          ...initialMemoryState.metrics,
          ...action.payload.metrics
        }
      };

    default:
      return state;
  }
}
