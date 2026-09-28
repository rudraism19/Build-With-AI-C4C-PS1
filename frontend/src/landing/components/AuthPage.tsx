import React from 'react';
import AuthSwitch from './ui/auth-switch';
import { ArrowLeft } from 'lucide-react';

interface AuthPageProps {
  onBackToHome: () => void;
  onLoginSuccess?: (user: { name: string; role: string; email: string; isGuest?: boolean }) => void;
  onGuestLogin?: (role: 'CITIZEN' | 'POLICYMAKER') => void;
  onGoogleLogin?: (user: { name: string; email: string; role: 'CITIZEN' | 'POLICYMAKER' }) => void;
}

export const AuthPage: React.FC<AuthPageProps> = ({
  onBackToHome,
  onLoginSuccess,
  onGuestLogin,
  onGoogleLogin,
}) => {
  return (
    <div className="min-h-screen w-full max-w-full overflow-x-hidden flex flex-col bg-white text-slate-900 select-none relative font-sans">
      {/* Sleek Thin Tricolor Accent Strip */}
      <div className="h-1 w-full bg-gradient-to-r from-[#FF9933] via-white to-[#138808] shrink-0 z-50 shadow-2xs" />

      {/* Ultra-Compact High-Set Top Bar */}
      <header className="w-full h-11 bg-white/95 border-b border-slate-200/80 backdrop-blur-md px-3 sm:px-6 flex items-center justify-between shrink-0 z-30 sticky top-0">
        {/* Back to Home Button */}
        <button
          type="button"
          onClick={onBackToHome}
          className="flex items-center gap-1.5 text-[11px] font-semibold text-slate-700 hover:text-slate-900 bg-slate-100 hover:bg-slate-200/80 active:bg-slate-200 px-2.5 py-1.5 rounded-md border border-slate-200 transition-colors cursor-pointer focus:outline-none focus:ring-1 focus:ring-blue-500 shadow-2xs"
          aria-label="Back to JanSetu AI landing page"
        >
          <ArrowLeft className="w-3 h-3 text-blue-600" />
          <span>Back to Home</span>
        </button>

        {/* Clean Shrunk Logo */}
        <div className="flex items-center gap-1.5">
          <div className="w-5 h-5 rounded-md bg-gradient-to-tr from-blue-700 via-blue-600 to-indigo-600 flex items-center justify-center shadow-2xs">
            <svg
              className="w-3 h-3 text-white"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
              <circle cx="9" cy="7" r="4" />
              <path d="M22 21v-2a4 4 0 0 0-3-3.87" />
              <path d="M16 3.13a4 4 0 0 1 0 7.75" />
              <circle cx="19" cy="8" r="1.5" fill="#FF9933" stroke="none" />
            </svg>
          </div>
          <div className="flex items-center gap-1">
            <span className="text-sm font-bold tracking-tight text-slate-900">JanSetu</span>
            <span className="px-1 py-0.1 text-[9px] font-extrabold bg-blue-50 text-blue-600 rounded border border-blue-200">
              AI
            </span>
          </div>
        </div>

        {/* Spacer for clean balance */}
        <div className="w-20 hidden sm:block" />
      </header>

      {/* Main Full-Screen Area with comfortable scrolling on small screens and vertical centering on large */}
      <main className="flex-1 w-full max-w-full flex flex-col items-center justify-center px-3 sm:px-4 py-4 sm:py-6 overflow-y-auto relative">
        {/* Soft Ambient Radial Light Glow */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[550px] h-[300px] bg-blue-100/50 blur-[120px] pointer-events-none rounded-full" />

        {/* AuthSwitch Component with Dual Portals and Google Sign-in */}
        <div className="w-full max-w-[880px] z-10 flex flex-col items-center justify-center my-auto">
          <AuthSwitch
            onLoginSuccess={onLoginSuccess}
            onGuestLogin={onGuestLogin}
            onGoogleLogin={onGoogleLogin}
          />
        </div>
      </main>

      {/* Slim Clean Footer */}
      <footer className="h-8 shrink-0 bg-white border-t border-slate-100 px-4 flex items-center justify-center text-[10px] text-slate-400 z-30">
        <span>JanSetu AI • Digital Public Infrastructure for Citizen Voice &amp; Governance</span>
      </footer>
    </div>
  );
};
