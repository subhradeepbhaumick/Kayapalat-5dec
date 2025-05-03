import { executeQuery } from '@/lib/db';
import { NextRequest, NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import { sendEmail } from '@/helpers/mailer';

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
    console.log("Starting signup process...");
    const reqBody = await req.json();
    console.log("Request body received:", reqBody);

    const { first_name, last_name, email, password, phone, address, message } = reqBody;

    // ✅ Check if all required fields are provided
    if (!first_name || !email || !password || !phone) {
      console.log("Missing required fields");
      return NextResponse.json(
        { error: "⚠️ All fields are required" },
        { status: 400 }
      );
    }

    console.log("Checking if user exists...");
    const [existingUsers] = await executeQuery<User>(
      'SELECT * FROM users WHERE email = ? AND deleted_at IS NULL',
      [email]
    );

    if (existingUsers && existingUsers.length > 0) {
      console.log("User already exists");
      return NextResponse.json(
        { error: "❗️ User already exists" },
        { status: 400 }
      );
    }

    console.log("Hashing password...");
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    console.log("Creating new user...");
    const query = `INSERT INTO users 
      (type, first_name, last_name, email, password, phone, address, message, created_at, updated_at) 
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, NOW(), NOW())`;
    
    const params = ['owner', first_name, last_name, email, hashedPassword, phone, address, message];
    
    console.log("Executing query:", query);
    console.log("With parameters:", params);

    const [_, result] = await executeQuery(
      query,
      params
    );

    const userId = result.insertId;
    console.log("User saved with ID:", userId);

    console.log("Sending verification email...");
    await sendEmail({ email, emailType: 'VERIFY', userId });

    return NextResponse.json(
      {
        message: "🎉 User Registered Successfully!",
        success: true,
        userId,
      },
      { status: 201 }
    );
  } catch (error: any) {
    console.error("Detailed error:", {
      message: error.message,
      stack: error.stack,
      code: error.code,
      errno: error.errno,
      sqlState: error.sqlState,
      sqlMessage: error.sqlMessage
    });
    return NextResponse.json(
      { error: error.message || "Internal Server Error" },
      { status: 500 }
    );
  }
}
