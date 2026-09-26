import React, { useState } from 'react';
import {
  AlertTriangle,
  ArrowRight,
  Sparkles,
  CheckCircle2,
  FileCheck2,
  Layers,
  BookOpen,
  Info,
  HelpCircle,
  ExternalLink,
} from 'lucide-react';
import { EvidenceBadge, EvidencePanel, DemoDataBadge, PriorityFactorBreakdown } from '../common/CivicUi';

interface TopDevelopmentSignalProps {
  onViewHotspot: () => void;
  onRunPolicyMatch: () => void;
  onGenerateIntervention: () => void;
  signalData?: any;
}

export const TopDevelopmentSignal: React.FC<TopDevelopmentSignalProps> = ({
  onViewHotspot,
  onRunPolicyMatch,
  onGenerateIntervention,
  signalData,
}) => {
  const [isEvidenceModalOpen, setIsEvidenceModalOpen] = useState(false);
  const [isMethodologyModalOpen, setIsMethodologyModalOpen] = useState(false);

  const defaultSignal = {
    sector: 'WATER SUPPLY',
    location: 'Morar — Ward 22',
    priorityScore: 86,
    factors: {
      demand: 92,
      infraGap: 81,
      populationImpact: 88,
      developmentDeficit: 79,
      investmentGap: 83,
    },
    evidence: [
      '127 validated citizen demands (contamination & low pressure)',
      'Infrastructure coverage: Only 61% functional household piped tap coverage',
      'Population impact: ~28,500 residents in Morar Ward 22 affected',
      'Existing project data: 2 projects in buffer, 0 pipeline renewals',
      'Census / GIS source: Census 2011 demographic baseline & PHED registry',
    ],
    sources: [
      {
        source: 'JanSetu Citizen Demand Pipeline',
        dataset: '127 verified complaints geo-tagged in Morar Ward 22',
        dataYear: '2026 Live',
        lastUpdated: 'Today',
        sourceUrl: '',
        geographicLevel: 'Ward 22 Geographic Cluster',
      },
      {
        source: 'PHED Water Asset Registry',
        dataset: 'Gwalior Distribution Pipeline Inventory (corroded 1988 cast iron line)',
        dataYear: '2023',
        lastUpdated: 'Jan 2024',
        sourceUrl: 'https://gwaliorgis.mp.gov.in',
        geographicLevel: 'Ward Level',
      },
      {
        source: 'Census of India (GoI)',
        dataset: 'Ward 22 Morar Population & Vulnerability Index (Census 2011 Historical Baseline)',
        dataYear: '2011',
        lastUpdated: 'Census 2011 Baseline',
        sourceUrl: 'https://censusindia.gov.in',
        geographicLevel: 'Ward 22',
      },
      {
        source: 'AMRUT 2.0 Operational Guidelines',
        dataset: 'Ministry of Housing and Urban Affairs (MoHUA) Guidelines PDF',
        dataYear: '2021-2026',
        lastUpdated: 'Oct 2021',
        sourceUrl: 'https://amrut.gov.in',
        geographicLevel: 'National / Statutory Towns',
      },
    ],
  };

  const signal = signalData || defaultSignal;

  return (
    <>
      <div className="bg-white border border-slate-200 rounded-2xl p-4 sm:p-5 shadow-xs flex flex-col justify-between space-y-4 hover:border-slate-300 transition">
        {/* Header Strip */}
        <div className="flex items-center justify-between pb-2.5 border-b border-slate-100">
          <div className="flex items-center space-x-2">
            <span className="w-2 h-2 rounded-full bg-rose-600 animate-pulse" />
            <h4 className="font-heading font-extrabold text-xs text-slate-900 uppercase tracking-wider">
              Top Development Signal
            </h4>
          </div>

          <div className="flex items-center space-x-1.5">
            <EvidenceBadge onClick={() => setIsEvidenceModalOpen(true)} />
            <DemoDataBadge />
          </div>
        </div>

        {/* Sector & Location */}
        <div className="flex items-baseline justify-between gap-2">
          <div>
            <span className="text-[10px] font-bold text-sky-800 uppercase tracking-wider bg-sky-50 px-2 py-0.5 rounded border border-sky-200 font-mono">
              {signal.sector}
            </span>
            <h3 className="font-heading font-extrabold text-base text-slate-900 mt-1">
              {signal.location}
            </h3>
          </div>

          {/* Priority Score Box */}
          <div className="text-right shrink-0">
            <div className="flex items-center justify-end space-x-1 text-[10px] font-bold text-slate-400 uppercase tracking-wider">
              <span>Priority Score</span>
              <button
                type="button"
                onClick={() => setIsMethodologyModalOpen(true)}
                className="text-sky-600 hover:text-sky-800 cursor-pointer"
                title="View 5-Factor Scoring Methodology"
              >
                <HelpCircle className="w-3 h-3" />
              </button>
            </div>
            <div className="inline-flex items-baseline space-x-1">
              <span className="text-3xl font-heading font-black font-mono text-rose-600 tracking-tight">
                {Math.round(signal.priorityScore)}
              </span>
              <span className="text-slate-400 font-bold text-xs font-mono">/ 100</span>
            </div>
          </div>
        </div>

        {/* 5-Factor Score Horizontal Breakdown */}
        <div className="bg-slate-50/70 border border-slate-200/80 rounded-xl p-3 space-y-1.5">
          <div className="flex items-center justify-between text-[11px] font-bold text-slate-700 pb-1 border-b border-slate-200/60">
            <span>5-Factor Contribution</span>
            <button
              onClick={() => setIsMethodologyModalOpen(true)}
              className="text-[10px] text-sky-700 hover:underline font-semibold cursor-pointer"
            >
              View Methodology →
            </button>
          </div>
          <PriorityFactorBreakdown factors={signal.factors} />
        </div>

        {/* Evidence Checklist */}
        <div className="space-y-1.5 text-xs">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold text-slate-800 uppercase tracking-wider">
              Evidence Grounding:
            </span>
            <button
              onClick={() => setIsEvidenceModalOpen(true)}
              className="text-[10px] text-sky-700 hover:underline font-semibold cursor-pointer"
            >
              Inspect Sources ({signal.sources?.length || 4})
            </button>
          </div>

          <ul className="space-y-1 text-[11px] text-slate-600">
            {signal.evidence.map((item: string, idx: number) => (
              <li key={idx} className="flex items-start space-x-1.5">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0 mt-0.5" />
                <span className="leading-tight">{item}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* Action Buttons */}
        <div className="pt-2 border-t border-slate-100 grid grid-cols-1 sm:grid-cols-3 gap-2">
          <button
            onClick={onViewHotspot}
            className="py-2 px-2.5 bg-white hover:bg-slate-50 text-slate-800 border border-slate-300 rounded-xl text-[11px] font-bold flex items-center justify-center space-x-1 transition shadow-2xs cursor-pointer"
          >
            <Layers className="w-3 h-3 text-sky-600" />
            <span>View Hotspot</span>
          </button>

          <button
            onClick={onRunPolicyMatch}
            className="py-2 px-2.5 bg-white hover:bg-slate-50 text-slate-800 border border-slate-300 rounded-xl text-[11px] font-bold flex items-center justify-center space-x-1 transition shadow-2xs cursor-pointer"
          >
            <BookOpen className="w-3 h-3 text-indigo-600" />
            <span>Policy Match</span>
          </button>

          <button
            onClick={onGenerateIntervention}
            className="py-2 px-2.5 bg-sky-700 hover:bg-sky-800 text-white rounded-xl text-[11px] font-bold flex items-center justify-center space-x-1 transition shadow-2xs cursor-pointer"
          >
            <Sparkles className="w-3 h-3 text-amber-300" />
            <span>Generate DPR</span>
          </button>
        </div>
      </div>

      {/* Evidence Sources Panel Modal */}
      <EvidencePanel
        isOpen={isEvidenceModalOpen}
        onClose={() => setIsEvidenceModalOpen(false)}
        title={`${signal.location} • ${signal.sector}`}
        sources={signal.sources}
      />

      {/* Methodology Modal */}
      {isMethodologyModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-xs animate-fadeIn">
          <div className="bg-white rounded-2xl border border-slate-200 shadow-2xl max-w-lg w-full p-6 space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-200">
              <div className="flex items-center space-x-2">
                <HelpCircle className="w-5 h-5 text-indigo-600" />
                <h4 className="font-heading font-extrabold text-sm text-slate-900">
                  Evidence-Based Priority Score Methodology
                </h4>
              </div>
              <button
                onClick={() => setIsMethodologyModalOpen(false)}
                className="p-1 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100"
              >
                ✕
              </button>
            </div>

            <p className="text-xs text-slate-600 leading-relaxed">
              The Evidence-Based Priority Score provides objective decision-support ranking for municipal wards using a deterministic mathematical weighting formula:
            </p>

            <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl font-mono text-xs font-bold text-center text-slate-800">
              Score = 0.30·Demand + 0.25·InfraGap + 0.20·PopImpact + 0.15·Deficit + 0.10·InvestmentGap
            </div>

            <div className="space-y-2 text-xs">
              <div className="flex items-center justify-between p-2 rounded-lg bg-slate-50 border border-slate-200">
                <span className="font-semibold text-slate-800">1. Citizen Demand Volume &amp; Severity</span>
                <span className="font-mono font-bold text-sky-700">30% Weight</span>
              </div>
              <div className="flex items-center justify-between p-2 rounded-lg bg-slate-50 border border-slate-200">
                <span className="font-semibold text-slate-800">2. Physical Infrastructure Deficit</span>
                <span className="font-mono font-bold text-rose-700">25% Weight</span>
              </div>
              <div className="flex items-center justify-between p-2 rounded-lg bg-slate-50 border border-slate-200">
                <span className="font-semibold text-slate-800">3. Population &amp; Demographic Vulnerability</span>
                <span className="font-mono font-bold text-indigo-700">20% Weight</span>
              </div>
              <div className="flex items-center justify-between p-2 rounded-lg bg-slate-50 border border-slate-200">
                <span className="font-semibold text-slate-800">4. Historical Municipal Deficit</span>
                <span className="font-mono font-bold text-amber-700">15% Weight</span>
              </div>
              <div className="flex items-center justify-between p-2 rounded-lg bg-slate-50 border border-slate-200">
                <span className="font-semibold text-slate-800">5. Capital Investment Gap (Smart City Buffer)</span>
                <span className="font-mono font-bold text-purple-700">10% Weight</span>
              </div>
            </div>

            <div className="pt-2 border-t border-slate-100 flex justify-end">
              <button
                onClick={() => setIsMethodologyModalOpen(false)}
                className="px-4 py-1.5 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-xs font-semibold"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};
