import { useState, useEffect } from "react";

const useActiveSection = () => {
  const [activeSection, setActiveSection] = useState("");

  useEffect(() => {
    const sections = [
      { id: "about", element: null },
      { id: "skills", element: null },
      { id: "experience", element: null },
      { id: "projects", element: null },
      { id: "blog", element: null },
      { id: "education", element: null },
      { id: "contact", element: null },
    ];

    // Get section elements with exact ID matches
    sections.forEach((section) => {
      let element = null;

      if (section.id === "about") {
        element = document.getElementById("about");
      } else if (section.id === "skills") {
        element = document.getElementById("Skills");
      } else if (section.id === "experience") {
        element = document.getElementById("Experience");
      } else if (section.id === "projects") {
        element = document.getElementById("Projects");
      } else if (section.id === "blog") {
        element = document.getElementById("Blog");
      } else if (section.id === "education") {
        element = document.getElementById("Education");
      } else if (section.id === "contact") {
        element = document.getElementById("Contact");
      }

      section.element = element;
    });

    const observerOptions = {
      root: null,
      rootMargin: "-10% 0px -70% 0px", // Trigger when section is 10% from top
      threshold: 0.2,
    };

    const observerCallback = (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          const sectionId =
            entry.target.id ||
            entry.target.getAttribute("data-section") ||
            entry.target.closest("[id]")?.id;

          if (sectionId) {
            // Map actual section IDs to navbar links
            const sectionMap = {
              about: "about",
              Skills: "skills",
              Experience: "experience",
              Projects: "projects",
              Blog: "blog",
              Education: "education",
              Contact: "contact",
            };

            const mappedSection = sectionMap[sectionId];
            if (mappedSection) {
              setActiveSection(mappedSection);
            }
          }
        }
      });
    };

    const observer = new IntersectionObserver(
      observerCallback,
      observerOptions
    );

    // Observe all sections
    sections.forEach((section) => {
      if (section.element) {
        observer.observe(section.element);
      }
    });

    // Observe hero/about section specifically
    const aboutSection = document.getElementById("about");
    if (aboutSection) {
      observer.observe(aboutSection);
    }

    // Fallback scroll listener
    const handleScroll = () => {
      const scrollPosition = window.scrollY + window.innerHeight / 3;

      for (const section of sections) {
        if (section.element) {
          const rect = section.element.getBoundingClientRect();
          const elementTop = rect.top + window.scrollY;
          const elementBottom = elementTop + rect.height;

          if (scrollPosition >= elementTop && scrollPosition <= elementBottom) {
            setActiveSection(section.id);
            break;
          }
        }
      }

      // Set 'about' as active when at top of page
      if (window.scrollY < 100) {
        setActiveSection("about");
      }
    };

    // Initial check
    handleScroll();

    window.addEventListener("scroll", handleScroll, { passive: true });

    return () => {
      observer.disconnect();
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  return activeSection;
};

export default useActiveSection;
