import React from 'react'
import { useHermesStore } from '../../store/hermes'
import type { Agent } from '../../store/types'

interface BubbleAgent {
  id: string
  name: string
  label: string
  role: string
  status: string
  tasksActive: number
  x: number // percentage position on orbit
  y: number
}

// Orbital positions for satellite agents (calculated for 180px radius orbit)
function getOrbitPosition(index: number, total: number) {
  const angle = (index / total) * Math.PI * 2 - Math.PI / 2 // start from top
  const rx = 140 // orbit radius x
  const ry = 120 // orbit radius y
  return {
    x: 50 + (Math.cos(angle) * rx) / 3, // percentage in container
    y: 50 + (Math.sin(angle) * ry) / 3,
  }
}

export default function OrbitalBubbleMap() {
  const agents = useHermesStore((s) => s.agents) as Agent[]

  const satelliteAgents: BubbleAgent[] = agents
    .filter((a) => a.id !== 'hermes')
    .map((a, i, arr) => {
      const pos = getOrbitPosition(i, arr.length)
      return {
        id: a.id,
        name: a.name,
        label: a.name.toUpperCase().slice(0, 4),
        role: a.role,
        status: a.status,
        tasksActive: a.tasksActive,
        x: pos.x,
        y: pos.y,
      }
    })

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'var(--cyan-primary)'
      case 'working': return 'var(--cyan-mid)'
      case 'error': return 'var(--red-bar)'
      default: return 'var(--text-secondary)'
    }
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%', position: 'relative' }}>
      {/* Header */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: '8px 12px',
          borderBottom: '1px solid var(--border-panel)',
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
          AGENT PANEL
        </span>
        <span
          style={{
            fontSize: 10,
            fontFamily: 'var(--font-mono)',
            color: 'var(--cyan-primary)',
            border: '1px solid var(--cyan-primary)',
            padding: '1px 6px',
            borderRadius: 3,
          }}
        >
          CTF
        </span>
      </div>

      {/* Orbital bubble map */}
      <div style={{ flex: 1, position: 'relative', minHeight: 220 }}>
        {/* Orbit ring */}
        <div
          className="orbit-ring"
          style={{
            width: 280,
            height: 240,
          }}
        />

        {/* Connector lines from center to each satellite */}
        <svg
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
            pointerEvents: 'none',
          }}
        >
          {satelliteAgents.map((agent) => (
            <line
              key={`line-${agent.id}`}
              x1="50%"
              y1="50%"
              x2={`${agent.x}%`}
              y2={`${agent.y}%`}
              className="orbit-connector"
            />
          ))}
        </svg>

        {/* Central HERMES node */}
        <div
          className="orbit-node"
          style={{
            width: 42,
            height: 42,
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            background: 'var(--cyan-primary)',
            boxShadow: '0 0 20px var(--cyan-glow)',
            zIndex: 5,
          }}
        >
          <span
            style={{
              fontSize: 8,
              fontWeight: 900,
              fontFamily: 'var(--font-display)',
              color: 'var(--bg-void)',
              letterSpacing: '0.05em',
            }}
          >
            H
          </span>
        </div>

        {/* Satellite nodes */}
        {satelliteAgents.map((agent) => (
          <div
            key={agent.id}
            className="orbit-node"
            title={`${agent.name} · ${agent.role} · ${agent.tasksActive} active`}
            style={{
              width: 26,
              height: 26,
              top: `${agent.y}%`,
              left: `${agent.x}%`,
              transform: 'translate(-50%, -50%)',
              background: getStatusColor(agent.status),
              boxShadow: `0 0 10px ${getStatusColor(agent.status)}44`,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <span
              style={{
                fontSize: 7,
                fontWeight: 900,
                fontFamily: 'var(--font-display)',
                color: 'var(--bg-void)',
              }}
            >
              {agent.label}
            </span>
          </div>
        ))}

        {/* Add agent button */}
        <button
          style={{
            position: 'absolute',
            left: '8%',
            top: '50%',
            transform: 'translate(-50%, -50%)',
            width: 22,
            height: 22,
            borderRadius: '50%',
            border: '1px dashed var(--cyan-dim)',
            background: 'transparent',
            color: 'var(--cyan-dim)',
            fontSize: 14,
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
          title="Add Agent"
        >
          +
        </button>
      </div>

      {/* Task list */}
      <div
        style={{
          borderTop: '1px solid var(--border-panel)',
          padding: '4px 0',
          flexShrink: 0,
        }}
      >
        {agents.map((agent) => (
          <div
            key={agent.id}
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              padding: '5px 12px',
              cursor: 'pointer',
              transition: 'background 0.15s',
            }}
            onMouseEnter={(e) => {
              (e.currentTarget as HTMLDivElement).style.background = 'rgba(0,232,255,0.04)'
            }}
            onMouseLeave={(e) => {
              (e.currentTarget as HTMLDivElement).style.background = 'transparent'
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <span
                style={{
                  fontSize: 8,
                  color: agent.status === 'idle' ? 'var(--text-secondary)' : 'var(--cyan-primary)',
                }}
              >
                &#9632;
              </span>
              <span
                style={{
                  fontSize: 12,
                  fontWeight: 700,
                  fontFamily: 'var(--font-display)',
                  color: 'var(--text-primary)',
                  letterSpacing: '0.04em',
                }}
              >
                {agent.name.toUpperCase()}
              </span>
            </div>
            <span
              style={{
                fontSize: 12,
                fontFamily: 'var(--font-mono)',
                color:
                  agent.status === 'idle'
                    ? 'var(--text-secondary)'
                    : 'var(--cyan-primary)',
              }}
            >
              {agent.status === 'idle'
                ? 'IDLE'
                : `${agent.tasksActive} TASKS`}
            </span>
          </div>
        ))}
      </div>
    </div>
  )
}
