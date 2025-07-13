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
  transition: all 0.5s ease-in-out;
  cursor: pointer;
  position: relative;

  &:hover {
    transform: translateY(-10px);
    box-shadow: 0 0 50px 4px rgba(0, 0, 0, 0.6);
    filter: brightness(1.1);
  }

  @media (max-width: 768px) {
    max-width: 400px;
    padding: 20px 16px;
    height: 480px;
  }
`;

const Image = styled.div`
  width: 100%;
  height: 180px;
  background: ${({ theme }) => `linear-gradient(135deg, ${theme.primary}20, ${theme.primary}05)`};
  border-radius: 10px;
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;
  overflow: hidden;
  
  ${({ $hasImage, $imageUrl }) => $hasImage && `
    background-image: url(${$imageUrl});
    background-size: cover;
    background-position: center;
  `}
`;

const ImagePlaceholder = styled.div`
  font-size: 48px;
  color: ${({ theme }) => theme.primary};
  opacity: 0.7;
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
  font-size: 20px;
  font-weight: 600;
  color: ${({ theme }) => theme.text_primary};
  overflow: hidden;
  display: -webkit-box;
  max-width: 100%;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  text-overflow: ellipsis;
  line-height: 1.3;
`;

const Category = styled.div`
  font-size: 14px;
  margin-left: 2px;
  font-weight: 400;
  color: ${({ theme }) => theme.primary};
  margin-bottom: 8px;
  text-transform: capitalize;
`;

const DateText = styled.div`
  font-size: 12px;
  margin-left: 2px;
  font-weight: 300;
  color: ${({ theme }) => theme.text_secondary + 80};
  margin-bottom: 10px;
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

const ReadMoreButton = styled.div`
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  background: linear-gradient(transparent, ${({ theme }) => theme.card});
  padding: 30px 20px 20px;
  text-align: center;
  opacity: 0;
  transition: all 0.3s ease;
  
  ${Card}:hover & {
    opacity: 1;
  }
`;

const ReadMore = styled.span`
  color: ${({ theme }) => theme.primary};
  font-weight: 500;
  font-size: 14px;
  text-decoration: underline;
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
      whileHover={{ scale: 1.02 }}
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
      <Image $hasImage={!!post.featured_image && !imageError} $imageUrl={post.featured_image}>
        {(!post.featured_image || imageError) && (
          <ImagePlaceholder>
            📝
          </ImagePlaceholder>
        )}
        {post.featured_image && !imageError && (
          <img
            src={post.featured_image}
            alt={post.title}
            style={{
              width: '100%',
              height: '100%',
              objectFit: 'cover',
              borderRadius: '10px',
              opacity: imageLoaded ? 1 : 0,
              transition: 'opacity 0.3s ease'
            }}
            onLoad={() => setImageLoaded(true)}
            onError={() => setImageError(true)}
          />
        )}
      </Image>

      <Details>
        {/* Category */}
        <Category>{formatCategory(post.category)}</Category>
        
        {/* Date */}
        <DateText>{formatDate(post.published_at || post.created_at)}</DateText>
        
        {/* Title */}
        <Title>{post.title}</Title>
        
        {/* Description/Excerpt */}
        <Description>
          {post.excerpt || post.content?.substring(0, 150) + '...'}
        </Description>

        {/* Tags */}
        {post.tags && post.tags.length > 0 && (
          <Tags>
            {post.tags.slice(0, 3).map((tag, index) => (
              <Tag key={index}>{tag}</Tag>
            ))}
            {post.tags.length > 3 && (
              <Tag>+{post.tags.length - 3}</Tag>
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

      {/* Read More Overlay */}
      <ReadMoreButton>
        <ReadMore>Read Full Article →</ReadMore>
      </ReadMoreButton>
    </Card>
  );
};

export default BlogCard; 