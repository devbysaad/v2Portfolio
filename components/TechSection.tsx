'use client'

import { useEffect, useRef, useState, useCallback } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import type { Skill } from '@prisma/client'

if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger)
}

const FALLBACK_SKILLS: Partial<Skill>[] = [
  // Technologies
  { id: 't1', name: 'React', category: 'Technologies' },
  { id: 't2', name: 'Next.js', category: 'Technologies' },
  { id: 't3', name: 'Node.js', category: 'Technologies' },
  { id: 't4', name: 'Express', category: 'Technologies' },
  { id: 't5', name: 'PostgreSQL', category: 'Technologies' },
  { id: 't6', name: 'MongoDB', category: 'Technologies' },
  { id: 't7', name: 'Prisma', category: 'Technologies' },
  { id: 't8', name: 'REST APIs', category: 'Technologies' },
  // Languages
  { id: 'l1', name: 'TypeScript', category: 'Languages' },
  { id: 'l2', name: 'JavaScript', category: 'Languages' },
  { id: 'l3', name: 'Python', category: 'Languages' },
  { id: 'l4', name: 'SQL', category: 'Languages' },
  { id: 'l5', name: 'HTML / CSS', category: 'Languages' },
  // Tools
  { id: 'to1', name: 'Git & GitHub', category: 'Tools' },
  { id: 'to2', name: 'Docker', category: 'Tools' },
  { id: 'to3', name: 'Vercel', category: 'Tools' },
  { id: 'to4', name: 'Postman', category: 'Tools' },
  // Other
  { id: 'o1', name: 'GSAP', category: 'Other' },
  { id: 'o2', name: 'Tailwind CSS', category: 'Other' },
  { id: 'o3', name: 'Framer Motion', category: 'Other' },
]

const TECH_ICONS: Record<string, string> = {
  'React': '⚛', 'Next.js': '▲', 'Node.js': '⬡', 'Express': '⬡',
  'PostgreSQL': '🐘', 'MongoDB': '🍃', 'Prisma': '◆', 'REST APIs': '⇌',
  'TypeScript': 'TS', 'JavaScript': 'JS', 'Python': '🐍', 'SQL': '⊞',
  'HTML / CSS': '◻', 'Git & GitHub': '⎇', 'Docker': '🐳', 'Vercel': '△',
  'Postman': '⬡', 'GSAP': '✦', 'Tailwind CSS': '◈', 'Framer Motion': '○',
}

const ROW_CONFIG = [
  { category: 'Technologies', maxW: '100%', opacity: 1.0, dir: 'left' },
  { category: 'Languages',    maxW: '80%',  opacity: 0.85, dir: 'right' },
  { category: 'Tools',        maxW: '60%',  opacity: 0.65, dir: 'left' },
  { category: 'Other',        maxW: '40%',  opacity: 0.45, dir: 'right' },
]

interface Props { skills: Skill[] }

function HoverTechPill({ skill }: { skill: Skill }) {
  const hoverRef = useRef<HTMLDivElement>(null)
  const panelRef = useRef<HTMLDivElement>(null)
  const cursorDotRef = useRef<HTMLDivElement>(null)
  const [pos, setPos] = useState({ x: 0, y: 0 })

  const onEnter = useCallback(() => {
    gsap.to(panelRef.current, { opacity: 1, y: 0, duration: 0.24, ease: 'power3.out' })
    gsap.to(cursorDotRef.current, { opacity: 1, scale: 1, duration: 0.2 })
  }, [])

  const onLeave = useCallback(() => {
    gsap.to(panelRef.current, { opacity: 0, y: 8, duration: 0.18 })
    gsap.to(cursorDotRef.current, { opacity: 0, scale: 0.4, duration: 0.16 })
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

  const panelW = 220
  const panelH = 90
  const offset = 10
  const boxW = hoverRef.current?.clientWidth ?? 220
  const boxH = hoverRef.current?.clientHeight ?? 60
  let px = pos.x + offset
  let py = pos.y + offset
  if (px + panelW > boxW) px = pos.x - panelW - offset
  if (py + panelH > boxH) py = pos.y - panelH - offset
  if (px < 4) px = 4
  if (py < 4) py = 4

  return (
    <div ref={hoverRef} className="relative tech-pill text-[#f0ede8] cursor-none">
      <span className="text-[#c8a840] text-xs">{TECH_ICONS[skill.name] ?? '◆'}</span>
      {skill.name}

      <div
        ref={cursorDotRef}
        className="absolute pointer-events-none z-20 opacity-0 scale-[0.4]"
        style={{ top: 0, left: 0, transform: 'translate(-50%, -50%)' }}
      >
        <svg width="42" height="42" viewBox="0 0 52 52" style={{ animation: 'rotate-ring 7s linear infinite' }}>
          <defs>
            <path id={`tech-${skill.id}`} d="M 26,26 m -22,0 a 22,22 0 1,1 44,0 a 22,22 0 1,1 -44,0" />
          </defs>
          <text fill="#c8a840" fontSize="5.5" letterSpacing="2.5" fontFamily="var(--font-spacemono, monospace)">
            <textPath href={`#tech-${skill.id}`}>VIEW · TECH · DETAILS ·</textPath>
          </text>
        </svg>
      </div>

      <div
        ref={panelRef}
        className="absolute z-30 pointer-events-none opacity-0"
        style={{ top: py, left: px, width: panelW, transform: 'translateY(8px)' }}
      >
        <div className="bg-[#0c0c0c]/95 border border-[#c8a840]/40 p-2 backdrop-blur-sm">
          <p className="text-[#c8a840] text-[7px] tracking-[0.25em] uppercase mb-1" style={{ fontFamily: 'var(--font-spacemono)' }}>
            ◆ TECHNOLOGY
          </p>
          <p className="text-white text-xs leading-tight" style={{ fontFamily: 'var(--font-anton)' }}>
            {skill.name}
          </p>
          <p className="text-[#f0ede8]/50 text-[8px] italic mt-1" style={{ fontFamily: 'var(--font-baskerville)' }}>
            {skill.category}
          </p>
        </div>
      </div>
    </div>
  )
}

export default function TechSection({ skills }: Props) {
  const sectionRef = useRef<HTMLDivElement>(null)
  const rowRefs = useRef<(HTMLDivElement | null)[]>([])

  const display = skills.length ? skills : FALLBACK_SKILLS as Skill[]

  useEffect(() => {
    const ctx = gsap.context(() => {
      rowRefs.current.forEach((row, i) => {
        if (!row) return
        const fromX = ROW_CONFIG[i].dir === 'left' ? -60 : 60
        gsap.fromTo(
          row,
          { x: fromX, opacity: 0 },
          {
            x: 0,
            opacity: ROW_CONFIG[i].opacity,
            duration: 0.9,
            ease: 'power3.out',
            scrollTrigger: {
              trigger: row,
              start: 'top 85%',
              toggleActions: 'play none none none',
            },
          }
        )
      })
    }, sectionRef)

    return () => ctx.revert()
  }, [])

  return (
    <section ref={sectionRef} className="relative py-14 lg:py-20 bg-[#0c0c0c] overflow-hidden" id="technologies">
      <div className="max-w-[1300px] mx-auto px-6 lg:px-12">

        {/* Header */}
        <div className="mb-8">
          <h2
            className="text-[#f0ede8] text-5xl md:text-7xl lg:text-8xl uppercase leading-none tracking-tight gsap-section-heading"
            style={{ fontFamily: 'var(--font-anton, sans-serif)' }}
          >
            TECHNOLOGIES
          </h2>
        </div>

        {/* ▽ Pyramid rows */}
        <div className="flex flex-col gap-8">
          {ROW_CONFIG.map(({ category, maxW, opacity }, i) => {
            const items = display.filter(s => s.category === category)

            return (
              <div
                key={category}
                ref={el => { rowRefs.current[i] = el }}
                className="mx-auto"
                style={{ maxWidth: maxW, width: '100%', opacity: 0 }}
              >
                <span
                  className="text-[#c8a840] text-[10px] tracking-[0.35em] uppercase block mb-3"
                  style={{ fontFamily: 'var(--font-spacemono, monospace)' }}
                >
                  {category}
                </span>
                <div className="flex flex-wrap gap-2">
                  {items.map(skill => (
                    <HoverTechPill key={skill.id} skill={skill} />
                  ))}
                  {items.length === 0 && (
                    <span
                      className="text-[#f0ede8]/20 text-xs tracking-[0.2em] italic"
                      style={{ fontFamily: 'var(--font-baskerville, serif)' }}
                    >
                      No {category.toLowerCase()} added yet
                    </span>
                  )}
                </div>
              </div>
            )
          })}
        </div>

        {/* CTA */}
        <div className="mt-10 flex justify-center">
          <a
            href="#"
            className="relative px-10 py-4 border border-[#f0f0f0]/40 text-[#f0ede8] text-xs tracking-[0.3em] uppercase overflow-hidden group transition-colors hover:text-[#0c0c0c]"
            style={{ fontFamily: 'var(--font-spacemono, monospace)' }}
          >
            <span className="absolute inset-0 bg-[#f0f0f0] translate-x-[-101%] group-hover:translate-x-0 transition-transform duration-300" />
            <span className="relative">VIEW ALL SKILLS →</span>
          </a>
        </div>
      </div>
    </section>
  )
}
