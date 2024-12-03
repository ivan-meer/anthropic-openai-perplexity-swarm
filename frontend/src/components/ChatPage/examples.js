import React from 'react';
import { ThemeProvider } from 'styled-components';
import ChatPage from './index';
import theme from '../../styles/theme';

/**
 * Базовое использование компонента ChatPage
 */
export const BasicUsage = () => (
  <ThemeProvider theme={theme}>
    <ChatPage />
  </ThemeProvider>
);

/**
 * Использование с предустановленным агентом
 */
export const WithCustomAgent = () => {
  const customAgent = {
    name: 'Custom Assistant',
    role: 'Specialized AI',
    status: 'active',
    id: 'custom-agent-1'
  };

  return (
    <ThemeProvider theme={theme}>
      <ChatPage initialAgent={customAgent} />
    </ThemeProvider>
  );
};

/**
 * Использование с предустановленными сообщениями
 */
export const WithInitialMessages = () => {
  const initialMessages = [
    {
      text: 'Hello!',
      sender: 'user',
      timestamp: new Date()
    },
    {
      text: 'Hi! How can I help you today?',
      sender: 'ai',
      timestamp: new Date()
    }
  ];

  return (
    <ThemeProvider theme={theme}>
      <ChatPage initialMessages={initialMessages} />
    </ThemeProvider>
  );
};

/**
 * Использование с кастомными обработчиками событий
 */
export const WithCustomHandlers = () => {
  const handleMessageSend = async (message) => {
    console.log('Sending message:', message);
    // Кастомная логика отправки сообщения
  };

  const handleSettingsChange = (settings) => {
    console.log('Settings changed:', settings);
    // Кастомная логика обработки изменения настроек
  };

  return (
    <ThemeProvider theme={theme}>
      <ChatPage
        onMessageSend={handleMessageSend}
        onSettingsChange={handleSettingsChange}
      />
    </ThemeProvider>
  );
};

/**
 * Использование с кастомной темой
 */
export const WithCustomTheme = () => {
  const customTheme = {
    ...theme,
    colors: {
      ...theme.colors,
      primary: '#6200ee',
      primaryLight: '#9c4dff',
      background: '#121212',
      cardBg: '#1e1e1e'
    }
  };

  return (
    <ThemeProvider theme={customTheme}>
      <ChatPage />
    </ThemeProvider>
  );
};

/**
 * Использование с кастомными командами
 */
export const WithCustomCommands = () => {
  const customCommands = [
    {
      icon: '🎨',
      text: '/theme',
      description: 'Change chat theme'
    },
    {
      icon: '🔍',
      text: '/search',
      description: 'Search in chat history'
    }
  ];

  const handleCommand = (command) => {
    console.log('Custom command executed:', command);
    // Кастомная логика обработки команд
  };

  return (
    <ThemeProvider theme={theme}>
      <ChatPage
        additionalCommands={customCommands}
        onCommand={handleCommand}
      />
    </ThemeProvider>
  );
};

/**
 * Использование с кастомными системными сообщениями
 */
export const WithCustomSystemMessages = () => {
  const customSystemMessages = {
    welcome: (agentName) => `Welcome to the enhanced chat! I'm ${agentName}, ready to assist you.`,
    newSession: 'Starting a new enhanced session...',
    historyCleared: 'Chat history has been cleared successfully'
  };

  return (
    <ThemeProvider theme={theme}>
      <ChatPage systemMessages={customSystemMessages} />
    </ThemeProvider>
  );
};

/**
 * Использование с кастомной статистикой
 */
export const WithCustomStats = () => {
  const customStats = {
    messagesCount: 150,
    tokensUsed: 1500,
    averageResponseTime: 2.5,
    sessionDuration: 30,
    trends: {
      messages: 10,
      tokens: 15,
      responseTime: -5
    }
  };

  return (
    <ThemeProvider theme={theme}>
      <ChatPage initialStats={customStats} />
    </ThemeProvider>
  );
};

/**
 * Использование с кастомными действиями для сообщений
 */
export const WithCustomMessageActions = () => {
  const customActions = [
    {
      name: 'translate',
      icon: '🌐',
      label: 'Translate'
    },
    {
      name: 'share',
      icon: '📤',
      label: 'Share'
    }
  ];

  const handleMessageAction = (action, message) => {
    console.log(`Action ${action} executed on message:`, message);
    // Кастомная логика обработки действий
  };

  return (
    <ThemeProvider theme={theme}>
      <ChatPage
        additionalMessageActions={customActions}
        onMessageAction={handleMessageAction}
      />
    </ThemeProvider>
  );
};

/**
 * Использование с кастомным форматированием
 */
export const WithCustomFormatting = () => {
  const formatters = {
    time: (date) => new Intl.DateTimeFormat('en-US', {
      hour: 'numeric',
      minute: 'numeric',
      hour12: true
    }).format(date),
    duration: (minutes) => `${Math.floor(minutes / 60)}h ${minutes % 60}m`,
    number: (num) => new Intl.NumberFormat('en-US', {
      notation: 'compact',
      maximumFractionDigits: 1
    }).format(num)
  };

  return (
    <ThemeProvider theme={theme}>
      <ChatPage formatters={formatters} />
    </ThemeProvider>
  );
};

/**
 * Использование с кастомным экспортом
 */
export const WithCustomExport = () => {
  const handleExport = async (chatHistory) => {
    console.log('Exporting chat history:', chatHistory);
    // Кастомная логика экспорта
    const json = JSON.stringify(chatHistory, null, 2);
    const blob = new Blob([json], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `custom-chat-export-${Date.now()}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <ThemeProvider theme={theme}>
      <ChatPage onExport={handleExport} />
    </ThemeProvider>
  );
};
