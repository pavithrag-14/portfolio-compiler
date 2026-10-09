import React, { useState, useEffect } from 'react';
import { api } from '../api';
import { 
  Code2, 
  ExternalLink, 
  Star, 
  GitFork, 
  CheckCircle2, 
  AlertCircle, 
  RefreshCw, 
  Award, 
  Flame, 
  TrendingUp, 
  Sparkles, 
  Layers 
} from 'lucide-react';
import { GithubIcon } from '../components/SocialIcons';

export default function CodingProfilesView({ onDataChanged }) {
  const [codingData, setCodingData] = useState(null);
  const [loading, setLoading] = useState(true);
  
  // Clean inputs, no fake dummy text
  const [githubInput, setGithubInput] = useState('');
  const [leetcodeInput, setLeetcodeInput] = useState('');
  
  const [syncingGithub, setSyncingGithub] = useState(false);
  const [syncingLeetcode, setSyncingLeetcode] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  useEffect(() => {
    loadCoding();
  }, []);

  const loadCoding = async () => {
    setLoading(true);
    try {
      const data = await api.coding.get();
      setCodingData(data);
      if (data.github?.username) setGithubInput(data.github.username);
      if (data.leetcode?.username) setLeetcodeInput(data.leetcode.username);
    } catch (err) {
      console.error('Failed to load coding profiles:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleSyncGithub = async (e) => {
    e.preventDefault();
    if (!githubInput.trim()) {
      setErrorMsg('Please enter a GitHub username or profile URL.');
      return;
    }

    setSyncingGithub(true);
    setErrorMsg('');
    setSuccessMsg('');

    try {
      const res = await api.coding.fetchGithub(githubInput.trim());
      setSuccessMsg(`Synced GitHub user @${res.username}! Found ${res.publicRepos} public repositories.`);
      await loadCoding();
      if (onDataChanged) onDataChanged();
      setTimeout(() => setSuccessMsg(''), 4000);
    } catch (err) {
      setErrorMsg(err.message || 'GitHub sync failed. Check username and internet connection.');
    } finally {
      setSyncingGithub(false);
    }
  };

  const handleSyncLeetcode = async (e) => {
    e.preventDefault();
    if (!leetcodeInput.trim()) {
      setErrorMsg('Please enter a LeetCode username.');
      return;
    }

    setSyncingLeetcode(true);
    setErrorMsg('');
    setSuccessMsg('');

    try {
      const res = await api.coding.fetchLeetcode(leetcodeInput.trim());
      setSuccessMsg(`Synced LeetCode user @${res.username}! ${res.totalSolved} problems solved.`);
      await loadCoding();
      if (onDataChanged) onDataChanged();
      setTimeout(() => setSuccessMsg(''), 4000);
    } catch (err) {
      setErrorMsg(err.message || 'LeetCode sync failed. Check username and internet connection.');
    } finally {
      setSyncingLeetcode(false);
    }
  };

  if (loading) {
    return (
      <div className="p-12 text-center text-slate-400 flex flex-col items-center justify-center space-y-3">
        <div className="w-8 h-8 border-2 border-purple-400 border-t-transparent rounded-full animate-spin" />
        <span className="text-sm">Querying developer graph & coding profiles...</span>
      </div>
    );
  }

  const { github = {}, leetcode = {} } = codingData || {};

  return (
    <div className="space-y-6">
      
      {/* Header */}
      <div className="p-6 bg-slate-900/80 border border-cyan-500/20 rounded-2xl">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center space-x-2.5 mb-2">
              <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-purple-500/20 text-purple-300 border border-purple-500/40">
                Live Developer Profiles
              </span>
              <span className="text-slate-500">•</span>
              <span className="text-xs text-slate-400">
                GitHub Repositories & LeetCode Problem Solved Stats
              </span>
            </div>
            <h1 className="text-xl md:text-2xl font-black text-slate-100 tracking-tight">
              Coding Profiles & Repository Intelligence
            </h1>
            <p className="text-xs md:text-sm text-slate-400 mt-1 max-w-2xl">
              Connect your public GitHub and LeetCode accounts to provide undeniable proof of code commits, language distribution, algorithms mastery, and contest rankings.
            </p>
          </div>
        </div>

        {/* Feedback alerts */}
        {successMsg && (
          <div className="mt-4 p-3 rounded-xl bg-emerald-950/40 border border-emerald-500/40 text-emerald-200 text-xs flex items-center space-x-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
            <span>{successMsg}</span>
          </div>
        )}

        {errorMsg && (
          <div className="mt-4 p-3 rounded-xl bg-red-950/40 border border-red-500/40 text-red-200 text-xs flex items-center space-x-2">
            <AlertCircle className="w-4 h-4 text-red-400 shrink-0" />
            <span>{errorMsg}</span>
          </div>
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        {/* 1. GitHub Integration Section */}
        <div className="p-6 bg-slate-900/70 border border-slate-800 rounded-2xl flex flex-col justify-between space-y-5">
          <div>
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 rounded-xl bg-slate-800 flex items-center justify-center text-slate-100">
                  <GithubIcon className="w-6 h-6" />
                </div>
                <div>
                  <h2 className="text-base font-bold text-slate-100">GitHub Profile Sync</h2>
                  <p className="text-xs text-slate-400">Public repositories, languages & activity</p>
                </div>
              </div>
              <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                github.connected 
                  ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40' 
                  : 'bg-slate-800 text-slate-400'
              }`}>
                {github.connected ? 'Connected' : 'Offline'}
              </span>
            </div>

            {/* Input form */}
            <form onSubmit={handleSyncGithub} className="flex space-x-2 mb-4">
              <input
                type="text"
                value={githubInput}
                onChange={(e) => setGithubInput(e.target.value)}
                placeholder="Enter GitHub username or URL"
                className="flex-1 bg-slate-950 border border-slate-700 focus:border-cyan-400 rounded-xl px-3 py-2 text-xs text-slate-100 placeholder:text-slate-600 outline-none"
              />
              <button
                type="submit"
                disabled={syncingGithub}
                className="px-4 py-2 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold text-xs flex items-center space-x-1.5 transition disabled:opacity-50"
              >
                {syncingGithub ? (
                  <span className="inline-block animate-spin rounded-full h-3.5 w-3.5 border-2 border-slate-950 border-t-transparent" />
                ) : (
                  <RefreshCw className="w-3.5 h-3.5" />
                )}
                <span>Sync</span>
              </button>
            </form>

            {/* GitHub Stats Card */}
            {github.connected ? (
              <div className="space-y-4">
                <div className="grid grid-cols-3 gap-2 text-center">
                  <div className="p-3 bg-slate-950 rounded-xl border border-slate-800">
                    <span className="text-[10px] text-slate-400 uppercase">Public Repos</span>
                    <div className="text-lg font-bold text-slate-100">{github.publicRepos || 0}</div>
                  </div>
                  <div className="p-3 bg-slate-950 rounded-xl border border-slate-800">
                    <span className="text-[10px] text-slate-400 uppercase">Total Stars</span>
                    <div className="text-lg font-bold text-amber-400">{github.stars || 0}</div>
                  </div>
                  <div className="p-3 bg-slate-950 rounded-xl border border-slate-800">
                    <span className="text-[10px] text-slate-400 uppercase">Forks</span>
                    <div className="text-lg font-bold text-cyan-400">{github.forks || 0}</div>
                  </div>
                </div>

                {/* Languages */}
                {github.topLanguages && github.topLanguages.length > 0 && (
                  <div>
                    <span className="text-xs text-slate-400 font-semibold mb-2 block">Dominant Languages:</span>
                    <div className="flex flex-wrap gap-1.5">
                      {github.topLanguages.map((lang, idx) => (
                        <span key={idx} className="px-2 py-0.5 rounded text-[11px] bg-slate-800 text-slate-200 border border-slate-700">
                          {typeof lang === 'string' ? lang : `${lang.name} (${lang.percentage}%)`}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                {/* Repositories preview */}
                {github.repositories && github.repositories.length > 0 && (
                  <div>
                    <span className="text-xs text-slate-400 font-semibold mb-2 block">Highlighted Repositories:</span>
                    <div className="space-y-2 max-h-48 overflow-y-auto pr-1">
                      {github.repositories.slice(0, 4).map((repo, idx) => (
                        <div key={idx} className="p-2.5 bg-slate-950/80 rounded-xl border border-slate-800/80 text-xs flex items-center justify-between">
                          <div className="truncate mr-2">
                            <a 
                              href={repo.url || repo.html_url} 
                              target="_blank" 
                              rel="noreferrer" 
                              className="font-bold text-cyan-300 hover:underline truncate block"
                            >
                              {repo.name}
                            </a>
                            <p className="text-[10px] text-slate-400 truncate mt-0.5">{repo.description || 'No description provided'}</p>
                          </div>
                          <div className="flex items-center space-x-2 text-[10px] text-slate-400 shrink-0 font-mono">
                            <span className="text-amber-400 flex items-center"><Star className="w-3 h-3 mr-0.5" />{repo.stargazers_count || 0}</span>
                            <span>{repo.language || 'Code'}</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <div className="p-6 bg-slate-950/50 rounded-xl border border-dashed border-slate-800 text-center text-xs text-slate-500">
                Connect your GitHub username above to auto-import repositories and calculate code quality scores.
              </div>
            )}
          </div>
        </div>

        {/* 2. LeetCode Integration Section */}
        <div className="p-6 bg-slate-900/70 border border-slate-800 rounded-2xl flex flex-col justify-between space-y-5">
          <div>
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 rounded-xl bg-amber-500/20 text-amber-400 flex items-center justify-center">
                  <Code2 className="w-6 h-6" />
                </div>
                <div>
                  <h2 className="text-base font-bold text-slate-100">LeetCode Competitive Profile</h2>
                  <p className="text-xs text-slate-400">DSA problems solved, ranking & contest rating</p>
                </div>
              </div>
              <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                leetcode.connected 
                  ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40' 
                  : 'bg-slate-800 text-slate-400'
              }`}>
                {leetcode.connected ? 'Connected' : 'Offline'}
              </span>
            </div>

            {/* Input form */}
            <form onSubmit={handleSyncLeetcode} className="flex space-x-2 mb-4">
              <input
                type="text"
                value={leetcodeInput}
                onChange={(e) => setLeetcodeInput(e.target.value)}
                placeholder="Enter LeetCode username"
                className="flex-1 bg-slate-950 border border-slate-700 focus:border-amber-400 rounded-xl px-3 py-2 text-xs text-slate-100 placeholder:text-slate-600 outline-none"
              />
              <button
                type="submit"
                disabled={syncingLeetcode}
                className="px-4 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs flex items-center space-x-1.5 transition disabled:opacity-50"
              >
                {syncingLeetcode ? (
                  <span className="inline-block animate-spin rounded-full h-3.5 w-3.5 border-2 border-slate-950 border-t-transparent" />
                ) : (
                  <RefreshCw className="w-3.5 h-3.5" />
                )}
                <span>Sync</span>
              </button>
            </form>

            {/* LeetCode Stats Card */}
            {leetcode.connected ? (
              <div className="space-y-4">
                {/* Total Solved Overview */}
                <div className="p-4 bg-slate-950 rounded-xl border border-slate-800 flex items-center justify-between">
                  <div>
                    <span className="text-[10px] text-slate-400 uppercase block">Total Solved</span>
                    <span className="text-2xl font-black text-amber-400 font-mono">{leetcode.totalSolved || 0}</span>
                  </div>
                  <div className="text-right">
                    <span className="text-[10px] text-slate-400 uppercase block">Contest Rating / Ranking</span>
                    <span className="text-base font-bold text-slate-200 font-mono">
                      {leetcode.contestRating ? `${leetcode.contestRating} (#${leetcode.ranking || '—'})` : 'Unrated'}
                    </span>
                  </div>
                </div>

                {/* Difficulty Breakdown */}
                <div className="grid grid-cols-3 gap-2 text-center text-xs">
                  <div className="p-3 bg-emerald-950/20 border border-emerald-500/30 rounded-xl">
                    <span className="text-emerald-400 font-bold block">Easy</span>
                    <span className="text-lg font-black text-emerald-300 font-mono">{leetcode.easySolved || 0}</span>
                  </div>
                  <div className="p-3 bg-amber-950/20 border border-amber-500/30 rounded-xl">
                    <span className="text-amber-400 font-bold block">Medium</span>
                    <span className="text-lg font-black text-amber-300 font-mono">{leetcode.mediumSolved || 0}</span>
                  </div>
                  <div className="p-3 bg-red-950/20 border border-red-500/30 rounded-xl">
                    <span className="text-red-400 font-bold block">Hard</span>
                    <span className="text-lg font-black text-red-300 font-mono">{leetcode.hardSolved || 0}</span>
                  </div>
                </div>

                {/* Additional metrics */}
                <div className="p-3 bg-slate-950 rounded-xl border border-slate-800 text-xs text-slate-400 space-y-1">
                  <div className="flex justify-between">
                    <span>Acceptance Rate:</span>
                    <span className="text-slate-200 font-mono">{leetcode.acceptanceRate || 'N/A'}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Active Streak / Badges:</span>
                    <span className="text-cyan-400 font-semibold">{leetcode.badges?.length || 0} Badges Earned</span>
                  </div>
                </div>
              </div>
            ) : (
              <div className="p-6 bg-slate-950/50 rounded-xl border border-dashed border-slate-800 text-center text-xs text-slate-500">
                Enter your LeetCode username to verify algorithmic problem solving skills and contest percentiles.
              </div>
            )}
          </div>
        </div>

      </div>

    </div>
  );
}
