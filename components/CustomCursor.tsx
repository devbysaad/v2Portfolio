'use client'

import { useEffect, useRef, useState } from 'react'
import gsap from 'gsap'

type Zone = 'top' | 'middle' | 'bottom' | null

const ZONE_TIPS: Record<NonNullable<Zone>, string> = {
  top: '3+ Years Full Stack Development',
  middle: 'React · Next.js · Node.js Expert',
  bottom: 'Available for Remote Work',
}

export default function CustomCursor() {
  const cursorRef = useRef<HTMLDivElement>(null)
  const tooltipRef = useRef<HTMLDivElement>(null)
  const [zone, setZone] = useState<Zone>(null)
  const [active, setActive] = useState(false)

  useEffect(() => {
    const imageEl = document.getElementById('hero-photo-zone')
    if (!imageEl || !cursorRef.current) return

    const xTo = gsap.quickTo(cursorRef.current, 'x', { duration: 0.1, ease: 'power3' })
    const yTo = gsap.quickTo(cursorRef.current, 'y', { duration: 0.1, ease: 'power3' })

    const TOOLTIP_W = 260 // max tooltip width estimate
    const TOOLTIP_H = 36
    const OFFSET = 16

    const onEnter = () => {
      setActive(true)
      gsap.to(cursorRef.current, { opacity: 1, scale: 1, duration: 0.25 })
    }

    const onLeave = () => {
      setActive(false)
      setZone(null)
      gsap.to(cursorRef.current, { opacity: 0, scale: 0.6, duration: 0.25 })
      gsap.to(tooltipRef.current, { opacity: 0, duration: 0.15 })
    }

    const onMove = (e: MouseEvent) => {
      const rect = imageEl.getBoundingClientRect()
      const y = e.clientY - rect.top
      const third = rect.height / 3

      // Move cursor dot
      xTo(e.clientX)
      yTo(e.clientY)

      // Zone detection
      let newZone: Zone
      if (y < third) newZone = 'top'
      else if (y < third * 2) newZone = 'middle'
      else newZone = 'bottom'

      setZone(prev => {
        if (prev !== newZone) {
          gsap.fromTo(tooltipRef.current, { opacity: 0, y: 4 }, { opacity: 1, y: 0, duration: 0.2 })
        }
        return newZone
      })

      // Clamp tooltip so it stays INSIDE the image
      let tx = e.clientX + OFFSET
      let ty = e.clientY - TOOLTIP_H / 2

      // Clamp X: don't go past right edge of image
      const maxX = rect.right - TOOLTIP_W - 4
      const minX = rect.left + 4
      tx = Math.min(tx, maxX)
      tx = Math.max(tx, minX)

      // Clamp Y: don't go above image top or below image bottom
      const minY = rect.top + 4
      const maxY = rect.bottom - TOOLTIP_H - 4
      ty = Math.min(ty, maxY)
      ty = Math.max(ty, minY)

      if (tooltipRef.current) {
        gsap.set(tooltipRef.current, { x: tx, y: ty })
      }
    }

    imageEl.addEventListener('mouseenter', onEnter)
    imageEl.addEventListener('mouseleave', onLeave)
    imageEl.addEventListener('mousemove', onMove)

    return () => {
      imageEl.removeEventListener('mouseenter', onEnter)
      imageEl.removeEventListener('mouseleave', onLeave)
      imageEl.removeEventListener('mousemove', onMove)
    }
  }, [])

  return (
    <>
      {/* Circle cursor */}
      <div
        ref={cursorRef}
        className="pointer-events-none fixed top-0 left-0 z-[8000] flex items-center justify-center opacity-0"
        style={{ width: 56, height: 56, transform: 'translate(-50%, -50%) scale(0.6)' }}
      >
        <svg width="56" height="56" viewBox="0 0 56 56" className="absolute inset-0" style={{ animation: 'rotate-ring 8s linear infinite' }}>
          <defs>
            <path id="circle-path" d="M 28,28 m -24,0 a 24,24 0 1,1 48,0 a 24,24 0 1,1 -48,0" />
          </defs>
          <text fill="#f0f0f0" fontSize="6.5" letterSpacing="2.8" fontFamily="var(--font-spacemono, monospace)">
            <textPath href="#circle-path">EXPERIENCE · SKILLS · WORK ·</textPath>
          </text>
        </svg>
        <div className="w-1.5 h-1.5 rounded-full bg-[#c8a840]" />
      </div>

      {/* Tooltip — clamped to image bounds */}
      {active && zone && (
        <div
          ref={tooltipRef}
          className="pointer-events-none fixed top-0 left-0 z-[8001] px-3 py-2 bg-[#0c0c0c]/95 border border-[#c8a840]/50 text-[#f0ede8] text-[9px] tracking-[0.15em] uppercase whitespace-nowrap opacity-0"
          style={{ fontFamily: 'var(--font-spacemono, monospace)' }}
        >
          <span className="text-[#c8a840] mr-1">◆</span>
          {ZONE_TIPS[zone]}
        </div>
      )}
    </>
  )
}
