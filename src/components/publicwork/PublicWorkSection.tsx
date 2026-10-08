import React from 'react';
import { PUBLIC_PROJECTS, PROFILE_DATA, ProjectData } from '../../data/projectsData.ts';
import { IconByTag, IconGitHub } from '../ui/Icons.tsx';
import { sound } from '../../utils/audio.ts';

interface PublicWorkSectionProps {
  onSelectProject: (project: ProjectData) => void;
}

export const PublicWorkSection: React.FC<PublicWorkSectionProps> = ({ onSelectProject }) => {
  return (
    <section
      id="public-work"
      className="relative min-h-screen py-24 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto z-10"
      aria-label="Public Work Section"
    >
      {/* Section Header */}
      <div className="space-y-4 mb-16 border-b border-white/[0.08] pb-8">
        <div className="flex flex-wrap items-center gap-2 sm:gap-3 text-xs font-mono text-[#C6FF3D]">
          <span className="w-2 h-2 rounded-sm bg-[#C6FF3D] shrink-0" />
          <span>RESEARCH ROOM / 005</span>
          <span className="text-white/20">|</span>
          <span className="text-white/40">VERIFIED PUBLIC REPOSITORIES</span>
        </div>

        <h2 className="text-3xl sm:text-5xl font-bold tracking-tight text-[#EDEFF2]">
          AAYU / public work.{' '}
          <span className="text-[#C6FF3D] text-glow-lime">Still evolving.</span>
        </h2>

        <p className="text-base text-white/70 max-w-3xl leading-relaxed">
          These are real, public GitHub repositories built or maintained by Ayush Kaushik. Grounded strictly in existing README documentation without inflated claims or metrics.
        </p>
      </div>

      {/* GitHub Identity Strip */}
      <div className="mb-12 bg-[#10141A]/95 border border-[#C6FF3D]/30 p-6 rounded-sm shadow-xl flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="flex items-center space-x-4">
          <div className="p-3 bg-[#161C24] border border-white/10 rounded text-white">
            <IconGitHub size={28} />
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <h3 className="text-base font-bold text-white">
                Ayush Kaushik
              </h3>
              <a
                href={PROFILE_DATA.links.github}
                target="_blank"
                rel="noopener noreferrer"
                className="text-xs font-mono text-[#C6FF3D] hover:underline"
              >
                @{PROFILE_DATA.githubStats.username}
              </a>
            </div>
            <div className="text-xs font-mono text-white/60 mt-0.5">
              Founder / Deep-Tech Systems Architect & AI Researcher · Delhi · Adumate
            </div>
            <div className="text-[11px] font-mono text-white/40 mt-1">
              {PROFILE_DATA.githubStats.followers} followers · {PROFILE_DATA.githubStats.following} following
            </div>
          </div>
        </div>

        <div className="space-y-2">
          <div className="text-[10px] font-mono text-white/40 uppercase tracking-wider">
            VERIFIED GITHUB ACHIEVEMENTS
          </div>
          <div className="flex flex-wrap gap-2 text-xs font-mono">
            {PROFILE_DATA.githubStats.achievements.map((ach) => (
              <span
                key={ach.name}
                title={ach.desc}
                className="px-2.5 py-1 rounded bg-white/[0.03] border border-white/10 text-white/80 flex items-center space-x-1"
              >
                <span>{ach.name}</span>
                <span className="text-[#C6FF3D] text-[10px]">★</span>
              </span>
            ))}
          </div>
        </div>

        <div>
          <a
            href={PROFILE_DATA.links.github}
            target="_blank"
            rel="noopener noreferrer"
            onClick={() => sound.playClick()}
            className="inline-flex items-center space-x-2 px-4 py-2 bg-white/5 hover:bg-white/10 border border-white/20 hover:border-white/40 text-white text-xs font-mono rounded-sm transition-all"
          >
            <span>VISIT GITHUB PROFILE</span>
            <span>↗</span>
          </a>
        </div>
      </div>

      {/* Projects Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {PUBLIC_PROJECTS.map((project) => {
          return (
            <div
              key={project.slug}
              onClick={() => {
                sound.playClick();
                onSelectProject(project);
              }}
              className="group relative bg-[#0c1017]/85 border border-white/10 hover:border-[#84cc16]/60 p-6 rounded-sm backdrop-blur-sm transition-all duration-300 hover:-translate-y-1 cursor-pointer flex flex-col justify-between"
            >
              <div>
                {/* Header with Icon and Status */}
                <div className="flex items-center justify-between pb-4 border-b border-white/[0.08]">
                  <div className="flex items-center space-x-3">
                    <div className="p-2 rounded bg-white/[0.03] border border-white/10 text-[#84cc16] group-hover:border-[#84cc16] transition-colors">
                      <IconByTag iconName={project.iconName} size={20} />
                    </div>
                    <div>
                      <h4 className="font-bold text-lg text-white group-hover:text-[#84cc16] transition-colors">
                        {project.title}
                      </h4>
                      <div className="text-[10px] font-mono text-white/40">
                        {project.tag}
                      </div>
                    </div>
                  </div>

                  <span
                    className={`text-[9px] font-mono px-2 py-0.5 rounded border ${
                      project.status.includes('ACTIVE')
                        ? 'border-[#84cc16]/40 text-[#84cc16] bg-[#84cc16]/10'
                        : 'border-[#38bdf8]/40 text-[#38bdf8] bg-[#38bdf8]/10'
                    }`}
                  >
                    {project.status.includes('ACTIVE') ? 'ACTIVE REPO' : 'README-DOC'}
                  </span>
                </div>

                {/* Summary */}
                <p className="mt-4 text-xs text-white/75 leading-relaxed">
                  {project.summary}
                </p>

                {/* Research Question */}
                <div className="mt-4 p-3 rounded bg-white/[0.02] border-l-2 border-[#38bdf8]/60 text-xs">
                  <div className="text-[10px] font-mono text-[#38bdf8] tracking-wider uppercase mb-1">
                    ENGINEERING THESIS
                  </div>
                  <p className="text-white/60 italic text-[11px] leading-relaxed">
                    "{project.researchQuestion}"
                  </p>
                </div>

                {/* Stack Badges (Clean unboxed style) */}
                <div className="mt-4 pt-3 border-t border-white/[0.06]">
                  <div className="text-[10px] font-mono text-white/40 mb-1.5 uppercase">
                    VERIFIED STACK
                  </div>
                  <div className="flex flex-wrap gap-x-2 gap-y-1 text-xs font-mono text-white/70">
                    {project.stack.map((tech, idx) => (
                      <span key={tech} className="inline-flex items-center">
                        <span className="text-[#84cc16]/90">{tech}</span>
                        {idx < project.stack.length - 1 && (
                          <span className="text-white/20 ml-2">/</span>
                        )}
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              {/* Card Footer with Direct GitHub Link & Detail trigger */}
              <div className="mt-6 pt-4 border-t border-white/[0.08] flex items-center justify-between text-xs font-mono">
                <span className="text-[#84cc16] group-hover:translate-x-1 transition-transform flex items-center space-x-1">
                  <span>INSPECT DEEP DIVE</span>
                  <span>→</span>
                </span>

                <a
                  href={project.githubUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={(e) => {
                    e.stopPropagation();
                    sound.playClick();
                  }}
                  className="p-1 text-white/50 hover:text-white transition-colors"
                  aria-label={`Open ${project.title} on GitHub`}
                  title="Open GitHub repository"
                >
                  <IconGitHub size={16} />
                </a>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
};
