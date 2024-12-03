import React from 'react';
import styled from 'styled-components';
import { mockStats } from '../../mocks/data/stats';

const ChartContainer = styled.div`
  width: 100%;
  height: 400px;
  background: ${({ theme }) => theme.colors.cardBg};
  border-radius: ${({ theme }) => theme.borders.radius.lg};
  padding: ${({ theme }) => theme.spacing.xl};
  margin-top: ${({ theme }) => theme.spacing.xl};

  @media (max-width: 768px) {
    height: 250px;
  }
`;

const ChartTitle = styled.h3`
  color: ${({ theme }) => theme.colors.light};
  margin: 0 0 ${({ theme }) => theme.spacing.xl};
`;

const ChartGrid = styled.div`
  display: grid;
  grid-template-columns: 120px 1fr auto;
  gap: ${({ theme }) => theme.spacing.md};
  align-items: center;
`;

const AgentName = styled.div`
  color: ${({ theme }) => theme.colors.light};
  font-size: ${({ theme }) => theme.typography.fontSize.small};
`;

const BarContainer = styled.div`
  width: 100%;
  height: 24px;
  background: rgba(255, 255, 255, 0.05);
  border-radius: ${({ theme }) => theme.borders.radius.full};
  overflow: hidden;
  position: relative;
`;

const Bar = styled.div`
  height: 100%;
  width: ${({ value }) => `${value}%`};
  background: linear-gradient(90deg, 
    ${({ theme }) => theme.colors.primary} 0%, 
    ${({ theme }) => theme.colors.primaryLight} 100%
  );
  border-radius: ${({ theme }) => theme.borders.radius.full};
  transition: width 1s ease-out;
  position: relative;
  overflow: hidden;

  &::after {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: linear-gradient(
      90deg,
      transparent 0%,
      rgba(255, 255, 255, 0.1) 50%,
      transparent 100%
    );
    animation: shine 2s infinite;
  }

  @keyframes shine {
    from {
      transform: translateX(-100%);
    }
    to {
      transform: translateX(100%);
    }
  }
`;

const Value = styled.div`
  color: ${({ theme }) => theme.colors.light};
  font-size: ${({ theme }) => theme.typography.fontSize.small};
  font-weight: ${({ theme }) => theme.typography.fontWeight.medium};
  min-width: 60px;
  text-align: right;
`;

const ChartRow = styled.div`
  display: contents;

  &:hover ${Bar} {
    filter: brightness(1.2);
  }

  &:hover ${AgentName} {
    color: ${({ theme }) => theme.colors.primary};
  }
`;

function AgentPerformanceChart() {
  const data = mockStats.agentPerformance.map(item => ({
    agent: item.name,
    performance: item.successRate
  }));

  return (
    <ChartContainer>
      <ChartTitle>Agent Performance</ChartTitle>
      <ChartGrid>
        {data.map((item, index) => (
          <ChartRow key={index}>
            <AgentName>{item.agent}</AgentName>
            <BarContainer>
              <Bar value={item.performance} />
            </BarContainer>
            <Value>{item.performance}%</Value>
          </ChartRow>
        ))}
      </ChartGrid>
    </ChartContainer>
  );
}

export default AgentPerformanceChart;
