import { NextResponse } from 'next/server';

export async function POST() {
  try {
    // In a JWT-based authentication system, logout is handled client-side
    // by removing the token from local storage
    return NextResponse.json({ message: 'Logged out successfully' });
  } catch (error) {
    console.error('Logout error:', error);
    return NextResponse.json(
      { error: 'Failed to logout' },
      { status: 500 }
    );
  }
} 