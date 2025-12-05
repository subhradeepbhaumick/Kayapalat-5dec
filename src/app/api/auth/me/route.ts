import { NextResponse, NextRequest } from "next/server";
import jwt from "jsonwebtoken";

export async function GET(req: NextRequest) {
  try {
    const authHeader = req.headers.get("authorization");
    const token = authHeader?.startsWith("Bearer ") ? authHeader.substring(7) : null;

    if (!token) {
      return NextResponse.json(
        { error: "Not authenticated" },
        { status: 401 }
      );
    }

    const decoded: any = jwt.verify(token, process.env.JWT_SECRET!);

    return NextResponse.json({
      success: true,
      user: {
        user_id: decoded.user_id,
        name: decoded.name,
        email: decoded.email,
        role: decoded.role,
      }
    });

  } catch (err) {
    return NextResponse.json(
      { error: "Invalid token" },
      { status: 401 }
    );
  }
}
