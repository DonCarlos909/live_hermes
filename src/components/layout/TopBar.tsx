import { useState, useEffect } from 'react'
import { Shield, Clock, ChevronDown } from 'lucide-react'
import { useHermesStore } from '../../store/hermes'

export default function TopBar() {
  const isConnected = useHermesStore((s) => s.isConnected)
  const agents = useHermesStore((s) => s.agents)
  const mode = useHermesStore((s) => s.mode)
  const [time, setTime] = useState(new Date())

  useEffect(() => {
    const interval = setInterval(() => setTime(new Date()), 1000)
    return () => clearInterval(interval)
  }, [])

  const activeAgents = agents.filter((a) => a.status === 'active' || a.status === 'working')

  const modeColors: Record<string, string> = {
    idle: '#00e8ff',
    analysis: '#00e8ff',
    ctf: '#ff2244',
    coding: '#00c8e8',
    voice: '#8b5cf6',
  }

  const modeColor = modeColors[mode] ?? '#00e8ff'

  return (
    <header
      style={{
        height: 48,
        background: 'var(--bg-panel)',
        borderBottom: '2px solid var(--border-panel)',
        display: 'flex',
        alignItems: 'center',
        padding: '0 20px',
        gap: 16,
        fontFamily: 'var(--font-mono)',
        flexShrink: 0,
        zIndex: 30,
      }}
    >
      {/* Left: Logo */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
        <span style={{ color: 'var(--cyan-primary)', fontSize: 18, fontWeight: 700, fontFamily: 'var(--font-display)' }}>
          &#8801;
        </span>
        <span
          style={{
            color: 'var(--cyan-primary)',
            fontSize: 22,
            fontWeight: 900,
            fontFamily: 'var(--font-display)',
            textShadow: '0 0 16px #00e8ff',
            letterSpacing: '0.12em',
          }}
        >
          HERMES
        </span>
        <span style={{ color: 'var(--text-secondary)', fontSize: 12, fontFamily: 'var(--font-mono)' }}>
          v2.0
        </span>
      </div>

      {/* Spacer */}
      <div style={{ flex: 1 }} />

      {/* Center: Status + Mode */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
        {/* Online dot */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
          <div
            style={{
              width: 7,
              height: 7,
              borderRadius: '50%',
              background: isConnected ? 'var(--green-online)' : 'var(--red-bar)',
              boxShadow: isConnected ? '0 0 8px rgba(0,255,85,0.5)' : '0 0 8px rgba(255,34,68,0.5)',
              animation: 'pulse-dot 2s ease-in-out infinite',
            }}
          />
          <span
            style={{
              fontSize: 12,
              fontFamily: 'var(--font-display)',
              color: isConnected ? 'var(--green-online)' : 'var(--red-bar)',
              fontWeight: 700,
            }}
          >
            {isConnected ? 'ONLINE' : 'OFFLINE'}
          </span>
        </div>

        {/* Mode badge */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: 6,
            padding: '3px 12px',
            border: '1px solid',
            borderColor: modeColor + '44',
            borderRadius: 4,
            background: modeColor + '0a',
          }}
        >
          <Shield size={11} style={{ color: modeColor }} />
          <span
            style={{
              fontSize: 12,
              fontFamily: 'var(--font-display)',
              color: 'var(--text-primary)',
              fontWeight: 700,
              letterSpacing: '0.08em',
            }}
          >
            {mode === 'idle' ? 'IDLE MODE' : mode.toUpperCase() + ' MODE'}
          </span>
        </div>
      </div>

      {/* Spacer */}
      <div style={{ flex: 1 }} />

      {/* Right: Agent pills + Time */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
        <span style={{ fontSize: 12, fontFamily: 'var(--font-display)', color: 'var(--cyan-primary)' }}>
          AGENTS:
        </span>
        {activeAgents.map((agent, i) => (
          <span key={agent.id} style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
            {i > 0 && <span style={{ color: 'var(--text-secondary)', fontSize: 10, marginRight: 2 }}>|</span>}
            <span
              style={{
                fontSize: 11,
                fontFamily: 'var(--font-mono)',
                color: agent.status === 'working' ? 'var(--cyan-primary)' : 'var(--cyan-mid)',
                letterSpacing: '0.06em',
              }}
            >
              {agent.name.toUpperCase()}
            </span>
          </span>
        ))}
        <span
          style={{
            fontSize: 11,
            fontFamily: 'var(--font-mono)',
            color: 'var(--text-secondary)',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            gap: 2,
          }}
        >
          + VOICE <ChevronDown size={10} />
        </span>

        <div style={{ width: 1, height: 16, background: 'var(--border-panel)', margin: '0 4px' }} />

        <div style={{ display: 'flex', alignItems: 'center', gap: 5 }}>
          <Clock size={11} style={{ color: 'var(--text-secondary)' }} />
          <span
            style={{
              fontSize: 11,
              fontFamily: 'var(--font-mono)',
              color: 'var(--text-secondary)',
              fontVariantNumeric: 'tabular-nums',
            }}
          >
            {time.toLocaleTimeString('en-US', { hour12: false })}
          </span>
        </div>
      </div>
    </header>
  )
}
