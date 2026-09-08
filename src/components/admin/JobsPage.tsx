import React, { useState } from 'react';
import {
  Briefcase,
  Search,
  Filter,
  UserCheck,
  MapPin,
  Clock,
  ArrowRight,
  CheckCircle2,
  Navigation,
  Activity,
  ShieldCheck,
  AlertOctagon,
  ChevronRight,
  ExternalLink
} from 'lucide-react';
import { Job, JobStatus, Worker, Complaint } from '../../types';
import { StatusBadge } from '../common/StatusBadge';

interface JobsPageProps {
  jobs: Job[];
  workers: Worker[];
  complaints: Complaint[];
  onAssignWorker: (complaint: Complaint, worker: Worker, distanceKm: number) => void;
  onUpdateJobStatus: (jobId: string, status: JobStatus) => void;
  onNavigateToMonitoring?: () => void;
  onNavigateToVerification?: () => void;
}

export const JobsPage: React.FC<JobsPageProps> = ({
  jobs = [],
  workers = [],
  complaints = [],
  onAssignWorker,
  onUpdateJobStatus,
  onNavigateToMonitoring,
  onNavigateToVerification
}) => {
  const [activeTab, setActiveTab] = useState<'ALL_JOBS' | 'PENDING_ASSIGNMENT'>('ALL_JOBS');
  const [statusFilter, setStatusFilter] = useState<string>('ALL');
  const [searchTerm, setSearchTerm] = useState('');

  // Pending complaints awaiting job creation/worker assignment
  const pendingComplaints = complaints.filter((c) => c.status === 'Pending');

  const filteredJobs = jobs.filter((j) => {
    const matchSearch =
      j.job_id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      j.location_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (j.worker_name && j.worker_name.toLowerCase().includes(searchTerm.toLowerCase()));
    const matchStatus = statusFilter === 'ALL' || j.job_status === statusFilter;
    return matchSearch && matchStatus;
  });

  const getStepIndex = (status: JobStatus) => {
    const steps: JobStatus[] = ['Assigned', 'Accepted', 'Travelling', 'Working', 'Completed', 'Verified'];
    return steps.indexOf(status);
  };

  return (
    <div id="admin-jobs-page" className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-slate-900 flex items-center gap-2">
            <Briefcase className="w-5 h-5 text-blue-600" />
            <span>Job Dispatch &amp; Work Pipeline</span>
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Real-time tracking through 6-stage lifecycle: Assigned &rarr; Accepted &rarr; Travelling &rarr; Working &rarr; Completed &rarr; Verified
          </p>
        </div>

        {/* Tab switch */}
        <div className="flex items-center rounded-lg bg-slate-100 p-1 border border-slate-200 text-xs font-semibold">
          <button
            type="button"
            onClick={() => setActiveTab('ALL_JOBS')}
            className={`px-3 py-1.5 rounded-md transition-all ${
              activeTab === 'ALL_JOBS' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            All Jobs ({jobs.length})
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('PENDING_ASSIGNMENT')}
            className={`px-3 py-1.5 rounded-md transition-all flex items-center gap-1.5 ${
              activeTab === 'PENDING_ASSIGNMENT'
                ? 'bg-blue-600 text-white shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <span>Assign Pending</span>
            {pendingComplaints.length > 0 && (
              <span className="px-1.5 py-0.2 rounded-full bg-rose-500 text-white text-[10px]">
                {pendingComplaints.length}
              </span>
            )}
          </button>
        </div>
      </div>

      {/* VIEW 1: PENDING JOB DISPATCH RECOMMENDATION ENGINE */}
      {activeTab === 'PENDING_ASSIGNMENT' && (
        <div className="space-y-6">
          <div className="p-4 rounded-xl bg-blue-50/70 border border-blue-200 flex items-center justify-between text-xs">
            <div className="flex items-center gap-2 text-blue-900 font-medium">
              <UserCheck className="w-4 h-4 text-blue-600 shrink-0" />
              <span>
                <strong>Automated Proximity Dispatch:</strong> Showing pending complaints paired with nearest verified sanitation workers.
              </span>
            </div>
          </div>

          {pendingComplaints.length === 0 ? (
            <div className="p-12 text-center bg-white rounded-xl border border-slate-200">
              <CheckCircle2 className="w-12 h-12 text-emerald-500 mx-auto mb-2" />
              <h3 className="font-bold text-slate-800 text-base">No Pending Complaints</h3>
              <p className="text-xs text-slate-500 mt-1">All reported drainages are currently assigned to field personnel.</p>
            </div>
          ) : (
            <div className="space-y-4">
              {pendingComplaints.map((complaint) => (
                <div
                  key={complaint.complaint_id}
                  className="bg-white rounded-xl border border-slate-200 p-5 shadow-xs hover:border-blue-300 transition-all"
                >
                  <div className="flex flex-col lg:flex-row lg:items-start justify-between gap-4">
                    {/* Complaint Details */}
                    <div className="space-y-1.5 max-w-md">
                      <div className="flex items-center gap-2">
                        <span className="font-mono text-xs font-bold text-blue-600">
                          {complaint.complaint_id}
                        </span>
                        <StatusBadge status={complaint.severity} type="severity" size="sm" />
                        <span className="text-[11px] text-slate-400">&bull; {complaint.reported_at}</span>
                      </div>

                      <h4 className="font-bold text-slate-900 text-sm sm:text-base">
                        {complaint.location_name}
                      </h4>

                      <div className="text-xs text-slate-600 flex flex-wrap gap-2 items-center">
                        <span className="font-medium text-slate-800">{complaint.ward_name}</span>
                        <span>&bull;</span>
                        <span className="font-semibold text-slate-700">{complaint.zone_code}</span>
                        <span>&bull;</span>
                        <span className="font-mono text-slate-500">GPS: 12.9784, 77.6408</span>
                      </div>

                      <p className="text-xs text-slate-600 bg-slate-50 p-2.5 rounded-lg border border-slate-200 mt-2">
                        <strong className="text-slate-800">Problem: </strong>
                        {complaint.problem_type} &mdash; {complaint.description}
                      </p>
                    </div>

                    {/* Nearby Recommended Workers Table */}
                    <div className="flex-1 max-w-xl">
                      <span className="text-xs font-bold text-slate-700 uppercase tracking-wider block mb-2">
                        Recommended Nearby Workers (Proximity Sorted)
                      </span>

                      <div className="space-y-2 text-xs">
                        {workers.slice(0, 3).map((worker, idx) => {
                          const dist = [0.8, 1.5, 3.2][idx] || 2.4;
                          const isAvailable = worker.availability === 'Available';

                          return (
                            <div
                              key={worker.worker_id}
                              className={`p-3 rounded-lg border flex items-center justify-between transition-colors ${
                                isAvailable
                                  ? 'bg-slate-50/70 border-slate-200 hover:bg-blue-50/40 hover:border-blue-300'
                                  : 'bg-slate-50/40 border-slate-200 opacity-75'
                              }`}
                            >
                              <div className="flex items-center gap-3">
                                <span className="font-mono font-bold text-blue-700 bg-blue-50 px-2 py-0.5 rounded border border-blue-200">
                                  {worker.worker_code}
                                </span>
                                <div>
                                  <div className="font-bold text-slate-900">{worker.worker_name}</div>
                                  <div className="text-[11px] text-slate-500 flex items-center gap-2">
                                    <span className="font-semibold text-blue-600">{dist} km away</span>
                                    <span>&bull;</span>
                                    <span
                                      className={
                                        worker.availability === 'Available'
                                          ? 'text-emerald-700 font-semibold'
                                          : 'text-amber-700'
                                      }
                                    >
                                      {worker.availability}
                                    </span>
                                    <span>&bull;</span>
                                    <span className="text-slate-600">{worker.verification_status}</span>
                                  </div>
                                </div>
                              </div>

                              <button
                                type="button"
                                onClick={() => {
                                  onAssignWorker(complaint, worker, dist);
                                  setActiveTab('ALL_JOBS');
                                }}
                                className="px-3.5 py-1.5 rounded-lg bg-blue-600 hover:bg-blue-700 text-white font-semibold text-xs shadow-xs transition-colors"
                              >
                                Assign Worker
                              </button>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* VIEW 2: ALL JOBS LIST & LIFECYCLE FLOW */}
      {activeTab === 'ALL_JOBS' && (
        <div className="space-y-4">
          {/* Filter Bar */}
          <div className="bg-white rounded-xl p-4 border border-slate-200 shadow-xs flex flex-wrap items-center justify-between gap-3">
            <div className="relative flex-1 min-w-[220px]">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 transform -translate-y-1/2" />
              <input
                type="text"
                placeholder="Search jobs by ID, location, worker..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-9 pr-3 py-1.5 rounded-lg border border-slate-200 text-xs focus:ring-2 focus:ring-blue-500/20"
              />
            </div>

            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="px-2.5 py-1.5 rounded-lg border border-slate-200 text-xs text-slate-700 bg-white"
            >
              <option value="ALL">All Job Statuses</option>
              <option value="Assigned">Assigned</option>
              <option value="Accepted">Accepted</option>
              <option value="Travelling">Travelling</option>
              <option value="Working">Working</option>
              <option value="Completed">Completed</option>
              <option value="Verified">Verified</option>
            </select>
          </div>

          {/* Job Cards */}
          <div className="space-y-3.5">
            {filteredJobs.map((job) => {
              const currentStep = getStepIndex(job.job_status);
              const steps: JobStatus[] = ['Assigned', 'Accepted', 'Travelling', 'Working', 'Completed', 'Verified'];

              return (
                <div
                  key={job.job_id}
                  className="bg-white rounded-xl border border-slate-200 p-5 shadow-xs hover:border-slate-300 transition-all space-y-4"
                >
                  <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <span className="font-mono text-xs font-bold text-blue-600 bg-blue-50 px-2 py-0.5 rounded border border-blue-200">
                          {job.job_id}
                        </span>
                        <StatusBadge status={job.severity} type="severity" size="sm" />
                        <span className="text-[11px] text-slate-400 font-mono">Ref: {job.complaint_id}</span>
                      </div>
                      <h4 className="text-sm sm:text-base font-bold text-slate-900">{job.location_name}</h4>
                      <p className="text-xs text-slate-500">
                        {job.ward_name} &bull; {job.zone_code} &bull; Est. Distance: {job.estimated_distance_km} km
                      </p>
                    </div>

                    <div className="flex items-center gap-2 self-start md:self-auto">
                      <div className="text-right">
                        <span className="text-[10px] text-slate-400 block uppercase font-semibold">Assigned To</span>
                        <span className="text-xs font-bold text-slate-800">
                          {job.worker_name} ({job.worker_code})
                        </span>
                      </div>

                      {job.job_status === 'Working' && (
                        <button
                          type="button"
                          onClick={onNavigateToMonitoring}
                          className="px-3 py-1.5 rounded-lg bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold flex items-center gap-1.5 shadow-xs"
                        >
                          <Activity className="w-3.5 h-3.5 animate-pulse" />
                          <span>Live Telemetry</span>
                        </button>
                      )}

                      {job.job_status === 'Completed' && (
                        <button
                          type="button"
                          onClick={onNavigateToVerification}
                          className="px-3 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold flex items-center gap-1.5 shadow-xs"
                        >
                          <ShieldCheck className="w-3.5 h-3.5" />
                          <span>Verify Work</span>
                        </button>
                      )}
                    </div>
                  </div>

                  {/* 6-Stage Job Flow Visualizer */}
                  <div className="pt-2 border-t border-slate-100">
                    <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-2">
                      Job Status Pipeline
                    </div>
                    <div className="grid grid-cols-6 gap-1 sm:gap-2 text-center text-xs">
                      {steps.map((st, sIdx) => {
                        const isPast = sIdx < currentStep;
                        const isCurrent = sIdx === currentStep;

                        return (
                          <div
                            key={st}
                            className={`p-2 rounded-lg border transition-all ${
                              isCurrent
                                ? 'bg-blue-50 border-blue-400 text-blue-900 font-bold shadow-xs ring-1 ring-blue-400'
                                : isPast
                                ? 'bg-emerald-50 border-emerald-200 text-emerald-800 font-medium'
                                : 'bg-slate-50 border-slate-200 text-slate-400 font-normal'
                            }`}
                          >
                            <div className="flex items-center justify-center mb-1">
                              {isPast ? (
                                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                              ) : isCurrent ? (
                                <span className="w-2 h-2 rounded-full bg-blue-600 animate-ping" />
                              ) : (
                                <span className="w-1.5 h-1.5 rounded-full bg-slate-300" />
                              )}
                            </div>
                            <span className="text-[10px] sm:text-xs block truncate">{st}</span>
                          </div>
                        );
                      })}
                    </div>
                  </div>

                  {/* Administrative Quick Stage Advance (useful for testing & presentation) */}
                  <div className="flex flex-wrap items-center justify-between text-xs text-slate-500 pt-1">
                    <span className="italic">{job.notes || 'Routine municipal desilting schedule'}</span>

                    <div className="flex items-center gap-1.5">
                      <span className="text-[11px] text-slate-400 font-medium">Quick Advance:</span>
                      {job.job_status === 'Assigned' && (
                        <button
                          type="button"
                          onClick={() => onUpdateJobStatus(job.job_id, 'Accepted')}
                          className="px-2 py-0.5 rounded bg-blue-100 hover:bg-blue-200 text-blue-800 font-semibold text-[11px]"
                        >
                          Accept
                        </button>
                      )}
                      {job.job_status === 'Accepted' && (
                        <button
                          type="button"
                          onClick={() => onUpdateJobStatus(job.job_id, 'Travelling')}
                          className="px-2 py-0.5 rounded bg-amber-100 hover:bg-amber-200 text-amber-800 font-semibold text-[11px]"
                        >
                          Travelling
                        </button>
                      )}
                      {job.job_status === 'Travelling' && (
                        <button
                          type="button"
                          onClick={() => onUpdateJobStatus(job.job_id, 'Working')}
                          className="px-2 py-0.5 rounded bg-blue-100 hover:bg-blue-200 text-blue-800 font-semibold text-[11px]"
                        >
                          Start Working
                        </button>
                      )}
                      {job.job_status === 'Working' && (
                        <button
                          type="button"
                          onClick={() => onUpdateJobStatus(job.job_id, 'Completed')}
                          className="px-2 py-0.5 rounded bg-emerald-100 hover:bg-emerald-200 text-emerald-800 font-semibold text-[11px]"
                        >
                          Complete
                        </button>
                      )}
                      {job.job_status === 'Completed' && (
                        <button
                          type="button"
                          onClick={() => onUpdateJobStatus(job.job_id, 'Verified')}
                          className="px-2 py-0.5 rounded bg-teal-100 hover:bg-teal-200 text-teal-800 font-semibold text-[11px]"
                        >
                          Mark Verified
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};
