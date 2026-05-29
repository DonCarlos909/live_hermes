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

  useEffect(() => {
    const states: Array<'idle' | 'thinking' | 'speaking' | 'listening'> = ['idle', 'thinking', 'speaking', 'listening']
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
        color: 'var(--text-0)',
        overflow: 'hidden',
        fontFamily: 'var(--font-mono)',
      }}
    >
      <HologramEffects />
      <ModeSystem />

      {/* Topbar — fixed height */}
      <TopBar />

      {/* Main row — fills remaining height */}
      <div style={{ display: 'flex', flex: 1, minHeight: 0, overflow: 'hidden' }}>
        {/* Left sidebar */}
        <LeftPanel />

        {/* Center column — flex column with overflow hidden */}
        <div style={{
          flex: 1,
          display: 'flex',
          flexDirection: 'column',
          minWidth: 0,
          overflow: 'hidden',
        }}>
          {/* Avatar area — takes available space above chat */}
          <div style={{ flex: 1, minHeight: 0, overflow: 'hidden' }}>
            <MainArea />
          </div>

          {/* Chat — fixed height, never grows */}
          <div style={{ height: 280, flexShrink: 0, overflow: 'hidden' }}>
            <BottomChat />
          </div>
        </div>

        {/* Right sidebar */}
        <RightPanel />
      </div>
    </div>
  )
}
