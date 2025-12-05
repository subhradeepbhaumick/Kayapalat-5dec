import { NextRequest, NextResponse } from 'next/server';
import { executeQuery } from '@/lib/db';

export async function GET() {
  try {
    const query = `
      SELECT user_id as id, name
      FROM users_kp_db
      WHERE role = 'sales_admin'
      ORDER BY name
    `;

    const [rows] = await executeQuery(query);

    return NextResponse.json({
      success: true,
      data: rows
    });

  } catch (error) {
    console.error('Error fetching admins:', error);
    return NextResponse.json(
      { error: 'Failed to fetch admins' },
      { status: 500 }
    );
  }
}
