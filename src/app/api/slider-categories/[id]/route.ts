// File: src/app/api/slider-categories/[id]/route.ts
import { NextResponse } from 'next/server';
import { executeQuery } from '@/lib/db';

export async function DELETE(request: Request, { params }: { params: { id: string } }) {
  try {
    const categoryId = parseInt(params.id, 10);
    const query = 'DELETE FROM slidercategories WHERE id = ?';
    await executeQuery(query, [categoryId]);

    return NextResponse.json({ message: 'Category deleted successfully.' });
  } catch (error: any) {
    // Check for the specific foreign key error code
    if (error.code === 'ER_ROW_IS_REFERENCED_2') {
      return NextResponse.json(
        { error: 'Cannot delete category because it is currently in use by one or more sliders.' }, 
        { status: 409 } // 409 Conflict
      );
    }
    // For other potential errors
    return NextResponse.json({ error: 'Failed to delete category.' }, { status: 500 });
  }
}