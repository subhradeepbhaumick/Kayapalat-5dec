// File: src/app/api/gallery/view/route.ts
import { NextResponse } from 'next/server';
import { db } from '@/lib/db';

export async function POST(req: Request) {
  try {
    const { id } = await req.json();
    if (!id) {
      return NextResponse.json({ error: 'Image ID is required' }, { status: 400 });
    }

    // Atomically increment the view_count for the given image
    const query = 'UPDATE GalleryImages SET view_count = view_count + 1 WHERE id = ?';
    await db.query(query, [id]);

    return NextResponse.json({ message: 'View count updated' }, { status: 200 });
  } catch (error) {
    console.error('[GALLERY_VIEW_POST]', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
