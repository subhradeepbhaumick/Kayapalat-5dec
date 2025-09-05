import { NextResponse } from 'next/server';
import { writeFile, unlink } from 'fs/promises';
import path from 'path';
import { db } from '@/lib/db'; // Your database connection utility

// --- GET: Fetch all career applications (for your admin panel) ---
export async function GET() {
  try {
    const applications = await db.query('SELECT * FROM careers ORDER BY created_at DESC');
    return NextResponse.json(applications);
  } catch (error) {
    console.error("Failed to fetch applications:", error);
    return NextResponse.json({ error: "Failed to fetch applications." }, { status: 500 });
  }
}

// --- POST: Submit a new application (for the careers page form) ---
export async function POST(request: Request) {
  try {
    const formData = await request.formData();

    const fullName = formData.get('fullName') as string;
    const phoneNumber = formData.get('phoneNumber') as string;
    const role = formData.get('role') as string;
    const about = formData.get('about') as string;
    const resumeFile = formData.get('resume') as File;

    if (!fullName || !phoneNumber || !role || !resumeFile) {
      return NextResponse.json({ error: "Missing required fields." }, { status: 400 });
    }
     if (resumeFile.size > 5 * 1024 * 1024) { // 5MB limit
        return NextResponse.json({ error: "Resume file size exceeds 5MB." }, { status: 400 });
    }

    // --- 1. Save Resume File ---
    const buffer = Buffer.from(await resumeFile.arrayBuffer());
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    const originalFilename = resumeFile.name.replace(/\s+/g, '_');
    const newFilename = uniqueSuffix + '-' + originalFilename;
    const savePath = path.join(process.cwd(), 'public/resumes', newFilename);
    const resumePublicPath = `/resumes/${newFilename}`;

    await writeFile(savePath, buffer);

    // --- 2. Save Application Data to Database using SQL ---
    const sql = `
      INSERT INTO careers (full_name, phone_number, role, about_applicant, resume_path, created_at)
      VALUES (?, ?, ?, ?, ?, NOW())
    `;
    const params = [fullName, phoneNumber, role, about, resumePublicPath];

    const result = await db.query(sql, params);

    return NextResponse.json({ 
        message: "Application submitted successfully!",
        applicationId: (result as any).insertId // Assuming your db utility returns insertId
    }, { status: 201 });

  } catch (error) {
    console.error("Career application POST error:", error);
    return NextResponse.json({ error: "An unexpected error occurred while submitting." }, { status: 500 });
  }
}

// --- DELETE: Remove an application (for your admin panel) ---
export async function DELETE(request: Request) {
    try {
        const { id } = await request.json();

        if (!id) {
            return NextResponse.json({ error: "Application ID is required." }, { status: 400 });
        }

        // --- 1. Find the application to get the resume path ---
        const findSql = 'SELECT resume_path FROM careers WHERE id = ?';
        const applications = await db.query(findSql, [id]);

        if (applications.length === 0) {
            return NextResponse.json({ error: "Application not found." }, { status: 404 });
        }
        
        const resumePath = applications[0].resume_path;

        // --- 2. Delete the physical resume file from the server ---
        if (resumePath) {
            const filePath = path.join(process.cwd(), 'public', resumePath);
            try {
                await unlink(filePath); // Deletes the file
            } catch (fileError) {
                // Log the error but don't stop the process, as the DB record is more important
                console.error(`Failed to delete resume file: ${filePath}`, fileError);
            }
        }

        // --- 3. Delete the application record from the database ---
        const deleteSql = 'DELETE FROM careers WHERE id = ?';
        await db.query(deleteSql, [id]);

        return NextResponse.json({ message: "Application deleted successfully." });

    } catch (error) {
        console.error("Failed to delete application:", error);
        return NextResponse.json({ error: "Failed to delete application." }, { status: 500 });
    }
}

