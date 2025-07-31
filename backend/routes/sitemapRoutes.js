const express = require('express');
const { generateSitemap } = require('../services/sitemapGenerator');
const router = express.Router();

// -- Route to generate sitemap --
// POST /api/sitemap/generate
// This is a protected route, you might want to add authentication middleware
router.post('/generate', async (req, res) => {
  try {
    const result = await generateSitemap();
    if (result.success) {
      res.status(200).json({ success: true, message: result.message });
    } else {
      res.status(500).json({ success: false, message: result.message });
    }
  } catch (error) {
    res.status(500).json({ success: false, message: 'An unexpected error occurred while generating the sitemap.' });
  }
});

module.exports = router;