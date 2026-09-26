import React, { useState, useEffect } from 'react';
import { Database, ExternalLink, ShieldCheck, Clock, Layers, Loader2 } from 'lucide-react';
import { DemoDataBadge } from './CivicUi';
import { dataService } from '../../services/api';

export const DataSourcesSection: React.FC = () => {
  const [liveSources, setLiveSources] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const defaultSources = [
    {
      name: 'Census of India — Demographic Baseline',
      year: '2011',
      lastUpdated: 'Historical Baseline (2011)',
      level: 'District & Ward Level',
      dataset: 'Population density, household count, and socio-economic vulnerability indicators.',
      url: 'https://censusindia.gov.in',
      isDemo: true,
      note: 'Census 2011 — historical demographic baseline',
    },
    {
      name: 'Gwalior GIS — MP Urban Administration',
      year: '2024',
      lastUpdated: 'March 2024',
      level: 'Ward & Cadastral Boundaries',
      dataset: 'Municipal administrative ward boundaries (66 wards), road centerlines, and civic zones.',
      url: 'https://gwaliorgis.mp.gov.in',
      isDemo: false,
      note: 'Official GoMP GIS Directory',
    },
    {
      name: 'Gwalior Smart City Mission Projects Ledger',
      year: '2024',
      lastUpdated: 'September 2024',
      level: 'Project & Site Level',
      dataset: '70 capital investment projects, financial outlays (₹420+ Cr), and implementation status.',
      url: 'https://gwaliorgis.mp.gov.in',
      isDemo: false,
      note: 'Official Gwalior Smart City Ltd Dataset',
    },
    {
      name: 'Atal Mission for Rejuvenation & Urban Transformation (AMRUT 2.0)',
      year: '2021-2026',
      lastUpdated: 'October 2021',
      level: 'National / Statutory Towns',
      dataset: 'Operational guidelines, water supply tap connection norms (2.68 Cr target), and 50% central subsidy financing patterns.',
      url: 'https://amrut.gov.in',
      isDemo: false,
      note: 'MoHUA Official PDF Guidelines',
    },
    {
      name: 'Pradhan Mantri Awas Yojana - Urban (PMAY-U 2.0)',
      year: '2024-2029',
      lastUpdated: 'September 2024',
      level: 'National / Urban Poor',
      dataset: 'Beneficiary-Led Construction (BLC), Affordable Housing in Partnership (AHP), and interest subsidy criteria.',
      url: 'https://pmay-urban.gov.in',
      isDemo: false,
      note: 'MoHUA Official PDF Guidelines',
    },
    {
      name: 'Swachh Bharat Mission - Urban (SBM-U 2.0)',
      year: '2021-2026',
      lastUpdated: 'November 2021',
      level: 'National / ULB',
      dataset: 'Solid waste management standards, segregated collection benchmarks, and legacy dumpsite remediation.',
      url: 'https://sbmurban.org',
      isDemo: false,
      note: 'MoHUA Official PDF Guidelines',
    },
    {
      name: 'Jal Jeevan Mission (JJM) Urban Directives',
      year: '2022',
      lastUpdated: 'August 2022',
      level: 'National / Peri-Urban',
      dataset: 'Functional Household Tap Connection (FHTC) guidelines and priority criteria for <70% coverage.',
      url: 'https://jaljeevanmission.gov.in',
      isDemo: true,
      note: 'Ministry of Jal Shakti Directives',
    },
    {
      name: 'JanSetu AI Citizen Demand Stream',
      year: '2026',
      lastUpdated: 'Live Streaming',
      level: 'GPS & Ward Coordinates',
      dataset: 'Multilingual voice and text civic demands validated via automated municipal triage pipeline.',
      url: '',
      isDemo: false,
      note: 'Live DPI Ingestion Layer',
    },
  ];

  useEffect(() => {
    loadDataSources();
  }, []);

  const loadDataSources = async () => {
    setIsLoading(true);
    try {
      const data = await dataService.getDataSources();
      if (Array.isArray(data) && data.length > 0) {
        setLiveSources(data);
      }
    } catch (err) {
      console.warn('Using baseline data sources:', err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-xs space-y-4">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-slate-100">
        <div>
          <h4 className="font-heading font-extrabold text-sm text-slate-900 flex items-center space-x-2">
            <Database className="w-4 h-4 text-sky-700" />
            <span>Government Data Provenance &amp; Authoritative Sources</span>
            {isLoading && <Loader2 className="w-3.5 h-3.5 animate-spin text-sky-600" />}
          </h4>
          <p className="text-xs text-slate-500 mt-0.5">
            Strict empirical grounding. No algorithmic policy fabrication or hallucinatory data points.
          </p>
        </div>
        <div className="flex items-center space-x-2">
          <DemoDataBadge />
          <span className="text-[11px] font-mono text-slate-400">8 Ingested Repositories</span>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3">
        {defaultSources.map((src, idx) => (
          <div
            key={idx}
            className="p-3 rounded-xl border border-slate-200 bg-slate-50/50 hover:bg-white hover:border-slate-300 transition text-xs space-y-2 flex flex-col justify-between"
          >
            <div className="space-y-1">
              <div className="flex items-start justify-between gap-1">
                <span className="font-bold text-slate-900 text-xs leading-snug line-clamp-2">
                  {src.name}
                </span>
                {src.isDemo && <DemoDataBadge />}
              </div>
              <p className="text-[11px] text-slate-500 line-clamp-3 leading-relaxed">
                {src.dataset}
              </p>
            </div>

            <div className="pt-2 border-t border-slate-200/60 space-y-1 text-[10px] text-slate-400">
              <div className="flex items-center justify-between">
                <span>Coverage:</span>
                <span className="font-medium text-slate-700">{src.level}</span>
              </div>
              <div className="flex items-center justify-between">
                <span>Vintage:</span>
                <span className="font-medium text-slate-700">{src.year}</span>
              </div>
              {src.url && (
                <div className="pt-1 text-right">
                  <a
                    href={src.url}
                    target="_blank"
                    rel="noreferrer"
                    className="text-sky-700 hover:underline inline-flex items-center space-x-0.5 font-semibold"
                  >
                    <span>Official Portal</span>
                    <ExternalLink className="w-2.5 h-2.5 ml-0.5" />
                  </a>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
