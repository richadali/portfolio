const fs = require("fs");
const path = require("path");
const BlogModel = require("../models/blogModel");

const generateSitemap = async () => {
  const baseUrl = "https://richadali.dev";
  const sitemapPath = path.join(__dirname, "../../public/sitemap.xml");

  const staticUrls = [
    { loc: `${baseUrl}/`, changefreq: "weekly", priority: "1.0" },
    { loc: `${baseUrl}/#about`, changefreq: "monthly", priority: "0.8" },
    { loc: `${baseUrl}/#skills`, changefreq: "monthly", priority: "0.8" },
    { loc: `${baseUrl}/#experience`, changefreq: "monthly", priority: "0.9" },
    { loc: `${baseUrl}/#projects`, changefreq: "weekly", priority: "0.9" },
    { loc: `${baseUrl}/#education`, changefreq: "yearly", priority: "0.7" },
    { loc: `${baseUrl}/#contact`, changefreq: "monthly", priority: "0.8" },
    {
      loc: `${baseUrl}/My%20Resume.pdf`,
      changefreq: "monthly",
      priority: "0.8",
    },
    { loc: `${baseUrl}/blog`, changefreq: "daily", priority: "0.9" },
  ];

  try {
    const { posts } = await BlogModel.getAll({ limit: 1000 }); // Fetch all posts

    const blogUrls = posts.map((post) => {
      return {
        loc: `${baseUrl}/blog/${post.slug}`,
        lastmod: post.published_at
          ? new Date(post.published_at).toISOString().split("T")[0]
          : new Date().toISOString().split("T")[0],
        changefreq: "monthly",
        priority: "0.9",
      };
    });

    const allUrls = [...staticUrls, ...blogUrls];

    const sitemapContent = `
<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  ${allUrls
    .map(
      (url) => `
    <url>
      <loc>${url.loc}</loc>
      <lastmod>${
        url.lastmod || new Date().toISOString().split("T")[0]
      }</lastmod>
      <changefreq>${url.changefreq}</changefreq>
      <priority>${url.priority}</priority>
    </url>
  `
    )
    .join("")}
</urlset>
    `.trim();

    fs.writeFileSync(sitemapPath, sitemapContent);
    console.log("Sitemap generated successfully.");
    return { success: true, message: "Sitemap generated successfully." };
  } catch (error) {
    console.error("Error generating sitemap:", error);
    return { success: false, message: "Failed to generate sitemap." };
  }
};

module.exports = { generateSitemap };
