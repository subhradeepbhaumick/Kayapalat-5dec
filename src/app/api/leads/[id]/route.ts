import { NextResponse } from "next/server";
import { db } from "@/lib/db";

export async function GET(req: Request, { params }: any) {
  try {
    const rows: any = await db.query("SELECT * FROM leads WHERE lead_id = ?", [
      params.id,
    ]);
    return NextResponse.json(rows[0] || null);
  } catch (err) {
    return NextResponse.json({ error: err }, { status: 500 });
  }
}
export async function PUT(req: Request, { params }: any) {
  try {
    const body = await req.json();

    let query = "UPDATE leads SET ";
    let values = [];

    Object.keys(body).forEach((key) => {
      query += `${key} = ?, `;
      values.push(body[key]);
    });

    query = query.slice(0, -2);
    query += " WHERE lead_id = ?";
    values.push(params.id);

    await db.query(query, values);

    return NextResponse.json({ message: "Client updated" });
  } catch (err) {
    return NextResponse.json({ error: err }, { status: 500 });
  }
}

export async function DELETE(req: Request, { params }: any) {
  try {
    await pool.query("DELETE FROM leads WHERE lead_id = ?", [params.id]);
    return NextResponse.json({ message: "Client deleted" });
  } catch (err) {
    return NextResponse.json({ error: err }, { status: 500 });
  }
}
