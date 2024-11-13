export interface KnowledgeEntry {
  id: string;
  type: 'behavior' | 'capability' | 'prompt' | 'integration' | 'system';
  title: string;
  description: string;
  content: string;
  tags: string[];
  metadata: {
    createdAt: string;
    updatedAt: string;
    version: string;
    author: string;
    usage: {
      timesUsed: number;
      lastUsed?: string;
      successRate: number;
    };
    requirements?: string[];
    dependencies?: string[];
    examples?: string[];
  };
}

export interface KnowledgeState {
  entries: KnowledgeEntry[];
  categories: {
    behaviors: string[];
    capabilities: string[];
    prompts: string[];
    integrations: string[];
    system: string[];
  };
  stats: {
    totalEntries: number;
    lastUpdated: string;
    topUsedEntries: string[];
    mostSuccessfulEntries: string[];
  };
}

export interface KnowledgeAction {
  type: 'ADD_ENTRY' | 'UPDATE_ENTRY' | 'DELETE_ENTRY' | 'UPDATE_STATS';
  payload: any;
}

export interface KnowledgeContextValue {
  state: KnowledgeState;
  addEntry: (entry: Omit<KnowledgeEntry, 'id'>) => void;
  updateEntry: (id: string, updates: Partial<KnowledgeEntry>) => void;
  deleteEntry: (id: string) => void;
  getEntryById: (id: string) => KnowledgeEntry | undefined;
  getEntriesByType: (type: KnowledgeEntry['type']) => KnowledgeEntry[];
  getEntriesByTags: (tags: string[]) => KnowledgeEntry[];
  searchEntries: (query: string) => KnowledgeEntry[];
}
