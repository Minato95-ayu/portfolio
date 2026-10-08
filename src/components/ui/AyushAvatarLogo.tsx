import React, { useState, useRef, useEffect } from 'react';
import { sound } from '../../utils/audio.ts';
import { Sparkles, Volume2, ShieldCheck, Cpu, Eye, Radio } from 'lucide-react';

export interface AyushAvatarProps {
  variant?: 'icon' | 'nav' | 'badge' | 'hero' | 'full3d';
  size?: number;
  interactive?: boolean;
  showHalo?: boolean;
  showControls?: boolean;
  className?: string;
  onClick?: () => void;
}

export const AyushAvatarLogo: React.FC<AyushAvatarProps> = ({
  variant = 'nav',
  size,
  interactive = true,
  showHalo = true,
  showControls = false,
  className = '',
  onClick,
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const [isHovered, setIsHovered] = useState(false);
  const [isBlinking, setIsBlinking] = useState(false);
  const [hudActive, setHudActive] = useState(false);
  const [speaking, setSpeaking] = useState(false);
  const [mode, setMode] = useState<'founder' | 'cyberpunk' | 'neural'>('founder');

  // Compute dimensions based on variant
  const defaultSize =
    variant === 'icon'
      ? 36
      : variant === 'nav'
        ? 44
        : variant === 'badge'
          ? 88
          : variant === 'hero'
            ? 180
            : 280;

  const actualSize = size || defaultSize;

  // Track cursor for 3D tilt effect
  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!interactive || !containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;
    const dx = (e.clientX - centerX) / (rect.width / 2);
    const dy = (e.clientY - centerY) / (rect.height / 2);
    setMousePos({
      x: Math.max(-1, Math.min(1, dx)),
      y: Math.max(-1, Math.min(1, dy)),
    });
  };

  const handleMouseLeave = () => {
    setIsHovered(false);
    setMousePos({ x: 0, y: 0 });
  };

  // Periodic natural blinking
  useEffect(() => {
    const blinkInterval = setInterval(() => {
      setIsBlinking(true);
      setTimeout(() => setIsBlinking(false), 160);
    }, 3800 + Math.random() * 2000);
    return () => clearInterval(blinkInterval);
  }, []);

  // Voice Greeting / Speech intro
  const handleVoiceIntro = (e: React.MouseEvent) => {
    e.stopPropagation();
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

  // Tilt and eye offsets
  const headRotX = -mousePos.y * 14;
  const headRotY = mousePos.x * 16;
  const pupilOffsetX = mousePos.x * 2.8;
  const pupilOffsetY = mousePos.y * 2.0;

  return (
    <div
      ref={containerRef}
      onMouseMove={handleMouseMove}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={handleMouseLeave}
      onClick={onClick}
      className={`relative select-none ${showControls ? 'flex flex-col items-center' : ''} ${interactive ? 'cursor-pointer' : ''} ${className}`}
      style={{
        width: actualSize,
        perspective: '800px',
      }}
      role="img"
      aria-label="Ayush Kaushik 3D Animated Avatar Logo"
    >
      {/* Avatar Face Container */}
      <div
        className="relative"
        style={{
          width: actualSize,
          height: actualSize,
        }}
      >
        {/* Outer Holographic Ambient Glow */}
        {showHalo && (
          <div
            className={`absolute -inset-2 rounded-full transition-all duration-700 pointer-events-none ${
              isHovered || speaking
                ? 'bg-gradient-to-tr from-[#84cc16]/30 via-[#38bdf8]/30 to-[#a855f7]/25 blur-lg opacity-100 scale-105'
                : 'bg-gradient-to-tr from-[#84cc16]/15 via-[#38bdf8]/10 to-transparent blur-md opacity-60'
            }`}
          />
        )}

        {/* 3D Rotating Container */}
        <div
          className="w-full h-full relative transition-transform ease-out duration-150 flex items-center justify-center"
          style={{
            transform: `rotateX(${headRotX}deg) rotateY(${headRotY}deg) scale(${isHovered ? 1.04 : 1})`,
            transformStyle: 'preserve-3d',
          }}
        >
          <svg
            viewBox="0 0 128 128"
            width="100%"
            height="100%"
            className="w-full h-full drop-shadow-[0_4px_16px_rgba(0,0,0,0.6)]"
          >
          <defs>
            <radialGradient id={`avatarBg-${variant}`} cx="50%" cy="30%" r="70%">
              <stop offset="0%" stopColor="#18202a" />
              <stop offset="70%" stopColor="#0c0e13" />
              <stop offset="100%" stopColor="#05070a" />
            </radialGradient>

            <linearGradient id={`skinTone-${variant}`} x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="#f7c89f" />
              <stop offset="55%" stopColor="#e3a777" />
              <stop offset="100%" stopColor="#c98a58" />
            </linearGradient>

            <linearGradient id={`hairGrad-${variant}`} x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#2a2e38" />
              <stop offset="50%" stopColor="#14171d" />
              <stop offset="100%" stopColor="#0a0c10" />
            </linearGradient>

            <linearGradient id={`jacketGrad-${variant}`} x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="#222933" />
              <stop offset="100%" stopColor="#0f1217" />
            </linearGradient>

            <linearGradient id={`glassesGrad-${variant}`} x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor={hudActive ? '#a855f7' : '#38bdf8'} stopOpacity="0.8" />
              <stop offset="50%" stopColor="#84cc16" stopOpacity="0.5" />
              <stop offset="100%" stopColor="#38bdf8" stopOpacity="0.1" />
            </linearGradient>

            <filter id={`neonGlow-${variant}`} x="-30%" y="-30%" width="160%" height="160%">
              <feGaussianBlur stdDeviation="2.5" result="blur" />
              <feMerge>
                <feMergeNode in="blur" />
                <feMergeNode in="SourceGraphic" />
              </feMerge>
            </filter>
          </defs>

          {/* Squircle Badge Background */}
          <rect
            x="4"
            y="4"
            width="120"
            height="120"
            rx="32"
            fill={`url(#avatarBg-${variant})`}
            stroke={isHovered ? '#84cc16' : '#2a3441'}
            strokeWidth="2.2"
            className="transition-colors duration-300"
          />

          {/* Holographic Synaptic Orbit Ring */}
          <circle
            cx="64"
            cy="64"
            r="58"
            fill="none"
            stroke={speaking ? '#84cc16' : '#38bdf8'}
            strokeWidth={speaking ? '2' : '1.2'}
            strokeDasharray="6,4"
            strokeOpacity={isHovered || speaking ? '0.9' : '0.4'}
            className={speaking ? 'animate-spin' : ''}
            style={{ animationDuration: '6s' }}
          />

          {/* Neck & Inner Blue Shirt */}
          <path d="M52 82 L76 82 L74 95 L54 95 Z" fill="#c98a58" />
          <path d="M48 93 Q64 100 80 93 L83 108 L45 108 Z" fill="#1e3a8a" />

          {/* Dark Tech Jacket (As seen in Ayush's photo) */}
          <path
            d="M25 124 Q36 94 49 90 L64 104 L79 90 Q92 94 103 124 Z"
            fill={`url(#jacketGrad-${variant})`}
          />
          {/* Luminous Zipper accent */}
          <path
            d="M63 97 L65 97 L65 124 L63 124 Z"
            fill="#84cc16"
            filter={`url(#neonGlow-${variant})`}
          />
          {/* Jacket Collar Lapels */}
          <path d="M45 91 L57 106 L52 118 L35 102 Z" fill="#29313d" />
          <path d="M83 91 L71 106 L76 118 L93 102 Z" fill="#29313d" />

          {/* Face Base */}
          <ellipse cx="64" cy="66" rx="23.5" ry="27.5" fill={`url(#skinTone-${variant})`} />

          {/* Ears */}
          <ellipse cx="39.5" cy="67" rx="3.5" ry="6.5" fill="#c98a58" />
          <ellipse cx="88.5" cy="67" rx="3.5" ry="6.5" fill="#c98a58" />

          {/* Short Dark Textured Hair (Styled silhouette) */}
          <path
            d="M39 63 Q37 45 47 37 Q64 32 81 37 Q91 45 89 63 Q85 47 64 44 Q43 47 39 63 Z"
            fill={`url(#hairGrad-${variant})`}
          />
          <path
            d="M38 52 C39 35, 51 29, 64 29 C77 29, 89 35, 90 52 C83 45, 75 41, 64 42 C53 41, 44 45, 38 52 Z"
            fill="#14171d"
          />
          <path
            d="M44 45 Q52 39 62 41 Q72 40 84 46 Q74 40 64 38 Q52 38 44 45 Z"
            fill="#2c3340"
          />

          {/* Eyebrows */}
          <path
            d="M45 56 Q52 52 59 55"
            stroke="#12151b"
            strokeWidth="2.2"
            strokeLinecap="round"
            fill="none"
          />
          <path
            d="M69 55 Q76 52 83 56"
            stroke="#12151b"
            strokeWidth="2.2"
            strokeLinecap="round"
            fill="none"
          />

          {/* Eyes (With blinking & cursor tracking) */}
          {!isBlinking ? (
            <g>
              {/* Sclera */}
              <ellipse cx="52.5" cy="65.5" rx="4.8" ry="3.2" fill="#ffffff" opacity="0.9" />
              <ellipse cx="75.5" cy="65.5" rx="4.8" ry="3.2" fill="#ffffff" opacity="0.9" />

              {/* Pupils with cursor tracking */}
              <circle
                cx={52.5 + pupilOffsetX}
                cy={65.5 + pupilOffsetY}
                r="2.6"
                fill="#161922"
              />
              <circle
                cx={75.5 + pupilOffsetX}
                cy={65.5 + pupilOffsetY}
                r="2.6"
                fill="#161922"
              />

              {/* Iris highlights */}
              <circle
                cx={53.3 + pupilOffsetX * 0.8}
                cy={64.7 + pupilOffsetY * 0.8}
                r="1"
                fill="#ffffff"
              />
              <circle
                cx={76.3 + pupilOffsetX * 0.8}
                cy={64.7 + pupilOffsetY * 0.8}
                r="1"
                fill="#ffffff"
              />
            </g>
          ) : (
            /* Closed eye line when blinking */
            <g stroke="#1a1c24" strokeWidth="2" strokeLinecap="round">
              <path d="M48 66 Q52 68 57 66" fill="none" />
              <path d="M71 66 Q75 68 80 66" fill="none" />
            </g>
          )}

          {/* Modern Rectangular Tech Glasses (As seen in Ayush's photo) */}
          <g>
            {/* Left Lens Frame */}
            <rect
              x="43"
              y="58"
              width="18"
              height="14"
              rx="3.5"
              fill={hudActive ? 'rgba(168,85,247,0.15)' : 'rgba(56,189,248,0.06)'}
              stroke="#1b222c"
              strokeWidth="2.2"
            />
            {/* Right Lens Frame */}
            <rect
              x="67"
              y="58"
              width="18"
              height="14"
              rx="3.5"
              fill={hudActive ? 'rgba(168,85,247,0.15)' : 'rgba(56,189,248,0.06)'}
              stroke="#1b222c"
              strokeWidth="2.2"
            />
            {/* Bridge */}
            <path
              d="M61 64 L67 64"
              stroke="#1b222c"
              strokeWidth="2.8"
              strokeLinecap="round"
            />
            {/* Temples */}
            <path d="M40 62 L43 63" stroke="#1b222c" strokeWidth="2.2" />
            <path d="M85 63 L88 62" stroke="#1b222c" strokeWidth="2.2" />

            {/* Smart Lens Holographic Reflection */}
            <polygon
              points="45,60 58,60 50,70 45,70"
              fill={`url(#glassesGrad-${variant})`}
              opacity={isHovered ? '0.95' : '0.75'}
            />
            <polygon
              points="69,60 82,60 74,70 69,70"
              fill={`url(#glassesGrad-${variant})`}
              opacity={isHovered ? '0.95' : '0.75'}
            />

            {/* Optional Cyberpunk HUD Data Overlay */}
            {hudActive && (
              <g stroke="#38bdf8" strokeWidth="0.8" opacity="0.85">
                <line x1="46" y1="64" x2="56" y2="64" strokeDasharray="1,1" />
                <line x1="72" y1="64" x2="82" y2="64" strokeDasharray="1,1" />
                <circle cx="58" cy="62" r="1.5" fill="#84cc16" />
                <circle cx="82" cy="62" r="1.5" fill="#84cc16" />
              </g>
            )}
          </g>

          {/* Nose */}
          <path
            d="M64 65 L63 73 Q64 75 66 74"
            stroke="#b37243"
            strokeWidth="1.5"
            strokeLinecap="round"
            fill="none"
          />

          {/* Natural Confident Smile (reacts on hover/speaking) */}
          <path
            d={
              speaking
                ? 'M56 79 Q64 88 72 79'
                : isHovered
                  ? 'M56 78 Q64 86 72 78'
                  : 'M57 79 Q64 84 71 79'
            }
            stroke="#91492b"
            strokeWidth="2"
            strokeLinecap="round"
            fill={speaking ? '#501e12' : 'none'}
          />
          {/* Teeth highlight */}
          <path
            d="M58 80 Q64 83 70 80"
            fill="#ffffff"
            opacity={isHovered || speaking ? '0.95' : '0.8'}
          />

          {/* Founder Tech Badge in corner */}
          <g filter={`url(#neonGlow-${variant})`}>
            <circle cx="106" cy="22" r="11" fill="#0c1117" stroke="#84cc16" strokeWidth="1.5" />
            <text
              x="106"
              y="26"
              fontFamily="monospace"
              fontSize="9.5"
              fontWeight="900"
              fill="#84cc16"
              textAnchor="middle"
            >
              AK
            </text>
          </g>

          {/* Speaking Audio Wave Animation */}
          {speaking && (
            <g stroke="#84cc16" strokeWidth="1.5" strokeLinecap="round" className="animate-pulse">
              <line x1="20" y1="64" x2="20" y2="70" />
              <line x1="24" y1="60" x2="24" y2="74" />
              <line x1="28" y1="62" x2="28" y2="72" />
            </g>
          )}
        </svg>

        {/* Live Status indicator dot */}
        <span
          className={`absolute bottom-0 right-0 rounded-full border-2 border-[#0B0D10] ${
            actualSize >= 64 ? 'w-4 h-4' : 'w-2.5 h-2.5'
          } ${speaking ? 'bg-[#38bdf8] animate-ping' : 'bg-[#84cc16]'}`}
          title="Ayush Kaushik Online / Live Node"
        />
        </div>
      </div>

      {/* Optional Voice / HUD Interactive Controls */}
      {showControls && (
        <div className="mt-3 flex items-center justify-between w-full text-[10px] font-mono">
          <button
            type="button"
            onClick={handleVoiceIntro}
            className="flex items-center space-x-1 px-2.5 py-1 rounded bg-[#84cc16]/10 border border-[#84cc16]/30 text-[#84cc16] hover:bg-[#84cc16]/20 transition-colors"
          >
            <Volume2 size={12} className={speaking ? 'animate-bounce' : ''} />
            <span>{speaking ? 'GREETING...' : 'VOICE INTRO'}</span>
          </button>

          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              setHudActive(!hudActive);
              sound.playClick();
            }}
            className={`flex items-center space-x-1 px-2.5 py-1 rounded border transition-colors ${
              hudActive
                ? 'bg-[#38bdf8]/20 border-[#38bdf8] text-[#38bdf8]'
                : 'bg-white/5 border-white/10 text-white/60 hover:text-white'
            }`}
          >
            <Eye size={12} />
            <span>HUD {hudActive ? 'ON' : 'OFF'}</span>
          </button>
        </div>
      )}
    </div>
  );
};
