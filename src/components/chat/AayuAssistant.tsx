import React, { useState, useRef, useEffect } from 'react';
import { sound } from '../../utils/audio.ts';
import { IconNeural } from '../ui/Icons.tsx';
import { AyushAvatarLogo } from '../ui/AyushAvatarLogo.tsx';

interface Message {
  role: 'user' | 'assistant';
  content: string;
  source?: string;
  time: string;
}

const sanitizeChatInput = (value: string): string =>
  value.replace(/[\r\n\u0000-\u001F\u007F]+/g, ' ').replace(/\s+/g, ' ').trim().slice(0, 500);

const SUGGESTED_PROMPTS = [
  'What is AAYU programming language?',
  'Explain Intent-to-Silicon (I2S) research',
  'How does the Adumate provider router work?',
  'What is EUREKA virtual research lab?',
  'What does the job-finder project do?',
  'What is tribev2-main researching?',
  'What is the Orion multi-agent workspace?',
  'What is NeuralForge exploring?',
  'Explain the CompilerX research idea',
  'What is Sentinel AI?',
  'How does Web3 Guard analyze Solidity?',
  'What is AAYU OS?',
  'What technologies does Ayush use?',
  'What is Ayush studying?',
  'What does Ayush teach on YouTube?',
  'How can I contact Ayush?',
  'Can I play chess on this site?',
];

export const AayuAssistant: React.FC<{ onClose: () => void }> = ({ onClose }) => {
  const [selectedProvider, setSelectedProvider] = useState<string>('auto');
  const [messages, setMessages] = useState<Message[]>([
    {
      role: 'assistant',
      content:
        'Ask AAYU is ready. Ask about Ayush’s background, skills, studies, contact links, flagship systems, public repositories, research ideas, or Neural Chess. Try a suggested question below. Answers are based on portfolio information; when an API provider is configured, responses can use that provider, otherwise the built-in knowledge base is used.',
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    },
  ]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isTyping]);

  const handleSend = async (textToSend?: string) => {
    const query = sanitizeChatInput(textToSend || input);
    if (!query || isTyping) return;

    sound.playClick();
    const userTime = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    const newMsg: Message = { role: 'user', content: query, time: userTime };

    setMessages((prev) => [...prev, newMsg]);
    if (!textToSend) setInput('');
    setIsTyping(true);

    try {
      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: query,
          preferredProvider: selectedProvider === 'auto' ? undefined : selectedProvider,
        }),
      });

      const data = await res.json();
      sound.playBlip(880);

      const botTime = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
      setMessages((prev) => [
        ...prev,
        {
          role: 'assistant',
          content: data.reply || 'Transmission received.',
          source: data.source,
          time: botTime,
        },
      ]);
    } catch {
      sound.playClick();
      const botTime = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
      setMessages((prev) => [
        ...prev,
        {
          role: 'assistant',
          content:
            'AAYU System offline response: Ayushh Kaushiq is a Deep-Tech Systems Architect & AI Researcher studying at NIELIT Delhi and building adumate. Explore his verified repositories above or contact him directly at ayushkaushik1441@gmail.com.',
          time: botTime,
        },
      ]);
    } finally {
      setIsTyping(false);
    }
  };

  return (
    <div
      role="dialog"
      aria-label="AAYU AI Assistant Console"
      className="fixed bottom-0 sm:bottom-4 lg:bottom-6 right-0 sm:right-4 lg:right-6 left-0 sm:left-auto w-full sm:max-w-md lg:max-w-lg bg-[#0c1017] border border-[#84cc16]/50 rounded-t-xl sm:rounded-sm shadow-[0_0_40px_rgba(0,0,0,0.85)] flex flex-col h-[88vh] sm:h-[500px] lg:h-[540px] max-h-[calc(100vh-5rem)] animate-fadeIn backdrop-blur-xl z-50"
    >
      {/* Console Header */}
      <div className="p-3 sm:p-3.5 bg-[#131922] border-b border-white/10 flex items-center justify-between gap-2">
        <div className="flex items-center space-x-2 sm:space-x-2.5 min-w-0 flex-1">
          <div className="relative shrink-0">
            <AyushAvatarLogo variant="icon" size={30} interactive={false} />
          </div>
          <div className="min-w-0 flex-1">
            <div className="text-xs font-bold text-white flex items-center gap-2">
              <span className="truncate">ASK AYUSH</span>
              <span className="w-1.5 h-1.5 rounded-full bg-[#C6FF3D] animate-pulse shrink-0" />
            </div>
            <div className="text-[9.5px] sm:text-[10px] font-mono text-white/50 truncate">
              AYUSH KAUSHIK AI AGENT CONSOLE
            </div>
          </div>
        </div>

        <div className="flex items-center gap-1.5 shrink-0">
          {/* Free Provider Selector */}
          <select
            value={selectedProvider}
            onChange={(e) => {
              sound.playClick();
              setSelectedProvider(e.target.value);
            }}
            aria-label="Select AI Inference Provider"
            className="bg-[#0c1017] border border-white/20 text-[#C6FF3D] text-[10px] font-mono rounded px-1.5 py-1 outline-none cursor-pointer hover:border-[#C6FF3D] max-w-[125px] sm:max-w-none"
            title="Powered by mnfst/awesome-free-llm-apis rotation"
          >
            <option value="auto">⚡ Auto Failover</option>
            <option value="groq">Groq (Llama 3.3)</option>
            <option value="openrouter">OpenRouter Free</option>
            <option value="mistral">Mistral Small</option>
            <option value="cerebras">Cerebras CS-3</option>
          </select>

          <button
            type="button"
            onClick={() => {
              sound.playClick();
              onClose();
            }}
            className="p-1 sm:p-1.5 text-white/50 hover:text-white rounded border border-white/10 hover:border-white/20 text-xs font-mono cursor-pointer shrink-0"
          >
            ✕
          </button>
        </div>
      </div>

      {/* Suggested Prompt Chips */}
      <div className="px-3 py-2 bg-[#07090e]/80 border-b border-white/5 overflow-x-auto whitespace-nowrap scrollbar-none flex items-center gap-1.5">
        {SUGGESTED_PROMPTS.map((prompt) => (
          <button
            key={prompt}
            type="button"
            onClick={() => handleSend(prompt)}
            className="text-[11px] font-mono px-2.5 py-1 rounded bg-white/[0.03] hover:bg-[#84cc16]/10 border border-white/10 hover:border-[#84cc16]/40 text-white/70 hover:text-[#84cc16] transition-colors cursor-pointer shrink-0"
          >
            {prompt}
          </button>
        ))}
      </div>

      {/* Messages Stream */}
      <div className="flex-1 p-4 overflow-y-auto space-y-4 font-mono text-xs">
        {messages.map((m, idx) => (
          <div
            key={idx}
            className={`flex flex-col ${
              m.role === 'user' ? 'items-end' : 'items-start'
            }`}
          >
            <div className="text-[10px] text-white/40 mb-1 flex items-center gap-2">
              <span>{m.role === 'user' ? 'GUEST' : 'AAYU AI'}</span>
              <span>·</span>
              <span>{m.time}</span>
              {m.source && (
                <span className="text-[#84cc16] text-[9px] px-1 py-0.2 rounded bg-[#84cc16]/10">
                  [{m.source}]
                </span>
              )}
            </div>

            <div
              className={`max-w-[88%] p-3 rounded-sm leading-relaxed ${
                m.role === 'user'
                  ? 'bg-[#84cc16]/15 border border-[#84cc16]/40 text-[#f8fafc]'
                  : 'bg-[#131922] border border-white/10 text-white/90'
              }`}
            >
              {m.content}
            </div>
          </div>
        ))}

        {isTyping && (
          <div className="flex items-center space-x-2 text-[11px] text-[#84cc16] font-mono">
            <span className="w-1.5 h-1.5 rounded-full bg-[#84cc16] animate-ping" />
            <span>AAYU Intelligence is synthesizing response...</span>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Input Console Bar */}
      <form
        onSubmit={(e) => {
          e.preventDefault();
          handleSend();
        }}
        className="p-3 bg-[#131922] border-t border-white/10 flex items-center gap-2"
      >
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Ask about research, CompilerX, EUREKA, chess..."
          className="flex-1 bg-[#07090e] border border-white/10 focus:border-[#84cc16] rounded px-3 py-2 text-xs text-white placeholder-white/30 focus:outline-none font-mono"
        />
        <button
          type="submit"
          disabled={!input.trim() || isTyping}
          className="px-4 py-2 bg-[#84cc16] hover:bg-[#a3e635] disabled:opacity-40 text-[#07090e] font-mono text-xs font-bold rounded transition-colors cursor-pointer"
        >
          SEND →
        </button>
      </form>
    </div>
  );
};
