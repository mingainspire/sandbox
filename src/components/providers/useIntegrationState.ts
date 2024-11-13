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

  const updateIntegration = useCallback((integration: Integration) => {
    setIntegrations(prevIntegrations => prevIntegrations.map(prev => 
      prev.id === integration.id ? integration : prev
    ));
  }, []);

  const resetState = useCallback(() => {
    setIntegrations([]);
  }, []);

  const exportState = useCallback(() => {
    const data = JSON.stringify(integrations, null, 2);
    const blob = new Blob([data], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'integrations.json';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  }, [integrations]);

  const importState = useCallback((file: File): Promise<boolean> => {
    return new Promise((resolve) => {
      const reader = new FileReader();
      reader.onload = (e) => {
        try {
          const content = e.target?.result as string;
          const data = JSON.parse(content) as Integration[];
          setIntegrations(data);
          resolve(true);
        } catch (error) {
          console.error('Failed to import integrations:', error);
          resolve(false);
        }
      };
      reader.readAsText(file);
    });
  }, []);

  return {
    integrations,
    addIntegration,
    removeIntegration,
    updateIntegration,
    resetState,
    exportState,
    importState
  };
}
