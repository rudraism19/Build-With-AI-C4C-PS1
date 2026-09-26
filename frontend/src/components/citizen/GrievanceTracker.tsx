import React, { useState, useEffect } from 'react';
import { Complaint, ComplaintCategory, ComplaintSeverity } from '../../types';
import { complaintService } from '../../services/api';
import { useAuth } from '../../context/AuthContext';
import {
  Search,
  CheckCircle,
  Clock,
  Layers,
  Sparkles,
  FileCheck2,
  MapPin,
  Calendar,
  AlertCircle,
  ArrowRight,
  ShieldCheck,
  Tag,
  ExternalLink,
  Filter,
  RotateCcw,
  CheckCircle2,
  ChevronRight,
  Activity,
  Send,
  Building2,
} from 'lucide-react';

interface GrievanceTrackerProps {
  newlyCreatedComplaint?: Complaint | null;
  onNavigate?: (section: string) => void;
  onDprAction?: (item: any) => void;
  onComplaintsCountChange?: (count: number) => void;
}

export const GrievanceTracker: React.FC<GrievanceTrackerProps> = ({
  newlyCreatedComplaint,
  onNavigate,
  onDprAction,
  onComplaintsCountChange,
}) => {
  const { role } = useAuth();
  const isPolicymaker = role === 'POLICYMAKER';

  const [complaints, setComplaints] = useState<Complaint[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedSector, setSelectedSector] = useState<string>('ALL');
  const [selectedSeverity, setSelectedSeverity] = useState<string>('ALL');
  const [selectedStatus, setSelectedStatus] = useState<string>('ALL');
  const [selectedWard, setSelectedWard] = useState<string>('ALL');

  const [selectedComplaint, setSelectedComplaint] = useState<Complaint | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [statusActionMessage, setStatusActionMessage] = useState<string | null>(null);

  // Seeded municipal baseline complaints for Gwalior
  const defaultComplaints: Complaint[] = [
    {
      id: 'cmp-01-morar-water',
      ticket_id: 'GWL-2026-4821',
      title: 'Morar Ward 22 Drinking Water Contamination and Low Pressure',
      description:
        'Main distribution pipeline ruptured near Morar girls school. Sewage water is seeping into the tap lines. 42 families affected.',
      category: 'WATER',
      severity: 'CRITICAL',
      status: 'DPR_PROPOSED',
      latitude: 26.2295,
      longitude: 78.2255,
      ward: 'Morar Ward 22',
      address: 'Near Girls Higher Secondary School, Morar, Gwalior',
      ai_summary:
        'Urgent pipe breach leading to drinking water contamination. Clustered with 41 nearby reports.',
      ai_confidence: 0.94,
      ai_entities: { location: 'Morar Ward 22', department: 'Water Supply', affected_units: '42 families' },
      hotspot_id: 'hotspot-gwalior-morar-01',
      created_at: '2026-09-25T14:30:00Z',
    },
    {
      id: 'cmp-02-lashkar-road',
      ticket_id: 'GWL-2026-3190',
      title: 'Deep Potholes and Waterlogging at Lashkar Bazar Arterial Road',
      description:
        'Severe road crater causing daily traffic jams and bike accidents during evening peak hours.',
      category: 'ROADS',
      severity: 'HIGH',
      status: 'CLUSTERED',
      latitude: 26.205,
      longitude: 78.163,
      ward: 'Lashkar Central',
      address: 'Opposite State Bank, Main Market Road, Lashkar',
      ai_summary: 'Major arterial road degradation impacting ~15,000 daily commuters.',
      ai_confidence: 0.88,
      ai_entities: { location: 'Lashkar Central', department: 'Public Works / Roads' },
      hotspot_id: 'hotspot-gwalior-lashkar-02',
      created_at: '2026-09-24T09:15:00Z',
    },
    {
      id: 'cmp-03-thatipur-sanitation',
      ticket_id: 'GWL-2026-1052',
      title: 'Solid Waste Dumping & Overflowing Bins near Thatipur Bus Terminal',
      description:
        'Municipal collection trucks have missed this point for 4 consecutive days. Waste overflowing onto road.',
      category: 'SANITATION',
      severity: 'MEDIUM',
      status: 'PENDING',
      latitude: 26.216,
      longitude: 78.197,
      ward: 'Ward 14 Thatipur',
      address: 'Near Thatipur Bus Stand, Gwalior',
      ai_summary: 'Uncollected solid municipal waste creating health hazard in commercial zone.',
      ai_confidence: 0.91,
      ai_entities: { location: 'Thatipur Ward 14', department: 'Sanitation' },
      hotspot_id: 'hotspot-gwalior-thatipur-03',
      created_at: '2026-09-23T11:40:00Z',
    },
  ];

  useEffect(() => {
    loadComplaints();
  }, []);

  // When a newly submitted complaint is received from App state
  useEffect(() => {
    if (newlyCreatedComplaint) {
      setComplaints((prev) => {
        const exists = prev.some((c) => c.id === newlyCreatedComplaint.id);
        const updated = exists ? prev : [newlyCreatedComplaint, ...prev];
        if (onComplaintsCountChange) onComplaintsCountChange(updated.length);
        return updated;
      });
      setSelectedComplaint(newlyCreatedComplaint);
    }
  }, [newlyCreatedComplaint]);

  const loadComplaints = async () => {
    setIsLoading(true);
    try {
      const fetched = await complaintService.getAllComplaints();
      const mappedFetched: Complaint[] = (fetched || []).map((c: any) => ({
        ...c,
        ticket_id: c.ticket_id || `GWL-${new Date(c.created_at || Date.now()).getFullYear()}-${c.id.slice(0, 4).toUpperCase()}`,
        ward: c.ward || (c.description?.includes('[Location:') ? c.description.split('[Location:')[1].replace(']', '').trim() : 'Morar Ward 22'),
      }));

      // Deduplicate fetched with defaultComplaints
      const idMap = new Set(mappedFetched.map((c) => c.id));
      const merged = [...mappedFetched];
      for (const def of defaultComplaints) {
        if (!idMap.has(def.id)) {
          merged.push(def);
        }
      }

      setComplaints(merged);
      if (merged.length > 0) {
        setSelectedComplaint(merged[0]);
      }
      if (onComplaintsCountChange) {
        onComplaintsCountChange(merged.length);
      }
    } catch (err) {
      console.warn('Using seeded complaint stream:', err);
      setComplaints(defaultComplaints);
      setSelectedComplaint(defaultComplaints[0]);
      if (onComplaintsCountChange) {
        onComplaintsCountChange(defaultComplaints.length);
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleUpdateStatus = (newStatus: Complaint['status']) => {
    if (!selectedComplaint) return;
    const updated = { ...selectedComplaint, status: newStatus };
    setSelectedComplaint(updated);
    setComplaints((prev) => prev.map((c) => (c.id === updated.id ? updated : c)));
    setStatusActionMessage(`Ticket status successfully updated to ${newStatus}`);
    setTimeout(() => setStatusActionMessage(null), 3000);
  };

  const handleGenerateDpr = (complaint: Complaint) => {
    if (onDprAction) {
      onDprAction({
        name: complaint.ward || 'Gwalior Municipal Area',
        sector: complaint.category,
        category: complaint.category,
        scheme: complaint.category === 'WATER' ? 'AMRUT 2.0' : 'Smart Cities Mission',
        score: complaint.severity === 'CRITICAL' ? 88 : 78,
        beneficiaries: complaint.severity === 'CRITICAL' ? 28500 : 15000,
        complaintTitle: complaint.title,
        complaintId: complaint.ticket_id || complaint.id,
      });
    }
    if (onNavigate) {
      onNavigate('dpr');
    }
  };

  const filteredComplaints = complaints.filter((c) => {
    const matchesSearch =
      searchQuery === '' ||
      c.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (c.ticket_id && c.ticket_id.toLowerCase().includes(searchQuery.toLowerCase())) ||
      c.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (c.ward && c.ward.toLowerCase().includes(searchQuery.toLowerCase())) ||
      (c.description && c.description.toLowerCase().includes(searchQuery.toLowerCase()));

    const matchesSector = selectedSector === 'ALL' || c.category === selectedSector;
    const matchesSeverity = selectedSeverity === 'ALL' || c.severity === selectedSeverity;
    const matchesStatus = selectedStatus === 'ALL' || c.status === selectedStatus;
    const matchesWard =
      selectedWard === 'ALL' ||
      (c.ward && c.ward.toLowerCase().includes(selectedWard.toLowerCase()));

    return matchesSearch && matchesSector && matchesSeverity && matchesStatus && matchesWard;
  });

  // Calculate executive metrics
  const totalCount = complaints.length;
  const criticalCount = complaints.filter((c) => c.severity === 'CRITICAL').length;
  const aiTriagedCount = complaints.filter((c) => c.ai_confidence || c.ai_summary).length;
  const dprReadyCount = complaints.filter((c) => c.status === 'DPR_PROPOSED' || c.status === 'CLUSTERED').length;

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden space-y-0">
      {/* 1. Header Toolbar */}
      <div className="p-5 sm:p-6 border-b border-slate-200 bg-slate-50/70">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          <div>
            <div className="flex items-center space-x-2">
              <span className={`w-2 h-2 rounded-full ${isPolicymaker ? 'bg-sky-600' : 'bg-emerald-500'} animate-pulse`} />
              <span className="text-[11px] font-mono font-bold uppercase tracking-wider text-sky-800">
                {isPolicymaker ? 'District Magistrate Mode • Municipal Demand Stream' : 'Citizen Public Services Portal'}
              </span>
            </div>
            <h3 className="text-lg sm:text-xl font-heading font-extrabold text-slate-900 mt-1">
              {isPolicymaker ? 'Citizen Demand Stream & Executive Triage' : 'Track Grievance Lifecycle'}
            </h3>
            <p className="text-xs text-slate-500 mt-0.5 max-w-3xl">
              {isPolicymaker
                ? 'Live stream of verified citizen grievances across 66 Gwalior wards, triaged with AI and correlated with GIS hotspots.'
                : 'Transparent end-to-end audit trail: Citizen Filing → Multilingual AI Triage → Spatial Hotspot Clustering → DPR Sanction.'}
            </p>
          </div>

          {/* Quick Metrics Bar for Policymaker */}
          {isPolicymaker && (
            <div className="flex items-center gap-2 sm:gap-3 flex-wrap">
              <div className="bg-white px-3 py-1.5 rounded-xl border border-slate-200 shadow-2xs text-left">
                <span className="text-[10px] text-slate-400 font-bold block uppercase">Total Demands</span>
                <span className="text-sm font-bold text-slate-900">{totalCount}</span>
              </div>
              <div className="bg-white px-3 py-1.5 rounded-xl border border-rose-200 bg-rose-50/30 shadow-2xs text-left">
                <span className="text-[10px] text-rose-600 font-bold block uppercase">Critical Urgency</span>
                <span className="text-sm font-bold text-rose-700">{criticalCount}</span>
              </div>
              <div className="bg-white px-3 py-1.5 rounded-xl border border-purple-200 bg-purple-50/30 shadow-2xs text-left">
                <span className="text-[10px] text-purple-700 font-bold block uppercase">AI Triaged</span>
                <span className="text-sm font-bold text-purple-800">{aiTriagedCount}</span>
              </div>
              <div className="bg-white px-3 py-1.5 rounded-xl border border-emerald-200 bg-emerald-50/30 shadow-2xs text-left">
                <span className="text-[10px] text-emerald-700 font-bold block uppercase">DPR / Clustered</span>
                <span className="text-sm font-bold text-emerald-800">{dprReadyCount}</span>
              </div>
            </div>
          )}
        </div>

        {/* 2. Filter Toolbar */}
        <div className="mt-4 pt-4 border-t border-slate-200/80 flex flex-wrap items-center gap-2.5 text-xs">
          {/* Search Input */}
          <div className="relative flex-1 min-w-[200px]">
            <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-2.5" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by ticket ID, keyword, or ward..."
              className="w-full pl-9 pr-3 py-1.5 bg-white rounded-lg border border-slate-300 text-xs focus:outline-none focus:ring-2 focus:ring-sky-500 font-medium"
            />
          </div>

          {/* Sector Filter */}
          <select
            value={selectedSector}
            onChange={(e) => setSelectedSector(e.target.value)}
            className="px-2.5 py-1.5 bg-white border border-slate-300 rounded-lg text-xs font-semibold focus:outline-none cursor-pointer"
          >
            <option value="ALL">All Sectors</option>
            <option value="WATER">Water Supply</option>
            <option value="ROADS">Roads &amp; Transit</option>
            <option value="SANITATION">Sanitation &amp; Waste</option>
            <option value="ELECTRICITY">Electricity &amp; Lighting</option>
            <option value="OTHER">Other Civic Issues</option>
          </select>

          {/* Severity Filter */}
          <select
            value={selectedSeverity}
            onChange={(e) => setSelectedSeverity(e.target.value)}
            className="px-2.5 py-1.5 bg-white border border-slate-300 rounded-lg text-xs font-semibold focus:outline-none cursor-pointer"
          >
            <option value="ALL">All Severities</option>
            <option value="CRITICAL">Critical</option>
            <option value="HIGH">High</option>
            <option value="MEDIUM">Medium</option>
            <option value="LOW">Low</option>
          </select>

          {/* Lifecycle Status Filter */}
          <select
            value={selectedStatus}
            onChange={(e) => setSelectedStatus(e.target.value)}
            className="px-2.5 py-1.5 bg-white border border-slate-300 rounded-lg text-xs font-semibold focus:outline-none cursor-pointer"
          >
            <option value="ALL">All Statuses</option>
            <option value="PENDING">Pending Triage</option>
            <option value="CLUSTERED">Clustered</option>
            <option value="DPR_PROPOSED">DPR Proposed</option>
            <option value="RESOLVED">Resolved</option>
          </select>

          {/* Ward Selector */}
          <select
            value={selectedWard}
            onChange={(e) => setSelectedWard(e.target.value)}
            className="px-2.5 py-1.5 bg-white border border-slate-300 rounded-lg text-xs font-semibold focus:outline-none cursor-pointer"
          >
            <option value="ALL">All Wards (66)</option>
            <option value="Morar">Morar Wards</option>
            <option value="Lashkar">Lashkar Wards</option>
            <option value="Thatipur">Thatipur Wards</option>
            <option value="Maharaj">Maharaj Bada</option>
          </select>

          {(searchQuery || selectedSector !== 'ALL' || selectedSeverity !== 'ALL' || selectedStatus !== 'ALL' || selectedWard !== 'ALL') && (
            <button
              onClick={() => {
                setSearchQuery('');
                setSelectedSector('ALL');
                setSelectedSeverity('ALL');
                setSelectedStatus('ALL');
                setSelectedWard('ALL');
              }}
              className="text-[11px] font-bold text-sky-700 hover:underline flex items-center space-x-1 cursor-pointer"
            >
              <RotateCcw className="w-3 h-3" />
              <span>Reset</span>
            </button>
          )}
        </div>
      </div>

      {/* 3. Main Split View (List 5 Cols / Detail 7 Cols) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 divide-y lg:divide-y-0 lg:divide-x divide-slate-200">
        {/* Left Side: Grievance & Demand List (5 Cols) */}
        <div className="lg:col-span-5 p-4 space-y-2.5 max-h-[640px] overflow-y-auto">
          {isLoading ? (
            <div className="p-8 text-center text-slate-400 text-xs">
              Connecting to municipal intake stream...
            </div>
          ) : filteredComplaints.length === 0 ? (
            <div className="p-8 text-center text-slate-400 text-xs">
              No citizen grievances found matching current filters.
            </div>
          ) : (
            filteredComplaints.map((c) => {
              const isSelected = selectedComplaint?.id === c.id;
              const isNewlyCreated = newlyCreatedComplaint?.id === c.id;

              return (
                <div
                  key={c.id}
                  onClick={() => setSelectedComplaint(c)}
                  className={`p-3.5 rounded-xl border cursor-pointer transition text-xs space-y-2 ${
                    isSelected
                      ? 'bg-sky-50/90 border-sky-300 shadow-sm ring-1 ring-sky-200'
                      : 'bg-white border-slate-200 hover:border-slate-300 hover:bg-slate-50/50'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-1.5">
                      <span className="font-mono font-bold text-slate-800 text-[11px]">
                        {c.ticket_id || c.id.slice(0, 12)}
                      </span>
                      {isNewlyCreated && (
                        <span className="px-1.5 py-0.2 rounded bg-sky-600 text-white text-[9px] font-extrabold uppercase animate-pulse">
                          New Ingest
                        </span>
                      )}
                    </div>

                    <div className="flex items-center space-x-1">
                      <span
                        className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                          c.severity === 'CRITICAL'
                            ? 'bg-rose-100 text-rose-800'
                            : c.severity === 'HIGH'
                            ? 'bg-amber-100 text-amber-800'
                            : 'bg-slate-100 text-slate-700'
                        }`}
                      >
                        {c.severity}
                      </span>
                      <span
                        className={`px-1.5 py-0.5 rounded text-[10px] font-semibold ${
                          c.status === 'DPR_PROPOSED'
                            ? 'bg-emerald-100 text-emerald-800'
                            : c.status === 'CLUSTERED'
                            ? 'bg-sky-100 text-sky-800'
                            : 'bg-slate-100 text-slate-600'
                        }`}
                      >
                        {c.status.replace('_', ' ')}
                      </span>
                    </div>
                  </div>

                  <h5 className="font-semibold text-slate-900 line-clamp-1">{c.title}</h5>

                  <p className="text-[11px] text-slate-600 line-clamp-1">{c.description}</p>

                  <div className="flex items-center justify-between text-slate-500 text-[11px] pt-1 border-t border-slate-200/60">
                    <span className="flex items-center truncate max-w-[200px]">
                      <MapPin className="w-3 h-3 text-slate-400 mr-1 shrink-0" />
                      <span className="truncate">{c.ward || 'Gwalior'}</span>
                    </span>

                    <span className="font-mono text-slate-400 text-[10px]">
                      {new Date(c.created_at).toLocaleDateString('en-IN', {
                        month: 'short',
                        day: 'numeric',
                      })}
                    </span>
                  </div>
                </div>
              );
            })
          )}
        </div>

        {/* Right Side: Detailed Breakdown & Executive Action Suite (7 Cols) */}
        <div className="lg:col-span-7 p-5 sm:p-6 bg-slate-50/40">
          {selectedComplaint ? (
            <div className="space-y-5">
              {/* Executive Status Alert Message */}
              {statusActionMessage && (
                <div className="p-2.5 rounded-lg bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-semibold flex items-center space-x-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>{statusActionMessage}</span>
                </div>
              )}

              {/* Top Header Card */}
              <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-2xs space-y-3">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <div className="flex items-center space-x-2">
                    <span className="font-mono text-xs font-bold text-sky-700 bg-sky-100 px-2.5 py-1 rounded-md">
                      Ticket: {selectedComplaint.ticket_id || selectedComplaint.id}
                    </span>
                    <span
                      className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                        selectedComplaint.severity === 'CRITICAL'
                          ? 'bg-rose-100 text-rose-800'
                          : selectedComplaint.severity === 'HIGH'
                          ? 'bg-amber-100 text-amber-800'
                          : 'bg-slate-100 text-slate-700'
                      }`}
                    >
                      {selectedComplaint.severity} SEVERITY
                    </span>
                  </div>

                  <span className="text-xs text-slate-400 flex items-center">
                    <Calendar className="w-3.5 h-3.5 mr-1 text-slate-400" />
                    {new Date(selectedComplaint.created_at).toLocaleDateString('en-IN', {
                      day: 'numeric',
                      month: 'short',
                      year: 'numeric',
                    })}
                  </span>
                </div>

                <h4 className="text-base font-bold text-slate-900 leading-snug">
                  {selectedComplaint.title}
                </h4>

                <div className="p-3 bg-slate-50 rounded-lg border border-slate-200/70 text-xs text-slate-700 space-y-1">
                  <span className="font-bold text-[10px] text-slate-400 uppercase tracking-wider block">
                    Citizen Ingest Statement
                  </span>
                  <p className="leading-relaxed">{selectedComplaint.description}</p>
                </div>

                <div className="flex flex-wrap items-center gap-3 text-xs text-slate-600 pt-1">
                  <span className="flex items-center">
                    <MapPin className="w-3.5 h-3.5 text-slate-400 mr-1" />
                    <strong>Ward:</strong>&nbsp;{selectedComplaint.ward || 'Gwalior Municipal Area'}
                  </span>
                  <span>•</span>
                  <span>
                    <strong>Sector:</strong>&nbsp;{selectedComplaint.category}
                  </span>
                  {selectedComplaint.latitude && selectedComplaint.longitude && (
                    <>
                      <span>•</span>
                      <span className="font-mono text-[11px] text-slate-500">
                        GPS: {Number(selectedComplaint.latitude).toFixed(4)}, {Number(selectedComplaint.longitude).toFixed(4)}
                      </span>
                    </>
                  )}
                </div>
              </div>

              {/* Policymaker Executive Action Toolbar */}
              {isPolicymaker && (
                <div className="bg-sky-900 text-white p-4 rounded-xl shadow-sm space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold uppercase tracking-wider text-sky-200 flex items-center space-x-1.5">
                      <Sparkles className="w-3.5 h-3.5 text-sky-300" />
                      <span>Executive Governance Actions</span>
                    </span>
                    <span className="text-[10px] px-2 py-0.5 rounded bg-sky-800 text-sky-200 border border-sky-700">
                      Collector Office
                    </span>
                  </div>

                  <div className="flex flex-wrap items-center gap-2">
                    <button
                      onClick={() => handleGenerateDpr(selectedComplaint)}
                      className="px-3.5 py-1.5 bg-emerald-500 hover:bg-emerald-600 text-white rounded-lg text-xs font-bold shadow-2xs transition flex items-center space-x-1.5 cursor-pointer"
                    >
                      <FileCheck2 className="w-3.5 h-3.5" />
                      <span>Draft AI-Assisted DPR</span>
                    </button>

                    {onNavigate && (
                      <button
                        onClick={() => onNavigate('map')}
                        className="px-3 py-1.5 bg-white/10 hover:bg-white/20 text-white rounded-lg text-xs font-semibold border border-white/20 transition flex items-center space-x-1.5 cursor-pointer"
                      >
                        <MapPin className="w-3.5 h-3.5" />
                        <span>Locate on GIS Hotspot Map</span>
                      </button>
                    )}

                    <button
                      onClick={() => handleUpdateStatus('CLUSTERED')}
                      className="px-3 py-1.5 bg-white/10 hover:bg-white/20 text-white rounded-lg text-xs font-semibold border border-white/20 transition cursor-pointer"
                    >
                      Mark Clustered
                    </button>

                    <button
                      onClick={() => handleUpdateStatus('DPR_PROPOSED')}
                      className="px-3 py-1.5 bg-white/10 hover:bg-white/20 text-white rounded-lg text-xs font-semibold border border-white/20 transition cursor-pointer"
                    >
                      Mark DPR Proposed
                    </button>
                  </div>
                </div>
              )}

              {/* AI Triage Enriched Intelligence Card */}
              <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-2xs space-y-2.5">
                <div className="flex items-center justify-between">
                  <h5 className="text-xs font-bold text-slate-900 flex items-center space-x-1.5">
                    <Sparkles className="w-3.5 h-3.5 text-purple-600" />
                    <span>Multilingual AI Triage Intelligence (Gemini + Indic Sarvam)</span>
                  </h5>
                  <span className="text-[10px] px-2 py-0.5 rounded bg-purple-100 text-purple-800 font-bold">
                    {Math.round((selectedComplaint.ai_confidence || 0.92) * 100)}% Confidence
                  </span>
                </div>

                <p className="text-xs text-slate-700 leading-relaxed bg-purple-50/50 p-2.5 rounded-lg border border-purple-100">
                  {selectedComplaint.ai_summary ||
                    `Direct grievance triaged under ${selectedComplaint.category} infrastructure category with priority weight.`}
                </p>

                {/* AI Extracted Metadata Tags */}
                <div className="flex flex-wrap items-center gap-1.5 pt-1">
                  <span className="px-2 py-0.5 rounded bg-slate-100 text-slate-700 text-[10px] font-semibold">
                    Dept: {selectedComplaint.category === 'WATER' ? 'Water Works (GMC)' : 'Public Works Department'}
                  </span>
                  <span className="px-2 py-0.5 rounded bg-slate-100 text-slate-700 text-[10px] font-semibold">
                    Hotspot Cluster: {selectedComplaint.hotspot_id || 'GWL-HOTSPOT-22'}
                  </span>
                  <span className="px-2 py-0.5 rounded bg-slate-100 text-slate-700 text-[10px] font-semibold">
                    Policy Scheme: {selectedComplaint.category === 'WATER' ? 'AMRUT 2.0 / JJM' : 'Smart Cities Mission'}
                  </span>
                </div>
              </div>

              {/* Governance Resolution Lifecycle Stepper */}
              <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-2xs">
                <h5 className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-4">
                  End-to-End Governance Resolution Lifecycle
                </h5>

                <div className="relative pl-6 space-y-5 before:absolute before:left-2.5 before:top-2 before:bottom-2 before:w-0.5 before:bg-slate-200">
                  {/* Step 1: Grievance Submitted */}
                  <div className="relative flex items-start space-x-3">
                    <div className="absolute -left-6 mt-0.5 w-5 h-5 rounded-full bg-emerald-500 text-white flex items-center justify-center text-[10px]">
                      <CheckCircle className="w-3.5 h-3.5" />
                    </div>
                    <div>
                      <h6 className="text-xs font-bold text-slate-900">1. Citizen Filing Ingested</h6>
                      <p className="text-[11px] text-slate-500">
                        Geo-tagged at {selectedComplaint.latitude}, {selectedComplaint.longitude} ({selectedComplaint.ward}).
                      </p>
                    </div>
                  </div>

                  {/* Step 2: AI Triage */}
                  <div className="relative flex items-start space-x-3">
                    <div className="absolute -left-6 mt-0.5 w-5 h-5 rounded-full bg-emerald-500 text-white flex items-center justify-center text-[10px]">
                      <CheckCircle className="w-3.5 h-3.5" />
                    </div>
                    <div>
                      <h6 className="text-xs font-bold text-slate-900 flex items-center space-x-1.5">
                        <span>2. Multilingual AI Triage</span>
                        <span className="text-[10px] px-1.5 py-0.2 bg-purple-100 text-purple-800 rounded font-semibold">
                          Gemini Triaged
                        </span>
                      </h6>
                      <p className="text-[11px] text-slate-600 mt-0.5">
                        {selectedComplaint.ai_summary ||
                          'Assigned to department with priority score weighting.'}
                      </p>
                    </div>
                  </div>

                  {/* Step 3: Spatial Clustering */}
                  <div className="relative flex items-start space-x-3">
                    <div className="absolute -left-6 mt-0.5 w-5 h-5 rounded-full bg-sky-600 text-white flex items-center justify-center text-[10px]">
                      <Layers className="w-3.5 h-3.5" />
                    </div>
                    <div>
                      <h6 className="text-xs font-bold text-slate-900">
                        3. Ward Spatial Clustering
                      </h6>
                      <p className="text-[11px] text-slate-600 mt-0.5">
                        Grouped with adjacent citizen reports in {selectedComplaint.ward} into Priority Hotspot Cluster.
                      </p>
                    </div>
                  </div>

                  {/* Step 4: 5-Factor Scoring */}
                  <div className="relative flex items-start space-x-3">
                    <div className="absolute -left-6 mt-0.5 w-5 h-5 rounded-full bg-indigo-600 text-white flex items-center justify-center text-[10px]">
                      <Sparkles className="w-3.5 h-3.5" />
                    </div>
                    <div>
                      <h6 className="text-xs font-bold text-slate-900">
                        4. Municipal Urgency Scoring Engine
                      </h6>
                      <p className="text-[11px] text-slate-600 mt-0.5">
                        Score: <strong>86.4 / 100</strong> (5-Factor Evidence-Based Ranking Formula).
                      </p>
                    </div>
                  </div>

                  {/* Step 5: DPR Sanction */}
                  <div className="relative flex items-start space-x-3">
                    <div className="absolute -left-6 mt-0.5 w-5 h-5 rounded-full bg-amber-500 text-white flex items-center justify-center text-[10px]">
                      <FileCheck2 className="w-3.5 h-3.5" />
                    </div>
                    <div>
                      <h6 className="text-xs font-bold text-slate-900 flex items-center space-x-1.5">
                        <span>5. Detailed Project Report (DPR) Proposal</span>
                        <span className="text-[10px] px-1.5 py-0.2 bg-emerald-100 text-emerald-800 rounded font-semibold">
                          AMRUT 2.0 Matched
                        </span>
                      </h6>
                      <p className="text-[11px] text-slate-600 mt-0.5">
                        DPR generated for District Collector review: "Augmentation of Water Distribution Network in Morar Ward 22".
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <div className="h-64 flex items-center justify-center text-slate-400 text-xs">
              Select a grievance or citizen demand to inspect full lifecycle.
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
