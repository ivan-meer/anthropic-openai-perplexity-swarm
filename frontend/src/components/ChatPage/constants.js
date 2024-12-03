/**
 * Команды чата
 */
export const CHAT_COMMANDS = [
  { icon: '🔄', text: '/reset', description: 'Очистить историю чата' },
  { icon: '⚙️', text: '/settings', description: 'Открыть настройки агента' },
  { icon: '📝', text: '/help', description: 'Показать справку' },
  { icon: '💾', text: '/export', description: 'Экспортировать историю чата' },
  { icon: '🔄', text: '/newsession', description: 'Начать новую сессию' },
  { icon: '📊', text: '/stats', description: 'Показать статистику' }
];

/**
 * Типы системных сообщений
 */
export const MESSAGE_TYPES = {
  INFO: 'info',
  SUCCESS: 'success',
  ERROR: 'error',
  WARNING: 'warning'
};

/**
 * Отправители сообщений
 */
export const SENDERS = {
  USER: 'user',
  AI: 'ai',
  SYSTEM: 'system'
};

/**
 * Действия с сообщениями
 */
export const MESSAGE_ACTIONS = {
  COPY: 'copy',
  RETRY: 'retry',
  EDIT: 'edit',
  DELETE: 'delete'
};

/**
 * Интервал обновления статистики (в миллисекундах)
 */
export const STATS_UPDATE_INTERVAL = 60000;

/**
 * Начальное состояние сессии
 */
export const INITIAL_SESSION_STATE = {
  id: '',
  startTime: 0,
  tokensUsed: 0,
  responseTimes: [],
  messageStats: {
    total: 0,
    user: 0,
    ai: 0
  }
};

/**
 * Начальное состояние статистики
 */
export const INITIAL_STATS_STATE = {
  messagesCount: 0,
  tokensUsed: 0,
  averageResponseTime: 0,
  sessionDuration: 0,
  trends: {
    messages: 0,
    tokens: 0,
    responseTime: 0
  }
};

/**
 * Начальное состояние агента
 */
export const INITIAL_AGENT_STATE = {
  name: 'GPT Assistant',
  role: 'General Purpose AI',
  status: 'active'
};

/**
 * Системные сообщения
 */
export const SYSTEM_MESSAGES = {
  WELCOME: (agentName) => `Добро пожаловать! Я ${agentName}, ваш AI-ассистент. Чем могу помочь?`,
  NEW_SESSION: 'Начата новая сессия чата',
  HISTORY_CLEARED: 'История чата очищена',
  HISTORY_EXPORTED: 'История чата экспортирована',
  SETTINGS_UPDATED: 'Настройки агента успешно обновлены',
  COPY_SUCCESS: 'Сообщение скопировано в буфер обмена',
  COPY_ERROR: 'Не удалось скопировать сообщение',
  NETWORK_ERROR: 'Произошла ошибка при отправке сообщения. Пожалуйста, попробуйте еще раз.'
};

/**
 * Подтверждающие диалоги
 */
export const CONFIRM_DIALOGS = {
  RESET_HISTORY: 'Вы уверены, что хотите очистить историю чата?',
  NEW_SESSION: 'Вы уверены, что хотите начать новую сессию?',
  DELETE_MESSAGE: 'Вы уверены, что хотите удалить это сообщение?'
};

/**
 * Форматы дат
 */
export const DATE_FORMATS = {
  TIME: {
    hour: '2-digit',
    minute: '2-digit'
  },
  FULL: {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  }
};

/**
 * API endpoints
 */
export const API_ENDPOINTS = {
  CHAT: '/api/chat'
};

/**
 * HTTP headers
 */
export const HTTP_HEADERS = {
  'Content-Type': 'application/json'
};
