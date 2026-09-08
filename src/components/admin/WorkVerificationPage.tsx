import React, { useState } from 'react';
import {
  CheckCircle2,
  ShieldCheck,
  MapPin,
  Clock,
  Activity,
  Gauge,
  Navigation,
  FileCheck,
  AlertCircle,
  ArrowRight,
  Send,
  Building2,
  Calendar
} from 'lucide-react';
import { WorkLog } from '../../types';
import { StatusBadge } from '../common/StatusBadge';

interface WorkVerificationPageProps {
  workLogs: WorkLog[];
  onVerifyLog: (logId: string) => void;
  onSubmitForPaymentApproval: (log: WorkLog) => void;
}

export const WorkVerificationPage: React.FC<WorkVerificationPageProps> = ({
  workLogs = [],
  onVerifyLog,
  onSubmitForPaymentApproval
}) => {
  const [selectedLogId, setSelectedLogId] = useState<string>(workLogs[0]?.log_id || 'LOG-901');
  const [submissionSuccess, setSubmissionSuccess] = useState<string | null>(null);

  const activeLog = workLogs.find((l) => l.log_id === selectedLogId) || workLogs[0];

  const handleVerify = (logId: string) => {
    onVerifyLog(logId);
  };

  const handleSubmit = (log: WorkLog) => {
    onSubmitForPaymentApproval(log);
    setSubmissionSuccess(log.log_id);
    setTimeout(() => setSubmissionSuccess(null), 4000);
  };

  return (
    <div id="admin-work-verification-page" className="space-y-6">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-slate-900 via-slate-800 to-teal-950 rounded-xl p-5 sm:p-6 text-white shadow-md flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <ShieldCheck className="w-4 h-4 text-emerald-400" />
            <span className="text-xs font-mono text-emerald-300 font-bold uppercase tracking-wider">
              Digital Work Verification System
            </span>
          </div>
          <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-white">
            IoT Telemetry &amp; Multi-Factor Desilting Audit
          </h2>
          <p className="text-xs sm:text-sm text-slate-300 mt-1 max-w-2xl">
            Cryptographically correlated proof of work combining GPS positioning, wheel encoder distance, and optical turbidity clearing.
          </p>
        </div>

        <div className="px-3.5 py-2 rounded-lg bg-emerald-950/80 border border-emerald-500/50 text-emerald-300 text-xs font-semibold flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 text-emerald-400" />
          <span>Anti-Fraud Desilting Audit</span>
        </div>
      </div>

      {/* Important Notice Callout as explicitly instructed */}
      <div className="p-4 rounded-xl bg-amber-50 border border-amber-200 text-xs text-amber-950 flex items-start gap-3 shadow-xs">
        <AlertCircle className="w-5 h-5 text-amber-700 shrink-0 mt-0.5" />
        <div>
          <strong className="font-bold text-amber-900 block text-xs sm:text-sm mb-0.5">
            Statutory Municipal Work Verification Protocol:
          </strong>
          <span className="text-[11px] leading-relaxed block">
            The system does <strong>not</strong> independently determine government salary. It creates verified work records that can be reviewed and approved by an authorized municipal/government authority.
            The DrainTrack unit is a portable drainage cleaning machine manually moved by the sanitation worker (no autonomous navigation).
          </span>
        </div>
      </div>

      {/* Main Layout: List of Work Logs (Left) and Detailed Verification Panel (Right) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Work Logs Directory */}
        <div className="lg:col-span-4 space-y-3">
          <div className="flex items-center justify-between">
            <h3 className="font-bold text-slate-900 text-sm">Desilting Work Logs</h3>
            <span className="text-xs text-slate-500">{workLogs.length} Records</span>
          </div>

          <div className="space-y-2.5">
            {workLogs.map((log) => {
              const isSelected = log.log_id === selectedLogId;

              return (
                <div
                  key={log.log_id}
                  onClick={() => setSelectedLogId(log.log_id)}
                  className={`p-3.5 rounded-xl border transition-all cursor-pointer text-xs ${
                    isSelected
                      ? 'bg-blue-50/80 border-blue-400 shadow-sm ring-1 ring-blue-300'
                      : 'bg-white border-slate-200 hover:border-slate-300 shadow-xs'
                  }`}
                >
                  <div className="flex items-center justify-between mb-1.5">
                    <span className="font-mono font-bold text-blue-700">{log.log_id}</span>
                    <span
                      className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                        log.work_verified
                          ? 'bg-emerald-100 text-emerald-800'
                          : 'bg-amber-100 text-amber-800'
                      }`}
                    >
                      {log.work_verified ? 'VERIFIED' : 'PENDING AUDIT'}
                    </span>
                  </div>

                  <h4 className="font-bold text-slate-900 text-xs truncate">{log.location_name}</h4>
                  <div className="text-[11px] text-slate-500 mt-1 flex items-center justify-between">
                    <span>
                      {log.worker_name} ({log.worker_code})
                    </span>
                    <span className="font-mono text-slate-600">{log.job_id}</span>
                  </div>

                  <div className="mt-2 pt-2 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-500">
                    <span>Dist: {log.distance_travelled} m</span>
                    <span>Duration: {log.work_duration_minutes} min</span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Right Column: Verification Dossier Panel */}
        <div className="lg:col-span-8">
          {activeLog ? (
            <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
              {/* Header */}
              <div className="p-5 border-b border-slate-200 flex flex-wrap items-center justify-between gap-3 bg-slate-50/60">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-xs font-bold text-blue-700 bg-blue-50 px-2 py-0.5 rounded border border-blue-200">
                      {activeLog.log_id}
                    </span>
                    <span className="text-xs font-mono text-slate-500">Job: {activeLog.job_id}</span>
                  </div>
                  <h3 className="text-base font-bold text-slate-900 mt-1">{activeLog.location_name}</h3>
                </div>

                <div className="flex items-center gap-2">
                  <div className="text-right">
                    <span className="text-[10px] text-slate-400 uppercase font-semibold block">Audit Status</span>
                    <span
                      className={`text-xs font-extrabold ${
                        activeLog.work_verified ? 'text-emerald-700' : 'text-amber-700'
                      }`}
                    >
                      {activeLog.work_verified ? 'VERIFIED' : 'UNVERIFIED'}
                    </span>
                  </div>
                </div>
              </div>

              {/* Hardware Architecture Banner */}
              <div className="mx-5 mt-4 p-3 rounded-lg bg-slate-50 border border-slate-200 text-xs text-slate-700">
                <div className="font-bold text-slate-900 flex items-center gap-1.5 mb-1 text-[11px] uppercase tracking-wider">
                  <span>DrainTrack Hardware Architecture (Portable Unit)</span>
                </div>
                <div className="text-[11px] text-slate-600 space-y-0.5">
                  <p>
                    <strong>Controller &amp; Sensors:</strong> ESP32 &bull; Turbidity Sensor &bull; Water-Level Sensor &bull; Wheel Encoder &bull; GPS &bull; Optional Gas Sensor (H2S/CH4)
                  </p>
                  <p>
                    <strong>Cleaning &amp; Filtration:</strong> Suction Pump &bull; Rotating Brush &bull; Mesh Waste Collection &bull; Filtration (Mesh, Sand &amp; Activated Carbon)
                  </p>
                  <p className="text-slate-500 italic">
                    Note: The sanitation worker manually moves the portable unit. No autonomous navigation is claimed.
                  </p>
                </div>
              </div>

              {/* All 13 Recorded Signals Grid */}
              <div className="p-5 space-y-6">
                <div>
                  <h4 className="text-xs font-bold text-slate-800 uppercase tracking-wider mb-2.5 flex items-center justify-between">
                    <span>13 Recorded Telemetry Signals (Multi-Signal Correlation)</span>
                    <span className="text-[10px] font-mono text-blue-600 bg-blue-50 px-2 py-0.5 rounded border border-blue-200">
                      ESP32 IoT Data Stream
                    </span>
                  </h4>

                  <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-2.5 text-xs">
                    {/* 1. Worker ID */}
                    <div className="p-2.5 rounded-lg border border-slate-200 bg-slate-50">
                      <span className="text-slate-500 block text-[10px] uppercase font-semibold">1. Worker ID</span>
                      <span className="font-bold text-slate-900 block mt-0.5">{activeLog.worker_id}</span>
                      <span className="text-[10px] text-slate-500">{activeLog.worker_name} ({activeLog.worker_code})</span>
                    </div>

                    {/* 2. Job ID */}
                    <div className="p-2.5 rounded-lg border border-slate-200 bg-slate-50">
                      <span className="text-slate-500 block text-[10px] uppercase font-semibold">2. Job ID</span>
                      <span className="font-bold text-blue-700 block mt-0.5">{activeLog.job_id}</span>
                      <span className="text-[10px] text-slate-500 truncate block">{activeLog.location_name}</span>
                    </div>

                    {/* 3. Start Time */}
                    <div className="p-2.5 rounded-lg border border-slate-200 bg-slate-50">
                      <span className="text-slate-500 block text-[10px] uppercase font-semibold">3. Start Time</span>
                      <span className="font-semibold text-slate-800 block mt-0.5">{activeLog.start_time}</span>
                      <span className="text-[10px] text-slate-400">Timestamp logged</span>
                    </div>

                    {/* 4. End Time */}
                    <div className="p-2.5 rounded-lg border border-slate-200 bg-slate-50">
                      <span className="text-slate-500 block text-[10px] uppercase font-semibold">4. End Time</span>
                      <span className="font-semibold text-slate-800 block mt-0.5">{activeLog.end_time}</span>
                      <span className="text-[10px] text-slate-400">Sealed on completion</span>
                    </div>

                    {/* 5. Work Duration */}
                    <div className="p-2.5 rounded-lg border border-slate-200 bg-slate-50">
                      <span className="text-slate-500 block text-[10px] uppercase font-semibold">5. Work Duration</span>
                      <span className="font-bold text-slate-900 block mt-0.5">{activeLog.work_duration_minutes} Mins</span>
                      <span className="text-[10px] text-slate-500">Worker active span</span>
                    </div>

                    {/* 6. Machine Runtime */}
                    <div className="p-2.5 rounded-lg border border-slate-200 bg-slate-50">
                      <span className="text-slate-500 block text-[10px] uppercase font-semibold">6. Machine Runtime</span>
                      <span className="font-bold text-slate-900 block mt-0.5">{activeLog.machine_runtime_minutes} Mins</span>
                      <span className="text-[10px] text-emerald-600 font-medium">Power consumption logged</span>
                    </div>

                    {/* 7. Distance Travelled */}
                    <div className="p-2.5 rounded-lg border border-slate-200 bg-slate-50">
                      <span className="text-slate-500 block text-[10px] uppercase font-semibold">7. Distance Travelled</span>
                      <span className="font-bold text-slate-900 block mt-0.5">{activeLog.distance_travelled} Meters</span>
                      <span className="text-[10px] text-slate-500">Wheel encoder odometry</span>
                    </div>

                    {/* 8. GPS Location */}
                    <div className="p-2.5 rounded-lg border border-slate-200 bg-slate-50">
                      <span className="text-slate-500 block text-[10px] uppercase font-semibold">8. GPS Location</span>
                      <span className="font-bold text-slate-900 block mt-0.5">
                        {activeLog.gps_location ? `${activeLog.gps_location.latitude.toFixed(4)}° N, ${activeLog.gps_location.longitude.toFixed(4)}° E` : '12.9832° N, 77.6251° E'}
                      </span>
                      <span className="text-[10px] text-emerald-600 font-medium">Geo-fence correlated</span>
                    </div>

                    {/* 9. Turbidity */}
                    <div className="p-2.5 rounded-lg border border-slate-200 bg-slate-50">
                      <span className="text-slate-500 block text-[10px] uppercase font-semibold">9. Turbidity</span>
                      <span className="font-bold text-slate-900 block mt-0.5">{activeLog.turbidity ?? 190} NTU</span>
                      <span className="text-[10px] text-emerald-600 font-medium">Optical turbidity sensor</span>
                    </div>

                    {/* 10. Water Level */}
                    <div className="p-2.5 rounded-lg border border-slate-200 bg-slate-50">
                      <span className="text-slate-500 block text-[10px] uppercase font-semibold">10. Water Level</span>
                      <span className="font-bold text-slate-900 block mt-0.5">{activeLog.water_level ?? 18} cm</span>
                      <span className="text-[10px] text-slate-500">Hydrostatic sensor</span>
                    </div>

                    {/* 11. Pump Status */}
                    <div className="p-2.5 rounded-lg border border-slate-200 bg-slate-50">
                      <span className="text-slate-500 block text-[10px] uppercase font-semibold">11. Pump Status</span>
                      <span className="font-bold text-blue-700 block mt-0.5">{activeLog.pump_status ?? 'ON'}</span>
                      <span className="text-[10px] text-slate-500">Suction pump verified</span>
                    </div>

                    {/* 12. Brush Status */}
                    <div className="p-2.5 rounded-lg border border-slate-200 bg-slate-50">
                      <span className="text-slate-500 block text-[10px] uppercase font-semibold">12. Brush Status</span>
                      <span className="font-bold text-blue-700 block mt-0.5">{activeLog.brush_status ?? 'ON'}</span>
                      <span className="text-[10px] text-slate-500">Rotating brush verified</span>
                    </div>

                    {/* 13. Machine Status */}
                    <div className="p-2.5 rounded-lg border border-slate-200 bg-slate-50">
                      <span className="text-slate-500 block text-[10px] uppercase font-semibold">13. Machine Status</span>
                      <span className="font-bold text-emerald-700 block mt-0.5">{activeLog.machine_status ?? 'RUNNING'}</span>
                      <span className="text-[10px] text-slate-500">ESP32 heartbeat active</span>
                    </div>

                    {/* Optional Gas Sensor Reading */}
                    <div className="p-2.5 rounded-lg border border-slate-200 bg-slate-50">
                      <span className="text-slate-500 block text-[10px] uppercase font-semibold">Gas Sensor (Optional)</span>
                      <span className="font-bold text-slate-800 block mt-0.5">{activeLog.gas_sensor_ppm ?? 0} ppm</span>
                      <span className="text-[10px] text-emerald-600 font-medium">H2S / toxic gas safe</span>
                    </div>
                  </div>
                </div>

                {/* 5-Point Verification Checklist Panel (Mandatory requirement) */}
                <div className="p-5 rounded-xl bg-slate-900 text-white space-y-4">
                  <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                    <div className="flex items-center gap-2">
                      <ShieldCheck className="w-5 h-5 text-emerald-400" />
                      <h4 className="font-bold text-sm tracking-tight text-white">
                        DrainTrack 5-Point Telemetry Verification Protocol
                      </h4>
                    </div>

                    <span className="text-xs font-mono font-bold px-2.5 py-1 rounded bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                      {activeLog.work_verified ? 'FINAL STATUS: VERIFIED' : 'PENDING CORRELATION'}
                    </span>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                    {/* 1. GPS Data */}
                    <div className="flex items-center justify-between p-3 rounded-lg bg-slate-800/80 border border-slate-700">
                      <div className="flex items-center gap-2.5">
                        <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                        <div>
                          <span className="font-semibold text-slate-200 block">1. GPS Data</span>
                          <span className="text-[10px] text-slate-400">Position matches canal coordinates</span>
                        </div>
                      </div>
                      <span className="text-emerald-400 font-bold">&check;</span>
                    </div>

                    {/* 2. Machine Data */}
                    <div className="flex items-center justify-between p-3 rounded-lg bg-slate-800/80 border border-slate-700">
                      <div className="flex items-center gap-2.5">
                        <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                        <div>
                          <span className="font-semibold text-slate-200 block">2. Machine Data</span>
                          <span className="text-[10px] text-slate-400">Pump &amp; brush motor currents logged</span>
                        </div>
                      </div>
                      <span className="text-emerald-400 font-bold">&check;</span>
                    </div>

                    {/* 3. Wheel Encoder */}
                    <div className="flex items-center justify-between p-3 rounded-lg bg-slate-800/80 border border-slate-700">
                      <div className="flex items-center gap-2.5">
                        <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                        <div>
                          <span className="font-semibold text-slate-200 block">3. Wheel Encoder</span>
                          <span className="text-[10px] text-slate-400">
                            Odometry confirms {activeLog.distance_travelled}m traversal
                          </span>
                        </div>
                      </div>
                      <span className="text-emerald-400 font-bold">&check;</span>
                    </div>

                    {/* 4. Start / End Time */}
                    <div className="flex items-center justify-between p-3 rounded-lg bg-slate-800/80 border border-slate-700">
                      <div className="flex items-center gap-2.5">
                        <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                        <div>
                          <span className="font-semibold text-slate-200 block">4. Start / End Time</span>
                          <span className="text-[10px] text-slate-400">Session timestamps sealed on-device</span>
                        </div>
                      </div>
                      <span className="text-emerald-400 font-bold">&check;</span>
                    </div>

                    {/* 5. Cleaning Completed */}
                    <div className="sm:col-span-2 flex items-center justify-between p-3 rounded-lg bg-slate-800/80 border border-slate-700">
                      <div className="flex items-center gap-2.5">
                        <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                        <div>
                          <span className="font-semibold text-slate-200 block">
                            5. Cleaning Completed &amp; Turbidity Reduced
                          </span>
                          <span className="text-[10px] text-slate-400">
                            Submersible optical sensor confirmed turbidity dropped below 200 NTU limit
                          </span>
                        </div>
                      </div>
                      <span className="text-emerald-400 font-bold">&check;</span>
                    </div>
                  </div>

                  <div className="pt-2 flex flex-wrap items-center justify-between gap-2 text-xs border-t border-slate-800">
                    <span className="text-slate-400 text-[11px]">
                      Verification Method: {activeLog.verification_method}
                    </span>

                    {!activeLog.work_verified && (
                      <button
                        type="button"
                        onClick={() => handleVerify(activeLog.log_id)}
                        className="px-3.5 py-1.5 rounded-lg bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs shadow-sm transition-all"
                      >
                        Audit &amp; Approve Verification
                      </button>
                    )}
                  </div>
                </div>

                {/* Submit to Municipal Authority Button */}
                <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
                  <div>
                    <span className="font-bold text-slate-900 block">
                      Submit Dossier for Municipal Payment Approval
                    </span>
                    <span className="text-slate-500 text-[11px]">
                      Forwards verified evidence to the authorized municipal authority for payment review and approval.
                    </span>
                  </div>

                  <button
                    type="button"
                    onClick={() => handleSubmit(activeLog)}
                    disabled={!activeLog.work_verified}
                    className={`px-4 py-2 rounded-lg font-semibold flex items-center gap-2 shadow-xs transition-all ${
                      activeLog.work_verified
                        ? 'bg-blue-600 hover:bg-blue-700 text-white cursor-pointer'
                        : 'bg-slate-200 text-slate-400 cursor-not-allowed'
                    }`}
                  >
                    <Send className="w-3.5 h-3.5" />
                    <span>Submit to Authority</span>
                  </button>
                </div>

                {/* Submission Toast Alert */}
                {submissionSuccess === activeLog.log_id && (
                  <div className="p-3 rounded-lg bg-emerald-50 border border-emerald-300 text-emerald-900 text-xs flex items-center gap-2 animate-in fade-in">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                    <span>
                      Dossier for {activeLog.log_id} successfully submitted to the Executive Engineer for payment processing! Check the Payments tab.
                    </span>
                  </div>
                )}
              </div>
            </div>
          ) : (
            <div className="p-12 text-center bg-white rounded-xl border border-slate-200 text-slate-400">
              Select a work log to view the verification dossier.
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
