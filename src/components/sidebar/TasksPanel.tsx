import { motion } from 'framer-motion'
import { useHermesStore } from '../../store/hermes'
import { CheckCircle, Clock, Loader, AlertCircle } from 'lucide-react'

export default function TasksPanel() {
  const tasks = useHermesStore((s) => s.tasks)
  const agents = useHermesStore((s) => s.agents)

  const statusConfig = {
    pending: { icon: Clock, color: '#555', label: 'PENDING' },
    in_progress: { icon: Loader, color: '#00d4ff', label: 'IN PROGRESS' },
    completed: { icon: CheckCircle, color: '#22d3ee', label: 'COMPLETED' },
    failed: { icon: AlertCircle, color: '#ff2d55', label: 'FAILED' },
  }

  return (
    <div className="flex flex-col h-full">
      <div className="flex items-center justify-between px-3 py-2 border-b border-white/5">
        <h3 className="text-xs font-mono tracking-wider text-[#fbbf24]">TASKS</h3>
        <span className="text-[10px] font-mono text-white/30">
          {tasks.filter((t) => t.status === 'completed').length}/{tasks.length}
        </span>
      </div>

      <div className="flex-1 overflow-y-auto p-2 space-y-1.5 scrollbar-thin">
        {tasks.map((task) => {
          const config = statusConfig[task.status]
          const Icon = config.icon
          const agent = agents.find((a) => a.id === task.agentId)

          return (
            <motion.div
              key={task.id}
              initial={{ opacity: 0, y: 5 }}
              animate={{ opacity: 1, y: 0 }}
              className="p-2 rounded-lg bg-white/[0.02] border border-white/5 hover:border-white/10 transition-colors"
            >
              <div className="flex items-start gap-2">
                <Icon size={12} style={{ color: config.color }} className="mt-0.5 shrink-0" />
                <div className="flex-1 min-w-0">
                  <p className="text-[10px] font-mono text-white/80 truncate">{task.title}</p>
                  <div className="flex items-center gap-2 mt-1">
                    <span className="text-[8px] font-mono" style={{ color: config.color }}>
                      {config.label}
                    </span>
                    {agent && (
                      <span className="text-[8px] font-mono text-white/30">
                        → {agent.name}
                      </span>
                    )}
                  </div>
                  {task.status === 'in_progress' && (
                    <div className="mt-1.5 h-0.5 bg-white/5 rounded-full overflow-hidden">
                      <motion.div
                        className="h-full rounded-full"
                        style={{ backgroundColor: config.color }}
                        initial={{ width: 0 }}
                        animate={{ width: `${task.progress}%` }}
                        transition={{ duration: 0.5 }}
                      />
                    </div>
                  )}
                </div>
              </div>
            </motion.div>
          )
        })}
      </div>
    </div>
  )
}
