import { notFound, redirect } from 'next/navigation'
import { validateDashboardToken } from '@/lib/auth'
import { createExperience } from '@/app/actions/experience'

export default async function NewExperience({ params }: { params: Promise<{ token: string }> }) {
  const { token } = await params
  if (!validateDashboardToken(token)) notFound()
  const base = `/dashboard/${token}`

  const action = async (fd: FormData) => {
    'use server'
    await createExperience(fd)
    redirect(`${base}/experience`)
  }

  return (
    <div className="p-8 max-w-2xl">
      <h1 className="text-[#f0ede8] text-3xl uppercase mb-8" style={{ fontFamily: 'var(--font-anton)' }}>NEW EXPERIENCE</h1>
      <form action={action} className="flex flex-col gap-5">
        <Field label="Company / Organisation *" name="company" required />
        <Field label="Position / Role *" name="position" required />
        <div>
          <label className="block text-[#f0ede8]/40 text-[9px] tracking-[0.25em] uppercase mb-1.5" style={{ fontFamily: 'var(--font-spacemono)' }}>Type</label>
          <select name="type" className="w-full bg-[#0c0c0c] border border-[#1a1a1a] text-[#f0ede8] text-sm px-3 py-2.5 focus:outline-none focus:border-[#c8a840]/50" style={{ fontFamily: 'var(--font-spacemono)' }}>
            {['WORK', 'EDUCATION', 'FREELANCE', 'OTHER'].map(t => <option key={t} value={t}>{t}</option>)}
          </select>
        </div>
        <Field label="Location" name="location" placeholder="Remote / City, Country" />
        <div className="grid grid-cols-2 gap-4">
          <Field label="Start Date *" name="startDate" type="date" required />
          <Field label="End Date (leave blank if current)" name="endDate" type="date" />
        </div>
        <div className="flex items-center gap-3">
          <input type="checkbox" name="current" id="current" className="accent-[#c8a840]" />
          <label htmlFor="current" className="text-[#f0ede8]/60 text-[10px] tracking-[0.2em] uppercase">Currently working here</label>
        </div>
        <Field label="Description (use • for bullet points)" name="description" type="textarea" placeholder="• Reduced load times by 40%&#10;• Built REST APIs" />
        <Field label="Display Order" name="order" type="number" placeholder="0" />
        <div className="flex gap-3 pt-2">
          <button type="submit" className="px-6 py-2.5 bg-[#c8a840] text-[#0c0c0c] text-[9px] tracking-[0.2em] uppercase font-bold hover:bg-[#f0ede8] transition-colors">CREATE EXPERIENCE</button>
          <a href={`${base}/experience`} className="px-6 py-2.5 border border-[#1a1a1a] text-[#f0ede8]/40 text-[9px] tracking-[0.2em] uppercase hover:text-[#f0ede8] transition-colors">CANCEL</a>
        </div>
      </form>
    </div>
  )
}

function Field({ label, name, type = 'text', required = false, placeholder = '' }: {
  label: string; name: string; type?: string; required?: boolean; placeholder?: string
}) {
  return (
    <div>
      <label className="block text-[#f0ede8]/40 text-[9px] tracking-[0.25em] uppercase mb-1.5" style={{ fontFamily: 'var(--font-spacemono)' }}>{label}</label>
      {type === 'textarea' ? (
        <textarea name={name} rows={5} required={required} placeholder={placeholder}
          className="w-full bg-[#0c0c0c] border border-[#1a1a1a] text-[#f0ede8] text-sm px-3 py-2.5 focus:outline-none focus:border-[#c8a840]/50 resize-none"
          style={{ fontFamily: 'var(--font-spacemono)' }} />
      ) : (
        <input type={type} name={name} required={required} placeholder={placeholder}
          className="w-full bg-[#0c0c0c] border border-[#1a1a1a] text-[#f0ede8] text-sm px-3 py-2.5 focus:outline-none focus:border-[#c8a840]/50"
          style={{ fontFamily: 'var(--font-spacemono)' }} />
      )}
    </div>
  )
}
