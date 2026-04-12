'use client'

import { useEffect, useRef } from 'react'

const PINNED_ITEMS = [
  { label: '.ts', color: '#3b82f6', name: 'react-hooks' },
  { label: '.p',  color: '#8b5cf6', name: 'gpt-base' },
  { label: '.sh', color: '#f97316', name: 'docker-up' },
]

const COLLECTIONS = ['React Patterns', 'AI Prompts', 'DevOps']

const MAIN_ITEMS = [
  { name: 'react-hooks.ts',  ext: '.ts', color: '#3b82f6', pre: 'const [state, setState] = useState<T>(initial);', time: '2m ago' },
  { name: 'gpt-base.prompt', ext: '.p',  color: '#8b5cf6', pre: 'You are an expert developer assistant...',        time: '1h ago' },
  { name: 'docker-up.sh',    ext: '.sh', color: '#f97316', pre: 'docker-compose up -d --build',                    time: '3h ago' },
  { name: 'arch-notes.md',   ext: '.md', color: '#fde047', pre: '# Architecture Notes — App Router patterns...',   time: 'Yesterday' },
]

const CHIPS = [
  { label: '.ts',     name: 'react-hooks',  color: '#3b82f6', top: '8%',  left: '3%'  },
  { label: '.prompt', name: 'gpt-base',     color: '#8b5cf6', top: '6%',  right: '4%' },
  { label: '.sh',     name: 'docker-up',    color: '#f97316', bottom: '14%', left: '2%' },
  { label: '.md',     name: 'arch-notes',   color: '#fde047', bottom: '8%',  right: '3%' },
  { label: '.url',    name: 'mdn-flexbox',  color: '#10b981', top: '42%', right: '2%' },
] as const

const STATS = [['48','Items'],['7','Collections'],['3','Pinned'],['5','Today']] as const

export default function GlassShowcase() {
  const sceneRef = useRef<HTMLDivElement>(null)
  const cardRef  = useRef<HTMLDivElement>(null)
  const shineRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (typeof window === 'undefined' || window.innerWidth <= 768) return
    const scene = sceneRef.current
    const card  = cardRef.current
    const shine = shineRef.current
    if (!scene || !card) return

    const MAX_TILT = 12
    const LERP_T   = 0.09

    const layers = Array.from(card.querySelectorAll<HTMLElement>('[data-depth]')).map(el => ({
      el,
      depth: parseFloat(el.dataset.depth ?? '0'),
    }))

    let tX = 0, tY = 0, cX = 0, cY = 0
    let rafId: number | null = null

    const lerp = (a: number, b: number, t: number) => a + (b - a) * t

    function applyState() {
      if (!card) return
      card.style.transform =
        `perspective(1100px) rotateX(${cX.toFixed(3)}deg) rotateY(${cY.toFixed(3)}deg)`

      if (shine) {
        const sx        = 50 + cY * 2.5
        const sy        = 50 - cX * 2.5
        const intensity = Math.min(0.18, 0.04 + (Math.abs(cX) + Math.abs(cY)) / MAX_TILT * 0.14)
        shine.style.background =
          `radial-gradient(circle at ${sx}% ${sy}%, rgba(255,255,255,${intensity.toFixed(3)}) 0%, transparent 65%)`
      }

      layers.forEach(({ el, depth }) => {
        const dx = -cY / MAX_TILT * depth * 12
        const dy =  cX / MAX_TILT * depth * 12
        el.style.transform = `translate(${dx.toFixed(2)}px, ${dy.toFixed(2)}px)`
      })
    }

    function tick() {
      cX = lerp(cX, tX, LERP_T)
      cY = lerp(cY, tY, LERP_T)
      applyState()
      if (Math.abs(cX - tX) > 0.01 || Math.abs(cY - tY) > 0.01) {
        rafId = requestAnimationFrame(tick)
      } else {
        rafId = null
      }
    }

    function startTick() {
      if (!rafId) rafId = requestAnimationFrame(tick)
    }

    const onMouseMove = (e: MouseEvent) => {
      const rect = scene.getBoundingClientRect()
      const nx = (e.clientX - rect.left  - rect.width  / 2) / (rect.width  / 2)
      const ny = (e.clientY - rect.top   - rect.height / 2) / (rect.height / 2)
      tX = -ny * MAX_TILT
      tY =  nx * MAX_TILT
      startTick()
    }
    const onMouseLeave = () => { tX = 0; tY = 0; startTick() }

    scene.addEventListener('mousemove', onMouseMove)
    scene.addEventListener('mouseleave', onMouseLeave)
    return () => {
      scene.removeEventListener('mousemove', onMouseMove)
      scene.removeEventListener('mouseleave', onMouseLeave)
      if (rafId) cancelAnimationFrame(rafId)
    }
  }, [])

  return (
    <section id="showcase" className="py-24 px-6">
      <div className="max-w-5xl mx-auto">
        <div className="text-center mb-14 animate-fade-in-up">
          <span className="inline-block text-[11px] font-semibold tracking-widest uppercase text-indigo-400 bg-indigo-500/10 border border-indigo-500/20 rounded-full px-3 py-1 mb-3">
            Interactive preview
          </span>
          <h2 className="text-3xl md:text-4xl font-bold tracking-tight mb-3">
            Move your cursor to explore
          </h2>
          <p className="text-zinc-400 max-w-md mx-auto">
            Your developer knowledge, organized and always in reach.
          </p>
        </div>
      </div>

      {/* Scene */}
      <div
        ref={sceneRef}
        className="relative flex justify-center items-center px-6"
        style={{ perspective: 1100 }}
      >
        {/* Ambient glows */}
        <div className="absolute w-72 h-72 rounded-full bg-blue-500/10 blur-3xl pointer-events-none -left-8 top-8" />
        <div className="absolute w-72 h-72 rounded-full bg-purple-500/10 blur-3xl pointer-events-none -right-8 bottom-8" />

        {/* Glass card */}
        <div
          ref={cardRef}
          className="relative w-full max-w-6xl rounded-2xl border border-white/10 overflow-hidden"
          style={{
            height: 640,
            background: 'rgba(255,255,255,0.03)',
            transformStyle: 'preserve-3d',
            willChange: 'transform',
          }}
        >
          {/* Specular shine */}
          <div ref={shineRef} className="absolute inset-0 pointer-events-none z-10 rounded-2xl" />

          {/* Layer 1 — background grid */}
          <div data-depth="0.5" className="absolute inset-0">
            <div
              className="w-full h-full"
              style={{
                backgroundImage:
                  'linear-gradient(rgba(91,106,240,0.06) 1px, transparent 1px), linear-gradient(90deg, rgba(91,106,240,0.06) 1px, transparent 1px)',
                backgroundSize: '40px 40px',
              }}
            />
          </div>

          {/* Layer 2 — dashboard */}
          <div data-depth="1" className="absolute inset-0 flex items-center justify-center p-6">
            <div className="w-full h-full bg-[#111118]/80 rounded-xl border border-white/8 overflow-hidden flex">
              {/* Sidebar */}
              <div className="w-36 flex-shrink-0 border-r border-white/6 p-3 overflow-hidden">
                <div className="flex items-center gap-1.5 mb-3 font-mono font-semibold text-white text-[11px]">
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <rect x="2" y="3" width="20" height="14" rx="2"/>
                    <path d="M8 21h8M12 17v4"/>
                    <path d="m7 8 3 3-3 3M13 14h4"/>
                  </svg>
                  DevStash
                </div>
                <div className="text-[8px] font-semibold tracking-widest text-zinc-600 uppercase px-1 mb-1">Pinned</div>
                {PINNED_ITEMS.map(item => (
                  <div key={item.name} className="flex items-center gap-1.5 px-1 py-[3px] text-zinc-400 text-[10px]">
                    <span
                      className="font-mono text-[8px] px-1 rounded"
                      style={{ color: item.color, background: item.color + '14', border: `1px solid ${item.color}40` }}
                    >
                      {item.label}
                    </span>
                    {item.name}
                  </div>
                ))}
                <div className="text-[8px] font-semibold tracking-widest text-zinc-600 uppercase px-1 mt-2 mb-1">Collections</div>
                {COLLECTIONS.map(c => (
                  <div key={c} className="px-1 py-[3px] text-zinc-400 text-[10px] truncate">📁 {c}</div>
                ))}
              </div>

              {/* Main */}
              <div className="flex-1 p-3 overflow-hidden">
                <div className="grid grid-cols-2 gap-1.5 mb-3">
                  {STATS.map(([n, l]) => (
                    <div key={l} className="bg-white/3 rounded-lg p-2 border border-white/5">
                      <div className="text-base font-bold text-white font-mono">{n}</div>
                      <div className="text-[9px] text-zinc-500">{l}</div>
                    </div>
                  ))}
                </div>
                {MAIN_ITEMS.map(item => (
                  <div
                    key={item.name}
                    className="mb-1.5 p-2 rounded-lg border text-[9px]"
                    style={{ borderColor: item.color + '40', boxShadow: `inset 0 1px 0 ${item.color}20` }}
                  >
                    <div className="flex items-center gap-1.5 mb-0.5">
                      <span
                        className="font-mono text-[8px] px-1 rounded flex-shrink-0"
                        style={{ color: item.color, background: item.color + '14', border: `1px solid ${item.color}40` }}
                      >
                        {item.ext}
                      </span>
                      <span className="font-mono text-[10px] text-white font-medium truncate flex-1">{item.name}</span>
                      <span className="text-zinc-600 flex-shrink-0">{item.time}</span>
                    </div>
                    <div className="font-mono text-zinc-500 truncate">{item.pre}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Layer 3 — floating chips */}
          <div data-depth="2.2" className="absolute inset-0 pointer-events-none">
            {CHIPS.map(chip => (
              <div
                key={chip.name}
                className="absolute flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg border text-[11px] font-medium backdrop-blur-sm"
                style={{
                  top: 'top' in chip ? chip.top : undefined,
                  bottom: 'bottom' in chip ? chip.bottom : undefined,
                  left: 'left' in chip ? chip.left : undefined,
                  right: 'right' in chip ? chip.right : undefined,
                  color: chip.color,
                  background: chip.color + '14',
                  borderColor: chip.color + '40',
                }}
              >
                <span className="font-mono text-[9px]">{chip.label}</span>
                <span className="text-white/70">{chip.name}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      <p className="text-center text-xs text-zinc-600 mt-4">Move your cursor over the card</p>
    </section>
  )
}
