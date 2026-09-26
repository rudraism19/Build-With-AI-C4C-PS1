import React from 'react';
import { useLanguage } from '../context/LanguageContext';
import { TextReveal, ScrollReveal } from './common/ScrollReveal';

export const ImpactStats: React.FC = () => {
  const { t } = useLanguage();

  return (
    <section className="py-20 bg-white relative border-b border-slate-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center max-w-2xl mx-auto mb-16">
          <ScrollReveal direction="up" delay={0}>
            <span className="text-xs font-bold uppercase tracking-wider text-blue-700 bg-blue-50 px-3 py-1 rounded-full border border-blue-100">
              {t.scaleEyebrow}
            </span>
          </ScrollReveal>

          <TextReveal
            text={t.scaleHeading}
            as="h2"
            className="mt-3 text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight"
            delay={80}
            wordStagger={35}
          />

          <ScrollReveal direction="up" delay={180}>
            <p className="mt-2 text-sm text-slate-500">{t.scaleSubheading}</p>
          </ScrollReveal>
        </div>

        {/* 3 Large Statistics */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center max-w-5xl mx-auto">
          {/* Stat 1 */}
          <ScrollReveal direction="up" delay={150} distance={20}>
            <div className="p-8 rounded-3xl bg-slate-50 border border-slate-200/80 hover:border-blue-300 hover:shadow-lg transition-all h-full flex flex-col justify-center">
              <div className="text-5xl sm:text-6xl font-black text-blue-600 tracking-tight">
                {t.stat1Number}
              </div>
              <div className="mt-3 text-lg font-bold text-slate-900">{t.stat1Label}</div>
              <p className="mt-1 text-xs text-slate-500 leading-relaxed">{t.stat1Desc}</p>
            </div>
          </ScrollReveal>

          {/* Stat 2 */}
          <ScrollReveal direction="up" delay={260} distance={20}>
            <div className="p-8 rounded-3xl bg-slate-50 border border-slate-200/80 hover:border-indigo-300 hover:shadow-lg transition-all h-full flex flex-col justify-center">
              <div className="text-5xl sm:text-6xl font-black text-indigo-600 tracking-tight">
                {t.stat2Number}
              </div>
              <div className="mt-3 text-lg font-bold text-slate-900">{t.stat2Label}</div>
              <p className="mt-1 text-xs text-slate-500 leading-relaxed">{t.stat2Desc}</p>
            </div>
          </ScrollReveal>

          {/* Stat 3 */}
          <ScrollReveal direction="up" delay={370} distance={20}>
            <div className="p-8 rounded-3xl bg-slate-50 border border-slate-200/80 hover:border-emerald-300 hover:shadow-lg transition-all h-full flex flex-col justify-center">
              <div className="text-5xl sm:text-6xl font-black text-emerald-600 tracking-tight">
                {t.stat3Number}
              </div>
              <div className="mt-3 text-lg font-bold text-slate-900">{t.stat3Label}</div>
              <p className="mt-1 text-xs text-slate-500 leading-relaxed">{t.stat3Desc}</p>
            </div>
          </ScrollReveal>
        </div>
      </div>
    </section>
  );
};
