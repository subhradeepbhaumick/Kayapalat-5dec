// File: src/app/api/image-slider/route.ts

import { NextResponse, NextRequest } from 'next/server';
import { executeQuery, pool } from '@/lib/db'; // Import pool for the POST function transaction

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const page = searchParams.get('page');
    const categoryId = searchParams.get('categoryId');
    const status = searchParams.get('status');

    let query = `
    SELECT 
      s.*, 
      c.name as category_name,
      p.name as page_name
    FROM ImageSlider s
    LEFT JOIN SliderCategories c ON s.category_id = c.id
    LEFT JOIN SliderPages p ON s.page_id = p.id
  `;
    const queryParams: (string | number)[] = [];
    const whereConditions: string[] = [];

    if (page && page !== 'all') {
      whereConditions.push('p.name = ?');
      queryParams.push(page);
    }
    if (categoryId && categoryId !== 'all') {
      whereConditions.push('s.category_id = ?');
      queryParams.push(parseInt(categoryId, 10));
    }
    if (status && status !== 'all') {
      whereConditions.push('s.status = ?');
      queryParams.push(status);
    }

    if (whereConditions.length > 0) {
      query += ` WHERE ${whereConditions.join(' AND ')}`;
    }

    query += ' ORDER BY s.created_at DESC';
    const [sliders] = await executeQuery(query, queryParams);
    return NextResponse.json(sliders);
  } catch (error: any) {
    return NextResponse.json({ error: 'Failed to fetch sliders' }, { status: 500 });
  }
}

// UPDATED: Simplified POST function without unnecessary transaction
export async function POST(request: Request) {
  try {
    const data = await request.json();
    const { before_image, after_image, testimonial_name, designation, rating, comment, testimonial_dp, category_id, page_id ,status } = data;
    
    if (!before_image || !after_image || !testimonial_name || !page_id || !designation || !rating || !comment || !testimonial_dp || !status || !category_id) {
      return NextResponse.json({ error: 'Missing required fields.' }, { status: 400 });
    }

    const query = `
        INSERT INTO ImageSlider (before_image, after_image, testimonial_name, designation, rating, comment, testimonial_dp, category_id, page_id ,status) 
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ? ,?)
    `;
    const [result]: any = await executeQuery(query, [before_image, after_image, testimonial_name, designation, rating, comment, testimonial_dp, category_id, page_id, status]);

    return NextResponse.json({ id: result.insertId, ...data }, { status: 201 });
  } catch (error: any) {
    console.error('API POST Error for slider:', error);
    return NextResponse.json({ error: 'Failed to create slider entry.', details: error.message }, { status: 500 });
  }
}

