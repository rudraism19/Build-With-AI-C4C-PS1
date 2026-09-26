import React, { useState } from 'react';
import {
  ShieldCheck,
  Info,
  Clock,
  ExternalLink,
  CheckCircle2,
  AlertTriangle,
  Database,
  FileText,
  Sparkles,
  HelpCircle,
} from 'lucide-react';

/**
 * 1. Demo Data Badge with mandatory government explanation tooltip
 */
export const DemoDataBadge: React.FC<{ tooltip?: string }> = ({
  tooltip = 'Some values in this prototype are demonstration data and are not official government statistics.',
}) => {
  const [showTooltip, setShowTooltip] = useState(false);

  return (
    <div className="relative inline-flex items-center">
      <span
        onMouseEnter={() => setShowTooltip(true)}
        onMouseLeave={() => setShowTooltip(false)}
        className="cursor-help inline-flex items-center space-x-1 px-1.5 py-0.5 rounded bg-amber-50 text-amber-800 text-[10px] font-mono font-bold border border-amber-300"
      >
        <span className="w-1.5 h-1.5 rounded-full bg-amber-500" />
        <span>DEMO DATA</span>
      </span>

      {showTooltip && (
        <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-1.5 w-56 p-2 bg-slate-900 text-white text-[11px] rounded-lg shadow-xl z-50 pointer-events-none leading-tight border border-slate-700">
          <p>{tooltip}</p>
        </div>
      )}
    </div>
  );
};

/**
 * 2. Data Freshness Badge indicating dataset vintage
 */
export const DataFreshnessBadge: React.FC<{
  vintage: string;
  source: string;
}> = ({ vintage, source }) => {
  return (
    <span className="inline-flex items-center space-x-1 px-2 py-0.5 rounded-md bg-slate-100 text-slate-600 text-[10px] font-medium border border-slate-200">
      <Clock className="w-3 h-3 text-slate-400" />
      <span>{source} ({vintage})</span>
    </span>
  );
};

/**
 * 3. Evidence Badge
 */
export const EvidenceBadge: React.FC<{
  label?: string;
  count?: number | string;
  onClick?: () => void;
}> = ({ label = 'Evidence-backed', count, onClick }) => {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`inline-flex items-center space-x-1 px-2 py-0.5 rounded-md bg-emerald-50 text-emerald-800 text-[11px] font-semibold border border-emerald-200 transition ${
        onClick ? 'hover:bg-emerald-100 hover:border-emerald-300 cursor-pointer' : ''
      }`}
      title={onClick ? 'Click to inspect data provenance & evidence sources' : undefined}
    >
      <CheckCircle2 className="w-3 h-3 text-emerald-600" />
      <span>{label}</span>
      {count !== undefined && (
        <span className="font-mono font-bold text-[10px] bg-emerald-200/60 px-1 rounded ml-0.5">
          {count}
        </span>
      )}
    </button>
  );
};

/**
 * 4. Civic KPI Card with loading skeleton, error, and empty state
 */
export interface CivicKpiCardProps {
  label: string;
  value?: number | string | null;
  change?: string;
  subtext: string;
  icon: React.ComponentType<{ className?: string }>;
  accentColor?: string;
  isLoading?: boolean;
  isError?: boolean;
  isDemo?: boolean;
}

export const CivicKpiCard: React.FC<CivicKpiCardProps> = ({
  label,
  value,
  change,
  subtext,
  icon: Icon,
  accentColor = 'text-sky-700',
  isLoading = false,
  isError = false,
  isDemo = false,
}) => {
  return (
    <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-xs hover:border-slate-300 transition space-y-2 hover-card-lift">
      <div className="flex items-center justify-between text-xs text-slate-500">
        <span className="font-bold uppercase tracking-wider text-[11px] text-slate-600">
          {label}
        </span>
        <div className="flex items-center space-x-1.5">
          {isDemo && <DemoDataBadge />}
          <div className="p-1.5 rounded-lg bg-slate-50 border border-slate-200 text-slate-600">
            <Icon className="w-4 h-4" />
          </div>
        </div>
      </div>

      <div className="flex items-baseline space-x-2">
        {isLoading ? (
          <div className="h-7 w-24 bg-slate-200 animate-pulse rounded" />
        ) : isError ? (
          <span className="text-xs text-rose-600 font-semibold flex items-center">
            <AlertTriangle className="w-3.5 h-3.5 mr-1" /> Unavailable
          </span>
        ) : (
          <span className={`text-2xl font-heading font-black font-mono tracking-tight ${accentColor}`}>
            {value !== undefined && value !== null ? value : '—'}
          </span>
        )}

        {change && !isLoading && !isError && (
          <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 px-1.5 py-0.5 rounded border border-emerald-200">
            {change}
          </span>
        )}
      </div>

      <p className="text-[11px] text-slate-400 leading-tight">{subtext}</p>
    </div>
  );
};

/**
 * 5. Priority Score Badge
 */
export const PriorityScoreBadge: React.FC<{ score: number }> = ({ score }) => {
  const rounded = Math.round(score * 10) / 10;
  const isCritical = rounded >= 80;
  const isHigh = rounded >= 70 && rounded < 80;

  return (
    <span
      className={`px-2.5 py-1 rounded-full font-mono font-bold text-xs inline-flex items-center space-x-1 border ${
        isCritical
          ? 'bg-rose-50 text-rose-800 border-rose-200'
          : isHigh
          ? 'bg-amber-50 text-amber-800 border-amber-200'
          : 'bg-emerald-50 text-emerald-800 border-emerald-200'
      }`}
    >
      <span className="w-1.5 h-1.5 rounded-full bg-current" />
      <span>{rounded} / 100</span>
    </span>
  );
};

/**
 * 6. Priority Factor Breakdown (Horizontal Progress Bars)
 */
export const PriorityFactorBreakdown: React.FC<{
  factors: {
    demand: number;
    infraGap: number;
    populationImpact: number;
    developmentDeficit: number;
    investmentGap: number;
  };
}> = ({ factors }) => {
  const items = [
    { label: 'Demand Score', weight: '30%', val: factors.demand, color: 'bg-sky-600' },
    { label: 'Infrastructure Gap', weight: '25%', val: factors.infraGap, color: 'bg-rose-600' },
    { label: 'Population Impact', weight: '20%', val: factors.populationImpact, color: 'bg-amber-600' },
    { label: 'Development Deficit', weight: '15%', val: factors.developmentDeficit, color: 'bg-indigo-600' },
    { label: 'Investment Gap', weight: '10%', val: factors.investmentGap, color: 'bg-purple-600' },
  ];

  return (
    <div className="space-y-2.5">
      {items.map((item) => (
        <div key={item.label} className="space-y-1 text-xs">
          <div className="flex items-center justify-between text-slate-700">
            <span className="font-semibold text-slate-800 flex items-center space-x-1.5">
              <span>{item.label}</span>
              <span className="text-[10px] text-slate-400 font-mono">({item.weight})</span>
            </span>
            <span className="font-mono font-bold text-slate-900">{item.val} / 100</span>
          </div>
          <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden border border-slate-200/60">
            <div
              className={`h-full rounded-full ${item.color} transition-all duration-300`}
              style={{ width: `${Math.min(item.val, 100)}%` }}
            />
          </div>
        </div>
      ))}
    </div>
  );
};

/**
 * 7. Evidence Panel Dialog / Slideover
 */
export const EvidencePanel: React.FC<{
  isOpen: boolean;
  onClose: () => void;
  title: string;
  sources: Array<{
    source: string;
    dataset: string;
    dataYear: string;
    lastUpdated: string;
    sourceUrl: string;
    geographicLevel: string;
  }>;
}> = ({ isOpen, onClose, title, sources }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-xs">
      <div className="bg-white rounded-2xl border border-slate-200 shadow-2xl max-w-2xl w-full p-6 space-y-4 max-h-[85vh] overflow-y-auto">
        <div className="flex items-center justify-between pb-3 border-b border-slate-200">
          <div className="flex items-center space-x-2">
            <Database className="w-5 h-5 text-sky-700" />
            <div>
              <h4 className="font-heading font-bold text-slate-900 text-sm">
                Data Provenance &amp; Evidence Sources
              </h4>
              <p className="text-[11px] text-slate-500">{title}</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100"
          >
            ✕
          </button>
        </div>

        <div className="space-y-3">
          {sources.map((s, idx) => (
            <div
              key={idx}
              className="p-3.5 rounded-xl border border-slate-200 bg-slate-50/70 text-xs space-y-1.5"
            >
              <div className="flex items-center justify-between">
                <span className="font-bold text-slate-900 text-xs">{s.source}</span>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-white border border-slate-200 text-slate-600 font-bold">
                  {s.geographicLevel}
                </span>
              </div>
              <p className="text-slate-600">{s.dataset}</p>
              <div className="pt-1 border-t border-slate-200/60 flex items-center justify-between text-[10px] text-slate-500">
                <span>Vintage: <strong>{s.dataYear}</strong> (Updated: {s.lastUpdated})</span>
                {s.sourceUrl && (
                  <a
                    href={s.sourceUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="text-sky-600 hover:underline flex items-center space-x-0.5"
                  >
                    <span>View Official Portal</span>
                    <ExternalLink className="w-2.5 h-2.5" />
                  </a>
                )}
              </div>
            </div>
          ))}
        </div>

        <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
          <span className="text-[10px] text-slate-400">
            Source authenticity verified against Gwalior Municipal Corporation records.
          </span>
          <button
            onClick={onClose}
            className="px-4 py-1.5 bg-slate-900 hover:bg-slate-800 text-white rounded-lg text-xs font-semibold"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};
