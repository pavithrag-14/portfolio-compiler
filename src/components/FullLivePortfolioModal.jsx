import React from 'react';
import { 
  X, 
  ExternalLink, 
  Mail, 
  Code2, 
  CheckCircle2, 
  ShieldCheck, 
  Download, 
  Sparkles, 
  Award, 
  FileText,
  Star,
  GitFork
} from 'lucide-react';
import GithubIcon from './GithubIcon';
import RadarChart from './RadarChart';
import AssessmentGauge from './AssessmentGauge';

export default function FullLivePortfolioModal({ isOpen, onClose, candidateData, selectedRole }) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-950/95 backdrop-blur-xl animate-fadeIn text-slate-100">
      
      {/* Top Banner Navigation */}
      <div className="sticky top-0 z-30 bg-slate-950/90 border-b border-slate-800 backdrop-blur-md px-6 py-3.5 flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse" />
          <span className="text-xs font-mono text-cyan-400 font-bold uppercase tracking-wider">
            Live Public Portfolio View • student.ai/portfolio/{candidateData.name.toLowerCase().replace(/\s+/g, '-')}
          </span>
        </div>

        <div className="flex items-center space-x-3">
          <button
            onClick={() => window.print()}
            className="px-3.5 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold flex items-center space-x-1.5 transition-colors"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Download PDF</span>
          </button>

          <button
            onClick={onClose}
            className="p-1.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-400 hover:text-slate-100 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* Main Portfolio Content */}
      <div className="max-w-5xl mx-auto px-6 py-10 space-y-12">
        
        {/* Hero Section */}
        <div className="relative rounded-3xl p-8 md:p-10 border border-cyan-500/30 bg-gradient-to-br from-slate-900 via-slate-950 to-slate-900 shadow-2xl overflow-hidden">
          <div className="absolute top-0 right-0 w-96 h-96 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none" />
          
          <div className="flex flex-col md:flex-row items-center justify-between gap-8 relative z-10">
            <div className="flex flex-col md:flex-row items-center md:items-start space-y-4 md:space-y-0 md:space-x-6 text-center md:text-left">
              <div className="relative">
                <img
                  src={candidateData.avatar}
                  alt={candidateData.name}
                  className="w-28 h-28 rounded-2xl object-cover border-2 border-cyan-400 shadow-xl"
                />
                <span className="absolute -bottom-2 -right-2 bg-emerald-500 text-slate-950 rounded-full p-1.5 border-2 border-slate-950 shadow-md">
                  <CheckCircle2 className="w-4 h-4 text-white" />
                </span>
              </div>

              <div>
                <div className="flex items-center justify-center md:justify-start space-x-2">
                  <h1 className="text-3xl font-extrabold text-slate-100">{candidateData.name}</h1>
                  <span className="px-2.5 py-0.5 rounded-full text-xs font-mono font-semibold bg-emerald-500/20 text-emerald-400 border border-emerald-500/40">
                    Tier-1 Verified
                  </span>
                </div>
                <p className="text-cyan-400 font-semibold text-base mt-1">{selectedRole.title}</p>
                <p className="text-slate-400 text-xs mt-2 max-w-lg leading-relaxed">
                  {candidateData.degree} from {candidateData.university} (Class of {candidateData.graduationYear}). Specialized in scalable machine learning architectures, statistical hypothesis testing, and low-latency inference pipelines.
                </p>

                <div className="flex flex-wrap items-center justify-center md:justify-start gap-3 mt-4 text-xs">
                  <a
                    href={candidateData.github.profileUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="flex items-center space-x-1.5 px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 transition-colors"
                  >
                    <GithubIcon className="w-4 h-4" />
                    <span>github.com/{candidateData.github.username}</span>
                  </a>

                  <a
                    href={candidateData.leetcode.profileUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="flex items-center space-x-1.5 px-3 py-1.5 rounded-lg bg-orange-950/40 hover:bg-orange-900/40 text-orange-300 border border-orange-800/40 transition-colors"
                  >
                    <Code2 className="w-4 h-4 text-orange-400" />
                    <span>leetcode/{candidateData.leetcode.username}</span>
                  </a>
                </div>
              </div>
            </div>

            {/* Employability Score Hero Badge */}
            <div className="glass-panel p-5 rounded-2xl border border-cyan-500/30 text-center shrink-0 min-w-[210px] bg-slate-900/80">
              <span className="text-[10px] font-mono uppercase text-cyan-400 font-semibold tracking-wider">
                Employability Index
              </span>
              <div className="text-4xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-emerald-400 font-mono my-1">
                {candidateData.employabilityAssessment.overallScore}/100
              </div>
              <div className="text-[11px] font-semibold text-emerald-400">
                {candidateData.employabilityAssessment.grade}
              </div>
              <div className="text-[10px] text-slate-400 font-mono mt-1">
                Top {100 - candidateData.employabilityAssessment.percentile}% of applicants
              </div>
            </div>
          </div>
        </div>

        {/* Competencies & Radar Section */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-center">
          <div className="md:col-span-6 glass-panel rounded-3xl p-6 border border-slate-800 flex flex-col items-center">
            <h3 className="text-sm font-bold text-slate-200 uppercase font-mono tracking-wider mb-2 self-start">
              Verified Technical Radar
            </h3>
            <RadarChart data={candidateData.skillRadar} size={340} />
          </div>

          <div className="md:col-span-6 space-y-4">
            <h3 className="text-sm font-bold text-slate-200 uppercase font-mono tracking-wider">
              Core Competency Breakdown
            </h3>

            {candidateData.skillRadar.map(item => (
              <div key={item.skill} className="p-3.5 rounded-xl bg-slate-900/60 border border-slate-800">
                <div className="flex justify-between text-xs mb-1.5">
                  <span className="font-semibold text-slate-200">{item.skill}</span>
                  <span className="font-mono text-cyan-400 font-semibold">{item.current}%</span>
                </div>
                <div className="w-full bg-slate-950 h-2 rounded-full overflow-hidden">
                  <div className="bg-gradient-to-r from-cyan-500 to-emerald-400 h-full rounded-full" style={{ width: `${item.current}%` }} />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Showcase Repositories */}
        <div className="space-y-4">
          <h3 className="text-sm font-bold text-slate-200 uppercase font-mono tracking-wider flex items-center space-x-2">
            <GithubIcon className="w-4 h-4 text-cyan-400" />
            <span>Production Codebases & Repositories</span>
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {candidateData.github.showcaseRepos.map((repo) => (
              <div key={repo.name} className="glass-panel p-5 rounded-2xl border border-slate-800 flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-bold text-sm text-cyan-300 font-mono">{repo.name}</span>
                    <span className="flex items-center text-xs text-amber-400 font-mono">
                      <Star className="w-3.5 h-3.5 mr-1 fill-amber-400" />
                      {repo.stars}
                    </span>
                  </div>
                  <p className="text-xs text-slate-400 leading-relaxed mb-4">{repo.description}</p>
                </div>

                <div className="flex flex-wrap gap-1.5 pt-3 border-t border-slate-800">
                  {repo.techStack.map(t => (
                    <span key={t} className="text-[10px] bg-slate-950 text-slate-400 px-2 py-0.5 rounded font-mono border border-slate-800">
                      {t}
                    </span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Verified Credentials Section */}
        <div className="space-y-4">
          <h3 className="text-sm font-bold text-slate-200 uppercase font-mono tracking-wider flex items-center space-x-2">
            <ShieldCheck className="w-4 h-4 text-emerald-400" />
            <span>Cryptographically Verified Credentials</span>
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {candidateData.certificates.map(cert => (
              <div key={cert.id} className="p-5 rounded-2xl bg-slate-900/70 border border-slate-800 space-y-3">
                <div className="flex items-start justify-between">
                  <div className="flex items-start space-x-3">
                    {cert.filePreview ? (
                      <img src={cert.filePreview} alt={cert.title} className="w-12 h-12 rounded-lg object-cover border border-cyan-500/40 shrink-0" />
                    ) : (
                      <div className="p-2.5 rounded-lg bg-amber-500/10 text-amber-400 shrink-0">
                        <Award className="w-5 h-5" />
                      </div>
                    )}
                    <div>
                      <h4 className="font-bold text-slate-200 text-sm">{cert.title}</h4>
                      <p className="text-xs text-slate-400">{cert.issuer} • Issued {cert.issueDate}</p>
                    </div>
                  </div>
                  <span className="px-2 py-0.5 rounded text-[10px] font-mono bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 shrink-0">
                    Verified
                  </span>
                </div>

                <div className="flex flex-wrap gap-1">
                  {cert.skillsVerified.map(s => (
                    <span key={s} className="text-[9px] bg-slate-950 text-cyan-300 px-1.5 py-0.5 rounded border border-slate-800">
                      {s}
                    </span>
                  ))}
                </div>

                <div className="text-[10px] font-mono text-slate-500 bg-slate-950 p-2 rounded-lg border border-slate-800 truncate flex justify-between">
                  <span>SHA-256: {cert.signatureHash}</span>
                  {cert.fileName && <span className="text-slate-400">{cert.fileName}</span>}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Footer */}
        <div className="text-center py-6 border-t border-slate-800 text-xs text-slate-500">
          Portfolio verified and compiled using AI-Powered Employability Assessment System • Authenticity Protocol 2026
        </div>

      </div>
    </div>
  );
}
