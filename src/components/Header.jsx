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
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-slate-200/90 shadow-xs px-4 lg:px-8 py-3">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-3">
        
        {/* Brand & Platform Identity */}
        <div className="flex items-center space-x-3 cursor-pointer group" onClick={() => setActiveTab('dashboard')}>
          <div className="w-10 h-10 rounded-xl bg-blue-600 flex items-center justify-center text-white font-bold shadow-sm shrink-0 group-hover:bg-blue-700 transition">
            <Sparkles className="w-5 h-5 text-white" />
          </div>

          <div>
            <div className="flex items-center space-x-2">
              <h1 className="text-base font-extrabold text-slate-900 tracking-tight">
                Portfolio Compiler
              </h1>
              <span className="px-2 py-0.5 rounded-full text-[11px] font-semibold bg-blue-50 text-blue-700 border border-blue-200/80">
                AI Employability Platform
              </span>
            </div>
            <p className="text-[11px] text-slate-500 font-normal">
              Academic Verification • 50-MCQ Topic Tests • AI Mock Interview • Live Shareable Portfolio
            </p>
          </div>
        </div>

        {/* Right Tools & Authentication Profile */}
        <div className="flex flex-wrap items-center space-x-2">
          
          {/* Architecture Diagram modal trigger */}
          <button
            onClick={onOpenDiagramModal}
            className="px-3 py-1.5 rounded-lg bg-slate-50 hover:bg-slate-100 text-slate-700 border border-slate-200 text-xs font-semibold flex items-center space-x-1.5 transition shadow-2xs cursor-pointer"
            title="System Architecture Diagram"
          >
            <Workflow className="w-3.5 h-3.5 text-blue-600" />
            <span className="hidden sm:inline">System Flow</span>
          </button>

          {/* Recruiter Audit modal trigger */}
          <button
            onClick={onOpenAuditModal}
            className="px-3 py-1.5 rounded-lg bg-emerald-50 hover:bg-emerald-100 text-emerald-800 border border-emerald-200 text-xs font-semibold flex items-center space-x-1.5 transition shadow-2xs cursor-pointer"
            title="Recruiter Verification Audit"
          >
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
            <span className="hidden sm:inline">Recruiter Audit</span>
          </button>

          {/* Jump to Live Portfolio */}
          <button
            onClick={() => setActiveTab('portfolio')}
            className="px-3.5 py-1.5 rounded-lg bg-blue-50 hover:bg-blue-100 text-blue-700 border border-blue-200 text-xs font-semibold flex items-center space-x-1.5 transition shadow-2xs cursor-pointer"
          >
            <Globe className="w-3.5 h-3.5 text-blue-600" />
            <span>Live Portfolio</span>
          </button>

          {/* User Session Auth Button */}
          {isLoggedIn ? (
            <div className="flex items-center space-x-2 pl-2 border-l border-slate-200">
              <div 
                onClick={() => setActiveTab('profile')}
                className="flex items-center space-x-1.5 px-2.5 py-1 rounded-lg bg-slate-50 border border-slate-200 text-xs text-slate-800 cursor-pointer hover:bg-slate-100 transition shadow-2xs"
              >
                <User className="w-3.5 h-3.5 text-blue-600" />
                <span className="font-semibold max-w-[120px] truncate">
                  {profile?.fullName || user?.email?.split('@')[0] || 'Student'}
                </span>
              </div>

              <button
                onClick={logout}
                className="p-1.5 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition"
                title="Log Out"
              >
                <LogOut className="w-4 h-4" />
              </button>
            </div>
          ) : (
            <button
              onClick={onOpenAuthModal}
              className="px-3.5 py-1.5 rounded-lg bg-blue-600 hover:bg-blue-700 text-white font-semibold text-xs flex items-center space-x-1.5 transition shadow-xs cursor-pointer"
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
