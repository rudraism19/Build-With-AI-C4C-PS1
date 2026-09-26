import React, { createContext, useContext, useState, useEffect } from 'react';
import { User, UserRole } from '../types';
import { authService } from '../services/api';

interface AuthContextType {
  user: User | null;
  role: UserRole;
  token: string | null;
  isLoading: boolean;
  loginAsDemoCitizen: () => Promise<void>;
  loginAsDemoPolicymaker: () => Promise<void>;
  loginAsGuest: (targetRole: UserRole) => void;
  loginWithGoogle: (googleData: { name: string; email: string; role: UserRole }) => void;
  logout: () => void;
  setRole: (role: UserRole) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [role, setRole] = useState<UserRole>('CITIZEN');
  const [token, setToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const savedToken = localStorage.getItem('jansetu_token');
    const savedUser = authService.getCurrentUser();

    if (savedToken && savedUser) {
      setToken(savedToken);
      setUser(savedUser);
      setRole(savedUser.role || 'CITIZEN');
    }
    // Landing page is shown first; user explicitly authenticates or continues as guest
    setIsLoading(false);
  }, []);

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
      // Fallback local mock user if network is initializing
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
    localStorage.removeItem('jansetu_user');
    localStorage.removeItem('jansetu_token');
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
