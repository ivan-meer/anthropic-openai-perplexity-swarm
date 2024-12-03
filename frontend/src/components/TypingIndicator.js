import React from 'react';
import styled from 'styled-components';

const Container = styled.div`
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing.xs};
  color: ${({ theme }) => theme.colors.light};
  font-size: ${({ theme }) => theme.typography.fontSize.small};
  opacity: 0.7;
  padding: ${({ theme }) => theme.spacing.sm};
  margin-left: ${({ theme }) => theme.spacing.md};
  
  @keyframes blink {
    0% { opacity: 0.3; }
    50% { opacity: 1; }
    100% { opacity: 0.3; }
  }
`;

const Dot = styled.span`
  display: inline-block;
  width: 4px;
  height: 4px;
  background: ${({ theme }) => theme.colors.light};
  border-radius: ${({ theme }) => theme.borders.radius.full};
  animation: blink 1.4s infinite;
  
  &:nth-child(2) { animation-delay: 0.2s; }
  &:nth-child(3) { animation-delay: 0.4s; }
`;

const AgentName = styled.span`
  font-weight: ${({ theme }) => theme.typography.fontWeight.medium};
  margin-right: ${({ theme }) => theme.spacing.xs};
`;

function TypingIndicator({ agentName }) {
  return (
    <Container>
      {agentName && <AgentName>{agentName}</AgentName>}
      печатает
      <Dot />
      <Dot />
      <Dot />
    </Container>
  );
}

export default TypingIndicator;
