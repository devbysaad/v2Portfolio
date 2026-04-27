import type { Metadata } from 'next'
import { getProjects } from '@/app/actions/projects'
import ProjectsClient from './ProjectsClient'

export const metadata: Metadata = {
  title: 'Projects — Muhammad Saad',
  description: 'Full-stack projects built by Muhammad Saad — React, Next.js, Node.js, TypeScript, PostgreSQL.',
}

export const dynamic = 'force-dynamic'

export default async function ProjectsPage() {
  const projects = await getProjects()
  return <ProjectsClient projects={projects} />
}