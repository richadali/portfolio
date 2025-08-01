const mysql = require("mysql2/promise");

const dbConfig = {
  host: process.env.DB_HOST || "localhost",
  user: process.env.DB_USER || "root",
  password: process.env.DB_PASSWORD || "",
  database: process.env.DB_NAME || "portfolio",
  port: process.env.DB_PORT || 3306,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
  connectTimeout: 60000,
  charset: "utf8mb4",
};

// Create connection pool
const pool = mysql.createPool(dbConfig);

// Test database connection
const testConnection = async () => {
  try {
    const connection = await pool.getConnection();
    console.log("✅ Database connected successfully");
    connection.release();
    return true;
  } catch (error) {
    console.error("❌ Database connection failed:", error.message);
    return false;
  }
};

// Initialize database tables
const initializeTables = async () => {
  const connection = await pool.getConnection();

  try {
    // Create blog_posts table
    await connection.execute(`
      CREATE TABLE IF NOT EXISTS blog_posts (
        id INT AUTO_INCREMENT PRIMARY KEY,
        title VARCHAR(255) NOT NULL,
        slug VARCHAR(255) UNIQUE NOT NULL,
        content LONGTEXT NOT NULL,
        excerpt TEXT,
        featured_image VARCHAR(500),
        meta_title VARCHAR(255),
        meta_description TEXT,
        tags JSON,
        category VARCHAR(100),
        status ENUM('draft', 'published', 'scheduled') DEFAULT 'published',
        views INT DEFAULT 0,
        reading_time INT DEFAULT 0,
        author VARCHAR(100) DEFAULT 'Richad Ali',
        generated_by_ai BOOLEAN DEFAULT true,
        ai_prompt TEXT,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        published_at TIMESTAMP NULL,
        INDEX idx_slug (slug),
        INDEX idx_status (status),
        INDEX idx_category (category),
        INDEX idx_published_at (published_at),
        INDEX idx_created_at (created_at)
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
    `);

    // Create blog_views table for analytics
    await connection.execute(`
      CREATE TABLE IF NOT EXISTS blog_views (
        id INT AUTO_INCREMENT PRIMARY KEY,
        post_id INT NOT NULL,
        ip_address VARCHAR(45),
        user_agent TEXT,
        referer VARCHAR(500),
        viewed_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (post_id) REFERENCES blog_posts(id) ON DELETE CASCADE,
        INDEX idx_post_id (post_id),
        INDEX idx_viewed_at (viewed_at)
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
    `);

    console.log("✅ Database tables initialized successfully");
  } catch (error) {
    console.error("❌ Error initializing tables:", error.message);
    throw error;
  } finally {
    connection.release();
  }
};

module.exports = {
  pool,
  testConnection,
  initializeTables,
};
