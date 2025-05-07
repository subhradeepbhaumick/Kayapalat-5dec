import { executeQuery } from '@/lib/db';
import { NextRequest, NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { debug } from 'console';

interface User {
  id: number;
  role: string;
  first_name: string;
  last_name: string;
  username: string;
  email: string;
  password: string;
  phone: string;
  address: string | null;
  message: string | null;
}

export async function POST(req: NextRequest) {
  try {
    const reqBody = await req.json();
    const { login, password } = reqBody;
    console.log("🔎 Login attempt for:", login);

    // Find user by email or username
    const [users] = await executeQuery<User>(
      'SELECT * FROM users WHERE (email = ? OR username = ?) AND deleted_at IS NULL',
      [login, login]
    );

    if (!users || users.length === 0) {
      console.log("❌ User not found");
      return NextResponse.json({ 
        error: "No account found with that email or username.",
        code: "USER_NOT_FOUND",
        success: false 
      }, { status: 401 });
    }
debugger;
    const user = users[0];
    console.log("✅ User found");
    console.log("🔍 Password comparison details:");
    console.log("Input password:", password);
    console.log("Stored hash:", user.password);
    console.log("Hash length:", user.password.length);
    console.log("Hash type:", typeof user.password);
    console.log(bycrypt.hashSync(password, 0))
    const validPassword = await bcrypt.compare(password, user.password);
    console.log("Password comparison result:", validPassword);
    console.log();
    if (!validPassword) {
      console.log("❌ Invalid password");
      return NextResponse.json({ 
        error: "Incorrect password for this account.",
        code: "WRONG_PASSWORD",
        success: false 
      }, { status: 401 });
    }

    console.log("🔐 Generating JWT...");
    const token = {
      id: user.id,
      email: user.email,
      username: user.username,
      role: user.role,
      name: `${user.first_name} ${user.last_name}`
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
        username: user.username,
        role: user.role,
        name: `${user.first_name} ${user.last_name}`,
        phone: user.phone
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

    return response;
  } catch (error: any) {
    console.error("❗️ Login error:", error);
    return NextResponse.json({ 
      error: "An error occurred during login. Please try again.",
      success: false 
    }, { status: 500 });
  }
}