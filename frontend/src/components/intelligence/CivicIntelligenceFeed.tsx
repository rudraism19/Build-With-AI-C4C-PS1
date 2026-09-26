import React from 'react';
import { ArrowRight, MapPin, Activity, Bell, Sparkles } from 'lucide-react';
import { Complaint } from '../../types';

export interface CivicSignalItem {
  id: string;
  sector: string;
  headline: string;
  location: string;
  severity: 'CRITICAL' | 'HIGH' | 'MEDIUM' | 'RESOLVED';
  timestamp: string;
  metric: string;
  targetSection: string;
  isLiveIngest?: boolean;
}

interface CivicIntelligenceFeedProps {
  onSelectSignal: (signal: CivicSignalItem) => void;
  onViewAll?: () => void;
  recentComplaint?: Complaint | null;
}

export const CivicIntelligenceFeed: React.FC<CivicIntelligenceFeedProps> = ({
  onSelectSignal,
  onViewAll,
  recentComplaint,
}) => {
  const baseSignals: CivicSignalItem[] = [
    {
      id: 'sig-01',
      sector: 'WATER',
      headline: 'Water demand cluster detected',
      location: 'Morar Ward 22',
      severity: 'CRITICAL',
      timestamp: '12m ago',
      metric: '127 validated demands',
      targetSection: 'map',
    },
    {
      id: 'sig-02',
      sector: 'ROADS',
      headline: 'Road + drainage demand increasing',
      location: 'Lashkar Central',
      severity: 'HIGH',
      timestamp: '45m ago',
      metric: 'High spatial concentration (84 reports)',
      targetSection: 'priorities',
    },
    {
      id: 'sig-03',
      sector: 'SANITATION',
      headline: 'Sanitation demand rising',
      location: 'Ward 14 (Thatipur)',
      severity: 'MEDIUM',
      timestamp: '2h ago',
      metric: '+18% vs previous period',
      targetSection: 'schemes',
    },
    {
      id: 'sig-04',
      sector: 'WATER',
      headline: 'Water demand decreasing',
      location: 'Gola Ka Mandir',
      severity: 'RESOLVED',
      timestamp: '4h ago',
      metric: '-35% post repair',
      targetSection: 'history',
    },
  ];

  const signals: CivicSignalItem[] = React.useMemo(() => {
    if (!recentComplaint) return baseSignals;
    const liveSignal: CivicSignalItem = {
      id: `live-${recentComplaint.id}`,
      sector: recentComplaint.category || 'WATER',
      headline: `Live Citizen Demand: ${recentComplaint.title.slice(0, 48)}${recentComplaint.title.length > 48 ? '...' : ''}`,
      location: recentComplaint.ward || recentComplaint.address || 'Gwalior Municipal Area',
      severity: (recentComplaint.severity as any) || 'HIGH',
      timestamp: 'Just now',
      metric: 'Fresh citizen ingest (Pending Triage)',
      targetSection: 'history',
      isLiveIngest: true,
    };
    return [liveSignal, ...baseSignals];
  }, [recentComplaint]);

  return (
    <div className="bg-white border border-slate-200 rounded-2xl p-4 sm:p-5 shadow-xs flex flex-col justify-between space-y-3 hover:border-slate-300 transition h-full">
      {/* Feed Header */}
      <div className="flex items-center justify-between pb-2 border-b border-slate-100">
        <div className="flex items-center space-x-2">
          <span className="w-2 h-2 rounded-full bg-rose-500 animate-ping" />
          <h4 className="font-heading font-extrabold text-xs text-slate-900 tracking-wider uppercase">
            Civic Intelligence Feed
          </h4>
        </div>

        {onViewAll && (
          <button
            onClick={onViewAll}
            className="text-[11px] font-bold text-sky-700 hover:underline cursor-pointer"
          >
            View All →
          </button>
        )}
      </div>

      {/* Signals Vertical Stack */}
      <div className="space-y-2.5 flex-1 overflow-y-auto max-h-[380px] no-scrollbar">
        {signals.map((sig) => {
          const isCritical = sig.severity === 'CRITICAL';
          const isHigh = sig.severity === 'HIGH';
          const isMedium = sig.severity === 'MEDIUM';
          const isResolved = sig.severity === 'RESOLVED';

          const dotColor = isCritical
            ? 'text-rose-600 bg-rose-50 border-rose-200'
            : isHigh
            ? 'text-amber-600 bg-amber-50 border-amber-200'
            : isMedium
            ? 'text-yellow-600 bg-yellow-50 border-yellow-200'
            : 'text-emerald-600 bg-emerald-50 border-emerald-200';

          const dotSymbol = isCritical ? '🔴' : isHigh ? '🟠' : isMedium ? '🟡' : '🟢';

          return (
            <div
              key={sig.id}
              onClick={() => onSelectSignal(sig)}
              className={`p-2.5 rounded-xl border transition text-xs space-y-1.5 cursor-pointer group hover-card-lift ${
                sig.isLiveIngest
                  ? 'border-sky-300 bg-sky-50/70 shadow-xs'
                  : 'border-slate-200 bg-slate-50/60 hover:bg-white hover:border-slate-300'
              }`}
            >
              <div className="flex items-center justify-between">
                <span className="font-mono text-[10px] font-bold text-slate-500 flex items-center space-x-1">
                  <span>{dotSymbol}</span>
                  <span className="uppercase">{sig.sector}</span>
                  {sig.isLiveIngest && (
                    <span className="px-1.5 py-0.2 rounded bg-sky-600 text-white text-[9px] font-extrabold uppercase animate-pulse">
                      Live Ingest
                    </span>
                  )}
                </span>
                <span className="text-[10px] font-mono text-slate-400">{sig.timestamp}</span>
              </div>

              <div className="font-bold text-slate-900 text-xs leading-snug group-hover:text-sky-700 transition">
                {sig.headline}
              </div>

              <div className="flex items-center justify-between text-[11px] pt-1 border-t border-slate-200/50">
                <span className="text-slate-600 font-medium flex items-center space-x-1">
                  <MapPin className="w-3 h-3 text-slate-400 shrink-0" />
                  <span className="truncate">{sig.location}</span>
                </span>
                <span className="font-mono font-semibold text-slate-700 shrink-0">
                  {sig.metric}
                </span>
              </div>
            </div>
          );
        })}
      </div>

      {/* Bottom Footer Note */}
      <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-[10px] text-slate-400">
        <span>Autonomous spatial anomaly engine</span>
        <button
          onClick={onViewAll}
          className="text-sky-700 font-semibold hover:underline cursor-pointer"
        >
          Demands Stream →
        </button>
      </div>
    </div>
  );
};
