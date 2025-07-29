const { GoogleGenerativeAI } = require("@google/generative-ai");
const fs = require('fs');
const path = require('path');

class GeminiImageService {
  constructor() {
    this.apiKey = process.env.GEMINI_API_KEY;
    
    if (!this.apiKey) {
      console.warn("⚠️ GEMINI_API_KEY not found in environment variables");
    }
    
    this.genAI = new GoogleGenerativeAI(this.apiKey);
    this.model = this.genAI.getGenerativeModel({
      model: "gemini-2.0-flash-preview-image-generation",
      generationConfig: {
        responseModalities: ["IMAGE", "TEXT"]
      }
    });
  }

  /**
   * Generate an AI image based on blog content and tags
   * @param {string} topic - Blog topic
   * @param {string} category - Blog category
   * @param {Array} tags - Blog tags array
   * @param {string} excerpt - Blog excerpt for context
   * @returns {Promise<string>} - Public URL of the generated image
   */
  async generateBlogImage(topic, category, tags = [], excerpt = "") {
    try {
      console.log(`🎨 Generating AI image with Gemini for topic: "${topic}"`);
      
      // Create a relevant prompt based on blog content
      const prompt = this.createImagePrompt(topic, category, tags, excerpt);
      console.log(`📝 Image prompt: "${prompt}"`);
      
      // Generate image using Gemini with explicit image request
      const result = await this.model.generateContent({
        contents: [{
          role: "user",
          parts: [
            { text: `Please generate an image for: ${prompt}` }
          ]
        }]
      });
      
      const response = await result.response;
      
      // Log the full response for debugging
      const sanitizedResponse = JSON.parse(JSON.stringify(response));
      if (sanitizedResponse.candidates) {
        for (const candidate of sanitizedResponse.candidates) {
          if (candidate.content && candidate.content.parts) {
            for (const part of candidate.content.parts) {
              if (part.inlineData) {
                part.inlineData.data = "BASE64_DATA_REDACTED";
              }
            }
          }
        }
      }
      console.log("Full Gemini response (sanitized):", JSON.stringify(sanitizedResponse, null, 2));
      
      // Extract image data from response
      if (response.candidates && response.candidates.length > 0) {
        const candidate = response.candidates[0];
        if (candidate.content && candidate.content.parts && candidate.content.parts.length > 0) {
          for (const part of candidate.content.parts) {
            if (part.inlineData) {
              // Return data URI for the image
              const imageData = part.inlineData;
              const base64Data = imageData.data;
              const imageBuffer = Buffer.from(base64Data, 'base64');
  
              const blogsDir = path.join(__dirname, '..', '..', 'public', 'images', 'blogs');
              if (!fs.existsSync(blogsDir)) {
                fs.mkdirSync(blogsDir, { recursive: true });
              }
  
              const imageName = `blog-${Date.now()}.png`;
              const imagePath = path.join(blogsDir, imageName);
  
              fs.writeFileSync(imagePath, imageBuffer);
  
              const imageUrl = `/images/blogs/${imageName}`;
              console.log(`✅ Image saved successfully: ${imageUrl}`);
              return imageUrl;
            }
          }
        }
      }
      
      throw new Error("No image data found in Gemini response");
    } catch (error) {
      console.error("❌ Failed to generate AI image with Gemini:", error.message);
      
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
        "modern computer setup with clean code on screen, developer workspace, professional lighting, high quality, 4k resolution",
      "react-frontend":
        "sleek web interface design, modern UI elements, React development environment, clean aesthetic, high quality, 4k resolution",
      "backend-apis":
        "server infrastructure, database connections, API architecture, tech-focused environment, high quality, 4k resolution",
      "devops-cloud":
        "cloud infrastructure, server networks, deployment pipelines, modern DevOps setup, high quality, 4k resolution",
      "ai-ml":
        "artificial intelligence visualization, neural networks, data science workspace, futuristic tech, high quality, 4k resolution",
      "career-tips":
        "professional growth concept, success mindset, modern office environment, career development, high quality, 4k resolution",
    };

    const baseStyle =
      categoryStyles[category] ||
      "modern technology setup, programming environment, professional workspace, high quality, 4k resolution";

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
      "landscape orientation, 16:9 aspect ratio",
      "no text overlays, suitable for blog thumbnail",
    ]
      .filter(Boolean)
      .join(", ");

    return prompt;
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

      console.log("🔍 Running Gemini Image API health check...");

      // Simple test generation
      const result = await this.model.generateContent({
        contents: [{
          role: "user",
          parts: [
            { text: "Please generate an image for: simple technology illustration" }
          ]
        }]
      });
      
      const response = await result.response;
      
      if (response.candidates && response.candidates.length > 0) {
        return {
          status: "success",
          message: "Gemini Image API is accessible",
        };
      } else {
        return {
          status: "error",
          message: "Gemini Image API returned empty response",
        };
      }
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
      console.log("🧪 Testing Gemini AI image generation...");
      console.log(`📝 Test prompt: "${prompt}"`);

      const imageData = await this.generateBlogImage(
        prompt,
        "web-development",
        ["technology", "programming", "illustration"],
        "Test generation for debugging purposes"
      );

      return {
        status: "success",
        imageData,
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

module.exports = GeminiImageService;