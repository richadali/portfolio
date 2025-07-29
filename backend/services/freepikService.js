const axios = require("axios");

class FreepikService {
  constructor() {
    this.apiKey = process.env.FREEPIK_API_KEY;
    this.baseUrl = "https://api.freepik.com/v1/ai/mystic";

    if (!this.apiKey) {
      console.warn("⚠️ FREEPIK_API_KEY not found in environment variables");
    }

    // Configure axios instance with default headers
    this.client = axios.create({
      baseURL: this.baseUrl,
      headers: {
        "x-freepik-api-key": this.apiKey, // Changed from X-Freepik-API-Key to x-freepik-api-key
        "Content-Type": "application/json",
      },
      timeout: 30000, // 30 second timeout
    });
  }

  /**
   * Generate an AI image based on blog content and tags
   * @param {string} topic - Blog topic
   * @param {string} category - Blog category
   * @param {Array} tags - Blog tags array
   * @param {string} excerpt - Blog excerpt for context
   * @returns {Promise<string>} - Generated image URL
   */
  async generateBlogImage(topic, category, tags = [], excerpt = "") {
    try {
      console.log(`🎨 Generating AI image for topic: "${topic}"`);

      // Create a relevant prompt based on blog content
      const prompt = this.createImagePrompt(topic, category, tags, excerpt);
      console.log(`📝 Image prompt: "${prompt}"`);

      // Step 1: Start image generation task
      const taskId = await this.initiateImageGeneration(prompt);
      console.log(`⏳ Image generation task started: ${taskId}`);

      // Step 2: Poll for completion
      const imageUrl = await this.waitForImageCompletion(taskId);
      console.log(`✅ Image generated successfully: ${imageUrl}`);

      return imageUrl;
    } catch (error) {
      console.error("❌ Failed to generate AI image:", error.message);

      // Return fallback image on error
      return this.getFallbackImage(category);
    }
  }

  /**
   * Create a detailed image prompt based on blog content
   */
  createImagePrompt(topic, category, tags = [], excerpt = "") {
    const categoryStyles = {
      "web-development":
        "modern computer setup with clean code on screen, developer workspace, professional lighting",
      "react-frontend":
        "sleek web interface design, modern UI elements, React development environment, clean aesthetic",
      "backend-apis":
        "server infrastructure, database connections, API architecture, tech-focused environment",
      "devops-cloud":
        "cloud infrastructure, server networks, deployment pipelines, modern DevOps setup",
      "ai-ml":
        "artificial intelligence visualization, neural networks, data science workspace, futuristic tech",
      "career-tips":
        "professional growth concept, success mindset, modern office environment, career development",
    };

    const baseStyle =
      categoryStyles[category] ||
      "modern technology setup, programming environment, professional workspace";

    // Extract key technical terms from tags
    const relevantTags = tags
      .filter(
        (tag) =>
          tag.length > 2 &&
          !["and", "the", "for", "with"].includes(tag.toLowerCase())
      )
      .slice(0, 3) // Use top 3 most relevant tags
      .join(", ");

    // Create comprehensive prompt
    const prompt = [
      `Professional tech illustration related to ${topic}`,
      relevantTags ? `featuring ${relevantTags}` : "",
      baseStyle,
      "high quality, modern, clean design, professional photography style, 4k resolution",
      "no text overlays, suitable for blog thumbnail",
    ]
      .filter(Boolean)
      .join(", ");

    return prompt;
  }

  /**
   * Initiate image generation and return task ID
   */
  async initiateImageGeneration(prompt) {
    try {
      console.log(`🚀 Initiating Freepik Mystic API request...`);

      // Use the correct parameters as per official Freepik documentation
      const requestBody = {
        prompt: prompt,
        structure_strength: 50,
        adherence: 50,
        hdr: 50,
        resolution: "1k", // 1K resolution
        aspect_ratio: "widescreen_16_9", // 16:9 aspect ratio for blog thumbnails
        model: "realism", // Realistic style for professional look
        creative_detailing: 33,
        engine: "automatic", // Let Freepik choose the best engine
        fixed_generation: false,
        filter_nsfw: true, // Filter out NSFW content
      };

      console.log(`📤 Request body:`, JSON.stringify(requestBody, null, 2));

      const response = await this.client.post("", requestBody);

      console.log(`📥 API Response status:`, response.status);
      console.log(
        `📥 API Response data:`,
        JSON.stringify(response.data, null, 2)
      );

      // Handle different possible response formats
      if (response.data) {
        // Try different possible task ID locations in response
        const taskId =
          response.data.task_id ||
          response.data.id ||
          (response.data.data && response.data.data.id) ||
          (response.data.data && response.data.data.task_id);

        if (taskId) {
          return taskId;
        } else {
          console.error("❌ No task ID found in response:", response.data);
          throw new Error("No task ID returned from Freepik API");
        }
      } else {
        throw new Error("Empty response from Freepik API");
      }
    } catch (error) {
      console.error("❌ Full error object:", error);

      if (error.response) {
        console.error("❌ Response status:", error.response.status);
        console.error("❌ Response headers:", error.response.headers);
        console.error("❌ Response data:", error.response.data);

        const errorMsg =
          error.response.data?.message ||
          error.response.data?.detail ||
          error.response.data?.error ||
          error.response.statusText;

        throw new Error(
          `Freepik API error (${error.response.status}): ${errorMsg}`
        );
      } else if (error.request) {
        console.error("❌ No response received:", error.request);
        throw new Error("No response received from Freepik API");
      } else {
        console.error("❌ Request setup error:", error.message);
        throw new Error(`Network error: ${error.message}`);
      }
    }
  }

  /**
   * Poll for image generation completion
   */
  async waitForImageCompletion(taskId, maxAttempts = 30, delayMs = 3000) {
    for (let attempt = 1; attempt <= maxAttempts; attempt++) {
      try {
        console.log(
          `🔄 Checking image generation status... (${attempt}/${maxAttempts})`
        );

        const response = await this.client.get(`/${taskId}`);
        console.log(
          `📊 Task status response:`,
          JSON.stringify(response.data, null, 2)
        );

        // Handle different possible response formats
        const task = response.data.data || response.data;

        const status = task.status || task.task_status;

        switch (status) {
          case "completed":
          case "COMPLETED":
            // FIXED: The image URL is directly in the generated array as a string
            const imageUrl =
              task.generated?.[0] || // This is the correct format - direct string in array
              task.result?.images?.[0]?.url ||
              task.result?.image_url ||
              task.images?.[0]?.url ||
              task.image_url;

            if (imageUrl) {
              console.log(`✅ Successfully extracted image URL: ${imageUrl}`);
              return imageUrl;
            } else {
              console.error("❌ No image URL in completed task:", task);
              throw new Error("No images in completed task result");
            }

          case "failed":
          case "FAILED":
            const errorMsg =
              task.error || task.error_message || "Unknown error";
            throw new Error(`Image generation failed: ${errorMsg}`);

          case "processing":
          case "PROCESSING":
          case "pending":
          case "PENDING":
          case "IN_PROGRESS":
            // Wait and try again
            console.log(`⏳ Status: ${status}, waiting ${delayMs}ms...`);
            await new Promise((resolve) => setTimeout(resolve, delayMs));
            break;

          default:
            console.warn(`❓ Unknown status: ${status}`);
            await new Promise((resolve) => setTimeout(resolve, delayMs));
        }
      } catch (error) {
        if (error.response && error.response.status === 404) {
          throw new Error("Task not found - invalid task ID");
        }

        console.warn(`⚠️ Attempt ${attempt} failed:`, error.message);
        if (attempt === maxAttempts) {
          throw new Error(`Failed to get image after ${maxAttempts} attempts`);
        }

        await new Promise((resolve) => setTimeout(resolve, delayMs));
      }
    }

    throw new Error("Image generation timed out");
  }

  /**
   * Get fallback image when AI generation fails
   */
  getFallbackImage(category) {
    const fallbackImages = {
      "web-development":
        "https://images.pexels.com/photos/3861969/pexels-photo-3861969.jpeg?auto=compress&cs=tinysrgb&w=800&h=600&fit=crop",
      "react-frontend":
        "https://images.pexels.com/photos/4348404/pexels-photo-4348404.jpeg?auto=compress&cs=tinysrgb&w=800&h=600&fit=crop",
      "backend-apis":
        "https://images.pexels.com/photos/1181244/pexels-photo-1181244.jpeg?auto=compress&cs=tinysrgb&w=800&h=600&fit=crop",
      "devops-cloud":
        "https://images.pexels.com/photos/325185/pexels-photo-325185.jpeg?auto=compress&cs=tinysrgb&w=800&h=600&fit=crop",
      "ai-ml":
        "https://images.pexels.com/photos/3183150/pexels-photo-3183150.jpeg?auto=compress&cs=tinysrgb&w=800&h=600&fit=crop",
      "career-tips":
        "https://images.pexels.com/photos/3184291/pexels-photo-3184291.jpeg?auto=compress&cs=tinysrgb&w=800&h=600&fit=crop",
    };

    return fallbackImages[category] || fallbackImages["web-development"];
  }

  /**
   * Health check for the API
   */
  async healthCheck() {
    try {
      if (!this.apiKey) {
        return { status: "error", message: "API key not configured" };
      }

      console.log("🔍 Running Freepik API health check...");

      // Simple test generation
      const taskId = await this.initiateImageGeneration(
        "simple technology illustration"
      );
      return {
        status: "success",
        message: "Freepik API is accessible",
        taskId,
      };
    } catch (error) {
      console.error("❌ Health check failed:", error.message);
      return {
        status: "error",
        message: error.message,
        details: error.response?.data || "No additional details",
      };
    }
  }

  /**
   * Test image generation with detailed logging
   */
  async testImageGeneration(prompt = "Professional tech illustration") {
    try {
      console.log("🧪 Testing Freepik AI image generation...");
      console.log(`📝 Test prompt: "${prompt}"`);

      const imageUrl = await this.generateBlogImage(
        prompt,
        "web-development",
        ["technology", "programming", "illustration"],
        "Test generation for debugging purposes"
      );

      return {
        status: "success",
        imageUrl,
        message: "Test image generation completed successfully",
      };
    } catch (error) {
      console.error("❌ Test generation failed:", error.message);
      return {
        status: "error",
        message: error.message,
        details: error.response?.data || "No additional details",
      };
    }
  }
}

module.exports = FreepikService;
