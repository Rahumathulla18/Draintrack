import React from 'react';
import {
  X,
  User,
  Phone,
  Mail,
  MapPin,
  ShieldCheck,
  Award,
  Clock,
  Navigation,
  CreditCard,
  Briefcase,
  Activity
} from 'lucide-react';
import { Worker, Job, Payment, WorkLog } from '../../types';
import { StatusBadge } from '../common/StatusBadge';

interface WorkerDetailsModalProps {
  worker: Worker;
  jobs: Job[];
  payments: Payment[];
  workLogs: WorkLog[];
  onClose: () => void;
  onVerify?: (workerId: string) => void;
}

export const WorkerDetailsModal: React.FC<WorkerDetailsModalProps> = ({
  worker,
  jobs,
  payments,
  workLogs,
  onClose,
  onVerify
}) => {
  const workerJobs = jobs.filter((j) => j.worker_id === worker.worker_id);
  const workerPayments = payments.filter((p) => p.worker_id === worker.worker_id);
  const workerLogs = workLogs.filter((l) => l.worker_id === worker.worker_id);

  return (
    <div
      id="worker-details-modal"
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-900/60 backdrop-blur-xs overflow-y-auto"
    >
      <div className="bg-white rounded-2xl border border-slate-200 shadow-2xl max-w-2xl w-full max-h-[90vh] flex flex-col overflow-hidden my-auto animate-in fade-in zoom-in-95 duration-200">
        {/* Modal Header */}
        <div className="px-6 py-5 bg-gradient-to-r from-slate-900 to-navy-950 text-white flex items-start justify-between">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-xl bg-blue-600 flex items-center justify-center text-white font-bold text-lg shadow-md">
              {worker.worker_name.split(' ').map((n) => n[0]).join('')}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-lg font-bold text-white">{worker.worker_name}</h3>
                <span className="font-mono text-xs px-2 py-0.5 rounded bg-blue-500/20 text-cyan-300 border border-blue-400/30">
                  {worker.worker_code}
                </span>
              </div>
              <p className="text-xs text-slate-300 mt-0.5">
                ID: {worker.worker_id} &bull; Zone: {worker.zone_id.toUpperCase()}
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 overflow-y-auto space-y-6">
          {/* Status Bar */}
          <div className="flex flex-wrap items-center justify-between gap-3 p-3.5 rounded-xl bg-slate-50 border border-slate-200">
            <div className="flex items-center gap-2">
              <span className="text-xs text-slate-500 font-medium">Availability:</span>
              <StatusBadge status={worker.availability} type="availability" />
            </div>

            <div className="flex items-center gap-2">
              <span className="text-xs text-slate-500 font-medium">Verification Status:</span>
              <StatusBadge status={worker.verification_status} type="verification" />
              {worker.verification_status === 'Pending' && onVerify && (
                <button
                  type="button"
                  onClick={() => onVerify(worker.worker_id)}
                  className="px-2.5 py-1 rounded bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold"
                >
                  Verify Now
                </button>
              )}
            </div>
          </div>

          {/* Core Info Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="p-3.5 rounded-xl border border-slate-200 bg-white space-y-2">
              <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block">
                Contact &amp; Assignment
              </span>
              <div className="flex items-center gap-2 text-xs text-slate-700">
                <Phone className="w-3.5 h-3.5 text-slate-400" />
                <span>{worker.phone}</span>
              </div>
              <div className="flex items-center gap-2 text-xs text-slate-700">
                <Mail className="w-3.5 h-3.5 text-slate-400" />
                <span>{worker.email}</span>
              </div>
              <div className="flex items-center gap-2 text-xs text-slate-700">
                <MapPin className="w-3.5 h-3.5 text-slate-400" />
                <span>
                  GPS: {worker.latitude}, {worker.longitude}
                </span>
              </div>
            </div>

            {/* Performance Stats */}
            <div className="p-3.5 rounded-xl border border-slate-200 bg-white space-y-2">
              <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block">
                Machine &amp; Desilting Metrics
              </span>
              <div className="grid grid-cols-3 gap-2 text-center pt-1">
                <div className="p-2 rounded-lg bg-blue-50 border border-blue-100">
                  <span className="text-lg font-bold text-blue-700 block">
                    {worker.total_completed_jobs}
                  </span>
                  <span className="text-[10px] text-slate-600">Jobs Done</span>
                </div>
                <div className="p-2 rounded-lg bg-emerald-50 border border-emerald-100">
                  <span className="text-lg font-bold text-emerald-700 block">
                    {worker.total_distance_km} km
                  </span>
                  <span className="text-[10px] text-slate-600">Conduit Dist.</span>
                </div>
                <div className="p-2 rounded-lg bg-purple-50 border border-purple-100">
                  <span className="text-lg font-bold text-purple-700 block">
                    {worker.total_machine_hours} h
                  </span>
                  <span className="text-[10px] text-slate-600">Pump/Brush</span>
                </div>
              </div>
            </div>
          </div>

          {/* Work History */}
          <div>
            <h4 className="text-xs font-bold text-slate-800 uppercase tracking-wider mb-2 flex items-center gap-1.5">
              <Briefcase className="w-3.5 h-3.5 text-blue-600" />
              <span>Assigned &amp; Completed Work Logs ({workerJobs.length})</span>
            </h4>
            <div className="border border-slate-200 rounded-xl overflow-hidden text-xs">
              {workerJobs.length === 0 ? (
                <div className="p-4 text-center text-slate-400">No jobs assigned yet</div>
              ) : (
                <table className="w-full text-left">
                  <thead className="bg-slate-50 border-b border-slate-200 text-slate-500 font-semibold text-[10px]">
                    <tr>
                      <th className="p-2.5">Job ID</th>
                      <th className="p-2.5">Location</th>
                      <th className="p-2.5">Status</th>
                      <th className="p-2.5">Assigned</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {workerJobs.map((j) => (
                      <tr key={j.job_id} className="hover:bg-slate-50">
                        <td className="p-2.5 font-mono font-bold text-blue-600">{j.job_id}</td>
                        <td className="p-2.5 font-medium text-slate-900">{j.location_name}</td>
                        <td className="p-2.5">
                          <StatusBadge status={j.job_status} type="job" size="sm" />
                        </td>
                        <td className="p-2.5 text-slate-500">{j.assigned_at}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </div>
          </div>

          {/* Payment History */}
          <div>
            <h4 className="text-xs font-bold text-slate-800 uppercase tracking-wider mb-2 flex items-center gap-1.5">
              <CreditCard className="w-3.5 h-3.5 text-emerald-600" />
              <span>Payment &amp; Compensation History ({workerPayments.length})</span>
            </h4>
            <div className="border border-slate-200 rounded-xl overflow-hidden text-xs">
              {workerPayments.length === 0 ? (
                <div className="p-4 text-center text-slate-400">No payment records yet</div>
              ) : (
                <table className="w-full text-left">
                  <thead className="bg-slate-50 border-b border-slate-200 text-slate-500 font-semibold text-[10px]">
                    <tr>
                      <th className="p-2.5">Payment ID</th>
                      <th className="p-2.5">Work Location</th>
                      <th className="p-2.5">Amount</th>
                      <th className="p-2.5">Status</th>
                      <th className="p-2.5">Approved By</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {workerPayments.map((p) => (
                      <tr key={p.payment_id} className="hover:bg-slate-50">
                        <td className="p-2.5 font-mono font-bold text-slate-800">{p.payment_id}</td>
                        <td className="p-2.5 text-slate-700">{p.location_name}</td>
                        <td className="p-2.5 font-bold text-slate-900">₹{p.amount.toLocaleString()}</td>
                        <td className="p-2.5">
                          <StatusBadge status={p.payment_status} type="payment" size="sm" />
                        </td>
                        <td className="p-2.5 text-slate-500">{p.approved_by || 'Pending review'}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </div>
          </div>
        </div>

        {/* Modal Footer */}
        <div className="px-6 py-3.5 bg-slate-50 border-t border-slate-200 flex items-center justify-end">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 rounded-lg bg-slate-800 hover:bg-slate-900 text-white text-xs font-semibold transition-colors"
          >
            Close Details
          </button>
        </div>
      </div>
    </div>
  );
};
