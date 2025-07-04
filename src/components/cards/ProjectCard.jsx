import React from "react";
import styled from "styled-components";
import { GitHub } from "@mui/icons-material";
import EmojiEventsIcon from '@mui/icons-material/EmojiEvents';

const Card = styled.div`
  width: 330px;
  height: 520px;
  background-color: ${({ theme }) => theme.card};
  cursor: pointer;
  border-radius: 10px;
  box-shadow: 0 0 12px 4px rgba(0, 0, 0, 0.4);
  overflow: hidden;
  padding: 26px 20px;
  display: flex;
  flex-direction: column;
  gap: 14px;
  transition: all 0.5s ease-in-out;
  position: relative;
  &:hover {
    transform: translateY(-10px);
    box-shadow: 0 0 50px 4px rgba(0, 0, 0, 0.6);
    filter: brightness(1.1);
  }
`;

const Badge = styled.div`
  position: absolute;
  top: 25px;
  right: -45px;
  background: ${({ theme }) => theme.primary};
  color: ${({ theme }) => theme.text_primary};
  font-size: 12px;
  font-weight: 500;
  padding: 6px 40px;
  transform: rotate(45deg);
  width: 200px;
  text-align: center;
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 4px;
  z-index: 1;
`;

const Image = styled.img`
  width: 100%;
  height: 180px;
  background-color: ${({ theme }) => theme.white};
  border-radius: 10px;
  box-shadow: 0 0 16px 2px rgba(0, 0, 0, 0.3);
`;
const Tags = styled.div`
  width: 100%;
  display: flex;
  align-items: center;
  flex-wrap: wrap;
  gap: 8px;
  margin-top: 4px;
`;
const Tag = styled.div`
  font-size: 12px;
  font-weight: 400;
  color: ${({ theme }) => theme.primary};
  background-color: ${({ theme }) => theme.primary + 15};
  padding: 2px 8px;
  border-radius: 10px;
`;
const Details = styled.div`
  width: 100%;
  display: flex;
  flex-direction: column;
  gap: 0px;
  padding: 0px 2px;
`;
const Title = styled.div`
  font-size: 20px;
  font-weight: 600;
  color: ${({ theme }) => theme.text_secondary};
  overflow: hidden;
  display: -webkit-box;
  max-width: 100%;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
  text-overflow: ellipsis;
`;
const Date = styled.div`
  font-size: 12px;
  margin-left: 2px;
  font-weight: 400;
  color: ${({ theme }) => theme.text_secondary + 80};
  @media only screen and (max-width: 768px) {
    font-size: 10px;
  }
`;
const Description = styled.div`
  font-weight: 400;
  color: ${({ theme }) => theme.text_secondary + 99};
  overflow: hidden;
  margin-top: 8px;
  display: -webkit-box;
  max-width: 100%;
  -webkit-line-clamp: 4;
  -webkit-box-orient: vertical;
  text-overflow: ellipsis;
`;

const ButtonGroup = styled.div`
  display: flex;
  justify-content: space-between;
  gap: 12px;
  margin-top: auto;
  margin-bottom: 8px;
`;

const Button = styled.a`
  width: 100%;
  text-align: center;
  font-size: 14px;
  font-weight: 600;
  color: ${({ theme }) => theme.text_primary};
  padding: 8px 12px;
  border-radius: 8px;
  background-color: ${({ theme }) => theme.primary};
  ${({ dull, theme }) =>
    dull &&
    `
      background-color: ${theme.bgLight};
      color: ${theme.text_secondary};
      &:hover {
        background-color: ${theme.bg + 99};
      }
  `}
  ${({ disabled }) =>
    disabled &&
    `
      opacity: 0.6;
      cursor: not-allowed;
      &:hover {
        background-color: inherit;
        transform: none;
      }
  `}
  cursor: pointer;
  text-decoration: none;
  transition: all 0.5s ease;
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 8px;
  &:hover {
    background-color: ${({ theme }) => theme.primary + 99};
  }
  @media only screen and (max-width: 600px) {
    font-size: 12px;
    padding: 6px 10px;
  }
`;

const ProjectCard = ({ project, setOpenModal }) => {
  return (
    <Card>
      {project.award && (
        <Badge>
          <EmojiEventsIcon style={{ fontSize: 16 }} /> {project.award}
        </Badge>
      )}
      <Image src={project.image} onClick={() => setOpenModal({ state: true, project: project })} />
      <Tags>
        {project.tags?.map((tag, index) => (
          <Tag key={index}>{tag}</Tag>
        ))}
      </Tags>
      <Details onClick={() => setOpenModal({ state: true, project: project })}>
        <Title>{project.title}</Title>
        <Date>{project.date}</Date>
        <Description>{project.description}</Description>
      </Details>
      <ButtonGroup>
        <Button 
          dull 
          href={project.github || "#"} 
          target="_blank" 
          onClick={(e) => !project.github && e.preventDefault()}
          disabled={!project.github}
        >
          <GitHub /> Code
        </Button>
        <Button 
          href={project.webapp || "#"} 
          target="_blank" 
          onClick={(e) => !project.webapp && e.preventDefault()}
          disabled={!project.webapp}
        >
          Live Demo
        </Button>
      </ButtonGroup>
    </Card>
  );
};

export default ProjectCard;
