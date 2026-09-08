import React from 'react';
import {
  Menu,
  Bell,
  Radio,
  UserCheck,
  LogOut,
  RefreshCw,
  Shield,
  HardHat,
  Users
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { UserRole } from '../../types';

interface HeaderProps {
  onToggleSidebar?: () => void;
  activeTabTitle?: string;
  onResetData?: () => void;
  isSidebarOpen?: boolean;
  currentUser?: any;
  onRoleChange?: (role: UserRole) => void;
  onLogout?: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  onToggleSidebar,
  activeTabTitle = 'Dashboard',
  onResetData,
  isSidebarOpen,
  onRoleChange,
  onLogout
}) => {
  const { user, demoLogin, logout } = useAuth();

  const handleRoleSwitch = (role: UserRole) => {
    if (onRoleChange) {
      onRoleChange(role);
    } else {
      demoLogin(role);
    }
  };

  const handleLogout = () => {
    if (onLogout) {
      onLogout();
    } else {
      logout();
    }
  };

  return (
    <header
      id="draintrack-header"
      className="sticky top-0 z-40 bg-white border-b border-slate-200 shadow-xs"
    >
      <div className="px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-4">
        {/* Left: Mobile & Desktop Menu Toggle (☰) + Brand */}
        <div className="flex items-center gap-2 sm:gap-3">
          {onToggleSidebar && (
            <button
              type="button"
              id="header-hamburger-btn"
              onClick={onToggleSidebar}
              className={`p-2 rounded-xl border transition-all flex items-center justify-center cursor-pointer ${
                isSidebarOpen
                  ? 'bg-blue-50 border-blue-200 text-blue-700 shadow-xs'
                  : 'border-slate-200 text-slate-700 hover:bg-slate-100 hover:text-slate-900'
              }`}
              aria-label="Toggle Navigation Menu"
              title="Toggle Navigation Menu (☰)"
            >
              <Menu className="w-5 h-5" />
            </button>
          )}

          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-slate-900 flex items-center justify-center text-white shadow-xs shrink-0">
              <span className="font-black text-sm tracking-wider text-cyan-400">DT</span>
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-bold text-slate-900 text-base leading-none">DrainTrack</span>
                <span className="hidden md:inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-700 text-[10px] font-semibold">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                  IoT Mesh Online
                </span>
              </div>
              <p className="text-[11px] text-slate-500 hidden sm:block">
                Portable Smart Drainage Maintenance &amp; Verification System
              </p>
            </div>
          </div>
        </div>

        {/* Center / Right: Quick Role Switcher Bar (Crucial for SIH prototype demo) */}
        <div className="flex items-center gap-2 sm:gap-3">
          {/* SIH Prototype Role Switcher */}
          <div className="flex items-center bg-slate-100 p-1 rounded-lg border border-slate-200">
            <span className="hidden xl:inline-block text-[11px] font-medium text-slate-500 px-2">
              Demo Switch:
            </span>
            <button
              type="button"
              onClick={() => handleRoleSwitch('ADMIN')}
              className={`flex items-center gap-1.5 px-2 sm:px-2.5 py-1 rounded-md text-xs font-semibold transition-all ${
                user?.role === 'ADMIN'
                  ? 'bg-white text-slate-900 shadow-xs border border-slate-200'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
              title="Switch to Municipal Administrator View"
            >
              <Shield className="w-3.5 h-3.5 text-blue-600" />
              <span className="hidden sm:inline">Admin</span>
            </button>
            <button
              type="button"
              onClick={() => handleRoleSwitch('WORKER')}
              className={`flex items-center gap-1.5 px-2 sm:px-2.5 py-1 rounded-md text-xs font-semibold transition-all ${
                user?.role === 'WORKER'
                  ? 'bg-white text-slate-900 shadow-xs border border-slate-200'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
              title="Switch to Worker View (Ramesh W001)"
            >
              <HardHat className="w-3.5 h-3.5 text-amber-600" />
              <span className="hidden sm:inline">Worker</span>
            </button>
            <button
              type="button"
              onClick={() => handleRoleSwitch('CITIZEN')}
              className={`flex items-center gap-1.5 px-2 sm:px-2.5 py-1 rounded-md text-xs font-semibold transition-all ${
                user?.role === 'CITIZEN'
                  ? 'bg-white text-slate-900 shadow-xs border border-slate-200'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
              title="Switch to Citizen Public View"
            >
              <Users className="w-3.5 h-3.5 text-emerald-600" />
              <span className="hidden sm:inline">Citizen</span>
            </button>
          </div>

          {/* User badge */}
          <div className="hidden md:flex items-center gap-2 pl-2 border-l border-slate-200">
            <div className="w-7 h-7 rounded-full bg-slate-800 text-white flex items-center justify-center text-xs font-bold">
              {user?.name?.[0] || 'U'}
            </div>
            <div className="text-left leading-tight hidden lg:block">
              <span className="text-xs font-bold text-slate-800 block truncate max-w-[140px]">
                {user?.name}
              </span>
              <span className="text-[10px] text-slate-500 font-medium">
                {user?.role === 'ADMIN'
                  ? 'Municipal Authority'
                  : user?.role === 'WORKER'
                  ? 'Field Sanitation Worker'
                  : 'Citizen Resident'}
              </span>
            </div>
          </div>

          {/* Logout button */}
          <button
            type="button"
            onClick={handleLogout}
            className="p-2 text-slate-500 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors"
            title="Logout / Return to Login Screen"
          >
            <LogOut className="w-4 h-4" />
          </button>
        </div>
      </div>
    </header>
  );
};
