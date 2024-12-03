import React from 'react';
import styled from 'styled-components';

const Container = styled.div`
  display: flex;
  align-items: center;
  padding: ${({ theme }) => theme.spacing.md};
  background: ${({ theme }) => theme.colors.cardBg};
  border-radius: ${({ theme }) => theme.borders.radius.lg};
  margin-bottom: ${({ theme }) => theme.spacing.lg};
`;

const AgentAvatar = styled.div`
  width: 48px;
  height: 48px;
  border-radius: ${({ theme }) => theme.borders.radius.full};
  background: ${({ theme }) => `linear-gradient(135deg, ${theme.colors.primary} 0%, ${theme.colors.primaryLight} 100%)`};
  display: flex;
  align-items: center;
  justify-content: center;
  margin-right: ${({ theme }) => theme.spacing.md};
  box-shadow: ${({ theme }) => theme.effects.shadows.card};
`;

const AgentIcon = styled.span`
  color: ${({ theme }) => theme.colors.light};
  font-size: ${({ theme }) => theme.typography.fontSize.h3};
`;

const InfoContainer = styled.div`
  flex: 1;
`;

const AgentName = styled.h3`
  margin: 0;
  color: ${({ theme }) => theme.colors.light};
  font-size: ${({ theme }) => theme.typography.fontSize.h4};
  font-weight: ${({ theme }) => theme.typography.fontWeight.semibold};
`;

const AgentRole = styled.p`
  margin: ${({ theme }) => theme.spacing.xs} 0 0;
  color: ${({ theme }) => theme.colors.light};
  font-size: ${({ theme }) => theme.typography.fontSize.small};
  opacity: 0.7;
`;

const StatusBadge = styled.div`
  display: flex;
  align-items: center;
  padding: ${({ theme }) => `${theme.spacing.xs} ${theme.spacing.md}`};
  background: ${({ theme }) => theme.colors.badgeBg};
  border-radius: ${({ theme }) => theme.borders.radius.full};
  color: ${({ theme }) => theme.colors.light};
  font-size: ${({ theme }) => theme.typography.fontSize.small};
  font-weight: ${({ theme }) => theme.typography.fontWeight.medium};
`;

const StatusDot = styled.div`
  width: 8px;
  height: 8px;
  border-radius: ${({ theme }) => theme.borders.radius.full};
  background: ${({ theme }) => theme.colors.success};
  margin-right: ${({ theme }) => theme.spacing.xs};
  box-shadow: ${({ theme }) => theme.effects.shadows.status};
`;

const SettingsButton = styled.button`
  background: none;
  border: none;
  color: ${({ theme }) => theme.colors.light};
  padding: ${({ theme }) => theme.spacing.sm};
  cursor: pointer;
  transition: ${({ theme }) => theme.effects.transitions.default};
  opacity: 0.7;

  &:hover {
    opacity: 1;
    transform: scale(1.1);
  }
`;

function ActiveAgentInfo({ agent, onSettingsClick }) {
  return (
    <Container>
      <AgentAvatar>
        <AgentIcon>🤖</AgentIcon>
      </AgentAvatar>
      
      <InfoContainer>
        <AgentName>{agent.name || 'AI Assistant'}</AgentName>
        <AgentRole>{agent.role || 'General Purpose Agent'}</AgentRole>
      </InfoContainer>

      <StatusBadge>
        <StatusDot />
        Активен
      </StatusBadge>

      <SettingsButton onClick={onSettingsClick} title="Настройки агента">
        ⚙️
      </SettingsButton>
    </Container>
  );
}

export default ActiveAgentInfo;
