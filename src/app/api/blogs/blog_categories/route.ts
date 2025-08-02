import { NextResponse } from 'next/server';
import { executeQuery, generateSlug } from '@/lib/db';

export async function GET() {
  try {
    const [categories] = await executeQuery('SELECT * FROM blog_categories ORDER BY name ASC');
    if (!Array.isArray(categories)) {
        throw new Error("Invalid data format for categories.");
    }

    return NextResponse.json(categories);
  } catch (error: any) {
    console.error('API Error fetching categories:', error);
    return NextResponse.json(
      { error: 'Failed to fetch categories', details: error.message },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const { name } = await request.json();
    if (!name) {
      return NextResponse.json({ error: 'Category name is required.' }, { status: 400 });
    }
    const slug = generateSlug(name);
    const query = 'INSERT INTO blog_categories (name, slug) VALUES (?, ?)';
    const [result]: any = await executeQuery(query, [name, slug]);
    return NextResponse.json({ id: result.insertId, name, slug });
  } catch (error: any) {
    return NextResponse.json({ error: 'Failed to create category.' }, { status: 500 });
  }
}