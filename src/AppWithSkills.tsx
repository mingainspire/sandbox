import { useState } from 'react';
import { Brain, Code, Zap, GitBranch, Layout } from 'lucide-react';
import SkillEvolutionDashboard from './components/skills/SkillEvolutionDashboard';

interface Skill {
  id: string;
  name: string;
  description: string;
  type: string;
  complexity: number;
  learningProgress: number;
  relatedSkills: string[];
}

function AppWithSkills() {
  const [skills, setSkills] = useState<Skill[]>([]);
  const [newSkill, setNewSkill] = useState({
    name: '',
    description: '',
    type: 'function',
    complexity: 1,
    relatedSkills: []
  });
  const [activeView, setActiveView] = useState<'skills' | 'evolution'>('evolution');

  const handleAddSkill = () => {
    const skill: Skill = {
      id: Date.now().toString(),
      name: newSkill.name,
      description: newSkill.description,
      type: newSkill.type,
      complexity: newSkill.complexity,
      learningProgress: 0,
      relatedSkills: newSkill.relatedSkills
    };
    setSkills([...skills, skill]);
    setNewSkill({
      name: '',
      description: '',
      type: 'function',
      complexity: 1,
      relatedSkills: []
    });
  };

  const updateLearningProgress = (skillId: string, progress: number) => {
    setSkills(skills.map(skill => 
      skill.id === skillId 
        ? { ...skill, learningProgress: Math.min(100, skill.learningProgress + progress) }
        : skill
    ));
  };

  return (
    <div className="min-h-screen bg-gray-900 text-white">
      <header className="bg-gray-800 border-b border-gray-700 px-6 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <Brain className="w-8 h-8 text-blue-400" />
            <div>
              <h1 className="text-2xl font-bold">Skills Evolution</h1>
              <p className="text-sm text-gray-400">Building the foundation for system orchestration</p>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <button
              onClick={() => setActiveView('evolution')}
              className={`px-4 py-2 rounded-lg flex items-center gap-2 ${
                activeView === 'evolution' ? 'bg-blue-900 text-blue-100' : 'text-gray-400 hover:bg-gray-700'
              }`}
            >
              <Layout className="w-4 h-4" />
              Dashboard
            </button>
            <button
              onClick={() => setActiveView('skills')}
              className={`px-4 py-2 rounded-lg flex items-center gap-2 ${
                activeView === 'skills' ? 'bg-blue-900 text-blue-100' : 'text-gray-400 hover:bg-gray-700'
              }`}
            >
              <Code className="w-4 h-4" />
              Skills
            </button>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        {activeView === 'evolution' ? (
          <SkillEvolutionDashboard />
        ) : (
          <div className="space-y-8">
            {/* Skill Creation */}
            <div className="bg-gray-800 p-6 rounded-lg border border-gray-700">
              <h2 className="text-xl mb-4 flex items-center">
                <Code className="w-5 h-5 mr-2 text-blue-400" />
                Create New Skill
              </h2>
              <div className="space-y-4">
                <input
                  type="text"
                  placeholder="Skill name"
                  value={newSkill.name}
                  onChange={(e) => setNewSkill({ ...newSkill, name: e.target.value })}
                  className="w-full p-2 bg-gray-700 rounded border border-gray-600"
                />
                <textarea
                  placeholder="Skill description"
                  value={newSkill.description}
                  onChange={(e) => setNewSkill({ ...newSkill, description: e.target.value })}
                  className="w-full p-2 bg-gray-700 rounded border border-gray-600"
                />
                <div className="grid grid-cols-2 gap-4">
                  <select
                    value={newSkill.type}
                    onChange={(e) => setNewSkill({ ...newSkill, type: e.target.value })}
                    className="p-2 bg-gray-700 rounded border border-gray-600"
                  >
                    <option value="function">Function</option>
                    <option value="pattern">Pattern</option>
                    <option value="concept">Concept</option>
                    <option value="technique">Technique</option>
                  </select>
                  <div>
                    <label className="block text-sm text-gray-400 mb-1">Complexity</label>
                    <input
                      type="range"
                      min="1"
                      max="5"
                      value={newSkill.complexity}
                      onChange={(e) => setNewSkill({ ...newSkill, complexity: parseInt(e.target.value) })}
                      className="w-full"
                    />
                  </div>
                </div>
                <button
                  onClick={handleAddSkill}
                  className="w-full p-2 bg-blue-600 text-white rounded hover:bg-blue-700"
                >
                  Add Skill
                </button>
              </div>
            </div>

            {/* Skills Network */}
            <div className="grid gap-4 grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
              {skills.map((skill) => (
                <div key={skill.id} className="bg-gray-800 p-6 rounded-lg border border-gray-700">
                  <div className="flex items-start justify-between">
                    <div>
                      <div className="flex items-center gap-2 mb-2">
                        <h3 className="text-lg font-semibold flex items-center">
                          <Zap className="w-4 h-4 mr-2 text-yellow-400" />
                          {skill.name}
                        </h3>
                        <span className="text-sm text-gray-400">
                          Level {skill.complexity}
                        </span>
                      </div>
                      <p className="text-gray-300 mb-4">{skill.description}</p>
                      <div className="space-y-2">
                        <div className="flex justify-between text-sm">
                          <span className="text-gray-400">Learning Progress</span>
                          <span className="text-blue-400">{skill.learningProgress}%</span>
                        </div>
                        <div className="w-full bg-gray-700 rounded-full h-2">
                          <div
                            className="bg-blue-600 rounded-full h-2 transition-all duration-500"
                            style={{ width: `${skill.learningProgress}%` }}
                          />
                        </div>
                        <button
                          onClick={() => updateLearningProgress(skill.id, 10)}
                          className="w-full mt-4 p-2 bg-gray-700 text-gray-300 rounded hover:bg-gray-600"
                        >
                          Practice Skill
                        </button>
                      </div>
                      {skill.relatedSkills.length > 0 && (
                        <div className="mt-4">
                          <div className="flex items-center text-sm text-gray-400 mb-2">
                            <GitBranch className="w-4 h-4 mr-1" />
                            Related Skills
                          </div>
                          <div className="flex flex-wrap gap-2">
                            {skill.relatedSkills.map((relatedSkill, index) => (
                              <span
                                key={index}
                                className="px-2 py-1 bg-gray-700 rounded-full text-xs text-gray-300"
                              >
                                {relatedSkill}
                              </span>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </main>
    </div>
  );
}

export default AppWithSkills;
