// File: src/app/api/gallery-images/route.ts
import { NextResponse } from 'next/server';
import { db } from '@/lib/db';
import path from 'path';
import { writeFile, unlink, stat, mkdir } from 'fs/promises';

// --- HELPER FUNCTION TO ENSURE DIRECTORY EXISTS ---
async function ensureDirExists(directoryPath: string) {
    try {
        await stat(directoryPath);
    } catch (e: any) {
        if (e.code === 'ENOENT') {
            await mkdir(directoryPath, { recursive: true });
        } else {
            throw e;
        }
    }
}

// --- GET: FETCHES IMAGES FOR BOTH PUBLIC GALLERY AND ADMIN TABLE ---
export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const searchTerm = searchParams.get('search') || '';
    const categoryId = searchParams.get('category') || '';

    // Base query now includes all new fields for the redesigned gallery
    let query = `
      SELECT
        gi.id,
        gi.title,
        gi.image_path,
        gi.is_featured,
        gi.likes,
        gi.designer_name,
        gi.designer_designation,
        gi.designer_dp_path,
        gi.designer_comment,
        gc.id AS category_id,
        gc.name AS category_name,
        gc.icon_name,
        gi.created_at
      FROM
        GalleryImages AS gi
      JOIN
        GalleryCategories AS gc ON gi.category_id = gc.id
      WHERE
        gi.title LIKE ?
    `;
    const params: (string | number)[] = [`%${searchTerm}%`];

    // Append category filter if provided (for admin table)
    if (categoryId) {
      query += ' AND gi.category_id = ?';
      params.push(parseInt(categoryId));
    }

    // Sort by featured status first, then by creation date
    query += ' ORDER BY gi.is_featured DESC, gi.created_at DESC;';
    
    const images = await db.query(query, params);
    return NextResponse.json(images);

  } catch (error) {
    console.error('[GALLERY_IMAGES_GET]', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}

// --- POST: UPLOADS A NEW IMAGE WITH ALL DETAILS ---
export async function POST(req: Request) {
  try {
    const formData = await req.formData();
    
    // Extract all fields from the form data
    const file = formData.get('file') as File | null;
    const designerDpFile = formData.get('designer_dp_file') as File | null;
    const title = formData.get('title') as string;
    const categoryId = formData.get('categoryId') as string;
    const is_featured = formData.get('is_featured') === 'true';
    const designer_name = formData.get('designer_name') as string;
    const designer_designation = formData.get('designer_designation') as string;
    const designer_comment = formData.get('designer_comment') as string;

    if (!file || !title || !categoryId) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    // 1. Handle main image upload
    const galleryDir = path.join(process.cwd(), 'public', 'gallery');
    await ensureDirExists(galleryDir);
    const filename = `${Date.now()}-${file.name.replace(/\s/g, '_')}`;
    const imagePath = `/gallery/${filename}`;
    const fullPath = path.join(galleryDir, filename);
    const buffer = Buffer.from(await file.arrayBuffer());
    await writeFile(fullPath, buffer);

    // 2. Handle designer DP upload (if provided)
    let designerDpPath: string | null = null;
    if (designerDpFile) {
        const dpDir = path.join(process.cwd(), 'public', 'gallery', 'dp');
        await ensureDirExists(dpDir);
        const dpFilename = `${Date.now()}-${designerDpFile.name.replace(/\s/g, '_')}`;
        designerDpPath = `/gallery/dp/${dpFilename}`;
        const dpFullPath = path.join(dpDir, dpFilename);
        const dpBuffer = Buffer.from(await designerDpFile.arrayBuffer());
        await writeFile(dpFullPath, dpBuffer);
    }

    // 3. Save all metadata to the database
    const insertQuery = `
        INSERT INTO GalleryImages 
        (title, image_path, category_id, status, is_featured, designer_name, designer_designation, designer_dp_path, designer_comment) 
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
    `;
    const insertParams = [
        title, imagePath, parseInt(categoryId), 'published', is_featured, 
        designer_name, designer_designation, designerDpPath, designer_comment
    ];
    await db.query(insertQuery, insertParams);

    return NextResponse.json({ message: 'Image uploaded successfully' }, { status: 201 });

  } catch (error: any) {
    console.error('[GALLERY_IMAGES_POST]', error);
    return NextResponse.json({ error: error.message || 'Internal Server Error' }, { status: 500 });
  }
}

// --- DELETE: REMOVES AN IMAGE AND ITS ASSETS ---
export async function DELETE(req: Request) {
    try {
      // Now expects designer_dp_path as well
      const { id, image_path, designer_dp_path } = await req.json();
  
      if (!id || !image_path) {
        return NextResponse.json({ error: 'Image ID and path are required' }, { status: 400 });
      }
  
      // 1. Delete the main image file
      const fullPath = path.join(process.cwd(), 'public', image_path);
      try { await unlink(fullPath); } 
      catch (e: any) { if (e.code !== 'ENOENT') throw e; }

      // 2. Delete the designer DP file if it exists
      if (designer_dp_path) {
        const dpFullPath = path.join(process.cwd(), 'public', designer_dp_path);
        try { await unlink(dpFullPath); }
        catch (e: any) { if (e.code !== 'ENOENT') throw e; }
      }
  
      // 3. Delete the image record from the database
      const query = 'DELETE FROM GalleryImages WHERE id = ?';
      await db.query(query, [id]);
  
      return NextResponse.json({ message: 'Image deleted successfully' }, { status: 200 });
  
    } catch (error: any) {
      console.error('[GALLERY_IMAGES_DELETE]', error);
      return NextResponse.json({ error: error.message || 'Internal Server Error' }, { status: 500 });
    }
}
