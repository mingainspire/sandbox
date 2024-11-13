import React, { useState } from 'react';
import { useOrchestrator } from '../orchestrator/OrchestratorProvider';
import { llmService } from '../../services/llm/service';

interface SkillInput {
  name: string;
  type: string;
  description: string;
  required: boolean;
}

interface SkillOutput {
  name: string;
  type: string;
  description: string;
}

interface TestCase {
  input: Record<string, any>;
  expectedOutput: Record<string, any>;
  description: string;
}

interface SkillCreationProps {
  onClose: () => void;
}

const SkillCreation: React.FC<SkillCreationProps> = ({ onClose }) => {
  const { dispatch } = useOrchestrator();
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState('');
  const [inputs, setInputs] = useState<SkillInput[]>([]);
  const [outputs, setOutputs] = useState<SkillOutput[]>([]);
  const [implementation, setImplementation] = useState('');
  const [testCases, setTestCases] = useState<TestCase[]>([]);
  const [currentInput, setCurrentInput] = useState<SkillInput>({
    name: '',
    type: 'string',
    description: '',
    required: true
  });
  const [currentOutput, setCurrentOutput] = useState<SkillOutput>({
    name: '',
    type: 'string',
    description: ''
  });

  const handleAddInput = () => {
    if (currentInput.name && currentInput.description) {
      setInputs([...inputs, currentInput]);
      setCurrentInput({
        name: '',
        type: 'string',
        description: '',
        required: true
      });
    }
  };

  const handleAddOutput = () => {
    if (currentOutput.name && currentOutput.description) {
      setOutputs([...outputs, currentOutput]);
      setCurrentOutput({
        name: '',
        type: 'string',
        description: ''
      });
    }
  };

  const handleCreateSkill = () => {
    const skill = {
      id: Date.now().toString(),
      name,
      description,
      category,
      inputs,
      outputs,
      implementation,
      testCases,
      type: 'skill' as const,
      status: 'active' as const,
      createdAt: new Date().toISOString(),
      lastActive: new Date().toISOString(),
      metadata: {
        version: '1.0.0',
        author: 'orchestrator',
        tags: [category]
      }
    };

    dispatch({
      type: 'CREATE_SKILL',
      payload: skill
    });

    onClose();
  };

  return (
    <div className="bg-gray-800 text-gray-100 rounded-lg p-6 space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-bold">Create New Skill</h2>
        <button onClick={onClose} className="text-gray-400 hover:text-gray-200">✕</button>
      </div>

      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-300">Name</label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="mt-1 block w-full rounded-md bg-gray-700 border-gray-600 text-gray-100 focus:border-blue-500 focus:ring-blue-500"
            placeholder="Skill name"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-300">Category</label>
          <input
            type="text"
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            className="mt-1 block w-full rounded-md bg-gray-700 border-gray-600 text-gray-100 focus:border-blue-500 focus:ring-blue-500"
            placeholder="e.g., data-processing, text-analysis, etc."
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-300">Description</label>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="mt-1 block w-full rounded-md bg-gray-700 border-gray-600 text-gray-100 focus:border-blue-500 focus:ring-blue-500"
            rows={3}
            placeholder="Describe what this skill does"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">Inputs</label>
          <div className="space-y-2">
            <div className="flex space-x-2">
              <input
                type="text"
                value={currentInput.name}
                onChange={(e) => setCurrentInput({ ...currentInput, name: e.target.value })}
                className="flex-1 rounded-md bg-gray-700 border-gray-600 text-gray-100"
                placeholder="Input name"
              />
              <select
                value={currentInput.type}
                onChange={(e) => setCurrentInput({ ...currentInput, type: e.target.value })}
                className="rounded-md bg-gray-700 border-gray-600 text-gray-100"
              >
                <option value="string">String</option>
                <option value="number">Number</option>
                <option value="boolean">Boolean</option>
                <option value="object">Object</option>
                <option value="array">Array</option>
              </select>
              <button
                onClick={handleAddInput}
                className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
              >
                Add
              </button>
            </div>
            <div className="flex flex-wrap gap-2">
              {inputs.map((input, index) => (
                <span
                  key={index}
                  className="px-2 py-1 bg-blue-900 text-blue-100 rounded-full text-sm"
                >
                  {input.name}: {input.type}
                </span>
              ))}
            </div>
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">Outputs</label>
          <div className="space-y-2">
            <div className="flex space-x-2">
              <input
                type="text"
                value={currentOutput.name}
                onChange={(e) => setCurrentOutput({ ...currentOutput, name: e.target.value })}
                className="flex-1 rounded-md bg-gray-700 border-gray-600 text-gray-100"
                placeholder="Output name"
              />
              <select
                value={currentOutput.type}
                onChange={(e) => setCurrentOutput({ ...currentOutput, type: e.target.value })}
                className="rounded-md bg-gray-700 border-gray-600 text-gray-100"
              >
                <option value="string">String</option>
                <option value="number">Number</option>
                <option value="boolean">Boolean</option>
                <option value="object">Object</option>
                <option value="array">Array</option>
              </select>
              <button
                onClick={handleAddOutput}
                className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
              >
                Add
              </button>
            </div>
            <div className="flex flex-wrap gap-2">
              {outputs.map((output, index) => (
                <span
                  key={index}
                  className="px-2 py-1 bg-green-900 text-green-100 rounded-full text-sm"
                >
                  {output.name}: {output.type}
                </span>
              ))}
            </div>
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-300">Implementation</label>
          <textarea
            value={implementation}
            onChange={(e) => setImplementation(e.target.value)}
            className="mt-1 block w-full rounded-md bg-gray-700 border-gray-600 text-gray-100 focus:border-blue-500 focus:ring-blue-500"
            rows={6}
            placeholder="Provide the implementation logic (code, pseudocode, or natural language description)"
          />
        </div>

        <button
          onClick={handleCreateSkill}
          className="w-full px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700"
        >
          Create Skill
        </button>
      </div>
    </div>
  );
};

export default SkillCreation;
