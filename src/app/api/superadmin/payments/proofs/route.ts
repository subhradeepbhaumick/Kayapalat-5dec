import { NextRequest, NextResponse } from 'next/server';
import { executeQuery } from '@/lib/db';
import { writeFile, mkdir } from 'fs/promises';
import path from 'path';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const agentId = searchParams.get('agent_id');

    if (!agentId) {
      return NextResponse.json(
        { error: 'Agent ID is required' },
        { status: 400 }
      );
    }

    const query = `
      SELECT id, file_path, uploaded_at
      FROM transaction_proofs
      WHERE agent_id = ?
      ORDER BY uploaded_at DESC
    `;

    const [rows] = await executeQuery(query, [agentId]);

    return NextResponse.json({
      success: true,
      data: rows
    });

  } catch (error) {
    console.error('Error fetching proofs:', error);
    return NextResponse.json(
      { error: 'Failed to fetch proofs' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const agentId = formData.get('agent_id') as string;
    const file = formData.get('file') as File;

    if (!agentId || !file) {
      return NextResponse.json(
        { error: 'Agent ID and file are required' },
        { status: 400 }
      );
    }

    // Create uploads directory if it doesn't exist
    const uploadsDir = path.join(process.cwd(), 'public', 'uploads', 'proofs');
    await mkdir(uploadsDir, { recursive: true });

    // Generate unique filename
    const timestamp = Date.now();
    const filename = `${agentId}_${timestamp}_${file.name}`;
    const filePath = path.join(uploadsDir, filename);

    // Save file
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);
    await writeFile(filePath, buffer);

    // Save to database
    const relativePath = `/uploads/proofs/${filename}`;
    const insertQuery = `
      INSERT INTO transaction_proofs (agent_id, file_path, uploaded_at)
      VALUES (?, ?, NOW())
    `;

    await executeQuery(insertQuery, [agentId, relativePath]);

    return NextResponse.json({
      success: true,
      message: 'Proof uploaded successfully'
    });

  } catch (error) {
    console.error('Error uploading proof:', error);
    return NextResponse.json(
      { error: 'Failed to upload proof' },
      { status: 500 }
    );
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json(
        { error: 'Proof ID is required' },
        { status: 400 }
      );
    }

    const deleteQuery = `
      DELETE FROM transaction_proofs WHERE id = ?
    `;

    await executeQuery(deleteQuery, [id]);

    return NextResponse.json({
      success: true,
      message: 'Proof deleted successfully'
    });

  } catch (error) {
    console.error('Error deleting proof:', error);
    return NextResponse.json(
      { error: 'Failed to delete proof' },
      { status: 500 }
    );
  }
}
