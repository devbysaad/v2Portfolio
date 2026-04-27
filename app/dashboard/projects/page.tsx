import Link from 'next/link'
import { Plus, Pencil, Trash2, Star } from 'lucide-react'
import { deleteProject, getProjects } from '@/app/actions/projects'

export const dynamic = 'force-dynamic'


export default async function ProjectsAdmin() {
  const projects = await getProjects()

  return (
    <div className="p-8 max-w-4xl">
      <div className="pb-6 mb-6 border-b-2 border-white/10 flex items-end justify-between">
        <div>
          <p className="text-[#c8a840] text-[8px] tracking-[0.35em] uppercase mb-1">MANAGE</p>
          <h1 className="text-white text-4xl uppercase" style={{ fontFamily: 'var(--font-anton)' }}>PROJECTS</h1>
          <p className="text-white/30 text-[10px] tracking-[0.15em] mt-1">{projects.length} total</p>
        </div>
        <Link href="/dashboard/projects/new" className="flex items-center gap-2 px-5 py-2.5 bg-[#c8a840] text-[#0c0c0c] text-[9px] tracking-[0.2em] uppercase font-bold hover:bg-white transition-colors">
          <Plus className="w-3.5 h-3.5" /> ADD PROJECT
        </Link>
      </div>

      {projects.length === 0 ? (
        <div className="border-2 border-dashed border-white/10 p-16 text-center">
          <p className="text-white/20 text-[10px] tracking-[0.3em] uppercase mb-4">No projects yet</p>
          <Link href="/dashboard/projects/new" className="text-[#c8a840] text-[9px] tracking-[0.2em] uppercase hover:text-white transition-colors">+ ADD YOUR FIRST PROJECT →</Link>
        </div>
      ) : (
        <div className="border-2 border-white/10">
          <div className="flex items-center gap-4 px-5 py-2.5 border-b-2 border-white/10 bg-white/3">
            <span className="flex-1 text-white/30 text-[8px] tracking-[0.3em] uppercase">Project</span>
            <span className="w-28 text-white/30 text-[8px] tracking-[0.3em] uppercase hidden md:block">Stack</span>
            <span className="w-20 text-white/30 text-[8px] tracking-[0.3em] uppercase text-center">Featured</span>
            <span className="w-20 text-white/30 text-[8px] tracking-[0.3em] uppercase text-right">Actions</span>
          </div>
          {(projects as any[]).map((p, idx) => (
            <div key={p.id} className={`flex items-center gap-4 px-5 py-4 hover:bg-white/3 transition-colors ${idx < projects.length - 1 ? 'border-b border-white/8' : ''}`}>
              <div className="w-10 h-10 bg-white/5 border border-white/10 flex-shrink-0 overflow-hidden">
                {p.imageUrl ? <img src={p.imageUrl} alt="" className="w-full h-full object-cover" /> : <div className="w-full h-full flex items-center justify-center text-white/10 text-xs" style={{ fontFamily: 'var(--font-anton)' }}>{(p.title ?? '?').slice(0,2)}</div>}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-white text-sm truncate" style={{ fontFamily: 'var(--font-anton)' }}>{p.title}</p>
                {p.description && <p className="text-white/30 text-[9px] mt-0.5 truncate italic">{p.description}</p>}
              </div>
              <div className="w-28 hidden md:flex flex-wrap gap-1">
                {(p.techStack ?? []).slice(0, 2).map((t: string) => <span key={t} className="text-[#c8a840]/60 text-[7px]">{t}</span>)}
                {(p.techStack ?? []).length > 2 && <span className="text-white/20 text-[7px]">+{(p.techStack ?? []).length - 2}</span>}
              </div>
              <div className="w-20 flex justify-center">
                {p.featured && <Star className="w-3.5 h-3.5 text-[#c8a840] fill-[#c8a840]" />}
              </div>
              <div className="w-20 flex items-center justify-end gap-2">
                <Link href={`/dashboard/projects/${p.id}`} className="p-1.5 text-white/20 hover:text-white transition-colors"><Pencil className="w-3.5 h-3.5" /></Link>
                <form action={async () => { 'use server'; await deleteProject(p.id) }}>
                  <button type="submit" className="p-1.5 text-white/20 hover:text-red-400 transition-colors"><Trash2 className="w-3.5 h-3.5" /></button>
                </form>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}