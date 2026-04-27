'use client'

import Link from 'next/link'
import { useState } from 'react'
import { Menu, X } from 'lucide-react'

export default function Navigation() {
    const [open, setOpen] = useState(false)

    const navLinks = [
        { name: 'Home', href: '/' },
        { name: 'Projects', href: '/projects' },
        { name: 'Skills', href: '/skills' },
        { name: 'About', href: '/about' },
        { name: 'Contact', href: '/contact' },
    ]

    return (
        <header className="fixed top-0 left-0 w-full z-50 bg-background/80 backdrop-blur-md border-b border-surface">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between items-center h-16">
                    <div className="flex-shrink-0 flex items-center">
                        <Link href="/" className="text-xl font-bold tracking-tight text-foreground hover:text-accent transition-colors">
                            Saad<span className="text-accent">.</span>
                        </Link>
                    </div>

                    {/* Desktop Navigation */}
                    <nav className="hidden md:flex space-x-8">
                        {navLinks.map((link) => (
                            <Link
                                key={link.name}
                                href={link.href}
                                className="text-sm font-medium text-muted hover:text-accent transition-colors py-2"
                            >
                                {link.name}
                            </Link>
                        ))}
                    </nav>

                    {/* Mobile menu button */}
                    <div className="md:hidden flex items-center">
                        <button
                            onClick={() => setOpen(!open)}
                            className="inline-flex items-center justify-center p-2 rounded-md text-muted hover:text-accent hover:bg-surface focus:outline-none transition-all"
                        >
                            <span className="sr-only">Open main menu</span>
                            {open ? <X className="block h-6 w-6" /> : <Menu className="block h-6 w-6" />}
                        </button>
                    </div>
                </div>
            </div>

            {/* Mobile Navigation */}
            <div className={`md:hidden bg-surface/80 backdrop-blur-md border-b border-surface overflow-hidden transition-all duration-300 ${open ? 'max-height-[400px] opacity-100' : 'max-height-0 opacity-0'}`} style={{ maxHeight: open ? '400px' : '0' }}>
                <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
                    {navLinks.map((link) => (
                        <Link
                            key={link.name}
                            href={link.href}
                            onClick={() => setOpen(false)}
                            className="block px-3 py-2 rounded-md text-base font-medium text-muted hover:text-accent hover:bg-background transition-colors"
                        >
                            {link.name}
                        </Link>
                    ))}
                </div>
            </div>
        </header>
    )
}
