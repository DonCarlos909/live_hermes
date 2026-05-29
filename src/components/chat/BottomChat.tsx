import { useEffect, useRef, useState, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Trash2, Settings, ArrowRightLeft } from 'lucide-react'
import { useHermesStore } from '../../store/hermes'
import type { ChatMode } from '../../store/types'

const CHAT_MODES: { id: ChatMode; label: string; color: string }[] = [
  { id: 'chat',       label: 'CHAT',     color: '#ffaa00' },
  { id: 'tactical',   label: 'TACTICAL', color: '#8b5cf6' },
  { id: 'coding',     label: 'CODING',   color: '#00e5ff' },
  { id: 'ctf',        label: 'CTF',      color: '#ff3b5c' },
  { id: 'research',   label: 'RESEARCH', color: '#c8d8e8' },
  { id: 'autonomous', label: 'AUTO',     color: '#39ff6a' },
]

const RESPONSES: Record<string, string> = {
  chat:       'Acknowledged, Operator. Processing request. All systems analyzing. Results incoming.',
  tactical:   '[TACTICAL] Input logged. Scanning operational parameters. Standing by.',
  coding:     '> Command received. Compiling.\n> Output: Build pipeline executing.',
  ctf:        '[CTF] Target locked. Reconnaissance engaged. Awaiting auth.',
  research:   '[RESEARCH] Query cross-referenced. Sources found. Synthesizing.',
  autonomous: '[AUTONOMOUS] Directive accepted. Delegating to agent swarm.',
}

export default function BottomChat() {
  const messages       = useHermesStore((s) => s.messages)
  const streamingText  = useHermesStore((s) => s.streamingText)
  const isStreaming    = useHermesStore((s) => s.isStreaming)
  const chatMode       = useHermesStore((s) => s.chatMode)
  const addMessage     = useHermesStore((s) => s.addMessage)
  const appendStream   = useHermesStore((s) => s.appendStream)
  const finishStream   = useHermesStore((s) => s.finishStream)
  const clearChat      = useHermesStore((s) => s.clearChat)
  const setChatMode    = useHermesStore((s) => s.setChatMode)
  const setAvatarState = useHermesStore((s) => s.setAvatarState)

  const [input, setInput] = useState('')
  const scrollRef = useRef<HTMLDivElement>(null)
  const inputRef  = useRef<HTMLInputElement>(null)

  useEffect(() => {
    const el = scrollRef.current
    if (el) el.scrollTop = el.scrollHeight
  }, [messages, streamingText])

  const modeColor = CHAT_MODES.find((m) => m.id === chatMode)?.color ?? '#ffaa00'

  const handleSend = useCallback(() => {
    if (!input.trim() || isStreaming) return
    const text = input.trim()
    setInput('')
    addMessage({ role: 'user', content: text, mode: chatMode })
    setAvatarState('thinking')
    setTimeout(() => {
      setAvatarState('speaking' as any)
      const full = RESPONSES[chatMode] ?? RESPONSES.chat
      let i = 0
      const iv = setInterval(() => {
        if (i < full.length) { appendStream(full[i]); i++ }
        else { clearInterval(iv); finishStream(); setAvatarState('idle') }
      }, 12)
    }, 600)
  }, [input, isStreaming, chatMode, addMessage, appendStream, finishStream, setAvatarState])

  const getTag = (role: string) => {
    if (role === 'system') return { tag: '[SYS]',  color: 'var(--amber-text)' }
    if (role === 'user')   return { tag: 'USER',   color: 'var(--text-primary)' }
    return { tag: 'HERMES', color: 'var(--cyan-text)' }
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%', background: 'var(--bg-panel)', borderTop: '1px solid var(--border-panel)', overflow: 'hidden' }}>
      {/* Tab bar */}
      <div style={{ height: 32, display: 'flex', alignItems: 'center', padding: '0 10px', gap: 0, borderBottom: '1px solid var(--border-panel)', background: 'var(--bg-surface)', flexShrink: 0, overflowX: 'auto' }}>
        <span style={{ color: modeColor, fontSize: 9, marginRight: 6, flexShrink: 0 }}>&#9654;</span>
        {CHAT_MODES.map((m) => (
          <button key={m.id} onClick={() => setChatMode(m.id)} style={{
            padding: '3px 9px', fontSize: 9, fontFamily: 'var(--font-mono)', fontWeight: 700, letterSpacing: '0.06em',
            color: chatMode === m.id ? m.color : 'var(--text-dim)',
            background: chatMode === m.id ? m.color + '0d' : 'transparent',
            border: 'none', borderBottom: chatMode === m.id ? `2px solid ${m.color}` : '2px solid transparent',
            textShadow: chatMode === m.id ? `0 0 6px ${m.color}33` : 'none',
            cursor: 'pointer', whiteSpace: 'nowrap', flexShrink: 0,
          }}>{m.label}</button>
        ))}
        <div style={{ flex: 1 }} />
        <button onClick={clearChat} style={{ color: 'var(--text-dim)', background: 'none', border: 'none', cursor: 'pointer', padding: '2px 4px', flexShrink: 0 }} title="Clear chat">
          <Trash2 size={11} />
        </button>
      </div>

      {/* Message log — SCROLLABLE */}
      <div ref={scrollRef} style={{ flex: 1, overflowY: 'auto', overflowX: 'hidden', padding: '8px 14px', background: 'var(--bg-surface)', minHeight: 0 }}>
        <AnimatePresence initial={false}>
          {messages.map((msg) => {
            const { tag, color } = getTag(msg.role)
            return (
              <motion.div key={msg.id} initial={{ opacity: 0, y: 5 }} animate={{ opacity: 1, y: 0 }}
                style={{ marginBottom: 5, display: 'flex', justifyContent: msg.role === 'user' ? 'flex-end' : 'flex-start' }}>
                <div style={{ maxWidth: '82%', borderLeft: `2px solid ${color}`, paddingLeft: 8 }}>
                  <span style={{ color, fontSize: 8, fontFamily: 'var(--font-mono)', fontWeight: 700, opacity: 0.75 }}>{tag} &#9654;</span>
                  <p style={{ fontSize: 11, fontFamily: 'var(--font-mono)', lineHeight: 1.5, color: 'var(--text-secondary)', wordBreak: 'break-word', marginTop: 1 }}>
                    {msg.content}
                  </p>
                </div>
              </motion.div>
            )
          })}
        </AnimatePresence>
        {isStreaming && streamingText && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} style={{ marginBottom: 5 }}>
            <div style={{ borderLeft: '2px solid var(--cyan-secondary)', paddingLeft: 8 }}>
              <span style={{ color: 'var(--cyan-text)', fontSize: 8, fontFamily: 'var(--font-mono)', fontWeight: 700 }}>HERMES &#9654;</span>
              <p style={{ fontSize: 11, fontFamily: 'var(--font-mono)', lineHeight: 1.5, color: 'var(--text-secondary)', marginTop: 1 }}>
                {streamingText}<span className="cursor-blink">&#9608;</span>
              </p>
            </div>
          </motion.div>
        )}
      </div>

      {/* Input */}
      <div style={{ height: 40, display: 'flex', alignItems: 'center', padding: '0 10px', borderTop: '1px solid var(--border-panel)', background: 'var(--bg-input)', gap: 6, flexShrink: 0 }}>
        <span style={{ color: modeColor, fontSize: 13, flexShrink: 0 }}>&#9654;</span>
        <input ref={inputRef} type="text" value={input} onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && handleSend()} placeholder="Enter command..."
          style={{ flex: 1, minWidth: 0, background: 'transparent', border: 'none', color: 'var(--text-primary)', fontFamily: 'var(--font-mono)', fontSize: 13, outline: 'none' }} />
        <button title="Settings" style={{ color: 'var(--text-dim)', background: 'none', border: '1px solid var(--border-panel)', borderRadius: 'var(--radius-sm)', padding: '3px 5px', cursor: 'pointer', flexShrink: 0 }}>
          <Settings size={11} />
        </button>
        <button title="Send" onClick={handleSend} style={{ color: modeColor, background: 'none', border: `1px solid ${modeColor}33`, borderRadius: 'var(--radius-sm)', padding: '3px 5px', cursor: 'pointer', flexShrink: 0 }}>
          <ArrowRightLeft size={11} />
        </button>
      </div>
    </div>
  )
}
