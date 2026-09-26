import React from 'react';
import { useLanguage } from '../context/LanguageContext';

export const Footer: React.FC = () => {
  const { t } = useLanguage();

  return (
    <footer id="about" className="bg-white border-t border-slate-200 pt-16 pb-12 text-slate-600">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-10 pb-12 border-b border-slate-200/80">
          {/* Brand Info (5 cols) */}
          <div className="md:col-span-5 space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-blue-600 flex items-center justify-center text-white font-bold shadow-md shadow-blue-500/20">
                <svg className="w-5 h-5 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <circle cx="12" cy="7" r="4" />
                  <path d="M6 21v-2a6 6 0 0 1 12 0v2" />
                </svg>
              </div>
              <div>
                <span className="text-xl font-bold text-slate-900">JanSetu AI</span>
                <p className="text-xs font-medium text-slate-500">{t.navSubtag}</p>
              </div>
            </div>
            <p className="text-sm text-slate-500 max-w-sm leading-relaxed">
              Empowering every Indian citizen to direct civic investments through multilingual conversational intelligence.
            </p>
            <div className="pt-2">
              <span className="inline-block px-3 py-1 text-xs font-semibold rounded-md bg-emerald-50 text-emerald-800 border border-emerald-200">
                Built as a Digital Public Good for India
              </span>
            </div>
          </div>

          {/* Links (7 cols) */}
          <div className="md:col-span-7 grid grid-cols-2 sm:grid-cols-3 gap-8">
            <div>
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-900 mb-3">Platform</h4>
              <ul className="space-y-2 text-sm">
                <li>
                  <a href="#how-it-works" className="hover:text-blue-600 transition-colors">
                    {t.navHowItWorks}
                  </a>
                </li>
                <li>
                  <a href="#citizen-voice" className="hover:text-blue-600 transition-colors">
                    {t.navCitizenVoice}
                  </a>
                </li>
                <li>
                  <a href="#intelligence" className="hover:text-blue-600 transition-colors">
                    Insights &amp; Map
                  </a>
                </li>
                <li>
                  <a href="#languages" className="hover:text-blue-600 transition-colors">
                    Languages
                  </a>
                </li>
              </ul>
            </div>

            <div>
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-900 mb-3">Governance</h4>
              <ul className="space-y-2 text-sm">
                <li>
                  <a href="#policymakers" className="hover:text-blue-600 transition-colors">
                    {t.navPolicymakers}
                  </a>
                </li>
                <li>
                  <a href="#intelligence" className="hover:text-blue-600 transition-colors">
                    Open Data Portal
                  </a>
                </li>
                <li>
                  <a href="#how-it-works" className="hover:text-blue-600 transition-colors">
                    API Documentation
                  </a>
                </li>
                <li>
                  <a href="#intelligence" className="hover:text-blue-600 transition-colors">
                    Security &amp; Privacy
                  </a>
                </li>
              </ul>
            </div>

            <div>
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-900 mb-3">Initiative</h4>
              <ul className="space-y-2 text-sm">
                <li>
                  <a href="#about" className="hover:text-blue-600 transition-colors">
                    About the Mission
                  </a>
                </li>
                <li>
                  <a href="mailto:governance@jansetu.gov.in" className="hover:text-blue-600 transition-colors">
                    Contact Working Group
                  </a>
                </li>
                <li>
                  <a href="#languages" className="hover:text-blue-600 transition-colors">
                    Bhashini Alliance
                  </a>
                </li>
              </ul>
            </div>
          </div>
        </div>

        {/* Copyright & DPI Statement */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-500 gap-4">
          <p>© 2025 JanSetu AI. Open-source under MIT / Digital Public Goods Alliance Standards.</p>
          <div className="flex items-center gap-6">
            <span className="hover:text-slate-800 cursor-pointer">Privacy Policy</span>
            <span className="hover:text-slate-800 cursor-pointer">Terms of Governance</span>
            <span className="hover:text-slate-800 cursor-pointer">Open Data License</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
