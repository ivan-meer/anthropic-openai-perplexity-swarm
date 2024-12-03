import React from 'react';
import styled from 'styled-components';

const ErrorContainer = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  height: 100vh;
  background: ${({ theme }) => theme.colors.cardBg};
`;

const ErrorIcon = styled.div`
  width: 64px;
  height: 64px;
  margin-bottom: ${({ theme }) => theme.spacing.lg};
  color: ${({ theme }) => theme.colors.danger};

  svg {
    width: 100%;
    height: 100%;
  }
`;

const ErrorText = styled.div`
  color: ${({ theme }) => theme.colors.danger};
  font-size: ${({ theme }) => theme.typography.fontSize.base};
  text-align: center;
  max-width: 400px;
  padding: ${({ theme }) => theme.spacing.md};
`;

function ErrorMessage({ message = 'An error occurred' }) {
  return (
    <ErrorContainer>
      <ErrorIcon>
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <circle cx="12" cy="12" r="10" />
          <line x1="12" y1="8" x2="12" y2="12" />
          <line x1="12" y1="16" x2="12.01" y2="16" />
        </svg>
      </ErrorIcon>
      <ErrorText>{message}</ErrorText>
    </ErrorContainer>
  );
}

export default ErrorMessage;
