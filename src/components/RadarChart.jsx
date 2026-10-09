import React, { useState } from 'react';

/**
 * High-tech SVG Radar / Spider Chart
 * Renders both Current Skills and Target Role Requirements with glowing polygons.
 */
export default function RadarChart({ data = [], size = 380, showTarget = true, showCurrent = true }) {
  const [hoveredSkill, setHoveredSkill] = useState(null);

  if (!data || data.length === 0) return null;

  const center = size / 2;
  const radius = (size / 2) - 52;
  const angleStep = (Math.PI * 2) / data.length;

  // Helper to convert polar coordinates to Cartesian
  const getCoordinates = (value, index, maxVal = 100) => {
    const angle = index * angleStep - Math.PI / 2;
    const distance = (value / maxVal) * radius;
    const x = center + distance * Math.cos(angle);
    const y = center + distance * Math.sin(angle);
    return { x, y };
  };

  // Build grid rings (20%, 40%, 60%, 80%, 100%)
  const rings = [20, 40, 60, 80, 100];

  // Polygon points strings
  const currentPoints = data
    .map((item, index) => {
      const { x, y } = getCoordinates(item.current, index, item.fullMark || 100);
      return `${x},${y}`;
    })
    .join(' ');

  const targetPoints = data
    .map((item, index) => {
      const { x, y } = getCoordinates(item.target, index, item.fullMark || 100);
      return `${x},${y}`;
    })
    .join(' ');

  return (
    <div className="relative flex flex-col items-center justify-center select-none">
      <svg width={size} height={size} className="overflow-visible transition-all duration-500">
        <defs>
          {/* Gradients */}
          <linearGradient id="currentGradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#06b6d4" stopOpacity="0.6" />
            <stop offset="100%" stopColor="#3b82f6" stopOpacity="0.25" />
          </linearGradient>

          <linearGradient id="targetGradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#f59e0b" stopOpacity="0.4" />
            <stop offset="100%" stopColor="#ea580c" stopOpacity="0.15" />
          </linearGradient>

          <filter id="glowCyanFilter" x="-20%" y="-20%" width="140%" height="140%">
            <feGaussianBlur stdDeviation="3" result="blur" />
            <feComposite in="SourceGraphic" in2="blur" operator="over" />
          </filter>

          <filter id="glowOrangeFilter" x="-20%" y="-20%" width="140%" height="140%">
            <feGaussianBlur stdDeviation="2.5" result="blur" />
            <feComposite in="SourceGraphic" in2="blur" operator="over" />
          </filter>
        </defs>

        {/* Grid Web Rings */}
        {rings.map((ringVal) => {
          const ringPoints = data
            .map((_, i) => {
              const { x, y } = getCoordinates(ringVal, i, 100);
              return `${x},${y}`;
            })
            .join(' ');

          return (
            <g key={ringVal}>
              <polygon
                points={ringPoints}
                fill="none"
                stroke="rgba(56, 189, 248, 0.15)"
                strokeWidth={ringVal === 100 ? "1.5" : "1"}
                strokeDasharray={ringVal === 100 ? "none" : "3,3"}
              />
              <text
                x={center}
                y={center - (ringVal / 100) * radius - 2}
                fontSize="9"
                fill="rgba(148, 163, 184, 0.5)"
                textAnchor="middle"
                className="font-mono"
              >
                {ringVal}%
              </text>
            </g>
          );
        })}

        {/* Axis Spokes from center to edge */}
        {data.map((_, index) => {
          const { x, y } = getCoordinates(100, index, 100);
          return (
            <line
              key={index}
              x1={center}
              y1={center}
              x2={x}
              y2={y}
              stroke="rgba(56, 189, 248, 0.2)"
              strokeWidth="1"
            />
          );
        })}

        {/* Target Requirements Polygon (Orange) */}
        {showTarget && (
          <g>
            <polygon
              points={targetPoints}
              fill="url(#targetGradient)"
              stroke="#f59e0b"
              strokeWidth="2"
              strokeDasharray="4,3"
              filter="url(#glowOrangeFilter)"
              className="transition-all duration-700 ease-out"
            />
            {data.map((item, index) => {
              const { x, y } = getCoordinates(item.target, index, item.fullMark || 100);
              return (
                <circle
                  key={`target-${index}`}
                  cx={x}
                  cy={y}
                  r="3.5"
                  fill="#fbbf24"
                  stroke="#78350f"
                  strokeWidth="1.5"
                />
              );
            })}
          </g>
        )}

        {/* Current Skills Polygon (Cyan/Blue) */}
        {showCurrent && (
          <g>
            <polygon
              points={currentPoints}
              fill="url(#currentGradient)"
              stroke="#06b6d4"
              strokeWidth="2.5"
              filter="url(#glowCyanFilter)"
              className="transition-all duration-700 ease-out"
            />
            {data.map((item, index) => {
              const { x, y } = getCoordinates(item.current, index, item.fullMark || 100);
              const isHovered = hoveredSkill === item.skill;
              return (
                <g key={`current-${index}`} onMouseEnter={() => setHoveredSkill(item.skill)} onMouseLeave={() => setHoveredSkill(null)}>
                  <circle
                    cx={x}
                    cy={y}
                    r={isHovered ? 6 : 4.5}
                    fill="#38bdf8"
                    stroke="#0284c7"
                    strokeWidth="2"
                    className="cursor-pointer transition-all duration-200"
                  />
                  {isHovered && (
                    <circle
                      cx={x}
                      cy={y}
                      r="10"
                      fill="none"
                      stroke="#38bdf8"
                      strokeWidth="1.5"
                      opacity="0.8"
                    />
                  )}
                </g>
              );
            })}
          </g>
        )}

        {/* Labels at outer perimeter */}
        {data.map((item, index) => {
          const angle = index * angleStep - Math.PI / 2;
          const labelDist = radius + 26;
          const x = center + labelDist * Math.cos(angle);
          const y = center + labelDist * Math.sin(angle);
          
          let anchor = "middle";
          if (Math.cos(angle) > 0.3) anchor = "start";
          else if (Math.cos(angle) < -0.3) anchor = "end";

          const isHovered = hoveredSkill === item.skill;

          return (
            <g
              key={`label-${index}`}
              className="cursor-pointer transition-all duration-200"
              onMouseEnter={() => setHoveredSkill(item.skill)}
              onMouseLeave={() => setHoveredSkill(null)}
            >
              <text
                x={x}
                y={y}
                textAnchor={anchor}
                dominantBaseline="central"
                fontSize={isHovered ? "12" : "11"}
                fontWeight={isHovered ? "700" : "600"}
                fill={isHovered ? "#38bdf8" : "#cbd5e1"}
                className="transition-colors duration-200"
              >
                {item.skill}
              </text>
              <text
                x={x}
                y={y + 13}
                textAnchor={anchor}
                dominantBaseline="central"
                fontSize="9"
                fill={item.current >= item.target ? "#34d399" : "#f87171"}
                className="font-mono font-medium"
              >
                {item.current}% / req {item.target}%
              </text>
            </g>
          );
        })}
      </svg>

      {/* Dynamic Hover Tooltip / Status */}
      {hoveredSkill && (
        <div className="absolute bottom-2 bg-slate-900/95 border border-cyan-500/40 px-3 py-1.5 rounded-lg shadow-xl text-xs flex items-center space-x-3 pointer-events-none backdrop-blur-md">
          <span className="font-semibold text-slate-200">{hoveredSkill}:</span>
          <span className="text-cyan-400 font-mono">Current: {data.find(d => d.skill === hoveredSkill)?.current}%</span>
          <span className="text-amber-400 font-mono">Target: {data.find(d => d.skill === hoveredSkill)?.target}%</span>
          {data.find(d => d.skill === hoveredSkill)?.current < data.find(d => d.skill === hoveredSkill)?.target ? (
            <span className="text-rose-400 font-mono text-[11px] bg-rose-500/10 px-1.5 py-0.5 rounded border border-rose-500/20">
              Gap: -{data.find(d => d.skill === hoveredSkill)?.target - data.find(d => d.skill === hoveredSkill)?.current}%
            </span>
          ) : (
            <span className="text-emerald-400 font-mono text-[11px] bg-emerald-500/10 px-1.5 py-0.5 rounded border border-emerald-500/20">
              Target Met!
            </span>
          )}
        </div>
      )}
    </div>
  );
}
