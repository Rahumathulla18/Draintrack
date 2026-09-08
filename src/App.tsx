import React, { useState, useEffect } from 'react';
import { AuthProvider, useAuth } from './context/AuthContext';
import { Header } from './components/common/Header';
import { Sidebar } from './components/common/Sidebar';
import { LoginPage } from './components/common/LoginPage';
import { DashboardHome } from './components/admin/DashboardHome';
import { WorkersPage } from './components/admin/WorkersPage';
import { DrainageLocationsPage } from './components/admin/DrainageLocationsPage';
import { ComplaintsPage } from './components/admin/ComplaintsPage';
import { JobsPage } from './components/admin/JobsPage';
import { LiveMonitoringPage } from './components/admin/LiveMonitoringPage';
import { WorkVerificationPage } from './components/admin/WorkVerificationPage';
import { PaymentsPage } from './components/admin/PaymentsPage';
import { ReportsPage } from './components/admin/ReportsPage';
import { MapPage } from './components/admin/MapPage';
import { SettingsPage } from './components/admin/SettingsPage';
import { CitizenDashboard } from './components/citizen/CitizenDashboard';
import { WorkerDashboard } from './components/worker/WorkerDashboard';

import {
  workersService,
  complaintsService,
  jobsService,
  drainageLocationsService,
  machineDataService,
  workLogsService,
  paymentsService
} from './services';
import { initialMachineData } from './data/mockData';

import {
  Worker,
  Complaint,
  Job,
  DrainageLocation,
  MachineData,
  WorkLog,
  Payment,
  UserRole,
  JobStatus,
  ComplaintStatus,
  ComplaintSeverity,
  DrainageCondition
} from './types';

function MainApp() {
  const { currentUser, isAuthenticated, loginAs, logout, switchRole } = useAuth();

  // Role-specific navigation tab states
  const [adminTab, setAdminTab] = useState<string>('dashboard');
  const [workerTab, setWorkerTab] = useState<string>('dashboard');
  const [citizenTab, setCitizenTab] = useState<string>('dashboard');

  // Sidebar responsive open/closed state
  const [sidebarOpen, setSidebarOpen] = useState(() => {
    if (typeof window !== 'undefined') {
      return window.innerWidth >= 1024;
    }
    return true;
  });

  // Core Data States
  const [workers, setWorkers] = useState<Worker[]>([]);
  const [complaints, setComplaints] = useState<Complaint[]>([]);
  const [jobs, setJobs] = useState<Job[]>([]);
  const [drainages, setDrainages] = useState<DrainageLocation[]>([]);
  const [machineData, setMachineData] = useState<MachineData>(initialMachineData);
  const [workLogs, setWorkLogs] = useState<WorkLog[]>([]);
  const [payments, setPayments] = useState<Payment[]>([]);

  // Toast notification state
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage(null);
    }, 3500);
  };

  const refreshAllData = async () => {
    const [w, c, j, d, m, l, p] = await Promise.all([
      workersService.getAll(),
      complaintsService.getAll(),
      jobsService.getAll(),
      drainageLocationsService.getAll(),
      machineDataService.getLatest(),
      workLogsService.getAll(),
      paymentsService.getAll()
    ]);
    setWorkers(w);
    setComplaints(c);
    setJobs(j);
    setDrainages(d);
    setMachineData(m);
    setWorkLogs(l);
    setPayments(p);
  };

  // Load all initial state from services (persisted in localStorage)
  useEffect(() => {
    refreshAllData();
  }, []);

  // Periodic telemetry simulation (to emulate live IoT sensor data)
  useEffect(() => {
    const interval = setInterval(async () => {
      setMachineData((prev) => {
        if (prev.machine_status === 'RUNNING') {
          const newDist = prev.distance_travelled + 1;
          const newTurb = Math.max(160, prev.turbidity - Math.floor(Math.random() * 4));
          machineDataService.updateTelemetry(newTurb, newDist).then((updated) => {
            setMachineData(updated);
          });
        }
        return prev;
      });
    }, 4000);
    return () => clearInterval(interval);
  }, []);

  // Handlers for Workers
  const handleAddWorker = async (
    workerData: Omit<Worker, 'worker_id' | 'total_completed_jobs' | 'total_distance_km' | 'total_machine_hours'>
  ) => {
    const created = await workersService.addWorker(workerData);
    setWorkers(await workersService.getAll());
    showToast(`Worker ${created.worker_name} (${created.worker_code}) successfully registered`);
  };

  const handleVerifyWorker = async (workerId: string) => {
    await workersService.updateVerification(workerId, 'Verified');
    setWorkers(await workersService.getAll());
    showToast(`Worker ${workerId} verification status updated to Verified`);
  };

  // Handlers for Drainages
  const handleAddDrainage = async (drainageData: Omit<DrainageLocation, 'drainage_id'>) => {
    const created = await drainageLocationsService.addDrainage(drainageData);
    setDrainages(await drainageLocationsService.getAll());
    showToast(`Drainage location ${created.location_name} (${created.drainage_id}) registered`);
  };

  const handleUpdateDrainageCondition = async (id: string, condition: DrainageCondition) => {
    await drainageLocationsService.updateCondition(id, condition);
    setDrainages(await drainageLocationsService.getAll());
  };

  // Handlers for Complaints
  const handleNewComplaint = async (data: Omit<Complaint, 'complaint_id' | 'reported_at' | 'status'>) => {
    const created = await complaintsService.create(data);
    setComplaints(await complaintsService.getAll());
    showToast(`Complaint ${created.complaint_id} logged for ${created.location_name}`);
  };

  const handleAssignWorkerToComplaint = async (complaintId: string, worker: Worker) => {
    const comp = complaints.find((c) => c.complaint_id === complaintId);
    if (!comp) return;

    await complaintsService.updateStatus(complaintId, 'Assigned', { id: worker.worker_id, name: worker.worker_name });
    await jobsService.createJobFromComplaint(comp, {
      worker_id: worker.worker_id,
      worker_name: worker.worker_name,
      worker_code: worker.worker_code,
      distance_km: 1.2
    });

    // Update worker active status
    await workersService.updateAvailability(worker.worker_id, 'Busy');

    setComplaints(await complaintsService.getAll());
    setJobs(await jobsService.getAll());
    setWorkers(await workersService.getAll());

    showToast(`Dispatched ${worker.worker_name} to ${comp.location_name}`);
  };

  const handleChangeComplaintStatus = async (complaintId: string, status: ComplaintStatus) => {
    await complaintsService.updateStatus(complaintId, status);
    setComplaints(await complaintsService.getAll());
    showToast(`Complaint ${complaintId} status updated to ${status}`);
  };

  const handleChangeComplaintPriority = async (complaintId: string, severity: ComplaintSeverity) => {
    await complaintsService.updateSeverity(complaintId, severity);
    setComplaints(await complaintsService.getAll());
    showToast(`Complaint ${complaintId} priority updated to ${severity}`);
  };

  // Handlers for Jobs
  const handleAssignWorkerFromJobsPage = async (complaint: Complaint, worker: Worker, distanceKm: number) => {
    await complaintsService.updateStatus(complaint.complaint_id, 'Assigned', { id: worker.worker_id, name: worker.worker_name });
    const newJob = await jobsService.createJobFromComplaint(complaint, {
      worker_id: worker.worker_id,
      worker_name: worker.worker_name,
      worker_code: worker.worker_code,
      distance_km: distanceKm
    });
    await workersService.updateAvailability(worker.worker_id, 'Busy');

    setComplaints(await complaintsService.getAll());
    setJobs(await jobsService.getAll());
    setWorkers(await workersService.getAll());

    showToast(`Job ${newJob.job_id} assigned to ${worker.worker_name} (${worker.worker_code})`);
  };

  const handleUpdateJobStatus = async (jobId: string, status: JobStatus) => {
    const updated = await jobsService.updateJobStatus(jobId, status);
    setJobs(await jobsService.getAll());

    if (status === 'Working') {
      const m = await machineDataService.toggleMachineStatus();
      setMachineData(m);
    }

    if (status === 'Completed' && updated) {
      // Auto-create a work log for verification
      const newLog = await workLogsService.createLog({
        worker_id: updated.worker_id,
        worker_name: updated.worker_name,
        worker_code: updated.worker_code,
        job_id: updated.job_id,
        location_name: updated.location_name,
        start_time: '09:00 AM',
        end_time: '11:15 AM',
        work_duration_minutes: 135,
        machine_runtime_minutes: 110,
        distance_travelled: 260,
        work_verified: false,
        verification_method: 'IoT Correlated Multi-Factor',
        telemetry_points: {
          gps_verified: true,
          machine_verified: true,
          wheel_encoder_verified: true,
          time_verified: true,
          turbidity_improved: true
        }
      });
      setWorkLogs(await workLogsService.getAll());

      // Free worker
      await workersService.updateAvailability(updated.worker_id, 'Available');
      setWorkers(await workersService.getAll());

      showToast(`Job ${jobId} Completed! Telemetry audit log ${newLog.log_id} generated.`);
    } else {
      showToast(`Job ${jobId} advanced to status: ${status}`);
    }
  };

  // Handlers for Machine Actuators
  const handleTogglePump = async () => {
    const updated = await machineDataService.togglePump();
    setMachineData(updated);
    showToast(`Slurry suction pump turned ${updated.pump_status}`);
  };

  const handleToggleBrush = async () => {
    const updated = await machineDataService.toggleBrush();
    setMachineData(updated);
    showToast(`Rotating brush motor turned ${updated.brush_status}`);
  };

  const handleToggleMachineStatus = async () => {
    const updated = await machineDataService.toggleMachineStatus();
    setMachineData(updated);
    showToast(`DrainTrack portable machine is now ${updated.machine_status}`);
  };

  const handleSimulateReadings = async (turbidity: number, distance: number) => {
    const updated = await machineDataService.updateTelemetry(turbidity, distance);
    setMachineData(updated);
    showToast(`Simulated telemetry milestone: ${turbidity} NTU, ${distance}m distance`);
  };

  // Handlers for Work Verification & Payments
  const handleVerifyLog = async (logId: string) => {
    await workLogsService.verifyLog(logId);
    setWorkLogs(await workLogsService.getAll());
    showToast(`Work log ${logId} has been formally verified!`);
  };

  const handleSubmitForPaymentApproval = async (log: WorkLog) => {
    const payment = await paymentsService.createFromWorkLog(log, 2800);
    setPayments(await paymentsService.getAll());
    showToast(`Payment voucher ${payment.payment_id} for ₹2,800 submitted to Executive Engineer.`);
  };

  const handleApprovePayment = async (paymentId: string) => {
    await paymentsService.approvePayment(paymentId, 'R. Sundar, Executive Engineer');
    setPayments(await paymentsService.getAll());
    showToast(`Payment ${paymentId} approved by Municipal Authority.`);
  };

  const handleMarkAsPaid = async (paymentId: string) => {
    await paymentsService.markAsPaid(paymentId);
    setPayments(await paymentsService.getAll());
    showToast(`Payment ${paymentId} marked as Paid.`);
  };

  const handleRejectPayment = async (paymentId: string) => {
    await paymentsService.rejectPayment(paymentId);
    setPayments(await paymentsService.getAll());
    showToast(`Payment ${paymentId} marked as Rejected.`);
  };

  // Unauthenticated view
  if (!isAuthenticated || !currentUser) {
    return <LoginPage onLoginAs={loginAs} />;
  }

  // Active Worker user (for Worker Portal view)
  const workerRecord =
    workers.find((w) => w.user_id === currentUser.id) ||
    workers[0] || {
      worker_id: 'W-01',
      worker_code: 'W001',
      worker_name: currentUser.name,
      phone: '+91 98451 20001',
      email: currentUser.email,
      zone_id: 'zone-a',
      latitude: 12.9784,
      longitude: 77.6408,
      availability: 'Available',
      verification_status: 'Verified',
      total_completed_jobs: 48,
      total_distance_km: 14.8,
      total_machine_hours: 124
    };

  const currentWorkerJob =
    jobs.find((j) => j.worker_id === workerRecord.worker_id && j.job_status !== 'Verified') ||
    jobs.find((j) => j.job_status === 'Working' || j.job_status === 'Assigned') ||
    jobs[0];

  // Badge counts for sidebar
  const pendingComplaintsCount = (complaints || []).filter((c) => c.status === 'Pending').length;
  const activeJobsCount = (jobs || []).filter((j) => j.job_status === 'Working' || j.job_status === 'Travelling').length;
  const pendingVerificationsCount = (workLogs || []).filter((l) => !l.work_verified).length;
  const pendingPaymentsCount = (payments || []).filter((p) => p.payment_status === 'Pending').length;

  // Selected tab based on role
  const currentTab =
    currentUser.role === 'ADMIN'
      ? adminTab
      : currentUser.role === 'WORKER'
      ? workerTab
      : citizenTab;

  const handleSelectTab = (tab: string) => {
    if (currentUser.role === 'ADMIN') {
      setAdminTab(tab);
    } else if (currentUser.role === 'WORKER') {
      setWorkerTab(tab);
    } else {
      setCitizenTab(tab);
    }
  };

  return (
    <div className="min-h-screen bg-slate-100 flex flex-col antialiased text-slate-900 font-sans">
      {/* Top Application Header with Hamburger Menu and Role Switcher */}
      <Header
        currentUser={currentUser}
        onRoleChange={switchRole}
        onLogout={logout}
        onToggleSidebar={() => setSidebarOpen((prev) => !prev)}
        isSidebarOpen={sidebarOpen}
      />

      {/* Main Viewport with Role-Aware Sidebar Navigation */}
      <div className="flex flex-1 overflow-hidden relative">
        {/* Universal Responsive Sidebar (Admin, Worker, Citizen) */}
        <Sidebar
          role={currentUser.role}
          currentTab={currentTab}
          onSelectTab={handleSelectTab}
          isOpen={sidebarOpen}
          onClose={() => setSidebarOpen(false)}
          onLogout={logout}
          badgeCounts={{
            complaints: pendingComplaintsCount,
            jobs: activeJobsCount,
            verification: pendingVerificationsCount,
            payments: pendingPaymentsCount,
            myComplaints: complaints.length
          }}
          userName={currentUser.name}
          workerCode={workerRecord?.worker_code || 'W001'}
        />

        {/* Content Area */}
        <main className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto w-full">
          {/* 1. ADMIN ROLE VIEWS */}
          {currentUser.role === 'ADMIN' && (
            <>
              {adminTab === 'dashboard' && (
                <DashboardHome
                  workers={workers}
                  complaints={complaints}
                  jobs={jobs}
                  drainages={drainages}
                  machineData={machineData}
                  workLogs={workLogs}
                  payments={payments}
                  onNavigate={(tab) => setAdminTab(tab)}
                />
              )}

              {adminTab === 'workers' && (
                <WorkersPage
                  workers={workers}
                  jobs={jobs}
                  payments={payments}
                  workLogs={workLogs}
                  onAddWorker={handleAddWorker}
                  onVerifyWorker={handleVerifyWorker}
                  onAssignJobClick={() => setAdminTab('jobs')}
                />
              )}

              {adminTab === 'drainages' && (
                <DrainageLocationsPage
                  drainages={drainages}
                  onAddDrainage={handleAddDrainage}
                  onUpdateCondition={handleUpdateDrainageCondition}
                />
              )}

              {adminTab === 'complaints' && (
                <ComplaintsPage
                  complaints={complaints}
                  workers={workers}
                  drainages={drainages}
                  onNewComplaint={handleNewComplaint}
                  onAssignWorker={handleAssignWorkerToComplaint}
                  onChangeStatus={handleChangeComplaintStatus}
                  onChangePriority={handleChangeComplaintPriority}
                />
              )}

              {adminTab === 'jobs' && (
                <JobsPage
                  jobs={jobs}
                  workers={workers}
                  complaints={complaints}
                  onAssignWorker={handleAssignWorkerFromJobsPage}
                  onUpdateJobStatus={handleUpdateJobStatus}
                  onNavigateToMonitoring={() => setAdminTab('monitoring')}
                  onNavigateToVerification={() => setAdminTab('verification')}
                />
              )}

              {adminTab === 'monitoring' && (
                <LiveMonitoringPage
                  machineData={machineData}
                  onTogglePump={handleTogglePump}
                  onToggleBrush={handleToggleBrush}
                  onToggleMachineStatus={handleToggleMachineStatus}
                  onSimulateReadings={handleSimulateReadings}
                />
              )}

              {adminTab === 'verification' && (
                <WorkVerificationPage
                  workLogs={workLogs}
                  onVerifyLog={handleVerifyLog}
                  onSubmitForPaymentApproval={handleSubmitForPaymentApproval}
                />
              )}

              {adminTab === 'payments' && (
                <PaymentsPage
                  payments={payments}
                  onApprovePayment={handleApprovePayment}
                  onMarkAsPaid={handleMarkAsPaid}
                  onRejectPayment={handleRejectPayment}
                />
              )}

              {adminTab === 'reports' && (
                <ReportsPage
                  workers={workers}
                  complaints={complaints}
                  jobs={jobs}
                  drainages={drainages}
                  workLogs={workLogs}
                  payments={payments}
                />
              )}

              {adminTab === 'map' && (
                <MapPage
                  drainages={drainages}
                  workers={workers}
                  onSelectWorker={() => setAdminTab('workers')}
                  onSelectDrainage={() => setAdminTab('drainages')}
                />
              )}

              {adminTab === 'settings' && (
                <SettingsPage
                  onResetData={refreshAllData}
                />
              )}
            </>
          )}

          {/* 2. WORKER ROLE VIEWS */}
          {currentUser.role === 'WORKER' && (
            <WorkerDashboard
              currentWorker={workerRecord}
              assignedJob={currentWorkerJob}
              machineData={machineData}
              workLogs={workLogs}
              payments={payments}
              onUpdateJobStatus={handleUpdateJobStatus}
              onTogglePump={handleTogglePump}
              onToggleBrush={handleToggleBrush}
              onToggleMachineStatus={handleToggleMachineStatus}
              activeNavTab={workerTab}
              onNavigateTab={(tab) => setWorkerTab(tab)}
            />
          )}

          {/* 3. CITIZEN ROLE VIEWS */}
          {currentUser.role === 'CITIZEN' && (
            <CitizenDashboard
              complaints={complaints}
              drainages={drainages}
              onReportComplaint={handleNewComplaint}
              activeNavTab={citizenTab}
              onNavigateTab={(tab) => setCitizenTab(tab)}
            />
          )}
        </main>
      </div>

      {/* Global Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-5 right-5 z-50 bg-slate-900 text-white text-xs font-medium py-3 px-4 rounded-xl shadow-2xl border border-slate-700 flex items-center gap-2 animate-in fade-in slide-in-from-bottom-3 duration-200">
          <span className="w-2 h-2 rounded-full bg-blue-400 animate-pulse" />
          <span>{toastMessage}</span>
        </div>
      )}
    </div>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <MainApp />
    </AuthProvider>
  );
}
