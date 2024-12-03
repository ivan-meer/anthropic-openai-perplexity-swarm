import React from 'react';
import styled from 'styled-components';
import { useParams } from 'react-router-dom';
import AgentLogs from './AgentLogs';

const Container = styled.div`
  padding: ${({ theme }) => theme.spacing.xl};
  max-width: 1400px;
  margin: 0 auto;
`;

const Header = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: ${({ theme }) => theme.spacing.xl};
`;

const Title = styled.h1`
  color: ${({ theme }) => theme.colors.light};
  margin: 0;
  font-size: ${({ theme }) => theme.typography.fontSize.h1};
  background: linear-gradient(135deg, ${({ theme }) => theme.colors.primary} 0%, ${({ theme }) => theme.colors.primaryLight} 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
`;

const AgentInfo = styled.div`
  background: ${({ theme }) => theme.colors.cardBg};
  border-radius: ${({ theme }) => theme.borders.radius.lg};
  padding: ${({ theme }) => theme.spacing.xl};
  margin-bottom: ${({ theme }) => theme.spacing.xl};
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: ${({ theme }) => theme.spacing.xl};
`;

const InfoItem = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing.sm};
`;

const InfoLabel = styled.div`
  color: ${({ theme }) => theme.colors.light};
  opacity: 0.7;
  font-size: ${({ theme }) => theme.typography.fontSize.small};
`;

const InfoValue = styled.div`
  color: ${({ theme }) => theme.colors.light};
  font-size: ${({ theme }) => theme.typography.fontSize.base};
  font-weight: ${({ theme }) => theme.typography.fontWeight.medium};
`;

const StatusBadge = styled.div`
  display: inline-flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing.sm};
  padding: ${({ theme }) => `${theme.spacing.sm} ${theme.spacing.md}`};
  border-radius: ${({ theme }) => theme.borders.radius.full};
  background: ${({ status, theme }) => {
    switch (status) {
      case 'initialized': return theme.colors.primary;
      case 'running': return theme.colors.success;
      case 'error': return theme.colors.danger;
      default: return theme.colors.secondary;
    }
  }};
  color: white;
  font-size: ${({ theme }) => theme.typography.fontSize.small};
  font-weight: ${({ theme }) => theme.typography.fontWeight.medium};

  &::before {
    content: '';
    width: 8px;
    height: 8px;
    border-radius: 50%;
    background: currentColor;
  }
`;

function AgentLogsPage() {
  const { agentId } = useParams();
  
  // В реальном приложении здесь будет запрос к API для получения информации об агенте
  const agent = {
    name: "Content Creator",
    platform: "OpenAI + Claude",
    status: { status: "initialized" },
    model: "gpt-4",
    totalTasks: 1248,
    successRate: "92.6%"
  };

  return (
    <Container>
      <Header>
        <Title>Логи агента: {agent.name}</Title>
        <StatusBadge status={agent.status.status}>
          {agent.status.status === 'initialized' && 'Готов к работе'}
          {agent.status.status === 'running' && 'Выполняет задачу'}
          {agent.status.status === 'error' && 'Ошибка'}
        </StatusBadge>
      </Header>

      <AgentInfo>
        <InfoItem>
          <InfoLabel>Платформа</InfoLabel>
          <InfoValue>{agent.platform}</InfoValue>
        </InfoItem>
        <InfoItem>
          <InfoLabel>Модель</InfoLabel>
          <InfoValue>{agent.model}</InfoValue>
        </InfoItem>
        <InfoItem>
          <InfoLabel>Всего задач</InfoLabel>
          <InfoValue>{agent.totalTasks}</InfoValue>
        </InfoItem>
        <InfoItem>
          <InfoLabel>Успешность</InfoLabel>
          <InfoValue>{agent.successRate}</InfoValue>
        </InfoItem>
      </AgentInfo>

      <AgentLogs />
    </Container>
  );
}

export default AgentLogsPage;
