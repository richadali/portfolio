import React, { useState } from "react";
import { Link as LinkR } from "react-router-dom";
import styled, { useTheme } from "styled-components";
import { Bio } from "../data/constants";
import { MenuRounded } from "@mui/icons-material";
import { motion, AnimatePresence } from "framer-motion";
import useActiveSection from "../hooks/useActiveSection";

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

const NavLink = styled(motion.a)`
  color: ${({ theme, $isActive }) => $isActive ? theme.primary : theme.text_primary};
  font-weight: 500;
  cursor: pointer;
  transition: all 0.5s ease-in-out;
  text-decoration: none;
  position: relative;
  padding: 8px 1px;
  border-radius: 8px;
  
  &:before {
    content: '';
    position: absolute;
    bottom: -2px;
    left: 50%;
    width: ${({ $isActive }) => $isActive ? '100%' : '0%'};
    height: 2px;
    background: ${({ theme }) => theme.primary};
    transform: translateX(-50%);
    transition: width 0.5s ease-in-out;
    border-radius: 1px;
  }
  
  &:after {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: ${({ theme }) => theme.primary}15;
    border-radius: 8px;
    opacity: 0;
    transition: opacity 0.5s ease-in-out;
    z-index: -1;
  }
  
  &:hover {
    color: ${({ theme }) => theme.primary};
    
    &:before {
      width: 100%;
    }
    
    &:after {
      opacity: 0.5;
    }
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

const GithubButton = styled(motion.a)`
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
  transition: all 0.4s ease-in-out;
  text-decoration: none;
  position: relative;
  overflow: hidden;
  
  &:before {
    content: '';
    position: absolute;
    top: 0;
    left: -100%;
    width: 100%;
    height: 100%;
    background: ${({ theme }) => theme.primary};
    transition: left 0.3s ease;
    z-index: -1;
  }
  
  &:hover:before {
    left: 0;
  }
  
  &:hover {
    color: ${({ theme }) => theme.text_primary};
    transform: translateY(-2px);
    box-shadow: 0 8px 25px rgba(133, 76, 230, 0.3);
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
  color: ${({ theme, $isActive }) => $isActive ? theme.primary : theme.text_primary};
  font-weight: 500;
  cursor: pointer;
  transition: all 0.3s ease-in-out;
  text-decoration: none;
  padding: 12px 16px;
  border-radius: 8px;
  width: 100%;
  position: relative;
  background: ${({ theme, $isActive }) => $isActive ? `${theme.primary}15` : 'transparent'};
  border: ${({ theme, $isActive }) => $isActive ? `1px solid ${theme.primary}30` : '1px solid transparent'};
  
  &:before {
    content: '';
    position: absolute;
    left: 0;
    top: 50%;
    width: ${({ $isActive }) => $isActive ? '4px' : '0px'};
    height: 60%;
    background: ${({ theme }) => theme.primary};
    transform: translateY(-50%);
    transition: width 0.3s ease-in-out;
    border-radius: 0 2px 2px 0;
  }
  
  &:hover {
    color: ${({ theme }) => theme.primary};
    transform: translateX(8px);
    background: rgba(133, 76, 230, 0.1);
    border-color: ${({ theme }) => theme.primary}30;
    
    &:before {
      width: 4px;
    }
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
  const activeSection = useActiveSection();

  // Smooth scroll function
  const handleScrollTo = (e, targetId) => {
    e.preventDefault();
    const element = document.getElementById(targetId);
    if (element) {
      element.scrollIntoView({
        behavior: 'smooth',
        block: 'start',
        inline: 'nearest'
      });
    }
  };

  // Animation variants for navbar items
  const linkVariants = {
    inactive: {
      scale: 1,
      y: 0
    },
    active: {
      scale: 1,
      y: 0
    },
    hover: {
      scale: 1,
      y: 0
    }
  };

  // Pulse animation for active items
  const pulseVariants = {
    inactive: {
      boxShadow: "0 0 0 0 rgba(133, 76, 230, 0)"
    },
    active: {
      boxShadow: [
        "0 0 0 0 rgba(133, 76, 230, 0.4)",
        "0 0 0 8px rgba(133, 76, 230, 0)",
        "0 0 0 0 rgba(133, 76, 230, 0)"
      ],
      transition: {
        duration: 2,
        repeat: Infinity,
        ease: "easeOut"
      }
    }
  };
  
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
          <NavLink 
            href="#About"
            $isActive={activeSection === 'about'}
            variants={linkVariants}
            animate={activeSection === 'about' ? 'active' : 'inactive'}
            whileHover="hover"
            onClick={(e) => handleScrollTo(e, 'about')}
          >
            About
          </NavLink>
          <NavLink 
            href="#Skills"
            $isActive={activeSection === 'skills'}
            variants={linkVariants}
            animate={activeSection === 'skills' ? 'active' : 'inactive'}
            whileHover="hover"
            onClick={(e) => handleScrollTo(e, 'Skills')}
          >
            Skills
          </NavLink>
          <NavLink 
            href="#Experience"
            $isActive={activeSection === 'experience'}
            variants={linkVariants}
            animate={activeSection === 'experience' ? 'active' : 'inactive'}
            whileHover="hover"
            onClick={(e) => handleScrollTo(e, 'Experience')}
          >
            Experience
          </NavLink>
          <NavLink 
            href="#Projects"
            $isActive={activeSection === 'projects'}
            variants={linkVariants}
            animate={activeSection === 'projects' ? 'active' : 'inactive'}
            whileHover="hover"
            onClick={(e) => handleScrollTo(e, 'Projects')}
          >
            Projects
          </NavLink>
          <NavLink 
            href="#Education"
            $isActive={activeSection === 'education'}
            variants={linkVariants}
            animate={activeSection === 'education' ? 'active' : 'inactive'}
            whileHover="hover"
            onClick={(e) => handleScrollTo(e, 'Education')}
          >
            Education
          </NavLink>
          <NavLink 
            href="#Contact"
            $isActive={activeSection === 'contact'}
            variants={linkVariants}
            animate={activeSection === 'contact' ? 'active' : 'inactive'}
            whileHover="hover"
            onClick={(e) => handleScrollTo(e, 'Contact')}
          >
            Contact
          </NavLink>
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
                onClick={(e) => {
                  handleScrollTo(e, 'about');
                  setIsOpen(false);
                }} 
                href="#About"
                $isActive={activeSection === 'about'}
              >
                About
              </MobileNavLink>
              <MobileNavLink 
                variants={itemVariants}
                onClick={(e) => {
                  handleScrollTo(e, 'Skills');
                  setIsOpen(false);
                }} 
                href="#Skills"
                $isActive={activeSection === 'skills'}
              >
                Skills
              </MobileNavLink>
              <MobileNavLink 
                variants={itemVariants}
                onClick={(e) => {
                  handleScrollTo(e, 'Experience');
                  setIsOpen(false);
                }} 
                href="#Experience"
                $isActive={activeSection === 'experience'}
              >
                Experience
              </MobileNavLink>
              <MobileNavLink 
                variants={itemVariants}
                onClick={(e) => {
                  handleScrollTo(e, 'Projects');
                  setIsOpen(false);
                }} 
                href="#Projects"
                $isActive={activeSection === 'projects'}
              >
                Projects
              </MobileNavLink>
              <MobileNavLink 
                variants={itemVariants}
                onClick={(e) => {
                  handleScrollTo(e, 'Education');
                  setIsOpen(false);
                }} 
                href="#Education"
                $isActive={activeSection === 'education'}
              >
                Education
              </MobileNavLink>
              <MobileNavLink 
                variants={itemVariants}
                onClick={(e) => {
                  handleScrollTo(e, 'Contact');
                  setIsOpen(false);
                }} 
                href="#Contact"
                $isActive={activeSection === 'contact'}
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
          <GithubButton 
            href={Bio.github} 
            target="_Blank"
            whileHover={{ 
              scale: 1.05,
              y: -2,
              boxShadow: "0 8px 25px rgba(133, 76, 230, 0.3)"
            }}
            whileTap={{ scale: 0.95 }}
            transition={{ duration: 0.2 }}
          >
            <motion.span
              initial={{ opacity: 1 }}
              whileHover={{ 
                opacity: [1, 0.8, 1],
                transition: { duration: 0.6, repeat: Infinity }
              }}
            >
              Github Profile
            </motion.span>
          </GithubButton>
        </ButtonContainer>
      </NavbarContainer>
    </Nav>
  );
};

export default Navbar;
