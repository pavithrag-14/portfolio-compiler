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
      <div className="flex items-center space-x-1 p-1.5 bg-slate-100/90 border border-slate-200/90 rounded-2xl min-w-max shadow-2xs">
        {TABS.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;

          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`px-3 py-2 rounded-xl text-xs flex items-center space-x-2 transition-all shrink-0 cursor-pointer ${
                isActive
                  ? 'bg-white text-blue-700 font-bold shadow-xs border border-slate-200/80 scale-[1.01]'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-white/60 font-medium'
              }`}
            >
              <Icon className={`w-3.5 h-3.5 shrink-0 ${isActive ? 'text-blue-600' : 'text-slate-400'}`} />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
