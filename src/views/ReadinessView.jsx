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
  ShieldCheck,
  ArrowLeft
} from 'lucide-react';

export default function ReadinessView({ onNavigateToPortfolio, onNavigate }) {
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
      <div className="p-12 text-center text-slate-500 flex flex-col items-center justify-center space-y-3 bg-white border border-slate-200 rounded-2xl shadow-xs">
        <div className="w-8 h-8 border-2 border-blue-600 border-t-transparent rounded-full animate-spin" />
        <span className="text-sm font-medium">Calculating composite mathematical career readiness index...</span>
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
      icon: <FileCheck2 className="w-5 h-5 text-blue-600" />,
      score: breakdown.academic?.score || 0,
      contribution: breakdown.academic?.contribution || 0,
      detail: breakdown.academic?.notes || 'Credit audit and verified semester marksheet data.'
    },
    {
      key: 'certifications',
      title: 'Verified Certifications',
      weight: '15%',
      icon: <Award className="w-5 h-5 text-amber-600" />,
      score: breakdown.certifications?.score || 0,
      contribution: breakdown.certifications?.contribution || 0,
      detail: breakdown.certifications?.notes || 'Cryptographic & issuer authority evidence matching.'
    },
    {
      key: 'codingProfiles',
      title: 'Coding Profiles (GitHub & LeetCode)',
      weight: '20%',
      icon: <Code2 className="w-5 h-5 text-purple-600" />,
      score: breakdown.codingProfiles?.score || 0,
      contribution: breakdown.codingProfiles?.contribution || 0,
      detail: breakdown.codingProfiles?.notes || 'Public repos, code commits, and contest ratings.'
    },
    {
      key: 'projects',
      title: 'Engineered Projects & Skills',
      weight: '20%',
      icon: <Layers className="w-5 h-5 text-sky-600" />,
      score: breakdown.projects?.score || 0,
      contribution: breakdown.projects?.contribution || 0,
      detail: breakdown.projects?.notes || 'Problem statements, solutions, outcomes, and git sources.'
    },
    {
      key: 'assessments',
      title: '50-MCQ Topic Assessments',
      weight: '15%',
      icon: <FileText className="w-5 h-5 text-rose-600" />,
      score: breakdown.assessments?.score || 0,
      contribution: breakdown.assessments?.contribution || 0,
      detail: breakdown.assessments?.notes || 'Completed 50/50 MCQ technical tests (incomplete attempts excluded).'
    },
    {
      key: 'interview',
      title: 'AI Mock Interview',
      weight: '15%',
      icon: <Mic className="w-5 h-5 text-indigo-600" />,
      score: breakdown.interview?.score || 0,
      contribution: breakdown.interview?.contribution || 0,
      detail: breakdown.interview?.notes || 'Spoken acoustic pace, filler words, and architecture reasoning.'
    }
  ];

  return (
    <div className="space-y-6">
      
      {/* Top Banner */}
      <div className="p-6 bg-white border border-slate-200/90 rounded-2xl relative overflow-hidden shadow-xs">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center space-x-2.5 mb-2">
              <span className="px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-blue-50 text-blue-700 border border-blue-200/80">
                Mathematical Career Readiness Model
              </span>
              <span className="text-slate-300">•</span>
              <span className="text-xs text-slate-500">Zero Black-Box Scoring</span>
            </div>
            <h1 className="text-xl md:text-2xl font-extrabold text-slate-900 tracking-tight">
              Composite Employability & Placement Readiness Index
            </h1>
            <p className="text-xs md:text-sm text-slate-600 mt-1 max-w-2xl leading-relaxed">
              Calculated using transparent mathematical weighting across your academics, verified credentials, code repositories, 50-MCQ tests, and acoustic mock interviews.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row items-end sm:items-center gap-3 shrink-0">
            {onNavigate && (
              <button
                type="button"
                onClick={() => onNavigate('dashboard')}
                className="px-3.5 py-2.5 rounded-xl bg-slate-50 hover:bg-slate-100 text-slate-700 text-xs font-semibold flex items-center space-x-1.5 transition border border-slate-200 shadow-2xs cursor-pointer"
              >
                <ArrowLeft className="w-3.5 h-3.5 text-blue-600" />
                <span>Back to Dashboard</span>
              </button>
            )}

            <div className="flex items-center space-x-4 bg-slate-50 p-4 rounded-xl border border-slate-200">
              <div className="text-center px-2">
                <span className="text-[10px] text-slate-500 uppercase font-mono block font-medium">Overall Index</span>
                <span className="text-3xl font-black text-blue-700 font-mono">{overallIndex}/100</span>
                <span className={`text-[10px] font-bold uppercase block mt-0.5 ${
                  overallIndex >= 85 ? 'text-emerald-700' : overallIndex >= 70 ? 'text-blue-700' : 'text-amber-700'
                }`}>
                  {readinessTier}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 6 Category Breakdown Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {categories.map((cat) => (
          <div 
            key={cat.key}
            className="p-5 bg-white border border-slate-200/90 rounded-2xl flex flex-col justify-between space-y-3 shadow-2xs"
          >
            <div>
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center space-x-2">
                  {cat.icon}
                  <h3 className="font-bold text-slate-900 text-sm">{cat.title}</h3>
                </div>
                <span className="px-2 py-0.5 rounded text-[10px] font-mono font-semibold bg-slate-100 text-slate-600 border border-slate-200">
                  Weight: {cat.weight}
                </span>
              </div>

              <p className="text-[11px] text-slate-600 leading-relaxed mb-3">{cat.detail}</p>

              {/* Progress bar */}
              <div className="space-y-1">
                <div className="flex justify-between text-xs font-mono">
                  <span className="text-slate-500 font-medium">Section Score:</span>
                  <span className="text-slate-900 font-bold">{cat.score}%</span>
                </div>
                <div className="w-full h-2 rounded-full bg-slate-100 overflow-hidden border border-slate-200">
                  <div 
                    className="h-full bg-blue-600 rounded-full transition-all duration-500" 
                    style={{ width: `${cat.score}%` }}
                  />
                </div>
              </div>
            </div>

            <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-xs">
              <span className="text-slate-500 font-medium">Index Contribution:</span>
              <span className="font-mono font-bold text-blue-700">+{cat.contribution} pts</span>
            </div>
          </div>
        ))}
      </div>

      {/* Live Shareable Portfolio Trigger */}
      <div className="p-6 bg-white border border-slate-200/90 rounded-2xl flex flex-col sm:flex-row items-center justify-between gap-4 shadow-xs">
        <div className="space-y-1">
          <h3 className="text-base font-bold text-slate-900 flex items-center space-x-2">
            <Sparkles className="w-4 h-4 text-blue-600" />
            <span>Generate & Publish Your Live Verified Portfolio</span>
          </h3>
          <p className="text-xs text-slate-600 leading-relaxed">
            Publish a recruiter-ready live web portfolio showcasing your verified proof-of-work, custom theme, and interactive terminal without exposing raw marksheet files.
          </p>
        </div>

        <button
          onClick={onNavigateToPortfolio}
          className="px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-semibold text-xs flex items-center space-x-2 transition shadow-xs shrink-0 cursor-pointer"
        >
          <span>Open Portfolio Compiler</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>

    </div>
  );
}
