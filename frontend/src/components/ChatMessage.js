import React, { useState, useRef } from 'react';
import styled from 'styled-components';
import ReactMarkdown from 'react-markdown';
import ChatMessageMenu from './ChatMessageMenu';

const MessageContainer = styled.div`
  position: relative;
  display: flex;
  flex-direction: column;
  max-width: 70%;
  margin: ${({ theme }) => theme.spacing.sm} 0;
  ${({ sender }) => sender === 'user' ? 'margin-left: auto;' : 'margin-right: auto;'}

  &:hover {
    .message-menu-trigger {
      opacity: 1;
    }
  }
`;

const MessageBubble = styled.div`
  padding: ${({ theme }) => theme.spacing.md};
  border-radius: ${({ theme }) => theme.borders.radius.md};
  color: ${({ theme }) => theme.colors.light};
  animation: ${({ theme }) => theme.effects.animations.fadeIn};
  position: relative;
  
  ${({ sender, theme }) => sender === 'user' ? `
    background: ${theme.colors.primary};
    border-bottom-right-radius: ${theme.borders.radius.sm};
  ` : sender === 'ai' ? `
    background: ${theme.colors.cardBg};
    border-bottom-left-radius: ${theme.borders.radius.sm};
  ` : `
    background: ${theme.colors.badgeBg};
    margin: ${theme.spacing.md} auto;
    max-width: 90%;
    text-align: center;
    font-size: ${theme.typography.fontSize.small};
    opacity: 0.8;
  `}
`;

const MessageContent = styled.div`
  .markdown-content {
    h1, h2, h3, h4, h5, h6 {
      color: ${({ theme }) => theme.colors.light};
      margin: ${({ theme }) => theme.spacing.sm} 0;
      font-weight: ${({ theme }) => theme.typography.fontWeight.semibold};
    }

    p {
      margin: ${({ theme }) => theme.spacing.xs} 0;
    }

    ul, ol {
      margin: ${({ theme }) => theme.spacing.xs} 0;
      padding-left: ${({ theme }) => theme.spacing.lg};
    }

    blockquote {
      margin: ${({ theme }) => theme.spacing.sm} 0;
      padding-left: ${({ theme }) => theme.spacing.md};
      border-left: 2px solid ${({ theme }) => theme.colors.primary};
      font-style: italic;
      opacity: 0.9;
    }

    code {
      font-family: ${({ theme }) => theme.typography.fontFamily.mono};
      background: rgba(0, 0, 0, 0.2);
      padding: 2px 4px;
      border-radius: 4px;
    }

    pre {
      background: rgba(0, 0, 0, 0.2);
      padding: ${({ theme }) => theme.spacing.md};
      border-radius: ${({ theme }) => theme.borders.radius.md};
      overflow-x: auto;
      margin: ${({ theme }) => theme.spacing.sm} 0;

      code {
        background: none;
        padding: 0;
      }
    }

    a {
      color: ${({ theme }) => theme.colors.primaryLight};
      text-decoration: none;
      
      &:hover {
        text-decoration: underline;
      }
    }

    img {
      max-width: 100%;
      border-radius: ${({ theme }) => theme.borders.radius.md};
      margin: ${({ theme }) => theme.spacing.sm} 0;
    }

    hr {
      border: none;
      border-top: 1px solid rgba(255, 255, 255, 0.1);
      margin: ${({ theme }) => theme.spacing.md} 0;
    }

    table {
      width: 100%;
      border-collapse: collapse;
      margin: ${({ theme }) => theme.spacing.sm} 0;
      
      th, td {
        padding: ${({ theme }) => theme.spacing.sm};
        border: 1px solid rgba(255, 255, 255, 0.1);
        text-align: left;
      }
      
      th {
        background: rgba(255, 255, 255, 0.05);
        font-weight: ${({ theme }) => theme.typography.fontWeight.medium};
      }
    }
  }
`;

const MessageTime = styled.div`
  font-size: ${({ theme }) => theme.typography.fontSize.small};
  color: ${({ theme }) => theme.colors.light};
  opacity: 0.5;
  margin-top: ${({ theme }) => theme.spacing.xs};
  text-align: ${({ sender }) => sender === 'user' ? 'right' : 'left'};
`;

const MenuTrigger = styled.button`
  position: absolute;
  ${({ sender }) => sender === 'user' ? 'left: -24px;' : 'right: -24px;'}
  top: 50%;
  transform: translateY(-50%);
  background: none;
  border: none;
  color: ${({ theme }) => theme.colors.light};
  opacity: 0;
  cursor: pointer;
  padding: ${({ theme }) => theme.spacing.xs};
  transition: ${({ theme }) => theme.effects.transitions.default};
  
  &:hover {
    opacity: 1;
    transform: translateY(-50%) scale(1.1);
  }
`;

function formatTime(date) {
  return new Intl.DateTimeFormat('ru-RU', {
    hour: '2-digit',
    minute: '2-digit'
  }).format(date);
}

function ChatMessage({ message, onAction }) {
  const [showMenu, setShowMenu] = useState(false);
  const menuTriggerRef = useRef(null);

  const handleMenuAction = (action, msg) => {
    if (onAction) {
      onAction(action, msg);
    }
    setShowMenu(false);
  };

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(message.text);
      // Можно добавить уведомление об успешном копировании
    } catch (err) {
      console.error('Failed to copy message:', err);
    }
  };

  if (message.type === 'system') {
    return (
      <MessageContainer>
        <MessageBubble sender="system">
          {message.text}
          <MessageTime sender="system">
            {formatTime(message.timestamp)}
          </MessageTime>
        </MessageBubble>
      </MessageContainer>
    );
  }

  return (
    <MessageContainer sender={message.sender}>
      <MessageBubble sender={message.sender}>
        <MessageContent>
          <ReactMarkdown className="markdown-content">
            {message.text}
          </ReactMarkdown>
        </MessageContent>
        <MessageTime sender={message.sender}>
          {formatTime(message.timestamp)}
        </MessageTime>
      </MessageBubble>
      
      <MenuTrigger
        ref={menuTriggerRef}
        className="message-menu-trigger"
        sender={message.sender}
        onClick={() => setShowMenu(!showMenu)}
      >
        ⋮
      </MenuTrigger>

      <ChatMessageMenu
        show={showMenu}
        message={message}
        onAction={handleMenuAction}
      />
    </MessageContainer>
  );
}

export default ChatMessage;
