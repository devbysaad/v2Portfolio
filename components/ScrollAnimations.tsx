'use client'

import { useEffect } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger)
}

export default function ScrollAnimations() {
  useEffect(() => {
    const ctx = gsap.context(() => {

      // Section headings
      gsap.utils.toArray<HTMLElement>('.gsap-section-heading').forEach(el => {
        gsap.fromTo(el,
          { y: 40, opacity: 0 },
          {
            y: 0, opacity: 1, duration: 0.6, ease: 'power3.out',
            scrollTrigger: { trigger: el, start: 'top 88%', toggleActions: 'play none none none' },
          }
        )
      })

      // Cards stagger
      gsap.utils.toArray<HTMLElement>('.gsap-card').forEach((el, i) => {
        gsap.fromTo(el,
          { y: 25, opacity: 0 },
          {
            y: 0, opacity: Number(el.style.opacity) || 1,
            duration: 0.5, ease: 'power3.out', delay: i * 0.08,
            scrollTrigger: { trigger: el, start: 'top 90%', toggleActions: 'play none none none' },
          }
        )
      })

    })

    return () => ctx.revert()
  }, [])

  return null
}
