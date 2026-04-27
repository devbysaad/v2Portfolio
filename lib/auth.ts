import { cookies } from 'next/headers'
import prisma from './prisma'

// ── Token-based dashboard auth ─────────────────────────────────────────────
export function validateDashboardToken(token: string): boolean {
  const expected = process.env.DASHBOARD_TOKEN
  if (!expected || !token) return false
  // Constant-time compare
  if (token.length !== expected.length) return false
  let diff = 0
  for (let i = 0; i < token.length; i++) {
    diff |= token.charCodeAt(i) ^ expected.charCodeAt(i)
  }
  return diff === 0
}

// ── Legacy session-based auth (kept for backward compat) ───────────────────
export async function getSession() {
  const cookieStore = await cookies()
  const sessionToken = cookieStore.get('session-token')
  if (!sessionToken) return null
  try {
    const user = await prisma.user.findFirst({
      where: { email: { contains: '@' } },
      select: { id: true, email: true, name: true, role: true },
    })
    return user
  } catch {
    return null
  }
}

export async function requireAuth() {
  const user = await getSession()
  if (!user) throw new Error('Unauthorized')
  return user
}
