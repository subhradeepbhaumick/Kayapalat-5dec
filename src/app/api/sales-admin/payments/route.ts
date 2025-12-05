import { NextRequest, NextResponse } from 'next/server';
import { executeQuery } from '@/lib/db';
import { decodeToken } from '@/lib/auth';

export async function GET(request: NextRequest) {
  try {
    const authHeader = request.headers.get('authorization');
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const token = authHeader.substring(7); // Remove 'Bearer ' prefix
    const decoded = decodeToken(token);
    if (!decoded || !decoded.user_id) {
      return NextResponse.json(
        { error: 'Invalid token' },
        { status: 401 }
      );
    }

    const userId = decoded.user_id;

    const query = `
      SELECT
        p.appointment_id as id,
        p.agent_id,
        a.agent_name,
        p.client_name,
        p.project_name,
        COALESCE(p.project_value, 0) as client_estimate,
        COALESCE(p.commission, 0) as commission,
        COALESCE(p.agent_share, 0) as agent_share,
        0 as agent_paid,
        COALESCE(p.agent_share, 0) as due,
        COALESCE(p.payment_status, 'Due') as payment_status
      FROM projects p
      LEFT JOIN agents a ON p.agent_id = a.agent_id
      WHERE p.admin_id = ?
      ORDER BY p.created_at DESC
    `;

    const [rows] = await executeQuery(query, [userId]);

    return NextResponse.json({
      success: true,
      data: rows
    });

  } catch (error) {
    console.error('Error fetching payments:', error);
    return NextResponse.json(
      { error: 'Failed to fetch payments' },
      { status: 500 }
    );
  }
}

export async function PUT(request: NextRequest) {
  try {
    const authHeader = request.headers.get('authorization');
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const token = authHeader.substring(7); // Remove 'Bearer ' prefix
    const decoded = decodeToken(token);
    if (!decoded || !decoded.user_id) {
      return NextResponse.json(
        { error: 'Invalid token' },
        { status: 401 }
      );
    }

    const userId = decoded.user_id;

    const { appointment_id, payment_status, agent_paid } = await request.json();

    if (!appointment_id || !payment_status) {
      return NextResponse.json(
        { error: 'Appointment ID and payment status are required' },
        { status: 400 }
      );
    }

    // Verify the project belongs to the logged-in admin
    const checkQuery = `SELECT admin_id FROM projects WHERE appointment_id = ?`;
    const [checkResult] = await executeQuery(checkQuery, [appointment_id]);

    if (checkResult.length === 0 || checkResult[0].admin_id !== userId) {
      return NextResponse.json(
        { error: 'Unauthorized or project not found' },
        { status: 403 }
      );
    }

    const updateQuery = `
      UPDATE projects
      SET payment_status = ?, agent_paid = ?
      WHERE appointment_id = ?
    `;

    await executeQuery(updateQuery, [payment_status, agent_paid, appointment_id]);

    return NextResponse.json({
      success: true,
      message: 'Payment status updated successfully'
    });

  } catch (error) {
    console.error('Error updating payment status:', error);
    return NextResponse.json(
      { error: 'Failed to update payment status' },
      { status: 500 }
    );
  }
}
