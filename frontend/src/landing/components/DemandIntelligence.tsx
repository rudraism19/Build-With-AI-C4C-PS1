import React, { useState } from 'react';
import { useLanguage } from '../context/LanguageContext';
import { DEMAND_HOTSPOTS } from '../data/hotspots';
import { DemandCategory, HotspotData } from '../types';
import { TextReveal, ScrollReveal } from './common/ScrollReveal';

interface DemandIntelligenceProps {
  onSelectHotspotForDossier?: (category: DemandCategory) => void;
}

export const DemandIntelligence: React.FC<DemandIntelligenceProps> = ({ onSelectHotspotForDossier }) => {
  const { t } = useLanguage();
  const [selectedCategory, setSelectedCategory] = useState<DemandCategory>('all');
  const [hoveredHotspot, setHoveredHotspot] = useState<HotspotData | null>(null);
  const [pinnedHotspot, setPinnedHotspot] = useState<HotspotData | null>(DEMAND_HOTSPOTS[1]); // Default to Water

  const categories: { key: DemandCategory; label: string }[] = [
    { key: 'all', label: t.allDemands },
    { key: 'roads', label: t.roads },
    { key: 'water', label: t.water },
    { key: 'healthcare', label: t.healthcare },
    { key: 'education', label: t.education },
    { key: 'transport', label: t.transport },
    { key: 'digital', label: t.digital },
  ];

  const filteredHotspots =
    selectedCategory === 'all'
      ? DEMAND_HOTSPOTS
      : DEMAND_HOTSPOTS.filter((h) => h.category === selectedCategory);

  const activeHotspot = hoveredHotspot || pinnedHotspot || DEMAND_HOTSPOTS[1];

  const getDemandColor = (level: string) => {
    switch (level) {
      case 'Critical':
        return {
          bg: 'bg-red-500',
          ring: 'bg-red-500/40',
          badge: 'bg-red-100 text-red-700',
          border: 'border-red-500',
        };
      case 'High':
        return {
          bg: 'bg-orange-500',
          ring: 'bg-orange-500/30',
          badge: 'bg-orange-100 text-orange-700',
          border: 'border-orange-500',
        };
      default:
        return {
          bg: 'bg-purple-500',
          ring: 'bg-purple-500/30',
          badge: 'bg-purple-100 text-purple-700',
          border: 'border-purple-500',
        };
    }
  };

  return (
    <section id="intelligence" className="py-24 bg-slate-50/60 relative border-b border-slate-200/80">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-6">
          <div>
            <ScrollReveal direction="up" delay={0}>
              <span className="text-xs font-bold uppercase tracking-wider text-blue-700 bg-blue-50 px-3 py-1 rounded-full border border-blue-100">
                {t.mapEyebrow}
              </span>
            </ScrollReveal>

            <TextReveal
              text={t.mapHeading}
              as="h2"
              className="mt-3 text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight"
              delay={80}
              wordStagger={35}
            />

            <ScrollReveal direction="up" delay={200}>
              <p className="mt-2 text-slate-600 max-w-xl">{t.mapSubheading}</p>
            </ScrollReveal>
          </div>

          {/* Hotspot Category Filter Badges */}
          <ScrollReveal direction="up" delay={150}>
            <div className="flex flex-wrap gap-2" role="tablist" aria-label="Demand Categories">
              {categories.map((cat) => (
                <button
                  key={cat.key}
                  type="button"
                  role="tab"
                  aria-selected={selectedCategory === cat.key}
                  onClick={() => setSelectedCategory(cat.key)}
                  className={`px-3 py-1 text-xs font-semibold rounded-lg transition-all focus:outline-none focus:ring-2 focus:ring-blue-500 cursor-pointer ${
                    selectedCategory === cat.key
                      ? 'bg-blue-600 text-white shadow-xs'
                      : 'bg-white border border-slate-200 text-slate-700 hover:border-blue-400'
                  }`}
                >
                  {cat.label}
                </button>
              ))}
            </div>
          </ScrollReveal>
        </div>

        {/* Main Intelligence Interactive Display */}
        <ScrollReveal direction="up" delay={150} distance={24}>
          <div className="bg-white rounded-3xl border border-slate-200 shadow-xl overflow-hidden grid grid-cols-1 lg:grid-cols-12">
            {/* Stylized Map of India with Animated Hotspots (7 Cols) */}
            <div className="lg:col-span-7 p-6 sm:p-10 bg-gradient-to-br from-slate-900 via-blue-950 to-slate-900 text-white relative flex flex-col justify-between min-h-[490px]">
              {/* Map Status Header */}
              <div className="flex items-center justify-between z-10">
                <div className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-ping" />
                  <span className="text-xs font-bold uppercase tracking-wider text-emerald-300">
                    Live Geospatial Heatmap
                  </span>
                </div>
                <span className="text-xs font-mono text-slate-400">Resolution: Sub-District / Block</span>
              </div>

              {/* Stylized India Map Canvas with Glowing Interactive Nodes */}
              <div className="relative my-auto flex items-center justify-center py-6">
                {/* India Silhouette SVG */}
                <svg className="w-80 h-96 text-blue-800/40" viewBox="0 0 300 360" fill="currentColor">
                  <path
                    d="M145 20 C130 35 110 40 100 60 C90 80 100 100 85 115 C70 130 50 140 45 160 C38 180 50 200 65 215 C85 235 110 270 135 320 C145 340 155 340 165 320 C190 270 215 235 235 215 C250 200 262 180 255 160 C250 140 230 130 215 115 C200 100 210 80 200 60 C190 40 170 35 155 20 Z"
                    opacity="0.35"
                  />
                  <path
                    d="M145 30 L110 70 L95 120 L55 165 L75 220 L145 315 L215 220 L235 165 L195 120 L180 70 Z"
                    stroke="#38BDF8"
                    strokeWidth="1.5"
                    fill="none"
                    strokeDasharray="4 4"
                    opacity="0.6"
                  />
                  {/* Subtle coordinate grid lines inside India */}
                  <line x1="50" y1="160" x2="250" y2="160" stroke="#1E3A8A" strokeWidth="1" />
                  <line x1="80" y1="220" x2="220" y2="220" stroke="#1E3A8A" strokeWidth="1" />
                  <line x1="145" y1="30" x2="145" y2="330" stroke="#1E3A8A" strokeWidth="1" />
                </svg>

                {/* Dynamic Hotspot Nodes */}
                {filteredHotspots.map((spot) => {
                  const colors = getDemandColor(spot.demandLevel);
                  const isCurrent = activeHotspot?.id === spot.id;

                  return (
                    <div
                      key={spot.id}
                      style={{ top: `${spot.coordinates.y}%`, left: `${spot.coordinates.x}%` }}
                      className="absolute -translate-x-1/2 -translate-y-1/2 group cursor-pointer z-20"
                      onMouseEnter={() => setHoveredHotspot(spot)}
                      onMouseLeave={() => setHoveredHotspot(null)}
                      onClick={() => {
                        setPinnedHotspot(spot);
                        if (onSelectHotspotForDossier) {
                          onSelectHotspotForDossier(spot.category);
                        }
                      }}
                      role="button"
                      tabIndex={0}
                      aria-label={`${spot.title}, ${spot.categoryLabel}`}
                    >
                      {/* Pulsing Aura */}
                      <span
                        className={`absolute -inset-3 rounded-full animate-pulse transition-opacity ${colors.ring} ${
                          isCurrent ? 'opacity-100 scale-125' : 'opacity-60'
                        }`}
                      />

                      {/* Node Core Dot */}
                      <div
                        className={`w-5 h-5 rounded-full border-2 border-white flex items-center justify-center shadow-lg transition-transform ${
                          colors.bg
                        } ${isCurrent ? 'scale-125 ring-2 ring-cyan-300' : 'group-hover:scale-110'}`}
                      >
                        <span className="w-1.5 h-1.5 rounded-full bg-white" />
                      </div>

                      {/* Inline Tag Label for active or prominent nodes */}
                      {(isCurrent || spot.id === 'hp-2') && (
                        <div className="absolute left-6 top-1/2 -translate-y-1/2 bg-slate-900/90 border border-slate-700 px-2.5 py-1 rounded-md text-[10px] backdrop-blur-md whitespace-nowrap shadow-xl z-30 pointer-events-none">
                          <span className="font-bold text-amber-300 block">{spot.categoryLabel}</span>
                          <span className="text-slate-300 text-[9px]">{spot.location}</span>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>

              {/* Interactive Tooltip Card at the bottom of the map view */}
              <div className="z-10 bg-slate-800/95 border border-slate-700 p-3.5 rounded-xl shadow-lg backdrop-blur-md mt-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span
                      className={`w-2.5 h-2.5 rounded-full ${
                        activeHotspot.demandLevel === 'Critical'
                          ? 'bg-red-500'
                          : activeHotspot.demandLevel === 'High'
                          ? 'bg-orange-500'
                          : 'bg-purple-500'
                      }`}
                    />
                    <span className="text-xs font-bold text-white">{activeHotspot.categoryLabel}</span>
                    <span className="text-slate-400 text-xs">({activeHotspot.location}, {activeHotspot.state})</span>
                  </div>
                  <span
                    className={`text-[10px] font-bold px-2 py-0.5 rounded ${
                      activeHotspot.demandLevel === 'Critical'
                        ? 'bg-red-900/80 text-red-200 border border-red-700'
                        : 'bg-orange-900/80 text-orange-200 border border-orange-700'
                    }`}
                  >
                    {activeHotspot.demandLevel} Demand
                  </span>
                </div>
                <div className="flex items-center justify-between text-[11px] text-slate-300 mt-2 pt-2 border-t border-slate-700">
                  <span className="font-semibold text-cyan-300">
                    {activeHotspot.requestCount.toLocaleString()} verified citizen voices
                  </span>
                  <span className="text-slate-400">
                    {activeHotspot.panchayatCount} Gram Panchayats • {activeHotspot.affectedPopulation.toLocaleString()} pop.
                  </span>
                </div>
              </div>

              {/* Bottom Legend */}
              <div className="flex flex-wrap items-center justify-between text-xs text-slate-400 border-t border-slate-800/80 pt-3 mt-3 z-10">
                <div className="flex items-center gap-4">
                  <div className="flex items-center gap-1.5">
                    <span className="w-2.5 h-2.5 rounded-full bg-red-500" />
                    <span>Water (Critical)</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <span className="w-2.5 h-2.5 rounded-full bg-orange-500" />
                    <span>Roads (High)</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <span className="w-2.5 h-2.5 rounded-full bg-purple-500" />
                    <span>Healthcare</span>
                  </div>
                </div>
                <span className="text-[11px] text-cyan-400 font-mono">Updated 14 mins ago</span>
              </div>
            </div>

            {/* Beside Map: Clean Analytics Panel (5 Cols) */}
            <div className="lg:col-span-5 p-6 sm:p-8 flex flex-col justify-between bg-white">
              <div>
                <div className="flex items-center justify-between pb-4 border-b border-slate-100">
                  <h3 className="text-lg font-bold text-slate-900">{t.developmentDemand}</h3>
                  <span className="text-xs font-semibold px-2 py-1 bg-slate-100 text-slate-600 rounded">
                    {t.panIndiaBreakdown}
                  </span>
                </div>

                {/* Demand Share Stats */}
                <div className="mt-6 space-y-5">
                  {/* Road Infrastructure 42% */}
                  <div
                    className="p-2 rounded-xl transition-colors hover:bg-slate-50 cursor-pointer"
                    onClick={() => setSelectedCategory('roads')}
                  >
                    <div className="flex justify-between items-center text-sm font-semibold mb-1.5">
                      <span className="text-slate-800 flex items-center gap-2">
                        <span className="w-3 h-3 rounded bg-blue-600" />
                        Road Infrastructure
                      </span>
                      <span className="text-slate-900 font-bold tabular-nums">42%</span>
                    </div>
                    <div className="w-full bg-slate-100 rounded-full h-2 overflow-hidden">
                      <div className="bg-blue-600 h-2 rounded-full" style={{ width: '42%' }} />
                    </div>
                    <span className="text-[11px] text-slate-500 mt-1 block">
                      Rural feeder links &amp; monsoon drainage repairs
                    </span>
                  </div>

                  {/* Water Access 28% */}
                  <div
                    className="p-2 rounded-xl transition-colors hover:bg-slate-50 cursor-pointer"
                    onClick={() => setSelectedCategory('water')}
                  >
                    <div className="flex justify-between items-center text-sm font-semibold mb-1.5">
                      <span className="text-slate-800 flex items-center gap-2">
                        <span className="w-3 h-3 rounded bg-cyan-500" />
                        Water Access
                      </span>
                      <span className="text-slate-900 font-bold tabular-nums">28%</span>
                    </div>
                    <div className="w-full bg-slate-100 rounded-full h-2 overflow-hidden">
                      <div className="bg-cyan-500 h-2 rounded-full" style={{ width: '28%' }} />
                    </div>
                    <span className="text-[11px] text-slate-500 mt-1 block">
                      Drinking water supply &amp; groundwater recharge wells
                    </span>
                  </div>

                  {/* Healthcare 18% */}
                  <div
                    className="p-2 rounded-xl transition-colors hover:bg-slate-50 cursor-pointer"
                    onClick={() => setSelectedCategory('healthcare')}
                  >
                    <div className="flex justify-between items-center text-sm font-semibold mb-1.5">
                      <span className="text-slate-800 flex items-center gap-2">
                        <span className="w-3 h-3 rounded bg-indigo-600" />
                        Healthcare
                      </span>
                      <span className="text-slate-900 font-bold tabular-nums">18%</span>
                    </div>
                    <div className="w-full bg-slate-100 rounded-full h-2 overflow-hidden">
                      <div className="bg-indigo-600 h-2 rounded-full" style={{ width: '18%' }} />
                    </div>
                    <span className="text-[11px] text-slate-500 mt-1 block">
                      Primary health sub-centre staff &amp; maternal care
                    </span>
                  </div>

                  {/* Education 12% */}
                  <div
                    className="p-2 rounded-xl transition-colors hover:bg-slate-50 cursor-pointer"
                    onClick={() => setSelectedCategory('education')}
                  >
                    <div className="flex justify-between items-center text-sm font-semibold mb-1.5">
                      <span className="text-slate-800 flex items-center gap-2">
                        <span className="w-3 h-3 rounded bg-orange-500" />
                        Education
                      </span>
                      <span className="text-slate-900 font-bold tabular-nums">12%</span>
                    </div>
                    <div className="w-full bg-slate-100 rounded-full h-2 overflow-hidden">
                      <div className="bg-orange-500 h-2 rounded-full" style={{ width: '12%' }} />
                    </div>
                    <span className="text-[11px] text-slate-500 mt-1 block">
                      Primary school boundary walls, sanitation &amp; teachers
                    </span>
                  </div>
                </div>

                {/* High-demand regions detected by AI callout */}
                <div className="mt-8 p-4 rounded-xl bg-blue-50/70 border border-blue-200">
                  <div className="flex items-start gap-3">
                    <span className="text-lg">⚡</span>
                    <div>
                      <h4 className="text-xs font-bold text-blue-900 uppercase tracking-wide">
                        {t.highDemandDetected}
                      </h4>
                      <p className="text-xs text-blue-800 mt-0.5 leading-relaxed">{t.highDemandDesc}</p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="mt-6 pt-4 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
                <span>{t.verifiedAadhaar}</span>
                <a href="#policymakers" className="font-bold text-blue-600 hover:text-blue-800">
                  {t.viewDataSchema}
                </a>
              </div>
            </div>
          </div>
        </ScrollReveal>
      </div>
    </section>
  );
};
