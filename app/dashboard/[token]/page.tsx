import { notFound } from 'next/navigation'
import Link from 'next/link'
import { validateDashboardToken } from '@/lib/auth'
import { Briefcase, Zap, GraduationCap, Plus } from 'lucide-react'

export default async function DashboardOverview({ params }: { params: Promise<{ token: string }> }) {
  const { token } = await params
  if (!validateDashboardToken(token)) notFound()
  const base = `/dashboard/${token}`

  let counts = { projects: 0, skills: 0, experience: 0 }
  try {
    const prisma = (await import('@/lib/prisma')).default
    const [p, s, e] = await Promise.all([
      prisma.project.count(),
      prisma.skill.count(),
      prisma.experience.count(),
    ])
    counts = { projects: p, skills: s, experience: e }
  } catch { /* no db */ }

  const cards = [
    { label: 'Projects',   count: counts.projects,   icon: Briefcase,    href: `${base}/projects`   },
    { label: 'Skills',     count: counts.skills,     icon: Zap,          href: `${base}/skills`     },
    { label: 'Experience', count: counts.experience, icon: GraduationCap, href: `${base}/experience` },
  ]

  return (
    <div className="p-8">
      <div className="mb-8">
        <h1 className="text-[#f0ede8] text-3xl uppercase" style={{ fontFamily: 'var(--font-anton)' }}>OVERVIEW</h1>
        <p className="text-[#f0ede8]/30 text-[10px] tracking-[0.2em] mt-1">Portfolio admin dashboard</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-10">
        {cards.map(({ label, count, icon: Icon, href }) => (
          <Link key={label} href={href} className="block border border-[#1a1a1a] bg-[#0c0c0c] hover:border-[#c8a840]/30 transition-colors p-5 group">
            <div className="flex items-center justify-between mb-4">
              <Icon className="w-4 h-4 text-[#f0ede8]/20 group-hover:text-[#c8a840] transition-colors" />
              <span className="text-[#c8a840] text-2xl" style={{ fontFamily: 'var(--font-anton)' }}>{count}</span>
            </div>
            <p className="text-[#f0ede8]/40 text-[9px] tracking-[0.2em] uppercase">{label}</p>
          </Link>
        ))}
      </div>

      <div className="border-t border-[#1a1a1a] pt-6">
        <p className="text-[#f0ede8]/20 text-[9px] tracking-[0.2em] uppercase mb-4">Quick add</p>
        <div className="flex gap-3 flex-wrap">
          {[
            { label: 'New Project',    href: `${base}/projects/new` },
            { label: 'New Skill',      href: `${base}/skills/new` },
            { label: 'New Experience', href: `${base}/experience/new` },
          ].map(({ label, href }) => (
            <Link
              key={label}
              href={href}
              className="flex items-center gap-2 px-4 py-2 border border-[#1a1a1a] text-[#f0ede8]/40 hover:text-[#f0ede8] hover:border-[#c8a840]/40 transition-colors text-[9px] tracking-[0.15em] uppercase"
            >
              <Plus className="w-3 h-3" />
              {label}
            </Link>
          ))}
        </div>
      </div>
    </div>
  )
}
