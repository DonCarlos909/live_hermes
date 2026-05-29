interface TelemetryItem { label: string; value: number; color?: 'amber' | 'cyan' | 'red' }

const DEMO_TELEMETRY: TelemetryItem[] = [
  { label: 'CPU LOAD',      value: 23,  color: 'amber' },
  { label: 'MEMORY',        value: 67,  color: 'amber' },
  { label: 'NETWORK I/O',   value: 45,  color: 'cyan'  },
  { label: 'DISK I/O',      value: 12,  color: 'cyan'  },
  { label: 'GPU COMPUTE',   value: 8,   color: 'cyan'  },
  { label: 'ACTIVE THREADS',value: 18,  color: 'amber' },
  { label: 'QUEUE DEPTH',   value: 5,   color: 'amber' },
  { label: 'SOCKETS',       value: 34,  color: 'cyan'  },
  { label: 'ERROR RATE',    value: 2,   color: 'red'   },
  { label: 'LATENCY ms',    value: 14,  color: 'cyan'  },
]

const DEMO_STATUS = [
  { label: 'UPTIME',  text: '14h 32m 07s' },
  { label: 'PACKETS', text: '1.2M / 0' },
  { label: 'AGENTS',  text: '3/4 ACTIVE' },
  { label: 'MODELS',  text: '2 LOADED' },
]

export default function RightPanel() {
  return (
    <aside style={{
      width: 240, background: 'var(--bg-panel)', borderLeft: '1px solid var(--border-panel)',
      display: 'flex', flexDirection: 'column', flexShrink: 0, overflow: 'hidden',
    }}>
      {/* Header */}
      <div style={{ padding: '8px 12px', borderBottom: '1px solid var(--border-panel)', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <span style={{ fontSize: 10, fontFamily: 'var(--font-display)', fontWeight: 700, color: 'var(--text-primary)', letterSpacing: '0.12em' }}>TELEMETRY</span>
        <div style={{ width: 6, height: 6, borderRadius: '50%', background: 'var(--green-online)', boxShadow: '0 0 6px var(--green-glow)', animation: 'pulse-dot 2s infinite' }} />
      </div>

      {/* Status lines */}
      <div style={{ padding: '8px 12px', borderBottom: '1px solid var(--border-panel)' }}>
        {DEMO_STATUS.map((line) => (
          <div key={line.label} style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 4 }}>
            <span style={{ fontSize: 9, color: 'var(--text-secondary)', fontFamily: 'var(--font-mono)' }}>{line.label}</span>
            <span style={{ fontSize: 9, color: 'var(--cyan-text)', fontFamily: 'var(--font-mono)' }}>{line.text}</span>
          </div>
        ))}
      </div>

      {/* Metric bars */}
      <div style={{ padding: '10px 12px', flex: 1, overflowY: 'auto' }}>
        {DEMO_TELEMETRY.map((item) => (
          <div key={item.label} style={{ marginBottom: 10 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 3 }}>
              <span style={{ fontSize: 9, color: 'var(--text-secondary)', fontFamily: 'var(--font-mono)' }}>{item.label}</span>
              <span style={{ fontSize: 9, color: item.color === 'red' ? 'var(--red-alert)' : item.color === 'cyan' ? 'var(--cyan-text)' : 'var(--text-amber)', fontFamily: 'var(--font-mono)', fontWeight: 700 }}>
                {item.value}{item.label === 'LATENCY ms' ? '' : '%'}
              </span>
            </div>
            <div className="bar-track">
              <div className={`bar-fill ${item.color === 'red' ? 'red' : item.color === 'cyan' ? 'cyan' : ''}`} style={{ width: `${item.value}%` }} />
            </div>
          </div>
        ))}
      </div>

      {/* Footer accent */}
      <div style={{ height: 2, background: 'linear-gradient(90deg, transparent 0%, var(--amber-dim) 30%, var(--amber-primary) 50%, var(--amber-dim) 70%, transparent 100%)', opacity: 0.3 }} />
    </aside>
  )
}
