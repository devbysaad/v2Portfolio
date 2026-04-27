import { redirect } from 'next/navigation'
import { cookies } from 'next/headers'
import { validateDashboardToken } from '@/lib/auth'

export const dynamic = 'force-dynamic'

export default function AdminLoginPage({ searchParams }: { searchParams: { error?: string } }) {
  async function handleLogin(formData: FormData) {
    'use server'
    const password = (formData.get('password') as string ?? '').trim()

    if (validateDashboardToken(password)) {
      // Set a secure session cookie — no token in the URL
      const cookieStore = await cookies()
      cookieStore.set('dashboard-auth', 'verified', {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        maxAge: 60 * 60 * 24 * 7, // 7 days
        path: '/',
        sameSite: 'strict',
      })
      redirect('/dashboard')
    }

    redirect('/admin-login?error=1')
  }

  const hasError = searchParams?.error === '1'

  return (
    <div
      className="min-h-screen flex items-center justify-center bg-[#0c0c0c] px-4"
      style={{ fontFamily: 'var(--font-spacemono, monospace)' }}
    >
      <div className="w-full max-w-sm">

        {/* Header */}
        <div className="text-center mb-10">
          <svg width="56" height="40" viewBox="0 0 160 112" fill="none" xmlns="http://www.w3.org/2000/svg" className="mx-auto mb-6">
            <ellipse cx="80" cy="38" rx="24" ry="15" fill="#f0ede8" opacity="0.9" />
            <ellipse cx="80" cy="38" rx="15" ry="9" fill="#0c0c0c" stroke="#c8a840" strokeWidth="1.5" />
            <circle cx="77" cy="37" r="3.5" fill="#c8a840" />
            <ellipse cx="80" cy="54" rx="62" ry="15" fill="#f0ede8" />
            <circle cx="46" cy="55" r="4.5" fill="#c8a840" />
            <circle cx="80" cy="57" r="4.5" fill="#c8a840" />
            <circle cx="114" cy="55" r="4.5" fill="#c8a840" />
          </svg>
          <p className="text-[#c8a840] text-[9px] tracking-[0.35em] uppercase mb-2">devbysaad</p>
          <h1 className="text-[#f0ede8] text-4xl uppercase" style={{ fontFamily: 'var(--font-anton, sans-serif)' }}>
            ADMIN PORTAL
          </h1>
          <p className="text-[#f0ede8]/30 text-[9px] tracking-[0.2em] mt-2">Enter your admin password</p>
        </div>

        {/* Error */}
        {hasError && (
          <div className="mb-5 px-4 py-3 border border-red-500/30 bg-red-500/5 text-red-400 text-[9px] tracking-[0.2em] uppercase text-center">
            Incorrect password — try again
          </div>
        )}

        {/* Form */}
        <form action={handleLogin} className="flex flex-col gap-4">
          <div>
            <label htmlFor="password" className="block text-[#f0ede8]/40 text-[9px] tracking-[0.25em] uppercase mb-2">
              Password
            </label>
            <input
              type="password"
              id="password"
              name="password"
              required
              autoComplete="current-password"
              placeholder="••••••••••••••••••"
              className="w-full bg-[#111] border border-[#1a1a1a] text-[#f0ede8] text-sm px-4 py-3 focus:outline-none focus:border-[#c8a840]/50 placeholder-[#f0ede8]/10 transition-colors tracking-widest"
              style={{ fontFamily: 'var(--font-spacemono, monospace)' }}
            />
          </div>
          <button
            type="submit"
            className="w-full py-3 bg-[#c8a840] text-[#0c0c0c] text-[10px] tracking-[0.25em] uppercase font-bold hover:bg-[#f0ede8] transition-colors mt-1"
          >
            ACCESS DASHBOARD →
          </button>
        </form>

        <div className="mt-8 text-center border-t border-[#1a1a1a] pt-6">
          <p className="text-[#f0ede8]/10 text-[8px] tracking-[0.15em]">
            Password set in <code className="text-[#c8a840]/30">.env</code> → <code className="text-[#c8a840]/30">DASHBOARD_TOKEN</code>
          </p>
        </div>
      </div>
    </div>
  )
}