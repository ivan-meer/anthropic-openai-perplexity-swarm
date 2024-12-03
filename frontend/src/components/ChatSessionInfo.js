import React from 'react';
import styled from 'styled-components';

const Container = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: ${({ theme }) => theme.spacing.sm} ${({ theme }) => theme.spacing.md};
  background: ${({ theme }) => theme.colors.cardBg};
  border-radius: ${({ theme }) => theme.borders.radius.md};
  margin-bottom: ${({ theme }) => theme.spacing.md};
`;

const SessionInfo = styled.div`
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing.sm};
  color: ${({ theme }) => theme.colors.light};
  font-size: ${({ theme }) => theme.typography.fontSize.small};
  opacity: 0.7;
`;

const SessionId = styled.span`
  font-family: ${({ theme }) => theme.typography.fontFamily.mono};
  background: rgba(255, 255, 255, 0.1);
  padding: ${({ theme }) => `${theme.spacing.xs} ${theme.spacing.sm}`};
  border-radius: ${({ theme }) => theme.borders.radius.sm};
`;

const Stats = styled.div`
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing.md};
`;

const StatItem = styled.div`
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing.xs};
  color: ${({ theme }) => theme.colors.light};
  font-size: ${({ theme }) => theme.typography.fontSize.small};
  opacity: 0.7;

  span:first-child {
    font-size: ${({ theme }) => theme.typography.fontSize.base};
  }
`;

const formatDuration = (startTime) => {
  const duration = Math.floor((Date.now() - startTime) / 1000);
  const hours = Math.floor(duration / 3600);
  const minutes = Math.floor((duration % 3600) / 60);
  const seconds = duration % 60;

  if (hours > 0) {
    return `${hours}ч ${minutes}м`;
  } else if (minutes > 0) {
    return `${minutes}м ${seconds}с`;
  }
  return `${seconds}с`;
};

function ChatSessionInfo({ 
  sessionId, 
  startTime, 
  messagesCount, 
  tokensUsed 
}) {
  const [duration, setDuration] = React.useState(formatDuration(startTime));

  React.useEffect(() => {
    const timer = setInterval(() => {
      setDuration(formatDuration(startTime));
    }, 1000);

    return () => clearInterval(timer);
  }, [startTime]);

  return (
    <Container>
      <SessionInfo>
        <span>Сессия:</span>
        <SessionId>{sessionId}</SessionId>
        <span>•</span>
        <span>{duration}</span>
      </SessionInfo>
      <Stats>
        <StatItem>
          <span>💬</span>
          <span>{messagesCount} сообщений</span>
        </StatItem>
        <StatItem>
          <span>📊</span>
          <span>{tokensUsed} токенов</span>
        </StatItem>
      </Stats>
    </Container>
  );
}

export default ChatSessionInfo;
