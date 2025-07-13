import styled, { ThemeProvider } from "styled-components";
import { darkTheme } from "./utils/Themes";
import Navbar from "./components/Navbar";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Hero from "./components/sections/Hero";
import Skills from "./components/sections/Skills";
import StarCanvas from "./components/canvas/Stars";
import { AnimatePresence } from "framer-motion";
import Education from "./components/sections/Education";
import Experience from "./components/sections/Experience";
import Projects from "./components/sections/Projects";
import Blog from "./components/sections/Blog";
import Contact from "./components/sections/Contact";
import Footer from "./components/sections/Footer";
import ProjectDetails from "./components/Dialog/ProjectDetails";
import LoadingScreen from "./components/LoadingScreen";
import InteractiveGrid from "./components/backgrounds/InteractiveGrid";
import NeuralNetwork from "./components/backgrounds/NeuralNetwork";
import BlogList from "./pages/BlogList";
import BlogPost from "./pages/BlogPost";

import { useState } from "react";
import { HelmetProvider } from "react-helmet-async";
import SEO from "./components/SEO";

const Body = styled.div`
  background-color: ${({ theme }) => theme.bg};
  width: 100%;
  overflow-x: hidden;
  position: relative;
`;

const Wrapper = styled.div`
  padding-bottom: 100px;
  background: linear-gradient(
      38.73deg,
      rgba(204, 0, 187, 0.15) 0%,
      rgba(201, 32, 184, 0) 50%
    ),
    linear-gradient(
      141.27deg,
      rgba(0, 70, 209, 0) 50%,
      rgba(0, 70, 209, 0.15) 100%
    );
  width: 100%;
  clip-path: polygon(0 0, 100% 0, 100% 100%, 30% 98%, 0 100%);
`;

function App() {
  const [openModal, setOpenModal] = useState({ state: false, project: null });
  const [isLoading, setIsLoading] = useState(true);
  const [isLoadingComplete, setIsLoadingComplete] = useState(false);

  const handleLoadingComplete = () => {
    setIsLoading(false);
    // Small delay to ensure smooth transition
    setTimeout(() => {
      setIsLoadingComplete(true);
    }, 200);
  };

  return (
    <HelmetProvider>
      <ThemeProvider theme={darkTheme}>
        <BrowserRouter>
          <SEO />

          <AnimatePresence mode="wait">
            {isLoading ? (
              <LoadingScreen
                key="loading"
                onLoadingComplete={handleLoadingComplete}
              />
            ) : (
              <div key="main-content">
                <Routes>
                  {/* Blog Routes */}
                  <Route path="/blog" element={<BlogList />} />
                  <Route path="/blog/:slug" element={<BlogPost />} />

                  {/* Main Portfolio Route */}
                  <Route
                    path="/"
                    element={
                      <>
                        <Navbar />
                        <Body>
                          {/* Background Layers - Ordered by z-index */}
                          <InteractiveGrid />
                          <StarCanvas />
                          <NeuralNetwork />

                          <AnimatePresence>
                            <div>
                              <Hero isLoadingComplete={isLoadingComplete} />
                              <Wrapper>
                                <Skills />
                                <Experience />
                              </Wrapper>
                              <Projects
                                openModal={openModal}
                                setOpenModal={setOpenModal}
                              />
                              <Wrapper>
                                <Blog />
                                <Education />
                                <Contact />
                              </Wrapper>
                              <Footer />

                              {openModal.state && (
                                <ProjectDetails
                                  openModal={openModal}
                                  setOpenModal={setOpenModal}
                                />
                              )}
                            </div>
                          </AnimatePresence>
                        </Body>
                      </>
                    }
                  />
                </Routes>
              </div>
            )}
          </AnimatePresence>
        </BrowserRouter>
      </ThemeProvider>
    </HelmetProvider>
  );
}

export default App;
