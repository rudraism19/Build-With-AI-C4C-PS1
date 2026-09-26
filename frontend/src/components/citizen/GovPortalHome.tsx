import React, { useState } from 'react';
import {
  FileText,
  Layers,
  Sparkles,
  ArrowRight,
  Droplet,
  Compass,
  Building,
  CheckCircle2,
  Trash2,
  Mic,
  Search,
  BookOpen,
  FileCheck2,
  Bot,
  ExternalLink,
} from 'lucide-react';

interface GovPortalHomeProps {
  onOpenFileGrievance: () => void;
  onOpenTrackGrievance: () => void;
  onOpenMap: () => void;
  onOpenPriorities: () => void;
  onOpenSchemes: () => void;
  onOpenDPR: () => void;
}

export const GovPortalHome: React.FC<GovPortalHomeProps> = ({
  onOpenFileGrievance,
  onOpenTrackGrievance,
  onOpenMap,
  onOpenPriorities,
  onOpenSchemes,
  onOpenDPR,
}) => {
  const [selectedPersona, setSelectedPersona] = useState<
    'water' | 'roads' | 'sanitation' | 'housing'
  >('water');

  const processSteps = [
    { id: '1', title: 'GRIEVANCE', icon: '📦' },
    { id: '2', title: 'AI TRIAGE', icon: '📄' },
    { id: '3', title: 'HOTSPOT', icon: '📍' },
    { id: '4', title: 'PRIORITY', icon: '⚖️' },
    { id: '5', title: 'SCHEME RAG', icon: '🏛️' },
    { id: '6', title: 'COMPLIANCE & DPR', icon: '✅', isSuccess: true },
  ];

  const personas = [
    {
      id: 'water',
      label: 'Water & Pipelines',
      badge: 'AMRUT 2.0 & JJM',
      color: 'text-sky-700 bg-sky-50 border-sky-200',
      description:
        'Water & Pipelines: Functional Household Tap Connections (FHTC), water loss reduction (NRW), and booster pumping stations under AMRUT 2.0.',
    },
    {
      id: 'roads',
      label: 'Roads & Transit',
      badge: 'SMART CITY MISSION',
      color: 'text-amber-700 bg-amber-50 border-amber-200',
      description:
        'Roads & Transit: Pothole clearance, asphalt corridor resurfacing, drainage culverts, and traffic junction safety standards.',
    },
    {
      id: 'sanitation',
      label: 'Sanitation & Waste',
      badge: 'SBM URBAN 2.0',
      color: 'text-emerald-700 bg-emerald-50 border-emerald-200',
      description:
        'Sanitation & Waste: Door-to-door segregated collection, legacy dumpsite remediation, and decentralized faecal sludge treatment plants.',
    },
    {
      id: 'housing',
      label: 'Housing & Slums',
      badge: 'PMAY-U 2.0',
      color: 'text-indigo-700 bg-indigo-50 border-indigo-200',
      description:
        'Housing & Slums: Beneficiary-Led Construction (BLC), Affordable Housing in Partnership (AHP), and interest subsidy for urban poor.',
    },
  ];

  const currentPersonaData = personas.find((p) => p.id === selectedPersona) || personas[0];

  return (
    <div className="max-w-5xl mx-auto space-y-8 py-6 px-2 sm:px-4">
      {/* Hero Header Section matching BIS Saarthi */}
      <div className="text-center space-y-3">
        <div className="inline-flex items-center px-3 py-1 rounded-md bg-rose-50 text-rose-700 border border-rose-200 text-[11px] font-bold tracking-wider uppercase">
          Official DPI Governance Platform
        </div>

        <h2 className="text-2xl sm:text-4xl font-heading font-extrabold text-slate-900 tracking-tight">
          Find the right Scheme &amp; Civic Intervention
        </h2>

        <p className="text-xs sm:text-sm text-slate-500 max-w-2xl mx-auto leading-relaxed">
          Identify citizen grievance clusters, spatial deficit scores, AMRUT/PMAY scheme eligibility, and automated DPR engineering proposals.
        </p>
      </div>

      {/* 6-Step Workflow Stepper Ribbon Card */}
      <div className="bg-white border border-slate-200 rounded-2xl p-4 sm:p-5 shadow-xs">
        <div className="grid grid-cols-2 sm:grid-cols-6 gap-2 sm:gap-0 items-center justify-between">
          {processSteps.map((step, idx) => (
            <React.Fragment key={step.id}>
              <div
                onClick={() => {
                  if (step.id === '1') onOpenFileGrievance();
                  else if (step.id === '3') onOpenMap();
                  else if (step.id === '4') onOpenPriorities();
                  else if (step.id === '5') onOpenSchemes();
                  else if (step.id === '6') onOpenDPR();
                }}
                className={`flex flex-col items-center justify-center p-3 rounded-xl border border-transparent hover:border-slate-200 hover:bg-slate-50 cursor-pointer transition text-center group ${
                  step.isSuccess ? 'bg-emerald-50/50' : ''
                }`}
              >
                <div
                  className={`w-9 h-9 rounded-xl flex items-center justify-center text-base mb-1.5 transition ${
                    step.isSuccess
                      ? 'bg-emerald-100 text-emerald-700'
                      : 'bg-slate-100 text-slate-700 group-hover:bg-sky-100 group-hover:text-sky-700'
                  }`}
                >
                  <span>{step.icon}</span>
                </div>
                <span className="text-[11px] font-extrabold text-slate-800 tracking-wider">
                  {step.title}
                </span>
              </div>

              {/* Arrow connector */}
              {idx < processSteps.length - 1 && (
                <div className="hidden sm:flex justify-center text-slate-300">
                  <ArrowRight className="w-4 h-4" />
                </div>
              )}
            </React.Fragment>
          ))}
        </div>
      </div>

      {/* Select Compliance Persona Section */}
      <div className="space-y-3">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between text-xs gap-1">
          <div className="flex items-center space-x-1.5 font-bold text-slate-800 tracking-wide uppercase text-[11px]">
            <Sparkles className="w-3.5 h-3.5 text-amber-500" />
            <span>Select Civic Sector / Persona</span>
          </div>
          <span className="text-slate-400 text-[11px]">
            Tailors standards, procedures &amp; statutory fast-tracks
          </span>
        </div>

        {/* 4 Persona Tabs */}
        <div className="grid grid-cols-1 sm:grid-cols-4 gap-2.5">
          {personas.map((p) => {
            const isSelected = selectedPersona === p.id;
            return (
              <button
                key={p.id}
                type="button"
                onClick={() => setSelectedPersona(p.id as any)}
                className={`p-3 rounded-xl border text-left transition-all relative ${
                  isSelected
                    ? 'bg-white border-slate-400 shadow-xs ring-1 ring-slate-400'
                    : 'bg-white border-slate-200 hover:border-slate-300'
                }`}
              >
                <div className="flex items-center justify-between mb-1">
                  <span className="text-xs font-bold text-slate-900">{p.label}</span>
                </div>
                <span
                  className={`text-[9px] font-bold px-1.5 py-0.5 rounded border inline-block ${p.color}`}
                >
                  {p.badge}
                </span>
              </button>
            );
          })}
        </div>

        {/* Selected Sector Context Statement */}
        <div className="p-3 bg-slate-50 border border-slate-200/80 rounded-xl text-xs text-slate-700 flex items-start space-x-2">
          <span className="w-2 h-2 rounded-full bg-emerald-500 shrink-0 mt-1.5" />
          <p className="leading-relaxed">{currentPersonaData.description}</p>
        </div>
      </div>

      {/* Quick Compliance Actions Section matching the 3 cards in screenshot */}
      <div className="space-y-3 pt-2">
        <div className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">
          Quick Civic Actions for {currentPersonaData.label}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* Card 1: Scheme Guidelines & Eligibility */}
          <div
            onClick={onOpenSchemes}
            className="p-4 bg-white border border-slate-200 rounded-xl hover:border-sky-300 hover:shadow-xs cursor-pointer transition space-y-2 group"
          >
            <div className="flex items-center space-x-2 text-sky-700">
              <Search className="w-4 h-4" />
              <h5 className="font-bold text-xs text-slate-900 group-hover:text-sky-700">
                Applicable Scheme Guidelines
              </h5>
            </div>
            <p className="text-xs text-slate-500 leading-relaxed">
              What funding guidelines apply under AMRUT 2.0 or PMAY-U 2.0 in Gwalior?
            </p>
          </div>

          {/* Card 2: Voice Grievance Ingestion */}
          <div
            onClick={onOpenFileGrievance}
            className="p-4 bg-white border border-slate-200 rounded-xl hover:border-sky-300 hover:shadow-xs cursor-pointer transition space-y-2 group"
          >
            <div className="flex items-center space-x-2 text-amber-600">
              <Mic className="w-4 h-4" />
              <h5 className="font-bold text-xs text-slate-900 group-hover:text-amber-700">
                Multilingual Voice Grievance
              </h5>
            </div>
            <p className="text-xs text-slate-500 leading-relaxed">
              Speak in Hindi or English — Sarvam AI transcribes and auto-triage tags your ward.
            </p>
          </div>

          {/* Card 3: Generate Grounded DPR */}
          <div
            onClick={onOpenDPR}
            className="p-4 bg-white border border-slate-200 rounded-xl hover:border-sky-300 hover:shadow-xs cursor-pointer transition space-y-2 group"
          >
            <div className="flex items-center space-x-2 text-emerald-600">
              <FileCheck2 className="w-4 h-4" />
              <h5 className="font-bold text-xs text-slate-900 group-hover:text-emerald-700">
                Automated DPR Proposal
              </h5>
            </div>
            <p className="text-xs text-slate-500 leading-relaxed">
              Generate structured project reports grounded in 41 official scheme clauses.
            </p>
          </div>
        </div>
      </div>

      {/* Floating AI Assistant FAB in bottom right matching screenshot */}
      <button
        onClick={onOpenFileGrievance}
        className="fixed bottom-6 right-6 z-40 w-12 h-12 bg-slate-900 hover:bg-slate-800 text-white rounded-full flex items-center justify-center shadow-lg transition-transform hover:scale-105 group"
        title="Open JanSetu AI Assistant"
      >
        <Bot className="w-6 h-6 text-white" />
        <span className="absolute top-1 right-1 w-2.5 h-2.5 bg-emerald-500 rounded-full border-2 border-slate-900" />
      </button>
    </div>
  );
};
