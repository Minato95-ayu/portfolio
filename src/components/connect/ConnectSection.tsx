import React, { useState } from 'react';
import { PROFILE_DATA } from '../../data/projectsData.ts';
import {
  IconEmail,
  IconLinkedIn,
  IconGitHub,
  IconWebsite,
  IconX,
  IconInstagram,
  IconYouTube,
} from '../ui/Icons.tsx';
import { sound } from '../../utils/audio.ts';
import { AyushAvatarLogo } from '../ui/AyushAvatarLogo.tsx';

export const ConnectSection: React.FC = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    interest: 'Brain-Inspired AI Architecture',
    message: '',
    _gotcha: '',
  });

  const [status, setStatus] = useState<'idle' | 'sending' | 'success' | 'error'>('idle');
  const [feedbackMsg, setFeedbackMsg] = useState<string>('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    sound.playClick();
    setStatus('sending');
    setFeedbackMsg('');

    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      const data = await res.json();

      if (res.ok && data.success) {
        setStatus('success');
        setFeedbackMsg(data.message || 'Transmission received. Direct backup: ayushkaushik1441@gmail.com');
        setFormData({
          name: '',
          email: '',
          interest: 'Brain-Inspired AI Architecture',
          message: '',
          _gotcha: '',
        });
      } else {
        setStatus('error');
        setFeedbackMsg(
          data.error ||
            'Transmission failed. You can reach out directly via ayushkaushik1441@gmail.com'
        );
      }
    } catch {
      // Fallback if network or offline
      setStatus('error');
      setFeedbackMsg(
        'Backend console unreachable. Redirecting your message to direct client mailto...'
      );
      // Trigger native mailto fallback safely
      const mailtoLink = `mailto:${PROFILE_DATA.links.email}?subject=${encodeURIComponent(
        `[AAYU Inquiry] ${formData.interest}`
      )}&body=${encodeURIComponent(
        `Name: ${formData.name}\nEmail: ${formData.email}\nFocus: ${formData.interest}\n\n${formData.message}`
      )}`;
      window.location.href = mailtoLink;
    }
  };

  return (
    <section
      id="connect"
      className="relative min-h-screen py-24 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto z-10"
      aria-label="Connect and Contact Section"
    >
      <div className="space-y-4 mb-16 border-b border-white/[0.08] pb-8">
        <div className="flex flex-wrap items-center gap-2 sm:gap-3 text-xs font-mono text-[#84cc16]">
          <span className="w-2 h-2 rounded-sm bg-[#84cc16] shrink-0" />
          <span>RESEARCH ROOM / 006</span>
          <span className="text-white/20">|</span>
          <span className="text-white/40">DIRECT TRANSMISSION & INQUIRY</span>
        </div>

        <h2 className="text-3xl sm:text-5xl font-bold tracking-tight text-white">
          Let’s talk systems,{' '}
          <span className="text-[#84cc16] text-glow-lime">research, or builds.</span>
        </h2>

        <p className="text-base text-white/70 max-w-3xl leading-relaxed">
          Open to technical discourse on deep-learning compilers, brain-inspired models, adversarial security, and collaborative engineering.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
        {/* Left Verified Coordinates (5 cols) */}
        <div className="lg:col-span-5 space-y-6">
          <div className="bg-[#0c1017]/95 border border-white/10 p-6 rounded-sm space-y-4">
            <div className="text-xs font-mono text-white/40 uppercase tracking-wider pb-2 border-b border-white/10 flex items-center justify-between">
              <span>VERIFIED DIRECT COORDINATES</span>
              <span className="text-[#84cc16]">ONLINE</span>
            </div>

            {/* Email */}
            <div className="space-y-1">
              <div className="text-[10px] font-mono text-white/40">PRIMARY EMAIL</div>
              <a
                href={`mailto:${PROFILE_DATA.links.email}`}
                onClick={() => sound.playClick()}
                className="text-sm font-mono text-[#84cc16] hover:underline flex items-center space-x-2"
              >
                <IconEmail size={16} />
                <span>{PROFILE_DATA.links.email}</span>
              </a>
            </div>

            {/* Organization */}
            <div className="space-y-1 pt-3 border-t border-white/5">
              <div className="text-[10px] font-mono text-white/40">COMPANY / FOUNDER ENTITY</div>
              <a
                href={PROFILE_DATA.links.website}
                target="_blank"
                rel="noopener noreferrer"
                onClick={() => sound.playClick()}
                className="text-sm font-mono text-[#38bdf8] hover:underline flex items-center space-x-2"
              >
                <IconWebsite size={16} />
                <span>{PROFILE_DATA.links.website} (adumate)</span>
              </a>
            </div>

            {/* Physical Anchor */}
            <div className="space-y-1 pt-3 border-t border-white/5">
              <div className="text-[10px] font-mono text-white/40">LOCATION & BACKGROUND</div>
              <p className="text-xs font-mono text-white/80">
                {PROFILE_DATA.location} · {PROFILE_DATA.education}
              </p>
            </div>
          </div>

          {/* Social Channels Network */}
          <div className="bg-[#0c1017]/95 border border-white/10 p-6 rounded-sm space-y-3">
            <div className="text-xs font-mono text-white/40 uppercase tracking-wider mb-2">
              PUBLIC CHANNELS & PROFILES
            </div>

            <div className="grid grid-cols-2 gap-2 text-xs font-mono">
              <a
                href={PROFILE_DATA.links.github}
                target="_blank"
                rel="noopener noreferrer"
                onClick={() => sound.playClick()}
                className="p-2.5 rounded bg-white/[0.02] border border-white/5 hover:border-white/20 text-white/80 hover:text-white flex items-center space-x-2 transition-colors"
              >
                <IconGitHub size={16} />
                <span>GitHub</span>
              </a>

              <a
                href={PROFILE_DATA.links.linkedin}
                target="_blank"
                rel="noopener noreferrer"
                onClick={() => sound.playClick()}
                className="p-2.5 rounded bg-white/[0.02] border border-white/5 hover:border-[#38bdf8] text-white/80 hover:text-[#38bdf8] flex items-center space-x-2 transition-colors"
              >
                <IconLinkedIn size={16} />
                <span>LinkedIn</span>
              </a>

              <a
                href={PROFILE_DATA.links.x}
                target="_blank"
                rel="noopener noreferrer"
                onClick={() => sound.playClick()}
                className="p-2.5 rounded bg-white/[0.02] border border-white/5 hover:border-white/20 text-white/80 hover:text-white flex items-center space-x-2 transition-colors"
              >
                <IconX size={16} />
                <span>X / Twitter</span>
              </a>

              <a
                href={PROFILE_DATA.links.youtube}
                target="_blank"
                rel="noopener noreferrer"
                onClick={() => sound.playClick()}
                className="p-2.5 rounded bg-white/[0.02] border border-white/5 hover:border-red-400 text-white/80 hover:text-red-400 flex items-center space-x-2 transition-colors"
              >
                <IconYouTube size={16} />
                <span>YouTube</span>
              </a>

              <a
                href={PROFILE_DATA.links.instagram}
                target="_blank"
                rel="noopener noreferrer"
                onClick={() => sound.playClick()}
                className="p-2.5 rounded bg-white/[0.02] border border-white/5 hover:border-pink-400 text-white/80 hover:text-pink-400 flex items-center space-x-2 transition-colors col-span-2"
              >
                <IconInstagram size={16} />
                <span>Instagram (@o_aa.yu_s)</span>
              </a>
            </div>
          </div>
        </div>

        {/* Right Interactive Contact Console (7 cols) */}
        <div className="lg:col-span-7">
          <form
            onSubmit={handleSubmit}
            className="bg-[#0c1017]/95 border border-white/10 p-6 sm:p-8 rounded-sm space-y-6"
          >
            <div className="flex items-center justify-between pb-3 border-b border-white/10">
              <span className="text-xs font-mono text-[#84cc16]">TRANSMISSION PROTOCOL / REST API</span>
              <span className="text-[10px] font-mono text-white/40">ZOD VALIDATED</span>
            </div>

            {/* Honeypot field for bot protection */}
            <input
              type="text"
              name="_gotcha"
              tabIndex={-1}
              autoComplete="off"
              value={formData._gotcha}
              onChange={(e) => setFormData({ ...formData, _gotcha: e.target.value })}
              className="hidden"
            />

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="text-xs font-mono text-white/70">
                  YOUR NAME <span className="text-[#84cc16]">*</span>
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Elena Rostova"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full bg-[#131922] border border-white/10 rounded px-3 py-2 text-sm text-white placeholder-white/20 focus:border-[#84cc16] focus:outline-none font-mono"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-mono text-white/70">
                  YOUR EMAIL <span className="text-[#84cc16]">*</span>
                </label>
                <input
                  type="email"
                  required
                  placeholder="e.g. researcher@lab.org"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className="w-full bg-[#131922] border border-white/10 rounded px-3 py-2 text-sm text-white placeholder-white/20 focus:border-[#84cc16] focus:outline-none font-mono"
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-mono text-white/70">
                FIELD OF INTEREST / TOPIC
              </label>
              <select
                value={formData.interest}
                onChange={(e) => setFormData({ ...formData, interest: e.target.value })}
                className="w-full bg-[#131922] border border-white/10 rounded px-3 py-2 text-sm text-white focus:border-[#84cc16] focus:outline-none font-mono"
              >
                <option value="Brain-Inspired AI Architecture">Brain-Inspired AI Architecture</option>
                <option value="Compiler Optimization & Polyhedral Loops">Compiler Optimization & Polyhedral Loops</option>
                <option value="Adversarial AI Security & Guardrails">Adversarial AI Security & Guardrails</option>
                <option value="Web3 & Solidity Invariant Verification">Web3 & Solidity Invariant Verification</option>
                <option value="Adumate Founder Products">Adumate Founder Products</option>
                <option value="General Systems Architecture Inquiry">General Systems Architecture Inquiry</option>
              </select>
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-mono text-white/70">
                MESSAGE / SYSTEM INQUIRY <span className="text-[#84cc16]">*</span>
              </label>
              <textarea
                required
                rows={5}
                placeholder="Share your research question, project scope, or technical topic..."
                value={formData.message}
                onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                className="w-full bg-[#131922] border border-white/10 rounded px-3 py-2 text-sm text-white placeholder-white/20 focus:border-[#84cc16] focus:outline-none font-mono"
              />
            </div>

            {/* Status Feedback */}
            {status === 'success' && (
              <div className="p-3 bg-[#84cc16]/10 border border-[#84cc16] text-[#84cc16] text-xs font-mono rounded">
                ✓ {feedbackMsg}
              </div>
            )}
            {status === 'error' && (
              <div className="p-3 bg-red-500/10 border border-red-500 text-red-400 text-xs font-mono rounded">
                ⚠ {feedbackMsg}
              </div>
            )}

            <div className="flex items-center justify-between pt-2">
              <div className="text-[11px] font-mono text-white/40">
                DIRECT BACKUP: {PROFILE_DATA.links.email}
              </div>

              <button
                type="submit"
                disabled={status === 'sending'}
                className="px-6 py-2.5 bg-[#C6FF3D] hover:bg-[#d6ff66] text-[#0B0D10] font-mono text-xs font-bold rounded transition-all disabled:opacity-50 cursor-pointer shadow-[0_0_15px_rgba(198,255,61,0.3)]"
              >
                {status === 'sending' ? 'DISPATCHING...' : 'DISPATCH MESSAGE →'}
              </button>
            </div>
          </form>
        </div>
      </div>

      {/* Footer with 3D Face Avatar */}
      <footer className="mt-24 pt-8 border-t border-white/[0.08] flex flex-col md:flex-row items-center justify-between text-xs font-mono text-white/50 gap-6">
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

        <div className="flex items-center space-x-4 text-[11px]">
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
      </footer>
    </section>
  );
};
