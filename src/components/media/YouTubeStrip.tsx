import React from 'react';
import { PROFILE_DATA } from '../../data/projectsData.ts';
import { IconYouTube } from '../ui/Icons.tsx';
import { sound } from '../../utils/audio.ts';

export const YouTubeStrip: React.FC = () => {
  return (
    <div className="my-16 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="bg-[#10141A]/95 border border-[#FF4D4D]/30 p-6 sm:p-8 rounded-sm shadow-xl flex flex-col md:flex-row md:items-center justify-between gap-6 relative overflow-hidden">
        {/* Corner technical accents */}
        <div className="absolute top-0 right-0 w-3 h-3 border-t border-r border-[#FF4D4D]" />
        <div className="absolute bottom-0 left-0 w-3 h-3 border-b border-l border-[#FF4D4D]" />

        <div className="flex items-start sm:items-center space-x-3 sm:space-x-4 min-w-0 flex-1">
          <div className="p-3 sm:p-3.5 bg-[#FF4D4D]/10 border border-[#FF4D4D]/30 rounded text-[#FF4D4D] shrink-0">
            <IconYouTube size={26} />
          </div>

          <div className="space-y-1 min-w-0 flex-1">
            <div className="flex flex-wrap items-center gap-2">
              <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-[#FF4D4D]/10 text-[#FF4D4D] border border-[#FF4D4D]/30 font-bold shrink-0">
                YOUTUBE RESEARCH CHANNEL
              </span>
              <span className="text-[11px] font-mono text-white/40 truncate">
                HOSTED BY AYUSH KAUSHIK
              </span>
            </div>

            <h3 className="text-base sm:text-xl font-bold text-white tracking-wide truncate">
              {PROFILE_DATA.youtube.channelName}
            </h3>

            <p className="text-xs text-white/70 max-w-2xl font-mono leading-relaxed">
              {PROFILE_DATA.youtube.description}
            </p>
          </div>
        </div>

        <div className="shrink-0 flex items-center space-x-3">
          <a
            href={PROFILE_DATA.youtube.url}
            target="_blank"
            rel="noopener noreferrer"
            onClick={() => sound.playClick()}
            className="px-5 py-2.5 bg-[#FF4D4D] hover:bg-[#ff6666] text-white text-xs font-mono font-bold tracking-wider rounded-sm transition-all shadow-[0_0_20px_rgba(255,77,77,0.35)] flex items-center space-x-2 cursor-pointer"
          >
            <span>WATCH EPISODES</span>
            <span>↗</span>
          </a>
        </div>
      </div>
    </div>
  );
};
