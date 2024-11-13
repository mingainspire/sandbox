import React, { useState } from 'react';
import { useIntegrationState } from './useIntegrationState';
import { Integration, IntegrationType } from './types';
import { Globe, Database, Cloud, Server, Plus, Settings, Trash2, Download, Upload, RefreshCcw, AlertTriangle, Check, Clock, Wrench, Users, Box, Cpu, Network } from 'lucide-react';

export default function SystemIntegrations() {
  const { 
    integrations, 
    addIntegration, 
    removeIntegration, 
    updateIntegration,
    exportState,
    importState,
    resetState 
  } = useIntegrationState();
  
  const [showAddForm, setShowAddForm] = useState(false);
  const [showResetConfirm, setShowResetConfirm] = useState(false);
  const [formData, setFormData] = useState<Partial<Integration>>({
    type: 'system',
    status: 'inactive'
  });
  const [statusMessage, setStatusMessage] = useState('');
  const [showAdvancedConfig, setShowAdvancedConfig] = useState(false);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const value = e.target.value;
    const name = e.target.name;
    
    if (name.includes('.')) {
      const [parent, child] = name.split('.');
      setFormData(prev => ({
        ...prev,
        [parent]: {
          ...(prev as any)[parent],
          [child]: value
        }
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: value
      }));
    }
  };

  const handleAddIntegration = (e: React.FormEvent) => {
    e.preventDefault();
    const config: any = {};
    
    // Add type-specific configurations
    switch (formData.type) {
      case 'system':
        config.system = {
          version: formData.config?.system?.version || '1.0.0',
          requirements: [],
          capabilities: []
        };
        break;
      case 'tool':
        config.tool = {
          version: formData.config?.tool?.version || '1.0.0',
          supportedPlatforms: ['linux', 'windows', 'mac'],
          dependencies: []
        };
        break;
      case 'agent':
        config.agent = {
          capabilities: [],
          model: formData.config?.agent?.model || 'default',
          parameters: {}
        };
        break;
      case 'framework':
        config.framework = {
          version: '1.0.0',
          language: 'typescript',
          dependencies: [],
          compatibleSystems: []
        };
        break;
      case 'swarm':
        config.swarm = {
          agentCount: 1,
          coordination: 'centralized',
          roles: [],
          communicationProtocol: 'http'
        };
        break;
    }

    const newIntegration: Integration = {
      id: Date.now().toString(),
      name: formData.name || '',
      type: formData.type as IntegrationType,
      status: 'inactive',
      description: formData.description || '',
      endpoint: formData.endpoint,
      lastSync: new Date().toISOString(),
      config,
      metrics: {
        uptime: 100,
        latency: 0,
        requests: 0,
        resourceUsage: {
          cpu: 0,
          memory: 0,
          storage: 0
        }
      }
    };

    addIntegration(newIntegration);
    setShowAddForm(false);
    setFormData({ type: 'system', status: 'inactive' });
    setShowAdvancedConfig(false);
  };

  const handleFileImport = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      importState(file).then((success: boolean) => {
        setStatusMessage(success ? 'Import successful' : 'Import failed');
        setTimeout(() => setStatusMessage(''), 3000);
      });
    }
  };

  const getIntegrationIcon = (type: IntegrationType) => {
    switch (type) {
      case 'system': return <Box className="w-5 h-5 text-blue-400" />;
      case 'tool': return <Wrench className="w-5 h-5 text-green-400" />;
      case 'agent': return <Users className="w-5 h-5 text-yellow-400" />;
      case 'framework': return <Cpu className="w-5 h-5 text-purple-400" />;
      case 'swarm': return <Network className="w-5 h-5 text-pink-400" />;
      case 'api': return <Globe className="w-5 h-5 text-blue-400" />;
      case 'database': return <Database className="w-5 h-5 text-green-400" />;
      case 'cloud': return <Cloud className="w-5 h-5 text-purple-400" />;
      case 'service': return <Server className="w-5 h-5 text-yellow-400" />;
      default: return <Box className="w-5 h-5 text-gray-400" />;
    }
  };

  const getTypeSpecificFields = () => {
    switch (formData.type) {
      case 'system':
        return (
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-1">
              System Version
            </label>
            <input
              type="text"
              name="config.system.version"
              value={formData.config?.system?.version || ''}
              onChange={handleInputChange}
              placeholder="1.0.0"
              className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-gray-200"
            />
          </div>
        );
      case 'tool':
        return (
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-1">
              Tool Version
            </label>
            <input
              type="text"
              name="config.tool.version"
              value={formData.config?.tool?.version || ''}
              onChange={handleInputChange}
              placeholder="1.0.0"
              className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-gray-200"
            />
          </div>
        );
      case 'agent':
        return (
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-1">
              Agent Model
            </label>
            <input
              type="text"
              name="config.agent.model"
              value={formData.config?.agent?.model || ''}
              onChange={handleInputChange}
              placeholder="default"
              className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-gray-200"
            />
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-semibold text-white">System Integrations</h2>
        <div className="flex items-center gap-2">
          <button
            onClick={() => setShowAddForm(true)}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2"
          >
            <Plus className="w-4 h-4" />
            Add Integration
          </button>
          <button
            onClick={exportState}
            className="p-2 text-gray-300 hover:bg-gray-700 rounded-lg transition-colors"
            title="Export Integrations"
          >
            <Download className="w-4 h-4" />
          </button>
          <div className="relative">
            <input
              type="file"
              onChange={handleFileImport}
              className="hidden"
              id="import-integrations"
              accept=".json"
            />
            <label
              htmlFor="import-integrations"
              className="p-2 text-gray-300 hover:bg-gray-700 rounded-lg transition-colors cursor-pointer"
              title="Import Integrations"
            >
              <Upload className="w-4 h-4" />
            </label>
          </div>
          <button
            onClick={() => setShowResetConfirm(true)}
            className="p-2 text-gray-300 hover:bg-gray-700 rounded-lg transition-colors"
            title="Reset Integrations"
          >
            <RefreshCcw className="w-4 h-4" />
          </button>
        </div>
      </div>

      {showAddForm && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-gray-800 p-6 rounded-lg w-full max-w-md max-h-[90vh] overflow-y-auto">
            <h3 className="text-lg font-medium text-white mb-4">Add Integration</h3>
            <form onSubmit={handleAddIntegration} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1">
                  Name
                </label>
                <input
                  type="text"
                  name="name"
                  value={formData.name || ''}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-gray-200"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1">
                  Type
                </label>
                <select
                  name="type"
                  value={formData.type}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-gray-200"
                >
                  <option value="system">System</option>
                  <option value="tool">Tool</option>
                  <option value="agent">Agent</option>
                  <option value="framework">Framework</option>
                  <option value="swarm">Swarm</option>
                  <option value="api">API</option>
                  <option value="database">Database</option>
                  <option value="service">Service</option>
                  <option value="cloud">Cloud</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1">
                  Description
                </label>
                <textarea
                  name="description"
                  value={formData.description || ''}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-gray-200"
                  rows={3}
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1">
                  Endpoint (Optional)
                </label>
                <input
                  type="text"
                  name="endpoint"
                  value={formData.endpoint || ''}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-gray-200"
                />
              </div>

              <div className="pt-2">
                <button
                  type="button"
                  onClick={() => setShowAdvancedConfig(!showAdvancedConfig)}
                  className="text-sm text-blue-400 hover:text-blue-300"
                >
                  {showAdvancedConfig ? 'Hide' : 'Show'} Advanced Configuration
                </button>
              </div>

              {showAdvancedConfig && (
                <div className="space-y-4 pt-2">
                  {getTypeSpecificFields()}
                </div>
              )}

              <div className="flex items-center gap-2 pt-4">
                <button
                  type="submit"
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                >
                  Add Integration
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setShowAddForm(false);
                    setShowAdvancedConfig(false);
                  }}
                  className="px-4 py-2 bg-gray-700 text-gray-200 rounded-lg hover:bg-gray-600 transition-colors"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {showResetConfirm && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-gray-800 p-6 rounded-lg">
            <h3 className="text-lg font-medium text-white mb-4">Confirm Reset</h3>
            <p className="text-gray-300 mb-4">
              Are you sure you want to reset all integrations? This action cannot be undone.
            </p>
            <div className="flex items-center gap-2">
              <button
                onClick={() => {
                  resetState();
                  setShowResetConfirm(false);
                }}
                className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
              >
                Reset
              </button>
              <button
                onClick={() => setShowResetConfirm(false)}
                className="px-4 py-2 bg-gray-700 text-gray-200 rounded-lg hover:bg-gray-600 transition-colors"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {statusMessage && (
        <div className={`p-3 rounded-lg flex items-center gap-2 ${
          statusMessage.includes('failed') 
            ? 'bg-red-900/20 text-red-200' 
            : 'bg-green-900/20 text-green-200'
        }`}>
          {statusMessage.includes('failed') ? (
            <AlertTriangle className="w-4 h-4" />
          ) : (
            <Check className="w-4 h-4" />
          )}
          <span className="text-sm">{statusMessage}</span>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {integrations.map(integration => (
          <div
            key={integration.id}
            className="p-6 bg-gray-800 rounded-lg border border-gray-700"
          >
            <div className="flex items-start justify-between">
              <div className="flex items-start gap-3">
                {getIntegrationIcon(integration.type)}
                <div>
                  <h3 className="font-medium text-white">{integration.name}</h3>
                  <div className="flex items-center gap-2 mt-1">
                    <span className={`px-2 py-0.5 rounded-full text-xs ${
                      integration.status === 'active'
                        ? 'bg-green-900 text-green-100'
                        : integration.status === 'error'
                        ? 'bg-red-900 text-red-100'
                        : 'bg-gray-700 text-gray-300'
                    }`}>
                      {integration.status}
                    </span>
                    <span className="text-xs text-gray-400">
                      {integration.type}
                    </span>
                    {integration.lastSync && (
                      <span className="text-xs text-gray-400 flex items-center gap-1">
                        <Clock className="w-3 h-3" />
                        {new Date(integration.lastSync).toLocaleString()}
                      </span>
                    )}
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => {
                    updateIntegration({
                      ...integration,
                      status: integration.status === 'active' ? 'inactive' : 'active'
                    });
                  }}
                  className="p-2 hover:bg-gray-700 rounded-lg transition-colors"
                >
                  <Settings className="w-4 h-4 text-gray-400" />
                </button>
                <button
                  onClick={() => removeIntegration(integration.id)}
                  className="p-2 hover:bg-gray-700 rounded-lg transition-colors"
                >
                  <Trash2 className="w-4 h-4 text-red-400" />
                </button>
              </div>
            </div>

            <p className="mt-2 text-gray-300 text-sm">{integration.description}</p>

            {integration.endpoint && (
              <div className="mt-2 text-sm text-gray-400">
                Endpoint: {integration.endpoint}
              </div>
            )}

            {integration.config && (
              <div className="mt-2 text-sm text-gray-400">
                {integration.type === 'system' && integration.config.system && (
                  <div>Version: {integration.config.system.version}</div>
                )}
                {integration.type === 'tool' && integration.config.tool && (
                  <div>Version: {integration.config.tool.version}</div>
                )}
                {integration.type === 'agent' && integration.config.agent && (
                  <div>Model: {integration.config.agent.model}</div>
                )}
              </div>
            )}

            {integration.metrics && (
              <div className="grid grid-cols-3 gap-4 mt-4">
                <div className="p-3 bg-gray-700 rounded-lg">
                  <div className="text-xs text-gray-400">Uptime</div>
                  <div className="text-sm font-medium text-gray-200">
                    {integration.metrics.uptime}%
                  </div>
                </div>
                <div className="p-3 bg-gray-700 rounded-lg">
                  <div className="text-xs text-gray-400">Latency</div>
                  <div className="text-sm font-medium text-gray-200">
                    {integration.metrics.latency}ms
                  </div>
                </div>
                <div className="p-3 bg-gray-700 rounded-lg">
                  <div className="text-xs text-gray-400">Requests</div>
                  <div className="text-sm font-medium text-gray-200">
                    {integration.metrics.requests}
                  </div>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
