import { NextRequest, NextResponse } from 'next/server'
import prisma from '@/lib/prisma'
import { validateDashboardToken } from '@/lib/auth'

function getToken(req: NextRequest) {
  return req.headers.get('x-dashboard-token') ?? req.cookies.get('dashboard-token')?.value ?? ''
}

export async function GET() {
  const skills = await prisma.skill.findMany({ orderBy: [{ order: 'asc' }, { category: 'asc' }] })
  return NextResponse.json(skills)
}

export async function POST(req: NextRequest) {
  if (!validateDashboardToken(getToken(req))) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }
  try {
    const body = await req.json()
    const skill = await prisma.skill.create({ data: body })
    return NextResponse.json(skill, { status: 201 })
  } catch (e) {
    return NextResponse.json({ error: 'Failed to create skill' }, { status: 500 })
  }
}

export async function PUT(req: NextRequest) {
  if (!validateDashboardToken(getToken(req))) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }
  try {
    const { id, ...data } = await req.json()
    const skill = await prisma.skill.update({ where: { id }, data })
    return NextResponse.json(skill)
  } catch (e) {
    return NextResponse.json({ error: 'Failed to update skill' }, { status: 500 })
  }
}

export async function DELETE(req: NextRequest) {
  if (!validateDashboardToken(getToken(req))) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }
  const { id } = await req.json()
  await prisma.skill.delete({ where: { id } })
  return NextResponse.json({ success: true })
}
