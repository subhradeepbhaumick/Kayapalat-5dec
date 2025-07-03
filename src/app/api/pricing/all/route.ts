import { NextResponse } from 'next/server';
import { db } from '@/lib/db';

export async function GET() {
  try {
    const [rooms, accessories, features, packages] = await Promise.all([
      db.query('SELECT * FROM room_prices'),
      db.query('SELECT * FROM accessory_prices'),
      db.query('SELECT * FROM feature_prices'),
      db.query('SELECT * FROM package_multipliers')
    ]);
    
    return NextResponse.json({
      rooms,
      accessories,
      features,
      packages
    });
  } catch (error) {
    console.error('Error fetching all pricing data:', error);
    return NextResponse.json(
      { error: 'Failed to fetch pricing data' },
      { status: 500 }
    );
  }
}