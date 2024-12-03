import React, { useState } from 'react';
import styled from 'styled-components';

const Container = styled.div`
  background: ${({ theme }) => theme.colors.cardBg};
  border-radius: ${({ theme }) => theme.borders.radius.lg};
  padding: ${({ theme }) => theme.spacing.xl};
`;

const Header = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: ${({ theme }) => theme.spacing.lg};
`;

const Title = styled.h3`
  color: ${({ theme }) => theme.colors.light};
  margin: 0;
`;

const FilterGroup = styled.div`
  display: flex;
  gap: ${({ theme }) => theme.spacing.sm};
`;

const FilterButton = styled.button`
  background: ${({ active, theme }) => 
    active 
      ? `linear-gradient(135deg, ${theme.colors.primary} 0%, ${theme.colors.primaryLight} 100%)`
      : 'rgba(255, 255, 255, 0.1)'
  };
  color: ${({ theme }) => theme.colors.light};
  border: none;
  padding: ${({ theme }) => theme.spacing.sm} ${({ theme }) => theme.spacing.md};
  border-radius: ${({ theme }) => theme.borders.radius.md};
  cursor: pointer;
  transition: ${({ theme }) => theme.effects.transitions.default};

  &:hover {
    transform: translateY(-2px);
    box-shadow: ${({ theme }) => theme.effects.shadows.button};
  }
`;

const LogsList = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing.md};
  max-height: 400px;
  overflow-y: auto;
  padding-right: ${({ theme }) => theme.spacing.md};

  &::-webkit-scrollbar {
    width: 8px;
  }

  &::-webkit-scrollbar-track {
    background: rgba(255, 255, 255, 0.1);
    border-radius: ${({ theme }) => theme.borders.radius.full};
  }

  &::-webkit-scrollbar-thumb {
    background: rgba(255, 255, 255, 0.2);
    border-radius: ${({ theme }) => theme.borders.radius.full};
  }

  &::-webkit-scrollbar-thumb:hover {
    background: rgba(255, 255, 255, 0.3);
  }
`;

const LogEntry = styled.div`
  background: rgba(255, 255, 255, 0.05);
  border-radius: ${({ theme }) => theme.borders.radius.md};
  padding: ${({ theme }) => theme.spacing.lg};
  transition: ${({ theme }) => theme.effects.transitions.default};

  &:hover {
    background: rgba(255, 255, 255, 0.1);
  }
`;

const LogHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: ${({ theme }) => theme.spacing.sm};
`;

const LogTime = styled.div`
  color: ${({ theme }) => theme.colors.light};
  opacity: 0.7;
  font-size: ${({ theme }) => theme.typography.fontSize.small};
`;

const LogStatus = styled.div`
  padding: ${({ theme }) => `${theme.spacing.xs} ${theme.spacing.sm}`};
  border-radius: ${({ theme }) => theme.borders.radius.sm};
  font-size: ${({ theme }) => theme.typography.fontSize.small};
  background: ${({ status, theme }) => {
    switch (status) {
      case 'success': return theme.colors.success;
      case 'error': return theme.colors.danger;
      case 'warning': return theme.colors.warning;
      default: return theme.colors.primary;
    }
  }};
  color: white;
`;

const LogTask = styled.div`
  color: ${({ theme }) => theme.colors.light};
  margin-bottom: ${({ theme }) => theme.spacing.sm};
`;

const LogResult = styled.pre`
  color: ${({ theme }) => theme.colors.light};
  opacity: 0.8;
  font-family: ${({ theme }) => theme.typography.fontFamily.mono};
  font-size: ${({ theme }) => theme.typography.fontSize.small};
  white-space: pre-wrap;
  word-break: break-word;
  margin: 0;
  padding: ${({ theme }) => theme.spacing.md};
  background: rgba(0, 0, 0, 0.2);
  border-radius: ${({ theme }) => theme.borders.radius.sm};
`;

const mockLogs = [
  {
    id: 1,
    time: '2024-03-12 14:30:25',
    status: 'success',
    task: 'Генерация описания достопримечательности',
    result: 'Успешно создано описание храма Ват Чалонг...'
  },
  {
    id: 2,
    time: '2024-03-12 14:28:15',
    status: 'error',
    task: 'Проверка фактов в статье',
    result: 'Ошибка: не удалось подтвердить информацию о датах...'
  },
  {
    id: 3,
    time: '2024-03-12 14:25:00',
    status: 'warning',
    task: 'SEO-оптимизация текста',
    result: 'Предупреждение: низкая плотность ключевых слов...'
  }
];

function AgentLogs() {
  const [filter, setFilter] = useState('all');
  const [logs, setLogs] = useState(mockLogs);

  const filteredLogs = logs.filter(log => {
    if (filter === 'all') return true;
    return log.status === filter;
  });

  return (
    <Container>
      <Header>
        <Title>История выполнения задач</Title>
        <FilterGroup>
          <FilterButton 
            active={filter === 'all'} 
            onClick={() => setFilter('all')}
          >
            Все
          </FilterButton>
          <FilterButton 
            active={filter === 'success'} 
            onClick={() => setFilter('success')}
          >
            Успешные
          </FilterButton>
          <FilterButton 
            active={filter === 'error'} 
            onClick={() => setFilter('error')}
          >
            Ошибки
          </FilterButton>
          <FilterButton 
            active={filter === 'warning'} 
            onClick={() => setFilter('warning')}
          >
            Предупреждения
          </FilterButton>
        </FilterGroup>
      </Header>

      <LogsList>
        {filteredLogs.map(log => (
          <LogEntry key={log.id}>
            <LogHeader>
              <LogTime>{log.time}</LogTime>
              <LogStatus status={log.status}>
                {log.status === 'success' && 'Успешно'}
                {log.status === 'error' && 'Ошибка'}
                {log.status === 'warning' && 'Предупреждение'}
              </LogStatus>
            </LogHeader>
            <LogTask>{log.task}</LogTask>
            <LogResult>{log.result}</LogResult>
          </LogEntry>
        ))}
      </LogsList>
    </Container>
  );
}

export default AgentLogs;
