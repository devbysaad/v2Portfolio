'use server'

import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'
import bcrypt from 'bcryptjs'
import prisma from '@/lib/prisma'

export async function login(formData: FormData) {
    const email = formData.get('email') as string
    const password = formData.get('password') as string

    if (!email || !password) {
        return { error: 'Email and password are required' }
    }

    try {
        const user = await prisma.user.findUnique({
            where: { email },
        })

        if (!user) {
            return { error: 'Invalid credentials' }
        }

        const validPassword = await bcrypt.compare(password, user.passwordHash)

        if (!validPassword) {
            return { error: 'Invalid credentials' }
        }

        // Set session cookie
        const cookieStore = await cookies()
        cookieStore.set('session-token', user.id, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'lax',
            maxAge: 60 * 60 * 24 * 7, // 1 week
        })

        return { success: true }
    } catch (error) {
        console.error('Login error:', error)
        return { error: 'An error occurred during login' }
    }
}

export async function logout() {
    const cookieStore = await cookies()
    cookieStore.delete('session-token')
    redirect('/admin-login')
}
