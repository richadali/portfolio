require("dotenv").config();
const express = require("express");
const nodemailer = require("nodemailer");
const cors = require("cors");
const helmet = require("helmet");
const rateLimit = require("express-rate-limit");
const { body, validationResult } = require("express-validator");

// Import blog functionality
const { testConnection, initializeTables } = require("./config/database");
const blogRoutes = require("./routes/blogRoutes");
const sitemapRoutes = require("./routes/sitemapRoutes");
const BlogScheduler = require("./services/blogScheduler");

const app = express();
const PORT = process.env.PORT || 3001;

// Initialize blog scheduler
const blogScheduler = new BlogScheduler();

// Security middleware
app.use(helmet());

// CORS configuration
app.use(
  cors({
    origin: process.env.FRONTEND_URL || "http://localhost:3000",
    credentials: true,
  })
);

// Rate limiting
const contactLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 30, // limit each IP to 5 requests per windowMs
  message: {
    success: false,
    message: "Too many contact form submissions. Please try again later.",
  },
  standardHeaders: true,
  legacyHeaders: false,
});

// Body parser
app.use(express.json({ limit: "10mb" }));

// Validation middleware
const contactValidation = [
  body("name")
    .trim()
    .isLength({ min: 1, max: 100 })
    .withMessage("Name must be between 1 and 100 characters")
    .escape(),
  body("email")
    .isEmail()
    .normalizeEmail()
    .withMessage("Please provide a valid email address"),
  body("subject")
    .trim()
    .isLength({ min: 1, max: 200 })
    .withMessage("Subject must be between 1 and 200 characters")
    .escape(),
  body("message")
    .trim()
    .isLength({ min: 1, max: 2000 })
    .withMessage("Message must be between 1 and 2000 characters")
    .escape(),
];

// Create reusable transporter object using Zoho SMTP
const createTransporter = () => {
  return nodemailer.createTransport({
    host: "smtp.zoho.in",
    port: 587,
    secure: false, // true for 465, false for other ports
    auth: {
      user: process.env.ZOHO_EMAIL,
      pass: process.env.ZOHO_PASSWORD,
    },
    tls: {
      rejectUnauthorized: false,
    },
  });
};

// Health check endpoint
app.get("/api/health", (req, res) => {
  res.json({
    success: true,
    message: "Server is running",
    timestamp: new Date().toISOString(),
  });
});

// Blog routes
app.use("/api/blog", blogRoutes);
app.use("/api/sitemap", sitemapRoutes);

// Blog scheduler endpoints
app.get("/api/scheduler/status", (req, res) => {
  try {
    const status = blogScheduler.getStatus();
    res.json({
      success: true,
      data: status,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error getting scheduler status",
    });
  }
});

app.post("/api/scheduler/generate-now", async (req, res) => {
  try {
    const { category, topic } = req.body;
    const result = await blogScheduler.generateManualBlog(category, topic);

    if (result.success) {
      res.json({
        success: true,
        message: "Blog post generated successfully",
        data: result.data,
      });
    } else {
      res.status(500).json({
        success: false,
        message: "Failed to generate blog post",
        error: result.error,
      });
    }
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error generating blog post",
    });
  }
});

app.post("/api/scheduler/backlog", async (req, res) => {
  try {
    const { count = 3 } = req.body;
    const results = await blogScheduler.generateContentBacklog(count);

    res.json({
      success: true,
      message: `Generated ${results.length} blog posts`,
      data: results,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error generating content backlog",
    });
  }
});

// Gemini AI image generation test endpoint
  app.post("/api/gemini/image/test", async (req, res) => {
    try {
      const GeminiImageService = require("./services/geminiImageService");
      const geminiImageService = new GeminiImageService();

    const {
      topic = "React Hooks Best Practices",
      category = "react-frontend",
    } = req.body;

    console.log(`🧪 Testing Gemini AI image generation for topic: ${topic}`);

    const result = await geminiImageService.testImageGeneration(topic);

    if (result.status === "success") {
      res.json({
        success: true,
        message: "Gemini AI image generated successfully",
        data: {
          topic,
          category,
          imageUrl: result.imageData,
        },
      });
    } else {
      res.status(500).json({
        success: false,
        message: "Gemini AI test failed",
        error: result.message,
        details: result.details,
      });
    }
  } catch (error) {
    console.error("❌ Gemini image test endpoint error:", error);
    res.status(500).json({
      success: false,
      message: "Gemini AI test failed",
      error: error.message,
      stack: process.env.NODE_ENV === "development" ? error.stack : undefined,
    });
  }
});

// Health check endpoint for Gemini Image API
app.get("/api/gemini/image/health", async (req, res) => {
  try {
    const GeminiImageService = require("./services/geminiImageService");
    const geminiImageService = new GeminiImageService();

    const result = await geminiImageService.healthCheck();

    if (result.status === "success") {
      res.json(result);
    } else {
      res.status(500).json(result);
    }
  } catch (error) {
    console.error("❌ Gemini Image API health check error:", error);
    res.status(500).json({
      status: "error",
      message: error.message,
    });
  }
});

// Flux AI image generation test endpoint
app.post("/api/flux/image/test", async (req, res) => {
  try {
    const FluxSchnellImageService = require("./services/fluxSchnellImageService");
    const fluxSchnellImageService = new FluxSchnellImageService();

    const {
      topic = "A futuristic cityscape",
      category = "ai-ml",
    } = req.body;

    console.log(`🧪 Testing Flux AI image generation for topic: ${topic}`);

    const result = await fluxSchnellImageService.generateBlogImage(topic, category);

    if (result) {
      res.json({
        success: true,
        message: "Flux AI image generated successfully",
        data: {
          topic,
          category,
          imageUrl: result,
        },
      });
    } else {
      res.status(500).json({
        success: false,
        message: "Flux AI test failed",
      });
    }
  } catch (error) {
    console.error("❌ Flux image test endpoint error:", error);
    res.status(500).json({
      success: false,
      message: "Flux AI test failed",
      error: error.message,
      stack: process.env.NODE_ENV === "development" ? error.stack : undefined,
    });
  }
});

// Health check endpoint for Flux Image API
app.get("/api/flux/image/health", async (req, res) => {
  try {
    const FluxSchnellImageService = require("./services/fluxSchnellImageService");
    const fluxSchnellImageService = new FluxSchnellImageService();

    const result = await fluxSchnellImageService.healthCheck();

    if (result.status === "success") {
      res.json(result);
    } else {
      res.status(500).json(result);
    }
  } catch (error) {
    console.error("❌ Flux Image API health check error:", error);
    res.status(500).json({
      status: "error",
      message: error.message,
    });
  }
});

// Pollination AI image generation test endpoint
app.post("/api/pollination/image/test", async (req, res) => {
  try {
    const PollinationImageService = require("./services/pollinationImageService");
    const pollinationImageService = new PollinationImageService();

    const {
      topic = "A serene landscape with mountains and a lake",
      category = "ai-ml",
    } = req.body;

    console.log(`🧪 Testing Pollination AI image generation for topic: ${topic}`);

    const result = await pollinationImageService.generateBlogImage(topic, category);

    if (result) {
      res.json({
        success: true,
        message: "Pollination AI image generated successfully",
        data: {
          topic,
          category,
          imageUrl: result,
        },
      });
    } else {
      res.status(500).json({
        success: false,
        message: "Pollination AI test failed",
      });
    }
  } catch (error) {
    console.error("❌ Pollination image test endpoint error:", error);
    res.status(500).json({
      success: false,
      message: "Pollination AI test failed",
      error: error.message,
      stack: process.env.NODE_ENV === "development" ? error.stack : undefined,
    });
  }
});

// Health check endpoint for Pollination Image API
app.get("/api/pollination/image/health", async (req, res) => {
  try {
    const PollinationImageService = require("./services/pollinationImageService");
    const pollinationImageService = new PollinationImageService();

    const result = await pollinationImageService.healthCheck();

    if (result.status === "success") {
      res.json(result);
    } else {
      res.status(500).json(result);
    }
  } catch (error) {
    console.error("❌ Pollination Image API health check error:", error);
    res.status(500).json({
      status: "error",
      message: error.message,
    });
  }
});

// Contact form endpoint
app.post(
  "/api/contact",
  contactLimiter,
  contactValidation,
  async (req, res) => {
    try {
      // Log incoming request for debugging
      console.log("Received contact form submission:", {
        body: req.body,
        headers: req.headers["content-type"],
      });

      // Check for validation errors
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        console.log("Validation errors:", errors.array());
        return res.status(400).json({
          success: false,
          message: "Validation failed",
          errors: errors.array(),
        });
      }

      const { name, email, subject, message } = req.body;

      console.log("Processing valid form data:", {
        name,
        email,
        subject: subject.substring(0, 50),
        messageLength: message.length,
      });

      // Create transporter
      const transporter = createTransporter();

      // Verify connection configuration
      await transporter.verify();
      console.log("SMTP connection verified successfully");

      // Email to yourself
      const mailOptions = {
        from: `"Portfolio Contact Form" <${process.env.ZOHO_EMAIL}>`,
        to: process.env.ZOHO_EMAIL,
        subject: `${name} - Portfolio Contact: ${subject}`,
        html: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
            <h2 style="color: #333; border-bottom: 2px solid #7B4397; padding-bottom: 10px;">
              New Contact Form Submission
            </h2>
            
            <div style="background: #f9f9f9; padding: 20px; border-radius: 8px; margin: 20px 0;">
              <p><strong>Name:</strong> ${name}</p>
              <p><strong>Email:</strong> <a href="mailto:${email}">${email}</a></p>
              <p><strong>Subject:</strong> ${subject}</p>
            </div>
            
            <div style="background: #fff; padding: 20px; border-left: 4px solid #7B4397; margin: 20px 0;">
              <h3 style="margin-top: 0; color: #333;">Message:</h3>
              <p style="line-height: 1.6; color: #555;">${message.replace(
                /\n/g,
                "<br>"
              )}</p>
            </div>
            
            <div style="margin-top: 30px; padding: 15px; background: #e8f4fd; border-radius: 8px;">
              <p style="margin: 0; font-size: 14px; color: #666;">
                <strong>Tip:</strong> You can reply directly to this email to respond to ${name}.
              </p>
            </div>
          </div>
        `,
        text: `
New Contact Form Submission

Name: ${name}
Email: ${email}
Subject: ${subject}

Message:
${message}
        `,
        replyTo: email,
      };

      // Auto-response to sender
      const autoResponseOptions = {
        from: `"Richad Ali" <${process.env.ZOHO_EMAIL}>`,
        to: email,
        subject: "Thank you for contacting me",
        headers: {
          "List-Unsubscribe":
            "<mailto:contact@richadali.dev?subject=unsubscribe>",
          "X-Mailer": "Portfolio Contact Form",
          "Message-ID": `<${Date.now()}.${Math.random()
            .toString(36)
            .substr(2, 9)}@richadali.dev>`,
          "In-Reply-To": `<contact-form-${Date.now()}@richadali.dev>`,
          References: `<contact-form-${Date.now()}@richadali.dev>`,
          "X-Priority": "3",
          "X-MSMail-Priority": "Normal",
          Importance: "Normal",
        },
        html: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; line-height: 1.6;">
            <h2 style="color: #333; text-align: center;">Thank You, ${name}</h2>
            
            <div style="background: #f8f9fa; padding: 20px; border-radius: 8px; text-align: center; margin: 20px 0; border: 1px solid #e9ecef;">
              <h3 style="margin: 0 0 15px 0; color: #333;">Message Received Successfully</h3>
              <p style="margin: 0; font-size: 16px; color: #666;">
                I will get back to you within 24 hours.
              </p>
            </div>
            
            <div style="padding: 20px; background: #f9f9f9; border-radius: 8px; margin: 20px 0;">
              <h4 style="color: #333; margin-top: 0;">Your Message Summary:</h4>
              <p><strong>Subject:</strong> ${subject}</p>
              <p><strong>Message:</strong> ${message.substring(0, 150)}${
          message.length > 150 ? "..." : ""
        }</p>
            </div>
            
            <div style="text-align: center; margin: 30px 0;">
              <p style="color: #666; margin: 10px 0;">Feel free to reach out anytime:</p>
              <p style="margin: 5px 0;">
                Email: <a href="mailto:contact@richadali.dev" style="color: #7B4397; text-decoration: none;">contact@richadali.dev</a>
              </p>
              <p style="margin: 5px 0;">
                Phone: <a href="tel:+917002615524" style="color: #7B4397; text-decoration: none;">+91 7002615524</a>
              </p>
            </div>
            
            <div style="text-align: center; margin-top: 40px; padding-top: 20px; border-top: 1px solid #eee;">
              <p style="color: #666; font-size: 14px; margin: 0;">
                Best regards,<br>
                <strong style="color: #333;">Richad Ali</strong><br>
                Software Engineer
              </p>
              <p style="color: #999; font-size: 12px; margin: 15px 0 0 0;">
                This is an automated response to confirm receipt of your message.
              </p>
            </div>
          </div>
        `,
        text: `
Dear ${name},

Thank you for contacting me! I have received your message and will get back to you within 24 hours.

Your message summary:
Subject: ${subject}
Message: ${message.substring(0, 200)}${message.length > 200 ? "..." : ""}

For urgent matters, you can reach me directly at:
Email: contact@richadali.dev
Phone: +91 7002615524

Best regards,
Richad Ali
Software Developer

This is an automated response to confirm receipt of your message.
        `,
      };

      // Send both emails
      console.log("Sending emails...");
      await Promise.all([
        transporter.sendMail(mailOptions),
        transporter.sendMail(autoResponseOptions),
      ]);
      console.log("Emails sent successfully");

      res.json({
        success: true,
        message: "Message sent successfully! Auto-response sent to sender.",
      });
    } catch (error) {
      console.error("Contact form error:", error);

      // Don't expose internal errors to client
      res.status(500).json({
        success: false,
        message: "Failed to send message. Please try again later.",
      });
    }
  }
);

// 404 handler
app.use("*", (req, res) => {
  res.status(404).json({
    success: false,
    message: "API endpoint not found",
  });
});

// Global error handler
app.use((error, req, res, next) => {
  console.error("Server error:", error);
  res.status(500).json({
    success: false,
    message: "Internal server error",
  });
});

// Initialize database and start server
const startServer = async () => {
  try {
    // Test database connection
    console.log("🔌 Connecting to database...");
    const dbConnected = await testConnection();

    if (!dbConnected) {
      console.error(
        "❌ Failed to connect to database. Please check your database configuration."
      );
      process.exit(1);
    }

    // Initialize database tables
    console.log("🏗️ Initializing database tables...");
    await initializeTables();

    // Start the blog scheduler
    console.log("📅 Starting blog scheduler...");
    await blogScheduler.start();

    // Start server
    app.listen(PORT, () => {
      console.log(`✅ Server running on port ${PORT}`);
      console.log(`📧 Email service configured for: ${process.env.ZOHO_EMAIL}`);
      console.log(
        `🌐 CORS enabled for: ${
          process.env.FRONTEND_URL || "http://localhost:3000"
        }`
      );
      console.log(
        `📝 Blog API available at: http://localhost:${PORT}/api/blog`
      );
      console.log(
        `⚡ Scheduler API available at: http://localhost:${PORT}/api/scheduler`
      );
      console.log("");
      console.log("✅ Portfolio backend is ready!");
      console.log(
        "📊 Blog posts will be automatically generated daily at 9:00 AM IST"
      );
    });
  } catch (error) {
    console.error("❌ Failed to start server:", error);
    process.exit(1);
  }
};

// Handle graceful shutdown
process.on("SIGTERM", () => {
  console.log("🛑 SIGTERM received, shutting down gracefully...");
  blogScheduler.stop();
  process.exit(0);
});

process.on("SIGINT", () => {
  console.log("🛑 SIGINT received, shutting down gracefully...");
  blogScheduler.stop();
  process.exit(0);
});

startServer();

module.exports = app;
