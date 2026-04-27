'use client'

import { useEffect, useRef } from 'react'
import Link from 'next/link'
import CustomCursor from './CustomCursor'
import gsap from 'gsap'

const SOCIAL = [
  {
    label: 'GitHub',
    handle: '@devbysaad',
    href: 'https://github.com/devbysaad',
    icon: (
      <svg viewBox="0 0 24 24" fill="currentColor" width="18" height="18">
        <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0 0 24 12c0-6.63-5.37-12-12-12z" />
      </svg>
    ),
  },
  {
    label: 'Twitter / X',
    handle: '@maisaadhon',
    href: 'https://x.com/maisaadhon',
    icon: (
      <svg viewBox="0 0 24 24" fill="currentColor" width="18" height="18">
        <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-4.714-6.231-5.401 6.231H2.748l7.73-8.835L1.254 2.25H8.08l4.259 5.629L18.244 2.25zm-1.161 17.52h1.833L7.084 4.126H5.117L17.083 19.77z" />
      </svg>
    ),
  },
  {
    label: 'LinkedIn',
    handle: 'Muhammad Saad',
    href: 'https://www.linkedin.com/in/muhammad-saad-972185381/',
    icon: (
      <svg viewBox="0 0 24 24" fill="currentColor" width="18" height="18">
        <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 0 1-2.063-2.065 2.064 2.064 0 1 1 2.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
      </svg>
    ),
  },
]

export default function HeroSection() {
  const headingRef = useRef<HTMLDivElement>(null)
  const photoRef = useRef<HTMLDivElement>(null)
  const socialRef = useRef<HTMLDivElement>(null)
  const ctaRef = useRef<HTMLDivElement>(null)
  const labelRef = useRef<HTMLDivElement>(null)
  const descRef = useRef<HTMLParagraphElement>(null)

  useEffect(() => {
    const els = [labelRef.current, headingRef.current, descRef.current, socialRef.current, ctaRef.current, photoRef.current]
    gsap.set(els, { opacity: 0, y: 30 })

    const reveal = () => {
      gsap.to(labelRef.current, { opacity: 1, y: 0, duration: 0.5, ease: 'power3.out', delay: 0 })
      gsap.to(headingRef.current, { opacity: 1, y: 0, duration: 0.6, ease: 'power3.out', delay: 0.1 })
      gsap.to(descRef.current, { opacity: 1, y: 0, duration: 0.5, ease: 'power3.out', delay: 0.2 })
      gsap.to(socialRef.current, { opacity: 1, y: 0, duration: 0.5, ease: 'power3.out', delay: 0.3 })
      gsap.to(ctaRef.current, { opacity: 1, y: 0, duration: 0.5, ease: 'power3.out', delay: 0.35 })
      gsap.to(photoRef.current, { opacity: 1, y: 0, duration: 0.7, ease: 'power3.out', delay: 0.15 })
    }

    window.addEventListener('loader:done', reveal)
    if (sessionStorage.getItem('loader-shown')) reveal()
    return () => window.removeEventListener('loader:done', reveal)
  }, [])

  return (
    <section className="relative min-h-screen flex flex-col justify-center overflow-hidden">
      <div
        className="absolute inset-0 pointer-events-none"
        style={{ background: 'linear-gradient(160deg, #111111 0%, #0c0c0c 60%)' }}
      />
      <CustomCursor />

      <div className="relative z-10 max-w-[1300px] mx-auto px-6 lg:px-12 w-full pt-16 pb-12">
        <div className="grid grid-cols-1 lg:grid-cols-[52%_48%] gap-8 lg:gap-0 items-center min-h-[88vh]">

          {/* LEFT */}
          <div className="flex flex-col justify-center pr-0 lg:pr-14">
            <div ref={labelRef} className="mb-5">
              <span
                className="text-[#c8a840] text-[10px] tracking-[0.35em] uppercase"
                style={{ fontFamily: 'var(--font-spacemono)', borderBottom: '1px solid #c8a840', paddingBottom: '2px' }}
              >
                devbysaad
              </span>
            </div>

            <div ref={headingRef} className="mb-4">
              <h1
                className="leading-[0.9] uppercase"
                style={{ fontFamily: 'var(--font-anton)', fontSize: 'clamp(4.5rem, 9vw, 8.5rem)' }}
              >
                <span className="block text-[#f0ede8]">HEY, I'M</span>
                <span className="name-box">SAAD</span>
              </h1>
            </div>

            <div className="h-[5px] bg-[#f0f0f0] w-full mb-4" />

            <p
              ref={descRef}
              className="text-[#f0ede8]/65 text-base md:text-lg leading-relaxed mb-7 italic"
              style={{ fontFamily: 'var(--font-baskerville)' }}
            >
              Full-stack developer. Unapologetically functional,<br className="hidden md:block" /> obsessively refined.
            </p>

            {/* Social Links */}
            <div ref={socialRef} className="flex flex-col gap-2 mb-8">
              {SOCIAL.map(s => (
                <a
                  key={s.label}
                  href={s.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-3 text-[#f0ede8]/50 hover:text-[#c8a840] transition-colors group w-fit"
                >
                  <span className="text-[#f0ede8]/30 group-hover:text-[#c8a840] transition-colors">{s.icon}</span>
                  <span
                    className="text-[10px] tracking-[0.2em] uppercase"
                    style={{ fontFamily: 'var(--font-spacemono)' }}
                  >
                    {s.handle}
                  </span>
                  <span className="w-6 h-px bg-[#f0ede8]/10 group-hover:bg-[#c8a840]/40 group-hover:w-10 transition-all" />
                </a>
              ))}
            </div>

            {/* CTA */}
            <div ref={ctaRef} className="flex flex-wrap gap-3">
              <Link
                href="/projects"
                className="px-7 py-3 bg-[#f0f0f0] text-[#0c0c0c] text-xs font-bold uppercase tracking-[0.15em] hover:bg-[#f0ede8] transition-colors"
                style={{ fontFamily: 'var(--font-spacemono)' }}
              >
                VIEW WORK
              </Link>
              <Link
                href="/contact"
                className="px-7 py-3 border border-[#f0f0f0]/30 text-[#f0ede8] text-xs font-bold uppercase tracking-[0.15em] hover:border-[#f0f0f0]/60 transition-colors"
                style={{ fontFamily: 'var(--font-spacemono)' }}
              >
                CONTACT ME
              </Link>
            </div>
          </div>

          {/* RIGHT: Photo */}
          <div ref={photoRef} className="flex flex-col items-center lg:items-end">
            <div
              className="w-full bg-[#0c0c0c] border-b border-[#f0f0f0]/10 px-4 py-1.5 text-center"
              style={{ fontFamily: 'var(--font-spacemono)' }}
            >
              <span className="text-[9px] text-[#f0ede8]/30 tracking-[0.4em] uppercase">
                DEVELOPER · FULL STACK · 2026 · AVAILABLE FOR HIRE ·
              </span>
            </div>

            <div
              id="hero-photo-zone"
              className="photo-frame cursor-none w-full max-w-[440px] relative overflow-hidden"
              style={{ aspectRatio: '3/4' }}
            >
              <img
                src="/saad.png"
                alt="Muhammad Saad — Full Stack Engineer"
                className="w-full h-full object-cover object-top"
                draggable={false}
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
