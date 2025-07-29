import React, { useState, useEffect } from "react";
import styled from "styled-components";
import { motion } from "framer-motion";
import BlogCard from "../cards/BlogCard";
import { useNavigate } from "react-router-dom";

const Container = styled.div`
  margin-top: 40px;
  display: flex;
  flex-direction: column;
  justify-content: center;
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
  @media (max-width: 768px) {
    font-size: 12px;
    flex-wrap: wrap;
    gap: 4px;
  }
`;

const ToggleButton = styled.div`
  padding: 8px 18px;
  border-radius: 6px;
  cursor: pointer;
  transition: all 0.3s ease;
  &:hover {
    background: ${({ theme }) => theme.primary + 20};
  }
  @media (max-width: 768px) {
    padding: 6px 12px;
    border-radius: 4px;
    font-size: 11px;
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
  @media (max-width: 768px) {
    display: none;
  }
`;

const CardContainer = styled(motion.div)`
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 28px;
  flex-wrap: wrap;
  margin-top: 20px;
`;

const LoadingMessage = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  color: ${({ theme }) => theme.text_secondary};
  font-size: 18px;
  margin: 40px 0;
  gap: 10px;
`;

const ErrorMessage = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  color: ${({ theme }) => theme.text_secondary};
  font-size: 16px;
  margin: 40px 0;
  text-align: center;
  flex-direction: column;
  gap: 15px;
`;

const RetryButton = styled.button`
  background: ${({ theme }) => theme.primary};
  color: ${({ theme }) => theme.text_primary};
  border: none;
  padding: 10px 20px;
  border-radius: 8px;
  cursor: pointer;
  font-weight: 500;
  transition: all 0.3s ease;
  
  &:hover {
    background: ${({ theme }) => theme.primary + 'dd'};
    transform: translateY(-2px);
  }
`;

const ViewAllButton = styled(motion.button)`
  background: transparent;
  border: 1.5px solid ${({ theme }) => theme.primary};
  color: ${({ theme }) => theme.primary};
  padding: 12px 24px;
  border-radius: 8px;
  font-size: 16px;
  font-weight: 500;
  cursor: pointer;
  margin-top: 20px;
  transition: all 0.3s ease;
  
  &:hover {
    background: ${({ theme }) => theme.primary + 20};
    transform: translateY(-2px);
  }
`;

const StatsContainer = styled.div`
  display: flex;
  gap: 20px;
  margin: 20px 0;
  flex-wrap: wrap;
  justify-content: center;
  
  @media (max-width: 768px) {
    gap: 15px;
  }
`;

const StatItem = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 15px 20px;
  background: ${({ theme }) => theme.card + 50};
  border-radius: 8px;
  border: 1px solid ${({ theme }) => theme.primary + 30};
  
  @media (max-width: 768px) {
    padding: 10px 15px;
  }
`;

const StatNumber = styled.div`
  font-size: 24px;
  font-weight: 600;
  color: ${({ theme }) => theme.primary};
  margin-bottom: 5px;
  
  @media (max-width: 768px) {
    font-size: 20px;
  }
`;

const StatLabel = styled.div`
  font-size: 14px;
  color: ${({ theme }) => theme.text_secondary};
  text-align: center;
`;

const Blog = () => {
  const [activeCategory, setActiveCategory] = useState("all");
  const [posts, setPosts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [stats, setStats] = useState(null);
  const navigate = useNavigate();

  // Animation variants
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

  // Fetch blog data
  useEffect(() => {
    fetchBlogData();
  }, []);

  const fetchBlogData = async () => {
    try {
      setLoading(true);
      setError(null);

      // Fetch latest posts, categories, and stats in parallel
      const baseURL = process.env.NODE_ENV === 'production' 
        ? 'https://api.richadali.dev' 
        : 'http://localhost:3001';
        
      const [postsResponse, categoriesResponse, statsResponse] = await Promise.all([
        fetch(`${baseURL}/api/blog/latest?limit=6`),
        fetch(`${baseURL}/api/blog/categories`),
        fetch(`${baseURL}/api/blog/stats`)
      ]);

      if (!postsResponse.ok || !categoriesResponse.ok || !statsResponse.ok) {
        throw new Error('Failed to fetch blog data');
      }

      const postsData = await postsResponse.json();
      const categoriesData = await categoriesResponse.json();
      const statsData = await statsResponse.json();

      setPosts(postsData.data || []);
      setCategories([{ name: 'All', slug: 'all' }, ...(categoriesData.data || [])]);
      setStats(statsData.data || {});

    } catch (err) {
      console.error('Error fetching blog data:', err);
      setError('Failed to load blog posts. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  // Filter posts by category
  const filteredPosts = activeCategory === 'all' 
    ? posts 
    : posts.filter(post => post.category === activeCategory);

  const handleViewAll = () => {
    navigate('/blog');
  };

  if (loading) {
    return (
      <Container id="Blog">
        <Wrapper>
          <Title>Blog</Title>
          <LoadingMessage>
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
              style={{ width: 20, height: 20, border: "2px solid #854CE6", borderTopColor: "transparent", borderRadius: "50%" }}
            />
            Loading latest posts...
          </LoadingMessage>
        </Wrapper>
      </Container>
    );
  }

  if (error) {
    return (
      <Container id="Blog">
        <Wrapper>
          <Title>Blog</Title>
          <ErrorMessage>
            <span>{error}</span>
            <RetryButton onClick={fetchBlogData}>
              Try Again
            </RetryButton>
          </ErrorMessage>
        </Wrapper>
      </Container>
    );
  }

  return (
    <Container id="Blog">
      <Wrapper>
        <Title>Blog</Title>
        <Desc>
          Insights, tutorials, and thoughts on modern web development, AI, and technology.
          Fresh content generated daily to keep you updated with the latest trends.
        </Desc>

        {/* Blog Statistics */}
        {stats && (
          <StatsContainer>
            <StatItem>
              <StatNumber>{stats.total_posts || 0}</StatNumber>
              <StatLabel>Posts</StatLabel>
            </StatItem>
            <StatItem>
              <StatNumber>{stats.total_views || 0}</StatNumber>
              <StatLabel>Views</StatLabel>
            </StatItem>
            <StatItem>
              <StatNumber>{stats.total_categories || 0}</StatNumber>
              <StatLabel>Categories</StatLabel>
            </StatItem>
            <StatItem>
              <StatNumber>{Math.round(stats.avg_reading_time || 0)}m</StatNumber>
              <StatLabel>Avg Read</StatLabel>
            </StatItem>
          </StatsContainer>
        )}

        {/* Category Filter */}
        <ToggleButtonGroup>
          {categories.slice(0, 5).map((category, index) => (
            <React.Fragment key={category.slug}>
              {index > 0 && <Divider />}
              <ToggleButton
                active={activeCategory === category.slug}
                onClick={() => setActiveCategory(category.slug)}
              >
                {category.name.toUpperCase()}
              </ToggleButton>
            </React.Fragment>
          ))}
        </ToggleButtonGroup>

        {/* Blog Posts */}
        <CardContainer
          key={activeCategory}
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: false, amount: 0.1 }}
        >
          {filteredPosts.length > 0 ? (
            filteredPosts.map((post, index) => (
              <motion.div
                key={post.id}
                variants={cardVariants}
                custom={index}
              >
                <BlogCard post={post} />
              </motion.div>
            ))
          ) : (
            <ErrorMessage>
              <span>No posts found in this category.</span>
            </ErrorMessage>
          )}
        </CardContainer>

        {/* View All Button */}
        {posts.length > 0 && (
          <ViewAllButton
            onClick={handleViewAll}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            View All Posts
          </ViewAllButton>
        )}
      </Wrapper>
    </Container>
  );
};

export default Blog; 