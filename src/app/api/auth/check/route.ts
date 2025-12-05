import { NextResponse } from "next/server";
import jwt from "jsonwebtoken";

export async function GET(req: Request) {
  try {
    const authHeader = req.headers.get("authorization");

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return NextResponse.json(
        { error: "Unauthorized: Missing token" },
        { status: 401 }
      );
    }

    const token = authHeader.split(" ")[1];

    let decoded: any;
    try {
      decoded = jwt.verify(token, process.env.JWT_SECRET!);
    } catch (err) {
      return NextResponse.json(
        { error: "Invalid or expired token" },
        { status: 401 }
      );
    }

    return NextResponse.json({
      user: {
        id: decoded.id,
        name: decoded.name,
        email: decoded.email,
        role: decoded.role,
        phone: decoded.phone,
        whatsapp: decoded.whatsapp,
      },
    });
  } catch (error) {
    console.error("Auth check failed:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
