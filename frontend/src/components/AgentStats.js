import React from 'react';
import styled from 'styled-components';

const StatsContainer = styled.div`
  display: flex;
  justify-content: space-between;
  background: ${({ theme }) => theme.colors.cardBg};
  border-radius: ${({ theme }) => theme.borders.radius.lg};
  padding: ${({ theme }) => theme.spacing.xl};
  margin: ${({ theme }) => theme.spacing.xl};
  max-width: 1400px;
  margin: 0 auto;
  gap: ${({ theme }) => theme.spacing.xl};
  @media (max-width: 768px) {
    flex-direction: column;
    gap: ${({ theme }) => theme.spacing.md};
  }
`;

const StatCard = styled.div`
  background: rgba(255, 255, 255, 0.1);
  backdrop-filter: blur(10px);
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  border-radius: ${({ theme }) => theme.borders.radius.md};
  padding: ${({ theme }) => theme.spacing.lg};
  text-align: center;
  transition: transform 0.3s;

  &:hover {
    transform: translateY(-5px);
  }
`;

const StatValue = styled.div`
  font-size: ${({ theme }) => theme.typography.fontSize.h2};
  font-weight: ${({ theme }) => theme.typography.fontWeight.bold};
  background: linear-gradient(135deg, ${({ theme }) => theme.colors.primary} 0%, ${({ theme }) => theme.colors.primaryLight} 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  margin-bottom: ${({ theme }) => theme.spacing.sm};
`;

const StatLabel = styled.div`
  color: ${({ theme }) => theme.colors.light};
  font-size: ${({ theme }) => theme.typography.fontSize.small};
  opacity: 0.8;
`;

const Chart = styled.div`
  width: 100%;
  height: 4px;
  background: rgba(255, 255, 255, 0.1);
  border-radius: ${({ theme }) => theme.borders.radius.full};
  overflow: hidden;
  margin-top: ${({ theme }) => theme.spacing.md};
`;

const ChartBar = styled.div`
  height: 100%;
  width: ${({ value }) => `${value}%`};
  background: linear-gradient(90deg, ${({ theme }) => theme.colors.primary} 0%, ${({ theme }) => theme.colors.primaryLight} 100%);
  border-radius: ${({ theme }) => theme.borders.radius.full};
  transition: width 0.3s ease;
`;

const StatItem = ({ value, label, chartValue }) => (
  <StatCard>
    <StatValue>{value}</StatValue>
    <StatLabel>{label}</StatLabel>
    <Chart>
      <ChartBar value={chartValue} />
    </Chart>
  </StatCard>
);

function AgentStats({ stats }) {
  const totalTasksChartValue = 100;
  const completedTasksChartValue = (stats.completedTasks / stats.totalTasks) * 100;
  const activeAgentsChartValue = (stats.activeAgents / stats.totalAgents) * 100;
  const averageTimeChartValue = (stats.averageTime / 10) * 100; // Assuming a maximum average time of 10 seconds for now.  This needs to be adjusted based on real data.


  return (
    <StatsContainer>
      <StatItem value={stats.totalTasks} label="Всего задач" chartValue={totalTasksChartValue} />
      <StatItem value={stats.completedTasks} label="Выполнено задач" chartValue={completedTasksChartValue} />
      <StatItem value={stats.activeAgents} label="Активных агентов" chartValue={activeAgentsChartValue} />
      <StatItem value={stats.averageTime + 's'} label="Среднее время выполнения" chartValue={averageTimeChartValue} />
    </StatsContainer>
  );
}

export default AgentStats;
