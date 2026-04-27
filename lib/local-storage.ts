/**
 * Local JSON file storage — fallback when DATABASE_URL is not configured.
 * Files stored at /data/*.json (gitignored).
 */
import { readFile, writeFile, mkdir } from 'fs/promises'
import { join } from 'path'
import { randomUUID } from 'crypto'

const DATA_DIR = join(process.cwd(), 'data')

async function read<T = any>(file: string): Promise<T[]> {
  try {
    const raw = await readFile(join(DATA_DIR, file), 'utf-8')
    return JSON.parse(raw) as T[]
  } catch {
    return []
  }
}

async function write(file: string, data: any[]) {
  await mkdir(DATA_DIR, { recursive: true })
  await writeFile(join(DATA_DIR, file), JSON.stringify(data, null, 2), 'utf-8')
}

// ── Projects ──────────────────────────────────────────────────────────────────
export async function localGetProjects() {
  const items = await read('projects.json')
  return items.sort((a, b) => (a.order ?? 0) - (b.order ?? 0))
}

export async function localCreateProject(data: Record<string, any>) {
  const items = await read('projects.json')
  const item = { id: randomUUID(), createdAt: new Date().toISOString(), updatedAt: new Date().toISOString(), ...data }
  items.push(item)
  await write('projects.json', items)
  return item
}

export async function localUpdateProject(id: string, data: Record<string, any>) {
  const items = await read('projects.json')
  const idx = items.findIndex(i => i.id === id)
  if (idx === -1) throw new Error('Not found')
  items[idx] = { ...items[idx], ...data, updatedAt: new Date().toISOString() }
  await write('projects.json', items)
  return items[idx]
}

export async function localDeleteProject(id: string) {
  const items = await read('projects.json')
  await write('projects.json', items.filter(i => i.id !== id))
}

export async function localGetProjectById(id: string) {
  const items = await read('projects.json')
  return items.find(i => i.id === id) ?? null
}

// ── Skills ────────────────────────────────────────────────────────────────────
export async function localGetSkills() {
  const items = await read('skills.json')
  return items.sort((a, b) => (a.category ?? '').localeCompare(b.category ?? '') || (a.order ?? 0) - (b.order ?? 0))
}

export async function localCreateSkill(data: Record<string, any>) {
  const items = await read('skills.json')
  const item = { id: randomUUID(), ...data }
  items.push(item)
  await write('skills.json', items)
  return item
}

export async function localUpdateSkill(id: string, data: Record<string, any>) {
  const items = await read('skills.json')
  const idx = items.findIndex(i => i.id === id)
  if (idx === -1) throw new Error('Not found')
  items[idx] = { ...items[idx], ...data }
  await write('skills.json', items)
  return items[idx]
}

export async function localDeleteSkill(id: string) {
  const items = await read('skills.json')
  await write('skills.json', items.filter(i => i.id !== id))
}

export async function localGetSkillById(id: string) {
  const items = await read('skills.json')
  return items.find(i => i.id === id) ?? null
}

// ── Experience ────────────────────────────────────────────────────────────────
export async function localGetExperiences() {
  const items = await read('experience.json')
  return items.sort((a, b) => (a.order ?? 0) - (b.order ?? 0))
}

export async function localCreateExperience(data: Record<string, any>) {
  const items = await read('experience.json')
  const item = { id: randomUUID(), ...data }
  items.push(item)
  await write('experience.json', items)
  return item
}

export async function localUpdateExperience(id: string, data: Record<string, any>) {
  const items = await read('experience.json')
  const idx = items.findIndex(i => i.id === id)
  if (idx === -1) throw new Error('Not found')
  items[idx] = { ...items[idx], ...data }
  await write('experience.json', items)
  return items[idx]
}

export async function localDeleteExperience(id: string) {
  const items = await read('experience.json')
  await write('experience.json', items.filter(i => i.id !== id))
}

export async function localGetExperienceById(id: string) {
  const items = await read('experience.json')
  return items.find(i => i.id === id) ?? null
}
