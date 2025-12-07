import { NextRequest, NextResponse } from 'next/server';
import { executeQuery } from '@/lib/db';
import { writeFile, mkdir } from 'fs/promises';
import path from 'path';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const agentId = searchParams.get('agent_id');
    const appointmentId = searchParams.get('appointment_id');

    if (!agentId && !appointmentId) {
      return NextResponse.json(
        { error: 'Agent ID or Appointment ID is required' },
        { status: 400 }
      );
    }

    let query = `
      SELECT t_id, appointment_id, agent_id, admin_id, transaction_proof, date
      FROM transaction_proof
    `;
    let params: any[] = [];

    if (appointmentId) {
      query += ` WHERE appointment_id = ?`;
      params = [appointmentId];
    } else {
      query += ` WHERE agent_id = ?`;
      params = [agentId];
    }

    query += ` ORDER BY date DESC`;

    const [rows] = await executeQuery(query, params);

    // Format the date to DD/MM/YYYY
    const formattedRows = rows.map((row: any) => ({
      ...row,
      date: new Date(row.date).toLocaleDateString('en-GB')
    }));

    return NextResponse.json({
      success: true,
      data: formattedRows
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
    const appointmentId = formData.get('appointment_id') as string;
    const agentId = formData.get('agent_id') as string;
    const adminId = formData.get('admin_id') as string;
    const file = formData.get('file') as File;

    if (!appointmentId || !agentId || !adminId || !file) {
      return NextResponse.json(
        { error: 'Appointment ID, Agent ID, Admin ID and file are required' },
        { status: 400 }
      );
    }

    // Use full appointment_id, agent_id, admin_id as strings

    // Create transaction_proof directory if it doesn't exist
    const uploadsDir = path.join(process.cwd(), 'public', 'transaction_proof');
    await mkdir(uploadsDir, { recursive: true });

    // Generate unique filename
    const timestamp = Date.now();
    const filename = `${appointmentId}_${agentId}_${timestamp}_${file.name}`;
    const filePath = path.join(uploadsDir, filename);

    // Save file
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);
    await writeFile(filePath, buffer);

    // Save to database
    const relativePath = `/transaction_proof/${filename}`;
    const insertQuery = `
      INSERT INTO transaction_proof (appointment_id, agent_id, admin_id, transaction_proof, date)
      VALUES (?, ?, ?, ?, NOW())
    `;

    await executeQuery(insertQuery, [appointmentId, agentId, adminId, relativePath]);

    return NextResponse.json({
      success: true,
      message: 'Proof uploaded successfully'
    });

  } catch (error) {
    console.error('Error uploading proof:', error);
    const errorMessage = error instanceof Error ? error.message : String(error);
    return NextResponse.json(
      { error: `Failed to upload proof: ${errorMessage}` },
      { status: 500 }
    );
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('t_id');

    if (!id) {
      return NextResponse.json(
        { error: 'Proof ID is required' },
        { status: 400 }
      );
    }

    const deleteQuery = `
      DELETE FROM transaction_proof WHERE t_id = ?
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
