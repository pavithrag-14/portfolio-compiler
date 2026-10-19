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
      <div className="p-12 text-center text-slate-500 flex flex-col items-center justify-center space-y-3 bg-white border border-slate-200 rounded-2xl shadow-xs">
        <div className="w-8 h-8 border-2 border-blue-600 border-t-transparent rounded-full animate-spin" />
        <span className="text-sm font-medium">Synthesizing multi-modal employability data...</span>
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
      <div className="p-8 bg-white border border-slate-200 rounded-2xl text-center space-y-4 max-w-xl mx-auto my-8 shadow-xs">
        <div className="w-12 h-12 rounded-2xl bg-blue-50 text-blue-600 mx-auto flex items-center justify-center border border-blue-100">
          <Sparkles className="w-6 h-6" />
        </div>
        <h3 className="text-lg font-bold text-slate-900">Student Dashboard Preview</h3>
        <p className="text-xs text-slate-600 leading-relaxed">
          Please sign in to view your verified student employability records, or click below to load the pre-configured demo student profile.
        </p>
        <div className="flex items-center justify-center space-x-3 pt-2">
          <button
            onClick={handleQuickLogin}
            className="px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold transition flex items-center space-x-2 shadow-xs cursor-pointer"
          >
            <Sparkles className="w-4 h-4" />
            <span>Load Demo Student (Neshat V.)</span>
          </button>
          <button
            onClick={fetchSummary}
            className="px-4 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold flex items-center space-x-1.5 transition border border-slate-200 cursor-pointer"
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
      <div className="p-6 bg-white border border-slate-200/90 rounded-2xl relative overflow-hidden shadow-xs">
        <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6 relative z-10">
          <div>
            <div className="flex items-center space-x-2.5 mb-2">
              <span className="px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-blue-50 text-blue-700 border border-blue-200/80">
                Central Student Dashboard
              </span>
              <span className="text-slate-300">•</span>
              <span className="text-xs text-slate-500 font-mono">Target: <strong className="text-slate-800">{targetRole}</strong></span>
            </div>
            <h1 className="text-2xl md:text-3xl font-extrabold text-slate-900 tracking-tight">
              AI Employability & Verification Snapshot
            </h1>
            <p className="text-xs md:text-sm text-slate-600 mt-1 max-w-2xl leading-relaxed">
              Real-time audit of your academic transcripts, verified certifications, live coding repositories, 50-MCQ topic assessments, and AI mock interview scores.
            </p>
          </div>

          {/* Quick Metrics Badges */}
          <div className="flex items-center space-x-4 bg-slate-50 border border-slate-200 p-4 rounded-xl shrink-0">
            <div className="text-center px-3 border-r border-slate-200">
              <div className="text-xs font-medium text-slate-500">Profile Completion</div>
              <div className="text-2xl font-black text-blue-600">{profileCompletion}%</div>
            </div>
            <div className="text-center px-3 border-r border-slate-200">
              <div className="text-xs font-medium text-slate-500">Skill Match</div>
              <div className="text-2xl font-black text-emerald-600">{skillMatchPercentage}%</div>
            </div>
            <div className="text-center px-3">
              <div className="text-xs font-medium text-slate-500">Readiness Score</div>
              <div className="text-2xl font-black text-indigo-600">{careerReadinessScore}/100</div>
            </div>
          </div>
        </div>

        {/* Profile Completion Bar */}
        <div className="mt-5 pt-4 border-t border-slate-100">
          <div className="flex items-center justify-between text-xs text-slate-600 mb-1.5 font-mono">
            <span>Student Profile Completeness</span>
            <span className="text-blue-600 font-bold">{profileCompletion}% Complete</span>
          </div>
          <div className="w-full h-2 rounded-full bg-slate-100 overflow-hidden">
            <div 
              className="h-full bg-blue-600 rounded-full transition-all duration-500" 
              style={{ width: `${profileCompletion}%` }}
            />
          </div>
        </div>
      </div>

      {/* Grid of Key Status Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        
        {/* 1. Academic Records */}
        <div className="p-5 bg-white border border-slate-200/90 hover:border-blue-300 hover:shadow-xs rounded-xl transition-all flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center space-x-2 text-blue-600">
                <FileCheck2 className="w-5 h-5" />
                <span className="text-sm font-bold text-slate-900">Academic Verification</span>
              </div>
              <span className={`px-2 py-0.5 rounded text-[10px] font-semibold ${
                academicVerification === 'Verified' || academicVerification === 'Academic Records Updated'
                  ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                  : academicVerification === 'Partial' || academicVerification === 'Academic Records Partially Verified'
                  ? 'bg-blue-50 text-blue-700 border border-blue-200'
                  : 'bg-amber-50 text-amber-800 border border-amber-200'
              }`}>
                {academicVerification}
              </span>
            </div>
            <div className="space-y-1.5 text-xs text-slate-600">
              <div className="flex justify-between">
                <span>Semester 1 Marksheet:</span>
                <span className="text-emerald-700 font-semibold">{totalSemestersUploaded > 0 ? 'Uploaded & Verified' : 'Mandatory Pending'}</span>
              </div>
              <div className="flex justify-between">
                <span>Total Semesters Provided:</span>
                <span className="text-slate-800 font-medium">{totalSemestersUploaded} (Sem 2-8 Optional)</span>
              </div>
              <div className="flex justify-between">
                <span>Calculated CGPA:</span>
                <span className="text-slate-900 font-mono font-semibold">{calculatedCgpa || cgpa || 'N/A'}</span>
              </div>
              {cgpaDiscrepancy && (
                <div className="p-2 rounded-lg bg-amber-50 border border-amber-200 text-[11px] text-amber-800 flex items-center space-x-1.5 mt-2">
                  <AlertTriangle className="w-3.5 h-3.5 shrink-0 text-amber-600" />
                  <span>CGPA audit discrepancy flagged</span>
                </div>
              )}
            </div>
          </div>
          <button
            onClick={() => onNavigate('academics')}
            className="mt-4 pt-3 border-t border-slate-100 text-xs font-semibold text-blue-600 hover:text-blue-700 flex items-center justify-between w-full cursor-pointer"
          >
            <span>Manage Academic Records</span>
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>

        {/* 2. Certifications */}
        <div className="p-5 bg-white border border-slate-200/90 hover:border-blue-300 hover:shadow-xs rounded-xl transition-all flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center space-x-2 text-amber-600">
                <Award className="w-5 h-5" />
                <span className="text-sm font-bold text-slate-900">Certifications</span>
              </div>
              <span className="px-2 py-0.5 rounded text-[10px] font-semibold bg-slate-100 text-slate-700 border border-slate-200">
                {verifiedCertCount} / {certificationCount} Verified
              </span>
            </div>
            <div className="space-y-1.5 text-xs text-slate-600">
              <div className="flex justify-between">
                <span>Total Uploaded:</span>
                <span className="text-slate-900 font-semibold">{certificationCount} (Unlimited)</span>
              </div>
              <div className="flex justify-between">
                <span>Cryptographically Verified:</span>
                <span className="text-emerald-700 font-semibold">{verifiedCertCount}</span>
              </div>
              <div className="flex justify-between">
                <span>Pending / Unverified:</span>
                <span className="text-slate-500">{certificationCount - verifiedCertCount}</span>
              </div>
              <p className="text-[11px] text-slate-500 mt-2 leading-relaxed">
                Issuer authority matching via QR codes, credential URLs, and certificate IDs.
              </p>
            </div>
          </div>
          <button
            onClick={() => onNavigate('certifications')}
            className="mt-4 pt-3 border-t border-slate-100 text-xs font-semibold text-blue-600 hover:text-blue-700 flex items-center justify-between w-full cursor-pointer"
          >
            <span>Upload & Verify Certificates</span>
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>

        {/* 3. Coding Profiles */}
        <div className="p-5 bg-white border border-slate-200/90 hover:border-blue-300 hover:shadow-xs rounded-xl transition-all flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center space-x-2 text-purple-600">
                <Code2 className="w-5 h-5" />
                <span className="text-sm font-bold text-slate-900">Coding Profiles</span>
              </div>
              <span className={`px-2 py-0.5 rounded text-[10px] font-semibold ${
                githubConnected && leetcodeConnected 
                  ? 'bg-emerald-50 text-emerald-700 border border-emerald-200' 
                  : 'bg-slate-100 text-slate-600 border border-slate-200'
              }`}>
                {githubConnected ? 'GitHub Synced' : 'GitHub Offline'}
              </span>
            </div>
            <div className="space-y-1.5 text-xs text-slate-600">
              <div className="flex justify-between">
                <span>GitHub Repositories:</span>
                <span className="text-slate-900 font-semibold">{githubStats?.publicRepos || 0} Repos</span>
              </div>
              <div className="flex justify-between">
                <span>LeetCode Solved:</span>
                <span className="text-slate-900 font-mono font-semibold">{leetcodeStats?.totalSolved || 0} Problems</span>
              </div>
              <div className="flex justify-between">
                <span>LeetCode Contest Rating:</span>
                <span className="text-slate-900 font-mono font-semibold">{leetcodeStats?.contestRating || 'N/A'}</span>
              </div>
            </div>
          </div>
          <button
            onClick={() => onNavigate('coding')}
            className="mt-4 pt-3 border-t border-slate-100 text-xs font-semibold text-blue-600 hover:text-blue-700 flex items-center justify-between w-full cursor-pointer"
          >
            <span>Connect & Sync Profiles</span>
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>

        {/* 4. Projects & Skills */}
        <div className="p-5 bg-white border border-slate-200/90 hover:border-blue-300 hover:shadow-xs rounded-xl transition-all flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center space-x-2 text-sky-600">
                <Layers className="w-5 h-5" />
                <span className="text-sm font-bold text-slate-900">Projects & Skills</span>
              </div>
              <span className="px-2 py-0.5 rounded text-[10px] font-semibold bg-sky-50 text-sky-700 border border-sky-200">
                {projectCount} Projects
              </span>
            </div>
            <div className="space-y-1.5 text-xs text-slate-600">
              <div className="flex justify-between">
                <span>Verified Project Count:</span>
                <span className="text-slate-900 font-bold">{projectCount}</span>
              </div>
              <div className="flex justify-between">
                <span>Cataloged Skills:</span>
                <span className="text-slate-800">{skills.length} competencies</span>
              </div>
              <div className="flex flex-wrap gap-1 mt-2">
                {skills.slice(0, 4).map((s, idx) => (
                  <span key={idx} className="px-2 py-0.5 rounded bg-slate-100 text-[10px] text-slate-700 font-medium">
                    {typeof s === 'string' ? s : s.name}
                  </span>
                ))}
                {skills.length > 4 && (
                  <span className="px-2 py-0.5 rounded bg-slate-100 text-[10px] text-slate-500 font-medium">
                    +{skills.length - 4} more
                  </span>
                )}
              </div>
            </div>
          </div>
          <button
            onClick={() => onNavigate('projects')}
            className="mt-4 pt-3 border-t border-slate-100 text-xs font-semibold text-blue-600 hover:text-blue-700 flex items-center justify-between w-full cursor-pointer"
          >
            <span>Add Projects & Infer Skills</span>
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>

        {/* 5. 50-MCQ Assessments */}
        <div className="p-5 bg-white border border-slate-200/90 hover:border-blue-300 hover:shadow-xs rounded-xl transition-all flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center space-x-2 text-rose-600">
                <FileText className="w-5 h-5" />
                <span className="text-sm font-bold text-slate-900">50-MCQ Assessments</span>
              </div>
              <span className="px-2 py-0.5 rounded text-[10px] font-semibold bg-rose-50 text-rose-700 border border-rose-200">
                {assessmentStatus}
              </span>
            </div>
            <div className="space-y-1.5 text-xs text-slate-600">
              <div className="flex justify-between">
                <span>Standard Structure:</span>
                <span className="text-slate-900 font-medium">Strictly 50 Questions</span>
              </div>
              <div className="flex justify-between">
                <span>Difficulty Spread:</span>
                <span className="text-slate-500 font-mono">15 Easy, 25 Med, 10 Hard</span>
              </div>
              <div className="flex justify-between">
                <span>Incomplete Attempts:</span>
                <span className="text-amber-700 font-semibold">Do NOT affect score</span>
              </div>
              <p className="text-[11px] text-slate-500 mt-2 leading-relaxed">
                Mandates 50/50 answered questions to update the skill gap and employability score.
              </p>
            </div>
          </div>
          <button
            onClick={() => onNavigate('assessments')}
            className="mt-4 pt-3 border-t border-slate-100 text-xs font-semibold text-blue-600 hover:text-blue-700 flex items-center justify-between w-full cursor-pointer"
          >
            <span>Take 50-Question Assessments</span>
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>

        {/* 6. AI Mock Interview */}
        <div className="p-5 bg-white border border-slate-200/90 hover:border-blue-300 hover:shadow-xs rounded-xl transition-all flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center space-x-2 text-indigo-600">
                <Mic className="w-5 h-5" />
                <span className="text-sm font-bold text-slate-900">AI Mock Interview</span>
              </div>
              <span className={`px-2 py-0.5 rounded text-[10px] font-semibold ${
                interviewCompleted 
                  ? 'bg-emerald-50 text-emerald-700 border border-emerald-200' 
                  : 'bg-slate-100 text-slate-600 border border-slate-200'
              }`}>
                {interviewCompleted ? `Score: ${interviewScore}/100` : 'Not Completed'}
              </span>
            </div>
            <div className="space-y-1.5 text-xs text-slate-600">
              <div className="flex justify-between">
                <span>Personalization:</span>
                <span className="text-slate-900 font-medium">Matches Student Projects</span>
              </div>
              <div className="flex justify-between">
                <span>Acoustic Metrics:</span>
                <span className="text-slate-500">Pace (WPM) & Filler Words</span>
              </div>
              <div className="flex justify-between">
                <span>Status:</span>
                <span className={interviewCompleted ? 'text-emerald-700 font-semibold' : 'text-slate-500'}>
                  {interviewCompleted ? 'Evaluated' : 'Awaiting Session'}
                </span>
              </div>
              <p className="text-[11px] text-slate-500 mt-2 leading-relaxed">
                Voice speech-to-text with objective acoustic metrics and architecture Q&A.
              </p>
            </div>
          </div>
          <button
            onClick={() => onNavigate('interview')}
            className="mt-4 pt-3 border-t border-slate-100 text-xs font-semibold text-blue-600 hover:text-blue-700 flex items-center justify-between w-full cursor-pointer"
          >
            <span>Start AI Mock Interview</span>
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>

      </div>

      {/* Live Shareable Portfolio Card */}
      <div className="p-6 bg-white border border-slate-200/90 rounded-2xl flex flex-col md:flex-row items-center justify-between gap-4 shadow-xs">
        <div className="space-y-1">
          <div className="flex items-center space-x-2">
            <span className="w-2 h-2 rounded-full bg-emerald-500" />
            <h3 className="text-base font-bold text-slate-900">Live Shareable Portfolio</h3>
            <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
              portfolioStatus === 'Published' 
                ? 'bg-emerald-50 text-emerald-700 border border-emerald-200' 
                : 'bg-amber-50 text-amber-800 border border-amber-200'
            }`}>
              {portfolioStatus}
            </span>
          </div>
          <p className="text-xs text-slate-600">
            Public link: <code className="text-blue-700 bg-blue-50 px-1.5 py-0.5 rounded font-mono">/p/{portfolioSlug || 'student'}</code> — Automatically omits raw marksheet PDFs for student privacy.
          </p>
        </div>
        <div className="flex items-center space-x-3">
          <button
            onClick={() => onNavigate('portfolio')}
            className="px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-semibold text-xs flex items-center space-x-2 transition shadow-xs cursor-pointer"
          >
            <Sparkles className="w-4 h-4" />
            <span>Customize & View Live Portfolio</span>
          </button>
        </div>
      </div>

    </div>
  );
}
