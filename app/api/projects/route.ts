import logger from '@/lib/logger';
import { prisma } from '@/lib/prisma';
import { NextResponse } from 'next/server';

export async function GET() {
  try {
    logger.info('GET /api/projects');
    const projects = await prisma.project.findMany({ orderBy: { orderIndex: 'asc' } });
    return NextResponse.json(projects);
  } catch (error) {
    logger.error(error);
    return new NextResponse('Internal Server Error', { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    logger.info('POST /api/projects', { body });
    const project = await prisma.project.create({ data: body });
    return NextResponse.json(project);
  } catch (error) {
    logger.error(error);
    return new NextResponse('Bad Request', { status: 400 });
  }
}

export async function PUT(request: Request) {
  try {
    const body = await request.json();
    if (!body.id) return new NextResponse('Missing id', { status: 400 });
    logger.info('PUT /api/projects', { id: body.id });
    const project = await prisma.project.update({ where: { id: body.id }, data: body });
    return NextResponse.json(project);
  } catch (error) {
    logger.error(error);
    return new NextResponse('Bad Request', { status: 400 });
  }
}

export async function DELETE(request: Request) {
  try {
    const body = await request.json();
    const { id } = body;
    if (!id) return new NextResponse('Missing id', { status: 400 });
    logger.info('DELETE /api/projects', { id });
    await prisma.project.delete({ where: { id } });
    return new NextResponse(null, { status: 204 });
  } catch (error) {
    logger.error(error);
    return new NextResponse('Bad Request', { status: 400 });
  }
}
