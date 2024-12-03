import React from 'react';
import styled from 'styled-components';

const Container = styled.div`
  display: flex;
  gap: ${({ theme }) => theme.spacing.md};
  padding: ${({ theme }) => theme.spacing.md};
  background: ${({ theme }) => theme.colors.cardBg};
  border-radius: ${({ theme }) => theme.borders.radius.lg};
  margin-bottom: ${({ theme }) => theme.spacing.md};
`;

const StatCard = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: ${({ theme }) => theme.spacing.md};
  background: rgba(255, 255, 255, 0.05);
  border-radius: ${({ theme }) => theme.borders.radius.md};
  transition: ${({ theme }) => theme.effects.transitions.default};

  &:hover {
    background: rgba(255, 255, 255, 0.1);
    transform: translateY(-2px);
  }
`;

const StatIcon = styled.div`
  font-size: ${({ theme }) => theme.typography.fontSize.h3};
  margin-bottom: ${({ theme }) => theme.spacing.xs};
`;

const StatValue = styled.div`
  color: ${({ theme }) => theme.colors.light};
  font-size: ${({ theme }) => theme.typography.fontSize.h4};
  font-weight: ${({ theme }) => theme.typography.fontWeight.bold};
  margin-bottom: ${({ theme }) => theme.spacing.xs};
`;

const StatLabel = styled.div`
  color: ${({ theme }) => theme.colors.light};
  font-size: ${({ theme }) => theme.typography.fontSize.small};
  opacity: 0.7;
  text-align: center;
`;

const StatTrend = styled.div`
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing.xs};
  font-size: ${({ theme }) => theme.typography.fontSize.small};
  color: ${({ trend, theme }) => 
    trend > 0 ? theme.colors.success : 
    trend < 0 ? theme.colors.danger : 
    theme.colors.light};
  opacity: 0.8;
  margin-top: ${({ theme }) => theme.spacing.xs};
`;

const formatNumber = (num) => {
  if (num >= 1000000) {
    return `${(num / 1000000).toFixed(1)}M`;
  }
  if (num >= 1000) {
    return `${(num / 1000).toFixed(1)}K`;
  }
  return num.toString();
};

const formatDuration = (minutes) => {
  if (minutes >= 60) {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return `${hours}ч ${mins}м`;
  }
  return `${minutes}м`;
};

function ChatStats({ 
  messagesCount,
  tokensUsed,
  averageResponseTime,
  sessionDuration,
  trends = {} 
}) {
  const stats = [
    {
      icon: '💬',
      value: formatNumber(messagesCount),
      label: 'Сообщений',
      trend: trends.messages
    },
    {
      icon: '📊',
      value: formatNumber(tokensUsed),
      label: 'Токенов',
      trend: trends.tokens
    },
    {
      icon: '⚡',
      value: `${averageResponseTime}с`,
      label: 'Среднее время ответа',
      trend: trends.responseTime
    },
    {
      icon: '⏱️',
      value: formatDuration(sessionDuration),
      label: 'Длительность сессии'
    }
  ];

  return (
    <Container>
      {stats.map((stat, index) => (
        <StatCard key={index}>
          <StatIcon>{stat.icon}</StatIcon>
          <StatValue>{stat.value}</StatValue>
          <StatLabel>{stat.label}</StatLabel>
          {stat.trend !== undefined && (
            <StatTrend trend={stat.trend}>
              {stat.trend > 0 ? '↑' : stat.trend < 0 ? '↓' : '•'}
              {Math.abs(stat.trend)}%
            </StatTrend>
          )}
        </StatCard>
      ))}
    </Container>
  );
}

export default ChatStats;
