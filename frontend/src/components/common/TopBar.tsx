import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import {
  Menu,
  Globe,
  Volume2,
  Bell,
  History,
  RotateCcw,
  User,
  Shield,
  CheckCircle2,
  LogOut,
} from 'lucide-react';

interface TopBarProps {
  onToggleSidebar: () => void;
  isSidebarCollapsed?: boolean;
  onOpenHistory: () => void;
  onReset: () => void;
  historyCount: number;
  onLogout?: () => void;
}

export const TopBar: React.FC<TopBarProps> = ({
  onToggleSidebar,
  isSidebarCollapsed = false,
  onOpenHistory,
  onReset,
  historyCount,
  onLogout,
}) => {
  const { role, user, logout } = useAuth();
  const [language, setLanguage] = useState<'English' | 'Hindi'>('English');
  const [isVoiceEnabled, setIsVoiceEnabled] = useState(true);

  return (
    <header className="sticky top-0 z-30 h-16 bg-white border-b border-slate-200/90 px-3 sm:px-6 flex items-center justify-between shadow-2xs">
      {/* 1. Left: Hamburger + JANSETU AI & Subtitle */}
      <div className="flex items-center space-x-2.5 sm:space-x-3 shrink-0">
        <button
          type="button"
          onClick={onToggleSidebar}
          className="p-1.5 rounded-lg border border-slate-200 text-slate-600 hover:text-slate-900 hover:bg-slate-50 transition cursor-pointer btn-press shrink-0"
          title={isSidebarCollapsed ? "Expand sidebar navigation" : "Collapse sidebar navigation"}
        >
          <Menu className="w-4 h-4" />
        </button>

        <div className="leading-tight">
          <div className="flex items-center space-x-1.5">
            <span className="font-heading font-extrabold text-base text-slate-900 tracking-tight">
              JANSETU AI
            </span>
            <span className="px-1.5 py-0.2 rounded bg-sky-50 text-sky-800 text-[10px] font-bold border border-sky-200 uppercase">
              GOV.IN
            </span>
          </div>
          <span className="text-[11px] text-slate-500 font-medium block">
            Gwalior Municipal Governance
          </span>
        </div>
      </div>

      {/* 2. Center: Official Context */}
      <div className="hidden lg:flex items-center space-x-2 text-xs font-semibold text-slate-700 bg-slate-50/80 px-3.5 py-1.5 rounded-xl border border-slate-200/60 shadow-2xs">
        <span className="font-bold text-slate-900">Gwalior Municipal Governance</span>
        <span className="text-slate-300">•</span>
        <span className="text-sky-800 font-medium">
          {role === 'CITIZEN' ? 'Citizen Public Services Portal' : 'Executive Decision Support'}
        </span>
      </div>

      {/* 3. Right: Controls (Language, Voice, Alerts, History, Profile) */}
      <div className="flex items-center space-x-1.5 sm:space-x-2 shrink-0">
        {/* Language Selector */}
        <div className="relative hidden sm:flex items-center text-xs border border-slate-200 rounded-lg px-2.5 py-1 text-slate-700 bg-white hover:border-slate-300">
          <Globe className="w-3.5 h-3.5 text-slate-500 mr-1.5" />
          <select
            value={language}
            onChange={(e) => setLanguage(e.target.value as any)}
            className="bg-transparent text-xs font-medium focus:outline-none cursor-pointer pr-1"
          >
            <option value="English">English</option>
            <option value="Hindi">हिंदी (Hindi)</option>
          </select>
        </div>

        {/* Voice Toggle Button */}
        <button
          onClick={() => setIsVoiceEnabled(!isVoiceEnabled)}
          className={`flex items-center space-x-1 px-2.5 py-1 rounded-lg border text-xs font-medium transition cursor-pointer btn-press ${
            isVoiceEnabled
              ? 'border-slate-200 bg-slate-50 text-slate-700 hover:bg-slate-100'
              : 'border-slate-200 text-slate-400'
          }`}
          title="Toggle Voice Output"
        >
          <Volume2 className={`w-3.5 h-3.5 ${isVoiceEnabled ? 'text-sky-600' : 'text-slate-400'}`} />
          <span className="hidden md:inline">Voice</span>
        </button>

        {/* Alerts Button */}
        <button
          onClick={() => onOpenHistory()}
          className="flex items-center space-x-1 px-2.5 py-1 rounded-lg border border-slate-200 hover:bg-slate-50 text-slate-700 text-xs font-medium transition cursor-pointer btn-press relative"
          title="Active Civic Alerts"
        >
          <Bell className="w-3.5 h-3.5 text-slate-500" />
          <span className="hidden md:inline">Alerts</span>
          <span className="w-4 h-4 rounded-full bg-rose-600 text-white text-[10px] font-bold flex items-center justify-center">
            3
          </span>
        </button>

        {/* History Button */}
        <button
          onClick={onOpenHistory}
          className="flex items-center space-x-1 px-2.5 py-1 rounded-lg border border-slate-200 hover:bg-slate-50 text-slate-700 text-xs font-medium transition cursor-pointer btn-press"
          title="View Demand History"
        >
          <History className="w-3.5 h-3.5 text-slate-500" />
          <span className="hidden md:inline">{role === 'CITIZEN' ? 'My Grievances' : 'Demands'}</span>
          <span className="w-4 h-4 rounded-full bg-slate-900 text-white text-[10px] font-bold flex items-center justify-center">
            {historyCount}
          </span>
        </button>


        {/* User Identity Display (Strictly Isolated to Active Cadre) */}
        <div className="flex items-center space-x-2 pl-2 border-l border-slate-200">
          <div
            className={`w-7 h-7 rounded-full flex items-center justify-center font-bold text-xs ${
              role === 'CITIZEN' ? 'bg-teal-700 text-white' : 'bg-blue-800 text-white'
            }`}
          >
            {role === 'CITIZEN' ? '👤' : '🏛️'}
          </div>
          <div className="hidden xl:block text-left">
            <span className="text-xs font-bold text-slate-800 block leading-tight">
              {role === 'CITIZEN' ? (user?.name || 'Citizen User') : (user?.name || 'District Magistrate')}
            </span>
            <span className="text-[10px] text-slate-500 font-semibold block leading-tight">
              {role === 'CITIZEN' ? 'Ward 22 Morar • Citizen' : 'DM Office • Policymaker'}
            </span>
          </div>
        </div>

        {/* Clean Logout / Exit Portal Button */}
        <button
          onClick={() => {
            logout();
            onLogout?.();
          }}
          className="flex items-center space-x-1 px-2.5 py-1 rounded-lg border border-rose-200 bg-rose-50 hover:bg-rose-100 text-rose-700 text-xs font-bold transition cursor-pointer btn-press"
          title="Sign Out & Return to Landing Page"
        >
          <LogOut className="w-3.5 h-3.5 text-rose-600" />
          <span className="hidden sm:inline">Logout</span>
        </button>
      </div>
    </header>
  );
};
