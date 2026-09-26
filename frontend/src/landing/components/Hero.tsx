import React, { useState } from 'react';
import { useLanguage } from '../context/LanguageContext';
import { ArrowRight, Play, Mic, MessageSquare, ShieldCheck, Sparkles, MapPin, Users, LogIn } from 'lucide-react';
import { ScrollReveal, TextReveal } from './common/ScrollReveal';

interface HeroProps {
  onOpenModal?: () => void;
  onOpenAuth?: () => void;
  onScrollToSection: (id: string) => void;
}

export const Hero: React.FC<HeroProps> = ({ onOpenModal, onOpenAuth, onScrollToSection }) => {
  const { t } = useLanguage();
  const [activeBubble, setActiveBubble] = useState<number | null>(null);

  return (
    <section className="relative pt-10 pb-20 overflow-hidden gradient-mesh border-b border-slate-100">
      {/* Subtle Background Glows */}
      <div className="absolute top-1/4 left-10 w-96 h-96 bg-blue-200/30 rounded-full blur-3xl pointer-events-none -z-10" />
      <div className="absolute bottom-10 right-10 w-96 h-96 bg-orange-100/40 rounded-full blur-3xl pointer-events-none -z-10" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          {/* Left Hero Content (6 Cols) */}
          <div className="lg:col-span-6 space-y-6">
            {/* Eyebrow Pill */}
            <ScrollReveal direction="up" delay={0}>
              <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-blue-50 border border-blue-200/80 text-blue-700 text-xs font-bold tracking-wide uppercase shadow-2xs">
                <span className="w-2 h-2 rounded-full bg-blue-600 animate-pulse" />
                {t.heroEyebrow}
              </div>
            </ScrollReveal>

            {/* Hero Headline with Text Reveal */}
            <div className="space-y-1">
              <TextReveal
                text={t.heroTitle1}
                as="h1"
                className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-slate-900 tracking-tight leading-[1.12]"
                delay={50}
                wordStagger={40}
              />
              <TextReveal
                text={t.heroTitle2}
                as="h1"
                className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight leading-[1.12]"
                highlightWords={['Decisions.', 'निर्णय.', 'निर्णय', 'નિર્ણયો.', 'সিদ্ধান্ত.', 'முடிவுகள்.', 'నిర్ణయాలు.']}
                highlightClassName="text-transparent bg-clip-text bg-gradient-to-r from-blue-700 via-blue-600 to-indigo-600"
                delay={150}
                wordStagger={40}
              />
              <TextReveal
                text={t.heroTitle3}
                as="h1"
                className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-slate-900 tracking-tight leading-[1.12]"
                delay={250}
                wordStagger={40}
              />
            </div>

            {/* Subtitles with Scroll Reveal */}
            <ScrollReveal direction="up" delay={320} distance={18}>
              <p className="text-lg sm:text-xl font-medium text-slate-700 leading-relaxed">
                {t.heroSubtitle1}
              </p>
            </ScrollReveal>

            <ScrollReveal direction="up" delay={400} distance={18}>
              <p className="text-sm sm:text-base text-slate-600 leading-relaxed font-normal">
                {t.heroSubtitle2}
              </p>
            </ScrollReveal>

            {/* CTAs */}
            <ScrollReveal direction="up" delay={480} distance={18}>
              <div className="flex flex-wrap items-center gap-4 pt-2">
                <button
                  type="button"
                  onClick={onOpenAuth}
                  className="inline-flex items-center gap-2 px-6 py-3.5 text-base font-semibold text-white bg-blue-600 hover:bg-blue-700 active:bg-blue-800 rounded-xl shadow-lg shadow-blue-600/20 hover:shadow-blue-600/35 transition-all transform hover:-translate-y-0.5 focus:outline-none focus:ring-2 focus:ring-blue-500 cursor-pointer"
                >
                  <LogIn className="w-5 h-5 text-white" />
                  <span>Portal Login</span>
                  <ArrowRight className="w-4 h-4" />
                </button>



                <button
                  type="button"
                  onClick={() => onScrollToSection('how-it-works')}
                  className="inline-flex items-center gap-2 px-6 py-3.5 text-base font-semibold text-slate-700 hover:text-blue-700 bg-white hover:bg-slate-50 active:bg-slate-100 border border-slate-200 rounded-xl shadow-xs transition-all focus:outline-none focus:ring-2 focus:ring-blue-500 cursor-pointer"
                >
                  <Play className="w-4 h-4 fill-blue-600 text-blue-600" />
                  <span>{t.heroCtaHowItWorks}</span>
                </button>
              </div>
            </ScrollReveal>

            {/* Trust Badges Metrics */}
            <ScrollReveal direction="up" delay={550} distance={16}>
              <div className="pt-6 border-t border-slate-200/80 grid grid-cols-3 gap-4">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-lg bg-orange-50 border border-orange-200 flex items-center justify-center text-orange-600 shrink-0">
                    <span className="font-bold text-sm">अ/A</span>
                  </div>
                  <div>
                    <p className="text-sm font-bold text-slate-900 leading-tight">{t.heroStatLanguages}</p>
                    <p className="text-xs text-slate-500 font-medium">{t.heroStatLanguagesSub}</p>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-lg bg-blue-50 border border-blue-200 flex items-center justify-center text-blue-600 shrink-0">
                    <Users className="w-4 h-4" />
                  </div>
                  <div>
                    <p className="text-sm font-bold text-slate-900 leading-tight">{t.heroStatInsights}</p>
                    <p className="text-xs text-slate-500 font-medium">{t.heroStatInsightsSub}</p>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-lg bg-emerald-50 border border-emerald-200 flex items-center justify-center text-emerald-600 shrink-0">
                    <ShieldCheck className="w-4 h-4" />
                  </div>
                  <div>
                    <p className="text-sm font-bold text-slate-900 leading-tight">{t.heroStatPrioritization}</p>
                    <p className="text-xs text-slate-500 font-medium">{t.heroStatPrioritizationSub}</p>
                  </div>
                </div>
              </div>
            </ScrollReveal>
          </div>

          {/* Right Hero Visual: Journey from Citizen Voice -> AI Analysis -> Hotspots (6 Cols) */}
          <div className="lg:col-span-6 relative">
            <ScrollReveal direction="up" delay={200} distance={24}>
              <div className="relative w-full rounded-3xl bg-gradient-to-b from-white/95 to-blue-50/70 p-5 sm:p-6 border border-blue-100 shadow-xl shadow-blue-900/5">
                {/* Flow Label Banner */}
                <div className="flex items-center justify-between text-[11px] font-bold tracking-wider text-slate-500 uppercase px-2 pb-4 border-b border-slate-100">
                  <span className="text-blue-700 flex items-center gap-1.5">
                    <span className="w-2 h-2 rounded-full bg-blue-600" /> {t.flowCitizenVoice}
                  </span>
                  <span className="text-slate-300">→</span>
                  <span className="text-indigo-600">{t.flowAiSynthesis}</span>
                  <span className="text-slate-300">→</span>
                  <span className="text-orange-600">{t.flowDemandHotspots}</span>
                  <span className="text-slate-300">→</span>
                  <span className="text-emerald-700">{t.flowDpiAction}</span>
                </div>

                {/* Interactive Illustration Canvas */}
                <div className="relative mt-5 min-h-[420px] w-full bg-white rounded-2xl border border-slate-100 overflow-hidden shadow-inner flex flex-col justify-between p-4">
                  {/* Background Grid Pattern */}
                  <div
                    className="absolute inset-0 opacity-[0.04] pointer-events-none"
                    style={{
                      backgroundImage: 'radial-gradient(#000 1px, transparent 1px)',
                      backgroundSize: '16px 16px',
                    }}
                  />

                  {/* Top: Multilingual Floating Speech Bubbles */}
                  <div className="relative z-10 flex flex-col gap-2.5">
                    {/* Bubble 1: Hindi (Voice) */}
                    <div
                      onMouseEnter={() => setActiveBubble(1)}
                      onMouseLeave={() => setActiveBubble(null)}
                      className={`animate-float-slow self-start flex items-center gap-2.5 px-3.5 py-2 rounded-2xl rounded-tl-sm border shadow-xs max-w-[88%] cursor-pointer transition-all ${
                        activeBubble === 1
                          ? 'bg-orange-100/90 border-orange-400 scale-[1.02]'
                          : 'bg-gradient-to-r from-orange-50 to-amber-50 border-orange-200/90'
                      }`}
                    >
                      <span className="shrink-0 w-6 h-6 rounded-full bg-orange-500 text-white flex items-center justify-center text-xs shadow-xs">
                        <Mic className="w-3.5 h-3.5" />
                      </span>
                      <div>
                        <p className="text-xs font-semibold text-slate-800">“हमारे गाँव में पानी की समस्या है”</p>
                        <div className="flex items-center gap-1.5 text-[10px] text-orange-700 font-medium">
                          <span>Bundi, Rajasthan</span>
                          <span>•</span>
                          <span>Voice Input</span>
                          {activeBubble === 1 && <span className="font-bold text-blue-700">→ Categorized: Water</span>}
                        </div>
                      </div>
                    </div>

                    {/* Bubble 2: Hinglish / WhatsApp format */}
                    <div
                      onMouseEnter={() => setActiveBubble(2)}
                      onMouseLeave={() => setActiveBubble(null)}
                      className={`animate-float-reverse self-end flex items-center gap-2.5 px-3.5 py-2 rounded-2xl rounded-tr-sm border shadow-xs max-w-[88%] cursor-pointer transition-all ${
                        activeBubble === 2
                          ? 'bg-emerald-100 border-emerald-400 scale-[1.02]'
                          : 'bg-emerald-50/90 border-emerald-200'
                      }`}
                    >
                      <div className="text-right">
                        <p className="text-xs font-semibold text-slate-800">“Hamare area mein road chahiye”</p>
                        <div className="flex items-center justify-end gap-1.5 text-[10px] text-emerald-700 font-medium">
                          {activeBubble === 2 && <span className="font-bold text-blue-700">Categorized: Roads ←</span>}
                          <span>Darbhanga, Bihar</span>
                          <span>•</span>
                          <span>Messaging App</span>
                        </div>
                      </div>
                      <span className="shrink-0 w-6 h-6 rounded-full bg-emerald-600 text-white flex items-center justify-center text-xs shadow-xs">
                        <MessageSquare className="w-3.5 h-3.5" />
                      </span>
                    </div>

                    {/* Bubble 3: Bengali & English side by side */}
                    <div className="flex items-center justify-between gap-2">
                      <div
                        onMouseEnter={() => setActiveBubble(3)}
                        onMouseLeave={() => setActiveBubble(null)}
                        className={`px-3 py-1.5 rounded-xl text-xs font-medium border shadow-2xs cursor-pointer transition-all ${
                          activeBubble === 3
                            ? 'bg-blue-100 border-blue-400 text-blue-900'
                            : 'bg-blue-50 border-blue-200 text-blue-900'
                        }`}
                      >
                        “স্কুলের রাস্তা খুব খারাপ” <span className="text-[9px] text-blue-600 font-bold ml-1">WB • Education</span>
                      </div>
                      <div
                        onMouseEnter={() => setActiveBubble(4)}
                        onMouseLeave={() => setActiveBubble(null)}
                        className={`px-3 py-1.5 rounded-xl text-xs font-medium border shadow-2xs cursor-pointer transition-all ${
                          activeBubble === 4
                            ? 'bg-purple-100 border-purple-400 text-purple-900'
                            : 'bg-slate-50 border-slate-200 text-slate-800'
                        }`}
                      >
                        “Need better primary healthcare nearby” <span className="text-[9px] text-purple-700 font-bold ml-1">TN • Health</span>
                      </div>
                    </div>
                  </div>

                  {/* Center: The AI Synthesis Hub with gentle rotation */}
                  <div className="relative z-10 my-2 flex items-center justify-center">
                    <div className="relative flex items-center gap-3 px-5 py-2.5 rounded-2xl bg-gradient-to-r from-blue-900 to-indigo-900 text-white shadow-lg shadow-blue-900/25 border border-blue-700/50">
                      <div className="relative w-8 h-8 rounded-full bg-blue-500/30 border border-blue-400 flex items-center justify-center">
                        <Sparkles className="w-4 h-4 text-cyan-300 animate-spin" style={{ animationDuration: '10s' }} />
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <p className="text-xs font-bold tracking-tight text-white">{t.nluEngineLive}</p>
                          <span className="px-1.5 py-0.5 rounded text-[9px] bg-emerald-400 text-emerald-950 font-bold animate-pulse">
                            LIVE
                          </span>
                        </div>
                        <p className="text-[10px] text-cyan-200">{t.nluEngineSub}</p>
                      </div>
                    </div>
                  </div>

                  {/* Bottom: Stylized India Map Mini Hotspot & Live Priority Indicator */}
                  <div className="relative z-10 grid grid-cols-12 gap-3 items-center bg-slate-50/95 rounded-xl p-3 border border-slate-200 shadow-xs">
                    {/* Stylized Mini Hotspot Map (Left 5 Cols) */}
                    <div className="col-span-5 relative flex items-center justify-center h-28 bg-white rounded-lg border border-slate-200/80 p-1 overflow-hidden group">
                      {/* Vector India Outline Silhouette */}
                      <svg className="w-24 h-24 text-slate-200" viewBox="0 0 100 100" fill="currentColor">
                        <path
                          d="M50 8 C46 12 40 14 38 18 C35 24 37 30 33 34 C28 40 24 42 22 48 C20 54 24 58 28 62 C34 68 40 76 46 88 C49 94 51 94 54 88 C60 76 66 68 72 62 C76 58 80 54 78 48 C76 42 72 40 67 34 C63 30 65 24 62 18 C60 14 54 12 50 8 Z"
                          opacity="0.6"
                        />
                        <path
                          d="M48 10 C46 15 42 20 38 25 C35 32 30 40 26 48 C24 56 30 64 36 72 C42 80 48 88 50 92 C52 88 58 80 64 72 C70 64 76 56 74 48 C70 40 65 32 62 25 C58 20 54 15 52 10 Z"
                          fill="#CBD5E1"
                        />
                      </svg>

                      {/* Glowing Hotspot Pulse Points */}
                      <div className="absolute top-8 left-10 flex items-center justify-center" title="Rajasthan: Water Deficit">
                        <span className="animate-ping absolute w-4 h-4 rounded-full bg-red-400 opacity-75" />
                        <span className="w-2.5 h-2.5 rounded-full bg-red-600 shadow-sm" />
                      </div>
                      <div
                        className="absolute top-14 left-14 flex items-center justify-center"
                        title="Bihar: Road Connectivity"
                      >
                        <span
                          className="animate-ping absolute w-4 h-4 rounded-full bg-orange-400 opacity-75"
                          style={{ animationDelay: '0.6s' }}
                        />
                        <span className="w-2.5 h-2.5 rounded-full bg-orange-500 shadow-sm" />
                      </div>
                      <div
                        className="absolute bottom-6 left-12 flex items-center justify-center"
                        title="Kerala/TN: Health Centre"
                      >
                        <span
                          className="animate-ping absolute w-4 h-4 rounded-full bg-emerald-400 opacity-75"
                          style={{ animationDelay: '1.2s' }}
                        />
                        <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 shadow-sm" />
                      </div>
                      <div className="absolute top-10 right-8 flex items-center justify-center" title="Assam: Fiber Link">
                        <span className="w-2.5 h-2.5 rounded-full bg-blue-600 shadow-sm" />
                      </div>
                      <span className="absolute bottom-1 right-2 text-[9px] font-bold text-slate-400 tracking-wider">
                        GEO-DEMAND AI
                      </span>
                    </div>

                    {/* Priority Card Right (7 Cols) */}
                    <div className="col-span-7 space-y-1.5">
                      <div className="flex items-center justify-between">
                        <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">
                          {t.topDetectedNeed}
                        </span>
                        <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-red-100 text-red-700">
                          {t.criticalPriority}
                        </span>
                      </div>
                      <p className="text-xs font-bold text-slate-900 leading-snug">{t.drinkingWaterPipeline}</p>
                      <div className="flex items-center gap-2 text-[10px] text-slate-600">
                        <span className="font-medium flex items-center gap-1">
                          <MapPin className="w-3 h-3 text-red-500" /> 14 Gram Panchayats
                        </span>
                        <span>•</span>
                        <span className="font-medium">38,400 Citizens</span>
                      </div>

                      {/* Progress Confidence Meter */}
                      <div className="w-full bg-slate-200 rounded-full h-1.5 overflow-hidden">
                        <div className="bg-blue-600 h-1.5 rounded-full transition-all duration-1000" style={{ width: '82%' }} />
                      </div>
                      <div className="flex justify-between text-[9px] text-slate-500">
                        <span>Evidence Confidence: 94%</span>
                        <span className="text-blue-700 font-semibold">Matched with Jal Jeevan Mission</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Bottom Floating Trust Tagline */}
                <div className="mt-3 flex items-center justify-between text-[11px] text-slate-500 px-2 font-medium">
                  <span className="flex items-center gap-1.5">
                    <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                    {t.privacyNotice}
                  </span>
                  <span className="text-blue-600 font-semibold">{t.nationalStandard}</span>
                </div>
              </div>
            </ScrollReveal>
          </div>
        </div>
      </div>
    </section>
  );
};
