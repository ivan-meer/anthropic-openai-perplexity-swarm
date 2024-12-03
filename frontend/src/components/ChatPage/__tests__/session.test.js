import React from 'react';
import { render, fireEvent, waitFor } from '@testing-library/react';
import { renderWithTheme } from './testUtils';
import ChatPage from '../index';
import { mockMessages, mockAgent } from './__mocks__/mockData';

describe('ChatPage Session Management', () => {
  beforeEach(() => {
    localStorage.clear();
    sessionStorage.clear();
  });

  describe('Session Creation', () => {
    it('creates new session on initial load', () => {
      const { getByTestId } = renderWithTheme(<ChatPage />);
      const sessionInfo = getByTestId('session-info');

      expect(sessionInfo).toHaveTextContent(/новая сессия/i);
      expect(sessionStorage.getItem('currentSession')).toBeTruthy();
    });

    it('generates unique session ID', () => {
      const { rerender } = renderWithTheme(<ChatPage />);
      const firstSessionId = JSON.parse(sessionStorage.getItem('currentSession')).id;

      sessionStorage.clear();
      rerender(<ChatPage />);
      const secondSessionId = JSON.parse(sessionStorage.getItem('currentSession')).id;

      expect(firstSessionId).not.toBe(secondSessionId);
    });

    it('initializes session with default values', () => {
      renderWithTheme(<ChatPage />);
      const session = JSON.parse(sessionStorage.getItem('currentSession'));

      expect(session).toEqual({
        id: expect.any(String),
        startTime: expect.any(Number),
        tokensUsed: 0,
        messagesCount: 0,
        agent: expect.any(Object)
      });
    });
  });

  describe('Session State', () => {
    it('updates session stats on message send', async () => {
      const { getByRole } = renderWithTheme(<ChatPage />);
      const input = getByRole('textbox');

      fireEvent.change(input, { target: { value: 'Test message' } });
      fireEvent.submit(input.closest('form'));

      await waitFor(() => {
        const session = JSON.parse(sessionStorage.getItem('currentSession'));
        expect(session.messagesCount).toBe(1);
      });
    });

    it('tracks token usage', async () => {
      const { getByRole } = renderWithTheme(<ChatPage />);
      const input = getByRole('textbox');

      fireEvent.change(input, { target: { value: 'Test message' } });
      fireEvent.submit(input.closest('form'));

      await waitFor(() => {
        const session = JSON.parse(sessionStorage.getItem('currentSession'));
        expect(session.tokensUsed).toBeGreaterThan(0);
      });
    });

    it('updates session duration', async () => {
      jest.useFakeTimers();
      const { getByTestId } = renderWithTheme(<ChatPage />);

      jest.advanceTimersByTime(60000); // 1 минута
      const sessionInfo = getByTestId('session-info');

      expect(sessionInfo).toHaveTextContent(/1 мин/i);
      jest.useRealTimers();
    });
  });

  describe('Session Recovery', () => {
    it('recovers session after page reload', () => {
      const session = {
        id: 'test-session',
        startTime: Date.now(),
        tokensUsed: 100,
        messagesCount: 5,
        agent: mockAgent
      };
      sessionStorage.setItem('currentSession', JSON.stringify(session));

      const { getByTestId } = renderWithTheme(<ChatPage />);
      const sessionInfo = getByTestId('session-info');

      expect(sessionInfo).toHaveTextContent(/test-session/);
    });

    it('handles corrupted session data', () => {
      sessionStorage.setItem('currentSession', 'invalid-json');

      const { getByTestId } = renderWithTheme(<ChatPage />);
      const sessionInfo = getByTestId('session-info');

      expect(sessionInfo).toHaveTextContent(/новая сессия/i);
    });
  });

  describe('Session Commands', () => {
    it('starts new session with /newsession command', async () => {
      const { getByRole } = renderWithTheme(<ChatPage />);
      const input = getByRole('textbox');
      const oldSession = JSON.parse(sessionStorage.getItem('currentSession'));

      fireEvent.change(input, { target: { value: '/newsession' } });
      fireEvent.submit(input.closest('form'));

      await waitFor(() => {
        const newSession = JSON.parse(sessionStorage.getItem('currentSession'));
        expect(newSession.id).not.toBe(oldSession.id);
      });
    });

    it('exports session data with /export command', async () => {
      const { getByRole } = renderWithTheme(<ChatPage />);
      const input = getByRole('textbox');

      // Мокируем создание и скачивание файла
      const mockCreateElement = jest.spyOn(document, 'createElement');
      const mockClick = jest.fn();
      mockCreateElement.mockReturnValue({ click: mockClick });

      fireEvent.change(input, { target: { value: '/export' } });
      fireEvent.submit(input.closest('form'));

      expect(mockClick).toHaveBeenCalled();
    });
  });

  describe('Session Persistence', () => {
    it('saves session state periodically', async () => {
      jest.useFakeTimers();
      const { getByRole } = renderWithTheme(<ChatPage />);
      const input = getByRole('textbox');

      fireEvent.change(input, { target: { value: 'Test message' } });
      fireEvent.submit(input.closest('form'));

      jest.advanceTimersByTime(30000); // 30 секунд

      const savedSession = JSON.parse(sessionStorage.getItem('currentSession'));
      expect(savedSession.messagesCount).toBe(1);

      jest.useRealTimers();
    });

    it('handles storage quota exceeded', async () => {
      const { getByRole, getByText } = renderWithTheme(<ChatPage />);
      const input = getByRole('textbox');

      // Симулируем превышение квоты хранилища
      Object.defineProperty(sessionStorage, 'setItem', {
        writable: true,
        value: jest.fn(() => {
          throw new Error('QuotaExceededError');
        })
      });

      fireEvent.change(input, { target: { value: 'Test message' } });
      fireEvent.submit(input.closest('form'));

      await waitFor(() => {
        expect(getByText(/ошибка сохранения сессии/i)).toBeInTheDocument();
      });
    });
  });

  describe('Session Cleanup', () => {
    it('cleans up old sessions', async () => {
      const oldSession = {
        id: 'old-session',
        startTime: Date.now() - 8 * 24 * 60 * 60 * 1000, // 8 дней назад
        tokensUsed: 100,
        messagesCount: 5
      };
      localStorage.setItem('sessions', JSON.stringify([oldSession]));

      renderWithTheme(<ChatPage />);

      await waitFor(() => {
        const sessions = JSON.parse(localStorage.getItem('sessions'));
        expect(sessions).not.toContainEqual(expect.objectContaining({ id: 'old-session' }));
      });
    });

    it('limits number of stored sessions', async () => {
      const manySessions = Array.from({ length: 100 }, (_, i) => ({
        id: `session-${i}`,
        startTime: Date.now(),
        tokensUsed: i,
        messagesCount: i
      }));
      localStorage.setItem('sessions', JSON.stringify(manySessions));

      renderWithTheme(<ChatPage />);

      await waitFor(() => {
        const sessions = JSON.parse(localStorage.getItem('sessions'));
        expect(sessions.length).toBeLessThanOrEqual(50);
      });
    });
  });

  describe('Session Statistics', () => {
    it('calculates session statistics', async () => {
      const { getByRole, getByTestId } = renderWithTheme(<ChatPage />);
      const input = getByRole('textbox');

      // Отправляем несколько сообщений
      for (let i = 0; i < 3; i++) {
        fireEvent.change(input, { target: { value: `Message ${i}` } });
        fireEvent.submit(input.closest('form'));
      }

      await waitFor(() => {
        const stats = getByTestId('session-stats');
        expect(stats).toHaveTextContent(/сообщений: 3/i);
        expect(stats).toHaveTextContent(/токенов/i);
        expect(stats).toHaveTextContent(/среднее время ответа/i);
      });
    });

    it('tracks response times', async () => {
      const { getByRole, getByTestId } = renderWithTheme(<ChatPage />);
      const input = getByRole('textbox');

      fireEvent.change(input, { target: { value: 'Test message' } });
      fireEvent.submit(input.closest('form'));

      await waitFor(() => {
        const session = JSON.parse(sessionStorage.getItem('currentSession'));
        expect(session.responseTimes).toBeDefined();
        expect(session.responseTimes).toHaveLength(1);
      });
    });
  });

  describe('Multi-Tab Support', () => {
    it('handles session updates from other tabs', async () => {
      const { getByTestId } = renderWithTheme(<ChatPage />);

      // Симулируем обновление сессии из другой вкладки
      const storageEvent = new StorageEvent('storage', {
        key: 'currentSession',
        newValue: JSON.stringify({
          id: 'test-session',
          startTime: Date.now(),
          tokensUsed: 200,
          messagesCount: 10
        })
      });
      window.dispatchEvent(storageEvent);

      await waitFor(() => {
        const sessionInfo = getByTestId('session-info');
        expect(sessionInfo).toHaveTextContent(/test-session/);
      });
    });

    it('synchronizes session state between tabs', async () => {
      const { getByRole } = renderWithTheme(<ChatPage />);
      const input = getByRole('textbox');

      fireEvent.change(input, { target: { value: 'Test message' } });
      fireEvent.submit(input.closest('form'));

      // Симулируем получение обновления из другой вкладки
      const storageEvent = new StorageEvent('storage', {
        key: 'currentSession',
        newValue: sessionStorage.getItem('currentSession')
      });
      window.dispatchEvent(storageEvent);

      await waitFor(() => {
        const session = JSON.parse(sessionStorage.getItem('currentSession'));
        expect(session.messagesCount).toBe(1);
      });
    });
  });
});
