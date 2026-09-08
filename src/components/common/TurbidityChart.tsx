import React, { useState } from 'react';
import { Activity, ArrowDownRight, Info, CheckCircle2 } from 'lucide-react';

interface TurbidityDataPoint {
  timestamp: string;
  turbidity: number;
  label: string;
}

interface TurbidityChartProps {
  data?: TurbidityDataPoint[];
  currentTurbidity?: number;
  height?: number;
  showExplanation?: boolean;
}

const defaultReadings: TurbidityDataPoint[] = [
  { timestamp: '03:30 AM', turbidity: 850, label: 'Pre-cleaning: Dense Black Sludge' },
  { timestamp: '03:55 AM', turbidity: 650, label: 'Mechanical Brush Agitation' },
  { timestamp: '04:20 AM', turbidity: 420, label: 'High-Torque De-silting & Suction' },
  { timestamp: '04:45 AM', turbidity: 190, label: 'Post-cleaning: Clear Water Restored' }
];

export const TurbidityChart: React.FC<TurbidityChartProps> = ({
  data = defaultReadings,
  currentTurbidity = 190,
  height = 220,
  showExplanation = true
}) => {
  const [hoveredIdx, setHoveredIdx] = useState<number | null>(null);

  const maxVal = 950;
  const minVal = 0;
  const chartWidth = 520;
  const chartHeight = height - 50;
  const padLeft = 45;
  const padRight = 25;
  const padTop = 20;
  const padBottom = 30;

  const innerWidth = chartWidth - padLeft - padRight;
  const innerHeight = chartHeight - padTop - padBottom;

  const points = data.map((d, index) => {
    const x = padLeft + (index / (data.length - 1)) * innerWidth;
    const y = padTop + innerHeight - ((d.turbidity - minVal) / (maxVal - minVal)) * innerHeight;
    return { ...d, x, y };
  });

  const pathD = points.reduce((acc, p, idx) => {
    if (idx === 0) return `M ${p.x} ${p.y}`;
    const prev = points[idx - 1];
    const cx1 = prev.x + (p.x - prev.x) / 2;
    const cy1 = prev.y;
    const cx2 = prev.x + (p.x - prev.x) / 2;
    const cy2 = p.y;
    return `${acc} C ${cx1} ${cy1}, ${cx2} ${cy2}, ${p.x} ${p.y}`;
  }, '');

  const areaD = `${pathD} L ${points[points.length - 1].x} ${padTop + innerHeight} L ${points[0].x} ${padTop + innerHeight} Z`;

  // Target threshold y position (e.g. 200 NTU = Clean standard)
  const targetThresholdY = padTop + innerHeight - ((200 - minVal) / (maxVal - minVal)) * innerHeight;

  return (
    <div id="turbidity-chart-container" className="bg-white rounded-xl border border-slate-200 p-5 shadow-sm">
      <div className="flex flex-wrap items-center justify-between gap-2 mb-4">
        <div>
          <div className="flex items-center gap-2">
            <div className="p-1.5 rounded-lg bg-blue-50 text-blue-700">
              <Activity className="w-4 h-4" />
            </div>
            <h3 className="font-semibold text-slate-800 text-sm md:text-base">
              Drain Optical Turbidity Sensor Telemetry (NTU)
            </h3>
          </div>
          <p className="text-xs text-slate-500 mt-0.5">
            Nephelometric Turbidity Units measured by DrainTrack submersible optical sensor
          </p>
        </div>

        <div className="flex items-center gap-2">
          <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-700 text-xs font-semibold">
            <ArrowDownRight className="w-3.5 h-3.5" />
            <span>-77.6% Sludge Drop</span>
          </div>
          <div className="text-right">
            <span className="text-xs text-slate-400 block font-medium">Current Status</span>
            <span className="text-sm font-bold text-slate-800">{currentTurbidity} NTU</span>
          </div>
        </div>
      </div>

      {/* SVG Chart Graphic */}
      <div className="relative w-full overflow-x-auto">
        <svg
          viewBox={`0 0 ${chartWidth} ${chartHeight}`}
          className="w-full h-auto select-none"
          style={{ minWidth: '320px', maxHeight: `${height}px` }}
        >
          <defs>
            <linearGradient id="turbidityGrad" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#ef4444" stopOpacity="0.25" />
              <stop offset="50%" stopColor="#f59e0b" stopOpacity="0.15" />
              <stop offset="100%" stopColor="#10b981" stopOpacity="0.05" />
            </linearGradient>
            <linearGradient id="lineGrad" x1="0" y1="0" x2="1" y2="0">
              <stop offset="0%" stopColor="#ef4444" />
              <stop offset="40%" stopColor="#f59e0b" />
              <stop offset="100%" stopColor="#10b981" />
            </linearGradient>
          </defs>

          {/* Grid lines & Y-axis labels */}
          {[800, 600, 400, 200, 0].map((val) => {
            const y = padTop + innerHeight - ((val - minVal) / (maxVal - minVal)) * innerHeight;
            return (
              <g key={val}>
                <line
                  x1={padLeft}
                  y1={y}
                  x2={chartWidth - padRight}
                  y2={y}
                  stroke="#e2e8f0"
                  strokeDasharray={val === 200 ? '4 3' : '2 2'}
                />
                <text x={padLeft - 8} y={y + 3.5} textAnchor="end" fontSize="10" fill="#94a3b8">
                  {val}
                </text>
              </g>
            );
          })}

          {/* Clean target threshold line */}
          <line
            x1={padLeft}
            y1={targetThresholdY}
            x2={chartWidth - padRight}
            y2={targetThresholdY}
            stroke="#10b981"
            strokeWidth="1.5"
            strokeDasharray="4 4"
          />
          <text
            x={chartWidth - padRight - 5}
            y={targetThresholdY - 5}
            textAnchor="end"
            fontSize="9.5"
            fontWeight="bold"
            fill="#10b981"
          >
            Target Clean Limit (≤ 200 NTU)
          </text>

          {/* Area fill */}
          <path d={areaD} fill="url(#turbidityGrad)" />

          {/* Main curve */}
          <path d={pathD} fill="none" stroke="url(#lineGrad)" strokeWidth="3.5" strokeLinecap="round" />

          {/* Data Points */}
          {points.map((p, idx) => {
            const isHovered = hoveredIdx === idx;
            const isTarget = p.turbidity <= 200;
            return (
              <g
                key={idx}
                className="cursor-pointer transition-transform"
                onMouseEnter={() => setHoveredIdx(idx)}
                onMouseLeave={() => setHoveredIdx(null)}
              >
                <circle
                  cx={p.x}
                  cy={p.y}
                  r={isHovered ? 7 : 5}
                  fill={isTarget ? '#10b981' : p.turbidity > 600 ? '#ef4444' : '#f59e0b'}
                  stroke="#ffffff"
                  strokeWidth="2.5"
                  className="transition-all duration-200"
                />

                {/* X labels */}
                <text x={p.x} y={chartHeight - 6} textAnchor="middle" fontSize="10" fill="#64748b" fontWeight="500">
                  {p.timestamp}
                </text>

                {/* Point value tag */}
                <text
                  x={p.x}
                  y={p.y - 10}
                  textAnchor="middle"
                  fontSize="11"
                  fontWeight="bold"
                  fill={isTarget ? '#059669' : p.turbidity > 600 ? '#dc2626' : '#d97706'}
                >
                  {p.turbidity}
                </text>
              </g>
            );
          })}
        </svg>
      </div>

      {/* Hover Information / Interactive readout */}
      <div className="mt-3 min-h-[38px] p-2.5 rounded-lg bg-slate-50 border border-slate-200 flex items-center justify-between text-xs">
        {hoveredIdx !== null ? (
          <div className="flex items-center gap-2">
            <span className="font-semibold text-slate-800">{points[hoveredIdx].timestamp}:</span>
            <span className="text-slate-600">{points[hoveredIdx].label}</span>
            <span className="font-bold text-slate-900 bg-white px-2 py-0.5 rounded border border-slate-200">
              {points[hoveredIdx].turbidity} NTU
            </span>
          </div>
        ) : (
          <div className="flex items-center gap-2 text-slate-600">
            <Info className="w-4 h-4 text-blue-600 shrink-0" />
            <span>Hover on graph milestones above to inspect time and cleaning stage.</span>
          </div>
        )}

        <div className="flex items-center gap-1.5 text-emerald-700 font-medium">
          <CheckCircle2 className="w-3.5 h-3.5" />
          <span>Optical Clearance Verified</span>
        </div>
      </div>

      {showExplanation && (
        <div className="mt-3 p-3 rounded-lg bg-emerald-50/80 border border-emerald-200/80 text-xs text-emerald-900 leading-relaxed">
          <strong className="font-semibold text-emerald-950">Water Quality Telemetry Notice:</strong> Decreasing
          turbidity reading from <span className="font-bold text-rose-700">850 NTU</span> (clogged sludge) down to{' '}
          <span className="font-bold text-emerald-700">190 NTU</span> confirms continuous mechanical desilting,
          successful suction extraction, and restoration of hydraulic flow through the municipal conduit.
        </div>
      )}
    </div>
  );
};
