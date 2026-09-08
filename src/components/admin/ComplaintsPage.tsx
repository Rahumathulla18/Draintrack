import React, { useState } from 'react';
import {
  AlertOctagon,
  Search,
  Filter,
  Plus,
  Eye,
  UserCheck,
  Clock,
  MapPin,
  X,
  CheckCircle2,
  AlertTriangle,
  ArrowRight,
  Phone
} from 'lucide-react';
import { Complaint, ComplaintSeverity, ComplaintStatus, Worker, DrainageLocation } from '../../types';
import { StatusBadge } from '../common/StatusBadge';

interface ComplaintsPageProps {
  complaints: Complaint[];
  workers: Worker[];
  drainages: DrainageLocation[];
  onNewComplaint: (complaint: Omit<Complaint, 'complaint_id' | 'reported_at' | 'status'>) => void;
  onAssignWorker: (complaintId: string, worker: Worker) => void;
  onChangeStatus: (complaintId: string, status: ComplaintStatus) => void;
  onChangePriority: (complaintId: string, severity: ComplaintSeverity) => void;
}

export const ComplaintsPage: React.FC<ComplaintsPageProps> = ({
  complaints = [],
  workers = [],
  drainages = [],
  onNewComplaint,
  onAssignWorker,
  onChangeStatus,
  onChangePriority
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [severityFilter, setSeverityFilter] = useState<string>('ALL');
  const [statusFilter, setStatusFilter] = useState<string>('ALL');
  const [selectedComplaint, setSelectedComplaint] = useState<Complaint | null>(null);
  const [assigningComplaint, setAssigningComplaint] = useState<Complaint | null>(null);
  const [isNewModalOpen, setIsNewModalOpen] = useState(false);

  // New complaint form state
  const [drainageId, setDrainageId] = useState(drainages[0]?.drainage_id || 'DR-101');
  const [problemType, setProblemType] = useState('Severe Sludge Clog & Waterlogging');
  const [description, setDescription] = useState('');
  const [severity, setSeverity] = useState<ComplaintSeverity>('High');
  const [reportedBy, setReportedBy] = useState('Municipal Field Patrol');
  const [reporterPhone, setReporterPhone] = useState('+91 98450 11000');

  const filteredComplaints = complaints.filter((c) => {
    const matchSearch =
      c.complaint_id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      c.location_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      c.problem_type.toLowerCase().includes(searchTerm.toLowerCase()) ||
      c.reported_by.toLowerCase().includes(searchTerm.toLowerCase());
    const matchSeverity = severityFilter === 'ALL' || c.severity === severityFilter;
    const matchStatus = statusFilter === 'ALL' || c.status === statusFilter;
    return matchSearch && matchSeverity && matchStatus;
  });

  const handleCreateComplaint = (e: React.FormEvent) => {
    e.preventDefault();
    const d = drainages.find((item) => item.drainage_id === drainageId) || drainages[0];

    onNewComplaint({
      drainage_id: d.drainage_id,
      location_name: d.location_name,
      ward_name: d.ward_name,
      zone_code: d.zone_id.replace('zone-', 'Zone ').toUpperCase(),
      problem_type: problemType,
      description: description || 'Severe blockage reported requiring immediate portable cleaning machine deployment.',
      severity,
      reported_by: reportedBy,
      reporter_phone: reporterPhone
    });

    setIsNewModalOpen(false);
    setDescription('');
  };

  return (
    <div id="admin-complaints-page" className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-slate-900 flex items-center gap-2">
            <AlertOctagon className="w-5 h-5 text-rose-600" />
            <span>Drainage Complaints &amp; Citizen Grievances</span>
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Triage public reports, prioritize severe blockages, and trigger rapid field sanitation dispatches
          </p>
        </div>

        <button
          type="button"
          onClick={() => setIsNewModalOpen(true)}
          className="flex items-center gap-2 px-3.5 py-2 rounded-lg bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold shadow-xs transition-colors self-start sm:self-auto"
        >
          <Plus className="w-4 h-4" />
          <span>New Complaint</span>
        </button>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white rounded-xl p-4 border border-slate-200 shadow-xs flex flex-wrap items-center justify-between gap-3">
        <div className="relative flex-1 min-w-[220px]">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 transform -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search complaints by ID, location, citizen name..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-9 pr-3 py-1.5 rounded-lg border border-slate-200 text-xs focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
          />
        </div>

        <div className="flex items-center gap-2 flex-wrap">
          <select
            value={severityFilter}
            onChange={(e) => setSeverityFilter(e.target.value)}
            className="px-2.5 py-1.5 rounded-lg border border-slate-200 text-xs text-slate-700 bg-white"
          >
            <option value="ALL">All Severities</option>
            <option value="Critical">Critical</option>
            <option value="High">High</option>
            <option value="Medium">Medium</option>
            <option value="Low">Low</option>
          </select>

          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-2.5 py-1.5 rounded-lg border border-slate-200 text-xs text-slate-700 bg-white"
          >
            <option value="ALL">All Statuses</option>
            <option value="Pending">Pending</option>
            <option value="Assigned">Assigned</option>
            <option value="In Progress">In Progress</option>
            <option value="Resolved">Resolved</option>
          </select>
        </div>
      </div>

      {/* Complaints Table */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-700">
            <thead className="bg-slate-50 border-b border-slate-200 text-slate-500 uppercase text-[10px] font-semibold tracking-wider">
              <tr>
                <th className="py-3 px-4">Complaint ID</th>
                <th className="py-3 px-4">Drainage Location</th>
                <th className="py-3 px-4">Problem Type</th>
                <th className="py-3 px-4">Severity</th>
                <th className="py-3 px-4">Reported By</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4">Assigned Worker</th>
                <th className="py-3 px-4">Reported Time</th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredComplaints.map((c) => (
                <tr key={c.complaint_id} className="hover:bg-slate-50/80 transition-colors">
                  <td className="py-3 px-4 font-mono font-bold text-blue-600">{c.complaint_id}</td>
                  <td className="py-3 px-4 font-semibold text-slate-900 max-w-[200px]">
                    <div>{c.location_name}</div>
                    <div className="text-[11px] font-normal text-slate-400">
                      {c.ward_name} &bull; {c.zone_code}
                    </div>
                  </td>
                  <td className="py-3 px-4 text-slate-700 max-w-[200px] truncate">{c.problem_type}</td>
                  <td className="py-3 px-4 whitespace-nowrap">
                    <StatusBadge status={c.severity} type="severity" size="sm" />
                  </td>
                  <td className="py-3 px-4 whitespace-nowrap text-slate-600">
                    <div>{c.reported_by}</div>
                    {c.reporter_phone && (
                      <div className="text-[10px] text-slate-400">{c.reporter_phone}</div>
                    )}
                  </td>
                  <td className="py-3 px-4 whitespace-nowrap">
                    <StatusBadge status={c.status} type="status" size="sm" />
                  </td>
                  <td className="py-3 px-4 whitespace-nowrap">
                    {c.assigned_worker_name ? (
                      <span className="font-semibold text-blue-700">{c.assigned_worker_name}</span>
                    ) : (
                      <span className="text-slate-400 italic">Unassigned</span>
                    )}
                  </td>
                  <td className="py-3 px-4 text-slate-500 whitespace-nowrap">{c.reported_at}</td>
                  <td className="py-3 px-4 text-right whitespace-nowrap">
                    <div className="flex items-center justify-end gap-1.5">
                      <button
                        type="button"
                        onClick={() => setSelectedComplaint(c)}
                        className="p-1.5 rounded-lg text-slate-600 hover:text-blue-600 hover:bg-blue-50 transition-colors"
                        title="View Complaint Details"
                      >
                        <Eye className="w-4 h-4" />
                      </button>

                      {c.status === 'Pending' && (
                        <button
                          type="button"
                          onClick={() => setAssigningComplaint(c)}
                          className="px-2.5 py-1 rounded bg-blue-600 hover:bg-blue-700 text-white font-semibold text-[11px] shadow-xs"
                        >
                          Assign Worker
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Complaint Detail & Status Modal */}
      {selectedComplaint && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
          <div className="bg-white rounded-2xl border border-slate-200 shadow-2xl max-w-lg w-full p-6 animate-in fade-in zoom-in-95">
            <div className="flex items-center justify-between mb-4">
              <div>
                <span className="font-mono text-xs font-bold text-blue-600">
                  {selectedComplaint.complaint_id}
                </span>
                <h3 className="text-base font-bold text-slate-900">{selectedComplaint.location_name}</h3>
              </div>
              <button
                type="button"
                onClick={() => setSelectedComplaint(null)}
                className="p-1 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="space-y-4 text-xs">
              <div className="flex items-center justify-between p-3 rounded-lg bg-slate-50 border border-slate-200">
                <div>
                  <span className="text-slate-500 block">Severity:</span>
                  <StatusBadge status={selectedComplaint.severity} type="severity" size="sm" />
                </div>
                <div>
                  <span className="text-slate-500 block">Current Status:</span>
                  <StatusBadge status={selectedComplaint.status} type="status" size="sm" />
                </div>
                <div>
                  <span className="text-slate-500 block">Reported Time:</span>
                  <span className="font-semibold text-slate-800">{selectedComplaint.reported_at}</span>
                </div>
              </div>

              <div>
                <span className="font-bold text-slate-800 uppercase tracking-wider block mb-1">
                  Problem Description
                </span>
                <p className="p-3 rounded-lg bg-slate-50 border border-slate-200 text-slate-700 leading-relaxed">
                  {selectedComplaint.description}
                </p>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="p-3 rounded-lg border border-slate-200">
                  <span className="text-slate-500 block">Reporter</span>
                  <span className="font-bold text-slate-800">{selectedComplaint.reported_by}</span>
                  <span className="text-slate-500 block">{selectedComplaint.reporter_phone}</span>
                </div>
                <div className="p-3 rounded-lg border border-slate-200">
                  <span className="text-slate-500 block">Assigned Worker</span>
                  <span className="font-bold text-blue-700">
                    {selectedComplaint.assigned_worker_name || 'Not yet dispatched'}
                  </span>
                </div>
              </div>

              {/* Quick Change Status & Priority */}
              <div className="p-3.5 rounded-xl bg-blue-50/50 border border-blue-200/80 space-y-2">
                <span className="font-bold text-blue-950 block">Administrative Controls</span>
                <div className="flex flex-wrap gap-2">
                  <div className="flex items-center gap-1.5">
                    <span className="text-slate-600">Change Priority:</span>
                    <select
                      value={selectedComplaint.severity}
                      onChange={(e) => {
                        const newSev = e.target.value as ComplaintSeverity;
                        onChangePriority(selectedComplaint.complaint_id, newSev);
                        setSelectedComplaint({ ...selectedComplaint, severity: newSev });
                      }}
                      className="p-1 rounded border border-slate-200 bg-white text-xs"
                    >
                      <option value="Low">Low</option>
                      <option value="Medium">Medium</option>
                      <option value="High">High</option>
                      <option value="Critical">Critical</option>
                    </select>
                  </div>

                  <div className="flex items-center gap-1.5">
                    <span className="text-slate-600">Change Status:</span>
                    <select
                      value={selectedComplaint.status}
                      onChange={(e) => {
                        const newSt = e.target.value as ComplaintStatus;
                        onChangeStatus(selectedComplaint.complaint_id, newSt);
                        setSelectedComplaint({ ...selectedComplaint, status: newSt });
                      }}
                      className="p-1 rounded border border-slate-200 bg-white text-xs"
                    >
                      <option value="Pending">Pending</option>
                      <option value="Assigned">Assigned</option>
                      <option value="In Progress">In Progress</option>
                      <option value="Resolved">Resolved</option>
                    </select>
                  </div>
                </div>
              </div>
            </div>

            <div className="mt-5 flex justify-end">
              <button
                type="button"
                onClick={() => setSelectedComplaint(null)}
                className="px-4 py-1.5 rounded-lg bg-slate-800 text-white text-xs font-semibold"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Assign Worker Modal */}
      {assigningComplaint && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
          <div className="bg-white rounded-2xl border border-slate-200 shadow-2xl max-w-lg w-full p-6 animate-in fade-in zoom-in-95">
            <div className="flex items-center justify-between mb-3">
              <div>
                <span className="font-mono text-xs font-bold text-blue-600">
                  {assigningComplaint.complaint_id}
                </span>
                <h3 className="text-base font-bold text-slate-900">
                  Assign Sanitation Worker &amp; Machine
                </h3>
                <p className="text-xs text-slate-500">{assigningComplaint.location_name}</p>
              </div>
              <button
                type="button"
                onClick={() => setAssigningComplaint(null)}
                className="p-1 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="mt-3 space-y-2">
              <span className="text-xs font-bold text-slate-600 uppercase tracking-wider block">
                Available Field Workers
              </span>
              <div className="max-h-60 overflow-y-auto space-y-2">
                {workers.map((w, idx) => {
                  const dist = (0.8 + idx * 0.7).toFixed(1);
                  return (
                    <div
                      key={w.worker_id}
                      className="p-3 rounded-xl border border-slate-200 flex items-center justify-between hover:border-blue-300 hover:bg-blue-50/30 transition-all text-xs"
                    >
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="font-bold text-slate-900">{w.worker_name}</span>
                          <span className="font-mono text-[10px] text-blue-600 font-bold bg-blue-50 px-1.5 py-0.5 rounded border border-blue-200">
                            {w.worker_code}
                          </span>
                        </div>
                        <div className="text-[11px] text-slate-500 mt-0.5">
                          {dist} km away &bull; {w.availability} &bull; {w.verification_status}
                        </div>
                      </div>

                      <button
                        type="button"
                        onClick={() => {
                          onAssignWorker(assigningComplaint.complaint_id, w);
                          setAssigningComplaint(null);
                        }}
                        className="px-3 py-1.5 rounded-lg bg-blue-600 hover:bg-blue-700 text-white font-semibold text-xs shadow-xs"
                      >
                        Dispatch
                      </button>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* New Complaint Modal */}
      {isNewModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
          <div className="bg-white rounded-2xl border border-slate-200 shadow-2xl max-w-lg w-full p-6 animate-in fade-in zoom-in-95">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
                <AlertOctagon className="w-5 h-5 text-rose-600" />
                <span>Log New Drainage Complaint</span>
              </h3>
              <button
                type="button"
                onClick={() => setIsNewModalOpen(false)}
                className="p-1 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleCreateComplaint} className="space-y-3.5 text-xs">
              <div>
                <label className="block text-slate-600 font-semibold mb-1">Drainage Asset</label>
                <select
                  value={drainageId}
                  onChange={(e) => setDrainageId(e.target.value)}
                  className="w-full p-2 rounded-lg border border-slate-200 text-xs bg-white"
                >
                  {drainages.map((d) => (
                    <option key={d.drainage_id} value={d.drainage_id}>
                      {d.drainage_id} - {d.location_name} ({d.ward_name})
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-slate-600 font-semibold mb-1">Problem Category</label>
                <select
                  value={problemType}
                  onChange={(e) => setProblemType(e.target.value)}
                  className="w-full p-2 rounded-lg border border-slate-200 text-xs bg-white"
                >
                  <option value="Severe Sludge Clog & Waterlogging">Severe Sludge Clog &amp; Waterlogging</option>
                  <option value="Solid Plastic Waste & Silt Blockage">Solid Plastic Waste &amp; Silt Blockage</option>
                  <option value="Foul Odor & Stagnant Sewage">Foul Odor &amp; Stagnant Sewage</option>
                  <option value="Overflow during Rain">Overflow during Rain</option>
                  <option value="Broken Manhole/Silt Accumulation">Broken Manhole / Silt Accumulation</option>
                </select>
              </div>

              <div>
                <label className="block text-slate-600 font-semibold mb-1">Severity</label>
                <select
                  value={severity}
                  onChange={(e) => setSeverity(e.target.value as ComplaintSeverity)}
                  className="w-full p-2 rounded-lg border border-slate-200 text-xs bg-white"
                >
                  <option value="Critical">Critical (Immediate Flooding Hazard)</option>
                  <option value="High">High (Heavily Obstructed)</option>
                  <option value="Medium">Medium (Slow Flow)</option>
                  <option value="Low">Low (Maintenance Silt)</option>
                </select>
              </div>

              <div>
                <label className="block text-slate-600 font-semibold mb-1">Problem Description</label>
                <textarea
                  rows={3}
                  placeholder="Detail the blockage, water level, odor, or citizen observations..."
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="w-full p-2 rounded-lg border border-slate-200 text-xs focus:ring-2 focus:ring-blue-500/20"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-600 font-semibold mb-1">Reported By</label>
                  <input
                    type="text"
                    value={reportedBy}
                    onChange={(e) => setReportedBy(e.target.value)}
                    className="w-full p-2 rounded-lg border border-slate-200 text-xs"
                    required
                  />
                </div>
                <div>
                  <label className="block text-slate-600 font-semibold mb-1">Contact Phone</label>
                  <input
                    type="text"
                    value={reporterPhone}
                    onChange={(e) => setReporterPhone(e.target.value)}
                    className="w-full p-2 rounded-lg border border-slate-200 text-xs"
                  />
                </div>
              </div>

              <div className="pt-2 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsNewModalOpen(false)}
                  className="px-3 py-1.5 rounded-lg border border-slate-200 text-slate-600 hover:bg-slate-50 font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 rounded-lg bg-blue-600 hover:bg-blue-700 text-white font-semibold shadow-xs"
                >
                  Submit Complaint
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
