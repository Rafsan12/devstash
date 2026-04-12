'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { Menu, X } from 'lucide-react'

function LogoIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-indigo-400">
      <rect x="2" y="3" width="20" height="14" rx="2"/>
      <path d="M8 21h8M12 17v4"/>
      <path d="m7 8 3 3-3 3M13 14h4"/>
    </svg>
  )
}
import { Button } from '@/components/ui/button'

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false)
  const [menuOpen, setMenuOpen] = useState(false)

  useEffect(() => {
    const handler = () => setScrolled(window.scrollY > 20)
    window.addEventListener('scroll', handler, { passive: true })
    return () => window.removeEventListener('scroll', handler)
  }, [])

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 backdrop-blur-md transition-all duration-300 ${
        scrolled
          ? 'bg-[#0a0a0f]/90 border-b border-white/8'
          : 'bg-[#0a0a0f]/40 border-b border-transparent'
      }`}
    >
      <div className="max-w-5xl mx-auto px-6 h-[60px] flex items-center gap-8">
        {/* Logo */}
        <Link
          href="/"
          className="flex items-center gap-2 font-mono text-sm font-semibold text-white flex-shrink-0"
        >
          <LogoIcon />
          DevStash
        </Link>

        {/* Desktop nav links */}
        <div className="hidden md:flex items-center gap-1 flex-1">
          {[
            { label: 'Features', href: '#features' },
            { label: 'AI', href: '#ai' },
            { label: 'How it works', href: '#workflow' },
          ].map(({ label, href }) => (
            <Link
              key={href}
              href={href}
              className="text-xs font-medium text-zinc-400 px-3 py-1.5 rounded-lg hover:text-white hover:bg-white/5 transition-colors"
            >
              {label}
            </Link>
          ))}
        </div>

        {/* Desktop actions */}
        <div className="hidden md:flex items-center gap-2 ml-auto">
          <Link href="/sign-in">
            <Button variant="ghost" size="sm">Sign in</Button>
          </Link>
          <Link href="/register">
            <Button variant="premium" size="sm">Get started</Button>
          </Link>
        </div>

        {/* Mobile toggle */}
        <button
          className="md:hidden ml-auto p-1.5 text-zinc-400 hover:text-white transition-colors"
          onClick={() => setMenuOpen(v => !v)}
          aria-label="Toggle menu"
        >
          {menuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
        </button>
      </div>

      {/* Mobile menu */}
      {menuOpen && (
        <div className="md:hidden border-t border-white/8 px-6 py-4 flex flex-col gap-1 bg-[#0a0a0f]/95">
          {[
            { label: 'Features', href: '#features' },
            { label: 'AI', href: '#ai' },
            { label: 'How it works', href: '#workflow' },
            { label: 'Sign in', href: '/sign-in' },
          ].map(({ label, href }) => (
            <Link
              key={href}
              href={href}
              onClick={() => setMenuOpen(false)}
              className="text-sm text-zinc-400 py-2 hover:text-white transition-colors"
            >
              {label}
            </Link>
          ))}
          <Link href="/register" className="mt-2">
            <Button variant="premium" className="w-full">Get started free</Button>
          </Link>
        </div>
      )}
    </nav>
  )
}
