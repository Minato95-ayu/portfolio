import React, { useState } from 'react';
import { ALL_PROJECTS, ProjectData } from '../../data/projectsData.ts';
import { IconByTag } from '../ui/Icons.tsx';
import { sound } from '../../utils/audio.ts';

const projectFilters: (ProjectData['category'] | 'ALL')[] = [
  'ALL',
  'FLAGSHIP SYSTEM',
  'PUBLIC WORK',
  'RESEARCH LAB',
  'FOUNDER ECOSYSTEM',
];

const filterLabels: Record<ProjectData['category'] | 'ALL', string> = {
  ALL: 'ALL PROJECTS',
  'FLAGSHIP SYSTEM': 'FLAGSHIP',
  'PUBLIC WORK': 'PUBLIC WORK',
  'RESEARCH LAB': 'RESEARCH',
  'FOUNDER ECOSYSTEM': 'FOUNDER ECOSYSTEM',
};

interface ProjectArchitectureShowcaseProps {
  onSelectProject: (project: ProjectData) => void;
}

export const ProjectArchitectureShowcase: React.FC<ProjectArchitectureShowcaseProps> = ({
  onSelectProject,
}) => {
  const [activeFilter, setActiveFilter] = useState<ProjectData['category'] | 'ALL'>('ALL');
  const filteredProjects =
    activeFilter === 'ALL'
      ? ALL_PROJECTS
      : ALL_PROJECTS.filter((project) => project.category === activeFilter);

  return (
    <section
      id="systems"
      className="relative min-h-screen py-20 sm:py-24 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto z-10"
      aria-label="Project Architecture Showcase"
    >
      <div className="space-y-4 mb-10 border-b border-white/[0.08] pb-7">
        <div className="flex flex-wrap items-center gap-2 sm:gap-3 text-xs font-mono text-[#C6FF3D]">
          <span className="w-2 h-2 rounded-sm bg-[#C6FF3D] shrink-0" />
          <span>PROJECT ARCHITECTURE SHOWCASE</span>
          <span className="text-white/20">|</span>
          <span className="text-white/50">{ALL_PROJECTS.length} SYSTEMS · ONE INDEX</span>
        </div>

        <h2 className="text-3xl sm:text-5xl font-bold tracking-tight text-[#EDEFF2]">
          From research to{' '}
          <span className="text-[#C6FF3D] text-glow-lime">system architecture.</span>
        </h2>

        <p className="text-sm sm:text-base text-white/70 max-w-3xl leading-relaxed">
          Browse every project in one place. Each card shows its architecture flow, technology stack,
          and current status; open a deep dive for implementation notes, next steps, and supporting
          details. Concepts and documented designs are labeled separately from active work.
        </p>

        <div className="pt-3 flex flex-wrap items-center gap-2 font-mono text-[10px] sm:text-xs">
          {projectFilters.map((filter) => {
            const isActive = activeFilter === filter;
            const count =
              filter === 'ALL'
                ? ALL_PROJECTS.length
                : ALL_PROJECTS.filter((project) => project.category === filter).length;

            return (
              <button
                key={filter}
                type="button"
                aria-pressed={isActive}
                onClick={() => {
                  sound.playClick();
                  setActiveFilter(filter);
                }}
                className={`px-3 py-2 rounded-lg border transition-colors cursor-pointer ${
                  isActive
                    ? 'border-[#C6FF3D]/60 bg-[#C6FF3D]/10 text-[#C6FF3D]'
                    : 'border-white/10 bg-white/[0.02] text-white/55 hover:text-white hover:border-white/25'
                }`}
              >
                {filterLabels[filter]} <span className="opacity-65">({count})</span>
              </button>
            );
          })}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-5">
        {filteredProjects.map((project) => {
          const architectureSteps = project.architectureNotes.split(/\s*(?:->|→)\s*/);

          return (
            <article
              key={project.slug}
              className="relative overflow-hidden bg-[#0A1019]/95 border border-white/10 hover:border-[#B6FF5C]/40 p-5 sm:p-6 rounded-2xl backdrop-blur-xl transition-colors shadow-[0_16px_48px_rgba(0,0,0,0.2)]"
            >
              <div className="flex items-start justify-between gap-3 pb-4 border-b border-white/[0.08]">
                <div className="flex items-center gap-3 min-w-0">
                  <div className="p-2.5 rounded-xl bg-white/[0.04] border border-white/10 text-[#B6FF5C] shrink-0">
                    <IconByTag iconName={project.iconName} size={20} />
                  </div>
                  <div className="min-w-0">
                    <h3 className="font-bold text-base sm:text-lg text-white truncate">
                      {project.title}
                    </h3>
                    <p className="text-[10px] font-mono text-white/45 mt-0.5">{project.tag}</p>
                  </div>
                </div>
                <span className="text-[9px] sm:text-[10px] font-mono text-[#C6FF3D] border border-[#C6FF3D]/25 bg-[#C6FF3D]/[0.06] rounded-full px-2.5 py-1 text-right shrink-0">
                  {project.category}
                </span>
              </div>

              <p className="mt-4 text-sm text-white/75 leading-relaxed">{project.summary}</p>

              <div className="mt-4">
                <div className="flex flex-wrap items-center justify-between gap-2 mb-2">
                  <h4 className="text-[10px] font-mono tracking-wider text-[#52D7F2]">
                    ARCHITECTURE FLOW
                  </h4>
                  <span className="text-[9px] font-mono text-white/45">{project.status}</span>
                </div>
                <ol className="flex flex-wrap items-center gap-2">
                  {architectureSteps.map((step, index) => (
                    <React.Fragment key={`${project.slug}-${index}`}>
                      {index > 0 && (
                        <li aria-hidden="true" className="text-[#52D7F2]/70 text-xs">
                          →
                        </li>
                      )}
                      <li className="max-w-full rounded-lg border border-[#52D7F2]/15 bg-[#52D7F2]/[0.04] px-2.5 py-1.5 text-[10px] sm:text-[11px] font-mono text-white/75 break-words">
                        {step}
                      </li>
                    </React.Fragment>
                  ))}
                </ol>
              </div>

              <div className="mt-4 flex flex-wrap gap-1.5">
                {project.stack.map((technology) => (
                  <span
                    key={technology}
                    className="rounded-full border border-white/[0.08] bg-white/[0.025] px-2.5 py-1 text-[10px] font-mono text-white/60"
                  >
                    {technology}
                  </span>
                ))}
              </div>

              <div className="mt-5 pt-4 border-t border-white/[0.08] flex flex-wrap items-center justify-between gap-3">
                <span className="text-[10px] font-mono text-white/45">
                  STATUS: <span className="text-white/70">{project.status}</span>
                </span>
                <button
                  type="button"
                  onClick={() => {
                    sound.playClick();
                    onSelectProject(project);
                  }}
                  className="text-xs font-mono font-semibold text-[#C6FF3D] hover:text-white transition-colors cursor-pointer"
                >
                  OPEN PROJECT DEEP DIVE <span aria-hidden="true">→</span>
                </button>
              </div>
            </article>
          );
        })}
      </div>
    </section>
  );
};
