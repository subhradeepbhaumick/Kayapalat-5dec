// File: src/app/api/gallery-likes/route.ts
import { NextResponse } from 'next/server';
import { db } from '@/lib/db';

export async function POST(req: Request) {
  try {
    const { id } = await req.json();

    if (!id) {
      return NextResponse.json({ error: 'Image ID is required' }, { status: 400 });
    }

    // This query safely increments the 'likes' count for a specific image ID.
    // The 'likes + 1' ensures the operation is atomic.
    const query = 'UPDATE galleryimages SET likes = likes + 1 WHERE id = ?';
    await db.query(query, [id]);

    return NextResponse.json({ message: 'Like recorded successfully' }, { status: 200 });

  } catch (error) {
    console.error('[GALLERY_LIKES_POST]', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
