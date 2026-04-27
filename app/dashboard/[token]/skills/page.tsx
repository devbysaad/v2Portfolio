import { notFound } from 'next/navigation'
import Link from 'next/link'
import { validateDashboardToken } from '@/lib/auth'
import { Plus, Pencil, Trash2 } from 'lucide-react'
import { deleteSkill } from '@/app/actions/skills'

export default async function SkillsAdmin({ params }: { params: Promise<{ token: string }> }) {
  const { token } = await params
  if (!validateDashboardToken(token)) notFound()
  const base = `/dashboard/${token}`

  let skills: any[] = []
  try {
    const prisma = (await import('@/lib/prisma')).default
    skills = await prisma.skill.findMany({ orderBy: [{ category: 'asc' }, { order: 'asc' }] })
  } catch { /* no db */ }

  const grouped: Record<string, any[]> = {}
  skills.forEach(s => { (grouped[s.category] = grouped[s.category] ?? []).push(s) })

  return (
    <div className="p-8 max-w-3xl">

      {/* ── Page header ── */}
      <div className="pb-6 mb-6 border-b-2 border-white/10 flex items-end justify-between">
        <div>
          <p className="text-[#c8a840] text-[8px] tracking-[0.35em] uppercase mb-1">MANAGE</p>
          <h1 className="text-white text-4xl uppercase" style={{ fontFamily: 'var(--font-anton)' }}>SKILLS</h1>
          <p className="text-white/30 text-[10px] tracking-[0.15em] mt-1">{skills.length} total entries</p>
        </div>
        <Link
          href={`${base}/skills/new`}
          className="flex items-center gap-2 px-5 py-2.5 bg-[#c8a840] text-[#0c0c0c] text-[9px] tracking-[0.2em] uppercase font-bold hover:bg-white transition-colors"
        >
          <Plus className="w-3.5 h-3.5" /> ADD SKILL
        </Link>
      </div>

      {/* ── Empty state ── */}
      {skills.length === 0 ? (
        <div className="border-2 border-dashed border-white/10 p-16 text-center">
          <p className="text-white/20 text-[10px] tracking-[0.3em] uppercase mb-4">No skills yet</p>
          <Link href={`${base}/skills/new`} className="text-[#c8a840] text-[9px] tracking-[0.2em] uppercase hover:text-white transition-colors">
            + ADD YOUR FIRST SKILL →
          </Link>
        </div>
      ) : (
        <div className="flex flex-col gap-8">
          {Object.entries(grouped).map(([cat, items]) => (
            <div key={cat}>

              {/* Category header */}
              <div className="flex items-center gap-3 mb-0 py-2 border-b-2 border-white/15 bg-white/3 px-3 -mx-3">
                <span className="text-[#c8a840] text-[8px] tracking-[0.3em] uppercase">{cat}</span>
                <span className="text-white/20 text-[8px]">({items.length})</span>
              </div>

              {/* Skills in category */}
              <div className="border-l-2 border-white/8 ml-1">
                {items.map((s, idx) => (
                  <div
                    key={s.id}
                    className={`flex items-center gap-4 px-4 py-3 hover:bg-white/3 transition-colors ${idx < items.length - 1 ? 'border-b border-white/8' : ''}`}
                  >
                    {/* Name */}
                    <p className="flex-1 text-white text-sm" style={{ fontFamily: 'var(--font-spacemono)' }}>{s.name}</p>

                    {/* Proficiency bar */}
                    <div className="flex items-center gap-2 w-44">
                      <div className="flex-1 h-[2px] bg-white/10">
                        <div className="h-full bg-[#c8a840] transition-all" style={{ width: `${s.proficiency ?? 0}%` }} />
                      </div>
                      <span className="text-[#c8a840] text-[9px] w-8 text-right flex-shrink-0" style={{ fontFamily: 'var(--font-spacemono)' }}>
                        {s.proficiency}%
                      </span>
                    </div>

                    {/* Actions */}
                    <div className="flex items-center gap-1 flex-shrink-0">
                      <Link href={`${base}/skills/${s.id}`} className="p-1.5 text-white/20 hover:text-white transition-colors" title="Edit">
                        <Pencil className="w-3 h-3" />
                      </Link>
                      <form action={async () => { 'use server'; await deleteSkill(s.id) }}>
                        <button type="submit" className="p-1.5 text-white/20 hover:text-red-400 transition-colors" title="Delete">
                          <Trash2 className="w-3 h-3" />
                        </button>
                      </form>
                    </div>
                  </div>
                ))}
              </div>

            </div>
          ))}
        </div>
      )}
    </div>
  )
}
