import { useEffect, useState, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

export default function HologramEffects() {
  const [glitchActive, setGlitchActive] = useState(false)

  const triggerGlitch = useCallback(() => {
    setGlitchActive(true)
    setTimeout(() => setGlitchActive(false), 80)
  }, [])

  useEffect(() => {
    // Random glitch every 15-30 seconds
    const scheduleGlitch = () => {
      const delay = 15000 + Math.random() * 15000
      return setTimeout(() => {
        triggerGlitch()
        timerRef = scheduleGlitch()
      }, delay)
    }

    let timerRef = scheduleGlitch()
    return () => clearTimeout(timerRef)
  }, [triggerGlitch])

  return (
    <>
      {/* Scanlines */}
      <div
        className="holo-effects pointer-events-none fixed inset-0 z-50"
        style={{
          background: 'repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(0,0,0,0.03) 2px, rgba(0,0,0,0.03) 4px)',
        }}
      />

      {/* Vignette */}
      <div
        className="pointer-events-none fixed inset-0 z-40"
        style={{
          background: 'radial-gradient(ellipse at center, transparent 50%, rgba(0,0,0,0.4) 100%)',
        }}
      />

      {/* Bloom / glow overlay */}
      <div
        className="pointer-events-none fixed inset-0 z-30"
        style={{ mixBlendMode: 'screen', opacity: 0.5 }}
      />

      {/* Glitch effect */}
      <AnimatePresence>
        {glitchActive && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.04 }}
            className="pointer-events-none fixed inset-0 z-50"
          >
            {/* Chromatic aberration slices */}
            <div
              className="absolute inset-0"
              style={{
                background: 'linear-gradient(90deg, rgba(255,0,0,0.06) 0%, transparent 5%, transparent 95%, rgba(0,0,255,0.06) 100%)',
              }}
            />
            {/* Random displacement bar */}
            <div
              className="absolute left-0 right-0 h-2"
              style={{
                top: `${10 + Math.random() * 80}%`,
                background: 'rgba(0,212,255,0.1)',
                transform: `translateX(${(Math.random() - 0.5) * 20}px)`,
              }}
            />
          </motion.div>
        )}
      </AnimatePresence>

      {/* Corner decorations */}
      <svg className="pointer-events-none fixed top-0 left-0 w-16 h-16 z-20" viewBox="0 0 64 64">
        <path d="M0 20 L0 0 L20 0" fill="none" stroke="#00d4ff" strokeWidth="0.5" opacity="0.3" />
      </svg>
      <svg className="pointer-events-none fixed top-0 right-0 w-16 h-16 z-20" viewBox="0 0 64 64">
        <path d="M44 0 L64 0 L64 20" fill="none" stroke="#00d4ff" strokeWidth="0.5" opacity="0.3" />
      </svg>
      <svg className="pointer-events-none fixed bottom-0 left-0 w-16 h-16 z-20" viewBox="0 0 64 64">
        <path d="M0 44 L0 64 L20 64" fill="none" stroke="#00d4ff" strokeWidth="0.5" opacity="0.3" />
      </svg>
      <svg className="pointer-events-none fixed bottom-0 right-0 w-16 h-16 z-20" viewBox="0 0 64 64">
        <path d="M44 64 L64 64 L64 44" fill="none" stroke="#00d4ff" strokeWidth="0.5" opacity="0.3" />
      </svg>
    </>
  )
}
