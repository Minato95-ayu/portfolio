import React, { useState } from 'react';
import { AWESOME_FREE_LLM_PROVIDERS, FreeLLMProvider } from '../../data/freeLlmApis.ts';
import { sound } from '../../utils/audio.ts';

interface FreeLlmApisSectionProps {
  onTestProvider?: (provider: FreeLLMProvider) => void;
}

export const FreeLlmApisSection: React.FC<FreeLlmApisSectionProps> = ({ onTestProvider }) => {
  const [selectedProvider, setSelectedProvider] = useState<FreeLLMProvider>(AWESOME_FREE_LLM_PROVIDERS[0]);
  const [activeTab, setActiveTab] = useState<'catalog' | 'code' | 'architecture'>('catalog');
  const [copiedKey, setCopiedKey] = useState<string | null>(null);

  const copyToClipboard = (text: string, id: string) => {
    sound.playClick();
    navigator.clipboard?.writeText(text);
    setCopiedKey(id);
    setTimeout(() => setCopiedKey(null), 2000);
  };

  const providerCode = `import OpenAI from 'openai';

// Run on your server. Never expose provider keys in browser code.
const client = new OpenAI({
  baseURL: '${selectedProvider.baseURL}',
  apiKey: process.env.${selectedProvider.envKeyName},
});

const response = await client.chat.completions.create({
  model: '${selectedProvider.recommendedModel}',
  messages: [{ role: 'user', content: 'Explain AAYU systems architecture' }],
});`;

  return (
    <section
      id="free-llms"
      className="relative min-h-[700px] py-24 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto z-10"
      aria-label="Awesome Free LLM APIs Integration"
    >
      {/* Section Header */}
      <div className="space-y-4 mb-14 border-b border-white/[0.08] pb-8">
        <div className="flex flex-wrap items-center gap-3 text-xs font-mono text-[#C6FF3D]">
          <span className="w-2 h-2 rounded-sm bg-[#C6FF3D] animate-pulse" />
          <span>ADUMATE ROUTER ARCHITECTURE / 002</span>
          <span className="text-white/20">|</span>
          <span className="text-[#4CC9F0]">AWESOME-FREE-LLM-APIS INTEGRATION</span>
          <span className="text-white/20">|</span>
          <a
            href="https://github.com/mnfst/awesome-free-llm-apis"
            target="_blank"
            rel="noopener noreferrer"
            onClick={() => sound.playClick()}
            className="text-white/50 hover:text-[#C6FF3D] underline underline-offset-4 flex items-center gap-1 transition-colors"
          >
            <span>mnfst/awesome-free-llm-apis</span>
            <span>↗</span>
          </a>
        </div>

        <h2 className="text-3xl sm:text-5xl font-bold tracking-tight text-[#EDEFF2]">
          Free-Tier LLM Inference.{' '}
          <span className="text-[#C6FF3D] text-glow-lime">Automated Failover Mesh.</span>
        </h2>

        <p className="text-base text-white/70 max-w-3xl leading-relaxed">
          Provider catalog informed by <span className="text-[#4CC9F0] font-mono font-medium">mnfst/awesome-free-llm-apis</span>.
          Free-tier access still requires you to create an account and keep that provider's API key on the server. Free quotas have limits and can change; failover can try another configured provider but cannot guarantee zero throttling.
        </p>

        {/* Action Controls */}
        <div className="flex flex-wrap items-center gap-2 pt-2">
          <button
            type="button"
            onClick={() => {
              sound.playClick();
              setActiveTab('catalog');
            }}
            className={`px-3.5 py-1.5 rounded-xs text-xs font-mono border transition-all cursor-pointer ${
              activeTab === 'catalog'
                ? 'bg-[#C6FF3D]/10 text-[#C6FF3D] border-[#C6FF3D]'
                : 'bg-white/[0.02] text-white/60 border-white/10 hover:text-white'
            }`}
          >
            FREE PROVIDERS MATRIX ({AWESOME_FREE_LLM_PROVIDERS.length})
          </button>
          <button
            type="button"
            onClick={() => {
              sound.playClick();
              setActiveTab('code');
            }}
            className={`px-3.5 py-1.5 rounded-xs text-xs font-mono border transition-all cursor-pointer ${
              activeTab === 'code'
                ? 'bg-[#4CC9F0]/10 text-[#4CC9F0] border-[#4CC9F0]'
                : 'bg-white/[0.02] text-white/60 border-white/10 hover:text-white'
            }`}
          >
            ADUMATE MULTI-FAILOVER CODE
          </button>
          <button
            type="button"
            onClick={() => {
              sound.playClick();
              setActiveTab('architecture');
            }}
            className={`px-3.5 py-1.5 rounded-xs text-xs font-mono border transition-all cursor-pointer ${
              activeTab === 'architecture'
                ? 'bg-[#8B5CF6]/10 text-[#8B5CF6] border-[#8B5CF6]'
                : 'bg-white/[0.02] text-white/60 border-white/10 hover:text-white'
            }`}
          >
            ROTATION TOPOLOGY
          </button>
        </div>
      </div>

      {activeTab === 'catalog' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Provider Selection Column */}
          <div className="lg:col-span-5 space-y-3">
            <div className="text-[11px] font-mono text-white/40 uppercase tracking-widest px-1">
              SELECT FREE PROVIDER ENDPOINT
            </div>
            <p className="px-1 text-[11px] font-mono text-amber-200/80">
              Free tier does not mean keyless: add your own provider key as a server-side environment variable. Keys are never shown in this catalog.
            </p>
            <div className="space-y-2.5 max-h-[580px] overflow-y-auto pr-1">
              {AWESOME_FREE_LLM_PROVIDERS.map((provider) => {
                const isSelected = selectedProvider.id === provider.id;
                return (
                  <div
                    key={provider.id}
                    onClick={() => {
                      sound.playClick();
                      setSelectedProvider(provider);
                    }}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter' || e.key === ' ') {
                        sound.playClick();
                        setSelectedProvider(provider);
                      }
                    }}
                    role="button"
                    tabIndex={0}
                    className={`p-4 rounded-sm border transition-all cursor-pointer text-left ${
                      isSelected
                        ? 'bg-[#151B24] border-[#C6FF3D] shadow-[0_0_20px_rgba(198,255,61,0.12)]'
                        : 'bg-[#10141A]/70 border-white/10 hover:border-white/30 hover:bg-[#131820]'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <div className="font-bold text-sm text-white group-hover:text-[#C6FF3D]">
                        {provider.name}
                      </div>
                      <span
                        className={`text-[10px] font-mono px-2 py-0.5 rounded-xs uppercase ${
                          provider.speedRating === 'Ultra-Fast'
                            ? 'bg-[#C6FF3D]/10 text-[#C6FF3D] border border-[#C6FF3D]/30'
                            : 'bg-[#4CC9F0]/10 text-[#4CC9F0] border border-[#4CC9F0]/30'
                        }`}
                      >
                        {provider.speedRating}
                      </span>
                    </div>

                    <div className="mt-2 text-xs font-mono text-white/60 truncate">
                      {provider.recommendedModel}
                    </div>

                    <div className="mt-2 flex items-center justify-between text-[11px] font-mono text-white/40">
                      <span>{provider.category}</span>
                      <span className="text-[#C6FF3D]/80">Free Tier</span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Provider Deep-Dive Column */}
          <div className="lg:col-span-7 bg-[#10141A]/95 border border-white/15 p-6 rounded-sm backdrop-blur-md flex flex-col justify-between">
            <div>
              {/* Header */}
              <div className="flex flex-wrap items-center justify-between gap-3 pb-4 border-b border-white/10">
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="text-xl font-bold text-white">{selectedProvider.name}</h3>
                    {selectedProvider.isOpenAICompatible && (
                      <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-sky-500/10 text-sky-400 border border-sky-500/30">
                        OpenAI SDK Compatible
                      </span>
                    )}
                  </div>
                  <div className="text-xs font-mono text-[#4CC9F0] mt-1 break-all">
                    Base URL: {selectedProvider.baseURL}
                  </div>
                </div>

                <a
                  href={selectedProvider.docsUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={() => sound.playClick()}
                  className="px-3 py-1.5 text-xs font-mono rounded bg-white/[0.04] hover:bg-[#C6FF3D]/10 border border-white/20 hover:border-[#C6FF3D] text-[#C6FF3D] transition-colors flex items-center gap-1.5"
                >
                  <span>Free Key Setup</span>
                  <span>↗</span>
                </a>
              </div>

              {/* Free Tier Limits */}
              <div className="mt-5 p-3.5 rounded bg-[#161C24] border border-white/10">
                <div className="text-[10px] font-mono text-[#C6FF3D] uppercase tracking-wider font-bold">
                  FREE-TIER QUOTA · PROVIDER API KEY REQUIRED
                </div>
                <div className="mt-1 text-xs text-white/90 font-mono">
                  {selectedProvider.freeTierLimits}
                </div>
              </div>

              {/* Supported Models */}
              <div className="mt-5">
                <div className="text-xs font-mono text-white/50 mb-2 uppercase tracking-wide">
                  Models listed for free/limited tiers:
                </div>
                <div className="flex flex-wrap gap-2">
                  {selectedProvider.models.map((mod) => (
                    <span
                      key={mod}
                      className="px-2.5 py-1 rounded-xs bg-white/[0.04] border border-white/10 text-white/80 font-mono text-xs"
                    >
                      {mod}
                    </span>
                  ))}
                </div>
              </div>

              {/* Provider Features */}
              <div className="mt-5">
                <div className="text-xs font-mono text-white/50 mb-2 uppercase tracking-wide">
                  Architectural Advantages:
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {selectedProvider.features.map((feat) => (
                    <div
                      key={feat}
                      className="p-2 rounded bg-black/30 border border-white/5 text-[11px] font-mono text-white/70 flex items-center gap-2"
                    >
                      <span className="text-[#C6FF3D]">▸</span>
                      <span>{feat}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Direct Code Snippet */}
              <div className="mt-6 border border-white/10 rounded overflow-hidden bg-[#07090D]">
                <div className="px-3 py-1.5 bg-[#141A22] border-b border-white/10 flex items-center justify-between text-[11px] font-mono text-white/50">
                  <span className="text-[#C6FF3D]">SERVER-SIDE EXAMPLE · KEY REQUIRED</span>
                  <button
                    type="button"
                    onClick={() =>
                      copyToClipboard(providerCode, selectedProvider.id)
                    }
                    className="hover:text-white cursor-pointer"
                  >
                    {copiedKey === selectedProvider.id ? 'COPIED!' : 'COPY CODE'}
                  </button>
                </div>
                <pre className="p-3 text-[11px] font-mono text-[#4CC9F0] overflow-x-auto leading-relaxed">
                  <code>{providerCode}</code>
                </pre>
              </div>
            </div>

            {/* Test in Console CTA */}
            <div className="mt-6 pt-4 border-t border-white/10 flex items-center justify-between">
              <div className="text-[11px] font-mono text-white/50">
                Env Var: <span className="text-white">{selectedProvider.envKeyName}</span>
              </div>
              <button
                type="button"
                onClick={() => {
                  sound.playClick();
                  onTestProvider?.(selectedProvider);
                }}
                className="px-4 py-2 bg-[#C6FF3D] hover:bg-[#b0f52b] text-black font-mono text-xs font-bold rounded-xs transition-colors cursor-pointer"
              >
                TEST IN "ASK AAYU" CONSOLE →
              </button>
            </div>
          </div>
        </div>
      )}

      {activeTab === 'code' && (
        <div className="bg-[#10141A]/95 border border-white/15 p-6 rounded-sm backdrop-blur-md">
          <div className="flex items-center justify-between pb-4 border-b border-white/10 mb-4">
            <div>
              <h3 className="text-lg font-bold text-white">Adumate Multi-Provider Quota Failover Engine</h3>
              <p className="text-xs text-white/60 font-mono mt-1">
                Example failover pattern: tries configured providers in order. Free-tier quotas can change; fallback is not guaranteed.
              </p>
            </div>
            <button
              type="button"
              onClick={() =>
                copyToClipboard(
                  `export async function adumateDispatch(prompt: string) {
  const freeProviders = [
    { url: 'https://api.groq.com/openai/v1', model: 'llama-3.3-70b-versatile', key: process.env.GROQ_API_KEY },
    { url: 'https://openrouter.ai/api/v1', model: 'meta-llama/llama-3.3-70b-instruct:free', key: process.env.OPENROUTER_API_KEY },
    { url: 'https://api.mistral.ai/v1', model: 'mistral-small-latest', key: process.env.MISTRAL_API_KEY }
  ];

  for (const provider of freeProviders) {
    try {
      const res = await fetch(\`\${provider.url}/chat/completions\`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': \`Bearer \${provider.key}\`
        },
        body: JSON.stringify({
          model: provider.model,
          messages: [{ role: 'user', content: prompt }]
        })
      });
      if (res.ok) return await res.json();
    } catch (err) {
      // Automatic fallback to next awesome-free-llm-api provider
      continue;
    }
  }
}`,
                  'failover-code'
                )
              }
              className="px-3 py-1.5 text-xs font-mono rounded bg-white/[0.04] hover:bg-[#C6FF3D]/10 border border-white/20 text-[#C6FF3D] cursor-pointer"
            >
              {copiedKey === 'failover-code' ? 'COPIED!' : 'COPY FULL ALGORITHM'}
            </button>
          </div>

          <pre className="p-4 bg-[#07090D] border border-white/10 rounded text-xs font-mono text-[#4CC9F0] overflow-x-auto leading-relaxed">
            <code>{`// Adumate Multi-Provider Failover Architecture
// Inspired by mnfst/awesome-free-llm-apis curated list

import { AWESOME_FREE_LLM_PROVIDERS } from './freeLlmApis';

export class AdumateFailoverRouter {
  private providers = AWESOME_FREE_LLM_PROVIDERS;

  async executeWithFailover(prompt: string): Promise<{ text: string; provider: string }> {
    for (const provider of this.providers) {
      const apiKey = process.env[provider.envKeyName];
      if (!apiKey) continue; // Skip providers with no active token

      try {
        const response = await fetch(\`\${provider.baseURL}/chat/completions\`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': \`Bearer \${apiKey}\`
          },
          body: JSON.stringify({
            model: provider.recommendedModel,
            messages: [{ role: 'user', content: prompt }],
            temperature: 0.7
          }),
          signal: AbortSignal.timeout(3000) // 3-second rapid failover threshold
        });

        if (!response.ok) {
          console.warn(\`Provider \${provider.name} returned \${response.status}. Rotating...\`);
          continue;
        }

        const data = await response.json();
        return {
          text: data.choices[0].message.content,
          provider: provider.name
        };
      } catch (networkOrTimeoutError) {
        // Instant seamless rotation to next free tier provider
        continue;
      }
    }

    // Ultimate fallback: Deterministic local Knowledge Engine
    return {
      text: "Serving from local AAYU neural knowledge engine.",
      provider: "AAYU-Offline-Engine"
    };
  }
}`}</code>
          </pre>
        </div>
      )}

      {activeTab === 'architecture' && (
        <div className="bg-[#10141A]/95 border border-white/15 p-6 rounded-sm backdrop-blur-md space-y-6">
          <div className="border-b border-white/10 pb-4">
            <h3 className="text-lg font-bold text-white">Conceptual Token Routing Topology</h3>
            <p className="text-xs text-white/60 font-mono mt-1">
              Reference architecture only; this diagram is not an active rate-limit or latency-measurement service.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="p-4 rounded bg-[#161C24] border border-[#C6FF3D]/30 space-y-2">
              <div className="text-[10px] font-mono text-[#C6FF3D]">STAGE 01</div>
              <div className="font-bold text-sm text-white">Client Ingestion</div>
              <p className="text-xs text-white/60">
                Prompts are sent to the selected configured provider; its data-retention policy applies.
              </p>
            </div>

            <div className="p-4 rounded bg-[#161C24] border border-[#4CC9F0]/30 space-y-2">
              <div className="text-[10px] font-mono text-[#4CC9F0]">STAGE 02</div>
              <div className="font-bold text-sm text-white">Rate-Limit Arbiter (concept)</div>
              <p className="text-xs text-white/60">
                Would track provider quotas; the current chat server does not calculate live RPM/TPM usage.
              </p>
            </div>

            <div className="p-4 rounded bg-[#161C24] border border-[#8B5CF6]/30 space-y-2">
              <div className="text-[10px] font-mono text-[#8B5CF6]">STAGE 03</div>
              <div className="font-bold text-sm text-white">Least-Latency Dispatch (concept)</div>
              <p className="text-xs text-white/60">
                Could select by measured latency; the current chat server tries providers sequentially.
              </p>
            </div>

            <div className="p-4 rounded bg-[#161C24] border border-white/15 space-y-2">
              <div className="text-[10px] font-mono text-white/50">STAGE 04</div>
              <div className="font-bold text-sm text-white">Configured Provider Fallback</div>
              <p className="text-xs text-white/60">
                A configured fallback may be tried after an upstream error such as HTTP 429; availability and latency are not guaranteed.
              </p>
            </div>
          </div>
        </div>
      )}
    </section>
  );
};
