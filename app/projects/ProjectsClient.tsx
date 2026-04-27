'use client'

import { useEffect, useRef, useState, useCallback } from 'react'
import Link from 'next/link'
import gsap from 'gsap'
import { Github, ExternalLink } from 'lucide-react'

// ── Types ─────────────────────────────────────────────────────────────────────
interface Project {
  id: string
  title: string
  description?: string | null
  techStack?: string[]
  imageUrl?: string | null
  githubUrl?: string | null
  liveUrl?: string | null
  featured?: boolean
  order?: number
}

// ── Per-card hover panel (like hero cursor) ───────────────────────────────────
function ProjectCard({ p, index }: { p: Project; index: number }) {
  const cardRef      = useRef<HTMLDivElement>(null)
  const imageRef     = useRef<HTMLDivElement>(null)
  const panelRef     = useRef<HTMLDivElement>(null)
  const cursorDotRef = useRef<HTMLDivElement>(null)
  const [hovered, setHovered]  = useState(false)
  const [pos, setPos]          = useState({ x: 0, y: 0 })

  const onEnter = useCallback(() => {
    setHovered(true)
    gsap.to(panelRef.current,     { opacity: 1, y: 0,    duration: 0.28, ease: 'power3.out' })
    gsap.to(cursorDotRef.current, { opacity: 1, scale: 1, duration: 0.22 })
  }, [])

  const onLeave = useCallback(() => {
    setHovered(false)
    gsap.to(panelRef.current,     { opacity: 0, y: 8,    duration: 0.2 })
    gsap.to(cursorDotRef.current, { opacity: 0, scale: 0.4, duration: 0.18 })
  }, [])

  const onMove = useCallback((e: MouseEvent) => {
    const rect = imageRef.current?.getBoundingClientRect()
    if (!rect) return
    // raw position relative to image
    const rx = e.clientX - rect.left
    const ry = e.clientY - rect.top
    setPos({ x: rx, y: ry })

    // dot follows exactly
    gsap.set(cursorDotRef.current, { x: rx, y: ry })
  }, [])

  useEffect(() => {
    const el = imageRef.current
    if (!el) return
    el.addEventListener('mouseenter', onEnter)
    el.addEventListener('mouseleave', onLeave)
    el.addEventListener('mousemove',  onMove  as EventListener)
    return () => {
      el.removeEventListener('mouseenter', onEnter)
      el.removeEventListener('mouseleave', onLeave)
      el.removeEventListener('mousemove',  onMove  as EventListener)
    }
  }, [onEnter, onLeave, onMove])

  const initials = (p.title ?? '??').slice(0, 2).toUpperCase()

  // Panel X/Y clamped to image so it never overflows
  const panelW = 280, panelH = 160, offset = 14
  const imgW   = imageRef.current?.clientWidth  ?? 600
  const imgH   = imageRef.current?.clientHeight ?? 340
  let px = pos.x + offset
  let py = pos.y + offset
  if (px + panelW > imgW) px = pos.x - panelW - offset
  if (py + panelH > imgH) py = pos.y - panelH - offset
  if (px < 4) px = 4
  if (py < 4) py = 4

  return (
    <div
      ref={cardRef}
      className="group relative"
      style={{ opacity: 1 }}
    >
      {/* Counter */}
      <div className="flex items-center gap-3 mb-3">
        <span className="text-[#c8a840] text-[9px] tracking-[0.3em]" style={{ fontFamily: 'var(--font-spacemono)' }}>
          {String(index + 1).padStart(2, '0')}
        </span>
        <div className="flex-1 h-px bg-white/10 group-hover:bg-[#c8a840]/30 transition-colors duration-300" />
        {p.featured && (
          <span className="text-[#c8a840] text-[8px] tracking-[0.25em] uppercase" style={{ fontFamily: 'var(--font-spacemono)' }}>
            ★ FEATURED
          </span>
        )}
      </div>

      {/* Image zone — hover triggers panel */}
      <div
        ref={imageRef}
        className="relative overflow-hidden cursor-none border border-[#1e1e1e] group-hover:border-[#c8a840]/25 transition-colors duration-300"
        style={{ aspectRatio: '16/9' }}
      >
        {/* Actual image or placeholder */}
        {p.imageUrl ? (
          <img
            src={p.imageUrl} alt={p.title}
            className="w-full h-full object-cover scale-100 group-hover:scale-[1.03] transition-transform duration-700"
            draggable={false}
          />
        ) : (
          <div className="w-full h-full bg-[#0f0f0f] flex items-center justify-center">
            <span className="text-[#f0ede8]/5 select-none" style={{ fontFamily: 'var(--font-anton)', fontSize: 'clamp(3rem, 6vw, 5rem)' }}>
              {initials}
            </span>
          </div>
        )}

        {/* Dark overlay on hover */}
        <div className="absolute inset-0 bg-[#0c0c0c]/60 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

        {/* Cursor dot (follows mouse exactly) */}
        <div
          ref={cursorDotRef}
          className="absolute pointer-events-none z-20 opacity-0 scale-[0.4]"
          style={{ top: 0, left: 0, transform: 'translate(-50%, -50%)' }}
        >
          <svg width="52" height="52" viewBox="0 0 52 52" style={{ animation: 'rotate-ring 7s linear infinite' }}>
            <defs>
              <path id={`cp-${p.id}`} d="M 26,26 m -22,0 a 22,22 0 1,1 44,0 a 22,22 0 1,1 -44,0" />
            </defs>
            <text fill="#c8a840" fontSize="5.5" letterSpacing="2.5" fontFamily="var(--font-spacemono, monospace)">
              <textPath href={`#cp-${p.id}`}>VIEW · PROJECT · DETAILS ·</textPath>
            </text>
          </svg>
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="w-1.5 h-1.5 rounded-full bg-[#c8a840]" />
          </div>
        </div>

        {/* Floating detail panel */}
        <div
          ref={panelRef}
          className="absolute z-30 pointer-events-none opacity-0"
          style={{ top: py, left: px, width: panelW, transform: 'translateY(8px)' }}
        >
          <div className="bg-[#0c0c0c]/95 border border-[#c8a840]/40 p-3 backdrop-blur-sm">
            <p className="text-[#c8a840] text-[7px] tracking-[0.3em] uppercase mb-1.5" style={{ fontFamily: 'var(--font-spacemono)' }}>
              ◆ PROJECT DETAILS
            </p>
            <p className="text-white text-sm leading-tight mb-1.5" style={{ fontFamily: 'var(--font-anton)' }}>
              {p.title}
            </p>
            {p.description && (
              <p className="text-[#f0ede8]/50 text-[9px] leading-snug italic mb-2 line-clamp-2" style={{ fontFamily: 'var(--font-baskerville)' }}>
                {p.description}
              </p>
            )}
            <div className="flex flex-wrap gap-1 mb-2">
              {(p.techStack ?? []).slice(0, 4).map((t) => (
                <span key={t} className="px-1.5 py-0.5 border border-[#c8a840]/20 text-[#c8a840]/70 text-[7px] tracking-[0.1em] uppercase" style={{ fontFamily: 'var(--font-spacemono)' }}>
                  {t}
                </span>
              ))}
            </div>
            <div className="flex gap-3 pointer-events-none">
              {p.githubUrl && <span className="text-[8px] text-[#f0ede8]/30 uppercase tracking-wider" style={{ fontFamily: 'var(--font-spacemono)' }}>GH ↗</span>}
              {p.liveUrl   && <span className="text-[8px] text-[#c8a840] uppercase tracking-wider" style={{ fontFamily: 'var(--font-spacemono)' }}>LIVE ↗</span>}
            </div>
          </div>
        </div>
      </div>

      {/* Below-image info row */}
      <div className="flex items-start justify-between gap-4 pt-3 border-t border-white/8 group-hover:border-[#c8a840]/20 transition-colors duration-300">
        <div className="flex-1 min-w-0">
          <h2 className="text-[#f0ede8] leading-tight group-hover:text-[#c8a840] transition-colors duration-200 truncate"
            style={{ fontFamily: 'var(--font-anton)', fontSize: 'clamp(1rem, 1.8vw, 1.35rem)' }}>
            {p.title}
          </h2>
          <div className="flex flex-wrap gap-1 mt-1.5">
            {(p.techStack ?? []).slice(0, 3).map((t) => (
              <span key={t} className="text-[#f0ede8]/25 text-[8px] tracking-[0.1em] uppercase" style={{ fontFamily: 'var(--font-spacemono)' }}>
                {t}{' '}
              </span>
            ))}
          </div>
        </div>
        <div className="flex gap-3 pt-0.5 flex-shrink-0">
          {p.githubUrl && (
            <a href={p.githubUrl} target="_blank" rel="noopener noreferrer"
              className="text-[#f0ede8]/25 hover:text-[#f0ede8] transition-colors"
              onClick={(e) => e.stopPropagation()}>
              <Github className="w-4 h-4" />
            </a>
          )}
          {p.liveUrl && (
            <a href={p.liveUrl} target="_blank" rel="noopener noreferrer"
              className="text-[#c8a840] hover:text-[#f0ede8] transition-colors"
              onClick={(e) => e.stopPropagation()}>
              <ExternalLink className="w-4 h-4" />
            </a>
          )}
        </div>
      </div>
    </div>
  )
}

// ── ROWS layout (same pyramid as landing page) ────────────────────────────────
const ROWS = [
  { widths: ['52%', '28%', '20%'], opacity: 1.0  },
  { widths: ['62%', '38%'],        opacity: 0.55  },
  { widths: ['100%'],              opacity: 0.28  },
]

// ── Page ──────────────────────────────────────────────────────────────────────
export default function ProjectsClient({ projects }: { projects: Project[] }) {
  const featured = projects.filter(p => p.featured)
  const rest     = projects.filter(p => !p.featured)
  const all      = [...featured, ...rest]

  // Build rows
  let cursor = 0
  const rows = ROWS.map(rc => {
    const items = all.slice(cursor, cursor + rc.widths.length)
    cursor += rc.widths.length
    return { ...rc, items }
  }).filter(r => r.items.length > 0)

  let globalIndex = 0

  return (
    <main className="min-h-screen bg-[#0c0c0c] pt-10 pb-28">
      <div className="max-w-[1300px] mx-auto px-6 lg:px-12">

        {/* ── Header ── */}
        <div className="mb-12">
          <Link href="/"
            className="inline-flex items-center gap-2 text-[#f0ede8]/30 hover:text-[#f0ede8] text-[10px] tracking-[0.25em] uppercase mb-8 transition-colors"
            style={{ fontFamily: 'var(--font-spacemono)' }}>
            ← BACK HOME
          </Link>

          <div className="flex items-end justify-between gap-8 border-b-2 border-[#f0f0f0]/10 pb-6">
            <div>
              <span className="text-[#c8a840] text-[9px] tracking-[0.35em] uppercase block mb-3" style={{ fontFamily: 'var(--font-spacemono)' }}>
                FULL ARCHIVE
              </span>
              <h1 className="text-[#f0ede8] uppercase leading-none" style={{ fontFamily: 'var(--font-anton)', fontSize: 'clamp(3.5rem, 8vw, 7rem)' }}>
                ALL<br />PROJECTS
              </h1>
            </div>
            <p className="text-[#f0ede8]/30 text-sm italic pb-2 text-right max-w-[220px]" style={{ fontFamily: 'var(--font-baskerville)' }}>
              {projects.length} project{projects.length !== 1 ? 's' : ''} —<br />
              full-stack, production-grade
            </p>
          </div>
        </div>

        {/* ── Empty state ── */}
        {projects.length === 0 && (
          <div className="border border-dashed border-[#f0ede8]/10 py-32 text-center">
            <p className="text-[#f0ede8]/10 text-8xl mb-6 select-none" style={{ fontFamily: 'var(--font-anton)' }}>?</p>
            <p className="text-[#f0ede8]/20 text-[10px] tracking-[0.3em] uppercase mb-4" style={{ fontFamily: 'var(--font-spacemono)' }}>
              No projects added yet
            </p>
            <Link href="/admin-login" className="text-[#c8a840] text-[9px] tracking-[0.2em] uppercase hover:text-white transition-colors" style={{ fontFamily: 'var(--font-spacemono)' }}>
              → Add projects from dashboard
            </Link>
          </div>
        )}

        {/* ── Pyramid rows ── */}
        {rows.length > 0 && (
          <div className="flex flex-col gap-8">
            {rows.map((row, ri) => (
              <div key={ri} className="flex gap-6 w-full items-start" style={{ opacity: row.opacity }}>
                {row.items.map((p, pi) => {
                  const idx = globalIndex++
                  return (
                    <div key={p.id} style={{ flex: `0 0 calc(${row.widths[pi]} - 1rem)`, minWidth: 0 }}>
                      <ProjectCard p={p} index={idx} />
                    </div>
                  )
                })}
              </div>
            ))}
          </div>
        )}

      </div>
    </main>
  )
}
