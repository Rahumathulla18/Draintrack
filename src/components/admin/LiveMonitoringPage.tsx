import React, { useState, useEffect } from 'react';
import {
  Activity,
  Zap,
  Gauge,
  Droplets,
  Navigation,
  Clock,
  Radio,
  Power,
  RotateCcw,
  Sliders,
  ShieldAlert,
  CheckCircle2,
  RefreshCw
} from 'lucide-react';
import { MachineData } from '../../types';
import { TurbidityChart } from '../common/TurbidityChart';

interface LiveMonitoringPageProps {
  machineData: MachineData;
  onTogglePump: () => void;
  onToggleBrush: () => void;
  onToggleMachineStatus: () => void;
  onSimulateReadings?: (turbidity: number, distance: number) => void;
}

export const LiveMonitoringPage: React.FC<LiveMonitoringPageProps> = ({
  machineData,
  onTogglePump,
  onToggleBrush,
  onToggleMachineStatus,
  onSimulateReadings
}) => {
  const [activePreset, setActivePreset] = useState<number>(420);
  const [liveSec, setLiveSec] = useState(0);

  // Live telemetry heart-beat ticker
  useEffect(() => {
    const timer = setInterval(() => {
      setLiveSec((s) => s + 1);
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const readingsHistory = [
    { timestamp: '03:30 AM', turbidity: 850, label: 'Pre-desilting: Stagnant Sludge' },
    { timestamp: '03:55 AM', turbidity: 650, label: 'Mechanical Brush Agitation' },
    { timestamp: '04:20 AM', turbidity: 420, label: 'Suction Pump & Flushed' },
    { timestamp: '04:45 AM', turbidity: 190, label: 'Water Clarity Restored' }
  ];

  return (
    <div id="admin-live-monitoring-page" className="space-y-6">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-slate-900 via-slate-800 to-navy-900 rounded-xl p-5 sm:p-6 text-white shadow-md flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-ping" />
            <span className="text-xs font-mono text-cyan-300 font-bold uppercase tracking-wider">
              DrainTrack Unit #DT-02 Telemetry Live
            </span>
            <span className="text-xs text-slate-400">&bull; Submersible IoT Node</span>
          </div>
          <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-white">
            Portable Machine Live Monitoring &amp; Telemetry
          </h2>
          <p className="text-xs sm:text-sm text-slate-300 mt-1 max-w-2xl">
            Real-time sensor feed from the portable drainage cleaning machine operating in storm water conduits. The unit is manually positioned and moved by the sanitation worker.
          </p>
        </div>

        {/* Machine Status Callout */}
        <div className="flex flex-wrap items-center gap-2">
          <div className="px-3 py-1.5 rounded-lg bg-emerald-950/80 border border-emerald-500/50 text-emerald-300 text-xs font-mono font-bold flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            <span>MACHINE: {machineData.machine_status}</span>
          </div>
          <div className="px-3 py-1.5 rounded-lg bg-blue-950/80 border border-blue-500/50 text-blue-300 text-xs font-mono font-bold">
            GPS: CONNECTED
          </div>
        </div>
      </div>

      {/* Real-time Style Status Cards (Specified by user prompt) */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4">
        {/* Machine Status */}
        <div className="bg-white rounded-xl p-4 border border-slate-200 shadow-xs">
          <div className="flex items-center justify-between text-slate-500 mb-2">
            <span className="text-xs font-medium uppercase tracking-wider">Machine Status</span>
            <div
              className={`p-2 rounded-lg ${
                machineData.machine_status === 'RUNNING' ? 'bg-emerald-50 text-emerald-600' : 'bg-slate-100 text-slate-500'
              }`}
            >
              <Power className="w-4 h-4" />
            </div>
          </div>
          <div className="flex items-baseline justify-between">
            <span
              className={`text-xl sm:text-2xl font-black ${
                machineData.machine_status === 'RUNNING' ? 'text-emerald-600' : 'text-slate-700'
              }`}
            >
              {machineData.machine_status}
            </span>
            <span className="text-xs text-slate-400 font-mono">BATTERY {machineData.battery_level || 84}%</span>
          </div>
          <div className="text-[11px] text-slate-500 mt-1">Direct DC high-torque drive</div>
        </div>

        {/* Pump Status */}
        <div className="bg-white rounded-xl p-4 border border-slate-200 shadow-xs">
          <div className="flex items-center justify-between text-slate-500 mb-2">
            <span className="text-xs font-medium uppercase tracking-wider">Sludge Pump</span>
            <div
              className={`p-2 rounded-lg ${
                machineData.pump_status === 'ON' ? 'bg-blue-50 text-blue-600' : 'bg-slate-100 text-slate-500'
              }`}
            >
              <Droplets className="w-4 h-4" />
            </div>
          </div>
          <div className="flex items-baseline justify-between">
            <span
              className={`text-xl sm:text-2xl font-black ${
                machineData.pump_status === 'ON' ? 'text-blue-600' : 'text-slate-700'
              }`}
            >
              PUMP: {machineData.pump_status}
            </span>
            <span className="text-xs text-slate-400 font-mono">3.2 bar</span>
          </div>
          <div className="text-[11px] text-slate-500 mt-1">High-pressure slurry suction</div>
        </div>

        {/* Brush Status */}
        <div className="bg-white rounded-xl p-4 border border-slate-200 shadow-xs">
          <div className="flex items-center justify-between text-slate-500 mb-2">
            <span className="text-xs font-medium uppercase tracking-wider">Rotating Brush</span>
            <div
              className={`p-2 rounded-lg ${
                machineData.brush_status === 'ON' ? 'bg-amber-50 text-amber-600' : 'bg-slate-100 text-slate-500'
              }`}
            >
              <RotateCcw
                className={`w-4 h-4 ${machineData.brush_status === 'ON' ? 'animate-spin' : ''}`}
              />
            </div>
          </div>
          <div className="flex items-baseline justify-between">
            <span
              className={`text-xl sm:text-2xl font-black ${
                machineData.brush_status === 'ON' ? 'text-amber-600' : 'text-slate-700'
              }`}
            >
              BRUSH: {machineData.brush_status}
            </span>
            <span className="text-xs text-slate-400 font-mono">380 RPM</span>
          </div>
          <div className="text-[11px] text-slate-500 mt-1">Rotating desilter brush head</div>
        </div>

        {/* Turbidity */}
        <div className="bg-white rounded-xl p-4 border border-slate-200 shadow-xs">
          <div className="flex items-center justify-between text-slate-500 mb-2">
            <span className="text-xs font-medium uppercase tracking-wider">Turbidity (NTU)</span>
            <div className="p-2 rounded-lg bg-teal-50 text-teal-600">
              <Gauge className="w-4 h-4" />
            </div>
          </div>
          <div className="flex items-baseline justify-between">
            <span className="text-xl sm:text-2xl font-black text-teal-600">
              {machineData.turbidity} NTU
            </span>
            <span className="text-xs text-emerald-600 font-semibold">&darr; Dropping</span>
          </div>
          <div className="text-[11px] text-slate-500 mt-1">Optical absorption sensor</div>
        </div>
      </div>

      {/* Second Row of Sensor Cards: Water Level, Distance Travelled, GPS, Last Update */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4">
        {/* Water Level */}
        <div className="bg-white rounded-xl p-4 border border-slate-200 shadow-xs">
          <div className="text-xs font-medium uppercase tracking-wider text-slate-500 mb-1">
            Water Level
          </div>
          <div className="text-2xl font-bold text-slate-900">{machineData.water_level} cm</div>
          <div className="text-[11px] text-slate-500 mt-1">Ultrasonic level sensor</div>
        </div>

        {/* Distance Travelled */}
        <div className="bg-white rounded-xl p-4 border border-slate-200 shadow-xs">
          <div className="text-xs font-medium uppercase tracking-wider text-slate-500 mb-1">
            Distance Travelled
          </div>
          <div className="text-2xl font-bold text-slate-900">{machineData.distance_travelled} m</div>
          <div className="text-[11px] text-slate-500 mt-1">Wheel encoder telemetry</div>
        </div>

        {/* GPS Location */}
        <div className="bg-white rounded-xl p-4 border border-slate-200 shadow-xs">
          <div className="text-xs font-medium uppercase tracking-wider text-slate-500 mb-1">
            GPS Coordinates
          </div>
          <div className="text-xs font-mono font-bold text-slate-900">
            {machineData.latitude.toFixed(4)}° N, {machineData.longitude.toFixed(4)}° E
          </div>
          <div className="text-[11px] text-slate-500 mt-1">Halasuru Canal Sector B</div>
        </div>

        {/* Last Update */}
        <div className="bg-white rounded-xl p-4 border border-slate-200 shadow-xs">
          <div className="text-xs font-medium uppercase tracking-wider text-slate-500 mb-1">
            Last Telemetry Beat
          </div>
          <div className="text-xs font-bold text-slate-900">{machineData.recorded_at}</div>
          <div className="text-[11px] text-emerald-600 font-medium mt-1">Live streaming &bull; 0.8s ping</div>
        </div>
      </div>

      {/* Turbidity Graph (Prominently featured as instructed) */}
      <TurbidityChart
        data={readingsHistory}
        currentTurbidity={machineData.turbidity}
        height={240}
        showExplanation={true}
      />

      {/* Live Machine Interactive Controls (For demonstration and testing) */}
      <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-xs">
        <div className="flex flex-wrap items-center justify-between gap-2 mb-4">
          <div>
            <h3 className="font-bold text-slate-900 text-sm sm:text-base flex items-center gap-2">
              <Sliders className="w-4 h-4 text-blue-600" />
              <span>IoT Actuator Hardware Controls &amp; Simulation</span>
            </h3>
            <p className="text-xs text-slate-500">
              Remotely toggle pump, rotating brush, and cycle through water clarity stages
            </p>
          </div>

          <span className="text-xs text-slate-400 font-mono">Firmware: v2.4.1-SIH-PROD</span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          {/* Toggle Machine Power */}
          <button
            type="button"
            onClick={onToggleMachineStatus}
            className={`p-3 rounded-xl border flex items-center justify-between transition-all ${
              machineData.machine_status === 'RUNNING'
                ? 'bg-emerald-50 border-emerald-300 text-emerald-900'
                : 'bg-slate-50 border-slate-200 text-slate-700'
            }`}
          >
            <div className="flex items-center gap-2.5">
              <Power className="w-5 h-5 text-emerald-600" />
              <div className="text-left">
                <span className="font-bold block text-xs">Machine Power</span>
                <span className="text-[10px] opacity-80">
                  {machineData.machine_status === 'RUNNING' ? 'Running' : 'Halted'}
                </span>
              </div>
            </div>
            <span className="text-xs font-bold px-2 py-1 rounded bg-white border border-emerald-200">
              Toggle
            </span>
          </button>

          {/* Toggle Sludge Pump */}
          <button
            type="button"
            onClick={onTogglePump}
            className={`p-3 rounded-xl border flex items-center justify-between transition-all ${
              machineData.pump_status === 'ON'
                ? 'bg-blue-50 border-blue-300 text-blue-900'
                : 'bg-slate-50 border-slate-200 text-slate-700'
            }`}
          >
            <div className="flex items-center gap-2.5">
              <Droplets className="w-5 h-5 text-blue-600" />
              <div className="text-left">
                <span className="font-bold block text-xs">Slurry Pump</span>
                <span className="text-[10px] opacity-80">
                  {machineData.pump_status === 'ON' ? 'Active' : 'Off'}
                </span>
              </div>
            </div>
            <span className="text-xs font-bold px-2 py-1 rounded bg-white border border-blue-200">
              {machineData.pump_status === 'ON' ? 'STOP PUMP' : 'START PUMP'}
            </span>
          </button>

          {/* Toggle Rotary Brush */}
          <button
            type="button"
            onClick={onToggleBrush}
            className={`p-3 rounded-xl border flex items-center justify-between transition-all ${
              machineData.brush_status === 'ON'
                ? 'bg-amber-50 border-amber-300 text-amber-900'
                : 'bg-slate-50 border-slate-200 text-slate-700'
            }`}
          >
            <div className="flex items-center gap-2.5">
              <RotateCcw className="w-5 h-5 text-amber-600" />
              <div className="text-left">
                <span className="font-bold block text-xs">Rotating Brush</span>
                <span className="text-[10px] opacity-80">
                  {machineData.brush_status === 'ON' ? 'Spinning' : 'Off'}
                </span>
              </div>
            </div>
            <span className="text-xs font-bold px-2 py-1 rounded bg-white border border-amber-200">
              {machineData.brush_status === 'ON' ? 'STOP BRUSH' : 'START BRUSH'}
            </span>
          </button>
        </div>

        {/* Preset Turbidity Milestones */}
        <div className="mt-4 pt-4 border-t border-slate-100 flex flex-wrap items-center justify-between gap-2 text-xs">
          <span className="text-slate-500 font-medium">
            Simulate Turbidity Telemetry Milestone:
          </span>
          <div className="flex items-center gap-1.5 flex-wrap">
            {[850, 650, 420, 190].map((tVal) => (
              <button
                key={tVal}
                type="button"
                onClick={() => {
                  setActivePreset(tVal);
                  onSimulateReadings?.(tVal, machineData.distance_travelled + 5);
                }}
                className={`px-2.5 py-1 rounded text-xs font-bold transition-colors ${
                  machineData.turbidity === tVal
                    ? 'bg-slate-900 text-white'
                    : 'bg-slate-100 hover:bg-slate-200 text-slate-700'
                }`}
              >
                {tVal} NTU {tVal === 190 ? '(Target Clean)' : ''}
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
