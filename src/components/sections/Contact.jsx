import React, { useState } from "react";
import styled, { keyframes } from "styled-components";

const Container = styled.div`
  display: flex;
  justify-content: center;
  gap: 12px;
  z-index: 1;
  align-items: center;
  padding-top: 60px;
  @media (max-width: 960px) {
    padding: 40px 20px 0;
  }
`;

const Wrapper = styled.div`
  position: relative;
  display: flex;
  justify-content: space-between;
  align-items: center;
  flex-direction: column;
  width: 100%;
  max-width: 1350px;
  padding: 0px 0px 80px 0px;
  gap: 12px;
  @media (max-width: 960px) {
    flex-direction: column;
  }
`;

const DecorativeBackground = styled.div`
  position: absolute;
  width: 500px;
  height: 500px;
  border-radius: 50%;
  background: linear-gradient(
    180deg,
    rgba(123, 67, 151, 0.2) 0%,
    rgba(175, 75, 187, 0.1) 100%
  );
  filter: blur(80px);
  z-index: -1;
  opacity: 0.5;
  pointer-events: none;
  @media (max-width: 768px) {
    width: 300px;
    height: 300px;
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
  max-width: 700px;
  color: ${({ theme }) => theme.text_secondary};
  line-height: 1.6;
  @media (max-width: 768px) {
    margin-top: 12px;
    font-size: 16px;
    padding: 0 10px;
  }
`;

const ContactInfo = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: center;
  margin: 20px 0;
  gap: 30px;
  @media (max-width: 768px) {
    flex-direction: column;
    gap: 15px;
  }
`;

const ContactItem = styled.a`
  display: flex;
  align-items: center;
  gap: 10px;
  font-size: 16px;
  color: ${({ theme }) => theme.text_primary};
  text-decoration: none;
  transition: all 0.3s ease;
  padding: 8px 16px;
  border-radius: 25px;
  border: 1px solid transparent;
  
  &:hover {
    color: ${({ theme }) => theme.primary};
    border: 1px solid ${({ theme }) => theme.primary};
    background: rgba(123, 67, 151, 0.1);
    transform: translateY(-2px);
  }
`;

const ContactFormContainer = styled.div`
  width: 100%;
  max-width: 650px;
  margin-top: 40px;
  @media (max-width: 768px) {
    padding: 0 10px;
  }
`;

const ContactForm = styled.form`
  width: 100%;
  display: flex;
  flex-direction: column;
  background: rgba(17, 25, 40, 0.9);
  backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 255, 255, 0.15);
  padding: 40px;
  border-radius: 20px;
  box-shadow: 
    rgba(23, 92, 230, 0.15) 0px 8px 32px,
    rgba(123, 67, 151, 0.1) 0px 4px 16px;
  gap: 20px;
  position: relative;
  overflow: hidden;
  
  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    height: 2px;
    background: linear-gradient(
      90deg,
      ${({ theme }) => theme.primary} 0%,
      rgba(175, 75, 187, 1) 100%
    );
  }
  
  @media (max-width: 768px) {
    padding: 25px 20px;
    border-radius: 16px;
    backdrop-filter: none;
    background: rgba(17, 25, 40, 0.95);
    box-shadow: rgba(23, 92, 230, 0.1) 0px 4px 16px;
  }
`;

const ContactTitle = styled.div`
  font-size: 28px;
  margin-bottom: 5px;
  font-weight: 600;
  color: ${({ theme }) => theme.text_primary};
  text-align: center;
  
  @media (max-width: 768px) {
    font-size: 24px;
  }
`;

const ContactSubtitle = styled.div`
  font-size: 16px;
  color: ${({ theme }) => theme.text_secondary};
  text-align: center;
  margin-bottom: 10px;
  line-height: 1.5;
`;

const InputGroup = styled.div`
  display: flex;
  gap: 20px;
  
  @media (max-width: 768px) {
    flex-direction: column;
    gap: 16px;
  }
`;

const InputWrapper = styled.div`
  position: relative;
  flex: 1;
`;

const ContactInput = styled.input`
  width: 100%;
  background: rgba(255, 255, 255, 0.05);
  border: 2px solid rgba(255, 255, 255, 0.1);
  outline: none;
  font-size: 16px;
  color: ${({ theme }) => theme.text_primary};
  border-radius: 12px;
  padding: 16px;
  transition: all 0.3s ease;
  font-family: inherit;
  
  &::placeholder {
    color: ${({ theme }) => theme.text_secondary};
    opacity: 0.7;
  }
  
  &:hover:not(:focus) {
    border: 2px solid rgba(255, 255, 255, 0.2);
  }
  
  &:focus {
    border: 2px solid ${({ theme }) => theme.primary};
    background: rgba(255, 255, 255, 0.08);
    box-shadow: 0 0 0 3px rgba(123, 67, 151, 0.1);
    
    &::placeholder {
      opacity: 0.5;
    }
  }
  
  @media (max-width: 768px) {
    transition: border-color 0.2s ease;
    
    &:focus {
      box-shadow: none;
      transform: none;
    }
    
    &:hover:not(:focus) {
      border: 2px solid rgba(255, 255, 255, 0.1);
    }
  }
`;

const ContactInputMessage = styled.textarea`
  width: 100%;
  background: rgba(255, 255, 255, 0.05);
  border: 2px solid rgba(255, 255, 255, 0.1);
  outline: none;
  font-size: 16px;
  color: ${({ theme }) => theme.text_primary};
  border-radius: 12px;
  padding: 16px;
  transition: all 0.3s ease;
  font-family: inherit;
  resize: vertical;
  min-height: 120px;
  
  &::placeholder {
    color: ${({ theme }) => theme.text_secondary};
    opacity: 0.7;
  }
  
  &:hover:not(:focus) {
    border: 2px solid rgba(255, 255, 255, 0.2);
  }
  
  &:focus {
    border: 2px solid ${({ theme }) => theme.primary};
    background: rgba(255, 255, 255, 0.08);
    box-shadow: 0 0 0 3px rgba(123, 67, 151, 0.1);
    
    &::placeholder {
      opacity: 0.5;
    }
  }
  
  @media (max-width: 768px) {
    transition: border-color 0.2s ease;
    
    &:focus {
      box-shadow: none;
      transform: none;
    }
    
    &:hover:not(:focus) {
      border: 2px solid rgba(255, 255, 255, 0.1);
    }
  }
`;

const buttonAnimation = keyframes`
  0% { transform: scale(1); }
  50% { transform: scale(1.02); }
  100% { transform: scale(1); }
`;

const ContactButton = styled.button`
  width: 100%;
  text-decoration: none;
  text-align: center;
  background: linear-gradient(
    135deg,
    hsla(271, 100%, 50%, 1) 0%,
    hsla(294, 100%, 50%, 1) 50%,
    hsla(271, 100%, 50%, 1) 100%
  );
  background-size: 200% 200%;
  padding: 16px 24px;
  margin-top: 10px;
  border-radius: 12px;
  border: none;
  color: white;
  font-size: 16px;
  font-weight: 600;
  font-family: inherit;
  cursor: pointer;
  transition: all 0.3s ease;
  position: relative;
  overflow: hidden;
  
  &:hover:not(:disabled) {
    transform: translateY(-2px);
    box-shadow: 
      0 8px 25px rgba(123, 67, 151, 0.3),
      0 4px 12px rgba(175, 75, 187, 0.2);
    animation: ${buttonAnimation} 0.6s ease;
  }
  
  &:active:not(:disabled) {
    transform: translateY(0px);
  }
  
  &:disabled {
    opacity: 0.7;
    cursor: not-allowed;
    background: linear-gradient(135deg, #666, #888);
  }
  
  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: -100%;
    width: 100%;
    height: 100%;
    background: linear-gradient(
      90deg,
      transparent,
      rgba(255, 255, 255, 0.2),
      transparent
    );
    transition: left 0.5s;
  }
  
  &:hover:not(:disabled)::before {
    left: 100%;
  }
  
  @media (max-width: 768px) {
    transition: background-color 0.2s ease;
    
    &:hover:not(:disabled) {
      transform: none;
      box-shadow: none;
      animation: none;
    }
    
    &:active:not(:disabled) {
      transform: scale(0.98);
      transition: transform 0.1s ease;
    }
    
    &::before {
      display: none;
    }
  }
`;

const fadeIn = keyframes`
  from {
    opacity: 0;
    transform: translateY(10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
`;

const StatusMessage = styled.div`
  text-align: center;
  padding: 16px 20px;
  border-radius: 12px;
  margin-bottom: 20px;
  color: white;
  font-weight: 500;
  animation: ${fadeIn} 0.3s ease;
  
  ${({ type }) =>
    type === 'success'
      ? `
          background: linear-gradient(135deg, #4CAF50, #45a049);
          border: 1px solid rgba(76, 175, 80, 0.3);
        `
      : `
          background: linear-gradient(135deg, #f44336, #d32f2f);
          border: 1px solid rgba(244, 67, 54, 0.3);
        `}
`;

const Contact = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState({ type: '', message: '' });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitStatus({ type: '', message: '' });

    // Debug: Log the form data being sent
    console.log('Form data being sent:', formData);

    try {
      const apiUrl = process.env.REACT_APP_API_URL || 'http://localhost:3001';
      const response = await fetch(`${apiUrl}/api/contact`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      const result = await response.json();
      
      // Debug: Log the server response
      console.log('Server response:', response.status, result);

      if (response.ok && result.success) {
        setSubmitStatus({
          type: 'success',
          message: 'Message sent successfully! I\'ll get back to you soon.'
        });
        setFormData({ name: '', email: '', subject: '', message: '' });
      } else {
        // Show detailed validation errors if available
        if (result.errors && Array.isArray(result.errors)) {
          const errorMessages = result.errors.map(err => err.msg || err.message).join(', ');
          throw new Error(`Validation errors: ${errorMessages}`);
        } else {
          throw new Error(result.message || 'Failed to send message');
        }
      }
    } catch (error) {
      console.error('Contact form error:', error);
      setSubmitStatus({
        type: 'error',
        message: error.message || 'Failed to send message. Please try again or contact me directly at contact@richadali.dev'
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Container id="Contact">
      <Wrapper>
        <DecorativeBackground />
        <Title>Contact</Title>
        <Desc>
          Feel free to reach out to me for any queries or to avail my services!!
        </Desc>
        <ContactInfo>
          <ContactItem href="mailto:contact@richadali.dev">
            📧 contact@richadali.dev
          </ContactItem>
          <ContactItem href="tel:+917002615524">
            📱 +91 7002615524
          </ContactItem>
        </ContactInfo>
        
        <ContactFormContainer>
          <ContactForm onSubmit={handleSubmit}>
            <ContactTitle>Let's Build Something Amazing 🚀</ContactTitle>
            <ContactSubtitle>
              I can help you bring your ideas to life
            </ContactSubtitle>
            
            {submitStatus.message && (
              <StatusMessage type={submitStatus.type}>
                {submitStatus.message}
              </StatusMessage>
            )}
            
            <InputGroup>
              <InputWrapper>
                <ContactInput
                  type="text"
                  name="name"
                  placeholder="Your Name"
                  value={formData.name}
                  onChange={handleChange}
                  required
                />
              </InputWrapper>
              
              <InputWrapper>
                <ContactInput
                  type="email"
                  name="email"
                  placeholder="Your Email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                />
              </InputWrapper>
            </InputGroup>
            
            <InputWrapper>
              <ContactInput
                type="text"
                name="subject"
                placeholder="Subject"
                value={formData.subject}
                onChange={handleChange}
                required
              />
            </InputWrapper>
            
            <InputWrapper>
              <ContactInputMessage
                name="message"
                placeholder="Message"
                value={formData.message}
                onChange={handleChange}
                rows={4}
                required
              />
            </InputWrapper>
            
            <ContactButton
              type="submit"
              disabled={isSubmitting}
            >
              {isSubmitting ? "Sending..." : "Send Message"}
            </ContactButton>
          </ContactForm>
        </ContactFormContainer>
      </Wrapper>
    </Container>
  );
};

export default Contact;
