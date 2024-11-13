import { v4 as uuidv4 } from 'uuid';
import CryptoJS from 'crypto-js';

export interface Timestamped {
  createdAt: number;
  updatedAt: number;
  version: string;
}

export interface Shareable {
  id: string;
  collaboratorIds?: string[];
  sharingPermissions?: 'private' | 'team' | 'public';
}

export interface EncryptionMetadata {
  isEncrypted: boolean;
  encryptionMethod?: 'AES' | 'RSA';
}

export interface InteractionPattern extends Timestamped, Shareable, EncryptionMetadata {
  id: string;
  type: 'command' | 'query' | 'response' | 'feedback' | 'error';
  content: string;
  context: {
    taskId?: string;
    systemState?: string;
    userIntent?: string;
    outcome?: 'success' | 'failure' | 'pending';
  };
  metrics: {
    responseTime?: number;
    successRate?: number;
    userSatisfaction?: number;
    complexity?: number;
  };
  relatedPatterns?: string[];
  tags: string[];
}

export interface Pattern extends Timestamped, Shareable, EncryptionMetadata {
  id: string;
  description: string;
  type: 'preference' | 'behavior' | 'skill' | 'other';
  confidence: number;
  relatedPatterns?: string[];
  impact?: string[];
  context: string[];
  metrics?: {
    frequency: number;
    successRate: number;
    userAdoption: number;
  };
}

export interface KnowledgeBase extends Timestamped, Shareable, EncryptionMetadata {
  id: string;
  name: string;
  description?: string;
  content: string;
  type: 'task' | 'system' | 'user' | 'interaction';
  dependencies?: string[];
  tags?: string[];
  metrics?: {
    usageCount: number;
    relevanceScore: number;
    lastAccessed: number;
  };
}

export interface Directive extends Timestamped, Shareable, EncryptionMetadata {
  id: string;
  name: string;
  description?: string;
  priority: 'low' | 'medium' | 'high';
  status: 'active' | 'inactive' | 'completed';
  metrics?: {
    completionRate: number;
    averageExecutionTime: number;
    successRate: number;
  };
}

export interface LearningObjective extends Timestamped, Shareable, EncryptionMetadata {
  id: string;
  name: string;
  description?: string;
  progress: number;
  dependencies?: string[];
  metrics?: {
    learningRate: number;
    retentionScore: number;
    applicationSuccess: number;
  };
}

export interface SystemMetrics {
  taskCompletion: number;
  userSatisfaction: number;
  systemPerformance: number;
  learningProgress: number;
  interactionQuality: number;
}

export interface MemoryState {
  patterns: Pattern[];
  interactions: InteractionPattern[];
  knowledgeBases: KnowledgeBase[];
  directives: Directive[];
  learningObjectives: LearningObjective[];
  metrics: SystemMetrics;
}

export interface MemoryAction {
  type: 'ADD_PATTERN' | 'UPDATE_PATTERN' | 'REMOVE_PATTERN' |
        'ADD_INTERACTION' | 'UPDATE_INTERACTION' | 'REMOVE_INTERACTION' |
        'ADD_KNOWLEDGE' | 'UPDATE_KNOWLEDGE' | 'REMOVE_KNOWLEDGE' |
        'ADD_DIRECTIVE' | 'UPDATE_DIRECTIVE' | 'REMOVE_DIRECTIVE' |
        'ADD_OBJECTIVE' | 'UPDATE_OBJECTIVE' | 'REMOVE_OBJECTIVE' |
        'UPDATE_METRICS' | 'RESET_STATE' | 'IMPORT_STATE';
  payload: any;
}

export class MemorySerializer {
  static encrypt(data: any, secretKey: string): string {
    return CryptoJS.AES.encrypt(JSON.stringify(data), secretKey).toString();
  }

  static decrypt(encryptedData: string, secretKey: string): any {
    const bytes = CryptoJS.AES.decrypt(encryptedData, secretKey);
    return JSON.parse(bytes.toString(CryptoJS.enc.Utf8));
  }

  static createVersionedEntry<T extends Timestamped & Shareable>(
    entry: Omit<T, keyof Timestamped> & Partial<Shareable>
  ): T {
    const now = Date.now();
    return {
      ...entry,
      id: entry.id || uuidv4(),
      createdAt: now,
      updatedAt: now,
      version: '1.0.0',
      collaboratorIds: entry.collaboratorIds || [],
      sharingPermissions: entry.sharingPermissions || 'private'
    } as T;
  }

  static updateVersion<T extends Timestamped>(entry: T): T {
    const [major, minor, patch] = entry.version.split('.').map(Number);
    return {
      ...entry,
      updatedAt: Date.now(),
      version: `${major}.${minor}.${patch + 1}`
    };
  }
}

export function sanitizeForSharing<T extends Shareable>(
  item: T, 
  currentUserId: string, 
  sharingLevel: 'private' | 'team' | 'public' = 'team'
): T {
  return {
    ...item,
    collaboratorIds: sharingLevel === 'private' 
      ? [currentUserId] 
      : sharingLevel === 'team' 
        ? item.collaboratorIds || [currentUserId] 
        : [],
    sharingPermissions: sharingLevel
  };
}
