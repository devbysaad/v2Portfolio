import { redirect } from 'next/navigation'
import { createSkill } from '@/app/actions/skills'

export default function NewSkill() {
  const action = async (fd: FormData) => {
    'use server'
    await createSkill(fd)
    redirect('/dashboard/skills')
  }
  return (
    <div className="p-8 max-w-xl">
      <div className="pb-5 mb-7 border-b-2 border-white/10">
        <p className="text-[#c8a840] text-[8px] tracking-[0.35em] uppercase mb-1">SKILLS</p>
        <h1 className="text-white text-4xl uppercase" style={{ fontFamily: 'var(--font-anton)' }}>NEW SKILL</h1>
      </div>
      <form action={action} className="flex flex-col gap-5">
        <Field label="Skill Name *" name="name" required />
        <div>
          <label className="block text-white/40 text-[9px] tracking-[0.25em] uppercase mb-1.5">Category *</label>
          <select name="category" required className="w-full bg-[#0a0a0a] border border-white/10 text-white text-sm px-3 py-2.5 focus:outline-none focus:border-[#c8a840]/40">
            <option value="">Select category</option>
            {['Technologies', 'Languages', 'Tools', 'Other'].map(c => <option key={c} value={c}>{c}</option>)}
          </select>
        </div>
        <Field label="Proficiency (0–100)" name="proficiency" type="number" placeholder="85" />
        <Field label="Display Order" name="order" type="number" placeholder="0" />
        <div className="flex gap-3 pt-2 border-t border-white/10">
          <button type="submit" className="px-6 py-3 bg-[#c8a840] text-[#0c0c0c] text-[9px] tracking-[0.2em] uppercase font-bold hover:bg-white transition-colors">CREATE SKILL</button>
          <a href="/dashboard/skills" className="px-6 py-3 border border-white/15 text-white/40 text-[9px] tracking-[0.2em] uppercase hover:text-white transition-colors">CANCEL</a>
        </div>
      </form>
    </div>
  )
}
function Field({ label, name, type = 'text', required = false, placeholder = '' }: { label: string; name: string; type?: string; required?: boolean; placeholder?: string }) {
  return (
    <div>
      <label className="block text-white/40 text-[9px] tracking-[0.25em] uppercase mb-1.5">{label}</label>
      <input type={type} name={name} required={required} placeholder={placeholder} className="w-full bg-[#0a0a0a] border border-white/10 text-white text-sm px-3 py-2.5 focus:outline-none focus:border-[#c8a840]/40 placeholder-white/15" style={{ fontFamily: 'var(--font-spacemono)' }} />
    </div>
  )
}
