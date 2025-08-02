    // File: src/app/api/slider-categories/reorder/route.ts
import { NextResponse, NextRequest } from 'next/server';
import { pool, executeQuery } from '@/lib/db';
import { PoolConnection } from 'mysql2/promise';

export async function PUT(request: NextRequest) {
  let connection: PoolConnection | undefined;
  try {
    const { orderedIds } = await request.json();
    if (!Array.isArray(orderedIds) || orderedIds.length === 0) {
      return NextResponse.json({ error: 'Ordered IDs array is required.' }, { status: 400 });
    }

    connection = await pool.getConnection();
    await executeQuery('START TRANSACTION', [], connection);
    
    // Create a series of UPDATE statements
    const updatePromises = orderedIds.map((id, index) => {
      const displayOrder = index + 1;
      return executeQuery('UPDATE SliderCategories SET display_order = ? WHERE id = ?', [displayOrder, id], connection);
    });

    await Promise.all(updatePromises);
    
    await executeQuery('COMMIT', [], connection);
    return NextResponse.json({ message: 'Category order updated successfully.' });
  } catch (error: any) {
    if (connection) await executeQuery('ROLLBACK', [], connection);
    console.error("Reorder API Error:", error);
    return NextResponse.json({ error: 'Failed to update category order.' }, { status: 500 });
  } finally {
    if (connection) connection.release();
  }
}