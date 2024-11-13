import React, { createContext, useContext, useReducer } from 'react';
import { Integration, IntegrationState, IntegrationAction } from './types';

const initialState: IntegrationState = {
  integrations: []
};

function integrationReducer(state: IntegrationState, action: IntegrationAction): IntegrationState {
  switch (action.type) {
    case 'ADD_INTEGRATION':
      return {
        ...state,
        integrations: [...state.integrations, action.payload as Integration]
      };
    case 'REMOVE_INTEGRATION':
      return {
        ...state,
        integrations: state.integrations.filter(integration => integration.id !== action.payload)
      };
    case 'UPDATE_INTEGRATION':
      return {
        ...state,
        integrations: state.integrations.map(integration =>
          integration.id === action.payload.id
            ? { ...integration, ...action.payload.updates }
            : integration
        )
      };
    case 'RESET_INTEGRATIONS':
      return {
        ...state,
        integrations: []
      };
    case 'IMPORT_INTEGRATIONS':
      return {
        ...state,
        integrations: action.payload as Integration[]
      };
    default:
      return state;
  }
}

interface IntegrationContextType extends IntegrationState {
  addIntegration: (integration: Integration) => void;
  removeIntegration: (id: string) => void;
  updateIntegration: (id: string, updates: Partial<Integration>) => void;
  resetIntegrations: () => void;
  importIntegrations: (integrations: Integration[]) => void;
}

const IntegrationContext = createContext<IntegrationContextType | undefined>(undefined);

export function useIntegrationState() {
  const context = useContext(IntegrationContext);
  if (!context) {
    throw new Error('useIntegrationState must be used within an IntegrationProvider');
  }
  return context;
}

export const IntegrationProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [state, dispatch] = useReducer(integrationReducer, initialState);

  const addIntegration = (integration: Integration) => {
    dispatch({ type: 'ADD_INTEGRATION', payload: integration });
  };

  const removeIntegration = (id: string) => {
    dispatch({ type: 'REMOVE_INTEGRATION', payload: id });
  };

  const updateIntegration = (id: string, updates: Partial<Integration>) => {
    dispatch({ type: 'UPDATE_INTEGRATION', payload: { id, updates } });
  };

  const resetIntegrations = () => {
    dispatch({ type: 'RESET_INTEGRATIONS' });
  };

  const importIntegrations = (integrations: Integration[]) => {
    dispatch({ type: 'IMPORT_INTEGRATIONS', payload: integrations });
  };

  const value = {
    ...state,
    addIntegration,
    removeIntegration,
    updateIntegration,
    resetIntegrations,
    importIntegrations
  };

  return (
    <IntegrationContext.Provider value={value}>
      {children}
    </IntegrationContext.Provider>
  );
};
