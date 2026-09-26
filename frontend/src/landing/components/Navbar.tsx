import React, { useState, useEffect } from 'react';
import { useLanguage } from '../context/LanguageContext';
import { LanguageCode } from '../types';
import { Globe, Check, ChevronDown, Menu, X, LogIn } from 'lucide-react';

interface NavbarProps {
  onOpenModal: () => void;
  onOpenAuth?: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({ onOpenModal, onOpenAuth }) => {
  const { language, setLanguage, t, availableLanguages } = useLanguage();
  const [isScrolled, setIsScrolled] = useState(false);
  const [isLangOpen, setIsLangOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [activeSection, setActiveSection] = useState('how-it-works');

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);

      // Active section spy
      const sections = ['how-it-works', 'citizen-voice', 'intelligence', 'policymakers', 'languages', 'about'];
      const scrollPos = window.scrollY + 200;

      for (let i = sections.length - 1; i >= 0; i--) {
        const el = document.getElementById(sections[i]);
        if (el && el.offsetTop <= scrollPos) {
          setActiveSection(sections[i]);
          break;
        }
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleNavClick = (e: React.MouseEvent<HTMLAnchorElement>, targetId: string) => {
    e.preventDefault();
    const target = document.getElementById(targetId);
    if (target) {
      target.scrollIntoView({ behavior: 'smooth' });
      setActiveSection(targetId);
      setIsMobileMenuOpen(false);
    }
  };

  const currentLangObj = availableLanguages.find((l) => l.code === language) || availableLanguages[0];

  return (
    <>
      {/* Top Tricolor Accent Bar */}
      <div className="h-1 w-full bg-gradient-to-r from-orange-500 via-blue-600 to-emerald-600" />

      {/* Sticky Header */}
      <header
        className={`sticky top-0 z-50 bg-white/95 backdrop-blur-md border-b border-slate-100 transition-all duration-200 ${
          isScrolled ? 'h-16 shadow-md' : 'h-20 shadow-xs'
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-full flex items-center justify-between">
          {/* Brand Logo & Wordmark */}
          <div className="flex items-center gap-3">
            <a
              href="#"
              onClick={(e) => {
                e.preventDefault();
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
              className="flex items-center gap-3 group focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 rounded-xl"
              aria-label="JanSetu AI Homepage"
            >
              <div className="relative w-10 h-10 rounded-xl bg-gradient-to-tr from-blue-700 via-blue-600 to-indigo-600 flex items-center justify-center shadow-md shadow-blue-500/20 group-hover:scale-105 transition-transform">
                <svg
                  className="w-6 h-6 text-white"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
                  <circle cx="9" cy="7" r="4" />
                  <path d="M22 21v-2a4 4 0 0 0-3-3.87" />
                  <path d="M16 3.13a4 4 0 0 1 0 7.75" />
                  <circle cx="19" cy="8" r="1.5" fill="#FF9933" stroke="none" />
                </svg>
                <span className="absolute -bottom-1 -right-1 w-3.5 h-3.5 bg-emerald-500 border-2 border-white rounded-full"></span>
              </div>
              <div className="flex flex-col">
                <div className="flex items-center gap-1.5">
                  <span className="text-xl font-bold tracking-tight text-slate-900 font-sans">JanSetu</span>
                  <span className="px-1.5 py-0.5 text-xs font-extrabold bg-blue-50 text-blue-700 rounded-md border border-blue-200">
                    AI
                  </span>
                </div>
                <span className="text-[11px] font-medium tracking-wide text-slate-500">{t.navSubtag}</span>
              </div>
            </a>
          </div>

          {/* Desktop Navigation Links */}
          <nav className="hidden md:flex items-center gap-8" aria-label="Main Navigation">
            <a
              href="#how-it-works"
              onClick={(e) => handleNavClick(e, 'how-it-works')}
              className={`text-sm font-semibold transition-colors py-1 border-b-2 ${
                activeSection === 'how-it-works'
                  ? 'text-blue-600 border-blue-600'
                  : 'text-slate-700 border-transparent hover:text-blue-600'
              }`}
            >
              {t.navHowItWorks}
            </a>
            <a
              href="#citizen-voice"
              onClick={(e) => handleNavClick(e, 'citizen-voice')}
              className={`text-sm font-semibold transition-colors py-1 border-b-2 ${
                activeSection === 'citizen-voice'
                  ? 'text-blue-600 border-blue-600'
                  : 'text-slate-700 border-transparent hover:text-blue-600'
              }`}
            >
              {t.navCitizenVoice}
            </a>
            <a
              href="#intelligence"
              onClick={(e) => handleNavClick(e, 'intelligence')}
              className={`text-sm font-semibold transition-colors py-1 border-b-2 ${
                activeSection === 'intelligence'
                  ? 'text-blue-600 border-blue-600'
                  : 'text-slate-700 border-transparent hover:text-blue-600'
              }`}
            >
              {t.navInsights}
            </a>
            <a
              href="#policymakers"
              onClick={(e) => handleNavClick(e, 'policymakers')}
              className={`text-sm font-semibold transition-colors py-1 border-b-2 ${
                activeSection === 'policymakers'
                  ? 'text-blue-600 border-blue-600'
                  : 'text-slate-700 border-transparent hover:text-blue-600'
              }`}
            >
              {t.navPolicymakers}
            </a>
            <a
              href="#about"
              onClick={(e) => handleNavClick(e, 'about')}
              className={`text-sm font-semibold transition-colors py-1 border-b-2 ${
                activeSection === 'about'
                  ? 'text-blue-600 border-blue-600'
                  : 'text-slate-700 border-transparent hover:text-blue-600'
              }`}
            >
              {t.navAbout}
            </a>
          </nav>

          {/* Right: Language Selector + CTA + Mobile Hamburger */}
          <div className="flex items-center gap-3">
            {/* Language Selector Dropdown */}
            <div className="relative">
              <button
                type="button"
                onClick={() => setIsLangOpen(!isLangOpen)}
                className="flex items-center gap-2 px-3 py-1.5 text-xs font-semibold text-slate-700 bg-slate-50 hover:bg-slate-100 border border-slate-200 rounded-lg transition-all focus:outline-none focus:ring-2 focus:ring-blue-500"
                aria-expanded={isLangOpen}
                aria-label="Select Language"
              >
                <Globe className="w-3.5 h-3.5 text-blue-600" />
                <span className="font-medium">{currentLangObj.nativeName}</span>
                <ChevronDown className={`w-3.5 h-3.5 text-slate-500 transition-transform ${isLangOpen ? 'rotate-180' : ''}`} />
              </button>

              {isLangOpen && (
                <>
                  <div
                    className="fixed inset-0 z-40"
                    onClick={() => setIsLangOpen(false)}
                    aria-hidden="true"
                  />
                  <div className="absolute right-0 mt-2 w-48 bg-white rounded-xl shadow-xl border border-slate-100 py-1.5 z-50 text-xs font-medium text-slate-700">
                    <div className="px-3 py-1.5 text-[10px] uppercase font-bold text-slate-400 tracking-wider border-b border-slate-100">
                      Select Language (भाषा)
                    </div>
                    {availableLanguages.map((lang) => (
                      <button
                        key={lang.code}
                        type="button"
                        onClick={() => {
                          setLanguage(lang.code);
                          setIsLangOpen(false);
                        }}
                        className={`w-full text-left px-3 py-2 hover:bg-blue-50 hover:text-blue-700 flex items-center justify-between transition-colors ${
                          language === lang.code ? 'bg-blue-50/70 text-blue-700 font-bold' : ''
                        }`}
                      >
                        <div className="flex items-center gap-2">
                          <span className="font-semibold">{lang.nativeName}</span>
                          <span className="text-[10px] text-slate-400">({lang.englishName})</span>
                        </div>
                        {language === lang.code && <Check className="w-3.5 h-3.5 text-blue-600" />}
                      </button>
                    ))}
                  </div>
                </>
              )}
            </div>

            {/* Desktop Action CTA: Portal Login */}

            {onOpenAuth && (
              <button
                type="button"
                onClick={onOpenAuth}
                className="hidden sm:inline-flex items-center justify-center gap-1.5 px-4 py-2 text-sm font-semibold text-white bg-blue-600 hover:bg-blue-700 active:bg-blue-800 rounded-lg shadow-sm hover:shadow-md hover:shadow-blue-500/25 transition-all focus:outline-none focus:ring-2 focus:ring-blue-500 cursor-pointer"
                title="Unified Governance & Citizen Authentication Portal"
              >
                <LogIn className="w-4 h-4 text-white" />
                <span>Portal Login</span>
              </button>
            )}

            {/* Mobile Hamburger Button */}
            <button
              type="button"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="md:hidden p-2 rounded-lg text-slate-600 hover:bg-slate-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
              aria-label="Toggle Mobile Menu"
            >
              {isMobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>

        {/* Mobile Navigation Drawer */}
        {isMobileMenuOpen && (
          <div className="md:hidden border-b border-slate-200 bg-white/98 backdrop-blur-lg px-4 pt-2 pb-6 space-y-3 shadow-xl animate-in slide-in-from-top duration-200">
            <nav className="flex flex-col space-y-2">
              <a
                href="#how-it-works"
                onClick={(e) => handleNavClick(e, 'how-it-works')}
                className="px-3 py-2 rounded-lg text-sm font-semibold text-slate-700 hover:bg-blue-50 hover:text-blue-700"
              >
                {t.navHowItWorks}
              </a>
              <a
                href="#citizen-voice"
                onClick={(e) => handleNavClick(e, 'citizen-voice')}
                className="px-3 py-2 rounded-lg text-sm font-semibold text-slate-700 hover:bg-blue-50 hover:text-blue-700"
              >
                {t.navCitizenVoice}
              </a>
              <a
                href="#intelligence"
                onClick={(e) => handleNavClick(e, 'intelligence')}
                className="px-3 py-2 rounded-lg text-sm font-semibold text-slate-700 hover:bg-blue-50 hover:text-blue-700"
              >
                {t.navInsights}
              </a>
              <a
                href="#policymakers"
                onClick={(e) => handleNavClick(e, 'policymakers')}
                className="px-3 py-2 rounded-lg text-sm font-semibold text-slate-700 hover:bg-blue-50 hover:text-blue-700"
              >
                {t.navPolicymakers}
              </a>
              <a
                href="#about"
                onClick={(e) => handleNavClick(e, 'about')}
                className="px-3 py-2 rounded-lg text-sm font-semibold text-slate-700 hover:bg-blue-50 hover:text-blue-700"
              >
                {t.navAbout}
              </a>
            </nav>

            <div className="pt-2 border-t border-slate-100 flex flex-col gap-2">
              {onOpenAuth && (
                <button
                  type="button"
                  onClick={() => {
                    setIsMobileMenuOpen(false);
                    onOpenAuth();
                  }}
                  className="w-full py-2.5 flex items-center justify-center gap-2 text-sm font-semibold text-white bg-blue-600 hover:bg-blue-700 rounded-lg shadow-sm transition-colors cursor-pointer"
                >
                  <LogIn className="w-4 h-4 text-white" />
                  <span>Portal Login (Officer &amp; Citizen)</span>
                </button>
              )}
            </div>
          </div>
        )}
      </header>
    </>
  );
};
