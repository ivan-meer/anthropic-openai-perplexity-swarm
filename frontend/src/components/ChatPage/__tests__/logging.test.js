import React from 'react';
import { render, fireEvent, waitFor } from '@testing-library/react';
import { renderWithTheme } from './testUtils';
import ChatPage from '../index';
import { mockMessages } from './__mocks__/mockData';

describe('ChatPage Logging', () => {
  describe('Log Levels', () => {
    beforeEach(() => {
      // Мок для console методов
      jest.spyOn(console, 'log').mockImplementation(() => {});
      jest.spyOn(console, 'info').mockImplementation(() => {});
      jest.spyOn(console, 'warn').mockImplementation(() => {});
      jest.spyOn(console, 'error').mockImplementation(() => {});
      jest.spyOn(console, 'debug').mockImplementation(() => {});
    });

    afterEach(() => {
      jest.restoreAllMocks();
    });

    it('logs component initialization', () => {
      renderWithTheme(<ChatPage />);

      expect(console.info).toHaveBeenCalledWith(
        '[ChatPage]',
        'Component initialized',
        expect.any(Object)
      );
    });

    it('logs message sending', async () => {
      const { getByRole } = renderWithTheme(<ChatPage />);
      const input = getByRole('textbox');

      fireEvent.change(input, { target: { value: 'Test message' } });
      fireEvent.submit(input.closest('form'));

      expect(console.log).toHaveBeenCalledWith(
        '[ChatPage]',
        'Message sent',
        expect.objectContaining({
          text: 'Test message'
        })
      );
    });

    it('logs errors with stack trace', async () => {
      global.fetch = jest.fn(() => Promise.reject(new Error('API Error')));

      const { getByRole } = renderWithTheme(<ChatPage />);
      const input = getByRole('textbox');

      fireEvent.change(input, { target: { value: 'Test message' } });
      fireEvent.submit(input.closest('form'));

      await waitFor(() => {
        expect(console.error).toHaveBeenCalledWith(
          '[ChatPage]',
          'API Error',
          expect.objectContaining({
            stack: expect.any(String)
          })
        );
      });
    });

    it('logs warnings for potential issues', async () => {
      const { getByRole } = renderWithTheme(<ChatPage />);
      const input = getByRole('textbox');

      // Симулируем длинное сообщение
      const longMessage = 'a'.repeat(1000);
      fireEvent.change(input, { target: { value: longMessage } });
      fireEvent.submit(input.closest('form'));

      expect(console.warn).toHaveBeenCalledWith(
        '[ChatPage]',
        'Long message detected',
        expect.any(Object)
      );
    });
  });

  describe('Log Formatting', () => {
    it('includes timestamp in logs', () => {
      renderWithTheme(<ChatPage />);

      expect(console.info).toHaveBeenCalledWith(
        '[ChatPage]',
        expect.stringMatching(/\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}/),
        expect.any(Object)
      );
    });

    it('includes session ID in logs', async () => {
      const { getByRole } = renderWithTheme(<ChatPage />);
      const input = getByRole('textbox');

      fireEvent.change(input, { target: { value: 'Test message' } });
      fireEvent.submit(input.closest('form'));

      expect(console.log).toHaveBeenCalledWith(
        '[ChatPage]',
        expect.any(String),
        expect.objectContaining({
          sessionId: expect.any(String)
        })
      );
    });

    it('masks sensitive data in logs', async () => {
      const { getByRole } = renderWithTheme(<ChatPage />);
      const input = getByRole('textbox');

      fireEvent.change(input, { target: { value: 'API_KEY: sk-1234567890' } });
      fireEvent.submit(input.closest('form'));

      expect(console.log).toHaveBeenCalledWith(
        '[ChatPage]',
        expect.any(String),
        expect.objectContaining({
          text: expect.not.stringContaining('sk-1234567890')
        })
      );
    });
  });

  describe('Log Storage', () => {
    it('stores logs in local storage', async () => {
      const { getByRole } = renderWithTheme(<ChatPage />);
      const input = getByRole('textbox');

      fireEvent.change(input, { target: { value: 'Test message' } });
      fireEvent.submit(input.closest('form'));

      const logs = JSON.parse(localStorage.getItem('chatLogs'));
      expect(logs).toContainEqual(
        expect.objectContaining({
          type: 'message',
          text: 'Test message'
        })
      );
    });

    it('rotates logs when limit reached', async () => {
      const { getByRole } = renderWithTheme(<ChatPage />);
      const input = getByRole('textbox');

      // Добавляем много логов
      for (let i = 0; i < 1000; i++) {
        fireEvent.change(input, { target: { value: `Message ${i}` } });
        fireEvent.submit(input.closest('form'));
      }

      const logs = JSON.parse(localStorage.getItem('chatLogs'));
      expect(logs.length).toBeLessThanOrEqual(500);
    });

    it('exports logs to file', async () => {
      const { getByRole, getByText } = renderWithTheme(<ChatPage />);
      const input = getByRole('textbox');

      fireEvent.change(input, { target: { value: '/export-logs' } });
      fireEvent.submit(input.closest('form'));

      // Мок для создания и скачивания файла
      const mockCreateElement = jest.spyOn(document, 'createElement');
      const mockClick = jest.fn();
      mockCreateElement.mockReturnValue({ click: mockClick });

      fireEvent.click(getByText(/экспорт логов/i));

      expect(mockClick).toHaveBeenCalled();
    });
  });

  describe('Log Filtering', () => {
    it('filters logs by level', async () => {
      const { getByRole, getByLabelText } = renderWithTheme(<ChatPage />);
      
      // Открываем настройки логирования
      fireEvent.click(getByRole('button', { name: /настройки/i }));
      
      // Устанавливаем уровень логирования
      const levelSelect = getByLabelText(/уровень логирования/i);
      fireEvent.change(levelSelect, { target: { value: 'error' } });

      // Проверяем, что логируются только ошибки
      expect(console.log).not.toHaveBeenCalled();
      expect(console.info).not.toHaveBeenCalled();
      expect(console.warn).not.toHaveBeenCalled();
    });

    it('filters logs by category', async () => {
      const { getByRole, getByLabelText } = renderWithTheme(<ChatPage />);
      
      // Открываем настройки логирования
      fireEvent.click(getByRole('button', { name: /настройки/i }));
      
      // Выбираем категории логов
      const categorySelect = getByLabelText(/категории логов/i);
      fireEvent.change(categorySelect, { target: { value: 'api' } });

      // Отправляем сообщение
      const input = getByRole('textbox');
      fireEvent.change(input, { target: { value: 'Test message' } });
      fireEvent.submit(input.closest('form'));

      expect(console.log).toHaveBeenCalledWith(
        '[ChatPage:API]',
        expect.any(String),
        expect.any(Object)
      );
    });
  });

  describe('Log Analysis', () => {
    it('tracks error frequency', async () => {
      const { getByRole, getByTestId } = renderWithTheme(<ChatPage />);
      const input = getByRole('textbox');

      // Симулируем несколько ошибок
      global.fetch = jest.fn(() => Promise.reject(new Error('API Error')));

      for (let i = 0; i < 3; i++) {
        fireEvent.change(input, { target: { value: `Message ${i}` } });
        fireEvent.submit(input.closest('form'));
      }

      await waitFor(() => {
        const errorStats = getByTestId('error-stats');
        expect(errorStats).toHaveTextContent('3');
      });
    });

    it('identifies error patterns', async () => {
      const { getByRole } = renderWithTheme(<ChatPage />);
      const input = getByRole('textbox');

      // Симулируем повторяющиеся ошибки
      global.fetch = jest.fn(() => Promise.reject(new Error('API Error')));

      for (let i = 0; i < 5; i++) {
        fireEvent.change(input, { target: { value: `Message ${i}` } });
        fireEvent.submit(input.closest('form'));
      }

      expect(console.warn).toHaveBeenCalledWith(
        '[ChatPage]',
        'Repeated error pattern detected',
        expect.any(Object)
      );
    });
  });

  describe('Performance Logging', () => {
    it('logs performance metrics', async () => {
      const { getByRole } = renderWithTheme(<ChatPage />);
      const input = getByRole('textbox');

      fireEvent.change(input, { target: { value: 'Test message' } });
      fireEvent.submit(input.closest('form'));

      expect(console.info).toHaveBeenCalledWith(
        '[ChatPage:Performance]',
        expect.any(String),
        expect.objectContaining({
          duration: expect.any(Number)
        })
      );
    });

    it('logs memory usage', () => {
      renderWithTheme(<ChatPage initialMessages={mockMessages} />);

      expect(console.info).toHaveBeenCalledWith(
        '[ChatPage:Memory]',
        expect.any(String),
        expect.objectContaining({
          heapUsed: expect.any(Number)
        })
      );
    });
  });
});
