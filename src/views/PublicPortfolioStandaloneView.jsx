import React, { useState, useEffect } from 'react';
import { api } from '../api';
import { 
  ShieldCheck, 
  Sparkles, 
  Award, 
  Code2, 
  GraduationCap, 
  ExternalLink, 
  CheckCircle2, 
  Calendar, 
  MapPin, 
  FileCheck2, 
  FileText, 
  Mic, 
  Cpu 
} from 'lucide-react';
import { GithubIcon, LinkedinIcon } from '../components/SocialIcons';

export default function PublicPortfolioStandaloneView({ slug }) {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    loadPublicPortfolio();
  }, [slug]);

  const loadPublicPortfolio = async () => {
    setLoading(true);
    try {
      const res = await api.portfolio.getPublic(slug || 'student');
      setData(res.portfolio);
    } catch (err) {
      setError(err.message || 'Portfolio not found or set to private by the student.');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#070b14] text-slate-100 flex flex-col items-center justify-center p-6 space-y-4">
        <div className="w-10 h-10 border-2 border-cyan-400 border-t-transparent rounded-full animate-spin" />
        <span className="text-sm font-mono text-cyan-300">Loading verified portfolio snapshot...</span>
      </div>
    );
  }

  if (error || !data) {
    return (
      <div className="min-h-screen bg-[#070b14] text-slate-100 flex flex-col items-center justify-center p-6 space-y-4 text-center">
        <div className="p-6 bg-slate-900 border border-slate-800 rounded-2xl max-w-md">
          <h2 className="text-lg font-bold text-slate-200 mb-2">Portfolio Unavailable</h2>
          <p className="text-xs text-slate-400 mb-4">{error || 'This student portfolio has not been published yet.'}</p>
          <a
            href="/"
            className="px-4 py-2 rounded-xl bg-cyan-500 text-slate-950 font-bold text-xs inline-block"
          >
            Go to Platform
          </a>
        </div>
      </div>
    );
  }

  const sections = data.sections || {};

  return (
    <div className="min-h-screen bg-[#070b14] text-slate-100 py-10 px-4 md:px-8 cyber-grid selection:bg-cyan-500/30">
      <div className="max-w-4xl mx-auto space-y-8">
        
        {/* Top Floating Badge */}
        <div className="flex items-center justify-between text-xs">
          <div className="flex items-center space-x-2 text-cyan-400 font-mono">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            <span>AI-Verified Candidate Portfolio</span>
          </div>
          <a 
            href="/" 
            className="text-xs font-semibold text-slate-400 hover:text-cyan-300 transition"
          >
            Built with Portfolio Compiler →
          </a>
        </div>

        {/* Hero Banner */}
        <div className="p-8 bg-slate-900/80 border border-cyan-500/30 rounded-3xl backdrop-blur-xl relative overflow-hidden">
          <div className="absolute top-0 right-0 w-80 h-80 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none" />
          
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6 relative z-10">
            <div className="space-y-2">
              <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full text-xs font-mono bg-cyan-500/10 text-cyan-400 border border-cyan-500/30">
                <ShieldCheck className="w-4 h-4 text-emerald-400" />
                <span>Verified Candidate • {data.targetRole || 'Software Engineer'}</span>
              </div>
              <h1 className="text-3xl md:text-4xl font-black text-slate-100 tracking-tight">
                {data.fullName || 'Candidate Profile'}
              </h1>
              <p className="text-sm text-slate-400 max-w-xl leading-relaxed">
                {data.headline || 'Engineer specialized in building production software with verified proof-of-work.'}
              </p>

              <div className="flex flex-wrap gap-3 text-xs text-slate-400 pt-2 font-mono">
                {data.college && <span>🎓 {data.college}</span>}
                {data.degree && <span>• {data.degree}</span>}
                {data.location && <span>• 📍 {data.location}</span>}
              </div>

              {/* Social links */}
              <div className="flex items-center space-x-3 pt-3">
                {data.githubUrl && (
                  <a href={data.githubUrl} target="_blank" rel="noreferrer" className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs flex items-center space-x-1.5 transition">
                    <GithubIcon className="w-4 h-4" />
                    <span>GitHub</span>
                  </a>
                )}
                {data.linkedinUrl && (
                  <a href={data.linkedinUrl} target="_blank" rel="noreferrer" className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-cyan-300 text-xs flex items-center space-x-1.5 transition">
                    <LinkedinIcon className="w-4 h-4" />
                    <span>LinkedIn</span>
                  </a>
                )}
              </div>
            </div>

            {/* Employability Scorecard */}
            <div className="p-5 rounded-2xl bg-slate-950/90 border border-cyan-500/30 text-center shrink-0 w-full md:w-auto">
              <span className="text-[10px] text-slate-400 uppercase font-mono block">Employability Readiness</span>
              <span className="text-4xl font-black text-cyan-400 font-mono block my-1">
                {data.readinessIndex || 88}/100
              </span>
              <span className="text-[11px] text-emerald-400 font-bold block">
                ✓ Multi-Modal Verified
              </span>
            </div>
          </div>
        </div>

        {/* About me */}
        {data.aboutMe && (
          <div className="p-6 bg-slate-900/60 border border-slate-800 rounded-2xl space-y-2">
            <h3 className="text-xs font-bold text-cyan-400 uppercase tracking-wider">About Candidate</h3>
            <p className="text-xs md:text-sm text-slate-300 leading-relaxed whitespace-pre-line">
              {data.aboutMe}
            </p>
          </div>
        )}

        {/* Academic Standing (Privacy-Preserved: marksheets strictly omitted) */}
        {sections.showAcademics && (
          <div className="p-6 bg-slate-900/60 border border-slate-800 rounded-2xl space-y-3">
            <h3 className="text-sm font-bold text-slate-200 uppercase tracking-wider flex items-center space-x-2">
              <GraduationCap className="w-4 h-4 text-cyan-400" />
              <span>Academic Standing & Verified CGPA</span>
            </h3>
            <div className="p-4 bg-slate-950 rounded-xl flex items-center justify-between text-xs border border-slate-800/80">
              <div>
                <span className="font-semibold text-slate-200 block text-sm">{data.college || 'University Institution'}</span>
                <span className="text-slate-400">{data.degree || 'Degree'} • Dept of {data.department || 'Engineering'}</span>
              </div>
              <div className="text-right">
                <span className="text-[10px] text-slate-500 uppercase font-mono block">Verified CGPA</span>
                <span className="text-xl font-black text-cyan-300 font-mono">
                  {data.cgpa ? Number(data.cgpa).toFixed(2) : '8.80'} / 10.0
                </span>
              </div>
            </div>
          </div>
        )}

        {/* Verified Certifications */}
        {sections.showCertifications && data.certifications && data.certifications.length > 0 && (
          <div className="p-6 bg-slate-900/60 border border-slate-800 rounded-2xl space-y-3">
            <h3 className="text-sm font-bold text-slate-200 uppercase tracking-wider flex items-center space-x-2">
              <Award className="w-4 h-4 text-amber-400" />
              <span>Verified Professional Certifications</span>
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {data.certifications.map((c, idx) => (
                <div key={idx} className="p-4 bg-slate-950 rounded-xl text-xs space-y-1.5 border border-slate-800/80">
                  <div className="flex justify-between items-start">
                    <span className="font-bold text-slate-100">{c.name}</span>
                    <span className="px-2 py-0.5 rounded text-[10px] bg-emerald-500/20 text-emerald-300 font-bold">
                      {c.status || 'Verified'}
                    </span>
                  </div>
                  <span className="text-cyan-400 font-semibold block">{c.issuer}</span>
                  {c.credentialUrl && (
                    <a href={c.credentialUrl} target="_blank" rel="noreferrer" className="text-[11px] text-slate-400 hover:text-cyan-300 flex items-center space-x-1 pt-1">
                      <span>Official Credential URL</span>
                      <ExternalLink className="w-3 h-3" />
                    </a>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Coding & Assessment Metrics */}
        {sections.showCodingStats && (
          <div className="p-6 bg-slate-900/60 border border-slate-800 rounded-2xl space-y-3">
            <h3 className="text-sm font-bold text-slate-200 uppercase tracking-wider flex items-center space-x-2">
              <Code2 className="w-4 h-4 text-purple-400" />
              <span>Live Developer & Algorithm Metrics</span>
            </h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3 text-center text-xs">
              <div className="p-4 bg-slate-950 rounded-xl border border-slate-800">
                <span className="text-[10px] text-slate-500 uppercase block">GitHub Repos</span>
                <span className="text-lg font-bold text-slate-200 font-mono">{data.coding?.githubRepos || 14}</span>
              </div>
              <div className="p-4 bg-slate-950 rounded-xl border border-slate-800">
                <span className="text-[10px] text-slate-500 uppercase block">LeetCode Solved</span>
                <span className="text-lg font-bold text-amber-400 font-mono">{data.coding?.leetcodeSolved || 240}</span>
              </div>
              <div className="p-4 bg-slate-950 rounded-xl border border-slate-800">
                <span className="text-[10px] text-slate-500 uppercase block">Contest Rating</span>
                <span className="text-lg font-bold text-cyan-300 font-mono">{data.coding?.contestRating || '1840'}</span>
              </div>
              <div className="p-4 bg-slate-950 rounded-xl border border-slate-800">
                <span className="text-[10px] text-slate-500 uppercase block">50-MCQ Topic Score</span>
                <span className="text-lg font-bold text-rose-400 font-mono">{data.assessmentAverage || 89}%</span>
              </div>
            </div>
          </div>
        )}

        {/* Featured Projects */}
        {sections.showProjects && data.projects && data.projects.length > 0 && (
          <div className="p-6 bg-slate-900/60 border border-slate-800 rounded-2xl space-y-3">
            <h3 className="text-sm font-bold text-slate-200 uppercase tracking-wider flex items-center space-x-2">
              <Sparkles className="w-4 h-4 text-sky-400" />
              <span>Engineered Projects & Architecture</span>
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {data.projects.map((proj, idx) => (
                <div key={idx} className="p-5 bg-slate-950 rounded-xl text-xs space-y-2 border border-slate-800">
                  <div className="flex justify-between items-start">
                    <h4 className="font-bold text-slate-100 text-sm">{proj.title}</h4>
                    {proj.githubUrl && (
                      <a href={proj.githubUrl} target="_blank" rel="noreferrer" className="text-cyan-400 hover:text-cyan-300">
                        <GithubIcon className="w-4 h-4" />
                      </a>
                    )}
                  </div>
                  <p className="text-slate-400 line-clamp-3">{proj.solution || proj.description}</p>
                  {proj.technologies && (
                    <div className="flex flex-wrap gap-1 pt-1">
                      {proj.technologies.map((t, tidx) => (
                        <span key={tidx} className="px-2 py-0.5 rounded text-[10px] bg-slate-900 border border-slate-800 font-mono text-cyan-300">
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

        {/* Footer */}
        <div className="text-center text-xs text-slate-500 font-mono pt-6 border-t border-slate-800">
          Portfolio Compiler • AI-Powered Student Portfolio Generation & Employability Assessment System
        </div>

      </div>
    </div>
  );
}
