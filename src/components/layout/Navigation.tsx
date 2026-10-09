import React, { useState } from 'react';
import { sound } from '../../utils/audio.ts';
import { IconGitHub, IconLinkedIn } from '../ui/Icons.tsx';
import { AyushAvatarLogo } from '../ui/AyushAvatarLogo.tsx';

interface NavigationProps {
  reducedMotion: boolean;
  onToggleReducedMotion: () => void;
  activeSection: string;
  onOpenChess: () => void;
  onOpenChat: () => void;
  onToggleGalaxyLab?: () => void;
  isGalaxyLabOpen?: boolean;
}

export const Navigation: React.FC<NavigationProps> = ({
  reducedMotion,
  onToggleReducedMotion,
  activeSection,
  onOpenChess,
  onOpenChat,
  onToggleGalaxyLab,
  isGalaxyLabOpen = false,
}) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [soundActive, setSoundActive] = useState(false);
  const [soundError, setSoundError] = useState('');

  const toggleSound = async () => {
    setSoundError('');
    if (soundActive) {
      sound.disable();
      setSoundActive(false);
      return;
    }

    try {
      await sound.enableWithFeedback();
      setSoundActive(true);
    } catch (error) {
      setSoundError(error instanceof Error ? error.message : String(error));
    }
  };

  const navLinks = [
    { label: '3D GALAXY', href: '#galaxy', id: 'galaxy' },
    { label: 'CHESS', href: '#chess', id: 'chess' },
    { label: 'SYSTEMS', href: '#systems', id: 'systems' },
    { label: 'LAB', href: '#lab', id: 'lab' },
    { label: 'ABOUT AYUSH', href: '#about', id: 'about' },
    { label: 'EXPERTISE', href: '#expertise', id: 'expertise' },
    { label: 'PUBLIC WORK', href: '#public-work', id: 'public-work' },
    { label: 'CONNECT', href: '#connect', id: 'connect' },
    { label: 'FREE LLMS', href: '#free-llms', id: 'free-llms' },
  ];

  const handleLinkClick = (id: string) => {
    sound.playClick();
    setMobileMenuOpen(false);
  };

  return (
    <header className="fixed top-0 left-0 right-0 z-40 bg-[#0B0D10]/85 backdrop-blur-md border-b border-white/[0.08]">
      <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        {/* Brand / Mark with 3D Face Avatar */}
        <div className="flex items-center space-x-2.5 sm:space-x-3.5 min-w-0">
          <a
            href="#"
            onClick={() => sound.playClick()}
            className="group flex items-center space-x-2.5 sm:space-x-3 text-[#f8fafc] font-mono tracking-wider focus:outline-none focus:ring-1 focus:ring-[#84cc16] min-w-0"
            title="Ayush Kaushik — Deep-Tech Systems Architect"
          >
            {/* Animated 3D Face Avatar Logo */}
            <div className="relative shrink-0">
              <AyushAvatarLogo variant="nav" size={38} interactive={true} />
            </div>

            <div className="flex flex-col min-w-0">
              <span className="font-bold text-xs sm:text-base text-white group-hover:text-[#C6FF3D] transition-colors font-mono tracking-wider truncate">
                AYUSH KAUSHIK
              </span>
              <span className="text-[9px] text-[#C6FF3D]/80 font-mono tracking-widest hidden sm:inline truncate">
                FOUNDER @ ADUMATE · SYSTEMS ARCHITECT
              </span>
            </div>
          </a>

          {/* Status Indicator (ultra-wide 2xl only to keep laptops clean) */}
          <div className="hidden 2xl:flex items-center space-x-2 pl-3 border-l border-white/10 text-[10px] font-mono text-white/60">
            <span className="w-1.5 h-1.5 rounded-full bg-[#84cc16] animate-pulse shrink-0" />
            <span className="tracking-wider">LIVE NODE / DELHI, INDIA</span>
          </div>
        </div>

        {/* Desktop Navigation Links (Visible on xl+ screens: laptops 1280px+, desktops) */}
        <nav className="hidden xl:flex items-center space-x-4 2xl:space-x-6" aria-label="Main Navigation">
          {navLinks.map((link, idx) => {
            const isActive = activeSection === link.id;
            return (
              <a
                key={link.id}
                href={link.href}
                onClick={() => handleLinkClick(link.id)}
                className={`font-mono text-xs tracking-wider transition-colors py-1 relative ${
                  isActive
                    ? 'text-[#84cc16] font-semibold'
                    : 'text-white/70 hover:text-[#f8fafc]'
                }`}
              >
                <span className="text-[10px] text-white/30 mr-1">0{idx + 1}.</span>
                {link.label}
                {isActive && (
                  <span className="absolute bottom-0 left-0 right-0 h-[2px] bg-[#84cc16] shadow-[0_0_8px_#84cc16]" />
                )}
              </a>
            );
          })}
        </nav>

        {/* Right System Controls & Action Triggers */}
        <div className="flex items-center space-x-1.5 sm:space-x-2.5 shrink-0">
          <span
            className="px-2 py-1 text-[10px] sm:text-[11px] font-mono border border-white/10 rounded bg-[#10141A] text-white/80"
            aria-label="Night mode always on"
            title="Night mode is always on"
          >
            NIGHT
          </span>

          {/* Audio SFX Toggle */}
          <button
            type="button"
            onClick={toggleSound}
            title={soundError || (soundActive ? 'Mute audio feedback' : 'Enable audio feedback')}
            aria-label={soundActive ? 'Audio ON' : 'Audio OFF'}
            className={`flex items-center space-x-1 sm:space-x-1.5 px-1.5 sm:px-2.5 py-1 text-[10px] sm:text-[11px] font-mono border rounded transition-all cursor-pointer ${
              soundActive
                ? 'border-[#84cc16] text-[#84cc16] bg-[#84cc16]/10'
                : 'border-white/10 text-white/50 hover:text-white hover:border-white/20'
            }`}
            aria-pressed={soundActive}
          >
            <span className={`w-1.5 h-1.5 rounded-full ${soundActive ? 'bg-[#84cc16]' : 'bg-white/30'}`} />
            <span>SFX</span>
            <span>{soundActive ? 'ON' : 'OFF'}</span>
          </button>
          <span id="sound-status" className="sr-only" role="status" aria-live="polite">{soundError}</span>

          {/* 3D Solar System / Galaxy Lab Primary Toggle */}
          {onToggleGalaxyLab && (
            <button
              type="button"
              onClick={() => {
                if (isGalaxyLabOpen) sound.playClick();
                else sound.playGalaxyEnter();
                onToggleGalaxyLab();
              }}
              title="Toggle 3D Tech Solar System & Galaxy Lab"
              className={`flex items-center space-x-1.5 px-2.5 sm:px-3 py-1 text-[10px] sm:text-[11px] font-mono border rounded transition-all cursor-pointer shrink-0 ${
                isGalaxyLabOpen
                  ? 'border-[#C6FF3D] bg-[#C6FF3D] text-[#0B0D10] font-bold shadow-[0_0_15px_rgba(198,255,61,0.5)]'
                  : 'border-[#C6FF3D]/50 text-[#C6FF3D] bg-[#C6FF3D]/10 hover:bg-[#C6FF3D]/20 shadow-[0_0_10px_rgba(198,255,61,0.2)]'
              }`}
            >
              <span>🪐</span>
              <span className="font-semibold">{isGalaxyLabOpen ? 'EXIT 3D' : '3D GALAXY'}</span>
            </button>
          )}

          {/* 3D Static/Flow Toggle (Visible on wide screens 2xl+) */}
          <button
            type="button"
            onClick={() => {
              sound.playClick();
              onToggleReducedMotion();
            }}
            title={reducedMotion ? 'Enable 3D animation' : 'Reduce 3D motion'}
            aria-label={reducedMotion ? '3D Motion Paused' : '3D Motion Active'}
            className={`hidden 2xl:flex items-center space-x-1 px-2.5 py-1 text-[11px] font-mono border rounded transition-all cursor-pointer ${
              reducedMotion
                ? 'border-[#38bdf8] text-[#38bdf8] bg-[#38bdf8]/10'
                : 'border-white/10 text-white/50 hover:text-white hover:border-white/20'
            }`}
          >
            <span>3D {reducedMotion ? 'STATIC' : 'FLOW'}</span>
          </button>

          {/* AI Assistant Quick Trigger (Wide screens 2xl+, floating button handles other viewports) */}
          <button
            type="button"
            onClick={() => {
              sound.playClick();
              onOpenChat();
            }}
            title="Open AI Assistant Console"
            className="hidden 2xl:flex items-center space-x-1.5 px-2.5 py-1 text-[11px] font-mono border border-[#84cc16]/40 text-[#84cc16] bg-[#84cc16]/10 hover:bg-[#84cc16]/20 rounded transition-all cursor-pointer"
          >
            <span className="w-1.5 h-1.5 rounded-full bg-[#84cc16] animate-pulse" />
            <span>AI CONSOLE</span>
          </button>

          {/* Social Quick Links (Wide screens 2xl+) */}
          <div className="hidden 2xl:flex items-center space-x-1.5 pl-2 border-l border-white/10">
            <a
              href="https://github.com/Minato95-ayu"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="GitHub Profile"
              className="p-1.5 text-white/70 hover:text-white hover:bg-white/5 rounded transition-colors"
            >
              <IconGitHub size={17} />
            </a>
            <a
              href="https://www.linkedin.com/in/ayushh-kaushiq-1a950825a"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="LinkedIn Profile"
              className="p-1.5 text-white/70 hover:text-[#38bdf8] hover:bg-white/5 rounded transition-colors"
            >
              <IconLinkedIn size={17} />
            </a>
          </div>

          {/* Mobile & Laptop Navigation Hamburger Menu (Active below 1280px) */}
          <button
            type="button"
            onClick={() => {
              sound.playClick();
              setMobileMenuOpen(!mobileMenuOpen);
            }}
            aria-label="Toggle navigation menu"
            aria-expanded={mobileMenuOpen}
            className="xl:hidden p-2 text-white/70 hover:text-white focus:outline-none cursor-pointer rounded border border-white/10 hover:border-white/25 bg-white/[0.02]"
          >
            <div className="w-5 h-4 flex flex-col justify-between">
              <span
                className={`h-0.5 bg-current transition-transform duration-200 ${
                  mobileMenuOpen ? 'rotate-45 translate-y-1.5' : ''
                }`}
              />
              <span
                className={`h-0.5 bg-current transition-opacity duration-200 ${
                  mobileMenuOpen ? 'opacity-0' : ''
                }`}
              />
              <span
                className={`h-0.5 bg-current transition-transform duration-200 ${
                  mobileMenuOpen ? '-rotate-45 -translate-y-2' : ''
                }`}
              />
            </div>
          </button>
        </div>
      </div>

      {/* Mobile & Laptop Responsive Drawer (xl:hidden) */}
      {mobileMenuOpen && (
        <div className="xl:hidden bg-[#0c1017]/98 border-b border-white/10 px-5 py-5 space-y-4 max-h-[calc(100vh-64px)] overflow-y-auto animate-fadeIn shadow-2xl">
          <div className="text-[10px] font-mono text-[#84cc16] tracking-widest uppercase pb-2 border-b border-white/5 flex items-center justify-between">
            <span>AYUSH KAUSHIK NAVIGATION CONSOLE</span>
            <span className="w-1.5 h-1.5 rounded-full bg-[#84cc16] animate-pulse" />
          </div>

          {/* Mobile Quick Action Buttons */}
          <div className="grid grid-cols-2 gap-2 pt-1 font-mono text-xs">
            {onToggleGalaxyLab && (
              <button
                type="button"
                onClick={() => {
                  sound.playClick();
                  setMobileMenuOpen(false);
                  onToggleGalaxyLab();
                }}
                className="p-2.5 rounded bg-[#C6FF3D]/10 border border-[#C6FF3D]/40 text-[#C6FF3D] font-bold flex items-center justify-center gap-2 cursor-pointer"
              >
                <span>🪐</span>
                <span>{isGalaxyLabOpen ? 'EXIT 3D' : '3D GALAXY'}</span>
              </button>
            )}

            <button
              type="button"
              onClick={() => {
                sound.playClick();
                setMobileMenuOpen(false);
                onOpenChat();
              }}
              className="p-2.5 rounded bg-[#84cc16]/10 border border-[#84cc16]/40 text-[#84cc16] font-bold flex items-center justify-center gap-2 cursor-pointer"
            >
              <span>⚡</span>
              <span>AI CONSOLE</span>
            </button>
          </div>

          <div className="flex flex-col space-y-2.5 pt-2">
            {navLinks.map((link, idx) => (
              <a
                key={link.id}
                href={link.href}
                onClick={() => handleLinkClick(link.id)}
                className="font-mono text-sm tracking-wider text-white/80 hover:text-[#84cc16] py-1.5 px-2 rounded hover:bg-white/5 flex items-center justify-between"
              >
                <span>{link.label}</span>
                <span className="text-[10px] text-white/40">0{idx + 1}</span>
              </a>
            ))}
          </div>

          {/* Social Links on Mobile */}
          <div className="pt-3 border-t border-white/10 flex items-center justify-around text-xs font-mono">
            <a
              href="https://github.com/Minato95-ayu"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center space-x-1.5 text-white/70 hover:text-white py-1"
            >
              <IconGitHub size={16} />
              <span>GitHub</span>
            </a>
            <a
              href="https://www.linkedin.com/in/ayushh-kaushiq-1a950825a"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center space-x-1.5 text-white/70 hover:text-[#38bdf8] py-1"
            >
              <IconLinkedIn size={16} />
              <span>LinkedIn</span>
            </a>
          </div>

          <div className="pt-3 border-t border-white/5 flex items-center justify-between text-xs font-mono">
            <button
              type="button"
              onClick={toggleSound}
              className="text-white/60 hover:text-[#84cc16] py-1 cursor-pointer"
            >
              AUDIO: {soundActive ? 'ACTIVE' : 'MUTED'}
            </button>
            <button
              type="button"
              onClick={onToggleReducedMotion}
              className="text-white/60 hover:text-[#38bdf8] py-1 cursor-pointer"
            >
              MOTION: {reducedMotion ? 'REDUCED' : 'FULL 3D'}
            </button>
          </div>
        </div>
      )}
    </header>
  );
};
