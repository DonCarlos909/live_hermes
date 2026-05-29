// Right-side telemetry panel with system metrics


interface TelemetryItem {
  label: string
  value: number
  red?: boolean
}

const DEMO_TELEMETRY: TelemetryItem[] = [
  { label: 'CPU LOAD', value: 23 },
  { label: 'MEMORY', value: 67 },
  { label: 'NETWORK', value: 45 },
  { label: 'DISK I/O', value: 12 },
  { label: 'GPU COMPUTE', value: 8 },
  { label: 'ACTIVE SOCKETS', value: 34 },
  { label: 'THREADS', value: 18 },
  { label: 'QUEUE DEPTH', value: 5 },
  { label: 'ERROR RATE', value: 2, red: true },
  { label: 'LATENCY', value: 14 },
]

const DEMO_STATUS_LINES = [
  { label: 'UPTIME', text: '14h 32m 07s' },
  { label: 'PACKETS', text: '1.2M / 0' },
  { label: 'AGENTS', text: '3/4 ACTIVE' },
  { label: 'MODELS', text: '2 LOADED' },
]

export default function RightPanel() {
  return (
    <aside
      style={{
        width: 260,
        background: 'var(--bg-panel)',
        borderLeft: '1px solid var(--border-panel)',
        display: 'flex',
        flexDirection: 'column',
        flexShrink: 0,
        overflow: 'hidden',
      }}
    >
      {/* Header */}
      <div
        style={{
          padding: '8px 12px',
          borderBottom: '1px solid var(--border-panel)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
        }}
      >
        <span
          style={{
            fontSize: 11,
            fontFamily: 'var(--font-display)',
            fontWeight: 700,
            color: 'var(--text-primary)',
            letterSpacing: '0.12em',
          }}
        >
          TELEMETRY
        </span>
        <div
          style={{
            width: 6,
            height: 6,
            borderRadius: '50%',
            background: 'var(--green-online)',
            boxShadow: '0 0 6px rgba(0,255,85,0.5)',
            animation: 'pulse-dot 2s ease-in-out infinite',
          }}
        />
      </div>

      {/* Status lines */}
      <div style={{ padding: '8px 12px', borderBottom: '1px solid var(--border-panel)' }}>
        {DEMO_STATUS_LINES.map((line) => (
          <div
            key={line.label}
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              marginBottom: 4,
            }}
          >
            <span style={{ fontSize: 10, color: 'var(--text-secondary)', fontFamily: 'var(--font-mono)' }}>
              {line.label}
            </span>
            <span style={{ fontSize: 10, color: 'var(--cyan-mid)', fontFamily: 'var(--font-mono)' }}>
              {line.text}
            </span>
          </div>
        ))}
      </div>

      {/* Metric bars */}
      <div style={{ padding: '10px 12px', flex: 1, overflowY: 'auto' }}>
        {DEMO_TELEMETRY.map((item) => (
          <div key={item.label} style={{ marginBottom: 12 }}>
            <div
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                marginBottom: 3,
              }}
            >
              <span
                style={{
                  fontSize: 10,
                  color: 'var(--text-secondary)',
                  fontFamily: 'var(--font-mono)',
                }}
              >
                {item.label}
              </span>
              <span
                style={{
                  fontSize: 10,
                  color: item.red ? 'var(--red-bar)' : 'var(--cyan-primary)',
                  fontFamily: 'var(--font-mono)',
                  fontWeight: 700,
                }}
              >
                {item.value}%
              </span>
            </div>
            <div className="telemetry-bar-track">
              <div
                className={`telemetry-bar-fill${item.red ? ' red' : ''}`}
                style={{ width: `${item.value}%` }}
              />
            </div>
          </div>
        ))}
      </div>

      {/* Footer separator line */}
      <div
        style={{
          height: 2,
          background:
            'linear-gradient(90deg, transparent 0%, var(--cyan-dim) 30%, var(--cyan-primary) 50%, var(--cyan-dim) 70%, transparent 100%)',
          opacity: 0.4,
        }}
      />
    </aside>
  )
}
