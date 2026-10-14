import React, { useState, useEffect } from 'react';
import { api } from '../api';
import { 
  Target, 
  CheckCircle2, 
  Sparkles, 
  Layers, 
  BookOpen, 
  ArrowRight, 
  ChevronRight,
  TrendingUp,
  Cpu,
  Shield,
  Palette,
  Database,
  Cloud,
  ArrowLeft
} from 'lucide-react';

export default function TargetRoleView({ onRoleSelected, onNavigateToGap, onNavigate }) {
  const [roles, setRoles] = useState([]);
  const [currentRole, setCurrentRole] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selectedRoleId, setSelectedRoleId] = useState('');
  const [customTitle, setCustomTitle] = useState('');
  const [saving, setSaving] = useState(false);
  const [successMsg, setSuccessMsg] = useState('');

  useEffect(() => {
    loadRoles();
  }, []);

  const loadRoles = async () => {
    setLoading(true);
    try {
      const data = await api.roles.getAll();
      setRoles(data.roles || []);
      setCurrentRole(data.currentRole || null);
      if (data.currentRole?.id) {
        setSelectedRoleId(data.currentRole.id);
      } else if (data.roles?.length > 0) {
        setSelectedRoleId(data.roles[0].id);
      }
    } catch (err) {
      console.error('Failed to load target roles:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleSelectRole = async (roleId) => {
    setSelectedRoleId(roleId);
    setSaving(true);
    setSuccessMsg('');

    try {
      const res = await api.roles.select(roleId, roleId === 'custom-role' ? customTitle : undefined);
      setCurrentRole(res.selectedRole);
      setSuccessMsg(`Target role updated to "${res.selectedRole.title}"! Skills and assessments realigned.`);
      if (onRoleSelected) onRoleSelected(res.selectedRole);
      setTimeout(() => setSuccessMsg(''), 4000);
    } catch (err) {
      alert('Failed to select role: ' + err.message);
    } finally {
      setSaving(false);
    }
  };

  const getRoleIcon = (roleId) => {
    if (roleId.includes('ui-ux')) return <Palette className="w-5 h-5 text-amber-400" />;
    if (roleId.includes('machine-learning') || roleId.includes('ai')) return <Sparkles className="w-5 h-5 text-purple-400" />;
    if (roleId.includes('data')) return <Database className="w-5 h-5 text-sky-400" />;
    if (roleId.includes('cloud') || roleId.includes('devops')) return <Cloud className="w-5 h-5 text-blue-400" />;
    if (roleId.includes('cybersecurity')) return <Shield className="w-5 h-5 text-rose-400" />;
    return <Cpu className="w-5 h-5 text-cyan-400" />;
  };

  if (loading) {
    return (
      <div className="p-12 text-center text-slate-400 flex flex-col items-center justify-center space-y-3">
        <div className="w-8 h-8 border-2 border-cyan-400 border-t-transparent rounded-full animate-spin" />
        <span className="text-sm">Calibrating role-skill benchmark models...</span>
      </div>
    );
  }

  const activeRoleObj = roles.find(r => r.id === selectedRoleId) || currentRole || roles[0];

  return (
    <div className="space-y-6">
      
      {/* Header */}
      <div className="p-6 bg-slate-900/80 border border-cyan-500/20 rounded-2xl">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center space-x-2.5 mb-2">
              <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-cyan-500/20 text-cyan-300 border border-cyan-500/40">
                11 Benchmark Job Roles + Custom Specialization
              </span>
              <span className="text-slate-500">•</span>
              <span className="text-xs text-slate-400">
                Governs Assessments, Gap Analysis & Interview Q&A
              </span>
            </div>
            <h1 className="text-xl md:text-2xl font-black text-slate-100 tracking-tight">
              Target Role Selection & Competency Mapping
            </h1>
            <p className="text-xs md:text-sm text-slate-400 mt-1 max-w-2xl">
              Selecting your target career path immediately reconfigures required skill vectors, generates personalized 50-MCQ topic assessments, and customizes AI mock interview scenarios.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row items-end sm:items-center gap-3 shrink-0">
            {onNavigate && (
              <div className="flex flex-wrap items-center gap-2">
                <button
                  type="button"
                  onClick={() => onNavigate('dashboard')}
                  className="px-3.5 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold flex items-center space-x-1.5 transition border border-slate-700"
                >
                  <ArrowLeft className="w-3.5 h-3.5 text-cyan-400" />
                  <span>Dashboard</span>
                </button>
                <button
                  type="button"
                  onClick={() => onNavigate('skill-gap')}
                  className="px-3.5 py-2.5 rounded-xl bg-cyan-500/10 hover:bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 text-xs font-semibold flex items-center space-x-1.5 transition cursor-pointer"
                >
                  <span>Next: Skill Gap Analysis</span>
                  <ChevronRight className="w-3.5 h-3.5" />
                </button>
              </div>
            )}

            {currentRole && (
              <div className="px-4 py-2.5 rounded-xl bg-slate-950 border border-cyan-500/30 text-right">
                <span className="text-[10px] text-slate-400 uppercase font-mono block">Current Active Target</span>
                <span className="text-sm font-bold text-cyan-300">{currentRole.title}</span>
              </div>
            )}
          </div>
        </div>

        {successMsg && (
          <div className="mt-4 p-3 rounded-xl bg-emerald-950/40 border border-emerald-500/40 text-emerald-200 text-xs flex flex-wrap items-center justify-between gap-2">
            <div className="flex items-center space-x-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
              <span>{successMsg}</span>
            </div>
            {onNavigate && (
              <button
                type="button"
                onClick={() => onNavigate('skill-gap')}
                className="px-3 py-1.5 rounded-lg bg-emerald-400 hover:bg-emerald-300 text-slate-950 font-bold text-xs flex items-center space-x-1.5 transition shadow-sm cursor-pointer"
              >
                <span>Next: Skill Gap Analysis</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </button>
            )}
          </div>
        )}
      </div>

      {/* Role Selection Grid */}
      <div className="space-y-3">
        <h2 className="text-sm font-bold text-slate-300 uppercase tracking-wider">
          Choose Your Desired Engineering Role
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3.5">
          {roles.map((role) => {
            const isSelected = selectedRoleId === role.id;
            return (
              <div
                key={role.id}
                onClick={() => handleSelectRole(role.id)}
                className={`p-4 rounded-xl border cursor-pointer transition-all flex flex-col justify-between ${
                  isSelected
                    ? 'bg-slate-900 border-cyan-400 ring-2 ring-cyan-500/30 shadow-lg glow-cyan'
                    : 'bg-slate-900/50 border-slate-800 hover:border-slate-700 hover:bg-slate-900/80'
                }`}
              >
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center space-x-2.5">
                      <div className="p-2 rounded-lg bg-slate-950 border border-slate-800">
                        {getRoleIcon(role.id)}
                      </div>
                      <div>
                        <h3 className="font-bold text-slate-100 text-sm">{role.title}</h3>
                        <span className="text-[10px] text-slate-400">{role.category}</span>
                      </div>
                    </div>
                    {isSelected && (
                      <span className="w-2.5 h-2.5 rounded-full bg-cyan-400 ring-4 ring-cyan-500/20" />
                    )}
                  </div>
                  <p className="text-xs text-slate-400 line-clamp-2 mt-1">{role.description}</p>
                </div>

                <div className="mt-3 pt-2.5 border-t border-slate-800/80 flex items-center justify-between text-[11px] text-slate-500">
                  <span>{role.requiredSkills?.length || 0} Core Competencies</span>
                  <span className="text-cyan-400 font-semibold flex items-center">
                    {isSelected ? 'Active Role' : 'Select'}
                    <ChevronRight className="w-3 h-3 ml-0.5" />
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Role Deep-Dive Specifications */}
      {activeRoleObj && (
        <div className="p-6 bg-slate-900/90 border border-slate-800 rounded-2xl space-y-4">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
            <div>
              <span className="text-xs text-cyan-400 font-mono uppercase font-bold">Selected Role Specification</span>
              <h3 className="text-lg font-black text-slate-100">{activeRoleObj.title}</h3>
              <p className="text-xs text-slate-400 max-w-2xl mt-0.5">{activeRoleObj.description}</p>
            </div>

            <button
              onClick={onNavigateToGap}
              className="px-4 py-2 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold text-xs flex items-center space-x-2 transition shadow-md glow-cyan shrink-0"
            >
              <span>Analyze Skill Gaps for this Role</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>

          {/* Competency Weights Table */}
          <div className="pt-2">
            <h4 className="text-xs font-bold text-slate-300 uppercase tracking-wider mb-2">
              Industry Competency Weights & Topic Coverage:
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2">
              {activeRoleObj.requiredSkills?.map((skill, idx) => (
                <div key={idx} className="p-3 bg-slate-950/80 rounded-xl border border-slate-800/80 flex items-center justify-between text-xs">
                  <div>
                    <span className="font-semibold text-slate-200 block">{typeof skill === 'string' ? skill : skill.name}</span>
                    <span className="text-[10px] text-slate-500 font-mono">
                      {typeof skill === 'object' ? `${skill.category} • Priority: ${skill.priority}` : 'Core Requirement'}
                    </span>
                  </div>
                  <span className="font-mono font-bold text-cyan-400 text-xs">
                    {typeof skill === 'object' ? `${skill.weight}%` : '85%'}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Workflow Navigation Footer */}
      <div className="p-5 bg-slate-900/80 border border-cyan-500/30 rounded-2xl flex flex-col sm:flex-row items-center justify-between gap-4">
        <div>
          <span className="text-[10px] font-mono uppercase tracking-wider text-cyan-400 font-bold">Step 6 of 10 Completed</span>
          <h4 className="text-sm font-bold text-slate-100">Ready to analyze your skill gaps?</h4>
          <p className="text-xs text-slate-400">Proceed to Step 7 to see multi-dimensional radar vector comparisons for your selected role.</p>
        </div>
        {onNavigate && (
          <button
            type="button"
            onClick={() => onNavigate('skill-gap')}
            className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-400 hover:to-blue-400 text-slate-950 font-bold text-xs flex items-center space-x-2 transition shadow-md glow-cyan shrink-0 cursor-pointer"
          >
            <span>Proceed to Step 7: Skill Gap Analysis</span>
            <ChevronRight className="w-4 h-4" />
          </button>
        )}
      </div>

    </div>
  );
}
