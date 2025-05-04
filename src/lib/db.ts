import mysql from 'mysql2/promise';

// First create a connection without database to create it if needed
const initialPool = mysql.createPool({
  host: process.env.DB_HOST || 'localhost',
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || '',
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
});

// Create database if it doesn't exist
async function createDatabase() {
  try {
    const connection = await initialPool.getConnection();
    await connection.execute(`CREATE DATABASE IF NOT EXISTS ${process.env.DB_NAME || 'kayapalat_db'}`);
    console.log('Database created/verified successfully');
    connection.release();
  } catch (error: any) {
    console.error('Database creation error:', error);
    throw error;
  }
}

// Create the main connection pool with the database
const pool = mysql.createPool({
  host: process.env.DB_HOST || 'localhost',
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || '',
  database: process.env.DB_NAME || 'kayapalat_db',
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
});

// Test the connection and create tables if they don't exist
async function initializeDatabase() {
  try {
    // First create the database
    await createDatabase();

    // Then connect to the database and create tables
    const connection = await pool.getConnection();
    console.log('Successfully connected to MySQL database');

    // Create blogs table if it doesn't exist
    await connection.execute(`
      CREATE TABLE IF NOT EXISTS blogs (
        id INT AUTO_INCREMENT PRIMARY KEY,
        title VARCHAR(255) NOT NULL,
        body TEXT NOT NULL,
        image VARCHAR(255) NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);
    console.log('Blogs table checked/created successfully');

    // Create users table if it doesn't exist
    await connection.execute(`
      CREATE TABLE IF NOT EXISTS users (
        id INT AUTO_INCREMENT PRIMARY KEY,
        type ENUM('owner', 'client') NOT NULL DEFAULT 'client',
        first_name VARCHAR(255) NOT NULL,
        last_name VARCHAR(255) NOT NULL,
        email VARCHAR(255) NOT NULL UNIQUE,
        password VARCHAR(255) NOT NULL,
        phone VARCHAR(20) NOT NULL,
        address TEXT,
        message TEXT,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        deleted_at TIMESTAMP NULL DEFAULT NULL
      )
    `);
    console.log('Users table checked/created successfully');

    connection.release();
  } catch (error: any) {
    console.error('Database initialization error:', {
      message: error.message,
      code: error.code,
      errno: error.errno,
      sqlState: error.sqlState,
      sqlMessage: error.sqlMessage
    });
    throw error;
  }
}

// Initialize database on startup
initializeDatabase().catch(console.error);

// Export the pool for use in other files
export default pool;

// Helper function to execute queries
export async function executeQuery<T = any>(query: string, params: any[] = []): Promise<[T[], mysql.OkPacket]> {
  const connection = await pool.getConnection();
  try {
    console.log('Executing query:', query);
    console.log('With parameters:', params);
    const [results, fields] = await connection.execute(query, params);
    return [results as T[], fields as unknown as mysql.OkPacket];
  } catch (error: any) {
    console.error('Database query error:', {
      message: error.message,
      code: error.code,
      errno: error.errno,
      sqlState: error.sqlState,
      sqlMessage: error.sqlMessage,
      query,
      params
    });
    throw error;
  } finally {
    connection.release();
  }
} 