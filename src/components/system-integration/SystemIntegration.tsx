import React, { useState } from 'react';
import { useIntegrationState } from '../providers/useIntegrationState';

const SystemIntegration: React.FC = () => {
  const { integrations, addIntegration } = useIntegrationState();
  const [newIntegration, setNewIntegration] = useState({
    id: '',
    name: '',
    type: 'service' as 'service' | 'api' | 'database' | 'cloud',
    status: 'inactive',
    description: '',
    endpoint: '',
    lastSync: '',
    config: {
      maxRetries: 3,
      timeout: 5000,
      rateLimit: 100,
      authentication: {
        type: 'apiKey',
        credentials: {}
      }
    },
    metrics: {
      uptime: 0,
      latency: 0,
      requests: 0,
      errors: 0,
      successRate: 0
    },
    permissions: [],
    tags: []
  });

  const handleAddIntegration = () => {
    addIntegration({
      ...newIntegration,
      id: Date.now().toString(),
      status: 'active'
    });
    setNewIntegration({
      id: '',
      name: '',
      type: 'service' as 'service' | 'api' | 'database' | 'cloud',
      status: 'inactive',
      description: '',
      endpoint: '',
      lastSync: '',
      config: {
        maxRetries: 3,
        timeout: 5000,
        rateLimit: 100,
        authentication: {
          type: 'apiKey',
          credentials: {}
        }
      },
      metrics: {
        uptime: 0,
        latency: 0,
        requests: 0,
        errors: 0,
        successRate: 0
      },
      permissions: [],
      tags: []
    });
  };

  return (
    <div>
      <h2>System Integration</h2>
      <form onSubmit={(e) => { e.preventDefault(); handleAddIntegration(); }}>
        <input 
          type="text" 
          value={newIntegration.name} 
          onChange={(e) => setNewIntegration({ ...newIntegration, name: e.target.value })} 
          placeholder="Integration Name" 
        />
        <select 
          value={newIntegration.type} 
          onChange={(e) => setNewIntegration({ ...newIntegration, type: e.target.value as 'service' | 'api' | 'database' | 'cloud' })} 
        >
          <option value="service">Service</option>
          <option value="api">API</option>
          <option value="database">Database</option>
          <option value="cloud">Cloud</option>
        </select>
        <input 
          type="text" 
          value={newIntegration.description} 
          onChange={(e) => setNewIntegration({ ...newIntegration, description: e.target.value })} 
          placeholder="Description" 
        />
        <button type="submit">Add Integration</button>
      </form>
      <ul>
        {integrations.map((integration) => (
          <li key={integration.id}>
            {integration.name} - {integration.type} - {integration.status}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default SystemIntegration;
