'use client'

import { useEffect, useRef } from 'react'
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
  const initials = (project.title ?? 'PR').slice(0, 2).toUpperCase()
  return (
    <div
      className="group border-t-2 border-[#f0f0f0]/15 hover:border-[#c8a840]/50 transition-colors duration-200 pt-3 flex flex-col gap-2 min-w-0"
      style={{ flex: `0 0 ${flex}` }}
    >
      {/* Image */}
      <div
        className="w-full overflow-hidden bg-[#111] border border-[#1e1e1e] group-hover:border-[#c8a840]/20 transition-colors"
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
