import React, { useState } from 'react';
import { RESEARCH_LAB_MODULES, ProjectData } from '../../data/projectsData.ts';
import { IconByTag } from '../ui/Icons.tsx';
import { sound } from '../../utils/audio.ts';

interface ResearchLabSectionProps {
  onSelectProject: (project: ProjectData) => void;
}

export const ResearchLabSection: React.FC<ResearchLabSectionProps> = ({ onSelectProject }) => {
  const [activeFilter, setActiveFilter] = useState<'ALL' | 'AI' | 'SYSTEMS' | 'SECURITY'>('ALL');

  const filteredModules = RESEARCH_LAB_MODULES.filter((m) => {
    if (activeFilter === 'ALL') return true;
    if (activeFilter === 'AI') return m.slug === 'neuralforge' || m.slug === 'aayu-os';
    if (activeFilter === 'SYSTEMS') return m.slug === 'compilerx' || m.slug === 'adumate';
    if (activeFilter === 'SECURITY') return m.slug === 'sentinel-ai' || m.slug === 'web3-guard';
    return true;
  });

  return (
    <section
      id="lab"
      className="relative min-h-screen py-24 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto z-10"
      aria-label="Research Lab Section"
    >
      {/* Section Header */}
      <div className="space-y-4 mb-16 border-b border-white/[0.08] pb-8">
        <div className="flex flex-wrap items-center gap-2 sm:gap-3 text-xs font-mono text-[#C6FF3D]">
          <span className="w-2 h-2 rounded-sm bg-[#C6FF3D] shrink-0" />
          <span>RESEARCH ROOM / 002</span>
          <span className="text-white/20">|</span>
          <span className="text-white/40">SIX ACTIVE MISSION MODULES</span>
        </div>

        <h2 className="text-3xl sm:text-5xl font-bold tracking-tight text-[#EDEFF2]">
          Research-grade ideas.{' '}
          <span className="text-[#C6FF3D] text-glow-lime">Built in public.</span>
        </h2>

        <p className="text-base text-white/70 max-w-3xl leading-relaxed">
          These are serious systems I am preparing to build, document, and release. They are concepts and next builds until real implementation exists.
        </p>

        {/* Anti-Slop Filter Toggles */}
        <div className="pt-4 flex flex-wrap items-center gap-3 font-mono text-xs">
          <span className="text-white/40 text-[11px]">FILTER DOMAIN:</span>
          {(['ALL', 'AI', 'SYSTEMS', 'SECURITY'] as const).map((filter) => (
            <button
              key={filter}
              type="button"
              onClick={() => {
                sound.playClick();
                setActiveFilter(filter);
              }}
              className={`px-3 py-1 rounded-sm border transition-all cursor-pointer ${
                activeFilter === filter
                  ? 'border-[#C6FF3D] text-[#C6FF3D] bg-[#C6FF3D]/10 font-bold'
                  : 'border-white/10 text-white/60 hover:text-white hover:border-white/20'
              }`}
            >
              {filter}
            </button>
          ))}
        </div>
      </div>

      {/* Grid of 6 Mission Modules */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredModules.map((item) => {
          return (
            <div
              key={item.slug}
              onClick={() => {
                sound.playClick();
                onSelectProject(item);
              }}
              className="group relative bg-[#0c1017]/85 border border-white/10 hover:border-[#84cc16]/60 p-6 rounded-sm backdrop-blur-sm transition-all duration-300 hover:-translate-y-1 cursor-pointer flex flex-col justify-between"
            >
              {/* Top Bar with Icon & Status */}
              <div>
                <div className="flex items-center justify-between pb-4 border-b border-white/[0.08]">
                  <div className="flex items-center space-x-3">
                    <div className="p-2 rounded bg-white/[0.03] border border-white/10 text-[#84cc16] group-hover:border-[#84cc16] transition-colors">
                      <IconByTag iconName={item.iconName} size={20} />
                    </div>
                    <div>
                      <h3 className="font-bold text-lg text-white group-hover:text-[#84cc16] transition-colors">
                        {item.title}
                      </h3>
                      <div className="text-[10px] font-mono text-white/40">
                        {item.tag}
                      </div>
                    </div>
                  </div>

                  <span
                    className={`text-[9px] font-mono px-2 py-0.5 rounded border ${
                      item.status === 'ACTIVE DIRECTION / FOUNDER'
                        ? 'border-[#84cc16]/40 text-[#84cc16] bg-[#84cc16]/10'
                        : 'border-[#38bdf8]/40 text-[#38bdf8] bg-[#38bdf8]/10'
                    }`}
                  >
                    {item.status}
                  </span>
                </div>

                {/* Summary */}
                <p className="mt-4 text-xs text-white/75 leading-relaxed">
                  {item.summary}
                </p>

                {/* Research Question */}
                <div className="mt-4 p-3 rounded bg-white/[0.02] border-l-2 border-[#84cc16]/60 text-xs">
                  <div className="text-[10px] font-mono text-[#84cc16] tracking-wider uppercase mb-1">
                    RESEARCH THESIS
                  </div>
                  <p className="text-white/60 italic text-[11px] leading-relaxed">
                    "{item.researchQuestion}"
                  </p>
                </div>

                {/* Stack Badges (Clean unboxed style) */}
                <div className="mt-4 pt-3 border-t border-white/[0.06]">
                  <div className="text-[10px] font-mono text-white/40 mb-1.5 uppercase">
                    PROPOSED STACK
                  </div>
                  <div className="flex flex-wrap gap-x-2 gap-y-1 text-xs font-mono text-white/70">
                    {item.stack.map((tech, idx) => (
                      <span key={tech} className="inline-flex items-center">
                        <span className="text-[#38bdf8]/80">{tech}</span>
                        {idx < item.stack.length - 1 && (
                          <span className="text-white/20 ml-2">/</span>
                        )}
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              {/* Card Footer with Sprint & Status Note */}
              <div className="mt-6 pt-4 border-t border-white/[0.08] space-y-2">
                <div className="flex items-center justify-between text-[11px] font-mono">
                  <span className="text-white/50">7-DAY SPRINT DESIGNED</span>
                  <span className="text-[#84cc16] group-hover:translate-x-1 transition-transform">
                    INSPECT SPEC →
                  </span>
                </div>

                <div className="text-[10px] font-mono text-white/40">
                  {item.slug === 'adumate'
                    ? 'Founder product ecosystem · Active direction'
                    : 'Concept / next build · Not yet a shipped product'}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
};
