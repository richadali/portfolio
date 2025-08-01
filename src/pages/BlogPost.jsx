import React, { useState, useEffect } from "react";
import styled from "styled-components";
import { motion } from "framer-motion";
import { useParams, useNavigate } from "react-router-dom";
import { ArrowBack, Schedule, Visibility, Share } from "@mui/icons-material";
import ReactMarkdown from 'react-markdown';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { vscDarkPlus } from 'react-syntax-highlighter/dist/esm/styles/prism';
import remarkGfm from 'remark-gfm';
import BlogCard from "../components/cards/BlogCard";
import SEO from "../components/SEO";

const Container = styled.div`
  min-height: 100vh;
  background: ${({ theme }) => theme.bg};
  padding: 40px 16px 50px;
`;

const Wrapper = styled.div`
  max-width: 1000px;
  margin: 0 auto;
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

const Article = styled.article`
  background: ${({ theme }) => theme.card};
  border-radius: 12px;
  padding: 40px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.3);
  margin-bottom: 50px;
  
  @media (max-width: 768px) {
    padding: 24px 16px;
  }
`;

const Header = styled.div`
  margin-bottom: 30px;
  text-align: center;
`;

const Category = styled.div`
  display: inline-block;
  background: ${({ theme }) => theme.primary + 20};
  color: ${({ theme }) => theme.primary};
  padding: 6px 16px;
  border-radius: 20px;
  font-size: 14px;
  font-weight: 500;
  margin-bottom: 20px;
  text-transform: capitalize;
`;

const Title = styled.h1`
  font-size: 40px;
  font-weight: 700;
  color: ${({ theme }) => theme.text_primary};
  line-height: 1.2;
  margin-bottom: 20px;
  
  @media (max-width: 768px) {
    font-size: 30px;
  }
`;

const MetaInfo = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 30px;
  margin-bottom: 30px;
  flex-wrap: wrap;
  
  @media (max-width: 768px) {
    gap: 16px;
  }
`;

const MetaItem = styled.div`
  display: flex;
  align-items: center;
  gap: 6px;
  color: ${({ theme }) => theme.text_secondary};
  font-size: 13px;
  
  svg {
    font-size: 18px;
  }
`;

const DateText = styled.time`
  font-size: 16px;
  color: ${({ theme }) => theme.text_secondary};
  text-align: center;
  display: block;
  margin-bottom: 20px;
`;

const Tags = styled.div`
  display: flex;
  justify-content: center;
  gap: 10px;
  flex-wrap: wrap;
  margin-bottom: 30px;
`;

const Tag = styled.span`
  background: ${({ theme }) => theme.primary + 15};
  color: ${({ theme }) => theme.primary};
  padding: 4px 12px;
  border-radius: 16px;
  font-size: 11px;
  font-weight: 500;
`;

const Content = styled.div`
  color: ${({ theme }) => theme.text_primary};
  line-height: 1.8;
  font-size: 16px;
  
  h1, h2, h3, h4, h5, h6 {
    color: ${({ theme }) => theme.text_primary};
    margin: 30px 0 20px 0;
    font-weight: 600;
  }
  
  h1 { font-size: 36px; }
  h2 { font-size: 28px; }
  h3 { font-size: 24px; }
  h4 { font-size: 20px; }
  
  p {
    margin-bottom: 20px;
    text-align: left;
  }
  
  ul, ol {
    margin: 20px 0;
    padding-left: 30px;
    
    li {
      margin-bottom: 10px;
    }
  }
  
  blockquote {
    border-left: 4px solid ${({ theme }) => theme.primary};
    padding: 20px;
    margin: 30px 0;
    background: ${({ theme }) => theme.primary + 10};
    border-radius: 0 8px 8px 0;
    font-style: italic;
  }
  
  
  a {
    color: ${({ theme }) => theme.primary};
    text-decoration: underline;
    
    &:hover {
      opacity: 0.8;
    }
  }
  
  img {
    max-width: 100%;
    height: auto;
    border-radius: 8px;
    margin: 20px 0;
  }
  
  @media (max-width: 768px) {
    font-size: 16px;
    
    h1 { font-size: 26px; }
    h2 { font-size: 22px; }
    h3 { font-size: 18px; }
    h4 { font-size: 16px; }
  }
`;

const ShareSection = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 15px;
  margin: 40px 0;
  padding: 20px;
  background: ${({ theme }) => theme.bgLight};
  border-radius: 12px;
  border: 1px solid ${({ theme }) => theme.primary + 20};
`;

const ShareButton = styled.button`
  display: flex;
  align-items: center;
  gap: 8px;
  background: ${({ theme }) => theme.primary + 20};
  color: ${({ theme }) => theme.primary};
  border: 1px solid ${({ theme }) => theme.primary + 30};
  padding: 10px 15px;
  border-radius: 8px;
  cursor: pointer;
  font-size: 14px;
  transition: all 0.3s ease;
  
  &:hover {
    background: ${({ theme }) => theme.primary};
    color: ${({ theme }) => theme.text_primary};
  }
`;

const RelatedSection = styled.div`
  margin-top: 60px;
`;

const RelatedTitle = styled.h3`
  font-size: 32px;
  font-weight: 600;
  color: ${({ theme }) => theme.text_primary};
  text-align: center;
  margin-bottom: 40px;
`;

const RelatedPosts = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 30px;
  justify-items: center;
  
  @media (max-width: 768px) {
    grid-template-columns: 1fr;
    gap: 20px;
  }
`;

const LoadingContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 60vh;
  gap: 15px;
`;

const LoadingSpinner = styled(motion.div)`
  width: 40px;
  height: 40px;
  border: 3px solid ${({ theme }) => theme.primary + 30};
  border-top: 3px solid ${({ theme }) => theme.primary};
  border-radius: 50%;
`;

const ErrorMessage = styled.div`
  text-align: center;
  padding: 100px 20px;
  color: ${({ theme }) => theme.text_secondary};
  font-size: 18px;
`;

const BlogPost = () => {
  const { slug } = useParams();
  const navigate = useNavigate();
  const [post, setPost] = useState(null);
  const [relatedPosts, setRelatedPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (slug) {
      fetchPost();
    }
  }, [slug]);

  const fetchPost = async () => {
    try {
      setLoading(true);
      setError(null);

      const baseURL = process.env.NODE_ENV === 'production' 
        ? 'https://richadali.dev' 
        : 'http://localhost:3001';

      const response = await fetch(`${baseURL}/api/blog/${slug}`);
      
      if (!response.ok) {
        if (response.status === 404) {
          setError('Blog post not found');
        } else {
          setError('Failed to load blog post');
        }
        return;
      }

      const data = await response.json();
      setPost(data.data.post);
      setRelatedPosts(data.data.related_posts || []);

    } catch (err) {
      console.error('Error fetching post:', err);
      setError('Failed to load blog post. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    });
  };

  const formatCategory = (category) => {
    return category.replace('-', ' ').replace(/\b\w/g, l => l.toUpperCase());
  };

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: post.title,
          text: post.excerpt,
          url: window.location.href,
        });
      } catch (err) {
        console.log('Error sharing:', err);
      }
    } else {
      // Fallback: copy to clipboard
      navigator.clipboard.writeText(window.location.href);
      alert('Link copied to clipboard!');
    }
  };


  if (loading) {
    return (
      <Container>
        <Wrapper>
          <LoadingContainer>
            <LoadingSpinner
              animate={{ rotate: 360 }}
              transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
            />
            <span style={{ color: '#854CE6' }}>Loading article...</span>
          </LoadingContainer>
        </Wrapper>
      </Container>
    );
  }

  if (error || !post) {
    return (
      <Container>
        <Wrapper>
          <BackButton onClick={() => navigate('/blog')}>
            <ArrowBack />
            Back to Blog
          </BackButton>
          <ErrorMessage>
            {error || 'Post not found'}
          </ErrorMessage>
        </Wrapper>
      </Container>
    );
  }

  return (
    <Container>
      <SEO
        title={post.meta_title || post.title}
        description={post.meta_description || post.excerpt}
        image={post.featured_image}
        url={`https://richadali.dev/blog/${post.slug}`}
        type="article"
      />
      <Wrapper>
        <BackButton onClick={() => navigate('/blog')}>
          <ArrowBack />
          Back to Blog
        </BackButton>

        <Article>
          <Header>
            <Category>{formatCategory(post.category)}</Category>
            <Title>{post.title}</Title>
            <DateText>{formatDate(post.published_at || post.created_at)}</DateText>
            
            <MetaInfo>
              <MetaItem>
                <Schedule />
                <span>{post.reading_time} min read</span>
              </MetaItem>
              <MetaItem>
                <Visibility />
                <span>{post.views} views</span>
              </MetaItem>
            </MetaInfo>

            {post.tags && post.tags.length > 0 && (
              <Tags>
                {post.tags.map((tag, index) => (
                  <Tag key={index}>{tag}</Tag>
                ))}
              </Tags>
            )}
          </Header>

          <Content>
            <ReactMarkdown
              remarkPlugins={[remarkGfm]}
              components={{
                code({ node, inline, className, children, ...props }) {
                  const match = /language-(\w+)/.exec(className || '');
                  return !inline && match ? (
                    <SyntaxHighlighter
                      style={vscDarkPlus}
                      language={match[1]}
                      PreTag="div"
                      {...props}
                    >
                      {String(children).replace(/\n$/, '')}
                    </SyntaxHighlighter>
                  ) : (
                    <code className={className} {...props}>
                      {children}
                    </code>
                  );
                },
              }}
            >
              {post.content}
            </ReactMarkdown>
          </Content>

          <ShareSection>
            <ShareButton onClick={handleShare}>
              <Share />
              Share Article
            </ShareButton>
          </ShareSection>
        </Article>

        {/* Related Posts */}
        {relatedPosts.length > 0 && (
          <RelatedSection>
            <RelatedTitle>Related Articles</RelatedTitle>
            <RelatedPosts>
              {relatedPosts.map((relatedPost) => (
                <motion.div
                  key={relatedPost.id}
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5 }}
                >
                  <BlogCard post={relatedPost} />
                </motion.div>
              ))}
            </RelatedPosts>
          </RelatedSection>
        )}
      </Wrapper>
    </Container>
  );
};

export default BlogPost; 