import React, { useState } from 'react';
import {
  MapPin,
  Layers,
  ZoomIn,
  ZoomOut,
  Navigation,
  User,
  AlertTriangle,
  CheckCircle,
  X,
  ExternalLink,
  ShieldCheck
} from 'lucide-react';
import { DrainageLocation, Worker, DrainageCondition } from '../../types';

interface DrainageMapProps {
  drainages: DrainageLocation[];
  workers: Worker[];
  onSelectDrainage?: (drainage: DrainageLocation) => void;
  onSelectWorker?: (worker: Worker) => void;
  height?: string;
  showControls?: boolean;
}

export const DrainageMap: React.FC<DrainageMapProps> = ({
  drainages = [],
  workers = [],
  onSelectDrainage,
  onSelectWorker,
  height = '460px',
  showControls = true
}) => {
  const [filter, setFilter] = useState<'ALL' | 'WORKERS' | 'BLOCKED' | 'DIRTY' | 'CLEAN'>('ALL');
  const [selectedItem, setSelectedItem] = useState<{
    type: 'drainage' | 'worker';
    data: DrainageLocation | Worker;
  } | null>(null);
  const [zoom, setZoom] = useState<number>(1);

  // Geographic bounds around Bengaluru coordinates
  // Lat: 12.9100 to 12.9900 (~0.08 span)
  // Lng: 77.6000 to 77.6500 (~0.05 span)
  const minLat = 12.910;
  const maxLat = 12.990;
  const minLng = 77.600;
  const maxLng = 77.650;

  const projectCoords = (lat: number, lng: number) => {
    // Normalization to 0..100%
    const y = 100 - ((lat - minLat) / (maxLat - minLat)) * 100;
    const x = ((lng - minLng) / (maxLng - minLng)) * 100;
    // Bound padding
    const boundedX = Math.max(5, Math.min(95, x));
    const boundedY = Math.max(8, Math.min(92, y));
    return { x: boundedX, y: boundedY };
  };

  const filteredDrainages = drainages.filter((d) => {
    if (filter === 'WORKERS') return false;
    if (filter === 'BLOCKED') return d.condition === 'Blocked' || d.condition === 'Critical';
    if (filter === 'DIRTY') return d.condition === 'Dirty' || d.condition === 'Moderate';
    if (filter === 'CLEAN') return d.condition === 'Good';
    return true;
  });

  const filteredWorkers = workers.filter(() => {
    if (filter === 'BLOCKED' || filter === 'DIRTY' || filter === 'CLEAN') return false;
    return true;
  });

  const getDrainageColor = (condition: DrainageCondition) => {
    switch (condition) {
      case 'Critical':
      case 'Blocked':
        return {
          bg: 'bg-rose-500',
          border: 'border-rose-200',
          text: 'text-rose-600',
          ring: 'ring-rose-400',
          hex: '#ef4444'
        };
      case 'Dirty':
      case 'Moderate':
        return {
          bg: 'bg-amber-500',
          border: 'border-amber-200',
          text: 'text-amber-600',
          ring: 'ring-amber-400',
          hex: '#f59e0b'
        };
      case 'Good':
      default:
        return {
          bg: 'bg-emerald-500',
          border: 'border-emerald-200',
          text: 'text-emerald-600',
          ring: 'ring-emerald-400',
          hex: '#10b981'
        };
    }
  };

  return (
    <div
      id="drainage-interactive-map"
      className="relative w-full rounded-xl border border-slate-200 bg-slate-900 overflow-hidden shadow-sm flex flex-col"
      style={{ height }}
    >
      {/* Map Header Controls */}
      {showControls && (
        <div className="absolute top-3 left-3 right-3 z-20 flex flex-wrap items-center justify-between gap-2 pointer-events-none">
          {/* Filter Pills */}
          <div className="flex flex-wrap items-center gap-1.5 p-1 rounded-lg bg-slate-900/90 backdrop-blur-md border border-slate-700/80 pointer-events-auto shadow-md">
            <button
              type="button"
              onClick={() => setFilter('ALL')}
              className={`px-2.5 py-1 rounded text-xs font-medium transition-colors ${
                filter === 'ALL' ? 'bg-blue-600 text-white shadow-sm' : 'text-slate-300 hover:text-white'
              }`}
            >
              All Assets ({drainages.length + workers.length})
            </button>
            <button
              type="button"
              onClick={() => setFilter('WORKERS')}
              className={`flex items-center gap-1 px-2.5 py-1 rounded text-xs font-medium transition-colors ${
                filter === 'WORKERS' ? 'bg-emerald-600 text-white shadow-sm' : 'text-slate-300 hover:text-white'
              }`}
            >
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              Workers ({workers.length})
            </button>
            <button
              type="button"
              onClick={() => setFilter('BLOCKED')}
              className={`flex items-center gap-1 px-2.5 py-1 rounded text-xs font-medium transition-colors ${
                filter === 'BLOCKED' ? 'bg-rose-600 text-white shadow-sm' : 'text-slate-300 hover:text-white'
              }`}
            >
              <span className="w-2 h-2 rounded-full bg-rose-400" />
              Blocked/Critical
            </button>
            <button
              type="button"
              onClick={() => setFilter('DIRTY')}
              className={`flex items-center gap-1 px-2.5 py-1 rounded text-xs font-medium transition-colors ${
                filter === 'DIRTY' ? 'bg-amber-600 text-white shadow-sm' : 'text-slate-300 hover:text-white'
              }`}
            >
              <span className="w-2 h-2 rounded-full bg-amber-400" />
              Dirty
            </button>
            <button
              type="button"
              onClick={() => setFilter('CLEAN')}
              className={`flex items-center gap-1 px-2.5 py-1 rounded text-xs font-medium transition-colors ${
                filter === 'CLEAN' ? 'bg-emerald-600 text-white shadow-sm' : 'text-slate-300 hover:text-white'
              }`}
            >
              <span className="w-2 h-2 rounded-full bg-emerald-400" />
              Clean
            </button>
          </div>

          {/* Leaflet / OSM Notice & Zoom Controls */}
          <div className="flex items-center gap-2 pointer-events-auto">
            <div className="hidden sm:flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-slate-900/90 backdrop-blur-md border border-slate-700/80 text-[11px] text-slate-300">
              <Layers className="w-3.5 h-3.5 text-blue-400" />
              <span>OSM / Leaflet Ready Grid</span>
            </div>

            <div className="flex items-center rounded-lg bg-slate-900/90 backdrop-blur-md border border-slate-700/80 text-slate-300 overflow-hidden shadow-md">
              <button
                type="button"
                onClick={() => setZoom((z) => Math.min(1.4, z + 0.1))}
                className="p-1.5 hover:text-white hover:bg-slate-800 transition-colors"
                title="Zoom In"
              >
                <ZoomIn className="w-4 h-4" />
              </button>
              <div className="w-[1px] h-4 bg-slate-700" />
              <button
                type="button"
                onClick={() => setZoom((z) => Math.max(0.8, z - 0.1))}
                className="p-1.5 hover:text-white hover:bg-slate-800 transition-colors"
                title="Zoom Out"
              >
                <ZoomOut className="w-4 h-4" />
              </button>
              <div className="w-[1px] h-4 bg-slate-700" />
              <button
                type="button"
                onClick={() => setZoom(1)}
                className="px-2 py-1 text-[11px] hover:text-white hover:bg-slate-800 transition-colors"
                title="Reset View"
              >
                Reset
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Map Canvas Background (Simulated Smart City Vector Layout) */}
      <div
        className="relative w-full h-full overflow-hidden transition-transform duration-300 ease-out select-none"
        style={{ transform: `scale(${zoom})`, transformOrigin: 'center center' }}
      >
        {/* SVG Street Grid & Waterway overlay */}
        <svg className="absolute inset-0 w-full h-full opacity-40 pointer-events-none" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <pattern id="smallGrid" width="40" height="40" patternUnits="userSpaceOnUse">
              <path d="M 40 0 L 0 0 0 40" fill="none" stroke="#334155" strokeWidth="0.5" />
            </pattern>
            <linearGradient id="canalGradient" x1="0" y1="0" x2="1" y2="1">
              <stop offset="0%" stopColor="#0284c7" stopOpacity="0.4" />
              <stop offset="100%" stopColor="#0369a1" stopOpacity="0.2" />
            </linearGradient>
          </defs>

          {/* Grid */}
          <rect width="100%" height="100%" fill="url(#smallGrid)" />

          {/* Primary Municipal Arterial Roads */}
          <path d="M 0 140 Q 250 180 500 130 T 1000 160" fill="none" stroke="#475569" strokeWidth="6" />
          <path d="M 0 320 Q 300 290 600 340 T 1000 300" fill="none" stroke="#475569" strokeWidth="5" />
          <path d="M 280 0 Q 320 250 290 500 T 310 800" fill="none" stroke="#475569" strokeWidth="5" />
          <path d="M 680 0 Q 640 250 690 500 T 670 800" fill="none" stroke="#475569" strokeWidth="6" />

          {/* Storm Canal Trunk System */}
          <path
            d="M 120 0 C 200 200, 450 150, 520 380 S 800 450, 950 600"
            fill="none"
            stroke="#0ea5e9"
            strokeWidth="3.5"
            strokeDasharray="6 3"
          />

          {/* Catchment lakes */}
          <ellipse cx="220" cy="180" rx="45" ry="30" fill="url(#canalGradient)" stroke="#0ea5e9" strokeWidth="1" />
          <text x="220" y="185" fill="#38bdf8" fontSize="10" textAnchor="middle" opacity="0.8">
            Halasuru Catchment
          </text>

          <ellipse cx="780" cy="380" rx="55" ry="35" fill="url(#canalGradient)" stroke="#0ea5e9" strokeWidth="1" />
          <text x="780" y="385" fill="#38bdf8" fontSize="10" textAnchor="middle" opacity="0.8">
            BTM Lake Link
          </text>

          {/* Ward zones labeling */}
          <text x="140" y="90" fill="#64748b" fontSize="11" fontWeight="bold" letterSpacing="1">
            WARD 112 (INDIRANAGAR)
          </text>
          <text x="120" y="380" fill="#64748b" fontSize="11" fontWeight="bold" letterSpacing="1">
            WARD 113 (HALASURU)
          </text>
          <text x="600" y="100" fill="#64748b" fontSize="11" fontWeight="bold" letterSpacing="1">
            WARD 147 (KORAMANGALA)
          </text>
          <text x="620" y="440" fill="#64748b" fontSize="11" fontWeight="bold" letterSpacing="1">
            WARD 152 (BTM LAYOUT)
          </text>
        </svg>

        {/* Drainage Markers */}
        {filteredDrainages.map((drainage) => {
          const coords = projectCoords(drainage.latitude, drainage.longitude);
          const color = getDrainageColor(drainage.condition);
          const isSelected = selectedItem?.type === 'drainage' && (selectedItem.data as DrainageLocation).drainage_id === drainage.drainage_id;

          return (
            <div
              key={drainage.drainage_id}
              className="absolute transform -translate-x-1/2 -translate-y-1/2 cursor-pointer group z-10"
              style={{ left: `${coords.x}%`, top: `${coords.y}%` }}
              onClick={() => {
                setSelectedItem({ type: 'drainage', data: drainage });
                onSelectDrainage?.(drainage);
              }}
            >
              <div className="relative flex flex-col items-center">
                {/* Marker Pin */}
                <div
                  className={`w-7 h-7 rounded-full flex items-center justify-center text-white shadow-lg transition-transform duration-200 group-hover:scale-125 ${
                    color.bg
                  } ${isSelected ? 'ring-4 ring-white scale-125' : ''}`}
                >
                  <MapPin className="w-4 h-4" />
                </div>

                {/* Pulse ring for blocked / critical */}
                {(drainage.condition === 'Blocked' || drainage.condition === 'Critical') && (
                  <div
                    className={`absolute -inset-1.5 rounded-full ${color.bg} opacity-50 animate-ping pointer-events-none`}
                  />
                )}

                {/* Tag */}
                <div className="mt-1 px-1.5 py-0.5 rounded bg-slate-900/90 border border-slate-700 text-[10px] text-slate-200 font-mono whitespace-nowrap shadow-sm">
                  {drainage.drainage_id}
                </div>
              </div>
            </div>
          );
        })}

        {/* Worker Markers (Green worker markers) */}
        {filteredWorkers.map((worker) => {
          const coords = projectCoords(worker.latitude, worker.longitude);
          const isSelected = selectedItem?.type === 'worker' && (selectedItem.data as Worker).worker_id === worker.worker_id;

          return (
            <div
              key={worker.worker_id}
              className="absolute transform -translate-x-1/2 -translate-y-1/2 cursor-pointer group z-15"
              style={{ left: `${coords.x}%`, top: `${coords.y}%` }}
              onClick={() => {
                setSelectedItem({ type: 'worker', data: worker });
                onSelectWorker?.(worker);
              }}
            >
              <div className="relative flex flex-col items-center">
                {/* Worker Marker circle */}
                <div
                  className={`w-8 h-8 rounded-full bg-emerald-500 border-2 border-white flex items-center justify-center text-white shadow-xl transition-transform duration-200 group-hover:scale-125 ${
                    isSelected ? 'ring-4 ring-emerald-300 scale-125' : ''
                  }`}
                >
                  <User className="w-4 h-4" />
                </div>

                {/* Active motion indicator */}
                {worker.availability === 'Busy' && (
                  <div className="absolute -top-1 -right-1 w-3 h-3 rounded-full bg-blue-500 border-2 border-slate-900 animate-pulse" />
                )}

                {/* Worker Code Label */}
                <div className="mt-1 px-2 py-0.5 rounded-full bg-emerald-950/90 border border-emerald-500/50 text-[10px] text-emerald-300 font-semibold whitespace-nowrap flex items-center gap-1 shadow-sm">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                  {worker.worker_code}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Interactive Detail Popover / Card at bottom */}
      {selectedItem && (
        <div className="absolute bottom-3 left-3 right-3 sm:right-auto sm:max-w-md z-30 p-4 rounded-xl bg-slate-900/95 backdrop-blur-md border border-slate-700 shadow-2xl text-white">
          <div className="flex items-start justify-between gap-3">
            <div>
              {selectedItem.type === 'drainage' ? (
                <>
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-mono font-bold text-blue-400">
                      {(selectedItem.data as DrainageLocation).drainage_id}
                    </span>
                    <span
                      className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                        getDrainageColor((selectedItem.data as DrainageLocation).condition).bg
                      }`}
                    >
                      {(selectedItem.data as DrainageLocation).condition}
                    </span>
                  </div>
                  <h4 className="font-semibold text-sm text-slate-100 mt-1">
                    {(selectedItem.data as DrainageLocation).location_name}
                  </h4>
                  <p className="text-xs text-slate-400 mt-0.5">
                    {(selectedItem.data as DrainageLocation).ward_name} &bull; Lat:{' '}
                    {(selectedItem.data as DrainageLocation).latitude}, Lng:{' '}
                    {(selectedItem.data as DrainageLocation).longitude}
                  </p>
                  <div className="mt-2 text-xs text-slate-300 bg-slate-800/80 p-2 rounded-lg border border-slate-700">
                    <span className="text-slate-400">Status: </span>
                    {(selectedItem.data as DrainageLocation).current_status}
                  </div>
                </>
              ) : (
                <>
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-mono font-bold text-emerald-400">
                      {(selectedItem.data as Worker).worker_code}
                    </span>
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-700 text-white">
                      {(selectedItem.data as Worker).availability}
                    </span>
                    {(selectedItem.data as Worker).verification_status === 'Verified' && (
                      <span className="flex items-center gap-1 text-[10px] text-emerald-400">
                        <ShieldCheck className="w-3 h-3" />
                        Verified
                      </span>
                    )}
                  </div>
                  <h4 className="font-semibold text-sm text-slate-100 mt-1">
                    {(selectedItem.data as Worker).worker_name}
                  </h4>
                  <p className="text-xs text-slate-400 mt-0.5">
                    Zone: {(selectedItem.data as Worker).zone_id.toUpperCase()} &bull; Phone:{' '}
                    {(selectedItem.data as Worker).phone}
                  </p>
                  <div className="mt-2 text-xs text-slate-300 flex items-center justify-between bg-slate-800/80 p-2 rounded-lg border border-slate-700">
                    <span>Completed Jobs: {(selectedItem.data as Worker).total_completed_jobs}</span>
                    <span>Machine Hours: {(selectedItem.data as Worker).total_machine_hours}h</span>
                  </div>
                </>
              )}
            </div>

            <button
              type="button"
              onClick={() => setSelectedItem(null)}
              className="p-1 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* Map Legend Overlay at bottom-right */}
      <div className="hidden sm:flex absolute bottom-3 right-3 z-20 items-center gap-3 px-3 py-1.5 rounded-lg bg-slate-900/90 backdrop-blur-md border border-slate-800 text-[11px] text-slate-300 pointer-events-none">
        <span className="flex items-center gap-1">
          <span className="w-2.5 h-2.5 rounded-full bg-emerald-500" /> Clean Drain
        </span>
        <span className="flex items-center gap-1">
          <span className="w-2.5 h-2.5 rounded-full bg-amber-500" /> Dirty Drain
        </span>
        <span className="flex items-center gap-1">
          <span className="w-2.5 h-2.5 rounded-full bg-rose-500" /> Blocked / Critical
        </span>
        <span className="flex items-center gap-1">
          <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 ring-2 ring-white/50" /> Live Worker
        </span>
      </div>
    </div>
  );
};
