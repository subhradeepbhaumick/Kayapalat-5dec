import { Connect } from '@/dbConfig/dbConfig';
import User from '@/models/userModel';
import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
  try {
    console.log("🔗 Connecting to MongoDB...");
    await Connect(); // Establish DB connection

    const reqBody = await req.json();
    const {token} = reqBody;
    console.log("🔎 Request Body:", reqBody);
    console.log(token);
    
    const user = await User.findOne({verifyToken: token ,
        verifyTokenExpiry: { $gt: Date.now() }
    })
    
     if(!user) {
        return NextResponse.json(
            { error: "Invalid or Expired Token" },
            { status: 400 }
          );
     }
     console.log(user);
     user.isVerified = true;
     user.verifyToken = undefined;
     user.verifyTokenExpiry = undefined;
     await user.save();

    return NextResponse.json(
      { message: "Email Verified Successfully",
        success : true
       },
      { status: 200 }
    );

  }
  catch (error: any) {
    console.error("❗️ Internal Server Error:", error.message);
    return NextResponse.json(
      { error: error.message || "Internal Server Error" },
      { status: 500 }
    );
  }
}

