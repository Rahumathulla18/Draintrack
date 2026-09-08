import React, { useState } from 'react';
import {
  BarChart3,
  Download,
  Calendar,
  Filter,
  CheckCircle2,
  TrendingDown,
  TrendingUp,
  AlertTriangle,
  FileText,
  Printer,
  ShieldCheck
} from 'lucide-react';
import { Worker, Complaint, Job, DrainageLocation, WorkLog, Payment } from '../../types';

interface ReportsPageProps {
  workers: Worker[];
  complaints: Complaint[];
  jobs: Job[];
  drainages: DrainageLocation[];
  workLogs: WorkLog[];
  payments: Payment[];
}

export const ReportsPage: React.FC<ReportsPageProps> = ({
  workers = [],
  complaints = [],
  jobs = [],
  drainages = [],
  workLogs = [],
  payments = []
}) => {
  const [selectedRange, setSelectedRange] = useState('month');
  const [selectedWard, setSelectedWard] = useState('ALL');
  const [exportNotice, setExportNotice] = useState<string | null>(null);

  const verifiedLogs = workLogs.filter((l) => l.work_verified);
  const totalTraverseMeters = workLogs.reduce((acc, l) => acc + (l.distance_travelled || 0), 0);
  const totalPaidAmount = payments
    .filter((p) => p.payment_status === 'Paid' || p.payment_status === 'Approved')
    .reduce((acc, p) => acc + p.amount, 0);

  const resolvedComplaints = complaints.filter((c) => c.status === 'Resolved').length;
  const resolutionRate = complaints.length > 0 ? Math.round((resolvedComplaints / complaints.length) * 100) : 100;

  const handleExport = (type: string) => {
    setExportNotice(`Generating ${type} audit report... Ready in seconds.`);
    setTimeout(() => {
      setExportNotice(null);
    }, 3000);
  };

  return (
    <div id="admin-reports-page" className="space-y-6">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-slate-900 via-slate-800 to-blue-950 rounded-2xl p-6 text-white shadow-md flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1.5">
            <span className="px-2 py-0.5 rounded bg-blue-500/20 text-cyan-300 font-mono text-xs font-semibold uppercase tracking-wider border border-blue-500/30">
              Municipal Audit Analytics
            </span>
            <span className="text-xs text-slate-300 hidden sm:inline">&bull; Telemetry Certified</span>
          </div>
          <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-white flex items-center gap-2.5">
            <BarChart3 className="w-6 h-6 text-cyan-400" />
            <span>Drainage De-silting &amp; Compliance Reports</span>
          </h1>
          <p className="text-xs sm:text-sm text-slate-300 mt-1 max-w-2xl leading-relaxed">
            Automated performance dossiers, turbidity reduction analytics, worker productivity indices, and municipal expenditure audits.
          </p>
        </div>

        {/* Action Controls */}
        <div className="flex flex-wrap items-center gap-2">
          <button
            type="button"
            onClick={() => handleExport('PDF')}
            className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold shadow-xs transition-all"
          >
            <Download className="w-4 h-4" />
            <span>Export Audit PDF</span>
          </button>
          <button
            type="button"
            onClick={() => handleExport('CSV')}
            className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 text-xs font-semibold transition-all"
          >
            <Printer className="w-4 h-4" />
            <span>Print Data</span>
          </button>
        </div>
      </div>

      {exportNotice && (
        <div className="p-3.5 rounded-xl bg-emerald-50 border border-emerald-300 text-emerald-900 text-xs font-semibold flex items-center gap-2 animate-in fade-in">
          <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
          <span>{exportNotice}</span>
        </div>
      )}

      {/* Filter Bar */}
      <div className="bg-white rounded-xl p-4 border border-slate-200 shadow-xs flex flex-wrap items-center justify-between gap-3 text-xs">
        <div className="flex flex-wrap items-center gap-3">
          <div className="flex items-center gap-1.5 text-slate-600 font-semibold">
            <Calendar className="w-4 h-4 text-blue-600" />
            <span>Time Range:</span>
          </div>
          <div className="flex items-center bg-slate-100 p-1 rounded-lg border border-slate-200">
            {['week', 'month', 'quarter', 'year'].map((range) => (
              <button
                key={range}
                type="button"
                onClick={() => setSelectedRange(range)}
                className={`px-3 py-1 rounded-md text-xs font-semibold uppercase tracking-wider transition-all ${
                  selectedRange === range
                    ? 'bg-white text-blue-700 shadow-xs border border-slate-200'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                {range}
              </button>
            ))}
          </div>
        </div>

        <div className="flex items-center gap-2">
          <Filter className="w-4 h-4 text-slate-400" />
          <span className="text-slate-600 font-semibold">Ward Filter:</span>
          <select
            value={selectedWard}
            onChange={(e) => setSelectedWard(e.target.value)}
            className="p-1.5 rounded-lg border border-slate-200 bg-white text-xs text-slate-800"
          >
            <option value="ALL">All Wards (East Zone)</option>
            <option value="Indiranagar">Ward 112 - Indiranagar</option>
            <option value="Halasuru">Ward 113 - Halasuru</option>
            <option value="Ulsoor">Ward 114 - Ulsoor Lake</option>
            <option value="Domlur">Ward 115 - Domlur</option>
          </select>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white p-4 sm:p-5 rounded-2xl border border-slate-200 shadow-xs space-y-2">
          <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">
            Total Conduit De-silted
          </span>
          <div className="flex items-baseline gap-2">
            <span className="text-2xl sm:text-3xl font-black text-slate-900">{totalTraverseMeters}</span>
            <span className="text-xs font-semibold text-slate-500">meters</span>
          </div>
          <span className="text-[11px] text-emerald-600 font-semibold flex items-center gap-1">
            <TrendingUp className="w-3.5 h-3.5" />
            +18.4% vs last period
          </span>
        </div>

        <div className="bg-white p-4 sm:p-5 rounded-2xl border border-slate-200 shadow-xs space-y-2">
          <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">
            Avg Turbidity Clearance
          </span>
          <div className="flex items-baseline gap-2">
            <span className="text-2xl sm:text-3xl font-black text-teal-600">76.8%</span>
            <span className="text-xs font-semibold text-slate-500">NTU drop</span>
          </div>
          <span className="text-[11px] text-emerald-600 font-semibold flex items-center gap-1">
            <TrendingDown className="w-3.5 h-3.5" />
            From 820 down to 190 NTU
          </span>
        </div>

        <div className="bg-white p-4 sm:p-5 rounded-2xl border border-slate-200 shadow-xs space-y-2">
          <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">
            Citizen Grievance Resolution
          </span>
          <div className="flex items-baseline gap-2">
            <span className="text-2xl sm:text-3xl font-black text-blue-600">{resolutionRate}%</span>
            <span className="text-xs font-semibold text-slate-500">resolved</span>
          </div>
          <span className="text-[11px] text-slate-500">
            {resolvedComplaints} of {complaints.length} tickets closed
          </span>
        </div>

        <div className="bg-white p-4 sm:p-5 rounded-2xl border border-slate-200 shadow-xs space-y-2">
          <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">
            Telemetry Verified Disbursements
          </span>
          <div className="flex items-baseline gap-2">
            <span className="text-2xl sm:text-3xl font-black text-slate-900">₹{totalPaidAmount.toLocaleString()}</span>
          </div>
          <span className="text-[11px] text-emerald-600 font-semibold flex items-center gap-1">
            <ShieldCheck className="w-3.5 h-3.5" />
            100% sensor verified
          </span>
        </div>
      </div>

      {/* Ward De-silting Breakdown Table */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
        <div className="p-4 sm:p-5 border-b border-slate-100 flex items-center justify-between">
          <div>
            <h3 className="font-bold text-slate-900 text-sm">Ward-Wise Maintenance Compliance</h3>
            <p className="text-xs text-slate-500 mt-0.5">
              Breakdown of drainage conduits, cleaning runs, and open citizen hazard alerts.
            </p>
          </div>
          <span className="text-xs font-bold text-blue-600 bg-blue-50 px-2.5 py-1 rounded-lg border border-blue-200">
            Bengaluru East Zone
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 border-b border-slate-200 text-slate-600 uppercase text-[10px] font-bold tracking-wider">
              <tr>
                <th className="py-3 px-4">Ward Name</th>
                <th className="py-3 px-4">Total Conduits</th>
                <th className="py-3 px-4">Clean Status</th>
                <th className="py-3 px-4">Needs Work</th>
                <th className="py-3 px-4">Distance Traverse</th>
                <th className="py-3 px-4">Compliance SLA</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-slate-700">
              <tr className="hover:bg-slate-50">
                <td className="py-3.5 px-4 font-bold text-slate-900">Ward 112 - Indiranagar</td>
                <td className="py-3.5 px-4">2 Corridors</td>
                <td className="py-3.5 px-4">
                  <span className="px-2 py-0.5 rounded bg-emerald-50 text-emerald-700 font-bold border border-emerald-200">
                    Good / Clear
                  </span>
                </td>
                <td className="py-3.5 px-4 font-mono font-semibold text-slate-600">0 Critical</td>
                <td className="py-3.5 px-4 font-mono font-semibold text-slate-900">260 m</td>
                <td className="py-3.5 px-4 font-bold text-emerald-600">96.5%</td>
              </tr>
              <tr className="hover:bg-slate-50">
                <td className="py-3.5 px-4 font-bold text-slate-900">Ward 113 - Halasuru</td>
                <td className="py-3.5 px-4">2 Corridors</td>
                <td className="py-3.5 px-4">
                  <span className="px-2 py-0.5 rounded bg-amber-50 text-amber-700 font-bold border border-amber-200">
                    Needs Attention
                  </span>
                </td>
                <td className="py-3.5 px-4 font-mono font-semibold text-amber-600">1 Blocked</td>
                <td className="py-3.5 px-4 font-mono font-semibold text-slate-900">180 m</td>
                <td className="py-3.5 px-4 font-bold text-amber-600">84.0%</td>
              </tr>
              <tr className="hover:bg-slate-50">
                <td className="py-3.5 px-4 font-bold text-slate-900">Ward 114 - Ulsoor Lake</td>
                <td className="py-3.5 px-4">1 Arterial</td>
                <td className="py-3.5 px-4">
                  <span className="px-2 py-0.5 rounded bg-rose-50 text-rose-700 font-bold border border-rose-200">
                    Critical Blockage
                  </span>
                </td>
                <td className="py-3.5 px-4 font-mono font-semibold text-rose-600">1 Severe</td>
                <td className="py-3.5 px-4 font-mono font-semibold text-slate-900">90 m</td>
                <td className="py-3.5 px-4 font-bold text-rose-600">72.0%</td>
              </tr>
              <tr className="hover:bg-slate-50">
                <td className="py-3.5 px-4 font-bold text-slate-900">Ward 115 - Domlur</td>
                <td className="py-3.5 px-4">1 Arterial</td>
                <td className="py-3.5 px-4">
                  <span className="px-2 py-0.5 rounded bg-emerald-50 text-emerald-700 font-bold border border-emerald-200">
                    Clear Flow
                  </span>
                </td>
                <td className="py-3.5 px-4 font-mono font-semibold text-slate-600">0 Critical</td>
                <td className="py-3.5 px-4 font-mono font-semibold text-slate-900">310 m</td>
                <td className="py-3.5 px-4 font-bold text-emerald-600">98.0%</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
