import { db } from "@/lib/db";

// Auto-create the client_reviews table if it doesn't exist
export async function initializeDatabase() {
  try {
    await db.query(`
      CREATE TABLE IF NOT EXISTS client_reviews (
        id INT AUTO_INCREMENT PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        rating INT NOT NULL,
        message TEXT NOT NULL,
        profileImage VARCHAR(255),
        reviewImages JSON,
        createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `);
    console.log("✅ client_reviews table ready");
  } catch (error) {
    console.error("❌ Error initializing database:", error);
  }
}
