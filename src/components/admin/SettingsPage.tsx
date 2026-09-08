import React, { useState } from 'react';
import {
  Settings as SettingsIcon,
  Sliders,
  Shield,
  Bell,
  Cpu,
  Save,
  RotateCcw,
  CheckCircle2,
  AlertTriangle,
  Radio
} from 'lucide-react';

interface SettingsPageProps {
  onResetData?: () => void;
}

export const SettingsPage: React.FC<SettingsPageProps> = ({ onResetData }) => {
  const [turbidityThreshold, setTurbidityThreshold] = useState(200);
  const [waterLevelMax, setWaterLevelMax] = useState(85);
  const [sampleInterval, setSampleInterval] = useState(5);
  const [autoDispatch, setAutoDispatch] = useState(true);
  const [smsAlerts, setSmsAlerts] = useState(true);
  const [savedSuccess, setSavedSuccess] = useState(false);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    setSavedSuccess(true);
    setTimeout(() => {
      setSavedSuccess(false);
    }, 3000);
  };

  return (
    <div id="admin-settings-page" className="space-y-6 max-w-4xl mx-auto">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-slate-900 via-slate-800 to-blue-950 rounded-2xl p-6 text-white shadow-md flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1.5">
            <span className="px-2 py-0.5 rounded bg-blue-500/20 text-cyan-300 font-mono text-xs font-semibold uppercase tracking-wider border border-blue-500/30">
              System Administration
            </span>
            <span className="text-xs text-slate-300 hidden sm:inline">&bull; BBMP Storm Water Drain</span>
          </div>
          <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-white flex items-center gap-2.5">
            <SettingsIcon className="w-6 h-6 text-cyan-400" />
            <span>DrainTrack Platform Configuration</span>
          </h1>
          <p className="text-xs sm:text-sm text-slate-300 mt-1 max-w-xl leading-relaxed">
            Tune IoT sensor sampling frequencies, automatic worker dispatch heuristics, and municipal compliance thresholds.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse" />
          <span className="text-xs font-mono text-emerald-300 font-semibold">Active Profile v2.4</span>
        </div>
      </div>

      {savedSuccess && (
        <div className="p-3.5 rounded-xl bg-emerald-50 border border-emerald-300 text-emerald-900 text-xs font-semibold flex items-center gap-2 animate-in fade-in">
          <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
          <span>Configuration saved and propagated to all connected IoT drainage machines!</span>
        </div>
      )}

      <form onSubmit={handleSave} className="space-y-6">
        {/* IoT Machine Telemetry Thresholds */}
        <div className="bg-white rounded-2xl border border-slate-200 p-5 sm:p-6 shadow-xs space-y-4">
          <h3 className="font-bold text-slate-900 text-sm flex items-center gap-2">
            <Cpu className="w-4 h-4 text-blue-600" />
            <span>IoT Sensor Telemetry Thresholds</span>
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
            <div>
              <label className="block text-slate-700 font-semibold mb-1">
                Turbidity Clearance Target (NTU)
              </label>
              <input
                type="number"
                value={turbidityThreshold}
                onChange={(e) => setTurbidityThreshold(Number(e.target.value))}
                className="w-full p-2.5 rounded-lg border border-slate-200 text-xs"
              />
              <span className="text-[11px] text-slate-500 mt-1 block">
                Work is considered verified when conduit water drops below this level (default: 200 NTU).
              </span>
            </div>

            <div>
              <label className="block text-slate-700 font-semibold mb-1">
                Ultrasonic Water Level Inundation Limit (cm)
              </label>
              <input
                type="number"
                value={waterLevelMax}
                onChange={(e) => setWaterLevelMax(Number(e.target.value))}
                className="w-full p-2.5 rounded-lg border border-slate-200 text-xs"
              />
              <span className="text-[11px] text-slate-500 mt-1 block">
                Triggers critical flood alert on the central municipal dashboard (default: 85 cm).
              </span>
            </div>

            <div>
              <label className="block text-slate-700 font-semibold mb-1">
                Sensor Telemetry Sampling Interval (Seconds)
              </label>
              <select
                value={sampleInterval}
                onChange={(e) => setSampleInterval(Number(e.target.value))}
                className="w-full p-2.5 rounded-lg border border-slate-200 text-xs bg-white"
              >
                <option value={2}>2 seconds (High Frequency)</option>
                <option value={5}>5 seconds (Standard Battery Balance)</option>
                <option value={10}>10 seconds (Power Saver)</option>
              </select>
            </div>

            <div>
              <label className="block text-slate-700 font-semibold mb-1">
                Machine Rotary Brush Max RPM
              </label>
              <input
                type="text"
                defaultValue="450 RPM"
                disabled
                className="w-full p-2.5 rounded-lg border border-slate-200 text-xs bg-slate-50 text-slate-500"
              />
            </div>
          </div>
        </div>

        {/* Dispatch & Automated Redressal */}
        <div className="bg-white rounded-2xl border border-slate-200 p-5 sm:p-6 shadow-xs space-y-4">
          <h3 className="font-bold text-slate-900 text-sm flex items-center gap-2">
            <Sliders className="w-4 h-4 text-blue-600" />
            <span>Automated Worker Dispatch Rules</span>
          </h3>

          <div className="space-y-3 text-xs">
            <label className="flex items-start gap-3 p-3 rounded-xl border border-slate-200 hover:bg-slate-50 cursor-pointer">
              <input
                type="checkbox"
                checked={autoDispatch}
                onChange={(e) => setAutoDispatch(e.target.checked)}
                className="mt-0.5 rounded text-blue-600 focus:ring-blue-500"
              />
              <div>
                <strong className="text-slate-900 block font-semibold">
                  Enable Proximity-Based Auto Assignment
                </strong>
                <span className="text-slate-500 text-[11px]">
                  Automatically recommends nearest available sanitation worker when a High-severity citizen complaint is registered.
                </span>
              </div>
            </label>

            <label className="flex items-start gap-3 p-3 rounded-xl border border-slate-200 hover:bg-slate-50 cursor-pointer">
              <input
                type="checkbox"
                checked={smsAlerts}
                onChange={(e) => setSmsAlerts(e.target.checked)}
                className="mt-0.5 rounded text-blue-600 focus:ring-blue-500"
              />
              <div>
                <strong className="text-slate-900 block font-semibold">
                  Citizen SMS Progress Updates
                </strong>
                <span className="text-slate-500 text-[11px]">
                  Send automated SMS dispatch notifications to citizens when the portable de-silting rover reaches their sector.
                </span>
              </div>
            </label>
          </div>
        </div>

        {/* Municipal Authority Identity */}
        <div className="bg-white rounded-2xl border border-slate-200 p-5 sm:p-6 shadow-xs space-y-3">
          <h3 className="font-bold text-slate-900 text-sm flex items-center gap-2">
            <Shield className="w-4 h-4 text-blue-600" />
            <span>Municipal Authority Identity</span>
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
            <div>
              <label className="block text-slate-700 font-semibold mb-1">Governing Body</label>
              <input
                type="text"
                defaultValue="Bruhat Bengaluru Mahanagara Palike (BBMP)"
                className="w-full p-2.5 rounded-lg border border-slate-200 text-xs bg-slate-50"
                readOnly
              />
            </div>
            <div>
              <label className="block text-slate-700 font-semibold mb-1">Sanctioning Executive Engineer</label>
              <input
                type="text"
                defaultValue="R. Sundar, Executive Engineer (SWD Division)"
                className="w-full p-2.5 rounded-lg border border-slate-200 text-xs bg-slate-50"
                readOnly
              />
            </div>
          </div>
        </div>

        {/* Save Button */}
        <div className="flex items-center justify-between pt-2">
          {onResetData && (
            <button
              type="button"
              onClick={onResetData}
              className="flex items-center gap-1.5 px-3.5 py-2.5 rounded-xl border border-rose-300 text-rose-700 hover:bg-rose-50 text-xs font-semibold transition-all"
            >
              <RotateCcw className="w-4 h-4" />
              <span>Reset Demo Seed Data</span>
            </button>
          )}

          <button
            type="submit"
            className="ml-auto flex items-center gap-2 px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold shadow-md transition-all"
          >
            <Save className="w-4 h-4" />
            <span>Save Configuration</span>
          </button>
        </div>
      </form>
    </div>
  );
};
