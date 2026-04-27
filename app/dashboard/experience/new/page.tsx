import { redirect } from 'next/navigation'
import { createExperience } from '@/app/actions/experience'

export default function NewExperience() {
  const action = async (fd: FormData) => {
    'use server'
    await createExperience(fd)
    redirect('/dashboard/experience')
  }

  return (
    <div className="p-8 max-w-2xl">
      <div className="pb-5 mb-7 border-b-2 border-white/10">
        <p className="text-[#c8a840] text-[8px] tracking-[0.35em] uppercase mb-1">EXPERIENCE</p>
        <h1 className="text-white text-4xl uppercase" style={{ fontFamily: 'var(--font-anton)' }}>NEW EXPERIENCE</h1>
      </div>

      <form action={action} className="flex flex-col gap-5">

        <Field label="Company / Organisation *" name="company" required />
        <Field label="Position / Role *" name="position" required />

        <div>
          <label className="block text-white/40 text-[9px] tracking-[0.25em] uppercase mb-1.5">Type</label>
          <select name="type" className="w-full bg-[#0a0a0a] border border-white/10 text-white text-sm px-3 py-2.5 focus:outline-none focus:border-[#c8a840]/40">
            {['WORK', 'EDUCATION', 'FREELANCE', 'OTHER'].map(t => (
              <option key={t} value={t}>{t}</option>
            ))}
          </select>
        </div>

        <Field label="Location" name="location" placeholder="Remote / City, Country" />

        <div className="grid grid-cols-2 gap-4">
          <Field label="Start Date *" name="startDate" type="date" required />
          <Field label="End Date (leave blank if current)" name="endDate" type="date" />
        </div>

        <div className="flex items-center gap-3">
          <input type="checkbox" name="current" id="current" className="accent-[#c8a840] w-4 h-4" />
          <label htmlFor="current" className="text-white/60 text-[10px] tracking-[0.2em] uppercase cursor-pointer">
            Currently working here
          </label>
        </div>

        <div>
          <label className="block text-white/40 text-[9px] tracking-[0.25em] uppercase mb-1.5">Description</label>
          <textarea name="description" rows={4}
            placeholder="• Reduced load times by 40%&#10;• Built REST APIs for 10k+ users"
            className="w-full bg-[#0a0a0a] border border-white/10 text-white text-sm px-3 py-2.5 focus:outline-none focus:border-[#c8a840]/40 resize-none placeholder-white/15"
            style={{ fontFamily: 'var(--font-spacemono)' }} />
        </div>

        <Field label="Display Order" name="order" type="number" placeholder="0" />

        <div className="flex gap-3 pt-2 border-t border-white/10">
          <button type="submit"
            className="px-6 py-3 bg-[#c8a840] text-[#0c0c0c] text-[9px] tracking-[0.2em] uppercase font-bold hover:bg-white transition-colors">
            CREATE EXPERIENCE
          </button>
          <a href="/dashboard/experience"
            className="px-6 py-3 border border-white/15 text-white/40 text-[9px] tracking-[0.2em] uppercase hover:text-white transition-colors">
            CANCEL
          </a>
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
      <label className="block text-white/40 text-[9px] tracking-[0.25em] uppercase mb-1.5">{label}</label>
      <input
        type={type} name={name} required={required} placeholder={placeholder}
        className="w-full bg-[#0a0a0a] border border-white/10 text-white text-sm px-3 py-2.5 focus:outline-none focus:border-[#c8a840]/40 placeholder-white/15"
        style={{ fontFamily: 'var(--font-spacemono)' }}
      />
    </div>
  )
}
