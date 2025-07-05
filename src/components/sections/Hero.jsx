import React from "react";
import styled from "styled-components";
import { Bio } from "../../data/constants";
import Typewriter from "typewriter-effect";
import HeroImg from "../../images/HeroImage.jpg";
import HeroBgAnimation from "../HeroBgAnimation";
import { Tilt } from "react-tilt";
import { motion } from "framer-motion";
import {
  headContainerAnimation,
  headContentAnimation,
  headTextAnimation,
} from "../../utils/motion";
import StarCanvas from "../canvas/Stars";
import SEO from "../SEO";

const HeroContainer = styled.div`
  display: flex;
  justify-content: center;
  position: relative;
  padding: 80px 30px;
  z-index: 1;

  @media (max-width: 960px) {
    padding: 66px 16px;
  }

  @media (max-width: 640px) {
    padding: 32px 16px;
  }

  clip-path: polygon(0 0, 100% 0, 100% 100%, 70% 95%, 0 100%);
`;

const HeroBg = styled.div`
  position: absolute;
  display: flex;
  justify-content: end;
  top: 0;
  right: 0;
  bottom: 0;
  left: 0;
  width: 100%;
  height: 100%;
  max-width: 1360px;
  overflow: hidden;
  padding: 0 30px;
  top: 50%;
  left: 50%;
  -webkit-transform: translateX(-50%) translateY(-50%);
  transform: translateX(-50%) translateY(-50%);

  @media (max-width: 960px) {
    justify-content: center;
    padding: 0 0px;
  }
`;

const HeroInnerContainer = styled.div`
  position: relative;
  display: flex;
  justify-content: space-between;
  align-items: center;
  width: 100%;
  max-width: 1100px;

  @media (max-width: 960px) {
    flex-direction: column;
  }
`;
const HeroLeftContainer = styled.div`
  width: 100%;
  order: 1;
  @media (max-width: 960px) {
    order: 2;
    margin-bottom: 30px;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    width: 100%;
  }
`;
const HeroRightContainer = styled.div`
  width: 100%;
  order: 2;
  display: flex;
  justify-content: end;
  @media (max-width: 960px) {
    order: 1;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-contents: center;
    margin-bottom: 80px;
  }

  @media (max-width: 640px) {
    margin-bottom: 30px;
  }
`;

const Title = styled.div`
  font-weight: 700;
  font-size: 50px;
  color: ${({ theme }) => theme.text_primary};
  line-height: 68px;

  @media (max-width: 960px) {
    text-align: center;
  }

  @media (max-width: 960px) {
    font-size: 40px;
    line-height: 48px;
    margin-bottom: 8px;
  }
`;

const TextLoop = styled.div`
  font-weight: 600;
  font-size: 32px;
  display: flex;
  gap: 12px;
  color: ${({ theme }) => theme.text_primary};
  line-height: 68px;

  @media (max-width: 960px) {
    text-align: center;
  }

  @media (max-width: 960px) {
    font-size: 22px;
    line-height: 48px;
    margin-bottom: 16px;
  }
`;
const Span = styled.div`
  cursor: pointer;
  color: ${({ theme }) => theme.primary};
`;

const SubTitle = styled.div`
  font-size: 20px;
  line-height: 32px;
  margin-bottom: 42px;
  color: ${({ theme }) => theme.text_primary + 95};

  @media (max-width: 960px) {
    text-align: center;
  }

  @media (max-width: 960px) {
    font-size: 16px;
    line-height: 32px;
  }
`;

const ResumeButton = styled.a`
  -webkit-appearance: button;
  -moz-appearance: button;
  appearance: button;
  text-decoration: none;

  width: 95%;
  max-width: 300px;
  text-align: center;
  padding: 16px 0;

  background: hsla(271, 100%, 50%, 1);
  background: linear-gradient(
    225deg,
    hsla(271, 100%, 50%, 1) 0%,
    hsla(294, 100%, 50%, 1) 100%
  );
  background: -moz-linear-gradient(
    225deg,
    hsla(271, 100%, 50%, 1) 0%,
    hsla(294, 100%, 50%, 1) 100%
  );
  background: -webkit-linear-gradient(
    225deg,
    hsla(271, 100%, 50%, 1) 0%,
    hsla(294, 100%, 50%, 1) 100%
  );
  box-shadow: 20px 20px 60px #1f2634, -20px -20px 60px #1f2634;
  border-radius: 50px;
  font-weight: 600;
  font-size: 20px;
  color: white;
  border: none;
  cursor: pointer;
  transition: all 0.2s ease-in-out !important;

  &:hover {
    transform: scale(1.05);
    transition: all 0.4s ease-in-out;
    box-shadow: 20px 20px 60px #1f2634;
    filter: brightness(1);
  }

  @media (max-width: 960px) {
    margin: 0 auto;
    display: block;
  }

  @media (max-width: 640px) {
    padding: 12px 0;
    font-size: 18px;
  }
`;

const Img = styled.img`
  border-radius: 50%;
  width: 100%;
  height: 100%;
  max-width: 400px;
  max-height: 400px;
  border: 2px solid ${({ theme }) => theme.primary};

  @media (max-width: 640px) {
    max-width: 280px;
    max-height: 280px;
  }
`;

const ContactInfo = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 16px;
  margin-top: 24px;
  
  @media (max-width: 960px) {
    flex-direction: column;
    align-items: center;
    gap: 8px;
  }
`;

const ContactItem = styled.a`
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 16px;
  color: ${({ theme }) => theme.text_primary};
  text-decoration: none;
  transition: all 0.2s ease-in-out;
  
  &:hover {
    color: ${({ theme }) => theme.primary};
    transform: scale(1.05);
  }
`;

const ContentWrapper = styled(motion.div)`
  width: 100%;
  display: flex;
  flex-direction: column;
  
  @media (max-width: 960px) {
    align-items: center;
    width: 100%;
  }
`;

const Hero = ({ isLoadingComplete = true }) => {
  // Enhanced animation variants with loading state awareness
  const headContainerAnimation = {
    initial: { x: -100, opacity: 0 },
    animate: isLoadingComplete ? { x: 0, opacity: 1 } : { x: -100, opacity: 0 },
    transition: {
      type: "spring",
      damping: 8,
      stiffness: 40,
      restDelta: 0.001,
      duration: 0.8,
      delay: isLoadingComplete ? 0.3 : 0,
    },
  };

  const headTextAnimation = {
    initial: { x: 100, opacity: 0 },
    animate: isLoadingComplete ? { x: 0, opacity: 1 } : { x: 100, opacity: 0 },
    transition: {
      type: "spring",
      damping: 8,
      stiffness: 40,
      restDelta: 0.001,
      duration: 0.8,
      delay: isLoadingComplete ? 0.5 : 0,
    },
  };

  const headContentAnimation = {
    initial: { y: 60, opacity: 0 },
    animate: isLoadingComplete ? { y: 0, opacity: 1 } : { y: 60, opacity: 0 },
    transition: {
      type: "spring",
      damping: 8,
      stiffness: 30,
      restDelta: 0.001,
      duration: 0.8,
      delay: isLoadingComplete ? 0.7 : 0,
    },
  };

  const imageAnimation = {
    initial: { scale: 0.8, opacity: 0 },
    animate: isLoadingComplete ? { scale: 1, opacity: 1 } : { scale: 0.8, opacity: 0 },
    transition: {
      type: "spring",
      damping: 8,
      stiffness: 40,
      restDelta: 0.001,
      duration: 0.8,
      delay: isLoadingComplete ? 0.9 : 0,
    },
  };

  return (
    <div id="about">
      <SEO 
        description="Meet Richad Yamin Ali, an experienced Full Stack Developer with 5+ years in software engineering. Specializing in PHP, React, SpringBoot, and cloud technologies."
        keywords="Richad Yamin Ali, About, Full Stack Developer, Software Engineer, PHP, React, SpringBoot, Flutter, Portfolio"
      />
      <HeroContainer>
        <HeroBg>
          <StarCanvas />
          <HeroBgAnimation />
        </HeroBg>

        <motion.div {...headContainerAnimation}>
          <HeroInnerContainer>
            <HeroLeftContainer>
              <motion.div {...headTextAnimation}>
                <Title>
                  Hi, I am <br /> {Bio.name}
                </Title>
                <TextLoop>
                  I am a
                  <Span>
                    <Typewriter
                      options={{
                        strings: Bio.roles,
                        autoStart: isLoadingComplete,
                        loop: true,
                        delay: isLoadingComplete ? 50 : 0,
                      }}
                    />
                  </Span>
                </TextLoop>
              </motion.div>
              
              <ContentWrapper {...headContentAnimation}>
                <SubTitle>{Bio.description}</SubTitle>
                <ResumeButton href={Bio.resume} target="_blank">
                  Check Resume
                </ResumeButton>
              </ContentWrapper>
            </HeroLeftContainer>
            <HeroRightContainer>
              <motion.div {...imageAnimation}>
                <Tilt>
                  <Img src={HeroImg} alt="Richad Yamin Ali" />
                </Tilt>
              </motion.div>
            </HeroRightContainer>
          </HeroInnerContainer>
        </motion.div>
      </HeroContainer>
    </div>
  );
};

export default Hero;
