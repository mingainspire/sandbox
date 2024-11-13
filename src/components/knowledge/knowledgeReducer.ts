import { KnowledgeState, KnowledgeAction, KnowledgeEntry } from './types';

const initialState: KnowledgeState = {
  entries: [
    // Default orchestrator behaviors
    {
      id: 'default-agent-creation',
      type: 'behavior',
      title: 'Agent Creation Flow',
      description: 'Default conversation flow for creating new agents',
      content: `
        1. Understand user's goal and requirements
        2. Determine appropriate agent type
        3. Suggest relevant capabilities
        4. Generate optimal prompt sequences
        5. Configure behavior controls
        6. Set up test scenarios
      `,
      tags: ['agent-creation', 'orchestration', 'core-behavior'],
      metadata: {
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        version: '1.0.0',
        author: 'system',
        usage: {
          timesUsed: 0,
          successRate: 100
        },
        examples: [
          'Create an agent for code review',
          'Set up a data analysis agent',
          'Configure a specialist agent for documentation'
        ]
      }
    },
    {
      id: 'default-prompt-templates',
      type: 'prompt',
      title: 'Core Prompt Templates',
      description: 'Standard prompt templates for common agent tasks',
      content: `
        Agent Creation Interview:
        1. "What specific task or problem are you trying to solve?"
        2. "What kind of expertise or capabilities would be most valuable?"
        3. "Are there any specific constraints or requirements?"
        4. "What level of autonomy should the agent have?"
        
        Capability Assessment:
        1. "Based on your needs, these capabilities would be relevant: [capabilities]"
        2. "Would you like to add any specific capabilities?"
        
        Behavior Configuration:
        1. "Let's configure how the agent should behave. Here are my recommendations:"
        2. "These actions should require approval: [actions]"
        3. "These tasks can be automated: [tasks]"
      `,
      tags: ['prompts', 'templates', 'core-behavior'],
      metadata: {
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        version: '1.0.0',
        author: 'system',
        usage: {
          timesUsed: 0,
          successRate: 100
        }
      }
    }
  ],
  categories: {
    behaviors: ['agent-creation', 'task-management', 'system-integration'],
    capabilities: ['code-review', 'data-analysis', 'documentation'],
    prompts: ['interview', 'assessment', 'configuration'],
    integrations: ['api', 'database', 'external-tools'],
    system: ['core', 'security', 'performance']
  },
  stats: {
    totalEntries: 2,
    lastUpdated: new Date().toISOString(),
    topUsedEntries: [],
    mostSuccessfulEntries: []
  }
};

export function knowledgeReducer(state: KnowledgeState = initialState, action: KnowledgeAction): KnowledgeState {
  switch (action.type) {
    case 'ADD_ENTRY': {
      const newEntry: KnowledgeEntry = {
        id: Date.now().toString(),
        ...action.payload,
        metadata: {
          ...action.payload.metadata,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString()
        }
      };

      return {
        ...state,
        entries: [...state.entries, newEntry],
        stats: {
          ...state.stats,
          totalEntries: state.entries.length + 1,
          lastUpdated: new Date().toISOString()
        }
      };
    }

    case 'UPDATE_ENTRY': {
      const { id, updates } = action.payload;
      const updatedEntries = state.entries.map(entry => {
        if (entry.id === id) {
          return {
            ...entry,
            ...updates,
            metadata: {
              ...entry.metadata,
              ...updates.metadata,
              updatedAt: new Date().toISOString()
            }
          };
        }
        return entry;
      });

      return {
        ...state,
        entries: updatedEntries,
        stats: {
          ...state.stats,
          lastUpdated: new Date().toISOString()
        }
      };
    }

    case 'DELETE_ENTRY': {
      const filteredEntries = state.entries.filter(entry => entry.id !== action.payload);
      
      return {
        ...state,
        entries: filteredEntries,
        stats: {
          ...state.stats,
          totalEntries: filteredEntries.length,
          lastUpdated: new Date().toISOString()
        }
      };
    }

    case 'UPDATE_STATS': {
      const entries = state.entries;
      const sortedByUsage = [...entries]
        .sort((a, b) => b.metadata.usage.timesUsed - a.metadata.usage.timesUsed)
        .slice(0, 5)
        .map(entry => entry.id);

      const sortedBySuccess = [...entries]
        .sort((a, b) => b.metadata.usage.successRate - a.metadata.usage.successRate)
        .slice(0, 5)
        .map(entry => entry.id);

      return {
        ...state,
        stats: {
          ...state.stats,
          topUsedEntries: sortedByUsage,
          mostSuccessfulEntries: sortedBySuccess,
          lastUpdated: new Date().toISOString()
        }
      };
    }

    default:
      return state;
  }
}
