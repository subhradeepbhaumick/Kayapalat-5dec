import { NextRequest, NextResponse } from 'next/server';
import jwt from 'jsonwebtoken';
import mysql from 'mysql2/promise';

const pool = mysql.createPool({
  host: process.env.DB_HOST || 'localhost',
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || 'Tony@26062002',
  database: process.env.DB_NAME || 'kayapalat_db',
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
});

export async function GET(request: NextRequest) {
  try {
    const token = request.headers.get('authorization')?.replace('Bearer ', '');
    if (!token) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'your-secret-key') as { user_id: string };
    const userId = decoded.user_id;

    const { searchParams } = new URL(request.url);
    const appointmentId = searchParams.get('appointment_id');

    if (!appointmentId) {
      return NextResponse.json({ error: 'appointment_id is required' }, { status: 400 });
    }

    // Check if user has access to this appointment (either agent or admin)
    const [agentRows] = await pool.execute('SELECT agent_id FROM agents WHERE agent_id = ?', [userId]);
    const isAgent = (agentRows as any[]).length > 0;

    let accessQuery;
    let accessParams;
    if (isAgent) {
      accessQuery = 'SELECT appointment_id FROM projects WHERE appointment_id = ? AND agent_id = ?';
      accessParams = [appointmentId, userId];
    } else {
      accessQuery = 'SELECT appointment_id FROM projects WHERE appointment_id = ? AND admin_id = ?';
      accessParams = [appointmentId, userId];
    }

    const [accessRows] = await pool.execute(accessQuery, accessParams);
    if ((accessRows as any[]).length === 0) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 403 });
    }

    // Fetch remarks
    const [rows] = await pool.execute(
      'SELECT remark_id, remarks, created_at FROM remarks WHERE appointment_id = ? ORDER BY created_at DESC',
      [appointmentId]
    );

    const remarks = (rows as any[]).map(row => ({
      id: row.remark_id,
      date: row.created_at.toISOString().split('T')[0], // YYYY-MM-DD
      time: row.created_at.toTimeString().split(' ')[0], // HH:MM:SS
      comment: row.remarks,
    }));

    return NextResponse.json({ remarks });
  } catch (error) {
    console.error('Error fetching remarks:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const token = request.headers.get('authorization')?.replace('Bearer ', '');
    if (!token) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'your-secret-key') as { user_id: string };
    const userId = decoded.user_id;

    const body = await request.json();
    const { appointment_id, remark } = body;

    if (!appointment_id || !remark) {
      return NextResponse.json({ error: 'appointment_id and remark are required' }, { status: 400 });
    }

    // Check if user has access to this appointment
    const [agentRows] = await pool.execute('SELECT agent_id FROM agents WHERE agent_id = ?', [userId]);
    const isAgent = (agentRows as any[]).length > 0;

    let accessQuery;
    let accessParams;
    if (isAgent) {
      accessQuery = 'SELECT appointment_id FROM projects WHERE appointment_id = ? AND agent_id = ?';
      accessParams = [appointment_id, userId];
    } else {
      accessQuery = 'SELECT appointment_id FROM projects WHERE appointment_id = ? AND admin_id = ?';
      accessParams = [appointment_id, userId];
    }

    const [accessRows] = await pool.execute(accessQuery, accessParams);
    if ((accessRows as any[]).length === 0) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 403 });
    }

    // Insert new remark
    await pool.execute(
      'INSERT INTO remarks (appointment_id, remarks, created_at) VALUES (?, ?, NOW())',
      [appointment_id, remark]
    );

    return NextResponse.json({ message: 'Remark added successfully' });
  } catch (error) {
    console.error('Error adding remark:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
