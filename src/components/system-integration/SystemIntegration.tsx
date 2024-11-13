import React, { useState } from 'react';
import { useIntegrationState } from '../providers/useIntegrationState';
import { Integration, IntegrationType } from '../providers/types';
import AgentCreation from '../agents/AgentCreation';

const SystemIntegration: React.FC = () => {
  const { integrations, addIntegration } = useIntegrationState();
  const [activeTab, setActiveTab] = useState<'integrations' | 'agents'>('integrations');
  const [newIntegration, setNewIntegration] = useState<Integration>({
    id: '',
    name: '',
    type: 'service',
    status: 'inactive',
    description: '',
    config: {
      maxRetries: 3,
      timeout: 5000,
      rateLimit: 100,
      authentication: {
        type: 'apiKey',
        credentials: {}
      },
      system: {
        version: '1.0.0',
        requirements: [],
        capabilities: []
      }
    },
    metrics: {
      uptime: 0,
      latency: 0,
      requests: 0,
      errors: 0,
      successRate: 0,
      resourceUsage: {
        cpu: 0,
        memory: 0,
        storage: 0
      }
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
      type: 'service',
      status: 'inactive',
      description: '',
      config: {
        maxRetries: 3,
        timeout: 5000,
        rateLimit: 100,
        authentication: {
          type: 'apiKey',
          credentials: {}
        },
        system: {
          version: '1.0.0',
          requirements: [],
          capabilities: []
        }
      },
      metrics: {
        uptime: 0,
        latency: 0,
        requests: 0,
        errors: 0,
        successRate: 0,
        resourceUsage: {
          cpu: 0,
          memory: 0,
          storage: 0
        }
      },
      permissions: [],
      tags: []
    });
  };

  const integrationTypes: IntegrationType[] = [
    'service',
    'api',
    'database',
    'cloud',
    'system',
    'tool',
    'agent',
    'framework',
    'swarm',
    'ai-assistant'
  ];

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <div className="mb-6">
        <div className="border-b border-gray-200">
          <nav className="-mb-px flex space-x-8">
            <button
              onClick={() => setActiveTab('integrations')}
              className={`${
                activeTab === 'integrations'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              } whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm`}
            >
              System Integrations
            </button>
            <button
              onClick={() => setActiveTab('agents')}
              className={`${
                activeTab === 'agents'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              } whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm`}
            >
              Agent Management
            </button>
          </nav>
        </div>
      </div>

      {activeTab === 'integrations' ? (
        <div>
          <h2 className="text-xl font-bold mb-4">System Integration</h2>
          <form onSubmit={(e) => { e.preventDefault(); handleAddIntegration(); }} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">Integration Name</label>
              <input 
                type="text" 
                value={newIntegration.name} 
                onChange={(e) => setNewIntegration({ ...newIntegration, name: e.target.value })} 
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                placeholder="Integration Name" 
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700">Type</label>
              <select 
                value={newIntegration.type} 
                onChange={(e) => setNewIntegration({ ...newIntegration, type: e.target.value as IntegrationType })} 
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              >
                {integrationTypes.map((type) => (
                  <option key={type} value={type}>
                    {type.charAt(0).toUpperCase() + type.slice(1).replace('-', ' ')}
                  </option>
                ))}
              </select>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700">Description</label>
              <input 
                type="text" 
                value={newIntegration.description} 
                onChange={(e) => setNewIntegration({ ...newIntegration, description: e.target.value })} 
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                placeholder="Description" 
              />
            </div>
            
            <button 
              type="submit"
              className="w-full px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600"
            >
              Add Integration
            </button>
          </form>

          <div className="mt-8">
            <h3 className="text-lg font-semibold mb-4">Active Integrations</h3>
            <div className="space-y-4">
              {integrations.map((integration) => (
                <div
                  key={integration.id}
                  className="p-4 border rounded-lg hover:shadow-md transition-shadow"
                >
                  <div className="flex justify-between items-start">
                    <div>
                      <h4 className="font-medium">{integration.name}</h4>
                      <p className="text-sm text-gray-600">{integration.type}</p>
                      <p className="text-sm text-gray-500">{integration.description}</p>
                    </div>
                    <span
                      className={`px-2 py-1 rounded-full text-sm ${
                        integration.status === 'active'
                          ? 'bg-green-100 text-green-800'
                          : integration.status === 'error'
                          ? 'bg-red-100 text-red-800'
                          : 'bg-gray-100 text-gray-800'
                      }`}
                    >
                      {integration.status}
                    </span>
                  </div>
                  {integration.metrics && (
                    <div className="mt-2 grid grid-cols-3 gap-4 text-sm text-gray-500">
                      <div>Uptime: {integration.metrics.uptime}%</div>
                      <div>Success Rate: {integration.metrics.successRate}%</div>
                      <div>Requests: {integration.metrics.requests}</div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      ) : (
        <AgentCreation />
      )}
    </div>
  );
};

export default SystemIntegration;
