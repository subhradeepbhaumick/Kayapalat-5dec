import { NextRequest, NextResponse } from 'next/server';
import { executeQuery } from '@/lib/db';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const agentId = searchParams.get('agent_id');

    if (!agentId) {
      return NextResponse.json(
        { success: false, error: 'Agent ID is required' },
        { status: 400 }
      );
    }

    // Query to get bank details from agent_bank_details table
    const [rows] = await executeQuery(
      'SELECT account_holder_name, upi_id, bank_name, account_number, ifsc_code, qr_code FROM agent_bank_details WHERE agent_id = ?',
      [agentId]
    );

    if (rows.length === 0) {
      return NextResponse.json(
        { success: false, error: 'No bank details found for this agent' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      data: rows[0]
    });

  } catch (error) {
    console.error('Error fetching agent bank details:', error);
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    );
  }
}
