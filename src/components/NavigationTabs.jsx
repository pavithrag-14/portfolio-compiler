import React from 'react';
import { 
  LayoutDashboard, 
  User, 
  FileCheck2, 
  Award, 
  Layers, 
  Cpu, 
  Code2, 
  Target, 
  FileText, 
  Mic, 
  TrendingUp, 
  Globe, 
  Settings as SettingsIcon 
} from 'lucide-react';

const TABS = [
  { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { id: 'profile', label: 'Profile', icon: User },
  { id: 'academics', label: 'Academic Records', icon: FileCheck2 },
  { id: 'certifications', label: 'Certifications', icon: Award },
  { id: 'projects', label: 'Projects & Skills', icon: Layers },
  { id: 'coding', label: 'Coding Profiles', icon: Code2 },
  { id: 'roles', label: 'Target Role', icon: Target },
  { id: 'assessments', label: 'Assessments', icon: FileText },
  { id: 'interview', label: 'Mock Interview', icon: Mic },
  { id: 'skill-gap', label: 'Skill Gap', icon: TrendingUp },
  { id: 'portfolio', label: 'Portfolio', icon: Globe },
];

export default function NavigationTabs({ activeTab, setActiveTab }) {
  return (
    <div className="w-full overflow-x-auto pb-1 scrollbar-none">
      <div className="flex items-center space-x-1 p-1.5 bg-slate-900/90 border border-slate-800 rounded-2xl min-w-max backdrop-blur-md">
        {TABS.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;

          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`px-3 py-2 rounded-xl text-xs font-semibold flex items-center space-x-2 transition-all shrink-0 ${
                isActive
                  ? 'bg-cyan-500 text-slate-950 font-bold shadow-md glow-cyan scale-[1.02]'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
              }`}
            >
              <Icon className="w-3.5 h-3.5 shrink-0" />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
