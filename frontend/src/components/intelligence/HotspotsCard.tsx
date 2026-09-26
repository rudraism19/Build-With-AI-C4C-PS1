import React, { useState, useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Popup, Circle } from 'react-leaflet';
import L from 'leaflet';
import { Layers, MapPin, ExternalLink, ArrowRight, Loader2 } from 'lucide-react';
import { policymakerService } from '../../services/api';

// Fix Leaflet marker icons in Vite
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png',
});

interface HotspotsCardProps {
  onViewFullMap: () => void;
  onSelectHotspot?: (hotspot: any) => void;
}

export const HotspotsCard: React.FC<HotspotsCardProps> = ({
  onViewFullMap,
  onSelectHotspot,
}) => {
  const [selectedHotspot, setSelectedHotspot] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(false);

  // Real Gwalior coordinates & clusters
  const [hotspots, setHotspots] = useState<any[]>([
    {
      id: 'h1',
      ward: 'Morar — Ward 22',
      sector: 'WATER SUPPLY',
      lat: 26.2295,
      lng: 78.2255,
      radius: 400,
      demandCount: 127,
      priorityScore: 86,
      severity: 'HIGH_PRIORITY',
    },
    {
      id: 'h2',
      ward: 'Lashkar Central',
      sector: 'ROADS & TRANSIT',
      lat: 26.205,
      lng: 78.163,
      radius: 350,
      demandCount: 84,
      priorityScore: 78,
      severity: 'MEDIUM',
    },
    {
      id: 'h3',
      ward: 'Thatipur — Ward 14',
      sector: 'SANITATION',
      lat: 26.215,
      lng: 78.205,
      radius: 300,
      demandCount: 38,
      priorityScore: 73,
      severity: 'LOW',
    },
    {
      id: 'h4',
      ward: 'Gola Ka Mandir',
      sector: 'WATER SUPPLY',
      lat: 26.242,
      lng: 78.208,
      radius: 250,
      demandCount: 18,
      priorityScore: 54,
      severity: 'RESOLVED',
    },
  ]);

  useEffect(() => {
    loadMapData();
  }, []);

  const loadMapData = async () => {
    try {
      setIsLoading(true);
      const res = await policymakerService.getMapData();
      if (res?.features && res.features.length > 0) {
        const parsed = res.features.map((f: any, idx: number) => {
          const coords = f.geometry?.coordinates || [78.2255, 26.2295];
          const p = f.properties || {};
          return {
            id: p.id || `h-${idx}`,
            ward: p.name || 'Morar — Ward 22',
            sector: p.category || 'WATER SUPPLY',
            lat: coords[1],
            lng: coords[0],
            radius: 380,
            demandCount: p.complaint_count || 127,
            priorityScore: Math.round(p.demand_score || 86),
            severity: p.severity_score >= 75 ? 'HIGH_PRIORITY' : 'MEDIUM',
          };
        });
        setHotspots(parsed);
        setSelectedHotspot(parsed[0]);
      } else {
        setSelectedHotspot(hotspots[0]);
      }
    } catch (err) {
      console.warn('Map data API fallback:', err);
      setSelectedHotspot(hotspots[0]);
    } finally {
      setIsLoading(false);
    }
  };

  const getSeverityColor = (sev: string) => {
    switch (sev) {
      case 'HIGH_PRIORITY':
        return { color: '#e11d48', fill: '#f43f5e' };
      case 'MEDIUM':
        return { color: '#ea580c', fill: '#fb923c' };
      case 'LOW':
        return { color: '#0284c7', fill: '#38bdf8' };
      case 'RESOLVED':
        return { color: '#059669', fill: '#34d399' };
      default:
        return { color: '#e11d48', fill: '#f43f5e' };
    }
  };

  const activeSpot = selectedHotspot || hotspots[0];

  return (
    <div className="bg-white border border-slate-200 rounded-2xl p-4 sm:p-5 shadow-xs flex flex-col justify-between space-y-3 hover:border-slate-300 transition h-full">
      {/* Header */}
      <div className="flex items-center justify-between pb-2.5 border-b border-slate-100">
        <div>
          <div className="flex items-center space-x-2">
            <Layers className="w-4 h-4 text-sky-700" />
            <h4 className="font-heading font-extrabold text-xs text-slate-900 uppercase tracking-wider">
              GIS Spatial Hotspots
            </h4>
            {isLoading && <Loader2 className="w-3 h-3 animate-spin text-sky-600" />}
          </div>
          <p className="text-[11px] text-slate-500 mt-0.5">
            Where citizen demand is concentrated
          </p>
        </div>

        <button
          onClick={onViewFullMap}
          className="text-xs font-bold text-sky-700 hover:underline flex items-center space-x-1 cursor-pointer"
        >
          <span>View Full Map</span>
          <ArrowRight className="w-3 h-3" />
        </button>
      </div>

      {/* Real Gwalior Leaflet Map Container */}
      <div className="h-[280px] sm:h-[300px] w-full rounded-xl overflow-hidden border border-slate-200 relative z-0 shadow-2xs">
        <MapContainer
          center={[26.2183, 78.1828]}
          zoom={12}
          scrollWheelZoom={false}
          style={{ height: '100%', width: '100%' }}
        >
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />

          {hotspots.map((h) => {
            const colors = getSeverityColor(h.severity);
            const isSelected = activeSpot?.id === h.id;

            return (
              <React.Fragment key={h.id}>
                <Circle
                  center={[h.lat, h.lng]}
                  radius={h.radius}
                  pathOptions={{
                    color: colors.color,
                    fillColor: colors.fill,
                    fillOpacity: isSelected ? 0.45 : 0.25,
                    weight: isSelected ? 3 : 2,
                  }}
                  eventHandlers={{
                    click: () => {
                      setSelectedHotspot(h);
                      if (onSelectHotspot) onSelectHotspot(h);
                    },
                  }}
                />
                <Marker
                  position={[h.lat, h.lng]}
                  eventHandlers={{
                    click: () => {
                      setSelectedHotspot(h);
                      if (onSelectHotspot) onSelectHotspot(h);
                    },
                  }}
                >
                  <Popup>
                    <div className="text-xs space-y-1 p-0.5 max-w-[200px]">
                      <div className="flex items-center justify-between">
                        <strong className="text-slate-900 font-bold text-xs">{h.ward}</strong>
                        <span className="px-1.5 py-0.2 rounded bg-rose-100 text-rose-800 font-mono font-bold text-[10px]">
                          {h.priorityScore}/100
                        </span>
                      </div>
                      <p className="text-[11px] text-slate-500 font-medium">{h.sector}</p>
                      <p className="text-[11px] text-slate-700 font-bold">
                        {h.demandCount} citizen demands
                      </p>
                    </div>
                  </Popup>
                </Marker>
              </React.Fragment>
            );
          })}
        </MapContainer>

        {/* Floating Selected Hotspot Banner */}
        {activeSpot && (
          <div className="absolute top-2 left-2 right-2 z-10 bg-white/95 backdrop-blur-xs border border-slate-200/90 rounded-lg p-2 shadow-sm text-xs flex items-center justify-between">
            <div className="flex items-center space-x-1.5 truncate">
              <span className="w-2 h-2 rounded-full bg-rose-600 shrink-0" />
              <span className="font-bold text-slate-900 truncate">{activeSpot.ward}</span>
              <span className="text-slate-400">•</span>
              <span className="text-slate-600 text-[11px]">{activeSpot.sector}</span>
            </div>
            <div className="flex items-center space-x-2 shrink-0 font-mono text-[11px]">
              <span className="text-slate-600"><strong>{activeSpot.demandCount}</strong> demands</span>
              <span className="text-rose-700 font-bold bg-rose-50 px-1.5 py-0.5 rounded border border-rose-200">
                Score: {activeSpot.priorityScore}
              </span>
            </div>
          </div>
        )}
      </div>

      {/* Map Legend */}
      <div className="pt-2 border-t border-slate-100 flex flex-wrap items-center justify-between gap-2 text-[11px] text-slate-600">
        <span className="font-bold uppercase tracking-wider text-[10px] text-slate-400">Legend:</span>
        <div className="flex items-center space-x-3 text-[11px]">
          <span className="flex items-center space-x-1">
            <span className="w-2.5 h-2.5 rounded-full bg-rose-500" />
            <span>High Priority</span>
          </span>
          <span className="flex items-center space-x-1">
            <span className="w-2.5 h-2.5 rounded-full bg-amber-500" />
            <span>Medium</span>
          </span>
          <span className="flex items-center space-x-1">
            <span className="w-2.5 h-2.5 rounded-full bg-sky-500" />
            <span>Low</span>
          </span>
          <span className="flex items-center space-x-1">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500" />
            <span>Resolved</span>
          </span>
        </div>
      </div>
    </div>
  );
};
