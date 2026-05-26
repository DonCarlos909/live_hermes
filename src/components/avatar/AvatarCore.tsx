import { useEffect, useRef, useCallback } from 'react'
import { motion } from 'framer-motion'
import { useHermesStore } from '../../store/hermes'
import type { AvatarState } from '../../store/types'
import hermesImg from '../../assets/avatar/hermes-circle.png'
import './avatar.css'

const STATE_LABELS: Record<AvatarState, string> = {
  idle: 'STANDBY',
  speaking: 'TRANSMITTING',
  thinking: 'PROCESSING',
  listening: 'RECEIVING',
}

const STATE_COLORS: Record<AvatarState, string> = {
  idle: '#00d4ff',
  speaking: '#22d3ee',
  thinking: '#8b5cf6',
  listening: '#00d4ff',
}

export default function AvatarCore() {
  const avatarState = useHermesStore((s) => s.avatarState)
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const frameRef = useRef<number>(0)
  const timeRef = useRef(0)

  // Particle ring around the avatar image
  const drawParticles = useCallback(
    (ctx: CanvasRenderingContext2D, w: number, h: number, t: number) => {
      const cx = w / 2
      const cy = h / 2
      const state = useHermesStore.getState().avatarState
      const color = STATE_COLORS[state]

      ctx.clearRect(0, 0, w, h)

      // Outer aura
      const auraRadius = 160 + Math.sin(t * 2) * 15 + (state === 'speaking' ? Math.sin(t * 8) * 20 : 0)
      const gradient = ctx.createRadialGradient(cx, cy, 60, cx, cy, auraRadius)
      gradient.addColorStop(0, `${color}22`)
      gradient.addColorStop(0.5, `${color}0a`)
      gradient.addColorStop(1, 'transparent')
      ctx.fillStyle = gradient
      ctx.beginPath()
      ctx.arc(cx, cy, auraRadius, 0, Math.PI * 2)
      ctx.fill()

      // Outer ring
      ctx.strokeStyle = `${color}33`
      ctx.lineWidth = 1.5
      ctx.beginPath()
      ctx.arc(cx, cy, 150, 0, Math.PI * 2)
      ctx.stroke()

      // Second ring
      ctx.strokeStyle = `${color}15`
      ctx.lineWidth = 1
      ctx.beginPath()
      ctx.arc(cx, cy, 170, 0, Math.PI * 2)
      ctx.stroke()

      // Rotating symbols for thinking
      if (state === 'thinking') {
        for (let i = 0; i < 8; i++) {
          const angle = (i / 8) * Math.PI * 2 + t * 1.5
          const sx = cx + Math.cos(angle) * 190
          const sy = cy + Math.sin(angle) * 190
          ctx.fillStyle = `${color}66`
          ctx.font = '16px monospace'
          ctx.textAlign = 'center'
          ctx.textBaseline = 'middle'
          ctx.fillText('◆', sx, sy)
        }
      }

      // Listening arcs
      if (state === 'listening') {
        for (let i = 1; i <= 4; i++) {
          ctx.strokeStyle = `${color}${Math.floor((1 - i * 0.2) * 255).toString(16).padStart(2, '0')}`
          ctx.lineWidth = 1.5
          ctx.beginPath()
          ctx.arc(cx, cy, 160 + i * 14, -0.4 * Math.PI, 0.4 * Math.PI)
          ctx.stroke()
        }
      }

      // Floating particles
      for (let i = 0; i < 30; i++) {
        const angle = (i / 30) * Math.PI * 2 + t * 0.3
        const dist = 130 + Math.sin(t * 2 + i * 0.7) * 50
        const px = cx + Math.cos(angle) * dist
        const py = cy + Math.sin(angle) * dist
        const alpha = 0.2 + Math.sin(t * 3 + i * 0.5) * 0.2
        ctx.fillStyle = `${color}${Math.floor(alpha * 255).toString(16).padStart(2, '0')}`
        ctx.beginPath()
        ctx.arc(px, py, 1.5, 0, Math.PI * 2)
        ctx.fill()
      }

      // Speaking waveform
      if (state === 'speaking') {
        ctx.strokeStyle = `${color}44`
        ctx.lineWidth = 2
        ctx.beginPath()
        for (let x = 0; x < w; x += 2) {
          const waveY = cy + 200 + Math.sin(x * 0.05 + t * 6) * 15 + Math.sin(x * 0.02 + t * 3) * 10
          if (x === 0) ctx.moveTo(x, waveY)
          else ctx.lineTo(x, waveY)
        }
        ctx.stroke()
      }

      // Hologram scanline
      const scanY = ((t * 50) % h)
      ctx.fillStyle = `${color}06`
      ctx.fillRect(0, scanY, w, 2)
    },
    [],
  )

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return // Canvas not supported — skip, the img tag still renders

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
      drawParticles(ctx, canvas.width, canvas.height, timeRef.current)
      frameRef.current = requestAnimationFrame(animate)
    }
    frameRef.current = requestAnimationFrame(animate)

    return () => {
      cancelAnimationFrame(frameRef.current)
      window.removeEventListener('resize', resize)
    }
  }, [drawParticles])

  const floatY = Math.sin(Date.now() * 0.001) * 5

  return (
    <div className="avatar-core">
      <canvas ref={canvasRef} className="avatar-canvas" />

      {/* Hermes face image */}
      <motion.div
        className="avatar-image-container"
        animate={{ y: [floatY - 5, floatY + 5, floatY - 5] }}
        transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
      >
        <div className="avatar-glow-ring" />
        <img
          src={hermesImg}
          alt="Hermes"
          className="avatar-image"
        />
        <div className="avatar-scanline" />
      </motion.div>

      {/* State label */}
      <motion.div
        className="avatar-state-label"
        animate={{ opacity: [0.5, 1, 0.5] }}
        transition={{ duration: 2, repeat: Infinity }}
        style={{ color: STATE_COLORS[avatarState] }}
      >
        ● {STATE_LABELS[avatarState]}
      </motion.div>
    </div>
  )
}
