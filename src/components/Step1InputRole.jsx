import React, { useState } from 'react';
import { 
  FileText, 
  Award, 
  Code2, 
  Target, 
  Cpu, 
  Sparkles, 
  CheckCircle2, 
  UploadCloud, 
  RefreshCw,
  ExternalLink,
  ChevronDown
} from 'lucide-react';
import GithubIcon from './GithubIcon';
import { TARGET_ROLES } from '../data/mockData';

export default function Step1InputRole({
  candidateData,
  setCandidateData,
  selectedRole,
  setSelectedRole,
  onRunIngestion,
  isIngesting,
  ingestionComplete,
  onOpenCertModal,
  onOpenMarksheetModal
}) {
  const [githubUser, setGithubUser] = useState(candidateData.github.username);
  const [leetcodeUser, setLeetcodeUser] = useState(candidateData.leetcode.username);
  const [fetchingGithub, setFetchingGithub] = useState(false);
  const [scrapingLeetcode, setScrapingLeetcode] = useState(false);
  const [uploadNotice, setUploadNotice] = useState(null);

  const handleFetchGithub = () => {
    setFetchingGithub(true);
    setTimeout(() => {
      setFetchingGithub(false);
      setUploadNotice("GitHub Repositories successfully synchronized!");
      setTimeout(() => setUploadNotice(null), 3000);
    }, 1200);
  };

  const handleScrapeLeetcode = () => {
    setScrapingLeetcode(true);
    setTimeout(() => {
      setScrapingLeetcode(false);
      setUploadNotice("LeetCode contest metrics and stats extracted!");
      setTimeout(() => setUploadNotice(null), 3000);
    }, 1200);
  };

  const handleSimulateUpload = (type) => {
    setUploadNotice(`Processing and extracting metadata from ${type}...`);
    setTimeout(() => {
      setUploadNotice(`Verified: ${type} OCR parser extracted tabular course grades & cryptographic stamp.`);
      setTimeout(() => setUploadNotice(null), 3500);
    }, 1000);
  };

  return (
    <div className="space-y-8 animate-fadeIn">
      {/* Step Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between pb-4 border-b border-slate-800 gap-4">
        <div>
          <div className="flex items-center space-x-2 text-cyan-400 font-mono text-xs uppercase tracking-widest mb-1">
            <span className="w-2 h-2 rounded-full bg-cyan-400 animate-ping" />
            <span>Workflow Step 01</span>
          </div>
          <h2 className="text-2xl font-bold text-slate-100 flex items-center space-x-3">
            <span>Multi-Platform Input & Target Role</span>
          </h2>
          <p className="text-sm text-slate-400 mt-1">
            Ingest academic transcripts, professional certifications, repository commits, and competitive coding metrics.
          </p>
        </div>

        {/* Target Role Selector dropdown matching diagram */}
        <div className="glass-panel p-3 rounded-xl border border-cyan-500/30 flex items-center space-x-3">
          <div className="p-2 rounded-lg bg-cyan-500/10 text-cyan-400">
            <Target className="w-5 h-5" />
          </div>
          <div>
            <label className="text-[11px] font-mono text-cyan-400 font-semibold uppercase block">
              Target Role Selector
            </label>
            <select
              value={selectedRole.id}
              onChange={(e) => {
                const role = TARGET_ROLES.find(r => r.id === e.target.value);
                if (role) setSelectedRole(role);
              }}
              className="bg-slate-900 text-slate-100 font-semibold text-sm rounded-lg px-2.5 py-1.5 border border-slate-700 focus:outline-none focus:border-cyan-400 cursor-pointer"
            >
              {TARGET_ROLES.map((role) => (
                <option key={role.id} value={role.id}>
                  {role.title}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {uploadNotice && (
        <div className="bg-cyan-950/80 border border-cyan-500/50 text-cyan-200 px-4 py-2.5 rounded-xl text-xs font-mono flex items-center space-x-2 shadow-lg animate-pulse">
          <Sparkles className="w-4 h-4 text-cyan-400 shrink-0" />
          <span>{uploadNotice}</span>
        </div>
      )}

      {/* Grid of 4 Ingestion Inputs */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
        
        {/* 1. Marksheet Box */}
        <div className="glass-panel rounded-2xl p-5 border border-slate-800 hover:border-cyan-500/40 transition-all duration-300 flex flex-col justify-between group">
          <div>
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center space-x-2.5">
                <div className="p-2.5 rounded-xl bg-blue-500/10 text-blue-400 group-hover:scale-105 transition-transform">
                  <FileText className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-bold text-slate-200 text-sm">Marksheet</h3>
                  <span className="text-[11px] text-emerald-400 font-mono">Grades & GPA</span>
                </div>
              </div>
              <span className="inline-flex items-center px-2 py-0.5 rounded-md text-[10px] font-mono bg-emerald-500/10 text-emerald-400 border border-emerald-500/30">
                <CheckCircle2 className="w-3 h-3 mr-1" /> Verified
              </span>
            </div>

            {/* Academic extracted summary */}
            <div className="bg-slate-950/60 rounded-xl p-3 border border-slate-800/80 mb-3 space-y-2">
              <div className="flex justify-between items-center text-xs">
                <span className="text-slate-400">Cumulative GPA:</span>
                <span className="font-mono font-bold text-cyan-300">{candidateData.gpa}</span>
              </div>
              <div className="flex justify-between items-center text-xs">
                <span className="text-slate-400">Core Courses:</span>
                <span className="font-mono text-slate-300">5 Transcripts</span>
              </div>
              <div className="pt-1.5 border-t border-slate-800/80 flex items-center justify-between text-[11px]">
                <span className="text-slate-400">Top Grades:</span>
                <div className="flex space-x-1">
                  <span className="bg-blue-900/60 text-blue-300 px-1.5 rounded font-mono text-[10px]">DSA: A+</span>
                  <span className="bg-purple-900/60 text-purple-300 px-1.5 rounded font-mono text-[10px]">ML: A</span>
                </div>
              </div>
            </div>
          </div>

          <button
            onClick={onOpenMarksheetModal}
            className="w-full mt-2 py-2 px-3 rounded-xl bg-blue-600/20 hover:bg-blue-600/30 border border-blue-500/40 text-blue-200 text-xs font-semibold flex items-center justify-center space-x-2 transition-all cursor-pointer shadow-sm"
          >
            <UploadCloud className="w-4 h-4 text-cyan-400" />
            <span>Upload Marksheet (PDF / Scan)</span>
          </button>
        </div>

        {/* 2. Certificate Box */}
        <div className="glass-panel rounded-2xl p-5 border border-slate-800 hover:border-cyan-500/40 transition-all duration-300 flex flex-col justify-between group">
          <div>
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center space-x-2.5">
                <div className="p-2.5 rounded-xl bg-amber-500/10 text-amber-400 group-hover:scale-105 transition-transform">
                  <Award className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-bold text-slate-200 text-sm">Certificates</h3>
                  <span className="text-[11px] text-amber-400 font-mono">Verified Credentials</span>
                </div>
              </div>
              <span className="inline-flex items-center px-2 py-0.5 rounded-md text-[10px] font-mono bg-emerald-500/10 text-emerald-400 border border-emerald-500/30">
                <CheckCircle2 className="w-3 h-3 mr-1" /> {candidateData.certificates.length} Active
              </span>
            </div>

            <div className="bg-slate-950/60 rounded-xl p-3 border border-slate-800/80 mb-3 space-y-2 max-h-36 overflow-y-auto">
              {candidateData.certificates.slice(0, 3).map((cert, idx) => (
                <div key={cert.id || idx} className={`${idx > 0 ? 'pt-1.5 border-t border-slate-800/80' : ''} text-xs`}>
                  <div className="flex items-center justify-between">
                    <p className="font-semibold text-slate-200 truncate">{cert.title}</p>
                    <CheckCircle2 className="w-3 h-3 text-emerald-400 shrink-0 ml-1" />
                  </div>
                  <p className="text-[10px] text-slate-400 truncate">{cert.issuer} • {cert.issueDate}</p>
                </div>
              ))}
              {candidateData.certificates.length > 3 && (
                <div className="text-[10px] text-cyan-400 font-mono text-center pt-1">
                  +{candidateData.certificates.length - 3} more certificates
                </div>
              )}
            </div>
          </div>

          <button
            onClick={onOpenCertModal}
            className="w-full mt-2 py-2 px-3 rounded-xl bg-amber-500/20 hover:bg-amber-500/30 border border-amber-500/40 text-amber-200 text-xs font-semibold flex items-center justify-center space-x-2 transition-all cursor-pointer shadow-sm glow-teal"
          >
            <UploadCloud className="w-4 h-4 text-amber-400" />
            <span>Upload Certificate (PDF / Image)</span>
          </button>
        </div>

        {/* 3. GitHub Box */}
        <div className="glass-panel rounded-2xl p-5 border border-slate-800 hover:border-cyan-500/40 transition-all duration-300 flex flex-col justify-between group">
          <div>
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center space-x-2.5">
                <div className="p-2.5 rounded-xl bg-indigo-500/10 text-indigo-400 group-hover:scale-105 transition-transform">
                  <GithubIcon className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-bold text-slate-200 text-sm">GitHub</h3>
                  <span className="text-[11px] text-indigo-400 font-mono">Fetch Repos</span>
                </div>
              </div>
              <span className="inline-flex items-center px-2 py-0.5 rounded-md text-[10px] font-mono bg-indigo-500/10 text-indigo-300 border border-indigo-500/30">
                {candidateData.github.totalRepos} Repos
              </span>
            </div>

            <div className="space-y-2 mb-3">
              <div className="flex items-center space-x-2">
                <input
                  type="text"
                  value={githubUser}
                  onChange={(e) => setGithubUser(e.target.value)}
                  placeholder="github username"
                  className="w-full bg-slate-950/80 border border-slate-800 rounded-lg px-2.5 py-1.5 text-xs text-slate-200 font-mono focus:outline-none focus:border-indigo-500"
                />
              </div>

              <div className="bg-slate-950/60 rounded-xl p-2.5 border border-slate-800/80 space-y-1 text-xs">
                <div className="flex justify-between text-slate-400 text-[11px]">
                  <span>Annual Commits:</span>
                  <span className="font-mono text-indigo-300 font-semibold">{candidateData.github.totalCommitsLastYear}</span>
                </div>
                <div className="flex justify-between text-slate-400 text-[11px]">
                  <span>Originality Score:</span>
                  <span className="font-mono text-emerald-400 font-semibold">{candidateData.github.originalityScore}</span>
                </div>
              </div>
            </div>
          </div>

          <button
            onClick={handleFetchGithub}
            disabled={fetchingGithub}
            className="w-full mt-2 py-2 px-3 rounded-xl bg-indigo-600/20 hover:bg-indigo-600/30 border border-indigo-500/40 text-indigo-200 text-xs font-semibold flex items-center justify-center space-x-2 transition-all disabled:opacity-50"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${fetchingGithub ? 'animate-spin' : ''}`} />
            <span>{fetchingGithub ? 'Syncing Repos...' : 'Fetch Repos'}</span>
          </button>
        </div>

        {/* 4. LeetCode Box */}
        <div className="glass-panel rounded-2xl p-5 border border-slate-800 hover:border-cyan-500/40 transition-all duration-300 flex flex-col justify-between group">
          <div>
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center space-x-2.5">
                <div className="p-2.5 rounded-xl bg-orange-500/10 text-orange-400 group-hover:scale-105 transition-transform">
                  <Code2 className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-bold text-slate-200 text-sm">LeetCode</h3>
                  <span className="text-[11px] text-orange-400 font-mono">Scrape Stats</span>
                </div>
              </div>
              <span className="inline-flex items-center px-2 py-0.5 rounded-md text-[10px] font-mono bg-orange-500/10 text-orange-300 border border-orange-500/30">
                {candidateData.leetcode.ranking}
              </span>
            </div>

            <div className="space-y-2 mb-3">
              <div className="flex items-center space-x-2">
                <input
                  type="text"
                  value={leetcodeUser}
                  onChange={(e) => setLeetcodeUser(e.target.value)}
                  placeholder="leetcode username"
                  className="w-full bg-slate-950/80 border border-slate-800 rounded-lg px-2.5 py-1.5 text-xs text-slate-200 font-mono focus:outline-none focus:border-orange-500"
                />
              </div>

              <div className="bg-slate-950/60 rounded-xl p-2.5 border border-slate-800/80 space-y-1.5 text-xs">
                <div className="flex justify-between items-center text-[11px]">
                  <span className="text-slate-400">Total Solved:</span>
                  <span className="font-mono font-bold text-orange-300">{candidateData.leetcode.totalSolved}</span>
                </div>
                <div className="flex space-x-1.5 text-[10px] font-mono">
                  <span className="bg-emerald-950/60 text-emerald-400 px-1.5 py-0.5 rounded border border-emerald-800/40">E: {candidateData.leetcode.easy}</span>
                  <span className="bg-amber-950/60 text-amber-400 px-1.5 py-0.5 rounded border border-amber-800/40">M: {candidateData.leetcode.medium}</span>
                  <span className="bg-rose-950/60 text-rose-400 px-1.5 py-0.5 rounded border border-rose-800/40">H: {candidateData.leetcode.hard}</span>
                </div>
              </div>
            </div>
          </div>

          <button
            onClick={handleScrapeLeetcode}
            disabled={scrapingLeetcode}
            className="w-full mt-2 py-2 px-3 rounded-xl bg-orange-600/20 hover:bg-orange-600/30 border border-orange-500/40 text-orange-200 text-xs font-semibold flex items-center justify-center space-x-2 transition-all disabled:opacity-50"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${scrapingLeetcode ? 'animate-spin' : ''}`} />
            <span>{scrapingLeetcode ? 'Scraping Stats...' : 'Scrape Stats'}</span>
          </button>
        </div>

      </div>

      {/* Central AI INGESTION Execution Card matching diagram */}
      <div className="relative overflow-hidden rounded-2xl border border-cyan-500/30 bg-gradient-to-r from-slate-950 via-slate-900 to-slate-950 p-6 shadow-2xl flex flex-col md:flex-row items-center justify-between gap-6">
        <div className="flex items-center space-x-5">
          <div className="relative">
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-cyan-500 to-blue-600 flex items-center justify-center text-white shadow-lg glow-cyan">
              <Cpu className={`w-8 h-8 ${isIngesting ? 'animate-spin text-cyan-200' : 'animate-pulse'}`} />
            </div>
            {ingestionComplete && (
              <span className="absolute -top-1 -right-1 w-5 h-5 bg-emerald-500 rounded-full border-2 border-slate-900 flex items-center justify-center">
                <CheckCircle2 className="w-3.5 h-3.5 text-white" />
              </span>
            )}
          </div>

          <div>
            <div className="flex items-center space-x-2">
              <span className="font-mono text-xs uppercase text-cyan-400 font-bold tracking-wider">AI INGESTION PIPELINE</span>
              <span className="text-[10px] bg-cyan-950 text-cyan-300 px-2 py-0.5 rounded-full border border-cyan-800">
                Target: {selectedRole.title}
              </span>
            </div>
            <h3 className="text-xl font-bold text-slate-100 mt-1">Unified Multi-Modal Semantic Ingestion</h3>
            <p className="text-xs text-slate-400 max-w-xl mt-1">
              Fuses grade transcripts, certificate credentials, GitHub AST commit velocity, and LeetCode algorithmic benchmarks into a unified candidate knowledge graph.
            </p>
          </div>
        </div>

        <div className="flex items-center space-x-3 w-full md:w-auto">
          <button
            onClick={onRunIngestion}
            disabled={isIngesting}
            className={`w-full md:w-auto px-7 py-3.5 rounded-xl font-bold text-sm tracking-wide transition-all duration-300 flex items-center justify-center space-x-2.5 shadow-xl ${
              isIngesting
                ? 'bg-slate-800 text-slate-400 cursor-not-allowed border border-slate-700'
                : 'bg-gradient-to-r from-cyan-500 via-sky-500 to-blue-600 text-white hover:opacity-95 hover:shadow-cyan-500/25 glow-cyan'
            }`}
          >
            <Sparkles className={`w-4 h-4 ${isIngesting ? 'animate-spin' : ''}`} />
            <span>{isIngesting ? 'AI Ingestion in Progress...' : 'RUN AI INGESTION'}</span>
          </button>
        </div>
      </div>
    </div>
  );
}
