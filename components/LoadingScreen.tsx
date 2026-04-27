'use client'

import { useEffect, useRef, useState } from 'react'
import gsap from 'gsap'
import { TextPlugin } from 'gsap/TextPlugin'

if (typeof window !== 'undefined') {
  gsap.registerPlugin(TextPlugin)
}

const PHASE2_MESSAGES = [
  'loading full stack engineer...',
  '3+ years of experience detected',
  'React · Next.js · Node.js · TypeScript · PostgreSQL',
]

function UFOSvg() {
  return (
    <svg width="160" height="100" viewBox="0 0 160 100" fill="none" xmlns="http://www.w3.org/2000/svg">
      {/* Dome */}
      <ellipse cx="80" cy="37" rx="22" ry="14" fill="#f0ede8" opacity="0.9" />
      {/* Dome window */}
      <ellipse cx="80" cy="37" rx="14" ry="9" fill="#0c0c0c" stroke="#c8a840" strokeWidth="1.5" />
      <circle cx="77" cy="36" r="3" fill="#c8a840" opacity="0.8" />
      {/* Main dish body */}
      <ellipse cx="80" cy="52" rx="60" ry="14" fill="#f0ede8" />
      {/* Dish underside glow */}
      <ellipse cx="80" cy="57" rx="44" ry="7" fill="#c8a840" opacity="0.25" />
      {/* Lights */}
      <circle cx="48" cy="53" r="4" fill="#c8a840" />
      <circle cx="80" cy="55" r="4" fill="#c8a840" />
      <circle cx="112" cy="53" r="4" fill="#c8a840" />
      {/* Legs */}
      <line x1="56" y1="64" x2="44" y2="83" stroke="#f0ede8" strokeWidth="2.5" strokeLinecap="round" />
      <line x1="80" y1="66" x2="80" y2="85" stroke="#f0ede8" strokeWidth="2.5" strokeLinecap="round" />
      <line x1="104" y1="64" x2="116" y2="83" stroke="#f0ede8" strokeWidth="2.5" strokeLinecap="round" />
      {/* Leg pads */}
      <ellipse cx="44" cy="85" rx="6" ry="3" fill="#c8a840" />
      <ellipse cx="80" cy="87" rx="6" ry="3" fill="#c8a840" />
      <ellipse cx="116" cy="85" rx="6" ry="3" fill="#c8a840" />
    </svg>
  )
}

export default function LoadingScreen() {
  const [visible, setVisible] = useState(true)
  const [showSkip, setShowSkip] = useState(false)
  const containerRef = useRef<HTMLDivElement>(null)
  const ufoWrapRef = useRef<HTMLDivElement>(null)
  const textRef = useRef<HTMLParagraphElement>(null)
  const progressBarRef = useRef<HTMLDivElement>(null)
  const progressRowRef = useRef<HTMLDivElement>(null)
  const readyRef = useRef<HTMLDivElement>(null)

  const dismiss = () => {
    gsap.to(containerRef.current, {
      opacity: 0,
      duration: 0.4,
      onComplete: () => {
        setVisible(false)
        window.dispatchEvent(new CustomEvent('loader:done'))
        sessionStorage.setItem('loader-shown', '1')
      },
    })
  }

  useEffect(() => {
    if (sessionStorage.getItem('loader-shown')) {
      setVisible(false)
      window.dispatchEvent(new CustomEvent('loader:done'))
      return
    }

    const skipTimer = setTimeout(() => setShowSkip(true), 500)

    const ctx = gsap.context(() => {
      const tl = gsap.timeline()

      // Phase 1 (0–0.6s): UFO Y-axis spin + typewriter "initializing..."
      tl.to(ufoWrapRef.current, {
        rotationY: 360,
        duration: 0.6,
        ease: 'power1.inOut',
        transformOrigin: '50% 50%',
      })
      tl.to(textRef.current, { text: 'initializing...', duration: 0.4, ease: 'none' }, 0)

      // Phase 2 (0.6–1.4s): UFO rises, bar fills, messages cycle
      tl.to(ufoWrapRef.current, { y: -30, duration: 0.8, ease: 'power2.out' })
      tl.to(progressBarRef.current, { scaleX: 1, duration: 0.8, ease: 'power2.inOut' }, '<')

      PHASE2_MESSAGES.forEach((msg, i) => {
        tl.to(textRef.current, { text: msg, duration: 0.22, ease: 'none' }, `<+${0.1 + i * 0.22}`)
      })

      // Phase 3 (1.4–1.8s): UFO flies up, "READY" appears
      tl.to(ufoWrapRef.current, { y: '-120vh', duration: 0.35, ease: 'power3.in' })
      tl.to(progressRowRef.current, { opacity: 0, duration: 0.2 }, '<')
      tl.to(textRef.current, { opacity: 0, duration: 0.2 }, '<')
      tl.to(readyRef.current, { opacity: 1, scale: 1, duration: 0.3, ease: 'back.out(1.7)' }, '<+0.1')

      // Phase 4 (1.8–2.2s): loader fades out
      tl.to(containerRef.current, {
        opacity: 0,
        duration: 0.3,
        delay: 0.2,
        onComplete: () => {
          setVisible(false)
          window.dispatchEvent(new CustomEvent('loader:done'))
          sessionStorage.setItem('loader-shown', '1')
        },
      })
    })

    return () => {
      ctx.revert()
      clearTimeout(skipTimer)
    }
  }, [])

  if (!visible) return null

  return (
    <div
      ref={containerRef}
      className="fixed inset-0 z-[9999] bg-[#0c0c0c] flex flex-col items-center justify-center overflow-hidden"
    >
      {/* Skip button */}
      {showSkip && (
        <button
          onClick={dismiss}
          className="absolute top-6 right-8 text-[#f0ede8]/30 hover:text-[#f0ede8] transition-colors text-[11px] tracking-[0.25em] uppercase"
          style={{ fontFamily: 'var(--font-spacemono, monospace)' }}
        >
          skip →
        </button>
      )}

      {/* UFO wrapper — needs perspective for rotationY */}
      <div style={{ perspective: '600px' }}>
        <div ref={ufoWrapRef} className="mb-10">
          <UFOSvg />
        </div>
      </div>

      {/* Typewriter text */}
      <p
        ref={textRef}
        className="text-[#f0ede8]/50 text-[11px] tracking-[0.25em] mb-8 min-h-[1.2rem] text-center px-8"
        style={{ fontFamily: 'var(--font-spacemono, monospace)' }}
      />

      {/* Progress bar */}
      <div ref={progressRowRef} className="w-56 h-[1px] bg-[#f0ede8]/10 overflow-visible relative">
        <div
          ref={progressBarRef}
          className="absolute inset-0 bg-[#c8a840] origin-left"
          style={{ transform: 'scaleX(0)' }}
        />
      </div>

      {/* "READY" text — hidden initially */}
      <div
        ref={readyRef}
        className="absolute text-center opacity-0"
        style={{ transform: 'scale(0.9)' }}
      >
        <p
          className="text-[#c8a840] text-xs tracking-[0.4em] mb-4 uppercase"
          style={{ fontFamily: 'var(--font-spacemono, monospace)' }}
        >
          ✓ ENGINEER READY
        </p>
        <p
          className="text-[#f0ede8] text-4xl md:text-6xl uppercase leading-none tracking-tight"
          style={{ fontFamily: 'var(--font-anton, sans-serif)' }}
        >
          HERE TO BUILD<br />ANYTHING
        </p>
      </div>
    </div>
  )
}
