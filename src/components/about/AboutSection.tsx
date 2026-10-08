import React, { useState } from 'react';
import { PROFILE_DATA } from '../../data/projectsData.ts';
import { IconAdumate, IconNeural, IconGitHub, IconLinkedIn } from '../ui/Icons.tsx';
import { AyushAvatarLogo } from '../ui/AyushAvatarLogo.tsx';
import { sound } from '../../utils/audio.ts';
import {
  Code2,
  Terminal,
  Cpu,
  GraduationCap,
  Sparkles,
  Youtube,
  Globe,
  Mail,
  CheckCircle2,
  Share2,
  Layers,
  Flame,
  Volume2,
} from 'lucide-react';

export const AboutSection: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'story' | 'philosophy' | 'stack' | 'contact'>('story');
  const [speaking, setSpeaking] = useState(false);

  const handleVoiceIntro = () => {
    sound.playClick();
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      const text =
        "Namaste! I'm Ayush Kaushik. Deep-Tech Systems Architect and founder of Adumate. Welcome to my systems universe.";
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.pitch = 1.05;
      utterance.rate = 1.0;
      utterance.onstart = () => setSpeaking(true);
      utterance.onend = () => setSpeaking(false);
      utterance.onerror = () => setSpeaking(false);
      window.speechSynthesis.speak(utterance);
    } else {
      setSpeaking(true);
      setTimeout(() => setSpeaking(false), 2000);
    }
  };

  const tabs = [
    { id: 'story', label: '01. MERA SAFAR (MY STORY)' },
    { id: 'philosophy', label: '02. OPERATING PRINCIPLES' },
    { id: 'stack', label: '03. SYSTEMS DNA & STACK' },
    { id: 'contact', label: '04. DIRECT CONNECT' },
  ] as const;

  return (
    <section
      id="about"
      className="relative min-h-screen py-24 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto z-10"
      aria-label="About Ayush Kaushik"
    >
      {/* Top HUD Breadcrumb */}
      <div className="space-y-4 mb-14 border-b border-white/[0.08] pb-8">
        <div className="flex flex-wrap items-center gap-3 text-xs font-mono text-[#4CC9F0]">
          <span className="w-2 h-2 rounded-sm bg-[#4CC9F0] animate-pulse" />
          <span className="font-bold">RESEARCH ROOM / 003</span>
          <span className="text-white/20">|</span>
          <span className="text-[#C6FF3D] font-bold">MERA BAARE MEIN (ABOUT AYUSH KAUSHIK)</span>
          <span className="text-white/20">|</span>
          <span className="text-white/50">FOUNDER · COMPILER ARCHITECT · RESEARCHER</span>
        </div>

        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div>
            <h2 className="text-3xl sm:text-5xl font-bold tracking-tight text-[#EDEFF2]">
              Ayush Kaushik.{' '}
              <span className="text-[#C6FF3D] text-glow-lime">Closer to the metal.</span>
            </h2>
            <p className="mt-2 text-sm sm:text-base text-white/70 max-w-2xl font-mono">
              Self-taught Systems Architect, Founder @ Adumate, and Creator of the AAYU programming language.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2 text-xs font-mono">
            <span className="px-2.5 sm:px-3 py-1.5 rounded bg-white/[0.03] border border-white/10 text-white/80">
              LOCATION: <strong className="text-[#C6FF3D]">DELHI, INDIA</strong>
            </span>
            <span className="px-2.5 sm:px-3 py-1.5 rounded bg-[#C6FF3D]/10 border border-[#C6FF3D]/30 text-[#C6FF3D] font-bold">
              VERIFIED ARCHITECT
            </span>
          </div>
        </div>
      </div>

      {/* Main Grid: Left 3D Avatar Lab (5 cols), Right Interactive Biography (7 cols) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
        {/* Left Column: 3D Animated Face Avatar Showcase */}
        <div className="lg:col-span-5 space-y-6">
          <div className="relative bg-[#10141A]/95 border border-white/10 p-6 rounded-sm shadow-2xl backdrop-blur-md hover:border-[#C6FF3D]/40 transition-all duration-300 group">
            {/* Corner Cyber Accents */}
            <div className="absolute top-0 left-0 w-2.5 h-2.5 border-t-2 border-l-2 border-[#C6FF3D]" />
            <div className="absolute top-0 right-0 w-2.5 h-2.5 border-t-2 border-r-2 border-[#C6FF3D]" />
            <div className="absolute bottom-0 left-0 w-2.5 h-2.5 border-b-2 border-l-2 border-[#C6FF3D]" />
            <div className="absolute bottom-0 right-0 w-2.5 h-2.5 border-b-2 border-r-2 border-[#C6FF3D]" />

            {/* Avatar Header Readout */}
            <div className="flex items-center justify-between pb-4 border-b border-white/10 text-[11px] font-mono">
              <span className="text-[#C6FF3D] font-bold flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-[#C6FF3D] animate-ping" />
                3D AVATAR LAB
              </span>
              <span className="text-white/40">INTERACTIVE / MOVE CURSOR</span>
            </div>

            {/* Centered 3D Avatar */}
            <div className="py-6 flex flex-col items-center justify-center">
              <div className="p-3 rounded-2xl bg-gradient-to-b from-white/[0.04] to-black/40 border border-white/10">
                <AyushAvatarLogo variant="hero" size={170} interactive={true} showControls={false} />
              </div>

              <div className="mt-4 text-center">
                <h3 className="text-lg font-bold text-white flex items-center justify-center">
                  <span>Ayush Kaushik</span>
                </h3>
                <p className="text-xs font-mono text-white/60 mt-1">
                  Founder @ <a href="https://adumate.in" target="_blank" rel="noopener noreferrer" className="text-[#4CC9F0] hover:underline">adumate.in</a>
                </p>
                <p className="text-[11px] font-mono text-[#C6FF3D]/80 mt-0.5">
                  Deep-Tech Systems Architect & AI Researcher
                </p>

                {/* Voice Intro Action & Node Badge */}
                <div className="mt-3.5 flex items-center justify-center gap-2">
                  <button
                    type="button"
                    onClick={handleVoiceIntro}
                    className={`px-3 py-1.5 rounded-sm text-xs font-mono border transition-all cursor-pointer flex items-center gap-1.5 ${
                      speaking
                        ? 'bg-[#C6FF3D] text-[#0B0D10] font-bold border-[#C6FF3D] shadow-[0_0_12px_rgba(198,255,61,0.4)]'
                        : 'bg-white/[0.04] hover:bg-white/[0.08] text-white/90 border-white/10 hover:border-[#C6FF3D]/40'
                    }`}
                  >
                    <Volume2 size={13} className={speaking ? 'animate-bounce text-[#0B0D10]' : 'text-[#C6FF3D]'} />
                    <span>{speaking ? 'GREETING PLAYING...' : 'VOICE INTRO'}</span>
                  </button>
                  <span className="text-[10px] font-mono text-white/50 px-2 py-1 bg-white/[0.02] border border-white/5 rounded-sm">
                    NODE: 001 ACTIVE
                  </span>
                </div>
              </div>
            </div>

            {/* Quick Badges / Verified Metrics */}
            <div className="pt-4 border-t border-white/10 space-y-2 text-xs font-mono">
              <div className="flex items-center justify-between py-1 border-b border-white/5">
                <span className="text-white/40">ACADEMICS</span>
                <span className="text-white/90 text-right text-[11px]">
                  NIELIT Delhi · BRABU (Math Hons)
                </span>
              </div>
              <div className="flex items-center justify-between py-1 border-b border-white/5">
                <span className="text-white/40">STARTUP</span>
                <a
                  href="https://adumate.in"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-[#4CC9F0] hover:underline"
                >
                  adumate.in ↗
                </a>
              </div>
              <div className="flex items-center justify-between py-1 border-b border-white/5">
                <span className="text-white/40">LANGUAGE</span>
                <span className="text-[#C6FF3D] font-bold">AAYU (Deterministic AI Lang)</span>
              </div>
              <div className="flex items-center justify-between py-1">
                <span className="text-white/40">YOUTUBE</span>
                <a
                  href={PROFILE_DATA.youtube.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-white/80 hover:text-[#C6FF3D] flex items-center gap-1"
                >
                  <Youtube size={12} className="text-red-500" />
                  <span>How Computers Think</span>
                </a>
              </div>
            </div>
          </div>

          {/* Direct Statement Card */}
          <div className="p-5 bg-white/[0.02] border border-white/10 rounded-sm font-mono text-xs text-white/80 leading-relaxed">
            <div className="text-[10px] text-[#C6FF3D] uppercase tracking-widest mb-2 font-bold flex items-center gap-1.5">
              <Sparkles size={12} />
              <span>CORE THESIS</span>
            </div>
            "Main code sirf screen par run karne ke liye nahi likhta — main systems ko silicon aur cache hierarchies ke lowest levels par optimize karta hoon taaki intelligence zero runtime cost par execute ho sake."
          </div>
        </div>

        {/* Right Column: Tabbed Narrative & Detailed Story (7 cols) */}
        <div className="lg:col-span-7 space-y-6">
          {/* Tabs Navigation */}
          <div className="flex flex-wrap gap-2 border-b border-white/10 pb-3">
            {tabs.map((tab) => {
              const isActive = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  type="button"
                  onClick={() => {
                    sound.playClick();
                    setActiveTab(tab.id);
                  }}
                  className={`px-3.5 py-2 text-xs font-mono tracking-wider rounded-sm transition-all cursor-pointer ${
                    isActive
                      ? 'bg-[#C6FF3D] text-[#0B0D10] font-bold shadow-[0_0_12px_rgba(198,255,61,0.3)]'
                      : 'bg-white/[0.03] text-white/70 hover:text-white hover:bg-white/[0.06] border border-white/10'
                  }`}
                >
                  {tab.label}
                </button>
              );
            })}
          </div>

          {/* TAB 1: MERA SAFAR (MY STORY) */}
          {activeTab === 'story' && (
            <div className="space-y-6 text-white/80 text-sm sm:text-base leading-relaxed">
              <div className="p-6 bg-white/[0.02] border border-white/10 rounded-sm">
                <h3 className="text-lg font-bold text-white mb-2 flex items-center gap-2">
                  <Terminal size={18} className="text-[#C6FF3D]" />
                  <span>The First-Principles Mindset</span>
                </h3>
                <p>
                  I am a self-taught deep-tech systems architect and artificial intelligence researcher based in <strong>Delhi, India</strong>. My obsession began not with high-level drag-and-drop frameworks, but with the fundamental physics of computation: how electrons flip transistors, how assembly registers pass state, and how compiler intermediate representations (IR) optimize mathematical tensors.
                </p>
              </div>

              <div className="space-y-4 text-sm font-mono text-white/75">
                <div className="p-4 bg-[#10141A] border-l-2 border-[#C6FF3D] rounded-r-sm space-y-1.5">
                  <span className="text-[#C6FF3D] font-bold text-xs uppercase tracking-wider">
                    THE BIRTH OF AAYU PROGRAMMING LANGUAGE
                  </span>
                  <p className="text-white/80 leading-normal">
                    Seeing the massive memory fragmentation and runtime overhead in modern Python/PyTorch pipelines, I set out to architect <strong>AAYU</strong> — a programming language engineered specifically for native tensor bindings, deterministic lifetime analysis, and zero-cost abstraction directly lowering to hardware instructions.
                  </p>
                </div>

                <div className="p-4 bg-[#10141A] border-l-2 border-[#4CC9F0] rounded-r-sm space-y-1.5">
                  <span className="text-[#4CC9F0] font-bold text-xs uppercase tracking-wider">
                    FOUNDING ADUMATE (adumate.in)
                  </span>
                  <p className="text-white/80 leading-normal">
                    As founder of <strong>Adumate</strong>, I am taking deep-tech compiler principles and mesh architecture into production. Adumate empowers engineering teams with high-speed API rotation, multi-provider LLM failover, and zero-downtime routing infrastructure.
                  </p>
                </div>

                <div className="p-4 bg-[#10141A] border-l-2 border-[#8B5CF6] rounded-r-sm space-y-1.5">
                  <span className="text-[#8B5CF6] font-bold text-xs uppercase tracking-wider">
                    TEACHING & YOUTUBE: "HOW COMPUTERS THINK"
                  </span>
                  <p className="text-white/80 leading-normal">
                    I believe real mastery means being able to teach concepts down to their bare iron invariants. On my channel <em>How Computers Think — Zero to Research</em>, I teach students part-time, breaking down compiler construction, neural backpropagation, and kernel internals.
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: OPERATING PRINCIPLES */}
          {activeTab === 'philosophy' && (
            <div className="space-y-4">
              <div className="p-5 bg-white/[0.02] border border-white/10 rounded-sm mb-4">
                <h3 className="text-base font-bold text-white mb-1">
                  How I Build: Engineering Invariants
                </h3>
                <p className="text-xs font-mono text-white/60">
                  Four uncompromising rules that dictate every system, line of code, and architecture decision.
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="p-4 bg-[#10141A] border border-white/10 rounded-sm">
                  <div className="flex items-center space-x-2 text-[#C6FF3D] font-mono text-xs font-bold mb-2">
                    <span>01.</span>
                    <span>NO HYPE. JUST RECEIPTS.</span>
                  </div>
                  <p className="text-xs text-white/70 font-mono leading-relaxed">
                    Public git commits, verifiable benchmark logs, and reproducible builds. Marketing claims mean nothing without working code you can clone and test.
                  </p>
                </div>

                <div className="p-4 bg-[#10141A] border border-white/10 rounded-sm">
                  <div className="flex items-center space-x-2 text-[#4CC9F0] font-mono text-xs font-bold mb-2">
                    <span>02.</span>
                    <span>USEFUL BEATS IMPRESSIVE.</span>
                  </div>
                  <p className="text-xs text-white/70 font-mono leading-relaxed">
                    A complex architecture that solves a trivial problem is wasted intellect. Systems must deliver tangible latency reduction, cost savings, or scientific breakthroughs.
                  </p>
                </div>

                <div className="p-4 bg-[#10141A] border border-white/10 rounded-sm">
                  <div className="flex items-center space-x-2 text-[#8B5CF6] font-mono text-xs font-bold mb-2">
                    <span>03.</span>
                    <span>THE QUESTION COMES FIRST.</span>
                  </div>
                  <p className="text-xs text-white/70 font-mono leading-relaxed">
                    The software follows the mathematical and physical question, never the other way around. Never choose a tech stack before formalizing invariants.
                  </p>
                </div>

                <div className="p-4 bg-[#10141A] border border-white/10 rounded-sm">
                  <div className="flex items-center space-x-2 text-[#C6FF3D] font-mono text-xs font-bold mb-2">
                    <span>04.</span>
                    <span>CLOSER TO THE METAL.</span>
                  </div>
                  <p className="text-xs text-white/70 font-mono leading-relaxed">
                    Direct hardware sympathy and understanding CPU cache lines, SIMD registers, and memory barriers will beat 100 layers of virtual machine abstraction every time.
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* TAB 3: SYSTEMS DNA & STACK */}
          {activeTab === 'stack' && (
            <div className="space-y-5">
              <div className="p-5 bg-white/[0.02] border border-white/10 rounded-sm">
                <h3 className="text-base font-bold text-white mb-2">
                  Technical Arsenal & Domains of Mastery
                </h3>
                <p className="text-xs font-mono text-white/60">
                  Full-spectrum systems engineering across low-level compilers, AI/ML runtimes, and secure distributed infrastructure.
                </p>
              </div>

              <div className="space-y-3 font-mono text-xs">
                <div className="p-3 bg-[#10141A] border border-white/10 rounded-sm">
                  <span className="text-[#C6FF3D] font-bold block mb-1.5">
                    CORE LANGUAGES & SYSTEMS PROGRAMMING
                  </span>
                  <div className="flex flex-wrap gap-2">
                    {['Rust', 'C++', 'Python', 'Go', 'TypeScript', 'Solidity', 'Linux Kernel', 'Assembly'].map((tech) => (
                      <span key={tech} className="px-2.5 py-1 bg-white/5 border border-white/10 rounded text-white/90">
                        {tech}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="p-3 bg-[#10141A] border border-white/10 rounded-sm">
                  <span className="text-[#4CC9F0] font-bold block mb-1.5">
                    AI/ML & COMPILER INFRASTRUCTURE
                  </span>
                  <div className="flex flex-wrap gap-2">
                    {['AST Parser Engineering', 'LLVM Lowering', 'PyTorch Tensors', 'LLM APIs', 'Groq LPU', 'OpenRouter Mesh', 'Deterministic Memory'].map((tech) => (
                      <span key={tech} className="px-2.5 py-1 bg-white/5 border border-white/10 rounded text-white/90">
                        {tech}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="p-3 bg-[#10141A] border border-white/10 rounded-sm">
                  <span className="text-[#8B5CF6] font-bold block mb-1.5">
                    PRODUCTION PLATFORMS & RUNTIMES
                  </span>
                  <div className="flex flex-wrap gap-2">
                    {['Docker', 'Node.js', 'Express', 'React 19', 'Tailwind CSS', 'Three.js / WebGL', 'Git / CI-CD'].map((tech) => (
                      <span key={tech} className="px-2.5 py-1 bg-white/5 border border-white/10 rounded text-white/90">
                        {tech}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB 4: DIRECT CONNECT */}
          {activeTab === 'contact' && (
            <div className="space-y-5">
              <div className="p-5 bg-white/[0.02] border border-white/10 rounded-sm">
                <h3 className="text-base font-bold text-white mb-2">
                  Direct Line to Ayush Kaushik
                </h3>
                <p className="text-xs font-mono text-white/60">
                  Open for systems architecture inquiries, advisory, deep-tech research discussions, and collaborations.
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 font-mono text-xs">
                <a
                  href={`mailto:${PROFILE_DATA.links.email}`}
                  onClick={() => sound.playClick()}
                  className="p-4 bg-[#10141A] hover:bg-white/5 border border-white/10 hover:border-[#C6FF3D] rounded-sm transition-all flex items-start space-x-3 group"
                >
                  <Mail size={18} className="text-[#C6FF3D] mt-0.5" />
                  <div>
                    <span className="text-white/40 block text-[10px]">EMAIL ADDRESS</span>
                    <span className="text-white font-medium group-hover:text-[#C6FF3D] transition-colors break-all">
                      {PROFILE_DATA.links.email}
                    </span>
                  </div>
                </a>

                <a
                  href={PROFILE_DATA.links.website}
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={() => sound.playClick()}
                  className="p-4 bg-[#10141A] hover:bg-white/5 border border-white/10 hover:border-[#4CC9F0] rounded-sm transition-all flex items-start space-x-3 group"
                >
                  <Globe size={18} className="text-[#4CC9F0] mt-0.5" />
                  <div>
                    <span className="text-white/40 block text-[10px]">STARTUP WEBSITE</span>
                    <span className="text-white font-medium group-hover:text-[#4CC9F0] transition-colors">
                      adumate.in ↗
                    </span>
                  </div>
                </a>

                <a
                  href={PROFILE_DATA.links.github}
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={() => sound.playClick()}
                  className="p-4 bg-[#10141A] hover:bg-white/5 border border-white/10 hover:border-white/40 rounded-sm transition-all flex items-start space-x-3 group"
                >
                  <IconGitHub size={18} className="text-white mt-0.5" />
                  <div>
                    <span className="text-white/40 block text-[10px]">GITHUB PROFILE</span>
                    <span className="text-white font-medium group-hover:underline">
                      @Minato95-ayu ↗
                    </span>
                  </div>
                </a>

                <a
                  href={PROFILE_DATA.links.linkedin}
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={() => sound.playClick()}
                  className="p-4 bg-[#10141A] hover:bg-white/5 border border-white/10 hover:border-[#38bdf8] rounded-sm transition-all flex items-start space-x-3 group"
                >
                  <IconLinkedIn size={18} className="text-[#38bdf8] mt-0.5" />
                  <div>
                    <span className="text-white/40 block text-[10px]">LINKEDIN</span>
                    <span className="text-white font-medium group-hover:underline">
                      @ayushh-kaushiq ↗
                    </span>
                  </div>
                </a>
              </div>
            </div>
          )}
        </div>
      </div>
    </section>
  );
};
