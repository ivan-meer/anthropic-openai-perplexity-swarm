import React from 'react';
import { fireEvent, waitFor } from '@testing-library/react';
import { renderWithTheme } from './testUtils';
import ChatPage from '../index';
import {
  mockMessages,
  mockSession,
  mockStats,
  mockAgent,
  mockApiResponse
} from './__mocks__/mockData';

// Mock компонентов
jest.mock('../../ChatInput', () => {
  return jest.fn(({ onSubmit, value, onChange }) => (
    <form onSubmit={onSubmit}>
      <input
        data-testid="chat-input"
        value={value}
        onChange={onChange}
        placeholder="Введите сообщение... (/ для команд)"
      />
    </form>
  ));
});

jest.mock('../../ChatMessage', () => {
  return jest.fn(({ message, onAction }) => (
    <div data-testid="chat-message" onClick={() => onAction('copy', message)}>
      {message.text}
    </div>
  ));
});

jest.mock('../../ChatStats', () => {
  return jest.fn(({ messagesCount, tokensUsed }) => (
    <div data-testid="chat-stats">
      Messages: {messagesCount}, Tokens: {tokensUsed}
    </div>
  ));
});

jest.mock('../../AgentSettings', () => {
  return jest.fn(({ agent, onSave, onClose }) => (
    <div data-testid="agent-settings">
      <button onClick={() => onSave({ name: 'Updated Agent' })}>Save</button>
      <button onClick={onClose}>Close</button>
    </div>
  ));
});

describe('ChatPage Integration', () => {
  beforeEach(() => {
    global.fetch = jest.fn(() =>
      Promise.resolve({
        ok: true,
        json: () => Promise.resolve(mockApiResponse)
      })
    );
    global.navigator.clipboard = { writeText: jest.fn() };
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('Message Flow', () => {
    it('sends message and receives response', async () => {
      const { getByTestId } = renderWithTheme(<ChatPage />);
      
      const input = getByTestId('chat-input');
      fireEvent.change(input, { target: { value: 'Test message' } });
      fireEvent.submit(input.closest('form'));

      await waitFor(() => {
        expect(fetch).toHaveBeenCalledWith(
          '/api/chat',
          expect.objectContaining({
            method: 'POST',
            body: expect.stringContaining('Test message')
          })
        );
      });
    });

    it('updates stats after message exchange', async () => {
      const { getByTestId } = renderWithTheme(<ChatPage />);
      
      const input = getByTestId('chat-input');
      fireEvent.change(input, { target: { value: 'Test message' } });
      fireEvent.submit(input.closest('form'));

      await waitFor(() => {
        const stats = getByTestId('chat-stats');
        expect(stats).toHaveTextContent('Messages: 1');
      });
    });
  });

  describe('Agent Settings', () => {
    it('updates agent settings and shows confirmation', async () => {
      const { getByText, getByTestId } = renderWithTheme(<ChatPage />);
      
      // Открываем настройки
      fireEvent.click(getByText('Settings'));

      // Сохраняем новые настройки
      const settings = getByTestId('agent-settings');
      fireEvent.click(settings.querySelector('button'));

      await waitFor(() => {
        expect(getByText('Настройки агента успешно обновлены')).toBeInTheDocument();
      });
    });
  });

  describe('Message Actions', () => {
    it('copies message to clipboard', async () => {
      const { getAllByTestId } = renderWithTheme(<ChatPage />);
      
      const messages = getAllByTestId('chat-message');
      fireEvent.click(messages[0]);

      await waitFor(() => {
        expect(navigator.clipboard.writeText).toHaveBeenCalled();
      });
    });
  });

  describe('Commands', () => {
    it('handles /reset command', async () => {
      const { getByTestId, queryByText } = renderWithTheme(<ChatPage />);
      
      const input = getByTestId('chat-input');
      fireEvent.change(input, { target: { value: '/reset' } });
      fireEvent.submit(input.closest('form'));

      await waitFor(() => {
        expect(queryByText('История чата очищена')).toBeInTheDocument();
      });
    });

    it('handles /stats command', async () => {
      const { getByTestId, getByText } = renderWithTheme(<ChatPage />);
      
      const input = getByTestId('chat-input');
      fireEvent.change(input, { target: { value: '/stats' } });
      fireEvent.submit(input.closest('form'));

      await waitFor(() => {
        expect(getByText(/Статистика сессии/)).toBeInTheDocument();
      });
    });
  });

  describe('Error Handling', () => {
    it('shows error message on network failure', async () => {
      global.fetch = jest.fn(() => Promise.reject(new Error('Network error')));
      
      const { getByTestId, getByText } = renderWithTheme(<ChatPage />);
      
      const input = getByTestId('chat-input');
      fireEvent.change(input, { target: { value: 'Test message' } });
      fireEvent.submit(input.closest('form'));

      await waitFor(() => {
        expect(getByText(/Произошла ошибка/)).toBeInTheDocument();
      });
    });
  });

  describe('Session Management', () => {
    it('starts new session with /newsession command', async () => {
      const { getByTestId, getByText } = renderWithTheme(<ChatPage />);
      
      const input = getByTestId('chat-input');
      fireEvent.change(input, { target: { value: '/newsession' } });
      fireEvent.submit(input.closest('form'));

      await waitFor(() => {
        expect(getByText('Начата новая сессия чата')).toBeInTheDocument();
      });
    });
  });

  describe('Export Functionality', () => {
    it('exports chat history', async () => {
      // Mock URL and document APIs
      const mockURL = { createObjectURL: jest.fn(), revokeObjectURL: jest.fn() };
      const mockLink = { click: jest.fn(), remove: jest.fn() };
      
      global.URL = mockURL;
      document.createElement = jest.fn(() => mockLink);
      document.body.appendChild = jest.fn();
      document.body.removeChild = jest.fn();

      const { getByTestId } = renderWithTheme(<ChatPage />);
      
      const input = getByTestId('chat-input');
      fireEvent.change(input, { target: { value: '/export' } });
      fireEvent.submit(input.closest('form'));

      await waitFor(() => {
        expect(mockURL.createObjectURL).toHaveBeenCalled();
        expect(mockLink.click).toHaveBeenCalled();
      });
    });
  });

  describe('Performance', () => {
    it('updates stats periodically', async () => {
      jest.useFakeTimers();
      
      const { getByTestId } = renderWithTheme(<ChatPage />);
      
      // Имитируем прошествие времени
      jest.advanceTimersByTime(60000);

      const stats = getByTestId('chat-stats');
      expect(stats).toHaveTextContent('Messages:');

      jest.useRealTimers();
    });
  });

  describe('Accessibility', () => {
    it('maintains focus after sending message', async () => {
      const { getByTestId } = renderWithTheme(<ChatPage />);
      
      const input = getByTestId('chat-input');
      fireEvent.change(input, { target: { value: 'Test message' } });
      fireEvent.submit(input.closest('form'));

      await waitFor(() => {
        expect(document.activeElement).toBe(input);
      });
    });
  });

  describe('Component Integration', () => {
    it('integrates with ChatStats component', () => {
      const { getByTestId } = renderWithTheme(<ChatPage />);
      expect(getByTestId('chat-stats')).toBeInTheDocument();
    });

    it('integrates with AgentSettings component', () => {
      const { getByText, getByTestId } = renderWithTheme(<ChatPage />);
      
      fireEvent.click(getByText('Settings'));
      expect(getByTestId('agent-settings')).toBeInTheDocument();
    });

    it('integrates with ChatMessage component', () => {
      const { getAllByTestId } = renderWithTheme(<ChatPage />);
      expect(getAllByTestId('chat-message')).toHaveLength(expect.any(Number));
    });
  });
});
