import Link from 'next/link'

function LogoIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-indigo-400">
      <rect x="2" y="3" width="20" height="14" rx="2"/>
      <path d="M8 21h8M12 17v4"/>
      <path d="m7 8 3 3-3 3M13 14h4"/>
    </svg>
  )
}

const FOOTER_COLS = [
  {
    heading: 'Product',
    links: [
      { label: 'Features',      href: '#features' },
      { label: 'How it works',  href: '#workflow' },
      { label: 'AI',            href: '#ai' },
      { label: 'Changelog',     href: '#' },
    ],
  },
  {
    heading: 'Developers',
    links: [
      { label: 'Docs',   href: '#' },
      { label: 'API',    href: '#' },
      { label: 'GitHub', href: '#' },
      { label: 'Status', href: '#' },
    ],
  },
  {
    heading: 'Company',
    links: [
      { label: 'About',   href: '#' },
      { label: 'Blog',    href: '#' },
      { label: 'Privacy', href: '#' },
      { label: 'Terms',   href: '#' },
    ],
  },
]

export default function Footer() {
  return (
    <footer className="border-t border-white/6 py-14 px-6">
      <div className="max-w-5xl mx-auto">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-10 mb-10">
          {/* Brand */}
          <div className="col-span-2 md:col-span-1">
            <Link href="/" className="inline-flex items-center gap-2 font-mono text-sm font-semibold text-white mb-3">
              <LogoIcon />
              DevStash
            </Link>
            <p className="text-xs text-zinc-500 leading-relaxed max-w-[200px]">
              A developer-first knowledge workspace. Every note is a searchable, organized knowledge file.
            </p>
          </div>

          {/* Link columns */}
          {FOOTER_COLS.map(col => (
            <div key={col.heading}>
              <h4 className="text-xs font-semibold text-white mb-3">{col.heading}</h4>
              <ul className="space-y-2">
                {col.links.map(link => (
                  <li key={link.label}>
                    <Link
                      href={link.href}
                      className="text-xs text-zinc-500 hover:text-zinc-300 transition-colors"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="border-t border-white/6 pt-6 flex flex-col sm:flex-row items-center justify-between gap-3">
          <span className="text-xs text-zinc-600">© 2025 DevStash. Built for developers.</span>
          <div className="flex items-center gap-4">
            <Link href="#" className="text-xs text-zinc-600 hover:text-zinc-400 transition-colors">Privacy</Link>
            <Link href="#" className="text-xs text-zinc-600 hover:text-zinc-400 transition-colors">Terms</Link>
          </div>
        </div>
      </div>
    </footer>
  )
}
