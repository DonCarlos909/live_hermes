import { motion, AnimatePresence } from 'framer-motion'
import { useHermesStore } from '../../store/hermes'
import OrbitalBubbleMap from '../bubble/OrbitalBubbleMap'
import MemoryPanel from '../sidebar/MemoryPanel'
import ToolsPanel from '../sidebar/ToolsPanel'
import TasksPanel from '../sidebar/TasksPanel'
import SettingsPanel from '../sidebar/SettingsPanel'

type SidebarTab = 'agents' | 'memory' | 'tools' | 'tasks' | 'settings'

export default function LeftPanel() {
  const activeTab = useHermesStore<SidebarTab>((s) => s.activeSidebarTab as SidebarTab)
  const setActiveTab = useHermesStore((s) => s.setActiveSidebarTab)

  const tabs: { id: SidebarTab; label: string }[] = [
    { id: 'agents', label: 'AGENTS' },
    { id: 'memory', label: 'MEMORY' },
    { id: 'tools', label: 'TOOLS' },
    { id: 'tasks', label: 'TASKS' },
    { id: 'settings', label: 'SETTINGS' },
  ]

  const renderPanel = () => {
    switch (activeTab) {
      case 'agents': return <OrbitalBubbleMap />
      case 'memory': return <MemoryPanel />
      case 'tools': return <ToolsPanel />
      case 'tasks': return <TasksPanel />
      case 'settings': return <SettingsPanel />
      default: return <OrbitalBubbleMap />
    }
  }

  return (
    <aside
      style={{
        width: 280,
        background: 'var(--bg-panel)',
        borderRight: '1px solid var(--border-panel)',
        display: 'flex',
        flexDirection: 'column',
        flexShrink: 0,
        zIndex: 20,
        position: 'relative',
      }}
    >
      {/* Tab header */}
      <nav
        style={{
          display: 'flex',
          borderBottom: '1px solid var(--border-panel)',
          flexShrink: 0,
        }}
      >
        {tabs.map((tab) => {
          const isActive = activeTab === tab.id
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              style={{
                flex: 1,
                padding: '8px 4px',
                fontSize: 9,
                fontFamily: 'var(--font-mono)',
                fontWeight: 700,
                letterSpacing: '0.08em',
                color: isActive ? 'var(--cyan-primary)' : 'var(--text-secondary)',
                background: 'transparent',
                border: 'none',
                borderBottom: isActive ? '2px solid var(--cyan-primary)' : '2px solid transparent',
                cursor: 'pointer',
                transition: 'color 0.15s',
              }}
            >
              {tab.label}
            </button>
          )
        })}
      </nav>

      {/* Panel content */}
      <AnimatePresence mode="wait">
        <motion.div
          key={activeTab}
          style={{ flex: 1, overflow: 'hidden', display: 'flex', flexDirection: 'column' }}
          initial={{ opacity: 0, x: -8 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: 8 }}
          transition={{ duration: 0.12 }}
        >
          {renderPanel()}
        </motion.div>
      </AnimatePresence>
    </aside>
  )
}
