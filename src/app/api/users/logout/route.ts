import { Connect } from '@/dbConfig/dbConfig';
import { NextRequest, NextResponse } from 'next/server';


export async function GET(req: NextRequest) {
    try {
      console.log("🔗 Connecting to MongoDB...");
      await Connect(); // Establish DB connection
  
      console.log("✅ MongoDB Connected Successfully");
      
        const response = NextResponse.json({ message: "👋🏼 You are now logged out", 
        success : true
        });

        response.cookies.set("token", "", {
            httpOnly: true,
            sameSite: "strict",
            expires: new Date(0)
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