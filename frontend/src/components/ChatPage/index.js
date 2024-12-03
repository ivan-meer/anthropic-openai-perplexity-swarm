import React, { useRef } from 'react';
import ActiveAgentInfo from '../ActiveAgentInfo';
import AgentSettings from '../AgentSettings';
import ChatSystemMessage, { ChatTimestamp } from '../ChatSystemMessage';
import ChatHints from '../ChatHints';
import ChatSessionInfo from '../ChatSessionInfo';
import ChatMessage from '../ChatMessage';
import ChatStats from '../ChatStats';
import ChatInput from '../ChatInput';
import TypingIndicator from '../TypingIndicator';
import {
  ChatContainer,
  Header,
  Title,
  MessagesContainer,
  StatsContainer
} from './styles';
import {
  CHAT_COMMANDS,
  MESSAGE_TYPES,
  SENDERS,
  MESSAGE_ACTIONS,
  SYSTEM_MESSAGES,
  CONFIRM_DIALOGS
} from './constants';
import {
  shouldShowTimestamp,
  formatNumber,
  formatDuration,
  createExportData
} from './utils';
import {
  useMessages,
  useSession,
  useStats,
  useAgent,
  useSendMessage,
  useCommands,
  useSettings
} from './hooks';

const ChatPage = () => {
  const messagesEndRef = useRef(null);
  const inputRef = useRef(null);

  const { activeAgent, updateAgent } = useAgent();
  const { messages, setMessages, addMessage, addSystemMessage } = useMessages(activeAgent);
  const { session, updateSession, resetSession } = useSession();
  const { stats } = useStats(messages, session);
  const { isLoading, sendMessage } = useSendMessage(session, activeAgent, updateSession, addMessage);
  const { showCommands, toggleCommands } = useCommands();
  const { showSettings, toggleSettings } = useSettings();

  const handleMessageAction = async (action, message) => {
    switch (action) {
      case MESSAGE_ACTIONS.COPY:
        try {
          await navigator.clipboard.writeText(message.text);
          addSystemMessage(SYSTEM_MESSAGES.COPY_SUCCESS, MESSAGE_TYPES.SUCCESS);
        } catch (err) {
          console.error('Failed to copy message:', err);
          addSystemMessage(SYSTEM_MESSAGES.COPY_ERROR, MESSAGE_TYPES.ERROR);
        }
        break;

      case MESSAGE_ACTIONS.RETRY:
        if (message.sender === SENDERS.USER) {
          setNewMessage(message.text);
          inputRef.current?.focus();
        }
        break;

      case MESSAGE_ACTIONS.EDIT:
        if (message.sender === SENDERS.USER) {
          setNewMessage(message.text);
          inputRef.current?.focus();
          const messageIndex = messages.findIndex(m => m === message);
          setMessages(prev => prev.slice(0, messageIndex));
        }
        break;

      case MESSAGE_ACTIONS.DELETE:
        if (window.confirm(CONFIRM_DIALOGS.DELETE_MESSAGE)) {
          setMessages(prev => {
            const messageIndex = prev.findIndex(m => m === message);
            if (message.sender === SENDERS.USER && messageIndex < prev.length - 1) {
              return [
                ...prev.slice(0, messageIndex),
                ...prev.slice(messageIndex + 2)
              ];
            }
            return [
              ...prev.slice(0, messageIndex),
              ...prev.slice(messageIndex + 1)
            ];
          });
        }
        break;

      default:
        console.warn('Unknown message action:', action);
    }
  };

  const handleCommand = (command) => {
    switch (command) {
      case '/reset':
        if (window.confirm(CONFIRM_DIALOGS.RESET_HISTORY)) {
          addSystemMessage(SYSTEM_MESSAGES.HISTORY_CLEARED);
        }
        break;
      case '/settings':
        toggleSettings(true);
        break;
      case '/help':
        addSystemMessage(
          'Доступные команды:\n' + CHAT_COMMANDS.map(cmd => 
            `${cmd.text} - ${cmd.description}`
          ).join('\n')
        );
        break;
      case '/export':
        const chatHistory = createExportData(session, stats, messages);
        const blob = new Blob([JSON.stringify(chatHistory, null, 2)], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `chat-history-${session.id}.json`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
        addSystemMessage(SYSTEM_MESSAGES.HISTORY_EXPORTED, MESSAGE_TYPES.SUCCESS);
        break;
      case '/newsession':
        if (window.confirm(CONFIRM_DIALOGS.NEW_SESSION)) {
          resetSession();
          addSystemMessage(SYSTEM_MESSAGES.NEW_SESSION);
        }
        break;
      case '/stats':
        addSystemMessage(
          `Статистика сессии:\n` +
          `Сообщений: ${formatNumber(stats.messagesCount)}\n` +
          `Токенов: ${formatNumber(stats.tokensUsed)}\n` +
          `Среднее время ответа: ${stats.averageResponseTime}с\n` +
          `Длительность: ${formatDuration(stats.sessionDuration)}`
        );
        break;
    }
    setNewMessage('');
    toggleCommands(false);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (!newMessage.trim() || isLoading) return;

    if (newMessage.startsWith('/')) {
      handleCommand(newMessage.trim());
      return;
    }

    await sendMessage(newMessage);
    setNewMessage('');
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const handleKeyPress = (event) => {
    if (event.key === 'Enter' && !event.shiftKey) {
      event.preventDefault();
      handleSubmit(event);
    } else if (event.key === 'Tab' && showCommands) {
      event.preventDefault();
      const filtered = CHAT_COMMANDS.filter(cmd => 
        cmd.text.startsWith(newMessage.toLowerCase())
      );
      if (filtered.length === 1) {
        setNewMessage(filtered[0].text);
        toggleCommands(false);
      }
    }
  };

  const handleInputChange = (e) => {
    const value = e.target.value;
    setNewMessage(value);
    toggleCommands(value.startsWith('/'));
  };

  const renderMessage = (message, index) => {
    if (shouldShowTimestamp(messages, index)) {
      return (
        <React.Fragment key={`timestamp-${index}`}>
          <ChatTimestamp date={message.timestamp} />
          <ChatMessage 
            message={message} 
            onAction={handleMessageAction}
          />
        </React.Fragment>
      );
    }
    return (
      <ChatMessage 
        key={index} 
        message={message} 
        onAction={handleMessageAction}
      />
    );
  };

  return (
    <ChatContainer>
      <Header>
        <Title>Чат с AI-агентами</Title>
      </Header>

      <ActiveAgentInfo 
        agent={activeAgent}
        onSettingsClick={() => toggleSettings(true)}
      />

      <StatsContainer>
        <ChatSessionInfo
          sessionId={session.id}
          startTime={session.startTime}
          messagesCount={messages.filter(m => m.sender).length}
          tokensUsed={session.tokensUsed}
        />

        <ChatStats
          messagesCount={stats.messagesCount}
          tokensUsed={stats.tokensUsed}
          averageResponseTime={stats.averageResponseTime}
          sessionDuration={stats.sessionDuration}
          trends={stats.trends}
        />
      </StatsContainer>

      <MessagesContainer>
        {messages.map(renderMessage)}
        {isLoading && (
          <TypingIndicator agentName={activeAgent.name} />
        )}
        <div ref={messagesEndRef} />
      </MessagesContainer>

      <ChatInput
        ref={inputRef}
        value={newMessage}
        onChange={handleInputChange}
        onKeyDown={handleKeyPress}
        onSubmit={handleSubmit}
        onCommandSelect={handleCommand}
        isLoading={isLoading}
        showCommands={showCommands}
      />

      <ChatHints />

      {showSettings && (
        <AgentSettings
          agent={activeAgent}
          onClose={() => toggleSettings(false)}
          onSave={(settings) => {
            updateAgent(settings);
            addSystemMessage(SYSTEM_MESSAGES.SETTINGS_UPDATED, MESSAGE_TYPES.SUCCESS);
            toggleSettings(false);
          }}
        />
      )}
    </ChatContainer>
  );
};

export default ChatPage;
