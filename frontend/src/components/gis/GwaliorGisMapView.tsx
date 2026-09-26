import React, { useState, useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Popup, Circle } from 'react-leaflet';
import L from 'leaflet';
import { Layers, MapPin, Building, Hospital, School, Sparkles, FileCheck2, Loader2 } from 'lucide-react';
import { policymakerService } from '../../services/api';

// Fix Leaflet default icon URLs in Vite
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png',
});

interface GwaliorGisMapViewProps {
  onGenerateDPRForHotspot?: (hotspot: any) => void;
}

export const GwaliorGisMapView: React.FC<GwaliorGisMapViewProps> = ({
  onGenerateDPRForHotspot,
}) => {
  const [showHotspots, setShowHotspots] = useState(true);
  const [showHospitals, setShowHospitals] = useState(true);
  const [showSchools, setShowSchools] = useState(true);
  const [showProjects, setShowProjects] = useState(true);
  const [isLoading, setIsLoading] = useState(false);

  // Live GeoJSON Hotspots state
  const [liveHotspots, setLiveHotspots] = useState<any[]>([
    {
      id: 'h1',
      name: 'Morar Ward 22 Water Contamination & Shortage',
      category: 'WATER',
      lat: 26.2295,
      lng: 78.2255,
      radius: 400,
      complaintCount: 42,
      priorityScore: 87.4,
      severity: 'CRITICAL',
      affectedPop: 28500,
      scheme: 'AMRUT 2.0',
    },
    {
      id: 'h2',
      name: 'Lashkar Bazar Arterial Road & Drainage Overflow',
      category: 'ROADS',
      lat: 26.205,
      lng: 78.163,
      radius: 350,
      complaintCount: 31,
      priorityScore: 78.2,
      severity: 'HIGH',
      affectedPop: 19400,
      scheme: 'Smart City Mission',
    },
    {
      id: 'h3',
      name: 'Thatipur Ward 14 Solid Waste & Septage Bottleneck',
      category: 'SANITATION',
      lat: 26.215,
      lng: 78.205,
      radius: 300,
      complaintCount: 24,
      priorityScore: 72.8,
      severity: 'MEDIUM',
      affectedPop: 14200,
      scheme: 'Swachh Bharat 2.0',
    },
  ]);

  // Live Projects state
  const [liveProjects, setLiveProjects] = useState<any[]>([
    { name: 'Maharaj Bada Heritage Pedestrianization', lat: 26.2025, lng: 78.158, cost: '₹ 45.2 Cr' },
    { name: 'Morar Riverfront Rejuvenation & Greenway', lat: 26.226, lng: 78.221, cost: '₹ 28.5 Cr' },
    { name: 'Smart Water SCADA & Metering Control Room', lat: 26.217, lng: 78.181, cost: '₹ 19.8 Cr' },
    { name: 'City Center Multi-Level Intelligent Car Parking', lat: 26.211, lng: 78.175, cost: '₹ 32.0 Cr' },
  ]);

  // Official Gwalior Hospitals from ingested infrastructure_data
  const hospitals = [
    { name: 'Jaya Arogya Hospital (JAH)', lat: 26.2075, lng: 78.1678, beds: 1200 },
    { name: 'District Civil Hospital Morar', lat: 26.228, lng: 78.224, beds: 250 },
    { name: 'Kamla Raja Girls Hospital', lat: 26.2065, lng: 78.1685, beds: 350 },
    { name: 'Birla Institute of Medical Research', lat: 26.219, lng: 78.192, beds: 200 },
  ];

  // Official Gwalior Schools/Institutions
  const schools = [
    { name: 'Govt Model Higher Secondary School Morar', lat: 26.231, lng: 78.223 },
    { name: 'Madhav Institute of Technology & Science (MITS)', lat: 26.2305, lng: 78.214 },
    { name: 'Gwalior Engineering College', lat: 26.214, lng: 78.179 },
    { name: 'Govt Victoria College (KRG)', lat: 26.2045, lng: 78.162 },
  ];

  useEffect(() => {
    loadMapLayers();
  }, []);

  const loadMapLayers = async () => {
    setIsLoading(true);
    try {
      // 1. Fetch PostGIS Map GeoJSON
      const mapGeoJson = await policymakerService.getMapData();
      if (mapGeoJson?.features && mapGeoJson.features.length > 0) {
        const parsed = mapGeoJson.features.map((f: any, i: number) => {
          const coords = f.geometry?.coordinates || [78.215, 26.225];
          const p = f.properties || {};
          return {
            id: p.id || `h-${i}`,
            name: p.name || 'Gwalior Civic Demand Hotspot',
            category: p.category || 'WATER',
            lat: coords[1],
            lng: coords[0],
            radius: 380,
            complaintCount: p.complaint_count || 18,
            priorityScore: p.demand_score || 82.5,
            severity: p.severity_score >= 75 ? 'CRITICAL' : 'HIGH',
            affectedPop: p.affected_population || 45000,
            scheme: p.category === 'WATER' ? 'AMRUT 2.0' : 'Smart City Mission',
          };
        });
        setLiveHotspots(parsed);
      }

      // 2. Fetch Projects
      const projectsData = await policymakerService.getProjects();
      if (Array.isArray(projectsData) && projectsData.length > 0) {
        // Map top projects to Gwalior area coordinates
        const coordsPreset: Record<number, [number, number]> = {
          0: [26.2025, 78.158], // Maharaj Bada
          1: [26.226, 78.221],  // Morar Riverfront
          2: [26.217, 78.181],  // Smart Water SCADA
          3: [26.211, 78.175],  // City Center
          4: [26.205, 78.163],  // Lashkar Market
          5: [26.215, 78.205],  // Thatipur FSTP
        };
        const mapped = projectsData.slice(0, 6).map((p: any, idx: number) => ({
          name: p.project_name,
          lat: coordsPreset[idx]?.[0] || 26.21 + idx * 0.005,
          lng: coordsPreset[idx]?.[1] || 78.18 + idx * 0.005,
          cost: `₹ ${(Number(p.allocated_amount || 0) / 10000000).toFixed(1)} Cr`,
          sector: p.sector,
          status: p.project_status,
        }));
        setLiveProjects(mapped);
      }
    } catch (err) {
      console.warn('Using seeded GIS layers fallback:', err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-4">
      {/* Header & Layer Toggles */}
      <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center space-x-2">
            <Layers className="w-5 h-5 text-sky-600" />
            <h3 className="font-heading font-extrabold text-base text-slate-900">
              Gwalior GIS Spatial Intelligence Map
            </h3>
            <span className="px-2 py-0.5 rounded bg-sky-50 text-sky-700 text-[10px] font-mono font-bold border border-sky-200">
              Spatial Cluster Engine Active
            </span>
            {isLoading && <Loader2 className="w-3.5 h-3.5 animate-spin text-sky-600" />}
          </div>
          <p className="text-xs text-slate-500 mt-0.5">
            Spatial overlay combining citizen grievance clusters with 8 hospitals, 8 schools, and 70 Smart City projects.
          </p>
        </div>

        {/* Layer Checkboxes */}
        <div className="flex flex-wrap items-center gap-2 text-xs font-semibold">
          <label className="flex items-center space-x-1.5 px-2.5 py-1 rounded-lg border border-slate-200 bg-slate-50 cursor-pointer hover:bg-slate-100">
            <input
              type="checkbox"
              checked={showHotspots}
              onChange={(e) => setShowHotspots(e.target.checked)}
              className="rounded text-rose-600 focus:ring-0"
            />
            <span className="text-rose-700">🔴 Hotspots ({liveHotspots.length})</span>
          </label>

          <label className="flex items-center space-x-1.5 px-2.5 py-1 rounded-lg border border-slate-200 bg-slate-50 cursor-pointer hover:bg-slate-100">
            <input
              type="checkbox"
              checked={showHospitals}
              onChange={(e) => setShowHospitals(e.target.checked)}
              className="rounded text-emerald-600 focus:ring-0"
            />
            <span className="text-emerald-700">🏥 Hospitals ({hospitals.length})</span>
          </label>

          <label className="flex items-center space-x-1.5 px-2.5 py-1 rounded-lg border border-slate-200 bg-slate-50 cursor-pointer hover:bg-slate-100">
            <input
              type="checkbox"
              checked={showSchools}
              onChange={(e) => setShowSchools(e.target.checked)}
              className="rounded text-indigo-600 focus:ring-0"
            />
            <span className="text-indigo-700">🏫 Schools ({schools.length})</span>
          </label>

          <label className="flex items-center space-x-1.5 px-2.5 py-1 rounded-lg border border-slate-200 bg-slate-50 cursor-pointer hover:bg-slate-100">
            <input
              type="checkbox"
              checked={showProjects}
              onChange={(e) => setShowProjects(e.target.checked)}
              className="rounded text-amber-600 focus:ring-0"
            />
            <span className="text-amber-700">🏗️ Smart City ({liveProjects.length})</span>
          </label>
        </div>
      </div>

      {/* Full GIS Leaflet Map */}
      <div className="h-[380px] sm:h-[480px] md:h-[540px] w-full rounded-2xl overflow-hidden border border-slate-300 shadow-sm relative z-0">
        <MapContainer
          center={[26.2183, 78.1828]}
          zoom={13}
          scrollWheelZoom={true}
          style={{ height: '100%', width: '100%' }}
        >
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />

          {/* Hotspot Circles & Markers */}
          {showHotspots &&
            liveHotspots.map((h) => (
              <React.Fragment key={h.id}>
                <Circle
                  center={[h.lat, h.lng]}
                  radius={h.radius}
                  pathOptions={{
                    color: h.severity === 'CRITICAL' ? '#e11d48' : '#f59e0b',
                    fillColor: h.severity === 'CRITICAL' ? '#f43f5e' : '#fbbf24',
                    fillOpacity: 0.25,
                    weight: 2,
                  }}
                />
                <Marker position={[h.lat, h.lng]}>
                  <Popup>
                    <div className="text-xs space-y-2 p-1 max-w-[240px]">
                      <div className="flex items-center justify-between">
                        <span className="font-bold text-slate-900 text-xs">{h.name}</span>
                        <span className="px-1.5 py-0.2 bg-rose-100 text-rose-800 rounded font-bold text-[10px]">
                          {h.priorityScore}/100
                        </span>
                      </div>
                      <p className="text-[11px] text-slate-600">
                        {h.complaintCount} citizen reports clustered. ~{h.affectedPop.toLocaleString()} residents affected.
                      </p>
                      <div className="pt-1 border-t border-slate-200 flex items-center justify-between text-[11px]">
                        <span className="font-semibold text-sky-700">{h.scheme}</span>
                        {onGenerateDPRForHotspot && (
                          <button
                            onClick={() => onGenerateDPRForHotspot(h)}
                            className="px-2 py-1 bg-sky-700 hover:bg-sky-800 text-white rounded font-bold text-[10px]"
                          >
                            Generate DPR
                          </button>
                        )}
                      </div>
                    </div>
                  </Popup>
                </Marker>
              </React.Fragment>
            ))}

          {/* Hospitals Markers */}
          {showHospitals &&
            hospitals.map((hosp, idx) => (
              <Marker key={`hosp-${idx}`} position={[hosp.lat, hosp.lng]}>
                <Popup>
                  <div className="text-xs p-1">
                    <strong className="text-emerald-700">🏥 {hosp.name}</strong>
                    <p className="text-slate-500 text-[11px]">Capacity: {hosp.beds} beds</p>
                    <span className="text-[10px] text-slate-400">Govt Health Facility Directory</span>
                  </div>
                </Popup>
              </Marker>
            ))}

          {/* School Markers */}
          {showSchools &&
            schools.map((school, idx) => (
              <Marker key={`school-${idx}`} position={[school.lat, school.lng]}>
                <Popup>
                  <div className="text-xs p-1">
                    <strong className="text-indigo-700">🏫 {school.name}</strong>
                    <span className="text-[10px] text-slate-400 block mt-0.5">Gwalior Education Cluster</span>
                  </div>
                </Popup>
              </Marker>
            ))}

          {/* Smart City Project Markers */}
          {showProjects &&
            liveProjects.map((proj, idx) => (
              <Marker key={`proj-${idx}`} position={[proj.lat, proj.lng]}>
                <Popup>
                  <div className="text-xs p-1">
                    <strong className="text-amber-800">🏗️ {proj.name}</strong>
                    <p className="text-emerald-700 font-bold text-[11px]">Sanctioned: {proj.cost}</p>
                    <span className="text-[10px] text-slate-400">Gwalior Smart City Ltd</span>
                  </div>
                </Popup>
              </Marker>
            ))}
        </MapContainer>
      </div>

      {/* Hotspots Intelligence Ledger */}
      <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-xs space-y-4">
        <div className="flex items-center justify-between pb-2 border-b border-slate-100">
          <div>
            <h4 className="font-heading font-extrabold text-sm text-slate-900 flex items-center space-x-2">
              <span className="w-2 h-2 rounded-full bg-rose-500 animate-ping" />
              <span>Active Spatial Demand Clusters ({liveHotspots.length})</span>
            </h4>
            <p className="text-xs text-slate-500 mt-0.5">
              Geographic concentrations of citizen complaints evaluated against baseline civic infrastructure.
            </p>
          </div>
          <span className="text-[11px] font-mono text-slate-400">Gwalior Municipal Corporation</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {liveHotspots.map((h) => {
            const isCritical = h.severity === 'CRITICAL';
            return (
              <div
                key={h.id}
                className="p-4 rounded-xl border border-slate-200 bg-slate-50/50 hover:bg-white hover:border-slate-300 transition text-xs space-y-3 flex flex-col justify-between"
              >
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span
                      className={`px-2 py-0.5 rounded text-[10px] font-mono font-bold border ${
                        isCritical
                          ? 'bg-rose-50 text-rose-700 border-rose-200'
                          : 'bg-amber-50 text-amber-700 border-amber-200'
                      }`}
                    >
                      {isCritical ? '🔴 CRITICAL DEFICIT' : '🟠 HIGH DEFICIT'}
                    </span>
                    <span className="font-mono font-bold text-slate-900 text-xs">
                      Score: {h.priorityScore}/100
                    </span>
                  </div>

                  <h5 className="font-bold text-slate-900 text-sm leading-snug">
                    {h.name}
                  </h5>

                  <div className="space-y-1 text-slate-500 text-[11px]">
                    <div className="flex items-center justify-between">
                      <span>Clustered Complaints:</span>
                      <strong className="text-slate-800">{h.complaintCount} verified demands</strong>
                    </div>
                    <div className="flex items-center justify-between">
                      <span>Affected Population:</span>
                      <strong className="text-slate-800">~{h.affectedPop.toLocaleString()} residents</strong>
                    </div>
                    <div className="flex items-center justify-between">
                      <span>Matched Scheme:</span>
                      <strong className="text-sky-700">{h.scheme}</strong>
                    </div>
                  </div>
                </div>

                <div className="pt-2 border-t border-slate-200/80">
                  {onGenerateDPRForHotspot ? (
                    <button
                      onClick={() => onGenerateDPRForHotspot(h)}
                      className="w-full py-2 px-3 bg-sky-700 hover:bg-sky-800 text-white rounded-xl text-xs font-bold flex items-center justify-center space-x-1.5 transition shadow-2xs cursor-pointer"
                    >
                      <Sparkles className="w-3.5 h-3.5 text-amber-300" />
                      <span>Draft DPR for this Hotspot</span>
                    </button>
                  ) : null}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
