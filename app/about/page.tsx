import { getExperiences } from '@/app/actions/experience'
import Link from 'next/link'
import Navigation from '@/components/Navigation'
import { ArrowLeft, ArrowRight, Mail, Linkedin, Github, MapPin, Calendar, Briefcase, GraduationCap } from 'lucide-react'

export const revalidate = 60

export default async function AboutPage() {
    const experiences = await getExperiences()
    const workExperience = experiences.filter((exp) => exp.type === 'work' || exp.type === 'Work')
    const education = experiences.filter((exp) => exp.type === 'education' || exp.type === 'Education')

    return (
    <div className="min-h-screen pt-16 selection-accent">
      <Navigation />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 lg:py-32">
        {/* HEADER */}
        <div className="animate-slide-up mb-20 lg:mb-32">
          <Link href="/" className="inline-flex items-center space-x-2 text-sm font-bold uppercase tracking-widest text-muted hover:text-accent transition-colors mb-12 py-1 border-b border-surface hover:border-accent">
            <ArrowLeft size={14} /> <span>Back home</span>
          </Link>
          <div className="text-accent font-black uppercase tracking-widest text-sm mb-4 flex items-center gap-4">
            <span className="w-8 h-px bg-accent"></span>
            Get to know me
          </div>
          <h1 className="text-6xl md:text-8xl font-black text-foreground mb-8 tracking-tighter leading-none">
            About <br /> <span className="text-accent italic font-serif font-normal">Me</span>
          </h1>
          <p className="text-xl md:text-2xl text-muted leading-relaxed max-w-2xl">
            The real story — from zero coding knowledge to shipping full-stack apps.
          </p>
        </div>

        {/* INTRO GRID */}
        <div className="grid lg:grid-cols-2 gap-px bg-surface border-2 border-surface rounded-[3rem] overflow-hidden mb-32">
          <div className="p-8 md:p-12 bg-background space-y-6">
            <p className="text-lg md:text-xl text-muted leading-relaxed">
              A few months back, I joined a dev cohort and got introduced to web development. Since then, I've been <span className="text-foreground italic">obsessed</span> with building stuff — not watching tutorials endlessly, but actually <span className="text-accent font-bold">shipping real projects</span>.
            </p>
            <p className="text-lg md:text-xl text-muted leading-relaxed">
              I'm not here to fake some 10-year experience. React on the front, Node on the back, making it all work together.
            </p>
            <p className="text-lg md:text-xl text-muted leading-relaxed">
              My approach? <span className="text-foreground font-bold">Build real stuff → break things → fix them → ship → repeat.</span>
            </p>
          </div>
          <div className="p-8 md:p-12 bg-background lg:border-l-2 border-surface flex flex-col justify-between">
            <div>
              <div className="text-accent font-black uppercase tracking-widest text-xs mb-8">Let's connect</div>
              <div className="space-y-4">
                <a href="mailto:dev.bysaad@gmail.com" className="flex items-center space-x-4 text-foreground hover:text-accent transition-colors group p-4 rounded-2xl border border-surface hover:border-accent/20 bg-surface/30">
                  <div className="p-3 rounded-xl bg-background border border-surface group-hover:border-accent/20 transition-all">
                    <Mail size={20} />
                  </div>
                  <span className="font-bold">dev.bysaad@gmail.com</span>
                </a>
                <div className="flex items-center space-x-4 text-muted p-4 rounded-2xl border border-surface bg-surface/30">
                  <div className="p-3 rounded-xl bg-background border border-surface">
                    <MapPin size={20} />
                  </div>
                  <span className="font-bold">Pakistan</span>
                </div>
              </div>
            </div>
            
            <div className="flex gap-4 mt-8">
              <a href="https://github.com/devbysaad" target="_blank" rel="noopener noreferrer" className="flex-1 flex items-center justify-center space-x-2 px-6 py-4 rounded-2xl border-2 border-surface bg-surface text-sm font-bold uppercase tracking-widest text-muted hover:text-accent hover:border-accent/30 transition-all">
                <Github size={18} /> <span>GitHub</span>
              </a>
              <a href="https://www.linkedin.com/in/muhammad-saad-972185381/" target="_blank" rel="noopener noreferrer" className="flex-1 flex items-center justify-center space-x-2 px-6 py-4 rounded-2xl border-2 border-surface bg-surface text-sm font-bold uppercase tracking-widest text-muted hover:text-accent hover:border-accent/30 transition-all">
                <Linkedin size={18} /> <span>LinkedIn</span>
              </a>
            </div>
          </div>
        </div>

        {/* EXPERIENCE SECTIONS */}
        <div className="space-y-32">
          {workExperience.length > 0 && (
            <section>
              <div className="text-accent font-black uppercase tracking-widest text-sm mb-4 flex items-center gap-4">
                <span className="w-8 h-px bg-accent"></span>
                Career
              </div>
              <h2 className="text-5xl md:text-7xl font-black text-foreground mb-16 tracking-tighter">Work <span className="text-accent italic font-serif font-normal">Experience</span></h2>
              <div className="grid gap-px bg-surface border-2 border-surface rounded-[3rem] overflow-hidden">
                {workExperience.map((exp) => (
                  <div key={exp.id} className="p-8 md:p-12 bg-background hover:bg-surface/20 transition-all group relative">
                    <div className="flex flex-col md:flex-row justify-between md:items-center gap-8 relative z-10">
                      <div>
                        <h3 className="text-2xl font-black text-foreground group-hover:text-accent transition-colors mb-2 uppercase tracking-tight">{exp.position}</h3>
                        <div className="flex flex-wrap items-center gap-6 text-muted font-bold">
                          <span className="flex items-center"><Briefcase size={16} className="mr-2" /> {exp.company}</span>
                          {exp.location && <span className="flex items-center"><MapPin size={16} className="mr-2" /> {exp.location}</span>}
                        </div>
                      </div>
                      <div className="flex flex-col md:items-end gap-2">
                        <div className="px-4 py-2 rounded-xl bg-surface/50 border border-surface text-xs font-bold font-mono text-muted flex items-center">
                          <Calendar size={14} className="mr-2" />
                          {new Date(exp.startDate).toLocaleDateString('en-US', { month: 'short', year: 'numeric' })} — {exp.current ? 'Present' : exp.endDate ? new Date(exp.endDate).toLocaleDateString('en-US', { month: 'short', year: 'numeric' }) : 'Present'}
                        </div>
                        {exp.current && <span className="text-[10px] uppercase tracking-widest font-black text-accent bg-accent/10 px-3 py-1 rounded-full border border-accent/20 text-center">Current Role</span>}
                      </div>
                    </div>
                    {exp.description && <p className="mt-8 text-muted leading-relaxed max-w-4xl border-l-2 border-surface pl-8 group-hover:border-accent/30 transition-colors whitespace-pre-line">{exp.description}</p>}
                  </div>
                ))}
              </div>
            </section>
          )}

          {education.length > 0 && (
            <section>
              <div className="text-accent font-black uppercase tracking-widest text-sm mb-4 flex items-center gap-4">
                <span className="w-8 h-px bg-accent"></span>
                Education
              </div>
              <h2 className="text-5xl md:text-7xl font-black text-foreground mb-16 tracking-tighter italic font-serif font-normal">Education</h2>
              <div className="grid gap-px bg-surface border-2 border-surface rounded-[3rem] overflow-hidden">
                {education.map((exp) => (
                  <div key={exp.id} className="p-8 md:p-12 bg-background hover:bg-surface/20 transition-all group">
                    <div className="flex flex-col md:flex-row justify-between md:items-center gap-8">
                      <div>
                        <h3 className="text-2xl font-black text-foreground group-hover:text-accent transition-colors mb-2 uppercase tracking-tight">{exp.position}</h3>
                        <div className="flex items-center text-muted font-bold underline decoration-accent/20 underline-offset-4">
                          <GraduationCap size={18} className="mr-2" /> {exp.company}
                        </div>
                      </div>
                      <div className="px-4 py-2 rounded-xl bg-surface/50 border border-surface text-xs font-bold font-mono text-muted flex items-center">
                        <Calendar size={14} className="mr-2" />
                        {new Date(exp.startDate).toLocaleDateString('en-US', { month: 'short', year: 'numeric' })} — {exp.endDate ? new Date(exp.endDate).toLocaleDateString('en-US', { month: 'short', year: 'numeric' }) : 'Present'}
                      </div>
                    </div>
                    {exp.description && <p className="mt-8 text-muted leading-relaxed max-w-4xl border-l-2 border-surface pl-8 group-hover:border-accent/30 transition-colors">{exp.description}</p>}
                  </div>
                ))}
              </div>
            </section>
          )}
        </div>

        {/* LOOKING FOR STRIP */}
        <div className="mt-32 p-8 md:p-20 bg-surface/50 rounded-[3rem] border-2 border-surface">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <h3 className="text-4xl md:text-5xl font-black text-foreground tracking-tighter leading-tight italic font-serif font-normal">
              &ldquo;I want to work with people who <span className="text-accent underline decoration-accent/30 underline-offset-8">actually care</span> about what they build.&rdquo;
            </h3>
            <div className="space-y-6 text-lg text-muted font-medium">
              <p>I&apos;m looking for teams that value learning, shipping fast, and making cool stuff that matters.</p>
              <p>Whether it&apos;s a full-time role, freelance gig, or just collaborating on something cool — if you&apos;re building something interesting, let&apos;s talk.</p>
            </div>
          </div>
        </div>

        {/* CTA */}
        <section className="py-24 lg:py-40 text-center">
          <div className="text-accent font-black uppercase tracking-widest text-sm mb-8">Ready to connect?</div>
          <h2 className="text-5xl md:text-8xl font-black text-foreground mb-16 tracking-tighter leading-[0.9]">
            Let&apos;s build <br /> something <span className="text-accent italic font-serif font-normal">amazing</span>
          </h2>
          <div className="flex flex-wrap justify-center gap-6">
            <a href="mailto:dev.bysaad@gmail.com" className="inline-flex items-center justify-center px-10 py-5 rounded-3xl bg-accent text-background font-black text-lg hover:scale-105 transition-all shadow-xl shadow-accent/20">
              <Mail size={20} className="mr-2" /> Email me
            </a>
            <a href="https://github.com/devbysaad" target="_blank" rel="noopener noreferrer" className="inline-flex items-center justify-center px-10 py-5 rounded-3xl border-2 border-surface bg-surface text-foreground font-black text-lg hover:bg-surface/50 transition-all">
              <Github size={20} className="mr-2" /> GitHub
            </a>
          </div>
        </section>

        {/* FOOTER */}
        <footer className="pt-20 border-t border-surface">
          <div className="flex flex-col md:flex-row justify-between items-center gap-8 text-center md:text-left">
            <span className="text-xs font-bold uppercase tracking-widest text-muted opacity-50">© 2026 Muhammad Saad. Crafted with intention.</span>
            <nav className="flex gap-8">
              <a href="https://github.com/devbysaad" target="_blank" rel="noopener noreferrer" className="text-xs font-black uppercase tracking-widest text-muted hover:text-accent transition-colors">GitHub</a>
              <a href="https://www.linkedin.com/in/muhammad-saad-972185381/" target="_blank" rel="noopener noreferrer" className="text-xs font-black uppercase tracking-widest text-muted hover:text-accent transition-colors">LinkedIn</a>
              <a href="mailto:dev.bysaad@gmail.com" className="text-xs font-black uppercase tracking-widest text-muted hover:text-accent transition-colors">Email</a>
            </nav>
          </div>
        </footer>
      </div>
    </div>
  )
}