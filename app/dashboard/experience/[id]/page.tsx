import { notFound, redirect } from 'next/navigation'
import { updateExperience, getExperienceById } from '@/app/actions/experience'

export default async function EditExperience({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const exp = await getExperienceById(id)
  if (!exp) notFound()

  const toDate = (d: Date | null) => d ? new Date(d).toISOString().slice(0, 10) : ''

  const action = async (fd: FormData) => {
    'use server'
    await updateExperience(id, fd)
    redirect('/dashboard/experience')
  }

  return (
    <div className="p-8 max-w-2xl">
      <div className="pb-5 mb-7 border-b-2 border-white/10">
        <p className="text-[#c8a840] text-[8px] tracking-[0.35em] uppercase mb-1">EXPERIENCE</p>
        <h1 className="text-white text-4xl uppercase" style={{ fontFamily: 'var(--font-anton)' }}>EDIT EXPERIENCE</h1>
        <p className="text-white/30 text-[9px] mt-1">{exp.company}</p>
      </div>
      <form action={action} className="flex flex-col gap-5">
        <Field label="Company *" name="company" defaultValue={exp.company} required />
        <Field label="Position *" name="position" defaultValue={exp.position} required />
        <div>
          <label className="block text-white/40 text-[9px] tracking-[0.25em] uppercase mb-1.5">Type</label>
          <select name="type" defaultValue={exp.type ?? 'WORK'} className="w-full bg-[#0a0a0a] border border-white/10 text-white text-sm px-3 py-2.5 focus:outline-none focus:border-[#c8a840]/40">
            {['WORK', 'EDUCATION', 'FREELANCE', 'OTHER'].map(t => <option key={t} value={t}>{t}</option>)}
          </select>
        </div>
        <Field label="Location" name="location" defaultValue={exp.location ?? ''} />
        <div className="grid grid-cols-2 gap-4">
          <Field label="Start Date *" name="startDate" type="date" defaultValue={toDate(exp.startDate)} required />
          <Field label="End Date" name="endDate" type="date" defaultValue={toDate(exp.endDate)} />
        </div>
        <div className="flex items-center gap-3">
          <input type="checkbox" name="current" id="current" defaultChecked={exp.current ?? false} className="accent-[#c8a840] w-4 h-4" />
          <label htmlFor="current" className="text-white/60 text-[10px] tracking-[0.2em] uppercase cursor-pointer">Currently working here</label>
        </div>
        <Field label="Description" name="description" type="textarea" defaultValue={exp.description ?? ''} />
        <Field label="Display Order" name="order" type="number" defaultValue={String(exp.order ?? 0)} />
        <div className="flex gap-3 pt-2 border-t border-white/10">
          <button type="submit" className="px-6 py-3 bg-[#c8a840] text-[#0c0c0c] text-[9px] tracking-[0.2em] uppercase font-bold hover:bg-white transition-colors">SAVE CHANGES</button>
          <a href="/dashboard/experience" className="px-6 py-3 border border-white/15 text-white/40 text-[9px] tracking-[0.2em] uppercase hover:text-white transition-colors">CANCEL</a>
        </div>
      </form>
    </div>
  )
}

function Field({ label, name, type = 'text', required = false, defaultValue = '', placeholder = '' }: {
  label: string; name: string; type?: string; required?: boolean; defaultValue?: string; placeholder?: string
}) {
  return (
    <div>
      <label className="block text-white/40 text-[9px] tracking-[0.25em] uppercase mb-1.5">{label}</label>
      {type === 'textarea'
        ? <textarea name={name} rows={4} required={required} defaultValue={defaultValue} className="w-full bg-[#0a0a0a] border border-white/10 text-white text-sm px-3 py-2.5 focus:outline-none focus:border-[#c8a840]/40 resize-none placeholder-white/15" style={{ fontFamily: 'var(--font-spacemono)' }} />
        : <input type={type} name={name} required={required} defaultValue={defaultValue} placeholder={placeholder} className="w-full bg-[#0a0a0a] border border-white/10 text-white text-sm px-3 py-2.5 focus:outline-none focus:border-[#c8a840]/40 placeholder-white/15" style={{ fontFamily: 'var(--font-spacemono)' }} />
      }
    </div>
  )
}
