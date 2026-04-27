import { notFound, redirect } from 'next/navigation'
import { updateProject, getProjectById } from '@/app/actions/projects'
import { uploadToPublic } from '@/app/actions/upload'

export default async function EditProject({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const project = await getProjectById(id)
  if (!project) notFound()

  const action = async (fd: FormData) => {
    'use server'
    const file = fd.get('imageFile') as File | null
    if (file && file.size > 0) {
      const url = await uploadToPublic(file)
      if (url) fd.set('imageUrl', url)
    }
    if (!fd.get('imageUrl')) fd.set('imageUrl', (project as any)?.imageUrl ?? '')
    await updateProject(id, fd)
    redirect('/dashboard/projects')
  }

  const p = project as any

  return (
    <div className="p-8 max-w-2xl">
      <div className="pb-5 mb-7 border-b-2 border-white/10">
        <p className="text-[#c8a840] text-[8px] tracking-[0.35em] uppercase mb-1">PROJECTS</p>
        <h1 className="text-white text-4xl uppercase" style={{ fontFamily: 'var(--font-anton)' }}>EDIT PROJECT</h1>
        <p className="text-white/30 text-[9px] mt-1 truncate">{p.title}</p>
      </div>

      <form action={action} className="flex flex-col gap-6">
        <Section label="Basic Information">
          <Field label="Project Title *" name="title" defaultValue={p.title} required />
          <Field label="Short Description" name="description" type="textarea" defaultValue={p.description ?? ''} />
        </Section>

        <Section label="Project Image">
          {p.imageUrl && (
            <div className="flex items-center gap-3 p-3 border border-white/10 bg-white/3">
              <img src={p.imageUrl} alt="" className="w-16 h-10 object-cover border border-white/10" />
              <p className="text-white/20 text-[8px] truncate max-w-xs">{p.imageUrl}</p>
            </div>
          )}
          <div>
            <label className="block text-white/40 text-[9px] tracking-[0.25em] uppercase mb-1.5">Replace Image</label>
            <input type="file" name="imageFile" accept="image/*"
              className="w-full text-white/50 text-xs file:mr-4 file:py-2 file:px-4 file:border-0 file:bg-[#c8a840] file:text-[#0c0c0c] file:text-[9px] file:tracking-[0.2em] file:uppercase file:font-bold file:cursor-pointer hover:file:bg-white transition-colors cursor-pointer" />
          </div>
          <Field label="Image URL" name="imageUrl" defaultValue={p.imageUrl ?? ''} placeholder="https://..." />
        </Section>

        <Section label="Links">
          <Field label="Live URL" name="liveUrl" defaultValue={p.liveUrl ?? ''} />
          <Field label="GitHub URL" name="githubUrl" defaultValue={p.githubUrl ?? ''} />
        </Section>

        <Section label="Technology">
          <Field label="Tech Stack (comma-separated)" name="techStack" defaultValue={(p.techStack ?? []).join(', ')} />
        </Section>

        <Section label="Settings">
          <Field label="Display Order" name="order" type="number" defaultValue={String(p.order ?? 0)} />
          <div className="flex items-center gap-3">
            <input type="checkbox" name="featured" id="featured" defaultChecked={p.featured} className="accent-[#c8a840] w-4 h-4" />
            <label htmlFor="featured" className="text-white/60 text-[10px] tracking-[0.2em] uppercase cursor-pointer">Mark as featured</label>
          </div>
        </Section>

        <div className="flex gap-3 pt-2 border-t border-white/10">
          <button type="submit" className="px-6 py-3 bg-[#c8a840] text-[#0c0c0c] text-[9px] tracking-[0.2em] uppercase font-bold hover:bg-white transition-colors">SAVE CHANGES</button>
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

function Field({ label, name, type = 'text', required = false, placeholder = '', defaultValue = '' }: {
  label: string; name: string; type?: string; required?: boolean; placeholder?: string; defaultValue?: string
}) {
  return (
    <div>
      <label className="block text-white/40 text-[9px] tracking-[0.25em] uppercase mb-1.5">{label}</label>
      {type === 'textarea'
        ? <textarea name={name} rows={3} required={required} placeholder={placeholder} defaultValue={defaultValue}
            className="w-full bg-[#0a0a0a] border border-white/10 text-white text-sm px-3 py-2.5 focus:outline-none focus:border-[#c8a840]/40 resize-none placeholder-white/15"
            style={{ fontFamily: 'var(--font-spacemono)' }} />
        : <input type={type} name={name} required={required} placeholder={placeholder} defaultValue={defaultValue}
            className="w-full bg-[#0a0a0a] border border-white/10 text-white text-sm px-3 py-2.5 focus:outline-none focus:border-[#c8a840]/40 placeholder-white/15"
            style={{ fontFamily: 'var(--font-spacemono)' }} />
      }
    </div>
  )
}
