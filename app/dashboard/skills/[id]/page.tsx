import { notFound, redirect } from 'next/navigation'
import { updateSkill } from '@/app/actions/skills'
import { localGetSkillById } from '@/lib/local-storage'

const DB_URL = process.env.DATABASE_URL ?? ''
const HAS_DB = DB_URL.length > 0 && !DB_URL.includes('USER:PASSWORD') && !DB_URL.includes('HOST')

export default async function EditSkill({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  let skill: any = null
  try {
    if (!HAS_DB) throw new Error('no-db')
    const { default: prisma } = await import('@/lib/prisma')
    skill = await prisma.skill.findUnique({ where: { id } })
  } catch {
    skill = await localGetSkillById(id)
  }
  if (!skill) notFound()

  const action = async (fd: FormData) => {
    'use server'
    await updateSkill(id, fd)
    redirect('/dashboard/skills')
  }
  return (
    <div className="p-8 max-w-xl">
      <div className="pb-5 mb-7 border-b-2 border-white/10">
        <p className="text-[#c8a840] text-[8px] tracking-[0.35em] uppercase mb-1">SKILLS</p>
        <h1 className="text-white text-4xl uppercase" style={{ fontFamily: 'var(--font-anton)' }}>EDIT SKILL</h1>
        <p className="text-white/30 text-[9px] mt-1">{skill.name}</p>
      </div>
      <form action={action} className="flex flex-col gap-5">
        <Field label="Skill Name *" name="name" defaultValue={skill.name} required />
        <div>
          <label className="block text-white/40 text-[9px] tracking-[0.25em] uppercase mb-1.5">Category *</label>
          <select name="category" required defaultValue={skill.category} className="w-full bg-[#0a0a0a] border border-white/10 text-white text-sm px-3 py-2.5 focus:outline-none focus:border-[#c8a840]/40">
            {['Technologies', 'Languages', 'Tools', 'Other'].map(c => <option key={c} value={c}>{c}</option>)}
          </select>
        </div>
        <Field label="Proficiency (0–100)" name="proficiency" type="number" defaultValue={String(skill.proficiency ?? 80)} />
        <Field label="Display Order" name="order" type="number" defaultValue={String(skill.order ?? 0)} />
        <div className="flex gap-3 pt-2 border-t border-white/10">
          <button type="submit" className="px-6 py-3 bg-[#c8a840] text-[#0c0c0c] text-[9px] tracking-[0.2em] uppercase font-bold hover:bg-white transition-colors">SAVE CHANGES</button>
          <a href="/dashboard/skills" className="px-6 py-3 border border-white/15 text-white/40 text-[9px] tracking-[0.2em] uppercase hover:text-white transition-colors">CANCEL</a>
        </div>
      </form>
    </div>
  )
}
function Field({ label, name, type = 'text', required = false, defaultValue = '' }: { label: string; name: string; type?: string; required?: boolean; defaultValue?: string }) {
  return (
    <div>
      <label className="block text-white/40 text-[9px] tracking-[0.25em] uppercase mb-1.5">{label}</label>
      <input type={type} name={name} required={required} defaultValue={defaultValue} className="w-full bg-[#0a0a0a] border border-white/10 text-white text-sm px-3 py-2.5 focus:outline-none focus:border-[#c8a840]/40 placeholder-white/15" style={{ fontFamily: 'var(--font-spacemono)' }} />
    </div>
  )
}
