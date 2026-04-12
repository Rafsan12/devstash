import Link from 'next/link'
import { Button } from '@/components/ui/button'
import ChaosCanvas from './chaos-canvas'
import DashboardMockup from './dashboard-mockup'

const AVATAR_COLORS = ['#3b82f6', '#8b5cf6', '#f97316', '#10b981']

export default function HeroSection() {
  return (
    <section
      id="hero"
      className="relative min-h-screen flex items-center px-6 pt-24 pb-20 overflow-hidden"
    >
      {/* Background grid */}
      <div className="hero-bg-grid" />

      <div className="max-w-5xl mx-auto w-full flex flex-col items-center gap-14">

        {/* ── Text block ──────────────────────────────────────── */}
        <div className="text-center max-w-2xl w-full animate-fade-in-up">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 text-xs font-medium text-zinc-400 bg-indigo-500/10 border border-indigo-500/25 rounded-full px-3 py-1.5 mb-6">
            <span className="w-1.5 h-1.5 rounded-full bg-indigo-400 animate-pulse" />
            Now with AI-powered search
          </div>

          <h1 className="font-bold tracking-tight leading-[1.12] mb-5 text-[clamp(40px,5vw,58px)]">
            Your developer<br />
            <span className="bg-gradient-to-br from-indigo-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
              brain, organized.
            </span>
          </h1>

          <p className="text-[17px] text-zinc-400 leading-relaxed mb-8 max-w-[520px] mx-auto">
            Snippets, prompts, commands, and notes — searchable, structured,
            and always within reach. Stop losing knowledge to chat history.
          </p>

          <div className="flex items-center justify-center gap-3 flex-wrap mb-8">
            <Link href="/register">
              <Button variant="premium" className="h-11 px-6 text-[15px]">
                Start for free
              </Button>
            </Link>
            <Link href="#features">
              <Button variant="outline" className="h-11 px-6 text-[15px]">
                See features →
              </Button>
            </Link>
          </div>

          {/* Social proof */}
          <div className="flex items-center justify-center gap-2.5">
            <div className="flex">
              {AVATAR_COLORS.map((color, i) => (
                <div
                  key={color}
                  className="w-6 h-6 rounded-full border-2 border-[#0a0a0f]"
                  style={{ background: color, marginLeft: i > 0 ? '-6px' : 0 }}
                />
              ))}
            </div>
            <span className="text-xs text-zinc-500">Loved by developers worldwide</span>
          </div>
        </div>

        {/* ── Visual block ─────────────────────────────────────── */}
        <div className="flex items-center justify-center w-full max-w-3xl">
          <ChaosCanvas />

          {/* Arrow */}
          <div className="flex items-center px-3 flex-shrink-0 hero-arrow-animate">
            <div
              className="w-10 h-px flex-shrink-0"
              style={{ background: 'linear-gradient(90deg, rgba(255,255,255,0.08), rgba(99,102,241,0.5))' }}
            />
            <svg
              className="text-indigo-400 flex-shrink-0"
              width="18"
              height="18"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M5 12h14M12 5l7 7-7 7" />
            </svg>
          </div>

          <DashboardMockup />
        </div>

      </div>
    </section>
  )
}
