import { NextResponse } from 'next/server';
import db from '@/lib/db';

export async function POST(request: Request) {
  try {
    const {
      client_name,
      client_email,
      client_phone,
      client_address,
      project_type,
      bhk_type,
      selected_package,
      room_details,
      total_estimate,
      breakdown,
      timeline,
      budget_range,
      location
    } = await request.json();
    
    const result = await db.query(`
      INSERT INTO project_estimates (
        client_name, client_email, client_phone, client_address,
        project_type, bhk_type, selected_package, room_details,
        total_estimate, breakdown, timeline, budget_range, location
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `, [
      client_name, client_email, client_phone, client_address,
      project_type, bhk_type, selected_package, JSON.stringify(room_details),
      total_estimate, JSON.stringify(breakdown), timeline, budget_range, location
    ]);
    
    return NextResponse.json({ 
      success: true, 
      estimate_id: result.insertId,
      message: 'Estimate saved successfully'
    });
  } catch (error) {
    console.error('Error saving estimate:', error);
    return NextResponse.json(
      { error: 'Failed to save estimate' },
      { status: 500 }
    );
  }
}

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const email = searchParams.get('email');
    
    let query = 'SELECT * FROM project_estimates';
    const params = [];
    
    if (email) {
      query += ' WHERE client_email = ?';
      params.push(email);
    }
    
    query += ' ORDER BY created_at DESC';
    
    const estimates = await db.query(query, params);
    
    // Parse JSON fields
    const parsedEstimates = estimates.map(estimate => ({
      ...estimate,
      room_details: JSON.parse(estimate.room_details || '{}'),
      breakdown: JSON.parse(estimate.breakdown || '{}')
    }));
    
    return NextResponse.json(parsedEstimates);
  } catch (error) {
    console.error('Error fetching estimates:', error);
    return NextResponse.json(
      { error: 'Failed to fetch estimates' },
      { status: 500 }
    );
  }
}