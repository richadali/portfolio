import React, { useEffect, useRef, useState } from 'react';
import styled from 'styled-components';

const GridContainer = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  z-index: 1;
  overflow: hidden;
  pointer-events: none;
`;

const Canvas = styled.canvas`
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  opacity: 0.6;
`;

const InteractiveGrid = () => {
  const canvasRef = useRef(null);
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const animationRef = useRef();

  useEffect(() => {
    const handleMouseMove = (e) => {
      setMousePos({ x: e.clientX, y: e.clientY });
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    
    const resizeCanvas = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    
    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);

    const gridSize = 50;
    
    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      
      // Draw grid
      for (let x = 0; x < canvas.width; x += gridSize) {
        for (let y = 0; y < canvas.height; y += gridSize) {
          const dx = mousePos.x - x;
          const dy = mousePos.y - y;
          const distance = Math.sqrt(dx * dx + dy * dy);
          
          // Calculate opacity based on distance from mouse
          const maxDistance = 200;
          const opacity = Math.max(0, (maxDistance - distance) / maxDistance) * 0.8;
          
          if (opacity > 0.01) {
            // Draw grid dot
            ctx.beginPath();
            ctx.arc(x, y, 2, 0, Math.PI * 2);
            ctx.fillStyle = `rgba(133, 76, 230, ${opacity})`;
            ctx.fill();
            
            // Add glow effect for dots
            ctx.shadowColor = 'rgba(133, 76, 230, 0.6)';
            ctx.shadowBlur = 8;
            ctx.beginPath();
            ctx.arc(x, y, 1, 0, Math.PI * 2);
            ctx.fillStyle = `rgba(133, 76, 230, ${opacity * 0.8})`;
            ctx.fill();
            ctx.shadowBlur = 0;
            
            // Draw connecting lines to nearby points
            if (x + gridSize < canvas.width) {
              const nextX = x + gridSize;
              const nextDistance = Math.sqrt((mousePos.x - nextX) ** 2 + dy ** 2);
              const lineOpacity = Math.max(0, (maxDistance - Math.max(distance, nextDistance)) / maxDistance) * 0.3;
              
              if (lineOpacity > 0.01) {
                ctx.beginPath();
                ctx.moveTo(x, y);
                ctx.lineTo(nextX, y);
                ctx.strokeStyle = `rgba(133, 76, 230, ${lineOpacity})`;
                ctx.lineWidth = 0.5;
                ctx.stroke();
              }
            }
            
            if (y + gridSize < canvas.height) {
              const nextY = y + gridSize;
              const nextDistance = Math.sqrt(dx ** 2 + (mousePos.y - nextY) ** 2);
              const lineOpacity = Math.max(0, (maxDistance - Math.max(distance, nextDistance)) / maxDistance) * 0.3;
              
              if (lineOpacity > 0.01) {
                ctx.beginPath();
                ctx.moveTo(x, y);
                ctx.lineTo(x, nextY);
                ctx.strokeStyle = `rgba(133, 76, 230, ${lineOpacity})`;
                ctx.lineWidth = 0.5;
                ctx.stroke();
              }
            }
          }
        }
      }
      
      animationRef.current = requestAnimationFrame(animate);
    };

    animate();

    return () => {
      window.removeEventListener('resize', resizeCanvas);
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [mousePos]);

  return (
    <GridContainer>
      <Canvas ref={canvasRef} />
    </GridContainer>
  );
};

export default InteractiveGrid; 