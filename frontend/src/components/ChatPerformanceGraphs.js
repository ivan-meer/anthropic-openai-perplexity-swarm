import React from 'react';
import styled from 'styled-components';
import { Line } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler
} from 'chart.js';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler
);

const Container = styled.div`
  display: flex;
  gap: ${({ theme }) => theme.spacing.md};
  padding: ${({ theme }) => theme.spacing.md};
  background: ${({ theme }) => theme.colors.cardBg};
  border-radius: ${({ theme }) => theme.borders.radius.lg};
  margin-bottom: ${({ theme }) => theme.spacing.md};
  flex-wrap: wrap;
`;

const GraphCard = styled.div`
  flex: 1;
  min-width: 300px;
  padding: ${({ theme }) => theme.spacing.md};
  background: rgba(255, 255, 255, 0.05);
  border-radius: ${({ theme }) => theme.borders.radius.md};
`;

const GraphTitle = styled.h3`
  color: ${({ theme }) => theme.colors.light};
  font-size: ${({ theme }) => theme.typography.fontSize.base};
  font-weight: ${({ theme }) => theme.typography.fontWeight.medium};
  margin: 0 0 ${({ theme }) => theme.spacing.md};
`;

const chartOptions = {
  responsive: true,
  maintainAspectRatio: false,
  plugins: {
    legend: {
      display: false
    },
    tooltip: {
      mode: 'index',
      intersect: false,
      backgroundColor: 'rgba(0, 0, 0, 0.8)',
      titleColor: '#fff',
      bodyColor: '#fff',
      borderColor: 'rgba(255, 255, 255, 0.1)',
      borderWidth: 1
    }
  },
  scales: {
    x: {
      grid: {
        color: 'rgba(255, 255, 255, 0.1)',
        borderColor: 'rgba(255, 255, 255, 0.1)'
      },
      ticks: {
        color: 'rgba(255, 255, 255, 0.7)'
      }
    },
    y: {
      grid: {
        color: 'rgba(255, 255, 255, 0.1)',
        borderColor: 'rgba(255, 255, 255, 0.1)'
      },
      ticks: {
        color: 'rgba(255, 255, 255, 0.7)'
      }
    }
  },
  interaction: {
    intersect: false,
    mode: 'index'
  }
};

function ChatPerformanceGraphs({ 
  responseTimeData,
  tokenUsageData,
  messageCountData 
}) {
  const createChartData = (data, label, color) => ({
    labels: data.labels,
    datasets: [
      {
        label,
        data: data.values,
        borderColor: color,
        backgroundColor: `${color}33`,
        fill: true,
        tension: 0.4,
        pointRadius: 4,
        pointHoverRadius: 6
      }
    ]
  });

  const responseTimeChartData = createChartData(
    responseTimeData,
    'Время ответа (с)',
    '#2563eb'
  );

  const tokenUsageChartData = createChartData(
    tokenUsageData,
    'Использование токенов',
    '#10b981'
  );

  const messageCountChartData = createChartData(
    messageCountData,
    'Количество сообщений',
    '#f59e0b'
  );

  return (
    <Container>
      <GraphCard>
        <GraphTitle>Время ответа</GraphTitle>
        <div style={{ height: '200px' }}>
          <Line data={responseTimeChartData} options={chartOptions} />
        </div>
      </GraphCard>

      <GraphCard>
        <GraphTitle>Использование токенов</GraphTitle>
        <div style={{ height: '200px' }}>
          <Line data={tokenUsageChartData} options={chartOptions} />
        </div>
      </GraphCard>

      <GraphCard>
        <GraphTitle>Активность чата</GraphTitle>
        <div style={{ height: '200px' }}>
          <Line data={messageCountChartData} options={chartOptions} />
        </div>
      </GraphCard>
    </Container>
  );
}

export default ChatPerformanceGraphs;
