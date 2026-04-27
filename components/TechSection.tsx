'use client'

import { useEffect, useRef } from 'react'
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
                    <div key={skill.id} className="tech-pill text-[#f0ede8]">
                      <span className="text-[#c8a840] text-xs">{TECH_ICONS[skill.name] ?? '◆'}</span>
                      {skill.name}
                    </div>
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
