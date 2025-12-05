import { NextResponse } from "next/server";

export async function POST() {
  // For JWT authentication, logout is handled client-side by removing token from localStorage
  // No server-side action needed
  return NextResponse.json({ message: "Logged out successfully" });
}
