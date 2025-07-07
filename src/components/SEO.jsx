import React from 'react';
import { Helmet } from 'react-helmet-async';

const SEO = ({ 
  title = "Richad Yamin Ali - Full Stack Developer | Software Engineer Portfolio",
  description = "Experienced Full Stack Developer with 5+ years in software engineering, specializing in PHP, React, SpringBoot, and cloud technologies. View my portfolio showcasing scalable applications and innovative solutions.",
  keywords = "Richad Yamin Ali, Richad Ali, Full Stack Developer, Software Engineer, PHP Developer, React Developer, SpringBoot, Flutter, JavaScript, Laravel, Portfolio, Web Development, Backend Developer, Frontend Developer",
  image = "https://richadali.dev/HeroImage.jpg",
  url = "https://richadali.dev/",
  type = "website",
  section = ""
}) => {
  const sectionTitle = section ? `${section} | ${title}` : title;
  const sectionUrl = section ? `${url}#${section.toLowerCase()}` : url;

  return (
    <Helmet>
      <title>{sectionTitle}</title>
      <meta name="description" content={description} />
      <meta name="keywords" content={keywords} />
      
      {/* Open Graph */}
      <meta property="og:title" content={sectionTitle} />
      <meta property="og:description" content={description} />
      <meta property="og:type" content={type} />
      <meta property="og:url" content={sectionUrl} />
      <meta property="og:image" content={image} />
      
      {/* Twitter */}
      <meta name="twitter:title" content={sectionTitle} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={image} />
      
      {/* Canonical URL */}
      <link rel="canonical" href={sectionUrl} />
      
      {/* Preconnect for performance */}
      <link rel="preconnect" href="https://fonts.googleapis.com" />
      <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
      <link rel="preconnect" href="https://api.emailjs.com" />
      
      {/* Resource hints */}
      <link rel="dns-prefetch" href="https://github.com" />
      <link rel="dns-prefetch" href="https://linkedin.com" />
      <link rel="dns-prefetch" href="https://twitter.com" />
      
      {/* Performance optimization */}
      <meta name="referrer" content="no-referrer-when-downgrade" />
      <meta httpEquiv="x-dns-prefetch-control" content="on" />
    </Helmet>
  );
};

export default SEO; 