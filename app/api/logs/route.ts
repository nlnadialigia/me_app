import logger from '@/lib/logger';
import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { level = 'info', message = '', meta } = body;

    if (level === 'error') logger.error({ meta }, message);
    else if (level === 'warn') logger.warn({ meta }, message);
    else if (level === 'debug') logger.debug({ meta }, message);
    else logger.info({ meta }, message);

    return NextResponse.json({ ok: true });
  } catch (error) {
    logger.error(error);
    return new NextResponse('Bad Request', { status: 400 });
  }
}
