import { PrismaClient } from '@prisma/client'

declare global {
  // eslint-disable-next-line no-var
  var prisma: PrismaClient | undefined
}

// Detect placeholder / unconfigured DATABASE_URL so we never hang on TCP connect
const url = process.env.DATABASE_URL ?? ''
const isPlaceholder =
  !url ||
  url.includes('USER:PASSWORD') ||
  url.includes('localhost:5432') && !url.includes('@localhost') ||
  url === 'postgresql://USER:PASSWORD@HOST:5432/devbysaad'

let prisma: PrismaClient

if (isPlaceholder) {
  // Return a proxy that throws immediately instead of hanging on TCP connect
  prisma = new Proxy({} as PrismaClient, {
    get() {
      return new Proxy(
        {},
        {
          get() {
            return () => Promise.reject(new Error('DATABASE_URL is not configured'))
          },
        }
      )
    },
  })
} else if (process.env.NODE_ENV === 'production') {
  prisma = new PrismaClient()
} else {
  if (!global.prisma) global.prisma = new PrismaClient()
  prisma = global.prisma
}

export default prisma
