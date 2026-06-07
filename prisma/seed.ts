import { prisma } from '../src/config/prisma.js';
import bcrypt from 'bcrypt';

async function main() {
  const hashedPassword = await bcrypt.hash('password123', 10);

  await prisma.user.createMany({
    data: [
      { email: 'test@example.com', name: 'Test User', password: hashedPassword },
    ],
    skipDuplicates: true,
  });

  const user = await prisma.user.findUniqueOrThrow({ where: { email: 'test@example.com' } });

  await prisma.post.deleteMany({ where: { authorId: user.id } });
  await prisma.post.create({
    data: {
      title: 'Mi primer post',
      content: 'Contenido del post debe de ser mayor de 15 caracteres y menor de 5000 caracteres.',
      published: true,
      authorId: user.id,
    },
  });

  console.log('Seed completado');
}
main()
  .catch((e) => console.error(e))
  .finally(async () => await prisma.$disconnect());
