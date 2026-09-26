import React, { useState, useEffect } from 'react';
import { AuthProvider, useAuth } from './context/AuthContext';
import { TopBar } from './components/common/TopBar';
import { LiveGazette } from './components/common/LiveGazette';
import { Sidebar } from './components/common/Sidebar';
import { Footer } from './components/common/Footer';
import { CivicIntelligenceOverview } from './components/intelligence/CivicIntelligenceOverview';
import { CitizenDashboard } from './components/citizen/CitizenDashboard';
import { GovPortalHome } from './components/citizen/GovPortalHome';
import { GrievanceForm } from './components/citizen/GrievanceForm';
import { GrievanceTracker } from './components/citizen/GrievanceTracker';
import { GwaliorGisMapView } from './components/gis/GwaliorGisMapView';
import { PriorityMatrixView } from './components/priorities/PriorityMatrixView';
import { PolicySchemesView } from './components/schemes/PolicySchemesView';
import { SmartCityProjectsView } from './components/projects/SmartCityProjectsView';
import { DprStudioView } from './components/dpr/DprStudioView';
import { CommunityFeed } from './components/citizen/CommunityFeed';
import { DataSourcesSection } from './components/common/DataSourcesSection';
import { LandingPortal } from './landing/LandingPortal';
import { Complaint } from './types';

export const AppContent: React.FC = () => {
  const { role, user, logout } = useAuth();
  const [currentSection, setCurrentSection] = useState<string>('landing');
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState<boolean>(false);
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState<boolean>(false);
  const [lastCreatedComplaint, setLastCreatedComplaint] = useState<Complaint | null>(null);
  const [complaintsCount, setComplaintsCount] = useState<number>(3);
  const [selectedWardForDpr, setSelectedWardForDpr] = useState<any>(null);

  // Auto-switch default home view when role changes
  useEffect(() => {
    if (role === 'CITIZEN' && currentSection === 'civic-intelligence') {
      setCurrentSection('citizen-home');
    } else if (role === 'POLICYMAKER' && currentSection === 'citizen-home') {
      setCurrentSection('civic-intelligence');
    }
  }, [role]);

  const citizenAllowedSections = ['citizen-home', 'file', 'history', 'map', 'feed'];
  const policymakerAllowedSections = [
    'civic-intelligence',
    'assistant',
    'history',
    'map',
    'priorities',
    'schemes',
    'projects',
    'dpr',
    'settings',
  ];

  const handleNavigate = (section: string) => {
    // If not authenticated or already on landing/auth, allow landing/auth transitions
    if (section === 'landing' || section === 'auth') {
      setCurrentSection(section);
      setIsMobileSidebarOpen(false);
      window.scrollTo({ top: 0, behavior: 'smooth' });
      return;
    }

    // Strict Cadre Isolation: prevent cross-portal access
    if (role === 'CITIZEN' && !citizenAllowedSections.includes(section)) {
      console.warn(`Access denied to '${section}' for CITIZEN role. Redirecting to citizen-home.`);
      setCurrentSection('citizen-home');
      setIsMobileSidebarOpen(false);
      return;
    }
    if (role === 'POLICYMAKER' && !policymakerAllowedSections.includes(section)) {
      console.warn(`Access denied to '${section}' for POLICYMAKER role. Redirecting to civic-intelligence.`);
      setCurrentSection('civic-intelligence');
      setIsMobileSidebarOpen(false);
      return;
    }

    setCurrentSection(section);
    setIsMobileSidebarOpen(false);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleDprAction = (item: any) => {
    setSelectedWardForDpr(item);
    setCurrentSection('dpr');
    setIsMobileSidebarOpen(false);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleToggleSidebar = () => {
    if (typeof window !== 'undefined' && window.innerWidth < 1024) {
      setIsMobileSidebarOpen((prev) => !prev);
    } else {
      setIsSidebarCollapsed((prev) => !prev);
    }
  };

  const homeSection = role === 'CITIZEN' ? 'citizen-home' : 'civic-intelligence';

  // Render standalone Landing Page or Login/Auth Portal without dashboard shell
  if (currentSection === 'landing' || currentSection === 'auth') {
    return (
      <LandingPortal
        initialView={currentSection === 'auth' ? 'auth' : 'landing'}
        onEnterPlatform={(selectedRole) => {
          if (selectedRole === 'POLICYMAKER') {
            setCurrentSection('civic-intelligence');
          } else {
            setCurrentSection('citizen-home');
          }
        }}
      />
    );
  }

  return (
    <div className="min-h-screen bg-[#f8fafc] text-slate-900 flex font-sans">
      {/* 1. Left Sidebar with role-tailored navigation */}
      <Sidebar
        currentSection={currentSection}
        onNavigate={handleNavigate}
        onNewGrievance={() => handleNavigate('file')}
        isMobileOpen={isMobileSidebarOpen}
        onCloseMobile={() => setIsMobileSidebarOpen(false)}
        isCollapsed={isSidebarCollapsed}
        onToggleCollapse={() => setIsSidebarCollapsed(!isSidebarCollapsed)}
      />

      {/* 2. Main Content Layout */}
      <div
        className={`flex-1 flex flex-col min-w-0 transition-all duration-300 ease-[cubic-bezier(0.16,1,0.3,1)] ${
          isSidebarCollapsed ? 'lg:pl-16' : 'lg:pl-72'
        }`}
      >
        {/* Top Header Bar */}
        <TopBar
          onToggleSidebar={handleToggleSidebar}
          isSidebarCollapsed={isSidebarCollapsed}
          onOpenHistory={() => handleNavigate('history')}
          onReset={() => handleNavigate(homeSection)}
          historyCount={complaintsCount}
          onLogout={() => {
            logout();
            setCurrentSection('landing');
          }}
        />


        {/* Dynamic Center Stage with Smooth Fade In Transition */}
        <main
          key={currentSection}
          className="flex-1 max-w-7xl w-full mx-auto px-3 sm:px-6 lg:px-8 py-5 sm:py-6 animate-fadeIn"
        >
          {/* Simple, User-Friendly Citizen Dashboard */}
          {currentSection === 'citizen-home' && (
            <CitizenDashboard
              onNavigate={handleNavigate}
              onFileGrievance={() => handleNavigate('file')}
              onTrackGrievance={() => handleNavigate('history')}
              onViewWardMap={() => handleNavigate('map')}
            />
          )}

          {/* Policymaker Executive Command Suite */}
          {currentSection === 'civic-intelligence' && (
            <CivicIntelligenceOverview
              onNavigate={handleNavigate}
              onDprAction={handleDprAction}
              recentComplaint={lastCreatedComplaint}
              complaintsCount={complaintsCount}
            />
          )}

          {/* Assistant Home */}
          {currentSection === 'assistant' && (
            <GovPortalHome
              onOpenFileGrievance={() => handleNavigate('file')}
              onOpenTrackGrievance={() => handleNavigate('history')}
              onOpenMap={() => handleNavigate('map')}
              onOpenPriorities={() => handleNavigate('priorities')}
              onOpenSchemes={() => handleNavigate('schemes')}
              onOpenDPR={() => handleNavigate('dpr')}
            />
          )}

          {/* Grievance Submission Form */}
          {currentSection === 'file' && (
            <div className="max-w-4xl mx-auto space-y-4">
              <div className="flex items-center justify-between">
                <button
                  onClick={() => handleNavigate(homeSection)}
                  className="text-xs text-sky-700 font-bold hover:underline cursor-pointer"
                >
                  ← Back to {role === 'CITIZEN' ? 'Citizen Dashboard' : 'Overview'}
                </button>
                <span className="text-xs text-slate-400">Gwalior Municipal Corporation</span>
              </div>
              <GrievanceForm
                onComplaintCreated={(comp) => {
                  setLastCreatedComplaint(comp);
                  setComplaintsCount((prev) => prev + 1);
                  handleNavigate('history');
                }}
              />
            </div>
          )}

          {/* Grievance History / Demands Tracker */}
          {currentSection === 'history' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <button
                  onClick={() => handleNavigate(homeSection)}
                  className="text-xs text-sky-700 font-bold hover:underline cursor-pointer"
                >
                  ← Back to {role === 'CITIZEN' ? 'Citizen Dashboard' : 'Overview'}
                </button>
                <button
                  onClick={() => handleNavigate('file')}
                  className="px-3.5 py-1.5 bg-sky-700 hover:bg-sky-800 text-white rounded-xl text-xs font-bold shadow-2xs cursor-pointer transition"
                >
                  + Report New Issue
                </button>
              </div>
              <GrievanceTracker
                newlyCreatedComplaint={lastCreatedComplaint}
                onNavigate={handleNavigate}
                onDprAction={handleDprAction}
                onComplaintsCountChange={(count) => setComplaintsCount(count)}
              />
            </div>
          )}

          {/* GIS Spatial Hotspots Map */}
          {currentSection === 'map' && (
            <div className="space-y-4">
              <button
                onClick={() => handleNavigate(homeSection)}
                className="text-xs text-sky-700 font-bold hover:underline cursor-pointer"
              >
                ← Back to {role === 'CITIZEN' ? 'Citizen Dashboard' : 'Overview'}
              </button>
              <GwaliorGisMapView onGenerateDPRForHotspot={handleDprAction} />
            </div>
          )}

          {/* 5-Factor Priority Matrix */}
          {currentSection === 'priorities' && (
            <div className="space-y-4">
              <button
                onClick={() => handleNavigate(homeSection)}
                className="text-xs text-sky-700 font-bold hover:underline cursor-pointer"
              >
                ← Back to Overview
              </button>
              <PriorityMatrixView onGenerateDPRForWard={handleDprAction} />
            </div>
          )}

          {/* Policy Schemes Knowledge Base (pgvector) */}
          {currentSection === 'schemes' && (
            <div className="space-y-4">
              <button
                onClick={() => handleNavigate(homeSection)}
                className="text-xs text-sky-700 font-bold hover:underline cursor-pointer"
              >
                ← Back to Overview
              </button>
              <PolicySchemesView />
            </div>
          )}

          {/* Smart City Projects (70 Projects) */}
          {currentSection === 'projects' && (
            <div className="space-y-4">
              <button
                onClick={() => handleNavigate(homeSection)}
                className="text-xs text-sky-700 font-bold hover:underline cursor-pointer"
              >
                ← Back to Overview
              </button>
              <SmartCityProjectsView />
            </div>
          )}

          {/* AI-Assisted DPR Draft Studio */}
          {currentSection === 'dpr' && (
            <div className="space-y-4">
              <button
                onClick={() => handleNavigate(homeSection)}
                className="text-xs text-sky-700 font-bold hover:underline cursor-pointer"
              >
                ← Back to Overview
              </button>
              <DprStudioView initialWard={selectedWardForDpr} />
            </div>
          )}

          {/* Community Feed */}
          {currentSection === 'feed' && (
            <div className="space-y-4">
              <button
                onClick={() => handleNavigate(homeSection)}
                className="text-xs text-sky-700 font-bold hover:underline cursor-pointer"
              >
                ← Back to {role === 'CITIZEN' ? 'Citizen Dashboard' : 'Overview'}
              </button>
              <CommunityFeed />
            </div>
          )}

          {/* Settings & Data Governance */}
          {currentSection === 'settings' && (
            <div className="space-y-4">
              <button
                onClick={() => handleNavigate(homeSection)}
                className="text-xs text-sky-700 font-bold hover:underline cursor-pointer"
              >
                ← Back to Overview
              </button>
              <DataSourcesSection />
            </div>
          )}
        </main>

        {/* Clean Light Footer */}
        <Footer />
      </div>
    </div>
  );
};

export const App: React.FC = () => {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
};

export default App;
