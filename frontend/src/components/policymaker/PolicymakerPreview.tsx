import React from 'react';
import {
  MapPin,
  TrendingUp,
  Sparkles,
  Layers,
  FileCheck2,
  Building2,
  DollarSign,
  ArrowRight,
  ShieldCheck,
  CheckCircle,
} from 'lucide-react';

interface PolicymakerPreviewProps {
  onSwitchToCitizen: () => void;
}

export const PolicymakerPreview: React.FC<PolicymakerPreviewProps> = ({ onSwitchToCitizen }) => {
  return (
    <div className="space-y-6">
      {/* Light Hero Banner */}
      <div className="bg-gradient-to-br from-white via-slate-50 to-sky-50/50 border border-slate-200 rounded-3xl p-6 sm:p-8 text-slate-900 shadow-xs relative overflow-hidden">
        <div className="absolute top-0 right-0 -mr-16 -mt-16 w-80 h-80 rounded-full bg-sky-200/20 blur-3xl pointer-events-none" />

        <div className="relative z-10 max-w-3xl space-y-3">
          <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-white text-emerald-800 text-xs font-semibold border border-emerald-200 shadow-2xs">
            <Building2 className="w-3.5 h-3.5 text-emerald-600" />
            <span>District Magistrate &amp; Municipal Commissioner Command Suite</span>
          </div>

          <h2 className="text-2xl sm:text-3xl font-heading font-extrabold tracking-tight text-slate-900">
            Gwalior District Civic Intelligence Command Center
          </h2>

          <p className="text-sm text-slate-600 leading-relaxed max-w-2xl">
            Live GIS spatial clustering, 5-factor priority formula ranking, and grounded DPR generation engine using AMRUT 2.0, PMAY-U 2.0, and Swachh Bharat Mission guidelines.
          </p>

          <div className="pt-3 flex flex-wrap gap-2 text-xs">
            <span className="px-2.5 py-1 rounded-lg bg-white border border-slate-200 text-slate-700 font-semibold flex items-center space-x-1.5 shadow-2xs">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
              <span>Gwalior Pilot: 66 Wards</span>
            </span>
            <span className="px-2.5 py-1 rounded-lg bg-white border border-slate-200 text-slate-700 font-semibold flex items-center space-x-1.5 shadow-2xs">
              <span className="w-1.5 h-1.5 rounded-full bg-sky-500" />
              <span>67 Smart City Projects Mapped</span>
            </span>
            <span className="px-2.5 py-1 rounded-lg bg-white border border-slate-200 text-slate-700 font-semibold flex items-center space-x-1.5 shadow-2xs">
              <span className="w-1.5 h-1.5 rounded-full bg-indigo-500" />
              <span>41 Policy Directives Active</span>
            </span>
          </div>
        </div>
      </div>

      {/* Grid of Key Features (Light & Airy) */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs hover:border-slate-300 transition space-y-3">
          <div className="w-10 h-10 rounded-xl bg-rose-50 text-rose-600 flex items-center justify-center font-bold border border-rose-100">
            <Layers className="w-5 h-5" />
          </div>
          <h4 className="font-bold text-slate-900 text-base">GIS Spatial Intelligence</h4>
          <p className="text-xs text-slate-500 leading-relaxed">
            Real-time heatmaps overlaying 8 Gwalior hospitals, 8 schools, and 67 Smart City projects against citizen complaint density.
          </p>
        </div>

        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs hover:border-slate-300 transition space-y-3">
          <div className="w-10 h-10 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center font-bold border border-indigo-100">
            <TrendingUp className="w-5 h-5" />
          </div>
          <h4 className="font-bold text-slate-900 text-base">5-Factor Priority Scoring</h4>
          <p className="text-xs text-slate-500 leading-relaxed">
            Deterministic formula balancing severity (0.3), volume (0.2), demographic vulnerability (0.2), infrastructure deficit (0.2), and historical funding (0.1).
          </p>
        </div>

        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs hover:border-slate-300 transition space-y-3">
          <div className="w-10 h-10 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center font-bold border border-amber-100">
            <FileCheck2 className="w-5 h-5" />
          </div>
          <h4 className="font-bold text-slate-900 text-base">Evidence-Grounded DPR Studio</h4>
          <p className="text-xs text-slate-500 leading-relaxed">
            Statutorily grounded: Every project proposal is synthesized directly against official operational scheme guidelines.
          </p>
        </div>
      </div>

      {/* Switcher Banner */}
      <div className="p-6 bg-gradient-to-r from-sky-50 to-indigo-50/60 border border-sky-200 rounded-2xl flex flex-col sm:flex-row items-center justify-between gap-4">
        <div>
          <h5 className="font-bold text-sky-950 text-sm">Citizen Portal Live Now</h5>
          <p className="text-xs text-slate-600 mt-0.5">
            Test filing multilingual voice grievances and tracking their status on the live Leaflet map.
          </p>
        </div>
        <button
          onClick={onSwitchToCitizen}
          className="px-5 py-2.5 bg-sky-600 hover:bg-sky-700 text-white rounded-xl text-xs font-bold flex items-center space-x-1.5 shadow-sm transition shrink-0"
        >
          <span>Open Citizen Grievance Portal</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};
