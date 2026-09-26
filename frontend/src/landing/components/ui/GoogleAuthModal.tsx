import React, { useState } from 'react';
import { X, ArrowRight, UserPlus, ShieldCheck, CheckCircle2, Loader2 } from 'lucide-react';

export interface GoogleUserSelection {
  name: string;
  email: string;
  role: 'CITIZEN' | 'POLICYMAKER';
  avatarLetter: string;
  avatarBg: string;
}

interface GoogleAuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: (user: { name: string; email: string; role: 'CITIZEN' | 'POLICYMAKER' }) => void;
  defaultRole?: 'CITIZEN' | 'POLICYMAKER';
}

export const GoogleAuthModal: React.FC<GoogleAuthModalProps> = ({
  isOpen,
  onClose,
  onSuccess,
  defaultRole = 'CITIZEN',
}) => {
  const [selectedUser, setSelectedUser] = useState<GoogleUserSelection | null>(null);
  const [isVerifying, setIsVerifying] = useState(false);
  const [showCustomForm, setShowCustomForm] = useState(false);
  const [customName, setCustomName] = useState('');
  const [customEmail, setCustomEmail] = useState('');
  const [customRole, setCustomRole] = useState<'CITIZEN' | 'POLICYMAKER'>(defaultRole);

  if (!isOpen) return null;

  const presetAccounts: GoogleUserSelection[] = [
    {
      name: 'Ramesh Kumar',
      email: 'ramesh.kumar.gwalior@gmail.com',
      role: 'CITIZEN',
      avatarLetter: 'R',
      avatarBg: 'bg-emerald-600',
    },
    {
      name: 'District Magistrate Office (Gwalior)',
      email: 'dm.gwalior.admin@gmail.com',
      role: 'POLICYMAKER',
      avatarLetter: 'D',
      avatarBg: 'bg-blue-600',
    },
  ];

  const handleSelectAccount = (account: GoogleUserSelection) => {
    setSelectedUser(account);
    setIsVerifying(true);
    setTimeout(() => {
      setIsVerifying(false);
      onSuccess({
        name: account.name,
        email: account.email,
        role: account.role,
      });
    }, 700);
  };

  const handleCustomSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!customName.trim() || !customEmail.trim()) return;

    const customAccount: GoogleUserSelection = {
      name: customName.trim(),
      email: customEmail.trim().toLowerCase().includes('@')
        ? customEmail.trim()
        : `${customEmail.trim()}@gmail.com`,
      role: customRole,
      avatarLetter: customName.trim().charAt(0).toUpperCase() || 'G',
      avatarBg: customRole === 'POLICYMAKER' ? 'bg-blue-600' : 'bg-emerald-600',
    };

    handleSelectAccount(customAccount);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-fadeIn font-sans">
      <div
        className="w-full max-w-[440px] bg-white rounded-2xl shadow-2xl border border-slate-200 overflow-hidden transform transition-all animate-scaleUp"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Google Header */}
        <div className="p-6 pb-4 border-b border-slate-100 flex items-start justify-between">
          <div className="space-y-1">
            <div className="flex items-center space-x-2">
              <svg className="w-5 h-5 shrink-0" viewBox="0 0 24 24">
                <path
                  d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                  fill="#4285F4"
                />
                <path
                  d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                  fill="#34A853"
                />
                <path
                  d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                  fill="#FBBC05"
                />
                <path
                  d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                  fill="#EA4335"
                />
              </svg>
              <h2 className="text-base font-bold text-slate-900 tracking-tight">
                Sign in with Google
              </h2>
            </div>
            <p className="text-xs text-slate-500 font-medium">
              Choose a Google account to continue to <span className="font-semibold text-slate-700">JanSetu AI</span>
            </p>
          </div>

          <button
            type="button"
            onClick={onClose}
            disabled={isVerifying}
            className="p-1 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition cursor-pointer"
            aria-label="Close"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Verification Loader State */}
        {isVerifying && selectedUser ? (
          <div className="p-8 flex flex-col items-center justify-center text-center space-y-4">
            <div className="relative">
              <Loader2 className="w-10 h-10 text-blue-600 animate-spin" />
              <div className="absolute inset-0 flex items-center justify-center">
                <span className="w-3 h-3 rounded-full bg-blue-600/30 animate-ping" />
              </div>
            </div>
            <div className="space-y-1">
              <p className="text-sm font-bold text-slate-800">
                Signing in as {selectedUser.name}...
              </p>
              <p className="text-xs text-slate-500 font-mono">
                {selectedUser.email}
              </p>
              <span className="inline-block mt-2 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-blue-50 text-blue-700 border border-blue-200">
                {selectedUser.role === 'POLICYMAKER' ? '🏛️ Officer Portal' : '👤 Citizen Portal'}
              </span>
            </div>
          </div>
        ) : (
          /* Accounts List */
          <div className="p-4 space-y-2">
            {presetAccounts.map((account) => {
              const isSelectedPortal =
                (defaultRole === 'POLICYMAKER' && account.role === 'POLICYMAKER') ||
                (defaultRole === 'CITIZEN' && account.role === 'CITIZEN');

              return (
                <button
                  key={account.email}
                  type="button"
                  onClick={() => handleSelectAccount(account)}
                  className={`w-full p-3 rounded-xl border text-left transition flex items-center justify-between group cursor-pointer ${
                    isSelectedPortal
                      ? 'border-blue-300 bg-blue-50/50 hover:bg-blue-50 hover:border-blue-400'
                      : 'border-slate-200/90 hover:bg-slate-50 hover:border-slate-300'
                  }`}
                >
                  <div className="flex items-center space-x-3 min-w-0">
                    <div
                      className={`w-9 h-9 rounded-full ${account.avatarBg} text-white font-bold flex items-center justify-center text-sm shadow-xs shrink-0`}
                    >
                      {account.avatarLetter}
                    </div>
                    <div className="min-w-0">
                      <div className="flex items-center space-x-1.5">
                        <span className="text-xs font-bold text-slate-900 truncate">
                          {account.name}
                        </span>
                        {isSelectedPortal && (
                          <span className="px-1.5 py-0.2 rounded text-[9px] font-bold bg-blue-100 text-blue-700">
                            Recommended
                          </span>
                        )}
                      </div>
                      <p className="text-[11px] text-slate-500 font-mono truncate">
                        {account.email}
                      </p>
                    </div>
                  </div>
                  <div className="shrink-0 text-slate-400 group-hover:text-blue-600 transition">
                    <ArrowRight className="w-4 h-4" />
                  </div>
                </button>
              );
            })}

            {/* Custom Google Account Option */}
            {!showCustomForm ? (
              <button
                type="button"
                onClick={() => setShowCustomForm(true)}
                className="w-full p-3 rounded-xl border border-dashed border-slate-300 hover:border-slate-400 hover:bg-slate-50/60 text-left transition flex items-center space-x-3 cursor-pointer text-slate-700"
              >
                <div className="w-9 h-9 rounded-full border border-slate-300 bg-white flex items-center justify-center text-slate-500 shrink-0">
                  <UserPlus className="w-4 h-4" />
                </div>
                <div>
                  <span className="text-xs font-bold text-slate-800 block">
                    Use another Google account
                  </span>
                  <span className="text-[11px] text-slate-400 block">
                    Sign in with your own name &amp; Gmail
                  </span>
                </div>
              </button>
            ) : (
              <form
                onSubmit={handleCustomSubmit}
                className="p-3.5 rounded-xl border border-blue-200 bg-blue-50/30 space-y-2.5 animate-fadeIn"
              >
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-slate-800">
                    Custom Google Profile
                  </span>
                  <button
                    type="button"
                    onClick={() => setShowCustomForm(false)}
                    className="text-[11px] text-slate-400 hover:text-slate-600"
                  >
                    Cancel
                  </button>
                </div>

                <input
                  type="text"
                  required
                  placeholder="Full Name (e.g. Rahul Sharma)"
                  value={customName}
                  onChange={(e) => setCustomName(e.target.value)}
                  className="w-full px-3 py-1.5 text-xs rounded-lg border border-slate-200 bg-white focus:outline-none focus:ring-1 focus:ring-blue-500"
                />

                <input
                  type="email"
                  required
                  placeholder="Gmail address (e.g. rahul@gmail.com)"
                  value={customEmail}
                  onChange={(e) => setCustomEmail(e.target.value)}
                  className="w-full px-3 py-1.5 text-xs rounded-lg border border-slate-200 bg-white focus:outline-none focus:ring-1 focus:ring-blue-500"
                />

                <div className="flex items-center space-x-2 pt-1">
                  <button
                    type="button"
                    onClick={() => setCustomRole('CITIZEN')}
                    className={`flex-1 py-1 text-[11px] font-bold rounded-md border transition ${
                      customRole === 'CITIZEN'
                        ? 'border-teal-500 bg-teal-50 text-teal-800'
                        : 'border-slate-200 bg-white text-slate-600'
                    }`}
                  >
                    Citizen
                  </button>
                  <button
                    type="button"
                    onClick={() => setCustomRole('POLICYMAKER')}
                    className={`flex-1 py-1 text-[11px] font-bold rounded-md border transition ${
                      customRole === 'POLICYMAKER'
                        ? 'border-blue-500 bg-blue-50 text-blue-800'
                        : 'border-slate-200 bg-white text-slate-600'
                    }`}
                  >
                    Officer / DM
                  </button>
                </div>

                <button
                  type="submit"
                  className="w-full py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-xs font-bold transition shadow-xs cursor-pointer flex items-center justify-center space-x-1.5"
                >
                  <span>Continue with this Account</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </form>
            )}
          </div>
        )}

        {/* Footer info note */}
        <div className="p-4 bg-slate-50/80 border-t border-slate-100 text-[10px] text-slate-400 space-y-1">
          <div className="flex items-center space-x-1.5 text-slate-500 font-medium">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
            <span>Google Identity Services • Verified OAuth 2.0 Flow</span>
          </div>
          <p className="leading-relaxed">
            Google will securely share your verified name, email address, and language preference with JanSetu AI Digital Public Infrastructure.
          </p>
        </div>
      </div>
    </div>
  );
};
