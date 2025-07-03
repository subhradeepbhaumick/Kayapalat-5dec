import { NextResponse } from 'next/server';
import { db } from '@/lib/db';

export async function GET() {
  try {
    const accessories = await db.query('SELECT * FROM accessory_prices ORDER BY room_type, accessory_name');
    return NextResponse.json(accessories);
  } catch (error) {
    console.error('Error fetching accessory prices:', error);
    return NextResponse.json(
      { error: 'Failed to fetch accessory prices' },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const { accessory_name, room_type, price } = await request.json();
    
    const result = await db.query(
      'INSERT INTO accessory_prices (accessory_name, room_type, price) VALUES (?, ?, ?) ON DUPLICATE KEY UPDATE price = ?',
      [accessory_name, room_type, price, price]
    );
    
    return NextResponse.json({ success: true, id: result.insertId });
  } catch (error) {
    console.error('Error updating accessory price:', error);
    return NextResponse.json(
      { error: 'Failed to update accessory price' },
      { status: 500 }
    );
  }
}