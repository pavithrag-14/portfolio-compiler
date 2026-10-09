import React, { useState, useEffect } from 'react';
import { api } from '../api';
import RadarChart from '../components/RadarChart';
import { 
  Target, 
  TrendingUp, 
  CheckCircle2, 
  AlertTriangle, 
  Sparkles, 
  ArrowRight, 
  Zap, 
  BookOpen, 
  FileText,
  RefreshCw,
  Clock,
  Layers
} from 'lucide-react';

export default function SkillGapView({ onNavigateToAssessments }) {
  const [gapData, setGapData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [boostingSkill, setBoostingSkill] = useState(null);

  useEffect(() => {
    loadGap();
  }, []);

  const loadGap = async () => {
    setLoading(true);
    try {
      const data = await api.skills.gapAnalysis();
      setGapData(data);
    } catch (err) {
      console.error('Failed to load skill gap:', err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="p-12 text-center text-slate-400 flex flex-col items-center justify-center space-y-3">
        <div className="w-8 h-8 border-2 border-cyan-400 border-t-transparent rounded-full animate-spin" />
        <span className="text-sm">Calculating role vector alignment and skill gaps...</span>
      </div>
    );
  }

  const {
    roleTitle = 'UI/UX Designer',
    overallMatch = 0,
    radarData = [],
    strongSkills = [],
    moderateSkills = [],
    weakSkills = [],
    missingSkills = [],
    recommendations = []
  } = gapData || {};

  return (
    <div className="space-y-6">
      
      {/* Top Header Card */}
      <div className="p-6 bg-slate-900/80 border border-cyan-500/20 rounded-2xl">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center space-x-2.5 mb-2">
              <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-cyan-500/20 text-cyan-300 border border-cyan-500/40">
                Multi-Dimensional Vector Analysis
              </span>
              <span className="text-slate-500">•</span>
              <span className="text-xs text-slate-400">Target Role: <strong className="text-slate-200">{roleTitle}</strong></span>
            </div>
            <h1 className="text-xl md:text-2xl font-black text-slate-100 tracking-tight">
              Skill Gap & Employability Vector Map
            </h1>
            <p className="text-xs md:text-sm text-slate-400 mt-1 max-w-2xl">
              Cross-comparing your verified projects, transcripts, coding activity, and certifications against standard industry requirements for {roleTitle}.
            </p>
          </div>

          <div className="flex items-center space-x-4 bg-slate-950 p-4 rounded-xl border border-slate-800 shrink-0">
            <div className="text-center px-2">
              <span className="text-[10px] text-slate-400 uppercase font-mono block">Overall Fit</span>
              <span className="text-2xl font-black text-emerald-400 font-mono">{overallMatch}%</span>
            </div>
          </div>
        </div>
      </div>

      {/* Main Grid: Radar Chart + Skill Categories */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        
        {/* Left: Radar Chart (5 cols) */}
        <div className="lg:col-span-5 p-6 bg-slate-900/70 border border-slate-800 rounded-2xl flex flex-col items-center justify-center space-y-4">
          <div className="w-full flex items-center justify-between border-b border-slate-800 pb-3">
            <h3 className="text-xs font-bold text-slate-300 uppercase tracking-wider">
              Competency Radar Graph
            </h3>
            <div className="flex items-center space-x-3 text-[10px] font-mono">
              <span className="flex items-center text-cyan-400">
                <span className="w-2 h-2 rounded-full bg-cyan-400 mr-1" /> Current
              </span>
              <span className="flex items-center text-amber-400">
                <span className="w-2 h-2 rounded-full bg-amber-400 mr-1" /> Target
              </span>
            </div>
          </div>

          <div className="py-2">
            <RadarChart data={radarData} size={360} />
          </div>

          <p className="text-[11px] text-slate-500 text-center max-w-xs">
            Outer cyan polygon shows your verified score; dashed orange perimeter reflects industry benchmark.
          </p>
        </div>

        {/* Right: Categorized Breakdown (7 cols) */}
        <div className="lg:col-span-7 space-y-4">
          
          {/* Strong Skills (>= 80%) */}
          <div className="p-4 bg-slate-900/60 border border-emerald-500/30 rounded-xl space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-emerald-400 uppercase tracking-wider flex items-center space-x-1.5">
                <CheckCircle2 className="w-3.5 h-3.5" />
                <span>Strong Competencies (≥ 80%)</span>
              </span>
              <span className="text-xs font-mono text-emerald-400 font-bold">{strongSkills.length} Verified</span>
            </div>
            <div className="flex flex-wrap gap-2 pt-1">
              {strongSkills.length === 0 ? (
                <span className="text-xs text-slate-500">None detected yet. Complete 50-MCQ assessments to build verified scores.</span>
              ) : (
                strongSkills.map((s, idx) => (
                  <div key={idx} className="px-2.5 py-1 rounded-lg bg-emerald-950/40 border border-emerald-500/30 text-xs text-emerald-200 flex items-center space-x-1.5">
                    <span>{s.skill || s.name}</span>
                    <span className="font-mono text-[10px] text-emerald-400 font-bold">{s.current || s.proficiency}%</span>
                  </div>
                ))
              )}
            </div>
          </div>

          {/* Moderate Skills (60-79%) */}
          <div className="p-4 bg-slate-900/60 border border-cyan-500/30 rounded-xl space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-cyan-400 uppercase tracking-wider flex items-center space-x-1.5">
                <TrendingUp className="w-3.5 h-3.5" />
                <span>Moderate Skills (60–79%)</span>
              </span>
              <span className="text-xs font-mono text-cyan-400 font-bold">{moderateSkills.length} Developing</span>
            </div>
            <div className="flex flex-wrap gap-2 pt-1">
              {moderateSkills.length === 0 ? (
                <span className="text-xs text-slate-500">No skills in this band.</span>
              ) : (
                moderateSkills.map((s, idx) => (
                  <div key={idx} className="px-2.5 py-1 rounded-lg bg-cyan-950/40 border border-cyan-500/30 text-xs text-cyan-200 flex items-center space-x-1.5">
                    <span>{s.skill || s.name}</span>
                    <span className="font-mono text-[10px] text-cyan-400 font-bold">{s.current || s.proficiency}%</span>
                  </div>
                ))
              )}
            </div>
          </div>

          {/* Weak Skills (< 60%) */}
          <div className="p-4 bg-slate-900/60 border border-amber-500/30 rounded-xl space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-amber-400 uppercase tracking-wider flex items-center space-x-1.5">
                <AlertTriangle className="w-3.5 h-3.5" />
                <span>Weak Skills (&lt; 60% — Priority Upskilling)</span>
              </span>
              <span className="text-xs font-mono text-amber-400 font-bold">{weakSkills.length} Identified</span>
            </div>
            <div className="flex flex-wrap gap-2 pt-1">
              {weakSkills.length === 0 ? (
                <span className="text-xs text-slate-500">No weak competencies identified.</span>
              ) : (
                weakSkills.map((s, idx) => (
                  <div key={idx} className="px-2.5 py-1 rounded-lg bg-amber-950/40 border border-amber-500/30 text-xs text-amber-200 flex items-center space-x-1.5">
                    <span>{s.skill || s.name}</span>
                    <span className="font-mono text-[10px] text-amber-400 font-bold">{s.current || s.proficiency}%</span>
                  </div>
                ))
              )}
            </div>
          </div>

          {/* Missing Skills (0%) */}
          {missingSkills.length > 0 && (
            <div className="p-4 bg-slate-900/60 border border-red-500/30 rounded-xl space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-red-400 uppercase tracking-wider flex items-center space-x-1.5">
                  <AlertTriangle className="w-3.5 h-3.5" />
                  <span>Missing Role Competencies (0%)</span>
                </span>
                <span className="text-xs font-mono text-red-400 font-bold">{missingSkills.length} Missing</span>
              </div>
              <div className="flex flex-wrap gap-2 pt-1">
                {missingSkills.map((s, idx) => (
                  <div key={idx} className="px-2.5 py-1 rounded-lg bg-red-950/40 border border-red-500/30 text-xs text-red-200 flex items-center space-x-1.5">
                    <span>{s.skill || s.name}</span>
                    <span className="font-mono text-[10px] text-red-400 font-bold">0%</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Action Recommendation to take 50-MCQ */}
          <div className="p-4 bg-gradient-to-r from-cyan-950/50 to-blue-950/50 border border-cyan-500/30 rounded-xl flex items-center justify-between gap-3">
            <div>
              <h4 className="text-xs font-bold text-slate-100 flex items-center space-x-1.5">
                <Sparkles className="w-4 h-4 text-cyan-400" />
                <span>Ready to close these skill gaps?</span>
              </h4>
              <p className="text-[11px] text-slate-400 mt-0.5">
                Take our calibrated 50-Question Topic Assessments to prove your technical ability and elevate your score.
              </p>
            </div>
            <button
              onClick={onNavigateToAssessments}
              className="px-3.5 py-2 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold text-xs flex items-center space-x-1.5 transition shadow-md glow-cyan shrink-0"
            >
              <span>Take Assessment</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

        </div>

      </div>

    </div>
  );
}
