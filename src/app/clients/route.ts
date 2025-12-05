import { NextResponse } from "next/server";

export async function GET(_, { params }) {
  const { id } = params;

  const data = {
    1: { id: 1, name: "Amit", requirements: "Modern living room with wooden theme." },
    2: { id: 2, name: "Priya", requirements: "Minimal bedroom with pastel color palette." },
  };

  return NextResponse.json({ client: data[id] });
}
