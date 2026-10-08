import React, { useState } from 'react';
import { sound } from '../../utils/audio.ts';
import { IconNeural, IconCompiler, IconSentinel, IconAdumate } from '../ui/Icons.tsx';

interface ExpertiseDomain {
  id: string;
  title: string;
  tagline: string;
  color: string;
  icon: React.ReactNode;
  technologies: string[];
  focusAreas: string[];
  principles: string;
  phase?: string;
}

const DOMAINS: ExpertiseDomain[] = [
  {
    id: 'brain-ai',
    title: 'Brain-Inspired AI',
    tagline: 'Neural architectures, deep learning, cortical mapping & continuous learning dynamics.',
    color: '#C6FF3D',
    icon: <IconNeural size={24} className="text-[#C6FF3D]" />,
    technologies: ['PyTorch', 'PyTorch Lightning', 'CUDA', 'Hugging Face', 'Nilearn', 'PyVista', 'NumPy'],
    focusAreas: [
      'Cortical voxel response mapping from multimodal stimuli (video, audio, text)',
      'Mitigating catastrophic forgetting via sparse dendritic plasticity',
      'Continuous episodic memory buffers & latent alignment',
      'Biologically plausible local synaptic update rules',
    ],
    principles: 'Brain-inspired systems trade rigid global backpropagation for localized, energy-efficient plastic learning closer to biology.',
  },
  {
    id: 'compiler',
    title: 'Compiler Intelligence',
    tagline: 'Deep-learning compiler optimization, MLIR/LLVM lowering, and kernel fusion closer to the metal.',
    color: '#4CC9F0',
    icon: <IconCompiler size={24} className="text-[#4CC9F0]" />,
    technologies: ['Rust', 'C++', 'MLIR / LLVM', 'Triton', 'SIMD Intrinsics', 'Linux Perf'],
    focusAreas: [
      'Polyhedral loop transformations & cache-locality tiling',
      'Automated kernel fusion for quantized INT8 and FP16 tensor ops',
      'Intermediate representation (IR) lowering to bare metal assembly',
      'Hardware execution path profiling & register pressure minimization',
    ],
    principles: 'Memory movement dominates modern neural compute. Smarter compilation eliminates memory bottlenecks before silicon executes.',
  },
  {
    id: 'security',
    title: 'Security by Design',
    tagline: 'AI security, adversarial red-teaming, cryptographic AI, and EVM/Solidity formal verification.',
    color: '#8B5CF6',
    icon: <IconSentinel size={24} className="text-[#8B5CF6]" />,
    technologies: ['Solidity', 'Foundry', 'Slither', 'Rust', 'WebAssembly', 'Cryptography', 'Differential Fuzzing'],
    focusAreas: [
      'Adversarial prompt injection detection via cryptographic hash tracing',
      'AST-based symbolic execution for smart contract reentrancy bugs',
      'Zero-knowledge constraint proofs for sensitive model outputs',
      'Defense-in-depth security layers without inference latency bloat',
    ],
    principles: 'Security is not an afterthought patch. Invariant verification must happen mathematically before deployment.',
  },
  {
    id: 'fullstack',
    title: 'Full-Stack Craft',
    tagline: 'Python, C++, Rust, Go, TypeScript, Linux, and high-performance product engineering.',
    color: '#C6FF3D',
    icon: <IconAdumate size={24} className="text-[#C6FF3D]" />,
    technologies: ['Python', 'TypeScript', 'Go', 'React', 'Next.js', 'FastAPI', 'Node.js', 'Docker', 'PostgreSQL', 'Redis'],
    focusAreas: [
      'Real-time streaming agent architectures & WebSockets',
      'Containerized micro-services with reproducible Docker environments',
      'Zero-telemetry privacy-first data models',
      'High-throughput client-side 3D WebGL and interactive canvas visualization',
    ],
    principles: 'Code clarity, strict type safety, zero bloat, and resilient user interfaces that never leave users stranded.',
  },
  {
    id: 'systems-mathematics',
    title: 'Systems Mathematics',
    tagline: 'Mathematical foundations for algorithms, machine learning, and efficient systems.',
    color: '#C6FF3D',
    icon: <IconCompiler size={24} className="text-[#C6FF3D]" />,
    technologies: ['Linear Algebra', 'Probability', 'Discrete Math', 'Graph Theory', 'Optimization', 'Complexity'],
    focusAreas: [
      'Vectors, matrices, and linear transformations behind machine learning',
      'Probability, statistics, and uncertainty in model evaluation',
      'Discrete mathematics, graph theory, and algorithmic reasoning',
      'Optimization and asymptotic analysis for computational cost',
    ],
    principles: 'Mathematics provides a way to reason about correctness, performance, and model behavior before implementation.',
    phase: 'LEARNING TRACK',
  },
  {
    id: 'os-networking',
    title: 'Operating Systems & Networking',
    tagline: 'Linux internals, network protocols, and the foundations of reliable services.',
    color: '#38BDF8',
    icon: <IconAdumate size={24} className="text-[#38BDF8]" />,
    technologies: ['Linux', 'Processes', 'Virtual Memory', 'TCP/IP', 'DNS', 'HTTP / TLS'],
    focusAreas: [
      'Operating-system concepts: processes, scheduling, memory, and system calls',
      'Networking fundamentals: addressing, routing, TCP/IP, and DNS',
      'HTTP and TLS as the basis for secure service communication',
      'Observability and safe troubleshooting in systems you own or are authorized to test',
    ],
    principles: 'Understanding the OS and network boundaries makes software easier to diagnose, secure, and operate.',
    phase: 'LEARNING TRACK',
  },
  {
    id: 'llm-blockchain-security',
    title: 'LLM & Blockchain Systems',
    tagline: 'Language-model infrastructure, distributed ledgers, and defensive security.',
    color: '#A855F7',
    icon: <IconSentinel size={24} className="text-[#A855F7]" />,
    technologies: ['LLM Inference', 'RAG', 'Evaluation', 'Prompt Safety', 'EVM', 'Smart-Contract Invariants'],
    focusAreas: [
      'LLM inference pipelines, retrieval-augmented generation, and evaluation',
      'Threat modeling and defensive testing in authorized environments',
      'Blockchain consensus concepts and distributed-state trade-offs',
      'Smart-contract invariants, secure coding, and responsible vulnerability remediation',
    ],
    principles: 'Treat model outputs and distributed state as untrusted until their assumptions and failure modes have been tested.',
    phase: 'LEARNING TRACK',
  },
];

export const ExpertiseSection: React.FC = () => {
  const [expandedId, setExpandedId] = useState<string>('brain-ai');

  const handleRowClick = (id: string) => {
    sound.playClick();
    setExpandedId(expandedId === id ? '' : id);
  };

  return (
    <section
      id="expertise"
      className="relative min-h-screen py-24 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto z-10"
      aria-label="Expertise Section"
    >
      <div className="space-y-4 mb-16 border-b border-white/[0.08] pb-8">
        <div className="flex flex-wrap items-center gap-2 sm:gap-3 text-xs font-mono text-[#a855f7]">
          <span className="w-2 h-2 rounded-sm bg-[#a855f7] shrink-0" />
          <span>RESEARCH ROOM / 004</span>
          <span className="text-white/20">|</span>
          <span className="text-white/40">SYSTEM CAPABILITIES · NO ARBITRARY PERCENTAGES</span>
        </div>

        <h2 className="text-3xl sm:text-5xl font-bold tracking-tight text-white">
          Interactive systems expertise.{' '}
          <span className="text-[#a855f7]">Ground truth only.</span>
        </h2>

        <p className="text-base text-white/70 max-w-3xl leading-relaxed">
          I reject arbitrary skill percentages and decorative progress bars. Below are the functional domains where I architect systems, optimize execution paths, and write production code.
        </p>
      </div>

      {/* Interactive Horizontal Rows */}
      <div className="space-y-4">
        {DOMAINS.map((domain, index) => {
          const isExpanded = expandedId === domain.id;
          return (
            <div
              key={domain.id}
              className={`border rounded-sm transition-all duration-300 bg-[#0c1017]/90 ${
                isExpanded
                  ? 'border-white/30 shadow-lg'
                  : 'border-white/10 hover:border-white/20'
              }`}
            >
              {/* Row Header */}
              <button
                type="button"
                onClick={() => handleRowClick(domain.id)}
                className="w-full text-left p-6 flex flex-col md:flex-row md:items-center justify-between gap-4 cursor-pointer focus:outline-none"
                aria-expanded={isExpanded}
              >
                <div className="flex items-center space-x-4">
                  <span className="text-xs font-mono text-white/30">0{index + 1}.</span>
                  <div className="p-2.5 rounded bg-white/[0.03] border border-white/10">
                    {domain.icon}
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-white flex items-center gap-3">
                      <span>{domain.title}</span>
                      {isExpanded && (
                        <span
                          className="w-2 h-2 rounded-full"
                          style={{ backgroundColor: domain.color }}
                        />
                      )}
                    </h3>
                    <p className="text-xs text-white/60 font-mono mt-0.5 max-w-xl">
                      {domain.tagline}
                    </p>
                  </div>
                </div>

                <div className="flex items-center space-x-4 font-mono text-xs">
                  <span className="text-white/40 hidden lg:inline">
                    {domain.phase ?? domain.technologies.slice(0, 3).join(' · ')}
                  </span>
                  <span
                    className="px-3 py-1 rounded border border-white/10 text-white/70 hover:text-white"
                  >
                    {isExpanded ? 'COLLAPSE [-]' : 'INSPECT [+]'}
                  </span>
                </div>
              </button>

              {/* Expanded Detail Tray */}
              {isExpanded && (
                <div className="px-6 pb-6 pt-2 border-t border-white/[0.06] space-y-6 animate-fadeIn">
                  {/* Focus Areas & Thesis */}
                  <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-start">
                    <div className="md:col-span-7 space-y-3">
                      <div className="text-[11px] font-mono text-white/40 uppercase tracking-wider">
                        {domain.phase ? 'LEARNING ROADMAP' : 'CORE ENGINEERING FOCUS'}
                      </div>
                      <ul className="space-y-2 text-xs text-white/80 font-mono">
                        {domain.focusAreas.map((area) => (
                          <li key={area} className="flex items-start space-x-2">
                            <span className="text-[#84cc16] mt-0.5">▸</span>
                            <span>{area}</span>
                          </li>
                        ))}
                      </ul>
                    </div>

                    <div className="md:col-span-5 bg-white/[0.02] border border-white/5 p-4 rounded-sm space-y-2">
                      <div className="text-[11px] font-mono text-white/40 uppercase tracking-wider">
                        SYSTEM AXIOM
                      </div>
                      <p className="text-xs text-white/75 italic leading-relaxed">
                        "{domain.principles}"
                      </p>
                    </div>
                  </div>

                  {/* Verified Toolchain Badges (Unboxed typography) */}
                  <div className="pt-3 border-t border-white/[0.06]">
                    <div className="text-[11px] font-mono text-white/40 mb-2 uppercase tracking-wider">
                      {domain.phase ? 'LEARNING TRACK TOOLCHAIN & TOPICS' : 'ACTIVE SYSTEM TOOLCHAIN & RUNTIMES'}
                    </div>
                    <div className="flex flex-wrap gap-2 text-xs font-mono">
                      {domain.technologies.map((tech) => (
                        <span
                          key={tech}
                          className="px-2.5 py-1 rounded-sm bg-white/[0.03] border border-white/10 text-white/85"
                        >
                          {tech}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </section>
  );
};
