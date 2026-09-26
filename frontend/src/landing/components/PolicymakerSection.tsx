import React, { useState } from 'react';
import { useLanguage } from '../context/LanguageContext';
import { POLICYMAKER_DOSSIERS } from '../data/dossiers';
import { DemandCategory } from '../types';
import { Check, ChevronRight, ChevronDown, Zap, FileText, ArrowRight, ShieldAlert, BarChart3, Database } from 'lucide-react';
import { TextReveal, ScrollReveal } from './common/ScrollReveal';

interface PolicymakerSectionProps {
  onOpenWhitepaper?: () => void;
  onOpenRequestModal?: () => void;
}

export const PolicymakerSection: React.FC<PolicymakerSectionProps> = ({ onOpenWhitepaper, onOpenRequestModal }) => {
  const { t } = useLanguage();
  const [selectedCategory, setSelectedCategory] = useState<DemandCategory>('water');
  const [isExpanded, setIsExpanded] = useState<boolean>(false);
  const [activeTab, setActiveTab] = useState<'capex' | 'audit'>('capex');

  const dossier = POLICYMAKER_DOSSIERS[selectedCategory] || POLICYMAKER_DOSSIERS.water;

  const categoryButtons: { key: DemandCategory; label: string }[] = [
    { key: 'water', label: 'Water' },
    { key: 'roads', label: 'Roads' },
    { key: 'healthcare', label: 'Healthcare' },
    { key: 'education', label: 'Education' },
    { key: 'transport', label: 'Transport' },
    { key: 'digital', label: 'Connectivity' },
  ];

  return (
    <section id="policymakers" className="py-24 bg-white relative border-b border-slate-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          {/* Left: Policymaker Rationale (5 cols) */}
          <div className="lg:col-span-5 space-y-6">
            <ScrollReveal direction="up" delay={0}>
              <span className="text-xs font-bold uppercase tracking-wider text-blue-700 bg-blue-50 px-3 py-1 rounded-full border border-blue-100">
                {t.decisionEyebrow}
              </span>
            </ScrollReveal>

            <TextReveal
              text={t.decisionHeading}
              as="h2"
              className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight leading-tight"
              delay={60}
              wordStagger={30}
            />

            <ScrollReveal direction="up" delay={180}>
              <p className="text-slate-600 leading-relaxed">{t.decisionDesc}</p>
            </ScrollReveal>

            <div className="space-y-3.5 pt-2">
              <ScrollReveal direction="up" delay={240}>
                <div className="flex items-start gap-3">
                  <div className="w-6 h-6 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center text-xs font-bold mt-0.5 shrink-0">
                    <Check className="w-3.5 h-3.5" />
                  </div>
                  <div>
                    <p className="text-sm font-bold text-slate-900">{t.decisionBullet1Title}</p>
                    <p className="text-xs text-slate-500">{t.decisionBullet1Desc}</p>
                  </div>
                </div>
              </ScrollReveal>

              <ScrollReveal direction="up" delay={320}>
                <div className="flex items-start gap-3">
                  <div className="w-6 h-6 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center text-xs font-bold mt-0.5 shrink-0">
                    <Check className="w-3.5 h-3.5" />
                  </div>
                  <div>
                    <p className="text-sm font-bold text-slate-900">{t.decisionBullet2Title}</p>
                    <p className="text-xs text-slate-500">{t.decisionBullet2Desc}</p>
                  </div>
                </div>
              </ScrollReveal>

              <ScrollReveal direction="up" delay={400}>
                <div className="flex items-start gap-3">
                  <div className="w-6 h-6 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center text-xs font-bold mt-0.5 shrink-0">
                    <Check className="w-3.5 h-3.5" />
                  </div>
                  <div>
                    <p className="text-sm font-bold text-slate-900">{t.decisionBullet3Title}</p>
                    <p className="text-xs text-slate-500">{t.decisionBullet3Desc}</p>
                  </div>
                </div>
              </ScrollReveal>
            </div>

            <ScrollReveal direction="up" delay={460}>
              <div className="pt-2">
                <button
                  type="button"
                  onClick={onOpenRequestModal}
                  className="inline-flex items-center gap-2 text-sm font-bold text-blue-600 hover:text-blue-800 transition-colors cursor-pointer"
                >
                  <span>{t.governanceWhitepaper}</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </ScrollReveal>
          </div>

          {/* Right: Real Decision Support Dashboard Card (7 cols) */}
          <div className="lg:col-span-7">
            <ScrollReveal direction="up" delay={150} distance={28}>
              <div className="bg-gradient-to-b from-white to-slate-50 rounded-3xl border border-slate-200/90 shadow-2xl p-6 sm:p-8 relative">
              {/* Category Filter Pills on Top of Dashboard */}
              <div className="flex items-center justify-between gap-2 mb-6 pb-4 border-b border-slate-100 overflow-x-auto">
                <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider shrink-0">
                  Select Sector Dossier:
                </span>
                <div className="flex items-center gap-1.5 shrink-0">
                  {categoryButtons.map((btn) => (
                    <button
                      key={btn.key}
                      type="button"
                      onClick={() => setSelectedCategory(btn.key)}
                      className={`px-2.5 py-1 text-xs font-semibold rounded-lg transition-all focus:outline-none focus:ring-2 focus:ring-blue-500 cursor-pointer ${
                        selectedCategory === btn.key
                          ? 'bg-blue-600 text-white shadow-xs'
                          : 'bg-white border border-slate-200 text-slate-700 hover:border-blue-400'
                      }`}
                    >
                      {btn.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Dashboard Top Chrome */}
              <div className="flex flex-wrap items-center justify-between pb-6 border-b border-slate-200/80 gap-3">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-blue-600 text-white flex items-center justify-center font-bold text-sm shadow-sm shrink-0">
                    DPD
                  </div>
                  <div>
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="text-sm font-bold text-slate-900">{dossier.title}</span>
                      <span
                        className={`px-2 py-0.5 rounded text-[10px] font-bold border ${
                          dossier.status === 'Fast-Track Approved'
                            ? 'bg-emerald-100 text-emerald-800 border-emerald-200'
                            : 'bg-amber-100 text-amber-800 border-amber-200'
                        }`}
                      >
                        {dossier.status}
                      </span>
                    </div>
                    <span className="text-xs text-slate-500 font-medium">{dossier.location}</span>
                  </div>
                </div>

                {/* ID badge */}
                <span className="text-xs font-mono bg-slate-100 text-slate-600 px-2.5 py-1 rounded-md">
                  ID: {dossier.code}
                </span>
              </div>

              {/* The 6 Metrics Grid */}
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 my-6">
                {/* Metric 1: Demand Hotspot */}
                <div className="p-4 rounded-xl bg-white border border-slate-200/80 shadow-2xs hover:border-slate-300 transition-colors">
                  <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 block mb-1">
                    Demand Hotspot
                  </span>
                  <div className="flex items-center gap-2">
                    <span
                      className={`w-2.5 h-2.5 rounded-full ${
                        dossier.demandLevel === 'Critical' ? 'bg-red-600 animate-pulse' : 'bg-orange-500'
                      }`}
                    />
                    <span className="text-lg font-extrabold text-slate-900">{dossier.demandLevel}</span>
                  </div>
                  <span className="text-[10px] text-red-600 font-semibold mt-1 block">
                    {dossier.percentileRank}
                  </span>
                </div>

                {/* Metric 2: Category */}
                <div className="p-4 rounded-xl bg-white border border-slate-200/80 shadow-2xs hover:border-slate-300 transition-colors">
                  <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 block mb-1">
                    Category
                  </span>
                  <span className="text-base font-extrabold text-slate-900 block leading-tight">
                    {dossier.categoryLabel}
                  </span>
                  <span className="text-[10px] text-blue-600 font-medium mt-1 block">Public Utility</span>
                </div>

                {/* Metric 3: Citizen Requests */}
                <div className="p-4 rounded-xl bg-white border border-slate-200/80 shadow-2xs hover:border-slate-300 transition-colors">
                  <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 block mb-1">
                    Citizen Requests
                  </span>
                  <span className="text-xl font-extrabold text-slate-900 block tabular-nums">
                    {dossier.citizenRequests.toLocaleString()}
                  </span>
                  <span className="text-[10px] text-emerald-600 font-medium mt-1 block">
                    {dossier.growthRate}
                  </span>
                </div>

                {/* Metric 4: Affected Population */}
                <div className="p-4 rounded-xl bg-white border border-slate-200/80 shadow-2xs hover:border-slate-300 transition-colors">
                  <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 block mb-1">
                    Affected Population
                  </span>
                  <span className="text-xl font-extrabold text-slate-900 block tabular-nums">
                    {dossier.affectedPopulation.toLocaleString()}
                  </span>
                  <span className="text-[10px] text-slate-500 font-medium mt-1 block">
                    {dossier.panchayatCount} Gram Panchayats
                  </span>
                </div>

                {/* Metric 5: Infrastructure Index */}
                <div className="p-4 rounded-xl bg-white border border-slate-200/80 shadow-2xs hover:border-slate-300 transition-colors">
                  <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 block mb-1">
                    Infrastructure Index
                  </span>
                  <div className="flex items-center gap-1.5">
                    <span className="text-lg font-extrabold text-amber-700">
                      {dossier.infrastructureIndex.score < 0.3 ? 'Low' : 'Moderate'}
                    </span>
                    <span className="text-xs text-amber-600 tabular-nums">
                      ({dossier.infrastructureIndex.score} / {dossier.infrastructureIndex.maxScore})
                    </span>
                  </div>
                  <span className="text-[10px] text-slate-500 font-medium mt-1 block">
                    {dossier.infrastructureIndex.label}
                  </span>
                </div>

                {/* Metric 6: Existing Investment */}
                <div className="p-4 rounded-xl bg-white border border-slate-200/80 shadow-2xs hover:border-slate-300 transition-colors">
                  <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 block mb-1">
                    Existing Investment
                  </span>
                  <span className="text-xl font-extrabold text-slate-900 block">{dossier.sanctionedBudget}</span>
                  <span className="text-[10px] text-slate-500 font-medium mt-1 block">Budget Sanctioned</span>
                </div>
              </div>

              {/* Expand Details Interaction Button */}
              <div className="mb-4">
                <button
                  type="button"
                  onClick={() => setIsExpanded(!isExpanded)}
                  className="w-full py-2 px-3 text-xs font-bold text-slate-600 hover:text-blue-700 bg-slate-100/70 hover:bg-slate-100 rounded-xl flex items-center justify-between transition-colors cursor-pointer"
                >
                  <span className="flex items-center gap-1.5">
                    <FileText className="w-3.5 h-3.5 text-blue-600" />
                    {isExpanded ? 'Hide CapEx & Audit Breakdown' : 'Expand CapEx Breakdown & Audit Trail'}
                  </span>
                  <ChevronDown className={`w-4 h-4 transition-transform ${isExpanded ? 'rotate-180' : ''}`} />
                </button>

                {/* Expandable Panel */}
                {isExpanded && (
                  <div className="mt-3 p-4 bg-slate-50 rounded-xl border border-slate-200 space-y-4 animate-in fade-in duration-200">
                    <div className="flex items-center gap-2 border-b border-slate-200 pb-2">
                      <button
                        type="button"
                        onClick={() => setActiveTab('capex')}
                        className={`text-xs font-bold px-2.5 py-1 rounded-md transition-colors ${
                          activeTab === 'capex'
                            ? 'bg-blue-600 text-white'
                            : 'bg-white text-slate-600 hover:text-slate-900'
                        }`}
                      >
                        CapEx Allocations
                      </button>
                      <button
                        type="button"
                        onClick={() => setActiveTab('audit')}
                        className={`text-xs font-bold px-2.5 py-1 rounded-md transition-colors ${
                          activeTab === 'audit'
                            ? 'bg-blue-600 text-white'
                            : 'bg-white text-slate-600 hover:text-slate-900'
                        }`}
                      >
                        Tamper-Proof Audit Trail
                      </button>
                    </div>

                    {activeTab === 'capex' ? (
                      <div className="space-y-2">
                        {dossier.capexBreakdown.map((item, i) => (
                          <div
                            key={i}
                            className="flex items-center justify-between text-xs bg-white p-2.5 rounded-lg border border-slate-200"
                          >
                            <div>
                              <p className="font-semibold text-slate-800">{item.item}</p>
                              <span className="text-[10px] text-blue-600 font-medium">Scheme: {item.scheme}</span>
                            </div>
                            <span className="font-bold text-slate-900">{item.amount}</span>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="space-y-2">
                        {dossier.auditTrail.map((log, i) => (
                          <div
                            key={i}
                            className="flex items-start justify-between text-xs bg-white p-2.5 rounded-lg border border-slate-200 gap-2"
                          >
                            <div>
                              <p className="font-medium text-slate-800">{log.event}</p>
                              <span className="text-[10px] text-emerald-600 font-semibold">
                                Signer: {log.verifiedBy}
                              </span>
                            </div>
                            <span className="text-[10px] text-slate-400 whitespace-nowrap">{log.timestamp}</span>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                )}
              </div>

              {/* AI Priority Callout Box & CTA */}
              <div className="p-5 rounded-2xl bg-blue-900 text-white flex flex-col sm:flex-row sm:items-center justify-between gap-4 shadow-lg shadow-blue-950/20">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-xl bg-blue-800 border border-blue-700 flex items-center justify-center text-2xl shrink-0">
                    <Zap className="w-6 h-6 text-amber-300" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-xs uppercase tracking-wider text-blue-200 font-semibold">
                        AI Recommendation Priority
                      </span>
                      <span
                        className={`px-2 py-0.5 rounded text-[10px] font-extrabold ${
                          dossier.aiPriority === 'CRITICAL'
                            ? 'bg-red-500 text-white'
                            : 'bg-amber-400 text-amber-950'
                        }`}
                      >
                        {dossier.aiPriority}
                      </span>
                    </div>
                    <p className="text-sm font-bold text-white mt-0.5">{dossier.recommendationNote}</p>
                  </div>
                </div>

                {/* Required CTA */}
                <button
                  type="button"
                  onClick={onOpenRequestModal}
                  className="inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl bg-white hover:bg-slate-100 text-blue-900 text-sm font-bold transition-all whitespace-nowrap shadow-sm hover:shadow cursor-pointer focus:outline-none focus:ring-2 focus:ring-blue-400"
                >
                  <span>{t.exploreIntelligence}</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>

              {/* Data Integrity Footnote */}
              <p className="mt-4 text-center text-[11px] text-slate-400 font-medium">
                Data cross-verified against State Public Works Registry &amp; National Geo-Spatial Repository
              </p>
            </div>
          </ScrollReveal>
        </div>
        </div>
      </div>
    </section>
  );
};
