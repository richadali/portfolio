import React, { useState } from "react";
import { Link as LinkR } from "react-router-dom";
import styled, { useTheme } from "styled-components";
import { Bio } from "../data/constants";
import { MenuRounded } from "@mui/icons-material";
import { motion, AnimatePresence } from "framer-motion";

const Nav = styled.div`
  background-color: ${({ theme }) => theme.bg};
  height: 80px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1rem;
  position: sticky;
  top: 0;
  z-index: 10;
  color: white;
`;

const ColorText = styled.div`
  color: ${({ theme }) => theme.primary};
  font-size: 32px;
`;

const NavbarContainer = styled.div`
  width: 100%;
  max-width: 1200px;
  padding: 0 24px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  font-size: 1rem;
`;

const NavLogo = styled(LinkR)`
  display: flex;
  align-items: center;
  width: 80%;
  padding: 0 6px;
  font-weight: 500;
  font-size: 18px;
  text-decoration: none;
  color: inherit;
`;

const NavItems = styled.ul`
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 32px;
  padding: 0 6px;
  list-style: none;

  @media screen and (max-width: 768px) {
    display: none;
  }
`;

const NavLink = styled.a`
  color: ${({ theme }) => theme.text_primary};
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s ease-in-out;
  text-decoration: none;
  &:hover {
    color: ${({ theme }) => theme.primary};
  }
`;

const ButtonContainer = styled.div`
  width: 80%;
  height: 100%;
  display: flex;
  justify-content: end;
  align-items: center;
  padding: 0 6px;
  @media screen and (max-width: 768px) {
    display: none;
  }
`;

const GithubButton = styled.a`
  border: 1px solid ${({ theme }) => theme.primary};
  color: ${({ theme }) => theme.primary};
  justify-content: center;
  display: flex;
  align-items: center;
  border-radius: 20px;
  cursor: pointer;
  padding: 10px 20px;
  font-size: 16px;
  font-weight: 500;
  transition: all 0.6s ease-in-out;
  text-decoration: none;
  &:hover {
    background: ${({ theme }) => theme.primary};
    color: ${({ theme }) => theme.text_primary};
  }
`;

const MobileIcon = styled.div`
  height: 100%;
  display: flex;
  align-items: center;
  color: ${({ theme }) => theme.text_primary};
  display: none;
  cursor: pointer;
  transition: all 0.3s ease-in-out;
  
  &:hover {
    color: ${({ theme }) => theme.primary};
    transform: scale(1.1);
  }
  
  @media screen and (max-width: 768px) {
    display: block;
  }
`;

const MobileMenu = styled(motion.ul)`
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: start;
  gap: 16px;
  padding: 0 6px;
  list-style: none;
  width: 100%;
  padding: 12px 40px 24px 40px;
  
  /* Enhanced background with gaussian blur */
  background: rgba(25, 25, 36, 0.5);
  backdrop-filter: blur(20px);
  -webkit-backdrop-filter: blur(20px);
  
  position: absolute;
  top: 80px;
  right: 0;
  border-radius: 0 0 20px 20px;
  box-shadow: 
    0 8px 32px rgba(0, 0, 0, 0.3),
    0 0 0 1px rgba(255, 255, 255, 0.1);
  border: 1px solid rgba(255, 255, 255, 0.1);
  z-index: 1000;
`;

const MobileNavLink = styled(motion.a)`
  color: ${({ theme }) => theme.text_primary};
  font-weight: 500;
  cursor: pointer;
  transition: all 0.3s ease-in-out;
  text-decoration: none;
  padding: 8px 0;
  border-radius: 8px;
  width: 100%;
  
  &:hover {
    color: ${({ theme }) => theme.primary};
    transform: translateX(10px);
    background: rgba(133, 76, 230, 0.1);
    padding-left: 12px;
  }
`;

const MobileGithubButton = styled(motion.a)`
  border: 1px solid ${({ theme }) => theme.primary};
  color: ${({ theme }) => theme.text_primary};
  justify-content: center;
  display: flex;
  align-items: center;
  border-radius: 20px;
  cursor: pointer;
  padding: 10px 20px;
  font-size: 16px;
  font-weight: 500;
  transition: all 0.3s ease-in-out;
  text-decoration: none;
  background: ${({ theme }) => theme.primary};
  margin-top: 8px;
  
  &:hover {
    transform: scale(1.05);
    box-shadow: 0 5px 20px rgba(133, 76, 230, 0.4);
  }
`;

// Animation variants
const menuVariants = {
  closed: {
    opacity: 0,
    y: -20,
    scale: 0.95,
    transition: {
      duration: 0.3,
      ease: "easeInOut"
    }
  },
  open: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: {
      duration: 0.4,
      ease: "easeOut",
      staggerChildren: 0.1,
      delayChildren: 0.1
    }
  }
};

const itemVariants = {
  closed: {
    opacity: 0,
    x: -20,
    transition: {
      duration: 0.2
    }
  },
  open: {
    opacity: 1,
    x: 0,
    transition: {
      duration: 0.3,
      ease: "easeOut"
    }
  }
};

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const theme = useTheme();
  
  return (
    <Nav>
      <NavbarContainer>
        <NavLogo to="/">
          <ColorText>&lt;</ColorText>Richad
          <div style={{ color: theme.primary }}>/</div>Ali
          <ColorText>&gt;</ColorText>
        </NavLogo>

        <MobileIcon onClick={() => setIsOpen(!isOpen)}>
          <MenuRounded style={{ color: "inherit" }} />
        </MobileIcon>

        <NavItems>
          <NavLink href="#About">About</NavLink>
          <NavLink href="#Skills">Skills</NavLink>
          <NavLink href="#Experience">Experience</NavLink>
          <NavLink href="#Projects">Projects</NavLink>
          <NavLink href="#Education">Education</NavLink>
          <NavLink href="#Contact">Contact</NavLink>
        </NavItems>

        <AnimatePresence>
          {isOpen && (
            <MobileMenu
              variants={menuVariants}
              initial="closed"
              animate="open"
              exit="closed"
            >
              <MobileNavLink 
                variants={itemVariants}
                onClick={() => setIsOpen(false)} 
                href="#About"
              >
                About
              </MobileNavLink>
              <MobileNavLink 
                variants={itemVariants}
                onClick={() => setIsOpen(false)} 
                href="#Skills"
              >
                Skills
              </MobileNavLink>
              <MobileNavLink 
                variants={itemVariants}
                onClick={() => setIsOpen(false)} 
                href="#Experience"
              >
                Experience
              </MobileNavLink>
              <MobileNavLink 
                variants={itemVariants}
                onClick={() => setIsOpen(false)} 
                href="#Projects"
              >
                Projects
              </MobileNavLink>
              <MobileNavLink 
                variants={itemVariants}
                onClick={() => setIsOpen(false)} 
                href="#Education"
              >
                Education
              </MobileNavLink>
              <MobileNavLink 
                variants={itemVariants}
                onClick={() => setIsOpen(false)} 
                href="#Contact"
              >
                Contact
              </MobileNavLink>
              <MobileGithubButton
                variants={itemVariants}
                href={Bio.github}
                target="_Blank"
              >
                Github Profile
              </MobileGithubButton>
            </MobileMenu>
          )}
        </AnimatePresence>

        <ButtonContainer>
          <GithubButton href={Bio.github} target="_Blank">
            Github Profile
          </GithubButton>
        </ButtonContainer>
      </NavbarContainer>
    </Nav>
  );
};

export default Navbar;
