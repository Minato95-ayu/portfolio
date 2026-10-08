import 'dotenv/config';
import express, { Request, Response } from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import { z } from 'zod';
import { ALL_PROJECTS, PROFILE_DATA } from './src/data/projectsData.ts';
import { AWESOME_FREE_LLM_PROVIDERS } from './src/data/freeLlmApis.ts';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT ? parseInt(process.env.PORT, 10) : 3000;
const isProduction = process.env.NODE_ENV === 'production';

app.use(express.json());

// In-memory rate limiting map for contact form
const contactRateLimits = new Map<string, number>();

// --- API Endpoints ---

// GET /api/health
app.get('/api/health', (_req: Request, res: Response) => {
  res.json({
    status: 'ok',
    system: 'AAYU Neural Console',
    timestamp: new Date().toISOString(),
    version: '1.0.0',
    environment: isProduction ? 'production' : 'development',
  });
});

// GET /api/projects
app.get('/api/projects', (_req: Request, res: Response) => {
  const summarized = ALL_PROJECTS.map((p) => ({
    slug: p.slug,
    title: p.title,
    category: p.category,
    status: p.status,
    tag: p.tag,
    summary: p.summary,
    stack: p.stack,
    githubUrl: p.githubUrl,
  }));
  res.json({
    total: summarized.length,
    projects: summarized,
  });
});

// GET /api/projects/:slug
app.get('/api/projects/:slug', (req: Request, res: Response) => {
  const slug = req.params.slug.toLowerCase();
  const project = ALL_PROJECTS.find((p) => p.slug.toLowerCase() === slug);
  if (!project) {
    res.status(404).json({ error: 'Project not found', slug });
    return;
  }
  res.json({ project });
});

// Zod schema for contact request
const ContactSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters').max(100),
  email: z.string().email('Invalid email address'),
  interest: z.string().min(1, 'Please select an area of interest').max(100),
  message: z.string().min(10, 'Message must be at least 10 characters').max(2000),
  _gotcha: z.string().optional(), // Honeypot field
});

// GET /api/free-llms
app.get('/api/free-llms', (_req: Request, res: Response) => {
  res.json({
    total: AWESOME_FREE_LLM_PROVIDERS.length,
    source: 'https://github.com/mnfst/awesome-free-llm-apis',
    description: 'Curated list of permanently free LLM APIs for Adumate rotation & zero-cost execution',
    providers: AWESOME_FREE_LLM_PROVIDERS,
  });
});

// POST /api/chat (AI Assistant for AAYU Portfolio with mnfst/awesome-free-llm-apis multi-provider rotation)
app.post('/api/chat', async (req: Request, res: Response) => {
  const { message, preferredProvider } = req.body;
  if (!message || typeof message !== 'string') {
    res.status(400).json({ error: 'Message is required' });
    return;
  }

  const systemPrompt = `You are "Ask AAYU", the interactive AI assistant for Ayush Kaushik's cinematic 3D portfolio (https://adumate.in).
Your role is to explain Ayush's research, engineering architecture, background, and public work with technical precision and zero hype.
Integrated via Adumate and powered by the mnfst/awesome-free-llm-apis provider rotation network.

VERIFIED FACTS ABOUT AYUSH KAUSHIK / AAYU:
- Name: Ayush Kaushik (also Ayushh Kaushiq, he/him)
- Role: Deep-Tech Systems Architect & AI Researcher
- Founder entity: Adumate (website: https://adumate.in)
- Location: Delhi, India
- Background: B.Sc. Mathematics (Hons), BRABU Muzaffarpur, expected 2027 · NIELIT Delhi
- Developer path: Self-taught full-stack + AI/ML developer. Teaches students part-time.
- YouTube channel: "How Computers Think — Zero to Research" (https://youtube.com/@ayushkaushik08)
- Email: ayushkaushik1441@gmail.com
- GitHub: https://github.com/Minato95-ayu (6 followers, 14 following, Pull Shark x2, Quickdraw, YOLO, Pair Extraordinaire)
- LinkedIn: https://www.linkedin.com/in/ayushh-kaushiq-1a950825a
- Flagship Systems Built From Scratch:
  1. AAYU Programming Language: Deterministic memory management, zero-cost neural tensor bindings, AST parser in Rust, LLVM/MLIR lowering pipeline
  2. Intent-to-Silicon (I2S) Research: Direct compilation of declarative neural intent to hardware instruction set micro-ops without VM/driver runtime overhead
  3. Adumate Platform: Production platform at adumate.in featuring AI API rotation (powered by mnfst/awesome-free-llm-apis), latency-aware provider failover, service discovery, and privacy mesh
- Core Public Repositories:
  1. EUREKA: AI-powered virtual research lab (multimodal, 3D simulations with Three.js, MediaPipe gesture, RDKit, Docker)
  2. job-finder: Career intelligence with ATS semantic parser, Redis vector cache, and scam heuristics
  3. tribev2-main: Multimodal brain-encoding Transformer mapping audio/video/text to cortical fMRI responses (PyTorch Lightning, Nilearn, Slurm)
  4. school: Public Flutter/Dart cross-platform foundation
  5. mirofish-to-orian: Orion multi-agent simulation workspace with GraphRAG and D3.js
- Technical Areas:
  - Languages: ${PROFILE_DATA.technologies.join(', ')}
  - Interests: ${PROFILE_DATA.interests.join(', ')}
- Project details from this portfolio (including implementation status, summaries, current work, next steps, and stacks):
${ALL_PROJECTS.map((project) => `  - ${project.title} [${project.status}]: ${project.summary} Existing work: ${project.whatExists} Next: ${project.whatToBuildNext} Stack: ${project.stack.join(', ')}`).join('\n')}
- Research Lab Missions (Concepts & Next Builds):
  1. NeuralForge (Brain-inspired AI runtime, synaptic plasticity, continuous learning)
  2. CompilerX (DL compiler optimization, MLIR/LLVM lowering, kernel fusion closer to the metal)
  3. Sentinel AI (Adversarial red-teaming, cryptographic guardrails)
  4. Web3 Guard (Solidity security intelligence, symbolic execution)
  5. AAYU OS (Local-first personal intelligence layer, privacy-preserving)
  6. Adumate (Founder-led product ecosystem)

Rules:
- Speak directly, concisely, and technically. Answer ONLY from these verified facts. Never invent clients, user numbers, degrees, or awards.
- Clearly distinguish public/active work from concepts and next builds using each project's status.
- If a detail is not in the portfolio facts, say it is not specified and point to the contact links instead of guessing.
- For questions about skills, education, location, repositories, research, contact, or chess, use the matching facts above and give a useful direct answer.
- If asked about playing chess, point the user to the integrated Neural Chess engine on the page!`;

  // Helper function to call OpenAI-compatible free providers (Groq, OpenRouter, etc.)
  const callCompatibleProvider = async (provider: typeof AWESOME_FREE_LLM_PROVIDERS[0]): Promise<string | null> => {
    const key = process.env[provider.envKeyName];
    if (!key || key.includes('MY_') || !provider.isOpenAICompatible) return null;
    try {
      const fetchController = new AbortController();
      const timeoutId = setTimeout(() => fetchController.abort(), 6000);

      const response = await fetch(`${provider.baseURL}/chat/completions`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${key}`,
        },
        body: JSON.stringify({
          model: provider.recommendedModel,
          messages: [
            { role: 'system', content: systemPrompt },
            { role: 'user', content: message },
          ],
          temperature: 0.7,
        }),
        signal: fetchController.signal,
      });
      clearTimeout(timeoutId);

      if (response.ok) {
        const data = (await response.json()) as any;
        return data.choices?.[0]?.message?.content || null;
      } else {
        const errText = await response.text();
        console.warn(`[FAILOVER] Provider ${provider.name} returned HTTP ${response.status}:`, errText.slice(0, 150));
      }
    } catch (err: any) {
      console.warn(`[FAILOVER] Provider ${provider.name} error:`, err?.message || err);
    }
    return null;
  };

  // 1. If explicit provider chosen
  if (preferredProvider && preferredProvider !== 'auto') {
    const prov = AWESOME_FREE_LLM_PROVIDERS.find((p) => p.id === preferredProvider);
    if (prov) {
      const text = await callCompatibleProvider(prov);
      if (text) {
        res.json({ reply: text, source: `${prov.name} (${prov.recommendedModel})` });
        return;
      }
    }
  }

  // Try configured free LLM providers in rotation
  for (const provider of AWESOME_FREE_LLM_PROVIDERS) {
    const replyText = await callCompatibleProvider(provider);
    if (replyText) {
      res.json({ reply: replyText, source: `${provider.name} (${provider.recommendedModel})` });
      return;
    }
  }

  // Deterministic Knowledge Engine Fallback
  const q = message.toLowerCase();
  let reply = '';

  if (q.includes('who') || q.includes('about') || q.includes('ayush kaushik')) {
    reply = `Ayush Kaushik (branded as AAYU) is a Deep-Tech Systems Architect & AI Researcher based in Delhi, India. He is the founder of Adumate (https://adumate.in), creator of the AAYU programming language and Intent-to-Silicon (I2S) research, and host of "How Computers Think — Zero to Research" on YouTube. He has a B.Sc. Mathematics (Hons) background from BRABU Muzaffarpur (expected 2027) and studies at NIELIT Delhi.`;
  } else if (
    q.includes('skill') ||
    q.includes('technolog') ||
    q.includes('tech stack') ||
    q.includes('what languages') ||
    q.includes('which languages')
  ) {
    reply = `Ayush's listed technologies include ${PROFILE_DATA.technologies.join(', ')}. His research interests include ${PROFILE_DATA.interests.join(', ')}.`;
  } else if (q.includes('education') || q.includes('study') || q.includes('college') || q.includes('degree')) {
    reply = `Ayush's listed background is ${PROFILE_DATA.education}.`;
  } else if (q.includes('location') || q.includes('where')) {
    reply = `Ayush is based in ${PROFILE_DATA.location}.`;
  } else if (q.includes('github') || q.includes('repository') || q.includes('repos')) {
    reply = `Ayush's public repositories listed here are EUREKA (https://github.com/Minato95-ayu/EUREKA), job-finder (https://github.com/Minato95-ayu/job-finder), tribev2-main (https://github.com/Minato95-ayu/tribev2-main), school (https://github.com/Minato95-ayu/school), and mirofish-to-orian (https://github.com/Minato95-ayu/mirofish-to-orian).`;
  } else if (q.includes('job-finder') || q.includes('career project')) {
    reply = `job-finder is documented as a career-intelligence project covering resume ATS analysis, semantic job discovery, scam/fraud analysis, salary insights, and a career assistant. Its listed architecture includes React/Vite/TypeScript, Node.js, Redis, and PostgreSQL. See https://github.com/Minato95-ayu/job-finder.`;
  } else if (q.includes('orion') || q.includes('mirofish')) {
    reply = `mirofish-to-orian documents Orion, a multi-agent simulation workspace with document ingestion, GraphRAG-style knowledge construction, agent simulations, prediction reports, and a D3.js graph visualizer. See https://github.com/Minato95-ayu/mirofish-to-orian.`;
  } else if (q.includes('school') || q.includes('flutter')) {
    reply = `The school repository is documented as a public Flutter and Dart cross-platform foundation supporting Android, iOS, Linux, macOS, web, and Windows. See https://github.com/Minato95-ayu/school.`;
  } else if (q.includes('contact') || q.includes('email') || q.includes('hire') || q.includes('linkedin')) {
    reply = `You can reach Ayush at ${PROFILE_DATA.links.email}, on LinkedIn (${PROFILE_DATA.links.linkedin}), or through the Contact section.`;
  } else if (q.includes('youtube') || q.includes('channel') || q.includes('teach')) {
    reply = `Ayush hosts "${PROFILE_DATA.youtube.channelName}" (${PROFILE_DATA.youtube.url}). ${PROFILE_DATA.youtube.description} He also teaches students part-time.`;
  } else if (q.includes('aayu lang') || q.includes('language') || q.includes('programming language')) {
    reply = `The AAYU Programming Language is Ayush's original systems language designed for deterministic memory management, zero-cost neural tensor bindings, and explicit compiler-guided hardware execution using a custom Rust parser and LLVM/MLIR lowering.`;
  } else if (q.includes('i2s') || q.includes('silicon') || q.includes('intent-to-silicon')) {
    reply = `Intent-to-Silicon (I2S) is Ayush's research initiative mapping declarative neural intent directly into hardware instruction set micro-ops, eliminating intermediate virtual machine and driver stack latency.`;
  } else if (q.includes('adumate')) {
    reply = `Adumate (https://adumate.in) is the founder-led product platform created by Ayush Kaushik, featuring dynamic AI API rotation, multi-provider failover, service discovery, and zero-telemetry privacy routing.`;
  } else if (q.includes('eureka')) {
    reply = `EUREKA is Ayush's AI-powered virtual research lab repository on GitHub. It features multimodal context reasoning, real-time 3D simulations via Three.js, MediaPipe gesture tracking, and RDKit molecular structure exploration in Docker containers. (Repo: github.com/Minato95-ayu/EUREKA)`;
  } else if (q.includes('compiler') || q.includes('compilerx')) {
    reply = `CompilerX is Ayush's deep-learning compiler optimization lab concept. It focuses on polyhedral loop transformations, intermediate representation (MLIR/LLVM) lowering, and automated kernel fusion closer to bare-metal silicon.`;
  } else if (q.includes('neuralforge') || q.includes('brain')) {
    reply = `NeuralForge is a brain-inspired AI runtime research concept investigating sparse dendritic plasticity and episodic vector memory buffers to overcome catastrophic forgetting in continuous multi-task learning.`;
  } else if (q.includes('sentinel')) {
    reply = `Sentinel AI is a research concept for adversarial testing and cryptographic guardrails for intelligent systems. The portfolio lists prompt-injection fuzzing specifications and verified weight-hash protocols as existing design work; automated red-teaming and output verification are proposed next builds.`;
  } else if (q.includes('web3') || q.includes('solidity') || q.includes('smart contract')) {
    reply = `Web3 Guard is a research concept for Solidity security analysis using formal invariants and AST symbolic execution. Its documented next build is an EVM bytecode symbolic-execution runner with remediation suggestions.`;
  } else if (q.includes('aayu os') || q.includes('local-first')) {
    reply = `AAYU OS is a local-first personal intelligence concept focused on private memory and on-device compute. It is listed as a concept/next build, not a shipped product.`;
  } else if (q.includes('tribe') || q.includes('fmri')) {
    reply = `tribev2-main is Ayush's public multimodal brain-encoding research project, mapping video, audio, and text representations directly to cortical fMRI responses using PyTorch Lightning and Nilearn.`;
  } else if (q.includes('chess')) {
    reply = `You can play chess against the AAYU Neural Bot right on this website! The board features an interactive 8x8 matrix, Alpha-Minimax depth evaluation, captured pieces tracking, and cybernetic micro-audio feedback.`;
  } else if (q.includes('contact') || q.includes('email') || q.includes('hire')) {
    reply = `You can reach Ayush Kaushik directly at ayushkaushik1441@gmail.com, on LinkedIn (linkedin.com/in/ayushh-kaushiq-1a950825a), or via the Contact console at the bottom of the page.`;
  } else if (q.includes('project') || q.includes('portfolio') || q.includes('built')) {
    reply = `The portfolio highlights three flagship systems: the AAYU programming language, Intent-to-Silicon research, and Adumate. Public work includes EUREKA, job-finder, tribev2-main, school, and mirofish-to-orian. Research concepts include NeuralForge, CompilerX, Sentinel AI, Web3 Guard, and AAYU OS. Some research items are concepts or next builds, not shipped products.`;
  } else {
    reply = `I can answer from the portfolio about Ayush's background, skills, studies, AAYU language, Intent-to-Silicon, Adumate, public repositories, research concepts, YouTube channel, contact links, and Neural Chess. Ask about a specific topic, and I’ll stick to the documented facts.`;
  }

  res.json({ reply, source: 'knowledge-engine' });
});

// POST /api/contact
app.post('/api/contact', (req: Request, res: Response) => {
  const clientIp = (req.headers['x-forwarded-for'] as string) || req.socket.remoteAddress || 'unknown';
  const now = Date.now();
  const lastRequest = contactRateLimits.get(clientIp);

  // Rate limit: 1 request every 15 seconds per IP
  if (lastRequest && now - lastRequest < 15000) {
    res.status(429).json({
      error: 'Too many requests. Please wait a few seconds before dispatching another message.',
    });
    return;
  }

  const parsed = ContactSchema.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({
      error: 'Validation failed',
      details: parsed.error.issues.map((i) => ({ field: i.path.join('.'), message: i.message })),
    });
    return;
  }

  // Honeypot check
  if (parsed.data._gotcha && parsed.data._gotcha.trim().length > 0) {
    // Silently acknowledge bots without processing
    res.json({ success: true, message: 'Message logged.' });
    return;
  }

  contactRateLimits.set(clientIp, now);

  // Log contact submission cleanly
  console.log(`[CONTACT RECEIVED] From: ${parsed.data.name} <${parsed.data.email}> | Focus: ${parsed.data.interest}`);

  res.json({
    success: true,
    message: 'Message registered successfully. Direct backup: ayushkaushik1441@gmail.com',
    receivedAt: new Date().toISOString(),
  });
});

// --- Vite Dev Server Middleware or Static Production Serving ---
async function startServer() {
  if (!isProduction) {
    const { createServer: createViteServer } = await import('vite');
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.resolve(__dirname, 'dist');
    app.use(express.static(distPath));
    app.get('*', (_req: Request, res: Response) => {
      res.sendFile(path.resolve(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`[AAYU SERVER] Running on http://0.0.0.0:${PORT} (${isProduction ? 'prod' : 'dev'})`);
  });
}

startServer().catch((err) => {
  console.error('Failed to initialize AAYU server:', err);
  process.exit(1);
});
