import React, { useState, useEffect } from "react";
import styled, { keyframes } from "styled-components";
import { motion, AnimatePresence } from "framer-motion";

// Keyframe animations
const typewriter = keyframes`
  from { width: 0; }
  to { width: 100%; }
`;

const blink = keyframes`
  from, to { border-color: transparent; }
  50% { border-color: #854CE6; }
`;

const pulse = keyframes`
  0%, 100% { transform: scale(1); opacity: 0.8; }
  50% { transform: scale(1.05); opacity: 1; }
`;

const float = keyframes`
  0%, 100% { transform: translateY(0px); }
  50% { transform: translateY(-10px); }
`;

const codeFlow = keyframes`
  0% { transform: translateY(100vh) translateX(-50px); opacity: 0; }
  10% { opacity: 1; }
  90% { opacity: 1; }
  100% { transform: translateY(-100vh) translateX(50px); opacity: 0; }
`;

// Styled components
const LoadingContainer = styled(motion.div)`
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  background: linear-gradient(135deg, #090917 0%, #1C1E27 50%, #090917 100%);
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  z-index: 9999;
  overflow: hidden;
`;

const CodeBackground = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  opacity: 0.1;
  overflow: hidden;
`;

const CodeLine = styled.div`
  position: absolute;
  font-family: 'Fira Code', 'Courier New', monospace;
  font-size: 14px;
  color: #854CE6;
  white-space: nowrap;
  animation: ${codeFlow} ${props => props.duration}s linear infinite;
  animation-delay: ${props => props.delay}s;
  left: ${props => props.left}%;
`;

const MainContent = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 30px;
  z-index: 2;
`;

const LogoContainer = styled(motion.div)`
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
`;

const Logo = styled.div`
  width: 80px;
  height: 80px;
  border: 3px solid #854CE6;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-family: 'Fira Code', 'Courier New', monospace;
  font-size: 24px;
  font-weight: bold;
  color: #854CE6;
  background: rgba(133, 76, 230, 0.1);
  animation: ${pulse} 2s ease-in-out infinite;
  backdrop-filter: blur(10px);
  box-shadow: 0 0 30px rgba(133, 76, 230, 0.3);
`;

const CircularProgress = styled.div`
  position: absolute;
  width: 100px;
  height: 100px;
  border: 2px solid rgba(133, 76, 230, 0.2);
  border-top: 2px solid #854CE6;
  border-radius: 50%;
  animation: spin 1s linear infinite;
  
  @keyframes spin {
    0% { transform: rotate(0deg); }
    100% { transform: rotate(360deg); }
  }
`;

const LoadingText = styled.div`
  font-family: 'Fira Code', 'Courier New', monospace;
  font-size: 18px;
  color: #F2F3F4;
  text-align: center;
  margin-bottom: 20px;
`;

const TypewriterContainer = styled.div`
  font-family: 'Fira Code', 'Courier New', monospace;
  font-size: 16px;
  color: #b1b2b3;
  text-align: center;
  max-width: 600px;
  line-height: 1.6;
`;

const TypewriterText = styled.div`
  overflow: hidden;
  border-right: 2px solid #854CE6;
  white-space: nowrap;
  margin: 0 auto;
  animation: ${typewriter} 3s steps(40, end), ${blink} 0.75s step-end infinite;
  width: fit-content;
`;

const ProgressBar = styled.div`
  width: 300px;
  height: 4px;
  background: rgba(133, 76, 230, 0.2);
  border-radius: 2px;
  overflow: hidden;
  margin-top: 20px;
`;

const ProgressFill = styled(motion.div)`
  height: 100%;
  background: linear-gradient(90deg, #854CE6, #be1adb);
  border-radius: 2px;
  box-shadow: 0 0 10px rgba(133, 76, 230, 0.5);
`;

const StatusText = styled(motion.div)`
  font-family: 'Fira Code', 'Courier New', monospace;
  font-size: 12px;
  color: #b1b2b3;
  margin-top: 10px;
  text-align: center;
`;

const FloatingElements = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  pointer-events: none;
`;

const FloatingSymbol = styled.div`
  position: absolute;
  font-family: 'Fira Code', 'Courier New', monospace;
  font-size: ${props => props.size || '20px'};
  color: rgba(133, 76, 230, 0.3);
  animation: ${float} ${props => props.duration || '3s'} ease-in-out infinite;
  animation-delay: ${props => props.delay || '0s'};
  top: ${props => props.top}%;
  left: ${props => props.left}%;
`;

const LoadingScreen = ({ onLoadingComplete }) => {
  const [progress, setProgress] = useState(0);
  const [currentStatus, setCurrentStatus] = useState("Initializing...");
  const [showTypewriter, setShowTypewriter] = useState(false);

  const statusMessages = [
    "Initializing...",
    "Loading components...",
    "Compiling assets...",
    "Optimizing performance...",
    "Preparing portfolio...",
    "Almost ready..."
  ];

  const codeSnippets = [
    "const developer = 'Richad Yamin Ali';",
    "function buildAmazingThings() {",
    "  return innovation + creativity;",
    "}",
    "class SoftwareEngineer {",
    "  constructor() {",
    "    this.skills = ['PHP', 'React', 'Flutter'];",
    "  }",
    "}",
    "npm install awesome-portfolio",
    "git commit -m 'Ready to impress'",
    "docker run --name portfolio",
    "SELECT * FROM achievements;",
    "console.log('Welcome to my world');",
  ];

  useEffect(() => {
    const timer = setTimeout(() => setShowTypewriter(true), 500);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      setProgress(prev => {
        const newProgress = prev + Math.random() * 8 + 2;
        
        // Update status based on progress
        const statusIndex = Math.min(
          Math.floor((newProgress / 100) * statusMessages.length),
          statusMessages.length - 1
        );
        setCurrentStatus(statusMessages[statusIndex]);
        
        if (newProgress >= 100) {
          clearInterval(interval);
          setTimeout(() => onLoadingComplete(), 500);
          return 100;
        }
        
        return newProgress;
      });
    }, 200);

    return () => clearInterval(interval);
  }, [onLoadingComplete, statusMessages]);

  return (
    <AnimatePresence>
      <LoadingContainer
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0, scale: 0.8 }}
        transition={{ duration: 0.5 }}
      >
        <CodeBackground>
          {codeSnippets.map((snippet, index) => (
            <CodeLine
              key={index}
              duration={8 + Math.random() * 4}
              delay={index * 0.5}
              left={Math.random() * 80}
            >
              {snippet}
            </CodeLine>
          ))}
        </CodeBackground>

        <FloatingElements>
          <FloatingSymbol top={20} left={10} size="24px" duration="4s" delay="0s">{'<>'}</FloatingSymbol>
          <FloatingSymbol top={30} left={85} size="20px" duration="3s" delay="1s">{'{}'}</FloatingSymbol>
          <FloatingSymbol top={60} left={15} size="18px" duration="5s" delay="2s">{'[]'}</FloatingSymbol>
          <FloatingSymbol top={70} left={80} size="22px" duration="3.5s" delay="0.5s">{'()'}</FloatingSymbol>
          <FloatingSymbol top={40} left={90} size="16px" duration="4.5s" delay="1.5s">{'</'}</FloatingSymbol>
          <FloatingSymbol top={80} left={20} size="20px" duration="3.8s" delay="2.5s">{'=>'}</FloatingSymbol>
        </FloatingElements>

        <MainContent>
          <LogoContainer
            initial={{ scale: 0, rotate: -180 }}
            animate={{ scale: 1, rotate: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            <CircularProgress />
            <Logo>{'</>'}</Logo>
          </LogoContainer>

          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.5 }}
          >
            <LoadingText>Richad Yamin Ali</LoadingText>
            
            {showTypewriter && (
              <TypewriterContainer>
                <TypewriterText>
                  Welcome to my portfolio
                </TypewriterText>
              </TypewriterContainer>
            )}
          </motion.div>

          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.8 }}
          >
            <ProgressBar>
              <ProgressFill
                initial={{ width: "0%" }}
                animate={{ width: `${progress}%` }}
                transition={{ duration: 0.3 }}
              />
            </ProgressBar>
            
            <StatusText
              key={currentStatus}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
            >
              {currentStatus} {Math.round(progress)}%
            </StatusText>
          </motion.div>
        </MainContent>
      </LoadingContainer>
    </AnimatePresence>
  );
};

export default LoadingScreen; 