const axios = require("axios");
const fs = require("fs");
const path = require("path");

class PollinationImageService {
  constructor() {
    this.modelUrl = "https://pollinations.ai/p/";
  }

  /**
   * Generate an AI image based on blog content and tags
   * @param {string} imagePrompt - The detailed prompt for the image
   * @param {string} category - Blog category for fallback purposes
   * @returns {Promise<string>} - Public URL of the generated image
   */
  async generateBlogImage(imagePrompt, category) {
    try {
      console.log(`🎨 Generating AI image with Pollinations.ai...`);
      console.log(`📝 Image prompt: "${imagePrompt}"`);

      const encodedPrompt = encodeURIComponent(imagePrompt);
      const imageUrl = `${this.modelUrl}${encodedPrompt}`;

      console.log(`🔗 Fetching image from: ${imageUrl}`);

      const response = await axios.get(imageUrl, {
        responseType: "arraybuffer",
      });

      const buffer = Buffer.from(response.data, "binary");

      const publicPath =
        process.env.FRONTEND_PUBLIC_PATH ||
        path.join(__dirname, "..", "..", "public");
      const blogsDir = path.join(publicPath, "images", "blogs");
      if (!fs.existsSync(blogsDir)) {
        fs.mkdirSync(blogsDir, { recursive: true });
      }

      const imageName = `blog-${Date.now()}.png`;
      const imagePath = path.join(blogsDir, imageName);

      fs.writeFileSync(imagePath, buffer);

      const savedImageUrl = `/images/blogs/${imageName}`;
      console.log(`✅ Image saved successfully: ${savedImageUrl}`);
      return savedImageUrl;
    } catch (error) {
      console.error(
        "❌ Failed to generate AI image with Pollinations.ai:",
        error.message
      );

      return this.getFallbackImage(category);
    }
  }

  /**
   * Get fallback image when AI generation fails
   */
  getFallbackImage(category) {
    const fallbackImages = {
      "web-development":
        "https://images.pexels.com/photos/3861969/pexels-photo-3861969.jpeg?auto=compress&cs=tinysrgb&w=800&h=600&fit=crop",
      "frontend-ux":
        "https://images.pexels.com/photos/4348404/pexels-photo-4348404.jpeg?auto=compress&cs=tinysrgb&w=800&h=600&fit=crop",
      "backend-apis":
        "https://images.pexels.com/photos/1181244/pexels-photo-1181244.jpeg?auto=compress&cs=tinysrgb&w=800&h=600&fit=crop",
      "devops-cloud":
        "https://images.pexels.com/photos/325185/pexels-photo-325185.jpeg?auto=compress&cs=tinysrgb&w=800&h=600&fit=crop",
      "ecommerce-cms":
        "https://images.pexels.com/photos/5926382/pexels-photo-5926382.jpeg?auto=compress&cs=tinysrgb&w=800&h=600&fit=crop",
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
      console.log("🔍 Running Pollinations.ai API health check...");
      const testPrompt = "A simple test prompt";
      const encodedPrompt = encodeURIComponent(testPrompt);
      const testUrl = `${this.modelUrl}${encodedPrompt}`;

      const response = await axios.get(testUrl, {
        responseType: "arraybuffer",
        timeout: 10000, 
      });

      if (response.status === 200 && response.data.length > 0) {
        return {
          status: "success",
          message: "Pollinations.ai API is accessible",
        };
      } else {
        return {
          status: "error",
          message: "Pollinations.ai API returned an invalid response",
        };
      }
    } catch (error) {
      console.error("❌ Health check failed:", error.message);
      return {
        status: "error",
        message: error.message,
      };
    }
  }
}

module.exports = PollinationImageService;