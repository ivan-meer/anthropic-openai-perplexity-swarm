import { useState, useEffect, useCallback } from 'react';
import { v4 as uuidv4 } from 'uuid';
import {
  INITIAL_SESSION_STATE,
  INITIAL_STATS_STATE,
  INITIAL_AGENT_STATE,
  STATS_UPDATE_INTERVAL,
  SENDERS,
  MESSAGE_TYPES,
  SYSTEM_MESSAGES,
  API_ENDPOINTS,
  HTTP_HEADERS
} from './constants';
import {
  calculateTrend,
  calculateAverageResponseTime,
  updateMessageStats
} from './utils';

/**
 * Хук для управления сообщениями чата
 */
export const useMessages = (activeAgent) => {
  const [messages, setMessages] = useState([]);

  useEffect(() => {
    if (messages.length === 0) {
      const welcomeMessage = {
        type: SENDERS.SYSTEM,
        text: SYSTEM_MESSAGES.WELCOME(activeAgent.name),
        timestamp: new Date()
      };
      setMessages([welcomeMessage]);
    }
  }, [activeAgent.name]);

  const addMessage = useCallback((message) => {
    setMessages(prev => [...prev, {
      ...message,
      timestamp: new Date()
    }]);
  }, []);

  const addSystemMessage = useCallback((text, messageType = MESSAGE_TYPES.INFO) => {
    addMessage({
      type: SENDERS.SYSTEM,
      text,
      messageType
    });
  }, [addMessage]);

  return { messages, setMessages, addMessage, addSystemMessage };
};

/**
 * Хук для управления сессией чата
 */
export const useSession = () => {
  const [session, setSession] = useState({
    ...INITIAL_SESSION_STATE,
    id: uuidv4(),
    startTime: Date.now()
  });

  const updateSession = useCallback((updates) => {
    setSession(prev => ({
      ...prev,
      ...updates
    }));
  }, []);

  const resetSession = useCallback(() => {
    setSession({
      ...INITIAL_SESSION_STATE,
      id: uuidv4(),
      startTime: Date.now()
    });
  }, []);

  return { session, updateSession, resetSession };
};

/**
 * Хук для управления статистикой чата
 */
export const useStats = (messages, session) => {
  const [stats, setStats] = useState(INITIAL_STATS_STATE);

  useEffect(() => {
    const updateStats = () => {
      const now = Date.now();
      const duration = Math.floor((now - session.startTime) / 60000);
      
      const messageCount = messages.filter(m => m.sender).length;
      const prevMessageCount = stats.messagesCount;
      const messageTrend = calculateTrend(messageCount, prevMessageCount);

      const tokenCount = session.tokensUsed;
      const prevTokenCount = stats.tokensUsed;
      const tokenTrend = calculateTrend(tokenCount, prevTokenCount);

      const avgResponseTime = calculateAverageResponseTime(session.responseTimes);
      const prevAvgResponseTime = stats.averageResponseTime;
      const responseTrend = calculateTrend(avgResponseTime, prevAvgResponseTime);

      setStats({
        messagesCount: messageCount,
        tokensUsed: tokenCount,
        averageResponseTime: avgResponseTime,
        sessionDuration: duration,
        trends: {
          messages: messageTrend,
          tokens: tokenTrend,
          responseTime: responseTrend
        }
      });
    };

    const timer = setInterval(updateStats, STATS_UPDATE_INTERVAL);
    updateStats();

    return () => clearInterval(timer);
  }, [messages, session, stats]);

  return { stats };
};

/**
 * Хук для управления активным агентом
 */
export const useAgent = () => {
  const [activeAgent, setActiveAgent] = useState(INITIAL_AGENT_STATE);

  const updateAgent = useCallback((updates) => {
    setActiveAgent(prev => ({
      ...prev,
      ...updates
    }));
  }, []);

  return { activeAgent, updateAgent };
};

/**
 * Хук для отправки сообщений
 */
export const useSendMessage = (session, activeAgent, updateSession, addMessage) => {
  const [isLoading, setIsLoading] = useState(false);

  const sendMessage = useCallback(async (message) => {
    const requestStartTime = Date.now();

    try {
      setIsLoading(true);
      addMessage({
        text: message,
        sender: SENDERS.USER
      });

      const response = await fetch(API_ENDPOINTS.CHAT, {
        method: 'POST',
        headers: HTTP_HEADERS,
        body: JSON.stringify({
          message,
          agentId: activeAgent.id,
          sessionId: session.id
        })
      });

      if (!response.ok) {
        throw new Error('Network response was not ok');
      }

      const data = await response.json();
      const responseTime = Math.round((Date.now() - requestStartTime) / 1000);

      updateSession({
        tokensUsed: session.tokensUsed + (data.tokensUsed || 0),
        responseTimes: [...session.responseTimes, responseTime],
        messageStats: updateMessageStats(session.messageStats, SENDERS.AI)
      });

      addMessage({
        text: data.response,
        sender: SENDERS.AI
      });

      return true;
    } catch (error) {
      console.error('Error sending message:', error);
      addMessage({
        type: SENDERS.SYSTEM,
        text: SYSTEM_MESSAGES.NETWORK_ERROR,
        messageType: MESSAGE_TYPES.ERROR
      });
      return false;
    } finally {
      setIsLoading(false);
    }
  }, [session, activeAgent, updateSession, addMessage]);

  return { isLoading, sendMessage };
};

/**
 * Хук для управления командами чата
 */
export const useCommands = () => {
  const [showCommands, setShowCommands] = useState(false);

  const toggleCommands = useCallback((show) => {
    setShowCommands(show);
  }, []);

  return { showCommands, toggleCommands };
};

/**
 * Хук для управления настройками чата
 */
export const useSettings = () => {
  const [showSettings, setShowSettings] = useState(false);

  const toggleSettings = useCallback((show) => {
    setShowSettings(show);
  }, []);

  return { showSettings, toggleSettings };
};
