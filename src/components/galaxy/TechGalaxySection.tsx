import React, { useState } from 'react';
import {
  TECH_GALAXY_BODIES,
  AAYU_CORE_STAR,
  TechCelestialBody,
  TechCategory,
  CATEGORY_LABELS,
  CATEGORY_COLORS,
} from '../../data/techGalaxyData.ts';
import { sound } from '../../utils/audio.ts';

interface TechGalaxySectionProps {
  onOpenFullscreenGalaxy?: () => void;
  onSelectBody?: (body: TechCelestialBody) => void;
}

export const TechGalaxySection: React.FC<TechGalaxySectionProps> = ({
  onOpenFullscreenGalaxy,
  onSelectBody,
}) => {
  const [activeCategory, setActiveCategory] = useState<TechCategory | 'ALL'>('ALL');
  const [inspectingBody, setInspectingBody] = useState<TechCelestialBody>(AAYU_CORE_STAR);

  const filteredBodies = TECH_GALAXY_BODIES.filter((b) => {
    if (activeCategory === 'ALL') return true;
    return b.category === activeCategory;
  });

  const handleInspect = (body: TechCelestialBody) => {
    sound.playClick();
    setInspectingBody(body);
    onSelectBody?.(body);
  };

  return (
    <section
      id="galaxy"
      className="relative py-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto z-10"
      aria-label="3D Tech Solar System & Galaxy Laboratory"
    >
      {/* Header Banner */}
      <div className="space-y-4 mb-12 border-b border-white/[0.08] pb-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 text-xs font-mono">
          <div className="flex items-center space-x-2 sm:space-x-3 text-[#B6FF5C] overflow-hidden">
            <span className="w-2.5 h-2.5 rounded-full bg-[#B6FF5C] shadow-[0_0_14px_rgba(182,255,92,0.8)] shrink-0" />
            <span className="font-bold tracking-wider shrink-0">TECH UNIVERSE / EXPLORE</span>
            <span className="text-white/20">|</span>
            <span className="text-white/60 truncate">LANGUAGES · AI MODELS · OS · NETWORKS · SECURITY</span>
          </div>

          {onOpenFullscreenGalaxy && (
            <button
              type="button"
              onClick={() => {
                sound.playGalaxyEnter();
                onOpenFullscreenGalaxy();
              }}
              className="px-3.5 py-1.5 sm:px-4 sm:py-2 bg-[#B6FF5C]/10 hover:bg-[#B6FF5C]/20 border border-[#B6FF5C]/45 text-[#B6FF5C] rounded-xl font-mono text-xs font-bold tracking-wider transition-all flex items-center space-x-2 cursor-pointer shadow-[0_0_18px_rgba(182,255,92,0.14)] shrink-0 w-fit"
            >
              <span>🪐 LAUNCH FULLSCREEN 3D UNIVERSE</span>
              <span>↗</span>
            </button>
          )}
        </div>

        <h2 className="text-3xl sm:text-5xl font-bold tracking-tight text-[#EDEFF2]">
          A living map of the{' '}
          <span className="bg-gradient-to-r from-[#B6FF5C] via-[#52D7F2] to-[#A88BFF] bg-clip-text text-transparent">
            systems behind my work.
          </span>
        </h2>

        <p className="text-base text-white/70 max-w-3xl leading-relaxed">
          Explore the languages, tools, and research areas I use across compilers, AI infrastructure, and distributed systems. Select a world to see where it fits—and which areas are still learning goals.
        </p>
        <p className="text-[11px] font-mono text-white/40">
          EXPLORATION / LEARNING FOCUS = study areas, not claims of shipped specialist projects.
        </p>

        {/* Category Filter Tabs */}
        <div className="pt-4 flex flex-wrap items-center gap-2 font-mono text-xs">
          <button
            type="button"
            onClick={() => {
              sound.playClick();
              setActiveCategory('ALL');
            }}
            className={`px-3 py-1.5 rounded-full border transition-all cursor-pointer ${
              activeCategory === 'ALL'
                ? 'bg-white/20 text-white font-bold border-white/40'
                : 'bg-white/[0.02] border-white/10 text-white/50 hover:text-white'
            }`}
          >
            ALL CELESTIAL BODIES ({TECH_GALAXY_BODIES.length + 1})
          </button>
          {(['LANGUAGE', 'AI_MODEL', 'SYSTEMS', 'TOOLS'] as const).map((cat) => {
            const count = TECH_GALAXY_BODIES.filter((b) => b.category === cat).length;
            const catColor = CATEGORY_COLORS[cat];
            const isSelected = activeCategory === cat;
            return (
              <button
                key={cat}
                type="button"
                onClick={() => {
                  sound.playClick();
                  setActiveCategory(cat);
                }}
                className="px-3 py-1.5 rounded-full border transition-all cursor-pointer flex items-center gap-1.5"
                style={{
                  borderColor: isSelected ? catColor : 'rgba(255,255,255,0.1)',
                  color: isSelected ? catColor : 'rgba(255,255,255,0.6)',
                  backgroundColor: isSelected ? `${catColor}15` : 'rgba(255,255,255,0.02)',
                  fontWeight: isSelected ? 'bold' : 'normal',
                }}
              >
                <span>{CATEGORY_LABELS[cat]}</span>
                <span className="text-[10px] opacity-70">({count})</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Main 2-Column Solar System Interactive Dashboard */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Column: Celestial Bodies Grid (7 cols) */}
        <div className="lg:col-span-7 space-y-4">
          {/* Central Sun Card */}
          <button
            type="button"
            onClick={() => handleInspect(AAYU_CORE_STAR)}
            className={`w-full text-left p-3.5 sm:p-4 rounded-xl border cursor-pointer transition-all relative overflow-hidden group ${
              inspectingBody.id === AAYU_CORE_STAR.id
                ? 'bg-[#B6FF5C]/[0.09] border-[#B6FF5C]/70 shadow-[0_0_32px_rgba(182,255,92,0.14)]'
                : 'bg-[#0C121B]/95 border-[#B6FF5C]/25 hover:border-[#B6FF5C]/60'
            }`}
          >
            <div className="flex items-center justify-between gap-2">
              <div className="flex items-center space-x-3 sm:space-x-3.5 min-w-0 flex-1">
                <div className="relative w-11 h-11 sm:w-14 sm:h-14 rounded-full border border-[#B6FF5C]/70 bg-[radial-gradient(circle_at_35%_30%,#f8ffd6_0%,#b6ff5c_22%,#55d7f2_52%,#111a23_74%)] flex items-center justify-center text-sm sm:text-base font-black text-[#081018] shadow-[0_0_30px_rgba(182,255,92,0.45)] shrink-0">
                  <span className="absolute -inset-1.5 rounded-full border border-[#52D7F2]/30 rotate-12" />
                  A
                </div>
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-1.5 sm:gap-2 flex-wrap">
                    <span className="font-bold text-white text-sm sm:text-base truncate">AAYU · CORE SYSTEMS</span>
                    <span className="text-[9px] sm:text-[10px] font-mono px-2 py-1 rounded-full bg-[#B6FF5C]/10 text-[#B6FF5C] border border-[#B6FF5C]/30 font-bold shrink-0">
                      FOUNDER
                    </span>
                  </div>
                  <div className="text-[11px] sm:text-xs font-mono text-white/60 truncate mt-0.5">
                    Compiler experiments · Adumate · I2S research
                  </div>
                </div>
              </div>

              <div className="text-right font-mono text-xs text-[#B6FF5C] hidden md:block shrink-0">
                <span>AAYU / 01</span>
                <div className="text-[10px] text-white/40">CORE SYSTEMS</div>
              </div>
            </div>
          </button>

          {/* Orbiting Bodies Cards Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {filteredBodies.map((body) => {
              const isSelected = inspectingBody.id === body.id;
              return (
                <button
                  type="button"
                  key={body.id}
                  onClick={() => handleInspect(body)}
                  className="w-full text-left p-4 rounded-xl border cursor-pointer transition-all relative group hover:-translate-y-0.5"
                  style={{
                    backgroundColor: isSelected ? `${body.color}18` : 'rgba(10, 15, 24, 0.96)',
                    borderColor: isSelected ? body.color : 'rgba(190, 210, 238, 0.11)',
                    boxShadow: isSelected ? `0 8px 30px ${body.color}18, inset 0 1px ${body.color}35` : '0 8px 24px rgba(0,0,0,0.16)',
                  }}
                >
                  <div className="flex items-start justify-between">
                    <div className="flex items-center space-x-2.5">
                      <span
                        className="w-10 h-10 rounded-xl border flex items-center justify-center text-xl shadow-[0_0_20px_var(--planet-glow)]"
                        style={{
                          color: body.color,
                          borderColor: `${body.color}55`,
                          background: `radial-gradient(circle at 30% 25%, ${body.color}55, ${body.color}12 65%, rgba(6,10,16,0.9))`,
                          '--planet-glow': `${body.color}28`,
                        } as React.CSSProperties}
                      >
                        {body.symbol}
                      </span>
                      <div>
                        <div className="font-bold text-sm text-white group-hover:text-white transition-colors">
                          {body.name}
                        </div>
                        <div className="text-[10px] font-mono" style={{ color: body.color }}>
                          {CATEGORY_LABELS[body.category]}
                        </div>
                      </div>
                    </div>

                    <div className="text-[10px] font-mono text-white/40 text-right">
                      ORBIT {body.distance.toFixed(1)}
                    </div>
                  </div>

                  <p className="text-xs text-white/75 line-clamp-2 mt-3 leading-relaxed">
                    {body.role}
                  </p>

                  <div className="mt-3 pt-2 border-t border-white/5 flex items-center justify-between text-[10px] font-mono text-white/40">
                    <span className="text-white/60">{body.mastery}</span>
                    <span className="group-hover:translate-x-1 transition-transform" style={{ color: body.color }}>
                      INSPECT →
                    </span>
                  </div>
                  </button>
              );
            })}
          </div>
        </div>

        {/* Right Column: Active Celestial Inspector Telemetry (5 cols) */}
        <div className="lg:col-span-5 sticky top-20 lg:top-24 max-h-[calc(100vh-6.5rem)] overflow-y-auto pr-1">
          <div
            className="p-5 sm:p-6 rounded-2xl border backdrop-blur-xl shadow-2xl transition-all"
            style={{
              background: 'linear-gradient(145deg, rgba(16,24,36,0.98), rgba(8,12,19,0.98))',
              borderColor: inspectingBody.color,
              boxShadow: `0 16px 55px rgba(0,0,0,0.38), 0 0 34px ${inspectingBody.color}14`,
            }}
          >
            {/* Header Identity */}
            <div className="flex items-center space-x-4 pb-4 border-b border-white/10">
              <div
                className="w-16 h-16 rounded-2xl flex items-center justify-center text-3xl shadow-lg border"
                style={{
                  backgroundColor: `${inspectingBody.color}15`,
                  borderColor: inspectingBody.color,
                  boxShadow: `0 0 20px ${inspectingBody.color}40`,
                }}
              >
                {inspectingBody.symbol}
              </div>

              <div>
                <div className="flex items-center gap-2">
                  <h3 className="text-lg font-bold text-white">{inspectingBody.name}</h3>
                  <span
                    className="text-[10px] font-mono px-2 py-0.5 rounded font-bold uppercase"
                    style={{
                      backgroundColor: `${inspectingBody.color}25`,
                      color: inspectingBody.color,
                    }}
                  >
                    {CATEGORY_LABELS[inspectingBody.category]}
                  </span>
                </div>
                <div className="text-xs font-mono text-white/60 mt-0.5">
                  {inspectingBody.tag}
                </div>
              </div>
            </div>

            {/* Implementation Role */}
            <div className="py-4 border-b border-white/10 space-y-2">
              <div className="text-[10px] font-mono text-[#C6FF3D] font-bold tracking-widest uppercase flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-[#C6FF3D] animate-ping" />
                HOW AYUSH USES THIS IN SYSTEMS:
              </div>
              <p className="text-xs text-white/90 leading-relaxed font-sans">
                {inspectingBody.role}
              </p>
            </div>

            {/* Architectural Context */}
            <div className="py-4 border-b border-white/10 space-y-1.5">
              <div className="text-[10px] font-mono text-white/40 uppercase tracking-wider">
                DEEP CONTEXT & REASONING:
              </div>
              <p className="text-xs text-white/65 leading-relaxed font-sans">
                {inspectingBody.description}
              </p>
            </div>

            {/* Technical Parameters */}
            <div className="py-4 border-b border-white/10">
              <div className="text-[10px] font-mono text-white/40 uppercase tracking-wider mb-2">
                ASTRO-TECHNICAL SPECIFICATIONS:
              </div>
              <div className="grid grid-cols-2 gap-2 text-xs font-mono">
                {inspectingBody.specs.map((sp) => (
                  <div
                    key={sp.label}
                    className="p-2 rounded bg-white/[0.02] border border-white/5"
                  >
                    <div className="text-[10px] text-white/40">{sp.label}</div>
                    <div className="text-white/90 font-medium truncate mt-0.5">{sp.value}</div>
                  </div>
                ))}
              </div>
            </div>

            {/* Moons / Satellites if available */}
            {inspectingBody.moons && inspectingBody.moons.length > 0 && (
              <div className="py-4 border-b border-white/10">
                <div className="text-[10px] font-mono text-white/40 uppercase tracking-wider mb-2">
                  ORBITING MOONS & SUBSYSTEMS:
                </div>
                <div className="flex flex-wrap gap-2">
                  {inspectingBody.moons.map((m) => (
                    <span
                      key={m.name}
                      className="px-2.5 py-1 rounded text-xs font-mono border"
                      style={{
                        backgroundColor: `${m.color}15`,
                        borderColor: `${m.color}40`,
                        color: m.color,
                      }}
                    >
                      ● {m.name}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Footer Buttons */}
            <div className="pt-4 flex items-center justify-between">
              <span
                className="text-xs font-mono px-2.5 py-1 rounded border font-semibold"
                style={{
                  borderColor: `${inspectingBody.color}50`,
                  color: inspectingBody.color,
                  backgroundColor: `${inspectingBody.color}15`,
                }}
              >
                ★ {inspectingBody.mastery}
              </span>

              {onOpenFullscreenGalaxy && (
                <button
                  type="button"
                  onClick={() => {
                    sound.playClick();
                    onOpenFullscreenGalaxy();
                  }}
                  className="px-4 py-2.5 bg-[#B6FF5C] hover:bg-[#caff87] text-[#07100a] font-mono text-xs font-bold tracking-wider rounded-xl transition-all cursor-pointer shadow-[0_0_20px_rgba(182,255,92,0.22)]"
                >
                  VIEW IN 3D ORBIT ↗
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
