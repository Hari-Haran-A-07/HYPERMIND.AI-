import { NextRequest } from 'next/server';
import activeGenerations from '../active-generations';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const messageId = body?.messageId;

    if (!messageId || typeof messageId !== 'string') {
      return Response.json({ error: 'messageId is required' }, { status: 400 });
    }

    const controller = activeGenerations.get(messageId);
    if (!controller) {
      return Response.json(
        { error: 'No active generation found', messageId },
        { status: 404 }
      );
    }

    controller.abort();
    activeGenerations.delete(messageId);

    return Response.json({ cancelled: true, messageId });
  } catch {
    return Response.json({ error: 'Invalid request' }, { status: 400 });
  }
}
