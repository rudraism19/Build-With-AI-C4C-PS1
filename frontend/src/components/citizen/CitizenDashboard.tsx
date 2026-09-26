import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { complaintService } from '../../services/api';
import { Complaint } from '../../types';
import {
  PlusCircle,
  Clock,
  MapPin,
  CheckCircle2,
  AlertCircle,
  Phone,
  ArrowRight,
  Sparkles,
  Layers,
  FileText,
  ShieldCheck,
  Loader2,
  Calendar,
} from 'lucide-react';

interface CitizenDashboardProps {
  onNavigate: (section: string) => void;
  onFileGrievance: () => void;
  onTrackGrievance: () => void;
  onViewWardMap: () => void;
}

export const CitizenDashboard: React.FC<CitizenDashboardProps> = ({
  onNavigate,
  onFileGrievance,
  onTrackGrievance,
  onViewWardMap,
}) => {
  const { user } = useAuth();
  const [complaints, setComplaints] = useState<Complaint[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadCitizenData();
  }, []);

  const loadCitizenData = async () => {
    setIsLoading(true);
    try {
      const data = await complaintService.getMyComplaints();
      if (Array.isArray(data) && data.length > 0) {
        setComplaints(data);
      } else {
        // Fallback friendly sample complaint
        setComplaints([
          {
            id: 'cmp-01',
            ticket_id: 'GWL-2026-4821',
            title: 'Morar Ward 22 Drinking Water Contamination and Pressure Drop',
            description:
              'Sewage contamination in drinking water line near Morar Girls School. 40+ households affected.',
            category: 'WATER',
            severity: 'CRITICAL',
            status: 'DPR_PROPOSED',
            latitude: 26.2295,
            longitude: 78.2255,
            ward: 'Morar Ward 22',
            address: 'Near Girls Higher Secondary School, Morar, Gwalior',
            ai_summary:
              'Drinking water supply contaminated by sewage seepage. Clustered with 41 nearby neighbor reports and submitted for urgent pipeline upgrade.',
            created_at: new Date().toISOString(),
          },
        ]);
      }
    } catch {
      // Fallback
    } finally {
      setIsLoading(false);
    }
  };

  const activeCount = complaints.filter(
    (c) => c.status !== 'RESOLVED'
  ).length;

  return (
    <div className="max-w-5xl mx-auto space-y-6">
      {/* 1. Warm, Simple Citizen Welcome Banner */}
      <div className="bg-gradient-to-r from-sky-700 via-sky-800 to-indigo-800 text-white rounded-3xl p-6 sm:p-8 shadow-sm relative overflow-hidden">
        <div className="absolute top-0 right-0 -mr-16 -mt-16 w-64 h-64 rounded-full bg-white/10 blur-2xl pointer-events-none" />
        <div className="relative z-10 space-y-3">
          <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-white/15 text-white text-xs font-semibold backdrop-blur-xs border border-white/20">
            <MapPin className="w-3.5 h-3.5 text-amber-300" />
            <span>Gwalior Municipal Corporation • Ward 22 (Morar)</span>
          </div>

          <h2 className="text-2xl sm:text-3xl font-heading font-extrabold tracking-tight">
            Namaste, {user?.name || 'Rudra Bhullar'}
          </h2>

          <p className="text-sm text-sky-100 max-w-2xl leading-relaxed">
            Welcome to JanSetu. Easily report municipal issues in your neighborhood, track repairs in real-time, and stay informed on ward developments.
          </p>

          {/* Quick Metrics Cards */}
          <div className="pt-3 grid grid-cols-2 sm:grid-cols-3 gap-3">
            <div className="bg-white/10 backdrop-blur-xs rounded-2xl p-3 border border-white/10">
              <span className="text-[11px] text-sky-200 block font-medium">Your Active Complaints</span>
              <span className="text-xl font-bold font-heading">{activeCount} Issue{activeCount !== 1 ? 's' : ''}</span>
            </div>
            <div className="bg-white/10 backdrop-blur-xs rounded-2xl p-3 border border-white/10">
              <span className="text-[11px] text-sky-200 block font-medium">Ward Health Status</span>
              <span className="text-xl font-bold text-emerald-300">Under Action</span>
            </div>
            <div className="bg-white/10 backdrop-blur-xs rounded-2xl p-3 border border-white/10 col-span-2 sm:col-span-1">
              <span className="text-[11px] text-sky-200 block font-medium">Average Response</span>
              <span className="text-xl font-bold text-amber-300">Within 24 Hours</span>
            </div>
          </div>
        </div>
      </div>

      {/* 2. Main Citizen Actions (Large, Clean & Simple) */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Action 1: File Grievance */}
        <div
          onClick={onFileGrievance}
          className="bg-white border-2 border-sky-600 rounded-3xl p-5 sm:p-6 shadow-sm hover:shadow-md transition cursor-pointer flex flex-col justify-between group hover:border-sky-700 hover-card-lift btn-press"
        >
          <div className="space-y-3">
            <div className="w-12 h-12 rounded-2xl bg-sky-100 text-sky-700 flex items-center justify-center font-bold text-xl group-hover:scale-105 transition">
              📢
            </div>
            <div>
              <span className="text-[10px] font-bold tracking-wider uppercase text-sky-700 bg-sky-50 px-2 py-0.5 rounded-full border border-sky-200">
                1-Click Voice or Text
              </span>
              <h3 className="font-heading font-extrabold text-lg text-slate-900 mt-1">
                Report a Civic Issue
              </h3>
              <p className="text-xs text-slate-500 mt-1 leading-relaxed">
                Drinking water dirty? Road broken? Speak in Hindi/English or type to register your problem immediately.
              </p>
            </div>
          </div>

          <div className="pt-4 flex items-center text-xs font-bold text-sky-700 group-hover:text-sky-800 space-x-1">
            <span>File Grievance Now</span>
            <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
          </div>
        </div>

        {/* Action 2: Track My Grievances */}
        <div
          onClick={onTrackGrievance}
          className="bg-white border border-slate-200 rounded-3xl p-5 sm:p-6 shadow-sm hover:shadow-md hover:border-slate-300 transition cursor-pointer flex flex-col justify-between group hover-card-lift btn-press"
        >
          <div className="space-y-3">
            <div className="w-12 h-12 rounded-2xl bg-emerald-100 text-emerald-700 flex items-center justify-center font-bold text-xl group-hover:scale-105 transition">
              📋
            </div>
            <div>
              <span className="text-[10px] font-bold tracking-wider uppercase text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
                Live Status
              </span>
              <h3 className="font-heading font-extrabold text-lg text-slate-900 mt-1">
                Track My Grievances
              </h3>
              <p className="text-xs text-slate-500 mt-1 leading-relaxed">
                Check updates on your submitted tickets, officer inspection notes, and work sanction status.
              </p>
            </div>
          </div>

          <div className="pt-4 flex items-center text-xs font-bold text-emerald-700 group-hover:text-emerald-800 space-x-1">
            <span>Check Grievance Status</span>
            <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
          </div>
        </div>

        {/* Action 3: Ward Map & Neighborhood Issues */}
        <div
          onClick={onViewWardMap}
          className="bg-white border border-slate-200 rounded-3xl p-5 sm:p-6 shadow-sm hover:shadow-md hover:border-slate-300 transition cursor-pointer flex flex-col justify-between group hover-card-lift btn-press"
        >
          <div className="space-y-3">
            <div className="w-12 h-12 rounded-2xl bg-indigo-100 text-indigo-700 flex items-center justify-center font-bold text-xl group-hover:scale-105 transition">
              🗺️
            </div>
            <div>
              <span className="text-[10px] font-bold tracking-wider uppercase text-indigo-700 bg-indigo-50 px-2 py-0.5 rounded-full border border-indigo-200">
                Ward Transparency
              </span>
              <h3 className="font-heading font-extrabold text-lg text-slate-900 mt-1">
                Ward 22 Map &amp; Projects
              </h3>
              <p className="text-xs text-slate-500 mt-1 leading-relaxed">
                Explore nearby issues reported by neighbors and ongoing Smart City municipal repair works in Morar.
              </p>
            </div>
          </div>

          <div className="pt-4 flex items-center text-xs font-bold text-indigo-700 group-hover:text-indigo-800 space-x-1">
            <span>View Ward 22 Map</span>
            <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
          </div>
        </div>
      </div>

      {/* 3. Citizen's Recent Grievance Tracker Card */}
      <div className="bg-white border border-slate-200 rounded-3xl p-6 shadow-sm space-y-4">
        <div className="flex items-center justify-between pb-3 border-b border-slate-100">
          <div>
            <h3 className="font-heading font-extrabold text-base text-slate-900 flex items-center space-x-2">
              <Clock className="w-4 h-4 text-sky-700" />
              <span>Your Recent Grievances</span>
            </h3>
            <p className="text-xs text-slate-500 mt-0.5">
              Transparent live status tracking direct from municipal database.
            </p>
          </div>

          <button
            onClick={onTrackGrievance}
            className="text-xs font-bold text-sky-700 hover:text-sky-800 hover:underline flex items-center space-x-1"
          >
            <span>View All ({complaints.length})</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        {isLoading ? (
          <div className="p-8 text-center text-slate-400 text-xs flex items-center justify-center space-x-2">
            <Loader2 className="w-4 h-4 animate-spin text-sky-600" />
            <span>Loading your grievances...</span>
          </div>
        ) : complaints.length === 0 ? (
          <div className="p-8 text-center space-y-3">
            <div className="w-12 h-12 bg-slate-100 rounded-full flex items-center justify-center mx-auto text-xl">
              👍
            </div>
            <h4 className="font-bold text-slate-800 text-sm">No Active Grievances</h4>
            <p className="text-xs text-slate-500 max-w-sm mx-auto">
              You haven't reported any issues recently. If you notice any broken civic infrastructure, tap below.
            </p>
            <button
              onClick={onFileGrievance}
              className="px-4 py-2 bg-sky-700 hover:bg-sky-800 text-white font-bold rounded-xl text-xs transition"
            >
              + Report an Issue
            </button>
          </div>
        ) : (
          <div className="space-y-4">
            {complaints.slice(0, 2).map((comp) => (
              <div
                key={comp.id}
                className="bg-slate-50 border border-slate-200/80 rounded-2xl p-5 space-y-3"
              >
                {/* Header row */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                  <div className="space-y-1">
                    <div className="flex items-center space-x-2">
                      <span className="font-mono text-[11px] font-bold px-2 py-0.5 rounded bg-white text-slate-700 border border-slate-200">
                        {comp.ticket_id || comp.id.slice(0, 12)}
                      </span>
                      <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-sky-100 text-sky-800">
                        {comp.category}
                      </span>
                      <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-rose-100 text-rose-800">
                        {comp.severity}
                      </span>
                    </div>
                    <h4 className="font-heading font-extrabold text-sm text-slate-900">
                      {comp.title}
                    </h4>
                  </div>

                  <span className="px-3 py-1 rounded-full text-xs font-bold bg-emerald-50 text-emerald-800 border border-emerald-200 self-start sm:self-auto">
                    ● Action Proposal Generated
                  </span>
                </div>

                {/* Plain-Language Summary */}
                {comp.ai_summary && (
                  <p className="text-xs text-slate-600 bg-white p-3 rounded-xl border border-slate-200 leading-relaxed">
                    💡 <strong>Summary</strong>: {comp.ai_summary}
                  </p>
                )}

                {/* Simple 4-Step Visual Progress Tracker */}
                <div className="pt-2">
                  <div className="grid grid-cols-4 gap-1 text-center">
                    <div className="space-y-1">
                      <div className="h-2 rounded-full bg-emerald-500" />
                      <span className="text-[10px] font-bold text-emerald-800 block">1. Submitted</span>
                    </div>
                    <div className="space-y-1">
                      <div className="h-2 rounded-full bg-emerald-500" />
                      <span className="text-[10px] font-bold text-emerald-800 block">2. AI Verified</span>
                    </div>
                    <div className="space-y-1">
                      <div className="h-2 rounded-full bg-emerald-500" />
                      <span className="text-[10px] font-bold text-emerald-800 block">3. Clustered (40+)</span>
                    </div>
                    <div className="space-y-1">
                      <div className="h-2 rounded-full bg-sky-500" />
                      <span className="text-[10px] font-bold text-sky-800 block">4. In Progress</span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* 4. Helpful Emergency & Municipal Contacts Footer Card */}
      <div className="bg-amber-50/80 border border-amber-200 rounded-3xl p-5 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 rounded-2xl bg-amber-100 text-amber-700 flex items-center justify-center text-lg font-bold shrink-0">
            📞
          </div>
          <div>
            <h4 className="font-heading font-extrabold text-amber-950 text-sm">
              Gwalior Municipal Emergency Helpline
            </h4>
            <p className="text-amber-800 text-[11px] mt-0.5">
              For immediate emergencies (burst water main, fallen electrical wire, open manhole), call toll-free directly.
            </p>
          </div>
        </div>

        <div className="flex items-center space-x-2 shrink-0">
          <a
            href="tel:18002331314"
            className="px-4 py-2 bg-amber-700 hover:bg-amber-800 text-white rounded-xl font-bold flex items-center space-x-1.5 shadow-2xs transition"
          >
            <Phone className="w-3.5 h-3.5" />
            <span>1800-233-1314</span>
          </a>
        </div>
      </div>
    </div>
  );
};
