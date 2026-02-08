import logger from '@/lib/logger';
import { prisma } from '@/lib/prisma';
import crypto from 'bcryptjs';

async function main() {
  const email = process.env.ADMIN_EMAIL || 'admin@example.com';
  const password = process.env.ADMIN_PASSWORD || 'changeme';

  const hashed = await crypto.hash(password, 10);

  const user = await prisma.user.upsert({
    where: { email },
    update: { password: hashed },
    create: { email, password: hashed, name: 'Admin' },
  });

  logger.info({ email: user.email }, 'Seed: admin created/updated');

  const tech = [
    { name: 'React', color: '#61DAFB' },
    { name: 'Next', color: '#000000' },
    { name: 'Tailwind', color: '#38B2AC' },
    { name: 'Nestjs', color: '#007ACC' },
    { name: 'Prisma', color: '#2D3748' },
  ];

  for (const t of tech) {
    const techExists = await prisma.technology.findUnique({ where: { name: t.name } });
    if (!techExists) {
      await prisma.technology.create({ data: t });
    }
  }
}

main()
  .catch((e) => {
    logger.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
