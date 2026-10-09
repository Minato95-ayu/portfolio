import React, { useState } from 'react';
import { FLAGSHIP_SYSTEMS, ProjectData } from '../../data/projectsData.ts';
import { IconByTag, IconWebsite } from '../ui/Icons.tsx';
import { sound } from '../../utils/audio.ts';

interface FlagshipSystemsSectionProps {
  onSelectProject: (project: ProjectData) => void;
}

export const FlagshipSystemsSection: React.FC<FlagshipSystemsSectionProps> = ({ onSelectProject }) => {
  const [activeCodeTab, setActiveCodeTab] = useState<string>('aayu-lang');

  return (
    <section
      id="systems"
      className="relative min-h-screen py-24 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto z-10"
      aria-label="Flagship Systems Section"
    >
      {/* Header */}
      <div className="space-y-4 mb-16 border-b border-white/[0.08] pb-8">
        <div className="flex flex-wrap items-center gap-2 sm:gap-3 text-xs font-mono text-[#C6FF3D]">
          <span className="w-2 h-2 rounded-sm bg-[#C6FF3D] shrink-0" />
          <span>FLAGSHIP ARCHITECTURE / 001</span>
          <span className="text-white/20">|</span>
          <span className="text-white/40">SYSTEMS I BUILT FROM SCRATCH</span>
        </div>

        <h2 className="text-3xl sm:text-5xl font-bold tracking-tight text-[#EDEFF2]">
          Built from scratch.{' '}
          <span className="text-[#C6FF3D] text-glow-lime">Closer to the metal.</span>
        </h2>

        <p className="text-base text-white/70 max-w-3xl leading-relaxed">
          A compiler language, a hardware-software research direction, and a founder-led product. Each card separates current work from what is still planned.
        </p>
      </div>

      {/* Grid of the 3 Flagship Systems */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {FLAGSHIP_SYSTEMS.map((system) => {
          return (
            <div
              key={system.slug}
              className="relative overflow-hidden bg-[#0A1019]/95 border border-white/10 hover:border-white/20 p-5 sm:p-6 rounded-2xl backdrop-blur-xl transition-all duration-300 flex flex-col justify-between group shadow-[0_18px_60px_rgba(0,0,0,0.24)] hover:-translate-y-1"
              style={{ borderTopColor: `${system.color}85` }}
            >
              <div
                className="absolute -top-24 -right-20 h-48 w-48 rounded-full blur-3xl opacity-[0.09] pointer-events-none"
                style={{ backgroundColor: system.color }}
                aria-hidden="true"
              />
              <div>
                {/* Header with Icon & Status */}
                <div className="flex items-center justify-between pb-4 border-b border-white/10">
                  <div className="flex items-center space-x-3">
                    <div
                      className="p-3 rounded-xl border transition-colors"
                      style={{
                        color: system.color,
                        borderColor: `${system.color}45`,
                        backgroundColor: `${system.color}12`,
                      }}
                    >
                      <IconByTag iconName={system.iconName} size={22} />
                    </div>
                    <div>
                      <h3 className="font-bold text-lg text-white group-hover:text-[#B6FF5C] transition-colors">
                        {system.title}
                      </h3>
                      <div className="text-[10px] font-mono text-white/50">
                        {system.tag}
                      </div>
                    </div>
                  </div>
                </div>

                <div className="mt-3">
                  <span
                    className="text-[9px] font-mono px-2.5 py-1 rounded-full border"
                    style={{
                      borderColor: `${system.color}55`,
                      color: system.color,
                      backgroundColor: `${system.color}12`,
                    }}
                  >
                    {system.status}
                  </span>
                </div>

                {/* Summary */}
                <p className="mt-4 text-sm text-white/80 leading-relaxed">
                  {system.summary}
                </p>

                {/* Research Thesis */}
                <div className="mt-4 p-3.5 rounded-xl bg-white/[0.025] border-l-2 text-xs font-mono" style={{ borderLeftColor: system.color }}>
                  <div className="text-[10px] uppercase tracking-wider mb-1" style={{ color: system.color }}>
                    PROBLEM TO SOLVE
                  </div>
                  <p className="text-white/60 italic text-[11px] leading-relaxed">
                    "{system.researchQuestion}"
                  </p>
                </div>

                {/* What Exists vs What's Next */}
                <div className="mt-4 space-y-2 text-xs font-mono">
                  <div className="p-3 rounded-xl bg-[#101824] border border-white/[0.06]">
                    <span className="text-[#B6FF5C] text-[10px] block font-bold">BUILT / DOCUMENTED:</span>
                    <span className="text-white/75 text-xs leading-relaxed">{system.whatExists}</span>
                  </div>
                  <div className="p-3 rounded-xl bg-[#101824] border border-white/[0.06]">
                    <span className="text-[#52D7F2] text-[10px] block font-bold">NEXT MILESTONE:</span>
                    <span className="text-white/75 text-xs leading-relaxed">{system.whatToBuildNext}</span>
                  </div>
                </div>

                {/* Code Window Module (for AAYU Lang, I2S & Adumate) */}
                {system.codeSnippet && (
                  <div className="mt-5 border border-white/10 rounded-xl overflow-hidden bg-[#080C13]">
                    <div className="px-3 py-2 bg-[#101824] border-b border-white/10 flex items-center justify-between text-[10px] font-mono text-white/45">
                      <span className="font-bold" style={{ color: system.color }}>DESIGN SKETCH</span>
                      <span>ILLUSTRATIVE</span>
                    </div>
                    <pre className="p-3 text-[10.5px] font-mono text-[#4CC9F0] overflow-x-auto leading-relaxed">
                      <code>{system.codeSnippet}</code>
                    </pre>
                  </div>
                )}
              </div>

              {/* Footer CTAs */}
              <div className="mt-6 pt-4 border-t border-white/10 flex items-center justify-between text-xs font-mono">
                <button
                  type="button"
                  onClick={() => {
                    sound.playClick();
                    onSelectProject(system);
                  }}
                  className="font-semibold hover:underline flex items-center space-x-1 cursor-pointer"
                  style={{ color: system.color }}
                >
                  <span>INSPECT SPECIFICATION</span>
                  <span>→</span>
                </button>

                {system.externalUrl && (
                  <a
                    href={system.externalUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    onClick={() => sound.playClick()}
                    className="p-1.5 text-[#4CC9F0] hover:text-white transition-colors"
                    title="Visit adumate.in"
                  >
                    <IconWebsite size={16} />
                  </a>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
};
