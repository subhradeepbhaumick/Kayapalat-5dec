import { NextResponse } from "next/server";

export async function GET() {
  const clients = [
    { id: 1, name: "Amit", email: "amit@gmail.com" },
    { id: 2, name: "Priya", email: "priya@gmail.com" }
  ];

  return NextResponse.json({ clients });
}
