import React, { useState } from 'react';
import { useOrchestrator } from '../orchestrator/OrchestratorProvider';
import SkillCreation from './SkillCreation';
import { Skill } from '../orchestrator/types';

const SkillMonitor: React.FC = () => {
  const { state } = useOrchestrator();
  const [showCreateSkill, setShowCreateSkill] = useState(false);
  const [selectedSkill, setSelectedSkill] = useState<Skill | null>(null);

  const getSkillsByCategory = () => {
    const categories = new Map<string, Skill[]>();
    state.skills.forEach(skill => {
      const category = skill.category || 'Uncategorized';
      if (!categories.has(category)) {
        categories.set(category, []);
      }
      categories.get(category)?.push(skill);
    });
    return categories;
  };

  return (
    <div className="bg-gray-800 rounded-lg shadow p-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-bold text-gray-100">Skills Library</h2>
        <div className="flex items-center space-x-4">
          <div className="text-sm text-gray-400">
            Total Skills: {state.skills.length}
          </div>
          <button
            onClick={() => setShowCreateSkill(true)}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            Create New Skill
          </button>
        </div>
      </div>

      {state.skills.length === 0 ? (
        <div className="text-center py-8 text-gray-400">
          No skills have been created yet. Create your first skill to get started.
        </div>
      ) : (
        Array.from(getSkillsByCategory()).map(([category, skills]) => (
          <div key={category} className="mb-6">
            <h3 className="text-lg font-semibold text-gray-300 mb-3">{category}</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {skills.map((skill) => (
                <div
                  key={skill.id}
                  className="border border-gray-700 bg-gray-900 rounded-lg p-4 hover:shadow-lg transition-shadow"
                >
                  <div className="flex justify-between items-start mb-3">
                    <div>
                      <h4 className="font-semibold text-lg text-gray-100">{skill.name}</h4>
                      <p className="text-sm text-gray-400">{skill.description}</p>
                    </div>
                    <span
                      className={`px-2 py-1 rounded-full text-sm ${
                        skill.status === 'active'
                          ? 'bg-green-900 text-green-100'
                          : skill.status === 'error'
                          ? 'bg-red-900 text-red-100'
                          : 'bg-gray-700 text-gray-300'
                      }`}
                    >
                      {skill.status}
                    </span>
                  </div>

                  <div className="space-y-3">
                    <div>
                      <h5 className="text-sm font-medium text-gray-300 mb-1">Inputs</h5>
                      <div className="flex flex-wrap gap-2">
                        {skill.inputs.map((input, index) => (
                          <span
                            key={index}
                            className="px-2 py-1 bg-blue-900 text-blue-100 rounded-full text-xs"
                          >
                            {input.name}: {input.type}
                          </span>
                        ))}
                      </div>
                    </div>

                    <div>
                      <h5 className="text-sm font-medium text-gray-300 mb-1">Outputs</h5>
                      <div className="flex flex-wrap gap-2">
                        {skill.outputs.map((output, index) => (
                          <span
                            key={index}
                            className="px-2 py-1 bg-green-900 text-green-100 rounded-full text-xs"
                          >
                            {output.name}: {output.type}
                          </span>
                        ))}
                      </div>
                    </div>

                    {skill.metadata?.tags && (
                      <div>
                        <h5 className="text-sm font-medium text-gray-300 mb-1">Tags</h5>
                        <div className="flex flex-wrap gap-2">
                          {skill.metadata.tags.map((tag, index) => (
                            <span
                              key={index}
                              className="px-2 py-1 bg-purple-900 text-purple-100 rounded-full text-xs"
                            >
                              {tag}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>

                  <div className="mt-4 flex justify-between">
                    <button
                      onClick={() => setSelectedSkill(skill)}
                      className="px-3 py-1 text-sm bg-blue-600 text-white rounded hover:bg-blue-700"
                    >
                      View Details
                    </button>
                    <button
                      className="px-3 py-1 text-sm bg-purple-600 text-white rounded hover:bg-purple-700"
                    >
                      Test Skill
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))
      )}

      {showCreateSkill && (
        <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center p-4">
          <div className="bg-gray-800 rounded-lg max-w-3xl w-full">
            <SkillCreation onClose={() => setShowCreateSkill(false)} />
          </div>
        </div>
      )}

      {selectedSkill && (
        <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center p-4">
          <div className="bg-gray-800 rounded-lg max-w-3xl w-full p-6">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-xl font-bold text-gray-100">{selectedSkill.name}</h3>
              <button
                onClick={() => setSelectedSkill(null)}
                className="text-gray-400 hover:text-gray-200"
              >
                ✕
              </button>
            </div>
            
            <div className="space-y-4">
              <div>
                <h4 className="text-sm font-medium text-gray-300">Implementation</h4>
                <pre className="mt-1 p-4 bg-gray-900 rounded-lg overflow-x-auto">
                  <code className="text-gray-100">{selectedSkill.implementation}</code>
                </pre>
              </div>

              {selectedSkill.testCases.length > 0 && (
                <div>
                  <h4 className="text-sm font-medium text-gray-300">Test Cases</h4>
                  <div className="mt-2 space-y-2">
                    {selectedSkill.testCases.map((test, index) => (
                      <div key={index} className="p-3 bg-gray-900 rounded-lg">
                        <p className="text-sm text-gray-300 mb-2">{test.description}</p>
                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <p className="text-xs text-gray-400">Input:</p>
                            <pre className="text-sm text-gray-100">
                              {JSON.stringify(test.input, null, 2)}
                            </pre>
                          </div>
                          <div>
                            <p className="text-xs text-gray-400">Expected Output:</p>
                            <pre className="text-sm text-gray-100">
                              {JSON.stringify(test.expectedOutput, null, 2)}
                            </pre>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default SkillMonitor;
