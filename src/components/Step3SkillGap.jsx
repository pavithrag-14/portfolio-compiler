import React, { useState } from 'react';
import { 
  Compass, 
  Layers, 
  ArrowRight, 
  CheckCircle, 
  AlertCircle, 
  Sparkles, 
  TrendingUp, 
  BookOpen, 
  Cpu, 
  Zap,
  PlusCircle,
  Eye,
  EyeOff
} from 'lucide-react';
import RadarChart from './RadarChart';

export default function Step3SkillGap({ candidateData, selectedRole, onProceed, onSkillBoost }) {
  const [showCurrent, setShowCurrent] = useState(true);
  const [showTarget, setShowTarget] = useState(true);
  const [boostedSkills, setBoostedSkills] = useState({});

  // Skill gaps calculation
  const skillGaps = candidateData.skillRadar.map((item) => ({
    skill: item.skill,
    current: item.current,
    target: item.target,
    gap: Math.max(0, item.target - item.current),
    isMet: item.current >= item.target,
  })).sort((a, b) => b.gap - a.gap);

  const handleSimulateSkillBoost = (skillName) => {
    setBoostedSkills(prev => ({
      ...prev,
      [skillName]: true
    }));
    if (onSkillBoost) {
      onSkillBoost(skillName);
    }
  };

  return (
    <div className="space-y-8 animate-fadeIn">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between pb-4 border-b border-slate-800 gap-4">
        <div>
          <div className="flex items-center space-x-2 text-sky-400 font-mono text-xs uppercase tracking-widest mb-1">
            <Compass className="w-4 h-4 text-sky-400" />
            <span>Workflow Step 03</span>
          </div>
          <h2 className="text-2xl font-bold text-slate-100 flex items-center space-x-3">
            <span>Skill Gap & Suggested Skills Engine</span>
          </h2>
          <p className="text-sm text-slate-400 mt-1">
            Multidimensional gap vector comparison against target industry benchmark: <strong className="text-sky-300">{selectedRole.title}</strong>.
          </p>
        </div>

        {/* Legend / Toggles */}
        <div className="flex items-center space-x-3 bg-slate-900/90 border border-slate-800 p-2 rounded-xl text-xs font-mono">
          <button
            onClick={() => setShowCurrent(!showCurrent)}
            className={`flex items-center space-x-2 px-3 py-1.5 rounded-lg border transition-all ${
              showCurrent 
                ? 'bg-cyan-500/20 text-cyan-300 border-cyan-500/40 shadow-sm' 
                : 'text-slate-500 border-transparent hover:text-slate-400'
            }`}
          >
            <span className="w-2.5 h-2.5 rounded-full bg-cyan-400" />
            <span>Current Skills</span>
          </button>

          <button
            onClick={() => setShowTarget(!showTarget)}
            className={`flex items-center space-x-2 px-3 py-1.5 rounded-lg border transition-all ${
              showTarget 
                ? 'bg-amber-500/20 text-amber-300 border-amber-500/40 shadow-sm' 
                : 'text-slate-500 border-transparent hover:text-slate-400'
            }`}
          >
            <span className="w-2.5 h-2.5 rounded-full bg-amber-400" />
            <span>Target Role Requirements</span>
          </button>
        </div>
      </div>

      {/* Main Grid: Radar Chart on left, Missing & Suggested Skills on right */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
        
        {/* Radar Chart Centerpiece (Matching graphic step 3) */}
        <div className="lg:col-span-6 flex flex-col items-center justify-center glass-panel rounded-2xl p-6 border border-cyan-500/20 shadow-2xl relative overflow-hidden">
          <div className="absolute top-4 left-4 flex items-center space-x-2">
            <span className="text-[11px] font-mono font-semibold text-slate-400 uppercase tracking-wider">
              Competency Vector Map
            </span>
          </div>

          <div className="py-2">
            <RadarChart 
              data={candidateData.skillRadar} 
              size={360}
              showCurrent={showCurrent}
              showTarget={showTarget}
            />
          </div>

          <div className="w-full mt-4 pt-4 border-t border-slate-800 flex items-center justify-around text-xs font-mono text-slate-400">
            <div className="flex items-center space-x-1.5">
              <span className="w-2 h-2 rounded-full bg-cyan-400" />
              <span>Avg Candidate Level: <strong className="text-cyan-300">77%</strong></span>
            </div>
            <div className="flex items-center space-x-1.5">
              <span className="w-2 h-2 rounded-full bg-amber-400" />
              <span>Target Benchmark: <strong className="text-amber-300">83%</strong></span>
            </div>
          </div>
        </div>

        {/* Missing Skills & Recommended Bridges (Right Column) */}
        <div className="lg:col-span-6 space-y-5">
          
          {/* Missing Skills Card */}
          <div className="glass-panel rounded-2xl p-5 border border-slate-800 space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <div className="p-2 rounded-lg bg-rose-500/10 text-rose-400">
                  <AlertCircle className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="font-bold text-slate-200 text-sm">Detected Skill Gaps</h3>
                  <span className="text-[11px] text-rose-400 font-mono">High-impact delta items</span>
                </div>
              </div>
              <span className="text-xs font-mono bg-rose-500/10 text-rose-400 px-2.5 py-1 rounded-full border border-rose-500/20">
                {skillGaps.filter(g => !g.isMet).length} Skills below target
              </span>
            </div>

            <div className="space-y-2.5">
              {skillGaps.map((item) => (
                <div 
                  key={item.skill} 
                  className={`p-3 rounded-xl border transition-all ${
                    item.isMet 
                      ? 'bg-emerald-950/20 border-emerald-500/30' 
                      : 'bg-slate-950/70 border-slate-800 hover:border-slate-700'
                  }`}
                >
                  <div className="flex items-center justify-between text-xs mb-1.5">
                    <span className="font-semibold text-slate-200">{item.skill}</span>
                    <div className="flex items-center space-x-2 font-mono">
                      <span className="text-slate-400">{item.current}%</span>
                      <span className="text-slate-600">/</span>
                      <span className="text-amber-400">{item.target}%</span>
                      {item.isMet ? (
                        <span className="text-emerald-400 text-[10px] bg-emerald-500/10 px-1.5 py-0.5 rounded font-bold">MET</span>
                      ) : (
                        <span className="text-rose-400 text-[10px] bg-rose-500/10 px-1.5 py-0.5 rounded font-bold">-{item.gap}%</span>
                      )}
                    </div>
                  </div>

                  <div className="w-full bg-slate-900 h-2 rounded-full overflow-hidden flex">
                    <div 
                      className={`h-full rounded-l-full transition-all duration-500 ${item.isMet ? 'bg-emerald-500' : 'bg-cyan-500'}`}
                      style={{ width: `${item.current}%` }} 
                    />
                    {!item.isMet && (
                      <div 
                        className="h-full bg-rose-500/60 rounded-r-full animate-pulse"
                        style={{ width: `${item.gap}%` }} 
                      />
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Suggested Bridging Pathways */}
          <div className="glass-panel rounded-2xl p-5 border border-slate-800 space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <div className="p-2 rounded-lg bg-sky-500/10 text-sky-400">
                  <BookOpen className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="font-bold text-slate-200 text-sm">Suggested Skills & Bridge Projects</h3>
                  <p className="text-[11px] text-slate-400">Adaptive curriculum recommended by AI</p>
                </div>
              </div>
            </div>

            <div className="space-y-2">
              {selectedRole.suggestedMissingSkills.map((s) => (
                <div key={s.name} className="p-3 bg-slate-950/80 rounded-xl border border-slate-800/80 flex items-center justify-between text-xs">
                  <div>
                    <div className="flex items-center space-x-2">
                      <span className="font-semibold text-slate-200">{s.name}</span>
                      <span className={`text-[10px] font-mono px-1.5 py-0.5 rounded ${
                        s.priority === 'Critical' ? 'bg-rose-500/20 text-rose-300' : 'bg-amber-500/20 text-amber-300'
                      }`}>
                        {s.priority}
                      </span>
                    </div>
                    <p className="text-[11px] text-slate-400 mt-0.5">{s.reason}</p>
                  </div>

                  <button
                    onClick={() => handleSimulateSkillBoost(s.name)}
                    disabled={boostedSkills[s.name]}
                    className={`ml-3 px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center space-x-1.5 shrink-0 transition-all ${
                      boostedSkills[s.name]
                        ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40'
                        : 'bg-cyan-500/20 hover:bg-cyan-500/30 text-cyan-300 border border-cyan-500/30'
                    }`}
                  >
                    <Zap className="w-3 h-3" />
                    <span>{boostedSkills[s.name] ? 'Practiced' : 'Simulate Practice'}</span>
                  </button>
                </div>
              ))}
            </div>
          </div>

        </div>

      </div>

      {/* Footer Navigation */}
      <div className="flex items-center justify-end pt-2">
        <button
          onClick={onProceed}
          className="px-6 py-3 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 text-white font-semibold text-xs tracking-wide hover:opacity-95 transition-all shadow-lg glow-cyan flex items-center space-x-2"
        >
          <span>Proceed to Adaptive MCQ Testing (Step 04)</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}
