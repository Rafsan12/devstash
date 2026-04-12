import Link from 'next/link'
import { Button } from '@/components/ui/button'

const AI_FEATURES = [
  'Semantic search across all items',
  'Auto-summarize long notes and snippets',
  'AI prompt refinement and suggestions',
  'Generate docs from code snippets',
]

const EDITOR_LINES = [
  { ln: '1',  content: <span className="text-zinc-500"># AI Code Review Assistant</span> },
  { ln: '2',  content: null },
  { ln: '3',  content: <span><span className="text-purple-400">You are</span> an expert code reviewer with deep</span> },
  { ln: '4',  content: <span>knowledge of TypeScript, React, and Node.js.</span> },
  { ln: '5',  content: null },
  { ln: '6',  content: <span><span className="text-purple-400">When reviewing code</span>, focus on:</span> },
  { ln: '7',  content: <span className="text-emerald-400">{'- Type safety and correctness'}</span> },
  { ln: '8',  content: <span className="text-emerald-400">{'- Performance implications'}</span> },
  { ln: '9',  content: <span className="text-emerald-400">{'- Security vulnerabilities'}</span> },
  { ln: '10', content: <span className="text-emerald-400">{'- Code readability and maintainability'}</span> },
]

export default function AISection() {
  return (
    <section id="ai" className="py-24 px-6">
      <div className="max-w-5xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">

          {/* Left: text */}
          <div className="animate-fade-in-up">
            <span className="inline-block text-[11px] font-semibold tracking-widest uppercase text-indigo-400 bg-indigo-500/10 border border-indigo-500/20 rounded-full px-3 py-1 mb-5">
              Coming soon
            </span>
            <h2 className="text-3xl md:text-4xl font-bold tracking-tight mb-4">
              AI that understands your stash
            </h2>
            <p className="text-zinc-400 leading-relaxed mb-6">
              Let AI surface knowledge you didn&apos;t know you had. Semantic search,
              smart summaries, and prompt refinement — all trained on your own workspace.
            </p>

            <ul className="space-y-3 mb-8">
              {AI_FEATURES.map(f => (
                <li key={f} className="flex items-center gap-2.5 text-sm text-zinc-300">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#8b5cf6" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                    <polyline points="20 6 9 17 4 12"/>
                  </svg>
                  {f}
                </li>
              ))}
            </ul>

            <Link href="/register">
              <Button variant="premium">
                Get early access →
              </Button>
            </Link>
          </div>

          {/* Right: editor mockup */}
          <div className="rounded-xl border border-white/8 overflow-hidden bg-[#111118] animate-fade-in-up">
            {/* Chrome */}
            <div className="flex items-center gap-2 px-3 py-2 bg-[#16161e] border-b border-white/6">
              <div className="flex gap-[5px]">
                <span className="w-[10px] h-[10px] rounded-full bg-[#ff5f57]" />
                <span className="w-[10px] h-[10px] rounded-full bg-[#febc2e]" />
                <span className="w-[10px] h-[10px] rounded-full bg-[#28c840]" />
              </div>
              <span className="font-mono text-[11px] text-zinc-400 ml-1">review-assistant.prompt</span>
              <span
                className="font-mono text-[9px] font-semibold px-1.5 py-0.5 rounded border ml-auto"
                style={{ color: '#8b5cf6', borderColor: '#8b5cf640', background: '#8b5cf614' }}
              >
                .prompt
              </span>
            </div>

            {/* Editor body */}
            <div className="p-4 font-mono text-[12px] text-zinc-300 leading-relaxed">
              {EDITOR_LINES.map(line => (
                <div key={line.ln} className="flex gap-4">
                  <span className="text-zinc-700 select-none w-4 text-right flex-shrink-0">{line.ln}</span>
                  <span>{line.content ?? '\u00A0'}</span>
                </div>
              ))}
            </div>

            {/* AI bar */}
            <div className="border-t border-white/6 p-3 bg-purple-500/5 flex items-start justify-between gap-3">
              <div className="flex items-start gap-2 min-w-0">
                <span className="text-[11px] font-semibold text-purple-400 flex-shrink-0">✦ AI</span>
                <span className="text-[11px] text-zinc-400 leading-relaxed">
                  This prompt is clear and well-structured. Consider adding an output format specification for consistent responses...
                </span>
              </div>
              <button className="flex-shrink-0 text-[11px] font-medium text-purple-300 border border-purple-500/30 bg-purple-500/10 rounded-lg px-2.5 py-1 hover:bg-purple-500/20 transition-colors whitespace-nowrap">
                Apply suggestion
              </button>
            </div>
          </div>

        </div>
      </div>
    </section>
  )
}
