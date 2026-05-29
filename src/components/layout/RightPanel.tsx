import { useState, useEffect } from 'react'
import { useHermesStore } from '../../store/hermes'

interface TelemetryItem { label: string; value: number; color?: 'amber' | 'cyan' | 'red' }

function randomFluctuate(base: number, range: number) {
  return Math.min(99, Math.max(1, base + (Math.random() - 0.5) * range))
}

export default function RightPanel() {
  const agents = useHermesStore((s) => s.agents)
  const settings = useHermesStore((s) => s.settings)
  const isStreaming = useHermesStore((s) => s.isStreaming)

  const [uptime, setUptime] = useState(0)
  const [packets, setPackets] = useState(0)
  const [telemetry, setTelemetry] = useState<TelemetryItem[]>([
    { label: 'CPU LOAD',       value: 23,  color: 'amber' },
    { label: 'MEMORY',         value: 67,  color: 'amber' },
    { label: 'NETWORK I/O',    value: 12,  color: 'cyan'  },
    { label: 'DISK I/O',       value: 8,   color: 'cyan'  },
    { label: 'GPU COMPUTE',    value: 5,   color: 'cyan'  },
    { label: 'ACTIVE THREADS', value: 18,  color: 'amber' },
    { label: 'QUEUE DEPTH',    value: 3,   color: 'amber' },
    { label: 'SOCKETS',        value: 22,  color: 'cyan'  },
    { label: 'ERROR RATE',     value: 1,   color: 'red'   },
    { label: 'LATENCY ms',     value: 14,  color: 'cyan'  },
  ])

  // Uptime counter
  useEffect(() => {
    const iv = setInterval(() => setUptime((p) => p + 1), 1000)
    return () => clearInterval(iv)
  }, [])

  // Packet counter — faster when streaming
  useEffect(() => {
    const iv = setInterval(() => {
      setPackets((p) => p + (isStreaming ? Math.floor(Math.random() * 800 + 200) : Math.floor(Math.random() * 50 + 10)))
    }, 500)
    return () => clearInterval(iv)
  }, [isStreaming])

  // Telemetry fluctuation — spikes during streaming
  useEffect(() => {
    const iv = setInterval(() => {
      setTelemetry((prev) => prev.map((item) => {
        const bases: Record<string, number> = {
          'CPU LOAD': isStreaming ? 65 : 23,
          'MEMORY': 67,
          'NETWORK I/O': isStreaming ? 75 : 12,
          'DISK I/O': 8,
          'GPU COMPUTE': isStreaming ? 40 : 5,
          'ACTIVE THREADS': isStreaming ? 35 : 18,
          'QUEUE DEPTH': isStreaming ? 25 : 3,
          'SOCKETS': 22,
          'ERROR RATE': 1,
          'LATENCY ms': isStreaming ? 85 : 14,
        }
        return { ...item, value: Math.round(randomFluctuate(bases[item.label] ?? item.value, 8)) }
      }))
    }, 1500)
    return () => clearInterval(iv)
  }, [isStreaming])

  const formatUptime = (secs: number) => {
    const h = Math.floor(secs / 3600)
    const m = Math.floor((secs % 3600) / 60)
    const s = secs % 60
    return `${String(h).padStart(2, '0')}h ${String(m).padStart(2, '0')}m ${String(s).padStart(2, '0')}s`
  }

  const formatPackets = (n: number) => {
    if (n >= 1_000_000) return `${(n / 1_000_000).toFixed(1)}M`
    if (n >= 1_000) return `${(n / 1_000).toFixed(1)}K`
    return String(n)
  }

  const activeAgents = agents.filter((a) => a.status === 'active' || a.status === 'working')
  const activeModel = settings.models.find((m) => m.is_active)

  const statusLines = [
    { label: 'UPTIME',   text: formatUptime(uptime) },
    { label: 'PACKETS',  text: formatPackets(packets) },
    { label: 'AGENTS',   text: `${activeAgents.length}/${agents.length} ACTIVE` },
    { label: 'MODEL',    text: activeModel ? activeModel.model_name.slice(0, 14) || activeModel.provider.toUpperCase() : '—' },
  ]

  return (
    <aside style={{
      width: 240, background: 'var(--bg-panel)', borderLeft: '1px solid var(--border-panel)',
      display: 'flex', flexDirection: 'column', flexShrink: 0, overflow: 'hidden',
    }}>
      {/* Header */}
      <div style={{ padding: '8px 12px', borderBottom: '1px solid var(--border-panel)', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <span style={{ fontSize: 10, fontFamily: 'var(--font-display)', fontWeight: 700, color: 'var(--text-primary)', letterSpacing: '0.12em' }}>TELEMETRY</span>
        <div style={{
          width: 6, height: 6, borderRadius: '50%',
          background: isStreaming ? 'var(--amber-primary)' : 'var(--green-online)',
          boxShadow: isStreaming ? '0 0 8px var(--amber-glow)' : '0 0 6px var(--green-glow)',
          animation: 'pulse-dot 1s infinite',
        }} />
      </div>

      {/* Status lines */}
      <div style={{ padding: '8px 12px', borderBottom: '1px solid var(--border-panel)' }}>
        {statusLines.map((line) => (
          <div key={line.label} style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 4 }}>
            <span style={{ fontSize: 9, color: 'var(--text-secondary)', fontFamily: 'var(--font-mono)' }}>{line.label}</span>
            <span style={{ fontSize: 9, color: 'var(--cyan-text)', fontFamily: 'var(--font-mono)', fontVariantNumeric: 'tabular-nums' }}>{line.text}</span>
          </div>
        ))}
      </div>

      {/* Metric bars */}
      <div style={{ padding: '10px 12px', flex: 1, overflowY: 'auto' }}>
        {telemetry.map((item) => (
          <div key={item.label} style={{ marginBottom: 10 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 3 }}>
              <span style={{ fontSize: 9, color: 'var(--text-secondary)', fontFamily: 'var(--font-mono)' }}>{item.label}</span>
              <span style={{
                fontSize: 9,
                color: item.color === 'red' ? 'var(--red-alert)' : item.color === 'cyan' ? 'var(--cyan-text)' : 'var(--text-amber)',
                fontFamily: 'var(--font-mono)', fontWeight: 700,
                fontVariantNumeric: 'tabular-nums',
              }}>
                {item.value}{item.label === 'LATENCY ms' ? '' : '%'}
              </span>
            </div>
            <div className="bar-track">
              <div
                className={`bar-fill ${item.color === 'red' ? 'red' : item.color === 'cyan' ? 'cyan' : ''}`}
                style={{ width: `${item.value}%`, transition: 'width 1.2s ease-in-out' }}
              />
            </div>
          </div>
        ))}
      </div>

      {/* Footer */}
      <div style={{ height: 2, background: 'linear-gradient(90deg, transparent 0%, var(--amber-dim) 30%, var(--amber-primary) 50%, var(--amber-dim) 70%, transparent 100%)', opacity: 0.3 }} />
    </aside>
  )
}
