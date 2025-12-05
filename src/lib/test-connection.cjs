const mysql = require("mysql2/promise");

async function test() {
  const pool = mysql.createPool({
    host: "localhost",
    user: "root",
    password: "Tony@26062002",
    database: "kayapalat_db"
  });

  try {
    const [rows] = await pool.query("SELECT 1 + 1 AS result");
    console.log("DB Connected Successfully! Result:", rows);
  } catch (err) {
    console.error("DB Connection Error:", err);
  } finally {
    pool.end();
  }
}

test();
