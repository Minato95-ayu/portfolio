import React, { useMemo, useState } from 'react';
import { CHAT_PROVIDERS } from '../../data/chatProviders.ts';
import { sound } from '../../utils/audio.ts';

interface LLMProviderShowcaseProps {
  onOpenChat: () => void;
}

type ProviderFilter = 'ALL' | 'DIRECT' | 'ROUTER';

const filterLabels: Record<ProviderFilter, string> = {
  ALL: 'ALL PROVIDERS',
  DIRECT: 'DIRECT APIs',
  ROUTER: 'MODEL ROUTERS',
};

export const LLMProviderShowcase: React.FC<LLMProviderShowcaseProps> = ({ onOpenChat }) => {
  const [activeFilter, setActiveFilter] = useState<ProviderFilter>('ALL');
  const providers = useMemo(
    () => CHAT_PROVIDERS.filter((provider) => activeFilter === 'ALL' || provider.type === activeFilter),
    [activeFilter],
  );

  return (
    <section
      id="ai-providers"
      className="relative mx-auto max-w-7xl px-4 py-16 sm:px-6 sm:py-20 lg:px-8"
      aria-labelledby="ai-providers-heading"
    >
      <div className="overflow-hidden rounded-[2rem] border border-[#52D7F2]/15 bg-[#080E17]/95 shadow-[0_28px_90px_rgba(0,0,0,0.28)]">
        <div className="relative border-b border-white/[0.08] px-5 py-7 sm:px-8 sm:py-9">
          <div className="pointer-events-none absolute -right-16 -top-28 h-64 w-64 rounded-full bg-[#52D7F2]/[0.08] blur-3xl" />
          <div className="relative flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
            <div className="max-w-3xl">
              <div className="mb-3 flex flex-wrap items-center gap-2 font-mono text-[10px] tracking-[0.18em] text-[#52D7F2] sm:text-xs">
                <span className="h-2 w-2 rounded-full bg-[#52D7F2] shadow-[0_0_12px_#52D7F2]" />
                AAYU · PROVIDER ROUTING LAB
                <span className="text-white/25">/</span>
                {CHAT_PROVIDERS.length} CONFIGURED ENDPOINTS
              </div>
              <h2
                id="ai-providers-heading"
                className="text-3xl font-bold tracking-tight text-white sm:text-5xl"
              >
                One assistant.
                <span className="block text-[#52D7F2]">Multiple inference paths.</span>
              </h2>
              <p className="mt-4 max-w-2xl text-sm leading-relaxed text-white/60 sm:text-base">
                AAYU routes chat requests through providers configured on the server. If a provider
                cannot respond, the router tries the next available path—without exposing API keys
                to the browser.
              </p>
            </div>

            <button
              type="button"
              onClick={() => {
                sound.playClick();
                onOpenChat();
              }}
              className="inline-flex shrink-0 items-center justify-center gap-2 rounded-xl border border-[#C6FF3D]/40 bg-[#C6FF3D]/[0.08] px-4 py-3 font-mono text-xs font-semibold text-[#C6FF3D] transition-colors hover:bg-[#C6FF3D]/[0.15]"
            >
              TRY AAYU ASSISTANT <span aria-hidden="true">↗</span>
            </button>
          </div>
        </div>

        <div className="grid gap-6 p-5 sm:p-8 lg:grid-cols-[0.8fr_1.2fr]">
          <div className="flex flex-col justify-between gap-6">
            <div>
              <div className="mb-3 font-mono text-[10px] tracking-wider text-white/40">
                REQUEST PATH
              </div>
              <ol className="space-y-2">
                {[
                  ['01', 'AAYU chat request'],
                  ['02', 'Server-side provider router'],
                  ['03', 'Configured model + fallback'],
                ].map(([number, label], index) => (
                  <li key={number} className="flex items-center gap-3">
                    <span className="grid h-8 w-8 shrink-0 place-items-center rounded-lg border border-[#52D7F2]/20 bg-[#52D7F2]/[0.05] font-mono text-[10px] text-[#52D7F2]">
                      {number}
                    </span>
                    <span className="text-sm text-white/75">{label}</span>
                    {index < 2 && (
                      <span className="ml-auto pr-2 font-mono text-xs text-white/25" aria-hidden="true">
                        ↓
                      </span>
                    )}
                  </li>
                ))}
              </ol>
            </div>
            <p className="rounded-xl border border-white/[0.07] bg-white/[0.025] p-3 text-[11px] leading-relaxed text-white/45">
              Provider availability, pricing, and rate limits can change. Check each provider’s
              current terms; this showcase does not promise a permanent free tier.
            </p>
          </div>

          <div>
            <div className="mb-4 flex flex-wrap items-center gap-2">
              {(Object.keys(filterLabels) as ProviderFilter[]).map((filter) => {
                const isActive = activeFilter === filter;
                return (
                  <button
                    key={filter}
                    type="button"
                    aria-pressed={isActive}
                    onClick={() => {
                      sound.playClick();
                      setActiveFilter(filter);
                    }}
                    className={`rounded-lg border px-3 py-2 font-mono text-[9px] transition-colors sm:text-[10px] ${
                      isActive
                        ? 'border-[#52D7F2]/40 bg-[#52D7F2]/[0.08] text-[#52D7F2]'
                        : 'border-white/[0.08] text-white/45 hover:border-white/20 hover:text-white/75'
                    }`}
                  >
                    {filterLabels[filter]}
                  </button>
                );
              })}
            </div>

            <div className="grid gap-3 sm:grid-cols-2">
              {providers.map((provider, index) => (
                <article
                  key={provider.id}
                  className="group relative overflow-hidden rounded-2xl border border-white/[0.08] bg-[#0D1520] p-4 transition-all hover:-translate-y-0.5 hover:border-[#52D7F2]/30"
                >
                  <div className="mb-5 flex items-start justify-between gap-3">
                    <div className="flex items-center gap-3">
                      <span className="grid h-10 w-10 place-items-center rounded-xl border border-[#52D7F2]/15 bg-[#52D7F2]/[0.06] font-mono text-xs font-bold text-[#52D7F2]">
                        {provider.name.slice(0, 2).toUpperCase()}
                      </span>
                      <div>
                        <h3 className="font-semibold text-white">{provider.name}</h3>
                        <p className="mt-0.5 font-mono text-[9px] text-white/40">{provider.role}</p>
                      </div>
                    </div>
                    <span className="rounded-full border border-white/[0.08] px-2 py-1 font-mono text-[8px] tracking-wider text-white/45">
                      {provider.type}
                    </span>
                  </div>

                  <p className="min-h-10 text-xs leading-relaxed text-white/55">{provider.summary}</p>

                  <div className="mt-4 rounded-lg border border-white/[0.06] bg-black/20 px-3 py-2">
                    <div className="mb-1 font-mono text-[8px] tracking-wider text-white/35">
                      CONFIGURED MODEL
                    </div>
                    <code className="block break-all font-mono text-[10px] text-[#C6FF3D]/85">
                      {provider.model}
                    </code>
                  </div>

                  <div className="mt-4 flex items-center justify-between gap-2">
                    <span className="font-mono text-[9px] text-white/30">
                      ROUTE {String(index + 1).padStart(2, '0')}
                    </span>
                    <a
                      href={provider.docsUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="font-mono text-[9px] text-[#52D7F2] transition-colors hover:text-white"
                    >
                      OFFICIAL DOCS ↗
                    </a>
                  </div>
                </article>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
