import { NextRequest, NextResponse } from 'next/server';
import { executeQuery } from '../../../../lib/db';

export async function GET(request: NextRequest) {
  try {
    const query = 'SELECT * FROM agents';
    const [results] = await executeQuery(query);

    // Map database fields to frontend expected fields
    const mappedResults = await Promise.all(
      results.map(async (agent: any) => {

        // ---------------------------
// STATUS CALCULATION SECTION
// ---------------------------
        let status = "Inactive";
        let lastLeadDate = null;

        try {
          const latestProjectQuery = `
            SELECT created_at
            FROM projects
            WHERE agent_id = ?
            ORDER BY created_at DESC
            LIMIT 1
          `;

          const [projectResult]: any = await executeQuery(latestProjectQuery, [agent.agent_id]);

          if (projectResult.length > 0) {
            const latestCreatedAt = new Date(projectResult[0].created_at);
            lastLeadDate = latestCreatedAt.toISOString().split('T')[0]; // Format as YYYY-MM-DD
            const now = new Date();

            const monthsDifference =
              (now.getFullYear() - latestCreatedAt.getFullYear()) * 12 +
              (now.getMonth() - latestCreatedAt.getMonth());

            // Determine Active status based on months difference
            if (monthsDifference < 3) {
              status = "Active";
            }
          }
        } catch (err) {
          console.error("Project date check error:", err);
        }

        // ---------------------------
// RETURN AGENT MAPPED DATA
// ---------------------------
        return {
          id: agent.agent_id,
          name: agent.agent_name,
          phone: agent.phone,
          email: agent.email || '',
          admin: agent.admin_id,
          status: status,   // ← Updated
          joinDate: agent.created_at || new Date().toISOString().split('T')[0],
          profilePic: agent.profile_pic || '/placeholder_person.jpg ',
          location: agent.address || '',
          lastLeadDate: lastLeadDate
        };
      })
    );

    // Fetch all sales admins
    const adminQuery = 'SELECT user_id FROM users_kp_db WHERE role = ?';
    const [adminResults]: any = await executeQuery(adminQuery, ['sales_admin']);
    const adminIds = adminResults.map((admin: any) => admin.user_id);

    return NextResponse.json({ agents: mappedResults, admins: adminIds });
  } catch (error) {
    console.error('Error fetching agents:', error);
    return NextResponse.json({ error: 'Failed to fetch agents' }, { status: 500 });
  }
}

export async function PUT(request: NextRequest) {
  try {
    const { agent_id, admin_id } = await request.json();
    const query = 'UPDATE agents SET admin_id = ? WHERE agent_id = ?';
    await executeQuery(query, [admin_id, agent_id]);
    return NextResponse.json({ message: 'Admin updated successfully' });
  } catch (error) {
    console.error('Error updating admin:', error);
    return NextResponse.json({ error: 'Failed to update admin' }, { status: 500 });
  }
}
