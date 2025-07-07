import React from "react";
import styled from "styled-components";
import { skills } from "../../data/constants";
import { Tilt } from "react-tilt";
import { motion } from "framer-motion";

const Container = styled.div`
display: flex;
flex-direction: column;
justify-content-center;
position: relative;
z-index: 1;
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

const SkillsContainer = styled.div`
  width: 100%;
  display: flex;
  flex-wrap: wrap;
  margin-top: 20px;
  gap: 50px;
  justify-content: center;
`;

const Skill = styled.div`
  width: 100%;
  max-width: 500px;
  background-color: rgba(17, 25, 40, 0.83);
  border: 1px solid rgba(255, 255, 255, 0.125);
  box-shadow: rgba(23, 92, 230, 0.15) 0px 4px 24px;
  border-radius: 16px;
  padding: 18px 36px;
  transition: all 0.3s ease-in-out;

  &:hover {
    transform: translateY(-5px);
    box-shadow: rgba(23, 92, 230, 0.25) 0px 8px 32px;
    border: 1px solid rgba(255, 255, 255, 0.2);
  }

  @media (max-width: 768px) {
    max-width: 400px;
    padding: 10px 36px;
  }

  @media (max-width: 500px) {
    max-width: 330px;
    padding: 10px 36px;
  }
`;

const SkillTitle = styled.div`
  font-size: 28px;
  font-weight: 600;
  margin-bottom: 20px;
  text-align: center;
  color: ${({ theme }) => theme.text_secondary};
`;

const SkillList = styled.div`
  display: flex;
  justify-content: center;
  flex-wrap: wrap;
  gap: 12px;
  margin-bottom: 20px;
`;

const SkillItem = styled.div`
  font-size: 16px;
  font-weight: 400;
  color: ${({ theme }) => theme.text_primary + 80};
  border: 1px solid ${({ theme }) => theme.text_primary + 80};
  border-radius: 12px;
  padding: 12px 16px;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  transition: all 0.3s ease-in-out;

  &:hover {
    border: 1px solid ${({ theme }) => theme.primary};
    color: ${({ theme }) => theme.primary};
    transform: scale(1.05);
    box-shadow: rgba(123, 67, 151, 0.3) 0px 4px 16px;
  }

  @media (max-width: 768px) {
    font-size: 14px;
    padding: 8px 12px;
  }
  @media (max-width: 500px) {
    font-size: 14px;
    padding: 6px 12px;
  }
`;

const SkillImage = styled.img`
  width: 24px;
  height: 24px;
`;

// Animation variants for skill items
const skillItemVariants = {
  initial: {
    opacity: 0,
    scale: 0.8,
    y: 20
  },
  animate: {
    opacity: 1,
    scale: 1,
    y: 0,
    transition: {
      duration: 0.6,
      ease: [0.6, -0.05, 0.01, 0.99]
    }
  }
};

const skillListVariants = {
  initial: {},
  animate: {
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.2
    }
  }
};

// Animation variants to replace the imported ones
const fadeInUp = {
  initial: {
    opacity: 0,
    y: 60
  },
  animate: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.6,
      ease: [0.6, -0.05, 0.01, 0.99]
    }
  }
};

const staggerContainer = {
  initial: {},
  animate: {
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.3
    }
  }
};

const staggerItem = {
  initial: {
    opacity: 0,
    y: 50
  },
  animate: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.6,
      ease: [0.6, -0.05, 0.01, 0.99]
    }
  }
};

const Skills = () => {
  return (
    <Container id="Skills">
      <Wrapper>
        <motion.div
          variants={fadeInUp}
          initial="initial"
          whileInView="animate"
          viewport={{ once: true, amount: 0.3 }}
        >
        <Title>Skills</Title>
        </motion.div>

        <motion.div
          variants={fadeInUp}
          initial="initial"
          whileInView="animate"
          viewport={{ once: true, amount: 0.3 }}
          transition={{ delay: 0.2 }}
        >
        <Desc
          style={{
            marginBottom: "40px",
          }}
        >
          Here are some of my skills that I have developed over my 5+ years of experience
          in full-stack development and server management.
        </Desc>
        </motion.div>

        <motion.div
          variants={staggerContainer}
          initial="initial"
          whileInView="animate"
          viewport={{ once: true, amount: 0.1 }}
        >
        <SkillsContainer>
          {skills.map((skill, index) => (
              <motion.div
                key={`skill-${index}`}
                variants={staggerItem}
                whileHover={{ 
                  y: -10,
                  transition: { duration: 0.3 }
                }}
              >
            <Tilt>
                  <Skill>
                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.6, delay: 0.1 }}
                      viewport={{ once: true }}
                    >
                <SkillTitle>{skill.title}</SkillTitle>
                    </motion.div>
                    
                    <motion.div
                      variants={skillListVariants}
                      initial="initial"
                      whileInView="animate"
                      viewport={{ once: true }}
                    >
                <SkillList>
                  {skill.skills.map((item, index_x) => (
                          <motion.div
                            key={`skill-x-${index_x}`}
                            variants={skillItemVariants}
                            whileHover={{ 
                              scale: 1.1,
                              transition: { duration: 0.2 }
                            }}
                            whileTap={{ scale: 0.95 }}
                          >
                            <SkillItem>
                      <SkillImage src={item.image} />
                      {item.name}
                    </SkillItem>
                          </motion.div>
                  ))}
                </SkillList>
                    </motion.div>
              </Skill>
            </Tilt>
              </motion.div>
          ))}
        </SkillsContainer>
        </motion.div>
      </Wrapper>
    </Container>
  );
};

export default Skills;
