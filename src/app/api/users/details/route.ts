import { NextResponse } from "next/server";
import jwt from "jsonwebtoken";
import { executeQuery } from "@/lib/db";

export async function GET(req: Request) {
  try {
    const authHeader = req.headers.get("authorization");
    const token = authHeader?.startsWith("Bearer ") ? authHeader.substring(7) : null;

    if (!token) {
      return NextResponse.json(
        { error: "Unauthorized: Missing token" },
        { status: 401 }
      );
    }

    const decoded: any = jwt.verify(token, process.env.JWT_SECRET!);

    const [users] = await executeQuery(
      "SELECT user_id, name, email, phone, role, profile_pic FROM users_kp_db WHERE user_id = ?",
      [decoded.user_id]
    );

    if (!users || users.length === 0) {
      return NextResponse.json(
        { error: "User not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({ user: users[0] });
  } catch (error) {
    console.error("User details error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
