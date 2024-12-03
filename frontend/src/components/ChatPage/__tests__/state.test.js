import React from 'react';
import { renderHook, act } from '@testing-library/react-hooks';
import { render, fireEvent, waitFor } from '@testing-library/react';
import { renderWithTheme } from './testUtils';
import ChatPage from '../index';
import { mockMessages, mockAgent } from './__mocks__/mockData';
import {
  useMessages,
  useSession,
  useStats,
  useAgent,
  useSendMessage,
  useCommands,
  useSettings
} from '../hooks';

describe('ChatPage State Management', () => {
  describe('Messages State', () => {
    it('initializes with empty messages array', () => {
      const { result } = renderHook(() => useMessages(mockAgent));
      expect(result.current.messages).toEqual([
        expect.objectContaining({
          type: 'system',
          text: expect.any(String),
          timestamp: expect.any(Date)
        })
      ]);
    });

    it('adds new messages correctly', () => {
      const { result } = renderHook(() => useMessages(mockAgent));

      act(() => {
        result.current.addMessage({
          text: 'Test message',
          sender: 'user',
          timestamp: new Date()
        });
      });

      expect(result.current.messages).toHaveLength(2);
    });

    it('maintains message order', () => {
      const { result } = renderHook(() => useMessages(mockAgent));

      act(() => {
        result.current.addMessage({ text: 'First', sender: 'user' });
        result.current.addMessage({ text: 'Second', sender: 'ai' });
      });

      expect(result.current.messages[1].text).toBe('First');
      expect(result.current.messages[2].text).toBe('Second');
    });
  });

  describe('Session State', () => {
    it('initializes new session with correct values', () => {
      const { result } = renderHook(() => useSession());

      expect(result.current.session).toEqual({
        id: expect.any(String),
        startTime: expect.any(Number),
        tokensUsed: 0,
        responseTimes: [],
        messageStats: {
          total: 0,
          user: 0,
          ai: 0
        }
      });
    });

    it('updates session stats correctly', () => {
      const { result } = renderHook(() => useSession());

      act(() => {
        result.current.updateSession({
          tokensUsed: 100,
          responseTimes: [1.5]
        });
      });

      expect(result.current.session.tokensUsed).toBe(100);
      expect(result.current.session.responseTimes).toContain(1.5);
    });
  });

  describe('Stats State', () => {
    it('calculates stats from messages and session', () => {
      const messages = [
        { sender: 'user', text: 'Test 1' },
        { sender: 'ai', text: 'Response 1' }
      ];
      const session = {
        tokensUsed: 50,
        responseTimes: [1.5, 2.0],
        startTime: Date.now() - 60000
      };

      const { result } = renderHook(() => useStats(messages, session));

      expect(result.current.stats).toEqual({
        messagesCount: 2,
        tokensUsed: 50,
        averageResponseTime: 1.75,
        sessionDuration: 1,
        trends: expect.any(Object)
      });
    });
  });

  describe('Agent State', () => {
    it('initializes with default agent', () => {
      const { result } = renderHook(() => useAgent());

      expect(result.current.activeAgent).toEqual({
        name: 'GPT Assistant',
        role: 'General Purpose AI',
        status: 'active'
      });
    });

    it('updates agent settings', () => {
      const { result } = renderHook(() => useAgent());

      act(() => {
        result.current.updateAgent({
          name: 'Custom Agent',
          role: 'Specialized AI'
        });
      });

      expect(result.current.activeAgent.name).toBe('Custom Agent');
      expect(result.current.activeAgent.role).toBe('Specialized AI');
    });
  });

  describe('UI State', () => {
    it('manages loading state', async () => {
      const { getByRole, getByTestId } = renderWithTheme(<ChatPage />);
      const input = getByRole('textbox');

      fireEvent.change(input, { target: { value: 'Test message' } });
      fireEvent.submit(input.closest('form'));

      expect(getByTestId('loading-indicator')).toBeInTheDocument();

      await waitFor(() => {
        expect(getByTestId('loading-indicator')).not.toBeInTheDocument();
      });
    });

    it('manages settings visibility', () => {
      const { result } = renderHook(() => useSettings());

      act(() => {
        result.current.toggleSettings(true);
      });

      expect(result.current.showSettings).toBe(true);

      act(() => {
        result.current.toggleSettings(false);
      });

      expect(result.current.showSettings).toBe(false);
    });
  });

  describe('Command State', () => {
    it('manages command visibility', () => {
      const { result } = renderHook(() => useCommands());

      act(() => {
        result.current.toggleCommands(true);
      });

      expect(result.current.showCommands).toBe(true);
    });

    it('handles command execution', async () => {
      const { getByRole, getByText } = renderWithTheme(<ChatPage />);
      const input = getByRole('textbox');

      fireEvent.change(input, { target: { value: '/help' } });
      fireEvent.submit(input.closest('form'));

      await waitFor(() => {
        expect(getByText(/доступные команды/i)).toBeInTheDocument();
      });
    });
  });

  describe('State Persistence', () => {
    beforeEach(() => {
      localStorage.clear();
    });

    it('persists session data', () => {
      const { rerender } = renderWithTheme(<ChatPage />);
      const sessionData = JSON.parse(localStorage.getItem('chatSession'));

      expect(sessionData).toBeDefined();
      expect(sessionData.id).toBeDefined();

      rerender(<ChatPage />);
      expect(JSON.parse(localStorage.getItem('chatSession')).id).toBe(sessionData.id);
    });

    it('persists agent settings', () => {
      const { getByText } = renderWithTheme(<ChatPage />);
      
      fireEvent.click(getByText('Настройки'));
      const settings = JSON.parse(localStorage.getItem('agentSettings'));

      expect(settings).toBeDefined();
      expect(settings.name).toBeDefined();
    });
  });

  describe('State Updates', () => {
    it('batches message updates', async () => {
      const { getByRole } = renderWithTheme(<ChatPage />);
      const input = getByRole('textbox');
      let renderCount = 0;

      const spy = jest.spyOn(React, 'createElement');
      spy.mockImplementation((...args) => {
        renderCount++;
        return args;
      });

      fireEvent.change(input, { target: { value: 'Test message' } });
      fireEvent.submit(input.closest('form'));

      await waitFor(() => {
        expect(renderCount).toBeLessThan(5);
      });
    });

    it('handles concurrent updates', async () => {
      const { getByRole } = renderWithTheme(<ChatPage />);
      const input = getByRole('textbox');

      // Симулируем одновременные обновления
      fireEvent.change(input, { target: { value: 'Message 1' } });
      fireEvent.submit(input.closest('form'));
      fireEvent.change(input, { target: { value: 'Message 2' } });
      fireEvent.submit(input.closest('form'));

      await waitFor(() => {
        const messages = document.querySelectorAll('[data-testid="chat-message"]');
        expect(messages).toHaveLength(2);
      });
    });
  });

  describe('State Dependencies', () => {
    it('updates stats when messages change', async () => {
      const { getByRole, getByTestId } = renderWithTheme(<ChatPage />);
      const input = getByRole('textbox');

      fireEvent.change(input, { target: { value: 'Test message' } });
      fireEvent.submit(input.closest('form'));

      await waitFor(() => {
        const stats = getByTestId('chat-stats');
        expect(stats).toHaveTextContent('1');
      });
    });

    it('updates UI when agent changes', () => {
      const { getByText } = renderWithTheme(<ChatPage />);
      
      fireEvent.click(getByText('Настройки'));
      fireEvent.click(getByText('Сохранить'));

      expect(getByText(/настройки агента успешно обновлены/i)).toBeInTheDocument();
    });
  });
});
