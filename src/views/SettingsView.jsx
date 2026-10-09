import React, { useState, useEffect } from 'react';
import { api } from '../api';
import { 
  Settings as SettingsIcon, 
  Palette, 
  Layout, 
  Globe, 
  Lock, 
  Eye, 
  EyeOff, 
  Save, 
  FileText, 
  Download, 
  Printer, 
  CheckCircle2, 
  AlertCircle, 
  Sparkles, 
  Copy, 
  Share2, 
  ExternalLink,
  ShieldCheck,
  User,
  Key
} from 'lucide-react';

const THEMES = [
  { id: 'cyber-dark', name: 'Cyberpunk Neon', desc: 'Dark obsidian canvas with cyan and electric blue accents', color: 'from-cyan-500 to-blue-600' },
  { id: 'clean-slate', name: 'Slate Executive', desc: 'Refined enterprise aesthetic with clean monochrome contrast', color: 'from-slate-400 to-slate-600' },
  { id: 'minimal-indigo', name: 'Deep Indigo', desc: 'Modern tech studio vibe with deep purple and indigo highlights', color: 'from-indigo-500 to-purple-600' },
  { id: 'emerald-neo', name: 'Emerald Neo', desc: 'High-contrast emerald terminal theme with subtle grid', color: 'from-emerald-400 to-teal-500' },
];

const TEMPLATES = [
  { id: 'bento', name: 'Interactive Bento Grid', desc: 'Modular visual cards highlighting projects, code metrics, and radar charts' },
  { id: 'terminal', name: 'Cyber Terminal', desc: 'Developer-first console aesthetic emphasizing repositories, algorithms, and test scores' },
  { id: 'executive', name: 'Executive Minimalist', desc: 'Clean chronological portfolio layout tailored for enterprise recruiter screening' }
];

export default function SettingsView() {
  const [settings, setSettings] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [feedback, setFeedback] = useState({ type: '', msg: '' });
  
  // Customizer state
  const [theme, setTheme] = useState('cyber-dark');
  const [template, setTemplate] = useState('bento');
  const [slug, setSlug] = useState('student');
  const [isPublic, setIsPublic] = useState(true);
  const [customHeadline, setCustomHeadline] = useState('');
  const [customAbout, setCustomAbout] = useState('');
  
  const [sections, setSections] = useState({
    showAcademics: true,
    showCertifications: true,
    showCodingStats: true,
    showProjects: true,
    showSkills: true,
    showAssessments: true,
    showInterviewScore: true
  });

  // Resume export modal state
  const [resumeData, setResumeData] = useState(null);
  const [isResumeModalOpen, setIsResumeModalOpen] = useState(false);
  const [loadingResume, setLoadingResume] = useState(false);
  const [copiedLink, setCopiedLink] = useState(false);

  useEffect(() => {
    loadSettings();
  }, []);

  const loadSettings = async () => {
    setLoading(true);
    try {
      const data = await api.portfolio.getSettings();
      const current = data.settings || data || {};
      setSettings(current);
      if (current.theme) setTheme(current.theme);
      if (current.template) setTemplate(current.template);
      if (current.slug) setSlug(current.slug);
      if (current.isPublic !== undefined) setIsPublic(current.isPublic);
      if (current.customHeadline) setCustomHeadline(current.customHeadline);
      if (current.customAbout) setCustomAbout(current.customAbout);
      if (current.sectionVisibility) setSections(current.sectionVisibility);
      else if (current.sections) setSections(current.sections);
    } catch (err) {
      console.error('Failed to load settings:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleSaveSettings = async (e) => {
    if (e) e.preventDefault();
    setSaving(true);
    setFeedback({ type: '', msg: '' });

    try {
      const cleanSlug = slug.trim().toLowerCase().replace(/[^a-z0-9-]/g, '-');
      const payload = {
        theme,
        template,
        slug: cleanSlug,
        isPublic,
        customHeadline: customHeadline.trim(),
        customAbout: customAbout.trim(),
        sectionVisibility: sections,
        sections
      };

      await api.portfolio.updateSettings(payload);
      setSlug(cleanSlug);
      setFeedback({ type: 'success', msg: 'Settings and customization saved successfully!' });
      setTimeout(() => setFeedback({ type: '', msg: '' }), 4000);
    } catch (err) {
      setFeedback({ type: 'error', msg: err.message || 'Failed to save settings.' });
    } finally {
      setSaving(false);
    }
  };

  const toggleSection = (key) => {
    setSections(prev => ({
      ...prev,
      [key]: !prev[key]
    }));
  };

  const handleOpenResumeModal = async () => {
    setIsResumeModalOpen(true);
    setLoadingResume(true);
    try {
      const res = await api.portfolio.getPublic(slug || 'neshat');
      setResumeData(res.portfolio || res);
    } catch (e) {
      try {
        const res = await api.portfolio.getPublic('neshat');
        setResumeData(res.portfolio || res);
      } catch (err) {
        console.error('Failed to generate resume preview:', err);
      }
    } finally {
      setLoadingResume(false);
    }
  };

  const handlePrintResume = () => {
    window.print();
  };

  const handleCopyUrl = () => {
    const fullUrl = `${window.location.origin}/p/${slug}`;
    navigator.clipboard.writeText(fullUrl);
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 2500);
  };

  const handleExportJson = () => {
    if (!resumeData && !settings) return;
    const blob = new Blob([JSON.stringify(resumeData || settings, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${slug}-verified-portfolio.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  if (loading) {
    return (
      <div className="p-12 text-center text-slate-400 flex flex-col items-center justify-center space-y-3">
        <div className="w-8 h-8 border-2 border-cyan-400 border-t-transparent rounded-full animate-spin" />
        <span className="text-sm">Loading portfolio settings & customization parameters...</span>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      
      {/* Top Header Card */}
      <div className="p-6 bg-slate-900/80 border border-cyan-500/20 rounded-2xl">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center space-x-2.5 mb-2">
              <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-cyan-500/20 text-cyan-300 border border-cyan-500/40">
                System Preferences & Presentation
              </span>
              <span className="text-slate-500">•</span>
              <span className="text-xs text-slate-400">Section 20, 21, 22 Compliance</span>
            </div>
            <h1 className="text-xl md:text-2xl font-black text-slate-100 tracking-tight">
              Portfolio Customization & Resume Export
            </h1>
            <p className="text-xs md:text-sm text-slate-400 mt-1 max-w-2xl">
              Control portfolio templates, color schemes, shareable URL handles, section visibility, and generate verified ATS resumes. Customizations do not alter underlying verification integrity.
            </p>
          </div>

          <div className="flex items-center space-x-2">
            <button
              onClick={handleOpenResumeModal}
              className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-cyan-300 border border-cyan-500/30 text-xs font-semibold flex items-center space-x-1.5 transition"
            >
              <FileText className="w-4 h-4 text-cyan-400" />
              <span>Generate Resume</span>
            </button>
            <button
              onClick={handleSaveSettings}
              disabled={saving}
              className="px-4 py-2 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold text-xs flex items-center space-x-1.5 transition shadow-md glow-cyan"
            >
              <Save className="w-4 h-4" />
              <span>{saving ? 'Saving...' : 'Save Settings'}</span>
            </button>
          </div>
        </div>

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

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        
        {/* Left Column (8 cols): Presentation & Visibility */}
        <div className="lg:col-span-8 space-y-6">
          
          {/* 1. Shareable URL & Privacy (Section 21 & 26) */}
          <div className="p-6 bg-slate-900/70 border border-slate-800 rounded-2xl space-y-4">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <h2 className="text-sm font-bold text-slate-200 flex items-center space-x-2">
                <Globe className="w-4 h-4 text-cyan-400" />
                <span>Shareable Web URL & Privacy Controls</span>
              </h2>
              <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                isPublic ? 'bg-emerald-500/20 text-emerald-300' : 'bg-amber-500/20 text-amber-300'
              }`}>
                {isPublic ? 'Public Web Link' : 'Private (Restricted)'}
              </span>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1.5">
                  Portfolio Handle / Custom URL Slug
                </label>
                <div className="flex items-center space-x-2">
                  <div className="flex-1 flex items-center bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs font-mono text-slate-300">
                    <span className="text-slate-500">{window.location.origin}/p/</span>
                    <input
                      type="text"
                      value={slug}
                      onChange={(e) => setSlug(e.target.value.toLowerCase().replace(/[^a-z0-9-]/g, ''))}
                      className="bg-transparent text-cyan-300 font-bold outline-none flex-1"
                    />
                  </div>
                  <button
                    onClick={handleCopyUrl}
                    className="px-3 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold flex items-center space-x-1 shrink-0"
                  >
                    {copiedLink ? <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                    <span>{copiedLink ? 'Copied' : 'Copy'}</span>
                  </button>
                  <a
                    href={`/p/${slug}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-cyan-400 transition shrink-0"
                    title="Open live portfolio in new tab"
                  >
                    <ExternalLink className="w-4 h-4" />
                  </a>
                </div>
                <p className="text-[11px] text-slate-500 mt-1">
                  Sensitive documents (marksheet PDFs) are strictly excluded from public URLs for candidate privacy.
                </p>
              </div>

              {/* Public/Private Toggle */}
              <div className="p-3.5 bg-slate-950/60 border border-slate-800/80 rounded-xl flex items-center justify-between">
                <div>
                  <span className="text-xs font-bold text-slate-200 block">Live Public Access</span>
                  <p className="text-[11px] text-slate-400">When enabled, recruiters with your link can view your verified snapshot.</p>
                </div>
                <button
                  type="button"
                  onClick={() => setIsPublic(!isPublic)}
                  className={`w-12 h-6 flex items-center rounded-full p-1 transition-colors ${
                    isPublic ? 'bg-cyan-500' : 'bg-slate-700'
                  }`}
                >
                  <div className={`bg-slate-950 w-4 h-4 rounded-full shadow-md transform transition-transform ${
                    isPublic ? 'translate-x-6' : 'translate-x-0'
                  }`} />
                </button>
              </div>
            </div>
          </div>

          {/* 2. Visual Theme & Template (Section 20) */}
          <div className="p-6 bg-slate-900/70 border border-slate-800 rounded-2xl space-y-4">
            <h2 className="text-sm font-bold text-slate-200 flex items-center space-x-2 border-b border-slate-800 pb-3">
              <Palette className="w-4 h-4 text-purple-400" />
              <span>Theme & Visual Styling</span>
            </h2>

            {/* Themes */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {THEMES.map(t => (
                <div
                  key={t.id}
                  onClick={() => setTheme(t.id)}
                  className={`p-3.5 rounded-xl border cursor-pointer transition-all ${
                    theme === t.id
                      ? 'bg-slate-950 border-cyan-400 ring-1 ring-cyan-400/40 shadow-lg'
                      : 'bg-slate-950/50 border-slate-800 hover:border-slate-700'
                  }`}
                >
                  <div className="flex items-center justify-between mb-1">
                    <span className="font-bold text-xs text-slate-200">{t.name}</span>
                    <span className={`w-3.5 h-3.5 rounded-full bg-gradient-to-r ${t.color}`} />
                  </div>
                  <p className="text-[11px] text-slate-400">{t.desc}</p>
                </div>
              ))}
            </div>

            {/* Templates */}
            <div className="pt-2">
              <label className="block text-xs font-medium text-slate-300 mb-2">Portfolio Template</label>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                {TEMPLATES.map(tmpl => (
                  <div
                    key={tmpl.id}
                    onClick={() => setTemplate(tmpl.id)}
                    className={`p-3 rounded-xl border cursor-pointer transition-all ${
                      template === tmpl.id
                        ? 'bg-slate-950 border-cyan-400 ring-1 ring-cyan-400/40'
                        : 'bg-slate-950/50 border-slate-800 hover:border-slate-700'
                    }`}
                  >
                    <span className="font-bold text-xs text-slate-200 block mb-1">{tmpl.name}</span>
                    <p className="text-[10px] text-slate-400">{tmpl.desc}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* 3. Section Visibility Toggles (Section 20) */}
          <div className="p-6 bg-slate-900/70 border border-slate-800 rounded-2xl space-y-4">
            <h2 className="text-sm font-bold text-slate-200 flex items-center space-x-2 border-b border-slate-800 pb-3">
              <Layout className="w-4 h-4 text-emerald-400" />
              <span>Section Visibility Toggles</span>
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {[
                { key: 'showAcademics', label: 'Academic Records & CGPA' },
                { key: 'showCertifications', label: 'Verified Certifications' },
                { key: 'showCodingStats', label: 'Coding Profiles (GitHub & LeetCode)' },
                { key: 'showProjects', label: 'Engineered Projects' },
                { key: 'showSkills', label: 'Skills & Technical Matrix' },
                { key: 'showAssessments', label: '50-MCQ Topic Assessment Scores' },
                { key: 'showInterviewScore', label: 'AI Mock Interview Evaluation' },
              ].map(sec => (
                <div
                  key={sec.key}
                  className="p-3 bg-slate-950/60 border border-slate-800 rounded-xl flex items-center justify-between"
                >
                  <span className="text-xs text-slate-300 font-medium">{sec.label}</span>
                  <button
                    type="button"
                    onClick={() => toggleSection(sec.key)}
                    className={`p-1.5 rounded-lg transition ${
                      sections[sec.key] ? 'text-cyan-400 bg-cyan-950/40' : 'text-slate-600 bg-slate-900'
                    }`}
                  >
                    {sections[sec.key] ? <Eye className="w-4 h-4" /> : <EyeOff className="w-4 h-4" />}
                  </button>
                </div>
              ))}
            </div>
          </div>

        </div>

        {/* Right Column (4 cols): Resume & Fast Actions */}
        <div className="lg:col-span-4 space-y-6">
          
          {/* Resume Generator Card */}
          <div className="p-6 bg-gradient-to-b from-slate-900 via-slate-900 to-slate-950 border border-cyan-500/30 rounded-2xl space-y-4 shadow-xl">
            <div className="w-10 h-10 rounded-xl bg-cyan-500/20 text-cyan-400 flex items-center justify-center font-bold">
              <FileText className="w-5 h-5" />
            </div>

            <div>
              <h3 className="font-extrabold text-slate-100 text-base">ATS-Compliant Resume</h3>
              <p className="text-xs text-slate-400 mt-1">
                Auto-generate an industry standard 1-page ATS resume containing only verified and approved student credentials.
              </p>
            </div>

            <div className="space-y-2 pt-2">
              <button
                onClick={handleOpenResumeModal}
                className="w-full py-2.5 px-4 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold text-xs flex items-center justify-center space-x-2 transition shadow-md glow-cyan"
              >
                <Eye className="w-4 h-4" />
                <span>Preview & Print Resume</span>
              </button>

              <button
                onClick={handleExportJson}
                className="w-full py-2 px-3 rounded-xl bg-slate-950 hover:bg-slate-800 text-slate-300 border border-slate-800 text-xs font-semibold flex items-center justify-center space-x-1.5 transition"
              >
                <Download className="w-3.5 h-3.5 text-slate-400" />
                <span>Export Verified JSON Payload</span>
              </button>
            </div>
          </div>

          {/* Custom Bio Card */}
          <div className="p-6 bg-slate-900/70 border border-slate-800 rounded-2xl space-y-4">
            <h3 className="font-bold text-slate-200 text-xs uppercase tracking-wider">
              Custom Headline & Bio
            </h3>

            <div className="space-y-3">
              <div>
                <label className="block text-[11px] text-slate-400 mb-1">Headline</label>
                <input
                  type="text"
                  value={customHeadline}
                  onChange={(e) => setCustomHeadline(e.target.value)}
                  placeholder="e.g. Full Stack Engineer | React & Cloud Architect"
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg px-2.5 py-1.5 text-xs text-slate-200 outline-none focus:border-cyan-400"
                />
              </div>

              <div>
                <label className="block text-[11px] text-slate-400 mb-1">About Me (Portfolio Bio)</label>
                <textarea
                  rows={4}
                  value={customAbout}
                  onChange={(e) => setCustomAbout(e.target.value)}
                  placeholder="Short introductory summary for your live portfolio..."
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2.5 text-xs text-slate-200 outline-none focus:border-cyan-400 resize-none"
                />
              </div>

              <button
                onClick={handleSaveSettings}
                disabled={saving}
                className="w-full py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-cyan-300 text-xs font-semibold transition"
              >
                Save Bio Updates
              </button>
            </div>
          </div>

        </div>

      </div>

      {/* Resume Modal (Printable ATS Resume) */}
      {isResumeModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md overflow-y-auto">
          <div className="w-full max-w-3xl bg-slate-900 border border-slate-800 rounded-2xl shadow-2xl p-6 relative max-h-[90vh] flex flex-col">
            
            <div className="flex items-center justify-between pb-4 border-b border-slate-800 shrink-0">
              <div className="flex items-center space-x-2">
                <FileText className="w-5 h-5 text-cyan-400" />
                <h3 className="font-bold text-slate-100 text-sm">Compiled Candidate Resume</h3>
              </div>
              <div className="flex items-center space-x-2">
                <button
                  onClick={handlePrintResume}
                  className="px-3 py-1.5 rounded-lg bg-cyan-500 text-slate-950 font-bold text-xs flex items-center space-x-1"
                >
                  <Printer className="w-3.5 h-3.5" />
                  <span>Print / Save PDF</span>
                </button>
                <button
                  onClick={() => setIsResumeModalOpen(false)}
                  className="p-1.5 text-slate-400 hover:text-slate-100 rounded-lg hover:bg-slate-800"
                >
                  ✕
                </button>
              </div>
            </div>

            {/* Printable Resume Canvas */}
            <div className="flex-1 overflow-y-auto p-6 mt-4 bg-white text-slate-900 rounded-xl space-y-6 font-sans text-xs selection:bg-cyan-200" id="printable-resume">
              {loadingResume ? (
                <div className="p-8 text-center text-slate-500">Compiling verified resume...</div>
              ) : resumeData ? (
                <>
                  {/* Header */}
                  <div className="border-b border-slate-300 pb-4 text-center">
                    <h1 className="text-2xl font-black text-slate-900 tracking-tight uppercase">
                      {resumeData.fullName || 'Candidate Profile'}
                    </h1>
                    <p className="text-xs font-semibold text-cyan-800 mt-0.5">
                      {resumeData.targetRole || 'Software Engineer'} • {resumeData.headline}
                    </p>
                    <div className="flex flex-wrap justify-center gap-3 text-[11px] text-slate-600 mt-2">
                      <span>{resumeData.email}</span>
                      {resumeData.location && <span>• {resumeData.location}</span>}
                      {resumeData.githubUrl && <span>• {resumeData.githubUrl}</span>}
                      {resumeData.linkedInUrl && <span>• {resumeData.linkedInUrl}</span>}
                    </div>
                  </div>

                  {/* Education */}
                  {resumeData.education && (
                    <div className="space-y-1.5">
                      <h2 className="text-xs font-black uppercase text-slate-800 tracking-wider border-b border-slate-300 pb-0.5">
                        Education
                      </h2>
                      <div className="flex justify-between items-baseline">
                        <div>
                          <strong className="text-slate-900">{resumeData.education.degree}</strong>
                          <span className="text-slate-600 block">{resumeData.education.college}</span>
                        </div>
                        <div className="text-right">
                          <span className="text-slate-700 font-bold">CGPA: {resumeData.education.cgpa}/10</span>
                          <span className="text-slate-500 block text-[10px]">Graduation: {resumeData.education.graduationYear}</span>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Skills */}
                  {resumeData.skills && resumeData.skills.length > 0 && (
                    <div className="space-y-1.5">
                      <h2 className="text-xs font-black uppercase text-slate-800 tracking-wider border-b border-slate-300 pb-0.5">
                        Technical Competencies
                      </h2>
                      <div className="flex flex-wrap gap-1.5">
                        {resumeData.skills.map(s => (
                          <span key={s.id || s.name} className="px-2 py-0.5 bg-slate-100 border border-slate-200 rounded text-[10px] font-medium text-slate-800">
                            {s.name} {s.verified && '✓'}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Projects */}
                  {resumeData.projects && resumeData.projects.length > 0 && (
                    <div className="space-y-2.5">
                      <h2 className="text-xs font-black uppercase text-slate-800 tracking-wider border-b border-slate-300 pb-0.5">
                        Engineering Projects
                      </h2>
                      {resumeData.projects.map(p => (
                        <div key={p.id || p.title} className="space-y-1">
                          <div className="flex justify-between items-baseline">
                            <strong className="text-slate-900 font-bold">{p.title}</strong>
                            <span className="text-slate-500 text-[10px]">{p.duration || '3 months'}</span>
                          </div>
                          <p className="text-slate-700 text-[11px] leading-relaxed">
                            {p.solution || p.description}
                          </p>
                          {p.outcome && (
                            <p className="text-emerald-800 text-[10px] font-medium">
                              Impact: {p.outcome}
                            </p>
                          )}
                        </div>
                      ))}
                    </div>
                  )}

                  {/* Certifications */}
                  {resumeData.certifications && resumeData.certifications.length > 0 && (
                    <div className="space-y-1.5">
                      <h2 className="text-xs font-black uppercase text-slate-800 tracking-wider border-b border-slate-300 pb-0.5">
                        Verified Certifications & Accreditations
                      </h2>
                      <div className="space-y-1">
                        {resumeData.certifications.map(c => (
                          <div key={c.id || c.title} className="flex justify-between items-baseline text-[11px]">
                            <span className="font-medium text-slate-900">{c.title || c.name} — <span className="text-slate-600">{c.issuer}</span></span>
                            <span className="text-emerald-700 font-semibold">{c.isVerified ? '✓ Verified' : 'Pending'}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </>
              ) : null}
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
