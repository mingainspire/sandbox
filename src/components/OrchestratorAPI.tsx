import React, { useState, useEffect } from 'react';
import { useOrchestratorState } from './orchestrator/useOrchestratorState';
import { useIntegrationState } from './providers/useIntegrationState';
import { TaskType } from './orchestrator/types';

const OrchestratorAPI: React.FC = () => {
  const [userInput, setUserInput] = useState('');
  const [apiResponse, setApiResponse] = useState('');
  const [showTaskDetails, setShowTaskDetails] = useState(false);
  const [selectedTaskId, setSelectedTaskId] = useState<string | null>(null);

  const {
    state: orchestratorState,
    createTask,
    updateTaskProgress,
    approveTask,
    startTask,
    completeTask,
    failTask,
    updateSystemStatus,
    getTaskById
  } = useOrchestratorState();

  const { integrations } = useIntegrationState();

  // Monitor system status
  useEffect(() => {
    const interval = setInterval(() => {
      updateSystemStatus({
        agents: integrations.filter(i => i.type === 'agent' && i.status === 'active').length,
        activeTasks: orchestratorState.tasks.filter(t => t.status === 'in_progress').length,
        completedTasks: orchestratorState.tasks.filter(t => t.status === 'completed').length,
        systemLoad: Math.random() * 100, // This would be real system load in production
        lastUpdate: new Date().toISOString()
      });
    }, 5000);
    return () => clearInterval(interval);
  }, [integrations, orchestratorState.tasks, updateSystemStatus]);

  const processUserIntent = async (input: string) => {
    const intent = input.toLowerCase();
    let response = '';

    try {
      if (intent.includes('create') || intent.includes('add') || intent.includes('new')) {
        const type = getTaskTypeFromIntent(intent);
        if (type) {
          const task = {
            type,
            description: input,
            priority: 'medium' as const,
            requirements: []
          };
          createTask(task);
          response = `I'll help you create a new ${type}. I've created a task for this request. Would you like to provide more specific requirements?`;
        }
      } else if (intent.includes('status') || intent.includes('progress')) {
        const activeTasksCount = orchestratorState.tasks.filter(t => t.status === 'in_progress').length;
        const pendingApproval = orchestratorState.tasks.filter(t => t.metadata?.approvalStatus === 'pending').length;
        response = `System Status:
- ${activeTasksCount} active tasks
- ${pendingApproval} tasks pending approval
- System load: ${Math.round(orchestratorState.systemStatus.systemLoad)}%
- ${orchestratorState.systemStatus.agents} active agents`;
      } else if (intent.includes('help')) {
        response = `I can help you with:
- Creating new components (skills, functions, agents, systems, frameworks)
- Monitoring task progress
- Managing system integrations
- Providing system status updates

Examples:
- "Create a new agent for data processing"
- "Add a skill for natural language processing"
- "Show system status"
- "What's the progress on current tasks?"`;
      } else if (intent.includes('approve')) {
        const pendingTasks = orchestratorState.tasks.filter(t => t.metadata?.approvalStatus === 'pending');
        if (pendingTasks.length > 0) {
          pendingTasks.forEach(task => approveTask(task.id));
          response = `Approved ${pendingTasks.length} pending tasks. They will now begin processing.`;
        } else {
          response = 'No tasks currently pending approval.';
        }
      } else {
        response = "I'm here to help! You can ask me to create new components, check status, or approve tasks.";
      }
    } catch (error) {
      console.error('Error processing intent:', error);
      response = 'I encountered an error while processing your request. Please try again.';
    }

    return response;
  };

  const getTaskTypeFromIntent = (intent: string): TaskType | null => {
    if (intent.includes('skill')) return 'skill';
    if (intent.includes('function')) return 'function';
    if (intent.includes('agent')) return 'agent';
    if (intent.includes('system')) return 'system';
    if (intent.includes('framework')) return 'framework';
    return null;
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (userInput.trim()) {
      const response = await processUserIntent(userInput);
      setApiResponse(response);
      setUserInput('');
    }
  };

  const handleTaskClick = (taskId: string) => {
    setSelectedTaskId(taskId);
    setShowTaskDetails(true);
  };

  const TaskDetails: React.FC<{ taskId: string }> = ({ taskId }) => {
    const task = getTaskById(taskId);
    if (!task) return null;

    return (
      <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
        <div className="bg-gray-800 p-6 rounded-lg w-full max-w-md">
          <div className="flex justify-between items-start mb-4">
            <h3 className="text-lg font-medium text-white">{task.type} Task Details</h3>
            <button
              onClick={() => setShowTaskDetails(false)}
              className="text-gray-400 hover:text-gray-300"
            >
              ✕
            </button>
          </div>
          <div className="space-y-4">
            <div>
              <div className="text-sm text-gray-400">Description</div>
              <div className="text-white">{task.description}</div>
            </div>
            <div>
              <div className="text-sm text-gray-400">Status</div>
              <div className="text-white">{task.status}</div>
            </div>
            <div>
              <div className="text-sm text-gray-400">Progress</div>
              <div className="w-full bg-gray-700 rounded-full h-2 mt-1">
                <div
                  className="bg-blue-500 rounded-full h-2 transition-all duration-500"
                  style={{ width: `${task.progress}%` }}
                />
              </div>
            </div>
            {task.metadata?.logs && task.metadata.logs.length > 0 && (
              <div>
                <div className="text-sm text-gray-400 mb-2">Logs</div>
                <div className="bg-gray-900 p-3 rounded-lg text-sm text-gray-300 max-h-40 overflow-y-auto">
                  {task.metadata.logs.map((log, index) => (
                    <div key={index} className="mb-1">{log}</div>
                  ))}
                </div>
              </div>
            )}
            <div className="flex gap-2 mt-4">
              {task.status === 'pending' && (
                <button
                  onClick={() => {
                    startTask(task.id);
                    setShowTaskDetails(false);
                  }}
                  className="px-3 py-1 bg-blue-600 text-white rounded hover:bg-blue-700"
                >
                  Start Task
                </button>
              )}
              {task.status === 'in_progress' && (
                <button
                  onClick={() => {
                    completeTask(task.id);
                    setShowTaskDetails(false);
                  }}
                  className="px-3 py-1 bg-green-600 text-white rounded hover:bg-green-700"
                >
                  Complete Task
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="p-6 bg-gray-800 rounded-lg">
      <div className="mb-6">
        <h2 className="text-xl font-semibold text-white mb-2">Orchestrator Interface</h2>
        <div className="grid grid-cols-4 gap-4 mb-4">
          <div className="bg-gray-700 p-4 rounded-lg">
            <div className="text-sm text-gray-400">Active Agents</div>
            <div className="text-xl font-semibold text-white">{orchestratorState.systemStatus.agents}</div>
          </div>
          <div className="bg-gray-700 p-4 rounded-lg">
            <div className="text-sm text-gray-400">Active Tasks</div>
            <div className="text-xl font-semibold text-white">{orchestratorState.systemStatus.activeTasks}</div>
          </div>
          <div className="bg-gray-700 p-4 rounded-lg">
            <div className="text-sm text-gray-400">Completed Tasks</div>
            <div className="text-xl font-semibold text-white">{orchestratorState.systemStatus.completedTasks}</div>
          </div>
          <div className="bg-gray-700 p-4 rounded-lg">
            <div className="text-sm text-gray-400">System Load</div>
            <div className="text-xl font-semibold text-white">
              {Math.round(orchestratorState.systemStatus.systemLoad)}%
            </div>
          </div>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="mb-6">
        <div className="flex gap-2">
          <input
            type="text"
            value={userInput}
            onChange={(e) => setUserInput(e.target.value)}
            placeholder="Ask the orchestrator to create or manage components..."
            className="flex-1 px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-white"
          />
          <button 
            type="submit" 
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            Send
          </button>
        </div>
      </form>

      {apiResponse && (
        <div className="bg-gray-700 p-4 rounded-lg mb-6">
          <div className="text-sm text-gray-400 mb-2">Orchestrator Response:</div>
          <div className="text-white whitespace-pre-wrap">{apiResponse}</div>
        </div>
      )}

      {orchestratorState.tasks.length > 0 && (
        <div>
          <h3 className="text-lg font-medium text-white mb-4">Tasks</h3>
          <div className="space-y-4">
            {orchestratorState.tasks.map(task => (
              <div
                key={task.id}
                className="bg-gray-700 p-4 rounded-lg cursor-pointer hover:bg-gray-600 transition-colors"
                onClick={() => handleTaskClick(task.id)}
              >
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-medium text-white capitalize">{task.type}</span>
                    <span className={`px-2 py-0.5 rounded-full text-xs ${
                      task.status === 'completed' 
                        ? 'bg-green-900 text-green-100'
                        : task.status === 'failed'
                        ? 'bg-red-900 text-red-100'
                        : 'bg-yellow-900 text-yellow-100'
                    }`}>
                      {task.status}
                    </span>
                  </div>
                  <span className="text-sm text-gray-400">
                    {new Date(task.createdAt).toLocaleString()}
                  </span>
                </div>
                <p className="text-sm text-gray-300">{task.description}</p>
                <div className="mt-2 w-full bg-gray-600 rounded-full h-2">
                  <div 
                    className="bg-blue-500 rounded-full h-2 transition-all duration-500"
                    style={{ width: `${task.progress}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {showTaskDetails && selectedTaskId && (
        <TaskDetails taskId={selectedTaskId} />
      )}
    </div>
  );
};

export default OrchestratorAPI;
