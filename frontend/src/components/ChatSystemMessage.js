import React from 'react';
import styled from 'styled-components';

const Container = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  margin: ${({ theme }) => theme.spacing.md} 0;
  padding: ${({ theme }) => theme.spacing.sm} ${({ theme }) => theme.spacing.md};
`;

const Message = styled.div`
  background: ${({ theme, type }) => {
    switch (type) {
      case 'info':
        return theme.colors.badgeBg;
      case 'warning':
        return `rgba(${theme.colors.warning}, 0.1)`;
      case 'error':
        return `rgba(${theme.colors.danger}, 0.1)`;
      case 'success':
        return `rgba(${theme.colors.success}, 0.1)`;
      default:
        return theme.colors.badgeBg;
    }
  }};
  color: ${({ theme }) => theme.colors.light};
  font-size: ${({ theme }) => theme.typography.fontSize.small};
  padding: ${({ theme }) => `${theme.spacing.xs} ${theme.spacing.md}`};
  border-radius: ${({ theme }) => theme.borders.radius.full};
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing.xs};
  opacity: 0.8;
  animation: fadeIn 0.3s ease-out;

  @keyframes fadeIn {
    from {
      opacity: 0;
      transform: translateY(-10px);
    }
    to {
      opacity: 0.8;
      transform: translateY(0);
    }
  }
`;

const Icon = styled.span`
  font-size: ${({ theme }) => theme.typography.fontSize.base};
`;

const getIcon = (type) => {
  switch (type) {
    case 'info':
      return 'ℹ️';
    case 'warning':
      return '⚠️';
    case 'error':
      return '❌';
    case 'success':
      return '✅';
    default:
      return 'ℹ️';
  }
};

const Divider = styled.div`
  width: 100%;
  height: 1px;
  background: ${({ theme }) => `linear-gradient(
    to right,
    transparent,
    ${theme.colors.primaryLight}33,
    transparent
  )`};
  margin: ${({ theme }) => theme.spacing.md} 0;
`;

const TimestampDivider = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  margin: ${({ theme }) => theme.spacing.md} 0;
  color: ${({ theme }) => theme.colors.light};
  font-size: ${({ theme }) => theme.typography.fontSize.small};
  opacity: 0.5;

  &::before,
  &::after {
    content: '';
    flex: 1;
    height: 1px;
    background: ${({ theme }) => theme.colors.light};
    opacity: 0.2;
    margin: 0 ${({ theme }) => theme.spacing.md};
  }
`;

function formatDate(date) {
  const now = new Date();
  const messageDate = new Date(date);
  
  if (messageDate.toDateString() === now.toDateString()) {
    return 'Сегодня';
  }
  
  const yesterday = new Date(now);
  yesterday.setDate(yesterday.getDate() - 1);
  if (messageDate.toDateString() === yesterday.toDateString()) {
    return 'Вчера';
  }
  
  return new Intl.DateTimeFormat('ru-RU', {
    day: 'numeric',
    month: 'long'
  }).format(messageDate);
}

export function ChatSystemMessage({ type = 'info', children }) {
  return (
    <Container>
      <Message type={type}>
        <Icon>{getIcon(type)}</Icon>
        {children}
      </Message>
    </Container>
  );
}

export function ChatDivider() {
  return <Divider />;
}

export function ChatTimestamp({ date }) {
  return (
    <TimestampDivider>
      {formatDate(date)}
    </TimestampDivider>
  );
}

export default ChatSystemMessage;
