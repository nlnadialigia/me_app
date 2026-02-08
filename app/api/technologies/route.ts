import logger from '@/lib/logger';
import { prisma } from '@/lib/prisma';
import { NextResponse } from 'next/server';

// Função para gerar cor baseada no nome
function generateColor(name: string): string {
  const colors = [
    '#3b82f6', // blue
    '#8b5cf6', // purple
    '#ec4899', // pink
    '#f59e0b', // amber
    '#10b981', // emerald
    '#06b6d4', // cyan
    '#f97316', // orange
    '#6366f1', // indigo
    '#14b8a6', // teal
    '#84cc16', // lime
  ];
  
  let hash = 0;
  for (let i = 0; i < name.length; i++) {
    hash = name.charCodeAt(i) + ((hash << 5) - hash);
  }
  
  return colors[Math.abs(hash) % colors.length];
}

export async function POST(request: Request) {
  try {
    const { name } = await request.json();
    logger.info('POST /api/technologies', { name });

    // Verifica se já existe
    const existing = await prisma.technology.findUnique({
      where: { name },
    });

    if (existing) {
      return NextResponse.json(existing);
    }

    // Cria nova tecnologia com cor automática
    const technology = await prisma.technology.create({
      data: {
        name,
        color: generateColor(name),
      },
    });

    return NextResponse.json(technology);
  } catch (error) {
    logger.error('Error creating technology:', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Bad Request' },
      { status: 400 }
    );
  }
}

export async function GET() {
  try {
    logger.info('GET /api/technologies');
    const technologies = await prisma.technology.findMany({
      orderBy: { name: 'asc' },
    });
    return NextResponse.json(technologies);
  } catch (error) {
    logger.error('Error fetching technologies:', error);
    return new NextResponse('Internal Server Error', { status: 500 });
  }
}
