import React, { useState, useEffect } from "react";
import styled from "styled-components";

const StarsContainer = styled.div`
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100vh;
  overflow: hidden;
  z-index: -1;
`;

const Star = styled.div`
  position: absolute;
  background-color: #fff;
  width: ${props => props.size}px;
  height: ${props => props.size}px;
  border-radius: 50%;
  opacity: ${props => props.opacity};
  animation: twinkle ${props => props.duration}s ease-in-out infinite;
  top: ${props => props.top}%;
  left: ${props => props.left}%;
  
  @keyframes twinkle {
    0% { opacity: ${props => props.opacity}; }
    50% { opacity: ${props => props.opacity * 0.3}; }
    100% { opacity: ${props => props.opacity}; }
  }
`;

// Generate random stars
const generateStars = (count) => {
  const stars = [];
  for (let i = 0; i < count; i++) {
    stars.push({
      id: i,
      size: Math.random() * 2 + 1,
      opacity: Math.random() * 0.7 + 0.3,
      duration: Math.random() * 5 + 3,
      top: Math.random() * 100,
      left: Math.random() * 100
    });
  }
  return stars;
};

const StarsCanvas = () => {
  const [stars, setStars] = useState([]);
  
  useEffect(() => {
    // Generate stars based on screen size
    const starCount = window.innerWidth > 768 ? 100 : 50;
    setStars(generateStars(starCount));
    
    // Handle window resize
    const handleResize = () => {
      const newStarCount = window.innerWidth > 768 ? 100 : 50;
      setStars(generateStars(newStarCount));
    };
    
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return (
    <StarsContainer>
      {stars.map((star) => (
        <Star
          key={star.id}
          size={star.size}
          opacity={star.opacity}
          duration={star.duration}
          top={star.top}
          left={star.left}
        />
      ))}
    </StarsContainer>
  );
};

export default StarsCanvas;
