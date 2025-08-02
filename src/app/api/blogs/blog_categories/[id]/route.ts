// File: src/app/api/blogs/blog_categories/[id]/route.ts
import { NextResponse } from 'next/server';
import { executeQuery } from '@/lib/db';

export async function DELETE(request: Request, { params }: { params: { id: string } }) {
  try {
    const categoryId = parseInt(params.id, 10);

    // 1. Check if the category is being used
    const usageQuery = 'SELECT COUNT(*) as count FROM new_blogs WHERE category_id = ?';
    const [usageResult]: any[] = await executeQuery(usageQuery, [categoryId]);
    const usageCount = usageResult[0].count;

    if (usageCount > 0) {
      // 2. If used, get blog titles for a helpful error message
      const blogsQuery = 'SELECT title FROM new_blogs WHERE category_id = ? LIMIT 5';
      const [blogs]: any[] = await executeQuery(blogsQuery, [categoryId]);
      const blogTitles = blogs.map((b: { title: string }) => b.title).join(', ');

      // 3. Return a specific error
      return NextResponse.json(
        { 
          error: `Cannot delete category. It is used by ${usageCount} blog(s): ${blogTitles}${usageCount > 5 ? '...' : ''}` 
        }, 
        { status: 409 } // 409 Conflict
      );
    }

    // 4. If not used, proceed with deletion
    const deleteQuery = 'DELETE FROM blog_categories WHERE id = ?';
    await executeQuery(deleteQuery, [categoryId]);
    return NextResponse.json({ message: 'Category deleted successfully.' });
  } catch (error: any) {
    return NextResponse.json({ error: 'Failed to delete category.' }, { status: 500 });
  }
}