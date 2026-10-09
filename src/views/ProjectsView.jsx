import React, { useState, useEffect } from 'react';
import { api } from '../api';
import { 
  Layers, 
  Plus, 
  Trash2, 
  Edit3, 
  ExternalLink, 
  Sparkles, 
  CheckCircle2, 
  AlertCircle, 
  X, 
  Download, 
  Tag, 
  Code2, 
  Clock, 
  Users, 
  Cpu
} from 'lucide-react';
import { GithubIcon } from '../components/SocialIcons';

const SKILL_CATEGORIES = [
  'Programming',
  'Web Development',
  'UI/UX',
  'Data Science',
  'AI/ML',
  'Database',
  'Cloud',
  'DevOps',
  'Tools',
  'Soft Skills',
  'Other'
];

export default function ProjectsView({ onDataChanged }) {
  const [projects, setProjects] = useState([]);
  const [skills, setSkills] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isProjectModalOpen, setIsProjectModalOpen] = useState(false);
  const [isSkillModalOpen, setIsSkillModalOpen] = useState(false);
  const [inferringSkills, setInferringSkills] = useState(false);

  // GitHub Import State
  const [githubRepoUrl, setGithubRepoUrl] = useState('');
  const [importingRepo, setImportingRepo] = useState(false);

  // Project Form State - strictly clean empty inputs!
  const [projectForm, setProjectForm] = useState({
    title: '',
    problemStatement: '',
    solution: '',
    description: '',
    technologies: '',
    role: '',
    teamSize: '1',
    githubUrl: '',
    demoUrl: '',
    duration: '',
    outcome: ''
  });

  // Skill Form State - clean empty inputs!
  const [skillForm, setSkillForm] = useState({
    name: '',
    category: 'Programming',
    proficiency: '80'
  });

  const [feedback, setFeedback] = useState({ type: '', msg: '' });

  useEffect(() => {
    loadAll();
  }, []);

  const loadAll = async () => {
    setLoading(true);
    try {
      const [projData, skillData] = await Promise.all([
        api.projects.getAll(),
        api.skills.getAll()
      ]);
      setProjects(projData.projects || []);
      setSkills(skillData.skills || []);
    } catch (err) {
      console.error('Failed to load projects and skills:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleProjectInputChange = (e) => {
    const { name, value } = e.target;
    setProjectForm(prev => ({ ...prev, [name]: value }));
  };

  const handleCreateProject = async (e) => {
    e.preventDefault();
    if (!projectForm.title.trim()) {
      setFeedback({ type: 'error', msg: 'Project title is required' });
      return;
    }

    try {
      const payload = {
        ...projectForm,
        technologies: projectForm.technologies
          ? projectForm.technologies.split(',').map(t => t.trim()).filter(Boolean)
          : []
      };
      await api.projects.create(payload);
      setFeedback({ type: 'success', msg: 'Project added successfully! Skills have been automatically inferred.' });
      
      // Reset form clean
      setProjectForm({
        title: '',
        problemStatement: '',
        solution: '',
        description: '',
        technologies: '',
        role: '',
        teamSize: '1',
        githubUrl: '',
        demoUrl: '',
        duration: '',
        outcome: ''
      });
      setIsProjectModalOpen(false);
      await loadAll();
      if (onDataChanged) onDataChanged();
      setTimeout(() => setFeedback({ type: '', msg: '' }), 4000);
    } catch (err) {
      setFeedback({ type: 'error', msg: err.message || 'Failed to save project' });
    }
  };

  const handleImportGithub = async (e) => {
    e.preventDefault();
    if (!githubRepoUrl.trim()) return;

    setImportingRepo(true);
    try {
      const res = await api.projects.importGithub(githubRepoUrl.trim());
      setFeedback({ type: 'success', msg: `Imported repository "${res.project.title}" from GitHub!` });
      setGithubRepoUrl('');
      await loadAll();
      if (onDataChanged) onDataChanged();
      setTimeout(() => setFeedback({ type: '', msg: '' }), 4000);
    } catch (err) {
      setFeedback({ type: 'error', msg: err.message || 'Failed to import repository' });
    } finally {
      setImportingRepo(false);
    }
  };

  const handleDeleteProject = async (id) => {
    if (!window.confirm('Delete this project?')) return;
    try {
      await api.projects.delete(id);
      await loadAll();
      if (onDataChanged) onDataChanged();
    } catch (err) {
      alert('Delete failed: ' + err.message);
    }
  };

  const handleAddSkill = async (e) => {
    e.preventDefault();
    if (!skillForm.name.trim()) return;

    try {
      await api.skills.add({
        name: skillForm.name.trim(),
        category: skillForm.category,
        proficiency: Number(skillForm.proficiency)
      });
      setSkillForm({ name: '', category: 'Programming', proficiency: '80' });
      setIsSkillModalOpen(false);
      await loadAll();
      if (onDataChanged) onDataChanged();
    } catch (err) {
      alert('Failed to add skill: ' + err.message);
    }
  };

  const handleDeleteSkill = async (id) => {
    try {
      await api.skills.delete(id);
      await loadAll();
      if (onDataChanged) onDataChanged();
    } catch (err) {
      alert('Failed to delete skill: ' + err.message);
    }
  };

  const handleInferSkills = async () => {
    setInferringSkills(true);
    try {
      const res = await api.skills.infer();
      setFeedback({ type: 'success', msg: `AI skill inference complete! Extracted ${res.inferredCount || 0} evidence-backed competencies.` });
      await loadAll();
      if (onDataChanged) onDataChanged();
      setTimeout(() => setFeedback({ type: '', msg: '' }), 4000);
    } catch (err) {
      setFeedback({ type: 'error', msg: err.message || 'Inference failed' });
    } finally {
      setInferringSkills(false);
    }
  };

  if (loading) {
    return (
      <div className="p-12 text-center text-slate-400 flex flex-col items-center justify-center space-y-3">
        <div className="w-8 h-8 border-2 border-sky-400 border-t-transparent rounded-full animate-spin" />
        <span className="text-sm">Cataloging verified student projects and technical competencies...</span>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      
      {/* Top Banner */}
      <div className="p-6 bg-slate-900/80 border border-cyan-500/20 rounded-2xl">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center space-x-2.5 mb-2">
              <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-sky-500/20 text-sky-300 border border-sky-500/40">
                Verified Project Vault & Skill Evidence
              </span>
              <span className="text-slate-500">•</span>
              <span className="text-xs text-slate-400">
                Supports Manual Creation or 1-Click GitHub Import
              </span>
            </div>
            <h1 className="text-xl md:text-2xl font-black text-slate-100 tracking-tight">
              Projects & Categorized Skills
            </h1>
            <p className="text-xs md:text-sm text-slate-400 mt-1 max-w-2xl">
              Add unlimited software projects detailing problem statements, architectures, and outcomes. Skills are automatically verified and mapped directly to your live portfolio.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <button
              onClick={handleInferSkills}
              disabled={inferringSkills}
              className="px-3.5 py-2 rounded-xl bg-purple-950/60 hover:bg-purple-900/60 text-purple-300 border border-purple-500/40 text-xs font-semibold flex items-center space-x-1.5 transition"
            >
              <Sparkles className="w-3.5 h-3.5 text-purple-400" />
              <span>{inferringSkills ? 'Inferring...' : 'AI Infer Skills'}</span>
            </button>

            <button
              onClick={() => setIsProjectModalOpen(true)}
              className="px-4 py-2 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold text-xs flex items-center space-x-1.5 transition shadow-md glow-cyan"
            >
              <Plus className="w-4 h-4" />
              <span>+ Add Project</span>
            </button>
          </div>
        </div>

        {feedback.msg && (
          <div className={`mt-4 p-3 rounded-xl text-xs flex items-center space-x-2 ${
            feedback.type === 'success' 
              ? 'bg-emerald-950/40 border border-emerald-500/40 text-emerald-200' 
              : 'bg-red-950/40 border border-red-500/40 text-red-200'
          }`}>
            {feedback.type === 'success' ? <CheckCircle2 className="w-4 h-4 text-emerald-400" /> : <AlertCircle className="w-4 h-4 text-red-400" />}
            <span>{feedback.msg}</span>
          </div>
        )}
      </div>

      {/* 1-Click Import from GitHub Card */}
      <div className="p-4 bg-slate-900/50 border border-slate-800 rounded-xl flex flex-col md:flex-row items-center justify-between gap-3">
        <div className="flex items-center space-x-2 text-xs text-slate-300">
          <GithubIcon className="w-4 h-4 text-cyan-400 shrink-0" />
          <span>Quick Import: Paste any public GitHub repository URL to auto-extract details:</span>
        </div>
        <form onSubmit={handleImportGithub} className="flex space-x-2 w-full md:w-auto">
          <input
            type="url"
            value={githubRepoUrl}
            onChange={(e) => setGithubRepoUrl(e.target.value)}
            placeholder="https://github.com/username/repo"
            className="w-full md:w-72 bg-slate-950 border border-slate-700 rounded-lg px-2.5 py-1.5 text-xs text-slate-100 placeholder:text-slate-600 outline-none"
          />
          <button
            type="submit"
            disabled={importingRepo}
            className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-cyan-300 border border-slate-700 text-xs font-semibold flex items-center space-x-1 shrink-0"
          >
            <Download className="w-3.5 h-3.5" />
            <span>{importingRepo ? 'Importing...' : 'Import'}</span>
          </button>
        </form>
      </div>

      {/* Projects List */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-sm font-bold text-slate-300 uppercase tracking-wider flex items-center space-x-2">
            <span>Student Projects ({projects.length})</span>
          </h2>
        </div>

        {projects.length === 0 ? (
          <div className="p-8 bg-slate-900/40 border border-dashed border-slate-800 rounded-xl text-center text-xs text-slate-500">
            No projects added yet. Click "+ Add Project" or import a repository from GitHub.
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {projects.map((proj) => (
              <div 
                key={proj.id}
                className="p-5 bg-slate-900/70 border border-slate-800 hover:border-cyan-500/30 rounded-2xl flex flex-col justify-between space-y-4 transition-all"
              >
                <div>
                  <div className="flex items-start justify-between gap-2 mb-2">
                    <h3 className="text-base font-bold text-slate-100">{proj.title}</h3>
                    <button
                      onClick={() => handleDeleteProject(proj.id)}
                      className="text-slate-500 hover:text-red-400 p-1"
                      title="Delete project"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>

                  {proj.problemStatement && (
                    <div className="text-xs text-slate-400 mb-2">
                      <strong className="text-slate-300">Problem: </strong>
                      {proj.problemStatement}
                    </div>
                  )}

                  {proj.solution && (
                    <div className="text-xs text-slate-300 mb-2">
                      <strong className="text-cyan-400">Solution: </strong>
                      {proj.solution}
                    </div>
                  )}

                  {proj.description && !proj.solution && (
                    <p className="text-xs text-slate-400 mb-2 line-clamp-3">
                      {proj.description}
                    </p>
                  )}

                  {/* Metadata pills */}
                  <div className="flex flex-wrap items-center gap-2 text-[11px] text-slate-400 my-3">
                    {proj.role && (
                      <span className="px-2 py-0.5 rounded bg-slate-800 text-slate-300">
                        Role: {proj.role}
                      </span>
                    )}
                    {proj.duration && (
                      <span className="px-2 py-0.5 rounded bg-slate-800 text-slate-300 flex items-center">
                        <Clock className="w-3 h-3 mr-1" /> {proj.duration}
                      </span>
                    )}
                    {proj.teamSize && (
                      <span className="px-2 py-0.5 rounded bg-slate-800 text-slate-300 flex items-center">
                        <Users className="w-3 h-3 mr-1" /> Team: {proj.teamSize}
                      </span>
                    )}
                  </div>

                  {/* Tech stack */}
                  {proj.technologies && proj.technologies.length > 0 && (
                    <div className="flex flex-wrap gap-1 mt-2">
                      {proj.technologies.map((t, idx) => (
                        <span key={idx} className="px-2 py-0.5 rounded text-[10px] font-mono bg-cyan-950/60 border border-cyan-500/20 text-cyan-300">
                          {t}
                        </span>
                      ))}
                    </div>
                  )}
                </div>

                {/* Links */}
                <div className="pt-3 border-t border-slate-800/80 flex items-center justify-between text-xs">
                  <div className="flex items-center space-x-3">
                    {proj.githubUrl && (
                      <a 
                        href={proj.githubUrl} 
                        target="_blank" 
                        rel="noreferrer" 
                        className="text-cyan-400 hover:text-cyan-300 flex items-center space-x-1"
                      >
                        <GithubIcon className="w-3.5 h-3.5" />
                        <span>Source Code</span>
                      </a>
                    )}
                    {proj.demoUrl && (
                      <a 
                        href={proj.demoUrl} 
                        target="_blank" 
                        rel="noreferrer" 
                        className="text-emerald-400 hover:text-emerald-300 flex items-center space-x-1"
                      >
                        <ExternalLink className="w-3.5 h-3.5" />
                        <span>Live Demo</span>
                      </a>
                    )}
                  </div>
                  {proj.outcome && (
                    <span className="text-[10px] text-emerald-400 font-semibold truncate max-w-[150px]">
                      {proj.outcome}
                    </span>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Categorized Skills Section */}
      <div className="p-6 bg-slate-900/80 border border-slate-800 rounded-2xl space-y-4">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
          <div>
            <h2 className="text-base font-bold text-slate-100 flex items-center space-x-2">
              <Cpu className="w-5 h-5 text-cyan-400" />
              <span>Evidence-Backed Skill Competencies ({skills.length})</span>
            </h2>
            <p className="text-xs text-slate-400">
              Categorized into 11 domains with weighted confidence derived from actual code and credentials.
            </p>
          </div>

          <button
            onClick={() => setIsSkillModalOpen(true)}
            className="px-3.5 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-cyan-300 border border-cyan-500/30 text-xs font-semibold flex items-center space-x-1"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>+ Add Skill Manually</span>
          </button>
        </div>

        {/* Group skills by category */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 pt-2">
          {SKILL_CATEGORIES.map((cat) => {
            const catSkills = skills.filter(s => (s.category || 'Other').toLowerCase() === cat.toLowerCase());
            if (catSkills.length === 0) return null;

            return (
              <div key={cat} className="p-4 bg-slate-950/70 border border-slate-800/80 rounded-xl space-y-2">
                <span className="text-[11px] font-bold text-cyan-400 uppercase font-mono block">
                  {cat} ({catSkills.length})
                </span>
                <div className="flex flex-wrap gap-1.5">
                  {catSkills.map((sk) => (
                    <div 
                      key={sk.id || sk.name}
                      className="px-2 py-1 rounded-lg bg-slate-900 border border-slate-700/80 text-xs text-slate-200 flex items-center space-x-1.5 group"
                    >
                      <span>{sk.name}</span>
                      <span className="text-[10px] text-cyan-400 font-mono font-bold">{sk.proficiency || 80}%</span>
                      <button
                        onClick={() => handleDeleteSkill(sk.id)}
                        className="text-slate-500 hover:text-red-400 ml-1 opacity-0 group-hover:opacity-100 transition"
                      >
                        <X className="w-3 h-3" />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Add Project Modal */}
      {isProjectModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md">
          <div className="w-full max-w-xl bg-slate-900 border border-cyan-500/40 rounded-2xl p-6 shadow-2xl relative max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-base font-bold text-slate-100 flex items-center space-x-2">
                <Layers className="w-5 h-5 text-cyan-400" />
                <span>Add Student Project</span>
              </h3>
              <button onClick={() => setIsProjectModalOpen(false)} className="text-slate-400 hover:text-slate-200">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateProject} className="space-y-3.5 text-xs">
              <div>
                <label className="block text-slate-300 mb-1">Project Title <span className="text-cyan-400">*</span></label>
                <input
                  type="text"
                  required
                  name="title"
                  value={projectForm.title}
                  onChange={handleProjectInputChange}
                  placeholder="e.g. Real-Time Autonomous Drone Flight Controller"
                  className="w-full bg-slate-950 border border-slate-700 focus:border-cyan-400 rounded-xl p-2.5 text-slate-100 outline-none"
                />
              </div>

              <div>
                <label className="block text-slate-300 mb-1">Problem Statement</label>
                <textarea
                  name="problemStatement"
                  rows={2}
                  value={projectForm.problemStatement}
                  onChange={handleProjectInputChange}
                  placeholder="What specific engineering challenge or user pain point does this solve?"
                  className="w-full bg-slate-950 border border-slate-700 focus:border-cyan-400 rounded-xl p-2.5 text-slate-100 outline-none"
                />
              </div>

              <div>
                <label className="block text-slate-300 mb-1">Solution & Technical Approach</label>
                <textarea
                  name="solution"
                  rows={2}
                  value={projectForm.solution}
                  onChange={handleProjectInputChange}
                  placeholder="How did you architect and execute the solution?"
                  className="w-full bg-slate-950 border border-slate-700 focus:border-cyan-400 rounded-xl p-2.5 text-slate-100 outline-none"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-300 mb-1">Technologies Used (Comma separated)</label>
                  <input
                    type="text"
                    name="technologies"
                    value={projectForm.technologies}
                    onChange={handleProjectInputChange}
                    placeholder="e.g. React, WebSockets, Python, FastAPI"
                    className="w-full bg-slate-950 border border-slate-700 focus:border-cyan-400 rounded-xl p-2.5 text-slate-100 outline-none"
                  />
                </div>

                <div>
                  <label className="block text-slate-300 mb-1">Your Role / Contribution</label>
                  <input
                    type="text"
                    name="role"
                    value={projectForm.role}
                    onChange={handleProjectInputChange}
                    placeholder="e.g. Lead Frontend Architect"
                    className="w-full bg-slate-950 border border-slate-700 focus:border-cyan-400 rounded-xl p-2.5 text-slate-100 outline-none"
                  />
                </div>

                <div>
                  <label className="block text-slate-300 mb-1">GitHub Repository URL</label>
                  <input
                    type="url"
                    name="githubUrl"
                    value={projectForm.githubUrl}
                    onChange={handleProjectInputChange}
                    placeholder="https://github.com/..."
                    className="w-full bg-slate-950 border border-slate-700 focus:border-cyan-400 rounded-xl p-2.5 text-slate-100 outline-none"
                  />
                </div>

                <div>
                  <label className="block text-slate-300 mb-1">Live Demo / Deployment URL</label>
                  <input
                    type="url"
                    name="demoUrl"
                    value={projectForm.demoUrl}
                    onChange={handleProjectInputChange}
                    placeholder="https://myapp.vercel.app"
                    className="w-full bg-slate-950 border border-slate-700 focus:border-cyan-400 rounded-xl p-2.5 text-slate-100 outline-none"
                  />
                </div>

                <div>
                  <label className="block text-slate-300 mb-1">Team Size</label>
                  <input
                    type="text"
                    name="teamSize"
                    value={projectForm.teamSize}
                    onChange={handleProjectInputChange}
                    placeholder="e.g. 1 (Solo) or 4"
                    className="w-full bg-slate-950 border border-slate-700 focus:border-cyan-400 rounded-xl p-2.5 text-slate-100 outline-none"
                  />
                </div>

                <div>
                  <label className="block text-slate-300 mb-1">Key Measurable Outcome</label>
                  <input
                    type="text"
                    name="outcome"
                    value={projectForm.outcome}
                    onChange={handleProjectInputChange}
                    placeholder="e.g. Reduced telemetry latency by 45%"
                    className="w-full bg-slate-950 border border-slate-700 focus:border-cyan-400 rounded-xl p-2.5 text-slate-100 outline-none"
                  />
                </div>
              </div>

              <div className="pt-3 flex justify-end space-x-2">
                <button
                  type="button"
                  onClick={() => setIsProjectModalOpen(false)}
                  className="px-4 py-2 rounded-xl bg-slate-800 text-slate-300 font-medium"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold"
                >
                  Save Project
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Add Skill Modal */}
      {isSkillModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md">
          <div className="w-full max-w-sm bg-slate-900 border border-cyan-500/40 rounded-2xl p-6 shadow-2xl relative space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-base font-bold text-slate-100">Add Technical Skill</h3>
              <button onClick={() => setIsSkillModalOpen(false)} className="text-slate-400 hover:text-slate-200">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleAddSkill} className="space-y-3 text-xs">
              <div>
                <label className="block text-slate-300 mb-1">Skill Name</label>
                <input
                  type="text"
                  required
                  value={skillForm.name}
                  onChange={(e) => setSkillForm({ ...skillForm, name: e.target.value })}
                  placeholder="e.g. TypeScript / Docker / Figma"
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl p-2.5 text-slate-100 outline-none"
                />
              </div>

              <div>
                <label className="block text-slate-300 mb-1">Category</label>
                <select
                  value={skillForm.category}
                  onChange={(e) => setSkillForm({ ...skillForm, category: e.target.value })}
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl p-2.5 text-slate-100 outline-none"
                >
                  {SKILL_CATEGORIES.map(c => (
                    <option key={c} value={c}>{c}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-slate-300 mb-1">Proficiency Level ({skillForm.proficiency}%)</label>
                <input
                  type="range"
                  min="20"
                  max="100"
                  step="5"
                  value={skillForm.proficiency}
                  onChange={(e) => setSkillForm({ ...skillForm, proficiency: e.target.value })}
                  className="w-full"
                />
              </div>

              <div className="pt-2 flex justify-end space-x-2">
                <button
                  type="button"
                  onClick={() => setIsSkillModalOpen(false)}
                  className="px-3 py-1.5 rounded-lg bg-slate-800 text-slate-300"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 rounded-lg bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold"
                >
                  Add Skill
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}
