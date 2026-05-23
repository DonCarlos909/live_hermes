import { motion } from 'framer-motion'
import { Terminal, Globe, FileCode, Image, Mic, Cpu, Database, Wifi } from 'lucide-react'

const TOOLS = [
  { id: 'terminal', name: 'Terminal', icon: Terminal, color: '#00d4ff' },
  { id: 'browser', name: 'Browser', icon: Globe, color: '#22d3ee' },
  { id: 'code', name: 'Code Editor', icon: FileCode, color: '#8b5cf6' },
  { id: 'vision', name: 'Vision', icon: Image, color: '#fbbf24' },
  { id: 'voice', name: 'Voice', icon: Mic, color: '#ff2d55' },
  { id: 'sandbox', name: 'Sandbox', icon: Cpu, color: '#00d4ff' },
  { id: 'memory', name: 'Memory DB', icon: Database, color: '#8b5cf6' },
  { id: 'network', name: 'Network', icon: Wifi, color: '#22d3ee' },
]

export default function ToolsPanel() {
  const [activeTool, setActiveTool] = React.useState<string | null>(null)

  return (
    <div className="flex flex-col h-full">
      <div className="flex items-center justify-between px-3 py-2 border-b border-white/5">
        <h3 className="text-xs font-mono tracking-wider text-[#22d3ee]">TOOLS</h3>
      </div>
      <div className="grid grid-cols-2 gap-1.5 p-2">
        {TOOLS.map((tool) => {
          const Icon = tool.icon
          const isActive = activeTool === tool.id
          return (
            <motion.button
              key={tool.id}
              whileTap={{ scale: 0.95 }}
              onClick={() => setActiveTool(isActive ? null : tool.id)}
              className="flex flex-col items-center gap-1.5 p-2.5 rounded-lg border transition-all"
              style={{
                borderColor: isActive ? `${tool.color}44` : 'transparent',
                background: isActive ? `${tool.color}11` : 'rgba(255,255,255,0.02)',
              }}
            >
              <Icon size={18} style={{ color: isActive ? tool.color : '#555' }} />
              <span
                className="text-[9px] font-mono transition-colors"
                style={{ color: isActive ? tool.color : '#555' }}
              >
                {tool.name}
              </span>
            </motion.button>
          )
        })}
      </div>
    </div>
  )
}

import React from 'react'
