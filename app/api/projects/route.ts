import logger from '@/lib/logger';
import { prisma } from '@/lib/prisma';
import { NextResponse } from 'next/server';

export async function GET() {
  try {
    logger.info('GET /api/projects');
    const projects = await prisma.project.findMany({ 
      orderBy: { orderIndex: 'asc' },
      include: {
        technologies: {
          include: {
            technology: true
          }
        }
      }
    });
    
    const formattedProjects = projects.map(project => ({
      ...project,
      technologies: project.technologies.map(pt => ({
        name: pt.technology.name,
        color: pt.technology.color
      }))
    }));
    
    return NextResponse.json(formattedProjects);
  } catch (error) {
    logger.error(error);
    return new NextResponse('Internal Server Error', { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    logger.info({ body }, 'POST /api/projects');
    
    const { technologies: techNames, ...projectData } = body;
    
    const project = await prisma.project.create({
      data: {
        ...projectData,
        technologies: {
          create: techNames?.map((name: string) => ({
            technology: {
              connect: { name }
            }
          })) || []
        }
      },
      include: {
        technologies: {
          include: {
            technology: true
          }
        }
      }
    });
    
    const formattedProject = {
      ...project,
      technologies: project.technologies.map(pt => ({
        name: pt.technology.name,
        color: pt.technology.color
      }))
    };
    
    return NextResponse.json(formattedProject);
  } catch (error) {
    logger.error({ error }, 'Error creating project');
    return NextResponse.json({ error: error instanceof Error ? error.message : 'Bad Request' }, { status: 400 });
  }
}

export async function PUT(request: Request) {
  try {
    const body = await request.json();
    if (!body.id) return new NextResponse('Missing id', { status: 400 });
    logger.info({ id: body.id }, 'PUT /api/projects');
    
    const { id, technologies: techNames, ...projectData } = body;
    
    await prisma.projectTechnology.deleteMany({ where: { projectId: id } });
    
    const project = await prisma.project.update({
      where: { id },
      data: {
        ...projectData,
        technologies: {
          create: techNames?.map((name: string) => ({
            technology: {
              connect: { name }
            }
          })) || []
        }
      },
      include: {
        technologies: {
          include: {
            technology: true
          }
        }
      }
    });
    
    const formattedProject = {
      ...project,
      technologies: project.technologies.map(pt => ({
        name: pt.technology.name,
        color: pt.technology.color
      }))
    };
    
    return NextResponse.json(formattedProject);
  } catch (error) {
    logger.error(error);
    return NextResponse.json({ error: error instanceof Error ? error.message : 'Bad Request' }, { status: 400 });
  }
}

export async function DELETE(request: Request) {
  try {
    const body = await request.json();
    const { id } = body;
    if (!id) return new NextResponse('Missing id', { status: 400 });
    logger.info({ id }, 'DELETE /api/projects');
    await prisma.project.delete({ where: { id } });
    return new NextResponse(null, { status: 204 });
  } catch (error) {
    logger.error(error);
    return new NextResponse('Bad Request', { status: 400 });
  }
}
