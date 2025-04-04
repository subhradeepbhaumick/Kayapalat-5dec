import { Connect } from '@/dbConfig/dbConfig';
import User from '@/models/userModel';
import { NextRequest, NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import { sendEmail } from '@/helpers/mailer';

export async function POST(req: NextRequest) {
  try {
    console.log("🔗 Connecting to MongoDB...");
    await Connect(); // Establish DB connection
    console.log("✅ MongoDB Connected Successfully");

    const reqBody = await req.json();
    console.log("🔎 Request Body:", reqBody);

    const { username, email, password, phone, about } = reqBody;

    // ✅ Check if all required fields are provided
    if (!username || !email || !password || !phone) {
      return NextResponse.json(
        { error: "⚠️ All fields are required" },
        { status: 400 }
      );
    }

    console.log("🔍 Checking if user already exists...");
    const user = await User.findOne({ email });
    if (user) {
      return NextResponse.json(
        { error: "❗️ User already exists" },
        { status: 400 }
      );
    }

    console.log("🔐 Hashing password...");
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    console.log("📝 Creating new user...");
    const newUser = new User({
      username,
      email,
      phone,
      about,
      password: hashedPassword,
    });

    const savedUser = await newUser.save();
    console.log("✅ User saved:", savedUser);

    console.log("📧 Sending verification email...");
    await sendEmail({ email, emailType: 'VERIFY', userId: savedUser._id });

    return NextResponse.json(
      {
        message: "🎉 User Registered Successfully!",
        success: true,
        savedUser,
      },
      { status: 201 }
    );
  } catch (error: any) {
    console.error("❗️ Internal Server Error:", error.message);
    return NextResponse.json(
      { error: error.message || "Internal Server Error" },
      { status: 500 }
    );
  }
}
