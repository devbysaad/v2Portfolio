import type { Experience } from '@prisma/client'
import Link from 'next/link'

interface Props { experiences: Experience[] }

const ROW_CONFIG = [
  { maxW: '100%', opacity: 1.0 },
  { maxW: '80%',  opacity: 0.65 },
  { maxW: '60%',  opacity: 0.38 },
]

function fmt(d: Date | null, current: boolean) {
  if (current) return 'PRESENT'
  if (!d) return '—'
  return new Date(d).toLocaleDateString('en-US', { month: 'short', year: 'numeric' }).toUpperCase()
}

function EmptyState() {
  return (
    <div className="py-16 text-center">
      <p className="text-[#f0ede8]/20 text-xs tracking-[0.25em] uppercase" style={{ fontFamily: 'var(--font-spacemono)' }}>
        No experience entries yet — add them from the dashboard
      </p>
    </div>
  )
}

export default function ExperienceSection({ experiences }: Props) {
  const display = experiences.slice(0, 3)

  return (
    <section className="relative py-14 lg:py-20 bg-[#111111] overflow-hidden" id="experience">
      <div className="max-w-[1300px] mx-auto px-6 lg:px-12">

        {/* Header — right aligned to contrast Projects */}
        <div className="text-right mb-8">
          <span className="text-[#c8a840] text-[9px] tracking-[0.3em] uppercase block mb-2" style={{ fontFamily: 'var(--font-spacemono)' }}>NO. 002</span>
          <h2 className="text-[#f0ede8] text-4xl md:text-6xl lg:text-7xl uppercase leading-none gsap-section-heading" style={{ fontFamily: 'var(--font-anton)' }}>EXPERIENCE</h2>
        </div>

        {display.length === 0 ? <EmptyState /> : (
          <div className="flex flex-col gap-4">
            {display.map((exp, i) => {
              const rc = ROW_CONFIG[i] ?? ROW_CONFIG[ROW_CONFIG.length - 1]
              const bullets = (exp.description ?? '')
                .split('\n')
                .filter(l => l.trim().startsWith('•'))
                .map(l => l.replace('•', '').trim())

              return (
                <div
                  key={exp.id}
                  className="mx-auto w-full gsap-card"
                  style={{ maxWidth: rc.maxW, opacity: rc.opacity }}
                >
                  <div className="border-t-2 border-[#f0f0f0]/15 hover:border-[#c8a840]/40 transition-colors pt-4 group">
                    <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-2 mb-3">

                      <div className="flex-1 min-w-0">
                        <h3
                          className="text-[#f0ede8] leading-tight truncate group-hover:text-[#c8a840] transition-colors"
                          style={{ fontFamily: 'var(--font-anton)', fontSize: 'clamp(1rem, 2.5vw, 1.5rem)' }}
                        >{exp.company}</h3>
                        <p className="text-[#f0ede8]/50 text-sm italic" style={{ fontFamily: 'var(--font-baskerville)' }}>
                          {exp.position}
                        </p>
                      </div>

                      <div className="flex-shrink-0 text-right">
                        <span className="text-[#c8a840] text-[9px] tracking-[0.2em] block" style={{ fontFamily: 'var(--font-spacemono)' }}>
                          {fmt(exp.startDate, false)} — {fmt(exp.endDate, exp.current ?? false)}
                        </span>
                        {exp.location && (
                          <span className="text-[#f0ede8]/20 text-[8px] tracking-[0.15em]" style={{ fontFamily: 'var(--font-spacemono)' }}>
                            {exp.location}
                          </span>
                        )}
                      </div>
                    </div>

                    {bullets.length > 0 && (
                      <div className="flex flex-wrap gap-x-6 gap-y-1 mb-2">
                        {bullets.slice(0, i === 0 ? 3 : 2).map((b, bi) => (
                          <p key={bi} className="text-[#f0ede8]/40 text-xs flex gap-2 items-start" style={{ fontFamily: 'var(--font-baskerville)' }}>
                            <span className="text-[#c8a840] flex-shrink-0">—</span>
                            <span>{b}</span>
                          </p>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              )
            })}
          </div>
        )}

        <div className="mt-10 flex justify-center">
          <Link
            href="/contact"
            className="relative px-10 py-3 border border-[#f0f0f0]/30 text-[#f0ede8] text-[10px] tracking-[0.3em] uppercase overflow-hidden group hover:text-[#0c0c0c] transition-colors duration-200"
            style={{ fontFamily: 'var(--font-spacemono)' }}
          >
            <span className="absolute inset-0 bg-[#f0f0f0] translate-x-[-101%] group-hover:translate-x-0 transition-transform duration-300" />
            <span className="relative">GET IN TOUCH →</span>
          </Link>
        </div>
      </div>
    </section>
  )
}
