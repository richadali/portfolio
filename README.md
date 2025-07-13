# Richad Yamin Ali - Portfolio

Welcome to my portfolio! This project showcases my skills, projects, and experiences as a full-stack developer with over 5 years of experience.

## Table of Contents

- [Introduction](#introduction)
- [Features](#features)
- [Technologies Used](#technologies-used)
- [Project Structure](#project-structure)
- [Frontend](#frontend)
- [Backend](#backend)
- [Installation](#installation)
- [Usage](#usage)
- [Deployment](#deployment)
- [Contributing](#contributing)
- [License](#license)

## Introduction

This portfolio is a React.js application that serves as an online showcase of my work, skills, and achievements. It provides an overview of my background, displays my projects, and offers a way to contact me. The portfolio includes interactive UI elements, animations, and a secure backend for handling contact form submissions.

## Features

- **About Me**: An overview of my background, skills, and experiences.
- **Projects**: A collection of my notable projects with descriptions and links.
- **Experience**: Detailed information about my professional experience.
- **Skills**: A list of my technical skills and proficiencies.
- **Education**: Information about my educational background.
- **Resume**: A link to download my resume.
- **Contact**: A form to send me messages or inquiries with backend integration.
- **Interactive UI**: Smooth animations, tilt effects, and responsive design.
- **Dark Theme**: Modern dark theme with accent colors.

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

### Backend

- **Node.js**: JavaScript runtime for server-side code.
- **Express.js**: Web application framework for Node.js.
- **Nodemailer**: Module for sending emails.
- **Express Validator**: Middleware for validating and sanitizing input.
- **Helmet**: Security middleware for Express.
- **CORS**: Cross-Origin Resource Sharing middleware.
- **Express Rate Limit**: Middleware for rate limiting requests.
- **Zoho Mail**: Professional email service for contact form.

### Development & Deployment

- **Git**: A version control system for tracking changes and collaborating on projects.
- **GitHub Pages**: A platform for hosting and deploying web applications.
- **Railway/Heroku**: For backend deployment.

## Project Structure

```
Portfolio/
├── src/                  # Frontend source code
│   ├── components/       # React components
│   │   ├── animations/   # Animation components
│   │   ├── backgrounds/  # Background effects
│   │   ├── canvas/       # Three.js canvas elements
│   │   ├── cards/        # Card components for projects, etc.
│   │   ├── Dialog/       # Modal dialog components
│   │   ├── HeroBgAnimation/ # Hero section background
│   │   └── sections/     # Main page sections
│   ├── data/             # Constants and data files
│   ├── hooks/            # Custom React hooks
│   ├── images/           # Image assets
│   └── utils/            # Utility functions
├── public/               # Public assets
├── backend/              # Backend server code
│   ├── server.js         # Express server
│   └── package.json      # Backend dependencies
└── package.json          # Frontend dependencies
```

## Frontend

The frontend is built with React.js and uses a component-based architecture. Key features include:

- **Responsive Design**: Works on all device sizes
- **Interactive UI**: Smooth animations and transitions
- **Tilt Effects**: 3D tilt effects on cards and images
- **Custom Hooks**: For handling scroll animations and active sections
- **Optimized Performance**: Lazy loading and code splitting
- **SEO Friendly**: Meta tags and semantic HTML

## Backend

The backend is built with Node.js and Express and provides the following features:

- **Contact Form API**: Secure endpoint for form submissions
- **Email Integration**: Sends emails via Zoho SMTP
- **Auto-Response**: Sends confirmation emails to users
- **Security Features**:
  - Input validation and sanitization
  - Rate limiting to prevent spam
  - CORS protection
  - Security headers with Helmet
- **Error Handling**: Comprehensive error handling and logging

## Installation

### Frontend

To run the frontend locally, follow these steps:

1. Clone the repository.
2. Navigate to the project directory: `cd portfolio`
3. Install the dependencies: `npm install`
4. Start the development server: `npm start`
5. Open your browser and visit: `http://localhost:3000`

### Backend

To set up the backend server:

1. Navigate to the backend directory: `cd backend`
2. Install dependencies: `npm install`
3. Create a `.env` file based on `.env.example`
4. Add your Zoho email credentials to the `.env` file
5. Start the development server: `npm run dev`
6. The server will run on: `http://localhost:3001`

## Usage

After installing and running the project locally, you can:

1. Navigate through different sections using the navigation menu
2. View project details by clicking on project cards
3. Download my resume from the hero section
4. Send me a message through the contact form
5. Explore interactive elements like tilt effects and animations

## Deployment

### Frontend Deployment

The frontend is deployed on GitHub Pages:

1. Update the `homepage` field in `package.json`
2. Build the project: `npm run build`
3. Deploy to GitHub Pages: `npm run deploy`

### Backend Deployment

The backend can be deployed on platforms like Railway or Heroku:

1. Create an account on your preferred platform
2. Connect your GitHub repository
3. Set the environment variables:
   - `NODE_ENV=production`
   - `PORT=3001`
   - `FRONTEND_URL=https://your-domain.com`
   - `ZOHO_EMAIL=your-email@domain.com`
   - `ZOHO_PASSWORD=your-zoho-app-password`
4. Deploy the backend service

## Contributing

Contributions are welcome! If you'd like to contribute to My Portfolio, please follow these steps:

1. Fork the repository.
2. Create a new branch for your feature or bug fix: `git checkout -b my-feature`
3. Commit your changes: `git commit -m 'Add some feature'`
4. Push to the branch: `git push origin my-feature`
5. Open a pull request.

## License

This project is licensed under the [MIT License](LICENSE).
