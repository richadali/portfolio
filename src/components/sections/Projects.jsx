import React, { useState } from "react";
import styled from "styled-components";
import { motion } from "framer-motion";
import { projects } from "../../data/constants";
import ProjectCard from "../cards/ProjectCard";

const Container = styled.div`
margin-top: 40px;
display: flex;
flex-direction: column;
justify-content-center;
position: relative;
z-index: 1;
padding: 0 16px;
align-items: center;
`;

const Wrapper = styled.div`
  position: relative;
  display: flex;
  justify-content: space-between;
  align-items: center;
  flex-direction: column;
  width: 100%;
  max-width: 1100px;
  gap: 12px;
  @media (max-width: 960px) {
    flex-direction: column;
  }
`;

const Title = styled.div`
  font-size: 52px;
  text-align: center;
  font-weight: 600;
  margin-top: 20px;
  color: ${({ theme }) => theme.text_primary};
  @media (max-width: 768px) {
    margin-top: 12px;
    font-size: 32px;
  }
`;

const Desc = styled.div`
  font-size: 18px;
  text-align: center;
  font-weight: 600;
  color: ${({ theme }) => theme.text_secondary};
  @media (max-width: 768px) {
    font-size: 16px;
  }
`;

const ToggleButtonGroup = styled.div`
display: flex;
border: 1.5px solid ${({ theme }) => theme.primary};
color: ${({ theme }) => theme.primary};
font-size: 16px;
border-radius: 12px;
  font-weight: 500;
margin: 22px 0;
@media (max-width: 768px){
    font-size: 12px;
}
`;

const ToggleButton = styled.div`
  padding: 8px 18px;
  border-radius: 6px;
  cursor: pointer;
  &:hover {
    background: ${({ theme }) => theme.primary + 20};
  }
  @media (max-width: 768px) {
    padding: 6px 8px;
    border-radius: 4px;
  }
  ${({ active, theme }) =>
    active &&
    `
    background: ${theme.primary + 20};
  `}
`;

const Divider = styled.div`
  width: 1.5px;
  background: ${({ theme }) => theme.primary};
`;

const CardContainer = styled(motion.div)`
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 28px;
  flex-wrap: wrap;
`;

const Projects = ({ openModal, setOpenModal }) => {
  const [toggle, setToggle] = useState("all");

  // Animation variants for project cards
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.2
      }
    }
  };

  const cardVariants = {
    hidden: { 
      opacity: 0, 
      y: 50,
      scale: 0.9
    },
    visible: {
      opacity: 1,
      y: 0,
      scale: 1,
      transition: {
        duration: 0.6,
        ease: [0.6, -0.05, 0.01, 0.99]
      }
    }
  };

  return (
    <Container id="Projects">
      <Wrapper>
        <Title>Projects</Title>
        <Desc
          style={{
            marginBottom: "40px",
          }}
        >
          I've worked on a variety of projects, from web applications using PHP and Laravel
          to mobile apps built with Flutter. Here are some of my notable projects.
        </Desc>
        <ToggleButtonGroup>
          <ToggleButton
            active={toggle === "all"}
            onClick={() => setToggle("all")}
          >
            ALL
          </ToggleButton>
          <Divider />
          <ToggleButton
            active={toggle === "web app"}
            onClick={() => setToggle("web app")}
          >
            WEB APPS
          </ToggleButton>
          <Divider />
          <ToggleButton
            active={toggle === "android app"}
            onClick={() => setToggle("android app")}
          >
            ANDROID APPS
          </ToggleButton>
          <Divider />
          <ToggleButton
            active={toggle === "ai"}
            onClick={() => setToggle("ai")}
          >
            AI
          </ToggleButton>
        </ToggleButtonGroup>
        <CardContainer
          key={toggle}
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: false, amount: 0.1 }}
        >
          {toggle === "all" &&
            projects.map((project, index) => (
              <motion.div
                key={project.id}
                variants={cardVariants}
                custom={index}
              >
                <ProjectCard
                  project={project}
                  openModal={openModal}
                  setOpenModal={setOpenModal}
                />
              </motion.div>
            ))}
          {projects
            .filter((item) => item.category === toggle)
            .map((project, index) => (
              <motion.div
                key={project.id}
                variants={cardVariants}
                custom={index}
              >
                <ProjectCard
                  project={project}
                  openModal={openModal}
                  setOpenModal={setOpenModal}
                />
              </motion.div>
            ))}
        </CardContainer>
      </Wrapper>
    </Container>
  );
};

export default Projects;
