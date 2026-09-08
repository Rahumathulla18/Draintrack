import React from 'react';
import {
  Users,
  UserCheck,
  AlertOctagon,
  Briefcase,
  CheckCircle2,
  AlertTriangle,
  CreditCard,
  ArrowRight,
  TrendingUp,
  MapPin,
  Clock,
  ShieldCheck,
  Zap,
  Activity
} from 'lucide-react';
import { DrainageLocation, Worker, Complaint, Job, WorkLog, Payment, MachineData } from '../../types';
import { StatusBadge } from '../common/StatusBadge';
import { DrainageMap } from '../common/DrainageMap';
import { AdminTab } from '../common/Sidebar';

interface DashboardHomeProps {
  workers?: Worker[];
  drainages?: DrainageLocation[];
  complaints?: Complaint[];
  jobs?: Job[];
  workLogs?: WorkLog[];
  payments?: Payment[];
  machineData?: MachineData;
  onNavigate: (tab: AdminTab) => void;
  onAssignJob?: (complaint: Complaint) => void;
}

export const DashboardHome: React.FC<DashboardHomeProps> = ({
  workers = [],
  drainages = [],
  complaints = [],
  jobs = [],
  workLogs = [],
  payments = [],
  onNavigate,
  onAssignJob
}) => {
  // Compute metrics requested by prompt:
  // - Registered Workers
  // - Available Workers
  // - Pending Complaints
  // - Active Jobs
  // - Completed Today
  // - Critical Drainages
  // - Verified Work
  // - Pending Payments
  const registeredWorkers = workers.length;
  const availableWorkers = workers.filter((w) => w.availability === 'Available').length;
  const pendingComplaints = complaints.filter((c) => c.status === 'Pending').length;
  const activeJobs = jobs.filter((j) => j.job_status === 'Working' || j.job_status === 'Travelling' || j.job_status === 'Accepted').length;
  const completedToday = jobs.filter((j) => j.job_status === 'Completed' || j.job_status === 'Verified').length;
  const criticalDrainages = drainages.filter((d) => d.condition === 'Critical' || d.condition === 'Blocked').length;
  const verifiedWork = workLogs.filter((w) => w.work_verified).length;
  const pendingPayments = payments.filter((p) => p.payment_status === 'Pending').length;

  // Drainage condition counts: Good, Moderate, Dirty, Blocked, Critical
  const conditionCounts = {
    Good: drainages.filter((d) => d.condition === 'Good').length,
    Moderate: drainages.filter((d) => d.condition === 'Moderate').length,
    Dirty: drainages.filter((d) => d.condition === 'Dirty').length,
    Blocked: drainages.filter((d) => d.condition === 'Blocked').length,
    Critical: drainages.filter((d) => d.condition === 'Critical').length
  };

  // Job status counts: Assigned, Accepted, Travelling, Working, Completed
  const jobStatusCounts = {
    Assigned: jobs.filter((j) => j.job_status === 'Assigned').length,
    Accepted: jobs.filter((j) => j.job_status === 'Accepted').length,
    Travelling: jobs.filter((j) => j.job_status === 'Travelling').length,
    Working: jobs.filter((j) => j.job_status === 'Working').length,
    Completed: jobs.filter((j) => j.job_status === 'Completed' || j.job_status === 'Verified').length
  };

  const recentComplaints = complaints.slice(0, 5);

  return (
    <div id="admin-dashboard-home" className="space-y-6">
      {/* Top Banner: Smart City Municipal Directorate Overview */}
      <div className="bg-gradient-to-r from-slate-900 via-slate-800 to-blue-950 rounded-xl p-5 sm:p-6 text-white shadow-md flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="px-2 py-0.5 rounded bg-blue-500/20 text-cyan-300 font-mono text-xs font-semibold uppercase tracking-wider border border-blue-500/30">
              SIH 2026 Smart Drainage Node
            </span>
            <span className="text-xs text-slate-300 hidden sm:inline">&bull; Real-time IoT Mesh Active</span>
          </div>
          <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-white">
            DrainTrack Municipal Command &amp; Digital Verification
          </h1>
          <p className="text-xs sm:text-sm text-slate-300 mt-1 max-w-2xl leading-relaxed">
            Coordinating desilting teams, portable IoT drainage cleaning machines, and verified municipal telemetry across 4 wards and 6 arterial storm drainage corridors.
          </p>
        </div>

        <div className="flex items-center gap-2.5 shrink-0">
          <button
            type="button"
            onClick={() => onNavigate('monitoring')}
            className="flex items-center gap-2 px-3.5 py-2 rounded-lg bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold shadow-sm transition-all"
          >
            <Activity className="w-4 h-4" />
            <span>Live Machine IoT</span>
          </button>
          <button
            type="button"
            onClick={() => onNavigate('jobs')}
            className="flex items-center gap-2 px-3.5 py-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 text-xs font-semibold transition-all"
          >
            <Zap className="w-4 h-4 text-amber-400" />
            <span>Assign Jobs</span>
          </button>
        </div>
      </div>

      {/* 8 Summary Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
        {/* 1. Registered Workers */}
        <div
          onClick={() => onNavigate('workers')}
          className="bg-white rounded-xl p-4 border border-slate-200 shadow-xs hover:border-blue-300 hover:shadow-sm transition-all cursor-pointer group"
        >
          <div className="flex items-center justify-between text-slate-500 mb-2">
            <span className="text-xs font-medium uppercase tracking-wider text-slate-500">
              Registered Workers
            </span>
            <div className="p-2 rounded-lg bg-blue-50 text-blue-600 group-hover:scale-110 transition-transform">
              <Users className="w-4 h-4" />
            </div>
          </div>
          <div className="flex items-baseline justify-between">
            <span className="text-2xl sm:text-3xl font-bold text-slate-900">{registeredWorkers}</span>
            <span className="text-xs text-emerald-600 font-semibold flex items-center">
              100% active
            </span>
          </div>
          <div className="text-[11px] text-slate-500 mt-1">Sanitation personnel registered</div>
        </div>

        {/* 2. Available Workers */}
        <div
          onClick={() => onNavigate('workers')}
          className="bg-white rounded-xl p-4 border border-slate-200 shadow-xs hover:border-emerald-300 hover:shadow-sm transition-all cursor-pointer group"
        >
          <div className="flex items-center justify-between text-slate-500 mb-2">
            <span className="text-xs font-medium uppercase tracking-wider text-slate-500">
              Available Workers
            </span>
            <div className="p-2 rounded-lg bg-emerald-50 text-emerald-600 group-hover:scale-110 transition-transform">
              <UserCheck className="w-4 h-4" />
            </div>
          </div>
          <div className="flex items-baseline justify-between">
            <span className="text-2xl sm:text-3xl font-bold text-emerald-700">{availableWorkers}</span>
            <span className="text-xs text-slate-500 font-medium">Ready for dispatch</span>
          </div>
          <div className="text-[11px] text-slate-500 mt-1">Standby near ward centers</div>
        </div>

        {/* 3. Pending Complaints */}
        <div
          onClick={() => onNavigate('complaints')}
          className="bg-white rounded-xl p-4 border border-slate-200 shadow-xs hover:border-rose-300 hover:shadow-sm transition-all cursor-pointer group"
        >
          <div className="flex items-center justify-between text-slate-500 mb-2">
            <span className="text-xs font-medium uppercase tracking-wider text-slate-500">
              Pending Complaints
            </span>
            <div className="p-2 rounded-lg bg-rose-50 text-rose-600 group-hover:scale-110 transition-transform">
              <AlertOctagon className="w-4 h-4" />
            </div>
          </div>
          <div className="flex items-baseline justify-between">
            <span className="text-2xl sm:text-3xl font-bold text-rose-600">{pendingComplaints}</span>
            <span className="text-xs text-rose-600 font-semibold">Action needed</span>
          </div>
          <div className="text-[11px] text-slate-500 mt-1">Reported by citizens &amp; inspectors</div>
        </div>

        {/* 4. Active Jobs */}
        <div
          onClick={() => onNavigate('jobs')}
          className="bg-white rounded-xl p-4 border border-slate-200 shadow-xs hover:border-blue-300 hover:shadow-sm transition-all cursor-pointer group"
        >
          <div className="flex items-center justify-between text-slate-500 mb-2">
            <span className="text-xs font-medium uppercase tracking-wider text-slate-500">
              Active Jobs
            </span>
            <div className="p-2 rounded-lg bg-indigo-50 text-indigo-600 group-hover:scale-110 transition-transform">
              <Briefcase className="w-4 h-4" />
            </div>
          </div>
          <div className="flex items-baseline justify-between">
            <span className="text-2xl sm:text-3xl font-bold text-indigo-600">{activeJobs}</span>
            <span className="text-xs text-blue-600 font-medium">In transit / cleaning</span>
          </div>
          <div className="text-[11px] text-slate-500 mt-1">IoT units currently deployed</div>
        </div>

        {/* 5. Completed Today */}
        <div
          onClick={() => onNavigate('verification')}
          className="bg-white rounded-xl p-4 border border-slate-200 shadow-xs hover:border-emerald-300 hover:shadow-sm transition-all cursor-pointer group"
        >
          <div className="flex items-center justify-between text-slate-500 mb-2">
            <span className="text-xs font-medium uppercase tracking-wider text-slate-500">
              Completed Today
            </span>
            <div className="p-2 rounded-lg bg-emerald-50 text-emerald-600 group-hover:scale-110 transition-transform">
              <CheckCircle2 className="w-4 h-4" />
            </div>
          </div>
          <div className="flex items-baseline justify-between">
            <span className="text-2xl sm:text-3xl font-bold text-emerald-600">{completedToday}</span>
            <span className="text-xs text-emerald-700 font-medium">Desilted drains</span>
          </div>
          <div className="text-[11px] text-slate-500 mt-1">Hydraulic flow restored</div>
        </div>

        {/* 6. Critical Drainages */}
        <div
          onClick={() => onNavigate('drainages')}
          className="bg-white rounded-xl p-4 border border-slate-200 shadow-xs hover:border-rose-300 hover:shadow-sm transition-all cursor-pointer group"
        >
          <div className="flex items-center justify-between text-slate-500 mb-2">
            <span className="text-xs font-medium uppercase tracking-wider text-slate-500">
              Critical Drainages
            </span>
            <div className="p-2 rounded-lg bg-rose-50 text-rose-600 group-hover:scale-110 transition-transform">
              <AlertTriangle className="w-4 h-4" />
            </div>
          </div>
          <div className="flex items-baseline justify-between">
            <span className="text-2xl sm:text-3xl font-bold text-rose-600">{criticalDrainages}</span>
            <span className="text-xs text-rose-600 font-semibold">Priority dispatch</span>
          </div>
          <div className="text-[11px] text-slate-500 mt-1">Severe silt / obstruction</div>
        </div>

        {/* 7. Verified Work */}
        <div
          onClick={() => onNavigate('verification')}
          className="bg-white rounded-xl p-4 border border-slate-200 shadow-xs hover:border-teal-300 hover:shadow-sm transition-all cursor-pointer group"
        >
          <div className="flex items-center justify-between text-slate-500 mb-2">
            <span className="text-xs font-medium uppercase tracking-wider text-slate-500">
              Verified Work
            </span>
            <div className="p-2 rounded-lg bg-teal-50 text-teal-600 group-hover:scale-110 transition-transform">
              <ShieldCheck className="w-4 h-4" />
            </div>
          </div>
          <div className="flex items-baseline justify-between">
            <span className="text-2xl sm:text-3xl font-bold text-teal-600">{verifiedWork}</span>
            <span className="text-xs text-teal-700 font-medium">5-point verified</span>
          </div>
          <div className="text-[11px] text-slate-500 mt-1">Ready for municipal sign-off</div>
        </div>

        {/* 8. Pending Payments */}
        <div
          onClick={() => onNavigate('payments')}
          className="bg-white rounded-xl p-4 border border-slate-200 shadow-xs hover:border-amber-300 hover:shadow-sm transition-all cursor-pointer group"
        >
          <div className="flex items-center justify-between text-slate-500 mb-2">
            <span className="text-xs font-medium uppercase tracking-wider text-slate-500">
              Pending Payments
            </span>
            <div className="p-2 rounded-lg bg-amber-50 text-amber-600 group-hover:scale-110 transition-transform">
              <CreditCard className="w-4 h-4" />
            </div>
          </div>
          <div className="flex items-baseline justify-between">
            <span className="text-2xl sm:text-3xl font-bold text-amber-600">{pendingPayments}</span>
            <span className="text-xs text-amber-700 font-medium">Approval queue</span>
          </div>
          <div className="text-[11px] text-slate-500 mt-1">Municipal clearance awaiting</div>
        </div>
      </div>

      {/* Middle Section: Drainage Condition Breakdown + Job Status Flow */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Drainage Condition Chart & Distribution */}
        <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-xs">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="font-bold text-slate-900 text-sm sm:text-base">
                Drainage Condition Status Distribution
              </h3>
              <p className="text-xs text-slate-500">
                Monitored health across {drainages.length} storm water arterial conduits
              </p>
            </div>
            <button
              type="button"
              onClick={() => onNavigate('drainages')}
              className="text-xs font-semibold text-blue-600 hover:text-blue-700 flex items-center gap-1"
            >
              <span>View All</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* Condition Bars */}
          <div className="space-y-3">
            {/* Good */}
            <div>
              <div className="flex justify-between text-xs font-semibold mb-1">
                <span className="text-emerald-700 flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-emerald-500" />
                  Good (Clean &amp; Free Flowing)
                </span>
                <span className="text-slate-700">
                  {conditionCounts.Good} ({Math.round((conditionCounts.Good / drainages.length) * 100)}%)
                </span>
              </div>
              <div className="w-full bg-slate-100 rounded-full h-2.5 overflow-hidden">
                <div
                  className="bg-emerald-500 h-2.5 rounded-full transition-all duration-500"
                  style={{ width: `${(conditionCounts.Good / drainages.length) * 100}%` }}
                />
              </div>
            </div>

            {/* Moderate */}
            <div>
              <div className="flex justify-between text-xs font-semibold mb-1">
                <span className="text-amber-700 flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-amber-400" />
                  Moderate (Light Sediment)
                </span>
                <span className="text-slate-700">
                  {conditionCounts.Moderate} ({Math.round((conditionCounts.Moderate / drainages.length) * 100)}%)
                </span>
              </div>
              <div className="w-full bg-slate-100 rounded-full h-2.5 overflow-hidden">
                <div
                  className="bg-amber-400 h-2.5 rounded-full transition-all duration-500"
                  style={{ width: `${(conditionCounts.Moderate / drainages.length) * 100}%` }}
                />
              </div>
            </div>

            {/* Dirty */}
            <div>
              <div className="flex justify-between text-xs font-semibold mb-1">
                <span className="text-orange-700 flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-orange-500" />
                  Dirty (Stagnant Odor)
                </span>
                <span className="text-slate-700">
                  {conditionCounts.Dirty} ({Math.round((conditionCounts.Dirty / drainages.length) * 100)}%)
                </span>
              </div>
              <div className="w-full bg-slate-100 rounded-full h-2.5 overflow-hidden">
                <div
                  className="bg-orange-500 h-2.5 rounded-full transition-all duration-500"
                  style={{ width: `${(conditionCounts.Dirty / drainages.length) * 100}%` }}
                />
              </div>
            </div>

            {/* Blocked */}
            <div>
              <div className="flex justify-between text-xs font-semibold mb-1">
                <span className="text-rose-700 flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-rose-500" />
                  Blocked (Severe Obstruction)
                </span>
                <span className="text-slate-700">
                  {conditionCounts.Blocked} ({Math.round((conditionCounts.Blocked / drainages.length) * 100)}%)
                </span>
              </div>
              <div className="w-full bg-slate-100 rounded-full h-2.5 overflow-hidden">
                <div
                  className="bg-rose-500 h-2.5 rounded-full transition-all duration-500"
                  style={{ width: `${(conditionCounts.Blocked / drainages.length) * 100}%` }}
                />
              </div>
            </div>

            {/* Critical */}
            <div>
              <div className="flex justify-between text-xs font-semibold mb-1">
                <span className="text-rose-800 flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-rose-700 animate-pulse" />
                  Critical (Overflow Risk)
                </span>
                <span className="text-slate-700">
                  {conditionCounts.Critical} ({Math.round((conditionCounts.Critical / drainages.length) * 100)}%)
                </span>
              </div>
              <div className="w-full bg-slate-100 rounded-full h-2.5 overflow-hidden">
                <div
                  className="bg-rose-700 h-2.5 rounded-full transition-all duration-500"
                  style={{ width: `${(conditionCounts.Critical / drainages.length) * 100}%` }}
                />
              </div>
            </div>
          </div>
        </div>

        {/* Job Status Section / Flow */}
        <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-xs flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="font-bold text-slate-900 text-sm sm:text-base">
                  Job Pipeline &amp; Field Execution Flow
                </h3>
                <p className="text-xs text-slate-500">
                  Assigned &rarr; Accepted &rarr; Travelling &rarr; Working &rarr; Completed
                </p>
              </div>
              <button
                type="button"
                onClick={() => onNavigate('jobs')}
                className="text-xs font-semibold text-blue-600 hover:text-blue-700 flex items-center gap-1"
              >
                <span>Dispatch</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>

            {/* Flow Steps Cards */}
            <div className="grid grid-cols-2 sm:grid-cols-5 gap-2">
              <div className="p-3 rounded-lg bg-indigo-50/60 border border-indigo-200 text-center">
                <span className="text-[10px] font-bold uppercase text-indigo-700 block">Assigned</span>
                <span className="text-lg font-extrabold text-indigo-950 mt-1 block">
                  {jobStatusCounts.Assigned}
                </span>
                <span className="text-[10px] text-slate-500">Awaiting worker</span>
              </div>

              <div className="p-3 rounded-lg bg-blue-50/60 border border-blue-200 text-center">
                <span className="text-[10px] font-bold uppercase text-blue-700 block">Accepted</span>
                <span className="text-lg font-extrabold text-blue-950 mt-1 block">
                  {jobStatusCounts.Accepted}
                </span>
                <span className="text-[10px] text-slate-500">Worker notified</span>
              </div>

              <div className="p-3 rounded-lg bg-amber-50/60 border border-amber-200 text-center">
                <span className="text-[10px] font-bold uppercase text-amber-700 block">Travelling</span>
                <span className="text-lg font-extrabold text-amber-950 mt-1 block">
                  {jobStatusCounts.Travelling}
                </span>
                <span className="text-[10px] text-slate-500">In transit</span>
              </div>

              <div className="p-3 rounded-lg bg-blue-50/60 border border-blue-300 text-center relative overflow-hidden">
                <div className="absolute top-0 right-0 w-2 h-2 bg-blue-500 rounded-full m-1 animate-ping" />
                <span className="text-[10px] font-bold uppercase text-blue-700 block">Working</span>
                <span className="text-lg font-extrabold text-blue-950 mt-1 block">
                  {jobStatusCounts.Working}
                </span>
                <span className="text-[10px] text-slate-500">Machine active</span>
              </div>

              <div className="p-3 rounded-lg bg-emerald-50/60 border border-emerald-200 text-center">
                <span className="text-[10px] font-bold uppercase text-emerald-700 block">Completed</span>
                <span className="text-lg font-extrabold text-emerald-950 mt-1 block">
                  {jobStatusCounts.Completed}
                </span>
                <span className="text-[10px] text-slate-500">Verified logs</span>
              </div>
            </div>
          </div>

          <div className="mt-4 p-3 rounded-lg bg-slate-50 border border-slate-200 flex items-center justify-between text-xs">
            <div className="flex items-center gap-2">
              <Zap className="w-4 h-4 text-blue-600" />
              <span className="text-slate-700">
                <strong>Unit DT-02:</strong> Currently cleaning at Bazaar Street Culvert #4 (Job JOB-301)
              </span>
            </div>
            <button
              type="button"
              onClick={() => onNavigate('monitoring')}
              className="text-xs font-semibold text-blue-600 hover:text-blue-800 underline"
            >
              Monitor Telemetry
            </button>
          </div>
        </div>
      </div>

      {/* Interactive Map Area (Sample showing green workers, red blocked, yellow dirty, green clean) */}
      <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-xs">
        <div className="flex flex-wrap items-center justify-between gap-2 mb-3">
          <div>
            <h3 className="font-bold text-slate-900 text-sm sm:text-base flex items-center gap-2">
              <MapPin className="w-4 h-4 text-blue-600" />
              <span>Smart City Live Drainage &amp; Sanitation Fleet Map</span>
            </h3>
            <p className="text-xs text-slate-500">
              Visualizing green worker locations, red blocked conduits, yellow dirty drains, and green clean assets
            </p>
          </div>

          <button
            type="button"
            onClick={() => onNavigate('map')}
            className="text-xs font-semibold text-blue-600 hover:text-blue-700 flex items-center gap-1"
          >
            <span>Open Fullscreen Map</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <DrainageMap
          drainages={drainages}
          workers={workers}
          height="380px"
          onSelectDrainage={() => onNavigate('drainages')}
          onSelectWorker={() => onNavigate('workers')}
        />
      </div>

      {/* Recent Complaints Table */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-xs overflow-hidden">
        <div className="p-4 sm:p-5 border-b border-slate-200 flex items-center justify-between">
          <div>
            <h3 className="font-bold text-slate-900 text-sm sm:text-base">
              Recent Drainage Complaints
            </h3>
            <p className="text-xs text-slate-500">
              Real-time incoming alerts from citizens and field ward inspectors
            </p>
          </div>
          <button
            type="button"
            onClick={() => onNavigate('complaints')}
            className="text-xs font-semibold text-blue-600 hover:text-blue-700 flex items-center gap-1"
          >
            <span>View All Complaints</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-700">
            <thead className="bg-slate-50 border-b border-slate-200 text-slate-500 uppercase text-[10px] font-semibold tracking-wider">
              <tr>
                <th className="py-3 px-4">Complaint ID</th>
                <th className="py-3 px-4">Location</th>
                <th className="py-3 px-4">Ward / Zone</th>
                <th className="py-3 px-4">Problem</th>
                <th className="py-3 px-4">Severity</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4">Reported Time</th>
                <th className="py-3 px-4 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {recentComplaints.map((c) => (
                <tr key={c.complaint_id} className="hover:bg-slate-50/80 transition-colors">
                  <td className="py-3 px-4 font-mono font-bold text-blue-600">{c.complaint_id}</td>
                  <td className="py-3 px-4 font-medium text-slate-900 max-w-[200px] truncate">
                    {c.location_name}
                  </td>
                  <td className="py-3 px-4 whitespace-nowrap">
                    {c.ward_name} &bull; <span className="font-semibold text-slate-600">{c.zone_code}</span>
                  </td>
                  <td className="py-3 px-4 max-w-[220px] truncate text-slate-600">{c.problem_type}</td>
                  <td className="py-3 px-4 whitespace-nowrap">
                    <StatusBadge status={c.severity} type="severity" size="sm" />
                  </td>
                  <td className="py-3 px-4 whitespace-nowrap">
                    <StatusBadge status={c.status} type="status" size="sm" />
                  </td>
                  <td className="py-3 px-4 text-slate-500 whitespace-nowrap">{c.reported_at}</td>
                  <td className="py-3 px-4 text-right whitespace-nowrap">
                    {c.status === 'Pending' ? (
                      <button
                        type="button"
                        onClick={() => {
                          onAssignJob?.(c);
                          onNavigate('jobs');
                        }}
                        className="px-2.5 py-1 rounded bg-blue-600 hover:bg-blue-700 text-white font-semibold text-[11px] shadow-xs"
                      >
                        Assign Worker
                      </button>
                    ) : (
                      <button
                        type="button"
                        onClick={() => onNavigate('complaints')}
                        className="px-2 py-1 rounded text-slate-600 hover:text-blue-700 hover:bg-blue-50 font-medium text-[11px]"
                      >
                        Inspect
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
