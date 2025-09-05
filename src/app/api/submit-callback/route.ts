import { NextResponse } from 'next/server';
import { db } from '@/lib/db'; // Your database connection utility

// --- GET: Fetch all contact submissions (for your admin panel) ---
export async function GET() {
  try {
    const submissions = await db.query('SELECT * FROM contact_submissions ORDER BY created_at DESC');
    return NextResponse.json(submissions);
  } catch (error) {
    console.error("Failed to fetch contact submissions:", error);
    return NextResponse.json({ error: "Failed to fetch submissions." }, { status: 500 });
  }
}

// --- POST: Handle a new form submission ---
export async function POST(request: Request) {
  try {
    const body = await request.json();
    
    // Destructure and validate the incoming data
    const {
      name,
      email,
      phone,
      whatsappNumber,
      whatsappSameAsPhone, // Now expecting this boolean from the frontend
      city,
      reasonForContact,
      message,
    } = body;

    if (!name || !email || !phone  || !reasonForContact || !message) {
      return NextResponse.json({ message: "Missing required fields." }, { status: 400 });
    }

    // Server-side logic to determine the final WhatsApp number
    const finalWhatsappNumber = whatsappSameAsPhone ? phone : (whatsappNumber || null);

    // --- Prepare and execute the SQL query ---
    const sql = `
      INSERT INTO contact_submissions (full_name, email, phone_number, whatsapp_number, city, reason, message, created_at)
      VALUES (?, ?, ?, ?, ?, ?, ?, NOW())
    `;
    
    const params = [
      name,
      email,
      phone,
      finalWhatsappNumber, // Use the server-determined value
      city || "Default City",
      reasonForContact,
      message
    ];

    const result = await db.query(sql, params);

    return NextResponse.json({ 
      message: "Callback requested successfully!",
      submissionId: (result as any).insertId 
    }, { status: 201 });

  } catch (error) {
    console.error("Contact form submission error:", error);
    return NextResponse.json({ message: "An unexpected error occurred." }, { status: 500 });
  }
}

// --- DELETE: Remove a submission (for your admin panel) ---
export async function DELETE(request: Request) {
    try {
        const { id } = await request.json();

        if (!id) {
            return NextResponse.json({ error: "Submission ID is required." }, { status: 400 });
        }

        const deleteSql = 'DELETE FROM contact_submissions WHERE id = ?';
        const result = await db.query(deleteSql, [id]);
        
        if ((result as any).affectedRows === 0) {
             return NextResponse.json({ error: "Submission not found." }, { status: 404 });
        }

        return NextResponse.json({ message: "Submission deleted successfully." });

    } catch (error) {
        console.error("Failed to delete submission:", error);
        return NextResponse.json({ error: "Failed to delete submission." }, { status: 500 });
    }
}

