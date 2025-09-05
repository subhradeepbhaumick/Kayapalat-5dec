// File: src/app/api/slider/pages/route.ts
import { NextResponse, NextRequest } from 'next/server';
import { executeQuery } from '@/lib/db';

// UPDATED: This function now correctly queries the SliderPages table
export async function GET() {
  try {
    const query = 'SELECT id, name FROM sliderpages ORDER BY name ASC';
    const [pages] = await executeQuery(query);
    return NextResponse.json(pages);
  } catch (error: any) {
    console.error('API Error fetching slider pages:', error);
    return NextResponse.json({ error: 'Failed to fetch slider pages.' }, { status: 500 });
  }
}

// NEW: This function handles creating a new page
export async function POST(request: NextRequest) {
  try {
    const { name } = await request.json();
    if (!name || name.trim() === '') {
      return NextResponse.json({ error: 'Page name is required.' }, { status: 400 });
    }
    const query = 'INSERT INTO sliderpages (name) VALUES (?)';
    const [result]: any = await executeQuery(query, [name.trim()]);
    return NextResponse.json({ id: result.insertId, name: name.trim() }, { status: 201 });
  } catch (error: any) {
    // Handle potential duplicate entry errors
    if (error.code === 'ER_DUP_ENTRY') {
        return NextResponse.json({ error: 'A page with this name already exists.' }, { status: 409 });
    }
    console.error('API Error creating page:', error);
    return NextResponse.json({ error: 'Failed to create page.' }, { status: 500 });
  }
}