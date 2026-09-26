import React, { useState, useEffect } from 'react';
import { LanguageProvider } from './context/LanguageContext';
import { Navbar } from './components/Navbar';
import { Hero } from './components/Hero';
import { HowItWorks } from './components/HowItWorks';
import { CitizenVoiceFlow } from './components/CitizenVoiceFlow';
import { DemandIntelligence } from './components/DemandIntelligence';
import { PolicymakerSection } from './components/PolicymakerSection';
import { MultilingualSection } from './components/MultilingualSection';
import { ImpactStats } from './components/ImpactStats';
import { CtaBanner } from './components/CtaBanner';
import { Footer } from './components/Footer';
import { ShareNeedModal } from './components/ShareNeedModal';
import { AuthPage } from './components/AuthPage';
import { DemandCategory } from './types';
import { useAuth } from '../context/AuthContext';

export interface LandingPortalProps {
  onEnterPlatform: (role: 'CITIZEN' | 'POLICYMAKER') => void;
  initialView?: 'landing' | 'auth';
}

function JanSetuLandingContent({
  onEnterPlatform,
  initialView = 'landing',
}: LandingPortalProps) {
  const { loginAsDemoCitizen, loginAsDemoPolicymaker, loginAsGuest, loginWithGoogle } = useAuth();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentView, setCurrentView] = useState<'landing' | 'auth'>(initialView);

  useEffect(() => {
    setCurrentView(initialView);
  }, [initialView]);

  const scrollToSection = (id: string) => {
    if (currentView !== 'landing') {
      setCurrentView('landing');
      setTimeout(() => {
        const el = document.getElementById(id);
        if (el) {
          el.scrollIntoView({ behavior: 'smooth' });
        }
      }, 50);
      return;
    }

    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const handleHotspotSelection = (_category: DemandCategory) => {
    scrollToSection('policymakers');
  };

  const navigateToAuth = () => {
    setCurrentView('auth');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const navigateToLanding = () => {
    setCurrentView('landing');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleLoginSuccess = async (userInfo: { name: string; role: string; email: string; isGuest?: boolean }) => {
    const isOfficer =
      userInfo.role.toLowerCase().includes('officer') ||
      userInfo.role.toLowerCase().includes('policymaker') ||
      userInfo.email.includes('policymaker') ||
      userInfo.email.includes('gov.in') ||
      userInfo.email.includes('officer');

    if (userInfo.isGuest) {
      loginAsGuest(isOfficer ? 'POLICYMAKER' : 'CITIZEN');
      onEnterPlatform(isOfficer ? 'POLICYMAKER' : 'CITIZEN');
    } else {
      if (isOfficer) {
        await loginAsDemoPolicymaker();
        onEnterPlatform('POLICYMAKER');
      } else {
        await loginAsDemoCitizen();
        onEnterPlatform('CITIZEN');
      }
    }
  };

  const handleGuestLogin = (targetRole: 'CITIZEN' | 'POLICYMAKER') => {
    loginAsGuest(targetRole);
    onEnterPlatform(targetRole);
  };

  const handleGoogleLogin = (googleData: { name: string; email: string; role: 'CITIZEN' | 'POLICYMAKER' }) => {
    loginWithGoogle(googleData);
    onEnterPlatform(googleData.role);
  };

  if (currentView === 'auth') {
    return (
      <AuthPage
        onBackToHome={navigateToLanding}
        onLoginSuccess={handleLoginSuccess}
        onGuestLogin={handleGuestLogin}
        onGoogleLogin={handleGoogleLogin}
      />
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-[#FAFCFF] text-slate-900 font-sans">
      {/* Sticky Navigation */}
      <Navbar
        onOpenModal={() => setIsModalOpen(true)}
        onOpenAuth={navigateToAuth}
      />

      {/* Main Content Sections */}
      <main className="flex-1">
        {/* Hero Section */}
        <Hero
          onOpenModal={() => setIsModalOpen(true)}
          onOpenAuth={navigateToAuth}
          onScrollToSection={scrollToSection}
        />

        {/* Section 2: The Intelligence Pipeline */}
        <div id="how-it-works">
          <HowItWorks />
        </div>

        {/* Section: Citizen Voice to Structured Intelligence */}
        <div id="citizen-voice">
          <CitizenVoiceFlow />
        </div>

        {/* Section 3: Demand Hotspots & Heatmap */}
        <div id="intelligence">
          <DemandIntelligence onSelectHotspotForDossier={handleHotspotSelection} />
        </div>

        {/* Section 4: Policymaker Decision Support Architecture */}
        <div id="policymakers">
          <PolicymakerSection
            onOpenRequestModal={() => setIsModalOpen(true)}
          />
        </div>

        {/* Section 5: Multilingual Voice & Accessibility */}
        <div id="languages">
          <MultilingualSection
            onOpenModalWithVoice={() => setIsModalOpen(true)}
          />
        </div>

        {/* Section 6: Scale & Reach Impact */}
        <div id="about">
          <ImpactStats />
        </div>

        {/* Final CTA Banner */}
        <CtaBanner
          onOpenModal={() => setIsModalOpen(true)}
          onOpenAuth={navigateToAuth}
          onScrollToSection={scrollToSection}
        />
      </main>

      {/* Footer */}
      <Footer />

      {/* Citizen Request Modal */}
      <ShareNeedModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSuccessSubmission={(_sub) => {
          setIsModalOpen(false);
          onEnterPlatform('CITIZEN');
        }}
      />
    </div>
  );
}

export const LandingPortal: React.FC<LandingPortalProps> = (props) => {
  return (
    <LanguageProvider>
      <JanSetuLandingContent {...props} />
    </LanguageProvider>
  );
};
