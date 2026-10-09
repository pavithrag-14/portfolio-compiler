import React, { useState, useEffect } from 'react';
import { api } from '../api';
import { 
  TrendingUp, 
  CheckCircle2, 
  Award, 
  Code2, 
  Layers, 
  FileText, 
  Mic, 
  FileCheck2, 
  HelpCircle,
  Sparkles,
  ArrowRight,
  ShieldCheck
} from 'lucide-react';

export default function ReadinessView({ onNavigateToPortfolio }) {
  const [readiness, setReadiness] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadReadiness();
  }, []);

  const loadReadiness = async () => {
    setLoading(true);
    try {
      const data = await api.readiness.get();
      setReadiness(data);
    } catch (err) {
      console.error('Failed to load career readiness:', err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="p-12 text-center text-slate-400 flex flex-col items-center justify-center space-y-3">
        <div className="w-8 h-8 border-2 border-cyan-400 border-t-transparent rounded-full animate-spin" />
        <span className="text-sm">Calculating composite mathematical career readiness index...</span>
      </div>
    );
  }

  const {
    overallIndex = 0,
    readinessTier = 'Developing',
    breakdown = {}
  } = readiness || {};

  const categories = [
    {
      key: 'academic',
      title: 'Academic Records & CGPA',
      weight: '15%',
      icon: <FileCheck2 className="w-5 h-5 text-cyan-400" />,
      score: breakdown.academic?.score || 0,
      contribution: breakdown.academic?.contribution || 0,
      detail: breakdown.academic?.notes || 'Credit audit and verified semester marksheet data.'
    },
    {
      key: 'certifications',
      title: 'Verified Certifications',
      weight: '15%',
      icon: <Award className="w-5 h-5 text-amber-400" />,
      score: breakdown.certifications?.score || 0,
      contribution: breakdown.certifications?.contribution || 0,
      detail: breakdown.certifications?.notes || 'Cryptographic & issuer authority evidence matching.'
    },
    {
      key: 'codingProfiles',
      title: 'Coding Profiles (GitHub & LeetCode)',
      weight: '20%',
      icon: <Code2 className="w-5 h-5 text-purple-400" />,
      score: breakdown.codingProfiles?.score || 0,
      contribution: breakdown.codingProfiles?.contribution || 0,
      detail: breakdown.codingProfiles?.notes || 'Public repos, code commits, and contest ratings.'
    },
    {
      key: 'projects',
      title: 'Engineered Projects & Skills',
      weight: '20%',
      icon: <Layers className="w-5 h-5 text-sky-400" />,
      score: breakdown.projects?.score || 0,
      contribution: breakdown.projects?.contribution || 0,
      detail: breakdown.projects?.notes || 'Problem statements, solutions, outcomes, and git sources.'
    },
    {
      key: 'assessments',
      title: '50-MCQ Topic Assessments',
      weight: '15%',
      icon: <FileText className="w-5 h-5 text-rose-400" />,
      score: breakdown.assessments?.score || 0,
      contribution: breakdown.assessments?.contribution || 0,
      detail: breakdown.assessments?.notes || 'Completed 50/50 MCQ technical tests (incomplete attempts excluded).'
    },
    {
      key: 'interview',
      title: 'AI Mock Interview',
      weight: '15%',
      icon: <Mic className="w-5 h-5 text-indigo-400" />,
      score: breakdown.interview?.score || 0,
      contribution: breakdown.interview?.contribution || 0,
      detail: breakdown.interview?.notes || 'Spoken acoustic pace, filler words, and architecture reasoning.'
    }
  ];

  return (
    <div className="space-y-6">
      
      {/* Top Banner */}
      <div className="p-6 bg-slate-900/80 border border-cyan-500/20 rounded-2xl relative overflow-hidden">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center space-x-2.5 mb-2">
              <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-cyan-500/20 text-cyan-300 border border-cyan-500/40">
                Mathematical Career Readiness Model
              </span>
              <span className="text-slate-500">•</span>
              <span className="text-xs text-slate-400">Zero Black-Box Scoring</span>
            </div>
            <h1 className="text-xl md:text-2xl font-black text-slate-100 tracking-tight">
              Composite Employability & Placement Readiness Index
            </h1>
            <p className="text-xs md:text-sm text-slate-400 mt-1 max-w-2xl">
              Calculated using transparent mathematical weighting across your academics, verified credentials, code repositories, 50-MCQ tests, and acoustic mock interviews.
            </p>
          </div>

          <div className="flex items-center space-x-4 bg-slate-950 p-4 rounded-xl border border-slate-800 shrink-0">
            <div className="text-center px-2">
              <span className="text-[10px] text-slate-400 uppercase font-mono block">Overall Index</span>
              <span className="text-3xl font-black text-cyan-400 font-mono">{overallIndex}/100</span>
              <span className={`text-[10px] font-bold uppercase block mt-0.5 ${
                overallIndex >= 85 ? 'text-emerald-400' : overallIndex >= 70 ? 'text-cyan-400' : 'text-amber-400'
              }`}>
                {readinessTier}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* 6 Category Breakdown Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {categories.map((cat) => (
          <div 
            key={cat.key}
            className="p-5 bg-slate-900/70 border border-slate-800 rounded-2xl flex flex-col justify-between space-y-3"
          >
            <div>
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center space-x-2">
                  {cat.icon}
                  <h3 className="font-bold text-slate-200 text-sm">{cat.title}</h3>
                </div>
                <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-slate-800 text-slate-400">
                  Weight: {cat.weight}
                </span>
              </div>

              <p className="text-[11px] text-slate-400 leading-relaxed mb-3">{cat.detail}</p>

              {/* Progress bar */}
              <div className="space-y-1">
                <div className="flex justify-between text-xs font-mono">
                  <span className="text-slate-400">Section Score:</span>
                  <span className="text-slate-200 font-bold">{cat.score}%</span>
                </div>
                <div className="w-full h-2 rounded-full bg-slate-950 overflow-hidden border border-slate-800">
                  <div 
                    className="h-full bg-gradient-to-r from-cyan-500 to-blue-500 rounded-full" 
                    style={{ width: `${cat.score}%` }}
                  />
                </div>
              </div>
            </div>

            <div className="pt-2 border-t border-slate-800 flex items-center justify-between text-xs">
              <span className="text-slate-400">Index Contribution:</span>
              <span className="font-mono font-bold text-cyan-300">+{cat.contribution} pts</span>
            </div>
          </div>
        ))}
      </div>

      {/* Live Shareable Portfolio Trigger */}
      <div className="p-6 bg-slate-900/90 border border-cyan-500/30 rounded-2xl flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="space-y-1">
          <h3 className="text-base font-bold text-slate-100 flex items-center space-x-2">
            <Sparkles className="w-4 h-4 text-cyan-400" />
            <span>Generate & Publish Your Live Verified Portfolio</span>
          </h3>
          <p className="text-xs text-slate-400">
            Publish a recruiter-ready live web portfolio showcasing your verified proof-of-work, custom theme, and interactive terminal without exposing raw marksheet files.
          </p>
        </div>

        <button
          onClick={onNavigateToPortfolio}
          className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-slate-950 font-bold text-xs flex items-center space-x-2 transition shadow-md glow-cyan shrink-0"
        >
          <span>Open Portfolio Compiler</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>

    </div>
  );
}
