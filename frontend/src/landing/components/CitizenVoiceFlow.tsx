import React, { useState } from 'react';
import { useLanguage } from '../context/LanguageContext';
import { CITIZEN_VOICE_SAMPLES } from '../data/voiceSamples';
import { VoiceSample } from '../types';
import { ArrowRight, Sparkles, CheckCircle2, Mic, MessageSquare, RefreshCw } from 'lucide-react';
import { TextReveal, ScrollReveal } from './common/ScrollReveal';

export const CitizenVoiceFlow: React.FC = () => {
  const { t } = useLanguage();
  const [selectedVoice, setSelectedVoice] = useState<VoiceSample>(CITIZEN_VOICE_SAMPLES[0]);
  const [isProcessing, setIsProcessing] = useState<boolean>(false);
  const [processedSample, setProcessedSample] = useState<VoiceSample>(CITIZEN_VOICE_SAMPLES[0]);
  const [activeTab, setActiveTab] = useState<'all' | 'water' | 'roads' | 'healthcare' | 'education'>('all');

  const triggerProcess = (sample: VoiceSample) => {
    setSelectedVoice(sample);
    setIsProcessing(true);
    setTimeout(() => {
      setProcessedSample(sample);
      setIsProcessing(false);
    }, 450);
  };

  // Filtered samples
  const filteredSamples =
    activeTab === 'all'
      ? CITIZEN_VOICE_SAMPLES
      : CITIZEN_VOICE_SAMPLES.filter((s) => s.category === activeTab);

  return (
    <section id="citizen-voice" className="py-24 bg-slate-50/70 relative border-b border-slate-200/80">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-14">
          <ScrollReveal direction="up" delay={0}>
            <span className="text-xs font-bold uppercase tracking-wider text-blue-700 bg-blue-50 px-3 py-1 rounded-full border border-blue-100">
              Citizen Voice Transformation
            </span>
          </ScrollReveal>

          <TextReveal
            text="How Unstructured Voices Become Structured Intelligence"
            as="h2"
            className="mt-3 text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight"
            delay={80}
            wordStagger={35}
          />

          <ScrollReveal direction="up" delay={220}>
            <p className="mt-3 text-base sm:text-lg text-slate-600">
              Citizens speak or text in their local tongue. JanSetu AI normalizes, translates, geo-tags, and categorizes
              every grievance into actionable public data.
            </p>
          </ScrollReveal>
        </div>

        {/* Category Filter Pills for Interactive Voices */}
        <ScrollReveal direction="up" delay={150}>
          <div className="flex flex-wrap items-center justify-center gap-2 mb-10">
            {(
              [
                { key: 'all', label: 'All Requests' },
                { key: 'roads', label: 'Road Infrastructure' },
                { key: 'water', label: 'Water' },
                { key: 'healthcare', label: 'Healthcare' },
                { key: 'education', label: 'Education' },
              ] as const
            ).map((cat) => (
              <button
                key={cat.key}
                type="button"
                onClick={() => setActiveTab(cat.key)}
                className={`px-3.5 py-1.5 text-xs font-semibold rounded-lg transition-all focus:outline-none focus:ring-2 focus:ring-blue-500 cursor-pointer ${
                  activeTab === cat.key
                    ? 'bg-blue-600 text-white shadow-sm'
                    : 'bg-white border border-slate-200 text-slate-700 hover:border-blue-400'
                }`}
              >
                {cat.label}
              </button>
            ))}
          </div>
        </ScrollReveal>

        {/* 3-Column Interactive Flow: Citizen Voice -> NLU Processing -> Structured Intelligence */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
          {/* Column 1: Unstructured Citizen Voices (4 Cols) */}
          <ScrollReveal direction="up" delay={100} distance={20} className="lg:col-span-4 h-full">
            <div className="h-full bg-white rounded-2xl border border-slate-200/90 p-5 shadow-xs flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between pb-3 border-b border-slate-100 mb-3">
                  <span className="text-xs font-bold uppercase tracking-wider text-slate-500 flex items-center gap-1.5">
                    <span className="w-2 h-2 rounded-full bg-blue-600" /> 1. Citizen Submissions
                  </span>
                  <span className="text-[11px] font-medium text-slate-400">Click to inspect</span>
                </div>

                <div className="space-y-2.5">
                  {filteredSamples.map((sample) => {
                    const isSelected = selectedVoice.id === sample.id;
                    return (
                      <div
                        key={sample.id}
                        onClick={() => triggerProcess(sample)}
                        className={`p-3 rounded-xl border transition-all cursor-pointer text-left ${
                          isSelected
                            ? 'bg-blue-50/80 border-blue-500 shadow-xs ring-1 ring-blue-400'
                            : 'bg-slate-50/70 border-slate-200 hover:border-slate-300 hover:bg-slate-50'
                        }`}
                        role="button"
                        tabIndex={0}
                        onKeyDown={(e) => {
                          if (e.key === 'Enter' || e.key === ' ') triggerProcess(sample);
                        }}
                        aria-label={`Sample: ${sample.originalText}`}
                      >
                        <div className="flex items-center justify-between text-[11px] font-medium text-slate-500 mb-1">
                          <span className="font-semibold text-slate-700 flex items-center gap-1">
                            {sample.inputMode === 'Voice Input' ? (
                              <Mic className="w-3 h-3 text-orange-500" />
                            ) : (
                              <MessageSquare className="w-3 h-3 text-emerald-600" />
                            )}
                            {sample.language}
                          </span>
                          <span className="text-[10px] bg-white px-1.5 py-0.5 rounded border border-slate-200 text-slate-600">
                            {sample.location}
                          </span>
                        </div>
                        <p className="text-sm font-bold text-slate-900 leading-snug">“{sample.originalText}”</p>
                        <span className="text-[11px] text-slate-500 line-clamp-1 mt-1">{sample.translatedText}</span>
                      </div>
                    );
                  })}
                </div>
              </div>

              <p className="text-[11px] text-slate-400 mt-4 pt-3 border-t border-slate-100 flex items-center justify-between">
                <span>Supports speech dialects & WhatsApp scripts</span>
                <span className="text-blue-600 font-bold">22+ Languages</span>
              </p>
            </div>
          </ScrollReveal>

          {/* Column 2: JanSetu Multilingual NLU Engine (4 Cols) */}
          <ScrollReveal direction="up" delay={200} distance={20} className="lg:col-span-4 h-full">
            <div className="h-full bg-gradient-to-br from-slate-900 via-blue-950 to-slate-900 rounded-2xl p-6 text-white shadow-xl flex flex-col justify-between relative overflow-hidden">
              {/* Background Neural Lattice Pattern */}
              <div
                className="absolute inset-0 opacity-10 pointer-events-none"
                style={{
                  backgroundImage: 'radial-gradient(#60A5FA 1px, transparent 1px)',
                  backgroundSize: '18px 18px',
                }}
              />

              <div>
                <div className="flex items-center justify-between pb-3 border-b border-slate-800 mb-5">
                  <span className="text-xs font-bold uppercase tracking-wider text-cyan-300 flex items-center gap-1.5">
                    <Sparkles className="w-3.5 h-3.5" /> 2. AI Synthesis Pipeline
                  </span>
                  <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                    REAL-TIME NLU
                  </span>
                </div>

                {/* Active Processing Box */}
                <div className="bg-slate-800/80 rounded-xl border border-slate-700 p-4 space-y-3 relative">
                  {isProcessing && (
                    <div className="absolute inset-0 bg-slate-900/80 backdrop-blur-xs rounded-xl flex items-center justify-center gap-2 text-cyan-300 text-xs font-mono z-20">
                      <RefreshCw className="w-4 h-4 animate-spin" />
                      <span>Analyzing dialect & clustering tokens...</span>
                    </div>
                  )}

                  <div className="flex items-center justify-between text-xs text-slate-400 font-mono">
                    <span>Input Token Stream</span>
                    <span className="text-emerald-400">{selectedVoice.confidenceScore}% Confidence</span>
                  </div>

                  <div className="p-2.5 rounded-lg bg-slate-900/90 border border-slate-700/80 font-mono text-xs text-amber-200">
                    &gt; “{selectedVoice.originalText}”
                  </div>

                  <div className="space-y-1.5 text-xs text-slate-300">
                    <div className="flex justify-between py-1 border-b border-slate-700/60">
                      <span className="text-slate-400">Detected Dialect:</span>
                      <span className="font-semibold text-white">{selectedVoice.language}</span>
                    </div>
                    <div className="flex justify-between py-1 border-b border-slate-700/60">
                      <span className="text-slate-400">Geo Resolution:</span>
                      <span className="font-semibold text-cyan-300">
                        {selectedVoice.location}, {selectedVoice.state}
                      </span>
                    </div>
                    <div className="flex justify-between py-1">
                      <span className="text-slate-400">Target Category:</span>
                      <span className="font-bold text-amber-400 uppercase">{selectedVoice.categoryLabel}</span>
                    </div>
                  </div>
                </div>

                {/* Translation Display */}
                <div className="mt-4 p-3 rounded-xl bg-blue-900/30 border border-blue-800/60">
                  <span className="text-[10px] uppercase font-bold text-blue-300 tracking-wider block mb-1">
                    Synthesized Meaning (English Pivot)
                  </span>
                  <p className="text-xs text-slate-200 leading-relaxed italic">“{selectedVoice.translatedText}”</p>
                </div>
              </div>

              <div className="mt-5 pt-3 border-t border-slate-800/80 flex items-center justify-between text-[11px] text-slate-400">
                <span className="flex items-center gap-1 text-cyan-300">
                  <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-pulse" />
                  Cross-verified with Bhashini Models
                </span>
                <span>100% Privacy Protected</span>
              </div>
            </div>
          </ScrollReveal>

          {/* Column 3: Structured Development Intelligence (4 Cols) */}
          <ScrollReveal direction="up" delay={300} distance={20} className="lg:col-span-4 h-full">
            <div className="h-full bg-white rounded-2xl border border-slate-200/90 p-5 shadow-xs flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between pb-3 border-b border-slate-100 mb-4">
                  <span className="text-xs font-bold uppercase tracking-wider text-slate-500 flex items-center gap-1.5">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" /> 3. Structured Civic Output
                  </span>
                  <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-blue-50 text-blue-700 border border-blue-200">
                    READY FOR CAPEX
                  </span>
                </div>

                {/* Transformed Result Card */}
                <div className="bg-slate-50/90 border border-slate-200 rounded-xl p-4 space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">
                      Infrastructure Domain
                    </span>
                    <span
                      className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                        processedSample.urgency === 'Critical'
                          ? 'bg-red-100 text-red-700'
                          : processedSample.urgency === 'High'
                          ? 'bg-amber-100 text-amber-800'
                          : 'bg-blue-100 text-blue-700'
                      }`}
                    >
                      {processedSample.urgency} Urgency
                    </span>
                  </div>

                  <h4 className="text-base font-extrabold text-slate-900 leading-snug">
                    {processedSample.categoryLabel}
                  </h4>

                  <div className="space-y-2 text-xs">
                    <div className="p-2.5 rounded-lg bg-white border border-slate-200/80">
                      <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider block">
                        Core Demand Defined
                      </span>
                      <p className="font-semibold text-slate-800 mt-0.5">
                        {processedSample.structuredAttributes.primaryNeed}
                      </p>
                    </div>

                    <div className="grid grid-cols-2 gap-2">
                      <div className="p-2.5 rounded-lg bg-white border border-slate-200/80">
                        <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider block">
                          Sub-District
                        </span>
                        <p className="font-semibold text-slate-800 mt-0.5">
                          {processedSample.structuredAttributes.subDistrict}
                        </p>
                      </div>
                      <div className="p-2.5 rounded-lg bg-white border border-slate-200/80">
                        <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider block">
                          Est. Population
                        </span>
                        <p className="font-semibold text-slate-800 mt-0.5">
                          {processedSample.structuredAttributes.estimatedBeneficiaries.toLocaleString()}
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="p-2.5 rounded-lg bg-emerald-50/80 border border-emerald-200 text-emerald-900 text-xs">
                    <span className="font-bold block">✓ DPI Schema Validated</span>
                    <span className="text-[11px] text-emerald-800">
                      Auto-forwarded to District Planning Committee queue.
                    </span>
                  </div>
                </div>
              </div>

              <a
                href="#intelligence"
                className="mt-4 pt-3 border-t border-slate-100 text-xs font-bold text-blue-600 hover:text-blue-800 flex items-center justify-between"
              >
                <span>View this cluster on the India Demand Map</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </a>
            </div>
          </ScrollReveal>
        </div>
      </div>
    </section>
  );
};
