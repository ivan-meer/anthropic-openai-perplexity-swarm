import React from 'react';
import { render, fireEvent, waitFor } from '@testing-library/react';
import { renderWithTheme } from './testUtils';
import ChatPage from '../index';
import { mockMessages } from './__mocks__/mockData';

// Мок для fetch
const mockFetch = jest.fn();
global.fetch = mockFetch;

// Мок для navigator.onLine
const mockOnline = jest.fn();
Object.defineProperty(navigator, 'onLine', {
  get: () => mockOnline(),
  configurable: true
});

describe('ChatPage Network', () => {
  beforeEach(() => {
    mockFetch.mockClear();
    mockOnline.mockReturnValue(true);
  });

  describe('API Requests', () => {
    it('sends messages with correct format', async () => {
      const { getByRole } = renderWithTheme(<ChatPage />);
      const input = getByRole('textbox');

      mockFetch.mockImplementationOnce(() =>
        Promise.resolve({
          ok: true,
          json: () => Promise.resolve({ response: 'Test response' })
        })
      );

      fireEvent.change(input, { target: { value: 'Test message' } });
      fireEvent.submit(input.closest('form'));

      await waitFor(() => {
        expect(mockFetch).toHaveBeenCalledWith(
          expect.any(String),
          expect.objectContaining({
            method: 'POST',
            headers: {
              'Content-Type': 'application/json'
            },
            body: expect.stringContaining('Test message')
          })
        );
      });
    });

    it('includes authentication headers', async () => {
      const { getByRole } = renderWithTheme(<ChatPage />);
      const input = getByRole('textbox');

      fireEvent.change(input, { target: { value: 'Test message' } });
      fireEvent.submit(input.closest('form'));

      await waitFor(() => {
        expect(mockFetch).toHaveBeenCalledWith(
          expect.any(String),
          expect.objectContaining({
            headers: expect.objectContaining({
              'Authorization': expect.stringMatching(/Bearer .+/)
            })
          })
        );
      });
    });

    it('handles rate limiting', async () => {
      const { getByRole, getByText } = renderWithTheme(<ChatPage />);
      const input = getByRole('textbox');

      mockFetch.mockImplementationOnce(() =>
        Promise.resolve({
          ok: false,
          status: 429,
          json: () => Promise.resolve({ error: 'Too many requests' })
        })
      );

      fireEvent.change(input, { target: { value: 'Test message' } });
      fireEvent.submit(input.closest('form'));

      await waitFor(() => {
        expect(getByText(/превышен лимит запросов/i)).toBeInTheDocument();
      });
    });
  });

  describe('Network Status', () => {
    it('handles offline state', async () => {
      mockOnline.mockReturnValue(false);
      const { getByRole, getByText } = renderWithTheme(<ChatPage />);
      const input = getByRole('textbox');

      fireEvent.change(input, { target: { value: 'Test message' } });
      fireEvent.submit(input.closest('form'));

      await waitFor(() => {
        expect(getByText(/отсутствует подключение/i)).toBeInTheDocument();
      });
    });

    it('queues messages when offline', async () => {
      mockOnline.mockReturnValue(false);
      const { getByRole } = renderWithTheme(<ChatPage />);
      const input = getByRole('textbox');

      fireEvent.change(input, { target: { value: 'Test message' } });
      fireEvent.submit(input.closest('form'));

      expect(localStorage.getItem('queuedMessages')).toBeTruthy();
    });

    it('sends queued messages when back online', async () => {
      mockOnline.mockReturnValue(false);
      const { getByRole } = renderWithTheme(<ChatPage />);
      const input = getByRole('textbox');

      fireEvent.change(input, { target: { value: 'Test message' } });
      fireEvent.submit(input.closest('form'));

      mockOnline.mockReturnValue(true);
      window.dispatchEvent(new Event('online'));

      await waitFor(() => {
        expect(mockFetch).toHaveBeenCalled();
      });
    });
  });

  describe('Request Retries', () => {
    it('retries failed requests', async () => {
      mockFetch
        .mockImplementationOnce(() => Promise.reject(new Error('Network error')))
        .mockImplementationOnce(() =>
          Promise.resolve({
            ok: true,
            json: () => Promise.resolve({ response: 'Success' })
          })
        );

      const { getByRole, getByText } = renderWithTheme(<ChatPage />);
      const input = getByRole('textbox');

      fireEvent.change(input, { target: { value: 'Test message' } });
      fireEvent.submit(input.closest('form'));

      await waitFor(() => {
        expect(getByText(/ошибка/i)).toBeInTheDocument();
      });

      fireEvent.click(getByText(/повторить/i));

      await waitFor(() => {
        expect(mockFetch).toHaveBeenCalledTimes(2);
      });
    });

    it('implements exponential backoff', async () => {
      jest.useFakeTimers();

      mockFetch.mockImplementation(() => Promise.reject(new Error('Network error')));

      const { getByRole } = renderWithTheme(<ChatPage />);
      const input = getByRole('textbox');

      fireEvent.change(input, { target: { value: 'Test message' } });
      fireEvent.submit(input.closest('form'));

      await waitFor(() => {
        expect(mockFetch).toHaveBeenCalledTimes(1);
      });

      jest.advanceTimersByTime(1000);
      expect(mockFetch).toHaveBeenCalledTimes(2);

      jest.advanceTimersByTime(2000);
      expect(mockFetch).toHaveBeenCalledTimes(3);

      jest.useRealTimers();
    });
  });

  describe('Request Caching', () => {
    it('caches successful responses', async () => {
      const { getByRole } = renderWithTheme(<ChatPage />);
      const input = getByRole('textbox');

      mockFetch.mockImplementationOnce(() =>
        Promise.resolve({
          ok: true,
          json: () => Promise.resolve({ response: 'Cached response' })
        })
      );

      // Первый запрос
      fireEvent.change(input, { target: { value: 'Test message' } });
      fireEvent.submit(input.closest('form'));

      await waitFor(() => {
        expect(mockFetch).toHaveBeenCalledTimes(1);
      });

      // Повторный запрос с тем же сообщением
      fireEvent.change(input, { target: { value: 'Test message' } });
      fireEvent.submit(input.closest('form'));

      await waitFor(() => {
        expect(mockFetch).toHaveBeenCalledTimes(1); // Запрос не должен повториться
      });
    });

    it('invalidates cache after timeout', async () => {
      jest.useFakeTimers();

      const { getByRole } = renderWithTheme(<ChatPage />);
      const input = getByRole('textbox');

      mockFetch.mockImplementation(() =>
        Promise.resolve({
          ok: true,
          json: () => Promise.resolve({ response: 'Test response' })
        })
      );

      // Первый запрос
      fireEvent.change(input, { target: { value: 'Test message' } });
      fireEvent.submit(input.closest('form'));

      await waitFor(() => {
        expect(mockFetch).toHaveBeenCalledTimes(1);
      });

      jest.advanceTimersByTime(60000); // 1 минута

      // Повторный запрос после истечения кеша
      fireEvent.change(input, { target: { value: 'Test message' } });
      fireEvent.submit(input.closest('form'));

      await waitFor(() => {
        expect(mockFetch).toHaveBeenCalledTimes(2);
      });

      jest.useRealTimers();
    });
  });

  describe('Request Batching', () => {
    it('batches multiple requests', async () => {
      const { getByRole } = renderWithTheme(<ChatPage />);
      const input = getByRole('textbox');

      // Быстрая отправка нескольких сообщений
      for (let i = 0; i < 5; i++) {
        fireEvent.change(input, { target: { value: `Message ${i}` } });
        fireEvent.submit(input.closest('form'));
      }

      await waitFor(() => {
        expect(mockFetch).toHaveBeenCalledTimes(1);
        expect(JSON.parse(mockFetch.mock.calls[0][1].body).messages).toHaveLength(5);
      });
    });

    it('respects batch size limits', async () => {
      const { getByRole } = renderWithTheme(<ChatPage />);
      const input = getByRole('textbox');

      // Отправка большого количества сообщений
      for (let i = 0; i < 20; i++) {
        fireEvent.change(input, { target: { value: `Message ${i}` } });
        fireEvent.submit(input.closest('form'));
      }

      await waitFor(() => {
        const calls = mockFetch.mock.calls;
        calls.forEach(call => {
          expect(JSON.parse(call[1].body).messages.length).toBeLessThanOrEqual(10);
        });
      });
    });
  });

  describe('WebSocket Connection', () => {
    let mockWebSocket;

    beforeEach(() => {
      mockWebSocket = {
        send: jest.fn(),
        close: jest.fn(),
        addEventListener: jest.fn(),
        removeEventListener: jest.fn()
      };
      global.WebSocket = jest.fn(() => mockWebSocket);
    });

    it('establishes WebSocket connection', () => {
      renderWithTheme(<ChatPage />);
      expect(global.WebSocket).toHaveBeenCalled();
    });

    it('handles WebSocket messages', async () => {
      const { getByText } = renderWithTheme(<ChatPage />);

      const message = { type: 'update', data: 'New message' };
      const messageEvent = new MessageEvent('message', {
        data: JSON.stringify(message)
      });

      mockWebSocket.addEventListener.mock.calls[0][1](messageEvent);

      await waitFor(() => {
        expect(getByText('New message')).toBeInTheDocument();
      });
    });

    it('reconnects on connection loss', async () => {
      renderWithTheme(<ChatPage />);

      const closeEvent = new CloseEvent('close');
      mockWebSocket.addEventListener.mock.calls[1][1](closeEvent);

      await waitFor(() => {
        expect(global.WebSocket).toHaveBeenCalledTimes(2);
      });
    });
  });
});
