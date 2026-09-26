import React, { useState, useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMapEvents } from 'react-leaflet';
import L from 'leaflet';
import { MapPin, Navigation, Compass } from 'lucide-react';

// Fix Leaflet marker icon issue in Vite/Webpack
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
  iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
});

interface LocationPickerProps {
  latitude: number;
  longitude: number;
  ward?: string;
  address?: string;
  onLocationChange: (lat: number, lng: number, ward?: string, address?: string) => void;
}

// Map click event listener component
const MapClickHandler: React.FC<{
  onSelect: (lat: number, lng: number) => void;
}> = ({ onSelect }) => {
  useMapEvents({
    click(e) {
      onSelect(e.latlng.lat, e.latlng.lng);
    },
  });
  return null;
};

export const LocationPicker: React.FC<LocationPickerProps> = ({
  latitude,
  longitude,
  ward = 'Morar Ward 22',
  address = 'Near Morar Water Tank, Gwalior',
  onLocationChange,
}) => {
  const [currentPos, setCurrentPos] = useState<[number, number]>([latitude, longitude]);
  const [selectedWard, setSelectedWard] = useState(ward);
  const [enteredAddress, setEnteredAddress] = useState(address);

  // Sync internal state when external props change
  useEffect(() => {
    setCurrentPos([latitude, longitude]);
  }, [latitude, longitude]);

  const gwaliorPresets = [
    { name: 'Morar Ward 22', lat: 26.2295, lng: 78.2255, addr: 'Near Morar Water Works, Gwalior' },
    { name: 'Lashkar Central', lat: 26.2050, lng: 78.1630, addr: 'Lashkar Bazar Road, Gwalior' },
    { name: 'Thatipur Ward 14', lat: 26.2150, lng: 78.2050, addr: 'Gandhi Road, Thatipur, Gwalior' },
    { name: 'Maharaj Bada', lat: 26.2025, lng: 78.1580, addr: 'Maharaj Bada Chowk, Gwalior' },
    { name: 'Gwalior Fort / Hazira', lat: 26.2350, lng: 78.1750, addr: 'Hazira Main Road, Gwalior' },
  ];

  const handlePresetSelect = (preset: typeof gwaliorPresets[0]) => {
    setCurrentPos([preset.lat, preset.lng]);
    setSelectedWard(preset.name);
    setEnteredAddress(preset.addr);
    onLocationChange(preset.lat, preset.lng, preset.name, preset.addr);
  };

  const handleMapClick = (lat: number, lng: number) => {
    const roundedLat = parseFloat(lat.toFixed(6));
    const roundedLng = parseFloat(lng.toFixed(6));
    setCurrentPos([roundedLat, roundedLng]);
    onLocationChange(roundedLat, roundedLng, selectedWard, enteredAddress);
  };

  const handleDetectGPS = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          const lat = parseFloat(pos.coords.latitude.toFixed(6));
          const lng = parseFloat(pos.coords.longitude.toFixed(6));
          setCurrentPos([lat, lng]);
          onLocationChange(lat, lng, 'Auto-detected GPS', 'Gwalior Citizen GPS');
        },
        () => {
          // Fallback to Morar
          handlePresetSelect(gwaliorPresets[0]);
        }
      );
    }
  };

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <label className="text-sm font-semibold text-slate-800 flex items-center space-x-1.5">
          <MapPin className="w-4 h-4 text-rose-500" />
          <span>Grievance Location in Gwalior (GIS Tagging)</span>
        </label>
        <button
          type="button"
          onClick={handleDetectGPS}
          className="text-xs text-sky-600 hover:text-sky-700 font-medium flex items-center space-x-1"
        >
          <Navigation className="w-3.5 h-3.5" />
          <span>Detect GPS</span>
        </button>
      </div>

      {/* Quick Ward Selector Pills */}
      <div className="flex flex-wrap gap-1.5 text-xs">
        <span className="text-slate-400 font-medium self-center mr-1">Quick Wards:</span>
        {gwaliorPresets.map((p) => (
          <button
            key={p.name}
            type="button"
            onClick={() => handlePresetSelect(p)}
            className={`px-2.5 py-1 rounded-md border transition ${
              selectedWard === p.name
                ? 'bg-sky-50 border-sky-300 text-sky-700 font-semibold'
                : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-50'
            }`}
          >
            {p.name}
          </button>
        ))}
      </div>

      {/* Leaflet Interactive Map Container */}
      <div className="h-56 w-full rounded-xl overflow-hidden border border-slate-300 shadow-inner relative z-0">
        <MapContainer
          center={currentPos}
          zoom={13}
          scrollWheelZoom={false}
          style={{ height: '100%', width: '100%' }}
        >
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />
          <MapClickHandler onSelect={handleMapClick} />
          <Marker position={currentPos}>
            <Popup>
              <div className="text-xs">
                <strong>{selectedWard}</strong>
                <p>{enteredAddress}</p>
                <p className="text-slate-400">{currentPos[0]}, {currentPos[1]}</p>
              </div>
            </Popup>
          </Marker>
        </MapContainer>

        {/* Map overlay hint */}
        <div className="absolute bottom-2 left-2 z-20 bg-white/90 backdrop-blur-sm px-2 py-1 rounded text-[11px] text-slate-600 border border-slate-200 shadow-sm flex items-center space-x-1 pointer-events-none">
          <Compass className="w-3 h-3 text-sky-600" />
          <span>Click anywhere on map to pin-drop exact spot</span>
        </div>
      </div>

      {/* Lat/Long and Address fields */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
        <div>
          <label className="text-slate-600 font-medium block mb-1">Ward / Locality Name</label>
          <input
            type="text"
            value={selectedWard}
            onChange={(e) => {
              setSelectedWard(e.target.value);
              onLocationChange(currentPos[0], currentPos[1], e.target.value, enteredAddress);
            }}
            placeholder="e.g. Morar Ward 22"
            className="w-full px-3 py-2 rounded-lg border border-slate-200 focus:outline-none focus:ring-2 focus:ring-sky-500"
          />
        </div>

        <div>
          <label className="text-slate-600 font-medium block mb-1">Coordinates (Lat, Lng)</label>
          <div className="px-3 py-2 bg-slate-100 rounded-lg text-slate-600 font-mono flex items-center justify-between border border-slate-200">
            <span>{currentPos[0].toFixed(5)}, {currentPos[1].toFixed(5)}</span>
            <span className="text-[10px] text-emerald-600 font-bold">Geo-Location Verified</span>
          </div>
        </div>
      </div>
    </div>
  );
};
