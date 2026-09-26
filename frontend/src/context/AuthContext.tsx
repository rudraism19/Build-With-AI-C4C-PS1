import React, { createContext, useContext, useState, useEffect } from 'react';
import { Session } from '@supabase/supabase-js';
import { User, UserRole } from '../types';
import { authService } from '../services/api';
import {
  supabase,
  signInWithGoogleOAuth,
  signOutSupabase,
} from '../services/supabase';

interface AuthContextType {
  user: User | null;
  role: UserRole;
  token: string | null;
  isLoading: boolean;
  loginAsDemoCitizen: () => Promise<void>;
  loginAsDemoPolicymaker: () => Promise<void>;
  loginAsGuest: (targetRole: UserRole) => void;
  loginWithGoogle: (googleData: { name: string; email: string; role: UserRole }) => void;
  loginWithGoogleOAuth: (targetRole?: UserRole) => Promise<void>;
  logout: () => void;
  setRole: (role: UserRole) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [role, setRole] = useState<UserRole>('CITIZEN');
  const [token, setToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Helper to process authenticated Supabase user session (e.g. from Google OAuth)
  const processSupabaseSession = async (session: Session) => {
    try {
      const savedRole =
        (localStorage.getItem('jansetu_oauth_target_role') as UserRole) ||
        (session.user.user_metadata?.role as UserRole) ||
        'CITIZEN';

      const email = session.user.email || '';
      const fullName =
        session.user.user_metadata?.full_name ||
        session.user.user_metadata?.name ||
        email.split('@')[0] ||
        'Google User';

      const googleUser: User = {
        id: session.user.id,
        email: email,
        name: fullName,
        role: savedRole,
      };

      setUser(googleUser);
      setRole(savedRole);
      setToken(session.access_token);

      localStorage.setItem('jansetu_token', session.access_token);
      localStorage.setItem('jansetu_user', JSON.stringify(googleUser));
      localStorage.setItem('jansetu_oauth_provider', 'supabase_google');

      // Clean the OAuth callback URL hash from browser address bar
      if (window.location.hash && (window.location.hash.includes('access_token') || window.location.hash.includes('error'))) {
        window.history.replaceState(null, '', window.location.pathname + window.location.search);
      }

      // Sync user profile in background with NestJS backend
      try {
        await authService.syncOAuthUser(session.access_token, savedRole);
      } catch (err) {
        console.warn('Backend profile sync note:', err);
      }
    } catch (err) {
      console.error('Failed to process Supabase session:', err);
    }
  };

  useEffect(() => {
    // 1. Restore local session if available
    const savedToken = localStorage.getItem('jansetu_token');
    const savedUser = authService.getCurrentUser();

    if (savedToken && savedUser) {
      setToken(savedToken);
      setUser(savedUser);
      setRole(savedUser.role || 'CITIZEN');
    }

    // 2. Check active Supabase session (especially useful upon returning from Google OAuth redirect)
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session?.user) {
        processSupabaseSession(session);
      }
      setIsLoading(false);
    }).catch((err) => {
      console.warn('Supabase getSession error:', err);
      setIsLoading(false);
    });

    // 3. Listen to Supabase Auth state changes in real time
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(async (event, session) => {
      if ((event === 'SIGNED_IN' || event === 'TOKEN_REFRESHED') && session?.user) {
        await processSupabaseSession(session);
      } else if (event === 'SIGNED_OUT') {
        const isSupabaseOAuth = localStorage.getItem('jansetu_oauth_provider') === 'supabase_google';
        if (isSupabaseOAuth) {
          logout();
        }
      }
    });

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  /**
   * Real Supabase Google OAuth sign-in flow.
   * Redirects user to Google OAuth screen and returns them to JanSetu with verified token.
   */
  const loginWithGoogleOAuth = async (targetRole: UserRole = 'CITIZEN') => {
    setIsLoading(true);
    try {
      await signInWithGoogleOAuth(targetRole);
    } catch (err) {
      console.error('Google OAuth error:', err);
      setIsLoading(false);
      throw err;
    }
  };

  const loginAsDemoCitizen = async () => {
    try {
      setIsLoading(true);
      const res = await authService.login('citizen.gwalior@jansetu.gov.in', 'Citizen@2026');
      if (res?.access_token) {
        setToken(res.access_token);
        setUser(res.user);
        setRole('CITIZEN');
      }
    } catch (err) {
      console.warn('Demo citizen direct login fallback:', err);
      const fallbackCitizen: User = {
        id: '6e6fcdd0-2f09-4ca0-9011-66cd35df3830',
        email: 'citizen.gwalior@jansetu.gov.in',
        name: 'Ramesh Kumar (Ward 22 Morar)',
        role: 'CITIZEN',
      };
      setUser(fallbackCitizen);
      setRole('CITIZEN');
    } finally {
      setIsLoading(false);
    }
  };

  const loginAsDemoPolicymaker = async () => {
    try {
      setIsLoading(true);
      const res = await authService.login('policymaker.gwalior@jansetu.gov.in', 'Policymaker@2026');
      if (res?.access_token) {
        setToken(res.access_token);
        setUser(res.user);
        setRole('POLICYMAKER');
      }
    } catch (err) {
      console.warn('Demo policymaker direct login fallback:', err);
      const fallbackPM: User = {
        id: '07fddf93-405a-452e-b938-4ff17da58de6',
        email: 'policymaker.gwalior@jansetu.gov.in',
        name: 'District Magistrate Office (Gwalior)',
        role: 'POLICYMAKER',
      };
      setUser(fallbackPM);
      setRole('POLICYMAKER');
    } finally {
      setIsLoading(false);
    }
  };

  const loginAsGuest = (targetRole: UserRole) => {
    setIsLoading(true);
    if (targetRole === 'POLICYMAKER') {
      const guestPM: User = {
        id: '07fddf93-405a-452e-b938-4ff17da58de6',
        email: 'guest.officer@jansetu.gov.in',
        name: 'District Magistrate Office (Guest Officer)',
        role: 'POLICYMAKER',
      };
      setUser(guestPM);
      setRole('POLICYMAKER');
      setToken('guest_token_pm_2026');
      localStorage.setItem('jansetu_token', 'guest_token_pm_2026');
      localStorage.setItem('jansetu_user', JSON.stringify(guestPM));
    } else {
      const guestCitizen: User = {
        id: '6e6fcdd0-2f09-4ca0-9011-66cd35df3830',
        email: 'guest.citizen@jansetu.gov.in',
        name: 'Ramesh Kumar (Guest Citizen - Ward 22)',
        role: 'CITIZEN',
      };
      setUser(guestCitizen);
      setRole('CITIZEN');
      setToken('guest_token_citizen_2026');
      localStorage.setItem('jansetu_token', 'guest_token_citizen_2026');
      localStorage.setItem('jansetu_user', JSON.stringify(guestCitizen));
    }
    setIsLoading(false);
  };

  const loginWithGoogle = (googleData: { name: string; email: string; role: UserRole }) => {
    setIsLoading(true);
    const googleId = googleData.role === 'POLICYMAKER'
      ? '07fddf93-405a-452e-b938-4ff17da58de6'
      : '6e6fcdd0-2f09-4ca0-9011-66cd35df3830';

    const googleUser: User = {
      id: googleId,
      email: googleData.email,
      name: `${googleData.name}`,
      role: googleData.role,
    };

    const token = `google_oauth_${Date.now()}`;
    setUser(googleUser);
    setRole(googleData.role);
    setToken(token);
    localStorage.setItem('jansetu_token', token);
    localStorage.setItem('jansetu_user', JSON.stringify(googleUser));
    setIsLoading(false);
  };

  const logout = () => {
    authService.logout();
    signOutSupabase();
    localStorage.removeItem('jansetu_user');
    localStorage.removeItem('jansetu_token');
    localStorage.removeItem('jansetu_oauth_target_role');
    localStorage.removeItem('jansetu_oauth_provider');
    setUser(null);
    setToken(null);
    setRole('CITIZEN');
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        role,
        token,
        isLoading,
        loginAsDemoCitizen,
        loginAsDemoPolicymaker,
        loginAsGuest,
        loginWithGoogle,
        loginWithGoogleOAuth,
        logout,
        setRole,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
