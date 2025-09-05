// File: src/app/api/seo/[page]/route.ts
import { NextResponse } from 'next/server';
import { db } from '@/lib/db'; // Your database connection utility

interface SEOData {
  meta_title: string;
  meta_description: string;
  content?: string;
}

export async function GET(
  req: Request,
  { params }: { params: { page: string } }
) {
  try {
    const pageIdentifier = params.page;

    // Basic validation
    if (!pageIdentifier) {
      return new NextResponse('Page identifier is required', { status: 400 });
    }

    // The query to get SEO data for a specific page
    const query = 'SELECT meta_title, meta_description, content FROM pageseo WHERE page_identifier = ?';

    // Execute the query with the page identifier as a parameter
    const seoDataArray = await db.query<SEOData[]>(query, [pageIdentifier]);

    // Check if any data was found
    if (!seoDataArray || seoDataArray.length === 0) {
      return new NextResponse('Not Found', { status: 404 });
    }

    // Return the first (and only) result
    return NextResponse.json(seoDataArray[0]);

  } catch (error) {
    console.error('[SEO_GET]', error);
    return new NextResponse('Internal Server Error', { status: 500 });
  }
}
