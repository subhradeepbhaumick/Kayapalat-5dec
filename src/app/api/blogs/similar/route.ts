// File: src/app/api/blogs/similar/route.ts
import { NextResponse, NextRequest } from 'next/server';
import { executeQuery } from '@/lib/db';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const currentId = searchParams.get('currentId');
    const categoryId = searchParams.get('categoryId');
    const tagIdsParam = searchParams.get('tags');

    if (!currentId || !categoryId) {
      return NextResponse.json({ error: 'Missing required parameters' }, { status: 400 });
    }

    const tagIds = tagIdsParam ? tagIdsParam.split(',').map(Number).filter(id => id > 0) : [];
    
    let whereClause = `b.id != ? AND b.status = 'published' AND (b.category_id = ?`;
    let queryParams: (string | number)[] = [currentId, categoryId];

    // --- THIS IS THE CORRECTED LOGIC ---
    if (tagIds.length > 0) {
      const placeholders = tagIds.map(() => '?').join(',');
      whereClause += ` OR btl.tag_id IN (${placeholders}))`;
      queryParams.push(...tagIds);
    } else {
      whereClause += `)`;
    }

    const query = `
      SELECT
        b.id, b.title, b.slug, b.image, b.created_at, b.content,
        COUNT(DISTINCT btl.tag_id) AS matching_tags
      FROM new_blogs b
      LEFT JOIN blog_tag_link btl ON b.id = btl.blog_id
      WHERE 
        ${whereClause}
      GROUP BY b.id
      ORDER BY matching_tags DESC, b.created_at DESC
      LIMIT 3;
    `;
    
    const [similarBlogs] = await executeQuery(query, queryParams);

    return NextResponse.json(similarBlogs);
  } catch (error: any) {
    console.error('API Error fetching similar blogs:', error);
    return NextResponse.json({ error: 'Failed to fetch similar blogs' }, { status: 500 });
  }
}