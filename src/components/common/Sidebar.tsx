import React from 'react';
import {
  LayoutDashboard,
  Users,
  MapPin,
  AlertOctagon,
  Briefcase,
  Activity,
  CheckCircle2,
  CreditCard,
  BarChart3,
  Map as MapIcon,
  Settings,
  LogOut,
  X,
  FileText,
  Power,
  History,
  AlertTriangle,
  ClipboardList,
  Shield,
  HardHat
} from 'lucide-react';
import { UserRole } from '../../types';

export type AdminTab =
  | 'dashboard'
  | 'workers'
  | 'drainages'
  | 'complaints'
  | 'jobs'
  | 'monitoring'
  | 'verification'
  | 'payments'
  | 'reports'
  | 'map'
  | 'settings';

export interface BadgeCounts {
  complaints?: number;
  jobs?: number;
  verification?: number;
  payments?: number;
  myComplaints?: number;
}

export interface SidebarProps {
  role: UserRole;
  currentTab: string;
  onSelectTab: (tab: string) => void;
  isOpen: boolean;
  onClose: () => void;
  onLogout: () => void;
  badgeCounts?: BadgeCounts;
  userName?: string;
  workerCode?: string;
}

interface MenuItem {
  id: string;
  label: string;
  icon: React.ComponentType<{ className?: string }>;
  badge?: number;
  badgeColor?: string;
}

export const Sidebar: React.FC<SidebarProps> = ({
  role,
  currentTab,
  onSelectTab,
  isOpen,
  onClose,
  onLogout,
  badgeCounts,
  userName,
  workerCode = 'W001'
}) => {
  const counts: BadgeCounts = badgeCounts || {};

  // 1. Admin Navigation Items:
  // - Dashboard, Workers, Drainage Locations, Complaints, Jobs, Live Monitoring, Work Verification, Payments, Reports, Map, Settings, Logout
  const adminMenuItems: MenuItem[] = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'workers', label: 'Workers', icon: Users },
    { id: 'drainages', label: 'Drainage Locations', icon: MapPin },
    {
      id: 'complaints',
      label: 'Complaints',
      icon: AlertOctagon,
      badge: counts.complaints,
      badgeColor: 'bg-rose-500 text-white'
    },
    {
      id: 'jobs',
      label: 'Jobs',
      icon: Briefcase,
      badge: counts.jobs,
      badgeColor: 'bg-blue-500 text-white'
    },
    { id: 'monitoring', label: 'Live Monitoring', icon: Activity },
    {
      id: 'verification',
      label: 'Work Verification',
      icon: CheckCircle2,
      badge: counts.verification,
      badgeColor: 'bg-amber-500 text-white'
    },
    {
      id: 'payments',
      label: 'Payments',
      icon: CreditCard,
      badge: counts.payments,
      badgeColor: 'bg-blue-600 text-white'
    },
    { id: 'reports', label: 'Reports', icon: BarChart3 },
    { id: 'map', label: 'Map', icon: MapIcon },
    { id: 'settings', label: 'Settings', icon: Settings }
  ];

  // 2. Worker Navigation Items:
  // - Dashboard, Assigned Jobs, Job Details, Start/Stop Cleaning, Machine Status, Work History, Payments, Logout
  const workerMenuItems: MenuItem[] = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    {
      id: 'assigned_jobs',
      label: 'Assigned Jobs',
      icon: Briefcase,
      badge: counts.jobs,
      badgeColor: 'bg-amber-500 text-white'
    },
    { id: 'job_details', label: 'Job Details', icon: FileText },
    { id: 'start_stop_cleaning', label: 'Start/Stop Cleaning', icon: Power },
    { id: 'machine_status', label: 'Machine Status', icon: Activity },
    {
      id: 'work_history',
      label: 'Work History',
      icon: History,
      badge: counts.verification,
      badgeColor: 'bg-emerald-600 text-white'
    },
    {
      id: 'payments',
      label: 'Payments',
      icon: CreditCard,
      badge: counts.payments,
      badgeColor: 'bg-blue-600 text-white'
    }
  ];

  // 3. Citizen Navigation Items:
  // - Dashboard, Report Drainage Problem, My Complaints, Complaint Status, Logout
  const citizenMenuItems: MenuItem[] = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'report_drainage', label: 'Report Drainage Problem', icon: AlertTriangle },
    {
      id: 'my_complaints',
      label: 'My Complaints',
      icon: ClipboardList,
      badge: counts.myComplaints,
      badgeColor: 'bg-blue-500 text-white'
    },
    { id: 'complaint_status', label: 'Complaint Status', icon: CheckCircle2 }
  ];

  const currentMenuItems =
    role === 'ADMIN'
      ? adminMenuItems
      : role === 'WORKER'
      ? workerMenuItems
      : citizenMenuItems;

  const roleTitle =
    role === 'ADMIN'
      ? 'Admin Control'
      : role === 'WORKER'
      ? `Worker (${workerCode})`
      : 'Public Portal';

  const roleIcon =
    role === 'ADMIN' ? (
      <Shield className="w-3.5 h-3.5 text-cyan-400" />
    ) : role === 'WORKER' ? (
      <HardHat className="w-3.5 h-3.5 text-amber-400" />
    ) : (
      <Users className="w-3.5 h-3.5 text-emerald-400" />
    );

  return (
    <>
      {/* Mobile Backdrop (Clicks outside close sidebar) */}
      {isOpen && (
        <div
          id="sidebar-backdrop"
          className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs z-40 lg:hidden transition-opacity duration-300"
          onClick={onClose}
          aria-hidden="true"
        />
      )}

      {/* Responsive Sidebar Container */}
      <aside
        id="draintrack-sidebar"
        className={`fixed top-0 bottom-0 left-0 z-50 w-64 bg-slate-900 text-slate-300 flex flex-col transition-all duration-300 ease-in-out shadow-2xl lg:static lg:z-auto lg:shadow-none ${
          isOpen
            ? 'translate-x-0 lg:w-64 lg:flex'
            : '-translate-x-full lg:w-0 lg:overflow-hidden lg:opacity-0 lg:pointer-events-none'
        }`}
      >
        {/* Sidebar Header */}
        <div className="h-16 flex items-center justify-between px-4 border-b border-slate-800 shrink-0">
          <div className="flex items-center gap-2.5 overflow-hidden">
            <div className="w-8 h-8 rounded-lg bg-blue-600 flex items-center justify-center text-white shadow-xs font-black text-sm shrink-0">
              DT
            </div>
            <div className="overflow-hidden">
              <span className="font-bold text-white text-base leading-none tracking-tight block truncate">
                DrainTrack
              </span>
              <div className="flex items-center gap-1.5 mt-0.5">
                {roleIcon}
                <span className="text-[10px] text-cyan-400 font-semibold tracking-wider uppercase truncate">
                  {roleTitle}
                </span>
              </div>
            </div>
          </div>

          {/* Close button inside sidebar */}
          <button
            type="button"
            id="sidebar-close-btn"
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors focus:outline-none"
            aria-label="Close sidebar navigation"
            title="Close Sidebar"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Live Status Pill */}
        <div className="px-3 py-2.5 shrink-0">
          <div className="flex items-center justify-between px-3 py-2 rounded-lg bg-slate-800/80 border border-slate-700/60 text-xs">
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              <span className="text-slate-200 font-medium">
                {role === 'ADMIN'
                  ? 'IoT Mesh Central'
                  : role === 'WORKER'
                  ? 'Rover Node Active'
                  : 'Grievance Network'}
              </span>
            </div>
            <span className="text-[10px] font-mono text-emerald-400 bg-emerald-950/80 px-1.5 py-0.5 rounded border border-emerald-800">
              ONLINE
            </span>
          </div>
        </div>

        {/* Navigation items list */}
        <nav className="flex-1 px-3 py-2 space-y-1 overflow-y-auto" aria-label="Sidebar Navigation">
          {currentMenuItems.map((item) => {
            const Icon = item.icon;
            const isActive = currentTab === item.id;

            return (
              <button
                key={item.id}
                id={`sidebar-nav-${item.id}`}
                type="button"
                onClick={() => {
                  onSelectTab(item.id);
                  // On mobile screens, auto-close sidebar after selection
                  if (window.innerWidth < 1024) {
                    onClose();
                  }
                }}
                className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-xs font-semibold transition-all duration-150 text-left ${
                  isActive
                    ? 'bg-blue-600 text-white font-bold shadow-sm shadow-blue-500/20'
                    : 'text-slate-300 hover:bg-slate-800/80 hover:text-white'
                }`}
              >
                <div className="flex items-center gap-3 truncate">
                  <Icon
                    className={`w-4 h-4 shrink-0 ${
                      isActive ? 'text-white' : 'text-slate-400'
                    }`}
                  />
                  <span className="truncate">{item.label}</span>
                </div>

                {item.badge !== undefined && item.badge > 0 && (
                  <span
                    className={`ml-2 px-1.5 py-0.5 rounded-full text-[10px] font-bold shrink-0 ${
                      item.badgeColor || 'bg-blue-500 text-white'
                    }`}
                  >
                    {item.badge}
                  </span>
                )}
              </button>
            );
          })}

          {/* Role Navigation: Logout Item */}
          <div className="pt-2 border-t border-slate-800/80 mt-2">
            <button
              id="sidebar-nav-logout"
              type="button"
              onClick={() => {
                onLogout();
                onClose();
              }}
              className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-semibold text-rose-400 hover:bg-rose-950/40 hover:text-rose-300 transition-colors text-left"
            >
              <LogOut className="w-4 h-4 shrink-0 text-rose-400" />
              <span>Logout</span>
            </button>
          </div>
        </nav>

        {/* Municipal Authority / User Info Footer */}
        <div className="p-3 border-t border-slate-800 bg-slate-950/60 shrink-0">
          <div className="text-[11px] text-slate-400 mb-2 truncate">
            <span className="font-semibold text-slate-200 block truncate">
              {userName || (role === 'ADMIN' ? 'Admin Authority' : role === 'WORKER' ? 'Field Technician' : 'Citizen User')}
            </span>
            <span className="text-[10px] text-slate-400">
              {role === 'ADMIN'
                ? 'BBMP Storm Water Directorate'
                : role === 'WORKER'
                ? 'East Zone Desilting Crew'
                : 'Bengaluru Citizen Portal'}
            </span>
          </div>

          <button
            type="button"
            onClick={() => {
              onLogout();
              onClose();
            }}
            className="w-full flex items-center justify-center gap-2 px-3 py-2 rounded-lg bg-slate-800 hover:bg-rose-950/50 hover:text-rose-300 hover:border-rose-800/60 text-xs font-semibold text-slate-300 border border-slate-700 transition-colors"
          >
            <LogOut className="w-3.5 h-3.5" />
            <span>Sign Out</span>
          </button>
        </div>
      </aside>
    </>
  );
};
