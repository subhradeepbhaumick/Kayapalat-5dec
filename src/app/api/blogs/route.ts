import { NextResponse, NextRequest } from 'next/server';
import { executeQuery } from '@/lib/db';

export async function GET() {
  try {
    const [blogs] = await executeQuery('SELECT id, title, slug, excerpt, content, image, created_at FROM blogs ORDER BY created_at DESC');
    
    if (!Array.isArray(blogs)) {
      throw new Error('Invalid data format from database');
    }

    const blogsWithBody = blogs.map(blog => ({
      ...blog,
      body: blog.content // for frontend compatibility
    }));
    return NextResponse.json(blogsWithBody);
  } catch (error: any) {
    console.error('Database error details:', {
      message: error.message,
      code: error.code,
      sqlState: error.sqlState,
      sqlMessage: error.sqlMessage
    });
    
    return NextResponse.json(
      { 
        error: 'Failed to fetch blogs',
        details: error.message 
      },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const { title, body, image } = await request.json();
    
    if (!title || !body || !image) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    await executeQuery(
      'INSERT INTO blogs (title, body, image) VALUES (?, ?, ?)',
      [title, body, image]
    );

    return NextResponse.json(
      { message: 'Blog created successfully' },
      { status: 201 }
    );
  } catch (error: any) {
    console.error('Database error details:', {
      message: error.message,
      code: error.code,
      sqlState: error.sqlState,
      sqlMessage: error.sqlMessage
    });
    
    return NextResponse.json(
      { 
        error: 'Failed to create blog',
        details: error.message 
      },
      { status: 500 }
    );
  }
} 