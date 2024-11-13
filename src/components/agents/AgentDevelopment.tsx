import React, { useState } from 'react';
import { useOrchestrator } from '../orchestrator/OrchestratorProvider';
import { Agent } from '../orchestrator/types';

interface DevelopmentProposal {
  id: string;
  agentId: string;
  type: 'capability' | 'specialization' | 'integration' | 'behavior';
  description: string;
  rationale: string;
  impact: string;
  status: 'proposed' | 'approved' | 'rejected' | 'in_progress' | 'completed';
  userFeedback?: string;
  createdAt: string;
  updatedAt: string;
}

const AgentDevelopment: React.FC<{ agent: Agent; onClose: () => void }> = ({ agent, onClose }) => {
  const { updateAgent } = useOrchestrator();
  const [proposals, setProposals] = useState<DevelopmentProposal[]>([
    {
      id: '1',
      agentId: agent.id,
      type: 'capability',
      description: 'Add natural language processing capabilities',
      rationale: 'Enable better understanding of user requirements and context',
      impact: 'Improved communication and task interpretation',
      status: 'proposed',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    }
  ]);
  const [userFeedback, setUserFeedback] = useState('');
  const [selectedProposal, setSelectedProposal] = useState<DevelopmentProposal | null>(null);
  const [newPromptSequence, setNewPromptSequence] = useState('');
  const [newTestScenario, setNewTestScenario] = useState('');

  const handleAddPromptSequence = () => {
    if (newPromptSequence.trim() && agent.metadata?.behaviorControls) {
      const currentControls = agent.metadata.behaviorControls;
      updateAgent(agent.id, {
        metadata: {
          ...agent.metadata,
          behaviorControls: {
            requireApprovalFor: currentControls.requireApprovalFor,
            automatedTasks: currentControls.automatedTasks,
            restrictedActions: currentControls.restrictedActions,
            userOverrides: currentControls.userOverrides,
            promptSequences: [...(currentControls.promptSequences || []), newPromptSequence.trim()],
            testScenarios: currentControls.testScenarios || []
          }
        }
      });
      setNewPromptSequence('');
    }
  };

  const handleAddTestScenario = () => {
    if (newTestScenario.trim() && agent.metadata?.behaviorControls) {
      const currentControls = agent.metadata.behaviorControls;
      updateAgent(agent.id, {
        metadata: {
          ...agent.metadata,
          behaviorControls: {
            requireApprovalFor: currentControls.requireApprovalFor,
            automatedTasks: currentControls.automatedTasks,
            restrictedActions: currentControls.restrictedActions,
            userOverrides: currentControls.userOverrides,
            promptSequences: currentControls.promptSequences || [],
            testScenarios: [...(currentControls.testScenarios || []), newTestScenario.trim()]
          }
        }
      });
      setNewTestScenario('');
    }
  };

  const handleApprove = (proposal: DevelopmentProposal) => {
    setSelectedProposal(proposal);
  };

  const submitApproval = (proposal: DevelopmentProposal) => {
    const updatedProposal = {
      ...proposal,
      status: 'approved' as const,
      userFeedback,
      updatedAt: new Date().toISOString()
    };

    setProposals(prev => 
      prev.map(p => p.id === proposal.id ? updatedProposal : p)
    );

    // Update agent with new capability/behavior based on proposal
    const updates: Partial<Agent> = {
      capabilities: [...(agent.capabilities || [])],
      metadata: {
        ...agent.metadata,
        permissions: [...(agent.metadata?.permissions || [])]
      }
    };

    if (proposal.type === 'capability') {
      updates.capabilities?.push(proposal.description);
    } else if (proposal.type === 'specialization' && updates.metadata) {
      updates.metadata.specialization = proposal.description;
    }

    updateAgent(agent.id, updates);
    setSelectedProposal(null);
    setUserFeedback('');
  };

  const handleReject = (proposal: DevelopmentProposal) => {
    setProposals(prev =>
      prev.map(p => 
        p.id === proposal.id 
          ? { ...p, status: 'rejected', updatedAt: new Date().toISOString() }
          : p
      )
    );
  };

  return (
    <div className="p-6 bg-gray-800 text-gray-100">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-bold">Agent Development: {agent.name}</h2>
        <button
          onClick={onClose}
          className="text-gray-400 hover:text-gray-200"
        >
          ✕
        </button>
      </div>

      <div className="space-y-6">
        <div className="bg-blue-900 border border-blue-700 rounded-lg p-4">
          <h3 className="font-medium text-blue-100">Development Guidelines</h3>
          <ul className="mt-2 text-sm text-blue-200 space-y-1">
            <li>• All agent modifications require explicit user approval</li>
            <li>• Provide clear feedback to guide agent development</li>
            <li>• Review proposed changes carefully before approval</li>
            <li>• Monitor agent behavior after implementing changes</li>
          </ul>
        </div>

        <div className="space-y-4">
          <h3 className="font-medium text-gray-200">Prompt Sequences</h3>
          <div className="flex space-x-2">
            <input
              type="text"
              value={newPromptSequence}
              onChange={(e) => setNewPromptSequence(e.target.value)}
              className="flex-1 rounded-md bg-gray-700 border-gray-600 text-gray-100 focus:border-blue-500 focus:ring-blue-500"
              placeholder="Add new prompt sequence"
            />
            <button
              onClick={handleAddPromptSequence}
              className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
            >
              Add
            </button>
          </div>
          <div className="flex flex-wrap gap-2">
            {agent.metadata?.behaviorControls?.promptSequences?.map((sequence, index) => (
              <span
                key={index}
                className="px-3 py-1 bg-purple-900 text-purple-100 rounded-full text-sm"
              >
                {sequence}
              </span>
            ))}
          </div>
        </div>

        <div className="space-y-4">
          <h3 className="font-medium text-gray-200">Test Scenarios</h3>
          <div className="flex space-x-2">
            <input
              type="text"
              value={newTestScenario}
              onChange={(e) => setNewTestScenario(e.target.value)}
              className="flex-1 rounded-md bg-gray-700 border-gray-600 text-gray-100 focus:border-blue-500 focus:ring-blue-500"
              placeholder="Add new test scenario"
            />
            <button
              onClick={handleAddTestScenario}
              className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
            >
              Add
            </button>
          </div>
          <div className="flex flex-wrap gap-2">
            {agent.metadata?.behaviorControls?.testScenarios?.map((scenario, index) => (
              <span
                key={index}
                className="px-3 py-1 bg-green-900 text-green-100 rounded-full text-sm"
              >
                {scenario}
              </span>
            ))}
          </div>
        </div>

        <div className="space-y-4">
          <h3 className="font-medium text-gray-200">Development Proposals</h3>
          {proposals.map((proposal) => (
            <div
              key={proposal.id}
              className="border border-gray-700 rounded-lg p-4 space-y-3 bg-gray-900"
            >
              <div className="flex justify-between items-start">
                <div>
                  <span className="inline-block px-2 py-1 text-xs rounded-full capitalize bg-gray-700 text-gray-200">
                    {proposal.type}
                  </span>
                  <h4 className="font-medium mt-2 text-gray-200">{proposal.description}</h4>
                </div>
                <span
                  className={`px-2 py-1 text-xs rounded-full ${
                    proposal.status === 'approved'
                      ? 'bg-green-900 text-green-100'
                      : proposal.status === 'rejected'
                      ? 'bg-red-900 text-red-100'
                      : proposal.status === 'in_progress'
                      ? 'bg-yellow-900 text-yellow-100'
                      : 'bg-gray-700 text-gray-300'
                  }`}
                >
                  {proposal.status}
                </span>
              </div>

              <div className="text-sm text-gray-300">
                <p><strong>Rationale:</strong> {proposal.rationale}</p>
                <p><strong>Impact:</strong> {proposal.impact}</p>
              </div>

              {proposal.status === 'proposed' && (
                <div className="flex space-x-2">
                  <button
                    onClick={() => handleApprove(proposal)}
                    className="px-3 py-1 bg-green-600 text-white rounded hover:bg-green-700"
                  >
                    Review & Approve
                  </button>
                  <button
                    onClick={() => handleReject(proposal)}
                    className="px-3 py-1 bg-red-600 text-white rounded hover:bg-red-700"
                  >
                    Reject
                  </button>
                </div>
              )}

              {proposal.userFeedback && (
                <div className="text-sm bg-gray-800 p-3 rounded border border-gray-700">
                  <strong className="text-gray-200">User Feedback:</strong>{' '}
                  <span className="text-gray-300">{proposal.userFeedback}</span>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      {selectedProposal && (
        <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center p-4">
          <div className="bg-gray-800 rounded-lg p-6 max-w-xl w-full">
            <h3 className="text-lg font-medium mb-4 text-gray-100">Review Proposal</h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-300">
                  Your Feedback/Requirements
                </label>
                <textarea
                  value={userFeedback}
                  onChange={(e) => setUserFeedback(e.target.value)}
                  className="mt-1 block w-full rounded-md bg-gray-700 border-gray-600 text-gray-100 focus:border-blue-500 focus:ring-blue-500"
                  rows={4}
                  placeholder="Provide specific requirements or modifications for this development..."
                />
              </div>
              <div className="flex space-x-2">
                <button
                  onClick={() => submitApproval(selectedProposal)}
                  className="flex-1 px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
                >
                  Approve with Feedback
                </button>
                <button
                  onClick={() => setSelectedProposal(null)}
                  className="px-4 py-2 bg-gray-600 text-white rounded hover:bg-gray-700"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AgentDevelopment;
