import { executeQuery } from '@/lib/db';
import { NextRequest, NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

interface User {
  id: number;
  type: string;
  first_name: string;
  last_name: string;
  email: string;
  password: string;
  phone: string;
  address: string | null;
  message: string | null;
}

export async function POST(req: NextRequest) {
  try {
    const reqBody = await req.json();
    const { email, password } = reqBody;
    console.log("🔎 Request Body:", reqBody);

    // Find user by email
    const [users] = await executeQuery<User>(
      'SELECT * FROM users WHERE email = ? AND deleted_at IS NULL',
      [email]
    );

    if (!users || users.length === 0) {
      return NextResponse.json({ error: "❗️ User not found" }, { status: 400 });
    }

    const user = users[0];
    console.log("User found");

    const validPassword = await bcrypt.compare(password, user.password);

    if (!validPassword) {
      return NextResponse.json({ error: "❗️ Invalid Password" }, { status: 401 });
    }

    console.log("🔐 Generating JWT...");
    const token = {
      id: user.id,
      email: user.email,
      type: user.type
    };

    if (!process.env.JWT_SECRET) {
      throw new Error("JWT_SECRET is not defined");
    }
    const accessToken = jwt.sign(token, process.env.JWT_SECRET, { expiresIn: "1h" });

    // Create the response
    const response = NextResponse.json({
      message: "🎉 Login Successful",
      success: true,
      user: {
        id: user.id,
        email: user.email,
        type: user.type
      }
    });

    // Set the cookie with proper options
    response.cookies.set({
      name: "token",
      value: accessToken,
      httpOnly: true,
      sameSite: "lax",
      secure: process.env.NODE_ENV === "production",
      maxAge: 3600, // 1 hour in seconds
      path: "/",
      domain: process.env.NODE_ENV === "production" ? ".kayapalat.com" : "localhost"
    });

    // Also set a loggedIn cookie for client-side checks
    response.cookies.set({
      name: "loggedIn",
      value: "true",
      sameSite: "lax",
      secure: process.env.NODE_ENV === "production",
      maxAge: 3600,
      path: "/",
      domain: process.env.NODE_ENV === "production" ? ".kayapalat.com" : "localhost"
    });

    console.log("Cookies set successfully");

    return response;

  } catch (error: any) {
    console.error("❗️ Internal Server Error:", error.message);
    return NextResponse.json(
      { error: error.message || "Internal Server Error" },
      { status: 500 }
    );
  }
}