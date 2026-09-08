import React, { useState } from 'react';
import {
  Map as MapIcon,
  Layers,
  MapPin,
  Users,
  AlertTriangle,
  CheckCircle2,
  Filter,
  Navigation
} from 'lucide-react';
import { DrainageLocation, Worker } from '../../types';
import { DrainageMap } from '../common/DrainageMap';
import { StatusBadge } from '../common/StatusBadge';

interface MapPageProps {
  drainages: DrainageLocation[];
  workers: Worker[];
  onSelectDrainage?: (d: DrainageLocation) => void;
  onSelectWorker?: (w: Worker) => void;
}

export const MapPage: React.FC<MapPageProps> = ({
  drainages = [],
  workers = [],
  onSelectDrainage,
  onSelectWorker
}) => {
  const [activeFilter, setActiveFilter] = useState<'ALL' | 'CRITICAL' | 'WORKERS' | 'CLEAN'>('ALL');
  const [selectedDrainage, setSelectedDrainage] = useState<DrainageLocation | null>(null);

  const blockedCount = drainages.filter((d) => d.condition === 'Blocked' || d.condition === 'Critical').length;
  const cleanCount = drainages.filter((d) => d.condition === 'Good').length;
  const activeWorkersCount = workers.filter((w) => w.availability === 'Busy' || w.availability === 'Available').length;

  const handleDrainageClick = (d: DrainageLocation) => {
    setSelectedDrainage(d);
    if (onSelectDrainage) onSelectDrainage(d);
  };

  return (
    <div id="admin-map-page" className="space-y-6">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-slate-900 via-slate-800 to-blue-950 rounded-2xl p-6 text-white shadow-md flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1.5">
            <span className="px-2 py-0.5 rounded bg-blue-500/20 text-cyan-300 font-mono text-xs font-semibold uppercase tracking-wider border border-blue-500/30">
              GIS Spatial Grid
            </span>
            <span className="text-xs text-slate-300 hidden sm:inline">&bull; 4 Wards Correlated</span>
          </div>
          <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-white flex items-center gap-2.5">
            <MapIcon className="w-6 h-6 text-cyan-400" />
            <span>Drainage Network GIS &amp; Worker Telemetry Map</span>
          </h1>
          <p className="text-xs sm:text-sm text-slate-300 mt-1 max-w-2xl leading-relaxed">
            Live geographic visualization of stormwater conduits, flow directions, localized sediment blocks, and active rover coordinates.
          </p>
        </div>

        {/* Quick Stats */}
        <div className="flex items-center gap-2 sm:gap-3 bg-white/10 p-2.5 rounded-xl border border-white/15 text-xs">
          <div className="px-2.5 py-1 text-center border-r border-white/20">
            <span className="text-[10px] text-slate-300 uppercase block font-semibold">Conduits</span>
            <span className="font-extrabold text-white text-base">{drainages.length}</span>
          </div>
          <div className="px-2.5 py-1 text-center border-r border-white/20">
            <span className="text-[10px] text-rose-300 uppercase block font-semibold">Blocked</span>
            <span className="font-extrabold text-rose-400 text-base">{blockedCount}</span>
          </div>
          <div className="px-2.5 py-1 text-center">
            <span className="text-[10px] text-cyan-300 uppercase block font-semibold">Field Crew</span>
            <span className="font-extrabold text-cyan-400 text-base">{activeWorkersCount}</span>
          </div>
        </div>
      </div>

      {/* Interactive Map Card */}
      <div className="bg-white rounded-2xl border border-slate-200 p-4 sm:p-5 shadow-xs space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-3 text-xs">
          <div className="flex items-center gap-2">
            <Layers className="w-4 h-4 text-blue-600" />
            <span className="font-bold text-slate-800">Map Visualization Layer:</span>
            <div className="flex items-center bg-slate-100 p-0.5 rounded-lg border border-slate-200">
              <button
                type="button"
                onClick={() => setActiveFilter('ALL')}
                className={`px-2.5 py-1 rounded-md font-semibold transition-all ${
                  activeFilter === 'ALL' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-600'
                }`}
              >
                All Assets
              </button>
              <button
                type="button"
                onClick={() => setActiveFilter('CRITICAL')}
                className={`px-2.5 py-1 rounded-md font-semibold transition-all ${
                  activeFilter === 'CRITICAL' ? 'bg-rose-600 text-white shadow-xs' : 'text-slate-600'
                }`}
              >
                Blocked ({blockedCount})
              </button>
              <button
                type="button"
                onClick={() => setActiveFilter('WORKERS')}
                className={`px-2.5 py-1 rounded-md font-semibold transition-all ${
                  activeFilter === 'WORKERS' ? 'bg-blue-600 text-white shadow-xs' : 'text-slate-600'
                }`}
              >
                Workers ({workers.length})
              </button>
            </div>
          </div>

          <div className="flex items-center gap-3 text-[11px] text-slate-500 font-medium">
            <span className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-500" />
              <span>Good</span>
            </span>
            <span className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-amber-500" />
              <span>Moderate</span>
            </span>
            <span className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-rose-500" />
              <span>Blocked/Critical</span>
            </span>
            <span className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-blue-600" />
              <span>Worker Node</span>
            </span>
          </div>
        </div>

        {/* The DrainageMap component */}
        <DrainageMap
          drainages={
            activeFilter === 'CRITICAL'
              ? drainages.filter((d) => d.condition === 'Blocked' || d.condition === 'Critical')
              : drainages
          }
          workers={workers}
          onSelectDrainage={handleDrainageClick}
          onSelectWorker={onSelectWorker}
          height="520px"
          showControls={true}
        />
      </div>

      {/* Selected Drainage Conduit Detail or Quick List */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {drainages.map((d) => (
          <div
            key={d.drainage_id}
            onClick={() => handleDrainageClick(d)}
            className={`p-4 rounded-xl border transition-all cursor-pointer ${
              selectedDrainage?.drainage_id === d.drainage_id
                ? 'bg-blue-50/70 border-blue-400 ring-2 ring-blue-500/20 shadow-xs'
                : 'bg-white border-slate-200 hover:border-slate-300 shadow-xs'
            }`}
          >
            <div className="flex items-center justify-between mb-1.5">
              <span className="font-mono text-xs font-bold text-slate-700 bg-slate-100 px-2 py-0.5 rounded">
                {d.drainage_id}
              </span>
              <StatusBadge status={d.condition} type="condition" size="sm" />
            </div>
            <h4 className="font-bold text-slate-900 text-sm">{d.location_name}</h4>
            <div className="text-xs text-slate-500 mt-0.5">
              {d.ward_name} &bull; {d.taluk_name}
            </div>
            <div className="mt-2 pt-2 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-600">
              <span>Length: {d.length_meters}m</span>
              <span>Last Cleaned: {d.last_cleaned}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
