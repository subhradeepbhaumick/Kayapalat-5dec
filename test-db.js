const mysql = require('mysql2/promise');

async function testDB() {
  try {
    const pool = mysql.createPool({
      host: process.env.DB_HOST || 'localhost',
      user: process.env.DB_USER || 'root',
      password: 'Tony@26062002',
      database: process.env.DB_NAME || 'kayapalat_db',
      waitForConnections: true,
      connectionLimit: 10,
      queueLimit: 0,
    });

    console.log('Checking agents table...');
    const [agents] = await pool.execute('SELECT * FROM agents LIMIT 5');
    console.log('Agents:', agents);

    console.log('Checking users_kp_db table...');
    const [users] = await pool.execute('SELECT * FROM users_kp_db LIMIT 5');
    console.log('Users:', users);

    pool.end();
  } catch (error) {
    console.error('DB Error:', error);
  }
}

testDB();
