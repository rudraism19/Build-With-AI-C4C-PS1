import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import {
  Plus,
  Search,
  MessageSquare,
  Activity,
  Shield,
  Layers,
  BarChart3,
  BookOpen,
  Building,
  FileCheck2,
  Settings,
  ChevronLeft,
  ChevronRight,
  ExternalLink,
  Trash2,
  MapPin,
  Sparkles,
  Home,
  PlusCircle,
  Clock,
  Users,
  LogOut,
  X,
  Database,
} from 'lucide-react';

interface SidebarProps {
  currentSection: string;
  onNavigate: (section: string) => void;
  onNewGrievance: () => void;
  isMobileOpen: boolean;
  onCloseMobile: () => void;
  isCollapsed: boolean;
  onToggleCollapse: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({
  currentSection,
  onNavigate,
  onNewGrievance,
  isMobileOpen,
  onCloseMobile,
  isCollapsed,
  onToggleCollapse,
}) => {
  const { role, user, logout } = useAuth();

  // Grouped policymaker navigation
  const policymakerNavGroups = [
    {
      groupTitle: 'CIVIC INTELLIGENCE',
      items: [
        { id: 'civic-intelligence', label: 'Overview', icon: Activity },
        { id: 'assistant', label: 'AI Grievance Assistant', icon: Sparkles },
        { id: 'history', label: 'Citizen Demand Stream', icon: MessageSquare },
        { id: 'map', label: 'GIS Spatial Hotspots', icon: Layers },
        { id: 'priorities', label: '5-Factor Priority Matrix', icon: BarChart3 },
      ],
    },
    {
      groupTitle: 'POLICY & PROJECTS',
      items: [
        { id: 'schemes', label: 'Policy Schemes (RAG)', icon: BookOpen, badge: '41' },
        { id: 'projects', label: 'Smart City Projects', icon: Building, badge: '70' },
        { id: 'dpr', label: 'DPR Proposals & Sanctions', icon: FileCheck2 },
      ],
    },
    {
      groupTitle: 'PORTAL & GOVERNANCE',
      items: [
        { id: 'settings', label: 'Data Governance & Sources', icon: Settings },
      ],
    },
  ];

  // Grouped citizen navigation
  const citizenNavGroups = [
    {
      groupTitle: 'CITIZEN SERVICES',
      items: [
        { id: 'citizen-home', label: 'Citizen Dashboard', icon: Home, badge: 'Ward 22' },
        { id: 'file', label: 'Report an Issue', icon: PlusCircle, badge: 'Voice/Text' },
        { id: 'history', label: 'My Grievances', icon: Clock, badge: 'Live' },
        { id: 'map', label: 'Ward 22 Map & Issues', icon: Layers },
        { id: 'feed', label: 'Community Feed', icon: Users },
      ],
    },
  ];

  const activeNavGroups = role === 'CITIZEN' ? citizenNavGroups : policymakerNavGroups;

  const handleNavClick = (sectionId: string) => {
    onNavigate(sectionId);
    onCloseMobile();
  };

  return (
    <>
      {/* Mobile Backdrop */}
      {isMobileOpen && (
        <div
          className="fixed inset-0 z-40 bg-slate-900/40 backdrop-blur-xs lg:hidden animate-fadeIn transition-opacity duration-300"
          onClick={onCloseMobile}
        />
      )}

      {/* Main Sidebar */}
      <aside
        className={`fixed top-0 left-0 z-50 h-full bg-white border-r border-slate-200 flex flex-col justify-between transition-all duration-300 ease-[cubic-bezier(0.16,1,0.3,1)] lg:translate-x-0 ${
          isCollapsed ? 'w-16' : 'w-72'
        } ${isMobileOpen ? 'translate-x-0 shadow-2xl' : '-translate-x-full'}`}
      >
        {/* Top Scrollable Region */}
        <div className="flex-1 overflow-y-auto no-scrollbar">
          {/* Header Brand */}
          <div className="h-16 px-4 border-b border-slate-100 flex items-center justify-between">
            {isCollapsed ? (
              <div className="w-full flex items-center justify-center">
                <div
                  className="w-9 h-9 rounded-xl bg-sky-700 text-white flex items-center justify-center font-bold text-sm shadow-xs cursor-pointer btn-press"
                  onClick={onToggleCollapse}
                  title="JANSETU AI • Click to expand"
                >
                  <span>जन</span>
                </div>
              </div>
            ) : (
              <>
                <div className="flex items-center space-x-2.5">
                  <div className="w-8 h-8 rounded-lg bg-sky-700 text-white flex items-center justify-center font-bold text-sm shadow-xs">
                    <span>जन</span>
                  </div>
                  <div className="leading-tight">
                    <span className="font-heading font-extrabold text-sm text-slate-900 tracking-tight block">
                      JANSETU AI
                    </span>
                    <span className="text-[10px] text-slate-400 font-medium block">
                      {role === 'CITIZEN' ? 'Citizen Public Services' : 'Executive Decision Support'}
                    </span>
                  </div>
                </div>

                {/* Desktop Collapse Icon */}
                <button
                  onClick={onToggleCollapse}
                  className="p-1.5 rounded-lg border border-slate-200 text-slate-400 hover:text-slate-700 hover:bg-slate-50 hidden lg:block cursor-pointer btn-press"
                  title="Collapse sidebar"
                >
                  <ChevronLeft className="w-3.5 h-3.5" />
                </button>

                {/* Mobile Close Button */}
                <button
                  onClick={onCloseMobile}
                  className="p-1.5 rounded-lg border border-slate-200 text-slate-500 hover:text-slate-800 hover:bg-slate-100 lg:hidden cursor-pointer btn-press"
                  title="Close navigation"
                >
                  <X className="w-4 h-4" />
                </button>
              </>
            )}
          </div>

          {isCollapsed ? (
            /* Collapsed Icon-Rail Navigation */
            <div className="py-3 px-2 space-y-3 flex flex-col items-center">
              {/* "+ Report" Icon Button */}
              <button
                onClick={onNewGrievance}
                className="w-10 h-10 rounded-xl bg-sky-700 hover:bg-sky-800 text-white flex items-center justify-center shadow-xs transition cursor-pointer btn-press"
                title={role === 'CITIZEN' ? '+ Report an Issue' : '+ New Civic Issue'}
              >
                <Plus className="w-5 h-5" />
              </button>

              <div className="w-8 border-t border-slate-200 my-1" />

              {/* Navigation Items (Icons Only) */}
              <nav className="space-y-1.5 w-full flex flex-col items-center">
                {activeNavGroups.flatMap((g) => g.items).map((item) => {
                  const Icon = item.icon;
                  const isActive = currentSection === item.id;

                  return (
                    <button
                      key={item.id}
                      onClick={() => handleNavClick(item.id)}
                      title={item.label}
                      className={`w-10 h-10 rounded-xl flex items-center justify-center transition relative cursor-pointer btn-press ${
                        isActive
                          ? 'bg-sky-50 text-sky-700 font-bold shadow-2xs'
                          : 'text-slate-500 hover:bg-slate-50 hover:text-slate-900'
                      }`}
                    >
                      {isActive && (
                        <div className="absolute left-0 top-2 bottom-2 w-1 bg-sky-700 rounded-r" />
                      )}
                      <Icon className="w-4.5 h-4.5" />
                    </button>
                  );
                })}
              </nav>

              <div className="w-8 border-t border-slate-200 my-1" />

              {/* Sign Out Mini Button */}
              <button
                onClick={() => {
                  logout();
                  onNavigate('landing');
                }}
                className="w-10 h-10 rounded-xl border border-rose-200 bg-rose-50 hover:bg-rose-100 flex items-center justify-center text-rose-600 transition cursor-pointer btn-press"
                title="Sign Out & Return to Landing Page"
              >
                <LogOut className="w-4 h-4" />
              </button>
            </div>
          ) : (
            /* Expanded Full Navigation */
            <div className="p-3.5 space-y-4">
              {/* "+ New Civic Issue" Primary Button */}
              <button
                onClick={onNewGrievance}
                className="w-full py-2.5 px-3 bg-sky-700 hover:bg-sky-800 text-white rounded-xl text-xs font-bold flex items-center justify-center space-x-2 shadow-xs transition cursor-pointer btn-press"
              >
                <Plus className="w-4 h-4" />
                <span>{role === 'CITIZEN' ? '+ Report an Issue' : '+ New Civic Issue'}</span>
              </button>

              {/* Grouped Navigation */}
              <div className="space-y-4">
                {activeNavGroups.map((group) => (
                  <div key={group.groupTitle} className="space-y-1">
                    <span className="text-[10px] font-bold text-slate-400 tracking-wider uppercase block px-2 mb-1">
                      {group.groupTitle}
                    </span>

                    <nav className="space-y-0.5">
                      {group.items.map((item) => {
                        const Icon = item.icon;
                        const isActive = currentSection === item.id;

                        return (
                          <button
                            key={item.id}
                            onClick={() => handleNavClick(item.id)}
                            className={`w-full flex items-center justify-between px-2.5 py-2 rounded-xl text-xs font-medium transition text-left relative cursor-pointer btn-press ${
                              isActive
                                ? 'bg-sky-50 text-sky-800 font-bold border border-sky-100 shadow-2xs'
                                : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
                            }`}
                          >
                            <div className="flex items-center space-x-2.5">
                              <Icon
                                className={`w-4 h-4 ${
                                  isActive ? 'text-sky-700' : 'text-slate-400'
                                }`}
                              />
                              <span>{item.label}</span>
                            </div>

                            {item.badge && (
                              <span
                                className={`text-[10px] font-mono px-1.5 py-0.2 rounded font-bold ${
                                  isActive
                                    ? 'bg-sky-200/70 text-sky-900'
                                    : 'bg-slate-100 text-slate-600'
                                }`}
                              >
                                {item.badge}
                              </span>
                            )}
                          </button>
                        );
                      })}
                    </nav>
                  </div>
                ))}
              </div>

              {/* Bottom: Isolated Active Persona & Sign Out Button */}
              <div className="pt-3 border-t border-slate-100 space-y-2">
                <div className="p-2.5 rounded-xl border border-slate-200/80 bg-slate-50/80 text-left">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
                      Active Portal
                    </span>
                    <span
                      className={`text-[9px] font-bold px-1.5 py-0.5 rounded-full ${
                        role === 'CITIZEN'
                          ? 'bg-teal-100 text-teal-800'
                          : 'bg-blue-100 text-blue-800'
                      }`}
                    >
                      {role === 'CITIZEN' ? 'Citizen' : 'Officer'}
                    </span>
                  </div>
                  <span className="text-xs font-bold text-slate-800 block truncate mt-1">
                    {user?.name || (role === 'CITIZEN' ? 'Citizen User' : 'District Magistrate')}
                  </span>
                  <span className="text-[10px] text-slate-500 block truncate">
                    {user?.email || (role === 'CITIZEN' ? 'citizen.gwalior@jansetu.gov.in' : 'policymaker.gwalior@jansetu.gov.in')}
                  </span>
                </div>

                <button
                  onClick={() => {
                    logout();
                    onNavigate('landing');
                  }}
                  className="w-full py-2 px-3 rounded-xl border border-rose-200 bg-rose-50 hover:bg-rose-100 text-rose-700 text-xs font-bold flex items-center justify-center space-x-2 transition cursor-pointer"
                  title="Sign Out & Return to Landing Page"
                >
                  <LogOut className="w-3.5 h-3.5" />
                  <span>Sign Out / Exit Portal</span>
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Bottom Status / Links */}
        {!isCollapsed && (
          <div className="p-3 border-t border-slate-100 text-xs text-slate-500 bg-slate-50/50 space-y-1">
            <div className="flex items-center justify-between text-[11px] px-1 text-slate-400">
              <span>Gwalior Helpline: 1800-233-1314</span>
            </div>
            <div className="flex items-center justify-between text-[11px] pt-1 border-t border-slate-200/60 px-1">
              <span className="text-slate-400">JanSetu AI &bull; DPI</span>
              <a
                href="https://gwaliorgis.mp.gov.in"
                target="_blank"
                rel="noreferrer"
                className="text-sky-600 hover:underline flex items-center space-x-0.5"
              >
                <span>gwalior.mp.gov.in</span>
                <ExternalLink className="w-2.5 h-2.5" />
              </a>
            </div>
          </div>
        )}
      </aside>
    </>
  );
};
