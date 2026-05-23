import { motion } from 'framer-motion'
import { useHermesStore } from '../../store/hermes'
import type { HermesMode } from '../../store/types'

const MODES: { id: HermesMode; label: string; color: string; desc: string }[] = [
  { id: 'idle', label: 'IDLE', color: '#00d4ff', desc: 'Standby' },
  { id: 'analysis', label: 'ANALYSIS', color: '#00d4ff', desc: 'Data streams' },
  { id: 'ctf', label: 'CTF', color: '#ff2d55', desc: 'Combat mode' },
  { id: 'coding', label: 'CODING', color: '#22d3ee', desc: 'Build mode' },
  { id: 'voice', label: 'VOICE', color: '#8b5cf6', desc: 'Conversation' },
]

const MODE_THEMES: Record<HermesMode, { accent: string; glow: string; particleSpeed: number }> = {
  idle: { accent: '#00d4ff', glow: 'rgba(0,212,255,0.1)', particleSpeed: 0.02 },
  analysis: { accent: '#00d4ff', glow: 'rgba(0,212,255,0.2)', particleSpeed: 0.05 },
  ctf: { accent: '#ff2d55', glow: 'rgba(255,45,85,0.2)', particleSpeed: 0.08 },
  coding: { accent: '#22d3ee', glow: 'rgba(34,211,238,0.15)', particleSpeed: 0.03 },
  voice: { accent: '#8b5cf6', glow: 'rgba(139,92,246,0.2)', particleSpeed: 0.01 },
}

export default function ModeSystem() {
  const mode = useHermesStore((s) => s.mode)
  const setMode = useHermesStore((s) => s.setMode)
  const theme = MODE_THEMES[mode]

  return (
    <>
      {/* Mode indicator glow */}
      <motion.div
        className="pointer-events-none fixed inset-0 z-10"
        animate={{ boxShadow: `inset 0 0 100px ${theme.glow}` }}
        transition={{ duration: 0.8 }}
      />

      {/* Mode switcher — floating pill */}
      <motion.div
        className="fixed top-4 right-4 z-50 flex items-center gap-1 bg-black/60 backdrop-blur-md rounded-full px-1 py-1 border border-white/10"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        {MODES.map((m) => (
          <button
            key={m.id}
            onClick={() => setMode(m.id)}
            className="relative px-2.5 py-1 rounded-full text-[9px] font-mono tracking-wider transition-all"
            style={{
              color: mode === m.id ? m.color : '#555',
            }}
          >
            {mode === m.id && (
              <motion.div
                layoutId="mode-pill"
                className="absolute inset-0 rounded-full"
                style={{ backgroundColor: `${m.color}15`, border: `1px solid ${m.color}33` }}
                transition={{ type: 'spring', stiffness: 300, damping: 30 }}
              />
            )}
            <span className="relative z-10">{m.label}</span>
          </button>
        ))}
      </motion.div>

      {/* CTF mode overlay */}
      {mode === 'ctf' && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 pointer-events-none z-5"
          style={{
            background: 'repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(255,45,85,0.02) 2px, rgba(255,45,85,0.02) 4px)',
          }}
        />
      )}

      {/* Coding mode — matrix rain overlay */}
      {mode === 'coding' && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="fixed inset-0 pointer-events-none z-5"
          style={{
            background: 'repeating-linear-gradient(0deg, transparent, transparent 3px, rgba(34,211,238,0.015) 3px, rgba(34,211,238,0.015) 6px)',
          }}
        />
      )}
    </>
  )
}
