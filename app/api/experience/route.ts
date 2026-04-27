import { NextRequest, NextResponse } from 'next/server'
import prisma from '@/lib/prisma'
import { validateDashboardToken } from '@/lib/auth'

function getToken(req: NextRequest) {
  return req.headers.get('x-dashboard-token') ?? req.cookies.get('dashboard-token')?.value ?? ''
}

export async function GET() {
  const experiences = await prisma.experience.findMany({ orderBy: { order: 'asc' } })
  return NextResponse.json(experiences)
}

export async function POST(req: NextRequest) {
  if (!validateDashboardToken(getToken(req))) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }
  try {
    const body = await req.json()
    const exp = await prisma.experience.create({ data: body })
    return NextResponse.json(exp, { status: 201 })
  } catch (e) {
    return NextResponse.json({ error: 'Failed to create experience' }, { status: 500 })
  }
}

export async function PUT(req: NextRequest) {
  if (!validateDashboardToken(getToken(req))) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }
  try {
    const { id, ...data } = await req.json()
    const exp = await prisma.experience.update({ where: { id }, data })
    return NextResponse.json(exp)
  } catch (e) {
    return NextResponse.json({ error: 'Failed to update experience' }, { status: 500 })
  }
}

export async function DELETE(req: NextRequest) {
  if (!validateDashboardToken(getToken(req))) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }
  const { id } = await req.json()
  await prisma.experience.delete({ where: { id } })
  return NextResponse.json({ success: true })
}
