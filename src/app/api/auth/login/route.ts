import { NextResponse } from 'next/server';
import { executeQuery } from '@/lib/db';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

export async function POST(request: Request) {
  try {
    const { email, password } = await request.json();

    // Get user from database
    const [rows] = await executeQuery(
      `SELECT id, name, email, phone, role, whatsapp, password_hash 
       FROM users WHERE email = ?`,
      [email]
    );

    if (!rows || rows.length === 0) {
      return NextResponse.json(
        { error: 'Invalid credentials' },
        { status: 401 }
      );
    }

    const user = rows[0];

    // Password check (using password_hash column)
    const isValidPassword = await bcrypt.compare(password, user.password_hash);
    if (!isValidPassword) {
      return NextResponse.json(
        { error: 'Invalid credentials' },
        { status: 401 }
      );
    }

    // JWT payload
    const payload = {
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role,
      phone: user.phone,
      whatsapp: user.whatsapp
    };

    // Generate JWT token
    const token = jwt.sign(
      payload,
      process.env.JWT_SECRET || 'your-secret-key',
      { expiresIn: '1d' }
    );

    // Return token in JSON for localStorage only
    return NextResponse.json({
      success: true,
      message: "Login successful",
      token,
      user: payload
    });
    
  } catch (error) {
    console.error('Login error:', error);
    return NextResponse.json(
      { error: 'Failed to login' },
      { status: 500 }
    );
  }
}
