import React from 'react';
import { useAuth } from '../../context/AuthContext';
import { Menu, MapPin, User, Building2, Bell, Sparkles } from 'lucide-react';

interface HeaderProps {
  onToggleSidebar: () => void;
  currentSection: string;
  onNavigate: (section: string) => void;
}

export const Header: React.FC<HeaderProps> = ({
  onToggleSidebar,
  currentSection,
  onNavigate,
}) => {
  const { role, loginAsDemoCitizen, loginAsDemoPolicymaker } = useAuth();

  const sectionTitles: Record<string, { title: string; subtitle: string }> = {
    file: {
      title: 'Citizen Grievance Submission',
      subtitle: 'Voice & text input with real-time Sarvam & Gemini AI triage',
    },
    track: {
      title: 'Grievance Resolution Tracker',
      subtitle: 'Transparent 5-stage lifecycle audit stepper from filing to DPR sanction',
    },
    feed: {
      title: 'Community Feed & Ward Updates',
      subtitle: 'Live resolution status across Gwalior municipal wards',
    },
    policymaker: {
      title: 'District Magistrate Command Center',
      subtitle: 'GIS spatial intelligence, 5-factor priority scoring & statutory DPR generator',
    },
  };

  const current = sectionTitles[currentSection] || sectionTitles['file'];

  return (
    <header className="sticky top-0 z-30 bg-white/95 backdrop-blur-md border-b border-slate-200 shadow-xs">
      <div className="px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Left: Mobile Hamburger & Page Context */}
          <div className="flex items-center space-x-3">
            <button
              type="button"
              onClick={onToggleSidebar}
              className="p-2 rounded-lg text-slate-500 hover:text-slate-800 hover:bg-slate-100 lg:hidden transition"
              aria-label="Toggle menu"
            >
              <Menu className="w-5 h-5" />
            </button>

            <div>
              <div className="flex items-center space-x-2">
                <h1 className="font-heading font-bold text-base sm:text-lg text-slate-900 tracking-tight">
                  {current.title}
                </h1>
                <span className="hidden sm:inline-flex items-center px-2 py-0.5 rounded text-[11px] font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 mr-1 animate-pulse" />
                  Live Gwalior
                </span>
              </div>
              <p className="text-xs text-slate-500 hidden md:block">
                {current.subtitle}
              </p>
            </div>
          </div>

          {/* Right: Quick Persona Toggle & Location Pill */}
          <div className="flex items-center space-x-3">
            {/* Location Pill */}
            <div className="hidden sm:flex items-center text-xs text-slate-600 bg-slate-50 border border-slate-200 px-3 py-1.5 rounded-xl">
              <MapPin className="w-3.5 h-3.5 text-rose-500 mr-1.5" />
              <span className="font-semibold text-slate-800">Morar Ward 22</span>
              <span className="text-slate-300 mx-1.5">•</span>
              <span className="text-slate-500">Gwalior</span>
            </div>

            {/* Quick Role Switcher */}
            <div className="flex items-center bg-slate-100 p-1 rounded-xl border border-slate-200">
              <button
                onClick={() => {
                  loginAsDemoCitizen();
                  onNavigate('file');
                }}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center space-x-1.5 transition ${
                  role === 'CITIZEN' && currentSection !== 'policymaker'
                    ? 'bg-white text-sky-700 shadow-xs border border-slate-200/60'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                <User className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Citizen</span>
              </button>

              <button
                onClick={() => {
                  loginAsDemoPolicymaker();
                  onNavigate('policymaker');
                }}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center space-x-1.5 transition ${
                  role === 'POLICYMAKER' || currentSection === 'policymaker'
                    ? 'bg-slate-900 text-white shadow-xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                <Building2 className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">DM Suite</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};
