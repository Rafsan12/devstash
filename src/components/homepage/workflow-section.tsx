const STEPS = [
  {
    number: '01',
    title: 'Capture anything',
    desc: 'New Item modal supports all 5 types. Paste code, write notes, drop a URL — capture it before you forget it.',
  },
  {
    number: '02',
    title: 'Organize into Collections',
    desc: 'Group related items into Collections — like smart folders. Move items between collections as projects evolve.',
  },
  {
    number: '03',
    title: 'Find it instantly',
    desc: 'Full-text search, pinned items, recent activity, and Cmd+K palette. Your knowledge is always one keystroke away.',
  },
]

export default function WorkflowSection() {
  return (
    <section id="workflow" className="py-24 px-6">
      <div className="max-w-5xl mx-auto">
        <div className="text-center mb-14 animate-fade-in-up">
          <span className="inline-block text-[11px] font-semibold tracking-widest uppercase text-indigo-400 bg-indigo-500/10 border border-indigo-500/20 rounded-full px-3 py-1 mb-3">
            How it works
          </span>
          <h2 className="text-3xl md:text-4xl font-bold tracking-tight mb-3">
            Built around your workflow
          </h2>
          <p className="text-zinc-400 max-w-md mx-auto">
            A workspace that thinks like a developer.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {STEPS.map(step => (
            <div key={step.number} className="animate-fade-in-up">
              <div className="text-5xl font-bold font-mono text-white/6 mb-4 leading-none">
                {step.number}
              </div>
              <h3 className="text-base font-semibold text-white mb-2">{step.title}</h3>
              <p className="text-sm text-zinc-500 leading-relaxed">{step.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
