// File: src/app/api/blogs/tags/route.ts

import { NextResponse } from 'next/server';
import { executeQuery, generateSlug } from '@/lib/db';

export async function GET() {
  try {
    const [tags] = await executeQuery('SELECT * FROM blog_tags ORDER BY name ASC');
    if (!Array.isArray(tags)) {
      throw new Error("Invalid data format for tags.");
    }

    return NextResponse.json(tags);
  } catch (error: any) {
    console.error('API Error fetching tags:', error);
    return NextResponse.json(
      { error: 'Failed to fetch tags', details: error.message },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const { name } = await request.json();
    if (!name) {
      return NextResponse.json({ error: 'Tag name is required.' }, { status: 400 });
    }
    const slug = generateSlug(name);
    const query = 'INSERT INTO blog_tags (name, slug) VALUES (?, ?)';
    const [result]: any = await executeQuery(query, [name, slug]);
    return NextResponse.json({ id: result.insertId, name, slug });
  } catch (error: any) {
    return NextResponse.json({ error: 'Failed to create tag.' }, { status: 500 });
  }
}