// import { executeQuery } from '@/lib/db';
// import { NextRequest, NextResponse } from 'next/server';
// import bcrypt from 'bcryptjs';
// import { sendEmail } from '@/helpers/mailer';

// interface User {
//   user_id: number;
//   name: string;
//   email: string;
//   phone: string;
//   whatsapp: string | null;
//   password_hash: string;
//   occupation: string | null;
//   address: string | null;
//   role: string;
// }
// export async function POST(req: NextRequest) {
//   try {
//     console.log("Starting signup process...");
//     const reqBody = await req.json();
//     console.log("Request body received:", reqBody);

//     const { first_name, last_name, email, password, phone, address, message } = reqBody;

//     // ✅ Check if all required fields are provided
//     if (!first_name || !email || !password || !phone) {
//       console.log("Missing required fields");
//       return NextResponse.json(
//         { error: "⚠️ All fields are required" },
//         { status: 400 }
//       );
//     }

//     console.log("Checking if user exists...");
//     const [existingUsers] = await executeQuery<User>(
//       'SELECT * FROM users WHERE email = ? AND deleted_at IS NULL',
//       [email]
//     );

//     if (existingUsers && existingUsers.length > 0) {
//       console.log("User already exists");
//       return NextResponse.json(
//         { error: "❗️ User already exists" },
//         { status: 400 }
//       );
//     }

//     console.log("Hashing password...");
//     const salt = await bcrypt.genSalt(10);
//     const hashedPassword = await bcrypt.hash(password, salt);

//     console.log("Creating new user...");
//     const query = `INSERT INTO users 
//       (type, first_name, last_name, email, password, phone, address, message, created_at, updated_at) 
//       VALUES (?, ?, ?, ?, ?, ?, ?, ?, NOW(), NOW())`;
    
//     const params = ['owner', first_name, last_name, email, hashedPassword, phone, address, message];
    
//     console.log("Executing query:", query);
//     console.log("With parameters:", params);

//     const [_, result] = await executeQuery(
//       query,
//       params
//     );

//     const userId = result.insertId;
//     console.log("User saved with ID:", userId);

//     console.log("Sending verification email...");
//     await sendEmail({
//       email, emailType: 'VERIFY', userId,
//       to: '',
//       subject: ''
//     });

//     return NextResponse.json(
//       {
//         message: "🎉 User Registered Successfully!",
//         success: true,
//         userId,
//       },
//       { status: 201 }
//     );
//   } catch (error: any) {
//     console.error("Detailed error:", {
//       message: error.message,
//       stack: error.stack,
//       code: error.code,
//       errno: error.errno,
//       sqlState: error.sqlState,
//       sqlMessage: error.sqlMessage
//     });
//     return NextResponse.json(
//       { error: error.message || "Internal Server Error" },
//       { status: 500 }
//     );
//   }
// }
import { executeQuery } from '@/lib/db';
import { NextRequest, NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
// import { sendEmail } from '@/helpers/mailer';

// Generate next user_id based on role
async function generateUserId(prefix: string) {
  const query = `
    SELECT user_id 
    FROM users_kp_db
    WHERE user_id LIKE '${prefix}%'
    ORDER BY user_id DESC
    LIMIT 1
  `;

  const [rows] = await executeQuery(query);

  if (rows.length === 0) {
    return prefix + "001";
  }

  const lastId = rows[0].user_id; // Example: R015
  const lastNumber = parseInt(lastId.substring(1)); // → 15
  const nextNumber = (lastNumber + 1).toString().padStart(3, "0");

  return prefix + nextNumber; // → R016
}

export async function POST(req: NextRequest) {
  try {
    const reqBody = await req.json();
    const {
      full_name,
      email,
      password,
      phone,
      whatsapp,
      address,
      occupation,
      role,
      admin_id  // add admin_id from request body, optional
    } = reqBody;

    // -------------------------------
    // 1. VALIDATIONS
    // -------------------------------

    if (!full_name || !email || !password || !phone || !role) {
      return NextResponse.json(
        { error: "⚠️ Required fields missing." },
        { status: 400 }
      );
    }

    // Block signup for special accounts
    if (['superadmin', 'sales_admin', 'designer'].includes(role)) {
      return NextResponse.json(
        { error: "❌ You are not allowed to signup. Contact SuperAdmin." },
        { status: 403 }
      );
    }

    // Email validation
    if (!email.includes("@")) {
      return NextResponse.json(
        { error: "❗ Invalid email format — must contain @." },
        { status: 400 }
      );
    }

    // Phone validation: 10 digits
    if (!/^\d{10}$/.test(phone)) {
      return NextResponse.json(
        { error: "❗ Phone number must be exactly 10 digits." },
        { status: 400 }
      );
    }

    // WhatsApp validation
    if (whatsapp && !/^\d{10}$/.test(whatsapp)) {
      return NextResponse.json(
        { error: "❗ WhatsApp number must be exactly 10 digits." },
        { status: 400 }
      );
    }

    // -------------------------------
    // 2. CHECK FOR EXISTING USER
    // -------------------------------
    const [existing] = await executeQuery(
      "SELECT * FROM users_kp_db WHERE email = ?",
      [email]
    );

    if (existing.length > 0) {
      return NextResponse.json(
        { error: "❗ User already exists." },
        { status: 400 }
      );
    }

    // -------------------------------
    // 3. PASSWORD HASH
    // -------------------------------
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // -------------------------------
    // 4. AUTO USER ID GENERATION
    // -------------------------------

    let prefix = "";

    if (role === "referuser") prefix = "R";
    if (role === "client") prefix = "C";
    if (role === "designer") prefix = "D";
    if (role === "sales_admin") prefix = "S";
    if (role === "superadmin") prefix = "O";


    const user_id = await generateUserId(prefix);

    // const fullName = `full_name`;

    // -------------------------------
    // 5. INSERT USER
    // -------------------------------

    const insertQuery = `
      INSERT INTO users_kp_db
      (user_id, name, email, phone, whatsapp, password_hash, occupation, address, role, created_at)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, NOW())
    `;

    const params = [
      user_id,
      full_name,
      email,
      phone,
      whatsapp || null,
      hashedPassword,
      occupation || null,
      address || null,
      role
    ];

    await executeQuery(insertQuery, params);

    // -------------------------------
    // 6. SEND EMAIL VERIFICATION
    // -------------------------------
    // await sendEmail({ email, emailType: "VERIFY", userId: user_id });
    // // 2️⃣ If role is referuser → also insert into agents table
    // if (role === "referuser") {
    //   try {
    //     await executeQuery(
    //       `
    //         INSERT INTO agents (agent_id, admin_id, agent_name, phone, email,profile_pic, created_at)
    //         VALUES (?, ?, ?, ?, ?, ?, NOW())`,
    //       [
    //         user_id,  // agent_id: same as user_id
    //         admin_id || null,    // admin_id — optional
    //         full_name,
    //         phone,
    //         email,
    //         null      // profile_pic initially null
    //       ]
    //     );
    //   } catch (error) {
    //     console.error("Error inserting into agents table:", error);
    //   }
    // }
    // // 3️⃣ If role is client → also insert into clients table
    // if (role === "client") {
    //   try {
    //     await executeQuery(
    //       `
    //         INSERT INTO leads (lead_id, admin_id, client_name, client_phone, email, created_at)
    //         VALUES (?, ?, ?, ?, ?, NOW())`,
    //       [
    //         user_id,      // client_id: same as user_id
    //         admin_id || null,        // admin_id — optional (use admin_id from request, or null)
    //         full_name,
    //         phone,
    //         email
    //       ]
    //     );
    //   } catch (error) {
    //     console.error("Error inserting into leads table:", error);
    //   }
    // }
     // If user is referuser → also insert into agents table
    if (role === "referuser") {
      await executeQuery(
        `INSERT INTO agents 
        (agent_id, admin_id, agent_name, phone,whatsapp,address,password_hash,occupation, email, profile_pic)
        VALUES (?, NULL, ?, ?, ?,?,?,?,?, NULL)`,
        [user_id, full_name, phone,whatsapp,address,password,occupation, email]
      );
    }
    
    return NextResponse.json(
      {
        message: "🎉 User registered successfully!",
        success: true,
        user_id
      },
      { status: 201 }
    );

} catch (error: any) {
  console.error("🔥 SIGNUP ERROR DETAILS:", {
    message: error.message,
    stack: error.stack,
    code: error.code,
    errno: error.errno,
    sqlState: error.sqlState,
    sqlMessage: error.sqlMessage
  });

  return NextResponse.json(
    { error: error.message || "Internal Server Error" },
    { status: 500 }
  );
}
}