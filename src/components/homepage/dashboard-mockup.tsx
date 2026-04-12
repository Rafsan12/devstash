import React from 'react'

function TypeBadge({ color, children }: { color: string; children: React.ReactNode }) {
  return (
    <span
      className="font-mono text-[8px] font-semibold px-1 py-[1px] rounded-[3px] border flex-shrink-0"
      style={{ color, borderColor: color + '40', background: color + '14' }}
    >
      {children}
    </span>
  )
}

function ItemCard({
  name, ext, color, preview, index,
}: {
  name: string; ext: string; color: string; preview: string; index: number
}) {
  return (
    <div
      className="bg-[#16161e] rounded-[6px] px-2.5 py-2 flex-shrink-0 dm-card-anim"
      style={{
        ['--card-i' as string]: index,
        borderWidth: 1,
        borderStyle: 'solid',
        borderColor: color + '52',
        boxShadow: `inset 0 1px 0 ${color}24`,
      }}
    >
      <div className="flex items-center justify-between gap-2 mb-1">
        <span className="font-mono text-[10px] font-medium text-white truncate">{name}</span>
        <TypeBadge color={color}>{ext}</TypeBadge>
      </div>
      <div className="font-mono text-[9px] text-zinc-600 truncate">{preview}</div>
    </div>
  )
}

const SIDEBAR_PINNED = [
  { color: '#3b82f6', ext: '.ts', name: 'react-hooks' },
  { color: '#8b5cf6', ext: '.p',  name: 'gpt-base' },
]

const SIDEBAR_COLLECTIONS = ['React Patterns', 'AI Prompts', 'DevOps']

const CARDS = [
  { name: 'react-hooks.ts',  ext: '.ts', color: '#3b82f6', preview: 'const [state, setState] = useState<T>(initial);' },
  { name: 'gpt-base.prompt', ext: '.p',  color: '#8b5cf6', preview: 'You are an expert developer assistant...' },
  { name: 'docker-up.sh',    ext: '.sh', color: '#f97316', preview: 'docker-compose up -d --build' },
]

export default function DashboardMockup() {
  return (
    <div className="flex-1 min-w-0 rounded-[14px] border border-white/8 overflow-hidden bg-[#111118] shadow-[0_24px_60px_rgba(0,0,0,0.5)] hero-anim-right">
      {/* Chrome bar */}
      <div className="flex items-center gap-2 px-3 py-2 bg-[#16161e] border-b border-white/6">
        <div className="flex gap-[5px]">
          <span className="w-[10px] h-[10px] rounded-full bg-[#ff5f57]" />
          <span className="w-[10px] h-[10px] rounded-full bg-[#febc2e]" />
          <span className="w-[10px] h-[10px] rounded-full bg-[#28c840]" />
        </div>
        <span className="font-mono text-[11px] text-zinc-600 ml-1">DevStash</span>
      </div>

      {/* Body */}
      <div className="flex" style={{ height: 260 }}>
        {/* Sidebar */}
        <div className="w-[130px] flex-shrink-0 border-r border-white/6 p-2.5 overflow-hidden bg-black/15 text-[10px]">
          <div className="mb-3">
            <span className="block text-[9px] font-semibold tracking-widest text-zinc-600 uppercase px-1 mb-1">
              Dashboard
            </span>
          </div>

          <div className="mb-3">
            <span className="block text-[9px] font-semibold tracking-widest text-zinc-600 uppercase px-1 mb-1">
              Pinned
            </span>
            {SIDEBAR_PINNED.map(item => (
              <div key={item.name} className="flex items-center gap-1.5 px-1.5 py-[3px] text-zinc-400 rounded">
                <TypeBadge color={item.color}>{item.ext}</TypeBadge>
                {item.name}
              </div>
            ))}
          </div>

          <div>
            <span className="block text-[9px] font-semibold tracking-widest text-zinc-600 uppercase px-1 mb-1">
              Collections
            </span>
            {SIDEBAR_COLLECTIONS.map(c => (
              <div key={c} className="flex items-center gap-1 px-1.5 py-[3px] text-zinc-400 text-[10px] truncate">
                📁 {c}
              </div>
            ))}
          </div>
        </div>

        {/* Cards */}
        <div className="flex-1 p-2 flex flex-col gap-1.5 overflow-hidden">
          {CARDS.map((card, i) => (
            <ItemCard key={card.name} {...card} index={i} />
          ))}
        </div>
      </div>

      <div className="text-center text-[10px] text-zinc-600 font-mono py-1.5 border-t border-white/6">
        Organized DevStash
      </div>
    </div>
  )
}
