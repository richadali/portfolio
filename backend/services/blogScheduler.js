const cron = require("node-cron");
const GeminiService = require("./geminiService");
const BlogModel = require("../models/blogModel");

class BlogScheduler {
  constructor() {
    this.geminiService = new GeminiService();
    this.isRunning = false;
    this.lastRun = null;
    this.nextRun = null;
    this.dailyTask = null;
  }

  // Start the daily blog generation scheduler
  start() {
    if (this.isRunning) {
      console.log("📅 Blog scheduler is already running");
      return;
    }

    // Schedule daily blog generation at 9:00 AM
    this.dailyTask = cron.schedule(
      "0 9 * * *",
      async () => {
        await this.generateDailyBlog();
      },
      {
        scheduled: true,
        timezone: "Asia/Kolkata", // Adjust timezone as needed
      }
    );

    this.isRunning = true;
    this.updateNextRun();

    console.log(
      "✅ Blog scheduler started - Daily blog generation at 9:00 AM IST"
    );
  }

  // Stop the scheduler
  stop() {
    if (this.dailyTask) {
      this.dailyTask.destroy();
      this.dailyTask = null;
    }

    this.isRunning = false;
    this.nextRun = null;

    console.log("⏹️ Blog scheduler stopped");
  }

  // Restart the scheduler
  restart() {
    this.stop();
    this.start();
    console.log("🔄 Blog scheduler restarted");
  }

  // Generate daily blog post
  async generateDailyBlog() {
    const startTime = new Date();
    console.log(
      `🚀 Starting daily blog generation at ${startTime.toISOString()}`
    );

    try {
      // Check if a blog was already generated today
      const today = new Date();
      today.setHours(0, 0, 0, 0);

      const todaysBlogs = await this.checkTodaysPosts();

      if (todaysBlogs.length > 0) {
        console.log(
          `📝 Blog already generated today (${todaysBlogs.length} posts found). Skipping...`
        );
        return;
      }

      // Generate diverse content by rotating categories
      const category = this.selectCategoryForToday();

      console.log(`🎯 Generating blog post for category: ${category}`);

      // Generate the blog post
      const blogData = await this.geminiService.generatePostForCategory(
        category
      );

      // Save to database
      const result = await BlogModel.create(blogData);

      this.lastRun = new Date();

      console.log(`✅ Daily blog generated successfully!`);
      console.log(`📄 Title: "${blogData.title}"`);
      console.log(`🏷️ Category: ${blogData.category}`);
      console.log(`🔗 Slug: ${result.slug}`);
      console.log(`⏱️ Generation time: ${new Date() - startTime}ms`);

      // Log statistics
      await this.logDailyStats();
    } catch (error) {
      console.error("❌ Error generating daily blog:", error);

      // Try to generate a simpler post as fallback
      try {
        console.log("🔄 Attempting fallback blog generation...");
        const fallbackBlog = await this.geminiService.generateBlogPost();
        const result = await BlogModel.create(fallbackBlog);

        console.log(`✅ Fallback blog generated: "${fallbackBlog.title}"`);
        this.lastRun = new Date();
      } catch (fallbackError) {
        console.error("❌ Fallback generation also failed:", fallbackError);

        // Send notification email about the failure (you can implement this later)
        await this.notifyGenerationFailure(error, fallbackError);
      }
    }

    this.updateNextRun();
  }

  // Check if any blogs were generated today
  async checkTodaysPosts() {
    try {
      const today = new Date();
      const startOfDay = new Date(
        today.getFullYear(),
        today.getMonth(),
        today.getDate()
      );
      const endOfDay = new Date(
        today.getFullYear(),
        today.getMonth(),
        today.getDate() + 1
      );

      const result = await BlogModel.getAll({
        page: 1,
        limit: 10,
        sortBy: "created_at",
        sortOrder: "DESC",
      });

      // Filter posts created today
      const todaysPosts = result.posts.filter((post) => {
        const postDate = new Date(post.created_at);
        return (
          postDate >= startOfDay && postDate < endOfDay && post.generated_by_ai
        );
      });

      return todaysPosts;
    } catch (error) {
      console.error("Error checking today's posts:", error);
      return [];
    }
  }

  // Select category for today based on day of week
  selectCategoryForToday() {
    const categories = [
      "web-development",
      "react-frontend",
      "backend-apis",
      "devops-cloud",
      "ai-ml",
      "career-tips",
    ];

    const dayOfWeek = new Date().getDay(); // 0 = Sunday, 1 = Monday, etc.

    // Rotate categories by day of week
    const categoryIndex = dayOfWeek % categories.length;
    return categories[categoryIndex];
  }

  // Generate a manual blog post (for testing or immediate generation)
  async generateManualBlog(category = null, topic = null) {
    console.log("🔧 Manual blog generation triggered");

    try {
      let blogData;

      if (topic) {
        blogData = await this.geminiService.generateBlogPost(topic);
      } else if (category) {
        blogData = await this.geminiService.generatePostForCategory(category);
      } else {
        blogData = await this.geminiService.generateBlogPost();
      }

      const result = await BlogModel.create(blogData);

      console.log(`✅ Manual blog generated: "${blogData.title}"`);
      return { success: true, data: result, blog: blogData };
    } catch (error) {
      console.error("❌ Manual blog generation failed:", error);
      return { success: false, error: error.message };
    }
  }

  // Log daily statistics
  async logDailyStats() {
    try {
      const stats = await BlogModel.getStats();
      console.log("📊 Blog Statistics:");
      console.log(`   📝 Total Posts: ${stats.total_posts}`);
      console.log(`   👀 Total Views: ${stats.total_views}`);
      console.log(`   📂 Categories: ${stats.total_categories}`);
      console.log(
        `   ⏱️ Avg Reading Time: ${Math.round(stats.avg_reading_time)} minutes`
      );
      console.log(`   🔥 Recent Views (7d): ${stats.recent_views}`);
    } catch (error) {
      console.error("Error logging daily stats:", error);
    }
  }

  // Update next run time
  updateNextRun() {
    if (!this.isRunning) return;

    const now = new Date();
    const tomorrow = new Date(now);
    tomorrow.setDate(tomorrow.getDate() + 1);
    tomorrow.setHours(9, 0, 0, 0);

    this.nextRun = tomorrow;
  }

  // Get scheduler status
  getStatus() {
    return {
      isRunning: this.isRunning,
      lastRun: this.lastRun,
      nextRun: this.nextRun,
      timezone: "Asia/Kolkata",
      schedule: "Daily at 9:00 AM",
    };
  }

  // Notify about generation failure (placeholder for future implementation)
  async notifyGenerationFailure(primaryError, fallbackError) {
    console.log("💌 Notification: Blog generation failed");
    console.log("Primary Error:", primaryError.message);
    console.log("Fallback Error:", fallbackError.message);

    // TODO: Implement email notification
    // This could send an email to the site owner about the failure
  }

  // Generate multiple posts for content backlog
  async generateContentBacklog(count = 5) {
    console.log(`🎯 Generating content backlog (${count} posts)`);

    const results = [];
    const categories = [
      "web-development",
      "react-frontend",
      "backend-apis",
      "devops-cloud",
      "ai-ml",
      "career-tips",
    ];

    for (let i = 0; i < count; i++) {
      try {
        const category = categories[i % categories.length];
        const blogData = await this.geminiService.generatePostForCategory(
          category
        );
        const result = await BlogModel.create(blogData);

        results.push({
          id: result.id,
          slug: result.slug,
          title: blogData.title,
          category: blogData.category,
        });

        console.log(`✅ Generated ${i + 1}/${count}: "${blogData.title}"`);

        // Add delay between generations
        if (i < count - 1) {
          await new Promise((resolve) => setTimeout(resolve, 3000));
        }
      } catch (error) {
        console.error(`❌ Failed to generate post ${i + 1}:`, error.message);
      }
    }

    console.log(
      `🎉 Content backlog completed: ${results.length}/${count} posts generated`
    );
    return results;
  }
}

module.exports = BlogScheduler;
