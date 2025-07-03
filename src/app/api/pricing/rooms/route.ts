import { NextResponse } from 'next/server';
import { db } from '@/lib/db'; // Your database connection

export async function GET() {
  try {
    const rooms = await db.query('SELECT * FROM room_prices ORDER BY room_type');
    return NextResponse.json(rooms);
  } catch (error) {
    console.error('Error fetching room prices:', error);
    return NextResponse.json(
      { error: 'Failed to fetch room prices' },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const { room_type, base_price } = await request.json();
    
    const result = await db.query(
      'INSERT INTO room_prices (room_type, base_price) VALUES (?, ?) ON DUPLICATE KEY UPDATE base_price = ?',
      [room_type, base_price, base_price]
    );
    
    return NextResponse.json({ success: true, id: result.insertId });
  } catch (error) {
    console.error('Error updating room price:', error);
    return NextResponse.json(
      { error: 'Failed to update room price' },
      { status: 500 }
    );
  }
}