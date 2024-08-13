import React from 'react';
import styled, { keyframes } from 'styled-components';
import facebookLogo from './logo.png'; // Ensure you have a Facebook logo image in your src folder

const Loading = () => {

  return (
    <LoadingContainer>
      <Logo src={facebookLogo} alt="Facebook Logo" />
      <ThinkingBubble>
        <Dot delay="0s" />
        <Dot delay="0.2s" />
        <Dot delay="0.4s" />
      </ThinkingBubble>
    </LoadingContainer>
  );
};

const LoadingContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 100vh;
`;

const Logo = styled.img`
  width: 100px;
  height: 100px;
  margin-bottom: 20px;
`;

const ThinkingBubble = styled.div`
  width: 60px;
  height: 30px;
  border-radius: 15px;
  display: flex;
  align-items: center;
  justify-content: space-around;
  padding: 5px;
  position: relative;
`;

const blink = keyframes`
  0%, 100% {
    opacity: 0;
  }
  50% {
    opacity: 1;
  }
`;

const Dot = styled.div`
  width: 8px;
  height: 8px;
  background-color: #e6bb02;
  border-radius: 50%;
  animation: ${blink} 1s infinite;
  animation-delay: ${props => props.delay};
`;

export default Loading;
