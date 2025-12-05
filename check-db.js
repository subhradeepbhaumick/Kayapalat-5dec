const mysql = require('mysql2/promise');

async function check() {
  const pool = mysql.createPool({
    host: 'localhost',
    user: 'root',
    password: 'Tony@26062002',
    database: 'kayapalat_db'
  });

  try {
    console.log('Checking roles...');
    const [roles] = await pool.execute('SELECT DISTINCT role FROM users_kp_db');
    console.log('Roles:', roles);

    console.log('Checking for admin users...');
    const [admins] = await pool.execute('SELECT * FROM users_kp_db WHERE role LIKE "%admin%"');
    console.log('Admins:', admins);

    console.log('Checking user with id S2...');
    const [s2] = await pool.execute('SELECT * FROM users_kp_db WHERE user_id = "S2"');
    console.log('S2 user:', s2);

    console.log('Checking all users...');
    const [all] = await pool.execute('SELECT user_id, name, role FROM users_kp_db');
    console.log('All users:', all);

  } catch (error) {
    console.error('Error:', error);
  } finally {
    pool.end();
  }
}

check();
