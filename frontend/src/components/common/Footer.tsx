import React from 'react';
import { ShieldCheck, MapPin, Building2 } from 'lucide-react';

export const Footer: React.FC = () => {
  return (
    <footer className="bg-white border-t border-slate-200 text-slate-500 py-6 mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="space-y-1 text-center md:text-left">
            <div className="flex items-center justify-center md:justify-start space-x-2">
              <span className="font-heading font-extrabold text-sm text-slate-900 tracking-tight">
                JANSETU<span className="text-sky-700"> AI</span>
              </span>
              <span className="text-[10px] px-2 py-0.5 rounded bg-emerald-50 text-emerald-800 font-semibold border border-emerald-200 uppercase tracking-wider">
                Digital Public Infrastructure (DPI)
              </span>
            </div>
            <p className="text-xs text-slate-400">
              Civic Intelligence &amp; Responsive Governance Platform • Gwalior Municipal Corporation
            </p>
          </div>

          <div className="flex flex-wrap items-center justify-center md:justify-end gap-4 text-xs text-slate-500">
            <span className="flex items-center space-x-1.5">
              <MapPin className="w-3.5 h-3.5 text-sky-600" />
              <span>Gwalior, Madhya Pradesh</span>
            </span>
            <span className="flex items-center space-x-1.5">
              <Building2 className="w-3.5 h-3.5 text-indigo-600" />
              <span>Urban Administration &amp; Development</span>
            </span>
            <span className="flex items-center space-x-1.5">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
              <span>GMC Verified Portal</span>
            </span>
          </div>
        </div>

        <div className="mt-5 pt-4 border-t border-slate-100 flex flex-col sm:flex-row items-center justify-between text-[11px] text-slate-400 gap-2">
          <span>&copy; {new Date().getFullYear()} JanSetu AI • Developed for Civic Public Good &amp; Digital India</span>
          <span>Toll-Free Helpline: 1800-233-1314 • gwalior.mp.gov.in</span>
        </div>
      </div>
    </footer>
  );
};
