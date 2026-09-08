import React, { useState } from 'react';
import {
  Users,
  Search,
  Filter,
  Plus,
  Eye,
  CheckCircle,
  Briefcase,
  Phone,
  MapPin,
  X,
  ShieldCheck,
  HardHat
} from 'lucide-react';
import { Worker, WorkerAvailability, VerificationStatus, Job, Payment, WorkLog } from '../../types';
import { StatusBadge } from '../common/StatusBadge';
import { WorkerDetailsModal } from './WorkerDetailsModal';

interface WorkersPageProps {
  workers: Worker[];
  jobs: Job[];
  payments: Payment[];
  workLogs: WorkLog[];
  onAddWorker: (worker: Omit<Worker, 'worker_id' | 'total_completed_jobs' | 'total_distance_km' | 'total_machine_hours'>) => void;
  onVerifyWorker: (workerId: string) => void;
  onAssignJobClick: (worker: Worker) => void;
}

export const WorkersPage: React.FC<WorkersPageProps> = ({
  workers = [],
  jobs = [],
  payments = [],
  workLogs = [],
  onAddWorker,
  onVerifyWorker,
  onAssignJobClick
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [zoneFilter, setZoneFilter] = useState<string>('ALL');
  const [availFilter, setAvailFilter] = useState<string>('ALL');
  const [selectedWorker, setSelectedWorker] = useState<Worker | null>(null);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);

  // New worker form state
  const [newCode, setNewCode] = useState(`W${String(workers.length + 1).padStart(3, '0')}`);
  const [newName, setNewName] = useState('');
  const [newPhone, setNewPhone] = useState('');
  const [newEmail, setNewEmail] = useState('');
  const [newZone, setNewZone] = useState('zone-a');

  const filteredWorkers = workers.filter((w) => {
    const matchSearch =
      w.worker_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      w.worker_code.toLowerCase().includes(searchTerm.toLowerCase()) ||
      w.worker_id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      w.phone.includes(searchTerm);
    const matchZone = zoneFilter === 'ALL' || w.zone_id === zoneFilter;
    const matchAvail = availFilter === 'ALL' || w.availability === availFilter;
    return matchSearch && matchZone && matchAvail;
  });

  const handleCreateWorker = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newName.trim()) return;

    onAddWorker({
      worker_code: newCode,
      worker_name: newName,
      phone: newPhone || '+91 98000 00000',
      email: newEmail || `${newName.toLowerCase().replace(/\s+/g, '.')}@draintrack.gov.in`,
      zone_id: newZone,
      latitude: 12.975 + (Math.random() - 0.5) * 0.05,
      longitude: 77.635 + (Math.random() - 0.5) * 0.05,
      availability: 'Available',
      verification_status: 'Verified',
      user_id: `usr-w-${Date.now()}`
    });

    setIsAddModalOpen(false);
    setNewName('');
    setNewPhone('');
    setNewEmail('');
  };

  return (
    <div id="admin-workers-page" className="space-y-6">
      {/* Header & Actions */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-slate-900 flex items-center gap-2">
            <Users className="w-5 h-5 text-blue-600" />
            <span>Field Sanitation Workers Directory</span>
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Manage certified machine operators, track real-time availability, and assign desilting tasks
          </p>
        </div>

        <button
          type="button"
          onClick={() => {
            setNewCode(`W${String(workers.length + 1).padStart(3, '0')}`);
            setIsAddModalOpen(true);
          }}
          className="flex items-center gap-2 px-3.5 py-2 rounded-lg bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold shadow-xs transition-colors self-start sm:self-auto"
        >
          <Plus className="w-4 h-4" />
          <span>Add Worker</span>
        </button>
      </div>

      {/* Filter Bar */}
      <div className="bg-white rounded-xl p-4 border border-slate-200 shadow-xs flex flex-wrap items-center justify-between gap-3">
        {/* Search */}
        <div className="relative flex-1 min-w-[220px]">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 transform -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search by name, code (e.g. W001), phone..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-9 pr-3 py-1.5 rounded-lg border border-slate-200 text-xs focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
          />
        </div>

        {/* Dropdowns */}
        <div className="flex items-center gap-2 flex-wrap">
          <select
            value={zoneFilter}
            onChange={(e) => setZoneFilter(e.target.value)}
            className="px-2.5 py-1.5 rounded-lg border border-slate-200 text-xs text-slate-700 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/20"
          >
            <option value="ALL">All Zones</option>
            <option value="zone-a">Zone A (Indiranagar)</option>
            <option value="zone-b">Zone B (Halasuru)</option>
            <option value="zone-c">Zone C (Koramangala)</option>
            <option value="zone-d">Zone D (BTM Layout)</option>
          </select>

          <select
            value={availFilter}
            onChange={(e) => setAvailFilter(e.target.value)}
            className="px-2.5 py-1.5 rounded-lg border border-slate-200 text-xs text-slate-700 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/20"
          >
            <option value="ALL">All Availability</option>
            <option value="Available">Available</option>
            <option value="Busy">Busy</option>
            <option value="Off-duty">Off-duty</option>
          </select>
        </div>
      </div>

      {/* Workers Table */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-700">
            <thead className="bg-slate-50 border-b border-slate-200 text-slate-500 uppercase text-[10px] font-semibold tracking-wider">
              <tr>
                <th className="py-3 px-4">Worker ID</th>
                <th className="py-3 px-4">Worker Code</th>
                <th className="py-3 px-4">Worker Name</th>
                <th className="py-3 px-4">Zone</th>
                <th className="py-3 px-4">Availability</th>
                <th className="py-3 px-4">Verification</th>
                <th className="py-3 px-4">Current Job</th>
                <th className="py-3 px-4">GPS Location</th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredWorkers.map((w) => {
                const activeJob = jobs.find((j) => j.job_id === w.active_job_id);

                return (
                  <tr key={w.worker_id} className="hover:bg-slate-50/80 transition-colors">
                    <td className="py-3 px-4 font-mono font-bold text-slate-600">{w.worker_id}</td>
                    <td className="py-3 px-4 font-mono font-bold text-blue-600">
                      <span className="px-2 py-0.5 rounded bg-blue-50 border border-blue-200 text-blue-700">
                        {w.worker_code}
                      </span>
                    </td>
                    <td className="py-3 px-4 font-semibold text-slate-900">
                      <div>{w.worker_name}</div>
                      <div className="text-[11px] font-normal text-slate-400">{w.phone}</div>
                    </td>
                    <td className="py-3 px-4 uppercase font-semibold text-slate-600">
                      {w.zone_id.replace('zone-', 'Zone ')}
                    </td>
                    <td className="py-3 px-4 whitespace-nowrap">
                      <StatusBadge status={w.availability} type="availability" size="sm" />
                    </td>
                    <td className="py-3 px-4 whitespace-nowrap">
                      <StatusBadge status={w.verification_status} type="verification" size="sm" />
                    </td>
                    <td className="py-3 px-4 whitespace-nowrap">
                      {w.active_job_id ? (
                        <div className="flex items-center gap-1.5 font-mono text-blue-700 font-medium">
                          <Briefcase className="w-3.5 h-3.5 text-blue-600" />
                          <span>{w.active_job_id}</span>
                        </div>
                      ) : (
                        <span className="text-slate-400 italic">None</span>
                      )}
                    </td>
                    <td className="py-3 px-4 whitespace-nowrap text-[11px] text-slate-500">
                      {w.latitude.toFixed(4)}, {w.longitude.toFixed(4)}
                    </td>
                    <td className="py-3 px-4 text-right whitespace-nowrap">
                      <div className="flex items-center justify-end gap-1">
                        {/* View Worker button */}
                        <button
                          type="button"
                          onClick={() => setSelectedWorker(w)}
                          className="p-1.5 rounded-lg text-slate-600 hover:text-blue-600 hover:bg-blue-50 transition-colors"
                          title="View Detailed Profile"
                        >
                          <Eye className="w-4 h-4" />
                        </button>

                        {/* Verify Worker */}
                        {w.verification_status === 'Pending' && (
                          <button
                            type="button"
                            onClick={() => onVerifyWorker(w.worker_id)}
                            className="px-2 py-1 rounded bg-emerald-600 hover:bg-emerald-700 text-white font-semibold text-[11px] shadow-xs"
                            title="Verify Worker Credentials"
                          >
                            Verify
                          </button>
                        )}

                        {/* Assign Job button */}
                        {w.availability === 'Available' && (
                          <button
                            type="button"
                            onClick={() => onAssignJobClick(w)}
                            className="px-2 py-1 rounded bg-blue-600 hover:bg-blue-700 text-white font-semibold text-[11px] shadow-xs"
                            title="Assign Pending Job"
                          >
                            Assign Job
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Worker Details Modal */}
      {selectedWorker && (
        <WorkerDetailsModal
          worker={selectedWorker}
          jobs={jobs}
          payments={payments}
          workLogs={workLogs}
          onClose={() => setSelectedWorker(null)}
          onVerify={(id) => {
            onVerifyWorker(id);
            setSelectedWorker((prev) => (prev ? { ...prev, verification_status: 'Verified' } : null));
          }}
        />
      )}

      {/* Add Worker Modal */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
          <div className="bg-white rounded-2xl border border-slate-200 shadow-2xl max-w-md w-full p-6 animate-in fade-in zoom-in-95">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
                <HardHat className="w-5 h-5 text-blue-600" />
                <span>Register Sanitation Worker</span>
              </h3>
              <button
                type="button"
                onClick={() => setIsAddModalOpen(false)}
                className="p-1 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleCreateWorker} className="space-y-4 text-xs">
              <div>
                <label className="block text-slate-600 font-semibold mb-1">Worker Code</label>
                <input
                  type="text"
                  value={newCode}
                  onChange={(e) => setNewCode(e.target.value)}
                  className="w-full p-2 rounded-lg border border-slate-200 font-mono text-xs focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
                  required
                />
              </div>

              <div>
                <label className="block text-slate-600 font-semibold mb-1">Full Name</label>
                <input
                  type="text"
                  placeholder="e.g. Venkatesh Murthy"
                  value={newName}
                  onChange={(e) => setNewName(e.target.value)}
                  className="w-full p-2 rounded-lg border border-slate-200 text-xs focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
                  required
                />
              </div>

              <div>
                <label className="block text-slate-600 font-semibold mb-1">Mobile Phone</label>
                <input
                  type="text"
                  placeholder="+91 98450 00000"
                  value={newPhone}
                  onChange={(e) => setNewPhone(e.target.value)}
                  className="w-full p-2 rounded-lg border border-slate-200 text-xs focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
                />
              </div>

              <div>
                <label className="block text-slate-600 font-semibold mb-1">Official Email</label>
                <input
                  type="email"
                  placeholder="worker@draintrack.gov.in"
                  value={newEmail}
                  onChange={(e) => setNewEmail(e.target.value)}
                  className="w-full p-2 rounded-lg border border-slate-200 text-xs focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
                />
              </div>

              <div>
                <label className="block text-slate-600 font-semibold mb-1">Assigned Zone</label>
                <select
                  value={newZone}
                  onChange={(e) => setNewZone(e.target.value)}
                  className="w-full p-2 rounded-lg border border-slate-200 text-xs bg-white focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
                >
                  <option value="zone-a">Zone A - Indiranagar Corridor</option>
                  <option value="zone-b">Zone B - Halasuru Catchment</option>
                  <option value="zone-c">Zone C - Koramangala Network</option>
                  <option value="zone-d">Zone D - BTM Storm Drain</option>
                </select>
              </div>

              <div className="pt-3 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsAddModalOpen(false)}
                  className="px-3 py-1.5 rounded-lg border border-slate-200 text-slate-600 hover:bg-slate-50 font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 rounded-lg bg-blue-600 hover:bg-blue-700 text-white font-semibold shadow-xs"
                >
                  Register Worker
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
