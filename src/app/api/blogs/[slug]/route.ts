import { NextResponse } from 'next/server';
import { executeQuery } from '@/lib/db';

export async function GET(req, { params }) {
  const { slug } = params;
  try {
    const [rows] = await executeQuery('SELECT * FROM blogs WHERE slug = ?', [slug]);
    if (!rows || rows.length === 0) {
      return NextResponse.json({ error: 'Blog not found' }, { status: 404 });
    }
    return NextResponse.json(rows[0]);
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
} 