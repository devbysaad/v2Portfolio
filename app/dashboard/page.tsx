import Link from 'next/link'
import { Briefcase, Zap, GraduationCap, Plus, Pencil, Star } from 'lucide-react'
import { getProjects } from '@/app/actions/projects'
import { getSkills } from '@/app/actions/skills'
import { getExperiences } from '@/app/actions/experience'

export const dynamic = 'force-dynamic'

function fmtDate(d: any, current: boolean) {
  if (current) return 'Present'
  if (!d) return '—'
  return new Date(d).toLocaleDateString('en-US', { month: 'short', year: 'numeric' })
}

export default async function DashboardOverview() {
  const [projects, skills, experiences] = await Promise.all([
    getProjects().catch(() => []),
    getSkills().catch(() => []),
    getExperiences().catch(() => []),
  ])

  const cards = [
    { label: 'Projects',   count: projects.length,    icon: Briefcase,     href: '/dashboard/projects'   },
    { label: 'Skills',     count: skills.length,      icon: Zap,           href: '/dashboard/skills'     },
    { label: 'Experience', count: experiences.length, icon: GraduationCap, href: '/dashboard/experience' },
  ]

  const grouped: Record<string, any[]> = {}
  skills.forEach((s: any) => { (grouped[s.category] = grouped[s.category] ?? []).push(s) })

  return (
    <div className="p-8 max-w-5xl">

      {/* ── Header ── */}
      <div className="pb-6 mb-8 border-b-2 border-white/10">
        <p className="text-[#c8a840] text-[8px] tracking-[0.35em] uppercase mb-1">ADMIN</p>
        <h1 className="text-white text-4xl uppercase" style={{ fontFamily: 'var(--font-anton)' }}>OVERVIEW</h1>
      </div>

      {/* ── Stat cards ── */}
      <div className="grid grid-cols-3 gap-4 mb-8">
        {cards.map(({ label, count, icon: Icon, href }) => (
          <Link key={label} href={href} className="block border-2 border-white/10 bg-[#0c0c0c] hover:border-[#c8a840]/40 transition-colors p-5 group">
            <div className="flex items-center justify-between mb-3">
              <Icon className="w-4 h-4 text-white/20 group-hover:text-[#c8a840] transition-colors" />
              <span className="text-[#c8a840] text-3xl" style={{ fontFamily: 'var(--font-anton)' }}>{count}</span>
            </div>
            <p className="text-white/40 text-[9px] tracking-[0.25em] uppercase">{label}</p>
          </Link>
        ))}
      </div>

      {/* ── Quick add ── */}
      <div className="flex gap-3 flex-wrap mb-10">
        {[
          { label: 'New Project',    href: '/dashboard/projects/new'   },
          { label: 'New Skill',      href: '/dashboard/skills/new'     },
          { label: 'New Experience', href: '/dashboard/experience/new' },
        ].map(({ label, href }) => (
          <Link key={label} href={href}
            className="flex items-center gap-2 px-4 py-2 border border-white/15 text-white/40 hover:text-white hover:border-[#c8a840]/40 transition-colors text-[9px] tracking-[0.15em] uppercase"
          >
            <Plus className="w-3 h-3" />{label}
          </Link>
        ))}
      </div>

      {/* ══════════════ PROJECTS ══════════════ */}
      <Section title="PROJECTS" count={projects.length} href="/dashboard/projects" addHref="/dashboard/projects/new">
        {projects.length === 0 ? (
          <Empty label="No projects yet" href="/dashboard/projects/new" />
        ) : (
          <div className="divide-y divide-white/8">
            {(projects as any[]).map(p => (
              <div key={p.id} className="flex items-center gap-4 px-4 py-3 hover:bg-white/3 transition-colors">
                <div className="w-9 h-9 bg-white/5 border border-white/10 flex-shrink-0 overflow-hidden">
                  {p.imageUrl
                    ? <img src={p.imageUrl} alt="" className="w-full h-full object-cover" />
                    : <span className="w-full h-full flex items-center justify-center text-white/10 text-xs" style={{ fontFamily: 'var(--font-anton)' }}>{(p.title ?? '?').slice(0,2)}</span>
                  }
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-white text-sm truncate" style={{ fontFamily: 'var(--font-anton)' }}>{p.title}</p>
                  <p className="text-white/30 text-[9px] truncate">{(p.techStack ?? []).join(' · ')}</p>
                </div>
                {p.featured && <Star className="w-3 h-3 text-[#c8a840] fill-[#c8a840] flex-shrink-0" />}
                <Link href={`/dashboard/projects/${p.id}`} className="p-1.5 text-white/20 hover:text-white transition-colors flex-shrink-0">
                  <Pencil className="w-3 h-3" />
                </Link>
              </div>
            ))}
          </div>
        )}
      </Section>

      {/* ══════════════ SKILLS ══════════════ */}
      <Section title="SKILLS" count={skills.length} href="/dashboard/skills" addHref="/dashboard/skills/new">
        {skills.length === 0 ? (
          <Empty label="No skills yet" href="/dashboard/skills/new" />
        ) : (
          <div>
            {Object.entries(grouped).map(([cat, items]) => (
              <div key={cat}>
                <p className="px-4 py-1.5 text-[#c8a840] text-[7px] tracking-[0.3em] uppercase border-b border-white/8 bg-white/2">{cat}</p>
                <div className="divide-y divide-white/5">
                  {items.map((s: any) => (
                    <div key={s.id} className="flex items-center gap-3 px-4 py-2.5 hover:bg-white/3 transition-colors">
                      <p className="flex-1 text-white/80 text-xs">{s.name}</p>
                      <div className="w-28 h-[2px] bg-white/10">
                        <div className="h-full bg-[#c8a840]" style={{ width: `${s.proficiency ?? 0}%` }} />
                      </div>
                      <span className="text-[#c8a840] text-[9px] w-7 text-right">{s.proficiency}%</span>
                      <Link href={`/dashboard/skills/${s.id}`} className="p-1 text-white/20 hover:text-white transition-colors">
                        <Pencil className="w-3 h-3" />
                      </Link>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}
      </Section>

      {/* ══════════════ EXPERIENCE ══════════════ */}
      <Section title="EXPERIENCE" count={experiences.length} href="/dashboard/experience" addHref="/dashboard/experience/new">
        {experiences.length === 0 ? (
          <Empty label="No experience yet" href="/dashboard/experience/new" />
        ) : (
          <div className="divide-y divide-white/8">
            {(experiences as any[]).map(e => (
              <div key={e.id} className="flex items-center gap-4 px-4 py-3 hover:bg-white/3 transition-colors">
                <div className={`w-2 h-2 rounded-full flex-shrink-0 ${e.current ? 'bg-[#22c55e] animate-pulse' : 'bg-white/20'}`} />
                <div className="flex-1 min-w-0">
                  <p className="text-white text-sm" style={{ fontFamily: 'var(--font-anton)' }}>{e.company}</p>
                  <p className="text-white/40 text-[9px] italic">{e.position}</p>
                </div>
                <p className="text-[#c8a840] text-[9px] flex-shrink-0">
                  {fmtDate(e.startDate, false)} — {fmtDate(e.endDate, e.current ?? false)}
                </p>
                <Link href={`/dashboard/experience/${e.id}`} className="p-1.5 text-white/20 hover:text-white transition-colors flex-shrink-0">
                  <Pencil className="w-3 h-3" />
                </Link>
              </div>
            ))}
          </div>
        )}
      </Section>

    </div>
  )
}

/* ── Helpers ── */
function Section({ title, count, href, addHref, children }: {
  title: string; count: number; href: string; addHref: string; children: React.ReactNode
}) {
  return (
    <div className="mb-8 border-2 border-white/10">
      <div className="flex items-center justify-between px-4 py-3 border-b-2 border-white/10 bg-white/3">
        <div className="flex items-center gap-3">
          <span className="text-white/60 text-[9px] tracking-[0.3em] uppercase">{title}</span>
          <span className="text-[#c8a840] text-[9px]">{count}</span>
        </div>
        <div className="flex items-center gap-2">
          <Link href={addHref} className="flex items-center gap-1 text-white/20 hover:text-[#c8a840] transition-colors text-[8px] tracking-[0.2em] uppercase">
            <Plus className="w-3 h-3" /> Add
          </Link>
          <span className="text-white/10">|</span>
          <Link href={href} className="text-white/20 hover:text-white transition-colors text-[8px] tracking-[0.2em] uppercase">Manage →</Link>
        </div>
      </div>
      {children}
    </div>
  )
}

function Empty({ label, href }: { label: string; href: string }) {
  return (
    <div className="px-4 py-8 text-center">
      <p className="text-white/20 text-[9px] tracking-[0.2em] uppercase mb-2">{label}</p>
      <Link href={href} className="text-[#c8a840] text-[8px] tracking-[0.15em] uppercase hover:text-white transition-colors">+ Add now →</Link>
    </div>
  )
}