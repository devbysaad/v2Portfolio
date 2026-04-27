import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcryptjs'

const prisma = new PrismaClient()

async function main() {
    console.log('🌱 Starting database seed...')

    // Create admin user
    const hashedPassword = await bcrypt.hash('admin123', 10)

    const admin = await prisma.user.upsert({
        where: { email: 'saad@devbysaad.com' },
        update: {},
        create: {
            email: 'saad@devbysaad.com',
            name: 'Muhammad Saad',
            passwordHash: hashedPassword,
            role: 'admin',
        },
    })

    console.log('✅ Created admin user:', admin.email)

    // Seed Skills
    const skills = await Promise.all([
        // Frontend
        prisma.skill.create({
            data: {
                name: 'JavaScript',
                category: 'Frontend',
                proficiency: 95,
                order: 1,
            },
        }),
        prisma.skill.create({
            data: {
                name: 'React.js',
                category: 'Frontend',
                proficiency: 95,
                order: 2,
            },
        }),
        prisma.skill.create({
            data: {
                name: 'Next.js',
                category: 'Frontend',
                proficiency: 90,
                order: 3,
            },
        }),
        prisma.skill.create({
            data: {
                name: 'TypeScript',
                category: 'Frontend',
                proficiency: 88,
                order: 4,
            },
        }),
        prisma.skill.create({
            data: {
                name: 'Tailwind CSS',
                category: 'Frontend',
                proficiency: 95,
                order: 5,
            },
        }),
        prisma.skill.create({
            data: {
                name: 'Redux',
                category: 'Frontend',
                proficiency: 85,
                order: 6,
            },
        }),
        // Backend
        prisma.skill.create({
            data: {
                name: 'Node.js',
                category: 'Backend',
                proficiency: 90,
                order: 7,
            },
        }),
        prisma.skill.create({
            data: {
                name: 'Express.js',
                category: 'Backend',
                proficiency: 90,
                order: 8,
            },
        }),
        // Databases
        prisma.skill.create({
            data: {
                name: 'MongoDB',
                category: 'Database',
                proficiency: 88,
                order: 9,
            },
        }),
        prisma.skill.create({
            data: {
                name: 'PostgreSQL',
                category: 'Database',
                proficiency: 85,
                order: 10,
            },
        }),
        prisma.skill.create({
            data: {
                name: 'MySQL',
                category: 'Database',
                proficiency: 82,
                order: 11,
            },
        }),
        // Tools
        prisma.skill.create({
            data: {
                name: 'Git & GitHub',
                category: 'Tools',
                proficiency: 92,
                order: 12,
            },
        }),
        prisma.skill.create({
            data: {
                name: 'AWS',
                category: 'Tools',
                proficiency: 75,
                order: 13,
            },
        }),
        prisma.skill.create({
            data: {
                name: 'Vercel',
                category: 'Tools',
                proficiency: 90,
                order: 14,
            },
        }),
    ])

    console.log(`✅ Created ${skills.length} skills`)

    // Seed Experience
    const experience = await prisma.experience.create({
        data: {
            type: 'work',
            company: 'Freelance',
            position: 'Full Stack Web Application Developer',
            description: '• Built and maintained production-ready applications with clean, modular architecture\n• Developed modern Next.js/React interfaces integrated with MERN and serverless PostgreSQL\n• Implemented AI, real-time processing, and optimized performance through structured debugging\n• Focused on scalability, reusability, and reliable production deployment',
            startDate: new Date('2024-01-01'),
            current: true,
            order: 1,
        },
    })

    const education = await prisma.experience.create({
        data: {
            type: 'education',
            company: 'Sheryians Coding School',
            position: 'Full Stack Development',
            description: 'Completed comprehensive full-stack development course covering modern JavaScript frameworks, backend development, and production deployment strategies.',
            startDate: new Date('2024-01-01'),
            endDate: new Date('2025-01-01'),
            current: false,
            order: 2,
        },
    })

    console.log('✅ Created experience entries')

    // Seed Projects
    const creavixAI = await prisma.project.create({
        data: {
            title: 'CreavixAI',
            description: 'AI-Integrated Creative Suite - Full-stack MERN application with integrated AI writing tools and image generation',
            longDesc: 'CreavixAI is a comprehensive creative suite that combines the power of AI with practical tools for content creation. The application integrates Google Gemini API for advanced AI writing assistance and DALL·E-based image generation using Cloudinary AI. Built with modern technologies including React 19, Tailwind CSS 4, and Clerk Auth, it provides a seamless experience for creative professionals.',
            techStack: ['React 19', 'Node.js', 'Express.js', 'MongoDB', 'Tailwind CSS 4', 'Clerk Auth', 'Neon PostgreSQL', 'Gemini API', 'DALL·E', 'Cloudinary'],
            githubUrl: 'https://github.com/devbysaad',
            liveUrl: 'https://creav ixai.vercel.app',
            imageUrl: '/projects/creavixai.jpg',
            featured: true,
            order: 1,
        },
    })

    const songplayer = await prisma.project.create({
        data: {
            title: 'Songplayer',
            description: 'Mood-Based Music App with real-time emotion detection using Face API',
            longDesc: 'Songplayer is an innovative MERN application that uses real-time emotion detection to curate personalized music experiences. Using Face API for mood analysis, the app automatically selects and plays songs that match the user\'s current emotional state. The modular backend architecture ensures scalability and reliability, while ImageKit handles all file operations efficiently.',
            techStack: ['React', 'Node.js', 'Express.js', 'MongoDB', 'Face API', 'ImageKit'],
            githubUrl: 'https://github.com/devbysaad',
            liveUrl: 'https://songplayer.vercel.app',
            imageUrl: '/projects/songplayer.jpg',
            featured: true,
            order: 2,
        },
    })

    console.log('✅ Created projects')

    console.log('🎉 Database seeded successfully!')
}

main()
    .catch((e) => {
        console.error('❌ Error seeding database:', e)
        process.exit(1)
    })
    .finally(async () => {
        await prisma.$disconnect()
    })
