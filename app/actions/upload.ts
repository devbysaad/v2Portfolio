'use server'

import { uploadImage } from '@/lib/cloudinary'

export async function uploadToPublic(file: File): Promise<string | null> {
  try {
    if (!file || file.size === 0) return null
    
    // Cloudinary upload
    const url = await uploadImage(file)
    return url
  } catch (err) {
    console.error('Cloudinary upload failed:', err)
    return null
  }
}
