import React, { useState } from 'react';
import { useLanguage } from '../context/LanguageContext';
import { Mic, Brain, MapPin, Target, Sparkles, CheckCircle2 } from 'lucide-react';
import { TextReveal, ScrollReveal } from './common/ScrollReveal';

export const HowItWorks: React.FC = () => {
  const { t } = useLanguage();
  const [selectedStep, setSelectedStep] = useState<number>(0);

  const steps = [
    {
      num: '01',
      icon: Mic,
      color: 'blue',
      title: t.step1Title,
      desc: t.step1Desc,
      footer: t.step1Footer,
      colorClasses: {
        num: 'text-blue-200 group-hover:text-blue-600',
        activeNum: 'text-blue-600',
        bg: 'bg-blue-100/60 text-blue-700',
        border: 'hover:border-blue-300 hover:shadow-blue-900/5',
        dot: 'bg-emerald-500',
      },
      detailSnippet: 'Audio streams through Bhashini speech-to-text with local dialect recognition.',
    },
    {
      num: '02',
      icon: Brain,
      color: 'indigo',
      title: t.step2Title,
      desc: t.step2Desc,
      footer: t.step2Footer,
      colorClasses: {
        num: 'text-indigo-200 group-hover:text-indigo-600',
        activeNum: 'text-indigo-600',
        bg: 'bg-indigo-100/60 text-indigo-700',
        border: 'hover:border-indigo-300 hover:shadow-indigo-900/5',
        dot: 'bg-indigo-500',
      },
      detailSnippet: 'Natural Language Understanding extracts category, urgency, and geo-landmarks.',
    },
    {
      num: '03',
      icon: MapPin,
      color: 'orange',
      title: t.step3Title,
      desc: t.step3Desc,
      footer: t.step3Footer,
      colorClasses: {
        num: 'text-orange-200 group-hover:text-orange-600',
        activeNum: 'text-orange-600',
        bg: 'bg-orange-100/60 text-orange-700',
        border: 'hover:border-orange-300 hover:shadow-orange-900/5',
        dot: 'bg-orange-500',
      },
      detailSnippet: 'Geospatial clustering merges petitions within Gram Panchayat and block boundaries.',
    },
    {
      num: '04',
      icon: Target,
      color: 'emerald',
      title: t.step4Title,
      desc: t.step4Desc,
      footer: t.step4Footer,
      colorClasses: {
        num: 'text-emerald-200 group-hover:text-emerald-600',
        activeNum: 'text-emerald-600',
        bg: 'bg-emerald-100/60 text-emerald-700',
        border: 'hover:border-emerald-300 hover:shadow-emerald-900/5',
        dot: 'bg-emerald-500',
      },
      detailSnippet: 'Impact-weighted scoring models match verified demands against state CapEx schemes.',
    },
  ];

  return (
    <section id="how-it-works" className="py-24 bg-white relative border-b border-slate-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center max-w-2xl mx-auto mb-16">
          <ScrollReveal direction="up" delay={0}>
            <span className="text-xs font-bold uppercase tracking-wider text-blue-700 bg-blue-50 px-3 py-1 rounded-full border border-blue-100">
              {t.pipelineEyebrow}
            </span>
          </ScrollReveal>

          <TextReveal
            text={t.pipelineHeading}
            as="h2"
            className="mt-3 text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight"
            delay={80}
            wordStagger={40}
          />

          <ScrollReveal direction="up" delay={200}>
            <p className="mt-3 text-base sm:text-lg text-slate-600">{t.pipelineSubheading}</p>
          </ScrollReveal>
        </div>

        {/* 4 Connected Feature Cards with Visual Connecting Line */}
        <div className="relative">
          {/* Connecting Line for Desktop */}
          <div className="hidden lg:block absolute top-1/2 left-16 right-16 h-0.5 -translate-y-9 z-0 pointer-events-none">
            <svg className="w-full h-4 overflow-visible" preserveAspectRatio="none">
              <line
                x1="0"
                y1="0"
                x2="100%"
                y2="0"
                stroke="#BFDBFE"
                strokeWidth="2"
                strokeDasharray="6 6"
                className="flow-line"
              />
            </svg>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 relative z-10">
            {steps.map((step, idx) => {
              const Icon = step.icon;
              const isSelected = selectedStep === idx;
              return (
                <ScrollReveal
                  key={step.num}
                  direction="up"
                  delay={100 * idx}
                  distance={20}
                  className="h-full"
                >
                  <div
                    onClick={() => setSelectedStep(idx)}
                    className={`h-full group bg-slate-50/70 hover:bg-white p-7 rounded-2xl border transition-all duration-300 flex flex-col justify-between cursor-pointer focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                      isSelected
                        ? 'bg-white border-blue-400 shadow-xl shadow-blue-900/5 ring-1 ring-blue-300'
                        : 'border-slate-200/80 hover:shadow-xl'
                    }`}
                    role="button"
                    tabIndex={0}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter' || e.key === ' ') setSelectedStep(idx);
                    }}
                    aria-label={`Step ${step.num}: ${step.title}`}
                  >
                    <div>
                      <div className="flex items-center justify-between mb-5">
                        <span
                          className={`text-3xl font-black transition-colors ${
                            isSelected ? step.colorClasses.activeNum : step.colorClasses.num
                          }`}
                        >
                          {step.num}
                        </span>
                        <div
                          className={`w-12 h-12 rounded-xl flex items-center justify-center text-xl shadow-xs group-hover:scale-110 transition-transform ${step.colorClasses.bg}`}
                        >
                          <Icon className="w-6 h-6" />
                        </div>
                      </div>
                      <h3 className="text-lg font-bold text-slate-900 mb-2 group-hover:text-blue-600 transition-colors">
                        {step.title}
                      </h3>
                      <p className="text-sm text-slate-600 leading-relaxed font-normal">{step.desc}</p>
                    </div>

                    <div className="mt-6 pt-4 border-t border-slate-200/60 flex items-center justify-between text-xs font-semibold text-slate-500">
                      <span className="flex items-center gap-2">
                        <span className={`w-1.5 h-1.5 rounded-full ${step.colorClasses.dot}`} />
                        {step.footer}
                      </span>
                      {isSelected && (
                        <span className="text-blue-600 flex items-center gap-1 text-[11px] font-bold">
                          <CheckCircle2 className="w-3.5 h-3.5" /> Active
                        </span>
                      )}
                    </div>
                  </div>
                </ScrollReveal>
              );
            })}
          </div>

          {/* Interactive Deep-Dive Preview Box */}
          <ScrollReveal direction="up" delay={250} distance={16}>
            <div className="mt-8 bg-gradient-to-r from-blue-50/70 via-indigo-50/50 to-slate-50 border border-blue-200/80 rounded-2xl p-5 sm:p-6 flex flex-col md:flex-row items-start md:items-center justify-between gap-4 shadow-xs">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-blue-600 text-white flex items-center justify-center shadow-xs shrink-0">
                  <Sparkles className="w-5 h-5 text-amber-300" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold uppercase tracking-wider text-blue-800">
                      Step {steps[selectedStep].num} Deep Dive
                    </span>
                    <span className="text-xs font-bold text-slate-900">— {steps[selectedStep].title}</span>
                  </div>
                  <p className="text-xs sm:text-sm text-slate-600 mt-0.5">{steps[selectedStep].detailSnippet}</p>
                </div>
              </div>
              <div className="flex items-center gap-2 text-xs font-bold text-blue-700 bg-white px-3 py-1.5 rounded-lg border border-blue-200 shadow-2xs self-end md:self-auto whitespace-nowrap">
                <span>National DPI Compliance Verified</span>
                <span>✓</span>
              </div>
            </div>
          </ScrollReveal>
        </div>
      </div>
    </section>
  );
};
