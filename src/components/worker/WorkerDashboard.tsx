import React, { useState, useEffect } from 'react';
import {
  HardHat,
  MapPin,
  Clock,
  Navigation,
  Power,
  RotateCcw,
  Droplets,
  CheckCircle2,
  AlertTriangle,
  Play,
  Briefcase,
  CreditCard,
  History,
  Activity,
  Phone,
  ShieldCheck,
  ChevronRight,
  FileText,
  Sliders,
  Cpu,
  Layers,
  ArrowRight
} from 'lucide-react';
import { Worker, Job, JobStatus, MachineData, WorkLog, Payment } from '../../types';
import { StatusBadge } from '../common/StatusBadge';
import { TurbidityChart } from '../common/TurbidityChart';

export type WorkerTab =
  | 'dashboard'
  | 'assigned_jobs'
  | 'job_details'
  | 'start_stop_cleaning'
  | 'machine_status'
  | 'work_history'
  | 'payments';

interface WorkerDashboardProps {
  currentWorker: Worker;
  assignedJob?: Job;
  machineData: MachineData;
  workLogs: WorkLog[];
  payments: Payment[];
  onUpdateJobStatus: (jobId: string, status: JobStatus) => void;
  onTogglePump: () => void;
  onToggleBrush: () => void;
  onToggleMachineStatus: () => void;
  activeNavTab?: string;
  onNavigateTab?: (tab: string) => void;
}

export const WorkerDashboard: React.FC<WorkerDashboardProps> = ({
  currentWorker,
  assignedJob,
  machineData,
  workLogs = [],
  payments = [],
  onUpdateJobStatus,
  onTogglePump,
  onToggleBrush,
  onToggleMachineStatus,
  activeNavTab = 'dashboard',
  onNavigateTab
}) => {
  const [internalTab, setInternalTab] = useState<WorkerTab>('dashboard');

  // Synchronize internal tab if parent passes activeNavTab
  useEffect(() => {
    if (activeNavTab) {
      setInternalTab(activeNavTab as WorkerTab);
    }
  }, [activeNavTab]);

  const setTab = (tab: WorkerTab) => {
    setInternalTab(tab);
    if (onNavigateTab) {
      onNavigateTab(tab);
    }
  };

  const myLogs = workLogs.filter((l) => l.worker_id === currentWorker.worker_id);
  const myPayments = payments.filter((p) => p.worker_id === currentWorker.worker_id);

  // Turbidity readings sequence
  const turbidityReadings = [
    { timestamp: '10:00 AM', turbidity: 820 },
    { timestamp: '10:15 AM', turbidity: 610 },
    { timestamp: '10:30 AM', turbidity: 390 },
    { timestamp: '10:45 AM', turbidity: machineData.turbidity }
  ];

  return (
    <div id="worker-portal" className="space-y-5 max-w-4xl mx-auto">
      {/* Worker Profile Header Card */}
      <div className="bg-gradient-to-r from-slate-900 via-navy-900 to-slate-800 rounded-2xl p-5 text-white shadow-md">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-xl bg-blue-600 flex items-center justify-center text-white font-bold text-lg shadow-md border border-blue-400/30 shrink-0">
              <HardHat className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-lg sm:text-xl font-bold text-white">{currentWorker.worker_name}</h2>
                <span className="font-mono text-xs px-2 py-0.5 rounded bg-blue-500/20 text-cyan-300 border border-blue-400/30 font-bold">
                  {currentWorker.worker_code}
                </span>
              </div>
              <div className="text-xs text-slate-300 mt-0.5 flex flex-wrap items-center gap-2">
                <span>Zone: {currentWorker.zone_id.toUpperCase()}</span>
                <span>&bull;</span>
                <span>{currentWorker.phone}</span>
                <span>&bull;</span>
                <span className="text-emerald-400 font-semibold">{currentWorker.verification_status}</span>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2 self-start sm:self-auto">
            <StatusBadge status={currentWorker.availability} type="availability" size="sm" />
            <div className="px-2.5 py-1 rounded bg-slate-800 text-slate-300 text-xs font-mono border border-slate-700">
              BATTERY {machineData.battery_level}%
            </div>
          </div>
        </div>

        {/* Worker Quick Navigation Pills */}
        <div className="mt-5 pt-3 border-t border-slate-800 flex items-center gap-1.5 overflow-x-auto text-xs font-medium scrollbar-none">
          <button
            type="button"
            onClick={() => setTab('dashboard')}
            className={`px-3 py-1.5 rounded-lg transition-all whitespace-nowrap ${
              internalTab === 'dashboard' ? 'bg-blue-600 text-white font-bold' : 'text-slate-300 hover:bg-slate-800'
            }`}
          >
            Dashboard
          </button>
          <button
            type="button"
            onClick={() => setTab('assigned_jobs')}
            className={`px-3 py-1.5 rounded-lg transition-all whitespace-nowrap flex items-center gap-1 ${
              internalTab === 'assigned_jobs' ? 'bg-blue-600 text-white font-bold' : 'text-slate-300 hover:bg-slate-800'
            }`}
          >
            <Briefcase className="w-3.5 h-3.5" />
            <span>Assigned Jobs {assignedJob ? '(1 Active)' : ''}</span>
          </button>
          <button
            type="button"
            onClick={() => setTab('job_details')}
            className={`px-3 py-1.5 rounded-lg transition-all whitespace-nowrap flex items-center gap-1 ${
              internalTab === 'job_details' ? 'bg-blue-600 text-white font-bold' : 'text-slate-300 hover:bg-slate-800'
            }`}
          >
            <FileText className="w-3.5 h-3.5" />
            <span>Job Details</span>
          </button>
          <button
            type="button"
            onClick={() => setTab('start_stop_cleaning')}
            className={`px-3 py-1.5 rounded-lg transition-all whitespace-nowrap flex items-center gap-1 ${
              internalTab === 'start_stop_cleaning' ? 'bg-blue-600 text-white font-bold' : 'text-slate-300 hover:bg-slate-800'
            }`}
          >
            <Power className="w-3.5 h-3.5" />
            <span>Start/Stop Cleaning</span>
          </button>
          <button
            type="button"
            onClick={() => setTab('machine_status')}
            className={`px-3 py-1.5 rounded-lg transition-all whitespace-nowrap flex items-center gap-1 ${
              internalTab === 'machine_status' ? 'bg-blue-600 text-white font-bold' : 'text-slate-300 hover:bg-slate-800'
            }`}
          >
            <Activity className="w-3.5 h-3.5" />
            <span>Machine Status</span>
          </button>
          <button
            type="button"
            onClick={() => setTab('work_history')}
            className={`px-3 py-1.5 rounded-lg transition-all whitespace-nowrap flex items-center gap-1 ${
              internalTab === 'work_history' ? 'bg-blue-600 text-white font-bold' : 'text-slate-300 hover:bg-slate-800'
            }`}
          >
            <History className="w-3.5 h-3.5" />
            <span>Work History ({myLogs.length})</span>
          </button>
          <button
            type="button"
            onClick={() => setTab('payments')}
            className={`px-3 py-1.5 rounded-lg transition-all whitespace-nowrap flex items-center gap-1 ${
              internalTab === 'payments' ? 'bg-blue-600 text-white font-bold' : 'text-slate-300 hover:bg-slate-800'
            }`}
          >
            <CreditCard className="w-3.5 h-3.5" />
            <span>Payments ({myPayments.length})</span>
          </button>
        </div>
      </div>

      {/* 1. DASHBOARD OVERVIEW */}
      {internalTab === 'dashboard' && (
        <div className="space-y-4">
          {/* Active Job Highlight Banner */}
          {assignedJob ? (
            <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs space-y-3">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-slate-100">
                <div>
                  <span className="text-[10px] font-bold uppercase tracking-wider text-blue-600 block">
                    Current Active Assignment
                  </span>
                  <h3 className="text-base font-bold text-slate-900">{assignedJob.location_name}</h3>
                  <p className="text-xs text-slate-500">
                    {assignedJob.ward_name} &bull; {assignedJob.job_id} &bull; Ref: {assignedJob.complaint_id}
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <StatusBadge status={assignedJob.job_status} type="job" size="md" />
                </div>
              </div>

              <div className="flex flex-wrap items-center gap-2 pt-1">
                <button
                  type="button"
                  onClick={() => setTab('assigned_jobs')}
                  className="px-3.5 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold shadow-xs flex items-center gap-1.5"
                >
                  <span>Execute Worker Actions</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
                <button
                  type="button"
                  onClick={() => setTab('job_details')}
                  className="px-3 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold"
                >
                  View Job Diagnostics
                </button>
                <button
                  type="button"
                  onClick={() => setTab('start_stop_cleaning')}
                  className="px-3 py-2 rounded-xl bg-purple-50 hover:bg-purple-100 text-purple-700 border border-purple-200 text-xs font-semibold flex items-center gap-1"
                >
                  <Power className="w-3.5 h-3.5" />
                  <span>Operate Machine</span>
                </button>
              </div>
            </div>
          ) : (
            <div className="bg-white rounded-2xl border border-slate-200 p-8 text-center shadow-xs">
              <CheckCircle2 className="w-10 h-10 text-emerald-500 mx-auto mb-2" />
              <h3 className="font-bold text-slate-800 text-sm">All Dispatches Clear</h3>
              <p className="text-xs text-slate-500 mt-0.5">
                You are on standby. New storm water drain blockages assigned to your rover will display here immediately.
              </p>
            </div>
          )}

          {/* Quick Metrics Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <div
              onClick={() => setTab('machine_status')}
              className="p-4 rounded-2xl bg-white border border-slate-200 shadow-xs cursor-pointer hover:border-blue-300 transition-all"
            >
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Turbidity</span>
              <span className="text-xl font-black text-teal-600">{machineData.turbidity} NTU</span>
              <span className="text-[10px] text-emerald-600 block mt-0.5">Sensor Active</span>
            </div>

            <div
              onClick={() => setTab('machine_status')}
              className="p-4 rounded-2xl bg-white border border-slate-200 shadow-xs cursor-pointer hover:border-blue-300 transition-all"
            >
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Traverse</span>
              <span className="text-xl font-black text-slate-900">{machineData.distance_travelled} m</span>
              <span className="text-[10px] text-slate-500 block mt-0.5">Conduit distance</span>
            </div>

            <div
              onClick={() => setTab('work_history')}
              className="p-4 rounded-2xl bg-white border border-slate-200 shadow-xs cursor-pointer hover:border-blue-300 transition-all"
            >
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Jobs Completed</span>
              <span className="text-xl font-black text-blue-600">{currentWorker.total_completed_jobs}</span>
              <span className="text-[10px] text-slate-500 block mt-0.5">{myLogs.length} logged runs</span>
            </div>

            <div
              onClick={() => setTab('payments')}
              className="p-4 rounded-2xl bg-white border border-slate-200 shadow-xs cursor-pointer hover:border-blue-300 transition-all"
            >
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Vouchers</span>
              <span className="text-xl font-black text-slate-900">{myPayments.length}</span>
              <span className="text-[10px] text-emerald-600 block mt-0.5">Disbursed</span>
            </div>
          </div>
        </div>
      )}

      {/* 2. ASSIGNED JOBS (Accept, Travel, Reach, Complete) */}
      {internalTab === 'assigned_jobs' && (
        <div className="space-y-4">
          {assignedJob ? (
            <div className="bg-white rounded-2xl border border-slate-200 p-5 sm:p-6 shadow-xs space-y-5">
              {/* Header */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-slate-100">
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <span className="font-mono text-xs font-bold text-blue-700 bg-blue-50 px-2.5 py-0.5 rounded border border-blue-200">
                      {assignedJob.job_id}
                    </span>
                    <StatusBadge status={assignedJob.severity} type="severity" size="sm" />
                    <span className="text-xs text-slate-400">Ref: {assignedJob.complaint_id}</span>
                  </div>
                  <h3 className="text-lg font-bold text-slate-900">{assignedJob.location_name}</h3>
                  <div className="text-xs text-slate-500 mt-0.5">
                    {assignedJob.ward_name} &bull; {assignedJob.zone_code} &bull; Est. Distance: {assignedJob.estimated_distance_km} km
                  </div>
                </div>

                <div className="text-left sm:text-right">
                  <span className="text-[10px] text-slate-400 uppercase font-semibold block">Execution Status</span>
                  <StatusBadge status={assignedJob.job_status} type="job" size="md" />
                </div>
              </div>

              {/* Action Sequence */}
              <div>
                <h4 className="text-xs font-bold text-slate-800 uppercase tracking-wider mb-3">
                  Worker Action Sequence
                </h4>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {assignedJob.job_status === 'Assigned' && (
                    <button
                      type="button"
                      onClick={() => onUpdateJobStatus(assignedJob.job_id, 'Accepted')}
                      className="w-full py-3 px-4 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs shadow-md flex items-center justify-center gap-2 transition-all"
                    >
                      <CheckCircle2 className="w-4 h-4" />
                      <span>Step 1: Accept Job Dispatch</span>
                    </button>
                  )}

                  {assignedJob.job_status === 'Accepted' && (
                    <button
                      type="button"
                      onClick={() => onUpdateJobStatus(assignedJob.job_id, 'Travelling')}
                      className="w-full py-3 px-4 rounded-xl bg-amber-600 hover:bg-amber-700 text-white font-bold text-xs shadow-md flex items-center justify-center gap-2 transition-all"
                    >
                      <Navigation className="w-4 h-4" />
                      <span>Step 2: Start Travel with Rover</span>
                    </button>
                  )}

                  {assignedJob.job_status === 'Travelling' && (
                    <button
                      type="button"
                      onClick={() => onUpdateJobStatus(assignedJob.job_id, 'Working')}
                      className="w-full py-3 px-4 rounded-xl bg-purple-600 hover:bg-purple-700 text-white font-bold text-xs shadow-md flex items-center justify-center gap-2 transition-all"
                    >
                      <MapPin className="w-4 h-4" />
                      <span>Step 3: Reach Location &amp; Position Machine</span>
                    </button>
                  )}

                  {assignedJob.job_status === 'Working' && (
                    <>
                      <button
                        type="button"
                        onClick={() => setTab('start_stop_cleaning')}
                        className="py-3 px-4 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs shadow-md flex items-center justify-center gap-2 transition-all"
                      >
                        <Power className="w-4 h-4" />
                        <span>Step 4: Operate Cleaning Machine</span>
                      </button>

                      <button
                        type="button"
                        onClick={() => onUpdateJobStatus(assignedJob.job_id, 'Completed')}
                        className="py-3 px-4 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs shadow-md flex items-center justify-center gap-2 transition-all"
                      >
                        <CheckCircle2 className="w-4 h-4" />
                        <span>Step 5: Complete Job &amp; Log Telemetry</span>
                      </button>
                    </>
                  )}

                  {assignedJob.job_status === 'Completed' && (
                    <div className="sm:col-span-2 p-3.5 rounded-xl bg-emerald-50 border border-emerald-300 text-emerald-900 text-xs flex items-center gap-2">
                      <ShieldCheck className="w-5 h-5 text-emerald-600 shrink-0" />
                      <span>
                        Desilting run completed! Telemetry dossier has been sealed and forwarded to the Municipal Authority for audit.
                      </span>
                    </div>
                  )}

                  {assignedJob.job_status === 'Verified' && (
                    <div className="sm:col-span-2 p-3.5 rounded-xl bg-teal-50 border border-teal-300 text-teal-900 text-xs flex items-center gap-2">
                      <CheckCircle2 className="w-5 h-5 text-teal-600 shrink-0" />
                      <span>
                        Work Verified by Municipal Authority. Check Payments tab for disbursement details.
                      </span>
                    </div>
                  )}
                </div>
              </div>
            </div>
          ) : (
            <div className="bg-white rounded-2xl border border-slate-200 p-10 text-center shadow-xs">
              <CheckCircle2 className="w-10 h-10 text-blue-500 mx-auto mb-2" />
              <h3 className="font-bold text-slate-800 text-base">No Assigned Jobs In Queue</h3>
              <p className="text-xs text-slate-500 mt-1 max-w-sm mx-auto">
                You are currently available. When municipal dispatch assigns a storm drain, it will appear here immediately.
              </p>
            </div>
          )}
        </div>
      )}

      {/* 3. JOB DETAILS (Diagnostic Dossier) */}
      {internalTab === 'job_details' && (
        <div className="bg-white rounded-2xl border border-slate-200 p-5 sm:p-6 shadow-xs space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <h3 className="font-bold text-slate-900 text-base flex items-center gap-2">
              <FileText className="w-5 h-5 text-blue-600" />
              <span>Conduit Diagnostic Dossier</span>
            </h3>
            {assignedJob && <StatusBadge status={assignedJob.job_status} type="job" size="sm" />}
          </div>

          {assignedJob ? (
            <div className="space-y-4 text-xs">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 space-y-1">
                  <span className="font-bold text-slate-500 uppercase text-[10px] block">Target Location</span>
                  <div className="font-bold text-slate-900 text-sm">{assignedJob.location_name}</div>
                  <div className="text-slate-500">{assignedJob.ward_name} &bull; Zone {assignedJob.zone_code}</div>
                </div>

                <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 space-y-1">
                  <span className="font-bold text-slate-500 uppercase text-[10px] block">GPS Spatial Coordinates</span>
                  <div className="flex items-center gap-1.5 font-mono text-slate-800 font-bold">
                    <MapPin className="w-3.5 h-3.5 text-blue-600" />
                    <span>Lat: 12.9784, Lng: 77.6408</span>
                  </div>
                  <div className="text-slate-500">Dispatched: {assignedJob.assigned_at}</div>
                </div>
              </div>

              <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 space-y-1">
                <span className="font-bold text-slate-500 uppercase text-[10px] block">Reported Diagnostic Notes</span>
                <p className="text-slate-700 leading-relaxed">
                  {assignedJob.notes || 'Substantial silt accumulation, plastic sediment, and foul sewer backflow reported.'}
                </p>
              </div>

              <div className="flex items-center justify-between pt-2">
                <button
                  type="button"
                  onClick={() => setTab('start_stop_cleaning')}
                  className="px-4 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs shadow-xs flex items-center gap-2"
                >
                  <Power className="w-4 h-4" />
                  <span>Launch Cleaning Control Console</span>
                </button>
              </div>
            </div>
          ) : (
            <p className="text-xs text-slate-500">No active job selected. View Assigned Jobs to select a task.</p>
          )}
        </div>
      )}

      {/* 4. START/STOP CLEANING (Machine Hardware Console) */}
      {internalTab === 'start_stop_cleaning' && (
        <div className="space-y-4">
          <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <h3 className="font-bold text-slate-900 text-sm flex items-center gap-2">
                <Power className="w-4 h-4 text-blue-600" />
                <span>Portable Cleaning Rover Hardware Actuators</span>
              </h3>
              <span className="text-xs font-mono font-bold text-slate-600">
                Machine Status: {machineData.machine_status}
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
              {/* Drive Motor */}
              <button
                type="button"
                onClick={onToggleMachineStatus}
                className={`p-4 rounded-xl border flex items-center justify-between transition-all cursor-pointer ${
                  machineData.machine_status === 'RUNNING'
                    ? 'bg-emerald-50 border-emerald-300 text-emerald-900 font-bold shadow-xs'
                    : 'bg-slate-50 border-slate-200 text-slate-700 hover:bg-slate-100'
                }`}
              >
                <div className="flex items-center gap-3">
                  <Power className="w-6 h-6 text-emerald-600" />
                  <div className="text-left">
                    <span className="block font-bold">Drive Motor</span>
                    <span className="text-[10px] font-normal">{machineData.machine_status}</span>
                  </div>
                </div>
                <span className="px-2.5 py-1 rounded bg-white text-xs border border-emerald-200 font-bold">
                  {machineData.machine_status === 'RUNNING' ? 'STOP' : 'START'}
                </span>
              </button>

              {/* Sludge Pump */}
              <button
                type="button"
                onClick={onTogglePump}
                className={`p-4 rounded-xl border flex items-center justify-between transition-all cursor-pointer ${
                  machineData.pump_status === 'ON'
                    ? 'bg-blue-50 border-blue-300 text-blue-900 font-bold shadow-xs'
                    : 'bg-slate-50 border-slate-200 text-slate-700 hover:bg-slate-100'
                }`}
              >
                <div className="flex items-center gap-3">
                  <Droplets className="w-6 h-6 text-blue-600" />
                  <div className="text-left">
                    <span className="block font-bold">Sludge Pump</span>
                    <span className="text-[10px] font-normal">{machineData.pump_status}</span>
                  </div>
                </div>
                <span className="px-2.5 py-1 rounded bg-white text-xs border border-blue-200 font-bold">
                  {machineData.pump_status === 'ON' ? 'STOP' : 'START'}
                </span>
              </button>

              {/* Rotating Brush */}
              <button
                type="button"
                onClick={onToggleBrush}
                className={`p-4 rounded-xl border flex items-center justify-between transition-all cursor-pointer ${
                  machineData.brush_status === 'ON'
                    ? 'bg-amber-50 border-amber-300 text-amber-900 font-bold shadow-xs'
                    : 'bg-slate-50 border-slate-200 text-slate-700 hover:bg-slate-100'
                }`}
              >
                <div className="flex items-center gap-3">
                  <RotateCcw
                    className={`w-6 h-6 text-amber-600 ${machineData.brush_status === 'ON' ? 'animate-spin' : ''}`}
                  />
                  <div className="text-left">
                    <span className="block font-bold">Rotating Brush</span>
                    <span className="text-[10px] font-normal">{machineData.brush_status}</span>
                  </div>
                </div>
                <span className="px-2.5 py-1 rounded bg-white text-xs border border-amber-200 font-bold">
                  {machineData.brush_status === 'ON' ? 'STOP' : 'START'}
                </span>
              </button>
            </div>

            {/* In-situ Turbidity Drop tracker */}
            <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 flex items-center justify-between text-xs">
              <div>
                <strong className="text-slate-900 block font-bold">Current Conduit Turbidity:</strong>
                <span className="text-slate-500 text-[11px]">Sensor reads optical backscatter in effluent</span>
              </div>
              <div className="text-right">
                <span className="text-xl font-black text-teal-600 font-mono">{machineData.turbidity} NTU</span>
                <span className="text-[10px] text-emerald-600 block">Clarification Progressing</span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 5. MACHINE STATUS (IoT Telemetry & Sensor Analytics) */}
      {internalTab === 'machine_status' && (
        <div className="space-y-4">
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <div className="p-3.5 rounded-xl bg-white border border-slate-200 shadow-xs">
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Turbidity</span>
              <span className="text-xl font-black text-teal-600">{machineData.turbidity} NTU</span>
              <span className="text-[10px] text-emerald-600 block">Water Clarifying</span>
            </div>

            <div className="p-3.5 rounded-xl bg-white border border-slate-200 shadow-xs">
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Distance</span>
              <span className="text-xl font-black text-slate-900">{machineData.distance_travelled} m</span>
              <span className="text-[10px] text-slate-500 block">Conduit traverse</span>
            </div>

            <div className="p-3.5 rounded-xl bg-white border border-slate-200 shadow-xs">
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Water Level</span>
              <span className="text-xl font-black text-blue-600">{machineData.water_level} cm</span>
              <span className="text-[10px] text-slate-500 block">Ultrasonic sensor</span>
            </div>

            <div className="p-3.5 rounded-xl bg-white border border-slate-200 shadow-xs">
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Battery</span>
              <span className="text-xl font-black text-emerald-600">{machineData.battery_level}%</span>
              <span className="text-[10px] text-slate-500 block">{machineData.machine_status}</span>
            </div>
          </div>

          {/* Turbidity Graph */}
          <TurbidityChart
            data={turbidityReadings}
            currentTurbidity={machineData.turbidity}
            height={220}
            showExplanation={true}
          />
        </div>
      )}

      {/* 6. WORK HISTORY (Personal Desilting Logs) */}
      {internalTab === 'work_history' && (
        <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="font-bold text-slate-900 text-sm flex items-center gap-2">
              <History className="w-4 h-4 text-blue-600" />
              <span>Personal Desilting Work History</span>
            </h3>
            <span className="text-xs text-slate-500">{myLogs.length} Records</span>
          </div>

          <div className="divide-y divide-slate-100 text-xs">
            {myLogs.map((log) => (
              <div key={log.log_id} className="py-3.5 flex items-center justify-between gap-3">
                <div>
                  <div className="flex items-center gap-2 mb-0.5">
                    <span className="font-mono font-bold text-blue-700">{log.log_id}</span>
                    <span className="font-mono text-[11px] text-slate-400">Job: {log.job_id}</span>
                    <span
                      className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                        log.work_verified ? 'bg-emerald-100 text-emerald-800' : 'bg-amber-100 text-amber-800'
                      }`}
                    >
                      {log.work_verified ? 'VERIFIED' : 'PENDING'}
                    </span>
                  </div>
                  <div className="font-bold text-slate-900">{log.location_name}</div>
                  <div className="text-[11px] text-slate-500 mt-0.5">
                    {log.start_time} - {log.end_time} &bull; {log.distance_travelled} meters &bull; {log.work_duration_minutes} min
                  </div>
                </div>

                <div className="text-right">
                  <span className="text-[10px] text-slate-400 block uppercase">Turbidity Drop</span>
                  <span className="font-bold text-emerald-700">820 &rarr; 190 NTU</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 7. PAYMENTS */}
      {internalTab === 'payments' && (
        <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="font-bold text-slate-900 text-sm flex items-center gap-2">
              <CreditCard className="w-4 h-4 text-emerald-600" />
              <span>Work Payments &amp; Municipal Sanction Records</span>
            </h3>
            <span className="text-xs text-slate-500">{myPayments.length} Transactions</span>
          </div>

          <div className="divide-y divide-slate-100 text-xs">
            {myPayments.map((p) => (
              <div key={p.payment_id} className="py-3.5 flex items-center justify-between gap-3">
                <div>
                  <div className="flex items-center gap-2 mb-0.5">
                    <span className="font-mono font-bold text-slate-700">{p.payment_id}</span>
                    <span className="font-mono text-[11px] text-slate-400">{p.job_id}</span>
                  </div>
                  <div className="font-bold text-slate-900">{p.location_name}</div>
                  <div className="text-[11px] text-slate-500 mt-0.5">
                    Approved by: {p.approved_by || 'Awaiting sanction'} &bull; Date: {p.created_at}
                  </div>
                </div>

                <div className="text-right">
                  <div className="font-extrabold text-slate-900 text-base">₹{p.amount.toLocaleString()}</div>
                  <StatusBadge status={p.payment_status} type="payment" size="sm" />
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
