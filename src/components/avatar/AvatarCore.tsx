import { useEffect, useRef, useCallback } from 'react'
import { motion } from 'framer-motion'
import { useHermesStore } from '../../store/hermes'
import type { AvatarState } from '../../store/types'
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

  // Procedural avatar rendering on canvas
  const draw = useCallback(
    (ctx: CanvasRenderingContext2D, w: number, h: number, t: number) => {
      ctx.clearRect(0, 0, w, h)
      const cx = w / 2
      const cy = h / 2
      const state = useHermesStore.getState().avatarState
      const color = STATE_COLORS[state]

      // Aura
      const auraRadius = 120 + Math.sin(t * 2) * 10 + (state === 'speaking' ? Math.sin(t * 8) * 15 : 0)
      const gradient = ctx.createRadialGradient(cx, cy, 20, cx, cy, auraRadius)
      gradient.addColorStop(0, `${color}33`)
      gradient.addColorStop(0.5, `${color}11`)
      gradient.addColorStop(1, 'transparent')
      ctx.fillStyle = gradient
      ctx.beginPath()
      ctx.arc(cx, cy, auraRadius, 0, Math.PI * 2)
      ctx.fill()

      // Outer ring
      ctx.strokeStyle = `${color}44`
      ctx.lineWidth = 2
      ctx.beginPath()
      ctx.arc(cx, cy, 100, 0, Math.PI * 2)
      ctx.stroke()

      // Rotating symbols for thinking
      if (state === 'thinking') {
        for (let i = 0; i < 6; i++) {
          const angle = (i / 6) * Math.PI * 2 + t * 1.5
          const sx = cx + Math.cos(angle) * 130
          const sy = cy + Math.sin(angle) * 130
          ctx.fillStyle = `${color}88`
          ctx.font = '14px monospace'
          ctx.textAlign = 'center'
          ctx.textBaseline = 'middle'
          ctx.fillText('◆', sx, sy)
        }
      }

      // Inner avatar circle (stylized face)
      const floatY = Math.sin(t * 1.5) * 5
      const faceY = cy + floatY

      // Head glow
      const headGrad = ctx.createRadialGradient(cx, faceY, 10, cx, faceY, 60)
      headGrad.addColorStop(0, `${color}22`)
      headGrad.addColorStop(1, 'transparent')
      ctx.fillStyle = headGrad
      ctx.beginPath()
      ctx.arc(cx, faceY, 60, 0, Math.PI * 2)
      ctx.fill()

      // Face outline
      ctx.strokeStyle = color
      ctx.lineWidth = 2.5
      ctx.beginPath()
      ctx.arc(cx, faceY, 45, 0, Math.PI * 2)
      ctx.stroke()

      // Eyes
      const eyeSpacing = 16
      const eyeY = faceY - 5
      const blinkPhase = Math.sin(t * 0.8)
      const eyeHeight = blinkPhase > 0.95 ? 1 : 8

      // Left eye
      ctx.fillStyle = color
      ctx.beginPath()
      ctx.ellipse(cx - eyeSpacing, eyeY, 6, eyeHeight, 0, 0, Math.PI * 2)
      ctx.fill()

      // Right eye
      ctx.beginPath()
      ctx.ellipse(cx + eyeSpacing, eyeY, 6, eyeHeight, 0, 0, Math.PI * 2)
      ctx.fill()

      // Eye glow
      ctx.shadowColor = color
      ctx.shadowBlur = 10
      ctx.beginPath()
      ctx.ellipse(cx - eyeSpacing, eyeY, 3, eyeHeight / 2, 0, 0, Math.PI * 2)
      ctx.fill()
      ctx.beginPath()
      ctx.ellipse(cx + eyeSpacing, eyeY, 3, eyeHeight / 2, 0, 0, Math.PI * 2)
      ctx.fill()
      ctx.shadowBlur = 0

      // Mouth — changes with state
      const mouthY = faceY + 18
      ctx.strokeStyle = color
      ctx.lineWidth = 2
      ctx.beginPath()
      if (state === 'speaking') {
        const mouthOpen = 4 + Math.sin(t * 12) * 4
        ctx.ellipse(cx, mouthY, 10, mouthOpen, 0, 0, Math.PI * 2)
        ctx.stroke()
      } else if (state === 'thinking') {
        ctx.moveTo(cx - 8, mouthY)
        ctx.lineTo(cx + 8, mouthY)
        ctx.stroke()
      } else {
        ctx.arc(cx, mouthY - 3, 8, 0.1 * Math.PI, 0.9 * Math.PI)
        ctx.stroke()
      }

      // Listening indicator
      if (state === 'listening') {
        for (let i = 1; i <= 3; i++) {
          ctx.strokeStyle = `${color}${Math.floor((1 - i * 0.25) * 255).toString(16).padStart(2, '0')}`
          ctx.lineWidth = 1.5
          ctx.beginPath()
          ctx.arc(cx, faceY, 55 + i * 12, -0.3 * Math.PI, 0.3 * Math.PI)
          ctx.stroke()
        }
      }

      // Hologram scanline effect
      const scanY = ((t * 40) % h)
      ctx.fillStyle = `${color}08`
      ctx.fillRect(0, scanY, w, 3)

      // Particles around avatar
      for (let i = 0; i < 20; i++) {
        const angle = (i / 20) * Math.PI * 2 + t * 0.5
        const dist = 80 + Math.sin(t * 2 + i) * 30
        const px = cx + Math.cos(angle) * dist
        const py = faceY + Math.sin(angle) * dist
        const alpha = 0.3 + Math.sin(t * 3 + i * 0.5) * 0.3
        ctx.fillStyle = `${color}${Math.floor(alpha * 255).toString(16).padStart(2, '0')}`
        ctx.beginPath()
        ctx.arc(px, py, 1.5, 0, Math.PI * 2)
        ctx.fill()
      }
    },
    [],
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
      draw(ctx, canvas.width, canvas.height, timeRef.current)
      frameRef.current = requestAnimationFrame(animate)
    }
    frameRef.current = requestAnimationFrame(animate)

    return () => {
      cancelAnimationFrame(frameRef.current)
      window.removeEventListener('resize', resize)
    }
  }, [draw])

  return (
    <div className="avatar-core">
      <canvas ref={canvasRef} className="avatar-canvas" />
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
