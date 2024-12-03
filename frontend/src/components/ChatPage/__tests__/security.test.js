import React from 'react';
import { render, fireEvent, waitFor } from '@testing-library/react';
import { renderWithTheme } from './testUtils';
import ChatPage from '../index';
import { mockMessages } from './__mocks__/mockData';

describe('ChatPage Security', () => {
  describe('Input Sanitization', () => {
    it('sanitizes user input', async () => {
      const { getByRole, getAllByTestId } = renderWithTheme(<ChatPage />);
      const input = getByRole('textbox');

      const xssPayload = '<script>alert("xss")</script>';
      fireEvent.change(input, { target: { value: xssPayload } });
      fireEvent.submit(input.closest('form'));

      await waitFor(() => {
        const messages = getAllByTestId('chat-message');
        const lastMessage = messages[messages.length - 1];
        expect(lastMessage).not.toContainHTML('<script>');
      });
    });

    it('escapes HTML in messages', async () => {
      const { getByRole, getAllByTestId } = renderWithTheme(<ChatPage />);
      const input = getByRole('textbox');

      const htmlPayload = '<img src="x" onerror="alert(1)">';
      fireEvent.change(input, { target: { value: htmlPayload } });
      fireEvent.submit(input.closest('form'));

      await waitFor(() => {
        const messages = getAllByTestId('chat-message');
        const lastMessage = messages[messages.length - 1];
        expect(lastMessage.innerHTML).toContain('&lt;img');
      });
    });

    it('prevents script injection in markdown', async () => {
      const { getByRole, getAllByTestId } = renderWithTheme(<ChatPage />);
      const input = getByRole('textbox');

      const markdownPayload = '[link](javascript:alert(1))';
      fireEvent.change(input, { target: { value: markdownPayload } });
      fireEvent.submit(input.closest('form'));

      await waitFor(() => {
        const messages = getAllByTestId('chat-message');
        const lastMessage = messages[messages.length - 1];
        expect(lastMessage.innerHTML).not.toContain('javascript:');
      });
    });
  });

  describe('Authentication', () => {
    it('includes auth token in requests', async () => {
      const mockFetch = jest.spyOn(global, 'fetch');
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

    it('handles token expiration', async () => {
      const mockFetch = jest.spyOn(global, 'fetch')
        .mockImplementationOnce(() => Promise.reject({ status: 401 }))
        .mockImplementationOnce(() => Promise.resolve({
          ok: true,
          json: () => Promise.resolve({ response: 'Success' })
        }));

      const { getByRole } = renderWithTheme(<ChatPage />);
      const input = getByRole('textbox');

      fireEvent.change(input, { target: { value: 'Test message' } });
      fireEvent.submit(input.closest('form'));

      await waitFor(() => {
        expect(mockFetch).toHaveBeenCalledTimes(2);
      });
    });
  });

  describe('CSRF Protection', () => {
    it('includes CSRF token in requests', async () => {
      const mockFetch = jest.spyOn(global, 'fetch');
      const { getByRole } = renderWithTheme(<ChatPage />);
      const input = getByRole('textbox');

      fireEvent.change(input, { target: { value: 'Test message' } });
      fireEvent.submit(input.closest('form'));

      await waitFor(() => {
        expect(mockFetch).toHaveBeenCalledWith(
          expect.any(String),
          expect.objectContaining({
            headers: expect.objectContaining({
              'X-CSRF-Token': expect.any(String)
            })
          })
        );
      });
    });

    it('validates CSRF token on form submission', async () => {
      const { getByRole } = renderWithTheme(<ChatPage />);
      const form = getByRole('textbox').closest('form');

      expect(form).toHaveAttribute('data-csrf');
    });
  });

  describe('Content Security', () => {
    it('validates file uploads', async () => {
      const { getByTestId } = renderWithTheme(<ChatPage />);
      const fileInput = getByTestId('file-input');

      const file = new File(['test'], 'test.exe', { type: 'application/x-msdownload' });
      fireEvent.change(fileInput, { target: { files: [file] } });

      await waitFor(() => {
        expect(getByTestId('error-message')).toHaveTextContent(/недопустимый тип файла/i);
      });
    });

    it('sanitizes file names', async () => {
      const { getByTestId } = renderWithTheme(<ChatPage />);
      const fileInput = getByTestId('file-input');

      const file = new File(['test'], '../../../test.txt', { type: 'text/plain' });
      fireEvent.change(fileInput, { target: { files: [file] } });

      await waitFor(() => {
        const uploadedFile = getByTestId('uploaded-file');
        expect(uploadedFile).toHaveTextContent('test.txt');
      });
    });
  });

  describe('Rate Limiting', () => {
    it('implements message rate limiting', async () => {
      const { getByRole, getByText } = renderWithTheme(<ChatPage />);
      const input = getByRole('textbox');

      // Быстрая отправка множества сообщений
      for (let i = 0; i < 10; i++) {
        fireEvent.change(input, { target: { value: `Message ${i}` } });
        fireEvent.submit(input.closest('form'));
      }

      await waitFor(() => {
        expect(getByText(/превышен лимит сообщений/i)).toBeInTheDocument();
      });
    });

    it('implements API rate limiting', async () => {
      const mockFetch = jest.spyOn(global, 'fetch')
        .mockImplementationOnce(() => Promise.reject({ status: 429 }));

      const { getByRole, getByText } = renderWithTheme(<ChatPage />);
      const input = getByRole('textbox');

      fireEvent.change(input, { target: { value: 'Test message' } });
      fireEvent.submit(input.closest('form'));

      await waitFor(() => {
        expect(getByText(/превышен лимит запросов/i)).toBeInTheDocument();
      });
    });
  });

  describe('Data Privacy', () => {
    it('masks sensitive data in logs', async () => {
      const consoleSpy = jest.spyOn(console, 'log');
      const { getByRole } = renderWithTheme(<ChatPage />);
      const input = getByRole('textbox');

      fireEvent.change(input, { target: { value: 'API_KEY: sk-1234567890' } });
      fireEvent.submit(input.closest('form'));

      expect(consoleSpy).not.toHaveBeenCalledWith(
        expect.stringContaining('sk-1234567890')
      );
    });

    it('clears sensitive data on unmount', () => {
      const { unmount } = renderWithTheme(<ChatPage />);
      
      unmount();

      expect(sessionStorage.getItem('currentSession')).toBeNull();
      expect(localStorage.getItem('chatMessages')).toBeNull();
    });
  });

  describe('WebSocket Security', () => {
    it('validates WebSocket origin', () => {
      const mockWebSocket = {
        addEventListener: jest.fn(),
        send: jest.fn(),
        close: jest.fn()
      };
      global.WebSocket = jest.fn((url) => {
        expect(url).toMatch(/^wss:/); // Проверяем использование WSS
        return mockWebSocket;
      });

      renderWithTheme(<ChatPage />);
    });

    it('implements WebSocket heartbeat', async () => {
      jest.useFakeTimers();
      const mockWebSocket = {
        addEventListener: jest.fn(),
        send: jest.fn(),
        close: jest.fn()
      };
      global.WebSocket = jest.fn(() => mockWebSocket);

      renderWithTheme(<ChatPage />);

      jest.advanceTimersByTime(30000); // 30 секунд

      expect(mockWebSocket.send).toHaveBeenCalledWith(
        expect.stringContaining('ping')
      );

      jest.useRealTimers();
    });
  });

  describe('Error Handling', () => {
    it('prevents stack trace exposure', async () => {
      const mockFetch = jest.spyOn(global, 'fetch')
        .mockImplementationOnce(() => Promise.reject(new Error('Internal error')));

      const { getByRole, getByTestId } = renderWithTheme(<ChatPage />);
      const input = getByRole('textbox');

      fireEvent.change(input, { target: { value: 'Test message' } });
      fireEvent.submit(input.closest('form'));

      await waitFor(() => {
        const errorMessage = getByTestId('error-message');
        expect(errorMessage).not.toHaveTextContent(/at\s+/); // Проверяем отсутствие stack trace
      });
    });

    it('logs security events', async () => {
      const mockFetch = jest.spyOn(global, 'fetch')
        .mockImplementationOnce(() => Promise.reject({ status: 403 }));

      const { getByRole } = renderWithTheme(<ChatPage />);
      const input = getByRole('textbox');

      fireEvent.change(input, { target: { value: 'Test message' } });
      fireEvent.submit(input.closest('form'));

      await waitFor(() => {
        expect(console.warn).toHaveBeenCalledWith(
          expect.stringContaining('Security event:'),
          expect.any(Object)
        );
      });
    });
  });
});
