 'use client'

import { useCallback, useEffect, useRef, useState } from 'react'
import type { Experience } from '@prisma/client'
import Link from 'next/link'
import gsap from 'gsap'

interface Props { experiences: Experience[] }

const ROW_CONFIG = [
  { maxW: '100%', opacity: 1.0 },
  { maxW: '80%',  opacity: 0.65 },
  { maxW: '60%',  opacity: 0.38 },
]

function fmt(d: Date | null, current: boolean) {
  if (current) return 'PRESENT'
  if (!d) return '—'
  return new Date(d).toLocaleDateString('en-US', { month: 'short', year: 'numeric' }).toUpperCase()
}

function EmptyState() {
  return (
    <div className="py-16 text-center">
      <p className="text-[#f0ede8]/20 text-xs tracking-[0.25em] uppercase" style={{ fontFamily: 'var(--font-spacemono)' }}>
        No experience entries yet — add them from the dashboard
      </p>
    </div>
  )
}

function fmtDate(d: Date | null) {
  if (!d) return '—'
  return new Date(d).toLocaleDateString('en-US', { month: 'short', year: 'numeric' }).toUpperCase()
}

function ExperienceCard({ exp, maxW, opacity }: { exp: Experience; maxW: string; opacity: number }) {
  const hoverRef = useRef<HTMLDivElement>(null)
  const panelRef = useRef<HTMLDivElement>(null)
  const cursorDotRef = useRef<HTMLDivElement>(null)
  const [pos, setPos] = useState({ x: 0, y: 0 })

  const onEnter = useCallback(() => {
    gsap.to(panelRef.current, { opacity: 1, y: 0, duration: 0.28, ease: 'power3.out' })
    gsap.to(cursorDotRef.current, { opacity: 1, scale: 1, duration: 0.22 })
  }, [])

  const onLeave = useCallback(() => {
    gsap.to(panelRef.current, { opacity: 0, y: 8, duration: 0.2 })
    gsap.to(cursorDotRef.current, { opacity: 0, scale: 0.4, duration: 0.18 })
  }, [])

  const onMove = useCallback((e: MouseEvent) => {
    const rect = hoverRef.current?.getBoundingClientRect()
    if (!rect) return
    const rx = e.clientX - rect.left
    const ry = e.clientY - rect.top
    setPos({ x: rx, y: ry })
    gsap.set(cursorDotRef.current, { x: rx, y: ry })
  }, [])

  useEffect(() => {
    const el = hoverRef.current
    if (!el) return
    el.addEventListener('mouseenter', onEnter)
    el.addEventListener('mouseleave', onLeave)
    el.addEventListener('mousemove', onMove as EventListener)
    return () => {
      el.removeEventListener('mouseenter', onEnter)
      el.removeEventListener('mouseleave', onLeave)
      el.removeEventListener('mousemove', onMove as EventListener)
    }
  }, [onEnter, onLeave, onMove])

  const panelW = 280
  const panelH = 130
  const offset = 14
  const boxW = hoverRef.current?.clientWidth ?? 900
  const boxH = hoverRef.current?.clientHeight ?? 240
  let px = pos.x + offset
  let py = pos.y + offset
  if (px + panelW > boxW) px = pos.x - panelW - offset
  if (py + panelH > boxH) py = pos.y - panelH - offset
  if (px < 4) px = 4
  if (py < 4) py = 4

  const bullets = (exp.description ?? '')
    .split('\n')
    .filter(l => l.trim().startsWith('•'))
    .map(l => l.replace('•', '').trim())

  return (
    <div className="mx-auto w-full gsap-card" style={{ maxWidth: maxW, opacity }}>
      <div ref={hoverRef} className="relative cursor-none border-t-2 border-[#f0f0f0]/15 hover:border-[#c8a840]/40 transition-colors pt-4 group">
        <div className="absolute inset-0 bg-[#0c0c0c]/30 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" />

        <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-2 mb-3 relative z-10">
          <div className="flex-1 min-w-0">
            <h3
              className="text-[#f0ede8] leading-tight truncate group-hover:text-[#c8a840] transition-colors"
              style={{ fontFamily: 'var(--font-anton)', fontSize: 'clamp(1rem, 2.5vw, 1.5rem)' }}
            >{exp.company}</h3>
            <p className="text-[#f0ede8]/50 text-sm italic" style={{ fontFamily: 'var(--font-baskerville)' }}>
              {exp.position}
            </p>
          </div>

          <div className="flex-shrink-0 text-right">
            <span className="text-[#c8a840] text-[9px] tracking-[0.2em] block" style={{ fontFamily: 'var(--font-spacemono)' }}>
              {fmt(exp.startDate, false)} — {fmt(exp.endDate, exp.current ?? false)}
            </span>
            {exp.location && (
              <span className="text-[#f0ede8]/20 text-[8px] tracking-[0.15em]" style={{ fontFamily: 'var(--font-spacemono)' }}>
                {exp.location}
              </span>
            )}
          </div>
        </div>

        {bullets.length > 0 && (
          <div className="flex flex-wrap gap-x-6 gap-y-1 mb-2 relative z-10">
            {bullets.slice(0, 3).map((b, bi) => (
              <p key={bi} className="text-[#f0ede8]/40 text-xs flex gap-2 items-start" style={{ fontFamily: 'var(--font-baskerville)' }}>
                <span className="text-[#c8a840] flex-shrink-0">—</span>
                <span>{b}</span>
              </p>
            ))}
          </div>
        )}

        <div
          ref={cursorDotRef}
          className="absolute pointer-events-none z-20 opacity-0 scale-[0.4]"
          style={{ top: 0, left: 0, transform: 'translate(-50%, -50%)' }}
        >
          <svg width="52" height="52" viewBox="0 0 52 52" style={{ animation: 'rotate-ring 7s linear infinite' }}>
            <defs>
              <path id={`exp-${exp.id}`} d="M 26,26 m -22,0 a 22,22 0 1,1 44,0 a 22,22 0 1,1 -44,0" />
            </defs>
            <text fill="#c8a840" fontSize="5.5" letterSpacing="2.5" fontFamily="var(--font-spacemono, monospace)">
              <textPath href={`#exp-${exp.id}`}>VIEW · EXPERIENCE · DETAILS ·</textPath>
            </text>
          </svg>
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="w-1.5 h-1.5 rounded-full bg-[#c8a840]" />
          </div>
        </div>

        <div
          ref={panelRef}
          className="absolute z-30 pointer-events-none opacity-0"
          style={{ top: py, left: px, width: panelW, transform: 'translateY(8px)' }}
        >
          <div className="bg-[#0c0c0c]/95 border border-[#c8a840]/40 p-3 backdrop-blur-sm">
            <p className="text-[#c8a840] text-[7px] tracking-[0.3em] uppercase mb-1.5" style={{ fontFamily: 'var(--font-spacemono)' }}>
              ◆ EXPERIENCE DETAILS
            </p>
            <p className="text-white text-sm leading-tight mb-1.5" style={{ fontFamily: 'var(--font-anton)' }}>
              {exp.company}
            </p>
            <p className="text-[#f0ede8]/60 text-[10px] italic mb-2" style={{ fontFamily: 'var(--font-baskerville)' }}>
              {exp.position}
            </p>
            <p className="text-[8px] text-[#c8a840] uppercase tracking-wider" style={{ fontFamily: 'var(--font-spacemono)' }}>
              {fmtDate(exp.startDate)} — {exp.current ? 'PRESENT' : fmtDate(exp.endDate)}
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default function ExperienceSection({ experiences }: Props) {
  const display = experiences.slice(0, 3)

  return (
    <section className="relative py-14 lg:py-20 bg-[#111111] overflow-hidden" id="experience">
      <div className="max-w-[1300px] mx-auto px-6 lg:px-12">

        {/* Header — right aligned to contrast Projects */}
        <div className="text-right mb-8">
          <span className="text-[#c8a840] text-[9px] tracking-[0.3em] uppercase block mb-2" style={{ fontFamily: 'var(--font-spacemono)' }}>NO. 002</span>
          <h2 className="text-[#f0ede8] text-4xl md:text-6xl lg:text-7xl uppercase leading-none gsap-section-heading" style={{ fontFamily: 'var(--font-anton)' }}>EXPERIENCE</h2>
        </div>

        {display.length === 0 ? <EmptyState /> : (
          <div className="flex flex-col gap-4">
            {display.map((exp, i) => {
              const rc = ROW_CONFIG[i] ?? ROW_CONFIG[ROW_CONFIG.length - 1]
              return <ExperienceCard key={exp.id} exp={exp} maxW={rc.maxW} opacity={rc.opacity} />
            })}
          </div>
        )}

        <div className="mt-10 flex justify-center">
          <Link
            href="/contact"
            className="relative px-10 py-3 border border-[#f0f0f0]/30 text-[#f0ede8] text-[10px] tracking-[0.3em] uppercase overflow-hidden group hover:text-[#0c0c0c] transition-colors duration-200"
            style={{ fontFamily: 'var(--font-spacemono)' }}
          >
            <span className="absolute inset-0 bg-[#f0f0f0] translate-x-[-101%] group-hover:translate-x-0 transition-transform duration-300" />
            <span className="relative">GET IN TOUCH →</span>
          </Link>
        </div>
      </div>
    </section>
  )
}
