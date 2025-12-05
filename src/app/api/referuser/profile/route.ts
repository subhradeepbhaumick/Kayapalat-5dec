import { NextResponse } from "next/server";
import jwt from "jsonwebtoken";
import { executeQuery, pool } from "@/lib/db";
import { writeFile, mkdir } from "fs/promises";
import { join } from "path";

export async function GET(request: Request) {
  try {
    // Extract token
    const authHeader = request.headers.get("Authorization") || "";
    let token = "";

    if (authHeader.startsWith("Bearer ")) {
      token = authHeader.substring(7);
    } else {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    // Verify JWT
    const decoded: any = jwt.verify(token, process.env.JWT_SECRET!);
    const agent_id = decoded.agent_id || decoded.user_id || decoded.id;

    if (!agent_id) {
      return NextResponse.json(
        { message: "Invalid token: no agent_id" },
        { status: 400 }
      );
    }

    // First try to fetch from agents table
    const agentsQuery = `
      SELECT
        agent_id,
        admin_id,
        agent_name,
        email,
        phone,
        whatsapp,
        address,
        occupation,
        profile_pic
      FROM agents
      WHERE agent_id = ?
    `;

    let [result]: any = await executeQuery(agentsQuery, [agent_id]);
    let agentData: any = null;

    if (result && result.length > 0) {
      // Found in agents table
      const agent = result[0];
      agentData = {
        agent_id: agent.agent_id,
        representativeId: agent.admin_id,
        name: agent.agent_name,
        email: agent.email,
        phone: agent.phone,
        whatsapp: agent.whatsapp,
        address: agent.address,
        occupation: agent.occupation,
        profilePic: agent.profile_pic || '/placeholder_person.jpg',
      };
    } else {
      // Not found in agents, try users_kp_db
      const usersQuery = `
        SELECT
          user_id,
          name,
          email,
          phone,
          whatsapp,
          address,
          occupation
        FROM users_kp_db
        WHERE user_id = ?
      `;

      [result] = await executeQuery(usersQuery, [agent_id]);

      if (!result || result.length === 0) {
        return NextResponse.json({ message: "User not found" }, { status: 404 });
      }

      const user = result[0];
      agentData = {
        agent_id: user.user_id,
        representativeId: user.user_id,
        name: user.name,
        email: user.email,
        phone: user.phone,
        whatsapp: user.whatsapp,
        address: user.address,
        occupation: user.occupation,
        profilePic: null,
      };
    }

    return NextResponse.json(
      {
        agent: {
          ...agentData,
          password: "",
          confirmPassword: "",
        },
      },
      { status: 200 }
    );
  } catch (err: any) {
    console.error("PROFILE API ERROR:", err.message);

    if (err.name === "JsonWebTokenError") {
      return NextResponse.json(
        { message: "Invalid or expired token" },
        { status: 401 }
      );
    }

    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}

export async function PUT(request: Request) {
  try {
    // Extract token
    const authHeader = request.headers.get("Authorization") || "";
    let token = "";

    if (authHeader.startsWith("Bearer ")) {
      token = authHeader.substring(7);
    } else {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    // Verify JWT
    const decoded: any = jwt.verify(token, process.env.JWT_SECRET!);
    const user_id = decoded.agent_id || decoded.user_id || decoded.id;

    if (!user_id) {
      return NextResponse.json(
        { message: "Invalid token: no user_id" },
        { status: 400 }
      );
    }

    // Parse FormData for file upload
    const formData = await request.formData();
    const name = formData.get('name') as string;
    const email = formData.get('email') as string;
    const phone = formData.get('phone') as string;
    const whatsapp = formData.get('whatsapp') as string;
    const address = formData.get('address') as string;
    const occupation = formData.get('occupation') as string;
    const representativeId = formData.get('representativeId') as string;
    const profilePicFile = formData.get('profilePic') as File | null;

    // Validate required fields
    if (!name || !email || !phone || !whatsapp || !address || !occupation || !representativeId) {
      return NextResponse.json(
        { message: "All profile fields are required" },
        { status: 400 }
      );
    }

    let profilePicPath: string | null = null;

    // Handle file upload if present
    if (profilePicFile && profilePicFile.size > 0) {
      // Ensure the directory exists
      const uploadDir = join(process.cwd(), 'public', 'profileDP');
      await mkdir(uploadDir, { recursive: true });

      // Generate unique filename
      const fileExtension = profilePicFile.name.split('.').pop();
      const fileName = `${user_id}_${Date.now()}.${fileExtension}`;
      const filePath = join(uploadDir, fileName);

      // Convert file to buffer and save
      const bytes = await profilePicFile.arrayBuffer();
      const buffer = Buffer.from(bytes);
      await writeFile(filePath, buffer);

      // Set the relative path for database
      profilePicPath = `/profileDP/${fileName}`;
    }

    // Update both tables using transaction
    const connection = await pool.getConnection();

    try {
      await connection.query('START TRANSACTION');

      // Update agents table
      let updateAgentsQuery = `
        UPDATE agents
        SET agent_name = ?, email = ?, phone = ?, whatsapp = ?, address = ?, occupation = ?, admin_id = ?
      `;
      const params = [name, email, phone, whatsapp, address, occupation, representativeId];

      if (profilePicPath) {
        updateAgentsQuery += `, profile_pic = ?`;
        params.push(profilePicPath);
      }

      updateAgentsQuery += ` WHERE agent_id = ?`;
      params.push(user_id);

      await connection.execute(updateAgentsQuery, params);

      // Update users_kp_db table
      const updateUsersQuery = `
        UPDATE users_kp_db
        SET name = ?, email = ?, phone = ?, whatsapp = ?, address = ?, occupation = ?
        WHERE user_id = ?
      `;
      await connection.execute(updateUsersQuery, [name, email, phone, whatsapp, address, occupation, user_id]);

      await connection.query('COMMIT');

      return NextResponse.json({ message: "Profile updated successfully" }, { status: 200 });
    } catch (error) {
      await connection.query('ROLLBACK');
      throw error;
    } finally {
      connection.release();
    }
  } catch (err: any) {
    console.error("PROFILE UPDATE API ERROR:", err.message);

    if (err.name === "JsonWebTokenError") {
      return NextResponse.json(
        { message: "Invalid or expired token" },
        { status: 401 }
      );
    }

    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
