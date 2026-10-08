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
          Three foundational pillars where language design, low-level hardware compilation, and distributed AI routing meet. Grounded strictly in existing specifications and prototypes.
        </p>
      </div>

      {/* Grid of the 3 Flagship Systems */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {FLAGSHIP_SYSTEMS.map((system) => {
          return (
            <div
              key={system.slug}
              className="bg-[#10141A]/90 border border-white/10 hover:border-[#C6FF3D]/60 p-6 rounded-sm backdrop-blur-md transition-all duration-300 flex flex-col justify-between group shadow-xl hover:-translate-y-1"
            >
              <div>
                {/* Header with Icon & Status */}
                <div className="flex items-center justify-between pb-4 border-b border-white/10">
                  <div className="flex items-center space-x-3">
                    <div className="p-2.5 rounded bg-white/[0.03] border border-white/10 text-[#C6FF3D] group-hover:border-[#C6FF3D] transition-colors">
                      <IconByTag iconName={system.iconName} size={22} />
                    </div>
                    <div>
                      <h3 className="font-bold text-lg text-white group-hover:text-[#C6FF3D] transition-colors">
                        {system.title}
                      </h3>
                      <div className="text-[10px] font-mono text-white/50">
                        {system.tag}
                      </div>
                    </div>
                  </div>
                </div>

                <div className="mt-3">
                  <span className="text-[9px] font-mono px-2 py-0.5 rounded border border-[#C6FF3D]/30 text-[#C6FF3D] bg-[#C6FF3D]/10">
                    {system.status}
                  </span>
                </div>

                {/* Summary */}
                <p className="mt-4 text-xs text-white/75 leading-relaxed">
                  {system.summary}
                </p>

                {/* Research Thesis */}
                <div className="mt-4 p-3 rounded bg-white/[0.02] border-l-2 border-[#C6FF3D] text-xs font-mono">
                  <div className="text-[10px] text-[#C6FF3D] uppercase tracking-wider mb-1">
                    SYSTEM THESIS
                  </div>
                  <p className="text-white/60 italic text-[11px] leading-relaxed">
                    "{system.researchQuestion}"
                  </p>
                </div>

                {/* What Exists vs What's Next */}
                <div className="mt-4 space-y-2 text-xs font-mono">
                  <div className="p-2.5 rounded bg-[#161C24] border border-white/5">
                    <span className="text-[#C6FF3D] text-[10px] block font-bold">WHAT EXISTS:</span>
                    <span className="text-white/70 text-[11px]">{system.whatExists}</span>
                  </div>
                  <div className="p-2.5 rounded bg-[#161C24] border border-white/5">
                    <span className="text-[#4CC9F0] text-[10px] block font-bold">WHAT'S NEXT:</span>
                    <span className="text-white/70 text-[11px]">{system.whatToBuildNext}</span>
                  </div>
                </div>

                {/* Code Window Module (for AAYU Lang, I2S & Adumate) */}
                {system.codeSnippet && (
                  <div className="mt-5 border border-white/10 rounded-sm overflow-hidden bg-[#0B0D10]">
                    <div className="px-3 py-1.5 bg-[#161C24] border-b border-white/10 flex items-center justify-between text-[10px] font-mono text-white/40">
                      <span className="text-[#C6FF3D] font-bold">SOURCE MANIFEST</span>
                      <span>CODE / SPEC</span>
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
                  className="text-[#C6FF3D] hover:underline flex items-center space-x-1 cursor-pointer"
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
