import React, { useState } from 'react';
import { Shield, Users, FileText, GitBranch, AlertTriangle, CheckCircle2, XCircle, Brain, Code, Terminal, Globe } from 'lucide-react';

interface PendingApproval {
  id: string;
  type: 'core' | 'workflow' | 'agent' | 'system';
  title: string;
  description: string;
  proposedBy: string;
  status: 'pending' | 'approved' | 'rejected';
  timestamp: string;
  priority: 'low' | 'medium' | 'high';
  tools?: string[];
  skills?: string[];
  functions?: string[];
}

const pendingApprovals: PendingApproval[] = [
  {
    id: '1',
    type: 'core',
    title: 'Initialize Development Environment',
    description: 'Setup code editor, terminal, and file browser for core development tools',
    proposedBy: 'System Orchestrator',
    status: 'pending',
    timestamp: new Date().toISOString(),
    priority: 'high',
    tools: ['VSCode', 'Terminal'],
    skills: ['Code Editing', 'File Management'],
    functions: ['Initialize', 'Setup']
  },
  {
    id: '2',
    type: 'agent',
    title: 'Deploy Task Processing Agent',
    description: 'Initialize specialized agent for handling development tasks and code generation',
    proposedBy: 'Resource Pod',
    status: 'pending',
    timestamp: new Date().toISOString(),
    priority: 'medium',
    tools: ['Task Manager', 'Code Generator'],
    skills: ['Task Handling', 'Code Generation'],
    functions: ['Deploy', 'Initialize']
  }
];

const safeguardRules = [
  {
    id: '1',
    title: 'Resource Protection',
    description: 'Prevent unauthorized access to system resources and configurations',
    status: 'active',
  },
  {
    id: '2',
    title: 'Task Validation',
    description: 'All agent-proposed tasks require explicit approval before execution',
    status: 'active',
  },
  {
    id: '3',
    title: 'System Monitoring',
    description: 'Continuous monitoring of system health and performance metrics',
    status: 'active',
  },
];

export default function ManagementControls() {
  const [activeTab, setActiveTab] = useState<'approvals' | 'safeguards'>('approvals');

  const handleApproval = (id: string, approved: boolean) => {
    console.log(`Request ${id} ${approved ? 'approved' : 'rejected'}`);
  };

  return (
    <div className="bg-gray-800 rounded-xl shadow-sm border border-gray-700 mb-8">
      <div className="border-b border-gray-700">
        <nav className="flex">
          <button
            onClick={() => setActiveTab('approvals')}
            className={`px-6 py-4 flex items-center gap-2 border-b-2 transition-colors ${
              activeTab === 'approvals'
                ? 'border-blue-500 text-blue-400'
                : 'border-transparent text-gray-400 hover:text-gray-300'
            }`}
          >
            <CheckCircle2 className="w-5 h-5" />
            Pending Approvals
          </button>
          <button
            onClick={() => setActiveTab('safeguards')}
            className={`px-6 py-4 flex items-center gap-2 border-b-2 transition-colors ${
              activeTab === 'safeguards'
                ? 'border-blue-500 text-blue-400'
                : 'border-transparent text-gray-400 hover:text-gray-300'
            }`}
          >
            <Shield className="w-5 h-5" />
            Safety Controls
          </button>
        </nav>
      </div>

      <div className="p-6">
        {activeTab === 'approvals' && (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold text-white">System Proposals</h3>
              <div className="flex items-center gap-2">
                <span className="px-3 py-1 bg-yellow-900 text-yellow-100 rounded-full text-sm">
                  {pendingApprovals.length} Pending Approvals
                </span>
              </div>
            </div>
            
            <div className="space-y-4">
              {pendingApprovals.map((approval) => (
                <div key={approval.id} className="border border-gray-700 rounded-lg p-4 bg-gray-800">
                  <div className="flex items-start justify-between">
                    <div className="space-y-2">
                      <div className="flex items-center gap-2">
                        <span className={`px-2 py-1 rounded-full text-xs font-medium
                          ${approval.priority === 'high' ? 'bg-red-900 text-red-100' :
                            approval.priority === 'medium' ? 'bg-yellow-900 text-yellow-100' :
                            'bg-blue-900 text-blue-100'}`}>
                          {approval.priority} priority
                        </span>
                        <span className="text-gray-300">
                          Proposed by {approval.proposedBy}
                        </span>
                      </div>
                      <h4 className="font-medium text-white">{approval.title}</h4>
                      <p className="text-gray-300">{approval.description}</p>
                      {approval.tools && (
                        <div>
                          <h5 className="text-sm font-medium text-gray-200">Tools:</h5>
                          <p className="text-gray-300">{approval.tools.join(', ')}</p>
                        </div>
                      )}
                      {approval.skills && (
                        <div>
                          <h5 className="text-sm font-medium text-gray-200">Skills:</h5>
                          <p className="text-gray-300">{approval.skills.join(', ')}</p>
                        </div>
                      )}
                      {approval.functions && (
                        <div>
                          <h5 className="text-sm font-medium text-gray-200">Functions:</h5>
                          <p className="text-gray-300">{approval.functions.join(', ')}</p>
                        </div>
                      )}
                    </div>
                    <div className="flex gap-2">
                      <button
                        onClick={() => handleApproval(approval.id, true)}
                        className="p-2 text-green-400 hover:bg-gray-700 rounded-lg transition-colors"
                        title="Approve"
                      >
                        <CheckCircle2 className="w-5 h-5" />
                      </button>
                      <button
                        onClick={() => handleApproval(approval.id, false)}
                        className="p-2 text-red-400 hover:bg-gray-700 rounded-lg transition-colors"
                        title="Reject"
                      >
                        <XCircle className="w-5 h-5" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-6 p-4 bg-gray-700 rounded-lg border border-gray-600">
              <h4 className="font-medium text-gray-100 mb-2">Approval System Guidelines</h4>
              <ul className="text-sm text-gray-300 space-y-2">
                <li className="flex items-center gap-2">
                  <Code className="w-4 h-4 text-blue-400" />
                  Core development tools require explicit approval
                </li>
                <li className="flex items-center gap-2">
                  <Terminal className="w-4 h-4 text-green-400" />
                  System changes are logged and traceable
                </li>
                <li className="flex items-center gap-2">
                  <Brain className="w-4 h-4 text-purple-400" />
                  AI agents can propose improvements
                </li>
                <li className="flex items-center gap-2">
                  <Shield className="w-4 h-4 text-yellow-400" />
                  Emergency override requires multiple approvals
                </li>
              </ul>
            </div>
          </div>
        )}

        {activeTab === 'safeguards' && (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold text-white">Active Safeguards</h3>
              <span className="px-3 py-1 bg-green-900 text-green-100 rounded-full text-sm">
                All Systems Protected
              </span>
            </div>

            <div className="space-y-4">
              {safeguardRules.map((rule) => (
                <div key={rule.id} className="p-4 bg-gray-700 rounded-lg border border-gray-600">
                  <div className="flex items-center gap-2 mb-1">
                    <Shield className="w-5 h-5 text-green-400" />
                    <h4 className="font-medium text-gray-100">{rule.title}</h4>
                  </div>
                  <p className="text-sm text-gray-300 ml-7">{rule.description}</p>
                </div>
              ))}
            </div>

            <div className="mt-6 p-4 bg-yellow-900/20 rounded-lg border border-yellow-900/30">
              <h4 className="font-medium text-yellow-100 mb-2">Safety First</h4>
              <p className="text-sm text-yellow-200/80">
                The system is designed to promote collaboration while maintaining strict safety controls. 
                Agents can propose improvements and communicate with each other, but cannot execute 
                changes without proper approval. This ensures system integrity while allowing for 
                organic growth and improvement.
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
