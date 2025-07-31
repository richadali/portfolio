# Richad Yamin Ali - Portfolio

Welcome to my portfolio! This project showcases my skills, projects, and experiences as a full-stack developer with over 5 years of experience. It now includes a fully automated, AI-powered blog with advanced SEO capabilities.

## Table of Contents

- [Introduction](#introduction)
- [Features](#features)
- [Technologies Used](#technologies-used)
- [Project Structure](#project-structure)
- [Frontend](#frontend)
- [Backend](#backend)
- [Usage](#usage)
- [Contributing](#contributing)
- [License](#license)

## Introduction

This portfolio is a React.js application that serves as an online showcase of my work, skills, and achievements. It provides an overview of my background, displays my projects, and offers a way to contact me. The portfolio includes interactive UI elements, animations, and a secure backend for handling contact form submissions. A key feature is the integrated AI-powered blog that automatically generates and publishes new content daily.

## Features

- **About Me**: An overview of my background, skills, and experiences.
- **Projects**: A collection of my notable projects with descriptions and links.
- **Experience**: Detailed information about my professional experience.
- **Skills**: A list of my technical skills and proficiencies.
- **Education**: Information about my educational background.
- **Resume**: A link to download my resume.
- **Contact**: A secure form to send me messages or inquiries.
- **Interactive UI**: Smooth animations, tilt effects, and responsive design.
- **Dark Theme**: Modern dark theme with accent colors.
- **Automated Blog Content**: An AI-powered engine using Google's Gemini API to automatically generate, schedule, and publish new blog posts daily on various technical topics.
- **Advanced SEO**:
  - Dynamically generated meta tags for each blog post to ensure optimal search engine ranking.
  - Automated `sitemap.xml` generation that runs every time a new post is created, ensuring search engines can discover new content immediately.

## Technologies Used

### Frontend

- **React.js**: A JavaScript library for building user interfaces.
- **HTML5 & CSS3**: Markup and styling languages for building web pages.
- **JavaScript**: A programming language for adding interactivity to web applications.
- **Styled-Components**: For component-based styling.
- **Framer Motion**: For smooth animations and transitions.
- **React-Tilt**: For 3D tilt effects on components.
- **Material UI**: Component library for consistent design.
- **Three.js**: For 3D graphics and animations.
- **React Vertical Timeline**: For displaying experience timeline.
- **React-Helmet-Async**: For managing document head and SEO meta tags.
- **React Markdown**: For rendering Markdown content in blog posts.

### Backend

- **Node.js**: JavaScript runtime for server-side code.
- **Express.js**: Web application framework for Node.js.
- **MySQL2**: MySQL client for Node.js, used for database interaction.
- **Nodemailer**: Module for sending emails via Zoho Mail.
- **@google/generative-ai**: Google's official library for the Gemini API, used for content generation.
- **node-cron**: A simple cron-like job scheduler for Node.js.
- **slugify**: A library to create SEO-friendly URL slugs from strings.
- **Express Validator**: Middleware for validating and sanitizing input.
- **Helmet**: Security middleware for Express.
- **CORS**: Cross-Origin Resource Sharing middleware.
- **Express Rate Limit**: Middleware for rate limiting requests.

## Project Structure

```
Portfolio/
├── src/                  # Frontend source code
│   ├── components/       # React components
│   │   ├── cards/        # Card components (BlogCard, ProjectCard, etc.)
│   │   ├── sections/     # Main page sections (Blog, Contact, etc.)
│   │   └── SEO.jsx       # SEO component for meta tags
│   ├── data/             # Constants and data files
│   ├── hooks/            # Custom React hooks
│   ├── images/           # Image assets
│   ├── pages/            # Page components (BlogList.jsx, BlogPost.jsx)
│   └── utils/            # Utility functions
├── public/               # Public assets (sitemap.xml, robots.txt)
├── backend/              # Backend server code
│   ├── config/           # Configuration files (database.js)
│   ├── models/           # Database models (blogModel.js)
│   ├── routes/           # API routes (blogRoutes.js, sitemapRoutes.js)
│   ├── services/         # Business logic (geminiService.js, blogScheduler.js, sitemapGenerator.js, etc.)
│   ├── server.js         # Express server
│   └── package.json      # Backend dependencies
└── package.json          # Frontend dependencies
```

## Frontend

The frontend is built with React.js and uses a component-based architecture. Key features include:

- **Responsive Design**: Works on all device sizes.
- **Interactive UI**: Smooth animations and transitions.
- **Blog Integration**: Displays AI-generated content with pages for listing all blogs and viewing individual posts.
- **Optimized Performance**: Lazy loading and code splitting.
- **Advanced SEO**: Each page, especially blog posts, has dynamically generated meta tags for title, description, and social media sharing, managed by the `SEO.jsx` component.

## Backend

The backend is built with Node.js and Express and provides the following features:

- **Contact Form API**: Secure endpoint for form submissions with email integration via Zoho SMTP.
- **Blog & Content Engine**:
  - **Automated Content Generation**: A scheduler (`node-cron`) triggers a daily job to generate a new blog post using the Gemini API.
  - **Image Generation**: Integrates multiple AI services to generate featured images for blog posts.
  - **Database Management**: Stores and manages all blog content in a MySQL database.
- **Automated SEO**:
  - **Dynamic Sitemap**: The sitemap is automatically regenerated and updated every time a new blog post is created, ensuring search engines can crawl new content immediately.
- **Security Features**:
  - Input validation and sanitization.
  - Rate limiting to prevent spam.
  - CORS protection and security headers with Helmet.
- **Error Handling**: Comprehensive error handling and logging.

## Usage

After installing and running the project locally, you can:

1. Navigate through different sections using the navigation menu.
2. Read AI-generated blog posts on the "Blog" page.
3. View project details by clicking on project cards.
4. Download my resume from the hero section.
5. Send me a message through the contact form.
6. Explore interactive elements like tilt effects and animations.

## Contributing

Contributions are welcome! If you'd like to contribute to My Portfolio, please follow these steps:

1. Fork the repository.
2. Create a new branch for your feature or bug fix: `git checkout -b my-feature`
3. Commit your changes: `git commit -m 'Add some feature'`
4. Push to the branch: `git push origin my-feature`
5. Open a pull request.

## License

This project is licensed under the [MIT License](LICENSE).
