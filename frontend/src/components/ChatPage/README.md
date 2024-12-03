# ChatPage Component

Компонент чата с AI-агентами, обеспечивающий интерактивное взаимодействие пользователя с AI через текстовый интерфейс.

## Структура

```
ChatPage/
├── __tests__/              # Тесты
│   ├── ChatPage.test.js    # Тесты компонента
│   ├── hooks.test.js       # Тесты хуков
│   └── utils.test.js       # Тесты утилит
├── constants.js            # Константы и конфигурация
├── hooks.js               # Кастомные хуки
├── index.js              # Основной компонент
├── styles.js             # Styled-components стили
├── types.js             # PropTypes и типы
└── utils.js             # Вспомогательные функции
```

## Основные возможности

- Отправка и получение сообщений
- Системные сообщения и уведомления
- Команды чата (начинаются с /)
- Статистика сессии
- Настройки агента
- Экспорт истории чата
- Форматирование сообщений

## Хуки

### useMessages
Управление сообщениями чата.
```javascript
const { messages, setMessages, addMessage, addSystemMessage } = useMessages(activeAgent);
```

### useSession
Управление сессией чата.
```javascript
const { session, updateSession, resetSession } = useSession();
```

### useStats
Управление статистикой чата.
```javascript
const { stats } = useStats(messages, session);
```

### useAgent
Управление активным агентом.
```javascript
const { activeAgent, updateAgent } = useAgent();
```

### useSendMessage
Отправка сообщений.
```javascript
const { isLoading, sendMessage } = useSendMessage(session, activeAgent, updateSession, addMessage);
```

### useCommands
Управление командами чата.
```javascript
const { showCommands, toggleCommands } = useCommands();
```

### useSettings
Управление настройками.
```javascript
const { showSettings, toggleSettings } = useSettings();
```

## Утилиты

### shouldShowTimestamp
Определяет, нужно ли показывать временную метку для сообщения.
```javascript
shouldShowTimestamp(messages, index)
```

### formatMessageTime
Форматирует время сообщения.
```javascript
formatMessageTime(date)
```

### formatDuration
Форматирует длительность в минутах.
```javascript
formatDuration(minutes)
```

### formatNumber
Форматирует большие числа.
```javascript
formatNumber(num)
```

### calculateTrend
Вычисляет тренд между значениями.
```javascript
calculateTrend(current, previous)
```

### calculateAverageResponseTime
Вычисляет среднее время ответа.
```javascript
calculateAverageResponseTime(responseTimes)
```

## Команды чата

- `/reset` - Очистить историю чата
- `/settings` - Открыть настройки агента
- `/help` - Показать справку
- `/export` - Экспортировать историю чата
- `/newsession` - Начать новую сессию
- `/stats` - Показать статистику

## Типы сообщений

### Пользовательское сообщение
```javascript
{
  text: string,
  sender: 'user',
  timestamp: Date
}
```

### Сообщение AI
```javascript
{
  text: string,
  sender: 'ai',
  timestamp: Date
}
```

### Системное сообщение
```javascript
{
  type: 'system',
  text: string,
  timestamp: Date,
  messageType: 'info' | 'success' | 'error' | 'warning'
}
```

## Статистика

- Количество сообщений
- Использованные токены
- Среднее время ответа
- Длительность сессии
- Тренды изменений

## Стилизация

Компонент использует styled-components и поддерживает темизацию через ThemeProvider.

## Тестирование

```bash
# Запуск всех тестов
npm test

# Запуск тестов с watch режимом
npm test -- --watch

# Запуск тестов для конкретного файла
npm test -- ChatPage.test.js
```

## Пример использования

```jsx
import ChatPage from './components/ChatPage';

function App() {
  return (
    <ThemeProvider theme={theme}>
      <ChatPage />
    </ThemeProvider>
  );
}
```

## Зависимости

- React
- styled-components
- uuid
- prop-types

## Требования

- Node.js >= 14
- React >= 17
- styled-components >= 5

## Разработка

1. Установите зависимости:
```bash
npm install
```

2. Запустите проект:
```bash
npm start
```

3. Запустите тесты:
```bash
npm test
```

## Лицензия

MIT
