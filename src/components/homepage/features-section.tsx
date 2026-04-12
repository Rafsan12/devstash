const FEATURES = [
  {
    color: '#3b82f6',
    badge: '.ts .js .py',
    icon: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <polyline points="16 18 22 12 16 6"/><polyline points="8 6 2 12 8 18"/>
      </svg>
    ),
    title: 'Code Snippets',
    desc: 'Syntax-highlighted Monaco editor for any language. Copy with one click. Never lose a useful snippet again.',
  },
  {
    color: '#8b5cf6',
    badge: '.prompt',
    icon: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M9.937 15.5A2 2 0 0 0 8.5 14.063l-6.135-1.582a.5.5 0 0 1 0-.962L8.5 9.936A2 2 0 0 0 9.937 8.5l1.582-6.135a.5.5 0 0 1 .963 0L14.063 8.5A2 2 0 0 0 15.5 9.937l6.135 1.581a.5.5 0 0 1 0 .964L15.5 14.063a2 2 0 0 0-1.437 1.437l-1.582 6.135a.5.5 0 0 1-.963 0z"/>
      </svg>
    ),
    title: 'AI Prompts',
    desc: 'Organize and version your prompt library. Markdown editor with live preview. Reuse your best prompts across projects.',
  },
  {
    color: '#f97316',
    badge: '.sh',
    icon: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <polyline points="4 17 10 11 4 5"/><line x1="12" y1="19" x2="20" y2="19"/>
      </svg>
    ),
    title: 'Shell Commands',
    desc: 'Never forget that perfect one-liner. Store, search, and copy CLI commands instantly with the Monaco terminal editor.',
  },
  {
    color: '#fde047',
    badge: '.md',
    icon: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M16 3H5a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V8Z"/>
        <path d="M15 3v4a1 1 0 0 0 1 1h4"/>
        <path d="M9 13h6M9 17h3"/>
      </svg>
    ),
    title: 'Markdown Notes',
    desc: 'Write with GFM markdown. Toggle between Write and Preview modes. Tables, code blocks, and rich formatting built-in.',
  },
  {
    color: '#10b981',
    badge: '.url',
    icon: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71"/>
        <path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"/>
      </svg>
    ),
    title: 'Smart Links',
    desc: 'Bookmark URLs with context. Add notes, tag by project, and find any resource instantly with full-text search.',
  },
  {
    color: '#ec4899',
    badge: '⌘K',
    icon: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="11" cy="11" r="8"/><path d="m21 21-4.3-4.3"/>
      </svg>
    ),
    title: 'Global Search',
    desc: 'Cmd+K command palette for instant search. Fuzzy search across all items and collections with keyboard navigation.',
  },
]

export default function FeaturesSection() {
  return (
    <section id="features" className="py-24 px-6">
      <div className="max-w-5xl mx-auto">
        <div className="text-center mb-14 animate-fade-in-up">
          <span className="inline-block text-[11px] font-semibold tracking-widest uppercase text-indigo-400 bg-indigo-500/10 border border-indigo-500/20 rounded-full px-3 py-1 mb-3">
            What you can stash
          </span>
          <h2 className="text-3xl md:text-4xl font-bold tracking-tight mb-3">
            Every type of developer knowledge
          </h2>
          <p className="text-zinc-400 max-w-md mx-auto">
            Six specialized item types, each with its own editor and workflow.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {FEATURES.map(f => (
            <div
              key={f.title}
              className="group rounded-xl border border-white/8 bg-white/[0.02] overflow-hidden transition-all duration-200 hover:-translate-y-1"
              style={{ ['--accent' as string]: f.color }}
            >
              {/* Accent top strip */}
              <div className="h-[3px]" style={{ background: f.color + '60' }} />

              <div className="p-5">
                {/* Icon */}
                <div
                  className="w-9 h-9 rounded-lg border flex items-center justify-center mb-3"
                  style={{ color: f.color, borderColor: f.color + '40', background: f.color + '10' }}
                >
                  {f.icon}
                </div>

                {/* Type badge */}
                <span
                  className="inline-block font-mono text-[10px] font-semibold px-2 py-0.5 rounded border mb-2"
                  style={{ color: f.color, borderColor: f.color + '40', background: f.color + '14' }}
                >
                  {f.badge}
                </span>

                <h3 className="text-sm font-semibold text-white mb-1.5">{f.title}</h3>
                <p className="text-xs text-zinc-500 leading-relaxed">{f.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
