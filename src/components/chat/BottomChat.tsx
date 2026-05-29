import { useEffect, useRef, useState, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Send, Trash2, Settings, ArrowRightLeft } from 'lucide-react'
import { useHermesStore } from '../../store/hermes'
import type { ChatMode } from '../../store/types'

const CHAT_MODES: { id: ChatMode; label: string; color: string }[] = [
  { id: 'chat', label: 'CHAT', color: '#00e8ff' },
  { id: 'tactical', label: 'TACTICAL', color: '#8b5cf6' },
  { id: 'coding', label: 'CODING', color: '#00c8e8' },
  { id: 'ctf', label: 'CTF', color: '#ff2244' },
  { id: 'research', label: 'RESEARCH', color: '#d8eeff' },
  { id: 'autonomous', label: 'AUTO', color: '#e8a020' },
]

const RESPONSES: Record<string, string> = {
  chat: 'Acknowledged, Operator. Processing request. All systems analyzing. Results incoming.',
  tactical: '[TACTICAL MODE] Input logged. Scanning operational parameters. Standing by.',
  coding: '> Command received. Compiling response.\n> Output: Executing build pipeline.',
  ctf: '[CTF MODE] Target locked. Reconnaissance modules engaged. Awaiting engagement auth.',
  research: '[RESEARCH] Query cross-referenced. Found relevant sources. Synthesizing.',
  autonomous: '[AUTONOMOUS] Directive accepted. Delegating to agent swarm. Reporting on completion.',
}

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

  const modeColor = CHAT_MODES.find((m) => m.id === chatMode)?.color ?? '#00e8ff'

  const handleSend = useCallback(() => {
    if (!input.trim() || isStreaming) return
    const text = input.trim()
    setInput('')

    addMessage({ role: 'user', content: text, mode: chatMode })
    setAvatarState('thinking')

    setTimeout(() => {
      setAvatarState('speaking' as any)
      const fullText = RESPONSES[chatMode] ?? RESPONSES.chat
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
      }, 12)
    }, 600)
  }, [input, isStreaming, chatMode, addMessage, appendStream, finishStream, setAvatarState])

  const getTagStyle = (role: string): { tag: string; color: string } => {
    switch (role) {
      case 'system': return { tag: '[SYS]', color: 'var(--amber-sys)' }
      case 'user': return { tag: 'USER', color: '#ffffff' }
      default: return { tag: 'HERMES', color: 'var(--cyan-primary)' }
    }
  }

  return (
    <div className="bottom-chat" style={{ display: 'flex', flexDirection: 'column', flexShrink: 0 }}>
      {/* Tab bar */}
      <div
        style={{
          height: 36,
          display: 'flex',
          alignItems: 'center',
          padding: '0 12px',
          gap: 2,
          borderBottom: '1px solid var(--border-panel)',
          background: 'var(--bg-surface)',
          flexShrink: 0,
        }}
      >
        <span
          style={{
            fontSize: 10,
            color: modeColor,
            marginRight: 4,
            fontFamily: 'var(--font-display)',
            fontWeight: 700,
          }}
        >
          &#9654;
        </span>
        {CHAT_MODES.map((m) => (
          <button
            key={m.id}
            onClick={() => setChatMode(m.id)}
            className="mode-tab"
            style={{
              color: chatMode === m.id ? m.color : 'var(--text-secondary)',
              borderColor: chatMode === m.id ? m.color + '44' : 'transparent',
              borderBottom: chatMode === m.id ? `2px solid ${m.color}` : '2px solid transparent',
              textShadow: chatMode === m.id ? `0 0 8px ${m.color}` : 'none',
              padding: '4px 10px',
            }}
          >
            {m.label}
          </button>
        ))}
        <div style={{ flex: 1 }} />
        <button
          onClick={clearChat}
          style={{
            color: 'var(--text-secondary)',
            background: 'none',
            border: 'none',
            cursor: 'pointer',
            padding: '4px 6px',
            display: 'flex',
            alignItems: 'center',
          }}
          title="Clear chat"
        >
          <Trash2 size={13} />
        </button>
      </div>

      {/* Messages */}
      <div
        style={{
          flex: 1,
          overflowY: 'auto',
          padding: '8px 16px',
          background: 'var(--bg-surface)',
          minHeight: 0,
        }}
      >
        <AnimatePresence initial={false}>
          {messages.map((msg) => {
            const { tag, color } = getTagStyle(msg.role)
            return (
              <motion.div
                key={msg.id}
                initial={{ opacity: 0, y: 6 }}
                animate={{ opacity: 1, y: 0 }}
                style={{
                  marginBottom: 8,
                  textAlign: msg.role === 'user' ? 'right' : 'left',
                }}
              >
                <div
                  className={`chat-message ${msg.role === 'user' ? 'ml-auto' : ''}`}
                  style={{
                    display: 'inline-block',
                    textAlign: 'left',
                    borderLeft:
                      msg.role === 'system'
                        ? '2px solid var(--amber-sys)'
                        : msg.role === 'hermes'
                        ? '2px solid var(--cyan-primary)'
                        : '2px solid rgba(255,255,255,0.2)',
                    paddingLeft: 10,
                  }}
                >
                  <span className="chat-role" style={{ color }}>
                    {tag} &#9654;
                  </span>
                  <p
                    className="chat-content"
                    style={{
                      textTransform: msg.role === 'system' ? 'uppercase' : 'none',
                      fontSize: 12,
                    }}
                  >
                    {msg.content}
                  </p>
                </div>
              </motion.div>
            )
          })}
        </AnimatePresence>

        {/* Streaming */}
        {isStreaming && streamingText && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} style={{ marginBottom: 8 }}>
            <div style={{ borderLeft: '2px solid var(--cyan-primary)', paddingLeft: 10 }}>
              <span className="chat-role" style={{ color: 'var(--cyan-primary)' }}>
                HERMES &#9654;
              </span>
              <p className="chat-content">
                {streamingText}
                <span className="cursor-blink">&#9608;</span>
              </p>
            </div>
          </motion.div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input bar */}
      <div
        style={{
          height: 44,
          display: 'flex',
          alignItems: 'center',
          padding: '0 12px',
          borderTop: '1px solid var(--border-panel)',
          background: 'var(--bg-surface)',
          gap: 8,
          flexShrink: 0,
        }}
      >
        <span style={{ color: modeColor, fontSize: 16, flexShrink: 0 }}>&#9654;</span>
        <input
          ref={inputRef}
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && handleSend()}
          placeholder="Enter command..."
          className="cmd-input"
          style={{ flex: 1, minWidth: 0 }}
        />
        <button
          title="Quick settings"
          style={{
            color: 'var(--text-secondary)',
            background: 'none',
            border: '1px solid var(--border-panel)',
            borderRadius: 4,
            padding: '4px 6px',
            cursor: 'pointer',
            display: 'flex',
            flexShrink: 0,
          }}
        >
          <Settings size={13} />
        </button>
        <button
          title="Submit"
          onClick={handleSend}
          style={{
            color: modeColor,
            background: 'none',
            border: '1px solid ' + modeColor + '44',
            borderRadius: 4,
            padding: '4px 6px',
            cursor: 'pointer',
            display: 'flex',
            flexShrink: 0,
          }}
        >
          <ArrowRightLeft size={13} />
        </button>
      </div>
    </div>
  )
}
