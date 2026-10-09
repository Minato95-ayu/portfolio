import React from 'react';
import { AyushAvatarLogo } from '../ui/AyushAvatarLogo.tsx';

export const SiteFooter: React.FC = () => (
  <footer className="relative z-10 mt-16 px-4 sm:px-6 lg:px-8 pb-8 max-w-7xl mx-auto">
    <div className="pt-8 border-t border-white/[0.08] flex flex-col md:flex-row items-center justify-between text-xs font-mono text-white/50 gap-6">
      <div className="flex items-center space-x-3.5">
        <AyushAvatarLogo variant="icon" size={36} interactive={true} />
        <div>
          <div className="text-white font-bold tracking-wider">
            AYUSH KAUSHIK · FOUNDER @ ADUMATE
          </div>
          <div className="text-[11px] text-white/40">
            © {new Date().getFullYear()} · Intelligence closer to the metal
          </div>
        </div>
      </div>

      <div className="flex flex-wrap items-center justify-center gap-x-4 gap-y-2 text-[11px]">
        <span className="text-[#84cc16]">NODE: DELHI, IN</span>
        <span>·</span>
        <span>BRABU / NIELIT DELHI</span>
        <span>·</span>
        <a
          href="https://adumate.in"
          target="_blank"
          rel="noopener noreferrer"
          className="text-[#4CC9F0] hover:underline"
        >
          adumate.in ↗
        </a>
      </div>
    </div>
  </footer>
);
