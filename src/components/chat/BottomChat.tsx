import { useEffect, useRef, useState, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Trash2, Settings, ArrowRightLeft } from 'lucide-react'
import { useHermesStore } from '../../store/hermes'
import type { ChatMode } from '../../store/types'

const CHAT_MODES: { id: ChatMode; label: string; color: string }[] = [
  { id: 'chat',         label: 'CHAT',       color: '#00dcff' },
  { id: 'tactical',     label: 'TACTICAL',   color: '#8b5cf6' },
  { id: 'coding',       label: 'CODING',     color: '#00bbdd' },
  { id: 'ctf',          label: 'CTF',        color: '#ff2d55' },
  { id: 'research',     label: 'RESEARCH',   color: '#c8d8e8' },
  { id: 'autonomous',   label: 'AUTO',       color: '#f0a020' },
]

const RESPONSES: Record<string, string> = {
  chat:        'Acknowledged, Operator. Processing request. All systems analyzing. Results incoming.',
  tactical:    '[TACTICAL] Input logged. Scanning operational parameters. Standing by for orders.',
  coding:      '> Command received. Compiling response.\n> Output: Executing build pipeline.',
  ctf:         '[CTF] Target locked. Reconnaissance modules engaged. Awaiting engagement auth.',
  research:    '[RESEARCH] Query cross-referenced. Sources found. Synthesizing response.',
  autonomous:  '[AUTONOMOUS] Directive accepted. Delegating to agent swarm. Reporting on completion.',
}

export default function BottomChat() {
  const messages     = useHermesStore((s) => s.messages)
  const streamingText = useHermesStore((s) => s.streamingText)
  const isStreaming  = useHermesStore((s) => s.isStreaming)
  const chatMode     = useHermesStore((s) => s.chatMode)
  const addMessage   = useHermesStore((s) => s.addMessage)
  const appendStream = useHermesStore((s) => s.appendStream)
  const finishStream = useHermesStore((s) => s.finishStream)
  const clearChat    = useHermesStore((s) => s.clearChat)
  const setChatMode  = useHermesStore((s) => s.setChatMode)
  const setAvatarState = useHermesStore((s) => s.setAvatarState)

  const [input, setInput] = useState('')
  const scrollRef = useRef<HTMLDivElement>(null)
  const inputRef  = useRef<HTMLInputElement>(null)

  // Auto-scroll to bottom on new messages
  useEffect(() => {
    const el = scrollRef.current
    if (el) el.scrollTop = el.scrollHeight
  }, [messages, streamingText])

  const modeColor = CHAT_MODES.find((m) => m.id === chatMode)?.color ?? '#00dcff'

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
      const iv = setInterval(() => {
        if (i < fullText.length) {
          appendStream(fullText[i])
          i++
        } else {
          clearInterval(iv)
          finishStream()
          setAvatarState('idle')
        }
      }, 12)
    }, 600)
  }, [input, isStreaming, chatMode, addMessage, appendStream, finishStream, setAvatarState])

  const getTag = (role: string) => {
    switch (role) {
      case 'system': return { tag: '[SYS]',  color: 'var(--amber)' }
      case 'user':   return { tag: 'USER',   color: 'var(--text-0)' }
      default:       return { tag: 'HERMES', color: 'var(--cyan-text)' }
    }
  }

  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        height: '100%',
        background: 'var(--bg-panel)',
        borderTop: '1px solid var(--border-panel)',
        overflow: 'hidden',          // ← critical: contain everything
      }}
    >
      {/* ── Tab bar ── */}
      <div
        style={{
          height: 34,
          display: 'flex',
          alignItems: 'center',
          padding: '0 10px',
          gap: 0,
          borderBottom: '1px solid var(--border-panel)',
          background: 'var(--bg-surface)',
          flexShrink: 0,              // ← never shrink
          overflowX: 'auto',
        }}
      >
        <span style={{ color: modeColor, fontSize: 10, marginRight: 6, flexShrink: 0 }}>&#9654;</span>
        {CHAT_MODES.map((m) => (
          <button
            key={m.id}
            onClick={() => setChatMode(m.id)}
            style={{
              padding: '4px 10px',
              fontSize: 10,
              fontFamily: 'var(--font-mono)',
              fontWeight: 700,
              letterSpacing: '0.08em',
              color: chatMode === m.id ? m.color : 'var(--text-2)',
              background: chatMode === m.id ? m.color + '10' : 'transparent',
              border: 'none',
              borderBottom: chatMode === m.id ? `2px solid ${m.color}` : '2px solid transparent',
              textShadow: chatMode === m.id ? `0 0 8px ${m.color}44` : 'none',
              cursor: 'pointer',
              whiteSpace: 'nowrap',
              flexShrink: 0,
              transition: 'color 0.15s',
            }}
          >
            {m.label}
          </button>
        ))}
        <div style={{ flex: 1 }} />
        <button
          onClick={clearChat}
          style={{
            color: 'var(--text-2)', background: 'none', border: 'none',
            cursor: 'pointer', padding: '3px 5px', flexShrink: 0,
          }}
          title="Clear chat"
        >
          <Trash2 size={12} />
        </button>
      </div>

      {/* ── Message log — SCROLLABLE ── */}
      <div
        ref={scrollRef}
        style={{
          flex: 1,                    // ← fills remaining space
          overflowY: 'auto',          // ← scroll here only
          overflowX: 'hidden',
          padding: '10px 14px',
          background: 'var(--bg-surface)',
          minHeight: 0,               // ← allows flex shrink
        }}
      >
        <AnimatePresence initial={false}>
          {messages.map((msg) => {
            const { tag, color } = getTag(msg.role)
            const isUser = msg.role === 'user'
            return (
              <motion.div
                key={msg.id}
                initial={{ opacity: 0, y: 6 }}
                animate={{ opacity: 1, y: 0 }}
                style={{
                  marginBottom: 6,
                  display: 'flex',
                  justifyContent: isUser ? 'flex-end' : 'flex-start',
                }}
              >
                <div
                  style={{
                    maxWidth: '82%',
                    borderLeft: `2px solid ${color}`,
                    paddingLeft: 8,
                  }}
                >
                  <span style={{ color, fontSize: 9, fontFamily: 'var(--font-mono)', fontWeight: 700, opacity: 0.8 }}>
                    {tag} &#9654;
                  </span>
                  <p
                    style={{
                      fontSize: 12,
                      fontFamily: 'var(--font-mono)',
                      lineHeight: 1.55,
                      color: 'var(--text-1)',
                      wordBreak: 'break-word',
                      marginTop: 1,
                    }}
                  >
                    {msg.content}
                  </p>
                </div>
              </motion.div>
            )
          })}
        </AnimatePresence>

        {/* Streaming message */}
        {isStreaming && streamingText && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} style={{ marginBottom: 6 }}>
            <div style={{ borderLeft: '2px solid var(--cyan)', paddingLeft: 8 }}>
              <span style={{ color: 'var(--cyan-text)', fontSize: 9, fontFamily: 'var(--font-mono)', fontWeight: 700 }}>
                HERMES &#9654;
              </span>
              <p style={{ fontSize: 12, fontFamily: 'var(--font-mono)', lineHeight: 1.55, color: 'var(--text-1)', marginTop: 1 }}>
                {streamingText}
                <span className="cursor-blink">&#9608;</span>
              </p>
            </div>
          </motion.div>
        )}
      </div>

      {/* ── Input bar ── */}
      <div
        style={{
          height: 42,
          display: 'flex',
          alignItems: 'center',
          padding: '0 10px',
          borderTop: '1px solid var(--border-panel)',
          background: 'var(--bg-input)',
          gap: 6,
          flexShrink: 0,              // ← never shrink
        }}
      >
        <span style={{ color: modeColor, fontSize: 14, flexShrink: 0 }}>&#9654;</span>
        <input
          ref={inputRef}
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && handleSend()}
          placeholder="Enter command..."
          style={{
            flex: 1,
            minWidth: 0,
            background: 'transparent',
            border: 'none',
            color: 'var(--text-0)',
            fontFamily: 'var(--font-mono)',
            fontSize: 13,
            outline: 'none',
          }}
        />
        <button title="Quick settings" style={{
          color: 'var(--text-2)', background: 'none', border: '1px solid var(--border-panel)',
          borderRadius: 'var(--radius-sm)', padding: '3px 5px', cursor: 'pointer', flexShrink: 0,
        }}>
          <Settings size={12} />
        </button>
        <button title="Submit" onClick={handleSend} style={{
          color: modeColor, background: 'none',
          border: `1px solid ${modeColor}33`,
          borderRadius: 'var(--radius-sm)', padding: '3px 5px', cursor: 'pointer', flexShrink: 0,
        }}>
          <ArrowRightLeft size={12} />
        </button>
      </div>
    </div>
  )
}
