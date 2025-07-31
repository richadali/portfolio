const { GoogleGenerativeAI } = require("@google/generative-ai");
const GeminiImageService = require("./geminiImageService");
const FluxSchnellImageService = require("./fluxSchnellImageService");
const PollinationImageService = require("./pollinationImageService");
const BlogModel = require("../models/blogModel");

class GeminiService {
  constructor() {
    this.genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
    this.model = this.genAI.getGenerativeModel({ model: "gemini-2.0-flash" });
    if (process.env.IMAGE_GENERATION_SERVICE === "flux") {
      this.imageService = new FluxSchnellImageService();
    } else if (process.env.IMAGE_GENERATION_SERVICE === "pollination") {
      this.imageService = new PollinationImageService();
    } else {
      this.imageService = new GeminiImageService();
    }
    this.MAX_RETRIES = 3;
    this.RETRY_DELAY = 1000;
    this.usedTopics = new Set();
    this.topicPool = [
      // Web Development
      {
        category: "web-development",
        topics: [
          "Modern CSS Features and Best Practices",
          "Progressive Web Apps",
          "Web Performance Optimization",
          "Responsive Design Patterns for Modern Devices",
          "JavaScript ESNext: What's New and How to Use It",
          "Building Accessible Web Applications (WCAG)",
          "Cross-Browser Compatibility in 2025",
          "Thymeleaf for Server-Side Rendering",
          "Integrating Google Maps API into Web Apps",
        ],
      },
      // Frontend & UI/UX
      {
        category: "frontend-ux",
        topics: [
          "Choosing a Frontend Framework: React vs. Angular vs. Vue",
          "State Management in Large-Scale Applications",
          "Building Design Systems with Material UI or Shadcn UI",
          "Mobile App Development with Flutter: A Beginner's Guide",
          "UI/UX Principles for Developers",
          "Optimizing Frontend Performance and Load Times",
          "Creating Custom UI Components",
          "The Rise of Micro-Frontends",
          "Form Handling and Validation Best Practices",
        ],
      },
      // Backend & APIs
      {
        category: "backend-apis",
        topics: [
          "Building RESTful APIs with SpringBoot",
          "Getting Started with PHP and Laravel",
          "GraphQL vs. REST: Which is Right for Your Project?",
          "Database Showdown: MySQL vs. PostgreSQL vs. MongoDB",
          "Microservices Architecture with SpringBoot",
          "Authentication and Authorization in Modern Apps (OAuth, JWT)",
          "API Security Best Practices",
          "Using Scala for High-Performance Backend Systems",
          "Integrating with Firebase for Real-time Data",
        ],
      },
      // DevOps & Cloud
      {
        category: "devops-cloud",
        topics: [
          "Introduction to CI/CD with Git and Docker",
          "Deploying Applications on AWS EC2",
          "Managing Infrastructure as Code with Google Cloud",
          "Web Server Configuration: Apache vs. Nginx",
          "Containerization with Docker: A Practical Guide",
          "Monitoring and Logging for Production Systems",
          "Cloud Security Fundamentals",
          "Setting up an Ubuntu Server for Web Hosting",
          "Load Balancing Strategies in AWS",
        ],
      },
      // E-commerce & CMS
      {
        category: "ecommerce-cms",
        topics: [
          "Building an E-commerce Site with Shopify",
          "Customizing Magento for Enterprise E-commerce",
          "Headless WordPress with a Modern Frontend",
          "Integrating Payment Gateways: Razorpay vs. Billdesk",
          "Managing Inventory Across Multiple Platforms",
          "The Pros and Cons of Different CMS Platforms",
          "SEO for E-commerce Websites",
          "Building a Custom Ticketing System with Chatwoot",
        ],
      },
      // AI & Machine Learning
      {
        category: "ai-ml",
        topics: [
          "Integrating Google Gemini into Your Applications",
          "Building AI-Powered Features for Web Apps",
          "Natural Language Processing for Developers",
          "Introduction to Machine Learning Concepts",
          "Ethical Considerations in AI Development",
          "Using AI for Code Generation and Assistance",
          "Creating a Simple Chatbot with AI",
          "The Future of AI in Software Development",
        ],
      },
      // Career & Tips
      {
        category: "career-tips",
        topics: [
          "Effective Code Review Practices",
          "Tools for Developer Productivity",
          "How to Build a Strong Developer Portfolio",
          "Navigating a Career as a Full-Stack Developer",
          "Preparing for Technical Interviews",
          "Contributing to Open Source Projects",
          "Learning New Technologies Effectively",
          "Time Management for Software Engineers",
        ],
      },
    ];
  }

  async initialize() {
    console.log("Initializing GeminiService and populating used topics...");
    const used = await BlogModel.getUsedTopics();
    this.usedTopics = new Set(used);
    console.log(
      `✅ Populated ${this.usedTopics.size} used topics from database.`
    );
  }

  // Get a random topic that hasn't been used recently
  getRandomTopic() {
    const allTopics = this.topicPool.flatMap((category) =>
      category.topics.map((topic) => ({
        topic,
        category: category.category,
      }))
    );

    // Filter out recently used topics
    const availableTopics = allTopics.filter(
      (item) => !this.usedTopics.has(item.topic)
    );

    // If all topics are used, reset the used topics set
    if (availableTopics.length === 0) {
      this.usedTopics.clear();
      return allTopics[Math.floor(Math.random() * allTopics.length)];
    }

    const selectedTopic =
      availableTopics[Math.floor(Math.random() * availableTopics.length)];
    this.usedTopics.add(selectedTopic.topic);

    return selectedTopic;
  }

  // Generate a comprehensive blog post with retry logic
  async generateBlogPost(customTopic = null) {
    let retries = 0;
    const selectedTopic = customTopic || this.getRandomTopic();
    const topic =
      typeof selectedTopic === "string" ? selectedTopic : selectedTopic.topic;
    const category =
      typeof selectedTopic === "object"
        ? selectedTopic.category
        : "web-development";

    console.log(`🤖 Starting blog post generation about: ${topic}`);

    while (retries < this.MAX_RETRIES) {
      try {
        console.log(
          `Attempt ${retries + 1}/${this.MAX_RETRIES} to generate blog post`
        );
        const blogData = await this.attemptBlogPostGeneration(topic, category);
        console.log(`✅ Blog post generated successfully: "${blogData.title}"`);
        return blogData;
      } catch (error) {
        retries++;
        console.warn(
          `Attempt ${retries}/${this.MAX_RETRIES} failed:`,
          error.message
        );

        if (retries >= this.MAX_RETRIES) {
          console.error("All retry attempts failed:", error);
          throw new Error(
            `Failed to generate blog post after ${this.MAX_RETRIES} attempts. ${
              error.message || "Please try again later."
            }`
          );
        }

        // Wait before retrying with exponential backoff
        const delay = this.RETRY_DELAY * retries;
        console.log(`Waiting ${delay}ms before next attempt...`);
        await new Promise((resolve) => setTimeout(resolve, delay));
      }
    }

    throw new Error("Unexpected error in blog post generation");
  }

  // Attempt to generate a blog post with improved error handling
  async attemptBlogPostGeneration(topic, category) {
    console.log("Creating prompt for Gemini AI");
    const promptText = this.createBlogPrompt(topic);

    console.log("Sending request to Gemini AI");
    try {
      // Use the correct format for the generateContent method
      const result = await this.model.generateContent({
        contents: [
          {
            role: "user",
            parts: [{ text: promptText }],
          },
        ],
      });

      console.log("Received response from Gemini AI");
      const response = await result.response;
      const text = response.text();

      // Add detailed logging of the raw response
      console.log("=== RAW GEMINI RESPONSE START ===");
      console.log("Response length:", text.length);
      console.log("Full response text:");
      console.log(text);
      console.log("=== RAW GEMINI RESPONSE END ===");

      console.log("Processing AI response text");

      // Extract JSON from response
      const parsedData = this.extractAndParseJson(text);
      console.log("Successfully parsed JSON from AI response");

      // Validate and enhance the response
      const validatedData = await this.validateAndEnhanceBlogResponse(
        parsedData,
        topic,
        category
      );
      console.log("Validated and enhanced AI response");

      return validatedData;
    } catch (error) {
      console.error("Error during Gemini API call:", error);
      if (error.response) {
        console.error("API response error:", error.response);
      }
      throw error;
    }
  }

  // Create a detailed prompt for blog generation
  createBlogPrompt(topic) {
    return `
      You are an expert technical writer and software developer with deep knowledge of programming and web development.
      
      Create a comprehensive, professional blog post about "${topic}" for a software developer's portfolio blog.
      
      # REQUIREMENTS
      - Write in a conversational but professional tone
      - Target audience: fellow developers, potential employers, and tech enthusiasts
      - Include practical examples and code snippets where relevant
      - Structure with clear headings and subheadings using markdown
      - Make it engaging and informative
      - Length: 800-1200 words
      - Include actionable takeaways
      - Use markdown formatting for code blocks and emphasis
      - Demonstrate expertise while being accessible to developers at different levels
      - Include real-world examples and best practices
      - Add relevant technical insights and current industry perspectives
      
      # RESPONSE FORMAT
      Your response MUST be valid JSON with the following structure. Return ONLY the JSON object, no additional text:
      
      {
        "title": "An engaging title for the blog post (max 80 characters)",
        "content": "The full blog post content in markdown format with proper escaping",
        "excerpt": "A compelling 2-3 sentence excerpt that summarizes the post",
        "meta_title": "SEO optimized title (max 60 characters)",
        "meta_description": "SEO meta description (max 160 characters)",
        "tags": ["array", "of", "relevant", "technical", "tags"],
        "aspect_ratio": "16:9"
      }

      high quality, 4k resolution
      
      # CRITICAL INSTRUCTIONS
      1. Return ONLY valid JSON, no markdown code blocks or extra text
      2. Properly escape all quotes and newlines in the content field
      3. Ensure all JSON syntax is correct with no trailing commas
      4. Make the content substantial and valuable
      5. Include code examples where appropriate
      6. Add proper markdown formatting in the content field
      7. DO NOT repeat the title in the 'content' field. The content should start with the first paragraph.
    `;
  }

  // Extract and parse JSON from AI response
  extractAndParseJson(text) {
    console.log("Starting JSON extraction from AI response");
    console.log("Response text length:", text.length);

    // Log a sample of the text to help debug
    if (text.length > 200) {
      console.log(
        "First 200 chars of response:",
        text.substring(0, 200) + "..."
      );
    }

    let jsonString = "";

    // Extract JSON from markdown code blocks with better handling of nested code blocks
    // Find the opening ```json or ```
    const startPattern = /```(?:json)?\s*\n?/;
    const startMatch = text.match(startPattern);

    if (startMatch) {
      const startIndex = startMatch.index + startMatch[0].length;

      // Find the closing ``` by looking for it at the end of the response
      // Work backwards from the end to find the last ```
      let endIndex = -1;
      for (let i = text.length - 1; i >= startIndex; i--) {
        if (text.substring(i, i + 3) === "```") {
          endIndex = i;
          break;
        }
      }

      if (endIndex > startIndex) {
        jsonString = text.substring(startIndex, endIndex).trim();
        console.log("Found JSON in code block, length:", jsonString.length);

        // Try parsing directly first
        try {
          console.log("Attempting direct JSON parse from code block...");
          const directParsed = JSON.parse(jsonString);
          console.log("✅ Direct parse successful!");
          return directParsed;
        } catch (directError) {
          console.log(
            "Direct parse failed, continuing with cleanup...",
            directError.message
          );
        }
      } else {
        console.log("Could not find proper closing ``` for code block");
      }
    }

    // Fallback: try to find JSON object directly if code block extraction failed
    if (!jsonString) {
      const jsonMatch = text.match(/{[\s\S]*}/);
      if (jsonMatch) {
        jsonString = jsonMatch[0].trim();
        console.log("Found JSON object directly, length:", jsonString.length);
      } else {
        console.error("Failed to find JSON in the response");
        throw new Error(
          "Failed to parse JSON response from Gemini AI: No JSON found in response"
        );
      }
    }

    // Clean up any trailing or leading comments
    jsonString = jsonString.replace(/\/\*[\s\S]*?\*\/|\/\/.*/g, "");

    // Find the actual JSON object bounds
    const firstBrace = jsonString.indexOf("{");
    const lastBrace = jsonString.lastIndexOf("}");

    console.log("JSON brace detection:");
    console.log("  - First brace position:", firstBrace);
    console.log("  - Last brace position:", lastBrace);
    console.log("  - JSON string length:", jsonString.length);
    console.log("  - First 50 chars:", jsonString.substring(0, 50));
    console.log(
      "  - Last 50 chars:",
      jsonString.substring(jsonString.length - 50)
    );

    if (firstBrace === -1 || lastBrace === -1 || firstBrace >= lastBrace) {
      console.error(
        "No valid JSON braces found in string:",
        jsonString.substring(0, 200)
      );
      throw new Error("No valid JSON object found in response");
    }

    // Extract the JSON object
    jsonString = jsonString.substring(firstBrace, lastBrace + 1);
    console.log("Final extracted JSON length:", jsonString.length);

    console.log("Extracted JSON string length:", jsonString.length);
    console.log("JSON string preview:", jsonString.substring(0, 100) + "...");

    try {
      const parsedData = JSON.parse(jsonString);
      console.log("Successfully parsed JSON data");
      return parsedData;
    } catch (error) {
      console.error("JSON parsing error:", error);
      console.error(
        "Failed JSON string (first 500 chars):",
        jsonString.substring(0, 500)
      );
      throw new Error("Failed to parse JSON response: Invalid JSON format");
    }
  }

  // Validate and enhance the blog response
  async validateAndEnhanceBlogResponse(data, topic, category) {
    // Basic validation
    this.validateBlogResponse(data);

    // Add missing fields with defaults
    return await this.addDefaultsToMissingBlogFields(data, topic, category);
  }

  // Validate the structure of the blog response
  validateBlogResponse(data) {
    if (!data.title || typeof data.title !== "string") {
      throw new Error("Invalid response: missing or invalid title");
    }

    if (!data.content || typeof data.content !== "string") {
      throw new Error("Invalid response: missing or invalid content");
    }

    if (!data.excerpt || typeof data.excerpt !== "string") {
      throw new Error("Invalid response: missing or invalid excerpt");
    }

    if (data.content.length < 100) {
      throw new Error("Invalid response: content too short");
    }
  }

  // Add defaults to missing blog fields
  async addDefaultsToMissingBlogFields(data, topic, category) {
    // Ensure meta fields
    if (!data.meta_title) {
      data.meta_title =
        data.title.length > 60
          ? data.title.substring(0, 57) + "..."
          : data.title;
    }

    if (!data.meta_description) {
      data.meta_description =
        data.excerpt.length > 160
          ? data.excerpt.substring(0, 157) + "..."
          : data.excerpt;
    }

    // Ensure tags array
    if (!Array.isArray(data.tags)) {
      data.tags = this.generateTagsFromTopic(topic, category);
    }

    // Generate AI image using a structured prompt
    try {
      console.log("🎨 Engineering a structured prompt for image generation...");
      const imagePrompt = this.createImagePrompt(topic, category, data.tags);
      console.log("   Generated Image Prompt:", imagePrompt);

      console.log("🎨 Generating AI image with the engineered prompt...");
      data.featured_image = await this.imageService.generateBlogImage(
        imagePrompt,
        category,
        data.aspect_ratio
      );
    } catch (error) {
      console.warn(
        "⚠️ AI image generation failed, using fallback:",
        error.message
      );
      data.featured_image = this.generateFallbackImage(category);
    }

    // Add reading time if missing
    if (!data.reading_time) {
      const wordCount = data.content.split(/\s+/).length;
      data.reading_time = Math.max(1, Math.ceil(wordCount / 200)); // Average reading speed
    }

    // Add generation metadata
    data.category = category;
    data.generated_by_ai = true;
    data.ai_prompt = topic;
    data.author = "Richad Ali";

    return data;
  }

  // Generate fallback image when AI generation fails
  generateFallbackImage(category) {
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

  // Create a structured, high-quality image prompt
  createImagePrompt(topic, category, tags = []) {
    const categoryStyles = {
      "web-development":
        "modern computer setup with clean code on screen, developer workspace, professional lighting, high quality, 4k resolution, modern aesthetic",
      "frontend-ux":
        "sleek web interface design, UI elements, React development environment, clean aesthetic, high quality, 4k resolution, user-centric design",
      "backend-apis":
        "server infrastructure visualization, database schemas, API architecture diagram, tech-focused environment, high quality, 4k resolution, abstract background",
      "devops-cloud":
        "cloud infrastructure diagram, server networks, deployment pipelines, modern DevOps setup, high quality, 4k resolution, floating icons",
      "ai-ml":
        "artificial intelligence visualization, neural network art, data science workspace, futuristic tech, high quality, 4k resolution, glowing nodes",
      "ecommerce-cms":
        "e-commerce dashboard UI, online store interface, product grid, modern and clean, high quality, 4k resolution",
      "career-tips":
        "professional growth concept, abstract success visualization, modern office environment, career development path, high quality, 4k resolution, minimalist",
    };

    const baseStyle =
      categoryStyles[category] ||
      "modern technology setup, programming environment, professional workspace, high quality, 4k resolution";

    // Extract key technical terms from topic and tags
    const topicWords = topic.toLowerCase().split(/\s+/);
    const tagWords = tags.flatMap((tag) => tag.toLowerCase().split(/\s+/));
    const allWords = [...new Set([...topicWords, ...tagWords])];

    const relevantKeywords = allWords
      .filter(
        (word) =>
          word.length > 2 &&
          ![
            "and",
            "the",
            "for",
            "with",
            "guide",
            "developer's",
            "using",
            "from",
            "best",
            "practices",
            "introduction",
            "what's",
            "how",
          ].includes(word)
      )
      .slice(0, 4)
      .join(", ");

    // Create a comprehensive, comma-separated prompt
    const prompt = [
      `Professional tech illustration representing the concept of '${topic}'`,
      relevantKeywords ? `central themes include ${relevantKeywords}` : "",
      baseStyle,
      "landscape orientation, 16:9 aspect ratio",
      "digital art, detailed, no text overlays, suitable for a blog thumbnail",
    ]
      .filter(Boolean)
      .join(", ");

    return prompt;
  }

  // Generate multiple blog posts
  async generateMultiplePosts(count = 3) {
    const posts = [];

    for (let i = 0; i < count; i++) {
      try {
        const post = await this.generateBlogPost();
        posts.push(post);

        // Add delay between generations to avoid rate limiting
        if (i < count - 1) {
          await new Promise((resolve) => setTimeout(resolve, 2000));
        }
      } catch (error) {
        console.error(`Error generating post ${i + 1}:`, error);
      }
    }

    return posts;
  }

  // Generate a blog post for a specific category
  async generatePostForCategory(category) {
    const categoryData = this.topicPool.find(
      (cat) => cat.category === category
    );

    if (!categoryData) {
      throw new Error(`Category ${category} not found`);
    }

    const availableTopics = categoryData.topics.filter(
      (topic) => !this.usedTopics.has(topic)
    );

    if (availableTopics.length === 0) {
      // Reset if all topics in category are used
      this.usedTopics.clear();
    }

    const topics =
      availableTopics.length > 0 ? availableTopics : categoryData.topics;
    const selectedTopic = topics[Math.floor(Math.random() * topics.length)];

    return this.generateBlogPost({
      topic: selectedTopic,
      category: category,
    });
  }

  // Generate title suggestions for a topic
  async generateTitleSuggestions(topic, count = 5) {
    const prompt = `
      Generate ${count} engaging, SEO-friendly blog post titles about "${topic}" for a developer blog.
      Make them compelling but professional. Return ONLY a JSON array of strings, no additional text.
      
      Example format: ["Title 1", "Title 2", "Title 3"]
    `;

    try {
      const result = await this.model.generateContent({
        contents: [
          {
            role: "user",
            parts: [{ text: prompt }],
          },
        ],
      });

      const response = await result.response;
      const text = response.text();

      // Clean and parse the response
      let cleanText = text.trim();
      cleanText = cleanText.replace(/```json\s*\n?/g, "");
      cleanText = cleanText.replace(/```\s*$/g, "");

      const titles = JSON.parse(cleanText);
      return Array.isArray(titles) ? titles : [];
    } catch (error) {
      console.error("Error generating title suggestions:", error);
      return [];
    }
  }

  // Helper to format slug into a display name
  formatCategoryName(slug) {
    const specialCases = {
      "ai-ml": "AI & Machine Learning",
      "backend-apis": "Backend & APIs",
      "frontend-ux": "Frontend & UI/UX",
      "devops-cloud": "DevOps & Cloud",
      "career-tips": "Career & Tips",
      "web-development": "Web Development",
      "ecommerce-cms": "E-commerce & CMS",
    };
    return (
      specialCases[slug] ||
      slug
        .split("-")
        .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
        .join(" ")
    );
  }

  // Get available categories
  getCategories() {
    return this.topicPool.map((cat) => ({
      slug: cat.category,
      name: this.formatCategoryName(cat.category),
    }));
  }

  // Reset used topics
  resetUsedTopics() {
    this.usedTopics.clear();
    console.log("✅ Used topics reset");
  }

  // Create a fallback blog post when JSON parsing fails
  createFallbackBlogPost(rawText, topic, category) {
    // Clean the raw text
    let content = rawText.trim();

    // Remove any markdown code block markers
    content = content.replace(/```json\s*\n?/g, "");
    content = content.replace(/```\s*$/g, "");
    content = content.replace(/```\s*\n/g, "");

    // Extract title if possible (look for lines that might be titles)
    const lines = content.split("\n");
    let title = topic; // Default to the topic

    // Look for potential title in the first few lines
    for (let i = 0; i < Math.min(5, lines.length); i++) {
      const line = lines[i].trim();
      if (line.length > 10 && line.length < 100 && !line.startsWith("{")) {
        // Remove common prefixes
        const cleanLine = line
          .replace(/^(Title:|#\s*|##\s*|\*\*|"|')/, "")
          .replace(/("|'|\*\*)$/, "")
          .trim();
        if (cleanLine.length > 10) {
          title = cleanLine;
          break;
        }
      }
    }

    // Create excerpt from the beginning of content
    const excerpt =
      content
        .substring(0, 200)
        .replace(/[{}"\[\]]/g, "")
        .trim() + "...";

    // Generate meta title and description
    const metaTitle =
      title.length > 60 ? title.substring(0, 57) + "..." : title;
    const metaDescription =
      excerpt.length > 160 ? excerpt.substring(0, 157) + "..." : excerpt;

    // Generate tags based on topic and category
    const tags = this.generateTagsFromTopic(topic, category);

    return {
      title: title,
      content: content,
      excerpt: excerpt,
      meta_title: metaTitle,
      meta_description: metaDescription,
      tags: tags,
      featured_image: this.generateFeaturedImage(topic, category, tags),
      category: category,
      generated_by_ai: true,
      ai_prompt: topic,
      author: "Richad Ali",
      fallback_created: true,
    };
  }

  // Generate tags from topic and category
  generateTagsFromTopic(topic, category) {
    const tags = [];

    // Add category-based tags
    switch (category) {
      case "web-development":
        tags.push("web development", "frontend", "javascript");
        break;
      case "react-frontend":
        tags.push("react", "frontend", "javascript", "jsx");
        break;
      case "backend-apis":
        tags.push("backend", "api", "server", "database");
        break;
      case "devops-cloud":
        tags.push("devops", "cloud", "deployment", "infrastructure");
        break;
      case "ai-ml":
        tags.push("ai", "machine learning", "artificial intelligence");
        break;
      case "career-tips":
        tags.push("career", "tips", "developer", "programming");
        break;
      default:
        tags.push("programming", "development");
    }

    // Add topic-specific tags
    const topicWords = topic.toLowerCase().split(/\s+/);
    topicWords.forEach((word) => {
      if (word.length > 3 && !tags.includes(word)) {
        tags.push(word);
      }
    });

    return tags.slice(0, 6); // Limit to 6 tags
  }
}

module.exports = GeminiService;
