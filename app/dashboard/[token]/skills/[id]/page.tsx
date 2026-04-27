import { notFound, redirect } from 'next/navigation'
import { validateDashboardToken } from '@/lib/auth'
import { updateSkill } from '@/app/actions/skills'

export default async function EditSkill({ params }: { params: Promise<{ token: string; id: string }> }) {
  const { token, id } = await params
  if (!validateDashboardToken(token)) notFound()
  const base = `/dashboard/${token}`

  let skill: any = null
  try {
    const prisma = (await import('@/lib/prisma')).default
    skill = await prisma.skill.findUnique({ where: { id } })
  } catch { /* no db */ }

  if (!skill) notFound()

  const action = async (fd: FormData) => {
    'use server'
    await updateSkill(id, fd)
    redirect(`${base}/skills`)
  }

  return (
    <div className="p-8 max-w-xl">
      <h1 className="text-[#f0ede8] text-3xl uppercase mb-8" style={{ fontFamily: 'var(--font-anton)' }}>EDIT SKILL</h1>
      <form action={action} className="flex flex-col gap-5">
        <Field label="Skill Name *" name="name" defaultValue={skill.name} required />
        <div>
          <label className="block text-[#f0ede8]/40 text-[9px] tracking-[0.25em] uppercase mb-1.5" style={{ fontFamily: 'var(--font-spacemono)' }}>Category *</label>
          <select name="category" required defaultValue={skill.category}
            className="w-full bg-[#0c0c0c] border border-[#1a1a1a] text-[#f0ede8] text-sm px-3 py-2.5 focus:outline-none focus:border-[#c8a840]/50"
            style={{ fontFamily: 'var(--font-spacemono)' }}>
            {['Technologies', 'Languages', 'Tools', 'Other'].map(c => <option key={c} value={c}>{c}</option>)}
          </select>
        </div>
        <Field label="Proficiency (0–100)" name="proficiency" type="number" defaultValue={String(skill.proficiency ?? 80)} />
        <Field label="Display Order" name="order" type="number" defaultValue={String(skill.order ?? 0)} />
        <div className="flex gap-3 pt-2">
          <button type="submit" className="px-6 py-2.5 bg-[#c8a840] text-[#0c0c0c] text-[9px] tracking-[0.2em] uppercase font-bold hover:bg-[#f0ede8] transition-colors">SAVE CHANGES</button>
          <a href={`${base}/skills`} className="px-6 py-2.5 border border-[#1a1a1a] text-[#f0ede8]/40 text-[9px] tracking-[0.2em] uppercase hover:text-[#f0ede8] transition-colors">CANCEL</a>
        </div>
      </form>
    </div>
  )
}

function Field({ label, name, type = 'text', required = false, defaultValue = '' }: {
  label: string; name: string; type?: string; required?: boolean; defaultValue?: string
}) {
  return (
    <div>
      <label className="block text-[#f0ede8]/40 text-[9px] tracking-[0.25em] uppercase mb-1.5" style={{ fontFamily: 'var(--font-spacemono)' }}>{label}</label>
      <input type={type} name={name} required={required} defaultValue={defaultValue}
        className="w-full bg-[#0c0c0c] border border-[#1a1a1a] text-[#f0ede8] text-sm px-3 py-2.5 focus:outline-none focus:border-[#c8a840]/50"
        style={{ fontFamily: 'var(--font-spacemono)' }} />
    </div>
  )
}
