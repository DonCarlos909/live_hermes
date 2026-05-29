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

  const modeConfig: Record<string, { color: string; label: string }> = {
    idle:     { color: 'var(--amber-primary)', label: 'IDLE' },
    analysis: { color: 'var(--amber-primary)', label: 'ANALYSIS' },
    ctf:      { color: 'var(--red-alert)',     label: 'CTF' },
    coding:   { color: 'var(--cyan-secondary)', label: 'CODING' },
    voice:    { color: 'var(--violet)',         label: 'VOICE' },
  }
  const mc = modeConfig[mode] ?? modeConfig.idle

  return (
    <header style={{
      height: 46,
      background: 'var(--bg-panel)',
      borderBottom: '1px solid var(--border-panel)',
      display: 'flex', alignItems: 'center', padding: '0 16px',
      gap: 14, flexShrink: 0, zIndex: 30,
    }}>
      {/* Logo */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
        <span style={{ color: 'var(--amber-primary)', fontSize: 16, fontFamily: 'var(--font-display)', textShadow: '0 0 12px var(--amber-glow)' }}>&#8801;</span>
        <span style={{ color: 'var(--amber-primary)', fontSize: 20, fontWeight: 900, fontFamily: 'var(--font-display)', textShadow: '0 0 16px var(--amber-glow)', letterSpacing: '0.12em' }}>HERMES</span>
        <span style={{ color: 'var(--text-dim)', fontSize: 10, fontFamily: 'var(--font-mono)' }}>v2.0</span>
      </div>

      <div style={{ flex: 1 }} />

      {/* Center */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 5 }}>
          <div style={{ width: 6, height: 6, borderRadius: '50%', background: isConnected ? 'var(--green-online)' : 'var(--red-alert)', boxShadow: isConnected ? '0 0 8px var(--green-glow)' : '0 0 8px var(--red-glow)', animation: 'pulse-dot 2s infinite' }} />
          <span style={{ fontSize: 11, fontFamily: 'var(--font-display)', fontWeight: 700, color: isConnected ? 'var(--green-online)' : 'var(--red-alert)' }}>
            {isConnected ? 'ONLINE' : 'OFFLINE'}
          </span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 5, padding: '3px 10px', border: `1px solid ${mc.color}33`, borderRadius: 'var(--radius-sm)', background: `${mc.color}0d` }}>
          <Shield size={10} style={{ color: mc.color }} />
          <span style={{ fontSize: 11, fontFamily: 'var(--font-display)', fontWeight: 700, color: 'var(--text-primary)', letterSpacing: '0.06em' }}>
            {mc.label} MODE
          </span>
        </div>
      </div>

      <div style={{ flex: 1 }} />

      {/* Right */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
        <span style={{ fontSize: 10, fontFamily: 'var(--font-display)', color: 'var(--amber-primary)', letterSpacing: '0.06em' }}>AGENTS:</span>
        {activeAgents.map((agent, i) => (
          <span key={agent.id} style={{ display: 'flex', alignItems: 'center', gap: 3 }}>
            {i > 0 && <span style={{ color: 'var(--text-dim)', fontSize: 9, marginRight: 1 }}>|</span>}
            <span style={{ fontSize: 10, fontFamily: 'var(--font-mono)', color: agent.status === 'working' ? 'var(--amber-text)' : 'var(--cyan-mid)' }}>
              {agent.name.toUpperCase()}
            </span>
          </span>
        ))}
        <span style={{ fontSize: 10, fontFamily: 'var(--font-mono)', color: 'var(--text-dim)', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 2 }}>
          + VOICE <ChevronDown size={9} />
        </span>
        <div style={{ width: 1, height: 14, background: 'var(--border-panel)', margin: '0 4px' }} />
        <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
          <Clock size={10} style={{ color: 'var(--text-dim)' }} />
          <span style={{ fontSize: 10, fontFamily: 'var(--font-mono)', color: 'var(--text-secondary)', fontVariantNumeric: 'tabular-nums' }}>
            {time.toLocaleTimeString('en-US', { hour12: false })}
          </span>
        </div>
      </div>
    </header>
  )
}
