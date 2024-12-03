import React from 'react';
import styled from 'styled-components';

const Container = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: ${({ theme }) => theme.spacing.xl};
  background: ${({ theme }) => theme.colors.cardBg};
  border-radius: ${({ theme }) => theme.borders.radius.lg};
  text-align: center;
  min-height: 300px;
`;

const Icon = styled.div`
  width: 64px;
  height: 64px;
  margin-bottom: ${({ theme }) => theme.spacing.lg};
  color: ${({ theme }) => theme.colors.primary};
  opacity: 0.5;

  svg {
    width: 100%;
    height: 100%;
  }
`;

const Title = styled.h3`
  color: ${({ theme }) => theme.colors.light};
  margin: 0 0 ${({ theme }) => theme.spacing.md};
  font-size: ${({ theme }) => theme.typography.fontSize.h3};
`;

const Description = styled.p`
  color: ${({ theme }) => theme.colors.light};
  opacity: 0.7;
  margin: 0 0 ${({ theme }) => theme.spacing.xl};
  max-width: 400px;
`;

const Button = styled.button`
  background: linear-gradient(135deg, ${({ theme }) => theme.colors.primary} 0%, ${({ theme }) => theme.colors.primaryLight} 100%);
  color: white;
  border: none;
  padding: ${({ theme }) => theme.spacing.md} ${({ theme }) => theme.spacing.xl};
  border-radius: ${({ theme }) => theme.borders.radius.md};
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing.sm};
  transition: ${({ theme }) => theme.effects.transitions.default};

  &:hover {
    transform: translateY(-2px);
    box-shadow: ${({ theme }) => theme.effects.shadows.button};
  }

  svg {
    width: 20px;
    height: 20px;
  }
`;

function EmptyState({ 
  icon, 
  title, 
  description, 
  actionLabel, 
  onAction 
}) {
  return (
    <Container>
      <Icon>{icon}</Icon>
      <Title>{title}</Title>
      <Description>{description}</Description>
      {actionLabel && onAction && (
        <Button onClick={onAction}>
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <line x1="12" y1="5" x2="12" y2="19" />
            <line x1="5" y1="12" x2="19" y2="12" />
          </svg>
          {actionLabel}
        </Button>
      )}
    </Container>
  );
}

export default EmptyState;
