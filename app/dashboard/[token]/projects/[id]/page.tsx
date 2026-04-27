import { notFound, redirect } from 'next/navigation'
import { validateDashboardToken } from '@/lib/auth'
import { updateProject } from '@/app/actions/projects'
import { uploadToPublic } from '@/app/actions/upload'

export default async function EditProject({ params }: { params: Promise<{ token: string; id: string }> }) {
  const { token, id } = await params
  if (!validateDashboardToken(token)) notFound()
  const base = `/dashboard/${token}`

  let project: any = null
  try {
    const prisma = (await import('@/lib/prisma')).default
    project = await prisma.project.findUnique({ where: { id } })
  } catch { /* no db */ }

  if (!project) notFound()

  const action = async (fd: FormData) => {
    'use server'
    const file = fd.get('imageFile') as File | null
    if (file && file.size > 0) {
      const url = await uploadToPublic(file)
      if (url) fd.set('imageUrl', url)
    }
    // Preserve existing image if no new one provided and no URL given
    if (!fd.get('imageUrl')) fd.set('imageUrl', project?.imageUrl ?? '')
    await updateProject(id, fd)
    redirect(`${base}/projects`)
  }

  return (
    <div className="p-8 max-w-2xl">
      {/* Header */}
      <div className="pb-5 mb-7 border-b-2 border-white/10">
        <p className="text-[#c8a840] text-[8px] tracking-[0.35em] uppercase mb-1">PROJECTS</p>
        <h1 className="text-white text-4xl uppercase" style={{ fontFamily: 'var(--font-anton)' }}>EDIT PROJECT</h1>
        <p className="text-white/30 text-[9px] mt-1 truncate">{project.title}</p>
      </div>

      <form action={action} className="flex flex-col gap-6" encType="multipart/form-data">

        <Section label="Basic Information">
          <Field label="Project Title *" name="title" defaultValue={project.title} required />
          <Field label="Short Description" name="description" type="textarea" defaultValue={project.description ?? ''} />
        </Section>

        <Section label="Project Image">
          {/* Current image preview */}
          {project.imageUrl && (
            <div className="flex items-center gap-3 p-3 border border-white/10 bg-white/3">
              <img src={project.imageUrl} alt="" className="w-16 h-10 object-cover border border-white/10" />
              <div>
                <p className="text-white/40 text-[8px] tracking-[0.15em] uppercase mb-0.5">Current image</p>
                <p className="text-white/20 text-[8px] truncate max-w-xs">{project.imageUrl}</p>
              </div>
            </div>
          )}
          <div>
            <label className="block text-white/40 text-[9px] tracking-[0.25em] uppercase mb-1.5">Replace Image</label>
            <input
              type="file"
              name="imageFile"
              accept="image/*"
              className="w-full text-white/50 text-xs file:mr-4 file:py-2 file:px-4 file:border-0 file:bg-[#c8a840] file:text-[#0c0c0c] file:text-[9px] file:tracking-[0.2em] file:uppercase file:font-bold file:cursor-pointer hover:file:bg-white transition-colors cursor-pointer"
            />
            <p className="text-white/20 text-[8px] mt-1.5 tracking-[0.1em]">OR update the URL below</p>
          </div>
          <Field label="Image URL" name="imageUrl" defaultValue={project.imageUrl ?? ''} placeholder="https://..." />
        </Section>

        <Section label="Links">
          <Field label="Live URL" name="liveUrl" defaultValue={project.liveUrl ?? ''} placeholder="https://yourproject.com" />
          <Field label="GitHub URL" name="githubUrl" defaultValue={project.githubUrl ?? ''} placeholder="https://github.com/devbysaad/..." />
        </Section>

        <Section label="Technology">
          <Field label="Tech Stack (comma-separated)" name="techStack" defaultValue={(project.techStack ?? []).join(', ')} placeholder="Next.js, TypeScript, PostgreSQL" />
        </Section>

        <Section label="Settings">
          <Field label="Display Order" name="order" type="number" defaultValue={String(project.order ?? 0)} />
          <div className="flex items-center gap-3">
            <input type="checkbox" name="featured" id="featured" defaultChecked={project.featured} className="accent-[#c8a840] w-4 h-4" />
            <label htmlFor="featured" className="text-white/60 text-[10px] tracking-[0.2em] uppercase cursor-pointer">
              Mark as featured project
            </label>
          </div>
        </Section>

        <div className="flex gap-3 pt-2 border-t border-white/10">
          <button type="submit" className="px-6 py-3 bg-[#c8a840] text-[#0c0c0c] text-[9px] tracking-[0.2em] uppercase font-bold hover:bg-white transition-colors">
            SAVE CHANGES
          </button>
          <a href={`${base}/projects`} className="px-6 py-3 border border-white/15 text-white/40 text-[9px] tracking-[0.2em] uppercase hover:text-white transition-colors">
            CANCEL
          </a>
        </div>

      </form>
    </div>
  )
}

function Section({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="border border-white/10 bg-white/2">
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
      {type === 'textarea' ? (
        <textarea name={name} rows={3} required={required} placeholder={placeholder} defaultValue={defaultValue}
          className="w-full bg-[#0a0a0a] border border-white/10 text-white text-sm px-3 py-2.5 focus:outline-none focus:border-[#c8a840]/40 resize-none placeholder-white/15 transition-colors"
          style={{ fontFamily: 'var(--font-spacemono)' }} />
      ) : (
        <input type={type} name={name} required={required} placeholder={placeholder} defaultValue={defaultValue}
          className="w-full bg-[#0a0a0a] border border-white/10 text-white text-sm px-3 py-2.5 focus:outline-none focus:border-[#c8a840]/40 placeholder-white/15 transition-colors"
          style={{ fontFamily: 'var(--font-spacemono)' }} />
      )}
    </div>
  )
}
