'use server'

import { revalidatePath } from 'next/cache'
import {
  localGetExperiences, localCreateExperience, localUpdateExperience,
  localDeleteExperience, localGetExperienceById,
} from '@/lib/local-storage'

const DB_URL = process.env.DATABASE_URL ?? ''
const HAS_DB = DB_URL.length > 0 && !DB_URL.includes('USER:PASSWORD') && !DB_URL.includes('YOUR-PASSWORD') && !DB_URL.includes('HOST')

async function db() {
  if (!HAS_DB) throw new Error('no-db')
  const { default: prisma } = await import('@/lib/prisma')
  return prisma
}

function parseData(fd: FormData) {
  return {
    type:        fd.get('type') as string || 'WORK',
    company:     fd.get('company') as string,
    position:    fd.get('position') as string,
    description: fd.get('description') as string || null,
    startDate:   new Date(fd.get('startDate') as string),
    endDate:     fd.get('endDate') ? new Date(fd.get('endDate') as string) : null,
    current:     fd.get('current') === 'on',
    location:    fd.get('location') as string || null,
    order:       parseInt(fd.get('order') as string) || 0,
  }
}

export async function getExperiences(): Promise<any[]> {
  try { const p = await db(); return await p.experience.findMany({ orderBy: { order: 'asc' } }) }
  catch { return localGetExperiences() }
}

export async function createExperience(formData: FormData) {
  const data = parseData(formData)
  try { const p = await db(); await p.experience.create({ data }) }
  catch { await localCreateExperience(data) }
  revalidatePath('/'); revalidatePath('/dashboard/experience')
  return { success: true }
}

export async function updateExperience(id: string, formData: FormData) {
  const data = parseData(formData)
  try { const p = await db(); await p.experience.update({ where: { id }, data }) }
  catch { await localUpdateExperience(id, data) }
  revalidatePath('/'); revalidatePath('/dashboard/experience')
  return { success: true }
}

export async function deleteExperience(id: string) {
  try { const p = await db(); await p.experience.delete({ where: { id } }) }
  catch { await localDeleteExperience(id) }
  revalidatePath('/'); revalidatePath('/dashboard/experience')
  return { success: true }
}

export async function getExperienceById(id: string): Promise<any | null> {
  try { const p = await db(); return await p.experience.findUnique({ where: { id } }) }
  catch { return localGetExperienceById(id) }
}
