import React, { useState } from 'react';
import {
  Shield,
  HardHat,
  Users,
  ArrowRight,
  Droplets,
  Activity,
  CheckCircle2,
  Lock,
  Building2,
  Sparkles
} from 'lucide-react';
import { UserRole } from '../../types';
import { useAuth } from '../../context/AuthContext';

interface LoginPageProps {
  onLoginAs?: (role: UserRole) => void;
}

export const LoginPage: React.FC<LoginPageProps> = ({ onLoginAs }) => {
  const { loginAs, demoLogin } = useAuth();
  const [selectedRole, setSelectedRole] = useState<UserRole>('ADMIN');

  const handleRoleSelect = (role: UserRole) => {
    if (typeof onLoginAs === 'function') {
      onLoginAs(role);
    } else if (typeof loginAs === 'function') {
      loginAs(role);
    } else if (typeof demoLogin === 'function') {
      demoLogin(role);
    }
  };

  return (
    <div
      id="login-page"
      className="min-h-screen bg-gradient-to-br from-slate-900 via-navy-950 to-slate-950 flex flex-col justify-center py-12 sm:px-6 lg:px-8 relative overflow-hidden"
    >
      {/* Background visual accents */}
      <div className="absolute top-0 left-1/4 w-96 h-96 bg-blue-600/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-teal-500/10 rounded-full blur-3xl pointer-events-none" />

      <div className="sm:mx-auto sm:w-full sm:max-w-md relative z-10 text-center px-4">
        {/* Brand Icon */}
        <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-tr from-blue-600 to-cyan-500 shadow-xl shadow-blue-500/20 mb-4 border border-blue-400/30">
          <Droplets className="w-8 h-8 text-white" />
        </div>

        <h1 className="text-3xl font-black tracking-tight text-white">DrainTrack</h1>
        <p className="mt-1 text-xs sm:text-sm text-cyan-300 font-medium">
          Portable Smart Drainage Maintenance &amp; Digital Work Verification System
        </p>
        <p className="mt-2 text-xs text-slate-400 max-w-sm mx-auto">
          Connecting municipal authorities, certified sanitation workers, and citizens via portable IoT cleaning machines.
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-lg px-4 relative z-10">
        <div className="bg-white/95 backdrop-blur-md py-8 px-6 sm:px-10 rounded-3xl shadow-2xl border border-white/20">
          <div className="mb-6 text-center">
            <h2 className="text-base font-bold text-slate-900">Select Portal Access Role</h2>
            <p className="text-xs text-slate-500 mt-0.5">
              Choose a role below for instant demo credentials
            </p>
          </div>

          {/* Role Choice Cards */}
          <div className="space-y-3 mb-6">
            {/* 1. Admin */}
            <div
              onClick={() => setSelectedRole('ADMIN')}
              className={`p-4 rounded-2xl border-2 transition-all cursor-pointer flex items-center justify-between ${
                selectedRole === 'ADMIN'
                  ? 'border-blue-600 bg-blue-50/50 shadow-sm'
                  : 'border-slate-200 hover:border-slate-300 bg-white'
              }`}
            >
              <div className="flex items-center gap-3.5">
                <div
                  className={`w-10 h-10 rounded-xl flex items-center justify-center ${
                    selectedRole === 'ADMIN' ? 'bg-blue-600 text-white' : 'bg-slate-100 text-slate-600'
                  }`}
                >
                  <Building2 className="w-5 h-5" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-slate-900 text-sm">Municipal Authority / Admin</span>
                    <span className="text-[10px] px-2 py-0.2 rounded-full bg-blue-100 text-blue-800 font-bold">
                      Full Access
                    </span>
                  </div>
                  <p className="text-xs text-slate-500 mt-0.5">
                    Job dispatch, worker management, live machine telemetry, work verification &amp; payment sanctions
                  </p>
                </div>
              </div>
              <div
                className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${
                  selectedRole === 'ADMIN' ? 'border-blue-600 bg-blue-600' : 'border-slate-300'
                }`}
              >
                {selectedRole === 'ADMIN' && <div className="w-2 h-2 rounded-full bg-white" />}
              </div>
            </div>

            {/* 2. Worker */}
            <div
              onClick={() => setSelectedRole('WORKER')}
              className={`p-4 rounded-2xl border-2 transition-all cursor-pointer flex items-center justify-between ${
                selectedRole === 'WORKER'
                  ? 'border-blue-600 bg-blue-50/50 shadow-sm'
                  : 'border-slate-200 hover:border-slate-300 bg-white'
              }`}
            >
              <div className="flex items-center gap-3.5">
                <div
                  className={`w-10 h-10 rounded-xl flex items-center justify-center ${
                    selectedRole === 'WORKER' ? 'bg-blue-600 text-white' : 'bg-slate-100 text-slate-600'
                  }`}
                >
                  <HardHat className="w-5 h-5" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-slate-900 text-sm">Field Sanitation Worker</span>
                    <span className="text-[10px] px-2 py-0.2 rounded-full bg-amber-100 text-amber-800 font-bold">
                      Mobile View
                    </span>
                  </div>
                  <p className="text-xs text-slate-500 mt-0.5">
                    Accept assigned jobs, reach location, activate portable machine, log work &amp; track earnings
                  </p>
                </div>
              </div>
              <div
                className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${
                  selectedRole === 'WORKER' ? 'border-blue-600 bg-blue-600' : 'border-slate-300'
                }`}
              >
                {selectedRole === 'WORKER' && <div className="w-2 h-2 rounded-full bg-white" />}
              </div>
            </div>

            {/* 3. Citizen */}
            <div
              onClick={() => setSelectedRole('CITIZEN')}
              className={`p-4 rounded-2xl border-2 transition-all cursor-pointer flex items-center justify-between ${
                selectedRole === 'CITIZEN'
                  ? 'border-blue-600 bg-blue-50/50 shadow-sm'
                  : 'border-slate-200 hover:border-slate-300 bg-white'
              }`}
            >
              <div className="flex items-center gap-3.5">
                <div
                  className={`w-10 h-10 rounded-xl flex items-center justify-center ${
                    selectedRole === 'CITIZEN' ? 'bg-blue-600 text-white' : 'bg-slate-100 text-slate-600'
                  }`}
                >
                  <Users className="w-5 h-5" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-slate-900 text-sm">Citizen Portal</span>
                    <span className="text-[10px] px-2 py-0.2 rounded-full bg-emerald-100 text-emerald-800 font-bold">
                      Public Access
                    </span>
                  </div>
                  <p className="text-xs text-slate-500 mt-0.5">
                    Report blocked drains, upload photos, track complaint resolution &amp; inspect drainage cleanliness
                  </p>
                </div>
              </div>
              <div
                className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${
                  selectedRole === 'CITIZEN' ? 'border-blue-600 bg-blue-600' : 'border-slate-300'
                }`}
              >
                {selectedRole === 'CITIZEN' && <div className="w-2 h-2 rounded-full bg-white" />}
              </div>
            </div>
          </div>

          {/* Direct Sign-In Button */}
          <button
            type="button"
            onClick={() => handleRoleSelect(selectedRole)}
            className="w-full py-3.5 px-4 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-sm shadow-md transition-all flex items-center justify-center gap-2"
          >
            <span>Enter as {selectedRole === 'ADMIN' ? 'Municipal Admin' : selectedRole === 'WORKER' ? 'Worker (Ramesh)' : 'Citizen (Public)'}</span>
            <ArrowRight className="w-4 h-4" />
          </button>

          {/* Quick 1-Click Demo Logins */}
          <div className="mt-6 pt-5 border-t border-slate-100 text-center">
            <span className="text-[11px] uppercase font-bold tracking-wider text-slate-400 block mb-2.5">
              Instant 1-Click Role Switch
            </span>
            <div className="grid grid-cols-3 gap-2">
              <button
                type="button"
                onClick={() => handleRoleSelect('ADMIN')}
                className="py-2 px-2 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-semibold"
              >
                Admin Demo
              </button>
              <button
                type="button"
                onClick={() => handleRoleSelect('WORKER')}
                className="py-2 px-2 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-semibold"
              >
                Worker Demo
              </button>
              <button
                type="button"
                onClick={() => handleRoleSelect('CITIZEN')}
                className="py-2 px-2 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-semibold"
              >
                Citizen Demo
              </button>
            </div>
          </div>
        </div>

        <div className="mt-4 text-center text-xs text-slate-400">
          Smart India Hackathon (SIH) 2026 Innovation Prototype &bull; Supabase Backend Ready
        </div>
      </div>
    </div>
  );
};
