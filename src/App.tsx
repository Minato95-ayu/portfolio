import React, { useState, useEffect } from 'react';
import { NeuralCoreScene } from './components/scene/NeuralCoreScene.tsx';
import { Navigation } from './components/layout/Navigation.tsx';
import { HeroSection } from './components/hero/HeroSection.tsx';
import { TechGalaxySection } from './components/galaxy/TechGalaxySection.tsx';
import { FlagshipSystemsSection } from './components/flagship/FlagshipSystemsSection.tsx';
import { FreeLlmApisSection } from './components/freeLlm/FreeLlmApisSection.tsx';
import { ResearchLabSection } from './components/lab/ResearchLabSection.tsx';
import { YouTubeStrip } from './components/media/YouTubeStrip.tsx';
import { AboutSection } from './components/about/AboutSection.tsx';
import { ExpertiseSection } from './components/expertise/ExpertiseSection.tsx';
import { PublicWorkSection } from './components/publicwork/PublicWorkSection.tsx';
import { ChessSection } from './components/chess/ChessSection.tsx';
import { ConnectSection } from './components/connect/ConnectSection.tsx';
import { ProjectDetailModal } from './components/projects/ProjectDetailModal.tsx';
import { AayuAssistant } from './components/chat/AayuAssistant.tsx';
import { ALL_PROJECTS, ProjectData } from './data/projectsData.ts';
import { sound } from './utils/audio.ts';
import { AyushAvatarLogo } from './components/ui/AyushAvatarLogo.tsx';

export default function App() {
  const [selectedProject, setSelectedProject] = useState<ProjectData | null>(null);
  const [chatOpen, setChatOpen] = useState<boolean>(false);
  const [isGalaxyLabOpen, setIsGalaxyLabOpen] = useState<boolean>(false);
  const [reducedMotion, setReducedMotion] = useState<boolean>(() => {
    if (typeof window !== 'undefined') {
      return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    }
    return false;
  });
  const [activeSection, setActiveSection] = useState<string>('hero');

  useEffect(() => {
    document.documentElement.dataset.theme = 'night';
  }, []);

  // Sync selected project with URL query param `?project=slug` for deep-linking
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const slug = params.get('project');
    if (slug) {
      const found = ALL_PROJECTS.find((p) => p.slug.toLowerCase() === slug.toLowerCase());
      if (found) {
        setSelectedProject(found);
      }
    }

    const handlePopState = () => {
      const p = new URLSearchParams(window.location.search);
      const s = p.get('project');
      if (s) {
        const item = ALL_PROJECTS.find((proj) => proj.slug.toLowerCase() === s.toLowerCase());
        setSelectedProject(item || null);
      } else {
        setSelectedProject(null);
      }
    };
    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, []);

  const openProjectDetail = (proj: ProjectData) => {
    setSelectedProject(proj);
    const url = new URL(window.location.href);
    url.searchParams.set('project', proj.slug);
    window.history.pushState({}, '', url.toString());
  };

  const closeProjectDetail = () => {
    setSelectedProject(null);
    const url = new URL(window.location.href);
    url.searchParams.delete('project');
    window.history.pushState({}, '', url.toString());
  };

  // ScrollSpy to track active section for navigation
  useEffect(() => {
    const sections = ['hero', 'galaxy', 'chess', 'systems', 'lab', 'about', 'expertise', 'public-work', 'connect', 'free-llms'];
    const handleScroll = () => {
      const scrollPos = window.scrollY + 200;
      for (const sectionId of sections) {
        const el = document.getElementById(sectionId);
        if (el) {
          const top = el.offsetTop;
          const height = el.offsetHeight;
          if (scrollPos >= top && scrollPos < top + height) {
            setActiveSection(sectionId);
            break;
          }
        }
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleExploreLab = () => {
    const el = document.getElementById('lab');
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const handleExploreSystems = () => {
    const el = document.getElementById('systems');
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const handleScrollToChess = () => {
    const el = document.getElementById('chess');
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div className="relative min-h-screen bg-[#0B0D10] text-[#EDEFF2] overflow-x-hidden">
      {/* 3D WebGL Neural Core Scene */}
      <div
        className={
          isGalaxyLabOpen
            ? 'fixed inset-0 z-30 pointer-events-auto bg-[#07090D]'
            : 'fixed inset-0 z-0 pointer-events-none transition-opacity duration-700'
        }
        style={{
          opacity: isGalaxyLabOpen ? 1 : activeSection === 'hero' ? 0.2 : 0.045,
          filter: isGalaxyLabOpen ? 'none' : 'saturate(0.82)',
        }}
      >
        <NeuralCoreScene
          reducedMotion={reducedMotion}
          activeSection={activeSection}
          isInteractiveMode={isGalaxyLabOpen}
          onToggleInteractiveMode={() => setIsGalaxyLabOpen(!isGalaxyLabOpen)}
        />
      </div>

      {/* Fullscreen 3D Lab Top Bar when active */}
      {isGalaxyLabOpen && (
        <div className="fixed top-16 left-0 right-0 z-40 bg-[#0B0D10]/95 backdrop-blur-md border-b border-[#C6FF3D]/30 px-3 sm:px-8 py-2 flex items-center justify-between">
          <div className="flex items-center space-x-2 sm:space-x-3 text-xs font-mono text-[#C6FF3D] truncate mr-2">
            <span className="w-2 h-2 rounded-full bg-[#C6FF3D] animate-ping shrink-0" />
            <span className="font-bold tracking-wider truncate">3D UNIVERSE EXPLORER</span>
            <span className="text-white/30 hidden sm:inline">|</span>
            <span className="text-white/60 hidden sm:inline truncate">
              DRAG TO ROTATE 360° · PINCH/SCROLL ZOOM · CLICK PLANETS
            </span>
          </div>

          <button
            type="button"
            onClick={() => {
              sound.playClick();
              setIsGalaxyLabOpen(false);
            }}
            className="px-2.5 sm:px-3.5 py-1 sm:py-1.5 bg-[#EF4444]/20 hover:bg-[#EF4444]/30 border border-[#EF4444] text-[#EF4444] rounded-sm font-mono text-xs font-bold transition-all cursor-pointer flex items-center gap-1 shrink-0"
          >
            <span>✕ EXIT</span>
            <span className="hidden xs:inline">3D LAB</span>
          </button>
        </div>
      )}

      {/* Cybernetic Grid Overlay (subtle scanline effect) */}
      <div className="fixed inset-0 pointer-events-none scanline-grid opacity-30 z-[1]" />

      {/* Navigation */}
      <Navigation
        reducedMotion={reducedMotion}
        onToggleReducedMotion={() => setReducedMotion(!reducedMotion)}
        activeSection={activeSection}
        onOpenChess={handleScrollToChess}
        onOpenChat={() => setChatOpen(true)}
        onToggleGalaxyLab={() => setIsGalaxyLabOpen(!isGalaxyLabOpen)}
        isGalaxyLabOpen={isGalaxyLabOpen}
      />

      {/* Main Content Sections */}
      <main className="relative z-10">
        <HeroSection
          onExploreLab={handleExploreLab}
          onExploreSystems={handleExploreSystems}
          onOpenGalaxyLab={() => setIsGalaxyLabOpen(true)}
        />
        <TechGalaxySection
          onOpenFullscreenGalaxy={() => setIsGalaxyLabOpen(true)}
        />
        <ChessSection />
        <FlagshipSystemsSection onSelectProject={openProjectDetail} />
        <ResearchLabSection onSelectProject={openProjectDetail} />
        <YouTubeStrip />
        <AboutSection />
        <ExpertiseSection />
        <PublicWorkSection onSelectProject={openProjectDetail} />
        <ConnectSection />
        <FreeLlmApisSection onTestProvider={() => setChatOpen(true)} />
      </main>

      {/* Project Detail Modal / Dedicated Route View */}
      {selectedProject && (
        <ProjectDetailModal
          project={selectedProject}
          onClose={closeProjectDetail}
        />
      )}

      {/* Interactive AI Assistant Modal / Console */}
      {chatOpen && (
        <AayuAssistant onClose={() => setChatOpen(false)} />
      )}

      {/* Floating Action Trigger for AI Assistant (hidden if 3D Lab or Chat is active) */}
      {!chatOpen && !isGalaxyLabOpen && (
        <div className="fixed bottom-4 right-3 sm:bottom-6 sm:right-6 z-40 flex items-center space-x-2">
          <button
            type="button"
            onClick={() => {
              sound.playClick();
              handleScrollToChess();
            }}
            title="Play Neural Chess"
            className="px-2.5 py-1.5 sm:px-3 sm:py-2 bg-[#161C24] hover:bg-[#202936] text-white border border-white/20 hover:border-[#C6FF3D] rounded-full shadow-lg font-mono text-xs flex items-center space-x-1.5 transition-all cursor-pointer"
          >
            <span>♟</span>
            <span className="hidden sm:inline">CHESS</span>
          </button>

          <button
            type="button"
            onClick={() => {
              sound.playClick();
              setChatOpen(true);
            }}
            title="Open Ask Ayush AI Assistant"
            className="pl-2 pr-3.5 sm:pr-4 py-1.5 bg-[#C6FF3D] hover:bg-[#d6ff66] text-[#0B0D10] font-mono text-xs font-bold rounded-full shadow-[0_0_20px_rgba(198,255,61,0.4)] hover:shadow-[0_0_30px_rgba(198,255,61,0.6)] flex items-center space-x-2 transition-all cursor-pointer group"
          >
            <AyushAvatarLogo variant="icon" size={24} interactive={false} />
            <span>ASK AYUSH</span>
            <span className="w-1.5 h-1.5 rounded-full bg-[#0B0D10] animate-pulse" />
          </button>
        </div>
      )}
    </div>
  );
}
