const mysql = require('mysql2/promise');

async function testInvoiceAPI() {
  try {
    const connection = await mysql.createConnection({
      host: process.env.DB_HOST || 'localhost',
      user: process.env.DB_USER || 'root',
      password: 'Tony@26062002',
      database: process.env.DB_NAME || 'kayapalat_db',
    });

    console.log('Testing invoice query...');

    const query = `
      SELECT
        i.invoice_id,
        i.appointment_id,
        i.agent_share as amount,
        i.payment_date as generated_date,
        i.payment_status as status,
        i.agent_id,
        p.client_name,
        p.project_name,
        p.admin_id,
        u1.name as agent_name,
        u2.name as admin_name
      FROM invoice i
      JOIN projects p ON i.appointment_id = p.appointment_id
      LEFT JOIN users u1 ON i.agent_id = u1.user_id
      LEFT JOIN users u2 ON p.admin_id = u2.user_id
      ORDER BY i.payment_date DESC
      LIMIT 5
    `;

    const [rows] = await connection.execute(query);
    console.log('Invoice query results:', JSON.stringify(rows, null, 2));

    console.log(`Found ${rows.length} invoices`);

    if (rows.length > 0) {
      console.log('Sample invoice:', rows[0]);
    }

    await connection.end();
    console.log('Database test completed successfully');
  } catch (error) {
    console.error('Database test failed:', error);
  }
}

testInvoiceAPI();
