import React, { useState, useEffect } from 'react';
import { api } from '../api';
import { ShieldCheck, Award, Code2, GraduationCap, ExternalLink, CheckCircle2 } from 'lucide-react';
import { GithubIcon, LinkedinIcon } from '../components/SocialIcons';

export default function PublicPortfolioStandaloneView({ slug }) {
  const [data, setMessage] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    loadPublicPortfolio();
  }, [slug]);

  const loadPublicPortfolio = async () => {
    setLoading(true);
    try {
      const res = await api.get(`/portfolio/public/${slug || 'student'}`);
      setMessage(res);
    } catch (err) {
      setError(err.message || 'Portfolio not found or set to private.');
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
      <div className="min-h-screen bg-[#070b14] text-slate-100 flex flex-col items-center justify-center p-6 text-center">
        <div className="p-6 bg-slate-900 border border-slate-800 rounded-2xl max-w-md">
          <h2 className="text-lg font-bold text-slate-200 mb-2">Portfolio Unavailable</h2>
          <p className="text-xs text-slate-400 mb-4">{error || 'This portfolio is not published yet.'}</p>
          <a href="/" className="px-4 py-2 rounded-xl bg-cyan-500 text-slate-950 font-bold text-xs inline-block">
            Back to Platform
          </a>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#070b14] text-slate-100 py-10 px-4 md:px-8 selection:bg-cyan-500/30">
      <div className="max-w-4xl mx-auto space-y-8">
        
        {/* Top Floating Badge */}
        <div className="flex items-center justify-between text-xs">
          <div className="flex items-center space-x-2 text-cyan-400 font-mono">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            <span>AI-Verified Candidate Portfolio</span>
          </div>
          <a href="/" className="text-xs font-semibold text-slate-400 hover:text-cyan-300 transition">
            Powered by Portfolio Compiler →
          </a>
        </div>

        {/* Hero Header */}
        <div className="p-8 bg-slate-900/80 border border-cyan-500/30 rounded-3xl backdrop-blur-xl">
          <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full text-xs font-mono bg-cyan-500/10 text-cyan-400 border border-cyan-500/30 mb-3">
            <ShieldCheck className="w-4 h-4 text-emerald-400" />
            <span>Verified Candidate • {data.targetRole || 'Software Engineer'}</span>
          </div>
          <h1 className="text-3xl md:text-4xl font-black text-slate-100">{data.fullName || 'Candidate'}</h1>
          <p className="text-sm text-cyan-300 font-semibold mt-1">{data.headline}</p>
          <p className="text-xs text-slate-400 mt-2 max-w-2xl leading-relaxed">{data.aboutMe}</p>

          <div className="flex items-center space-x-4 mt-6">
            {data.githubUrl && (
              <a href={data.githubUrl} target="_blank" rel="noreferrer" className="text-slate-400 hover:text-white transition">
                <GithubIcon className="w-5 h-5" />
              </a>
            )}
            {data.linkedinUrl && (
              <a href={data.linkedinUrl} target="_blank" rel="noreferrer" className="text-slate-400 hover:text-white transition">
                <LinkedinIcon className="w-5 h-5" />
              </a>
            )}
          </div>
        </div>

        {/* Verified Projects */}
        <div className="space-y-4">
          <h2 className="text-lg font-bold text-white flex items-center space-x-2">
            <span>Engineered Projects</span>
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {(data.projects || []).map((proj, idx) => (
              <div key={idx} className="p-5 bg-slate-900/80 border border-slate-800 rounded-2xl">
                <h3 className="text-sm font-bold text-white">{proj.title}</h3>
                <p className="text-xs text-slate-400 mt-1 line-clamp-2">{proj.description}</p>
                <div className="flex flex-wrap gap-1.5 mt-3">
                  {(proj.technologies || []).map((t, i) => (
                    <span key={i} className="px-2 py-0.5 rounded text-[10px] font-mono bg-slate-800 text-slate-300">
                      {t}
                    </span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>

      </div>
    </div>
  );
}