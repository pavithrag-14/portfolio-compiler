import React, { useState, useEffect } from 'react';
import { api } from '../api';
import { 
  CheckCircle2, 
  AlertTriangle, 
  Clock, 
  Award, 
  FileCheck2, 
  Code2, 
  Layers, 
  Target, 
  Sparkles, 
  FileText, 
  Mic, 
  TrendingUp, 
  ExternalLink, 
  ChevronRight, 
  ShieldCheck, 
  RefreshCw, 
  BookOpen 
} from 'lucide-react';

export default function DashboardView({ onNavigate }) {
  const [summary, setSummary] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchSummary = async () => {
    setLoading(true);
    try {
      const data = await api.dashboard.getSummary();
      setSummary(data);
    } catch (err) {
      console.error('Failed to load dashboard summary:', err);
      setError('Could not connect to backend server. Make sure API is running.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSummary();
  }, []);

  if (loading) {
    return (
      <div className="p-12 text-center text-slate-400 flex flex-col items-center justify-center space-y-3">
        <div className="w-8 h-8 border-2 border-cyan-400 border-t-transparent rounded-full animate-spin" />
        <span className="text-sm">Synthesizing multi-modal employability data...</span>
      </div>
    );
  }

  if (error || !summary) {
    const handleQuickLogin = async () => {
      try {
        setLoading(true);
        const res = await api.auth.login({ email: 'student@portfolio.ai', password: 'password123' });
        localStorage.setItem('portfolio_compiler_token', res.token);
        localStorage.setItem('portfolio_auth_token', res.token);
        setError(null);
        await fetchSummary();
      } catch (e) {
        setError(e.message || 'Login failed');
      } finally {
        setLoading(false);
      }
    };

    return (
      <div className="p-8 bg-slate-900/90 border border-cyan-500/30 rounded-2xl text-center space-y-4 max-w-xl mx-auto my-8">
        <div className="w-12 h-12 rounded-2xl bg-cyan-500/10 text-cyan-400 mx-auto flex items-center justify-center">
          <Sparkles className="w-6 h-6" />
        </div>
        <h3 className="text-lg font-bold text-white">Student Dashboard Preview</h3>
        <p className="text-xs text-slate-400 leading-relaxed">
          Please sign in to view your verified student employability records, or click below to load the pre-configured demo student profile.
        </p>
        <div className="flex items-center justify-center space-x-3 pt-2">
          <button
            onClick={handleQuickLogin}
            className="px-5 py-2.5 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 text-xs font-bold transition flex items-center space-x-2"
          >
            <Sparkles className="w-4 h-4" />
            <span>Load Demo Student (Neshat V.)</span>
          </button>
          <button
            onClick={fetchSummary}
            className="px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold flex items-center space-x-1.5 transition"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            <span>Retry</span>
          </button>
        </div>
      </div>
    );
  }

  const {
    profileCompletion = 0,
    academicVerification = 'Pending',
    totalSemestersUploaded = 0,
    cgpa = 0,
    calculatedCgpa = 0,
    cgpaDiscrepancy = false,
    certificationCount = 0,
    verifiedCertCount = 0,
    githubConnected = false,
    githubStats = {},
    leetcodeConnected = false,
    leetcodeStats = {},
    projectCount = 0,
    skills = [],
    targetRole = 'UI/UX Designer',
    skillMatchPercentage = 0,
    assessmentStatus = '0/7 Completed',
    interviewCompleted = false,
    interviewScore = 0,
    careerReadinessScore = 0,
    portfolioStatus = 'Draft',
    portfolioSlug = ''
  } = summary;

  return (
    <div className="space-y-6">
      
      {/* Top Banner with Career Readiness Score */}
      <div className="p-6 bg-gradient-to-r from-slate-900/90 via-[#0b162c]/90 to-slate-900/90 border border-cyan-500/20 rounded-2xl relative overflow-hidden backdrop-blur-xl">
        <div className="absolute top-0 right-0 w-96 h-96 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6 relative z-10">
          <div>
            <div className="flex items-center space-x-2.5 mb-2">
              <span className="px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-cyan-500/10 text-cyan-400 border border-cyan-500/30">
                Central Student Dashboard
              </span>
              <span className="text-slate-500">•</span>
              <span className="text-xs text-slate-400 font-mono">Target: <strong className="text-slate-200">{targetRole}</strong></span>
            </div>
            <h1 className="text-2xl md:text-3xl font-extrabold text-slate-100 tracking-tight">
              AI Employability & Verification Snapshot
            </h1>
            <p className="text-xs md:text-sm text-slate-400 mt-1 max-w-2xl">
              Real-time audit of your academic transcripts, verified certifications, live coding repositories, 50-MCQ topic assessments, and AI mock interview scores.
            </p>
          </div>

          {/* Quick Metrics Badges */}
          <div className="flex items-center space-x-4 bg-slate-950/70 border border-slate-800 p-4 rounded-xl shrink-0">
            <div className="text-center px-3 border-r border-slate-800">
              <div className="text-xs font-medium text-slate-400">Profile Completion</div>
              <div className="text-2xl font-black text-cyan-400">{profileCompletion}%</div>
            </div>
            <div className="text-center px-3 border-r border-slate-800">
              <div className="text-xs font-medium text-slate-400">Skill Match</div>
              <div className="text-2xl font-black text-emerald-400">{skillMatchPercentage}%</div>
            </div>
            <div className="text-center px-3">
              <div className="text-xs font-medium text-slate-400">Readiness Score</div>
              <div className="text-2xl font-black text-blue-400">{careerReadinessScore}/100</div>
            </div>
          </div>
        </div>

        {/* Profile Completion Bar */}
        <div className="mt-5 pt-4 border-t border-slate-800/80">
          <div className="flex items-center justify-between text-xs text-slate-400 mb-1.5 font-mono">
            <span>Student Profile Completeness</span>
            <span className="text-cyan-400 font-bold">{profileCompletion}% Complete</span>
          </div>
          <div className="w-full h-2 rounded-full bg-slate-800 overflow-hidden">
            <div 
              className="h-full bg-gradient-to-r from-cyan-500 to-emerald-400 rounded-full transition-all duration-500" 
              style={{ width: `${profileCompletion}%` }}
            />
          </div>
        </div>
      </div>

      {/* Grid of Key Status Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        
        {/* 1. Academic Records */}
        <div className="p-5 bg-slate-900/60 border border-slate-800 hover:border-cyan-500/40 rounded-xl transition-all flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center space-x-2 text-cyan-400">
                <FileCheck2 className="w-5 h-5" />
                <span className="text-sm font-bold text-slate-200">Academic Verification</span>
              </div>
              <span className={`px-2 py-0.5 rounded text-[10px] font-semibold ${
                academicVerification === 'Verified' || academicVerification === 'Academic Records Updated'
                  ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/30'
                  : academicVerification === 'Partial' || academicVerification === 'Academic Records Partially Verified'
                  ? 'bg-cyan-500/10 text-cyan-400 border border-cyan-500/30'
                  : 'bg-amber-500/10 text-amber-400 border border-amber-500/30'
              }`}>
                {academicVerification}
              </span>
            </div>
            <div className="space-y-1.5 text-xs text-slate-400">
              <div className="flex justify-between">
                <span>Semester 1 Marksheet:</span>
                <span className="text-emerald-400 font-semibold">{totalSemestersUploaded > 0 ? 'Uploaded & Verified' : 'Mandatory Pending'}</span>
              </div>
              <div className="flex justify-between">
                <span>Total Semesters Provided:</span>
                <span className="text-slate-200">{totalSemestersUploaded} (Sem 2-8 Optional)</span>
              </div>
              <div className="flex justify-between">
                <span>Calculated CGPA:</span>
                <span className="text-slate-200 font-mono">{calculatedCgpa || cgpa || 'N/A'}</span>
              </div>
              {cgpaDiscrepancy && (
                <div className="p-2 rounded bg-amber-950/40 border border-amber-500/30 text-[11px] text-amber-300 flex items-center space-x-1.5 mt-2">
                  <AlertTriangle className="w-3.5 h-3.5 shrink-0" />
                  <span>CGPA audit discrepancy flagged</span>
                </div>
              )}
            </div>
          </div>
          <button
            onClick={() => onNavigate('academics')}
            className="mt-4 pt-3 border-t border-slate-800/80 text-xs font-semibold text-cyan-400 hover:text-cyan-300 flex items-center justify-between w-full"
          >
            <span>Manage Academic Records</span>
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>

        {/* 2. Certifications */}
        <div className="p-5 bg-slate-900/60 border border-slate-800 hover:border-cyan-500/40 rounded-xl transition-all flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center space-x-2 text-amber-400">
                <Award className="w-5 h-5" />
                <span className="text-sm font-bold text-slate-200">Certifications</span>
              </div>
              <span className="px-2 py-0.5 rounded text-[10px] font-semibold bg-slate-800 text-slate-300">
                {verifiedCertCount} / {certificationCount} Verified
              </span>
            </div>
            <div className="space-y-1.5 text-xs text-slate-400">
              <div className="flex justify-between">
                <span>Total Uploaded:</span>
                <span className="text-slate-200 font-bold">{certificationCount} (Unlimited)</span>
              </div>
              <div className="flex justify-between">
                <span>Cryptographically Verified:</span>
                <span className="text-emerald-400 font-semibold">{verifiedCertCount}</span>
              </div>
              <div className="flex justify-between">
                <span>Pending / Unverified:</span>
                <span className="text-slate-400">{certificationCount - verifiedCertCount}</span>
              </div>
              <p className="text-[11px] text-slate-500 mt-2">
                Issuer authority matching via QR codes, credential URLs, and certificate IDs.
              </p>
            </div>
          </div>
          <button
            onClick={() => onNavigate('certifications')}
            className="mt-4 pt-3 border-t border-slate-800/80 text-xs font-semibold text-cyan-400 hover:text-cyan-300 flex items-center justify-between w-full"
          >
            <span>Upload & Verify Certificates</span>
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>

        {/* 3. Coding Profiles */}
        <div className="p-5 bg-slate-900/60 border border-slate-800 hover:border-cyan-500/40 rounded-xl transition-all flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center space-x-2 text-purple-400">
                <Code2 className="w-5 h-5" />
                <span className="text-sm font-bold text-slate-200">Coding Profiles</span>
              </div>
              <span className={`px-2 py-0.5 rounded text-[10px] font-semibold ${
                githubConnected && leetcodeConnected 
                  ? 'bg-emerald-500/10 text-emerald-400' 
                  : 'bg-slate-800 text-slate-400'
              }`}>
                {githubConnected ? 'GitHub Synced' : 'GitHub Offline'}
              </span>
            </div>
            <div className="space-y-1.5 text-xs text-slate-400">
              <div className="flex justify-between">
                <span>GitHub Repositories:</span>
                <span className="text-slate-200">{githubStats?.publicRepos || 0} Repos</span>
              </div>
              <div className="flex justify-between">
                <span>LeetCode Solved:</span>
                <span className="text-slate-200 font-mono">{leetcodeStats?.totalSolved || 0} Problems</span>
              </div>
              <div className="flex justify-between">
                <span>LeetCode Contest Rating:</span>
                <span className="text-slate-200 font-mono">{leetcodeStats?.contestRating || 'N/A'}</span>
              </div>
            </div>
          </div>
          <button
            onClick={() => onNavigate('coding')}
            className="mt-4 pt-3 border-t border-slate-800/80 text-xs font-semibold text-cyan-400 hover:text-cyan-300 flex items-center justify-between w-full"
          >
            <span>Connect & Sync Profiles</span>
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>

        {/* 4. Projects & Skills */}
        <div className="p-5 bg-slate-900/60 border border-slate-800 hover:border-cyan-500/40 rounded-xl transition-all flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center space-x-2 text-sky-400">
                <Layers className="w-5 h-5" />
                <span className="text-sm font-bold text-slate-200">Projects & Skills</span>
              </div>
              <span className="px-2 py-0.5 rounded text-[10px] font-semibold bg-sky-500/10 text-sky-300 border border-sky-500/30">
                {projectCount} Projects
              </span>
            </div>
            <div className="space-y-1.5 text-xs text-slate-400">
              <div className="flex justify-between">
                <span>Verified Project Count:</span>
                <span className="text-slate-200 font-bold">{projectCount}</span>
              </div>
              <div className="flex justify-between">
                <span>Cataloged Skills:</span>
                <span className="text-slate-200">{skills.length} competencies</span>
              </div>
              <div className="flex flex-wrap gap-1 mt-2">
                {skills.slice(0, 4).map((s, idx) => (
                  <span key={idx} className="px-1.5 py-0.5 rounded bg-slate-800 text-[10px] text-slate-300">
                    {typeof s === 'string' ? s : s.name}
                  </span>
                ))}
                {skills.length > 4 && (
                  <span className="px-1.5 py-0.5 rounded bg-slate-800 text-[10px] text-slate-500">
                    +{skills.length - 4} more
                  </span>
                )}
              </div>
            </div>
          </div>
          <button
            onClick={() => onNavigate('projects')}
            className="mt-4 pt-3 border-t border-slate-800/80 text-xs font-semibold text-cyan-400 hover:text-cyan-300 flex items-center justify-between w-full"
          >
            <span>Add Projects & Infer Skills</span>
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>

        {/* 5. 50-MCQ Assessments */}
        <div className="p-5 bg-slate-900/60 border border-slate-800 hover:border-cyan-500/40 rounded-xl transition-all flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center space-x-2 text-rose-400">
                <FileText className="w-5 h-5" />
                <span className="text-sm font-bold text-slate-200">50-MCQ Assessments</span>
              </div>
              <span className="px-2 py-0.5 rounded text-[10px] font-semibold bg-rose-500/10 text-rose-300 border border-rose-500/30">
                {assessmentStatus}
              </span>
            </div>
            <div className="space-y-1.5 text-xs text-slate-400">
              <div className="flex justify-between">
                <span>Standard Structure:</span>
                <span className="text-slate-200">Strictly 50 Questions</span>
              </div>
              <div className="flex justify-between">
                <span>Difficulty Spread:</span>
                <span className="text-slate-400 font-mono">15 Easy, 25 Med, 10 Hard</span>
              </div>
              <div className="flex justify-between">
                <span>Incomplete Attempts:</span>
                <span className="text-amber-400 font-semibold">Do NOT affect score</span>
              </div>
              <p className="text-[11px] text-slate-500 mt-2">
                Mandates 50/50 answered questions to update the skill gap and employability score.
              </p>
            </div>
          </div>
          <button
            onClick={() => onNavigate('assessments')}
            className="mt-4 pt-3 border-t border-slate-800/80 text-xs font-semibold text-cyan-400 hover:text-cyan-300 flex items-center justify-between w-full"
          >
            <span>Take 50-Question Assessments</span>
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>

        {/* 6. AI Mock Interview */}
        <div className="p-5 bg-slate-900/60 border border-slate-800 hover:border-cyan-500/40 rounded-xl transition-all flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center space-x-2 text-indigo-400">
                <Mic className="w-5 h-5" />
                <span className="text-sm font-bold text-slate-200">AI Mock Interview</span>
              </div>
              <span className={`px-2 py-0.5 rounded text-[10px] font-semibold ${
                interviewCompleted 
                  ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/30' 
                  : 'bg-slate-800 text-slate-400'
              }`}>
                {interviewCompleted ? `Score: ${interviewScore}/100` : 'Not Completed'}
              </span>
            </div>
            <div className="space-y-1.5 text-xs text-slate-400">
              <div className="flex justify-between">
                <span>Personalization:</span>
                <span className="text-slate-200">Matches Student Projects</span>
              </div>
              <div className="flex justify-between">
                <span>Acoustic Metrics:</span>
                <span className="text-slate-400">Pace (WPM) & Filler Words</span>
              </div>
              <div className="flex justify-between">
                <span>Status:</span>
                <span className={interviewCompleted ? 'text-emerald-400 font-semibold' : 'text-slate-400'}>
                  {interviewCompleted ? 'Evaluated' : 'Awaiting Session'}
                </span>
              </div>
              <p className="text-[11px] text-slate-500 mt-2">
                Voice speech-to-text with objective acoustic metrics and architecture Q&A.
              </p>
            </div>
          </div>
          <button
            onClick={() => onNavigate('interview')}
            className="mt-4 pt-3 border-t border-slate-800/80 text-xs font-semibold text-cyan-400 hover:text-cyan-300 flex items-center justify-between w-full"
          >
            <span>Start AI Mock Interview</span>
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>

      </div>

      {/* Live Shareable Portfolio Card */}
      <div className="p-6 bg-slate-900/80 border border-cyan-500/30 rounded-2xl flex flex-col md:flex-row items-center justify-between gap-4">
        <div className="space-y-1">
          <div className="flex items-center space-x-2">
            <span className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse" />
            <h3 className="text-base font-bold text-slate-100">Live Shareable Portfolio</h3>
            <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
              portfolioStatus === 'Published' 
                ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40' 
                : 'bg-amber-500/20 text-amber-300 border border-amber-500/40'
            }`}>
              {portfolioStatus}
            </span>
          </div>
          <p className="text-xs text-slate-400">
            Public link: <code className="text-cyan-300 font-mono">/p/{portfolioSlug || 'student'}</code> — Automatically omits raw marksheet PDFs for student privacy.
          </p>
        </div>
        <div className="flex items-center space-x-3">
          <button
            onClick={() => onNavigate('portfolio')}
            className="px-4 py-2 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold text-xs flex items-center space-x-2 transition shadow-md glow-cyan"
          >
            <Sparkles className="w-4 h-4" />
            <span>Customize & View Live Portfolio</span>
          </button>
        </div>
      </div>

    </div>
  );
}
