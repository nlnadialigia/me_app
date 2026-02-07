import logger from '@/lib/logger';
import { prisma } from '@/lib/prisma';
import { NextResponse } from 'next/server';

export async function GET() {
  try {
    logger.info('GET /api/profile');
    const profile = await prisma.profile.findFirst();
    return NextResponse.json(profile);
  } catch (error) {
    logger.error(error);
    return new NextResponse('Internal Server Error', { status: 500 });
  }
}

export async function PUT(request: Request) {
  try {
    const body = await request.json();
    logger.info('PUT /api/profile', { body });
    const existing = await prisma.profile.findFirst();

    let result;
    if (existing) {
      result = await prisma.profile.update({
        where: { id: existing.id },
        data: body,
      });
    } else {
      result = await prisma.profile.create({ data: body });
    }

    return NextResponse.json(result);
  } catch (error) {
    logger.error(error);
    return new NextResponse('Bad Request', { status: 400 });
  }
}
