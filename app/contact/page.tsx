import type { Metadata } from 'next'
import Link from 'next/link'

export const metadata: Metadata = {
  title: 'Contact — Muhammad Saad',
  description: 'Get in touch with Muhammad Saad — Full Stack Developer available for remote work.',
}

const LINKS = [
  { label: 'Email', value: 'dev.bysaad@gmail.com', href: 'mailto:dev.bysaad@gmail.com', sublabel: 'Best for project inquiries' },
  { label: 'GitHub', value: '/devbysaad', href: 'https://github.com/devbysaad', sublabel: 'See my open source work' },
  { label: 'LinkedIn', value: '/muhammad-saad', href: 'https://www.linkedin.com/in/muhammad-saad-972185381/', sublabel: 'Professional profile' },
  { label: 'Twitter / X', value: '@maisaadhon', href: 'https://x.com/maisaadhon', sublabel: 'Tech thoughts & updates' },
]

export default function ContactPage() {
  return (
    <main className="min-h-screen bg-[#0c0c0c] pt-12 pb-24">
      <div className="max-w-[900px] mx-auto px-6 lg:px-12">

        <Link href="/" className="text-[#f0ede8]/30 hover:text-[#f0ede8] text-[10px] tracking-[0.25em] uppercase inline-flex items-center gap-2 mb-8 transition-colors" style={{ fontFamily: 'var(--font-spacemono)' }}>
          ← BACK HOME
        </Link>

        <div className="mb-12">
          <span className="text-[#c8a840] text-[10px] tracking-[0.35em] uppercase block mb-3" style={{ fontFamily: 'var(--font-spacemono)' }}>LET'S TALK</span>
          <h1 className="text-[#f0ede8] text-5xl md:text-7xl uppercase leading-none mb-4" style={{ fontFamily: 'var(--font-anton)' }}>CONTACT</h1>
          <p className="text-[#f0ede8]/50 text-lg italic leading-relaxed" style={{ fontFamily: 'var(--font-baskerville)' }}>
            Available for freelance projects, full-time remote roles, and technical collaborations.<br />
            I respond within 24 hours.
          </p>
        </div>

        {/* Contact links */}
        <div className="border-t border-[#1e1e1e]">
          {LINKS.map((link, i) => (
            <a
              key={link.label}
              href={link.href}
              target={link.href.startsWith('mailto') ? undefined : '_blank'}
              rel="noopener noreferrer"
              className="flex items-center justify-between py-5 border-b border-[#1e1e1e] group hover:bg-[#111] transition-colors px-4 -mx-4"
            >
              <div className="flex items-center gap-6">
                <span className="text-[#f0ede8]/20 text-[10px] w-5 tracking-[0.1em]" style={{ fontFamily: 'var(--font-spacemono)' }}>
                  0{i + 1}
                </span>
                <div>
                  <p className="text-[#f0ede8]/40 text-[9px] tracking-[0.3em] uppercase mb-0.5" style={{ fontFamily: 'var(--font-spacemono)' }}>{link.label}</p>
                  <p className="text-[#f0ede8] text-lg group-hover:text-[#c8a840] transition-colors" style={{ fontFamily: 'var(--font-anton)' }}>{link.value}</p>
                </div>
              </div>
              <div className="flex items-center gap-4">
                <span className="text-[#f0ede8]/20 text-[10px] tracking-[0.1em] hidden md:block" style={{ fontFamily: 'var(--font-spacemono)' }}>{link.sublabel}</span>
                <span className="text-[#c8a840] text-lg group-hover:translate-x-1 transition-transform inline-block">→</span>
              </div>
            </a>
          ))}
        </div>

        {/* Availability note */}
        <div className="mt-12 p-6 border border-[#1e1e1e] bg-[#111]">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-2 h-2 rounded-full bg-[#22c55e] animate-pulse" />
            <span className="text-[#22c55e] text-[10px] tracking-[0.25em] uppercase" style={{ fontFamily: 'var(--font-spacemono)' }}>AVAILABLE FOR WORK</span>
          </div>
          <p className="text-[#f0ede8]/40 text-sm italic" style={{ fontFamily: 'var(--font-baskerville)' }}>
            Open to remote full-time roles and freelance projects. Based in Pakistan · Works UTC±5.
          </p>
        </div>
      </div>
    </main>
  )
}
