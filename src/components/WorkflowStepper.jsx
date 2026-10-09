import React from 'react';
import { 
  FileSpreadsheet, 
  ShieldCheck, 
  Compass, 
  HelpCircle, 
  Mic, 
  Globe, 
  CheckCircle2, 
  ChevronRight 
} from 'lucide-react';

const STEPS = [
  { id: 1, title: '1. Multi-Platform Input', subtitle: 'Marksheet, Certs, GitHub, LeetCode', icon: FileSpreadsheet },
  { id: 2, title: '2. Automated Verification', subtitle: 'QR Scanner & Scrapers', icon: ShieldCheck },
  { id: 3, title: '3. Skill Gap Engine', subtitle: 'Radar Chart & Missing Skills', icon: Compass },
  { id: 4, title: '4. Adaptive MCQ Testing', subtitle: 'Dynamic Quiz & Score Gauge', icon: HelpCircle },
  { id: 5, title: '5. AI Mock Interviewer', subtitle: 'Real-time Speech Analytics', icon: Mic },
  { id: 6, title: '6. Generated Live Portfolio', subtitle: 'Shareable Verified URL', icon: Globe },
];

export default function WorkflowStepper({ currentStep, setStep, maxUnlockedStep }) {
  return (
    <div className="w-full glass-panel rounded-2xl p-3 border border-slate-800 shadow-xl overflow-x-auto">
      <div className="flex items-center justify-between min-w-[780px] gap-2">
        {STEPS.map((step, idx) => {
          const Icon = step.icon;
          const isActive = currentStep === step.id;
          const isCompleted = step.id < currentStep || currentStep === 6;
          const isClickable = true; // allow navigating anytime

          return (
            <React.Fragment key={step.id}>
              <button
                onClick={() => setStep(step.id)}
                className={`flex items-center space-x-3 px-3 py-2 rounded-xl text-left transition-all duration-300 group flex-1 ${
                  isActive
                    ? 'bg-gradient-to-r from-cyan-950/80 to-slate-900 border border-cyan-500/50 text-cyan-300 shadow-lg glow-cyan'
                    : isCompleted
                    ? 'bg-slate-950/50 hover:bg-slate-900/60 border border-slate-800 text-slate-300'
                    : 'bg-slate-950/20 hover:bg-slate-900/40 border border-transparent text-slate-500'
                }`}
              >
                <div
                  className={`w-9 h-9 rounded-lg flex items-center justify-center shrink-0 transition-transform group-hover:scale-105 ${
                    isActive
                      ? 'bg-cyan-500 text-slate-950 font-bold shadow-md'
                      : isCompleted
                      ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                      : 'bg-slate-900 text-slate-600 border border-slate-800'
                  }`}
                >
                  {isCompleted && !isActive ? (
                    <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                  ) : (
                    <Icon className="w-4 h-4" />
                  )}
                </div>

                <div className="min-w-0">
                  <div className="text-xs font-bold truncate flex items-center space-x-1.5">
                    <span>{step.title}</span>
                  </div>
                  <div className="text-[10px] text-slate-400 truncate font-mono">
                    {step.subtitle}
                  </div>
                </div>
              </button>

              {idx < STEPS.length - 1 && (
                <ChevronRight className={`w-4 h-4 shrink-0 ${step.id < currentStep ? 'text-emerald-500/50' : 'text-slate-800'}`} />
              )}
            </React.Fragment>
          );
        })}
      </div>
    </div>
  );
}
