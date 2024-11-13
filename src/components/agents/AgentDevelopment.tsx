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
    },
    {
      id: '2',
      agentId: agent.id,
      type: 'integration',
      description: 'Integrate with existing task management system',
      rationale: 'Streamline workflow and task coordination',
      impact: 'Better task tracking and resource allocation',
      status: 'proposed',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    }
  ]);
  const [userFeedback, setUserFeedback] = useState('');
  const [selectedProposal, setSelectedProposal] = useState<DevelopmentProposal | null>(null);

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
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg max-w-3xl w-full p-6">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-bold">Agent Development: {agent.name}</h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700"
          >
            ✕
          </button>
        </div>

        <div className="space-y-6">
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <h3 className="font-medium text-blue-800">Development Guidelines</h3>
            <ul className="mt-2 text-sm text-blue-700 space-y-1">
              <li>• All agent modifications require explicit user approval</li>
              <li>• Provide clear feedback to guide agent development</li>
              <li>• Review proposed changes carefully before approval</li>
              <li>• Monitor agent behavior after implementing changes</li>
            </ul>
          </div>

          <div className="space-y-4">
            <h3 className="font-medium">Development Proposals</h3>
            {proposals.map((proposal) => (
              <div
                key={proposal.id}
                className="border rounded-lg p-4 space-y-3"
              >
                <div className="flex justify-between items-start">
                  <div>
                    <span className="inline-block px-2 py-1 text-xs rounded-full capitalize bg-gray-100">
                      {proposal.type}
                    </span>
                    <h4 className="font-medium mt-2">{proposal.description}</h4>
                  </div>
                  <span
                    className={`px-2 py-1 text-xs rounded-full ${
                      proposal.status === 'approved'
                        ? 'bg-green-100 text-green-800'
                        : proposal.status === 'rejected'
                        ? 'bg-red-100 text-red-800'
                        : proposal.status === 'in_progress'
                        ? 'bg-yellow-100 text-yellow-800'
                        : 'bg-gray-100 text-gray-800'
                    }`}
                  >
                    {proposal.status}
                  </span>
                </div>

                <div className="text-sm text-gray-600">
                  <p><strong>Rationale:</strong> {proposal.rationale}</p>
                  <p><strong>Impact:</strong> {proposal.impact}</p>
                </div>

                {proposal.status === 'proposed' && (
                  <div className="flex space-x-2">
                    <button
                      onClick={() => handleApprove(proposal)}
                      className="px-3 py-1 bg-green-500 text-white rounded hover:bg-green-600"
                    >
                      Review & Approve
                    </button>
                    <button
                      onClick={() => handleReject(proposal)}
                      className="px-3 py-1 bg-red-500 text-white rounded hover:bg-red-600"
                    >
                      Reject
                    </button>
                  </div>
                )}

                {proposal.userFeedback && (
                  <div className="text-sm bg-gray-50 p-3 rounded">
                    <strong>User Feedback:</strong> {proposal.userFeedback}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        {selectedProposal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4">
            <div className="bg-white rounded-lg p-6 max-w-xl w-full">
              <h3 className="text-lg font-medium mb-4">Review Proposal</h3>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Your Feedback/Requirements
                  </label>
                  <textarea
                    value={userFeedback}
                    onChange={(e) => setUserFeedback(e.target.value)}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                    rows={4}
                    placeholder="Provide specific requirements or modifications for this development..."
                  />
                </div>
                <div className="flex space-x-2">
                  <button
                    onClick={() => submitApproval(selectedProposal)}
                    className="flex-1 px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600"
                  >
                    Approve with Feedback
                  </button>
                  <button
                    onClick={() => setSelectedProposal(null)}
                    className="px-4 py-2 bg-gray-500 text-white rounded hover:bg-gray-600"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AgentDevelopment;
