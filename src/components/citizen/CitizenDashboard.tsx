import React, { useState, useEffect } from 'react';
import {
  AlertTriangle,
  Upload,
  MapPin,
  Clock,
  Phone,
  CheckCircle2,
  AlertOctagon,
  Shield,
  FileText,
  Search,
  Camera,
  Layers,
  ArrowRight,
  Info,
  ClipboardList,
  Activity,
  ChevronRight,
  HardHat,
  Compass
} from 'lucide-react';
import { Complaint, DrainageLocation, ComplaintSeverity } from '../../types';
import { StatusBadge } from '../common/StatusBadge';
import { DrainageMap } from '../common/DrainageMap';
import { initialWorkers } from '../../data/mockData';

export type CitizenTab =
  | 'dashboard'
  | 'report_drainage'
  | 'my_complaints'
  | 'complaint_status';

interface CitizenDashboardProps {
  complaints: Complaint[];
  drainages: DrainageLocation[];
  onReportComplaint: (complaint: {
    drainage_id: string;
    location_name: string;
    ward_name: string;
    zone_code: string;
    problem_type: string;
    description: string;
    severity: ComplaintSeverity;
    reported_by: string;
    reporter_phone: string;
    image_url?: string;
  }) => void;
  activeNavTab?: string;
  onNavigateTab?: (tab: string) => void;
}

export const CitizenDashboard: React.FC<CitizenDashboardProps> = ({
  complaints = [],
  drainages = [],
  onReportComplaint,
  activeNavTab = 'dashboard',
  onNavigateTab
}) => {
  const [internalTab, setInternalTab] = useState<CitizenTab>('dashboard');

  // Sync when activeNavTab prop changes
  useEffect(() => {
    if (activeNavTab) {
      setInternalTab(activeNavTab as CitizenTab);
    }
  }, [activeNavTab]);

  const setTab = (tab: CitizenTab) => {
    setInternalTab(tab);
    if (onNavigateTab) {
      onNavigateTab(tab);
    }
  };

  // Complaint Form State
  const [selectedDrainageId, setSelectedDrainageId] = useState(drainages[0]?.drainage_id || 'DR-101');
  const [customAddress, setCustomAddress] = useState('');
  const [problemType, setProblemType] = useState('Blocked drainage');
  const [description, setDescription] = useState('');
  const [citizenName, setCitizenName] = useState('');
  const [citizenPhone, setCitizenPhone] = useState('');
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submittedId, setSubmittedId] = useState<string | null>(null);

  // Search in Track Complaints
  const [trackSearch, setTrackSearch] = useState('');

  const handleSimulatedImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      const reader = new FileReader();
      reader.onload = (event) => {
        setImagePreview(event.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    const targetDrainage = drainages.find((d) => d.drainage_id === selectedDrainageId) || drainages[0];

    // Determine severity
    let severity: ComplaintSeverity = 'Medium';
    if (
      problemType === 'Severe sewage overflow' ||
      description.toLowerCase().includes('emergency') ||
      description.toLowerCase().includes('danger')
    ) {
      severity = 'High';
    } else if (problemType === 'Stagnant water') {
      severity = 'Low';
    }

    setTimeout(() => {
      onReportComplaint({
        drainage_id: targetDrainage ? targetDrainage.drainage_id : 'DR-CUSTOM',
        location_name: customAddress
          ? `${targetDrainage?.location_name || 'Ward Area'} (${customAddress})`
          : targetDrainage?.location_name || 'Bengaluru Storm Water Drain',
        ward_name: targetDrainage?.ward_name || 'Ward 112',
        zone_code: targetDrainage?.zone_code || 'EAST',
        problem_type: problemType,
        description: description || 'Citizen reported severe drain water blockage and sediment buildup.',
        severity,
        reported_by: citizenName || 'Concerned Citizen',
        reporter_phone: citizenPhone || '+91 98450 11223',
        image_url:
          imagePreview ||
          'https://images.unsplash.com/photo-1541888946425-d0fbb18615f3?w=800&auto=format&fit=crop&q=60'
      });

      setIsSubmitting(false);
      setSubmittedId(`CMP-${Math.floor(1000 + Math.random() * 9000)}`);
      // Reset inputs
      setDescription('');
      setCustomAddress('');
      setImagePreview(null);
    }, 600);
  };

  const filteredTrackComplaints = complaints.filter(
    (c) =>
      c.complaint_id.toLowerCase().includes(trackSearch.toLowerCase()) ||
      c.location_name.toLowerCase().includes(trackSearch.toLowerCase()) ||
      c.problem_type.toLowerCase().includes(trackSearch.toLowerCase()) ||
      c.reported_by.toLowerCase().includes(trackSearch.toLowerCase())
  );

  return (
    <div id="citizen-portal" className="space-y-6 max-w-6xl mx-auto">
      {/* Welcome Header Banner */}
      <div className="bg-gradient-to-r from-blue-700 via-blue-800 to-navy-950 rounded-2xl p-6 text-white shadow-md flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-blue-500/30 text-blue-200 border border-blue-400/30 uppercase tracking-wider inline-block mb-1.5">
            Public Sanitation &amp; Grievance Redressal
          </span>
          <h2 className="text-2xl font-bold tracking-tight text-white">
            Citizen Smart Drainage Portal
          </h2>
          <p className="text-xs sm:text-sm text-blue-100 mt-1 max-w-2xl">
            Report blocked drains, sewage overflows, or foul odors. Machine-assisted municipal teams are dispatched with real-time tracking.
          </p>
        </div>

        {/* Tab switcher */}
        <div className="flex flex-wrap gap-1 bg-white/10 p-1 rounded-xl backdrop-blur-xs border border-white/20 text-xs font-medium self-start md:self-auto">
          <button
            type="button"
            onClick={() => setTab('dashboard')}
            className={`px-3 py-1.5 rounded-lg transition-all ${
              internalTab === 'dashboard' ? 'bg-white text-slate-900 font-bold shadow-xs' : 'text-white hover:bg-white/10'
            }`}
          >
            Dashboard
          </button>
          <button
            type="button"
            onClick={() => setTab('report_drainage')}
            className={`px-3 py-1.5 rounded-lg transition-all ${
              internalTab === 'report_drainage' ? 'bg-white text-slate-900 font-bold shadow-xs' : 'text-white hover:bg-white/10'
            }`}
          >
            Report Problem
          </button>
          <button
            type="button"
            onClick={() => setTab('my_complaints')}
            className={`px-3 py-1.5 rounded-lg transition-all ${
              internalTab === 'my_complaints' ? 'bg-white text-slate-900 font-bold shadow-xs' : 'text-white hover:bg-white/10'
            }`}
          >
            My Complaints ({complaints.length})
          </button>
          <button
            type="button"
            onClick={() => setTab('complaint_status')}
            className={`px-3 py-1.5 rounded-lg transition-all ${
              internalTab === 'complaint_status' ? 'bg-white text-slate-900 font-bold shadow-xs' : 'text-white hover:bg-white/10'
            }`}
          >
            Complaint Status
          </button>
        </div>
      </div>

      {/* SUBMISSION SUCCESS BANNER */}
      {submittedId && (
        <div className="p-4 rounded-xl bg-emerald-50 border border-emerald-300 text-emerald-950 flex items-start justify-between gap-3 animate-in fade-in">
          <div className="flex items-start gap-2.5">
            <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
            <div>
              <strong className="font-bold text-sm block text-emerald-900">
                Grievance Successfully Registered! (ID: {submittedId})
              </strong>
              <p className="text-xs text-emerald-800 mt-0.5">
                Your report has been logged. The nearest certified desilting rover unit will be assigned. You can track progress in Complaint Status.
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={() => setSubmittedId(null)}
            className="text-xs text-emerald-700 hover:text-emerald-900 font-bold"
          >
            Dismiss
          </button>
        </div>
      )}

      {/* 1. CITIZEN DASHBOARD */}
      {internalTab === 'dashboard' && (
        <div className="space-y-6">
          {/* Quick Action Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div
              onClick={() => setTab('report_drainage')}
              className="p-6 rounded-2xl bg-gradient-to-br from-blue-600 to-indigo-700 text-white shadow-md cursor-pointer hover:shadow-lg transition-all flex flex-col justify-between"
            >
              <div>
                <div className="w-10 h-10 rounded-xl bg-white/20 flex items-center justify-center mb-3">
                  <AlertTriangle className="w-6 h-6 text-white" />
                </div>
                <h3 className="text-lg font-bold">Report a Drainage Problem</h3>
                <p className="text-xs text-blue-100 mt-1 max-w-sm">
                  Notice overflowing drain water, foul odor, or plastic silt clogging? File an instant grievance with photo upload.
                </p>
              </div>
              <div className="mt-4 flex items-center gap-1.5 text-xs font-bold text-white">
                <span>File Grievance Now</span>
                <ArrowRight className="w-4 h-4" />
              </div>
            </div>

            <div
              onClick={() => setTab('complaint_status')}
              className="p-6 rounded-2xl bg-gradient-to-br from-slate-900 to-slate-800 text-white shadow-md cursor-pointer hover:shadow-lg transition-all flex flex-col justify-between"
            >
              <div>
                <div className="w-10 h-10 rounded-xl bg-white/10 flex items-center justify-center mb-3">
                  <Activity className="w-6 h-6 text-cyan-400" />
                </div>
                <h3 className="text-lg font-bold">Track Grievance &amp; Machine Status</h3>
                <p className="text-xs text-slate-300 mt-1 max-w-sm">
                  Check live status of your reported tickets, assigned sanitation team, and verified water clarity level.
                </p>
              </div>
              <div className="mt-4 flex items-center gap-1.5 text-xs font-bold text-cyan-300">
                <span>View Status Live</span>
                <ArrowRight className="w-4 h-4" />
              </div>
            </div>
          </div>

          {/* Quick Status Stats */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <div className="p-4 rounded-2xl bg-white border border-slate-200 shadow-xs">
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Cleanliness Score</span>
              <span className="text-2xl font-black text-emerald-600">88%</span>
              <span className="text-[10px] text-slate-500 block mt-0.5">Ward 112 East Zone</span>
            </div>

            <div className="p-4 rounded-2xl bg-white border border-slate-200 shadow-xs">
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Active Rovers</span>
              <span className="text-2xl font-black text-blue-600">3 Units</span>
              <span className="text-[10px] text-slate-500 block mt-0.5">Operating nearby</span>
            </div>

            <div className="p-4 rounded-2xl bg-white border border-slate-200 shadow-xs">
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Grievance SLA</span>
              <span className="text-2xl font-black text-slate-900">4.2 hrs</span>
              <span className="text-[10px] text-slate-500 block mt-0.5">Avg resolution time</span>
            </div>

            <div
              onClick={() => setTab('my_complaints')}
              className="p-4 rounded-2xl bg-white border border-slate-200 shadow-xs cursor-pointer hover:border-blue-300 transition-all"
            >
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">My Complaints</span>
              <span className="text-2xl font-black text-slate-900">{complaints.length}</span>
              <span className="text-[10px] text-blue-600 block mt-0.5">Click to view all</span>
            </div>
          </div>

          {/* Emergency Helpline Banner */}
          <div className="p-4 rounded-2xl bg-amber-50 border border-amber-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
            <div className="flex items-center gap-2.5">
              <Phone className="w-5 h-5 text-amber-600 shrink-0" />
              <div>
                <strong className="text-slate-900 block font-bold">24x7 BBMP Storm Water Drain Flood Helpline:</strong>
                <span className="text-slate-600 text-[11px]">In case of sudden road inundation or severe flash flooding, call toll-free 1533.</span>
              </div>
            </div>
            <a
              href="tel:1533"
              className="px-3.5 py-1.5 rounded-lg bg-amber-600 hover:bg-amber-700 text-white font-bold text-xs shrink-0 self-start sm:self-auto"
            >
              Call 1533
            </a>
          </div>
        </div>
      )}

      {/* 2. REPORT DRAINAGE PROBLEM */}
      {internalTab === 'report_drainage' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Main Form */}
          <div className="lg:col-span-7 bg-white rounded-2xl border border-slate-200 p-6 shadow-xs">
            <h3 className="font-bold text-slate-900 text-base flex items-center gap-2 mb-1">
              <AlertTriangle className="w-5 h-5 text-amber-500" />
              <span>Submit Drainage Hazard or Blockage</span>
            </h3>
            <p className="text-xs text-slate-500 mb-5">
              Provide location coordinates and photo evidence. The municipal control center will verify and dispatch a de-silting crew.
            </p>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                  Nearest Storm Water Drain Corridor *
                </label>
                <select
                  value={selectedDrainageId}
                  onChange={(e) => setSelectedDrainageId(e.target.value)}
                  className="w-full p-2.5 rounded-xl border border-slate-200 bg-white text-xs text-slate-900 font-medium focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none"
                  required
                >
                  {drainages.map((d) => (
                    <option key={d.drainage_id} value={d.drainage_id}>
                      {d.location_name} - {d.ward_name} ({d.condition})
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                  Specific Landmark / Street Address (Optional)
                </label>
                <input
                  type="text"
                  value={customAddress}
                  onChange={(e) => setCustomAddress(e.target.value)}
                  placeholder="e.g. Near Metro Pillar 84, opposite Café Coffee Day"
                  className="w-full p-2.5 rounded-xl border border-slate-200 text-xs text-slate-900 focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                  Category of Problem *
                </label>
                <div className="grid grid-cols-2 gap-2 text-xs">
                  {[
                    'Blocked drainage',
                    'Severe sewage overflow',
                    'Stagnant water',
                    'Foul odor & mosquito breeding',
                    'Broken conduit cover'
                  ].map((cat) => (
                    <button
                      type="button"
                      key={cat}
                      onClick={() => setProblemType(cat)}
                      className={`p-2.5 rounded-xl border text-left font-medium transition-all ${
                        problemType === cat
                          ? 'border-blue-500 bg-blue-50 text-blue-800 font-bold'
                          : 'border-slate-200 hover:bg-slate-50 text-slate-700'
                      }`}
                    >
                      {cat}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                  Description of Grievance
                </label>
                <textarea
                  rows={3}
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Describe severity, approximate water depth, or pedestrian hazards..."
                  className="w-full p-2.5 rounded-xl border border-slate-200 text-xs text-slate-900 focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                    Your Name
                  </label>
                  <input
                    type="text"
                    value={citizenName}
                    onChange={(e) => setCitizenName(e.target.value)}
                    placeholder="e.g. Sneha Reddy"
                    className="w-full p-2.5 rounded-xl border border-slate-200 text-xs text-slate-900 focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                    Contact Phone (For SMS Tracking)
                  </label>
                  <input
                    type="tel"
                    value={citizenPhone}
                    onChange={(e) => setCitizenPhone(e.target.value)}
                    placeholder="+91 98450 12345"
                    className="w-full p-2.5 rounded-xl border border-slate-200 text-xs text-slate-900 focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none"
                  />
                </div>
              </div>

              {/* Upload Image Section */}
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                  Drainage Photo Evidence
                </label>
                <div className="border-2 border-dashed border-slate-200 hover:border-blue-400 rounded-xl p-4 text-center cursor-pointer transition-colors relative">
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleSimulatedImageUpload}
                    className="absolute inset-0 opacity-0 cursor-pointer w-full h-full"
                  />
                  {imagePreview ? (
                    <div className="flex items-center justify-center gap-3">
                      <img
                        src={imagePreview}
                        alt="Preview"
                        className="w-16 h-16 object-cover rounded-lg border border-slate-200"
                      />
                      <div className="text-left text-xs">
                        <span className="text-emerald-600 font-bold block">Photo Attached</span>
                        <span className="text-slate-400 text-[11px]">Click or tap to replace photo</span>
                      </div>
                    </div>
                  ) : (
                    <div className="space-y-1">
                      <Camera className="w-6 h-6 text-slate-400 mx-auto" />
                      <div className="text-xs text-slate-600 font-medium">
                        Click to upload photo or take picture
                      </div>
                      <div className="text-[10px] text-slate-400">PNG, JPG up to 10MB</div>
                    </div>
                  )}
                </div>
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full py-3 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
              >
                {isSubmitting ? (
                  <span>Transmitting Grievance to Municipal Control...</span>
                ) : (
                  <>
                    <Upload className="w-4 h-4" />
                    <span>Submit Grievance Report</span>
                  </>
                )}
              </button>
            </form>
          </div>

          {/* Guidelines Sidebar */}
          <div className="lg:col-span-5 space-y-4">
            <div className="bg-slate-900 text-white rounded-2xl p-5 shadow-xs space-y-3">
              <h4 className="font-bold text-white text-sm flex items-center gap-2">
                <Shield className="w-4 h-4 text-cyan-400" />
                <span>How DrainTrack Resolves Issues</span>
              </h4>
              <ul className="space-y-2.5 text-xs text-slate-300">
                <li className="flex items-start gap-2">
                  <span className="w-5 h-5 rounded-full bg-blue-600 flex items-center justify-center text-white font-bold text-[10px] shrink-0 mt-0.5">
                    1
                  </span>
                  <span>
                    <strong>Instant Logging:</strong> Complaint is timestamped and mapped onto the municipal GIS grid.
                  </span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="w-5 h-5 rounded-full bg-blue-600 flex items-center justify-center text-white font-bold text-[10px] shrink-0 mt-0.5">
                    2
                  </span>
                  <span>
                    <strong>Machine Dispatch:</strong> Nearest sanitation worker with portable de-silting rover is dispatched.
                  </span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="w-5 h-5 rounded-full bg-blue-600 flex items-center justify-center text-white font-bold text-[10px] shrink-0 mt-0.5">
                    3
                  </span>
                  <span>
                    <strong>IoT Sensor Verification:</strong> Turbidity sensors verify water is clear (&lt;200 NTU) before closing.
                  </span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      )}

      {/* 3. MY COMPLAINTS */}
      {internalTab === 'my_complaints' && (
        <div className="bg-white rounded-2xl border border-slate-200 p-5 sm:p-6 shadow-xs space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-100">
            <div>
              <h3 className="font-bold text-slate-900 text-base flex items-center gap-2">
                <ClipboardList className="w-5 h-5 text-blue-600" />
                <span>My Registered Grievance Reports</span>
              </h3>
              <p className="text-xs text-slate-500 mt-0.5">
                Review all complaints submitted from your ward with current status.
              </p>
            </div>
            <span className="text-xs font-bold text-blue-600 bg-blue-50 px-2.5 py-1 rounded-lg border border-blue-200 self-start sm:self-auto">
              {complaints.length} Total Complaints
            </span>
          </div>

          <div className="space-y-3">
            {complaints.map((c) => (
              <div
                key={c.complaint_id}
                className="p-4 rounded-xl border border-slate-200 hover:border-slate-300 transition-all space-y-2.5"
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-xs font-bold text-blue-700 bg-blue-50 px-2 py-0.5 rounded border border-blue-200">
                      {c.complaint_id}
                    </span>
                    <StatusBadge status={c.severity} type="severity" size="sm" />
                    <span className="text-xs text-slate-400">&bull; {c.reported_at}</span>
                  </div>
                  <StatusBadge status={c.status} type="complaint" size="sm" />
                </div>

                <div className="flex items-start gap-3">
                  {c.image_url && (
                    <img
                      src={c.image_url}
                      alt={c.location_name}
                      className="w-16 h-16 rounded-lg object-cover border border-slate-200 shrink-0"
                    />
                  )}
                  <div className="text-xs space-y-1">
                    <h4 className="font-bold text-slate-900 text-sm">{c.location_name}</h4>
                    <p className="text-slate-600">{c.description}</p>
                    <div className="text-slate-400 text-[11px] flex items-center gap-2">
                      <span>Category: {c.problem_type}</span>
                      <span>&bull;</span>
                      <span>Ward: {c.ward_name}</span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 4. COMPLAINT STATUS (Track Grievance) */}
      {internalTab === 'complaint_status' && (
        <div className="space-y-4">
          <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <h3 className="font-bold text-slate-900 text-base flex items-center gap-2">
                <CheckCircle2 className="w-5 h-5 text-blue-600" />
                <span>Live Grievance Redressal Status</span>
              </h3>
              <div className="relative w-full sm:w-64">
                <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
                <input
                  type="text"
                  value={trackSearch}
                  onChange={(e) => setTrackSearch(e.target.value)}
                  placeholder="Search by Complaint ID..."
                  className="w-full pl-9 pr-3 py-2 rounded-xl border border-slate-200 text-xs focus:outline-none focus:ring-2 focus:ring-blue-500/20"
                />
              </div>
            </div>

            <div className="space-y-4">
              {filteredTrackComplaints.map((c) => {
                const step =
                  c.status === 'Resolved'
                    ? 4
                    : c.status === 'In Progress'
                    ? 3
                    : c.status === 'Assigned'
                    ? 2
                    : 1;

                return (
                  <div key={c.complaint_id} className="p-4 rounded-xl border border-slate-200 space-y-3">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span className="font-mono text-xs font-bold text-slate-800 bg-slate-100 px-2 py-0.5 rounded">
                          {c.complaint_id}
                        </span>
                        <span className="font-bold text-slate-900 text-xs">{c.location_name}</span>
                      </div>
                      <StatusBadge status={c.status} type="complaint" size="sm" />
                    </div>

                    {/* Timeline Tracker */}
                    <div className="grid grid-cols-4 gap-1 text-center text-[10px] font-semibold pt-1">
                      <div className={`p-2 rounded-lg ${step >= 1 ? 'bg-blue-50 text-blue-700 font-bold' : 'bg-slate-50 text-slate-400'}`}>
                        1. Registered
                      </div>
                      <div className={`p-2 rounded-lg ${step >= 2 ? 'bg-blue-50 text-blue-700 font-bold' : 'bg-slate-50 text-slate-400'}`}>
                        2. Dispatched
                      </div>
                      <div className={`p-2 rounded-lg ${step >= 3 ? 'bg-purple-50 text-purple-700 font-bold' : 'bg-slate-50 text-slate-400'}`}>
                        3. Machine Cleaning
                      </div>
                      <div className={`p-2 rounded-lg ${step >= 4 ? 'bg-emerald-50 text-emerald-700 font-bold' : 'bg-slate-50 text-slate-400'}`}>
                        4. Water Clarified
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
