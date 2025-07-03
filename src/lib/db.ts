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

    // Create room_prices table for pricing system
    await connection.execute(`
      CREATE TABLE IF NOT EXISTS room_prices (
        id INT AUTO_INCREMENT PRIMARY KEY,
        room_type VARCHAR(100) NOT NULL UNIQUE,
        base_price DECIMAL(10,2) NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
      )
    `);
    console.log('Room prices table checked/created successfully');

    // Create accessory_prices table
    await connection.execute(`
      CREATE TABLE IF NOT EXISTS accessory_prices (
        id INT AUTO_INCREMENT PRIMARY KEY,
        accessory_name VARCHAR(100) NOT NULL,
        room_type VARCHAR(100) NOT NULL,
        price DECIMAL(10,2) NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        UNIQUE KEY unique_accessory_room (accessory_name, room_type)
      )
    `);
    console.log('Accessory prices table checked/created successfully');

    // Create feature_prices table
    await connection.execute(`
      CREATE TABLE IF NOT EXISTS feature_prices (
        id INT AUTO_INCREMENT PRIMARY KEY,
        feature_name VARCHAR(100) NOT NULL UNIQUE,
        price DECIMAL(10,2) NOT NULL,
        applicable_rooms JSON,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
      )
    `);
    console.log('Feature prices table checked/created successfully');

    // Create package_multipliers table
    await connection.execute(`
      CREATE TABLE IF NOT EXISTS package_multipliers (
        id INT AUTO_INCREMENT PRIMARY KEY,
        package_name VARCHAR(100) NOT NULL UNIQUE,
        multiplier DECIMAL(4,2) NOT NULL,
        description TEXT,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
      )
    `);
    console.log('Package multipliers table checked/created successfully');

    // Create project_estimates table for saving complete estimates
    await connection.execute(`
      CREATE TABLE IF NOT EXISTS project_estimates (
        id INT AUTO_INCREMENT PRIMARY KEY,
        client_name VARCHAR(255) NOT NULL,
        client_email VARCHAR(255) NOT NULL,
        client_phone VARCHAR(20),
        client_address TEXT,
        project_type VARCHAR(100),
        bhk_type VARCHAR(50),
        selected_package VARCHAR(100),
        room_details JSON,
        total_estimate DECIMAL(12,2) NOT NULL,
        breakdown JSON,
        timeline VARCHAR(100),
        budget_range VARCHAR(100),
        location VARCHAR(255),
        status ENUM('draft', 'sent', 'approved', 'rejected') DEFAULT 'draft',
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        INDEX idx_client_email (client_email),
        INDEX idx_created_at (created_at)
      )
    `);
    console.log('Project estimates table checked/created successfully');

    // Insert some default room types if table is empty
    const [roomCount] = await connection.execute('SELECT COUNT(*) as count FROM room_prices');
    if ((roomCount as any)[0].count === 0) {
      await connection.execute(`
        INSERT INTO room_prices (room_type, base_price) VALUES 
        ('Living Room', 150000.00),
        ('Bedroom', 120000.00),
        ('Kitchen', 200000.00),
        ('Bathroom', 80000.00),
        ('Dining Room', 100000.00),
        ('Study Room', 90000.00),
        ('Balcony', 50000.00)
      `);
      console.log('Default room prices inserted');
    }

    // Insert some default package multipliers if table is empty
    const [packageCount] = await connection.execute('SELECT COUNT(*) as count FROM package_multipliers');
    if ((packageCount as any)[0].count === 0) {
      await connection.execute(`
        INSERT INTO package_multipliers (package_name, multiplier, description) VALUES 
        ('Basic', 1.00, 'Standard interior design package'),
        ('Premium', 1.50, 'Premium materials and finishes'),
        ('Luxury', 2.00, 'High-end luxury interior design'),
        ('Ultra Luxury', 2.50, 'Ultimate luxury with designer brands')
      `);
      console.log('Default package multipliers inserted');
    }

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

// Helper function to execute queries (compatible with your endpoints)
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

// Database object with query method (for compatibility with your endpoints)
export const db = {
  async query<T = any>(sql: string, params: any[] = []): Promise<T[]> {
    const [results] = await executeQuery<T>(sql, params);
    return results;
  }
};

// Named export for the pool
export { pool };