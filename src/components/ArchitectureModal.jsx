import React from 'react';
import { 
  X, 
  Workflow, 
  FileSpreadsheet, 
  ShieldCheck, 
  Compass, 
  HelpCircle, 
  Mic, 
  Globe, 
  CheckCircle2, 
  ArrowDown, 
  Cpu 
} from 'lucide-react';

const ARCH_STEPS = [
  {
    num: "1",
    title: "Multi-Platform Input & Target Role",
    desc: "Ingests Marksheets (grades & GPA), Certificates, GitHub repositories (commits, AST velocity), LeetCode stats, and maps them to a selected Target Role (Data Scientist, ML Engineer, etc.) via AI Ingestion.",
    icon: FileSpreadsheet,
    color: "from-blue-500 to-cyan-500",
    badge: "Input Layer"
  },
  {
    num: "2",
    title: "Automated Verification Engine",
    desc: "Executes QR Code Scanning, Certificate Validation against official digital registry APIs, and deep Coding Scrapers to verify original non-plagiarized codebases.",
    icon: ShieldCheck,
    color: "from-cyan-500 to-emerald-500",
    badge: "Trust & Anti-Fraud"
  },
  {
    num: "3",
    title: "Skill Gap & Suggested Skills Engine",
    desc: "Calculates multidimensional skill vector against target role requirements, generating an interactive Spider/Radar Chart and pinpointing specific Missing Skills with bridge milestones.",
    icon: Compass,
    color: "from-emerald-500 to-sky-500",
    badge: "Analytics Engine"
  },
  {
    num: "4",
    title: "Adaptive MCQ Testing & Assessment Score",
    desc: "Serves adaptive quizzes tailored to missing competencies, dynamically calibrating the 0-100 Employability Score Gauge (Speedometer) in real time.",
    icon: HelpCircle,
    color: "from-sky-500 to-indigo-500",
    badge: "Evaluation Engine"
  },
  {
    num: "5",
    title: "AI Real-Time Mock Interviewer",
    desc: "Voice and audio AI mock interview simulation with speech-to-text, animated acoustic waveforms, speaking pace (WPM), filler-word detection, and technical depth scoring.",
    icon: Mic,
    color: "from-indigo-500 to-purple-500",
    badge: "Behavioral & Technical"
  },
  {
    num: "6",
    title: "Generated Live Web Portfolio",
    desc: "Compiles a shareable, cryptographically signed live web portfolio hosted at student.ai/portfolio with verified credentials, live skill radar, and recruiter audit ledgers.",
    icon: Globe,
    color: "from-purple-500 to-cyan-500",
    badge: "Deployment Layer"
  }
];

export default function ArchitectureModal({ isOpen, onClose }) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/85 backdrop-blur-md animate-fadeIn">
      <div className="relative w-full max-w-4xl glass-panel rounded-3xl border border-cyan-500/40 p-6 md:p-8 shadow-2xl max-h-[90vh] overflow-y-auto space-y-6">
        
        {/* Header */}
        <div className="flex items-start justify-between border-b border-slate-800 pb-4">
          <div className="flex items-center space-x-3">
            <div className="p-3 rounded-2xl bg-cyan-500/10 text-cyan-400 border border-cyan-500/30">
              <Workflow className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <span className="text-[10px] font-mono uppercase bg-cyan-950 text-cyan-400 px-2 py-0.5 rounded border border-cyan-800 font-semibold">
                  WORKFLOW SPECIFICATION
                </span>
                <span className="text-xs text-slate-400 font-mono">End-to-End Pipeline</span>
              </div>
              <h3 className="text-xl font-bold text-slate-100 mt-0.5">
                AI-Powered Portfolio Compiler & Employability System Architecture
              </h3>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-400 hover:text-slate-200 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Steps List */}
        <div className="space-y-4">
          {ARCH_STEPS.map((s, idx) => {
            const Icon = s.icon;
            return (
              <div key={s.num} className="relative">
                <div className="p-4 rounded-2xl bg-slate-900/70 border border-slate-800 hover:border-cyan-500/30 transition-all flex items-start space-x-4">
                  <div className={`w-10 h-10 rounded-xl bg-gradient-to-tr ${s.color} text-slate-950 flex items-center justify-center font-black shrink-0 shadow-md`}>
                    <Icon className="w-5 h-5" />
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="flex flex-wrap items-center justify-between gap-2">
                      <h4 className="text-sm font-bold text-slate-100 flex items-center space-x-2">
                        <span className="text-cyan-400 font-mono">Step {s.num}:</span>
                        <span>{s.title}</span>
                      </h4>
                      <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-slate-950 text-slate-400 border border-slate-800">
                        {s.badge}
                      </span>
                    </div>
                    <p className="text-xs text-slate-400 mt-1 leading-relaxed">
                      {s.desc}
                    </p>
                  </div>
                </div>

                {idx < ARCH_STEPS.length - 1 && (
                  <div className="flex justify-center my-1">
                    <ArrowDown className="w-4 h-4 text-cyan-500/40" />
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* Footer */}
        <div className="pt-4 border-t border-slate-800 flex items-center justify-between">
          <span className="text-xs text-slate-500 font-mono">
            Fully implemented and interactive in this application.
          </span>
          <button
            onClick={onClose}
            className="px-5 py-2 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 text-xs font-bold transition-colors"
          >
            Close Overview
          </button>
        </div>

      </div>
    </div>
  );
}
