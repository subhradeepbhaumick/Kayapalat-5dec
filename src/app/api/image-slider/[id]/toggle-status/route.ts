// File: src/app/api/image-slider/[id]/toggle-status/route.ts
import { NextResponse } from 'next/server';
import { executeQuery } from '@/lib/db';

export async function POST(request: Request, { params }: { params: { id: string } }) {
  try {
    const sliderId = parseInt(params.id, 10);
    const { status } = await request.json();

    if (!['published', 'draft'].includes(status)) {
      return NextResponse.json({ error: 'Invalid status' }, { status: 400 });
    }

    const query = 'UPDATE ImageSlider SET status = ? WHERE id = ?';
    await executeQuery(query, [status, sliderId]);
    
    return NextResponse.json({ message: `Slider status updated to ${status}` });
  } catch (error: any) {
    return NextResponse.json({ error: 'Failed to update status' }, { status: 500 });
  }
}