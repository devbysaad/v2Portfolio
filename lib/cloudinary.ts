import { v2 as cloudinary } from 'cloudinary'
import { getOptionalEnv } from '@/lib/env'

cloudinary.config({
    cloud_name: getOptionalEnv('CLOUDINARY_CLOUD_NAME') ?? undefined,
    api_key: getOptionalEnv('CLOUDINARY_API_KEY') ?? undefined,
    api_secret: getOptionalEnv('CLOUDINARY_API_SECRET') ?? undefined,
})

function assertCloudinaryConfigured() {
    if (!cloudinary.config().cloud_name || !cloudinary.config().api_key || !cloudinary.config().api_secret) {
        throw new Error('Cloudinary is not configured. Set CLOUDINARY_CLOUD_NAME, CLOUDINARY_API_KEY, and CLOUDINARY_API_SECRET.')
    }
}

export async function uploadImage(file: File): Promise<string> {
    assertCloudinaryConfigured()

    const bytes = await file.arrayBuffer()
    const buffer = Buffer.from(bytes)

    return new Promise((resolve, reject) => {
        const stream = cloudinary.uploader.upload_stream(
            {
                folder: 'portfolio',
                resource_type: 'image',
            },
            (error, result) => {
                if (error || !result) {
                    reject(error || new Error('Upload failed'))
                } else {
                    resolve(result.secure_url)
                }
            }
        )
        stream.end(buffer)
    })
}

export default cloudinary
