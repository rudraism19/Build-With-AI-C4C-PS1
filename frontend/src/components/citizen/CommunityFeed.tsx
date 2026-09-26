import React from 'react';
import { AlertCircle, CheckCircle2, TrendingUp, Info, Droplet, Wrench, ShieldCheck } from 'lucide-react';

export const CommunityFeed: React.FC = () => {
  const updates = [
    {
      id: '1',
      title: 'Morar Ward 22: Piped Water Line Rehabilitation Sanctioned',
      department: 'Public Health Engineering (PHED)',
      scheme: 'AMRUT 2.0 Scheme',
      status: 'UNDER_EXECUTION',
      date: 'Today, 10:30 AM',
      icon: Droplet,
      iconColor: 'text-sky-600',
      bgColor: 'bg-sky-50',
    },
    {
      id: '2',
      title: 'Lashkar Bazar: Night Drainage Clearance and Asphalt Patching',
      department: 'Gwalior Municipal Corporation',
      scheme: 'Smart City Mission',
      status: 'SCHEDULED',
      date: 'Yesterday',
      icon: Wrench,
      iconColor: 'text-amber-600',
      bgColor: 'bg-amber-50',
    },
    {
      id: '3',
      title: 'Thatipur: New Solid Waste Segregation Vehicles Deployed',
      department: 'Swachh Bharat Mission (Urban)',
      scheme: 'SBM 2.0',
      status: 'COMPLETED',
      date: '2 days ago',
      icon: CheckCircle2,
      iconColor: 'text-emerald-600',
      bgColor: 'bg-emerald-50',
    },
  ];

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6 space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h4 className="font-heading font-bold text-slate-900 text-sm flex items-center space-x-2">
            <TrendingUp className="w-4 h-4 text-sky-600" />
            <span>Gwalior Civic Intelligence &amp; Resolution Feed</span>
          </h4>
          <p className="text-xs text-slate-500 mt-0.5">
            Transparent public updates on citizen-driven infrastructure interventions.
          </p>
        </div>
        <span className="text-[11px] font-semibold text-slate-400">Live Ward Updates</span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
        {updates.map((u) => {
          const Icon = u.icon;
          return (
            <div
              key={u.id}
              className="p-4 rounded-xl border border-slate-200/80 bg-slate-50/50 hover:bg-white hover:shadow-sm transition space-y-2 text-xs"
            >
              <div className="flex items-center justify-between">
                <span className={`p-1.5 rounded-lg ${u.bgColor} ${u.iconColor}`}>
                  <Icon className="w-4 h-4" />
                </span>
                <span className="text-[10px] text-slate-400">{u.date}</span>
              </div>

              <h5 className="font-semibold text-slate-900 line-clamp-2">{u.title}</h5>

              <div className="pt-1 flex items-center justify-between text-[11px] text-slate-500 border-t border-slate-200/60">
                <span>{u.department}</span>
                <span className="font-bold text-sky-700">{u.scheme}</span>
              </div>
            </div>
          );
        })}
      </div>

      {/* Citizen Trust Banner */}
      <div className="p-3 bg-gradient-to-r from-sky-50 to-indigo-50 border border-sky-200/60 rounded-xl flex items-center justify-between text-xs">
        <div className="flex items-center space-x-2 text-slate-700">
          <ShieldCheck className="w-4 h-4 text-sky-600 shrink-0" />
          <span>
            <strong>Zero Citizen Ignored</strong>: Every grievance in Gwalior is automatically clustered by neighborhood and ranked using transparent multi-factor scoring.
          </span>
        </div>
        <span className="font-mono text-[11px] font-bold text-sky-800 shrink-0 hidden sm:inline">
          Verified Scheme Citations
        </span>
      </div>
    </div>
  );
};
