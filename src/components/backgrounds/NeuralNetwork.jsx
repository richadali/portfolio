import React, { useEffect, useState, useRef } from 'react';
import styled from 'styled-components';
import { motion } from 'framer-motion';

const NetworkContainer = styled.div`
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

const NetworkNode = styled(motion.div)`
  position: absolute;
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background: radial-gradient(circle, rgba(133, 76, 230, 0.9) 0%, rgba(133, 76, 230, 0.3) 70%, transparent 100%);
  pointer-events: none;
  box-shadow: 0 0 12px rgba(133, 76, 230, 0.6);
  
  @media (max-width: 768px) {
    width: 6px;
    height: 6px;
  }
`;

const NeuralNetwork = () => {
  const canvasRef = useRef(null);
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const [nodes, setNodes] = useState([]);
  const [isMobile, setIsMobile] = useState(false);
  const animationRef = useRef();

  // Detect mobile
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth <= 768);
    };
    
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  // Mouse tracking
  useEffect(() => {
    const handleMouseMove = (e) => {
      setMousePos({ x: e.clientX, y: e.clientY });
    };

    const handleTouchMove = (e) => {
      if (e.touches.length > 0) {
        const touch = e.touches[0];
        setMousePos({ x: touch.clientX, y: touch.clientY });
      }
    };

    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('touchmove', handleTouchMove, { passive: true });
    
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('touchmove', handleTouchMove);
    };
  }, []);

  // Generate network nodes
  useEffect(() => {
    const generateNodes = () => {
      const nodeCount = isMobile ? 12 : 20;
      const newNodes = [];

      for (let i = 0; i < nodeCount; i++) {
        newNodes.push({
          id: i,
          x: Math.random() * window.innerWidth,
          y: Math.random() * window.innerHeight,
          initialX: Math.random() * window.innerWidth,
          initialY: Math.random() * window.innerHeight,
          vx: (Math.random() - 0.5) * 0.5,
          vy: (Math.random() - 0.5) * 0.5,
          speed: Math.random() * 0.015 + 0.005,
          pulseSpeed: Math.random() * 2 + 1,
        });
      }

      setNodes(newNodes);
    };

    generateNodes();
    window.addEventListener('resize', generateNodes);
    return () => window.removeEventListener('resize', generateNodes);
  }, [isMobile]);

  // Canvas animation for connections
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

    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      
      // Update node positions
      setNodes(prevNodes => {
        const updatedNodes = prevNodes.map(node => {
          // Mouse influence
          const dx = mousePos.x - node.x;
          const dy = mousePos.y - node.y;
          const distance = Math.sqrt(dx * dx + dy * dy);
          
          if (distance < 150) {
            const force = (150 - distance) / 150;
            const forceMultiplier = isMobile ? 0.0003 : 0.0006;
            node.vx += (dx * force) * forceMultiplier;
            node.vy += (dy * force) * forceMultiplier;
          }

          // Update position
          node.x += node.vx;
          node.y += node.vy;

          // Friction
          node.vx *= 0.995;
          node.vy *= 0.995;

          // Boundaries with gentle bounce
          if (node.x < 0 || node.x > canvas.width) {
            node.vx *= -0.8;
            node.x = Math.max(0, Math.min(canvas.width, node.x));
          }
          if (node.y < 0 || node.y > canvas.height) {
            node.vy *= -0.8;
            node.y = Math.max(0, Math.min(canvas.height, node.y));
          }

          return node;
        });

        // Draw connections between nodes
        updatedNodes.forEach((node, i) => {
          updatedNodes.forEach((otherNode, j) => {
            if (i < j) {
              const dx = node.x - otherNode.x;
              const dy = node.y - otherNode.y;
              const distance = Math.sqrt(dx * dx + dy * dy);
              const maxDistance = isMobile ? 120 : 150;

              if (distance < maxDistance) {
                const opacity = (maxDistance - distance) / maxDistance;
                
                // Create gradient for neural network effect
                const gradient = ctx.createLinearGradient(
                  node.x, node.y, otherNode.x, otherNode.y
                );
                gradient.addColorStop(0, `rgba(133, 76, 230, ${opacity * 0.6})`);
                gradient.addColorStop(0.5, `rgba(133, 76, 230, ${opacity * 0.8})`);
                gradient.addColorStop(1, `rgba(133, 76, 230, ${opacity * 0.6})`);

                                 ctx.beginPath();
                 ctx.moveTo(node.x, node.y);
                 ctx.lineTo(otherNode.x, otherNode.y);
                 ctx.strokeStyle = gradient;
                 ctx.lineWidth = opacity * 2;
                 ctx.stroke();
              }
            }
          });
        });

        return updatedNodes;
      });

      animationRef.current = requestAnimationFrame(animate);
    };

    animate();

    return () => {
      window.removeEventListener('resize', resizeCanvas);
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [mousePos, isMobile]);

  return (
    <NetworkContainer>
      <Canvas ref={canvasRef} />
      {nodes.map((node) => (
        <NetworkNode
          key={node.id}
          style={{
            left: node.x - (isMobile ? 3 : 4),
            top: node.y - (isMobile ? 3 : 4),
          }}
          animate={{
            scale: [1, 1.2, 1],
            opacity: [0.8, 1, 0.8],
          }}
          transition={{
            duration: node.pulseSpeed,
            repeat: Infinity,
            ease: 'easeInOut',
          }}
        />
      ))}
    </NetworkContainer>
  );
};

export default NeuralNetwork; 