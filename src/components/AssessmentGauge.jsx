import React from 'react';

/**
 * Assessment Score Gauge Component
 * Futuristic semi-circular speedometer gauge (0 to 100)
 * Matching Step 4: "Assessment Score Gauge"
 */
export default function AssessmentGauge({ score = 91, maxScore = 100, label = "Employability Index" }) {
  // Normalize score between 0 and 100
  const clampedScore = Math.min(Math.max(score, 0), maxScore);
  const percentage = (clampedScore / maxScore) * 100;
  
  // Angle for needle: -90 degrees (at 0) to +90 degrees (at 100)
  const needleAngle = -90 + (percentage / 100) * 180;

  // Rating classification
  const getRatingTier = (val) => {
    if (val >= 90) return { title: 'Elite Talent', color: '#10b981', badge: 'Tier-1 Candidate' };
    if (val >= 80) return { title: 'Industry Ready', color: '#06b6d4', badge: 'High Employability' };
    if (val >= 65) return { title: 'Competent', color: '#f59e0b', badge: 'Needs Minor Bridge' };
    return { title: 'Developing', color: '#f43f5e', badge: 'Requires Upskilling' };
  };

  const tier = getRatingTier(clampedScore);

  return (
    <div className="flex flex-col items-center justify-center p-4 relative">
      <div className="relative w-64 h-36 flex items-end justify-center overflow-visible">
        <svg viewBox="0 0 200 115" className="w-full h-full overflow-visible">
          <defs>
            {/* Speedometer Arc Gradient */}
            <linearGradient id="gaugeGradient" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#ef4444" />
              <stop offset="25%" stopColor="#f59e0b" />
              <stop offset="60%" stopColor="#06b6d4" />
              <stop offset="100%" stopColor="#10b981" />
            </linearGradient>

            <filter id="needleGlow" x="-50%" y="-50%" width="200%" height="200%">
              <feGaussianBlur stdDeviation="2" result="blur" />
              <feComposite in="SourceGraphic" in2="blur" operator="over" />
            </filter>
          </defs>

          {/* Background Outer Arc */}
          <path
            d="M 20 100 A 80 80 0 0 1 180 100"
            fill="none"
            stroke="rgba(30, 41, 59, 0.8)"
            strokeWidth="14"
            strokeLinecap="round"
          />

          {/* Active Colored Arc */}
          <path
            d="M 20 100 A 80 80 0 0 1 180 100"
            fill="none"
            stroke="url(#gaugeGradient)"
            strokeWidth="14"
            strokeLinecap="round"
            strokeDasharray="251.2"
            strokeDashoffset={251.2 - (251.2 * percentage) / 100}
            className="transition-all duration-1000 ease-out"
          />

          {/* Tick marks & labels */}
          {[
            { val: 0, angle: -90, label: "0" },
            { val: 20, angle: -54, label: "20" },
            { val: 50, angle: 0, label: "50" },
            { val: 75, angle: 45, label: "75" },
            { val: 100, angle: 90, label: "100" },
          ].map((tick) => {
            const rad = (tick.angle - 90) * (Math.PI / 180);
            const x1 = 100 + 72 * Math.cos(rad);
            const y1 = 100 + 72 * Math.sin(rad);
            const x2 = 100 + 64 * Math.cos(rad);
            const y2 = 100 + 64 * Math.sin(rad);

            const tx = 100 + 54 * Math.cos(rad);
            const ty = 100 + 54 * Math.sin(rad);

            return (
              <g key={tick.val}>
                <line x1={x1} y1={y1} x2={x2} y2={y2} stroke="rgba(148, 163, 184, 0.4)" strokeWidth="1.5" />
                <text
                  x={tx}
                  y={ty}
                  fontSize="7"
                  fill="rgba(148, 163, 184, 0.6)"
                  textAnchor="middle"
                  dominantBaseline="middle"
                  className="font-mono font-medium"
                >
                  {tick.label}
                </text>
              </g>
            );
          })}

          {/* Needle Pivot Center */}
          <circle cx="100" cy="100" r="8" fill="#0f172a" stroke="#38bdf8" strokeWidth="2.5" />
          <circle cx="100" cy="100" r="3" fill="#38bdf8" />

          {/* Needle Pin */}
          <g transform={`rotate(${needleAngle} 100 100)`} className="transition-transform duration-1000 ease-out">
            <line
              x1="100"
              y1="100"
              x2="100"
              y2="34"
              stroke="#38bdf8"
              strokeWidth="3"
              strokeLinecap="round"
              filter="url(#needleGlow)"
            />
            <polygon points="98,38 102,38 100,26" fill="#38bdf8" />
          </g>
        </svg>

        {/* Glow behind center */}
        <div className="absolute bottom-2 w-24 h-12 bg-cyan-500/10 rounded-full blur-xl pointer-events-none" />
      </div>

      {/* Numerical readout and status badge */}
      <div className="text-center mt-2">
        <div className="flex items-baseline justify-center space-x-1">
          <span className="text-4xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-sky-300 to-emerald-400 font-mono tracking-tight">
            {clampedScore}
          </span>
          <span className="text-sm font-semibold text-slate-400 font-mono">/ 100</span>
        </div>
        <p className="text-xs font-semibold text-slate-300 uppercase tracking-wider mt-0.5">{label}</p>
        
        <div className="mt-2 inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold"
          style={{ backgroundColor: `${tier.color}20`, color: tier.color, border: `1px solid ${tier.color}50` }}>
          <span className="w-1.5 h-1.5 rounded-full mr-1.5 animate-pulse" style={{ backgroundColor: tier.color }} />
          {tier.title} • {tier.badge}
        </div>
      </div>
    </div>
  );
}
