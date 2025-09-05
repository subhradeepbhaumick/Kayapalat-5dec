// File: src/app/api/slider-categories/route.ts

import { NextResponse, NextRequest } from 'next/server';
import { executeQuery, pool} from '@/lib/db';

export async function GET() {
  try {
    const [categories] = await executeQuery('SELECT * FROM slidercategories ORDER BY display_order ASC, name ASC');
    return NextResponse.json(categories);
  } catch (error: any) {
    console.error('API Error fetching slider categories:', error);
    return NextResponse.json({ error: 'Failed to fetch slider categories' }, { status: 500 });
  }
}

// NEW: This function handles creating a new category
export async function POST(request: NextRequest) {
  let connection;
  try {
    const { name, icon_name } = await request.json();
    if (!name || !icon_name) {
      return NextResponse.json({ error: 'Category name and icon name are required.' }, { status: 400 });
    }
    
    connection = await pool.getConnection();
    await executeQuery('START TRANSACTION', [], connection);

    // Get the current max display order
    const [[{ maxOrder }]] = await executeQuery('SELECT MAX(display_order) as maxOrder FROM slidercategories', [], connection) as any[];
    const newOrder = (maxOrder || 0) + 1;

    const query = 'INSERT INTO slidercategories (name, icon_name, display_order) VALUES (?, ?, ?)';
    const [result]: any = await executeQuery(query, [name, icon_name, newOrder], connection);
    
    await executeQuery('COMMIT', [], connection);
    return NextResponse.json({ id: result.insertId, name, icon_name }, { status: 201 });
  } catch (error: any) {
    if (connection) await executeQuery('ROLLBACK', [], connection);
    console.error('API Error creating slider category:', error);
    return NextResponse.json({ error: 'Failed to create category.' }, { status: 500 });
  } finally {
    if (connection) connection.release();
  }
}