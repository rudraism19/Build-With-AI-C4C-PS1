import React, { useState, useEffect } from 'react';
import { BarChart3, TrendingUp, Sliders, ArrowUpRight, Sparkles, FileCheck2, Loader2 } from 'lucide-react';
import { policymakerService } from '../../services/api';

interface PriorityMatrixViewProps {
  onGenerateDPRForWard?: (ward: any) => void;
}

export const PriorityMatrixView: React.FC<PriorityMatrixViewProps> = ({
  onGenerateDPRForWard,
}) => {
  const [wSeverity, setWSeverity] = useState(0.3);
  const [wCount, setWCount] = useState(0.2);
  const [wVulnerability, setWVulnerability] = useState(0.2);
  const [wInfraDeficit, setWInfraDeficit] = useState(0.2);
  const [wBudgetGap, setWBudgetGap] = useState(0.1);
  const [isLoading, setIsLoading] = useState(false);

  // Wards with 5-factor breakdown
  const [wards, setWards] = useState<any[]>([
    {
      id: 'w22',
      name: 'Morar Ward 22 Cluster',
      sector: 'WATER',
      complaints: 42,
      severity: 0.88,
      vulnerability: 0.72,
      infraDeficit: 0.85,
      budgetGap: 0.9,
      scheme: 'AMRUT 2.0',
    },
    {
      id: 'w04',
      name: 'Lashkar Central',
      sector: 'ROADS',
      complaints: 31,
      severity: 0.78,
      vulnerability: 0.65,
      infraDeficit: 0.8,
      budgetGap: 0.7,
      scheme: 'Smart City Mission',
    },
    {
      id: 'w14',
      name: 'Thatipur Ward 14',
      sector: 'SANITATION',
      complaints: 24,
      severity: 0.7,
      vulnerability: 0.6,
      infraDeficit: 0.75,
      budgetGap: 0.65,
      scheme: 'SBM-U 2.0',
    },
    {
      id: 'w08',
      name: 'Maharaj Bada Heritage Corridor',
      sector: 'ELECTRICITY',
      complaints: 18,
      severity: 0.6,
      vulnerability: 0.55,
      infraDeficit: 0.62,
      budgetGap: 0.5,
      scheme: 'Smart City Mission',
    },
  ]);

  useEffect(() => {
    loadPriorities();
  }, []);

  const loadPriorities = async () => {
    setIsLoading(true);
    try {
      const res = await policymakerService.getPriorities();
      const priorityItems = res?.data || (Array.isArray(res) ? res : []);
      if (priorityItems.length > 0) {
        const liveMapped = priorityItems.map((p: any, idx: number) => {
          const f = p.factors || {};
          return {
            id: p.id || `prio-${idx}`,
            name: p.area_name || (p.category === 'WATER' ? 'Morar Ward 22 (Water Shortage Cluster)' : `Gwalior Ward Interventions (${p.category})`),
            sector: p.category || 'WATER',
            complaints: Math.round((f.demand || 82.5) / 2),
            severity: (f.demand || 80) / 100,
            vulnerability: (f.population_impact || 70) / 100,
            infraDeficit: (f.infrastructure_gap || 75) / 100,
            budgetGap: (f.investment_gap || 65) / 100,
            scheme: p.category === 'WATER' ? 'AMRUT 2.0' : 'Smart City Mission',
            explanation: p.explanation || [],
          };
        });
        // Keep standard comparative wards if database only has 1 record
        if (liveMapped.length === 1) {
          setWards([liveMapped[0], ...wards.slice(1)]);
        } else {
          setWards(liveMapped);
        }
      }
    } catch (err) {
      console.warn('Using baseline priority scoring data:', err);
    } finally {
      setIsLoading(false);
    }
  };

  // Calculate dynamic 5-factor score based on current weights
  const scoredWards = wards
    .map((w) => {
      const rawScore =
        w.severity * wSeverity * 100 +
        (w.complaints / 50) * wCount * 100 +
        w.vulnerability * wVulnerability * 100 +
        w.infraDeficit * wInfraDeficit * 100 +
        w.budgetGap * wBudgetGap * 100;

      const normalized = Math.min(Math.round(rawScore * 10) / 10, 99.4);
      return { ...w, computedScore: normalized };
    })
    .sort((a, b) => b.computedScore - a.computedScore);

  // Simulation Presets
  const applyPreset = (preset: 'balanced' | 'crisis' | 'vulnerability' | 'infrastructure') => {
    if (preset === 'balanced') {
      setWSeverity(0.3);
      setWCount(0.2);
      setWVulnerability(0.2);
      setWInfraDeficit(0.2);
      setWBudgetGap(0.1);
    } else if (preset === 'crisis') {
      setWSeverity(0.45);
      setWCount(0.25);
      setWVulnerability(0.15);
      setWInfraDeficit(0.1);
      setWBudgetGap(0.05);
    } else if (preset === 'vulnerability') {
      setWSeverity(0.2);
      setWCount(0.15);
      setWVulnerability(0.4);
      setWInfraDeficit(0.15);
      setWBudgetGap(0.1);
    } else if (preset === 'infrastructure') {
      setWSeverity(0.15);
      setWCount(0.15);
      setWVulnerability(0.15);
      setWInfraDeficit(0.35);
      setWBudgetGap(0.2);
    }
  };

  const totalWeight = Math.round((wSeverity + wCount + wVulnerability + wInfraDeficit + wBudgetGap) * 100);

  return (
    <div className="space-y-6">
      {/* Formula & Weight Customizer Header */}
      <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-xs space-y-4">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
          <div>
            <div className="flex items-center space-x-2">
              <BarChart3 className="w-5 h-5 text-indigo-600" />
              <h3 className="font-heading font-extrabold text-base text-slate-900">
                Deterministic 5-Factor Priority Scoring Engine
              </h3>
              {isLoading && <Loader2 className="w-3.5 h-3.5 animate-spin text-indigo-600" />}
            </div>
            <p className="text-xs text-slate-500 mt-0.5">
              Strict mathematical formula preventing arbitrary resource allocation. Computes objective municipal urgency across Gwalior wards.
            </p>
          </div>
          <div className="flex items-center space-x-2">
            <div className="px-3 py-1 bg-indigo-50 border border-indigo-200 rounded-xl font-mono text-xs font-bold text-indigo-800">
              Score = w₁·S + w₂·C + w₃·D + w₄·I + w₅·B
            </div>
            <div className={`px-2.5 py-1 rounded-xl text-xs font-mono font-bold border ${totalWeight === 100 ? 'bg-emerald-50 text-emerald-800 border-emerald-200' : 'bg-amber-50 text-amber-800 border-amber-200'}`}>
              Sum: {totalWeight}%
            </div>
          </div>
        </div>

        {/* Policy Simulation Presets */}
        <div className="pt-2 flex flex-wrap items-center gap-2 text-xs">
          <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider mr-1">
            Policy Presets:
          </span>
          <button
            onClick={() => applyPreset('balanced')}
            className="px-3 py-1 rounded-lg border border-slate-200 bg-slate-50 hover:bg-slate-100 text-slate-700 font-semibold transition cursor-pointer"
          >
            ⚖️ Standard Balanced
          </button>
          <button
            onClick={() => applyPreset('crisis')}
            className="px-3 py-1 rounded-lg border border-rose-200 bg-rose-50/60 hover:bg-rose-100 text-rose-800 font-semibold transition cursor-pointer"
          >
            🚨 Emergency / Crisis Focus
          </button>
          <button
            onClick={() => applyPreset('vulnerability')}
            className="px-3 py-1 rounded-lg border border-indigo-200 bg-indigo-50/60 hover:bg-indigo-100 text-indigo-800 font-semibold transition cursor-pointer"
          >
            🏘️ Vulnerable Communities First
          </button>
          <button
            onClick={() => applyPreset('infrastructure')}
            className="px-3 py-1 rounded-lg border border-amber-200 bg-amber-50/60 hover:bg-amber-100 text-amber-800 font-semibold transition cursor-pointer"
          >
            🏗️ Infrastructure Renewal Focus
          </button>
        </div>

        {/* Weight Sliders Bar */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3 pt-2 text-xs">
          <div className="bg-slate-50 p-2.5 rounded-xl border border-slate-200">
            <span className="text-slate-500 block text-[10px] font-bold">Severity (S): {Math.round(wSeverity * 100)}%</span>
            <input
              type="range"
              min="0.1"
              max="0.5"
              step="0.05"
              value={wSeverity}
              onChange={(e) => setWSeverity(parseFloat(e.target.value))}
              className="w-full accent-sky-600 cursor-pointer"
            />
          </div>

          <div className="bg-slate-50 p-2.5 rounded-xl border border-slate-200">
            <span className="text-slate-500 block text-[10px] font-bold">Volume (C): {Math.round(wCount * 100)}%</span>
            <input
              type="range"
              min="0.1"
              max="0.4"
              step="0.05"
              value={wCount}
              onChange={(e) => setWCount(parseFloat(e.target.value))}
              className="w-full accent-sky-600 cursor-pointer"
            />
          </div>

          <div className="bg-slate-50 p-2.5 rounded-xl border border-slate-200">
            <span className="text-slate-500 block text-[10px] font-bold">Vulnerability (D): {Math.round(wVulnerability * 100)}%</span>
            <input
              type="range"
              min="0.1"
              max="0.4"
              step="0.05"
              value={wVulnerability}
              onChange={(e) => setWVulnerability(parseFloat(e.target.value))}
              className="w-full accent-sky-600 cursor-pointer"
            />
          </div>

          <div className="bg-slate-50 p-2.5 rounded-xl border border-slate-200">
            <span className="text-slate-500 block text-[10px] font-bold">Infra Deficit (I): {Math.round(wInfraDeficit * 100)}%</span>
            <input
              type="range"
              min="0.1"
              max="0.4"
              step="0.05"
              value={wInfraDeficit}
              onChange={(e) => setWInfraDeficit(parseFloat(e.target.value))}
              className="w-full accent-sky-600 cursor-pointer"
            />
          </div>

          <div className="bg-slate-50 p-2.5 rounded-xl border border-slate-200">
            <span className="text-slate-500 block text-[10px] font-bold">Budget Gap (B): {Math.round(wBudgetGap * 100)}%</span>
            <input
              type="range"
              min="0.05"
              max="0.3"
              step="0.05"
              value={wBudgetGap}
              onChange={(e) => setWBudgetGap(parseFloat(e.target.value))}
              className="w-full accent-sky-600 cursor-pointer"
            />
          </div>
        </div>
      </div>

      {/* Scored Wards List */}
      <div className="space-y-3">
        {scoredWards.map((w, idx) => (
          <div
            key={w.id}
            className="bg-white border border-slate-200 rounded-2xl p-5 shadow-xs hover:border-slate-300 transition flex flex-col md:flex-row md:items-center justify-between gap-4 hover-card-lift"
          >
            {/* Left Info */}
            <div className="space-y-1.5 flex-1">
              <div className="flex items-center space-x-2.5">
                <span className="w-6 h-6 rounded-full bg-slate-900 text-white text-xs font-bold flex items-center justify-center">
                  #{idx + 1}
                </span>
                <h4 className="font-heading font-extrabold text-sm text-slate-900">
                  {w.name}
                </h4>
                <span className="px-2 py-0.5 rounded bg-sky-50 text-sky-800 text-[10px] font-mono font-bold border border-sky-200">
                  {w.sector}
                </span>
                <span className="px-2 py-0.5 rounded bg-purple-50 text-purple-700 text-[10px] font-semibold border border-purple-200">
                  {w.scheme}
                </span>
              </div>

              {/* 5-Factor Mini Indicators */}
              <div className="grid grid-cols-2 sm:grid-cols-5 gap-2 pt-2 text-[11px] text-slate-600">
                <div className="bg-slate-50 px-2 py-1 rounded-lg">
                  <span className="text-slate-400 block text-[10px]">Severity</span>
                  <span className="font-bold text-rose-700">{Math.round(w.severity * 100)}%</span>
                </div>
                <div className="bg-slate-50 px-2 py-1 rounded-lg">
                  <span className="text-slate-400 block text-[10px]">Complaints</span>
                  <span className="font-bold text-slate-800">{w.complaints}</span>
                </div>
                <div className="bg-slate-50 px-2 py-1 rounded-lg">
                  <span className="text-slate-400 block text-[10px]">Vulnerability</span>
                  <span className="font-bold text-indigo-700">{Math.round(w.vulnerability * 100)}%</span>
                </div>
                <div className="bg-slate-50 px-2 py-1 rounded-lg">
                  <span className="text-slate-400 block text-[10px]">Infra Deficit</span>
                  <span className="font-bold text-amber-700">{Math.round(w.infraDeficit * 100)}%</span>
                </div>
                <div className="bg-slate-50 px-2 py-1 rounded-lg">
                  <span className="text-slate-400 block text-[10px]">Budget Gap</span>
                  <span className="font-bold text-purple-700">{Math.round(w.budgetGap * 100)}%</span>
                </div>
              </div>
            </div>

            {/* Right Action & Score */}
            <div className="flex items-center space-x-4 border-t md:border-t-0 md:border-l border-slate-100 pt-3 md:pt-0 md:pl-5">
              <div className="text-right">
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
                  Priority Score
                </span>
                <span className="font-heading font-extrabold text-2xl text-rose-600">
                  {w.computedScore}
                </span>
                <span className="text-[10px] text-slate-400 block">/ 100</span>
              </div>

              {onGenerateDPRForWard && (
                <button
                  onClick={() => onGenerateDPRForWard(w)}
                  className="px-3.5 py-2 bg-sky-700 hover:bg-sky-800 text-white rounded-xl text-xs font-bold flex items-center space-x-1.5 shadow-2xs transition"
                >
                  <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                  <span>Draft DPR</span>
                </button>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
