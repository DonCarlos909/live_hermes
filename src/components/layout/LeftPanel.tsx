import { motion, AnimatePresence } from 'framer-motion'
import { Brain, Wrench, ListTodo, FolderOpen, Network } from 'lucide-react'
import { useHermesStore } from '../../store/hermes'
import MemoryPanel from '../sidebar/MemoryPanel'
import ToolsPanel from '../sidebar/ToolsPanel'
import TasksPanel from '../sidebar/TasksPanel'
import AgentsPanel from '../sidebar/AgentsPanel'

const TABS = [
  { id: 'agents', label: 'Agents', icon: Network },
  { id: 'memory', label: 'Memory', icon: Brain },
  { id: 'tools', label: 'Tools', icon: Wrench },
  { id: 'tasks', label: 'Tasks', icon: ListTodo },
  { id: 'files', label: 'Files', icon: FolderOpen },
]

function FilesPanel() {
  return (
    <div className="flex flex-col h-full">
      <div className="flex items-center justify-between px-3 py-2 border-b border-white/5">
        <h3 className="text-xs font-mono tracking-wider text-[#f0f0ff]">FILES</h3>
      </div>
      <div className="flex-1 flex items-center justify-center">
        <p className="text-[10px] font-mono text-white/20">Drop files here</p>
      </div>
    </div>
  )
}

export default function LeftPanel() {
  const activeTab = useHermesStore((s) => s.activeSidebarTab)
  const setActiveTab = useHermesStore((s) => s.setActiveSidebarTab)
  const leftPanelOpen = useHermesStore((s) => s.leftPanelOpen)
  const toggleLeftPanel = useHermesStore((s) => s.toggleLeftPanel)

  const renderPanel = () => {
    switch (activeTab) {
      case 'agents': return <AgentsPanel />
      case 'memory': return <MemoryPanel />
      case 'tools': return <ToolsPanel />
      case 'tasks': return <TasksPanel />
      case 'files': return <FilesPanel />
      default: return <AgentsPanel />
    }
  }

  return (
    <motion.aside
      className="left-panel flex flex-col bg-black/40 backdrop-blur-md border-r border-white/5 z-20 shrink-0"
      initial={{ width: 280, opacity: 1 }}
      animate={{ width: leftPanelOpen ? 280 : 48, opacity: 1 }}
      transition={{ type: 'spring', stiffness: 300, damping: 30 }}
    >
      {/* Tab bar */}
      <div className="flex border-b border-white/5 shrink-0">
        {TABS.map((tab) => {
          const Icon = tab.icon
          const isActive = activeTab === tab.id
          return (
            <button
              key={tab.id}
              onClick={() => {
                if (!leftPanelOpen) toggleLeftPanel()
                setActiveTab(tab.id)
              }}
              className="flex-1 flex flex-col items-center gap-0.5 py-2 transition-colors relative"
              style={{ color: isActive ? '#00d4ff' : '#333' }}
              title={tab.label}
            >
              <Icon size={14} />
              {leftPanelOpen && (
                <span className="text-[8px] font-mono tracking-wider">{tab.label}</span>
              )}
              {isActive && (
                <motion.div
                  layoutId="tab-indicator"
                  className="absolute bottom-0 left-1 right-1 h-0.5 bg-[#00d4ff] rounded-full"
                  style={{ boxShadow: '0 0 6px #00d4ff' }}
                />
              )}
            </button>
          )
        })}
      </div>

      {/* Panel content */}
      <AnimatePresence mode="wait">
        {leftPanelOpen && (
          <motion.div
            key={activeTab}
            className="flex-1 overflow-hidden"
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 10 }}
            transition={{ duration: 0.15 }}
          >
            {renderPanel()}
          </motion.div>
        )}
      </AnimatePresence>
    </motion.aside>
  )
}
