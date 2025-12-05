import { NextResponse } from "next/server";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { user_id, referCode } = body;

    console.log("Received data:", body);

    return NextResponse.json({
      success: true,
      message: "Referral processed successfully!",
    });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}
