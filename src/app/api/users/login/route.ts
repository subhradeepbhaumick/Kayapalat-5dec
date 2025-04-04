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
     

    const user = await User.findOne({ email });
    if(!user){
      return NextResponse.json({ error: "❗️ User not found" }, { status: 400 });
    }

    console.log("User found");

    const validPassword = await bcrypt.compare(password, user.password);


    if(!validPassword){
      return NextResponse.json({ error: "❗️ Invalid Password" }, { status: 600 });
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

    const response = NextResponse.json({
        message: "🎉 Login Successful",
        success: true
    })

    response.cookies.set("token", accessToken, {
        httpOnly: true,
        sameSite: "strict",
    });

    return response;

  } catch (error: any) {
    console.error("❗️ Internal Server Error:", error.message);
    return NextResponse.json(
      { error: error.message || "Internal Server Error" },
      { status: 500 }
    );
  }
}