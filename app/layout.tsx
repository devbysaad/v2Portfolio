import type { Metadata } from 'next'
import { Anton, Libre_Baskerville, Space_Mono } from 'next/font/google'
import './globals.css'
import LoadingScreen from '@/components/LoadingScreen'
import PageTransition from '@/components/PageTransition'

const anton = Anton({
  weight: '400',
  subsets: ['latin'],
  variable: '--font-anton',
  display: 'swap',
})

const baskerville = Libre_Baskerville({
  weight: ['400', '700'],
  style: ['normal', 'italic'],
  subsets: ['latin'],
  variable: '--font-baskerville',
  display: 'swap',
})

const spaceMono = Space_Mono({
  weight: ['400', '700'],
  subsets: ['latin'],
  variable: '--font-spacemono',
  display: 'swap',
})

export const metadata: Metadata = {
  title: 'Muhammad Saad — Full Stack Engineer',
  description:
    'Full-stack developer. Unapologetically functional, obsessively refined. 3+ years building React, Next.js, Node.js, TypeScript & PostgreSQL applications.',
  keywords: ['Full Stack Developer', 'React', 'Next.js', 'TypeScript', 'Node.js', 'Muhammad Saad'],
  authors: [{ name: 'Muhammad Saad' }],
  openGraph: {
    title: 'Muhammad Saad — Full Stack Engineer',
    description: 'Full-stack developer. Unapologetically functional, obsessively refined.',
    type: 'website',
  },
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html
      lang="en"
      className={`${anton.variable} ${baskerville.variable} ${spaceMono.variable}`}
    >
      <body className="antialiased bg-background text-foreground">
        <LoadingScreen />
        <PageTransition />
        {children}
      </body>
    </html>
  )
}
