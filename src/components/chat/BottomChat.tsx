import { useEffect, useRef, useState, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Trash2, Settings, Send, StopCircle } from 'lucide-react'
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

const MODE_SYSTEM_PROMPTS: Record<ChatMode, string> = {
  chat:       'You are HERMES, an advanced cybernetic AI intelligence system. Be concise, precise, and use a slightly technical tone. You are a helpful AI assistant.',
  tactical:   'You are HERMES in TACTICAL mode. Provide strategic, mission-focused responses. Prioritize objectives, risks, and action plans. Be direct and military-precise.',
  coding:     'You are HERMES in CODING mode. You are an expert programmer. Provide clean, well-commented code. Use markdown code blocks. Be thorough but efficient.',
  ctf:        'You are HERMES in CTF mode. You are a cybersecurity expert specializing in capture-the-flag challenges. Help with exploitation, reverse engineering, cryptography, and web security. Be detailed and technical.',
  research:   'You are HERMES in RESEARCH mode. Provide comprehensive, well-structured research responses with facts, analysis, and multiple perspectives. Cite relevant concepts.',
  autonomous: 'You are HERMES in AUTONOMOUS mode. Break down complex tasks into subtasks, reason step by step, and execute systematically. Think out loud about your approach.',
}

export default function BottomChat() {
  const messages       = useHermesStore((s) => s.messages)
  const streamingText  = useHermesStore((s) => s.streamingText)
  const isStreaming    = useHermesStore((s) => s.isStreaming)
  const chatMode       = useHermesStore((s) => s.chatMode)
  const settings       = useHermesStore((s) => s.settings)
  const addMessage     = useHermesStore((s) => s.addMessage)
  const appendStream   = useHermesStore((s) => s.appendStream)
  const finishStream   = useHermesStore((s) => s.finishStream)
  const clearChat      = useHermesStore((s) => s.clearChat)
  const setChatMode    = useHermesStore((s) => s.setChatMode)
  const setAvatarState = useHermesStore((s) => s.setAvatarState)
  const setActiveSidebarTab = useHermesStore((s) => s.setActiveSidebarTab)

  const [input, setInput] = useState('')
  const [error, setError] = useState<string | null>(null)
  const scrollRef = useRef<HTMLDivElement>(null)
  const inputRef  = useRef<HTMLInputElement>(null)
  const abortRef  = useRef<AbortController | null>(null)

  useEffect(() => {
    const el = scrollRef.current
    if (el) el.scrollTop = el.scrollHeight
  }, [messages, streamingText])

  const modeColor = CHAT_MODES.find((m) => m.id === chatMode)?.color ?? '#ffaa00'

  const getActiveModel = useCallback(() => {
    return settings.models.find((m) => m.is_active) ?? settings.models[0] ?? null
  }, [settings.models])

  const stopGeneration = useCallback(() => {
    if (abortRef.current) {
      abortRef.current.abort()
      abortRef.current = null
    }
    finishStream()
    setAvatarState('idle')
  }, [finishStream, setAvatarState])

  const handleSend = useCallback(async () => {
    if (!input.trim() || isStreaming) return
    const text = input.trim()
    setInput('')
    setError(null)

    addMessage({ role: 'user', content: text, mode: chatMode })
    setAvatarState('thinking')

    const model = getActiveModel()
    if (!model) {
      setError('No LLM configured. Go to CONFIG → LLM Config to add a model.')
      setAvatarState('idle')
      return
    }

    // Build conversation history for context
    const recentMessages = messages.slice(-10)
    const historyMessages = recentMessages
      .filter((m) => m.role === 'user' || m.role === 'hermes')
      .map((m) => ({ role: m.role === 'hermes' ? 'assistant' : 'user', content: m.content }))

    const payload = {
      model: model.model_name,
      messages: [
        { role: 'system', content: MODE_SYSTEM_PROMPTS[chatMode] },
        ...historyMessages,
        { role: 'user', content: text },
      ],
      stream: true,
    }

    abortRef.current = new AbortController()

    // Determine endpoint based on provider
    let endpoint: string
    if (model.provider === 'ollama') {
      endpoint = `${model.base_url.replace(/\/$/, '')}/api/chat`
    } else {
      // OpenAI-compatible (lmstudio, llamacpp, vllm, openrouter, custom)
      endpoint = `${model.base_url.replace(/\/$/, '')}/chat/completions`
    }

    const headers: Record<string, string> = { 'Content-Type': 'application/json' }
    if (model.api_key) headers['Authorization'] = `Bearer ${model.api_key}`
    if (model.provider === 'openrouter') {
      headers['HTTP-Referer'] = 'https://hermes.ai'
      headers['X-Title'] = 'HERMES'
    }

    try {
      // Start streaming state
      useHermesStore.setState({ isStreaming: true, streamingText: '' })
      setAvatarState('speaking')

      const resp = await fetch(endpoint, {
        method: 'POST',
        headers,
        body: JSON.stringify(payload),
        signal: abortRef.current.signal,
      })

      if (!resp.ok) {
        const errText = await resp.text()
        throw new Error(`HTTP ${resp.status}: ${errText.slice(0, 200)}`)
      }

      const reader = resp.body!.getReader()
      const decoder = new TextDecoder()
      let buffer = ''

      while (true) {
        const { done, value } = await reader.read()
        if (done) break

        buffer += decoder.decode(value, { stream: true })
        const lines = buffer.split('\n')
        buffer = lines.pop() ?? ''

        for (const line of lines) {
          const trimmed = line.trim()
          if (!trimmed || trimmed === 'data: [DONE]') continue

          const jsonStr = trimmed.startsWith('data: ') ? trimmed.slice(6) : trimmed

          try {
            const parsed = JSON.parse(jsonStr)

            // Ollama format
            if (parsed.message?.content !== undefined) {
              appendStream(parsed.message.content)
            }
            // OpenAI format
            else if (parsed.choices?.[0]?.delta?.content !== undefined) {
              appendStream(parsed.choices[0].delta.content)
            }
          } catch {
            // skip malformed chunk
          }
        }
      }

      finishStream()
      setAvatarState('idle')
    } catch (err: any) {
      if (err.name === 'AbortError') {
        finishStream()
      } else {
        finishStream()
        const msg = err.message ?? 'Unknown error'
        setError(msg.includes('Failed to fetch')
          ? `Cannot reach ${model.provider} at ${model.base_url}. Is it running?`
          : msg
        )
      }
      setAvatarState('idle')
    }

    abortRef.current = null
  }, [input, isStreaming, chatMode, messages, addMessage, appendStream, finishStream, setAvatarState, getActiveModel])

  const getTag = (role: string) => {
    if (role === 'system') return { tag: '[SYS]',  color: 'var(--amber-text)' }
    if (role === 'user')   return { tag: 'USER',   color: 'var(--text-primary)' }
    return { tag: 'HERMES', color: 'var(--cyan-text)' }
  }

  const activeModel = getActiveModel()

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
        {/* Active model indicator */}
        {activeModel && (
          <span style={{ fontSize: 8, fontFamily: 'var(--font-mono)', color: 'var(--text-dim)', marginRight: 8, flexShrink: 0 }}>
            {activeModel.provider.toUpperCase()} · {activeModel.model_name || '—'}
          </span>
        )}
        <button onClick={clearChat} style={{ color: 'var(--text-dim)', background: 'none', border: 'none', cursor: 'pointer', padding: '2px 4px', flexShrink: 0 }} title="Clear chat">
          <Trash2 size={11} />
        </button>
      </div>

      {/* Message log */}
      <div ref={scrollRef} style={{ flex: 1, overflowY: 'auto', overflowX: 'hidden', padding: '8px 14px', background: 'var(--bg-surface)', minHeight: 0 }}>
        <AnimatePresence initial={false}>
          {messages.map((msg) => {
            const { tag, color } = getTag(msg.role)
            return (
              <motion.div key={msg.id} initial={{ opacity: 0, y: 5 }} animate={{ opacity: 1, y: 0 }}
                style={{ marginBottom: 5, display: 'flex', justifyContent: msg.role === 'user' ? 'flex-end' : 'flex-start' }}>
                <div style={{ maxWidth: '82%', borderLeft: `2px solid ${color}`, paddingLeft: 8 }}>
                  <span style={{ color, fontSize: 8, fontFamily: 'var(--font-mono)', fontWeight: 700, opacity: 0.75 }}>{tag} &#9654;</span>
                  <p style={{ fontSize: 11, fontFamily: 'var(--font-mono)', lineHeight: 1.5, color: 'var(--text-secondary)', wordBreak: 'break-word', marginTop: 1, whiteSpace: 'pre-wrap' }}>
                    {msg.content}
                  </p>
                </div>
              </motion.div>
            )
          })}
        </AnimatePresence>

        {/* Streaming message */}
        {isStreaming && streamingText !== undefined && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} style={{ marginBottom: 5 }}>
            <div style={{ borderLeft: '2px solid var(--cyan-secondary)', paddingLeft: 8 }}>
              <span style={{ color: 'var(--cyan-text)', fontSize: 8, fontFamily: 'var(--font-mono)', fontWeight: 700 }}>HERMES &#9654;</span>
              <p style={{ fontSize: 11, fontFamily: 'var(--font-mono)', lineHeight: 1.5, color: 'var(--text-secondary)', marginTop: 1, whiteSpace: 'pre-wrap', wordBreak: 'break-word' }}>
                {streamingText}<span style={{ animation: 'cursor-blink 1s infinite' }}>▋</span>
              </p>
            </div>
          </motion.div>
        )}

        {/* Error */}
        {error && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} style={{ marginBottom: 5 }}>
            <div style={{ borderLeft: '2px solid var(--red-alert)', paddingLeft: 8, background: 'rgba(255,59,92,0.05)', padding: '6px 8px' }}>
              <span style={{ color: 'var(--red-alert)', fontSize: 8, fontFamily: 'var(--font-mono)', fontWeight: 700 }}>ERROR &#9654;</span>
              <p style={{ fontSize: 11, fontFamily: 'var(--font-mono)', lineHeight: 1.5, color: 'var(--red-alert)', marginTop: 1 }}>
                {error}
                {!activeModel && (
                  <button onClick={() => setActiveSidebarTab('settings')}
                    style={{ marginLeft: 8, color: 'var(--amber-primary)', background: 'none', border: '1px solid var(--amber-primary)', padding: '1px 6px', fontSize: 9, cursor: 'pointer', fontFamily: 'var(--font-mono)' }}>
                    CONFIGURE →
                  </button>
                )}
              </p>
            </div>
          </motion.div>
        )}

        {/* No model warning */}
        {!activeModel && messages.length <= 2 && (
          <div style={{ borderLeft: '2px solid var(--amber-primary)', paddingLeft: 8, padding: '6px 8px', background: 'rgba(255,170,0,0.05)' }}>
            <span style={{ color: 'var(--amber-primary)', fontSize: 8, fontFamily: 'var(--font-mono)', fontWeight: 700 }}>SYSTEM &#9654;</span>
            <p style={{ fontSize: 11, fontFamily: 'var(--font-mono)', color: 'var(--text-amber)', marginTop: 1 }}>
              No LLM model configured.{' '}
              <button onClick={() => setActiveSidebarTab('settings')}
                style={{ color: 'var(--cyan-text)', background: 'none', border: 'none', cursor: 'pointer', fontSize: 11, fontFamily: 'var(--font-mono)', textDecoration: 'underline' }}>
                Open CONFIG → LLM Config
              </button>{' '}
              to connect Ollama, LM Studio, OpenRouter, or any OpenAI-compatible backend.
            </p>
          </div>
        )}
      </div>

      {/* Input */}
      <div style={{ height: 40, display: 'flex', alignItems: 'center', padding: '0 10px', borderTop: '1px solid var(--border-panel)', background: 'var(--bg-input)', gap: 6, flexShrink: 0 }}>
        <span style={{ color: modeColor, fontSize: 13, flexShrink: 0 }}>&#9654;</span>
        <input
          ref={inputRef}
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && handleSend()}
          placeholder={isStreaming ? 'HERMES is responding...' : 'Enter command...'}
          disabled={isStreaming}
          style={{
            flex: 1, minWidth: 0, background: 'transparent', border: 'none',
            color: isStreaming ? 'var(--text-dim)' : 'var(--text-primary)',
            fontFamily: 'var(--font-mono)', fontSize: 13, outline: 'none',
          }}
        />
        <button
          title="Settings"
          onClick={() => setActiveSidebarTab('settings')}
          style={{ color: 'var(--text-dim)', background: 'none', border: '1px solid var(--border-panel)', borderRadius: 'var(--radius-sm)', padding: '3px 5px', cursor: 'pointer', flexShrink: 0 }}>
          <Settings size={11} />
        </button>
        {isStreaming ? (
          <button
            title="Stop"
            onClick={stopGeneration}
            style={{ color: 'var(--red-alert)', background: 'none', border: `1px solid var(--red-alert)`, borderRadius: 'var(--radius-sm)', padding: '3px 5px', cursor: 'pointer', flexShrink: 0 }}>
            <StopCircle size={11} />
          </button>
        ) : (
          <button
            title="Send"
            onClick={handleSend}
            disabled={!input.trim()}
            style={{
              color: input.trim() ? modeColor : 'var(--text-dim)',
              background: 'none',
              border: `1px solid ${input.trim() ? modeColor + '55' : 'var(--border-panel)'}`,
              borderRadius: 'var(--radius-sm)', padding: '3px 5px', cursor: input.trim() ? 'pointer' : 'default', flexShrink: 0,
            }}>
            <Send size={11} />
          </button>
        )}
      </div>
    </div>
  )
}
