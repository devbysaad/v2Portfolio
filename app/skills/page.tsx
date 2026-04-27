import type { Metadata } from 'next'
import Link from 'next/link'
import type { Skill } from '@prisma/client'

export const metadata: Metadata = {
  title: 'Skills — Muhammad Saad',
  description: 'Technical skills and proficiencies of Muhammad Saad — Full Stack Developer.',
}

export const revalidate = 3600

async function getSkills(): Promise<Skill[]> {
  try {
    const prisma = (await import('@/lib/prisma')).default
    return prisma.skill.findMany({ orderBy: [{ order: 'asc' }, { category: 'asc' }] })
  } catch { return [] }
}

const FALLBACK: Partial<Skill>[] = [
  { id: 't1', name: 'React', category: 'Technologies', proficiency: 92, order: 0 },
  { id: 't2', name: 'Next.js', category: 'Technologies', proficiency: 90, order: 1 },
  { id: 't3', name: 'Node.js', category: 'Technologies', proficiency: 88, order: 2 },
  { id: 't4', name: 'Express', category: 'Technologies', proficiency: 85, order: 3 },
  { id: 't5', name: 'PostgreSQL', category: 'Technologies', proficiency: 82, order: 4 },
  { id: 't6', name: 'MongoDB', category: 'Technologies', proficiency: 80, order: 5 },
  { id: 't7', name: 'Prisma', category: 'Technologies', proficiency: 85, order: 6 },
  { id: 'l1', name: 'TypeScript', category: 'Languages', proficiency: 88, order: 0 },
  { id: 'l2', name: 'JavaScript', category: 'Languages', proficiency: 95, order: 1 },
  { id: 'l3', name: 'Python', category: 'Languages', proficiency: 65, order: 2 },
  { id: 'l4', name: 'SQL', category: 'Languages', proficiency: 80, order: 3 },
  { id: 'l5', name: 'HTML / CSS', category: 'Languages', proficiency: 95, order: 4 },
  { id: 'to1', name: 'Git & GitHub', category: 'Tools', proficiency: 90, order: 0 },
  { id: 'to2', name: 'Docker', category: 'Tools', proficiency: 72, order: 1 },
  { id: 'to3', name: 'Vercel', category: 'Tools', proficiency: 88, order: 2 },
  { id: 'to4', name: 'Postman', category: 'Tools', proficiency: 85, order: 3 },
  { id: 'o1', name: 'GSAP', category: 'Other', proficiency: 80, order: 0 },
  { id: 'o2', name: 'Tailwind CSS', category: 'Other', proficiency: 90, order: 1 },
  { id: 'o3', name: 'Framer Motion', category: 'Other', proficiency: 75, order: 2 },
]

const CATEGORY_ORDER = ['Technologies', 'Languages', 'Tools', 'Other']

export default async function SkillsPage() {
  const data = await getSkills()
  const skills = data.length ? data : FALLBACK as Skill[]

  const grouped = CATEGORY_ORDER.reduce((acc, cat) => {
    acc[cat] = skills.filter(s => s.category === cat)
    return acc
  }, {} as Record<string, Skill[]>)

  return (
    <main className="min-h-screen bg-[#0c0c0c] pt-12 pb-24">
      <div className="max-w-[1000px] mx-auto px-6 lg:px-12">

        <Link href="/" className="text-[#f0ede8]/30 hover:text-[#f0ede8] text-[10px] tracking-[0.25em] uppercase inline-flex items-center gap-2 mb-8 transition-colors" style={{ fontFamily: 'var(--font-spacemono)' }}>
          ← BACK HOME
        </Link>

        <div className="mb-12">
          <span className="text-[#c8a840] text-[10px] tracking-[0.35em] uppercase block mb-3" style={{ fontFamily: 'var(--font-spacemono)' }}>TECHNICAL PROFILE</span>
          <h1 className="text-[#f0ede8] text-5xl md:text-7xl uppercase leading-none mb-4" style={{ fontFamily: 'var(--font-anton)' }}>SKILLS</h1>
          <p className="text-[#f0ede8]/50 text-lg italic leading-relaxed" style={{ fontFamily: 'var(--font-baskerville)' }}>
            Technologies and tools I work with daily.
          </p>
        </div>

        <div className="space-y-12">
          {CATEGORY_ORDER.map(cat => {
            const catSkills = grouped[cat] ?? []
            if (!catSkills.length) return null
            return (
              <div key={cat}>
                <div className="flex items-center gap-4 mb-5">
                  <h2 className="text-[#f0ede8] text-2xl uppercase" style={{ fontFamily: 'var(--font-anton)' }}>{cat}</h2>
                  <div className="flex-1 h-px bg-[#1e1e1e]" />
                  <span className="text-[#f0ede8]/20 text-[9px] tracking-[0.2em] uppercase" style={{ fontFamily: 'var(--font-spacemono)' }}>{catSkills.length} skills</span>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {catSkills.map(skill => (
                    <div key={skill.id} className="border border-[#1e1e1e] bg-[#111] p-4 group hover:border-[#c8a840]/20 transition-colors">
                      <div className="flex items-center justify-between mb-3">
                        <span className="text-[#f0ede8] text-sm font-bold group-hover:text-[#c8a840] transition-colors" style={{ fontFamily: 'var(--font-spacemono)' }}>{skill.name}</span>
                        <span className="text-[#c8a840] text-[10px]" style={{ fontFamily: 'var(--font-spacemono)' }}>{skill.proficiency}%</span>
                      </div>
                      <div className="h-[2px] bg-[#1e1e1e]">
                        <div
                          className="h-full bg-[#c8a840] transition-all duration-700"
                          style={{ width: `${skill.proficiency}%` }}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )
          })}
        </div>
      </div>
    </main>
  )
}