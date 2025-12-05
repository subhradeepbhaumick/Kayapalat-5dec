import { NextResponse } from "next/server";

export async function POST(req: Request) {
  const form = await req.formData();
  const clientId = form.get("clientId");
  const file = form.get("file");
  const description = form.get("description");

  console.log("Design posted for client:", clientId);

  return NextResponse.json({
    success: true,
    message: "Design uploaded successfully!",
  });
}
