import { notFound, redirect } from 'next/navigation'
import { validateDashboardToken } from '@/lib/auth'
import { updateExperience } from '@/app/actions/experience'

function toDateInput(d: Date | null) {
  if (!d) return ''
  return new Date(d).toISOString().slice(0, 10)
}

export default async function EditExperience({ params }: { params: Promise<{ token: string; id: string }> }) {
  const { token, id } = await params
  if (!validateDashboardToken(token)) notFound()
  const base = `/dashboard/${token}`

  let exp: any = null
  try {
    const prisma = (await import('@/lib/prisma')).default
    exp = await prisma.experience.findUnique({ where: { id } })
  } catch { /* no db */ }

  if (!exp) notFound()

  const action = async (fd: FormData) => {
    'use server'
    await updateExperience(id, fd)
    redirect(`${base}/experience`)
  }

  return (
    <div className="p-8 max-w-2xl">
      <h1 className="text-[#f0ede8] text-3xl uppercase mb-8" style={{ fontFamily: 'var(--font-anton)' }}>EDIT EXPERIENCE</h1>
      <form action={action} className="flex flex-col gap-5">
        <Field label="Company / Organisation *" name="company" defaultValue={exp.company} required />
        <Field label="Position / Role *" name="position" defaultValue={exp.position} required />
        <div>
          <label className="block text-[#f0ede8]/40 text-[9px] tracking-[0.25em] uppercase mb-1.5" style={{ fontFamily: 'var(--font-spacemono)' }}>Type</label>
          <select name="type" defaultValue={exp.type ?? 'WORK'}
            className="w-full bg-[#0c0c0c] border border-[#1a1a1a] text-[#f0ede8] text-sm px-3 py-2.5 focus:outline-none focus:border-[#c8a840]/50"
            style={{ fontFamily: 'var(--font-spacemono)' }}>
            {['WORK', 'EDUCATION', 'FREELANCE', 'OTHER'].map(t => <option key={t} value={t}>{t}</option>)}
          </select>
        </div>
        <Field label="Location" name="location" defaultValue={exp.location ?? ''} />
        <div className="grid grid-cols-2 gap-4">
          <Field label="Start Date *" name="startDate" type="date" defaultValue={toDateInput(exp.startDate)} required />
          <Field label="End Date" name="endDate" type="date" defaultValue={toDateInput(exp.endDate)} />
        </div>
        <div className="flex items-center gap-3">
          <input type="checkbox" name="current" id="current" defaultChecked={exp.current ?? false} className="accent-[#c8a840]" />
          <label htmlFor="current" className="text-[#f0ede8]/60 text-[10px] tracking-[0.2em] uppercase">Currently working here</label>
        </div>
        <Field label="Description" name="description" type="textarea" defaultValue={exp.description ?? ''} />
        <Field label="Display Order" name="order" type="number" defaultValue={String(exp.order ?? 0)} />
        <div className="flex gap-3 pt-2">
          <button type="submit" className="px-6 py-2.5 bg-[#c8a840] text-[#0c0c0c] text-[9px] tracking-[0.2em] uppercase font-bold hover:bg-[#f0ede8] transition-colors">SAVE CHANGES</button>
          <a href={`${base}/experience`} className="px-6 py-2.5 border border-[#1a1a1a] text-[#f0ede8]/40 text-[9px] tracking-[0.2em] uppercase hover:text-[#f0ede8] transition-colors">CANCEL</a>
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
      {type === 'textarea' ? (
        <textarea name={name} rows={5} required={required} defaultValue={defaultValue}
          className="w-full bg-[#0c0c0c] border border-[#1a1a1a] text-[#f0ede8] text-sm px-3 py-2.5 focus:outline-none focus:border-[#c8a840]/50 resize-none"
          style={{ fontFamily: 'var(--font-spacemono)' }} />
      ) : (
        <input type={type} name={name} required={required} defaultValue={defaultValue}
          className="w-full bg-[#0c0c0c] border border-[#1a1a1a] text-[#f0ede8] text-sm px-3 py-2.5 focus:outline-none focus:border-[#c8a840]/50"
          style={{ fontFamily: 'var(--font-spacemono)' }} />
      )}
    </div>
  )
}
