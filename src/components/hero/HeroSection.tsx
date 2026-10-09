import React from 'react';
import { sound } from '../../utils/audio.ts';
import { PROFILE_DATA } from '../../data/projectsData.ts';
import { IconGitHub, IconLinkedIn, IconNeural } from '../ui/Icons.tsx';
import { AyushAvatarLogo } from '../ui/AyushAvatarLogo.tsx';

interface HeroSectionProps {
  onExploreLab: () => void;
  onExploreSystems: () => void;
  onOpenGalaxyLab?: () => void;
}

export const HeroSection: React.FC<HeroSectionProps> = ({
  onExploreLab,
  onExploreSystems,
  onOpenGalaxyLab,
}) => {
  return (
    <section
      id="hero"
      className="hero-shell relative min-h-screen flex flex-col justify-between pt-18 sm:pt-20 lg:pt-20 xl:pt-24 pb-6 sm:pb-8 lg:pb-8 xl:pb-12 px-3.5 sm:px-6 lg:px-8 max-w-[1440px] mx-auto z-10"
      aria-label="Hero Introduction"
    >
      {/* Top HUD Readouts */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2.5 sm:gap-4 pt-2 sm:pt-3 text-[10.5px] sm:text-[11px] font-mono text-white/50 border-b border-white/[0.08] pb-3">
        <div className="flex items-center space-x-2 sm:space-x-3 overflow-hidden">
          <span className="text-[#C6FF3D] font-semibold tracking-wider flex items-center gap-1.5 shrink-0">
            <span className="w-1.5 h-1.5 bg-[#C6FF3D] rounded-full animate-pulse" />
            AYUSH KAUSHIK
          </span>
          <span className="text-white/20">|</span>
          <span className="tracking-wider text-white/70 truncate">
            SYSTEMS ARCHITECT · FOUNDER @ ADUMATE
          </span>
        </div>

        <div className="flex items-center space-x-2 sm:space-x-3 shrink-0">
          <button
            type="button"
            onClick={() => {
              sound.playGalaxyEnter();
              onOpenGalaxyLab?.();
            }}
            className="tracking-wider text-[#C6FF3D] hover:underline font-bold flex items-center gap-1.5 cursor-pointer bg-[#C6FF3D]/10 px-2 sm:px-2.5 py-1 rounded border border-[#C6FF3D]/30 text-[10px] sm:text-[11px]"
          >
            <span>🪐</span>
            <span>3D TECH SOLAR SYSTEM LIVE</span>
          </button>
          <span className="text-white/20 hidden md:inline">|</span>
          <span className="tracking-wider text-white/40 hidden md:inline">
            DRAG 3D ORBITS · CLICK ANY PLANET
          </span>
        </div>
      </div>

      {/* Main Asymmetrical Hero Grid */}
      <div className="my-auto py-4 sm:py-6 lg:py-6 xl:py-10 grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8 xl:gap-12 items-center">
        {/* Left Headline & Thesis (7 cols) */}
        <div className="lg:col-span-7 space-y-3.5 sm:space-y-5 lg:space-y-4 xl:space-y-6">
          <div className="inline-flex items-center space-x-2 px-2.5 sm:px-3 py-1 rounded bg-[#C6FF3D]/10 border border-[#C6FF3D]/30 text-[11px] sm:text-xs font-mono text-[#C6FF3D] max-w-full truncate">
            <IconNeural size={14} className="text-[#C6FF3D] shrink-0" />
            <span className="truncate">DEEP-TECH SYSTEMS ARCHITECT & FOUNDER</span>
          </div>

          <div className="space-y-1 sm:space-y-1.5 hero-copy">
            <h1 className="hero-title text-4xl xs:text-5xl sm:text-6xl lg:text-[7rem] xl:text-[8rem] 2xl:text-[9rem] font-extrabold tracking-[-0.09em] text-white leading-[0.82] break-words">
              AYUSH{' '}
              <span className="hero-name-gradient bg-gradient-to-r from-[#B6FF5C] via-[#52D7F2] to-[#A88BFF] bg-clip-text text-transparent">
                KAUSHIK
              </span>
            </h1>
            <p className="hero-subtitle text-base sm:text-xl lg:text-xl xl:text-2xl text-[#38bdf8] font-semibold tracking-[-0.025em]">
              Founder @ Adumate · Creator of AAYU
            </p>
          </div>

          <p className="hero-description text-sm sm:text-base lg:text-base xl:text-lg text-white/90 font-normal max-w-[55rem] leading-relaxed">
            I build compilers, AI infrastructure, and distributed systems—from language design and runtime internals to production-facing developer tools.
          </p>

          <p className="hero-footnote text-xs sm:text-sm text-white/65 max-w-[48rem] leading-relaxed">
            Creator of the AAYU language project and founder of Adumate. Currently studying mathematics and turning systems research into working prototypes.
          </p>

          {/* Action CTAs */}
          <div className="pt-2 sm:pt-3 flex flex-wrap items-center gap-2.5 sm:gap-3">
            <button
              type="button"
              onClick={() => {
                sound.playGalaxyEnter();
                onOpenGalaxyLab?.();
              }}
              className="px-3.5 py-2 sm:px-5 sm:py-2.5 lg:py-2.5 xl:py-3 bg-[#C6FF3D] hover:bg-[#d6ff66] text-[#0B0D10] font-mono text-xs sm:text-sm font-bold tracking-wider rounded-sm transition-all shadow-[0_0_25px_rgba(198,255,61,0.45)] hover:shadow-[0_0_35px_rgba(198,255,61,0.65)] cursor-pointer flex items-center space-x-2"
            >
              <span>🪐 3D SOLAR SYSTEM</span>
              <span className="text-[10px] bg-[#0B0D10]/20 px-1.5 py-0.5 rounded font-mono">EXPLORE</span>
            </button>

            <button
              type="button"
              onClick={() => {
                sound.playClick();
                onExploreSystems();
              }}
              className="px-3.5 py-2 sm:px-4 sm:py-2.5 lg:py-2.5 xl:py-3 border border-white/20 hover:border-[#4CC9F0] text-white/90 hover:text-[#4CC9F0] font-mono text-xs font-medium tracking-wider rounded-sm transition-all bg-white/[0.02] hover:bg-[#4CC9F0]/10 flex items-center space-x-2 cursor-pointer"
            >
              <span>FLAGSHIP SYSTEMS</span>
              <span>↓</span>
            </button>

            <button
              type="button"
              onClick={() => {
                sound.playClick();
                onExploreLab();
              }}
              className="px-3 py-2 sm:px-3.5 sm:py-2.5 lg:py-2.5 xl:py-3 border border-white/10 hover:border-white/30 text-white/70 hover:text-white font-mono text-xs font-medium tracking-wider rounded-sm transition-all bg-white/[0.02] hover:bg-white/5 flex items-center space-x-2 cursor-pointer"
            >
              <span>RESEARCH LAB</span>
              <span>→</span>
            </button>

            <a
              href={PROFILE_DATA.links.github}
              target="_blank"
              rel="noopener noreferrer"
              onClick={() => sound.playClick()}
              className="px-3 py-2 sm:px-3.5 sm:py-2.5 lg:py-2.5 xl:py-3 border border-white/10 hover:border-white/30 text-white/70 hover:text-white font-mono text-xs tracking-wider rounded-sm transition-all hover:bg-white/5 flex items-center space-x-2"
            >
              <IconGitHub size={16} />
              <span>GITHUB</span>
            </a>
          </div>
        </div>

        {/* Right Verified Technical Status Identity Card (5 cols) */}
        <div className="lg:col-span-5 w-full">
          <div className="relative bg-[#0A1019]/95 border border-white/[0.12] p-4 sm:p-5 lg:p-4.5 xl:p-6 rounded-2xl backdrop-blur-xl shadow-[0_22px_80px_rgba(0,0,0,0.42)] hover:border-[#B6FF5C]/40 transition-all duration-300 group hero-identity-card">
            {/* Corner cybernetic accents */}
            <div className="absolute top-0 left-0 w-2 h-2 border-t border-l border-[#C6FF3D]" />
            <div className="absolute top-0 right-0 w-2 h-2 border-t border-r border-[#C6FF3D]" />
            <div className="absolute bottom-0 left-0 w-2 h-2 border-b border-l border-[#C6FF3D]" />
            <div className="absolute bottom-0 right-0 w-2 h-2 border-b border-r border-[#C6FF3D]" />

            {/* Header Identity Bar */}
            <div className="flex items-center justify-between pb-3 sm:pb-4 border-b border-white/10 gap-2">
              <div className="flex items-center space-x-2.5 sm:space-x-3 min-w-0 flex-1">
                {/* Authentic 3D Animated Avatar Logo */}
                <div className="relative group/avatar cursor-pointer shrink-0">
                  <AyushAvatarLogo variant="badge" size={56} interactive={true} showControls={false} />
                </div>
                <div className="min-w-0 flex-1">
                  <h2 className="text-sm font-bold text-white tracking-wide flex items-center gap-1.5 flex-wrap">
                    <span className="truncate">{PROFILE_DATA.name}</span>
                    <span className="text-[9px] font-mono px-1.5 py-0.2 rounded bg-[#C6FF3D]/10 text-[#C6FF3D] border border-[#C6FF3D]/30 shrink-0">
                      SYSTEMS BUILDER
                    </span>
                  </h2>
                  <div className="text-[10.5px] sm:text-[11px] font-mono text-[#C6FF3D] truncate">
                    {PROFILE_DATA.roleLine}
                  </div>
                  <div className="text-[10px] font-mono text-white/50 mt-0.5 truncate">
                    {PROFILE_DATA.founderIdentity}
                  </div>
                </div>
              </div>

              <div className="text-right shrink-0">
                <span className="text-[9px] sm:text-[10px] font-mono px-2.5 py-1 rounded-full bg-[#B6FF5C]/10 border border-[#B6FF5C]/30 text-[#B6FF5C] font-bold">
                  FOUNDER
                </span>
                <div className="text-[9.5px] sm:text-[10px] font-mono text-white/40 mt-1">
                  @ Adumate
                </div>
              </div>
            </div>

            {/* Profile Verified Attributes */}
            <div className="py-2.5 sm:py-3.5 space-y-1.5 font-mono text-xs">
              <div className="flex items-start justify-between py-1 border-b border-white/5 gap-2">
                <span className="text-white/40 shrink-0">LOCATION</span>
                <span className="text-white/80 font-medium text-right">{PROFILE_DATA.location}</span>
              </div>
              <div className="flex items-start justify-between py-1 border-b border-white/5 gap-2">
                <span className="text-white/40 shrink-0">ACADEMICS</span>
                <span className="text-white/80 text-right text-[11px] leading-tight">{PROFILE_DATA.education}</span>
              </div>
              <div className="flex items-start justify-between py-1 border-b border-white/5 gap-2">
                <span className="text-white/40 shrink-0">PLATFORM</span>
                <a
                  href={PROFILE_DATA.links.website}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-[#4CC9F0] hover:underline text-right"
                >
                  adumate.in ↗
                </a>
              </div>
              <div className="flex items-start justify-between py-1 border-b border-white/5 gap-2">
                <span className="text-white/40 shrink-0">RESEARCH FOCUS</span>
                <span className="text-[#B6FF5C] text-right text-[11px]">
                  AAYU LANG · I2S · COMPILERS
                </span>
              </div>
            </div>

            {/* GitHub Achievements Badges */}
            <div className="pt-2">
              <div className="text-[10px] font-mono text-white/40 uppercase tracking-wider mb-2 flex items-center justify-between">
                <span>PUBLIC GITHUB PROFILE</span>
                <a
                  href={PROFILE_DATA.links.github}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-[#52D7F2] hover:text-white transition-colors"
                >
                  VIEW PROFILE ↗
                </a>
              </div>

              <div className="grid grid-cols-2 gap-2 text-[10.5px] sm:text-[11px] font-mono">
                {PROFILE_DATA.githubStats.achievements.map((ach) => (
                  <div
                    key={ach.name}
                    className="p-2 rounded-lg bg-white/[0.025] border border-white/[0.06] flex items-center justify-between"
                  >
                    <span className="text-white/80 truncate mr-1">{ach.name}</span>
                    <span className="text-[#C6FF3D] text-[10px] shrink-0">★</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Honest verification footer */}
            <div className="mt-3 pt-2.5 border-t border-white/5 text-[10px] font-mono text-white/40 flex items-center justify-between">
              <span>DELHI, INDIA · {PROFILE_DATA.pronouns}</span>
              <span className="text-[#52D7F2]">OPEN SOURCE ↗</span>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Scroll Cue */}
      <div className="flex items-center justify-between pt-4 border-t border-white/[0.08] text-[10px] sm:text-[11px] font-mono text-white/40">
        <div className="flex items-center space-x-2 truncate mr-2">
          <span className="w-2 h-2 rounded-full border border-[#C6FF3D] flex items-center justify-center shrink-0">
            <span className="w-0.5 h-0.5 bg-[#C6FF3D] rounded-full animate-ping" />
          </span>
          <span className="truncate">SCROLL TO ENTER SYSTEMS & RESEARCH ROOMS</span>
        </div>

        <div className="flex items-center space-x-3 sm:space-x-4 shrink-0">
          <span className="hidden xs:inline">01 / 07 CHOREOGRAPHY</span>
          <span className="animate-bounce">↓</span>
        </div>
      </div>
    </section>
  );
};
