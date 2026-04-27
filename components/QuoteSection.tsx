'use client'

import { useEffect, useRef } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger)
}

export default function QuoteSection() {
  const sectionRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo(
        '.quote-label',
        { opacity: 0, y: 30 },
        { opacity: 1, y: 0, duration: 0.8, ease: 'power3.out', scrollTrigger: { trigger: '.quote-label', start: 'top 85%' } }
      )
      gsap.fromTo(
        '.quote-text',
        { opacity: 0, y: 40 },
        { opacity: 1, y: 0, duration: 1, ease: 'power3.out', delay: 0.15, scrollTrigger: { trigger: '.quote-text', start: 'top 85%' } }
      )
      gsap.fromTo(
        '.trust-item',
        { opacity: 0, y: 20 },
        { opacity: 1, y: 0, duration: 0.6, ease: 'power3.out', stagger: 0.1, delay: 0.3, scrollTrigger: { trigger: '.trust-item', start: 'top 90%' } }
      )
    }, sectionRef)

    return () => ctx.revert()
  }, [])

  return (
    <section ref={sectionRef} className="relative py-32 lg:py-48 bg-[#111111] overflow-hidden" id="quote">
      {/* △ Up-triangle: narrow top, wide bottom */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background: 'linear-gradient(180deg, #0c0c0c 0%, #111111 40%, #161616 100%)',
          clipPath: 'polygon(12% 0, 88% 0, 100% 100%, 0 100%)',
        }}
      />

      <div className="relative z-10 max-w-[900px] mx-auto px-8 text-center">

        {/* Label */}
        <div className="quote-label mb-12">
          <span
            className="text-[#c8a840] text-[11px] tracking-[0.4em] uppercase"
            style={{ fontFamily: 'var(--font-spacemono, monospace)' }}
          >
            WHY WORK WITH ME
          </span>
        </div>

        {/* Quote */}
        <blockquote className="quote-text mb-16">
          <p
            className="text-[#f0ede8] text-2xl md:text-3xl lg:text-4xl leading-snug italic"
            style={{ fontFamily: 'var(--font-baskerville, serif)' }}
          >
            "I don't just write code — I engineer experiences.
            Every project I touch is built to scale,
            built to impress, and built to last."
          </p>
        </blockquote>

        {/* Trust signals */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-8 mb-16">
          {['On-time delivery', 'Clean, documented code', 'Available for remote work'].map((item) => (
            <div
              key={item}
              className="trust-item flex items-center gap-2 text-[#f0ede8]/60 text-xs tracking-[0.15em] uppercase"
              style={{ fontFamily: 'var(--font-spacemono, monospace)' }}
            >
              <span className="text-[#c8a840]">✓</span>
              {item}
            </div>
          ))}
        </div>

        {/* CTA */}
        <a
          href="mailto:dev.bysaad@gmail.com"
          className="inline-block px-12 py-5 bg-[#f0f0f0] text-[#0c0c0c] text-sm tracking-[0.2em] uppercase font-bold hover:bg-[#f0ede8] transition-colors"
          style={{ fontFamily: 'var(--font-anton, sans-serif)', letterSpacing: '0.1em' }}
        >
          LET'S BUILD SOMETHING →
        </a>
      </div>
    </section>
  )
}
