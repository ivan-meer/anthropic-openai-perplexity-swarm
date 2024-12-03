import React from 'react';
import styled, { keyframes } from 'styled-components';

const spin = keyframes`
  0% {
    transform: rotate(0deg);
  }
  100% {
    transform: rotate(360deg);
  }
`;

const pulse = keyframes`
  0%, 100% {
    opacity: 1;
  }
  50% {
    opacity: 0.5;
  }
`;

const Container = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-height: ${({ fullScreen }) => fullScreen ? '100vh' : '200px'};
  background: ${({ theme }) => theme.colors.cardBg};
  border-radius: ${({ theme }) => theme.borders.radius.lg};
  padding: ${({ theme }) => theme.spacing.xl};
`;

const SpinnerContainer = styled.div`
  position: relative;
  width: 64px;
  height: 64px;
  margin-bottom: ${({ theme }) => theme.spacing.lg};
`;

const SpinnerRing = styled.div`
  position: absolute;
  width: 100%;
  height: 100%;
  border: 4px solid transparent;
  border-top-color: ${({ theme }) => theme.colors.primary};
  border-radius: 50%;
  animation: ${spin} 1s linear infinite;

  &::before {
    content: '';
    position: absolute;
    top: -4px;
    left: -4px;
    right: -4px;
    bottom: -4px;
    border: 4px solid transparent;
    border-top-color: ${({ theme }) => theme.colors.primaryLight};
    border-radius: 50%;
    animation: ${spin} 2s linear infinite;
  }

  &::after {
    content: '';
    position: absolute;
    top: 2px;
    left: 2px;
    right: 2px;
    bottom: 2px;
    border: 4px solid transparent;
    border-top-color: ${({ theme }) => theme.colors.secondary};
    border-radius: 50%;
    animation: ${spin} 3s linear infinite;
  }
`;

const LoadingText = styled.div`
  color: ${({ theme }) => theme.colors.light};
  font-size: ${({ theme }) => theme.typography.fontSize.base};
  animation: ${pulse} 1.5s ease-in-out infinite;
`;

const Progress = styled.div`
  width: 200px;
  height: 4px;
  background: rgba(255, 255, 255, 0.1);
  border-radius: ${({ theme }) => theme.borders.radius.full};
  margin-top: ${({ theme }) => theme.spacing.md};
  overflow: hidden;
  position: relative;

  &::after {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    height: 100%;
    width: ${({ value }) => `${value}%`};
    background: linear-gradient(90deg, 
      ${({ theme }) => theme.colors.primary} 0%, 
      ${({ theme }) => theme.colors.primaryLight} 100%
    );
    border-radius: ${({ theme }) => theme.borders.radius.full};
    transition: width 0.3s ease;
  }
`;

function LoadingSpinner({ 
  text = 'Loading...', 
  fullScreen = false, 
  progress = null 
}) {
  return (
    <Container fullScreen={fullScreen}>
      <SpinnerContainer>
        <SpinnerRing />
      </SpinnerContainer>
      <LoadingText>{text}</LoadingText>
      {progress !== null && (
        <Progress value={progress} />
      )}
    </Container>
  );
}

export default LoadingSpinner;
