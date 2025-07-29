import React, { useState } from "react";
import styled from "styled-components";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { CalendarToday, Schedule, Visibility } from "@mui/icons-material";

const Card = styled(motion.div)`
  width: 330px;
  height: 490px;
  background-color: ${({ theme }) => theme.card};
  border-radius: 10px;
  box-shadow: 0 0 12px 4px rgba(0, 0, 0, 0.4);
  overflow: hidden;
  padding: 26px 20px;
  display: flex;
  flex-direction: column;
  gap: 14px;
  cursor: pointer;
  position: relative;


  @media (max-width: 768px) {
    max-width: 400px;
    padding: 20px 16px;
    height: 480px;
  }
`;

const Image = styled.img`
  width: 100%;
  height: 180px;
  background-color: ${({ theme }) => theme.white};
  border-radius: 10px;
  box-shadow: 0 0 16px 2px rgba(0,0,0,0.3);
`;

const Tags = styled.div`
  width: 100%;
  display: flex;
  align-items: center;
  flex-wrap: wrap;
  gap: 8px;
  margin-top: 4px;
`;

const Tag = styled.span`
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
  font-size: 18px;
  font-weight: 600;
  color: ${({ theme }) => theme.text_primary};
  overflow: hidden;
  display: -webkit-box;
  max-width: 100%;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  text-overflow: ellipsis;
  line-height: 1.4;
`;

const Header = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 8px;
  margin-bottom: 12px;
`;

const Category = styled.div`
  font-size: 14px;
  font-weight: 400;
  color: ${({ theme }) => theme.primary};
  text-transform: capitalize;
`;

const DateText = styled.div`
  font-size: 12px;
  font-weight: 300;
  color: ${({ theme }) => theme.text_secondary + 80};
`;

const Description = styled.div`
  font-weight: 400;
  color: ${({ theme }) => theme.text_secondary + 99};
  overflow: hidden;
  margin-top: 8px;
  display: -webkit-box;
  max-width: 100%;
  -webkit-line-clamp: 3;
  -webkit-box-orient: vertical;
  text-overflow: ellipsis;
  line-height: 1.4;
  font-size: 14px;
`;

const MetaInfo = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-top: auto;
  padding-top: 12px;
  border-top: 1px solid ${({ theme }) => theme.text_secondary + 20};
`;

const MetaItem = styled.div`
  display: flex;
  align-items: center;
  gap: 4px;
  font-size: 12px;
  color: ${({ theme }) => theme.text_secondary};
  
  svg {
    font-size: 14px;
  }
`;

const AIBadge = styled.div`
  position: absolute;
  top: 10px;
  right: 10px;
  background: ${({ theme }) => theme.primary + 90};
  color: ${({ theme }) => theme.text_primary};
  padding: 4px 8px;
  border-radius: 12px;
  font-size: 10px;
  font-weight: 500;
  backdrop-filter: blur(10px);
  border: 1px solid ${({ theme }) => theme.primary + 50};
  z-index: 10;
`;

const BlogCard = ({ post }) => {
  const navigate = useNavigate();

  // State for image loading (must be called before any conditional returns)
  const [imageError, setImageError] = useState(false);
  const [imageLoaded, setImageLoaded] = useState(false);

  // Safety check for post object
  if (!post) {
    return null;
  }

  // Format date
  const formatDate = (dateString) => {
    if (!dateString) return 'No date';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      year: 'numeric', 
      month: 'short', 
      day: 'numeric' 
    });
  };

  // Format category name
  const formatCategory = (category) => {
    if (!category) return 'General';
    return category.replace('-', ' ').replace(/\b\w/g, l => l.toUpperCase());
  };

  // Handle card click
  const handleClick = () => {
    navigate(`/blog/${post.slug || ''}`);
  };

  return (
    <Card
      onClick={handleClick}
      whileHover={{
        y: -10,
        boxShadow: "0 0 50px 4px rgba(0, 0, 0, 0.6)",
        filter: "brightness(1.1)",
        transition: { duration: 0.3, ease: "easeOut" }
      }}
      whileTap={{ scale: 0.98 }}
      initial={{ opacity: 0, y: 50 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      {/* AI Generated Badge */}
      {post.generated_by_ai && (
        <AIBadge>
          AI Generated
        </AIBadge>
      )}

      {/* Blog Image */}
      <Image src={post.featured_image} />

      <Details>
        <Header>
          <Category>{formatCategory(post.category)}</Category>
          <DateText>{formatDate(post.published_at || post.created_at)}</DateText>
        </Header>
        
        <Title>{post.title}</Title>
        
        {/* Description/Excerpt */}
        <Description>
          {post.excerpt || post.content?.substring(0, 150) + '...'}
        </Description>

        {/* Tags */}
        {post.tags && post.tags.length > 0 && (
          <Tags>
            {post.tags.slice(0, 2).map((tag, index) => (
              <Tag key={index}>{tag}</Tag>
            ))}
            {post.tags.length > 2 && (
              <Tag>+{post.tags.length - 2}</Tag>
            )}
          </Tags>
        )}
      </Details>

      {/* Meta Information */}
      <MetaInfo>
        <MetaItem>
          <Schedule />
          <span>{post.reading_time || 5} min read</span>
        </MetaItem>
        
        <MetaItem>
          <Visibility />
          <span>{post.views || 0} views</span>
        </MetaItem>
      </MetaInfo>

    </Card>
  );
};

export default BlogCard; 