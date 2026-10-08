/**
 * Awesome Free LLM APIs Catalog & Multi-Provider Rotation Service
 * Curated from: https://github.com/mnfst/awesome-free-llm-apis
 * Integrates into Adumate Platform and AAYU Assistant for zero-cost, resilient AI execution.
 */

export interface FreeLLMProvider {
  id: string;
  name: string;
  baseURL: string;
  models: string[];
  recommendedModel: string;
  freeTierLimits: string;
  authHeader: string;
  envKeyName: string;
  isOpenAICompatible: boolean;
  category: 'direct-provider' | 'gateway-router' | 'specialized';
  speedRating: 'Ultra-Fast' | 'Fast' | 'Standard';
  features: string[];
  docsUrl: string;
}

export const AWESOME_FREE_LLM_PROVIDERS: FreeLLMProvider[] = [
  {
    id: 'nvidia-nim',
    name: 'NVIDIA NIM Microservices',
    baseURL: 'https://integrate.api.nvidia.com/v1',
    models: ['meta/llama-3.1-70b-instruct', 'mistralai/mistral-large-2-instruct', 'nvidia/llama-3.1-nemotron-70b-instruct'],
    recommendedModel: 'meta/llama-3.1-70b-instruct',
    freeTierLimits: '1,000 free credits on sign up (NVIDIA Developer)',
    authHeader: 'Authorization: Bearer <NVIDIA_API_KEY>',
    envKeyName: 'NVIDIA_API_KEY',
    isOpenAICompatible: true,
    category: 'direct-provider',
    speedRating: 'Ultra-Fast',
    features: ['TensorRT-LLM optimized', 'Strict enterprise SLA', 'Zero retention'],
    docsUrl: 'https://build.nvidia.com',
  },
  {
    id: 'mistral',
    name: 'Mistral AI (La Plateforme)',
    baseURL: 'https://api.mistral.ai/v1',
    models: ['mistral-small-latest', 'open-mistral-nemo', 'codestral-latest'],
    recommendedModel: 'mistral-small-latest',
    freeTierLimits: 'Experimenter tier: 1 req/sec free rate limit',
    authHeader: 'Authorization: Bearer <MISTRAL_API_KEY>',
    envKeyName: 'MISTRAL_API_KEY',
    isOpenAICompatible: true,
    category: 'direct-provider',
    speedRating: 'Fast',
    features: ['European privacy standards', 'Codestral programming optimization', 'JSON mode'],
    docsUrl: 'https://console.mistral.ai/api-keys',
  },
  {
    id: 'together',
    name: 'Together AI',
    baseURL: 'https://api.together.xyz/v1',
    models: ['meta-llama/Meta-Llama-3.1-8B-Instruct-Turbo', 'mistralai/Mixtral-8x7B-Instruct-v0.1'],
    recommendedModel: 'meta-llama/Meta-Llama-3.1-8B-Instruct-Turbo',
    freeTierLimits: '$5 free trial credit with low latency endpoints',
    authHeader: 'Authorization: Bearer <TOGETHER_API_KEY>',
    envKeyName: 'TOGETHER_API_KEY',
    isOpenAICompatible: true,
    category: 'direct-provider',
    speedRating: 'Ultra-Fast',
    features: ['FlashAttention-3', 'Fine-tuning ready', 'Fast token streaming'],
    docsUrl: 'https://api.together.xyz/settings/api-keys',
  },
  {
    id: 'cerebras',
    name: 'Cerebras Inference',
    baseURL: 'https://api.cerebras.ai/v1',
    models: ['llama3.1-8b', 'llama3.1-70b'],
    recommendedModel: 'llama3.1-8b',
    freeTierLimits: 'Free tier with wafer-scale engine speed (up to 2,000 tokens/sec)',
    authHeader: 'Authorization: Bearer <CEREBRAS_API_KEY>',
    envKeyName: 'CEREBRAS_API_KEY',
    isOpenAICompatible: true,
    category: 'specialized',
    speedRating: 'Ultra-Fast',
    features: ['1,800+ tokens/sec', 'Wafer Scale Engine CS-3', 'Zero latency stutter'],
    docsUrl: 'https://cloud.cerebras.ai',
  },
  {
    id: 'sambanova',
    name: 'SambaNova Cloud',
    baseURL: 'https://api.sambanova.ai/v1',
    models: ['Meta-Llama-3.1-70B-Instruct', 'Meta-Llama-3.1-405B-Instruct'],
    recommendedModel: 'Meta-Llama-3.1-70B-Instruct',
    freeTierLimits: 'Free developer tier for Llama-3.1-70B and 405B on SN40L chips',
    authHeader: 'Authorization: Bearer <SAMBANOVA_API_KEY>',
    envKeyName: 'SAMBANOVA_API_KEY',
    isOpenAICompatible: true,
    category: 'specialized',
    speedRating: 'Ultra-Fast',
    features: ['Reconfigurable Dataflow Unit (RDU)', 'Full 405B execution', 'OpenAI compatible'],
    docsUrl: 'https://cloud.sambanova.ai',
  },
];
