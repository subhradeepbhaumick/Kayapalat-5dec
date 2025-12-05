import { NextRequest, NextResponse } from 'next/server';
import { executeQuery } from '@/lib/db';

export async function GET() {
  try {
    const query = `
      SELECT agent_id, admin_id
      FROM agents
      ORDER BY agent_id
    `;

    const [rows] = await executeQuery(query);

    // Group by admin_id
    const adminAgentMap: Record<string, string[]> = {};
    rows.forEach((row: any) => {
      if (!adminAgentMap[row.admin_id]) {
        adminAgentMap[row.admin_id] = [];
      }
      adminAgentMap[row.admin_id].push(row.agent_id);
    });

    return NextResponse.json({
      success: true,
      data: adminAgentMap
    });

  } catch (error) {
    console.error('Error fetching agent-admin map:', error);
    return NextResponse.json(
      { error: 'Failed to fetch agent-admin map' },
      { status: 500 }
    );
  }
}
