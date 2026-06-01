// En seed.ts, podés importar:
import { prisma } from '../src/config/prisma.js'
import bcrypt from 'bcrypt'
async function main() {
    const hashedPassword = await bcrypt.hash('password123', 10)

    const user = await prisma.user.create({
        data: {
            email: 'test@example.com',
            name: 'Test User',
            password: hashedPassword,
        },
    })

    await prisma.post.create({
        data: {
            title: 'Mi primer post',
            content: 'Contenido del post debe de ser mayor de 15 caracteres y menor de 5000 caracteres.',
            published: true,
            authorId: user.id
        }
    })

    console.log('Seed completado')
}
main()
    .catch((e) => console.error(e))
    .finally(async () => await prisma.$disconnect())