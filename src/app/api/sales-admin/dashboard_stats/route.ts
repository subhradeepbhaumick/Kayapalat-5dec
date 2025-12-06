import { NextRequest, NextResponse } from 'next/server';
import jwt from 'jsonwebtoken';
import { query } from '@/lib/db';

export async function GET(req: NextRequest) {
  try {
    const token = req.headers.get('authorization')?.replace('Bearer ', '');
    if (!token) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET!);
    if (!decoded || typeof decoded === 'string') {
      return NextResponse.json({ error: 'Invalid token' }, { status: 401 });
    }

    const adminId = decoded.id;

    // Get active agents count under this admin
    const agentsResult = await query(
      'SELECT COUNT(*) as count FROM agents WHERE admin_id = ?',
      [adminId]
    );
    const activeAgents = parseInt(agentsResult[0].count);

    // Get total leads count under this admin (total projects associated with admin_id)
    const leadsResult = await query(
      'SELECT COUNT(*) as count FROM projects WHERE admin_id = ?',
      [adminId]
    );
    const totalLeads = parseInt(leadsResult[0].count);

    // Get total revenue (sum of project_value from projects associated with this admin)
    const revenueResult = await query(
      'SELECT COALESCE(SUM(project_value), 0) as total FROM projects WHERE admin_id = ?',
      [adminId]
    );
    const totalRevenue = parseFloat(revenueResult[0].total);

    return NextResponse.json({
      activeAgents,
      totalLeads,
      totalRevenue
    });
  } catch (error) {
    console.error('Error fetching dashboard stats:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
