export interface ChatProvider {
  id: string;
  name: string;
  baseURL: string;
  model: string;
  docsUrl: string;
  type: 'DIRECT' | 'ROUTER';
  role: string;
  summary: string;
}

export const CHAT_PROVIDERS: ChatProvider[] = [
  {
    id: 'groq',
    name: 'Groq',
    baseURL: 'https://api.groq.com/openai/v1',
    model: 'llama-3.3-70b-versatile',
    docsUrl: 'https://console.groq.com/docs/overview',
    type: 'DIRECT',
    role: 'Primary inference',
    summary: 'Direct model inference through Groq’s OpenAI-compatible API.',
  },
  {
    id: 'openrouter',
    name: 'OpenRouter',
    baseURL: 'https://openrouter.ai/api/v1',
    model: 'meta-llama/llama-3.3-70b-instruct:free',
    docsUrl: 'https://openrouter.ai/docs/quickstart',
    type: 'ROUTER',
    role: 'Model gateway',
    summary: 'A unified gateway that routes requests to the configured model.',
  },
  {
    id: 'mistral',
    name: 'Mistral',
    baseURL: 'https://api.mistral.ai/v1',
    model: 'mistral-small-latest',
    docsUrl: 'https://docs.mistral.ai/api/',
    type: 'DIRECT',
    role: 'Fallback inference',
    summary: 'A direct Mistral API endpoint in the server-side fallback chain.',
  },
  {
    id: 'cerebras',
    name: 'Cerebras',
    baseURL: 'https://api.cerebras.ai/v1',
    model: 'llama3.1-8b',
    docsUrl: 'https://inference-docs.cerebras.ai/',
    type: 'DIRECT',
    role: 'Fallback inference',
    summary: 'A direct inference endpoint used when earlier providers are unavailable.',
  },
];
