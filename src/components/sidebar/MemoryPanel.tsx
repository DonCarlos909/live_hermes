import { motion } from 'framer-motion'
import { useHermesStore } from '../../store/hermes'

export default function MemoryPanel() {
  const memoryNodes = useHermesStore((s) => s.memoryNodes)

  const categoryColors: Record<string, string> = {
    preference: '#00d4ff',
    mission: '#ff2d55',
    file: '#22d3ee',
    context: '#8b5cf6',
    skill: '#fbbf24',
    longterm: '#f0f0ff',
  }

  const categoryIcons: Record<string, string> = {
    preference: '◈',
    mission: '◆',
    file: '▣',
    context: '◎',
    skill: '✦',
    longterm: '⬡',
  }

  return (
    <div className="flex flex-col h-full">
      <div className="flex items-center justify-between px-3 py-2 border-b border-white/5">
        <h3 className="text-xs font-mono tracking-wider text-[#8b5cf6]">MEMORY CORE</h3>
        <span className="text-[10px] font-mono text-white/30">{memoryNodes.length} nodes</span>
      </div>

      <div className="flex-1 overflow-y-auto p-2 space-y-1 scrollbar-thin">
        {memoryNodes.map((node) => {
          const color = categoryColors[node.category] || '#555'
          return (
            <motion.div
              key={node.id}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              className="flex items-center gap-2 px-2 py-1.5 rounded-lg hover:bg-white/5 transition-colors cursor-pointer group"
            >
              <span style={{ color }} className="text-sm shrink-0">
                {categoryIcons[node.category] || '○'}
              </span>
              <div className="flex-1 min-w-0">
                <p className="text-[11px] font-mono text-white/80 truncate group-hover:text-white transition-colors">
                  {node.label}
                </p>
              </div>
              <div className="flex gap-0.5">
                {node.connections.slice(0, 3).map((_, i) => (
                  <div
                    key={i}
                    className="w-1 h-1 rounded-full"
                    style={{ backgroundColor: `${color}66` }}
                  />
                ))}
              </div>
            </motion.div>
          )
        })}
      </div>

      {/* Neural network mini-map */}
      <div className="border-t border-white/5 p-2">
        <p className="text-[9px] font-mono text-white/20 mb-1">NEURAL MAP</p>
        <div className="relative h-16 bg-black/30 rounded border border-white/5 overflow-hidden">
          <svg width="100%" height="100%" viewBox="0 0 200 60">
            {memoryNodes.map((node, i) => {
              const x = 20 + (i % 3) * 70
              const y = 15 + Math.floor(i / 3) * 25
              const color = categoryColors[node.category] || '#555'
              return (
                <g key={node.id}>
                  {node.connections.map((cid) => {
                    const targetIdx = memoryNodes.findIndex((n) => n.id === cid)
                    if (targetIdx === -1) return null
                    const tx = 20 + (targetIdx % 3) * 70
                    const ty = 15 + Math.floor(targetIdx / 3) * 25
                    return (
                      <line
                        key={`${node.id}-${cid}`}
                        x1={x}
                        y1={y}
                        x2={tx}
                        y2={ty}
                        stroke={color}
                        strokeOpacity={0.15}
                        strokeWidth={0.5}
                      />
                    )
                  })}
                  <circle cx={x} cy={y} r={4} fill={color} opacity={0.3} />
                  <circle cx={x} cy={y} r={2} fill={color} opacity={0.8} />
                  <text x={x} y={y + 10} textAnchor="middle" fill="white" fontSize={4} opacity={0.4}>
                    {node.label.slice(0, 6)}
                  </text>
                </g>
              )
            })}
          </svg>
        </div>
      </div>
    </div>
  )
}
