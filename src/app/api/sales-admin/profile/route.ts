import { NextResponse } from "next/server";
import jwt from "jsonwebtoken";
import { executeQuery } from "@/lib/db";

export async function GET(request: Request) {
  try {
    // Read Authorization header
    const authHeader = request.headers.get("Authorization") || "";

    if (!authHeader.startsWith("Bearer ")) {
      return NextResponse.json(
        { message: "Unauthorized - No token provided" },
        { status: 401 }
      );
    }

    const token = authHeader.substring(7); // remove "Bearer "
    const decoded: any = jwt.verify(token, process.env.JWT_SECRET!);

    const adminId = decoded.admin_id || decoded.user_id || decoded.id;

    if (!adminId) {
      return NextResponse.json(
        { message: "Invalid token - Missing admin ID" },
        { status: 400 }
      );
    }

    // Fetch sales admin details
    const adminData: any = await executeQuery(
      "SELECT admin_id, admin_name, email, phone, role, profile_pic FROM admin WHERE admin_id = ? AND role = 'salesadmin'",
      [adminId]
    );

    if (adminData.length === 0) {
      return NextResponse.json(
        { message: "Sales Admin not found" },
        { status: 404 }
      );
    }

    const admin = adminData[0];

    return NextResponse.json({
      admin: {
        id: admin.admin_id,
        name: admin.admin_name,
        email: admin.email,
        phone: admin.phone,
        role: admin.role,
        profile_pic: admin.profile_pic || "/user.png",
      },
    });
  } catch (error: any) {
    console.error("SALES ADMIN PROFILE API ERROR:", error);
    return NextResponse.json(
      { message: "Server error", error: error.message },
      { status: 500 }
    );
  }
}
