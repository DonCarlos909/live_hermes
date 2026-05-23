import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Shield, Wifi, WifiOff, Clock, Activity } from 'lucide-react'
import { useHermesStore } from '../../store/hermes'
import hermesIcon from '../../assets/avatar/hermes-face.jpg'

export default function TopBar() {
  const isConnected = useHermesStore((s) => s.isConnected)
  const agents = useHermesStore((s) => s.agents)
  const mode = useHermesStore((s) => s.mode)
  const [time, setTime] = useState(new Date())

  useEffect(() => {
    const interval = setInterval(() => setTime(new Date()), 1000)
    return () => clearInterval(interval)
  }, [])

  const activeAgents = agents.filter((a) => a.status === 'active' || a.status === 'working').length
  const totalTasks = agents.reduce((sum, a) => sum + a.tasksActive, 0)

  const modeColors: Record<string, string> = {
    idle: '#00d4ff',
    analysis: '#00d4ff',
    ctf: '#ff2d55',
    coding: '#22d3ee',
    voice: '#8b5cf6',
  }

  return (
    <motion.header
      className="top-bar flex items-center justify-between h-12 px-4 bg-black/50 backdrop-blur-md border-b border-white/5 shrink-0 z-30"
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
    >
      {/* Left: Logo + Status */}
      <div className="flex items-center gap-3">
        <div className="flex items-center gap-2">
          <img
            src={hermesIcon}
            alt="Hermes"
            className="w-7 h-7 rounded-full object-cover border border-[#00d4ff33]"
            style={{ boxShadow: '0 0 8px rgba(0,212,255,0.3)' }}
          />
          <span className="font-['Orbitron'] text-sm font-bold tracking-wider text-[#f0f0ff]">
            HERMES
          </span>
          <span className="text-[9px] font-mono text-white/20">v1.0</span>
        </div>

        <div className="h-4 w-px bg-white/10" />

        <div className="flex items-center gap-1.5">
          {isConnected ? (
            <Wifi size={12} className="text-[#22d3ee]" />
          ) : (
            <WifiOff size={12} className="text-[#ff2d55]" />
          )}
          <span className={`text-[9px] font-mono ${isConnected ? 'text-[#22d3ee]' : 'text-[#ff2d55]'}`}>
            {isConnected ? 'ONLINE' : 'OFFLINE'}
          </span>
        </div>
      </div>

      {/* Center: Mode indicator */}
      <div
        className="flex items-center gap-2 px-3 py-1 rounded-full border"
        style={{
          borderColor: `${modeColors[mode]}22`,
          background: `${modeColors[mode]}08`,
        }}
      >
        <Shield size={12} style={{ color: modeColors[mode] }} />
        <span className="text-[9px] font-mono tracking-widest" style={{ color: modeColors[mode] }}>
          {mode.toUpperCase()} MODE
        </span>
      </div>

      {/* Right: Stats + Time */}
      <div className="flex items-center gap-4">
        <div className="flex items-center gap-1.5">
          <Activity size={12} className="text-[#00d4ff]" />
          <span className="text-[9px] font-mono text-white/50">
            {activeAgents} agents · {totalTasks} tasks
          </span>
        </div>

        <div className="h-4 w-px bg-white/10" />

        <div className="flex items-center gap-1.5">
          <Clock size={12} className="text-white/30" />
          <span className="text-[10px] font-mono text-white/50 tabular-nums">
            {time.toLocaleTimeString('en-US', { hour12: false })}
          </span>
        </div>
      </div>
    </motion.header>
  )
}
