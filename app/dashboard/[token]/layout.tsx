import { redirect, notFound } from 'next/navigation'
import Link from 'next/link'
import { validateDashboardToken } from '@/lib/auth'
import { LayoutDashboard, Briefcase, Zap, GraduationCap, ExternalLink } from 'lucide-react'
import PageTransition from '@/components/PageTransition'

const NAV = [
  { label: 'Overview',   href: '',             icon: LayoutDashboard },
  { label: 'Projects',   href: '/projects',    icon: Briefcase },
  { label: 'Skills',     href: '/skills',      icon: Zap },
  { label: 'Experience', href: '/experience',  icon: GraduationCap },
]

export default async function DashboardLayout({
  children,
  params,
}: {
  children: React.ReactNode
  params: Promise<{ token: string }>
}) {
  const { token } = await params
  if (!validateDashboardToken(token)) notFound()

  const base = `/dashboard/${token}`

  return (
    <div className="min-h-screen bg-[#080808] flex" style={{ fontFamily: 'var(--font-spacemono, monospace)' }}>

      {/* UFO page transition inside dashboard too */}
      <PageTransition />

      {/* Sidebar */}
      <aside className="w-56 flex-shrink-0 flex flex-col border-r-2 border-white/10">

        {/* Brand */}
        <div className="px-5 py-5 border-b-2 border-white/10">
          <p className="text-[#c8a840] text-[8px] tracking-[0.4em] uppercase mb-0.5">ADMIN PORTAL</p>
          <p className="text-white text-base" style={{ fontFamily: 'var(--font-anton, sans-serif)' }}>devbysaad</p>
        </div>

        {/* Nav */}
        <nav className="flex-1 py-3">
          {NAV.map(({ label, href, icon: Icon }) => (
            <Link
              key={label}
              href={`${base}${href}`}
              className="flex items-center gap-3 px-5 py-3 text-white/40 hover:text-white hover:bg-white/5 border-b border-white/5 transition-colors text-[9px] tracking-[0.2em] uppercase group last:border-b-0"
            >
              <Icon className="w-3.5 h-3.5 flex-shrink-0 group-hover:text-[#c8a840] transition-colors" />
              {label}
            </Link>
          ))}
        </nav>

        {/* View Portfolio link */}
        <div className="border-t-2 border-white/10 px-5 py-4">
          <Link
            href="/"
            target="_blank"
            className="flex items-center gap-2 text-white/20 hover:text-white/60 transition-colors text-[8px] tracking-[0.2em] uppercase"
          >
            <ExternalLink className="w-3 h-3" />
            View Portfolio
          </Link>
        </div>
      </aside>

      {/* Main content */}
      <main className="flex-1 overflow-auto">
        {children}
      </main>

    </div>
  )
}
