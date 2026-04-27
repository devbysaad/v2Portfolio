'use client'

import { useEffect, useRef } from 'react'
import { usePathname } from 'next/navigation'
import gsap from 'gsap'

function UFOSvg({ size = 100 }: { size?: number }) {
  const s = size / 160
  return (
    <svg
      width={size}
      height={size * 0.7}
      viewBox="0 0 160 112"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      {/* Glow */}
      <ellipse cx="80" cy="58" rx="52" ry="10" fill="#c8a840" opacity="0.15" />
      {/* Dome */}
      <ellipse cx="80" cy="38" rx="24" ry="15" fill="#f0ede8" opacity="0.92" />
      <ellipse cx="80" cy="38" rx="15" ry="9" fill="#0c0c0c" stroke="#c8a840" strokeWidth="1.5" />
      <circle cx="77" cy="37" r="3.5" fill="#c8a840" opacity="0.9" />
      {/* Dish */}
      <ellipse cx="80" cy="54" rx="62" ry="15" fill="#f0ede8" />
      <ellipse cx="80" cy="60" rx="46" ry="8" fill="#c8a840" opacity="0.2" />
      {/* Lights */}
      <circle cx="46" cy="55" r="4.5" fill="#c8a840" />
      <circle cx="80" cy="57" r="4.5" fill="#c8a840" />
      <circle cx="114" cy="55" r="4.5" fill="#c8a840" />
      {/* Legs */}
      <line x1="56" y1="67" x2="43" y2="88" stroke="#f0ede8" strokeWidth="2.5" strokeLinecap="round" />
      <line x1="80" y1="70" x2="80" y2="92" stroke="#f0ede8" strokeWidth="2.5" strokeLinecap="round" />
      <line x1="104" y1="67" x2="117" y2="88" stroke="#f0ede8" strokeWidth="2.5" strokeLinecap="round" />
      {/* Pads */}
      <ellipse cx="43" cy="91" rx="7" ry="3.5" fill="#c8a840" />
      <ellipse cx="80" cy="94" rx="7" ry="3.5" fill="#c8a840" />
      <ellipse cx="117" cy="91" rx="7" ry="3.5" fill="#c8a840" />
    </svg>
  )
}

export default function PageTransition() {
  const pathname = usePathname()
  const overlayRef = useRef<HTMLDivElement>(null)
  const ufoWrapRef = useRef<HTMLDivElement>(null)
  const isFirstRender = useRef(true)

  useEffect(() => {
    // Skip the very first render — that's the initial load (loader handles it)
    if (isFirstRender.current) {
      isFirstRender.current = false
      return
    }

    if (!overlayRef.current || !ufoWrapRef.current) return

    const tl = gsap.timeline()

    // 1. Overlay fades in
    tl.fromTo(overlayRef.current,
      { opacity: 0, pointerEvents: 'none' },
      { opacity: 1, pointerEvents: 'all', duration: 0.18, ease: 'power2.out' }
    )

    // 2. UFO pops up from below with a bounce
    tl.fromTo(ufoWrapRef.current,
      { y: 160, opacity: 0, scale: 0.7, rotationY: 0 },
      { y: 0, opacity: 1, scale: 1, duration: 0.4, ease: 'back.out(1.8)' },
      '<+0.05'
    )

    // 3. UFO spins on Y axis — unique wobble
    tl.to(ufoWrapRef.current, {
      rotationY: 360,
      duration: 0.45,
      ease: 'power2.inOut',
    })

    // 4. UFO sways left-right while rising — feels alive
    tl.to(ufoWrapRef.current, {
      x: 30,
      duration: 0.15,
      ease: 'power1.inOut',
      yoyo: true,
      repeat: 1,
    }, '<')

    // 5. UFO shoots up and disappears
    tl.to(ufoWrapRef.current, {
      y: -280,
      opacity: 0,
      scale: 0.5,
      duration: 0.38,
      ease: 'power3.in',
    })

    // 6. Overlay fades out
    tl.to(overlayRef.current, {
      opacity: 0,
      pointerEvents: 'none',
      duration: 0.22,
      ease: 'power2.in',
    }, '<+0.15')

    return () => { tl.kill() }
  }, [pathname])

  return (
    <div
      ref={overlayRef}
      className="fixed inset-0 z-[9998] bg-[#0c0c0c] flex items-center justify-center pointer-events-none"
      style={{ opacity: 0 }}
    >
      <div
        ref={ufoWrapRef}
        style={{ perspective: '600px', opacity: 0 }}
      >
        <UFOSvg size={120} />
      </div>
    </div>
  )
}
