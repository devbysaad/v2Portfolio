import HeroSection from '@/components/HeroSection'
import ProjectsSection from '@/components/ProjectsSection'
import ExperienceSection from '@/components/ExperienceSection'
import TechSection from '@/components/TechSection'
import QuoteSection from '@/components/QuoteSection'
import ScrollAnimations from '@/components/ScrollAnimations'
import type { Project, Experience, Skill } from '@prisma/client'

import { getProjects } from '@/app/actions/projects'
import { getExperiences } from '@/app/actions/experience'
import { getSkills } from '@/app/actions/skills'

export const revalidate = 0  // always fresh when using local storage

async function fetchData() {
  const [projects, experiences, skills] = await Promise.all([
    getProjects().catch(() => []),
    getExperiences().catch(() => []),
    getSkills().catch(() => []),
  ])
  return { projects, experiences, skills }
}


export default async function HomePage() {
  const { projects, experiences, skills } = await fetchData()

  return (
    <main>
      <ScrollAnimations />
      <HeroSection />
      <ProjectsSection projects={projects} />
      <ExperienceSection experiences={experiences} />
      <TechSection skills={skills} />
      <QuoteSection />

      {/* Footer */}
      <footer className="py-20 border-t border-[#f0ede8]/08 bg-[#0c0c0c]">
        <div className="max-w-[1400px] mx-auto px-8 lg:px-16">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-10">

            <div>
              <p
                className="text-[#f0ede8] text-2xl uppercase leading-none mb-1"
                style={{ fontFamily: 'var(--font-anton, sans-serif)' }}
              >
                MUHAMMAD SAAD
              </p>
              <p
                className="text-[#c8a840] text-[10px] tracking-[0.3em] uppercase"
                style={{ fontFamily: 'var(--font-spacemono, monospace)' }}
              >
                FULL STACK ENGINEER
              </p>
            </div>

            <nav className="flex flex-wrap gap-6">
              {[
                ['Home', '/'],
                ['Projects', '/projects'],
                ['Skills', '/skills'],
                ['Contact', '/contact'],
              ].map(([label, href]) => (
                <a
                  key={label}
                  href={href}
                  className="text-[#f0ede8]/40 hover:text-[#f0ede8] transition-colors text-[11px] tracking-[0.25em] uppercase"
                  style={{ fontFamily: 'var(--font-spacemono, monospace)' }}
                >
                  {label}
                </a>
              ))}
            </nav>
          </div>

          <div className="mt-16 pt-8 border-t border-[#f0ede8]/05 flex justify-between items-center">
            <p
              className="text-[#f0ede8]/20 text-[10px] tracking-[0.2em] uppercase"
              style={{ fontFamily: 'var(--font-spacemono, monospace)' }}
            >
              © {new Date().getFullYear()} MUHAMMAD SAAD. BUILT WITH RIGOR AND CRAFT.
            </p>
            <a
              href="mailto:dev.bysaad@gmail.com"
              className="text-[#c8a840] text-[10px] tracking-[0.2em] uppercase hover:text-[#f0ede8] transition-colors"
              style={{ fontFamily: 'var(--font-spacemono, monospace)' }}
            >
              dev.bysaad@gmail.com
            </a>
          </div>
        </div>
      </footer>
    </main>
  )
}