import { SENDERS, MESSAGE_TYPES } from '../../constants';

/**
 * Мок сообщений чата
 */
export const mockMessages = [
  {
    type: SENDERS.SYSTEM,
    text: 'Welcome to the chat!',
    timestamp: new Date('2024-01-01T10:00:00'),
    messageType: MESSAGE_TYPES.INFO
  },
  {
    text: 'Hello!',
    sender: SENDERS.USER,
    timestamp: new Date('2024-01-01T10:01:00')
  },
  {
    text: 'Hi! How can I help you today?',
    sender: SENDERS.AI,
    timestamp: new Date('2024-01-01T10:01:30')
  }
];

/**
 * Мок сессии чата
 */
export const mockSession = {
  id: 'test-session-id',
  startTime: new Date('2024-01-01T10:00:00').getTime(),
  tokensUsed: 150,
  responseTimes: [1.5, 2.0, 1.8],
  messageStats: {
    total: 10,
    user: 5,
    ai: 5
  }
};

/**
 * Мок статистики чата
 */
export const mockStats = {
  messagesCount: 10,
  tokensUsed: 150,
  averageResponseTime: 1.8,
  sessionDuration: 30,
  trends: {
    messages: 20,
    tokens: 15,
    responseTime: -5
  }
};

/**
 * Мок агента
 */
export const mockAgent = {
  name: 'Test Assistant',
  role: 'Test Role',
  status: 'active',
  id: 'test-agent-id'
};

/**
 * Мок команд чата
 */
export const mockCommands = [
  {
    icon: '🔄',
    text: '/test',
    description: 'Test command'
  },
  {
    icon: '⚙️',
    text: '/mock',
    description: 'Mock command'
  }
];

/**
 * Мок действий с сообщениями
 */
export const mockMessageActions = [
  {
    name: 'test',
    icon: '🧪',
    label: 'Test Action'
  },
  {
    name: 'mock',
    icon: '🎭',
    label: 'Mock Action'
  }
];

/**
 * Мок системных сообщений
 */
export const mockSystemMessages = {
  welcome: (agentName) => `Test welcome message from ${agentName}`,
  newSession: 'Test new session message',
  historyCleared: 'Test history cleared message',
  historyExported: 'Test history exported message',
  settingsUpdated: 'Test settings updated message',
  copySuccess: 'Test copy success message',
  copyError: 'Test copy error message',
  networkError: 'Test network error message'
};

/**
 * Мок форматтеров
 */
export const mockFormatters = {
  time: (date) => '10:00 AM',
  duration: (minutes) => '1h 30m',
  number: (num) => '1.5K'
};

/**
 * Мок ответа API
 */
export const mockApiResponse = {
  response: 'Test API response',
  tokensUsed: 10
};

/**
 * Мок обработчиков событий
 */
export const mockHandlers = {
  onMessageSend: jest.fn(),
  onSettingsChange: jest.fn(),
  onCommand: jest.fn(),
  onMessageAction: jest.fn(),
  onExport: jest.fn()
};

/**
 * Мок темы
 */
export const mockTheme = {
  colors: {
    primary: '#test',
    primaryLight: '#test-light',
    background: '#test-bg',
    cardBg: '#test-card'
  },
  spacing: {
    xs: '4px',
    sm: '8px',
    md: '16px',
    lg: '24px',
    xl: '32px',
    '2xl': '48px'
  },
  typography: {
    fontSize: {
      small: '12px',
      base: '14px',
      large: '16px',
      h1: '24px',
      h2: '20px'
    },
    fontWeight: {
      normal: 400,
      medium: 500,
      semibold: 600,
      bold: 700
    },
    fontFamily: {
      base: 'Arial, sans-serif',
      mono: 'monospace'
    }
  },
  borders: {
    radius: {
      sm: '4px',
      md: '8px',
      lg: '12px',
      full: '9999px'
    }
  },
  effects: {
    shadows: {
      card: '0 2px 4px rgba(0,0,0,0.1)',
      button: '0 2px 4px rgba(0,0,0,0.2)',
      input: '0 0 0 2px rgba(0,0,0,0.1)',
      text: '0 1px 2px rgba(0,0,0,0.1)'
    },
    transitions: {
      default: 'all 0.2s ease'
    },
    animations: {
      fadeIn: '@keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }'
    }
  }
};

/**
 * Мок DOM-элементов
 */
export const mockElements = {
  messagesEndRef: {
    current: {
      scrollIntoView: jest.fn()
    }
  },
  inputRef: {
    current: {
      focus: jest.fn()
    }
  }
};

/**
 * Мок данных для экспорта
 */
export const mockExportData = {
  sessionId: 'test-session-id',
  startTime: '2024-01-01T10:00:00.000Z',
  endTime: '2024-01-01T10:30:00.000Z',
  tokensUsed: 150,
  stats: mockStats,
  messages: mockMessages.map(msg => ({
    ...msg,
    timestamp: msg.timestamp.toISOString()
  }))
};

/**
 * Мок функций для работы с буфером обмена
 */
export const mockClipboard = {
  writeText: jest.fn().mockResolvedValue(undefined)
};

/**
 * Мок функций для работы с URL
 */
export const mockURL = {
  createObjectURL: jest.fn(),
  revokeObjectURL: jest.fn()
};

/**
 * Мок функций для работы с DOM
 */
export const mockDOM = {
  createElement: jest.fn(() => ({
    href: '',
    download: '',
    click: jest.fn(),
    remove: jest.fn()
  })),
  appendChild: jest.fn(),
  removeChild: jest.fn()
};
