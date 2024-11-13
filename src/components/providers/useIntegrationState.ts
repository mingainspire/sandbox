import { useState, useCallback } from 'react';
import { Integration } from './types';

export function useIntegrationState() {
  const [integrations, setIntegrations] = useState<Integration[]>([]);

  const addIntegration = useCallback((integration: Integration) => {
    setIntegrations(prevIntegrations => [...prevIntegrations, integration]);
  }, []);

  const removeIntegration = useCallback((id: string) => {
    setIntegrations(prevIntegrations => prevIntegrations.filter(integration => integration.id !== id));
  }, []);

  const updateIntegration = useCallback((id: string, updatedIntegration: Partial<Integration>) => {
    setIntegrations(prevIntegrations => prevIntegrations.map(integration => 
      integration.id === id ? { ...integration, ...updatedIntegration } : integration
    ));
  }, []);

  return {
    integrations,
    addIntegration,
    removeIntegration,
    updateIntegration
  };
}
