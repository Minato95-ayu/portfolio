export interface ProjectData {
  slug: string;
  title: string;
  category: 'FLAGSHIP SYSTEM' | 'PUBLIC WORK' | 'RESEARCH LAB' | 'FOUNDER ECOSYSTEM';
  status:
    | 'PUBLIC REPO / ACTIVE DIRECTION'
    | 'PUBLIC REPO / README-DOCUMENTED'
    | 'CONCEPT / NEXT BUILD'
    | 'ACTIVE DIRECTION / FOUNDER'
    | 'ACTIVE DIRECTION / SPEC & PROTOTYPE'
    | 'RESEARCH INITIATIVE / PROTOTYPE';
  tag: string;
  summary: string;
  researchQuestion: string;
  whatExists: string;
  whatToBuildNext: string;
  architectureNotes: string;
  stack: string[];
  sprint7Day: { day: string; task: string }[];
  proofExpected: string;
  githubUrl: string;
  externalUrl?: string;
  color: string;
  iconName: string;
  codeSnippet?: string;
}

export const PROFILE_DATA = {
  name: 'Ayush Kaushik',
  alternateName: 'Ayushh Kaushiq',
  brand: 'AAYU',
  pronouns: 'he/him',
  location: 'Delhi, India',
  founderIdentity: 'Founder @ Adumate (adumate.in)',
  roleLine: 'Deep-Tech Systems Architect & AI Researcher',
  tagline: 'I build intelligence closer to the metal.',
  primaryPositioning: 'Deep-Tech Systems Architect & AI Researcher building intelligence closer to the metal.',
  secondaryPositioning: 'Creator of the AAYU programming language and Intent-to-Silicon (I2S) research project. Self-taught full-stack + AI/ML developer. Teaches students part-time.',
  education: 'B.Sc. Mathematics (Hons), BRABU Muzaffarpur, expected 2027 · NIELIT Delhi',
  interests: [
    'Brain-inspired AI systems',
    'Deep-learning compiler optimization',
    'Intent-to-Silicon (I2S) compilation',
    'AI security & cryptographic AI',
    'Web3 security',
    'Systems engineering & automation',
    'Systems mathematics: linear algebra, probability, graph theory, and optimization',
    'Operating-system and networking fundamentals',
    'Ethical cybersecurity and defensive testing',
    'LLM inference, retrieval, and evaluation systems',
    'Blockchain protocols and smart-contract security',
  ],
  technologies: [
    'Python',
    'C++',
    'Rust',
    'Go',
    'JavaScript',
    'TypeScript',
    'Solidity',
    'Linux',
    'React',
    'Next.js',
    'Docker',
    'PyTorch',
  ],
  links: {
    github: 'https://github.com/Minato95-ayu',
    linkedin: 'https://www.linkedin.com/in/ayushh-kaushiq-1a950825a',
    website: 'https://adumate.in',
    email: 'ayushkaushik1441@gmail.com',
    instagram: 'https://www.instagram.com/o_aa.yu_s/',
    x: 'https://x.com/o_Ayush_kaushik',
    youtube: 'https://youtube.com/@ayushkaushik08',
  },
  youtube: {
    channelName: 'How Computers Think — Zero to Research',
    url: 'https://youtube.com/@ayushkaushik08',
    description:
      'Deep dives into how computers work from raw silicon, logic gates, and compiler pipelines up to neural architectures and brain-inspired computing.',
  },
  githubStats: {
    username: 'Minato95-ayu',
    followers: 6,
    following: 14,
    achievements: [
      { name: 'Pull Shark ×2', desc: 'Opened pull requests that were merged' },
      { name: 'Quickdraw', desc: 'Closed an issue or PR within 5 minutes' },
      { name: 'YOLO', desc: 'Merged pull request without a code review' },
      { name: 'Pair Extraordinaire', desc: 'Co-authored commits in merged PR' },
    ],
  },
};

// Flagship "Systems I built from scratch" (Section 1 right after Hero)
export const FLAGSHIP_SYSTEMS: ProjectData[] = [
  {
    slug: 'aayu-lang',
    title: 'AAYU Programming Language',
    category: 'FLAGSHIP SYSTEM',
    status: 'ACTIVE DIRECTION / SPEC & PROTOTYPE',
    tag: 'Systems & Compiler Language',
    summary:
      'Original programming language designed for deterministic memory management, zero-cost neural tensor bindings, and explicit compiler-guided hardware execution.',
    researchQuestion:
      'Can explicit intent semantics in a grammar eliminate runtime dynamic dispatch for quantized tensor kernels without garbage collector latency?',
    whatExists:
      'Grammar specification, Lexer and AST parser written in Rust, initial LLVM IR codegen proof-of-concept, and standard prelude specification.',
    whatToBuildNext:
      'Linear type borrow-checker pass, native WebAssembly target, and self-hosting bootstrap compiler toolchain.',
    architectureNotes:
      'AAYU Source (.ayu) -> Rust AST Parser -> Semantic Analysis & Type Inference -> MLIR/LLVM Dialect Lowering -> Native Machine Code / Wasm.',
    stack: ['Rust', 'LLVM', 'MLIR', 'C++', 'Linux'],
    sprint7Day: [
      { day: 'Day 1', task: 'Finalize AST node representation for tensor intent blocks.' },
      { day: 'Day 2', task: 'Implement LLVM IR string builder for primitive math ops.' },
      { day: 'Day 3', task: 'Benchmark memory allocation overhead vs pure C99.' },
      { day: 'Day 4', task: 'Add structured error diagnostic reporting in lexer.' },
      { day: 'Day 5', task: 'Build CLI driver: aayuc compile -O3.' },
      { day: 'Day 6', task: 'Implement automated test runner over 25 sample programs.' },
      { day: 'Day 7', task: 'Publish language grammar RFC and open GitHub repo.' },
    ],
    proofExpected: 'Grammar specification document, parser code in Rust, and test suite with executable binaries.',
    githubUrl: 'https://github.com/Minato95-ayu',
    color: '#C6FF3D',
    iconName: 'compiler',
    codeSnippet: `// AAYU Language — Tensor Intent Primitive
fn compute_synapse(tensor: [f32; 1024] @aligned(64)) -> [f32; 256] {
    intent {
        vectorize: avx512,
        unroll_factor: 4,
        memory_mode: zero_copy
    }
    let weights = load_static_weights("core.weights");
    return dot_product(tensor, weights);
}`,
  },
  {
    slug: 'i2s-research',
    title: 'Intent-to-Silicon (I2S)',
    category: 'FLAGSHIP SYSTEM',
    status: 'RESEARCH INITIATIVE / PROTOTYPE',
    tag: 'Hardware-Software Synthesis Research',
    summary:
      'Research initiative mapping declarative neural intent directly into hardware instruction set micro-ops, bypassing virtual machine and driver stack overhead.',
    researchQuestion:
      'How directly can high-level computational intent be mapped to FPGA logic blocks and custom SIMD accelerators without host-CPU kernel launch latency?',
    whatExists:
      'Architectural thesis, mathematical mapping formulations, and cycle-accurate execution timeline designs.',
    whatToBuildNext:
      'Verilator cycle-accurate simulation model and open Verilog/Chisel core targeting open-source FPGA toolchains.',
    architectureNotes:
      'Declarative Graph Intent -> Graph Partitioning -> Spatial Micro-Op Scheduler -> Custom Hardware ISA -> FPGA / ASIC Compute Fabric.',
    stack: ['Rust', 'C++', 'Verilog', 'Python', 'Digital Logic'],
    sprint7Day: [
      { day: 'Day 1', task: 'Draft micro-op instruction format (32-bit control word).' },
      { day: 'Day 2', task: 'Simulate single-cycle instruction decode in C++ testbench.' },
      { day: 'Day 3', task: 'Define memory arbiter protocol between compute tiles.' },
      { day: 'Day 4', task: 'Measure instruction cache miss penalty in software model.' },
      { day: 'Day 5', task: 'Build cycle-accurate state machine for matrix tile multiply.' },
      { day: 'Day 6', task: 'Simulate synthetic workload against standard CPU baseline.' },
      { day: 'Day 7', task: 'Publish I2S research notes and architecture whitepaper.' },
    ],
    proofExpected: 'Cycle-accurate simulation report, instruction format spec, and open architecture notes.',
    githubUrl: 'https://github.com/Minato95-ayu',
    color: '#4CC9F0',
    iconName: 'neural',
    codeSnippet: `// I2S Micro-Op Control Definition
struct I2SControlWord {
    opcode: 0x4A,           // SPATIAL_MATRIX_FUSE
    tile_dim: [16, 16],      // Hardware register tile
    accum_precision: FP16,   // Mixed-precision accumulator
    bus_priority: HIGH,      // Direct DMA bus lock
};`,
  },
  {
    slug: 'adumate-platform',
    title: 'Adumate Platform',
    category: 'FLAGSHIP SYSTEM',
    status: 'ACTIVE DIRECTION / FOUNDER',
    tag: 'Multi-Provider AI Routing & Service Mesh',
    summary:
      'Founder-led platform focused on multi-provider AI routing, service discovery, and privacy-focused developer infrastructure.',
    researchQuestion:
      'How can dynamic latency-aware token rotation eliminate API rate limit throttling across distributed multi-tenant workloads without proprietary vendor lock-in?',
    whatExists:
      'Production domain https://adumate.in, multi-provider API router architecture, load-balancing heuristics, and developer gateway.',
    whatToBuildNext:
      'Global multi-region failover mesh, client SDKs, and local-first caching edge node.',
    architectureNotes:
      'Client Request -> Adumate Gateway -> Latency & Quota Scoring Engine -> Token Bucket Dispatcher (configured provider free tiers) -> Response Stream.',
    stack: ['TypeScript', 'Node.js', 'Go', 'Next.js', 'PostgreSQL', 'Redis', 'Docker'],
    sprint7Day: [
      { day: 'Day 1', task: 'Define provider configuration and capability matrix for the router.' },
      { day: 'Day 2', task: 'Implement zero-telemetry client header validation & CORS proxy.' },
      { day: 'Day 3', task: 'Benchmark proxy latency under 5,000 req/min multi-provider load.' },
      { day: 'Day 4', task: 'Harden automatic fallback when upstream returns 429 quota exhaustion.' },
      { day: 'Day 5', task: 'Deploy status and uptime telemetry monitor on adumate.in.' },
      { day: 'Day 6', task: 'Build developer dashboard authentication and key generator.' },
      { day: 'Day 7', task: 'Document public API endpoints and client quickstart guide.' },
    ],
    proofExpected: 'Production website https://adumate.in, API proxy documentation, and provider integration matrix.',
    githubUrl: 'https://github.com/Minato95-ayu',
    externalUrl: 'https://adumate.in',
    color: '#C6FF3D',
    iconName: 'adumate',
    codeSnippet: `// Adumate Router — Multi-Provider Failover
const router = new AdumateRouter({
  providers: configuredProviders,
  strategy: 'latency_aware_fallback',
  privacy: 'minimize_retained_request_data'
});
const response = await router.dispatch(prompt);`,
  },
];

// Public GitHub Repositories (README-grounded, strictly honest)
export const PUBLIC_PROJECTS: ProjectData[] = [
  {
    slug: 'eureka',
    title: 'EUREKA',
    category: 'PUBLIC WORK',
    status: 'PUBLIC REPO / ACTIVE DIRECTION',
    tag: 'AI-Powered Virtual Research Lab',
    summary:
      'AI-powered virtual research lab documented around multimodal context, interactive 3D simulations, voice and gesture controls, molecular exploration, and specialist research roles.',
    researchQuestion:
      'Can multimodal AI agents orchestrate real-time 3D spatial simulations and molecular interactions through continuous natural language and gesture streams?',
    whatExists:
      'Documented virtual lab architecture integrating multimodal AI reasoning, 3D simulation canvas with Three.js/R3F, MediaPipe computer-vision gesture recognition, and RDKit molecular structure parsing within containerized Docker environments.',
    whatToBuildNext:
      'Hardware-accelerated WebGPU rendering pipeline for molecular dynamics, lower-latency real-time voice loop over WebSockets, and distributed sub-agent consensus for experimental design.',
    architectureNotes:
      'Client (React/Three.js + MediaPipe gesture capture) -> WebSocket API (FastAPI) -> Multimodal Context Orchestrator -> RDKit C-bindings / Chemistry engine -> Containerized isolated simulation execution.',
    stack: ['Python', 'FastAPI', 'React', 'Three.js / React Three Fiber', 'MediaPipe', 'RDKit', 'Docker'],
    sprint7Day: [
      { day: 'Day 1', task: 'Benchmark MediaPipe hand landmark extraction latency on edge devices.' },
      { day: 'Day 2', task: 'Optimize RDKit 3D conformer generation and geometry caching.' },
      { day: 'Day 3', task: 'Build streaming bidirectional agent response state machine.' },
      { day: 'Day 4', task: 'Harmonize Three.js camera transitions with speech synthesis timing.' },
      { day: 'Day 5', task: 'Implement WebGL frame pacing under heavy spatial simulation loads.' },
      { day: 'Day 6', task: 'Stress-test multi-container Docker deployment under concurrency.' },
      { day: 'Day 7', task: 'Release automated test suites, demo script, and reproducible benchmarks.' },
    ],
    proofExpected: 'Public GitHub repository, interactive simulation demo scripts, Docker setup documentation, and API contracts.',
    githubUrl: 'https://github.com/Minato95-ayu/EUREKA',
    color: '#4CC9F0',
    iconName: 'nucleus',
  },
  {
    slug: 'job-finder',
    title: 'job-finder',
    category: 'PUBLIC WORK',
    status: 'PUBLIC REPO / ACTIVE DIRECTION',
    tag: 'Career Intelligence & Verification',
    summary:
      'Career-intelligence platform documented around resume ATS analysis, semantic job discovery, scam/fraud analysis, salary insights, and a multi-agent career assistant.',
    researchQuestion:
      'How do semantic embeddings and multi-agent verification mitigate recruitment fraud while providing deterministic ATS scoring without model hallucination?',
    whatExists:
      'Full-stack career intelligence architecture with React/Vite/TypeScript frontend, Node.js backend, Redis caching layer, PostgreSQL persistence, and provider-neutral semantic evaluation.',
    whatToBuildNext:
      'Local embedding model inference using ONNX runtime to ensure zero PII leakage during initial resume parsing before remote enrichment.',
    architectureNotes:
      'Vite/React Client -> Express Gateway -> Redis Cache & Rate Limiting -> Semantic Matching Engine (vector embeddings + PostgreSQL pgvector) -> Fraud & Scam Heuristic Verifier.',
    stack: ['React', 'Node.js', 'Vite', 'TypeScript', 'Redis', 'LLM APIs', 'PostgreSQL', 'Docker'],
    sprint7Day: [
      { day: 'Day 1', task: 'Audit ATS parsing accuracy across complex multi-column PDF layouts.' },
      { day: 'Day 2', task: 'Implement Redis vector cache for repeated semantic query patterns.' },
      { day: 'Day 3', task: 'Build fraud detection heuristics pipeline for suspicious recruiter domains.' },
      { day: 'Day 4', task: 'Harden PostgreSQL database schema migrations and indexing.' },
      { day: 'Day 5', task: 'Fine-tune multi-agent verification prompt flows with deterministic validation.' },
      { day: 'Day 6', task: 'Dockerize production build and verify multi-stage caching layers.' },
      { day: 'Day 7', task: 'Document API endpoints and publish ATS parser evaluation report.' },
    ],
    proofExpected: 'Clean TypeScript architecture, Docker Compose manifests, reproducible seed data, and ATS parser evaluation.',
    githubUrl: 'https://github.com/Minato95-ayu/job-finder',
    color: '#C6FF3D',
    iconName: 'brackets',
  },
  {
    slug: 'tribev2-main',
    title: 'tribev2-main',
    category: 'PUBLIC WORK',
    status: 'PUBLIC REPO / README-DOCUMENTED',
    tag: 'Multimodal Brain-Encoding Transformer',
    summary:
      'Deep multimodal brain-encoding research documented around a Transformer that maps video, audio, and text representations toward cortical fMRI responses.',
    researchQuestion:
      'How do aligned multimodal latent spaces correlate with localized voxel activations across visual and auditory cortices during continuous naturalistic stimuli?',
    whatExists:
      'PyTorch Lightning training harness, multimodal embedding fusion (video, audio, text features), Nilearn fMRI voxel coordinate mapping, and Slurm cluster batch configuration scripts.',
    whatToBuildNext:
      'Cross-subject generalization adapter layers and sparse attention masks to reduce quadratic compute on high-dimensional multi-voxel cortical fields.',
    architectureNotes:
      'Video/Audio/Text Stimuli -> Multimodal Encoders (Transformers) -> Cross-Attention Latent Fusion -> Linear Voxel Readout Head -> 3D Cortical Brain Map (PyVista / Nilearn fMRI Surface Projection).',
    stack: ['Python', 'PyTorch Lightning', 'Hugging Face', 'PyVista', 'Nilearn', 'Slurm'],
    sprint7Day: [
      { day: 'Day 1', task: 'Validate fMRI voxel preprocessing pipeline against benchmark brain atlas.' },
      { day: 'Day 2', task: 'Profile GPU VRAM memory during multi-modal video/audio tensor extraction.' },
      { day: 'Day 3', task: 'Implement cortical surface 3D projection rendering with PyVista.' },
      { day: 'Day 4', task: 'Tune PyTorch Lightning distributed checkpoint and validation callbacks.' },
      { day: 'Day 5', task: 'Execute cross-validation split across distinct subject brain scans.' },
      { day: 'Day 6', task: 'Generate voxel-wise prediction correlation maps and R² evaluation metrics.' },
      { day: 'Day 7', task: 'Package Slurm training scripts, conda environment lock, and README documentation.' },
    ],
    proofExpected: 'PyTorch training code, voxel correlation maps, dataset loading scripts, and reproducible Slurm batch jobs.',
    githubUrl: 'https://github.com/Minato95-ayu/tribev2-main',
    color: '#8B5CF6',
    iconName: 'cortical',
  },
  {
    slug: 'school',
    title: 'school',
    category: 'PUBLIC WORK',
    status: 'PUBLIC REPO / ACTIVE DIRECTION',
    tag: 'Cross-Platform Client Foundation',
    summary:
      'A public Flutter project starter and cross-platform foundation for education systems. Maintained with honest documentation of current baseline scope.',
    researchQuestion:
      'How can offline-first state synchronization and local caching maintain educational continuity in low-bandwidth network environments across mobile and desktop?',
    whatExists:
      'Clean Flutter and Dart repository scaffolding supporting multi-target compilation (Android, iOS, Linux, macOS, Web, Windows).',
    whatToBuildNext:
      'CRDT-based offline database sync engine and modular component system for responsive student management workflows.',
    architectureNotes:
      'Multi-Platform Flutter Shell -> Clean Architecture BLoC/State Layer -> SQLite / Hive Local Cache -> Secure Network Transport Layer.',
    stack: ['Flutter', 'Dart', 'Android', 'iOS', 'Linux', 'macOS', 'Web', 'Windows'],
    sprint7Day: [
      { day: 'Day 1', task: 'Establish modular Flutter clean architecture folder hierarchy.' },
      { day: 'Day 2', task: 'Implement reactive state management pattern for cross-platform reactivity.' },
      { day: 'Day 3', task: 'Build responsive adaptive navigation shell for desktop and mobile form factors.' },
      { day: 'Day 4', task: 'Configure local SQLite encrypted persistence layer.' },
      { day: 'Day 5', task: 'Add unit tests for core view models and repository interfaces.' },
      { day: 'Day 6', task: 'Test compilation targets across Linux desktop, Android, and Web.' },
      { day: 'Day 7', task: 'Publish clean documentation, setup guides, and repository roadmap.' },
    ],
    proofExpected: 'Flutter repository code, CI build workflows, and multi-platform compilation proof.',
    githubUrl: 'https://github.com/Minato95-ayu/school',
    color: '#4CC9F0',
    iconName: 'starter',
  },
  {
    slug: 'mirofish-to-orian',
    title: 'mirofish-to-orian',
    category: 'PUBLIC WORK',
    status: 'PUBLIC REPO / README-DOCUMENTED',
    tag: 'Multi-Agent Simulation Workspace (Orion)',
    summary:
      'Orion, a MiroFish-evolved open-source multi-agent AI simulation workspace documented around document ingestion, GraphRAG-style knowledge construction, autonomous agents, simulation, and prediction reports.',
    researchQuestion:
      'How does dynamic graph topology reconfiguration between simulated agents affect hypothesis convergence in long-horizon forecasting tasks?',
    whatExists:
      'Python/Flask backend orchestrating PyMuPDF document ingestion, knowledge graph entity extraction, Vue 3 / Vite frontend, and D3.js force-directed graph visualizer.',
    whatToBuildNext:
      'Streaming SSE agent thought broadcasts, hierarchical sub-cluster synthesis, and reproducible Monte Carlo simulation runs.',
    architectureNotes:
      'Document Ingestion (PyMuPDF) -> Entity/Relation GraphRAG Extractor -> Flask API / Agent Orchestrator -> D3.js Force-Directed Interactive Canvas -> Vue 3 / Vite UI Workspace.',
    stack: ['Python', 'Flask', 'Vue 3', 'Vite', 'D3.js', 'PyMuPDF', 'Docker'],
    sprint7Day: [
      { day: 'Day 1', task: 'Optimize PyMuPDF document chunking and metadata preservation.' },
      { day: 'Day 2', task: 'Implement GraphRAG relationship scoring between extracted entities.' },
      { day: 'Day 3', task: 'Upgrade D3.js force simulation canvas rendering for 1,000+ nodes.' },
      { day: 'Day 4', task: 'Build agent message broker event bus with state snapshotting.' },
      { day: 'Day 5', task: 'Add deterministic seed controls for reproducible simulation runs.' },
      { day: 'Day 6', task: 'Package Docker multi-stage build for front and back services.' },
      { day: 'Day 7', task: 'Document evaluation metrics and interactive demo walkthrough.' },
    ],
    proofExpected: 'Full repository source, GraphRAG construction scripts, D3 graph visualization client, and Docker Compose.',
    githubUrl: 'https://github.com/Minato95-ayu/mirofish-to-orian',
    color: '#C6FF3D',
    iconName: 'agents',
  },
];

// Research Lab Missions (6 modules clearly labeled CONCEPT / NEXT BUILD)
export const RESEARCH_LAB_MODULES: ProjectData[] = [
  {
    slug: 'neuralforge',
    title: 'NeuralForge',
    category: 'RESEARCH LAB',
    status: 'CONCEPT / NEXT BUILD',
    tag: 'Brain-Inspired AI Runtime',
    summary:
      'Brain-inspired AI runtime for adaptive, memory-aware intelligence with continuous learning dynamics. Explores plasticity mechanisms directly at the execution layer.',
    researchQuestion:
      'Can spiking neuro-computational primitives and non-differentiable synaptic plasticity mechanisms reduce catastrophic forgetting in streaming multi-task environments?',
    whatExists:
      'Theoretical architectural draft, algorithmic mathematical formulation, and memory bank topology specifications.',
    whatToBuildNext:
      'Initial C++ / Python binding runtime implementing sparse dendritic gating and episodic recall indexing.',
    architectureNotes:
      'Input Signal -> Sparse Dendritic Gate -> Dynamic Plasticity Kernel (C++ SIMD) -> Episodic Memory Buffer (Hierarchical Vector Tree) -> Adaptive Output Synapse.',
    stack: ['C++', 'Python', 'PyTorch', 'CUDA', 'SIMD Intrinsics'],
    sprint7Day: [
      { day: 'Day 1', task: 'Formulate mathematical proof of plasticity update rules.' },
      { day: 'Day 2', task: 'Execute CPU SIMD benchmark of sparse spike propagation.' },
      { day: 'Day 3', task: 'Construct Python PyBind11 bindings harness.' },
      { day: 'Day 4', task: 'Implement episodic memory buffer with LRU eviction.' },
      { day: 'Day 5', task: 'Test synthetic sequential task benchmark for catastrophic forgetting.' },
      { day: 'Day 6', task: 'Profile memory overhead and compute cache hit rates.' },
      { day: 'Day 7', task: 'Publish architectural whitepaper and public GitHub RFC.' },
    ],
    proofExpected: 'Public GitHub repository RFC, reproducible C++ benchmark suite, and validation notebooks.',
    githubUrl: 'https://github.com/Minato95-ayu',
    color: '#8B5CF6',
    iconName: 'neural',
  },
  {
    slug: 'compilerx',
    title: 'CompilerX',
    category: 'RESEARCH LAB',
    status: 'CONCEPT / NEXT BUILD',
    tag: 'DL Compiler Optimization Lab',
    summary:
      'Deep-learning compiler optimization lab focused on smarter execution paths, polyhedral loop transformations, and automated kernel fusion closer to the metal.',
    researchQuestion:
      'How can neural graph rewrite rules discover non-obvious kernel fusions for mixed-precision quantized tensor operators on constrained hardware?',
    whatExists:
      'IR lowering pipeline concepts, operator fusion rule specifications, and compiler pass dependency graphs.',
    whatToBuildNext:
      'LLVM/MLIR dialect prototype targeting edge silicon with automated tile size search.',
    architectureNotes:
      'High-Level Tensor Graph -> MLIR Custom Dialect -> Polyhedral Memory Analysis Pass -> Kernel Fusion & Loop Tiling Engine -> LLVM IR -> Native Machine Assembly.',
    stack: ['Rust', 'C++', 'MLIR / LLVM', 'Python', 'Triton'],
    sprint7Day: [
      { day: 'Day 1', task: 'Define custom MLIR dialect operations and types.' },
      { day: 'Day 2', task: 'Implement canonicalization and dead-code elimination patterns.' },
      { day: 'Day 3', task: 'Build graph lowering pass converting high-level operators to LLVM IR.' },
      { day: 'Day 4', task: 'Benchmark custom GEMM kernel execution latency against standard baselines.' },
      { day: 'Day 5', task: 'Add automated memory layout transform passes for contiguous SIMD access.' },
      { day: 'Day 6', task: 'Validate numerical precision across float16 and int8 quantizations.' },
      { day: 'Day 7', task: 'Document compiler pass pipeline and publish RFC repository.' },
    ],
    proofExpected: 'MLIR dialect code, automated regression test harness, and execution latency profiles.',
    githubUrl: 'https://github.com/Minato95-ayu',
    color: '#4CC9F0',
    iconName: 'compiler',
  },
  {
    slug: 'sentinel-ai',
    title: 'Sentinel AI',
    category: 'RESEARCH LAB',
    status: 'CONCEPT / NEXT BUILD',
    tag: 'Adversarial AI Security & Guardrails',
    summary:
      'Adversarial testing and cryptographic guardrails for intelligent systems, guaranteeing inference-time constraint satisfaction and integrity.',
    researchQuestion:
      'Can cryptographic zero-knowledge proofs and provable adversarial perturbations guarantee deterministic constraint enforcement at inference time?',
    whatExists:
      'Adversarial attack taxonomy, prompt injection fuzzing suite specifications, and cryptographically verified weight hash protocols.',
    whatToBuildNext:
      'Automated red-teaming pipeline with differential fuzzing and output guardrail verification.',
    architectureNotes:
      'Prompt Payload -> Differential Fuzzing Probe -> Zero-Knowledge State Validator -> Latent Vector Cryptographic Chaining -> Enforced Output Guardrail.',
    stack: ['Python', 'Rust', 'Cryptography', 'FastAPI', 'Wasm'],
    sprint7Day: [
      { day: 'Day 1', task: 'Design automated payload fuzzer engine targeting jailbreak patterns.' },
      { day: 'Day 2', task: 'Implement cryptographic hash chaining for inference traces.' },
      { day: 'Day 3', task: 'Build WebAssembly runtime validator for zero-latency client checks.' },
      { day: 'Day 4', task: 'Benchmark guardrail latency penalty against bare inference.' },
      { day: 'Day 5', task: 'Compile comprehensive red-team attack test suites.' },
      { day: 'Day 6', task: 'Implement automated alerting and quarantine handlers.' },
      { day: 'Day 7', task: 'Publish security methodology and benchmark dataset on GitHub.' },
    ],
    proofExpected: 'Open-source evaluation harness, benchmark suite against standard prompt injections, and formal verification notes.',
    githubUrl: 'https://github.com/Minato95-ayu',
    color: '#FF4D4D',
    iconName: 'sentinel',
  },
  {
    slug: 'web3-guard',
    title: 'Web3 Guard',
    category: 'RESEARCH LAB',
    status: 'CONCEPT / NEXT BUILD',
    tag: 'Solidity Security Intelligence',
    summary:
      'Explainable Solidity security intelligence before deployment with formal invariant verification and AST symbolic execution.',
    researchQuestion:
      'How can symbolic execution be paired with semantic LLM explanation to produce provably sound reentrancy and flash-loan vulnerability traces?',
    whatExists:
      'Static analysis AST parser schemas, vulnerability pattern dictionary, and formal rule definitions.',
    whatToBuildNext:
      'EVM bytecode symbolic execution runner with natural language remediation suggestions.',
    architectureNotes:
      'Solidity Source -> Slither/Foundry AST Parser -> Control Flow Graph Generator -> Symbolic Execution Engine -> Exploit Vector Trace -> Remediation Diff Generator.',
    stack: ['Solidity', 'Rust', 'TypeScript', 'Foundry', 'Slither'],
    sprint7Day: [
      { day: 'Day 1', task: 'Integrate Foundry AST extractor pipeline.' },
      { day: 'Day 2', task: 'Build control flow graph (CFG) representation generator.' },
      { day: 'Day 3', task: 'Implement reentrancy and unchecked call pattern matchers.' },
      { day: 'Day 4', task: 'Add symbolic taint analysis pass for state variable mutations.' },
      { day: 'Day 5', task: 'Build terminal CLI report renderer with side-by-side patch diffs.' },
      { day: 'Day 6', task: 'Run verification tests across historical exploit post-mortem datasets.' },
      { day: 'Day 7', task: 'Document findings and publish open CLI tool repository.' },
    ],
    proofExpected: 'CLI tool binary, test coverage over real-world exploit vectors, and reproducible Foundry tests.',
    githubUrl: 'https://github.com/Minato95-ayu',
    color: '#C6FF3D',
    iconName: 'web3',
  },
  {
    slug: 'aayu-os',
    title: 'AAYU OS',
    category: 'RESEARCH LAB',
    status: 'CONCEPT / NEXT BUILD',
    tag: 'Local-First Personal Intelligence',
    summary:
      'Local-first personal intelligence layer centered around human intent, private memory, and local compute that never leaks user telemetry.',
    researchQuestion:
      'How can local vector memories and intent-routing graphs run within strict device compute limits while preserving absolute cryptographic privacy?',
    whatExists:
      'Intent taxonomy, local event graph schema, and privacy-preserving memory indexing designs.',
    whatToBuildNext:
      'Daemon engine written in Rust running local embedding models and context-aware action dispatch.',
    architectureNotes:
      'System Event Stream -> Private Vector Index (SQLite/DuckDB) -> Local Model Dispatcher (Rust/ONNX) -> Human Intent Graph -> Local Action Execution.',
    stack: ['Rust', 'TypeScript', 'Tauri / Wasm', 'SQLite / DuckDB', 'Linux'],
    sprint7Day: [
      { day: 'Day 1', task: 'Design local SQLite event and memory schema.' },
      { day: 'Day 2', task: 'Implement fast intent classification pipeline in Rust.' },
      { day: 'Day 3', task: 'Build lightweight desktop background tray daemon.' },
      { day: 'Day 4', task: 'Add local file and context watchers without polling overhead.' },
      { day: 'Day 5', task: 'Implement AES-256 local encryption for vector index files.' },
      { day: 'Day 6', task: 'Benchmark battery draw and RAM footprint during idle watch.' },
      { day: 'Day 7', task: 'Release initial developer preview specification and architecture manifesto.' },
    ],
    proofExpected: 'Daemon architecture document, local schema migrations, benchmark report, and open demo.',
    githubUrl: 'https://github.com/Minato95-ayu',
    color: '#4CC9F0',
    iconName: 'os',
  },
  {
    slug: 'adumate-research',
    title: 'Adumate Ecosystem',
    category: 'FOUNDER ECOSYSTEM',
    status: 'ACTIVE DIRECTION / FOUNDER',
    tag: 'Founder-Led Product Ecosystem',
    summary:
      'Founder-led product ecosystem where research becomes useful technology for real humans and systems. Founded by Ayush Kaushik.',
    researchQuestion:
      'How can deep-tech systems research be systematically translated into production products without sacrificing mathematical rigor?',
    whatExists:
      'Founder roadmap, primary website domain (https://adumate.in), brand direction, and prototype initiatives.',
    whatToBuildNext:
      'Commercial automation modules and intelligent developer tooling based on verified research prototypes.',
    architectureNotes:
      'Research Lab Prototypes -> Rigorous Verification & Security Gates -> Distributed Cloud & Edge Infrastructure -> Production Adumate Tooling & Products.',
    stack: ['TypeScript', 'Python', 'Go', 'Next.js', 'Distributed Systems', 'Cloud'],
    sprint7Day: [
      { day: 'Day 1', task: 'Consolidate Adumate platform architecture and core service boundaries.' },
      { day: 'Day 2', task: 'Implement zero-telemetry privacy mode across client interfaces.' },
      { day: 'Day 3', task: 'Deploy staging environment on adumate.in infrastructure.' },
      { day: 'Day 4', task: 'Build unified API authentication and access token gate.' },
      { day: 'Day 5', task: 'Containerize micro-services with reproducible Docker targets.' },
      { day: 'Day 6', task: 'Perform penetration audit and automated rate limiting.' },
      { day: 'Day 7', task: 'Publish technical manifesto and product roadmap overview.' },
    ],
    proofExpected: 'Verified domain https://adumate.in, production micro-services, and architectural manifesto.',
    githubUrl: 'https://github.com/Minato95-ayu',
    externalUrl: 'https://adumate.in',
    color: '#C6FF3D',
    iconName: 'adumate',
  },
];

export const ALL_PROJECTS: ProjectData[] = [
  ...FLAGSHIP_SYSTEMS,
  ...PUBLIC_PROJECTS,
  ...RESEARCH_LAB_MODULES,
];
