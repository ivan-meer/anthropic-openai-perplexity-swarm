import PropTypes from 'prop-types';
import { MESSAGE_TYPES, SENDERS } from './constants';

/**
 * @typedef {Object} Message
 * @property {string} text - Текст сообщения
 * @property {string} [sender] - Отправитель сообщения (user/ai)
 * @property {string} [type] - Тип сообщения для системных сообщений
 * @property {Date} timestamp - Время отправки сообщения
 * @property {string} [messageType] - Тип системного сообщения (info/success/error/warning)
 */

/**
 * @typedef {Object} Session
 * @property {string} id - ID сессии
 * @property {number} startTime - Время начала сессии
 * @property {number} tokensUsed - Количество использованных токенов
 * @property {number[]} responseTimes - Массив времен ответа
 * @property {Object} messageStats - Статистика сообщений
 * @property {number} messageStats.total - Общее количество сообщений
 * @property {number} messageStats.user - Количество сообщений пользователя
 * @property {number} messageStats.ai - Количество сообщений AI
 */

/**
 * @typedef {Object} Stats
 * @property {number} messagesCount - Количество сообщений
 * @property {number} tokensUsed - Количество токенов
 * @property {number} averageResponseTime - Среднее время ответа
 * @property {number} sessionDuration - Длительность сессии
 * @property {Object} trends - Тренды изменений
 * @property {number} trends.messages - Тренд количества сообщений
 * @property {number} trends.tokens - Тренд использования токенов
 * @property {number} trends.responseTime - Тренд времени ответа
 */

/**
 * @typedef {Object} Agent
 * @property {string} name - Имя агента
 * @property {string} role - Роль агента
 * @property {string} status - Статус агента
 * @property {string} [id] - ID агента
 */

/**
 * PropTypes для Message
 */
export const MessagePropTypes = PropTypes.shape({
  text: PropTypes.string.isRequired,
  sender: PropTypes.oneOf(Object.values(SENDERS)),
  type: PropTypes.oneOf(Object.values(SENDERS)),
  timestamp: PropTypes.instanceOf(Date).isRequired,
  messageType: PropTypes.oneOf(Object.values(MESSAGE_TYPES))
});

/**
 * PropTypes для Session
 */
export const SessionPropTypes = PropTypes.shape({
  id: PropTypes.string.isRequired,
  startTime: PropTypes.number.isRequired,
  tokensUsed: PropTypes.number.isRequired,
  responseTimes: PropTypes.arrayOf(PropTypes.number).isRequired,
  messageStats: PropTypes.shape({
    total: PropTypes.number.isRequired,
    user: PropTypes.number.isRequired,
    ai: PropTypes.number.isRequired
  }).isRequired
});

/**
 * PropTypes для Stats
 */
export const StatsPropTypes = PropTypes.shape({
  messagesCount: PropTypes.number.isRequired,
  tokensUsed: PropTypes.number.isRequired,
  averageResponseTime: PropTypes.number.isRequired,
  sessionDuration: PropTypes.number.isRequired,
  trends: PropTypes.shape({
    messages: PropTypes.number.isRequired,
    tokens: PropTypes.number.isRequired,
    responseTime: PropTypes.number.isRequired
  }).isRequired
});

/**
 * PropTypes для Agent
 */
export const AgentPropTypes = PropTypes.shape({
  name: PropTypes.string.isRequired,
  role: PropTypes.string.isRequired,
  status: PropTypes.string.isRequired,
  id: PropTypes.string
});

/**
 * PropTypes для ChatInput
 */
export const ChatInputPropTypes = {
  value: PropTypes.string.isRequired,
  onChange: PropTypes.func.isRequired,
  onKeyDown: PropTypes.func.isRequired,
  onSubmit: PropTypes.func.isRequired,
  onCommandSelect: PropTypes.func.isRequired,
  isLoading: PropTypes.bool.isRequired,
  showCommands: PropTypes.bool.isRequired,
  placeholder: PropTypes.string
};

/**
 * PropTypes для ChatStats
 */
export const ChatStatsPropTypes = {
  messagesCount: PropTypes.number.isRequired,
  tokensUsed: PropTypes.number.isRequired,
  averageResponseTime: PropTypes.number.isRequired,
  sessionDuration: PropTypes.number.isRequired,
  trends: PropTypes.shape({
    messages: PropTypes.number.isRequired,
    tokens: PropTypes.number.isRequired,
    responseTime: PropTypes.number.isRequired
  }).isRequired
};

/**
 * PropTypes для ChatSessionInfo
 */
export const ChatSessionInfoPropTypes = {
  sessionId: PropTypes.string.isRequired,
  startTime: PropTypes.number.isRequired,
  messagesCount: PropTypes.number.isRequired,
  tokensUsed: PropTypes.number.isRequired
};

/**
 * PropTypes для ChatMessage
 */
export const ChatMessagePropTypes = {
  message: MessagePropTypes.isRequired,
  onAction: PropTypes.func.isRequired
};

/**
 * PropTypes для AgentSettings
 */
export const AgentSettingsPropTypes = {
  agent: AgentPropTypes.isRequired,
  onClose: PropTypes.func.isRequired,
  onSave: PropTypes.func.isRequired
};

/**
 * PropTypes для ActiveAgentInfo
 */
export const ActiveAgentInfoPropTypes = {
  agent: AgentPropTypes.isRequired,
  onSettingsClick: PropTypes.func.isRequired
};

/**
 * PropTypes для TypingIndicator
 */
export const TypingIndicatorPropTypes = {
  agentName: PropTypes.string.isRequired
};
