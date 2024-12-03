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

const LoaderWrapper = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  height: 100vh;
  background: ${({ theme }) => theme.colors.cardBg};
`;

const SpinnerContainer = styled.div`
  position: relative;
  width: 64px;
  height: 64px;
  margin-bottom: ${({ theme }) => theme.spacing.lg};
`;

const Spinner = styled.div`
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

function Loader({ text = 'Loading...' }) {
  return (
    <LoaderWrapper>
      <SpinnerContainer>
        <Spinner />
      </SpinnerContainer>
      <LoadingText>{text}</LoadingText>
    </LoaderWrapper>
  );
}

export default Loader;
