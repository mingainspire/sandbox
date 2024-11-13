import React, { useContext } from 'react';
import { OrchestratorContext } from './OrchestratorProvider';
import { OrchestratorConfigProps } from './types';

const OrchestratorAPI: React.FC<OrchestratorConfigProps> = ({ onConfigChange }) => {
  const { state, dispatch } = useContext(OrchestratorContext);

  const handleModelChange = (model: string) => {
    dispatch({ type: 'SET_MODEL', payload: model });
    onConfigChange({ ...state, selectedModel: model });
  };

  const handleCreateAgent = (agent: AgentCreationParams) => {
    dispatch({ type: 'CREATE_AGENT', payload: { ...agent, id: Date.now().toString(), status: 'idle' } });
    onConfigChange({ ...state, agents: [...state.agents, { ...agent, id: Date.now().toString(), status: 'idle' }] });
  };

  const handleUpdateAgent = (agentId: string, updates: Partial<Agent>) => {
    dispatch({ type: 'UPDATE_AGENT', payload: { agentId, updates } });
    onConfigChange({
      ...state,
      agents: state.agents.map(agent => agent.id === agentId ? { ...agent, ...updates } : agent)
    });
  };

  const handleDeleteAgent = (agentId: string) => {
    dispatch({ type: 'DELETE_AGENT', payload: agentId });
    onConfigChange({
      ...state,
      agents: state.agents.filter(agent => agent.id !== agentId)
    });
  };

  const handleCreateTask = (task: Task) => {
    dispatch({ type: 'CREATE_TASK', payload: task });
    onConfigChange({ ...state, tasks: [...state.tasks, task] });
  };

  const handleUpdateTask = (taskId: string, updates: Partial<Task>) => {
    dispatch({ type: 'UPDATE_TASK', payload: { taskId, updates } });
    onConfigChange({
      ...state,
      tasks: state.tasks.map(task => task.id === taskId ? { ...task, ...updates } : task)
    });
  };

  const handleDeleteTask = (taskId: string) => {
    dispatch({ type: 'DELETE_TASK', payload: taskId });
    onConfigChange({
      ...state,
      tasks: state.tasks.filter(task => task.id !== taskId)
    });
  };

  const handleCreateSkill = (skill: Skill) => {
    dispatch({ type: 'CREATE_SKILL', payload: skill });
    onConfigChange({ ...state, skills: [...state.skills, skill] });
  };

  return (
    <div>
      <button onClick={() => handleModelChange('gpt-3.5-turbo')}>Set Model to gpt-3.5-turbo</button>
      <button onClick={() => handleCreateAgent({ name: 'New Agent', type: 'Conversational' })}>Create Agent</button>
      <button onClick={() => handleUpdateAgent('1', { status: 'active' })}>Update Agent</button>
      <button onClick={() => handleDeleteAgent('1')}>Delete Agent</button>
      <button onClick={() => handleCreateTask({ id: '1', name: 'New Task' })}>Create Task</button>
      <button onClick={() => handleUpdateTask('1', { name: 'Updated Task' })}>Update Task</button>
      <button onClick={() => handleDeleteTask('1')}>Delete Task</button>
      <button onClick={() => handleCreateSkill({ id: '1', name: 'New Skill' })}>Create Skill</button>
    </div>
  );
};

export default OrchestratorAPI;
