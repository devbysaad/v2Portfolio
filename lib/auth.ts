import { cookies } from 'next/headers'

// ── Token-based dashboard auth ─────────────────────────────────────────────
export function validateDashboardToken(token: string): boolean {
  const expected = process.env.DASHBOARD_TOKEN
  if (!expected || !token) return false
  if (token.length !== expected.length) return false
  let diff = 0
  for (let i = 0; i < token.length; i++) {
    diff |= token.charCodeAt(i) ^ expected.charCodeAt(i)
  }
  return diff === 0
}

// ── Cookie-based dashboard session check ──────────────────────────────────
export async function isDashboardAuthenticated(): Promise<boolean> {
  try {
    const cookieStore = await cookies()
    const auth = cookieStore.get('dashboard-auth')
    return auth?.value === 'verified'
  } catch {
    return false
  }
}

// ── Legacy session (no longer used — keeping for compat) ──────────────────
export async function getSession() {
  return null
}

export async function requireAuth() {
  const authed = await isDashboardAuthenticated()
  if (!authed) throw new Error('Unauthorized')
  return { role: 'admin' }
}
