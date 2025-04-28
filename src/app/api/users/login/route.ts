import { Connect } from '@/dbConfig/dbConfig';
import User from '@/models/userModel';
import { NextRequest, NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

export async function POST(req: NextRequest) {
  try {
    console.log("🔗 Connecting to MongoDB...");
    await Connect(); // Establish DB connection

    console.log("✅ MongoDB Connected Successfully");

    const reqBody = await req.json();
    const { email, password } = reqBody;
    console.log("🔎 Request Body:", reqBody);
     

    // Use Promise.all to prevent timing attacks
    const [user, dummyHash] = await Promise.all([
      User.findOne({ email }),
      bcrypt.hash('dummy', 10) // Perform a dummy hash operation
    ]);

    if(!user){
      return NextResponse.json({ error: "❗️ User not found" }, { status: 400 });
    }

    console.log("User found");

    const validPassword = await bcrypt.compare(password, user.password);

    if(!validPassword){
      return NextResponse.json({ error: "❗️ Invalid Password" }, { status: 401 });
    }

    console.log("🔐 Generating JWT...");
    const token = {
        id : user._id,
        username : user.username,
        email : user.email  
    }

    if (!process.env.JWT_SECRET) {
      throw new Error("JWT_SECRET is not defined");
    }
    const accessToken = jwt.sign(token, process.env.JWT_SECRET, { expiresIn: "1h" });

    // Create the response
    const response = NextResponse.json({
        message: "🎉 Login Successful",
        success: true,
        user: {
          id: user._id,
          username: user.username,
          email: user.email
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