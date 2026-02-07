import { prisma } from '@/lib/prisma';

export async function getProjects() {
  return prisma.project.findMany({ orderBy: { orderIndex: 'asc' } });
}

export async function createProject(data: any) {
  return prisma.project.create({ data });
}

export async function updateProject(id: string, data: any) {
  return prisma.project.update({ where: { id }, data });
}

export async function deleteProject(id: string) {
  return prisma.project.delete({ where: { id } });
}
