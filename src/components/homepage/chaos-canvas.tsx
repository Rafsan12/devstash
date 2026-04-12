'use client'

import { useEffect, useRef } from 'react'

const TYPES = [
  { label: '.ts',     color: '#3b82f6' },
  { label: '.prompt', color: '#8b5cf6' },
  { label: '.sh',     color: '#f97316' },
  { label: '.md',     color: '#fde047' },
  { label: '.url',    color: '#10b981' },
]

const CANVAS_W    = 280
const CANVAS_H    = 300
const CHIP_FONT   = '600 10px ui-monospace, monospace'
const CHIP_PAD_X  = 9
const CHIP_RADIUS = 4
const MAX_SPEED   = 1.4
const DAMP        = 0.992
const REPEL_RADIUS = 120
const REPEL_FORCE  = 0.28

interface Chip {
  x: number; y: number; vx: number; vy: number
  w: number; h: number; label: string; color: string
}

export default function ChaosCanvas() {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    canvas.width  = CANVAS_W
    canvas.height = CANVAS_H

    const mouse = { x: -9999, y: -9999 }

    const onMouseMove = (e: MouseEvent) => {
      const rect = canvas.getBoundingClientRect()
      mouse.x = (e.clientX - rect.left) * (CANVAS_W / rect.width)
      mouse.y = (e.clientY - rect.top)  * (CANVAS_H / rect.height)
    }
    const onMouseLeave = () => { mouse.x = -9999; mouse.y = -9999 }
    canvas.addEventListener('mousemove', onMouseMove)
    canvas.addEventListener('mouseleave', onMouseLeave)

    // Pre-measure chip widths
    ctx.font = CHIP_FONT
    const chips: Chip[] = TYPES.flatMap(type => {
      const tw = ctx.measureText(type.label).width
      const w  = tw + CHIP_PAD_X * 2
      const h  = 22
      return [0, 1].map(() => ({
        x:  10 + Math.random() * (CANVAS_W - w - 20) + w / 2,
        y:  10 + Math.random() * (CANVAS_H - h - 20) + h / 2,
        vx: (Math.random() - 0.5) * 1.2,
        vy: (Math.random() - 0.5) * 1.2,
        w, h, label: type.label, color: type.color,
      }))
    })

    function drawChip(p: Chip) {
      const x = p.x - p.w / 2
      const y = p.y - p.h / 2
      const r = CHIP_RADIUS
      ctx!.fillStyle   = p.color + '18'
      ctx!.strokeStyle = p.color + '70'
      ctx!.lineWidth   = 1
      ctx!.beginPath()
      ctx!.moveTo(x + r, y)
      ctx!.lineTo(x + p.w - r, y)
      ctx!.quadraticCurveTo(x + p.w, y, x + p.w, y + r)
      ctx!.lineTo(x + p.w, y + p.h - r)
      ctx!.quadraticCurveTo(x + p.w, y + p.h, x + p.w - r, y + p.h)
      ctx!.lineTo(x + r, y + p.h)
      ctx!.quadraticCurveTo(x, y + p.h, x, y + p.h - r)
      ctx!.lineTo(x, y + r)
      ctx!.quadraticCurveTo(x, y, x + r, y)
      ctx!.closePath()
      ctx!.fill()
      ctx!.stroke()
      ctx!.fillStyle    = p.color
      ctx!.font         = CHIP_FONT
      ctx!.textAlign    = 'center'
      ctx!.textBaseline = 'middle'
      ctx!.fillText(p.label, p.x, p.y + 0.5)
    }

    let rafId: number

    function tick() {
      ctx!.clearRect(0, 0, CANVAS_W, CANVAS_H)

      // Soft vignette
      const grad = ctx!.createRadialGradient(
        CANVAS_W / 2, CANVAS_H / 2, CANVAS_W * 0.3,
        CANVAS_W / 2, CANVAS_H / 2, CANVAS_W * 0.75,
      )
      grad.addColorStop(0, 'transparent')
      grad.addColorStop(1, 'rgba(0,0,0,0.18)')
      ctx!.fillStyle = grad
      ctx!.fillRect(0, 0, CANVAS_W, CANVAS_H)

      for (const p of chips) {
        const dx   = p.x - mouse.x
        const dy   = p.y - mouse.y
        const dist = Math.sqrt(dx * dx + dy * dy) || 1

        if (dist < REPEL_RADIUS) {
          const s = (REPEL_RADIUS - dist) / REPEL_RADIUS
          p.vx += (dx / dist) * s * REPEL_FORCE
          p.vy += (dy / dist) * s * REPEL_FORCE
        }

        p.vx *= DAMP
        p.vy *= DAMP

        const spd = Math.sqrt(p.vx * p.vx + p.vy * p.vy)
        if (spd > MAX_SPEED) { p.vx = (p.vx / spd) * MAX_SPEED; p.vy = (p.vy / spd) * MAX_SPEED }

        p.x += p.vx
        p.y += p.vy

        const hw = p.w / 2, hh = p.h / 2
        if (p.x - hw < 0)        { p.x = hw;            p.vx =  Math.abs(p.vx) }
        if (p.x + hw > CANVAS_W) { p.x = CANVAS_W - hw; p.vx = -Math.abs(p.vx) }
        if (p.y - hh < 0)        { p.y = hh;            p.vy =  Math.abs(p.vy) }
        if (p.y + hh > CANVAS_H) { p.y = CANVAS_H - hh; p.vy = -Math.abs(p.vy) }

        drawChip(p)
      }

      rafId = requestAnimationFrame(tick)
    }

    tick()

    return () => {
      cancelAnimationFrame(rafId)
      canvas.removeEventListener('mousemove', onMouseMove)
      canvas.removeEventListener('mouseleave', onMouseLeave)
    }
  }, [])

  return (
    <div className="flex-shrink-0 hero-anim-left">
      <canvas
        ref={canvasRef}
        className="block rounded-[14px] border border-white/8 bg-[#111118] cursor-none"
        style={{ width: CANVAS_W, height: CANVAS_H }}
      />
      <p className="text-center text-[10px] text-zinc-700 mt-1.5 font-mono">
        Your scattered knowledge
      </p>
    </div>
  )
}
