import { useHermesStore } from '../../store/hermes'
import type { Agent } from '../../store/types'

interface BubbleAgent {
  id: string; name: string; label: string; role: string;
  status: string; tasksActive: number; x: number; y: number;
}

function getOrbitPosition(index: number, total: number) {
  const angle = (index / total) * Math.PI * 2 - Math.PI / 2
  return { x: 50 + (Math.cos(angle) * 140) / 3, y: 50 + (Math.sin(angle) * 120) / 3 }
}

export default function OrbitalBubbleMap() {
  const agents = useHermesStore((s) => s.agents) as Agent[]

  const satelliteAgents: BubbleAgent[] = agents
    .filter((a) => a.id !== 'hermes')
    .map((a, i, arr) => {
      const pos = getOrbitPosition(i, arr.length)
      return { id: a.id, name: a.name, label: a.name.toUpperCase().slice(0, 4), role: a.role, status: a.status, tasksActive: a.tasksActive, x: pos.x, y: pos.y }
    })

  const getStatusColor = (status: string) => {
    if (status === 'active') return 'var(--amber-primary)'
    if (status === 'working') return 'var(--cyan-secondary)'
    if (status === 'error')   return 'var(--red-alert)'
    return 'var(--text-dim)'
  }

  const statusGlow = (status: string) => {
    if (status === 'active') return 'var(--amber-glow)'
    if (status === 'working') return 'var(--cyan-glow)'
    if (status === 'error')   return 'var(--red-glow)'
    return 'transparent'
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%', position: 'relative' }}>
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '8px 12px', borderBottom: '1px solid var(--border-panel)' }}>
        <span style={{ fontSize: 10, fontFamily: 'var(--font-display)', fontWeight: 700, color: 'var(--text-primary)', letterSpacing: '0.12em' }}>AGENT PANEL</span>
        <span style={{ fontSize: 9, fontFamily: 'var(--font-mono)', color: 'var(--amber-primary)', border: '1px solid var(--amber-primary)', padding: '1px 6px', borderRadius: 3 }}>CTF</span>
      </div>

      {/* Orbital map */}
      <div style={{ flex: 1, position: 'relative', minHeight: 200 }}>
        {/* Orbit ring */}
        <div style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', width: 260, height: 220, border: '1px dashed var(--cyan-dim)', borderRadius: '50%' }} />

        {/* Connectors */}
        <svg style={{ position: 'absolute', inset: 0, pointerEvents: 'none' }}>
          {satelliteAgents.map((agent) => (
            <line key={`l-${agent.id}`} x1="50%" y1="50%" x2={`${agent.x}%`} y2={`${agent.y}%`}
              stroke="var(--cyan-dim)" strokeWidth="1" strokeDasharray="5 3" opacity="0.4" />
          ))}
        </svg>

        {/* Central HERMES node */}
        <div style={{
          position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)',
          width: 40, height: 40, borderRadius: '50%',
          background: 'var(--amber-primary)', boxShadow: '0 0 24px var(--amber-glow)',
          display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 5,
        }}>
          <span style={{ fontSize: 9, fontWeight: 900, fontFamily: 'var(--font-display)', color: 'var(--bg-void)' }}>H</span>
        </div>

        {/* Satellite nodes */}
        {satelliteAgents.map((agent) => (
          <div key={agent.id} title={`${agent.name} — ${agent.role}`} style={{
            position: 'absolute', top: `${agent.y}%`, left: `${agent.x}%`, transform: 'translate(-50%, -50%)',
            width: 24, height: 24, borderRadius: '50%',
            background: getStatusColor(agent.status), boxShadow: `0 0 12px ${statusGlow(agent.status)}`,
            display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer',
          }}>
            <span style={{ fontSize: 7, fontWeight: 900, fontFamily: 'var(--font-display)', color: 'var(--bg-void)' }}>{agent.label}</span>
          </div>
        ))}

        {/* Add button */}
        <button title="Add Agent" style={{
          position: 'absolute', left: '8%', top: '50%', transform: 'translate(-50%, -50%)',
          width: 20, height: 20, borderRadius: '50%', border: '1px dashed var(--cyan-dim)',
          background: 'transparent', color: 'var(--cyan-dim)', fontSize: 13, cursor: 'pointer',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
        }}>+</button>
      </div>

      {/* Task list */}
      <div style={{ borderTop: '1px solid var(--border-panel)', padding: '3px 0', flexShrink: 0 }}>
        {agents.map((agent) => (
          <div key={agent.id} style={{
            display: 'flex', alignItems: 'center', justifyContent: 'space-between',
            padding: '4px 12px', cursor: 'pointer',
          }}
            onMouseEnter={(e) => { (e.currentTarget as HTMLDivElement).style.background = 'rgba(255,170,0,0.04)' }}
            onMouseLeave={(e) => { (e.currentTarget as HTMLDivElement).style.background = 'transparent' }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
              <span style={{ fontSize: 7, color: agent.status === 'idle' ? 'var(--text-dim)' : 'var(--amber-primary)' }}>&#9632;</span>
              <span style={{ fontSize: 10, fontWeight: 700, fontFamily: 'var(--font-display)', color: 'var(--text-primary)', letterSpacing: '0.04em' }}>
                {agent.name.toUpperCase()}
              </span>
            </div>
            <span style={{ fontSize: 10, fontFamily: 'var(--font-mono)', color: agent.status === 'idle' ? 'var(--text-dim)' : 'var(--amber-text)' }}>
              {agent.status === 'idle' ? 'IDLE' : `${agent.tasksActive} TASKS`}
            </span>
          </div>
        ))}
      </div>
    </div>
  )
}
