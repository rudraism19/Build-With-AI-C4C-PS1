import React, { useState, useEffect } from 'react';
import {
  Activity,
  Filter,
  Layers,
  BarChart3,
  FileCheck2,
  BookOpen,
  Building,
  ArrowRight,
  TrendingUp,
  MapPin,
  Sparkles,
  RefreshCw,
  Building2,
  ShieldCheck,
  ChevronRight,
  RotateCcw,
  Check,
} from 'lucide-react';
import { CivicKpiCard, DemoDataBadge } from '../common/CivicUi';
import { CivicIntelligenceFeed } from './CivicIntelligenceFeed';
import { TopDevelopmentSignal } from './TopDevelopmentSignal';
import { HotspotsCard } from './HotspotsCard';
import { DataSourcesSection } from '../common/DataSourcesSection';
import { policymakerService } from '../../services/api';
import { Complaint } from '../../types';

interface CivicIntelligenceOverviewProps {
  onNavigate: (section: string) => void;
  onDprAction?: (item: any) => void;
  recentComplaint?: Complaint | null;
  complaintsCount?: number;
}

export const CivicIntelligenceOverview: React.FC<CivicIntelligenceOverviewProps> = ({
  onNavigate,
  onDprAction,
  recentComplaint,
  complaintsCount,
}) => {
  const [timeRange, setTimeRange] = useState('30d');
  const [selectedWard, setSelectedWard] = useState('ALL');
  const [selectedSector, setSelectedSector] = useState('ALL');

  // Live Backend Overview Data
  const [overviewData, setOverviewData] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isError, setIsError] = useState(false);

  useEffect(() => {
    fetchLiveMetrics();
  }, []);

  const fetchLiveMetrics = async () => {
    setIsLoading(true);
    setIsError(false);
    try {
      const data = await policymakerService.getOverview();
      setOverviewData(data);
    } catch (err) {
      console.warn('Could not fetch live policymaker overview, showing fallback state:', err);
      setIsError(true);
    } finally {
      setIsLoading(false);
    }
  };

  const handleResetFilters = () => {
    setTimeRange('30d');
    setSelectedWard('ALL');
    setSelectedSector('ALL');
  };

  // 5 Compact KPI cards
  const kpis = [
    {
      label: 'Validated Demands',
      value: (12420 + (complaintsCount || 0)).toLocaleString(),
      change: `↑ ${complaintsCount || 0} active municipal requests`,
      subtext: 'Filtered for duplication & spam',
      icon: Activity,
      accentColor: 'text-sky-700',
    },
    {
      label: 'Active Hotspots',
      value: overviewData?.active_hotspots ? Math.max(Number(overviewData.active_hotspots), 14) : '14',
      change: 'PostGIS Clustered',
      subtext: 'Geographic clusters <500m',
      icon: Layers,
      accentColor: 'text-rose-600',
    },
    {
      label: 'High-Priority Wards',
      value: overviewData?.high_priority_areas ? Math.max(Number(overviewData.high_priority_areas), 8) : '8',
      change: 'Priority > 70',
      subtext: '5-factor mathematical ranking',
      icon: BarChart3,
      accentColor: 'text-indigo-600',
    },
    {
      label: 'Active Projects',
      value: 67,
      change: '₹420+ Cr Outlay',
      subtext: 'Gwalior Smart City investments',
      icon: Building,
      accentColor: 'text-amber-700',
    },
    {
      label: 'Interventions',
      value: 23,
      change: 'Grounded DPRs',
      subtext: 'Ready for administrative review',
      icon: FileCheck2,
      accentColor: 'text-emerald-700',
    },
  ];

  // Compact horizontal 6-step pipeline
  const pipelineSteps = [
    { id: 'history', label: 'Citizen Demand', count: complaintsCount },
    { id: 'map', label: 'Hotspots' },
    { id: 'priorities', label: 'Priority' },
    { id: 'schemes', label: 'Policy Match' },
    { id: 'projects', label: 'Intervention' },
    { id: 'dpr', label: 'DPR' },
  ];

  return (
    <div className="space-y-4 sm:space-y-5">
      {/* 1. Hero Section (Compact: ~150-180px tall) */}
      <div className="bg-gradient-to-r from-slate-900 via-sky-950 to-slate-900 text-white rounded-2xl p-5 sm:p-6 shadow-sm border border-slate-800 relative overflow-hidden">
        <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
          <div className="space-y-1.5 max-w-3xl">
            <div className="flex items-center space-x-2">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              <span className="text-[11px] font-mono font-bold uppercase tracking-wider text-sky-300">
                Civic Intelligence &bull; Executive Decision Support
              </span>
            </div>

            <h1 className="text-xl sm:text-2xl font-heading font-extrabold tracking-tight text-white">
              Gwalior Civic Intelligence
            </h1>

            <p className="text-xs sm:text-sm text-slate-300 leading-relaxed max-w-2xl">
              Evidence-based municipal decision support from citizen demand, spatial data, infrastructure and policy.
            </p>

            {/* 3-4 Compact Metadata Pills */}
            <div className="pt-2 flex flex-wrap items-center gap-2 text-[11px] font-medium text-slate-200">
              <span className="px-2.5 py-0.5 rounded-md bg-white/10 border border-white/15">
                AMRUT 2.0
              </span>
              <span className="px-2.5 py-0.5 rounded-md bg-white/10 border border-white/15">
                JJM
              </span>
              <span className="px-2.5 py-0.5 rounded-md bg-white/10 border border-white/15">
                66 Wards
              </span>
              <span className="px-2.5 py-0.5 rounded-md bg-white/10 border border-white/15">
                6 Civic Sectors
              </span>
            </div>
          </div>

          {/* Top Right DEMO DATA Badge & Refresh */}
          <div className="flex sm:flex-col items-center sm:items-end justify-between sm:justify-start gap-2 shrink-0">
            <DemoDataBadge />
            <button
              onClick={fetchLiveMetrics}
              disabled={isLoading}
              className="p-1.5 rounded-lg bg-white/10 hover:bg-white/20 text-slate-300 hover:text-white transition cursor-pointer border border-white/10"
              title="Refresh live metrics from backend"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${isLoading ? 'animate-spin' : ''}`} />
            </button>
          </div>
        </div>
      </div>

      {/* 2. Compact Horizontal Decision Pipeline (55-65px tall) */}
      <div className="bg-white border border-slate-200 rounded-xl px-4 py-2.5 shadow-2xs flex items-center justify-between overflow-x-auto no-scrollbar gap-2 text-xs">
        <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider shrink-0 mr-1">
          Decision Pipeline:
        </span>

        <div className="flex items-center space-x-1 sm:space-x-2 shrink-0">
          {pipelineSteps.map((step, idx) => (
            <React.Fragment key={step.id}>
              <button
                onClick={() => onNavigate(step.id)}
                className="px-2.5 py-1.5 rounded-lg bg-slate-50 hover:bg-sky-50 hover:text-sky-800 text-slate-700 font-semibold border border-slate-200/80 transition text-xs flex items-center space-x-1.5 cursor-pointer group"
              >
                <span>{step.label}</span>
                {step.count !== undefined && (
                  <span className="px-1.5 py-0.2 rounded-full bg-sky-700 text-white text-[10px] font-bold">
                    {step.count}
                  </span>
                )}
              </button>
              {idx < pipelineSteps.length - 1 && (
                <span className="text-slate-300 font-bold text-xs select-none">→</span>
              )}
            </React.Fragment>
          ))}
        </div>
      </div>

      {/* 3. Compact Filter Toolbar (One Horizontal Row on Desktop, 60-70px tall) */}
      <div className="bg-white border border-slate-200 rounded-xl p-3 shadow-2xs flex flex-col md:flex-row md:items-center justify-between gap-3 text-xs">
        <div className="flex flex-wrap items-center gap-2.5">
          <div className="flex items-center space-x-1 text-slate-500 font-bold uppercase tracking-wider text-[10px]">
            <Filter className="w-3.5 h-3.5 text-slate-400" />
            <span>Filters:</span>
          </div>

          {/* Time Filter */}
          <select
            value={timeRange}
            onChange={(e) => setTimeRange(e.target.value)}
            className="px-2.5 py-1.5 bg-slate-50 border border-slate-200 rounded-lg text-xs font-semibold focus:outline-none cursor-pointer"
          >
            <option value="7d">Last 7 Days</option>
            <option value="30d">Last 30 Days</option>
            <option value="90d">Last 90 Days</option>
            <option value="all">All History</option>
          </select>

          {/* Ward Geography Selector */}
          <select
            value={selectedWard}
            onChange={(e) => setSelectedWard(e.target.value)}
            className="px-2.5 py-1.5 bg-slate-50 border border-slate-200 rounded-lg text-xs font-semibold focus:outline-none cursor-pointer"
          >
            <option value="ALL">All Gwalior Wards (66 Wards)</option>
            <option value="w22">Morar — Ward 22 (Critical)</option>
            <option value="w04">Lashkar Central — Ward 04</option>
            <option value="w14">Thatipur — Ward 14</option>
            <option value="w08">Maharaj Bada — Ward 08</option>
          </select>

          {/* Civic Sector Selector */}
          <select
            value={selectedSector}
            onChange={(e) => setSelectedSector(e.target.value)}
            className="px-2.5 py-1.5 bg-slate-50 border border-slate-200 rounded-lg text-xs font-semibold focus:outline-none cursor-pointer"
          >
            <option value="ALL">All Sectors</option>
            <option value="WATER">Water Supply &amp; Pipelines</option>
            <option value="ROADS">Roads &amp; Transit</option>
            <option value="SANITATION">Sanitation &amp; Waste</option>
            <option value="ELECTRICITY">Electricity &amp; Lighting</option>
          </select>
        </div>

        {/* Right Filter Actions: Apply & Reset */}
        <div className="flex items-center space-x-2 shrink-0">
          <button
            onClick={fetchLiveMetrics}
            className="px-3 py-1.5 bg-sky-700 hover:bg-sky-800 text-white rounded-lg text-xs font-bold transition shadow-2xs cursor-pointer flex items-center space-x-1"
          >
            <Check className="w-3 h-3" />
            <span>Apply</span>
          </button>
          <button
            onClick={handleResetFilters}
            className="px-3 py-1.5 border border-slate-200 bg-white hover:bg-slate-50 text-slate-600 rounded-lg text-xs font-semibold transition cursor-pointer flex items-center space-x-1"
          >
            <RotateCcw className="w-3 h-3 text-slate-400" />
            <span>Reset</span>
          </button>
        </div>
      </div>

      {/* 4. KPI Cards Row (Maximum 5 Compact Cards immediately below filters) */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
        {kpis.map((kpi, idx) => (
          <CivicKpiCard
            key={idx}
            label={kpi.label}
            value={kpi.value}
            change={kpi.change}
            subtext={kpi.subtext}
            icon={kpi.icon}
            accentColor={kpi.accentColor}
            isLoading={isLoading}
            isError={isError}
            isDemo={false}
          />
        ))}
      </div>

      {/* 5. Main Intelligence Area (3-Column Layout: Left ~42%, Center ~36%, Right ~22%) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 items-stretch">
        {/* LEFT COLUMN: GIS Hotspots Card (~42% / 5 Cols) */}
        <div className="lg:col-span-5 flex flex-col">
          <HotspotsCard
            onViewFullMap={() => onNavigate('map')}
            onSelectHotspot={(h) => {
              if (h.ward?.includes('22')) setSelectedWard('w22');
              else if (h.ward?.includes('Lashkar')) setSelectedWard('w04');
              else if (h.ward?.includes('Thatipur')) setSelectedWard('w14');
            }}
          />
        </div>

        {/* CENTER COLUMN: Top Development Signal (~36% / 4 Cols) */}
        <div className="lg:col-span-4 flex flex-col">
          <TopDevelopmentSignal
            onViewHotspot={() => onNavigate('map')}
            onRunPolicyMatch={() => onNavigate('schemes')}
            onGenerateIntervention={() => {
              if (onDprAction) {
                onDprAction({
                  name: 'Morar — Ward 22',
                  sector: 'WATER',
                  category: 'WATER',
                  scheme: 'AMRUT 2.0',
                  score: 86,
                  beneficiaries: 28500,
                });
              } else {
                onNavigate('dpr');
              }
            }}
          />
        </div>

        {/* RIGHT COLUMN: Civic Intelligence Feed (~22% / 3 Cols) */}
        <div className="lg:col-span-3 flex flex-col">
          <CivicIntelligenceFeed
            onViewAll={() => onNavigate('history')}
            onSelectSignal={(sig) => onNavigate(sig.targetSection)}
            recentComplaint={recentComplaint}
          />
        </div>
      </div>

      {/* 5.5 Live Citizen Demand Ingest Stream Banner */}
      <div className="bg-gradient-to-r from-sky-50 via-white to-slate-50 border border-sky-200 rounded-xl p-3.5 shadow-2xs flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
        <div className="flex items-center space-x-3">
          <div className="w-8 h-8 rounded-lg bg-sky-100 text-sky-800 flex items-center justify-center font-bold shrink-0">
            <Activity className="w-4 h-4 text-sky-700 animate-pulse" />
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <span className="font-bold text-slate-900">Direct Citizen Demand Stream Connected</span>
              <span className="px-1.5 py-0.2 rounded bg-emerald-100 text-emerald-800 text-[10px] font-bold">
                ● Live Intake
              </span>
            </div>
            <p className="text-[11px] text-slate-500 mt-0.5">
              {recentComplaint
                ? `Latest Ingest: "${recentComplaint.title}" • ${recentComplaint.ward || 'Gwalior'} (${recentComplaint.severity})`
                : 'Direct citizen grievance intake active across 66 Gwalior wards. All submissions are automatically AI triaged and mapped.'}
            </p>
          </div>
        </div>

        <button
          onClick={() => onNavigate('history')}
          className="px-3.5 py-1.5 bg-sky-700 hover:bg-sky-800 text-white rounded-lg font-bold shadow-2xs transition flex items-center space-x-1.5 shrink-0 self-start sm:self-auto cursor-pointer"
        >
          <span>View Ingested Demands ({complaintsCount || 3})</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </button>
      </div>

      {/* 6. Data Governance & Sources Section */}
      <DataSourcesSection />
    </div>
  );
};
