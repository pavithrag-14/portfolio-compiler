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
  Layers,
  ArrowLeft,
  ChevronRight
} from 'lucide-react';

export default function SkillGapView({ onNavigateToAssessments, onNavigate }) {
  const [gapData, setGapData] = useState(null);
  const [loading, setLoading] = useState(true);

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
      <div className="p-12 text-center text-slate-500 flex flex-col items-center justify-center space-y-3 bg-white border border-slate-200 rounded-2xl shadow-xs">
        <div className="w-8 h-8 border-2 border-blue-600 border-t-transparent rounded-full animate-spin" />
        <span className="text-sm font-medium">Calculating role vector alignment and skill gaps...</span>
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
      <div className="p-6 bg-white border border-slate-200/90 rounded-2xl shadow-xs">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center space-x-2.5 mb-2">
              <span className="px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-blue-50 text-blue-700 border border-blue-200/80">
                Multi-Dimensional Vector Analysis
              </span>
              <span className="text-slate-300">•</span>
              <span className="text-xs text-slate-500">Target Role: <strong className="text-slate-800">{roleTitle}</strong></span>
            </div>
            <h1 className="text-xl md:text-2xl font-extrabold text-slate-900 tracking-tight">
              Skill Gap & Employability Vector Map
            </h1>
            <p className="text-xs md:text-sm text-slate-600 mt-1 max-w-2xl leading-relaxed">
              Cross-comparing your verified projects, transcripts, coding activity, and certifications against standard industry requirements for {roleTitle}.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row items-end sm:items-center gap-3 shrink-0">
            {onNavigate && (
              <div className="flex flex-wrap items-center gap-2">
                <button
                  type="button"
                  onClick={() => onNavigate('dashboard')}
                  className="px-3.5 py-2.5 rounded-xl bg-slate-50 hover:bg-slate-100 text-slate-700 text-xs font-semibold flex items-center space-x-1.5 transition border border-slate-200 shadow-2xs cursor-pointer"
                >
                  <ArrowLeft className="w-3.5 h-3.5 text-blue-600" />
                  <span>Dashboard</span>
                </button>
                <button
                  type="button"
                  onClick={() => onNavigate('assessments')}
                  className="px-3.5 py-2.5 rounded-xl bg-blue-50 hover:bg-blue-100 text-blue-700 border border-blue-200 text-xs font-semibold flex items-center space-x-1.5 transition cursor-pointer shadow-2xs"
                >
                  <span>Next: 50-MCQ Assessments</span>
                  <ChevronRight className="w-3.5 h-3.5" />
                </button>
              </div>
            )}

            <div className="flex items-center space-x-4 bg-slate-50 p-4 rounded-xl border border-slate-200">
              <div className="text-center px-2">
                <span className="text-[10px] text-slate-500 uppercase font-mono block">Overall Fit</span>
                <span className="text-2xl font-black text-emerald-600 font-mono">{overallMatch}%</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Grid: Radar Chart + Skill Categories */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        
        {/* Left: Radar Chart (5 cols) */}
        <div className="lg:col-span-5 p-6 bg-white border border-slate-200/90 rounded-2xl flex flex-col items-center justify-center space-y-4 shadow-xs">
          <div className="w-full flex items-center justify-between border-b border-slate-100 pb-3">
            <h3 className="text-xs font-bold text-slate-700 uppercase tracking-wider">
              Competency Radar Graph
            </h3>
            <div className="flex items-center space-x-3 text-[10px] font-mono">
              <span className="flex items-center text-blue-700 font-semibold">
                <span className="w-2 h-2 rounded-full bg-blue-600 mr-1" /> Current
              </span>
              <span className="flex items-center text-amber-700 font-semibold">
                <span className="w-2 h-2 rounded-full bg-amber-500 mr-1" /> Target
              </span>
            </div>
          </div>

          <div className="py-2">
            <RadarChart data={radarData} size={360} />
          </div>

          <p className="text-[11px] text-slate-500 text-center max-w-xs leading-relaxed">
            Blue polygon shows your verified score; dashed orange perimeter reflects industry benchmark.
          </p>
        </div>

        {/* Right: Categorized Breakdown (7 cols) */}
        <div className="lg:col-span-7 space-y-4">
          
          {/* Strong Skills (>= 80%) */}
          <div className="p-4 bg-white border border-emerald-200 rounded-xl space-y-2 shadow-2xs">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-emerald-800 uppercase tracking-wider flex items-center space-x-1.5">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                <span>Strong Competencies (≥ 80%)</span>
              </span>
              <span className="text-xs font-mono text-emerald-700 font-bold">{strongSkills.length} Verified</span>
            </div>
            <div className="flex flex-wrap gap-2 pt-1">
              {strongSkills.length === 0 ? (
                <span className="text-xs text-slate-500">None detected yet. Complete 50-MCQ assessments to build verified scores.</span>
              ) : (
                strongSkills.map((s, idx) => (
                  <div key={idx} className="px-2.5 py-1 rounded-lg bg-emerald-50 border border-emerald-200 text-xs text-emerald-900 flex items-center space-x-1.5">
                    <span className="font-medium">{s.skill || s.name}</span>
                    <span className="font-mono text-[10px] text-emerald-700 font-bold">{s.current || s.proficiency}%</span>
                  </div>
                ))
              )}
            </div>
          </div>

          {/* Moderate Skills (60-79%) */}
          <div className="p-4 bg-white border border-blue-200 rounded-xl space-y-2 shadow-2xs">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-blue-800 uppercase tracking-wider flex items-center space-x-1.5">
                <TrendingUp className="w-3.5 h-3.5 text-blue-600" />
                <span>Moderate Skills (60–79%)</span>
              </span>
              <span className="text-xs font-mono text-blue-700 font-bold">{moderateSkills.length} Developing</span>
            </div>
            <div className="flex flex-wrap gap-2 pt-1">
              {moderateSkills.length === 0 ? (
                <span className="text-xs text-slate-500">No skills in this band.</span>
              ) : (
                moderateSkills.map((s, idx) => (
                  <div key={idx} className="px-2.5 py-1 rounded-lg bg-blue-50 border border-blue-200 text-xs text-blue-900 flex items-center space-x-1.5">
                    <span className="font-medium">{s.skill || s.name}</span>
                    <span className="font-mono text-[10px] text-blue-700 font-bold">{s.current || s.proficiency}%</span>
                  </div>
                ))
              )}
            </div>
          </div>

          {/* Weak Skills (< 60%) */}
          <div className="p-4 bg-white border border-amber-200 rounded-xl space-y-2 shadow-2xs">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-amber-900 uppercase tracking-wider flex items-center space-x-1.5">
                <AlertTriangle className="w-3.5 h-3.5 text-amber-600" />
                <span>Weak Skills (&lt; 60% — Priority Upskilling)</span>
              </span>
              <span className="text-xs font-mono text-amber-800 font-bold">{weakSkills.length} Identified</span>
            </div>
            <div className="flex flex-wrap gap-2 pt-1">
              {weakSkills.length === 0 ? (
                <span className="text-xs text-slate-500">No weak competencies identified.</span>
              ) : (
                weakSkills.map((s, idx) => (
                  <div key={idx} className="px-2.5 py-1 rounded-lg bg-amber-50 border border-amber-200 text-xs text-amber-900 flex items-center space-x-1.5">
                    <span className="font-medium">{s.skill || s.name}</span>
                    <span className="font-mono text-[10px] text-amber-800 font-bold">{s.current || s.proficiency}%</span>
                  </div>
                ))
              )}
            </div>
          </div>

          {/* Missing Skills (0%) */}
          {missingSkills.length > 0 && (
            <div className="p-4 bg-white border border-rose-200 rounded-xl space-y-2 shadow-2xs">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-rose-800 uppercase tracking-wider flex items-center space-x-1.5">
                  <AlertTriangle className="w-3.5 h-3.5 text-rose-600" />
                  <span>Missing Role Competencies (0%)</span>
                </span>
                <span className="text-xs font-mono text-rose-700 font-bold">{missingSkills.length} Missing</span>
              </div>
              <div className="flex flex-wrap gap-2 pt-1">
                {missingSkills.map((s, idx) => (
                  <div key={idx} className="px-2.5 py-1 rounded-lg bg-rose-50 border border-rose-200 text-xs text-rose-900 flex items-center space-x-1.5">
                    <span className="font-medium">{s.skill || s.name}</span>
                    <span className="font-mono text-[10px] text-rose-700 font-bold">0%</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Action Recommendation to take 50-MCQ */}
          <div className="p-4 bg-blue-50 border border-blue-200 rounded-xl flex items-center justify-between gap-3 shadow-2xs">
            <div>
              <h4 className="text-xs font-bold text-slate-900 flex items-center space-x-1.5">
                <Sparkles className="w-4 h-4 text-blue-600" />
                <span>Ready to close these skill gaps?</span>
              </h4>
              <p className="text-[11px] text-slate-600 mt-0.5 leading-relaxed">
                Take our calibrated 50-Question Topic Assessments to prove your technical ability and elevate your score.
              </p>
            </div>
            <button
              onClick={onNavigateToAssessments}
              className="px-3.5 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-semibold text-xs flex items-center space-x-1.5 transition shadow-xs shrink-0 cursor-pointer"
            >
              <span>Take Assessment</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

        </div>

      </div>

      {/* Workflow Navigation Footer */}
      <div className="p-5 bg-white border border-slate-200/90 rounded-2xl flex flex-col sm:flex-row items-center justify-between gap-4 shadow-xs">
        <div>
          <span className="text-[10px] font-mono uppercase tracking-wider text-blue-600 font-bold">Step 7 of 10 Completed</span>
          <h4 className="text-sm font-bold text-slate-900">Ready to prove your skills with 50-MCQ tests?</h4>
          <p className="text-xs text-slate-600">Proceed to Step 8 to take standardized topic assessments and raise your verified competency scores.</p>
        </div>
        {(onNavigate || onNavigateToAssessments) && (
          <button
            type="button"
            onClick={() => onNavigate ? onNavigate('assessments') : onNavigateToAssessments()}
            className="px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-semibold text-xs flex items-center space-x-2 transition shadow-xs shrink-0 cursor-pointer"
          >
            <span>Proceed to Step 8: 50-MCQ Assessments</span>
            <ChevronRight className="w-4 h-4" />
          </button>
        )}
      </div>

    </div>
  );
}
