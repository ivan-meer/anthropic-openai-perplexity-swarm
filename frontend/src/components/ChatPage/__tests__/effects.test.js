import React from 'react';
import { render, fireEvent, waitFor, act } from '@testing-library/react';
import { renderWithTheme } from './testUtils';
import ChatPage from '../index';
import { mockMessages, mockAgent } from './__mocks__/mockData';

describe('ChatPage Effects', () => {
  describe('Initial Effects', () => {
    beforeEach(() => {
      jest.useFakeTimers();
    });

    afterEach(() => {
      jest.useRealTimers();
    });

    it('runs initialization effects', () => {
      const initSpy = jest.spyOn(React, 'useEffect');
      renderWithTheme(<ChatPage />);

      expect(initSpy).toHaveBeenCalledWith(expect.any(Function), []);
    });

    it('loads saved state on mount', () => {
      localStorage.setItem('chatState', JSON.stringify({
        messages: mockMessages,
        agent: mockAgent
      }));

      const { getByTestId } = renderWithTheme(<ChatPage />);
      const messagesContainer = getByTestId('messages-container');

      expect(messagesContainer.children).toHaveLength(mockMessages.length);
    });

    it('sets up event listeners on mount', () => {
      const addEventListenerSpy = jest.spyOn(window, 'addEventListener');
      renderWithTheme(<ChatPage />);

      expect(addEventListenerSpy).toHaveBeenCalledWith(
        'resize',
        expect.any(Function)
      );
      expect(addEventListenerSpy).toHaveBeenCalledWith(
        'online',
        expect.any(Function)
      );
    });
  });

  describe('Dependency Effects', () => {
    it('updates on message changes', async () => {
      const { getByRole, getByTestId } = renderWithTheme(<ChatPage />);
      const input = getByRole('textbox');

      fireEvent.change(input, { target: { value: 'Test message' } });
      fireEvent.submit(input.closest('form'));

      await waitFor(() => {
        const messagesContainer = getByTestId('messages-container');
        expect(messagesContainer.children).toHaveLength(1);
      });
    });

    it('updates on agent changes', async () => {
      const { rerender, getByTestId } = renderWithTheme(
        <ChatPage initialAgent={mockAgent} />
      );

      const updatedAgent = { ...mockAgent, name: 'Updated Agent' };
      rerender(<ChatPage initialAgent={updatedAgent} />);

      const agentInfo = getByTestId('agent-info');
      expect(agentInfo).toHaveTextContent('Updated Agent');
    });

    it('updates on theme changes', async () => {
      const { container, rerender } = renderWithTheme(<ChatPage theme="light" />);

      rerender(<ChatPage theme="dark" />);

      expect(container.firstChild).toHaveAttribute('data-theme', 'dark');
    });
  });

  describe('Cleanup Effects', () => {
    it('cleans up event listeners on unmount', () => {
      const removeEventListenerSpy = jest.spyOn(window, 'removeEventListener');
      const { unmount } = renderWithTheme(<ChatPage />);

      unmount();

      expect(removeEventListenerSpy).toHaveBeenCalledWith(
        'resize',
        expect.any(Function)
      );
      expect(removeEventListenerSpy).toHaveBeenCalledWith(
        'online',
        expect.any(Function)
      );
    });

    it('saves state on unmount', () => {
      const { getByRole, unmount } = renderWithTheme(<ChatPage />);
      const input = getByRole('textbox');

      fireEvent.change(input, { target: { value: 'Test message' } });
      fireEvent.submit(input.closest('form'));

      unmount();

      const savedState = JSON.parse(localStorage.getItem('chatState'));
      expect(savedState.messages).toHaveLength(1);
    });

    it('cancels pending requests on unmount', () => {
      const abortSpy = jest.fn();
      const mockAbortController = { abort: abortSpy };
      jest.spyOn(window, 'AbortController').mockImplementation(() => mockAbortController);

      const { unmount } = renderWithTheme(<ChatPage />);
      unmount();

      expect(abortSpy).toHaveBeenCalled();
    });
  });

  describe('Timer Effects', () => {
    beforeEach(() => {
      jest.useFakeTimers();
    });

    afterEach(() => {
      jest.useRealTimers();
    });

    it('updates session duration periodically', () => {
      const { getByTestId } = renderWithTheme(<ChatPage />);

      act(() => {
        jest.advanceTimersByTime(60000); // 1 минута
      });

      const sessionInfo = getByTestId('session-info');
      expect(sessionInfo).toHaveTextContent(/1 мин/);
    });

    it('auto-saves state periodically', () => {
      const { getByRole } = renderWithTheme(<ChatPage />);
      const input = getByRole('textbox');

      fireEvent.change(input, { target: { value: 'Test message' } });
      fireEvent.submit(input.closest('form'));

      act(() => {
        jest.advanceTimersByTime(300000); // 5 минут
      });

      const savedState = JSON.parse(localStorage.getItem('chatState'));
      expect(savedState.messages).toHaveLength(1);
    });

    it('cleans up timers on unmount', () => {
      const { unmount } = renderWithTheme(<ChatPage />);
      const clearIntervalSpy = jest.spyOn(window, 'clearInterval');

      unmount();

      expect(clearIntervalSpy).toHaveBeenCalled();
    });
  });

  describe('Network Effects', () => {
    it('reconnects WebSocket on connection loss', async () => {
      const mockWebSocket = {
        addEventListener: jest.fn(),
        removeEventListener: jest.fn(),
        close: jest.fn()
      };
      global.WebSocket = jest.fn(() => mockWebSocket);

      renderWithTheme(<ChatPage />);

      // Симулируем потерю соединения
      act(() => {
        window.dispatchEvent(new Event('offline'));
      });

      // Симулируем восстановление соединения
      act(() => {
        window.dispatchEvent(new Event('online'));
      });

      expect(global.WebSocket).toHaveBeenCalledTimes(2);
    });

    it('retries failed requests', async () => {
      const fetchSpy = jest.spyOn(global, 'fetch')
        .mockImplementationOnce(() => Promise.reject(new Error('Network error')))
        .mockImplementationOnce(() => Promise.resolve({
          ok: true,
          json: () => Promise.resolve({ response: 'Success' })
        }));

      const { getByRole } = renderWithTheme(<ChatPage />);
      const input = getByRole('textbox');

      fireEvent.change(input, { target: { value: 'Test message' } });
      fireEvent.submit(input.closest('form'));

      await waitFor(() => {
        expect(fetchSpy).toHaveBeenCalledTimes(2);
      });
    });
  });

  describe('Side Effects', () => {
    it('scrolls to bottom on new message', async () => {
      const { getByRole, getByTestId } = renderWithTheme(<ChatPage />);
      const input = getByRole('textbox');
      const container = getByTestId('messages-container');

      const scrollIntoViewMock = jest.fn();
      Element.prototype.scrollIntoView = scrollIntoViewMock;

      fireEvent.change(input, { target: { value: 'Test message' } });
      fireEvent.submit(input.closest('form'));

      await waitFor(() => {
        expect(scrollIntoViewMock).toHaveBeenCalled();
      });
    });

    it('focuses input after command selection', async () => {
      const { getByRole, getAllByRole } = renderWithTheme(<ChatPage />);
      const input = getByRole('textbox');

      fireEvent.change(input, { target: { value: '/' } });
      const suggestions = getAllByRole('option');

      fireEvent.click(suggestions[0]);

      expect(document.activeElement).toBe(input);
    });

    it('updates document title on new message', async () => {
      const { getByRole } = renderWithTheme(<ChatPage />);
      const input = getByRole('textbox');

      fireEvent.change(input, { target: { value: 'Test message' } });
      fireEvent.submit(input.closest('form'));

      await waitFor(() => {
        expect(document.title).toContain('Новое сообщение');
      });
    });
  });

  describe('Effect Dependencies', () => {
    it('handles effect dependency changes correctly', async () => {
      const effectSpy = jest.spyOn(React, 'useEffect');
      const { rerender } = renderWithTheme(<ChatPage theme="light" />);

      const initialCallCount = effectSpy.mock.calls.length;
      rerender(<ChatPage theme="dark" />);

      expect(effectSpy.mock.calls.length).toBeGreaterThan(initialCallCount);
    });

    it('skips effects when dependencies haven\'t changed', async () => {
      const effectSpy = jest.spyOn(React, 'useEffect');
      const { rerender } = renderWithTheme(<ChatPage theme="light" />);

      const initialCallCount = effectSpy.mock.calls.length;
      rerender(<ChatPage theme="light" />);

      expect(effectSpy.mock.calls.length).toBe(initialCallCount);
    });
  });
});
