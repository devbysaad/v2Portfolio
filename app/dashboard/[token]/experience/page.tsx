import { notFound } from 'next/navigation'
import Link from 'next/link'
import { validateDashboardToken } from '@/lib/auth'
import { Plus, Pencil, Trash2, Circle } from 'lucide-react'
import { deleteExperience } from '@/app/actions/experience'

function fmtDate(d: Date | null, current: boolean) {
  if (current) return 'Present'
  if (!d) return '—'
  return new Date(d).toLocaleDateString('en-US', { month: 'short', year: 'numeric' })
}

export default async function ExperienceAdmin({ params }: { params: Promise<{ token: string }> }) {
  const { token } = await params
  if (!validateDashboardToken(token)) notFound()
  const base = `/dashboard/${token}`

  let items: any[] = []
  try {
    const prisma = (await import('@/lib/prisma')).default
    items = await prisma.experience.findMany({ orderBy: { order: 'asc' } })
  } catch { /* no db */ }

  return (
    <div className="p-8 max-w-3xl">

      {/* ── Page header ── */}
      <div className="pb-6 mb-6 border-b-2 border-white/10 flex items-end justify-between">
        <div>
          <p className="text-[#c8a840] text-[8px] tracking-[0.35em] uppercase mb-1">MANAGE</p>
          <h1 className="text-white text-4xl uppercase" style={{ fontFamily: 'var(--font-anton)' }}>EXPERIENCE</h1>
          <p className="text-white/30 text-[10px] tracking-[0.15em] mt-1">{items.length} total entries</p>
        </div>
        <Link
          href={`${base}/experience/new`}
          className="flex items-center gap-2 px-5 py-2.5 bg-[#c8a840] text-[#0c0c0c] text-[9px] tracking-[0.2em] uppercase font-bold hover:bg-white transition-colors"
        >
          <Plus className="w-3.5 h-3.5" /> ADD EXPERIENCE
        </Link>
      </div>

      {/* ── Empty state ── */}
      {items.length === 0 ? (
        <div className="border-2 border-dashed border-white/10 p-16 text-center">
          <p className="text-white/20 text-[10px] tracking-[0.3em] uppercase mb-4">No experience entries yet</p>
          <Link href={`${base}/experience/new`} className="text-[#c8a840] text-[9px] tracking-[0.2em] uppercase hover:text-white transition-colors">
            + ADD YOUR FIRST ENTRY →
          </Link>
        </div>
      ) : (
        <div className="border-2 border-white/10">

          {/* Table header */}
          <div className="flex items-center gap-4 px-5 py-2.5 border-b-2 border-white/10 bg-white/3">
            <span className="flex-1 text-white/30 text-[8px] tracking-[0.3em] uppercase">Role / Company</span>
            <span className="w-36 text-white/30 text-[8px] tracking-[0.3em] uppercase hidden md:block">Period</span>
            <span className="w-16 text-white/30 text-[8px] tracking-[0.3em] uppercase text-right">Actions</span>
          </div>

          {/* Rows */}
          {items.map((e, idx) => (
            <div
              key={e.id}
              className={`flex items-center gap-4 px-5 py-4 hover:bg-white/3 transition-colors ${idx < items.length - 1 ? 'border-b border-white/8' : ''}`}
            >
              {/* Status dot */}
              <div className="flex-shrink-0">
                <div className={`w-2 h-2 rounded-full ${e.current ? 'bg-[#22c55e] animate-pulse' : 'bg-white/20'}`} />
              </div>

              {/* Company + role */}
              <div className="flex-1 min-w-0">
                <p className="text-white text-sm leading-tight" style={{ fontFamily: 'var(--font-anton)' }}>{e.company}</p>
                <p className="text-white/40 text-[9px] italic mt-0.5">{e.position}</p>
              </div>

              {/* Date range */}
              <div className="w-36 hidden md:block">
                <p className="text-[#c8a840] text-[9px] tracking-[0.1em]">
                  {fmtDate(e.startDate, false)} — {fmtDate(e.endDate, e.current ?? false)}
                </p>
                {e.location && <p className="text-white/20 text-[8px] mt-0.5">{e.location}</p>}
              </div>

              {/* Actions */}
              <div className="w-16 flex items-center justify-end gap-1">
                <Link href={`${base}/experience/${e.id}`} className="p-1.5 text-white/20 hover:text-white transition-colors" title="Edit">
                  <Pencil className="w-3.5 h-3.5" />
                </Link>
                <form action={async () => { 'use server'; await deleteExperience(e.id) }}>
                  <button type="submit" className="p-1.5 text-white/20 hover:text-red-400 transition-colors" title="Delete">
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </form>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
