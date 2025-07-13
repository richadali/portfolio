const express = require("express");
const router = express.Router();
const BlogModel = require("../models/blogModel");
const GeminiService = require("../services/geminiService");
const { body, validationResult, query } = require("express-validator");
const rateLimit = require("express-rate-limit");

// Initialize Gemini service
const geminiService = new GeminiService();

// Rate limiting for AI generation
const aiGenerationLimiter = rateLimit({
  windowMs: 60 * 60 * 1000, // 1 hour
  max: 5, // limit each IP to 5 AI generations per hour
  message: {
    success: false,
    message: "Too many AI generation requests. Please try again later.",
  },
  standardHeaders: true,
  legacyHeaders: false,
});

// Rate limiting for general blog endpoints
const blogLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // limit each IP to 100 requests per windowMs
  standardHeaders: true,
  legacyHeaders: false,
});

// Apply rate limiting to all blog routes
router.use(blogLimiter);

// Validation middleware
const validateBlogPost = [
  body("title")
    .trim()
    .isLength({ min: 5, max: 255 })
    .withMessage("Title must be between 5 and 255 characters"),
  body("content")
    .trim()
    .isLength({ min: 100 })
    .withMessage("Content must be at least 100 characters"),
  body("excerpt")
    .optional()
    .trim()
    .isLength({ max: 500 })
    .withMessage("Excerpt must be less than 500 characters"),
  body("category")
    .optional()
    .trim()
    .isLength({ max: 100 })
    .withMessage("Category must be less than 100 characters"),
  body("tags").optional().isArray().withMessage("Tags must be an array"),
  body("status")
    .optional()
    .isIn(["draft", "published", "scheduled"])
    .withMessage("Status must be draft, published, or scheduled"),
];

const validateQuery = [
  query("page")
    .optional()
    .isInt({ min: 1 })
    .withMessage("Page must be a positive integer"),
  query("limit")
    .optional()
    .isInt({ min: 1, max: 50 })
    .withMessage("Limit must be between 1 and 50"),
  query("search")
    .optional()
    .trim()
    .isLength({ max: 255 })
    .withMessage("Search query must be less than 255 characters"),
];

// GET /api/blog - Get all blog posts with pagination and filtering
router.get("/", validateQuery, async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: "Validation failed",
        errors: errors.array(),
      });
    }

    const {
      page = 1,
      limit = 10,
      category,
      search,
      sortBy = "published_at",
      sortOrder = "DESC",
    } = req.query;

    const result = await BlogModel.getAll({
      page: parseInt(page) || 1,
      limit: parseInt(limit) || 10,
      category,
      search,
      sortBy,
      sortOrder,
    });

    res.json({
      success: true,
      data: result,
    });
  } catch (error) {
    console.error("Error fetching blog posts:", error);
    res.status(500).json({
      success: false,
      message: "Error fetching blog posts",
    });
  }
});

// GET /api/blog/categories - Get all blog categories
router.get("/categories", async (req, res) => {
  try {
    const categories = await BlogModel.getCategories();
    res.json({
      success: true,
      data: categories,
    });
  } catch (error) {
    console.error("Error fetching categories:", error);
    res.status(500).json({
      success: false,
      message: "Error fetching categories",
    });
  }
});

// GET /api/blog/popular - Get popular blog posts
router.get("/popular", async (req, res) => {
  try {
    const { limit = 5 } = req.query;
    const limitNum = parseInt(limit) || 5; // Fallback to 5 if parseInt returns NaN
    const posts = await BlogModel.getPopularPosts(limitNum);

    res.json({
      success: true,
      data: posts,
    });
  } catch (error) {
    console.error("Error fetching popular posts:", error);
    res.status(500).json({
      success: false,
      message: "Error fetching popular posts",
    });
  }
});

// GET /api/blog/latest - Get latest blog posts
router.get("/latest", async (req, res) => {
  try {
    const { limit = 5 } = req.query;
    const limitNum = parseInt(limit) || 5; // Fallback to 5 if parseInt returns NaN
    const posts = await BlogModel.getLatestPosts(limitNum);

    res.json({
      success: true,
      data: posts,
    });
  } catch (error) {
    console.error("Error fetching latest posts:", error);
    res.status(500).json({
      success: false,
      message: "Error fetching latest posts",
    });
  }
});

// GET /api/blog/stats - Get blog statistics
router.get("/stats", async (req, res) => {
  try {
    const stats = await BlogModel.getStats();
    res.json({
      success: true,
      data: stats,
    });
  } catch (error) {
    console.error("Error fetching blog stats:", error);
    res.status(500).json({
      success: false,
      message: "Error fetching blog statistics",
    });
  }
});

// GET /api/blog/search - Search blog posts
router.get("/search", validateQuery, async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: "Validation failed",
        errors: errors.array(),
      });
    }

    const { q: query, limit = 10 } = req.query;

    if (!query || query.trim().length === 0) {
      return res.status(400).json({
        success: false,
        message: "Search query is required",
      });
    }

    const limitNum = parseInt(limit) || 10; // Fallback to 10 if parseInt returns NaN
    const posts = await BlogModel.search(query.trim(), limitNum);

    res.json({
      success: true,
      data: posts,
    });
  } catch (error) {
    console.error("Error searching posts:", error);
    res.status(500).json({
      success: false,
      message: "Error searching posts",
    });
  }
});

// GET /api/blog/:slug - Get single blog post by slug
router.get("/:slug", async (req, res) => {
  try {
    const { slug } = req.params;
    const post = await BlogModel.getBySlug(slug);

    if (!post) {
      return res.status(404).json({
        success: false,
        message: "Blog post not found",
      });
    }

    // Get related posts
    const relatedPosts = await BlogModel.getRelatedPosts(
      post.id,
      post.category,
      3
    );

    // Track view
    const viewData = {
      ip_address: req.ip,
      user_agent: req.get("User-Agent"),
      referer: req.get("Referer"),
    };

    await BlogModel.incrementViews(post.id, viewData);

    res.json({
      success: true,
      data: {
        post,
        related_posts: relatedPosts,
      },
    });
  } catch (error) {
    console.error("Error fetching blog post:", error);
    res.status(500).json({
      success: false,
      message: "Error fetching blog post",
    });
  }
});

// POST /api/blog - Create new blog post
router.post("/", validateBlogPost, async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: "Validation failed",
        errors: errors.array(),
      });
    }

    const result = await BlogModel.create(req.body);

    res.status(201).json({
      success: true,
      message: "Blog post created successfully",
      data: result,
    });
  } catch (error) {
    console.error("Error creating blog post:", error);
    res.status(500).json({
      success: false,
      message: "Error creating blog post",
    });
  }
});

// POST /api/blog/generate - Generate blog post using AI
router.post("/generate", aiGenerationLimiter, async (req, res) => {
  try {
    const { topic, category } = req.body;

    let blogData;
    if (category) {
      blogData = await geminiService.generatePostForCategory(category);
    } else if (topic) {
      blogData = await geminiService.generateBlogPost(topic);
    } else {
      blogData = await geminiService.generateBlogPost();
    }

    // Save to database
    const result = await BlogModel.create(blogData);

    res.json({
      success: true,
      message: "Blog post generated and saved successfully",
      data: {
        id: result.id,
        slug: result.slug,
        title: blogData.title,
        category: blogData.category,
      },
    });
  } catch (error) {
    console.error("Error generating blog post:", error);
    res.status(500).json({
      success: false,
      message: "Error generating blog post",
      error: error.message,
    });
  }
});

// POST /api/blog/generate/multiple - Generate multiple blog posts
router.post("/generate/multiple", aiGenerationLimiter, async (req, res) => {
  try {
    const { count = 3 } = req.body;

    if (count > 5) {
      return res.status(400).json({
        success: false,
        message: "Cannot generate more than 5 posts at once",
      });
    }

    const posts = await geminiService.generateMultiplePosts(count);
    const results = [];

    for (const blogData of posts) {
      try {
        const result = await BlogModel.create(blogData);
        results.push({
          id: result.id,
          slug: result.slug,
          title: blogData.title,
          category: blogData.category,
        });
      } catch (error) {
        console.error("Error saving generated post:", error);
      }
    }

    res.json({
      success: true,
      message: `Generated and saved ${results.length} blog posts`,
      data: results,
    });
  } catch (error) {
    console.error("Error generating multiple blog posts:", error);
    res.status(500).json({
      success: false,
      message: "Error generating blog posts",
    });
  }
});

// GET /api/blog/generate/titles - Generate title suggestions
router.get("/generate/titles", async (req, res) => {
  try {
    const { topic, count = 5 } = req.query;

    if (!topic) {
      return res.status(400).json({
        success: false,
        message: "Topic is required",
      });
    }

    const titles = await geminiService.generateTitleSuggestions(
      topic,
      parseInt(count)
    );

    res.json({
      success: true,
      data: titles,
    });
  } catch (error) {
    console.error("Error generating title suggestions:", error);
    res.status(500).json({
      success: false,
      message: "Error generating title suggestions",
    });
  }
});

// GET /api/blog/ai/categories - Get AI service categories
router.get("/ai/categories", async (req, res) => {
  try {
    const categories = geminiService.getCategories();
    res.json({
      success: true,
      data: categories,
    });
  } catch (error) {
    console.error("Error fetching AI categories:", error);
    res.status(500).json({
      success: false,
      message: "Error fetching AI categories",
    });
  }
});

// POST /api/blog/ai/reset - Reset used topics (for testing)
router.post("/ai/reset", async (req, res) => {
  try {
    geminiService.resetUsedTopics();
    res.json({
      success: true,
      message: "AI topic pool reset successfully",
    });
  } catch (error) {
    console.error("Error resetting AI topics:", error);
    res.status(500).json({
      success: false,
      message: "Error resetting AI topics",
    });
  }
});

module.exports = router;
