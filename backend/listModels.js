require("dotenv").config();
const axios = require("axios");

/**
 * This script lists all generative models available to your API key
 * by calling the Google Generative Language REST API directly.
 */
async function listModelsViaRest() {
  // 1. Check for API Key
  if (!process.env.GEMINI_API_KEY) {
    console.error(
      "❌ Error: GEMINI_API_KEY not found in environment variables."
    );
    console.error(
      "Please ensure your .env file is correctly set up on the server."
    );
    return;
  }
  console.log("🔑 Found GEMINI_API_KEY. Building REST request...");

  const url = `https://generativelanguage.googleapis.com/v1beta/models?key=${process.env.GEMINI_API_KEY}`;

  try {
    console.log("🚀 Fetching models via REST API...");
    const { data } = await axios.get(url);

    console.log("\n✅ Successfully fetched available models:\n");
    console.log("-------------------------------------------------");

    let foundImageModel = false;

    // 2. Iterate and display model details
    data.models.forEach((m) => {
      const isImageModel =
        m.name.includes("image") ||
        m.name.includes("vision") ||
        (m.supportedGenerationMethods &&
          m.supportedGenerationMethods.includes("generateImage"));
      const supportsGenerateContent =
        m.supportedGenerationMethods.includes("generateContent");

      console.log(`Model Name: ${m.name} ${isImageModel ? "⭐" : ""}`);
      console.log(`  - Display Name: ${m.displayName}`);
      console.log(
        `  - Supported Methods: ${m.supportedGenerationMethods.join(", ")}`
      );

      if (supportsGenerateContent) {
        console.log("  - ✅ Supports 'generateContent'");
      } else {
        console.log("  - ❌ Does NOT support 'generateContent'");
      }

      if (isImageModel) {
        console.log(
          "  - ⭐ This model appears to be suitable for image tasks."
        );
        if (supportsGenerateContent) {
          foundImageModel = true;
        }
      }
      console.log("-------------------------------------------------");
    });

    // 3. Provide a concluding recommendation
    if (foundImageModel) {
      console.log(
        "\n✨ RECOMMENDATION: One or more potential image generation models were found."
      );
      console.log(
        "Compare the model names marked with ⭐ above to the one in your 'geminiImageService.js' file and update it if necessary."
      );
    } else {
      console.warn(
        "\n⚠️ WARNING: No obvious image generation model was found."
      );
      console.warn(
        "This might be due to regional availability or Google Cloud project settings."
      );
      console.warn(
        "Please check the model availability for your project's region in the Google Cloud Console."
      );
    }
  } catch (err) {
    console.error(
      "\n❌ Failed to fetch models:",
      err.response?.data || err.message
    );
  }
}

listModelsViaRest();
