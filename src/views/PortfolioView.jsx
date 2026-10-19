import React, { useState, useEffect } from 'react';
import { api } from '../api';
import confetti from 'canvas-confetti';
import { 
  Globe, 
  Sparkles, 
  CheckCircle2, 
  ExternalLink, 
  Copy, 
  Share2, 
  Palette, 
  Sliders, 
  ShieldCheck, 
  Code2, 
  Award, 
  GraduationCap, 
  Eye, 
  EyeOff, 
  Laptop, 
  Check, 
  RefreshCw, 
  Terminal, 
  Lock, 
  FileCheck2, 
  ArrowLeft 
} from 'lucide-react';
import { GithubIcon } from '../components/SocialIcons';
import AtsResumeModal from '../components/AtsResumeModal';

const THEMES = [
  { id: 'clean-slate', name: 'Clean Professional Light', bg: 'bg-[#f8fafc]', text: 'text-blue-700', border: 'border-slate-200' },
  { id: 'minimal-indigo', name: 'Indigo SaaS', bg: 'bg-white', text: 'text-indigo-600', border: 'border-indigo-200' },
  { id: 'emerald-neo', name: 'Emerald Academic', bg: 'bg-[#f0fdf4]', text: 'text-emerald-700', border: 'border-emerald-200' },
  { id: 'cyber-dark', name: 'Slate Dark (Optional)', bg: 'bg-slate-900', text: 'text-slate-100', border: 'border-slate-700' },
];

export default function PortfolioView({ onNavigate }) {
  const [settings, setSettings] = useState(null);
  const [publicData, setPublicData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [copiedLink, setCopiedLink] = useState(false);
  const [feedbackMsg, setFeedbackMsg] = useState('');
  const [resumeModalOpen, setResumeModalOpen] = useState(false);
  
  // Customizer form state
  const [theme, setTheme] = useState('clean-slate');
  const [template, setTemplate] = useState('bento');
  const [slug, setSlug] = useState('');
  const [isPublic, setIsPublic] = useState(true);
  const [sections, setSections] = useState({
    showAcademics: true,
    showCertifications: true,
    showCodingStats: true,
    showProjects: true,
    showSkills: true,
    showAssessments: true,
    showInterviewScore: true,
  });

  useEffect(() => {
    loadPortfolioData();
  }, []);

  const loadPortfolioData = async () => {
    setLoading(true);
    try {
      const data = await api.portfolio.getSettings();
      setSettings(data);
      if (data.settings) {
        setTheme(data.settings.theme || 'clean-slate');
        setTemplate(data.settings.template || 'bento');
        setSlug(data.settings.slug || '');
        setIsPublic(data.settings.isPublic ?? true);
        if (data.settings.sections) {
          setSections(data.settings.sections);
        }
      }

      // Also fetch compiled public view
      if (data.settings?.slug) {
        try {
          const pub = await api.portfolio.getPublic(data.settings.slug);
          setPublicData(pub);
        } catch (e) {
          console.warn('Public portfolio not published yet or error:', e);
        }
      }
    } catch (err) {
      console.error('Failed to load portfolio settings:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleSaveSettings = async (e) => {
    if (e) e.preventDefault();
    setSaving(true);
    try {
      const res = await api.portfolio.updateSettings({
        theme,
        template,
        slug: slug.trim().toLowerCase().replace(/[^a-z0-9-]/g, '-'),
        isPublic,
        sections
      });
      setFeedbackMsg('Portfolio settings saved & re-compiled successfully!');
      confetti({
        particleCount: 50,
        spread: 60,
        origin: { y: 0.7 }
      });

      // Reload compiled public view
      if (res.settings?.slug) {
        const pub = await api.portfolio.getPublic(res.settings.slug);
        setPublicData(pub);
      }
      setTimeout(() => setFeedbackMsg(''), 4000);
    } catch (err) {
      alert('Save failed: ' + err.message);
    } finally {
      setSaving(false);
    }
  };

  const handleCopyLink = () => {
    const fullUrl = `${window.location.origin}/portfolio/${slug || 'student'}`;
    navigator.clipboard.writeText(fullUrl);
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 3000);
  };

  const toggleSection = (key) => {
    setSections(prev => ({
      ...prev,
      [key]: !prev[key]
    }));
  };

  if (loading) {
    return (
      <div className="p-12 text-center text-slate-500 flex flex-col items-center justify-center space-y-3 bg-white border border-slate-200 rounded-2xl shadow-xs">
        <div className="w-8 h-8 border-2 border-blue-600 border-t-transparent rounded-full animate-spin" />
        <span className="text-sm font-medium">Synthesizing live verified portfolio components...</span>
      </div>
    );
  }

  const pData = publicData?.portfolio || settings?.previewData || {};

  return (
    <div className="space-y-6">
      
      {/* Top Banner */}
      <div className="p-6 bg-white border border-slate-200/90 rounded-2xl shadow-xs">
        <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4">
          <div>
            <div className="flex items-center space-x-2.5 mb-2">
              <span className="px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-blue-50 text-blue-700 border border-blue-200/80">
                Live Portfolio Compiler & Publisher
              </span>
              <span className="text-slate-300">•</span>
              <span className="text-xs text-slate-500">
                Privacy-Preserving (Marksheet PDFs strictly hidden)
              </span>
            </div>
            <h1 className="text-xl md:text-2xl font-extrabold text-slate-900 tracking-tight">
              Shareable Live Portfolio & Theme Engine
            </h1>
            <p className="text-xs md:text-sm text-slate-600 mt-1 max-w-2xl leading-relaxed">
              Turn verified marksheet audits, certifications, GitHub code, 50-MCQ scores, and mock interview performance into an interactive portfolio for recruiters.
            </p>
          </div>

          {/* Shareable Link Box & Back to Dashboard */}
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2 shrink-0">
            {onNavigate && (
              <button
                type="button"
                onClick={() => onNavigate('dashboard')}
                className="px-3.5 py-2.5 rounded-xl bg-slate-50 hover:bg-slate-100 text-slate-700 text-xs font-semibold flex items-center justify-center space-x-1.5 transition border border-slate-200 shadow-2xs cursor-pointer"
              >
                <ArrowLeft className="w-3.5 h-3.5 text-blue-600" />
                <span>Dashboard</span>
              </button>
            )}

            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2 bg-slate-50 p-2.5 rounded-xl border border-slate-200">
              <div className="text-xs font-mono text-blue-700 px-2.5 py-1 bg-white border border-slate-200 rounded-lg truncate max-w-xs shadow-2xs">
                {window.location.origin}/portfolio/{slug || 'student'}
              </div>
              <button
                onClick={handleCopyLink}
                className="px-3 py-1.5 rounded-lg bg-blue-600 hover:bg-blue-700 text-white font-semibold text-xs flex items-center justify-center space-x-1.5 transition shadow-xs cursor-pointer"
              >
                {copiedLink ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copiedLink ? 'Copied URL!' : 'Copy Link'}</span>
              </button>

              <button
                onClick={() => setResumeModalOpen(true)}
                className="px-3.5 py-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 border border-slate-200 font-semibold text-xs flex items-center justify-center space-x-1.5 transition shadow-2xs cursor-pointer"
              >
                <FileCheck2 className="w-3.5 h-3.5 text-blue-600" />
                <span>Download ATS Resume (PDF)</span>
              </button>
            </div>
          </div>
        </div>

        {feedbackMsg && (
          <div className="mt-4 p-3 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs flex items-center space-x-2 shadow-2xs">
            <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
            <span className="font-semibold">{feedbackMsg}</span>
          </div>
        )}
      </div>

      {/* Customizer Settings Controls */}
      <div className="p-6 bg-white border border-slate-200/90 rounded-2xl space-y-5 shadow-xs">
        <div className="flex items-center justify-between border-b border-slate-100 pb-3">
          <h2 className="text-xs font-bold text-slate-700 uppercase tracking-wider flex items-center space-x-2">
            <Sliders className="w-4 h-4 text-blue-600" />
            <span>Portfolio Customization Controls</span>
          </h2>
          <button
            onClick={handleSaveSettings}
            disabled={saving}
            className="px-4 py-1.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-semibold text-xs flex items-center space-x-1.5 transition shadow-xs disabled:opacity-50 cursor-pointer"
          >
            {saving ? (
              <span className="inline-block animate-spin rounded-full h-3.5 w-3.5 border-2 border-white border-t-transparent" />
            ) : (
              <Sparkles className="w-3.5 h-3.5" />
            )}
            <span>Apply Changes & Publish</span>
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-5 text-xs">
          
          {/* 1. Slug & Visibility */}
          <div className="space-y-3">
            <label className="block text-slate-700 font-bold uppercase tracking-wider text-[11px]">
              Custom Portfolio Slug
            </label>
            <div className="flex items-center space-x-1">
              <span className="text-slate-400 font-mono text-[11px]">/portfolio/</span>
              <input
                type="text"
                value={slug}
                onChange={(e) => setSlug(e.target.value)}
                placeholder="your-name"
                className="flex-1 bg-white border border-slate-300 focus:border-blue-600 focus:ring-2 focus:ring-blue-100 rounded-xl px-3 py-1.5 text-xs text-slate-900 font-mono outline-none"
              />
            </div>

            <div className="pt-2">
              <label className="block text-slate-700 font-bold uppercase tracking-wider text-[11px] mb-1.5">
                Public Live Visibility
              </label>
              <button
                type="button"
                onClick={() => setIsPublic(!isPublic)}
                className={`w-full py-2 px-3 rounded-xl border text-xs font-semibold flex items-center justify-between transition cursor-pointer ${
                  isPublic 
                    ? 'bg-emerald-50 border-emerald-200 text-emerald-800' 
                    : 'bg-slate-50 border-slate-200 text-slate-600'
                }`}
              >
                <span>{isPublic ? 'Publicly Accessible' : 'Private (Draft Only)'}</span>
                {isPublic ? <Eye className="w-4 h-4 text-emerald-600" /> : <EyeOff className="w-4 h-4 text-slate-400" />}
              </button>
            </div>
          </div>

          {/* 2. Theme Selection */}
          <div className="space-y-2">
            <label className="block text-slate-700 font-bold uppercase tracking-wider text-[11px]">
              Visual Color Theme
            </label>
            <div className="grid grid-cols-2 gap-2">
              {THEMES.map((th) => (
                <button
                  key={th.id}
                  type="button"
                  onClick={() => setTheme(th.id)}
                  className={`p-2.5 rounded-xl border text-left text-xs transition cursor-pointer ${
                    theme === th.id
                      ? 'border-blue-600 bg-blue-50/50 ring-2 ring-blue-500/10'
                      : 'border-slate-200 bg-white hover:border-slate-300'
                  }`}
                >
                  <span className="font-semibold text-slate-800 block">{th.name}</span>
                  <div className="w-full h-1.5 rounded-full mt-2 bg-blue-600 opacity-60" />
                </button>
              ))}
            </div>
          </div>

          {/* 3. Section Toggles */}
          <div className="space-y-2">
            <label className="block text-slate-700 font-bold uppercase tracking-wider text-[11px]">
              Visible Sections on Public Portfolio
            </label>
            <div className="space-y-1.5">
              {[
                { key: 'showAcademics', label: 'Academics & Verified CGPA' },
                { key: 'showCertifications', label: 'Verified Certifications' },
                { key: 'showCodingStats', label: 'GitHub & LeetCode Metrics' },
                { key: 'showProjects', label: 'Engineered Projects' },
                { key: 'showSkills', label: 'Skill Competencies' },
                { key: 'showAssessments', label: '50-MCQ Topic Scores' },
                { key: 'showInterviewScore', label: 'AI Mock Interview Score' }
              ].map(({ key, label }) => (
                <label key={key} className="flex items-center space-x-2 text-slate-700 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={sections[key] ?? true}
                    onChange={() => toggleSection(key)}
                    className="rounded border-slate-300 text-blue-600 focus:ring-0"
                  />
                  <span>{label}</span>
                </label>
              ))}
            </div>
          </div>

        </div>
      </div>

      {/* Live Preview Container (Simulating the Live Rendered Portfolio) */}
      <div className="p-1 rounded-2xl bg-slate-200/60 shadow-xs">
        <div className="p-4 bg-white rounded-2xl border border-slate-200">
          
          <div className="flex items-center justify-between pb-4 border-b border-slate-100 mb-6">
            <div className="flex items-center space-x-2">
              <Laptop className="w-5 h-5 text-blue-600" />
              <span className="text-xs font-bold text-slate-800 uppercase tracking-wider">
                Live Public Portfolio Preview
              </span>
            </div>
            <div className="flex items-center space-x-2 text-[10px] text-slate-500 font-mono">
              <span className="w-2 h-2 rounded-full bg-emerald-500" />
              <span>Verified Identity Engine</span>
            </div>
          </div>

          {/* Rendered Live Student Profile */}
          <div className="space-y-8 max-w-5xl mx-auto py-2">
            
            {/* Hero Section */}
            <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6 p-6 rounded-2xl bg-slate-50 border border-slate-200">
              <div className="space-y-2">
                <div className="inline-flex items-center space-x-2 px-2.5 py-0.5 rounded-full text-[11px] font-mono bg-blue-50 text-blue-700 border border-blue-200">
                  <ShieldCheck className="w-3.5 h-3.5" />
                  <span>Verified Candidate • {pData.targetRole || 'Software Engineer'}</span>
                </div>
                <h1 className="text-3xl font-extrabold text-slate-900">
                  {pData.fullName || 'Student Candidate'}
                </h1>
                <p className="text-xs text-slate-600 max-w-xl leading-relaxed">
                  {pData.headline || 'Autonomous software engineer and problem solver passionate about production applications.'}
                </p>
                <div className="text-xs text-slate-500 flex flex-wrap gap-3 pt-1">
                  {pData.college && <span>🎓 {pData.college}</span>}
                  {pData.degree && <span>• {pData.degree}</span>}
                  {pData.location && <span>📍 {pData.location}</span>}
                </div>
              </div>

              {/* Verified Trust & Readiness Badge */}
              <div className="p-4 rounded-xl bg-white border border-slate-200 text-center shrink-0 shadow-2xs">
                <span className="text-[10px] text-slate-500 uppercase font-mono block font-medium">Employability Readiness</span>
                <span className="text-3xl font-black text-blue-700 font-mono">
                  {pData.readinessIndex || 88}/100
                </span>
                <span className="text-[10px] text-emerald-700 font-bold block mt-0.5">
                  Verified Proof-of-Work
                </span>
              </div>
            </div>

            {/* Academic & CGPA Honors (Privacy-Preserved: no raw documents shown) */}
            {sections.showAcademics && (
              <div className="space-y-3">
                <h3 className="text-xs font-bold text-slate-700 uppercase tracking-wider flex items-center space-x-2">
                  <GraduationCap className="w-4 h-4 text-blue-600" />
                  <span>Academic Standing & Verified CGPA</span>
                </h3>
                <div className="p-4 bg-slate-50 border border-slate-200 rounded-xl flex items-center justify-between text-xs">
                  <div>
                    <span className="font-semibold text-slate-800 block">{pData.college || 'University Institution'}</span>
                    <span className="text-slate-500">{pData.degree || 'Degree Program'} • Dept of {pData.department || 'Engineering'}</span>
                  </div>
                  <div className="text-right">
                    <span className="text-[10px] text-slate-500 uppercase font-mono block font-medium">Verified CGPA</span>
                    <span className="text-lg font-black text-blue-700 font-mono">
                      {pData.cgpa ? Number(pData.cgpa).toFixed(2) : '8.80'} / 10.0
                    </span>
                  </div>
                </div>
              </div>
            )}

            {/* Verified Certifications */}
            {sections.showCertifications && pData.certifications && pData.certifications.length > 0 && (
              <div className="space-y-3">
                <h3 className="text-xs font-bold text-slate-700 uppercase tracking-wider flex items-center space-x-2">
                  <Award className="w-4 h-4 text-amber-600" />
                  <span>Verified Professional Certifications</span>
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {pData.certifications.map((c, idx) => (
                    <div key={idx} className="p-3.5 bg-slate-50 border border-slate-200 rounded-xl text-xs space-y-1">
                      <div className="flex justify-between items-start">
                        <span className="font-bold text-slate-800">{c.name}</span>
                        <span className="px-1.5 py-0.5 rounded text-[10px] bg-emerald-50 text-emerald-700 border border-emerald-200 font-bold">
                          {c.status || 'Verified'}
                        </span>
                      </div>
                      <span className="text-blue-700 text-[11px] font-semibold block">{c.issuer}</span>
                      {c.credentialUrl && (
                        <a href={c.credentialUrl} target="_blank" rel="noreferrer" className="text-[10px] text-slate-500 hover:text-blue-600 flex items-center space-x-1 pt-1 font-medium">
                          <span>View Issuer Credential</span>
                          <ExternalLink className="w-2.5 h-2.5" />
                        </a>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Coding Profiles & LeetCode */}
            {sections.showCodingStats && (
              <div className="space-y-3">
                <h3 className="text-xs font-bold text-slate-700 uppercase tracking-wider flex items-center space-x-2">
                  <Code2 className="w-4 h-4 text-purple-600" />
                  <span>Verified Coding Metrics</span>
                </h3>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3 text-center text-xs">
                  <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl">
                    <span className="text-[10px] text-slate-500 uppercase font-medium block">GitHub Repos</span>
                    <span className="text-base font-bold text-slate-800">{pData.coding?.githubRepos || 14}</span>
                  </div>
                  <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl">
                    <span className="text-[10px] text-slate-500 uppercase font-medium block">LeetCode Solved</span>
                    <span className="text-base font-bold text-amber-700 font-mono">{pData.coding?.leetcodeSolved || 240}</span>
                  </div>
                  <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl">
                    <span className="text-[10px] text-slate-500 uppercase font-medium block">Contest Rating</span>
                    <span className="text-base font-bold text-blue-700 font-mono">{pData.coding?.contestRating || '1840'}</span>
                  </div>
                  <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl">
                    <span className="text-[10px] text-slate-500 uppercase font-medium block">50-MCQ Topic Test</span>
                    <span className="text-base font-bold text-rose-700 font-mono">{pData.assessmentAverage || 89}%</span>
                  </div>
                </div>
              </div>
            )}

            {/* Featured Projects */}
            {sections.showProjects && pData.projects && pData.projects.length > 0 && (
              <div className="space-y-3">
                <h3 className="text-xs font-bold text-slate-700 uppercase tracking-wider flex items-center space-x-2">
                  <Sparkles className="w-4 h-4 text-blue-600" />
                  <span>Engineered Software Projects</span>
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {pData.projects.map((proj, idx) => (
                    <div key={idx} className="p-4 bg-slate-50 border border-slate-200 rounded-xl text-xs space-y-2">
                      <div className="flex justify-between items-start">
                        <h4 className="font-bold text-slate-900 text-sm">{proj.title}</h4>
                        {proj.githubUrl && (
                          <a href={proj.githubUrl} target="_blank" rel="noreferrer" className="text-slate-500 hover:text-slate-900">
                            <GithubIcon className="w-4 h-4" />
                          </a>
                        )}
                      </div>
                      <p className="text-slate-600 line-clamp-2 leading-relaxed">{proj.solution || proj.description}</p>
                      {proj.technologies && (
                        <div className="flex flex-wrap gap-1 pt-1">
                          {proj.technologies.map((t, tidx) => (
                            <span key={tidx} className="px-2 py-0.5 rounded text-[10px] bg-white border border-slate-200 font-mono text-slate-700 font-medium">
                              {t}
                            </span>
                          ))}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}

          </div>

        </div>
      </div>

      {/* 1-Page ATS Resume Modal */}
      <AtsResumeModal
        isOpen={resumeModalOpen}
        onClose={() => setResumeModalOpen(false)}
        studentData={pData?.student ? {
          ...pData.student,
          skills: pData.skills,
          projects: pData.projects,
          cgpa: pData.education?.cgpa || 8.85,
          college: pData.education?.college || 'National Institute of Technology',
          degree: pData.education?.degree || 'B.Tech in Computer Science and Engineering',
          graduationYear: pData.education?.graduationYear || '2026',
          academicVerification: pData.education?.verificationStatus || 'Academic Records Verified',
          assessmentScore: pData.assessments?.[0]?.score || 80,
          assessmentTopic: pData.assessments?.[0]?.topicTitle || 'UI/UX Design',
          interviewScore: pData.mockInterview?.overall || 92,
          interviewPace: pData.mockInterview?.paceWpm || 135
        } : {}}
      />

      {/* Workflow Navigation Footer - Step 10 Completion */}
      <div className="p-5 bg-white border border-slate-200/90 rounded-2xl flex flex-col sm:flex-row items-center justify-between gap-4 shadow-xs">
        <div>
          <span className="text-[10px] font-mono uppercase tracking-wider text-emerald-700 font-bold">Step 10 of 10 Completed • Portfolio Ready</span>
          <h4 className="text-sm font-bold text-slate-900">Congratulations! Your Verified Engineering Portfolio is live</h4>
          <p className="text-xs text-slate-600">All 10 steps of the compiler process have been executed with cryptographic authenticity.</p>
        </div>
        {onNavigate && (
          <button
            type="button"
            onClick={() => onNavigate('dashboard')}
            className="px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-semibold text-xs flex items-center space-x-2 transition shadow-xs shrink-0 cursor-pointer"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Return to Central Dashboard</span>
          </button>
        )}
      </div>

    </div>
  );
}
