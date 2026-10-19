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
  Layers,
  ArrowLeft,
  ChevronRight
} from 'lucide-react';
import { GithubIcon } from '../components/SocialIcons';

export default function CodingProfilesView({ onDataChanged, onNavigate }) {
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
      <div className="p-12 text-center text-slate-500 flex flex-col items-center justify-center space-y-3 bg-white border border-slate-200 rounded-2xl shadow-xs">
        <div className="w-8 h-8 border-2 border-blue-600 border-t-transparent rounded-full animate-spin" />
        <span className="text-sm font-medium">Querying developer graph & coding profiles...</span>
      </div>
    );
  }

  const { github = {}, leetcode = {} } = codingData || {};

  return (
    <div className="space-y-6">
      
      {/* Header */}
      <div className="p-6 bg-white border border-slate-200/90 rounded-2xl shadow-xs">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center space-x-2.5 mb-2">
              <span className="px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-blue-50 text-blue-700 border border-blue-200/80">
                Live Developer Profiles
              </span>
              <span className="text-slate-300">•</span>
              <span className="text-xs text-slate-500">
                GitHub Repositories & LeetCode Problem Solved Stats
              </span>
            </div>
            <h1 className="text-xl md:text-2xl font-extrabold text-slate-900 tracking-tight">
              Coding Profiles & Repository Intelligence
            </h1>
            <p className="text-xs md:text-sm text-slate-600 mt-1 max-w-2xl leading-relaxed">
              Connect your public GitHub and LeetCode accounts to provide undeniable proof of code commits, language distribution, algorithms mastery, and contest rankings.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2 shrink-0">
            {onNavigate && (
              <>
                <button
                  type="button"
                  onClick={() => onNavigate('dashboard')}
                  className="px-3.5 py-2.5 rounded-xl bg-slate-50 hover:bg-slate-100 text-slate-700 text-xs font-semibold flex items-center space-x-1.5 transition border border-slate-200 shadow-2xs cursor-pointer"
                >
                  <ArrowLeft className="w-3.5 h-3.5 text-blue-600" />
                  <span>Dashboard</span>
                </button>
                <button
                  type="button"
                  onClick={() => onNavigate('roles')}
                  className="px-3.5 py-2.5 rounded-xl bg-blue-50 hover:bg-blue-100 text-blue-700 border border-blue-200 text-xs font-semibold flex items-center space-x-1.5 transition cursor-pointer shadow-2xs"
                >
                  <span>Next: Target Role</span>
                  <ChevronRight className="w-3.5 h-3.5" />
                </button>
              </>
            )}
          </div>
        </div>

        {/* Feedback alerts */}
        {successMsg && (
          <div className="mt-4 p-3 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs flex flex-wrap items-center justify-between gap-2 shadow-2xs">
            <div className="flex items-center space-x-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
              <span className="font-semibold">{successMsg}</span>
            </div>
            {onNavigate && (
              <button
                type="button"
                onClick={() => onNavigate('roles')}
                className="px-3 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white font-semibold text-xs flex items-center space-x-1.5 transition shadow-xs cursor-pointer"
              >
                <span>Next: Target Role</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </button>
            )}
          </div>
        )}

        {errorMsg && (
          <div className="mt-4 p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-800 text-xs flex items-center space-x-2">
            <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />
            <span className="font-medium">{errorMsg}</span>
          </div>
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        {/* 1. GitHub Integration Section */}
        <div className="p-6 bg-white border border-slate-200/90 rounded-2xl flex flex-col justify-between space-y-5 shadow-xs">
          <div>
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 rounded-xl bg-slate-100 border border-slate-200 flex items-center justify-center text-slate-800 shadow-2xs">
                  <GithubIcon className="w-6 h-6" />
                </div>
                <div>
                  <h2 className="text-base font-bold text-slate-900">GitHub Profile Sync</h2>
                  <p className="text-xs text-slate-500">Public repositories, languages & activity</p>
                </div>
              </div>
              <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                github.connected 
                  ? 'bg-emerald-50 text-emerald-700 border border-emerald-200' 
                  : 'bg-slate-100 text-slate-600 border border-slate-200'
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
                className="flex-1 bg-white border border-slate-300 focus:border-blue-600 focus:ring-2 focus:ring-blue-100 rounded-xl px-3 py-2 text-xs text-slate-900 placeholder:text-slate-400 outline-none"
              />
              <button
                type="submit"
                disabled={syncingGithub}
                className="px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-semibold text-xs flex items-center space-x-1.5 transition disabled:opacity-50 shadow-xs cursor-pointer"
              >
                {syncingGithub ? (
                  <span className="inline-block animate-spin rounded-full h-3.5 w-3.5 border-2 border-white border-t-transparent" />
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
                  <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
                    <span className="text-[10px] text-slate-500 uppercase font-medium">Public Repos</span>
                    <div className="text-lg font-bold text-slate-900">{github.publicRepos || 0}</div>
                  </div>
                  <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
                    <span className="text-[10px] text-slate-500 uppercase font-medium">Total Stars</span>
                    <div className="text-lg font-bold text-amber-700">{github.stars || 0}</div>
                  </div>
                  <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
                    <span className="text-[10px] text-slate-500 uppercase font-medium">Forks</span>
                    <div className="text-lg font-bold text-blue-700">{github.forks || 0}</div>
                  </div>
                </div>

                {/* Languages */}
                {github.topLanguages && github.topLanguages.length > 0 && (
                  <div>
                    <span className="text-xs text-slate-700 font-semibold mb-2 block">Dominant Languages:</span>
                    <div className="flex flex-wrap gap-1.5">
                      {github.topLanguages.map((lang, idx) => (
                        <span key={idx} className="px-2 py-0.5 rounded text-[11px] bg-slate-100 text-slate-700 border border-slate-200 font-medium">
                          {typeof lang === 'string' ? lang : `${lang.name} (${lang.percentage}%)`}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                {/* Repositories preview */}
                {github.repositories && github.repositories.length > 0 && (
                  <div>
                    <span className="text-xs text-slate-700 font-semibold mb-2 block">Highlighted Repositories:</span>
                    <div className="space-y-2 max-h-48 overflow-y-auto pr-1">
                      {github.repositories.slice(0, 4).map((repo, idx) => (
                        <div key={idx} className="p-2.5 bg-slate-50 rounded-xl border border-slate-200 text-xs flex items-center justify-between shadow-2xs">
                          <div className="truncate mr-2">
                            <a 
                              href={repo.url || repo.html_url} 
                              target="_blank" 
                              rel="noreferrer" 
                              className="font-bold text-blue-700 hover:underline truncate block"
                            >
                              {repo.name}
                            </a>
                            <p className="text-[10px] text-slate-500 truncate mt-0.5">{repo.description || 'No description provided'}</p>
                          </div>
                          <div className="flex items-center space-x-2 text-[10px] text-slate-500 shrink-0 font-mono">
                            <span className="text-amber-700 flex items-center"><Star className="w-3 h-3 mr-0.5" />{repo.stargazers_count || 0}</span>
                            <span className="font-semibold text-slate-700">{repo.language || 'Code'}</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <div className="p-6 bg-slate-50 rounded-xl border border-dashed border-slate-300 text-center text-xs text-slate-500">
                Connect your GitHub username above to auto-import repositories and calculate code quality scores.
              </div>
            )}
          </div>
        </div>

        {/* 2. LeetCode Integration Section */}
        <div className="p-6 bg-white border border-slate-200/90 rounded-2xl flex flex-col justify-between space-y-5 shadow-xs">
          <div>
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 rounded-xl bg-amber-50 text-amber-700 border border-amber-200 flex items-center justify-center shadow-2xs">
                  <Code2 className="w-6 h-6" />
                </div>
                <div>
                  <h2 className="text-base font-bold text-slate-900">LeetCode Competitive Profile</h2>
                  <p className="text-xs text-slate-500">DSA problems solved, ranking & contest rating</p>
                </div>
              </div>
              <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                leetcode.connected 
                  ? 'bg-emerald-50 text-emerald-700 border border-emerald-200' 
                  : 'bg-slate-100 text-slate-600 border border-slate-200'
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
                className="flex-1 bg-white border border-slate-300 focus:border-blue-600 focus:ring-2 focus:ring-blue-100 rounded-xl px-3 py-2 text-xs text-slate-900 placeholder:text-slate-400 outline-none"
              />
              <button
                type="submit"
                disabled={syncingLeetcode}
                className="px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-semibold text-xs flex items-center space-x-1.5 transition disabled:opacity-50 shadow-xs cursor-pointer"
              >
                {syncingLeetcode ? (
                  <span className="inline-block animate-spin rounded-full h-3.5 w-3.5 border-2 border-white border-t-transparent" />
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
                <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 flex items-center justify-between">
                  <div>
                    <span className="text-[10px] text-slate-500 uppercase font-medium block">Total Solved</span>
                    <span className="text-2xl font-black text-amber-700 font-mono">{leetcode.totalSolved || 0}</span>
                  </div>
                  <div className="text-right">
                    <span className="text-[10px] text-slate-500 uppercase font-medium block">Contest Rating / Ranking</span>
                    <span className="text-base font-bold text-slate-900 font-mono">
                      {leetcode.contestRating ? `${leetcode.contestRating} (#${leetcode.ranking || '—'})` : 'Unrated'}
                    </span>
                  </div>
                </div>

                {/* Difficulty Breakdown */}
                <div className="grid grid-cols-3 gap-2 text-center text-xs">
                  <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-xl">
                    <span className="text-emerald-800 font-bold block">Easy</span>
                    <span className="text-lg font-black text-emerald-700 font-mono">{leetcode.easySolved || 0}</span>
                  </div>
                  <div className="p-3 bg-amber-50 border border-amber-200 rounded-xl">
                    <span className="text-amber-800 font-bold block">Medium</span>
                    <span className="text-lg font-black text-amber-700 font-mono">{leetcode.mediumSolved || 0}</span>
                  </div>
                  <div className="p-3 bg-rose-50 border border-rose-200 rounded-xl">
                    <span className="text-rose-800 font-bold block">Hard</span>
                    <span className="text-lg font-black text-rose-700 font-mono">{leetcode.hardSolved || 0}</span>
                  </div>
                </div>

                {/* Additional metrics */}
                <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 text-xs text-slate-600 space-y-1">
                  <div className="flex justify-between">
                    <span>Acceptance Rate:</span>
                    <span className="text-slate-900 font-mono font-semibold">{leetcode.acceptanceRate || 'N/A'}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Active Streak / Badges:</span>
                    <span className="text-blue-700 font-semibold">{leetcode.badges?.length || 0} Badges Earned</span>
                  </div>
                </div>
              </div>
            ) : (
              <div className="p-6 bg-slate-50 rounded-xl border border-dashed border-slate-300 text-center text-xs text-slate-500">
                Enter your LeetCode username to verify algorithmic problem solving skills and contest percentiles.
              </div>
            )}
          </div>
        </div>

      </div>

      {/* Workflow Navigation Footer */}
      <div className="p-5 bg-white border border-slate-200/90 rounded-2xl flex flex-col sm:flex-row items-center justify-between gap-4 shadow-xs">
        <div>
          <span className="text-[10px] font-mono uppercase tracking-wider text-blue-600 font-bold">Step 5 of 10 Completed</span>
          <h4 className="text-sm font-bold text-slate-900">Ready to choose your target engineering role?</h4>
          <p className="text-xs text-slate-600">Proceed to Step 6 to select your desired career benchmark from 11 specialized engineering roles.</p>
        </div>
        {onNavigate && (
          <button
            type="button"
            onClick={() => onNavigate('roles')}
            className="px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-semibold text-xs flex items-center space-x-2 transition shadow-xs shrink-0 cursor-pointer"
          >
            <span>Proceed to Step 6: Target Role</span>
            <ChevronRight className="w-4 h-4" />
          </button>
        )}
      </div>

    </div>
  );
}
