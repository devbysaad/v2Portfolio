'use server'

import { revalidatePath } from 'next/cache'
import {
  localGetSkills, localCreateSkill, localUpdateSkill, localDeleteSkill,
} from '@/lib/local-storage'

const DB_URL = process.env.DATABASE_URL ?? ''
const HAS_DB = DB_URL.length > 0 && !DB_URL.includes('USER:PASSWORD') && !DB_URL.includes('YOUR-PASSWORD') && !DB_URL.includes('HOST')

async function db() {
  if (!HAS_DB) throw new Error('no-db')
  const { default: prisma } = await import('@/lib/prisma')
  return prisma
}

export async function getSkills(): Promise<any[]> {
  try { const p = await db(); return await p.skill.findMany({ orderBy: [{ category: 'asc' }, { order: 'asc' }] }) }
  catch { return localGetSkills() }
}

export async function createSkill(formData: FormData) {
  const data = {
    name: formData.get('name') as string,
    category: formData.get('category') as string,
    proficiency: parseInt(formData.get('proficiency') as string) || 80,
    order: parseInt(formData.get('order') as string) || 0,
  }
  try { const p = await db(); await p.skill.create({ data }) }
  catch { await localCreateSkill(data) }
  revalidatePath('/'); revalidatePath('/skills'); revalidatePath('/dashboard/skills')
  return { success: true }
}

export async function updateSkill(id: string, formData: FormData) {
  const data = {
    name: formData.get('name') as string,
    category: formData.get('category') as string,
    proficiency: parseInt(formData.get('proficiency') as string) || 80,
    order: parseInt(formData.get('order') as string) || 0,
  }
  try { const p = await db(); await p.skill.update({ where: { id }, data }) }
  catch { await localUpdateSkill(id, data) }
  revalidatePath('/'); revalidatePath('/skills'); revalidatePath('/dashboard/skills')
  return { success: true }
}

export async function deleteSkill(id: string) {
  try { const p = await db(); await p.skill.delete({ where: { id } }) }
  catch { await localDeleteSkill(id) }
  revalidatePath('/'); revalidatePath('/skills'); revalidatePath('/dashboard/skills')
  return { success: true }
}
