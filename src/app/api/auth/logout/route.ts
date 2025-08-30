import { NextResponse } from 'next/server';

export async function POST() {
  try {
    // clear the token cookie (HttpOnly) so middleware can't read it anymore
    const res = NextResponse.json({ message: 'Logged out successfully' });
    res.cookies.set('token', '', {
      httpOnly: true,
      path: '/',
      maxAge: 0,
      sameSite: 'lax'
    });
    return res;
  } catch (error) {
    console.error('Logout error:', error);
    return NextResponse.json(
      { error: 'Failed to logout' },
      { status: 500 }
    );
  }
}