const { pool } = require("../config/database");
const slugify = require("slugify");

class BlogModel {
  // Safely parse tags - handles JSON arrays, comma-separated strings, and already-parsed arrays
  static parseTagsSafely(tagsString) {
    if (!tagsString) return [];

    // If it's already an array, return it
    if (Array.isArray(tagsString)) {
      return tagsString;
    }

    try {
      // First try to parse as JSON
      const parsed = JSON.parse(tagsString);
      return Array.isArray(parsed) ? parsed : [];
    } catch (error) {
      // If JSON parsing fails, treat as comma-separated string
      if (typeof tagsString === "string") {
        return tagsString
          .split(",")
          .map((tag) => tag.trim())
          .filter((tag) => tag.length > 0);
      }

      console.warn(
        "Failed to parse tags:",
        tagsString,
        "- treating as empty array"
      );
      return [];
    }
  }

  // Create a new blog post
  static async create(postData) {
    const connection = await pool.getConnection();

    try {
      const {
        title,
        content,
        excerpt,
        featured_image,
        meta_title,
        meta_description,
        tags,
        category,
        status = "published",
        author = "Richad Ali",
        generated_by_ai = true,
        ai_prompt,
      } = postData;

      // Generate slug from title
      const slug = slugify(title, {
        lower: true,
        strict: true,
        remove: /[*+~.()'"!:@]/g,
      });

      // Calculate reading time (average 200 words per minute)
      const wordCount = content.split(" ").length;
      const reading_time = Math.ceil(wordCount / 200);

      // Set published_at if status is published
      const published_at = status === "published" ? new Date() : null;

      const [result] = await connection.execute(
        `INSERT INTO blog_posts 
         (title, slug, content, excerpt, featured_image, meta_title, meta_description, 
          tags, category, status, reading_time, author, generated_by_ai, ai_prompt, published_at)
         VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        [
          title,
          slug,
          content,
          excerpt,
          featured_image,
          meta_title,
          meta_description,
          JSON.stringify(tags),
          category,
          status,
          reading_time,
          author,
          generated_by_ai,
          ai_prompt,
          published_at,
        ]
      );

      return { id: result.insertId, slug };
    } catch (error) {
      // Handle duplicate slug error
      if (error.code === "ER_DUP_ENTRY") {
        const timestamp = Date.now();
        const newSlug = `${slugify(postData.title, {
          lower: true,
          strict: true,
        })}-${timestamp}`;
        return this.create({ ...postData, title: postData.title });
      }
      throw error;
    } finally {
      connection.release();
    }
  }

  // Get all blog posts with pagination and filtering
  static async getAll(params = {}) {
    const connection = await pool.getConnection();

    try {
      const {
        page = 1,
        limit = 10,
        category,
        status = "published",
        search,
        sortBy = "published_at",
        sortOrder = "DESC",
      } = params;

      // Ensure page and limit are valid integers
      const pageValue = Number.isInteger(page) ? page : parseInt(page) || 1;
      const limitValue = Number.isInteger(limit)
        ? limit
        : parseInt(limit) || 10;
      const offset = (pageValue - 1) * limitValue;

      // Validate sortBy to prevent SQL injection
      const validSortColumns = [
        "id",
        "title",
        "slug",
        "category",
        "created_at",
        "published_at",
        "views",
        "reading_time",
      ];
      const safeSortBy = validSortColumns.includes(sortBy)
        ? sortBy
        : "published_at";

      // Validate sortOrder to prevent SQL injection
      const safeSortOrder =
        sortOrder && sortOrder.toUpperCase() === "ASC" ? "ASC" : "DESC";

      let whereClause = "WHERE status = ?";
      let queryParams = [status];

      if (category) {
        whereClause += " AND category = ?";
        queryParams.push(category);
      }

      if (search) {
        whereClause += " AND (title LIKE ? OR content LIKE ? OR tags LIKE ?)";
        const searchTerm = `%${search}%`;
        queryParams.push(searchTerm, searchTerm, searchTerm);
      }

      // Get total count
      const [countResult] = await connection.execute(
        `SELECT COUNT(*) as total FROM blog_posts ${whereClause}`,
        queryParams
      );
      const total = countResult[0].total;

      // Get posts with safe ORDER BY clause
      const [posts] = await connection.execute(
        `SELECT id, title, slug, excerpt, featured_image, meta_title, meta_description,
                tags, category, views, reading_time, author, created_at, published_at
         FROM blog_posts
         ${whereClause}
         ORDER BY ${safeSortBy} ${safeSortOrder}
         LIMIT ${limitValue} OFFSET ${offset}`,
        queryParams
      );

      // Parse JSON tags
      const formattedPosts = posts.map((post) => ({
        ...post,
        tags: this.parseTagsSafely(post.tags),
      }));

      return {
        posts: formattedPosts,
        pagination: {
          current_page: pageValue,
          total_pages: Math.ceil(total / limitValue),
          total_posts: total,
          per_page: limitValue,
        },
      };
    } finally {
      connection.release();
    }
  }

  // Get single blog post by slug
  static async getBySlug(slug) {
    const connection = await pool.getConnection();

    try {
      const [posts] = await connection.execute(
        `SELECT * FROM blog_posts WHERE slug = ? AND status = 'published'`,
        [slug]
      );

      if (posts.length === 0) {
        return null;
      }

      const post = {
        ...posts[0],
        tags: this.parseTagsSafely(posts[0].tags),
      };

      return post;
    } finally {
      connection.release();
    }
  }

  // Get related posts
  static async getRelatedPosts(postId, category, limit = 3) {
    const connection = await pool.getConnection();

    try {
      const limitValue = Number.isInteger(limit)
        ? limit
        : parseInt(limit, 10) || 3;
      const validPostId = Number.isInteger(postId)
        ? postId
        : parseInt(postId, 10);

      if (!validPostId || !category || typeof category !== "string") {
        console.error("Invalid parameters for getRelatedPosts:", {
          postId,
          category,
        });
        return [];
      }

      const sql = `
        SELECT id, title, slug, excerpt, featured_image, category, reading_time, published_at
        FROM blog_posts
        WHERE id != ? AND category = ? AND status = 'published'
        ORDER BY published_at DESC
        LIMIT ${limitValue}
      `;

      const [posts] = await connection.execute(sql, [validPostId, category]);

      // Parse tags for each related post
      const formattedPosts = posts.map((post) => ({
        ...post,
        tags: this.parseTagsSafely(post.tags),
      }));

      return formattedPosts;
    } catch (error) {
      console.error("getRelatedPosts SQL error:", error.message);
      return []; // Return empty array on error instead of throwing
    } finally {
      connection.release();
    }
  }

  // Increment view count
  static async incrementViews(postId, viewData = {}) {
    const connection = await pool.getConnection();

    try {
      // Update post views count
      await connection.execute(
        "UPDATE blog_posts SET views = views + 1 WHERE id = ?",
        [postId]
      );

      // Log detailed view for analytics
      const { ip_address, user_agent, referer } = viewData;
      await connection.execute(
        "INSERT INTO blog_views (post_id, ip_address, user_agent, referer) VALUES (?, ?, ?, ?)",
        [postId, ip_address, user_agent, referer]
      );

      return true;
    } catch (error) {
      console.error("Error incrementing views:", error);
      return false;
    } finally {
      connection.release();
    }
  }

  // Get blog categories with post counts
  static async getCategoriesWithCounts() {
    const connection = await pool.getConnection();
    try {
      const [results] = await connection.execute(
        `SELECT category as slug, COUNT(*) as post_count
         FROM blog_posts
         WHERE status = 'published'
         GROUP BY category
         ORDER BY post_count DESC`
      );
      return results;
    } finally {
      connection.release();
    }
  }

  // Get popular posts
  static async getPopularPosts(limit = 5) {
    const connection = await pool.getConnection();

    try {
      // Ensure limit is a valid integer
      const limitValue = Number.isInteger(limit) ? limit : parseInt(limit) || 5;

      const [posts] = await connection.execute(
        `SELECT id, title, slug, excerpt, category, featured_image, tags, views, reading_time, published_at, created_at, generated_by_ai
         FROM blog_posts 
         WHERE status = 'published'
         ORDER BY views DESC, published_at DESC
         LIMIT ?`,
        [limitValue]
      );

      // Parse JSON tags for each post
      const formattedPosts = posts.map((post) => ({
        ...post,
        tags: this.parseTagsSafely(post.tags),
      }));

      return formattedPosts;
    } finally {
      connection.release();
    }
  }

  // Get latest posts
  static async getLatestPosts(limit = 5) {
    const connection = await pool.getConnection();

    try {
      // Ensure limit is a valid integer
      const limitValue = Number.isInteger(limit) ? limit : parseInt(limit) || 5;

      console.log(
        "getLatestPosts called with limit:",
        limit,
        "type:",
        typeof limit,
        "final value:",
        limitValue
      );

      // First, let's check if the table exists and has data
      try {
        const [tableCheck] = await connection.execute(
          "SELECT COUNT(*) as count FROM blog_posts"
        );
        console.log("Total posts in database:", tableCheck[0].count);
      } catch (tableError) {
        console.error("Table check failed:", tableError);
        throw new Error("Blog posts table not found or inaccessible");
      }

      // Try without prepared statement first to debug
      const query = `SELECT id, title, slug, excerpt, category, featured_image, tags, views, reading_time, published_at, created_at, generated_by_ai
         FROM blog_posts 
         WHERE status = 'published'
         ORDER BY published_at DESC
         LIMIT ${limitValue}`;

      console.log("Executing query:", query);

      const [posts] = await connection.execute(query);

      // Parse JSON tags for each post
      const formattedPosts = posts.map((post) => ({
        ...post,
        tags: this.parseTagsSafely(post.tags),
      }));

      return formattedPosts;
    } finally {
      connection.release();
    }
  }

  // Search posts
  static async search(query, limit = 10) {
    const connection = await pool.getConnection();

    try {
      // Ensure limit is a valid integer
      const limitValue = Number.isInteger(limit)
        ? limit
        : parseInt(limit) || 10;

      const searchTerm = `%${query}%`;
      const [posts] = await connection.execute(
        `SELECT id, title, slug, excerpt, category, reading_time, published_at,
                MATCH(title, content) AGAINST(? IN NATURAL LANGUAGE MODE) as relevance
         FROM blog_posts 
         WHERE status = 'published' 
         AND (title LIKE ? OR content LIKE ? OR tags LIKE ?)
         ORDER BY relevance DESC, published_at DESC
         LIMIT ?`,
        [query, searchTerm, searchTerm, searchTerm, limitValue]
      );

      return posts;
    } finally {
      connection.release();
    }
  }

  // Get blog statistics
  static async getStats() {
    const connection = await pool.getConnection();

    try {
      const [stats] = await connection.execute(`
        SELECT 
          COUNT(*) as total_posts,
          SUM(views) as total_views,
          COUNT(DISTINCT category) as total_categories,
          AVG(reading_time) as avg_reading_time
        FROM blog_posts 
        WHERE status = 'published'
      `);

      const [recentViews] = await connection.execute(`
        SELECT COUNT(*) as recent_views
        FROM blog_views 
        WHERE viewed_at >= DATE_SUB(NOW(), INTERVAL 7 DAY)
      `);

      return {
        ...stats[0],
        recent_views: recentViews[0].recent_views,
      };
    } finally {
      connection.release();
    }
  }

  // Get all used topics (AI prompts)
  static async getUsedTopics() {
    const connection = await pool.getConnection();
    try {
      const [rows] = await connection.execute(
        "SELECT DISTINCT ai_prompt FROM blog_posts WHERE ai_prompt IS NOT NULL"
      );
      return rows.map((row) => row.ai_prompt);
    } finally {
      connection.release();
    }
  }
}

module.exports = BlogModel;
