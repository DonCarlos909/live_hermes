import { useEffect, useRef, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Send, Trash2, ChevronRight } from 'lucide-react'
import { useHermesStore } from '../../store/hermes'
import type { ChatMode } from '../../store/types'

const CHAT_MODES: { id: ChatMode; label: string; color: string }[] = [
  { id: 'chat', label: 'CHAT', color: '#00d4ff' },
  { id: 'tactical', label: 'TACTICAL', color: '#8b5cf6' },
  { id: 'coding', label: 'CODING', color: '#22d3ee' },
  { id: 'ctf', label: 'CTF', color: '#ff2d55' },
  { id: 'research', label: 'RESEARCH', color: '#f0f0ff' },
  { id: 'autonomous', label: 'AUTO', color: '#fbbf24' },
]

export default function BottomChat() {
  const messages = useHermesStore((s) => s.messages)
  const streamingText = useHermesStore((s) => s.streamingText)
  const isStreaming = useHermesStore((s) => s.isStreaming)
  const chatMode = useHermesStore((s) => s.chatMode)
  const addMessage = useHermesStore((s) => s.addMessage)
  const appendStream = useHermesStore((s) => s.appendStream)
  const finishStream = useHermesStore((s) => s.finishStream)
  const clearChat = useHermesStore((s) => s.clearChat)
  const setChatMode = useHermesStore((s) => s.setChatMode)
  const setAvatarState = useHermesStore((s) => s.setAvatarState)

  const [input, setInput] = useState('')
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages, streamingText])

  const handleSend = () => {
    if (!input.trim()) return
    const text = input.trim()
    setInput('')

    addMessage({ role: 'user', content: text, mode: chatMode })
    setAvatarState('thinking')

    // Simulate Hermes response
    setTimeout(() => {
      setAvatarState('speaking')
      const responses: Record<ChatMode, string> = {
        chat: `Acknowledged, Operator. Processing: "${text}". All systems analyzing your request. I'll have results momentarily.`,
        tactical: `[TACTICAL] Analyzing input: "${text}". Scanning threat vectors... No immediate dangers detected. Standing by for further orders.`,
        coding: `> Processing command: "${text}"\n> Compiling response...\n> Output: Command received. Executing build pipeline. Check terminal for live output.`,
        ctf: `[CTF MODE] Target acquired: "${text}". Initiating reconnaissance sequence. Exploit modules loaded. Awaiting engagement authorization.`,
        research: `[RESEARCH] Query logged: "${text}". Cross-referencing knowledge base... Found 12 relevant sources. Synthesizing response.`,
        autonomous: `[AUTONOMOUS] Directive accepted: "${text}". Delegating to agent swarm. I'll report back when all tasks complete.`,
      }

      const fullText = responses[chatMode] || responses.chat
      let i = 0
      const interval = setInterval(() => {
        if (i < fullText.length) {
          appendStream(fullText[i])
          i++
        } else {
          clearInterval(interval)
          finishStream()
          setAvatarState('idle')
        }
      }, 15)
    }, 800)
  }

  return (
    <div className="bottom-chat flex flex-col h-full">
      {/* Mode selector */}
      <div className="flex items-center gap-1 px-3 py-1.5 border-b border-white/5 bg-black/30">
        {CHAT_MODES.map((m) => (
          <button
            key={m.id}
            onClick={() => setChatMode(m.id)}
            className="mode-tab"
            style={{
              color: chatMode === m.id ? m.color : '#555',
              borderColor: chatMode === m.id ? `${m.color}44` : 'transparent',
              textShadow: chatMode === m.id ? `0 0 8px ${m.color}` : 'none',
            }}
          >
            {m.label}
          </button>
        ))}
        <div className="flex-1" />
        <button onClick={clearChat} className="text-[#555] hover:text-[#ff2d55] transition-colors p-1" title="Clear chat">
          <Trash2 size={14} />
        </button>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto px-4 py-3 space-y-3 scrollbar-thin">
        <AnimatePresence>
          {messages.map((msg) => (
            <motion.div
              key={msg.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              className={`chat-message ${msg.role === 'user' ? 'ml-auto' : ''}`}
            >
              <div
                className="chat-bubble"
                style={{
                  borderColor: msg.role === 'user' ? '#00d4ff33' : msg.role === 'system' ? '#8b5cf633' : '#ff2d5533',
                  background: msg.role === 'user' ? '#00d4ff08' : msg.role === 'system' ? '#8b5cf608' : '#ff2d5508',
                }}
              >
                <span className="chat-role" style={{ color: msg.role === 'user' ? '#00d4ff' : msg.role === 'system' ? '#8b5cf6' : '#ff2d55' }}>
                  {msg.role === 'user' ? '>' : msg.role === 'system' ? '[SYS]' : 'HERMES ▸'}
                </span>
                <p className="chat-content">{msg.content}</p>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>

        {/* Streaming text */}
        {isStreaming && streamingText && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="chat-message"
          >
            <div className="chat-bubble" style={{ borderColor: '#ff2d5533', background: '#ff2d5508' }}>
              <span className="chat-role" style={{ color: '#ff2d55' }}>HERMES ▸</span>
              <p className="chat-content">
                {streamingText}
                <span className="cursor-blink">█</span>
              </p>
            </div>
          </motion.div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input */}
      <div className="px-4 py-3 border-t border-white/5 bg-black/40">
        <div className="flex items-center gap-2 bg-white/5 rounded-lg px-3 py-2 border border-white/10 focus-within:border-[#00d4ff44] transition-colors">
          <ChevronRight size={16} className="text-[#00d4ff] shrink-0" />
          <input
            ref={inputRef}
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSend()}
            placeholder="Enter command..."
            className="flex-1 bg-transparent text-[#f0f0ff] text-sm font-mono outline-none placeholder:text-white/20"
          />
          <button
            onClick={handleSend}
            className="text-[#00d4ff] hover:text-[#22d3ee] transition-colors p-1"
          >
            <Send size={16} />
          </button>
        </div>
      </div>
    </div>
  )
}
