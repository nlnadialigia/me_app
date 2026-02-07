import { prisma } from '@/lib/prisma';

export async function getProfile() {
  return prisma.profile.findFirst();
}

export async function upsertProfile(data: any) {
  const existing = await prisma.profile.findFirst();
  if (existing) {
    return prisma.profile.update({ where: { id: existing.id }, data });
  }
  return prisma.profile.create({ data });
}
