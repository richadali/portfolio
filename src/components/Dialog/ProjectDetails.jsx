import { CloseRounded, GitHub, LinkedIn } from "@mui/icons-material";
import { Modal } from "@mui/material";
import React from "react";
import styled from "styled-components";
import { motion, AnimatePresence } from "framer-motion";
import EmojiEventsIcon from '@mui/icons-material/EmojiEvents';

const Container = styled(motion.div)`
  width: 100%;
  height: 100%;
  position: absolute;
  top: 0;
  left: 0;
  background-color: #000000a7;
  display: flex;
  align-items: top;
  justify-content: center;
  overflow-y: scroll;
`;

const Wrapper = styled(motion.div)`
  max-width: 600px;
  width: 100%;
  border-radius: 16px;
  margin: 50px 12px;
  height: min-content;
  background-color: ${({ theme }) => theme.card};
  color: ${({ theme }) => theme.text_primary};
  padding: 20px;
  display: flex;
  flex-direction: column;
  position: relative;
`;

const Title = styled.div`
  font-size: 28px;
  font-weight: 600;
  color: ${({ theme }) => theme.text_primary};
  margin: 8px 6px 0px 6px;
  @media only screen and (max-width: 600px) {
    font-size: 24px;
    margin: 6px 6px 0px 6px;
  }
`;

const Date = styled.div`
  font-size: 16px;
  margin: 2px 6px;
  font-weight: 400;
  color: ${({ theme }) => theme.text_secondary};
  @media only screen and (max-width: 768px) {
    font-size: 12px;
  }
`;

const Desc = styled.div`
  font-size: 16px;
  font-weight: 400;
  color: ${({ theme }) => theme.text_primary};
  margin: 8px 6px;
  @media only screen and (max-width: 600px) {
    font-size: 14px;
    margin: 6px 6px;
  }
`;

const Image = styled.img`
  width: 100%;
  object-fit: cover;
  border-radius: 12px;
  margin-top: 30px;
  box-shadow: 0px 0px 10px 0px rgba(0, 0, 0, 0.3);
`;

const Label = styled.div`
  font-size: 20px;
  font-weight: 600;
  color: ${({ theme }) => theme.text_primary};
  margin: 8px 6px;
  @media only screen and (max-width: 600px) {
    font-size: 16px;
    margin: 8px 6px;
  }
`;

const Tags = styled.div`
  display: flex;
  flex-wrap: wrap;
  margin: 8px 0px;
  @media only screen and (max-width: 600px) {
    margin: 4px 0px;
  }
`;

const Tag = styled.div`
  font-size: 14px;
  font-weight: 400;
  color: ${({ theme }) => theme.primary};
  margin: 4px;
  padding: 4px 8px;
  border-radius: 8px;
  background-color: ${({ theme }) => theme.primary + 20};
  @media only screen and (max-width: 600px) {
    font-size: 12px;
  }
`;

const ButtonGroup = styled.div`
  display: flex;
  justify-content: flex-end;
  margin: 12px 0px;
  gap: 12px;
`;

const Button = styled.a`
  width: 100%;
  text-align: center;
  font-size: 16px;
  font-weight: 600;
  color: ${({ theme }) => theme.text_primary};
  padding: 12px 16px;
  border-radius: 8px;
  background-color: ${({ theme }) => theme.primary};
  ${({ dull, theme }) =>
    dull &&
    `
        background-color: ${theme.bgLight};
        color: ${theme.text_secondary};
        &:hover {
            background-color: ${({ theme }) => theme.bg + 99};
        }
    `}
  cursor: pointer;
  text-decoration: none;
  transition: all 0.5s ease;
  &:hover {
    background-color: ${({ theme }) => theme.primary + 99};
  }
  @media only screen and (max-width: 600px) {
    font-size: 12px;
  }
`;

const Award = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 16px;
  font-weight: 500;
  color: ${({ theme }) => theme.primary};
  margin: 8px 6px 0px 6px;
  
  @media only screen and (max-width: 600px) {
    font-size: 14px;
  }
`;

const ProjectDetails = ({ openModal, setOpenModal }) => {
  const project = openModal?.project;

  // Animation variants for modal
  const backdropVariants = {
    hidden: { opacity: 0 },
    visible: { 
      opacity: 1,
      transition: { duration: 0.3 }
    },
    exit: { 
      opacity: 0,
      transition: { duration: 0.2 }
    }
  };

  const modalVariants = {
    hidden: { 
      opacity: 0, 
      scale: 0.8,
      y: 100
    },
    visible: { 
      opacity: 1, 
      scale: 1,
      y: 0,
      transition: { 
        duration: 0.4,
        ease: [0.6, -0.05, 0.01, 0.99]
      }
    },
    exit: { 
      opacity: 0, 
      scale: 0.8,
      y: 100,
      transition: { 
        duration: 0.3,
        ease: [0.6, -0.05, 0.01, 0.99]
      }
    }
  };

  return (
    <Modal
      open={true}
      onClose={() => setOpenModal({ state: false, project: null })}
      closeAfterTransition
    >
      <Container
        variants={backdropVariants}
        initial="hidden"
        animate="visible"
        exit="exit"
      >
        <Wrapper
          variants={modalVariants}
          initial="hidden"
          animate="visible"
          exit="exit"
        >
          <CloseRounded
            style={{
              position: "absolute",
              top: "10px",
              right: "20px",
              cursor: "pointer",
            }}
            onClick={() => setOpenModal({ state: false, project: null })}
          />
          <Image src={project?.image} />
          <Title>{project?.title}</Title>
          {project?.award && (
            <Award>
              <EmojiEventsIcon style={{ fontSize: 20 }} /> {project.award}
            </Award>
          )}
          <Date>{project.date}</Date>
          <Tags>
            {project?.tags.map((tag, index) => (
              <Tag key={index}>{tag}</Tag>
            ))}
          </Tags>
          <Desc>{project?.description}</Desc>
          <ButtonGroup>
            {project?.github && (
            <Button dull href={project?.github} target="new">
              View Code
            </Button>
            )}
            {project?.webapp && (
            <Button href={project?.webapp} target="new">
              View Live App
            </Button>
            )}
          </ButtonGroup>
        </Wrapper>
      </Container>
    </Modal>
  );
};

export default ProjectDetails;
