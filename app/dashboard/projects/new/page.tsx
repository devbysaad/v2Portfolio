import { redirect } from 'next/navigation'
import { createProject } from '@/app/actions/projects'
import { uploadToPublic } from '@/app/actions/upload'

export default function NewProject() {
  const action = async (fd: FormData) => {
    'use server'
    // Handle file upload
    const file = fd.get('imageFile') as File | null
    if (file && file.size > 0) {
      const url = await uploadToPublic(file)
      if (url) fd.set('imageUrl', url)
    }
    await createProject(fd)
    redirect('/dashboard/projects')
  }

  return (
    <div className="p-8 max-w-2xl">
      <div className="pb-5 mb-7 border-b-2 border-white/10">
        <p className="text-[#c8a840] text-[8px] tracking-[0.35em] uppercase mb-1">PROJECTS</p>
        <h1 className="text-white text-4xl uppercase" style={{ fontFamily: 'var(--font-anton)' }}>NEW PROJECT</h1>
      </div>

      {/* NOTE: no encType needed — Next.js server actions handle multipart automatically */}
      <form action={action} className="flex flex-col gap-6">
        <Section label="Basic Information">
          <Field label="Project Title *" name="title" required />
          <Field label="Short Description" name="description" type="textarea" />
        </Section>

        <Section label="Project Image">
          <div>
            <label className="block text-white/40 text-[9px] tracking-[0.25em] uppercase mb-1.5">Upload Image</label>
            <input type="file" name="imageFile" accept="image/*"
              className="w-full text-white/50 text-xs file:mr-4 file:py-2 file:px-4 file:border-0 file:bg-[#c8a840] file:text-[#0c0c0c] file:text-[9px] file:tracking-[0.2em] file:uppercase file:font-bold file:cursor-pointer hover:file:bg-white transition-colors cursor-pointer" />
            <p className="text-white/20 text-[8px] mt-1.5">Or enter a URL below instead</p>
          </div>
          <Field label="Image URL (optional)" name="imageUrl" placeholder="https://..." />
        </Section>

        <Section label="Links">
          <Field label="Live URL" name="liveUrl" placeholder="https://yourproject.com" />
          <Field label="GitHub URL" name="githubUrl" placeholder="https://github.com/devbysaad/..." />
        </Section>

        <Section label="Technology">
          <Field label="Tech Stack (comma-separated)" name="techStack" placeholder="Next.js, TypeScript, PostgreSQL" />
        </Section>

        <Section label="Settings">
          <Field label="Display Order" name="order" type="number" placeholder="0" />
          <div className="flex items-center gap-3">
            <input type="checkbox" name="featured" id="featured" className="accent-[#c8a840] w-4 h-4" />
            <label htmlFor="featured" className="text-white/60 text-[10px] tracking-[0.2em] uppercase cursor-pointer">Mark as featured</label>
          </div>
        </Section>

        <div className="flex gap-3 pt-2 border-t border-white/10">
          <button type="submit" className="px-6 py-3 bg-[#c8a840] text-[#0c0c0c] text-[9px] tracking-[0.2em] uppercase font-bold hover:bg-white transition-colors">
            CREATE PROJECT
          </button>
          <a href="/dashboard/projects" className="px-6 py-3 border border-white/15 text-white/40 text-[9px] tracking-[0.2em] uppercase hover:text-white transition-colors">CANCEL</a>
        </div>
      </form>
    </div>
  )
}

function Section({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="border border-white/10">
      <div className="px-4 py-2.5 border-b border-white/10 bg-white/3">
        <span className="text-white/40 text-[8px] tracking-[0.3em] uppercase">{label}</span>
      </div>
      <div className="p-4 flex flex-col gap-4">{children}</div>
    </div>
  )
}

function Field({ label, name, type = 'text', required = false, placeholder = '' }: {
  label: string; name: string; type?: string; required?: boolean; placeholder?: string
}) {
  return (
    <div>
      <label className="block text-white/40 text-[9px] tracking-[0.25em] uppercase mb-1.5">{label}</label>
      {type === 'textarea'
        ? <textarea name={name} rows={3} required={required} placeholder={placeholder}
            className="w-full bg-[#0a0a0a] border border-white/10 text-white text-sm px-3 py-2.5 focus:outline-none focus:border-[#c8a840]/40 resize-none placeholder-white/15"
            style={{ fontFamily: 'var(--font-spacemono)' }} />
        : <input type={type} name={name} required={required} placeholder={placeholder}
            className="w-full bg-[#0a0a0a] border border-white/10 text-white text-sm px-3 py-2.5 focus:outline-none focus:border-[#c8a840]/40 placeholder-white/15"
            style={{ fontFamily: 'var(--font-spacemono)' }} />
      }
    </div>
  )
}