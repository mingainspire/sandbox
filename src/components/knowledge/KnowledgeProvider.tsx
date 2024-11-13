import React, { createContext, useContext, useReducer, useCallback } from 'react';
import { knowledgeReducer } from './knowledgeReducer';
import { KnowledgeContextValue, KnowledgeEntry, KnowledgeState } from './types';

const KnowledgeContext = createContext<KnowledgeContextValue | undefined>(undefined);

export const useKnowledge = () => {
  const context = useContext(KnowledgeContext);
  if (!context) {
    throw new Error('useKnowledge must be used within a KnowledgeProvider');
  }
  return context;
};

export const KnowledgeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [state, dispatch] = useReducer(knowledgeReducer, knowledgeReducer(undefined, { type: 'UPDATE_STATS', payload: null }));

  const addEntry = useCallback((entry: Omit<KnowledgeEntry, 'id'>) => {
    dispatch({ type: 'ADD_ENTRY', payload: entry });
  }, []);

  const updateEntry = useCallback((id: string, updates: Partial<KnowledgeEntry>) => {
    dispatch({ type: 'UPDATE_ENTRY', payload: { id, updates } });
  }, []);

  const deleteEntry = useCallback((id: string) => {
    dispatch({ type: 'DELETE_ENTRY', payload: id });
  }, []);

  const getEntryById = useCallback((id: string) => {
    return state.entries.find(entry => entry.id === id);
  }, [state.entries]);

  const getEntriesByType = useCallback((type: KnowledgeEntry['type']) => {
    return state.entries.filter(entry => entry.type === type);
  }, [state.entries]);

  const getEntriesByTags = useCallback((tags: string[]) => {
    return state.entries.filter(entry => 
      tags.some(tag => entry.tags.includes(tag))
    );
  }, [state.entries]);

  const searchEntries = useCallback((query: string) => {
    const searchTerms = query.toLowerCase().split(' ');
    return state.entries.filter(entry => {
      const searchableText = `
        ${entry.title.toLowerCase()}
        ${entry.description.toLowerCase()}
        ${entry.content.toLowerCase()}
        ${entry.tags.join(' ').toLowerCase()}
      `;
      return searchTerms.every(term => searchableText.includes(term));
    });
  }, [state.entries]);

  const value: KnowledgeContextValue = {
    state,
    addEntry,
    updateEntry,
    deleteEntry,
    getEntryById,
    getEntriesByType,
    getEntriesByTags,
    searchEntries
  };

  return (
    <KnowledgeContext.Provider value={value}>
      {children}
    </KnowledgeContext.Provider>
  );
};

// Custom hooks for specific knowledge base operations
export const useOrchestratorKnowledge = () => {
  const { getEntriesByType, getEntriesByTags } = useKnowledge();

  const getBehaviors = useCallback(() => {
    return getEntriesByType('behavior');
  }, [getEntriesByType]);

  const getPromptTemplates = useCallback(() => {
    return getEntriesByType('prompt');
  }, [getEntriesByType]);

  const getAgentCreationKnowledge = useCallback(() => {
    return getEntriesByTags(['agent-creation']);
  }, [getEntriesByTags]);

  const getRelevantPrompts = useCallback((context: string) => {
    const contextTerms = context.toLowerCase().split(' ');
    const allPrompts = getEntriesByType('prompt');
    return allPrompts.filter(prompt => {
      const promptText = `
        ${prompt.title.toLowerCase()}
        ${prompt.description.toLowerCase()}
        ${prompt.tags.join(' ').toLowerCase()}
      `;
      return contextTerms.some(term => promptText.includes(term));
    });
  }, [getEntriesByType]);

  return {
    getBehaviors,
    getPromptTemplates,
    getAgentCreationKnowledge,
    getRelevantPrompts
  };
};

// Hook for managing conversation flows
export const useConversationFlow = () => {
  const { getEntriesByType } = useKnowledge();

  const getNextPrompt = useCallback((currentStep: string, context: any) => {
    const prompts = getEntriesByType('prompt');
    const promptTemplate = prompts.find(p => p.tags.includes('interview'));
    if (!promptTemplate) return null;

    const promptLines = promptTemplate.content.split('\n').filter(line => line.trim());
    const currentIndex = promptLines.findIndex(line => line.includes(currentStep));
    
    if (currentIndex === -1 || currentIndex === promptLines.length - 1) return null;
    return promptLines[currentIndex + 1];
  }, [getEntriesByType]);

  const processResponse = useCallback((response: string, context: any) => {
    // Process user response and update context
    return {
      nextPrompt: getNextPrompt(context.currentStep, context),
      updatedContext: {
        ...context,
        // Add processed response data
      }
    };
  }, [getNextPrompt]);

  return {
    getNextPrompt,
    processResponse
  };
};
