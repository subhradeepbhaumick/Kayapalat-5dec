// File: src/app/api/gallery-categories/route.ts
import { NextResponse } from 'next/server';
import { db, generateSlug } from '@/lib/db'; // Import generateSlug

interface Category {
  id: number;
  name: string;
}

// GET function remains the same
export async function GET() {
  try {
    const query = 'SELECT id, name FROM GalleryCategories ORDER BY name ASC';
    const categories = await db.query<Category[]>(query);
    return NextResponse.json(categories);
  } catch (error) {
    console.error('[GALLERY_CATEGORIES_GET]', error);
    return new NextResponse('Internal Server Error', { status: 500 });
  }
}

// POST function to create a new category
export async function POST(req: Request) {
  try {
    const { name } = await req.json();

    if (!name) {
      return new NextResponse('Category name is required', { status: 400 });
    }

    const slug = generateSlug(name); // Use your slug function
    const query = 'INSERT INTO GalleryCategories (name, slug) VALUES (?, ?)';
    await db.query(query, [name, slug]);

    return new NextResponse('Category created successfully', { status: 201 });

  } catch (error) {
    console.error('[GALLERY_CATEGORIES_POST]', error);
    return new NextResponse('Internal Server Error', { status: 500 });
  }
}

// DELETE function to remove a category
export async function DELETE(req: Request) {
    try {
      const { id } = await req.json();
  
      if (!id) {
        return new NextResponse('Category ID is required', { status: 400 });
      }
  
      // Note: Your database is set to ON DELETE CASCADE,
      // so deleting a category will automatically delete all images within it.
      const query = 'DELETE FROM GalleryCategories WHERE id = ?';
      await db.query(query, [id]);
  
      return new NextResponse('Category deleted successfully', { status: 200 });
  
    } catch (error) {
      console.error('[GALLERY_CATEGORIES_DELETE]', error);
      return new NextResponse('Internal Server Error', { status: 500 });
    }
  }
