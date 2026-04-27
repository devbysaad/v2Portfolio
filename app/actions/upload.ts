'use server'

import { writeFile, mkdir } from 'fs/promises'
import { join } from 'path'
import { randomUUID } from 'crypto'

export async function uploadToPublic(file: File): Promise<string | null> {
  try {
    if (!file || file.size === 0) return null

    const ext = file.name.split('.').pop()?.toLowerCase() ?? 'jpg'
    const allowed = ['jpg', 'jpeg', 'png', 'webp', 'gif', 'avif']
    if (!allowed.includes(ext)) return null

    const filename = `${randomUUID()}.${ext}`
    const dir = join(process.cwd(), 'public', 'uploads')
    await mkdir(dir, { recursive: true })

    const bytes = await file.arrayBuffer()
    await writeFile(join(dir, filename), Buffer.from(bytes))

    return `/uploads/${filename}`
  } catch (err) {
    console.error('Upload failed:', err)
    return null
  }
}
