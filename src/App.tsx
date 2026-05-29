import { useEffect } from 'react'
import { useHermesStore } from './store/hermes'
import TopBar from './components/layout/TopBar'
import LeftPanel from './components/layout/LeftPanel'
import RightPanel from './components/layout/RightPanel'
import MainArea from './components/layout/MainArea'
import BottomChat from './components/chat/BottomChat'
import HologramEffects from './components/effects/HologramEffects'
import ModeSystem from './components/mode/ModeSystem'

export default function App() {
  const setAvatarState = useHermesStore((s) => s.setAvatarState)

  // Demo: cycle avatar states
  useEffect(() => {
    const states = ['idle', 'thinking', 'speaking', 'listening'] as const
    let idx = 0
    const interval = setInterval(() => {
      idx = (idx + 1) % states.length
      setAvatarState(states[idx])
    }, 8000)
    return () => clearInterval(interval)
  }, [setAvatarState])

  return (
    <div
      style={{
        height: '100vh',
        width: '100vw',
        display: 'flex',
        flexDirection: 'column',
        background: 'var(--bg-void)',
        color: 'var(--text-primary)',
        overflow: 'hidden',
        fontFamily: 'var(--font-mono)',
      }}
    >
      {/* Holographic overlay effects */}
      <HologramEffects />

      {/* Mode system overlays */}
      <ModeSystem />

      {/* Zone 1: Topbar */}
      <TopBar />

      {/* Zone 2-4: Main content row */}
      <div style={{ display: 'flex', flex: 1, minHeight: 0 }}>
        {/* Zone 2: Left Panel */}
        <LeftPanel />

        {/* Zone 3-4: Center column */}
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', minWidth: 0 }}>
          {/* Zone 4: Avatar core */}
          <MainArea />

          {/* Zone 3: Command interface */}
          <div style={{ height: 300, flexShrink: 0 }}>
            <BottomChat />
          </div>
        </div>

        {/* Zone 5: Right Telemetry Panel */}
        <RightPanel />
      </div>
    </div>
  )
}
