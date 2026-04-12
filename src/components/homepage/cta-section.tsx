import Link from 'next/link'
import { Button } from '@/components/ui/button'

export default function CTASection() {
  return (
    <section className="py-24 px-6">
      <div className="max-w-5xl mx-auto">
        <div className="relative rounded-2xl border border-white/8 bg-white/[0.02] p-12 md:p-16 text-center overflow-hidden animate-fade-in-up">
          {/* Ambient glow */}
          <div className="absolute inset-0 pointer-events-none">
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-96 h-48 bg-indigo-500/10 rounded-full blur-3xl" />
          </div>

          <h2 className="relative text-3xl md:text-4xl font-bold tracking-tight mb-4">
            Stop losing developer knowledge
          </h2>
          <p className="relative text-zinc-400 max-w-md mx-auto mb-8">
            Join developers who&apos;ve organized their snippets, prompts, and notes in one
            searchable workspace.
          </p>

          <div className="relative flex items-center justify-center gap-4 flex-wrap">
            <Link href="/register">
              <Button variant="premium" className="h-11 px-8 text-[15px]">
                Start for free
              </Button>
            </Link>
            <span className="text-xs text-zinc-600">No credit card required</span>
          </div>
        </div>
      </div>
    </section>
  )
}
