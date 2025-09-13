import { NextResponse } from 'next/server';
import { db } from '@/lib/db';

export async function GET() {
  try {
    const features = await db.query('SELECT * FROM package_multipliers ORDER BY package_name');
    return NextResponse.json(features);
  } catch (error) {
    console.error('Error fetching feature prices:', error);
    return NextResponse.json(
      { error: 'Failed to fetch feature prices' },
      { status: 500 }
    );
  }
}

// export async function POST(request: Request) {
//   try {
//     const { feature_name, price, applicable_rooms } = await request.json();
    
//     const result = await db.query(
//       'INSERT INTO feature_prices (feature_name, price, applicable_rooms) VALUES (?, ?, ?) ON DUPLICATE KEY UPDATE price = ?, applicable_rooms = ?',
//       [feature_name, price, JSON.stringify(applicable_rooms), price, JSON.stringify(applicable_rooms)]
//     );
    
//     return NextResponse.json({ success: true, id: result.insertId });
//   } catch (error) {
//     console.error('Error updating feature price:', error);
//     return NextResponse.json(
//       { error: 'Failed to update feature price' },
//       { status: 500 }
//     );
//   }
// }