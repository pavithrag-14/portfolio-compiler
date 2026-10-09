import React from 'react';
import { useAuth } from '../context/AuthContext';
import { 
  Sparkles, 
  Workflow, 
  ShieldCheck, 
  UserCheck, 
  LogOut, 
  LogIn, 
  Globe, 
  Award,
  Layers,
  FileCheck2,
  User,
  SlidersHorizontal
} from 'lucide-react';

export default function Header({ 
  activeTab, 
  setActiveTab, 
  onOpenAuthModal, 
  onOpenDiagramModal, 
  onOpenAuditModal 
}) {
  const { user, profile, isLoggedIn, logout } = useAuth();

  return (
    <header className="sticky top-0 z-40 bg-[#070b14]/90 backdrop-blur-xl border-b border-cyan-500/15 px-4 lg:px-8 py-3">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-3">
        
        {/* Brand & Platform Identity */}
        <div className="flex items-center space-x-3 cursor-pointer" onClick={() => setActiveTab('dashboard')}>
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-cyan-500 via-sky-400 to-blue-600 flex items-center justify-center text-slate-950 font-black shadow-lg glow-cyan shrink-0">
            <Sparkles className="w-5 h-5 text-slate-950" />
          </div>

          <div>
            <div className="flex items-center space-x-2">
              <h1 className="text-sm md:text-base font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-slate-100 via-cyan-100 to-sky-300 tracking-tight">
                Portfolio Compiler
              </h1>
              <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-cyan-500/10 text-cyan-400 border border-cyan-500/30 font-mono">
                AI Employability Platform
              </span>
            </div>
            <p className="text-[10px] text-slate-400 font-mono">
              Academic Verification • 50-MCQ Topic Tests • AI Mock Interview • Live Shareable Portfolio
            </p>
          </div>
        </div>

        {/* Right Tools & Authentication Profile */}
        <div className="flex flex-wrap items-center space-x-2">
          
          {/* Architecture Diagram modal trigger */}
          <button
            onClick={onOpenDiagramModal}
            className="px-3 py-1.5 rounded-lg bg-slate-900 hover:bg-slate-800 text-slate-300 border border-slate-700 text-xs font-semibold flex items-center space-x-1.5 transition"
            title="System Architecture Diagram"
          >
            <Workflow className="w-3.5 h-3.5 text-cyan-400" />
            <span className="hidden sm:inline">System Flow</span>
          </button>

          {/* Recruiter Audit modal trigger */}
          <button
            onClick={onOpenAuditModal}
            className="px-3 py-1.5 rounded-lg bg-slate-900 hover:bg-slate-800 text-slate-300 border border-slate-700 text-xs font-semibold flex items-center space-x-1.5 transition"
            title="Recruiter Verification Audit"
          >
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
            <span className="hidden sm:inline">Recruiter Audit</span>
          </button>

          {/* Jump to Live Portfolio */}
          <button
            onClick={() => setActiveTab('portfolio')}
            className="px-3.5 py-1.5 rounded-lg bg-cyan-950/60 hover:bg-cyan-900/60 text-cyan-300 border border-cyan-500/40 text-xs font-semibold flex items-center space-x-1.5 transition shadow-sm"
          >
            <Globe className="w-3.5 h-3.5 text-cyan-400" />
            <span>Live Portfolio</span>
          </button>

          {/* User Session Auth Button */}
          {isLoggedIn ? (
            <div className="flex items-center space-x-2 pl-2 border-l border-slate-800">
              <div 
                onClick={() => setActiveTab('profile')}
                className="flex items-center space-x-1.5 px-2.5 py-1 rounded-lg bg-slate-900 border border-slate-700 text-xs text-slate-200 cursor-pointer hover:border-cyan-500/50 transition"
              >
                <User className="w-3.5 h-3.5 text-cyan-400" />
                <span className="font-semibold max-w-[120px] truncate">
                  {profile?.fullName || user?.email?.split('@')[0] || 'Student'}
                </span>
              </div>

              <button
                onClick={logout}
                className="p-1.5 rounded-lg text-slate-400 hover:text-red-400 hover:bg-slate-900 transition"
                title="Log Out"
              >
                <LogOut className="w-4 h-4" />
              </button>
            </div>
          ) : (
            <button
              onClick={onOpenAuthModal}
              className="px-3.5 py-1.5 rounded-lg bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-slate-950 font-bold text-xs flex items-center space-x-1.5 transition shadow-md glow-cyan"
            >
              <LogIn className="w-3.5 h-3.5" />
              <span>Student Sign-In</span>
            </button>
          )}

        </div>

      </div>
    </header>
  );
}
