import React, { useState, useEffect } from 'react';
import { api } from '../api';
import { 
  Sparkles, 
  Plus, 
  Trash2, 
  CheckCircle2, 
  AlertCircle, 
  Search, 
  Filter, 
  Tag, 
  Layers, 
  Cpu, 
  ShieldCheck, 
  RefreshCw, 
  X,
  Award,
  Code2,
  FileCheck2,
  BookOpen
} from 'lucide-react';

const SKILL_CATEGORIES = [
  'All',
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

export default function SkillsView({ onDataChanged }) {
  const [skills, setSkills] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [inferring, setInferring] = useState(false);
  const [feedback, setFeedback] = useState({ type: '', msg: '' });

  // Add skill form
  const [skillForm, setSkillForm] = useState({
    name: '',
    category: 'Programming',
    proficiency: '80'
  });

  useEffect(() => {
    loadSkills();
  }, []);

  const loadSkills = async () => {
    setLoading(true);
    try {
      const data = await api.skills.getAll();
      setSkills(data.skills || (Array.isArray(data) ? data : []));
    } catch (err) {
      console.error('Failed to load skills:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleAddSkill = async (e) => {
    e.preventDefault();
    if (!skillForm.name.trim()) {
      setFeedback({ type: 'error', msg: 'Skill name is required.' });
      return;
    }

    try {
      await api.skills.add({
        name: skillForm.name.trim(),
        category: skillForm.category,
        proficiency: Number(skillForm.proficiency)
      });
      setSkillForm({ name: '', category: 'Programming', proficiency: '80' });
      setIsAddModalOpen(false);
      setFeedback({ type: 'success', msg: `Skill "${skillForm.name}" added successfully.` });
      await loadSkills();
      if (onDataChanged) onDataChanged();
      setTimeout(() => setFeedback({ type: '', msg: '' }), 4000);
    } catch (err) {
      setFeedback({ type: 'error', msg: err.message || 'Failed to add skill.' });
    }
  };

  const handleDeleteSkill = async (id) => {
    if (!window.confirm('Remove this skill from your profile?')) return;
    try {
      await api.skills.delete(id);
      await loadSkills();
      if (onDataChanged) onDataChanged();
    } catch (err) {
      alert('Delete failed: ' + err.message);
    }
  };

  const handleInferSkills = async () => {
    setInferring(true);
    setFeedback({ type: '', msg: '' });
    try {
      const res = await api.skills.infer();
      setFeedback({
        type: 'success',
        msg: res.message || `Inferred ${res.inferredCount || 0} skills from your projects, transcripts, and repositories!`
      });
      await loadSkills();
      if (onDataChanged) onDataChanged();
      setTimeout(() => setFeedback({ type: '', msg: '' }), 6000);
    } catch (err) {
      setFeedback({ type: 'error', msg: err.message || 'Failed to run skill inference.' });
    } finally {
      setInferring(false);
    }
  };

  const filteredSkills = skills.filter(s => {
    const matchesCat = selectedCategory === 'All' || s.category === selectedCategory;
    const matchesSearch = s.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          (s.category && s.category.toLowerCase().includes(searchQuery.toLowerCase()));
    return matchesCat && matchesSearch;
  });

  const verifiedCount = skills.filter(s => s.verified).length;

  return (
    <div className="space-y-6">
      
      {/* Top Banner */}
      <div className="p-6 bg-slate-900/80 border border-cyan-500/20 rounded-2xl">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center space-x-2.5 mb-2">
              <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-cyan-500/20 text-cyan-300 border border-cyan-500/40">
                Multi-Source Skill Matrix
              </span>
              <span className="text-slate-500">•</span>
              <span className="text-xs text-slate-400">
                11 Standard Industry Categories
              </span>
            </div>
            <h1 className="text-xl md:text-2xl font-black text-slate-100 tracking-tight">
              Candidate Skills & Competency Evidence
            </h1>
            <p className="text-xs md:text-sm text-slate-400 mt-1 max-w-2xl">
              Add skills manually or automatically infer competencies from your uploaded projects, GitHub repositories, verified certificates, and academic transcripts. Verified badges require actual evidence.
            </p>
          </div>

          {/* Quick Metrics */}
          <div className="flex items-center space-x-3 bg-slate-950 p-4 rounded-xl border border-slate-800 shrink-0">
            <div className="text-center px-3 border-r border-slate-800">
              <span className="text-[10px] text-slate-400 uppercase font-mono block">Total Skills</span>
              <span className="text-2xl font-black text-slate-100 font-mono">{skills.length}</span>
            </div>
            <div className="text-center px-3">
              <span className="text-[10px] text-slate-400 uppercase font-mono block">Verified</span>
              <span className="text-2xl font-black text-emerald-400 font-mono">{verifiedCount}</span>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="mt-5 pt-4 border-t border-slate-800 flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center space-x-2">
            <button
              onClick={() => setIsAddModalOpen(true)}
              className="px-4 py-2 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold text-xs flex items-center space-x-1.5 transition shadow-md glow-cyan"
            >
              <Plus className="w-4 h-4" />
              <span>Add Skill Manually</span>
            </button>
            <button
              onClick={handleInferSkills}
              disabled={inferring}
              className="px-4 py-2 rounded-xl bg-slate-950 hover:bg-slate-800 text-cyan-300 border border-cyan-500/30 text-xs font-semibold flex items-center space-x-1.5 transition disabled:opacity-50"
            >
              <Sparkles className={`w-4 h-4 text-cyan-400 ${inferring ? 'animate-spin' : ''}`} />
              <span>{inferring ? 'Inferring Skills...' : 'Infer Skills with AI'}</span>
            </button>
          </div>

          <div className="text-xs text-slate-400 font-mono">
            {verifiedCount} of {skills.length} skills backed by verified evidence
          </div>
        </div>

        {/* Feedback message */}
        {feedback.msg && (
          <div className={`mt-4 p-3 rounded-xl border text-xs flex items-center space-x-2 ${
            feedback.type === 'error'
              ? 'bg-red-950/40 border-red-500/40 text-red-200'
              : 'bg-emerald-950/40 border-emerald-500/40 text-emerald-200'
          }`}>
            {feedback.type === 'error' ? <AlertCircle className="w-4 h-4 text-red-400 shrink-0" /> : <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />}
            <span>{feedback.msg}</span>
          </div>
        )}
      </div>

      {/* Filter and Search Bar */}
      <div className="p-4 bg-slate-900/60 border border-slate-800 rounded-xl space-y-3">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
          {/* Search box */}
          <div className="relative w-full sm:w-72">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search skills by name or category..."
              className="w-full bg-slate-950 border border-slate-800 focus:border-cyan-400 rounded-lg pl-9 pr-3 py-1.5 text-xs text-slate-100 placeholder:text-slate-500 outline-none"
            />
          </div>

          {/* Evidence legend */}
          <div className="flex items-center space-x-3 text-[11px] text-slate-400">
            <span className="flex items-center space-x-1">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
              <span>Verified with Evidence</span>
            </span>
            <span className="flex items-center space-x-1">
              <span className="w-3.5 h-3.5 rounded-full border border-slate-600 inline-block" />
              <span>Self-Reported</span>
            </span>
          </div>
        </div>

        {/* Category Pills */}
        <div className="flex flex-wrap gap-1.5 pt-2 border-t border-slate-800/60">
          {SKILL_CATEGORIES.map(cat => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-2.5 py-1 rounded-lg text-xs font-medium transition ${
                selectedCategory === cat
                  ? 'bg-cyan-500 text-slate-950 font-bold'
                  : 'bg-slate-950 text-slate-400 hover:text-slate-200 hover:bg-slate-800 border border-slate-800/80'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Skills Grid */}
      {loading ? (
        <div className="p-12 text-center text-slate-400 flex flex-col items-center justify-center space-y-3">
          <div className="w-8 h-8 border-2 border-cyan-400 border-t-transparent rounded-full animate-spin" />
          <span className="text-sm">Loading skills inventory...</span>
        </div>
      ) : filteredSkills.length === 0 ? (
        <div className="p-12 bg-slate-900/30 border border-dashed border-slate-800 rounded-2xl text-center space-y-3">
          <Layers className="w-10 h-10 text-slate-600 mx-auto" />
          <p className="text-sm text-slate-400">No skills found in this category.</p>
          <button
            onClick={() => setIsAddModalOpen(true)}
            className="px-3 py-1.5 rounded-lg bg-cyan-600 hover:bg-cyan-500 text-white text-xs font-semibold"
          >
            Add Your First Skill
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredSkills.map(skill => (
            <div
              key={skill.id}
              className={`p-4 rounded-xl border transition-all flex flex-col justify-between ${
                skill.verified
                  ? 'bg-slate-900/80 border-emerald-500/30 hover:border-emerald-500/50'
                  : 'bg-slate-900/50 border-slate-800 hover:border-slate-700'
              }`}
            >
              <div>
                <div className="flex items-start justify-between gap-2 mb-2">
                  <div>
                    <h3 className="font-bold text-slate-100 text-sm flex items-center space-x-1.5">
                      <span>{skill.name}</span>
                      {skill.verified && (
                        <span title="Verified with real evidence">
                          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                        </span>
                      )}
                    </h3>
                    <span className="px-2 py-0.5 rounded text-[10px] font-mono font-medium bg-slate-800 text-slate-400 inline-block mt-1">
                      {skill.category}
                    </span>
                  </div>

                  <button
                    onClick={() => handleDeleteSkill(skill.id)}
                    className="text-slate-500 hover:text-red-400 p-1 rounded hover:bg-slate-800 transition"
                    title="Delete skill"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>

                {/* Proficiency Bar */}
                <div className="mt-3 space-y-1">
                  <div className="flex justify-between text-[11px] font-mono">
                    <span className="text-slate-400">Proficiency</span>
                    <span className="text-cyan-300 font-bold">{skill.proficiency}%</span>
                  </div>
                  <div className="w-full h-1.5 bg-slate-800 rounded-full overflow-hidden">
                    <div 
                      className={`h-full rounded-full ${
                        skill.verified ? 'bg-gradient-to-r from-emerald-500 to-cyan-400' : 'bg-slate-500'
                      }`}
                      style={{ width: `${skill.proficiency}%` }}
                    />
                  </div>
                </div>
              </div>

              {/* Source Tag */}
              <div className="mt-4 pt-2.5 border-t border-slate-800/80 flex items-center justify-between text-[10px] text-slate-400 font-mono">
                <span>Source:</span>
                <span className={skill.verified ? 'text-emerald-400 font-semibold' : 'text-slate-400'}>
                  {skill.source || (skill.verified ? 'Verified Evidence' : 'Self-Reported')}
                </span>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Add Skill Modal */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md">
          <div className="w-full max-w-md bg-[#0b1220] border border-cyan-500/30 rounded-2xl shadow-2xl p-6 relative">
            <button
              onClick={() => setIsAddModalOpen(false)}
              className="absolute top-4 right-4 text-slate-400 hover:text-slate-100 p-1 rounded-lg hover:bg-slate-800"
            >
              <X className="w-5 h-5" />
            </button>

            <h3 className="text-base font-bold text-slate-100 mb-1">Add Technical Skill</h3>
            <p className="text-xs text-slate-400 mb-4">Register a manual skill or framework competency.</p>

            <form onSubmit={handleAddSkill} className="space-y-4">
              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">Skill Name *</label>
                <input
                  type="text"
                  required
                  value={skillForm.name}
                  onChange={(e) => setSkillForm({ ...skillForm, name: e.target.value })}
                  placeholder="e.g. React, PostgreSQL, Docker, Figma"
                  className="w-full bg-slate-900 border border-slate-700 focus:border-cyan-400 rounded-xl px-3 py-2 text-sm text-slate-100 outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">Category</label>
                <select
                  value={skillForm.category}
                  onChange={(e) => setSkillForm({ ...skillForm, category: e.target.value })}
                  className="w-full bg-slate-900 border border-slate-700 focus:border-cyan-400 rounded-xl px-3 py-2 text-sm text-slate-100 outline-none"
                >
                  {SKILL_CATEGORIES.filter(c => c !== 'All').map(cat => (
                    <option key={cat} value={cat}>{cat}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">
                  Proficiency ({skillForm.proficiency}%)
                </label>
                <input
                  type="range"
                  min="30"
                  max="100"
                  value={skillForm.proficiency}
                  onChange={(e) => setSkillForm({ ...skillForm, proficiency: e.target.value })}
                  className="w-full accent-cyan-400"
                />
              </div>

              <div className="flex justify-end space-x-2 pt-2">
                <button
                  type="button"
                  onClick={() => setIsAddModalOpen(false)}
                  className="px-4 py-2 rounded-xl bg-slate-800 text-slate-300 text-xs font-medium hover:bg-slate-700"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold text-xs"
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
