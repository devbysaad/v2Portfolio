'use client'

import { useEffect, useRef, useState, useCallback } from 'react'
import Link from 'next/link'
import type { Project } from '@prisma/client'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

if (typeof window !== 'undefined') gsap.registerPlugin(ScrollTrigger)

interface Props { projects: Project[] }

// Row 1: O 0 o  (50/30/20%), full opacity
// Row 2: O o    (60/40%),    low opacity
// Row 3: o      (100%),      very low opacity
const ROWS = [
  { widths: ['50%', '30%', '20%'], opacity: 1.0,  dir: 'left'  },
  { widths: ['60%', '40%'],        opacity: 0.45, dir: 'right' },
  { widths: ['100%'],              opacity: 0.20, dir: 'left'  },
]

function EmptyState() {
  return (
    <div className="flex flex-col items-center justify-center py-20 text-center">
      <span className="text-[#f0ede8]/10 text-8xl mb-4 select-none" style={{ fontFamily: 'var(--font-anton)' }}>?</span>
      <p className="text-[#f0ede8]/20 text-xs tracking-[0.25em] uppercase" style={{ fontFamily: 'var(--font-spacemono)' }}>
        No projects yet — add them from the dashboard
      </p>
    </div>
  )
}

function ProjectCard({ project, flex }: { project: Project; flex: string }) {
  const imageRef = useRef<HTMLDivElement>(null)
  const panelRef = useRef<HTMLDivElement>(null)
  const cursorDotRef = useRef<HTMLDivElement>(null)
  const [pos, setPos] = useState({ x: 0, y: 0 })
  const initials = (project.title ?? 'PR').slice(0, 2).toUpperCase()

  const onEnter = useCallback(() => {
    gsap.to(panelRef.current, { opacity: 1, y: 0, duration: 0.28, ease: 'power3.out' })
    gsap.to(cursorDotRef.current, { opacity: 1, scale: 1, duration: 0.22 })
  }, [])

  const onLeave = useCallback(() => {
    gsap.to(panelRef.current, { opacity: 0, y: 8, duration: 0.2 })
    gsap.to(cursorDotRef.current, { opacity: 0, scale: 0.4, duration: 0.18 })
  }, [])

  const onMove = useCallback((e: MouseEvent) => {
    const rect = imageRef.current?.getBoundingClientRect()
    if (!rect) return
    const rx = e.clientX - rect.left
    const ry = e.clientY - rect.top
    setPos({ x: rx, y: ry })
    gsap.set(cursorDotRef.current, { x: rx, y: ry })
  }, [])

  useEffect(() => {
    const el = imageRef.current
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
  const panelH = 160
  const offset = 14
  const imgW = imageRef.current?.clientWidth ?? 600
  const imgH = imageRef.current?.clientHeight ?? 340
  let px = pos.x + offset
  let py = pos.y + offset
  if (px + panelW > imgW) px = pos.x - panelW - offset
  if (py + panelH > imgH) py = pos.y - panelH - offset
  if (px < 4) px = 4
  if (py < 4) py = 4

  return (
    <div
      className="group border-t-2 border-[#f0f0f0]/15 hover:border-[#c8a840]/50 transition-colors duration-200 pt-3 flex flex-col gap-2 min-w-0"
      style={{ flex: `0 0 ${flex}` }}
    >
      {/* Image */}
      <div
        ref={imageRef}
        className="relative w-full overflow-hidden bg-[#111] border border-[#1e1e1e] cursor-none group-hover:border-[#c8a840]/20 transition-colors"
        style={{ aspectRatio: '16/10' }}
      >
        {project.imageUrl ? (
          <img
            src={project.imageUrl}
            alt={project.title}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <span
              className="select-none text-[#f0ede8]/05"
              style={{ fontFamily: 'var(--font-anton)', fontSize: 'clamp(2rem, 4vw, 3.5rem)' }}
            >{initials}</span>
          </div>
        )}

        <div className="absolute inset-0 bg-[#0c0c0c]/60 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

        <div
          ref={cursorDotRef}
          className="absolute pointer-events-none z-20 opacity-0 scale-[0.4]"
          style={{ top: 0, left: 0, transform: 'translate(-50%, -50%)' }}
        >
          <svg width="52" height="52" viewBox="0 0 52 52" style={{ animation: 'rotate-ring 7s linear infinite' }}>
            <defs>
              <path id={`cp-${project.id}`} d="M 26,26 m -22,0 a 22,22 0 1,1 44,0 a 22,22 0 1,1 -44,0" />
            </defs>
            <text fill="#c8a840" fontSize="5.5" letterSpacing="2.5" fontFamily="var(--font-spacemono, monospace)">
              <textPath href={`#cp-${project.id}`}>VIEW · PROJECT · DETAILS ·</textPath>
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
              ◆ PROJECT DETAILS
            </p>
            <p className="text-white text-sm leading-tight mb-1.5" style={{ fontFamily: 'var(--font-anton)' }}>
              {project.title}
            </p>
            {project.description && (
              <p className="text-[#f0ede8]/50 text-[9px] leading-snug italic mb-2 line-clamp-2" style={{ fontFamily: 'var(--font-baskerville)' }}>
                {project.description}
              </p>
            )}
            <div className="flex flex-wrap gap-1 mb-2">
              {(project.techStack ?? []).slice(0, 4).map((t) => (
                <span key={t} className="px-1.5 py-0.5 border border-[#c8a840]/20 text-[#c8a840]/70 text-[7px] tracking-[0.1em] uppercase" style={{ fontFamily: 'var(--font-spacemono)' }}>
                  {t}
                </span>
              ))}
            </div>
            <div className="flex gap-3 pointer-events-none">
              {project.githubUrl && <span className="text-[8px] text-[#f0ede8]/30 uppercase tracking-wider" style={{ fontFamily: 'var(--font-spacemono)' }}>GH ↗</span>}
              {project.liveUrl && <span className="text-[8px] text-[#c8a840] uppercase tracking-wider" style={{ fontFamily: 'var(--font-spacemono)' }}>LIVE ↗</span>}
            </div>
          </div>
        </div>
      </div>

      {/* Title */}
      <h3
        className="text-[#f0ede8] leading-tight group-hover:text-[#c8a840] transition-colors truncate"
        style={{ fontFamily: 'var(--font-anton)', fontSize: 'clamp(0.8rem, 1.4vw, 1.05rem)' }}
      >
        {project.title}
      </h3>

      {/* Tech tags */}
      <div className="flex flex-wrap gap-1">
        {(project.techStack ?? []).slice(0, 3).map(t => (
          <span
            key={t}
            className="px-1.5 py-0.5 border border-[#1e1e1e] text-[#f0ede8]/30 text-[8px] tracking-[0.1em] uppercase"
            style={{ fontFamily: 'var(--font-spacemono)' }}
          >{t}</span>
        ))}
      </div>

      {/* Links */}
      <div className="flex gap-3 mt-auto pt-1">
        {project.githubUrl && (
          <a
            href={project.githubUrl} target="_blank" rel="noopener noreferrer"
            className="text-[8px] tracking-[0.2em] uppercase text-[#f0ede8]/20 hover:text-[#f0ede8] transition-colors"
            style={{ fontFamily: 'var(--font-spacemono)' }}
            onClick={e => e.stopPropagation()}
          >GH →</a>
        )}
        {project.liveUrl && (
          <a
            href={project.liveUrl} target="_blank" rel="noopener noreferrer"
            className="text-[8px] tracking-[0.2em] uppercase text-[#c8a840] hover:text-[#f0ede8] transition-colors"
            style={{ fontFamily: 'var(--font-spacemono)' }}
            onClick={e => e.stopPropagation()}
          >LIVE →</a>
        )}
      </div>
    </div>
  )
}

export default function ProjectsSection({ projects }: Props) {
  const sectionRef = useRef<HTMLElement>(null)
  const rowRefs = useRef<(HTMLDivElement | null)[]>([])

  // Slice projects into rows
  let cursor = 0
  const rows = ROWS.map(rc => {
    const items = projects.slice(cursor, cursor + rc.widths.length)
    cursor += rc.widths.length
    return { ...rc, items }
  }).filter(r => r.items.length > 0)

  useEffect(() => {
    if (!projects.length) return
    const ctx = gsap.context(() => {
      rowRefs.current.forEach((row, i) => {
        if (!row) return
        const rc = ROWS[i]
        gsap.fromTo(row,
          { x: rc.dir === 'left' ? -50 : 50, opacity: 0 },
          {
            x: 0,
            opacity: rc.opacity,
            duration: 0.65,
            ease: 'power3.out',
            scrollTrigger: { trigger: row, start: 'top 88%', toggleActions: 'play none none none' },
          }
        )
      })
    }, sectionRef)
    return () => ctx.revert()
  }, [projects.length])

  return (
    <section ref={sectionRef} className="py-14 lg:py-20 bg-[#0c0c0c]" id="projects">
      <div className="max-w-[1300px] mx-auto px-6 lg:px-12">

        {/* Header */}
        <div className="mb-8">
          <span className="text-[#c8a840] text-[9px] tracking-[0.3em] uppercase block mb-2" style={{ fontFamily: 'var(--font-spacemono)' }}>NO. 001</span>
          <h2 className="text-[#f0ede8] text-4xl md:text-6xl lg:text-7xl uppercase leading-none gsap-section-heading" style={{ fontFamily: 'var(--font-anton)' }}>SELECTED WORK</h2>
        </div>

        {/* Content */}
        {projects.length === 0 ? (
          <EmptyState />
        ) : (
          <div className="flex flex-col gap-5">
            {rows.map((row, ri) => (
              <div
                key={ri}
                ref={el => { rowRefs.current[ri] = el }}
                className="flex gap-4 w-full"
                style={{ opacity: 0 }}
              >
                {row.items.map((project, pi) => (
                  <ProjectCard key={project.id} project={project} flex={row.widths[pi] ?? '100%'} />
                ))}
              </div>
            ))}
          </div>
        )}

        {/* CTA */}
        <div className="mt-10 flex justify-center">
          <Link
            href="/projects"
            className="relative px-10 py-3 border border-[#f0f0f0]/30 text-[#f0ede8] text-[10px] tracking-[0.3em] uppercase overflow-hidden group hover:text-[#0c0c0c] transition-colors duration-200"
            style={{ fontFamily: 'var(--font-spacemono)' }}
          >
            <span className="absolute inset-0 bg-[#f0f0f0] translate-x-[-101%] group-hover:translate-x-0 transition-transform duration-300" />
            <span className="relative">VIEW ALL PROJECTS →</span>
          </Link>
        </div>
      </div>
    </section>
  )
}
