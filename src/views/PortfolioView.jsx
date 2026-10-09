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
  Lock 
} from 'lucide-react';
import { GithubIcon } from '../components/SocialIcons';

const THEMES = [
  { id: 'cyber-dark', name: 'Cyberpunk Neon', bg: 'bg-[#070b14]', text: 'text-cyan-400', border: 'border-cyan-500/30' },
  { id: 'clean-slate', name: 'Slate Executive', bg: 'bg-slate-900', text: 'text-slate-100', border: 'border-slate-700' },
  { id: 'minimal-indigo', name: 'Deep Indigo', bg: 'bg-[#0d1127]', text: 'text-indigo-400', border: 'border-indigo-500/30' },
  { id: 'emerald-neo', name: 'Emerald Neo', bg: 'bg-[#061512]', text: 'text-emerald-400', border: 'border-emerald-500/30' },
];

export default function PortfolioView() {
  const [settings, setSettings] = useState(null);
  const [publicData, setPublicData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [copiedLink, setCopiedLink] = useState(false);
  const [feedbackMsg, setFeedbackMsg] = useState('');
  
  // Customizer form state
  const [theme, setTheme] = useState('cyber-dark');
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
        setTheme(data.settings.theme || 'cyber-dark');
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
      <div className="p-12 text-center text-slate-400 flex flex-col items-center justify-center space-y-3">
        <div className="w-8 h-8 border-2 border-cyan-400 border-t-transparent rounded-full animate-spin" />
        <span className="text-sm">Synthesizing live verified portfolio components...</span>
      </div>
    );
  }

  const pData = publicData?.portfolio || settings?.previewData || {};

  return (
    <div className="space-y-6">
      
      {/* Top Banner */}
      <div className="p-6 bg-slate-900/80 border border-cyan-500/20 rounded-2xl">
        <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4">
          <div>
            <div className="flex items-center space-x-2.5 mb-2">
              <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-cyan-500/20 text-cyan-300 border border-cyan-500/40">
                Live Portfolio Compiler & Publisher
              </span>
              <span className="text-slate-500">•</span>
              <span className="text-xs text-slate-400">
                Privacy-Preserving (Marksheet PDFs strictly hidden)
              </span>
            </div>
            <h1 className="text-xl md:text-2xl font-black text-slate-100 tracking-tight">
              Shareable Live Portfolio & Theme Engine
            </h1>
            <p className="text-xs md:text-sm text-slate-400 mt-1 max-w-2xl">
              Turn verified marksheet audits, certifications, GitHub code, 50-MCQ scores, and mock interview performance into an interactive portfolio for recruiters.
            </p>
          </div>

          {/* Shareable Link Box */}
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2 bg-slate-950 p-3 rounded-xl border border-slate-800 shrink-0">
            <div className="text-xs font-mono text-cyan-300 px-2 py-1 bg-slate-900 rounded truncate max-w-xs">
              {window.location.origin}/portfolio/{slug || 'student'}
            </div>
            <button
              onClick={handleCopyLink}
              className="px-3 py-1.5 rounded-lg bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold text-xs flex items-center justify-center space-x-1.5 transition shadow-sm glow-cyan"
            >
              {copiedLink ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{copiedLink ? 'Copied URL!' : 'Copy Link'}</span>
            </button>
          </div>
        </div>

        {feedbackMsg && (
          <div className="mt-4 p-3 rounded-xl bg-emerald-950/40 border border-emerald-500/40 text-emerald-200 text-xs flex items-center space-x-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
            <span>{feedbackMsg}</span>
          </div>
        )}
      </div>

      {/* Customizer Settings Controls */}
      <div className="p-6 bg-slate-900/70 border border-slate-800 rounded-2xl space-y-5">
        <div className="flex items-center justify-between border-b border-slate-800 pb-3">
          <h2 className="text-sm font-bold text-slate-200 uppercase tracking-wider flex items-center space-x-2">
            <Sliders className="w-4 h-4 text-cyan-400" />
            <span>Portfolio Customization Controls</span>
          </h2>
          <button
            onClick={handleSaveSettings}
            disabled={saving}
            className="px-4 py-1.5 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold text-xs flex items-center space-x-1.5 transition shadow-md glow-cyan disabled:opacity-50"
          >
            {saving ? (
              <span className="inline-block animate-spin rounded-full h-3.5 w-3.5 border-2 border-slate-950 border-t-transparent" />
            ) : (
              <Sparkles className="w-3.5 h-3.5" />
            )}
            <span>Apply Changes & Publish</span>
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-5 text-xs">
          
          {/* 1. Slug & Visibility */}
          <div className="space-y-3">
            <label className="block text-slate-300 font-bold uppercase tracking-wider text-[11px]">
              Custom Portfolio Slug
            </label>
            <div className="flex items-center space-x-1">
              <span className="text-slate-500 font-mono text-[11px]">/portfolio/</span>
              <input
                type="text"
                value={slug}
                onChange={(e) => setSlug(e.target.value)}
                placeholder="your-name"
                className="flex-1 bg-slate-950 border border-slate-700 focus:border-cyan-400 rounded-xl px-3 py-1.5 text-xs text-cyan-300 font-mono outline-none"
              />
            </div>

            <div className="pt-2">
              <label className="block text-slate-300 font-bold uppercase tracking-wider text-[11px] mb-1.5">
                Public Live Visibility
              </label>
              <button
                type="button"
                onClick={() => setIsPublic(!isPublic)}
                className={`w-full py-2 px-3 rounded-xl border text-xs font-semibold flex items-center justify-between transition ${
                  isPublic 
                    ? 'bg-emerald-950/40 border-emerald-500/40 text-emerald-300' 
                    : 'bg-slate-950 border-slate-800 text-slate-400'
                }`}
              >
                <span>{isPublic ? 'Publicly Accessible' : 'Private (Draft Only)'}</span>
                {isPublic ? <Eye className="w-4 h-4 text-emerald-400" /> : <EyeOff className="w-4 h-4 text-slate-500" />}
              </button>
            </div>
          </div>

          {/* 2. Theme Selection */}
          <div className="space-y-2">
            <label className="block text-slate-300 font-bold uppercase tracking-wider text-[11px]">
              Visual Color Theme
            </label>
            <div className="grid grid-cols-2 gap-2">
              {THEMES.map((th) => (
                <button
                  key={th.id}
                  type="button"
                  onClick={() => setTheme(th.id)}
                  className={`p-2.5 rounded-xl border text-left text-xs transition ${
                    theme === th.id
                      ? 'border-cyan-400 bg-slate-950 ring-1 ring-cyan-500/30'
                      : 'border-slate-800 bg-slate-950/50 hover:border-slate-700'
                  }`}
                >
                  <span className="font-bold text-slate-200 block">{th.name}</span>
                  <div className="w-full h-1.5 rounded-full mt-2 bg-gradient-to-r from-cyan-500 to-blue-500 opacity-60" />
                </button>
              ))}
            </div>
          </div>

          {/* 3. Section Toggles */}
          <div className="space-y-2">
            <label className="block text-slate-300 font-bold uppercase tracking-wider text-[11px]">
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
                <label key={key} className="flex items-center space-x-2 text-slate-300 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={sections[key] ?? true}
                    onChange={() => toggleSection(key)}
                    className="rounded border-slate-700 text-cyan-500 focus:ring-0"
                  />
                  <span>{label}</span>
                </label>
              ))}
            </div>
          </div>

        </div>
      </div>

      {/* Live Preview Container (Simulating the Live Rendered Portfolio) */}
      <div className="p-1 rounded-2xl bg-gradient-to-b from-cyan-500/20 via-slate-800/40 to-slate-900/60">
        <div className="p-4 bg-slate-950/90 rounded-2xl border border-slate-800">
          
          <div className="flex items-center justify-between pb-4 border-b border-slate-800 mb-6">
            <div className="flex items-center space-x-2">
              <Laptop className="w-5 h-5 text-cyan-400" />
              <span className="text-xs font-bold text-slate-200 uppercase tracking-wider">
                Live Public Portfolio Preview
              </span>
            </div>
            <div className="flex items-center space-x-2 text-[10px] text-slate-500 font-mono">
              <span className="w-2 h-2 rounded-full bg-emerald-400" />
              <span>Verified Identity Engine</span>
            </div>
          </div>

          {/* Rendered Live Student Profile */}
          <div className="space-y-8 max-w-5xl mx-auto py-2">
            
            {/* Hero Section */}
            <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6 p-6 rounded-2xl bg-slate-900/70 border border-slate-800">
              <div className="space-y-2">
                <div className="inline-flex items-center space-x-2 px-2.5 py-0.5 rounded-full text-[11px] font-mono bg-cyan-500/10 text-cyan-400 border border-cyan-500/30">
                  <ShieldCheck className="w-3.5 h-3.5" />
                  <span>Verified Candidate • {pData.targetRole || 'Software Engineer'}</span>
                </div>
                <h1 className="text-3xl font-extrabold text-slate-100">
                  {pData.fullName || 'Student Candidate'}
                </h1>
                <p className="text-xs text-slate-400 max-w-xl">
                  {pData.headline || 'Autonomous software engineer and problem solver passionate about production applications.'}
                </p>
                <div className="text-xs text-slate-400 flex flex-wrap gap-3 pt-1">
                  {pData.college && <span>🎓 {pData.college}</span>}
                  {pData.degree && <span>• {pData.degree}</span>}
                  {pData.location && <span>📍 {pData.location}</span>}
                </div>
              </div>

              {/* Verified Trust & Readiness Badge */}
              <div className="p-4 rounded-xl bg-slate-950 border border-cyan-500/30 text-center shrink-0">
                <span className="text-[10px] text-slate-400 uppercase font-mono block">Employability Readiness</span>
                <span className="text-3xl font-black text-cyan-400 font-mono">
                  {pData.readinessIndex || 88}/100
                </span>
                <span className="text-[10px] text-emerald-400 font-bold block mt-0.5">
                  Verified Proof-of-Work
                </span>
              </div>
            </div>

            {/* Academic & CGPA Honors (Privacy-Preserved: no raw documents shown) */}
            {sections.showAcademics && (
              <div className="space-y-3">
                <h3 className="text-sm font-bold text-slate-200 uppercase tracking-wider flex items-center space-x-2">
                  <GraduationCap className="w-4 h-4 text-cyan-400" />
                  <span>Academic Standing & Verified CGPA</span>
                </h3>
                <div className="p-4 bg-slate-900/60 border border-slate-800 rounded-xl flex items-center justify-between text-xs">
                  <div>
                    <span className="font-semibold text-slate-200 block">{pData.college || 'University Institution'}</span>
                    <span className="text-slate-400">{pData.degree || 'Degree Program'} • Dept of {pData.department || 'Engineering'}</span>
                  </div>
                  <div className="text-right">
                    <span className="text-[10px] text-slate-500 uppercase font-mono block">Verified CGPA</span>
                    <span className="text-lg font-black text-cyan-300 font-mono">
                      {pData.cgpa ? Number(pData.cgpa).toFixed(2) : '8.80'} / 10.0
                    </span>
                  </div>
                </div>
              </div>
            )}

            {/* Verified Certifications */}
            {sections.showCertifications && pData.certifications && pData.certifications.length > 0 && (
              <div className="space-y-3">
                <h3 className="text-sm font-bold text-slate-200 uppercase tracking-wider flex items-center space-x-2">
                  <Award className="w-4 h-4 text-amber-400" />
                  <span>Verified Professional Certifications</span>
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {pData.certifications.map((c, idx) => (
                    <div key={idx} className="p-3.5 bg-slate-900/60 border border-slate-800 rounded-xl text-xs space-y-1">
                      <div className="flex justify-between items-start">
                        <span className="font-bold text-slate-100">{c.name}</span>
                        <span className="px-1.5 py-0.5 rounded text-[10px] bg-emerald-500/20 text-emerald-300 font-bold">
                          {c.status || 'Verified'}
                        </span>
                      </div>
                      <span className="text-cyan-400 text-[11px] block">{c.issuer}</span>
                      {c.credentialUrl && (
                        <a href={c.credentialUrl} target="_blank" rel="noreferrer" className="text-[10px] text-slate-400 hover:text-cyan-300 flex items-center space-x-1 pt-1">
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
                <h3 className="text-sm font-bold text-slate-200 uppercase tracking-wider flex items-center space-x-2">
                  <Code2 className="w-4 h-4 text-purple-400" />
                  <span>Verified Coding Metrics</span>
                </h3>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3 text-center text-xs">
                  <div className="p-3 bg-slate-900/60 border border-slate-800 rounded-xl">
                    <span className="text-[10px] text-slate-500 uppercase block">GitHub Repos</span>
                    <span className="text-base font-bold text-slate-200">{pData.coding?.githubRepos || 14}</span>
                  </div>
                  <div className="p-3 bg-slate-900/60 border border-slate-800 rounded-xl">
                    <span className="text-[10px] text-slate-500 uppercase block">LeetCode Solved</span>
                    <span className="text-base font-bold text-amber-400 font-mono">{pData.coding?.leetcodeSolved || 240}</span>
                  </div>
                  <div className="p-3 bg-slate-900/60 border border-slate-800 rounded-xl">
                    <span className="text-[10px] text-slate-500 uppercase block">Contest Rating</span>
                    <span className="text-base font-bold text-cyan-300 font-mono">{pData.coding?.contestRating || '1840'}</span>
                  </div>
                  <div className="p-3 bg-slate-900/60 border border-slate-800 rounded-xl">
                    <span className="text-[10px] text-slate-500 uppercase block">50-MCQ Topic Test</span>
                    <span className="text-base font-bold text-rose-400 font-mono">{pData.assessmentAverage || 89}%</span>
                  </div>
                </div>
              </div>
            )}

            {/* Featured Projects */}
            {sections.showProjects && pData.projects && pData.projects.length > 0 && (
              <div className="space-y-3">
                <h3 className="text-sm font-bold text-slate-200 uppercase tracking-wider flex items-center space-x-2">
                  <Sparkles className="w-4 h-4 text-sky-400" />
                  <span>Engineered Software Projects</span>
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {pData.projects.map((proj, idx) => (
                    <div key={idx} className="p-4 bg-slate-900/70 border border-slate-800 rounded-xl text-xs space-y-2">
                      <div className="flex justify-between items-start">
                        <h4 className="font-bold text-slate-100 text-sm">{proj.title}</h4>
                        {proj.githubUrl && (
                          <a href={proj.githubUrl} target="_blank" rel="noreferrer" className="text-slate-400 hover:text-cyan-300">
                            <GithubIcon className="w-4 h-4" />
                          </a>
                        )}
                      </div>
                      <p className="text-slate-400 line-clamp-2">{proj.solution || proj.description}</p>
                      {proj.technologies && (
                        <div className="flex flex-wrap gap-1 pt-1">
                          {proj.technologies.map((t, tidx) => (
                            <span key={tidx} className="px-1.5 py-0.5 rounded text-[10px] bg-slate-950 font-mono text-cyan-300">
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

    </div>
  );
}
