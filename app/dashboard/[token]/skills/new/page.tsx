import { notFound, redirect } from 'next/navigation'
import { validateDashboardToken } from '@/lib/auth'
import { createSkill } from '@/app/actions/skills'

export default async function NewSkill({ params }: { params: Promise<{ token: string }> }) {
  const { token } = await params
  if (!validateDashboardToken(token)) notFound()
  const base = `/dashboard/${token}`

  const action = async (fd: FormData) => {
    'use server'
    await createSkill(fd)
    redirect(`${base}/skills`)
  }

  return (
    <div className="p-8 max-w-xl">
      <h1 className="text-[#f0ede8] text-3xl uppercase mb-8" style={{ fontFamily: 'var(--font-anton)' }}>NEW SKILL</h1>
      <form action={action} className="flex flex-col gap-5">
        <Field label="Skill Name *" name="name" required />
        <div>
          <label className="block text-[#f0ede8]/40 text-[9px] tracking-[0.25em] uppercase mb-1.5" style={{ fontFamily: 'var(--font-spacemono)' }}>Category *</label>
          <select name="category" required className="w-full bg-[#0c0c0c] border border-[#1a1a1a] text-[#f0ede8] text-sm px-3 py-2.5 focus:outline-none focus:border-[#c8a840]/50" style={{ fontFamily: 'var(--font-spacemono)' }}>
            <option value="">Select category</option>
            {['Technologies', 'Languages', 'Tools', 'Other'].map(c => <option key={c} value={c}>{c}</option>)}
          </select>
        </div>
        <Field label="Proficiency (0–100)" name="proficiency" type="number" placeholder="85" />
        <Field label="Display Order" name="order" type="number" placeholder="0" />
        <div className="flex gap-3 pt-2">
          <button type="submit" className="px-6 py-2.5 bg-[#c8a840] text-[#0c0c0c] text-[9px] tracking-[0.2em] uppercase font-bold hover:bg-[#f0ede8] transition-colors">CREATE SKILL</button>
          <a href={`${base}/skills`} className="px-6 py-2.5 border border-[#1a1a1a] text-[#f0ede8]/40 text-[9px] tracking-[0.2em] uppercase hover:text-[#f0ede8] transition-colors">CANCEL</a>
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
      <input type={type} name={name} required={required} placeholder={placeholder}
        className="w-full bg-[#0c0c0c] border border-[#1a1a1a] text-[#f0ede8] text-sm px-3 py-2.5 focus:outline-none focus:border-[#c8a840]/50"
        style={{ fontFamily: 'var(--font-spacemono)' }} />
    </div>
  )
}
