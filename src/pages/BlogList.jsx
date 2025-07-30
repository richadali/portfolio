import React, { useState, useEffect } from "react";
import styled from "styled-components";
import { motion } from "framer-motion";
import BlogCard from "../components/cards/BlogCard";
import { Search, FilterList, ArrowBack, ArrowDropDown } from "@mui/icons-material";
import { useNavigate } from "react-router-dom";

const Container = styled.div`
  min-height: 100vh;
  background: ${({ theme }) => theme.bg};
  padding: 40px 16px 50px;
`;

const Wrapper = styled.div`
  max-width: 1200px;
  margin: 0 auto;
`;

const Header = styled.div`
  text-align: center;
  margin-bottom: 50px;
`;

const BackButton = styled.button`
  display: flex;
  align-items: center;
  gap: 8px;
  background: transparent;
  border: 1px solid ${({ theme }) => theme.primary};
  color: ${({ theme }) => theme.primary};
  padding: 10px 20px;
  border-radius: 8px;
  cursor: pointer;
  margin-bottom: 30px;
  transition: all 0.3s ease;
  
  &:hover {
    background: ${({ theme }) => theme.primary + 20};
    transform: translateX(-5px);
  }
`;

const Title = styled.h1`
  font-size: 48px;
  font-weight: 600;
  color: ${({ theme }) => theme.text_primary};
  margin-bottom: 15px;
  
  @media (max-width: 768px) {
    font-size: 30px;
  }
`;

const Subtitle = styled.p`
  font-size: 18px;
  color: ${({ theme }) => theme.text_secondary};
  @media (max-width: 768px) {
    font-size: 16px;
  }
  max-width: 600px;
  margin: 0 auto;
  line-height: 1.6;
`;

const FilterSection = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 20px;
  margin-bottom: 40px;
  align-items: center;
  justify-content: space-between;
  
  @media (max-width: 768px) {
    flex-direction: column;
    align-items: stretch;
    gap: 15px;
  }
`;

const SearchContainer = styled.div`
  position: relative;
  flex: 1;
  max-width: 400px;
  
  @media (max-width: 768px) {
    max-width: 100%;
  }
`;

const SearchInput = styled.input`
  width: 100%;
  padding: 12px 40px 12px 15px;
  border: 1px solid ${({ theme }) => theme.primary + 50};
  border-radius: 8px;
  background: ${({ theme }) => theme.card};
  color: ${({ theme }) => theme.text_primary};
  font-size: 15px;
  
  &:focus {
    outline: none;
    border-color: ${({ theme }) => theme.primary};
    box-shadow: 0 0 0 2px ${({ theme }) => theme.primary + 30};
  }
  
  &::placeholder {
    color: ${({ theme }) => theme.text_secondary};
  }
`;

const SearchIcon = styled(Search)`
  position: absolute;
  right: 12px;
  top: 50%;
  transform: translateY(-50%);
  color: ${({ theme }) => theme.text_secondary};
  cursor: pointer;
`;

const FilterContainer = styled.div`
  display: flex;
  gap: 15px;
  align-items: center;
  flex-wrap: wrap;

  @media (max-width: 768px) {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 10px;
    width: 100%;
  }
`;

const SelectWrapper = styled.div`
  position: relative;
  display: flex;
  align-items: center;
`;

const DropdownArrow = styled(ArrowDropDown)`
  position: absolute;
  right: 8px;
  top: 50%;
  transform: translateY(-50%);
  color: ${({ theme }) => theme.text_secondary};
  pointer-events: none;
`;

const CategoryFilter = styled.select`
  width: 100%;
  padding: 10px 30px 10px 15px;
  border: 1px solid ${({ theme }) => theme.primary + 50};
  border-radius: 8px;
  background: ${({ theme }) => theme.card};
  color: ${({ theme }) => theme.text_primary};
  font-size: 13px;
  cursor: pointer;
  appearance: none;
  -webkit-appearance: none;
  -moz-appearance: none;
  
  &:focus {
    outline: none;
    border-color: ${({ theme }) => theme.primary};
  }
  
  option {
    background: ${({ theme }) => theme.card};
    color: ${({ theme }) => theme.text_primary};
  }

  @media (max-width: 768px) {
    font-size: 12px;
  }
`;

const SortFilter = styled.select`
  width: 100%;
  padding: 10px 30px 10px 15px;
  border: 1px solid ${({ theme }) => theme.primary + 50};
  border-radius: 8px;
  background: ${({ theme }) => theme.card};
  color: ${({ theme }) => theme.text_primary};
  font-size: 13px;
  cursor: pointer;
  appearance: none;
  -webkit-appearance: none;
  -moz-appearance: none;
  
  &:focus {
    outline: none;
    border-color: ${({ theme }) => theme.primary};
  }
  
  option {
    background: ${({ theme }) => theme.card};
    color: ${({ theme }) => theme.text_primary};
  }

  @media (max-width: 768px) {
    font-size: 12px;
  }
`;

const StatsBar = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 30px;
  padding: 15px 20px;
  background: ${({ theme }) => theme.card + 50};
  border-radius: 8px;
  border: 1px solid ${({ theme }) => theme.primary + 20};
`;

const ResultsInfo = styled.div`
  color: ${({ theme }) => theme.text_secondary};
  font-size: 14px;
`;

const LoadingContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 100px 0;
  gap: 15px;
`;

const LoadingSpinner = styled(motion.div)`
  width: 40px;
  height: 40px;
  border: 3px solid ${({ theme }) => theme.primary + 30};
  border-top: 3px solid ${({ theme }) => theme.primary};
  border-radius: 50%;
`;

const PostsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(330px, 1fr));
  gap: 30px;
  margin-bottom: 50px;
  
  @media (max-width: 768px) {
    grid-template-columns: 1fr;
    gap: 20px;
    justify-items: center;
  }
`;

const Pagination = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 10px;
  margin-top: 50px;
`;

const PageButton = styled.button`
  padding: 8px 12px;
  border: 1px solid ${({ theme }) => theme.primary + 50};
  background: ${({ active, theme }) => active ? theme.primary : 'transparent'};
  color: ${({ active, theme }) => active ? theme.text_primary : theme.primary};
  border-radius: 6px;
  cursor: pointer;
  transition: all 0.3s ease;
  
  &:hover {
    background: ${({ theme }) => theme.primary + (props => props.active ? '' : '20')};
  }
  
  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
`;

const ErrorMessage = styled.div`
  text-align: center;
  padding: 50px 20px;
  color: ${({ theme }) => theme.text_secondary};
  font-size: 18px;
`;

const NoResults = styled.div`
  text-align: center;
  padding: 100px 20px;
  color: ${({ theme }) => theme.text_secondary};
`;

const BlogList = () => {
  const navigate = useNavigate();
  const [posts, setPosts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [pagination, setPagination] = useState({});
  
  // Filter states
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");
  const [sortBy, setSortBy] = useState("published_at");
  const [sortOrder, setSortOrder] = useState("DESC");
  const [currentPage, setCurrentPage] = useState(1);

  useEffect(() => {
    fetchPosts();
  }, [currentPage, selectedCategory, sortBy, sortOrder, searchTerm]);

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchPosts = async () => {
    try {
      setLoading(true);
      setError(null);

      const baseURL = process.env.NODE_ENV === 'production' 
        ? 'https://richadali.dev' 
        : 'http://localhost:3001';

      const params = new URLSearchParams({
        page: currentPage,
        limit: 12,
        sortBy,
        sortOrder
      });

      if (selectedCategory) {
        params.append('category', selectedCategory);
      }
      if (searchTerm) {
        params.append('search', searchTerm);
      }

      const response = await fetch(`${baseURL}/api/blog?${params}`);
      
      if (!response.ok) {
        throw new Error('Failed to fetch posts');
      }

      const data = await response.json();
      setPosts(data.data.posts);
      setPagination(data.data.pagination);

    } catch (err) {
      console.error('Error fetching posts:', err);
      setError('Failed to load blog posts. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const fetchCategories = async () => {
    try {
      const baseURL = process.env.NODE_ENV === 'production' 
        ? 'https://richadali.dev' 
        : 'http://localhost:3001';
        
      const response = await fetch(`${baseURL}/api/blog/categories`);
      if (response.ok) {
        const data = await response.json();
        setCategories(data.data);
      }
    } catch (err) {
      console.error('Error fetching categories:', err);
    }
  };


  const handlePageChange = (page) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleCategoryChange = (category) => {
    setSelectedCategory(category);
    setCurrentPage(1);
    setSearchTerm("");
  };

  const handleSortChange = (newSortBy) => {
    setSortBy(newSortBy);
    setCurrentPage(1);
  };

  const renderPagination = () => {
    if (!pagination.total_pages || pagination.total_pages <= 1) return null;

    const pages = [];
    const maxVisible = 5;
    const start = Math.max(1, pagination.current_page - Math.floor(maxVisible / 2));
    const end = Math.min(pagination.total_pages, start + maxVisible - 1);

    // Previous button
    pages.push(
      <PageButton
        key="prev"
        onClick={() => handlePageChange(pagination.current_page - 1)}
        disabled={pagination.current_page === 1}
      >
        Previous
      </PageButton>
    );

    // Page numbers
    for (let i = start; i <= end; i++) {
      pages.push(
        <PageButton
          key={i}
          active={i === pagination.current_page}
          onClick={() => handlePageChange(i)}
        >
          {i}
        </PageButton>
      );
    }

    // Next button
    pages.push(
      <PageButton
        key="next"
        onClick={() => handlePageChange(pagination.current_page + 1)}
        disabled={pagination.current_page === pagination.total_pages}
      >
        Next
      </PageButton>
    );

    return pages;
  };

  if (error) {
    return (
      <Container>
        <Wrapper>
          <ErrorMessage>{error}</ErrorMessage>
        </Wrapper>
      </Container>
    );
  }

  return (
    <Container>
      <Wrapper>
        <BackButton onClick={() => navigate('/')}>
          <ArrowBack />
          Back to Home
        </BackButton>

        <Header>
          <Title>Blog</Title>
          <Subtitle>
            Explore insights, tutorials, and thoughts on modern web development, 
            AI, and technology. Fresh content updated regularly.
          </Subtitle>
        </Header>

        <FilterSection>
          <SearchContainer>
            <SearchInput
              type="text"
              placeholder="Search articles..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <SearchIcon />
          </SearchContainer>

          <FilterContainer>
            <SelectWrapper>
              <CategoryFilter
                value={selectedCategory}
                onChange={(e) => handleCategoryChange(e.target.value)}
              >
                <option value="">All Categories</option>
                {categories.map((category) => (
                  <option key={category.slug} value={category.slug}>
                    {category.name} ({category.post_count})
                  </option>
                ))}
              </CategoryFilter>
              <DropdownArrow />
            </SelectWrapper>
            <SelectWrapper>
              <SortFilter
                value={sortBy}
                onChange={(e) => handleSortChange(e.target.value)}
              >
                <option value="published_at">Latest</option>
                <option value="views">Most Popular</option>
                <option value="title">Title A-Z</option>
                <option value="reading_time">Reading Time</option>
              </SortFilter>
              <DropdownArrow />
            </SelectWrapper>
          </FilterContainer>
        </FilterSection>

        {!loading && (
          <StatsBar>
            <ResultsInfo>
              {searchTerm ? (
                `Found ${posts.length} results for "${searchTerm}"`
              ) : (
                `Showing ${posts.length} of ${pagination.total_posts || 0} articles`
              )}
            </ResultsInfo>
          </StatsBar>
        )}

        {loading ? (
          <LoadingContainer>
            <LoadingSpinner
              animate={{ rotate: 360 }}
              transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
            />
            <span style={{ color: '#854CE6' }}>Loading articles...</span>
          </LoadingContainer>
        ) : posts.length > 0 ? (
          <>
            <PostsGrid>
              {posts.map((post, index) => (
                <motion.div
                  key={post.id}
                  initial={{ opacity: 0, y: 50 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                >
                  <BlogCard post={post} />
                </motion.div>
              ))}
            </PostsGrid>

            <Pagination>
              {renderPagination()}
            </Pagination>
          </>
        ) : (
          <NoResults>
            <h3>No articles found</h3>
            <p>Try adjusting your search criteria or browse different categories.</p>
          </NoResults>
        )}
      </Wrapper>
    </Container>
  );
};

export default BlogList; 