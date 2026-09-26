import React from 'react';
import { Radio } from 'lucide-react';

export const LiveGazette: React.FC = () => {
  const announcements = [
    {
      label: 'Morar Ward 22',
      text: 'Piped water distribution overhaul sanctioned under AMRUT 2.0',
    },
    {
      label: 'Gwalior Smart City',
      text: '67 civic projects active across 66 wards (₹420+ Cr)',
    },
    {
      label: 'Jal Jeevan Mission',
      text: 'Universal tap connection deficit audit in progress',
    },
    {
      label: 'Swachh Bharat 2.0',
      text: 'Legacy waste clearance & septage treatment active in Lashkar',
    },
  ];

  return (
    <div className="bg-white border-b border-slate-200/80 px-4 sm:px-6 py-2 flex items-center space-x-3 overflow-hidden text-xs">
      {/* Live Badge */}
      <div className="flex items-center space-x-1.5 px-2.5 py-0.5 rounded-full bg-amber-50 text-amber-800 border border-amber-200 font-bold shrink-0 shadow-2xs">
        <span className="w-1.5 h-1.5 rounded-full bg-amber-500 animate-ping" />
        <span className="text-[10px] tracking-wider uppercase">Live Gazette</span>
      </div>

      {/* Marquee / Highlights */}
      <div className="flex items-center space-x-6 overflow-x-auto no-scrollbar whitespace-nowrap text-slate-600">
        {announcements.map((item, idx) => (
          <div key={idx} className="flex items-center space-x-1.5 shrink-0">
            <span className="text-slate-300">•</span>
            <span className="font-semibold text-slate-800">{item.label}:</span>
            <span className="text-slate-600">{item.text}</span>
          </div>
        ))}
      </div>
    </div>
  );
};
