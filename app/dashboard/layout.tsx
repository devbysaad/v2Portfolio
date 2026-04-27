import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'
import Link from 'next/link'
import { LayoutDashboard, Briefcase, Zap, GraduationCap, ExternalLink } from 'lucide-react'
import PageTransition from '@/components/PageTransition'

const NAV = [
  { label: 'Overview',   href: '/dashboard',            icon: LayoutDashboard },
  { label: 'Projects',   href: '/dashboard/projects',   icon: Briefcase },
  { label: 'Skills',     href: '/dashboard/skills',     icon: Zap },
  { label: 'Experience', href: '/dashboard/experience', icon: GraduationCap },
]

export default async function DashboardLayout({ children }: { children: React.ReactNode }) {
  // Cookie-based auth — no token in URL
  const cookieStore = await cookies()
  const auth = cookieStore.get('dashboard-auth')
  if (!auth || auth.value !== 'verified') {
    redirect('/admin-login')
  }

  return (
    <div className="min-h-screen bg-[#080808] flex" style={{ fontFamily: 'var(--font-spacemono, monospace)' }}>
      <PageTransition />

      {/* Sidebar */}
      <aside className="w-56 flex-shrink-0 flex flex-col border-r-2 border-white/10">

        {/* Brand — click to go back to portfolio */}
        <Link href="/" className="block px-5 py-5 border-b-2 border-white/10 hover:bg-white/3 transition-colors group">
          <p className="text-[#c8a840] text-[8px] tracking-[0.4em] uppercase mb-0.5 group-hover:text-white/60 transition-colors">ADMIN PORTAL</p>
          <p className="text-white text-base group-hover:text-[#c8a840] transition-colors" style={{ fontFamily: 'var(--font-anton, sans-serif)' }}>devbysaad</p>
        </Link>

        {/* Nav */}
        <nav className="flex-1 py-3">
          {NAV.map(({ label, href, icon: Icon }) => (
            <Link
              key={label}
              href={href}
              className="flex items-center gap-3 px-5 py-3 text-white/40 hover:text-white hover:bg-white/5 border-b border-white/5 transition-colors text-[9px] tracking-[0.2em] uppercase group last:border-b-0"
            >
              <Icon className="w-3.5 h-3.5 flex-shrink-0 group-hover:text-[#c8a840] transition-colors" />
              {label}
            </Link>
          ))}
        </nav>

        {/* Bottom */}
        <div className="border-t-2 border-white/10">
          <Link
            href="/"
            target="_blank"
            className="flex items-center gap-2 px-5 py-3 text-white/20 hover:text-white/60 transition-colors text-[8px] tracking-[0.2em] uppercase border-b border-white/5"
          >
            <ExternalLink className="w-3 h-3" />
            View Portfolio
          </Link>
          {/* Logout */}
          <form action={async () => {
            'use server'
            const c = await cookies()
            c.delete('dashboard-auth')
            redirect('/admin-login')
          }}>
            <button
              type="submit"
              className="w-full flex items-center gap-2 px-5 py-3 text-white/15 hover:text-red-400 transition-colors text-[8px] tracking-[0.2em] uppercase text-left"
            >
              ← LOGOUT
            </button>
          </form>
        </div>
      </aside>

      {/* Main */}
      <main className="flex-1 overflow-auto">
        {children}
      </main>
    </div>
  )
}
