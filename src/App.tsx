import { useEffect } from 'react'
import { useHermesStore } from './store/hermes'
import TopBar from './components/layout/TopBar'
import LeftPanel from './components/layout/LeftPanel'
import MainArea from './components/layout/MainArea'
import BottomChat from './components/chat/BottomChat'
import HologramEffects from './components/effects/HologramEffects'
import ModeSystem from './components/mode/ModeSystem'

export default function App() {
  const setAvatarState = useHermesStore((s) => s.setAvatarState)

  // Cycle through avatar states for demo purposes
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
    <div className="hermes-app h-screen w-screen flex flex-col bg-[#0a0a0f] text-[#f0f0ff] overflow-hidden">
      {/* Holographic effects overlay */}
      <HologramEffects />

      {/* Mode system (glows + overlays) */}
      <ModeSystem />

      {/* Top status bar */}
      <TopBar />

      {/* Main content area */}
      <div className="flex flex-1 min-h-0">
        {/* Left sidebar */}
        <LeftPanel />

        {/* Center + Bottom */}
        <div className="flex-1 flex flex-col min-w-0">
          {/* Avatar + Background */}
          <MainArea />

          {/* Chat panel */}
          <div className="h-[320px] shrink-0">
            <BottomChat />
          </div>
        </div>
      </div>
    </div>
  )
}
