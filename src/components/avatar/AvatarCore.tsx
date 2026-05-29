import { useEffect, useRef, useCallback } from 'react'
import { motion } from 'framer-motion'
import { useHermesStore } from '../../store/hermes'
import type { AvatarState } from '../../store/types'
import hermesImg from '../../assets/avatar/hermes-circle.png'
import './avatar.css'

const STATE_LABELS: Record<AvatarState, string> = {
  idle: 'IDLE',
  speaking: 'TRANSMITTING',
  thinking: 'PROCESSING',
  listening: 'RECEIVING',
}

const STATE_COLORS: Record<string, string> = {
  idle: '#00e8ff',
  speaking: '#00e8ff',
  thinking: '#e8a020',
  listening: '#00e8ff',
}

export default function AvatarCore() {
  const avatarState = useHermesStore((s) => s.avatarState)
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const frameRef = useRef<number>(0)
  const timeRef = useRef(0)

  const currentColor = STATE_COLORS[avatarState] ?? '#00e8ff'

  // Draw orbital ring + particles on canvas
  const drawEffects = useCallback(
    (ctx: CanvasRenderingContext2D, w: number, h: number, t: number) => {
      const cx = w / 2
      const cy = h / 2
      const color = currentColor
      const state = useHermesStore.getState().avatarState

      ctx.clearRect(0, 0, w, h)

      // --- Outer orbital ring (horizontal arms style) ---
      const orbitRadius = 155

      // Main ring
      ctx.strokeStyle = state === 'idle' ? `${color}33` : color + '66'
      ctx.lineWidth = 1.5
      ctx.beginPath()
      ctx.arc(cx, cy, orbitRadius, 0, Math.PI * 2)
      ctx.stroke()

      // Glow on ring
      ctx.shadowColor = color
      ctx.shadowBlur = state === 'speaking' ? 20 : 10
      ctx.strokeStyle = state === 'idle' ? `${color}15` : `${color}30`
      ctx.lineWidth = 3
      ctx.beginPath()
      ctx.arc(cx, cy, orbitRadius, 0, Math.PI * 2)
      ctx.stroke()
      ctx.shadowBlur = 0

      // Second ring (outer)
      ctx.strokeStyle = `${color}10`
      ctx.lineWidth = 1
      ctx.beginPath()
      ctx.arc(cx, cy, orbitRadius + 14, 0, Math.PI * 2)
      ctx.stroke()

      // Horizontal arm lines extending from ring
      const armLength = 60
      const armY = cy
      ctx.strokeStyle = `${color}55`
      ctx.lineWidth = 1.5

      // Left arm
      ctx.beginPath()
      ctx.moveTo(cx - orbitRadius, armY)
      ctx.lineTo(cx - orbitRadius - armLength, armY)
      ctx.stroke()
      // Left arm cap circle
      ctx.beginPath()
      ctx.arc(cx - orbitRadius - armLength, armY, 3, 0, Math.PI * 2)
      ctx.fillStyle = `${color}88`
      ctx.fill()

      // Right arm
      ctx.beginPath()
      ctx.moveTo(cx + orbitRadius, armY)
      ctx.lineTo(cx + orbitRadius + armLength, armY)
      ctx.stroke()
      // Right arm cap circle
      ctx.beginPath()
      ctx.arc(cx + orbitRadius + armLength, armY, 3, 0, Math.PI * 2)
      ctx.fillStyle = `${color}88`
      ctx.fill()

      // --- Rotating arc segments ---
      if (state === 'speaking' || state === 'thinking') {
        const arcSpeed = state === 'speaking' ? 6 : 2
        const segmentCount = state === 'thinking' ? 4 : 8
        for (let i = 0; i < segmentCount; i++) {
          const angle = (i / segmentCount) * Math.PI * 2 + t * arcSpeed
          const innerR = orbitRadius + 4
          const outerR = orbitRadius + 10
          const startAngle = angle
          const endAngle = angle + 0.3

          ctx.beginPath()
          ctx.arc(cx, cy, outerR, startAngle, endAngle)
          ctx.arc(cx, cy, innerR, endAngle, startAngle, true)
          ctx.closePath()
          ctx.fillStyle = `${color}44`
          ctx.fill()
        }
      }

      // --- Floating particles around orbit ---
      for (let i = 0; i < 24; i++) {
        const angle = (i / 24) * Math.PI * 2 + t * 0.2
        const dist = orbitRadius + 20 + Math.sin(t * 2 + i * 0.8) * 15
        const px = cx + Math.cos(angle) * dist
        const py = cy + Math.sin(angle) * dist
        const alpha = 0.15 + Math.sin(t * 2.5 + i * 0.6) * 0.15
        ctx.fillStyle = `${color}${Math.max(0, Math.min(255, Math.floor(alpha * 255))).toString(16).padStart(2, '0')}`
        ctx.beginPath()
        ctx.arc(px, py, 1.5, 0, Math.PI * 2)
        ctx.fill()
      }

      // --- Listening arcs ---
      if (state === 'listening') {
        for (let i = 1; i <= 3; i++) {
          ctx.strokeStyle = `${color}${Math.max(0, Math.floor((1 - i * 0.25) * 80)).toString(16).padStart(2, '0')}`
          ctx.lineWidth = 1
          ctx.beginPath()
          ctx.arc(cx, cy, orbitRadius + 18 + i * 10, -0.35 * Math.PI, 0.35 * Math.PI)
          ctx.stroke()
        }
      }

      // --- Scanner sweep ---
      const scanAngle = (t * 0.8) % (Math.PI * 2)
      ctx.strokeStyle = `${color}20`
      ctx.lineWidth = 2
      ctx.beginPath()
      ctx.moveTo(cx, cy)
      ctx.lineTo(cx + Math.cos(scanAngle) * (orbitRadius + 30), cy + Math.sin(scanAngle) * (orbitRadius + 30))
      ctx.stroke()

      // Scanner glow dot
      const scanDotX = cx + Math.cos(scanAngle) * orbitRadius
      const scanDotY = cy + Math.sin(scanAngle) * orbitRadius
      ctx.fillStyle = `${color}66`
      ctx.beginPath()
      ctx.arc(scanDotX, scanDotY, 2, 0, Math.PI * 2)
      ctx.fill()
    },
    [currentColor],
  )

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    const resize = () => {
      const parent = canvas.parentElement
      if (parent) {
        canvas.width = parent.clientWidth
        canvas.height = parent.clientHeight
      }
    }
    resize()
    window.addEventListener('resize', resize)

    const animate = () => {
      timeRef.current += 0.016
      drawEffects(ctx, canvas.width, canvas.height, timeRef.current)
      frameRef.current = requestAnimationFrame(animate)
    }
    frameRef.current = requestAnimationFrame(animate)

    return () => {
      cancelAnimationFrame(frameRef.current)
      window.removeEventListener('resize', resize)
    }
  }, [drawEffects])

  return (
    <div className="avatar-core">
      <canvas ref={canvasRef} className="avatar-canvas" />

      {/* Starfield background */}
      <div
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
          background:
            'radial-gradient(ellipse at 50% 40%, #0a1a30 0%, #040810 100%)',
          zIndex: 0,
          pointerEvents: 'none',
        }}
      />

      {/* Avatar image */}
      <motion.div
        className="avatar-image-container"
        animate={{ y: [-4, 4, -4] }}
        transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
      >
        <div
          className="avatar-glow-ring"
          style={{
            boxShadow: `inset 0 0 40px rgba(0,232,255,0.15), 0 0 60px ${currentColor}22`,
          }}
        />
        <img
          src={hermesImg}
          alt="HERMES"
          className="avatar-image"
          style={{
            boxShadow: `0 0 30px ${currentColor}33`,
            border: `1px solid ${currentColor}44`,
          }}
        />
      </motion.div>

      {/* State label */}
      <motion.div
        className="avatar-state-label"
        animate={{ opacity: [0.6, 1, 0.6] }}
        transition={{ duration: 2.5, repeat: Infinity }}
        style={{ color: currentColor }}
      >
        <span
          style={{
            display: 'inline-block',
            width: 7,
            height: 7,
            borderRadius: '50%',
            background: currentColor,
            marginRight: 6,
            verticalAlign: 'middle',
            boxShadow: `0 0 8px ${currentColor}`,
          }}
        />
        {STATE_LABELS[avatarState] ?? 'IDLE'}
      </motion.div>
    </div>
  )
}
