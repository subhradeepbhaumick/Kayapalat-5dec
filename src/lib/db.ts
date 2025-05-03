import mysql from 'mysql2/promise';

// Create a connection pool
const pool = mysql.createPool({
  host: process.env.DB_HOST || 'localhost',
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || '',
  database: process.env.DB_NAME || 'kayapalat_keysmat',
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
});

// Test the connection
async function testConnection() {
  try {
    const connection = await pool.getConnection();
    console.log('Successfully connected to MySQL database');
    connection.release();
  } catch (error: any) {
    console.error('Error connecting to MySQL database:', {
      message: error.message,
      code: error.code,
      errno: error.errno,
      sqlState: error.sqlState,
      sqlMessage: error.sqlMessage
    });
    throw error;
  }
}

// Test the connection when the module is loaded
testConnection().catch(console.error);

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