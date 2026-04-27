import { NextRequest, NextResponse } from 'next/server'
import prisma from '@/lib/prisma'
import { validateDashboardToken } from '@/lib/auth'

function getToken(req: NextRequest) {
  return req.headers.get('x-dashboard-token') ?? req.cookies.get('dashboard-token')?.value ?? ''
}

export async function GET() {
  const projects = await prisma.project.findMany({ orderBy: { order: 'asc' } })
  return NextResponse.json(projects)
}

export async function POST(req: NextRequest) {
  if (!validateDashboardToken(getToken(req))) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }
  try {
    const body = await req.json()
    const project = await prisma.project.create({ data: body })
    return NextResponse.json(project, { status: 201 })
  } catch (e) {
    return NextResponse.json({ error: 'Failed to create project' }, { status: 500 })
  }
}

export async function PUT(req: NextRequest) {
  if (!validateDashboardToken(getToken(req))) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }
  try {
    const { id, ...data } = await req.json()
    const project = await prisma.project.update({ where: { id }, data })
    return NextResponse.json(project)
  } catch (e) {
    return NextResponse.json({ error: 'Failed to update project' }, { status: 500 })
  }
}

export async function DELETE(req: NextRequest) {
  if (!validateDashboardToken(getToken(req))) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }
  const { id } = await req.json()
  await prisma.project.delete({ where: { id } })
  return NextResponse.json({ success: true })
}
