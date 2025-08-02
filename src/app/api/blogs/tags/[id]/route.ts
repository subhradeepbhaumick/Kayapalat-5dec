// File: src/app/api/blogs/tags/[id]/route.ts
import { NextResponse } from 'next/server';
import { executeQuery } from '@/lib/db';

export async function DELETE(request: Request, { params }: { params: { id: string } }) {
  try {
    const tagId = parseInt(params.id, 10);

    // 1. Check if the tag is being used by any blogs
    const usageQuery = 'SELECT COUNT(*) as count FROM blog_tag_link WHERE tag_id = ?';
    const [usageResult]: any[] = await executeQuery(usageQuery, [tagId]);
    const usageCount = usageResult[0].count;

    if (usageCount > 0) {
      // 2. If it's used, get the names of the blogs for a helpful error message
      const blogsQuery = `
        SELECT b.title 
        FROM new_blogs b 
        JOIN blog_tag_link bl ON b.id = bl.blog_id 
        WHERE bl.tag_id = ? 
        LIMIT 5
      `;
      const [blogs]: any[] = await executeQuery(blogsQuery, [tagId]);
      const blogTitles = blogs.map((b: { title: string }) => b.title).join(', ');
      
      // 3. Return a specific error
      return NextResponse.json(
        { 
          error: `Cannot delete tag. It is used by ${usageCount} blog(s): ${blogTitles}${usageCount > 5 ? '...' : ''}` 
        }, 
        { status: 409 } 
      );
    }

    // 4. If not used, proceed with deletion
    const deleteQuery = 'DELETE FROM blog_tags WHERE id = ?';
    await executeQuery(deleteQuery, [tagId]);
    return NextResponse.json({ message: 'Tag deleted successfully.' });
  } catch (error: any) {
    return NextResponse.json({ error: 'Failed to delete tag.' }, { status: 500 });
  }
}