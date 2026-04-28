'use server'

import { revalidatePath } from 'next/cache'
import {
  localGetProjects, localCreateProject, localUpdateProject,
  localDeleteProject, localGetProjectById,
} from '@/lib/local-storage'

// ── DB guard: throws immediately if DB not configured ─────────────────────────
const DB_URL = process.env.DATABASE_URL ?? ''
const HAS_DB = DB_URL.length > 0 &&
  !DB_URL.includes('USER:PASSWORD') &&
  !DB_URL.includes('your-') &&
  !DB_URL.includes('YOUR-PASSWORD') &&
  !DB_URL.includes('HOST')

async function db() {
  if (!HAS_DB) throw new Error('no-db')
  const { default: prisma } = await import('@/lib/prisma')
  return prisma
}

function parseTech(val: FormData['get']) {
  return String(val ?? '').split(',').map(s => s.trim()).filter(Boolean)
}

// ── Read ──────────────────────────────────────────────────────────────────────
export async function getProjects(): Promise<any[]> {
  try {
    const prisma = await db()
    return await prisma.project.findMany({ orderBy: { order: 'asc' } })
  } catch {
    return localGetProjects()
  }
}

export async function getProjectById(id: string): Promise<any | null> {
  try {
    const prisma = await db()
    return await prisma.project.findUnique({ where: { id } })
  } catch {
    return localGetProjectById(id)
  }
}

// ── Write ─────────────────────────────────────────────────────────────────────
export async function createProject(formData: FormData) {
  const data = {
    title:       formData.get('title') as string,
    description: formData.get('description') as string || null,
    techStack:   parseTech(formData.get('techStack')),
    githubUrl:   formData.get('githubUrl') as string || null,
    liveUrl:     formData.get('liveUrl') as string || null,
    imageUrl:    formData.get('imageUrl') as string || null,
    featured:    formData.get('featured') === 'on',
    order:       parseInt(formData.get('order') as string) || 0,
  }
  try {
    const prisma = await db()
    await prisma.project.create({ data })
  } catch {
    await localCreateProject(data)
  }
  revalidatePath('/'); revalidatePath('/projects'); revalidatePath('/dashboard/projects')
  return { success: true }
}

export async function updateProject(id: string, formData: FormData) {
  const data = {
    title:       formData.get('title') as string,
    description: formData.get('description') as string || null,
    techStack:   parseTech(formData.get('techStack')),
    githubUrl:   formData.get('githubUrl') as string || null,
    liveUrl:     formData.get('liveUrl') as string || null,
    imageUrl:    formData.get('imageUrl') as string || null,
    featured:    formData.get('featured') === 'on',
    order:       parseInt(formData.get('order') as string) || 0,
  }
  try {
    const prisma = await db()
    await prisma.project.update({ where: { id }, data })
  } catch {
    await localUpdateProject(id, data)
  }
  revalidatePath('/'); revalidatePath('/projects'); revalidatePath('/dashboard/projects')
  return { success: true }
}

export async function deleteProject(id: string) {
  try {
    const prisma = await db()
    await prisma.project.delete({ where: { id } })
  } catch {
    await localDeleteProject(id)
  }
  revalidatePath('/'); revalidatePath('/projects'); revalidatePath('/dashboard/projects')
  return { success: true }
}
