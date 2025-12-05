// import { NextResponse } from "next/server";
// import { db } from "@/lib/db";
// // Generate unique lead_id like "L0001", "L0002", ...
// async function generateLeadId() {
//   const rows: any = await db.query(
//     "SELECT lead_id FROM leads ORDER BY lead_id DESC LIMIT 1"
//   );
//   if (rows.length === 0) return "L0001";
//   const lastId = rows[0].lead_id;         // e.g., "L0001"
//   const num = parseInt(lastId.replace("L", "")) + 1;
//   return "L" + num.toString().padStart(4, "0");
// }

// export async function POST(request: Request) {
//   try {
//     const body = await request.json();

//     const lead_id = await generateLeadId();

//     // Use dummy admin_id for now
//     const admin_id = "A001";

//     const lead_date = body.lead_date || (() => {
//   const today = new Date();
//   const dd = String(today.getDate()).padStart(2, '0');
//   const mm = String(today.getMonth() + 1).padStart(2, '0'); // Months are 0-indexed
//   const yyyy = today.getFullYear();
//   return `${dd}-${mm}-${yyyy}`;
// })();


//     const sql = `
//       INSERT INTO leads
//       (lead_id, admin_id, client_name, email, client_phone, whatsapp, address, city, state, pincode, lead_date)
//       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
//     `;

//     const values = [
//       lead_id,                     // 1
//       admin_id,                    // 2
//       body.client_name ?? null,    // 3
//       body.email ?? null,          // 4
//       body.client_phone ?? null,   // 5
//       body.whatsapp ?? null,       // 6
//       body.address ?? null,        // 7
//       body.city ?? null,           // 8
//       body.state ?? null,          // 9
//       body.pincode ?? null,        // 10
//       lead_date                    // 11 (YYYY-MM-DD)
//     ];

//     const result: any = await db.query(sql, values);

//     return NextResponse.json({
//       lead_id,
//       message: "Client added successfully"
//     });
//   } catch (err) {
//     return NextResponse.json({ error: err }, { status: 500 });
//   }
// }

// // Optional: GET all leads
// export async function GET() {
//   try {
//     const rows = await db.query("SELECT * FROM leads ORDER BY lead_id DESC");
//     return NextResponse.json(rows);
//   } catch (err) {
//     return NextResponse.json({ error: err }, { status: 500 });
//   }
// }
