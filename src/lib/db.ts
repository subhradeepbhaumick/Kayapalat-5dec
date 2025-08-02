// File: src/lib/db.ts

import mysql from 'mysql2/promise';

// Main connection pool
export const pool = mysql.createPool({
  host: process.env.DB_HOST || 'localhost',
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || '',
  database: process.env.DB_NAME || 'kayapalat_db',
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
});

// Reusable slug generator
export function generateSlug(title: string): string {
  const timestamp = Date.now();
  return title
    .toLowerCase()
    .trim()
    .replace(/\s+/g, '-')
    .replace(/[^\w\-]+/g, '')
    .replace(/\-\-+/g, '-')
    + '-' + timestamp;
}

// The primary function to execute all queries
export async function executeQuery<T = any>(
  query: string,
  params: any[] = [],
  existingConnection?: mysql.PoolConnection
): Promise<[T[], mysql.OkPacket]> {
  
  const connection = existingConnection || await pool.getConnection();

  try {
    const upperCaseQuery = query.toUpperCase();
    const isTransactionCommand = ['START TRANSACTION', 'COMMIT', 'ROLLBACK'].includes(upperCaseQuery);
    // NEW: Check for the bulk insert syntax
    const isBulkInsert = upperCaseQuery.includes('VALUES ?');

    if (isTransactionCommand || isBulkInsert) {
      // Use .query() for transactions AND bulk inserts
      const [results, fields] = await connection.query(query, params);
      return [results as T[], fields as unknown as mysql.OkPacket];
    } else {
      // Use .execute() for all other secure queries
      const [results, fields] = await connection.execute(query, params);
      return [results as T[], fields as unknown as mysql.OkPacket];
    }
  } catch (error: any) {
    console.error('Database query error:', {
      message: error.message,
      code: error.code,
      query: query,
      params: params,
    });
    throw error;
  } finally {
    if (!existingConnection && connection) {
      connection.release();
    }
  }
}

// Wrapper for simple queries
export const db = {
  async query<T = any>(sql: string, params: any[] = []): Promise<T[]> {
    const [results] = await executeQuery<T>(sql, params);
    return results;
  }
};

export function sanitizeContentLinks(htmlContent: string): string {
  if (!htmlContent) return '';
  // This regex finds all href attributes and checks if they start with http, https, mailto, or tel
  const fixedHtml = htmlContent.replace(/href="(?!(https?:\/\/|mailto:|tel:))([^"]+)"/g, (match, protocol, url) => {
    // If it's an internal link starting with '/', leave it alone
    if (url.startsWith('/')) {
      return match;
    }
    // Otherwise, prepend https://
    return `href="https://
${url}"`;
  });
  return fixedHtml;
}