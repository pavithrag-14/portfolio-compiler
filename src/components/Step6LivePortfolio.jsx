import React, { useState } from 'react';
import { 
  Globe, 
  Share2, 
  Download, 
  ExternalLink, 
  CheckCircle2, 
  ShieldCheck, 
  Copy, 
  QrCode, 
  Award, 
  FileText, 
  Code2, 
  Sparkles, 
  Check, 
  Maximize2, 
  Lock, 
  Calendar, 
  Building 
} from 'lucide-react';
import GithubIcon from './GithubIcon';
import confetti from 'canvas-confetti';
import RadarChart from './RadarChart';
import AssessmentGauge from './AssessmentGauge';

export default function Step6LivePortfolio({ 
  candidateData, 
  selectedRole, 
  onOpenAuditModal,
  onOpenLiveView
}) {
  const [copiedLink, setCopiedLink] = useState(false);
  const shareableUrl = `https://student.ai/portfolio/${candidateData.name.toLowerCase().replace(/\s+/g, '-')}-${selectedRole.id}`;

  const triggerCelebration = () => {
    confetti({
      particleCount: 80,
      spread: 70,
      origin: { y: 0.6 }
    });
  };

  const handleCopyLink = () => {
    navigator.clipboard.writeText(shareableUrl);
    setCopiedLink(true);
    triggerCelebration();
    setTimeout(() => setCopiedLink(false), 2500);
  };

  return (
    <div className="space-y-8 animate-fadeIn">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between pb-4 border-b border-slate-800 gap-4">
        <div>
          <div className="flex items-center space-x-2 text-emerald-400 font-mono text-xs uppercase tracking-widest mb-1">
            <Globe className="w-4 h-4 text-emerald-400" />
            <span>Workflow Step 06</span>
          </div>
          <h2 className="text-2xl font-bold text-slate-100 flex items-center space-x-3">
            <span>Generated Live Web Portfolio</span>
          </h2>
          <p className="text-sm text-slate-400 mt-1">
            Tamper-proof, cryptographically signed candidate showcase ready for hiring managers and recruiters.
          </p>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center space-x-3">
          <button
            onClick={onOpenAuditModal}
            className="px-3.5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 text-xs font-semibold flex items-center space-x-2 transition-all"
          >
            <ShieldCheck className="w-4 h-4 text-emerald-400" />
            <span>Recruiter Audit Ledger</span>
          </button>

          <button
            onClick={onOpenLiveView}
            className="px-4 py-2 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 text-white font-bold text-xs flex items-center space-x-2 shadow-lg glow-cyan hover:opacity-95 transition-all"
          >
            <Maximize2 className="w-3.5 h-3.5" />
            <span>Full Live Portfolio View</span>
          </button>
        </div>
      </div>

      {/* Shareable Link Bar matching graphic */}
      <div className="glass-panel p-4 rounded-2xl border border-cyan-500/40 bg-gradient-to-r from-slate-950 via-slate-900 to-slate-950 flex flex-col md:flex-row items-center justify-between gap-4 shadow-xl">
        <div className="flex items-center space-x-3 w-full md:w-auto">
          <div className="p-2.5 rounded-xl bg-cyan-500/10 text-cyan-400 shrink-0">
            <Share2 className="w-5 h-5" />
          </div>
          <div className="truncate">
            <span className="text-[10px] font-mono uppercase text-cyan-400 font-semibold block">Shareable Verified URL</span>
            <div className="font-mono text-xs md:text-sm text-slate-200 font-semibold truncate">
              {shareableUrl}
            </div>
          </div>
        </div>

        <div className="flex items-center space-x-2 w-full md:w-auto shrink-0">
          <button
            onClick={handleCopyLink}
            className="w-full md:w-auto px-4 py-2 rounded-xl bg-cyan-500/20 hover:bg-cyan-500/30 text-cyan-300 border border-cyan-500/40 text-xs font-semibold flex items-center justify-center space-x-1.5 transition-all"
          >
            {copiedLink ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
            <span>{copiedLink ? 'Link Copied!' : 'Copy Link'}</span>
          </button>

          <button
            onClick={() => window.print()}
            className="px-3.5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700 text-xs font-semibold flex items-center justify-center space-x-1.5 transition-all"
            title="Download PDF"
          >
            <Download className="w-3.5 h-3.5" />
            <span>PDF Export</span>
          </button>
        </div>
      </div>

      {/* The Live Portfolio Card Preview (Exact layout inspired by the graphic node 6) */}
      <div className="rounded-2xl border border-slate-800 bg-slate-950/90 shadow-2xl overflow-hidden">
        
        {/* Browser Mockup Header */}
        <div className="bg-slate-900 px-4 py-2.5 border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <div className="w-3 h-3 rounded-full bg-rose-500/80" />
            <div className="w-3 h-3 rounded-full bg-amber-500/80" />
            <div className="w-3 h-3 rounded-full bg-emerald-500/80" />
            <span className="text-[11px] font-mono text-slate-500 ml-2">portfolio-preview.student.ai</span>
          </div>

          <div className="flex items-center space-x-2 text-[11px] font-mono text-slate-400">
            <Lock className="w-3 h-3 text-emerald-400" />
            <span className="text-emerald-400">SSL • SHA-256 Signed</span>
          </div>
        </div>

        {/* Live Content Container */}
        <div className="p-6 md:p-8 space-y-8">
          
          {/* Candidate Profile Bar */}
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 pb-6 border-b border-slate-850">
            <div className="flex items-center space-x-4">
              <div className="relative">
                <img
                  src={candidateData.avatar}
                  alt={candidateData.name}
                  className="w-18 h-18 rounded-2xl object-cover border-2 border-cyan-400 shadow-lg"
                />
                <span className="absolute -bottom-1 -right-1 bg-emerald-500 text-white rounded-full p-1 border-2 border-slate-950 shadow">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                </span>
              </div>

              <div>
                <div className="flex items-center space-x-2">
                  <h3 className="text-2xl font-bold text-slate-100">{candidateData.name}</h3>
                  <span className="inline-flex items-center px-2 py-0.5 rounded text-[11px] font-mono font-semibold bg-emerald-500/10 text-emerald-400 border border-emerald-500/30">
                    <CheckCircle2 className="w-3 h-3 mr-1" /> Verified
                  </span>
                </div>
                <p className="text-cyan-400 font-medium text-sm mt-0.5">{selectedRole.title}</p>
                <p className="text-slate-400 text-xs mt-1">
                  {candidateData.degree} • {candidateData.university} ({candidateData.graduationYear})
                </p>
              </div>
            </div>

            <div className="flex items-center space-x-3">
              <div className="bg-slate-900 border border-slate-800 rounded-xl px-4 py-2.5 text-right font-mono">
                <div className="text-[10px] text-slate-400 uppercase">Employability Score</div>
                <div className="text-xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-emerald-400">
                  {candidateData.employabilityAssessment.overallScore}/100
                </div>
              </div>
            </div>
          </div>

          {/* Dual Column Layout: Left Column = Verified Marksheets & Certificates, Right Column = Spider Radar & Score */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            
            {/* Left 6 Columns: Verified Credentials Grid */}
            <div className="lg:col-span-6 space-y-6">
              
              {/* Verified Documents (Marksheet & Cert) matching graphic */}
              <div>
                <h4 className="text-xs font-mono uppercase tracking-wider text-slate-400 font-semibold mb-3 flex items-center space-x-2">
                  <FileText className="w-4 h-4 text-cyan-400" />
                  <span>Verified Academic & Credential Records</span>
                </h4>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {/* Marksheet Card */}
                  <div className="glass-panel p-4 rounded-xl border border-slate-800 hover:border-cyan-500/30 transition-all space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-slate-200">Official Marksheet</span>
                      <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                    </div>
                    <div className="text-[11px] text-slate-400">
                      <div>GPA: <strong className="text-cyan-300 font-mono">{candidateData.gpa}</strong></div>
                      <div>Transcripts: 5 STEM Semesters</div>
                    </div>
                    <div className="pt-2 border-t border-slate-800 text-[10px] font-mono text-emerald-400 flex items-center space-x-1">
                      <ShieldCheck className="w-3 h-3" />
                      <span>Cryptographically Sealed</span>
                    </div>
                  </div>

                  {/* Dynamic Certificate Cards */}
                  {candidateData.certificates.map((cert) => (
                    <div key={cert.id} className="glass-panel p-4 rounded-xl border border-slate-800 hover:border-cyan-500/30 transition-all space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-bold text-slate-200 truncate pr-1">{cert.title}</span>
                        <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                      </div>
                      <div className="text-[11px] text-slate-400">
                        <div>Issuer: {cert.issuer}</div>
                        <div className="truncate">Skills: {cert.skillsVerified.slice(0, 2).join(', ')}</div>
                      </div>
                      <div className="pt-2 border-t border-slate-800 text-[10px] font-mono text-emerald-400 flex items-center justify-between">
                        <span className="flex items-center space-x-1">
                          <ShieldCheck className="w-3 h-3" />
                          <span>QR Valid</span>
                        </span>
                        <span className="text-slate-500 truncate max-w-[100px]">{cert.issueDate}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* GitHub Repos & LeetCode Performance */}
              <div>
                <h4 className="text-xs font-mono uppercase tracking-wider text-slate-400 font-semibold mb-3 flex items-center space-x-2">
                  <Code2 className="w-4 h-4 text-indigo-400" />
                  <span>Verified Production Repos & Algorithmic Benchmarks</span>
                </h4>

                <div className="space-y-3">
                  {candidateData.github.showcaseRepos.slice(0, 2).map((repo) => (
                    <div key={repo.name} className="p-3.5 bg-slate-900/80 rounded-xl border border-slate-800 space-y-1.5">
                      <div className="flex items-center justify-between">
                        <span className="font-semibold text-xs text-indigo-300 font-mono flex items-center space-x-1.5">
                          <GithubIcon className="w-3.5 h-3.5 text-slate-400" />
                          <span>{repo.name}</span>
                        </span>
                        <span className="text-[10px] bg-indigo-950 text-indigo-300 px-2 py-0.5 rounded border border-indigo-800">
                          ★ {repo.stars} stars
                        </span>
                      </div>
                      <p className="text-[11px] text-slate-400">{repo.description}</p>
                      <div className="flex flex-wrap gap-1 pt-1">
                        {repo.techStack.map(t => (
                          <span key={t} className="text-[9px] bg-slate-950 text-slate-400 px-1.5 py-0.5 rounded border border-slate-800">
                            {t}
                          </span>
                        ))}
                      </div>
                    </div>
                  ))}

                  <div className="p-3 bg-slate-900/60 rounded-xl border border-slate-800 flex items-center justify-between text-xs">
                    <div className="flex items-center space-x-2">
                      <span className="p-1 rounded bg-orange-500/10 text-orange-400 font-mono font-bold text-[10px]">LC</span>
                      <span className="text-slate-300 font-semibold">LeetCode Rating: {candidateData.leetcode.contestRating}</span>
                    </div>
                    <span className="font-mono text-emerald-400 text-[11px]">{candidateData.leetcode.ranking}</span>
                  </div>
                </div>
              </div>

            </div>

            {/* Right 6 Columns: Spider Radar Chart matching graphic */}
            <div className="lg:col-span-6 glass-panel rounded-2xl p-6 border border-cyan-500/30 flex flex-col items-center justify-center relative shadow-xl">
              <div className="w-full flex items-center justify-between mb-2">
                <span className="text-xs font-mono font-bold text-slate-300 uppercase">
                  Verified Skill Radar
                </span>
                <span className="text-[10px] font-mono text-cyan-400">
                  Target: {selectedRole.title}
                </span>
              </div>

              <div className="py-2">
                <RadarChart 
                  data={candidateData.skillRadar} 
                  size={320}
                  showCurrent={true}
                  showTarget={true}
                />
              </div>

              <div className="w-full pt-4 border-t border-slate-800 flex items-center justify-between text-xs font-mono text-slate-400">
                <div className="flex items-center space-x-1.5">
                  <span className="w-2.5 h-2.5 rounded-full bg-cyan-400" />
                  <span className="text-slate-300">Candidate Verified</span>
                </div>
                <div className="flex items-center space-x-1.5">
                  <span className="w-2.5 h-2.5 rounded-full bg-amber-400" />
                  <span className="text-slate-300">Industry Benchmark</span>
                </div>
              </div>
            </div>

          </div>

          {/* Employability Assessment Summary Footer */}
          <div className="pt-6 border-t border-slate-800 flex flex-col md:flex-row items-center justify-between gap-4 text-xs text-slate-400">
            <div className="flex items-center space-x-2">
              <ShieldCheck className="w-4 h-4 text-emerald-400" />
              <span>Certified under AI Ingestion & Employability Protocol v2.4</span>
            </div>
            <div className="font-mono text-[11px] text-slate-500">
              Unique Portfolio ID: <span className="text-slate-300">SHA256:7e91...4fa9</span>
            </div>
          </div>

        </div>

      </div>
    </div>
  );
}
