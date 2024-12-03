/**
 * Проверяет, нужно ли показывать временную метку для сообщения
 * @param {Array} messages - Массив сообщений
 * @param {number} index - Индекс текущего сообщения
 * @returns {boolean} - true, если нужно показать временную метку
 */
export const shouldShowTimestamp = (messages, index) => {
  if (index === 0) return true;
  
  const currentDate = new Date(messages[index].timestamp);
  const prevDate = new Date(messages[index - 1].timestamp);
  
  return currentDate.toDateString() !== prevDate.toDateString();
};

/**
 * Форматирует время сообщения
 * @param {Date} date - Дата для форматирования
 * @returns {string} - Отформатированное время
 */
export const formatMessageTime = (date) => {
  return new Intl.DateTimeFormat('ru-RU', {
    hour: '2-digit',
    minute: '2-digit'
  }).format(date);
};

/**
 * Форматирует длительность в минутах в читаемый формат
 * @param {number} minutes - Количество минут
 * @returns {string} - Отформатированная длительность
 */
export const formatDuration = (minutes) => {
  if (minutes >= 60) {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return `${hours}ч ${mins}м`;
  }
  return `${minutes}м`;
};

/**
 * Форматирует большие числа в компактный вид
 * @param {number} num - Число для форматирования
 * @returns {string} - Отформатированное число
 */
export const formatNumber = (num) => {
  if (num >= 1000000) {
    return `${(num / 1000000).toFixed(1)}M`;
  }
  if (num >= 1000) {
    return `${(num / 1000).toFixed(1)}K`;
  }
  return num.toString();
};

/**
 * Вычисляет тренд между двумя значениями
 * @param {number} current - Текущее значение
 * @param {number} previous - Предыдущее значение
 * @returns {number} - Процент изменения
 */
export const calculateTrend = (current, previous) => {
  if (!previous) return 0;
  return Math.round((current - previous) / previous * 100);
};

/**
 * Вычисляет среднее время ответа
 * @param {Array<number>} responseTimes - Массив времен ответа
 * @returns {number} - Среднее время ответа
 */
export const calculateAverageResponseTime = (responseTimes) => {
  if (!responseTimes.length) return 0;
  return Math.round(responseTimes.reduce((a, b) => a + b, 0) / responseTimes.length);
};

/**
 * Создает объект с данными для экспорта истории чата
 * @param {Object} session - Объект сессии
 * @param {Object} stats - Объект статистики
 * @param {Array} messages - Массив сообщений
 * @returns {Object} - Объект с данными для экспорта
 */
export const createExportData = (session, stats, messages) => ({
  sessionId: session.id,
  startTime: new Date(session.startTime).toISOString(),
  endTime: new Date().toISOString(),
  tokensUsed: session.tokensUsed,
  stats: stats,
  messages: messages.map(msg => ({
    ...msg,
    timestamp: msg.timestamp.toISOString()
  }))
});

/**
 * Обновляет статистику сообщений
 * @param {Object} stats - Текущая статистика
 * @param {string} sender - Отправитель сообщения ('user' или 'ai')
 * @returns {Object} - Обновленная статистика
 */
export const updateMessageStats = (stats, sender) => ({
  total: stats.total + 1,
  user: stats.user + (sender === 'user' ? 1 : 0),
  ai: stats.ai + (sender === 'ai' ? 1 : 0)
});
