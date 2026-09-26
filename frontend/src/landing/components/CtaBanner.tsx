import React from 'react';
import { useLanguage } from '../context/LanguageContext';
import { ArrowRight, Check, LogIn } from 'lucide-react';
import { TextReveal, ScrollReveal } from './common/ScrollReveal';

interface CtaBannerProps {
  onOpenModal?: () => void;
  onOpenAuth?: () => void;
  onScrollToSection: (id: string) => void;
}

export const CtaBanner: React.FC<CtaBannerProps> = ({ onOpenModal, onOpenAuth, onScrollToSection }) => {
  const { t } = useLanguage();

  return (
    <section id="submit-request" className="py-20 bg-slate-50 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <ScrollReveal direction="up" delay={50} distance={25}>
          <div className="relative rounded-3xl bg-gradient-to-r from-blue-700 via-blue-600 to-indigo-800 p-8 sm:p-14 text-white overflow-hidden shadow-2xl">
            {/* Subtle Background Decorative Elements */}
            <div className="absolute -right-10 -bottom-10 w-96 h-96 rounded-full bg-white/10 blur-2xl pointer-events-none" />
            <div className="absolute left-1/3 top-0 w-64 h-64 rounded-full bg-cyan-400/20 blur-3xl pointer-events-none" />

            <div className="relative z-10 max-w-3xl">
              {/* Eyebrow */}
              <ScrollReveal direction="up" delay={100}>
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/15 text-white text-xs font-bold uppercase tracking-wider backdrop-blur-xs mb-4">
                  {t.ctaEyebrow}
                </div>
              </ScrollReveal>

              {/* Heading */}
              <TextReveal
                text={t.ctaHeading}
                as="h2"
                className="text-3xl sm:text-5xl font-extrabold tracking-tight leading-tight text-white"
                delay={150}
                wordStagger={35}
              />

              {/* Supporting Text */}
              <ScrollReveal direction="up" delay={260}>
                <p className="mt-4 text-base sm:text-xl text-blue-100 font-normal leading-relaxed max-w-2xl">
                  {t.ctaSubheading}
                </p>
              </ScrollReveal>

              {/* Action Buttons */}
              <ScrollReveal direction="up" delay={340}>
                <div className="mt-8 flex flex-wrap items-center gap-4">
                  <button
                    type="button"
                    onClick={onOpenAuth}
                    className="inline-flex items-center gap-2 px-7 py-3.5 text-base font-bold text-blue-900 bg-white hover:bg-blue-50 active:bg-slate-100 rounded-xl shadow-lg shadow-black/10 transition-all transform hover:-translate-y-0.5 cursor-pointer focus:outline-none focus:ring-2 focus:ring-blue-300"
                  >
                    <LogIn className="w-5 h-5 text-blue-900" />
                    <span>Portal Login</span>
                    <ArrowRight className="w-5 h-5 text-blue-900" />
                  </button>

                  <button
                    type="button"
                    onClick={() => onScrollToSection('intelligence')}
                    className="inline-flex items-center gap-2 px-7 py-3.5 text-base font-bold text-white bg-blue-800/80 hover:bg-blue-800 active:bg-blue-900 border border-white/20 rounded-xl transition-all cursor-pointer focus:outline-none focus:ring-2 focus:ring-white"
                  >
                    {t.ctaSecondaryBtn}
                  </button>
                </div>
              </ScrollReveal>

              <ScrollReveal direction="up" delay={420}>
                <div className="mt-6 flex flex-wrap items-center gap-4 text-xs text-blue-200">
                  <span className="flex items-center gap-1.5">
                    <Check className="w-3.5 h-3.5 text-cyan-300" /> {t.ctaTrust1}
                  </span>
                  <span className="flex items-center gap-1.5">
                    <Check className="w-3.5 h-3.5 text-cyan-300" /> {t.ctaTrust2}
                  </span>
                  <span className="flex items-center gap-1.5">
                    <Check className="w-3.5 h-3.5 text-cyan-300" /> {t.ctaTrust3}
                  </span>
                </div>
              </ScrollReveal>
            </div>
          </div>
        </ScrollReveal>
      </div>
    </section>
  );
};
