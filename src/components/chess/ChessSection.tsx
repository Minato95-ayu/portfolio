import React from 'react';
import { NeuralChess } from './NeuralChess.tsx';

export const ChessSection: React.FC = () => {
  return (
    <section
      id="chess"
      className="relative min-h-screen py-24 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto z-10"
      aria-label="Neural Chess Section"
    >
      <div className="space-y-4 mb-12 border-b border-white/[0.08] pb-8">
        <div className="flex flex-wrap items-center gap-2 sm:gap-3 text-xs font-mono text-[#C6FF3D]">
          <span className="w-2 h-2 rounded-sm bg-[#C6FF3D] shrink-0" />
          <span>RESEARCH ROOM / 006 · INTERACTIVE MINIGAME</span>
          <span className="text-white/20">|</span>
          <span className="text-white/40">NEURAL CHESS & ALPHA-BETA SEARCH</span>
        </div>

        <h2 className="text-3xl sm:text-5xl font-bold tracking-tight text-[#EDEFF2]">
          Challenge the{' '}
          <span className="text-[#C6FF3D] text-glow-lime">AAYU Neural Bot.</span>
        </h2>

        <p className="text-base text-white/70 max-w-3xl leading-relaxed">
          Play legal chess against an iterative alpha-beta bot that reuses searched positions, calculates likely replies, and explains its last move.
        </p>
      </div>

      {/* Embed Neural Chess Game */}
      <NeuralChess />
    </section>
  );
};
