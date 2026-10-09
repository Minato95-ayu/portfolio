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

const sanitizeContactField = (value: string, maxLength: number): string =>
  value.replace(/[\r\n\u0000-\u001F\u007F]+/g, ' ').replace(/\s+/g, ' ').trim().slice(0, maxLength);

const isValidEmail = (value: string): boolean => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);

export const ConnectSection: React.FC = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    interest: 'Brain-Inspired AI Architecture',
    message: '',
  });

  const [status, setStatus] = useState<'idle' | 'sending' | 'success' | 'error'>('idle');
  const [feedbackMsg, setFeedbackMsg] = useState<string>('');

  const name = sanitizeContactField(formData.name, 80);
  const email = sanitizeContactField(formData.email, 254).toLowerCase();
  const interest = sanitizeContactField(formData.interest, 120);
  const message = sanitizeContactField(formData.message, 2000);

  const mailtoLink = `mailto:${PROFILE_DATA.links.email}?subject=${encodeURIComponent(
    `[AAYU Inquiry] ${interest}`
  )}&body=${encodeURIComponent(
    `Name: ${name}\nEmail: ${email}\nFocus: ${interest}\n\n${message}`
  )}`;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    sound.playClick();
    setStatus('sending');
    setFeedbackMsg('');

    const safeName = sanitizeContactField(formData.name, 80);
    const safeEmail = sanitizeContactField(formData.email, 254).toLowerCase();
    const safeInterest = sanitizeContactField(formData.interest, 120);
    const safeMessage = sanitizeContactField(formData.message, 2000);

    if (!safeName || !safeEmail || !safeMessage || !isValidEmail(safeEmail)) {
      setStatus('error');
      setFeedbackMsg('Please fill in your name, a valid email, and a message before sending.');
      return;
    }

    const submission = {
      name: safeName,
      email: safeEmail,
      interest: safeInterest,
      message: safeMessage,
      _subject: `[Portfolio Inquiry] ${safeInterest}`,
      _template: 'table',
    };

    try {
      const response = await fetch(
        `https://formsubmit.co/ajax/${encodeURIComponent(PROFILE_DATA.links.email)}`,
        {
          method: 'POST',
          headers: {
            Accept: 'application/json',
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(submission),
        }
      );
      const result: { success?: boolean | string; message?: string } = await response.json();

      if (response.ok && (result.success === true || result.success === 'true')) {
        setStatus('success');
        setFeedbackMsg(
          'FormSubmit accepted the submission; this is not confirmation of inbox delivery. For first use, confirm the activation email sent to the recipient inbox, then check Spam if needed.'
        );
        setFormData({
          name: '',
          email: '',
          interest: 'Brain-Inspired AI Architecture',
          message: '',
        });
        return;
      }

      setStatus('error');
      setFeedbackMsg(
        result.message ||
          'The email relay did not accept this message. Use the direct email option below.'
      );
    } catch {
      setStatus('error');
      setFeedbackMsg('The email relay could not be reached. Use the direct email option below.');
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
              <span className="text-xs font-mono text-[#84cc16]">FREE EMAIL RELAY / NO API KEY</span>
              <span className="text-[10px] font-mono text-white/40">FIRST-USE ACTIVATION REQUIRED</span>
            </div>
            <p className="text-[11px] font-mono leading-relaxed text-white/45">
              Messages pass through FormSubmit before reaching the inbox. On first use, check the recipient inbox and confirm the activation email. Do not send sensitive information.
            </p>

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
                  onChange={(e) => setFormData({ ...formData, name: sanitizeContactField(e.target.value, 80) })}
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
                  onChange={(e) => setFormData({ ...formData, email: sanitizeContactField(e.target.value, 254) })}
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
                onChange={(e) => setFormData({ ...formData, message: sanitizeContactField(e.target.value, 2000) })}
                className="w-full bg-[#131922] border border-white/10 rounded px-3 py-2 text-sm text-white placeholder-white/20 focus:border-[#84cc16] focus:outline-none font-mono"
              />
            </div>

            {/* Status Feedback */}
            {status === 'success' && (
              <div className="p-3 bg-[#84cc16]/10 border border-[#84cc16] text-[#84cc16] text-xs font-mono rounded" aria-live="polite">
                ✓ {feedbackMsg}
              </div>
            )}
            {status === 'error' && (
              <div className="p-3 bg-red-500/10 border border-red-500 text-red-400 text-xs font-mono rounded" aria-live="polite">
                ⚠ {feedbackMsg}{' '}
                <a href={mailtoLink} className="underline underline-offset-2">
                  OPEN EMAIL APP →
                </a>
              </div>
            )}
            <div className="flex items-center justify-between pt-2">
              <div className="text-[11px] font-mono text-white/40">
                RECIPIENT: {PROFILE_DATA.links.email} ·{' '}
                <a href={mailtoLink} className="text-[#84cc16] hover:underline">
                  DIRECT EMAIL
                </a>
              </div>

              <button
                type="submit"
                disabled={status === 'sending'}
                className="px-6 py-2.5 bg-[#C6FF3D] hover:bg-[#d6ff66] text-[#0B0D10] font-mono text-xs font-bold rounded transition-all disabled:opacity-50 cursor-pointer shadow-[0_0_15px_rgba(198,255,61,0.3)]"
              >
                {status === 'sending' ? 'SENDING...' : 'DISPATCH MESSAGE →'}
              </button>
            </div>
          </form>
        </div>
      </div>

    </section>
  );
};
