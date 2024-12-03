import React from 'react';
import { render, fireEvent, waitFor } from '@testing-library/react';
import { renderWithTheme } from './testUtils';
import ChatPage from '../index';
import { mockMessages, mockAgent } from './__mocks__/mockData';

describe('ChatPage Validation', () => {
  describe('Input Validation', () => {
    it('validates message length', async () => {
      const { getByRole, getByText } = renderWithTheme(<ChatPage />);
      const input = getByRole('textbox');

      // Слишком длинное сообщение
      const longMessage = 'a'.repeat(5001);
      fireEvent.change(input, { target: { value: longMessage } });
      fireEvent.submit(input.closest('form'));

      await waitFor(() => {
        expect(getByText(/сообщение слишком длинное/i)).toBeInTheDocument();
      });
    });

    it('validates empty messages', async () => {
      const { getByRole, getByText } = renderWithTheme(<ChatPage />);
      const input = getByRole('textbox');

      fireEvent.change(input, { target: { value: '' } });
      fireEvent.submit(input.closest('form'));

      await waitFor(() => {
        expect(getByText(/введите сообщение/i)).toBeInTheDocument();
      });
    });

    it('validates message content', async () => {
      const { getByRole, getByText } = renderWithTheme(<ChatPage />);
      const input = getByRole('textbox');

      // Сообщение только из пробелов
      fireEvent.change(input, { target: { value: '   ' } });
      fireEvent.submit(input.closest('form'));

      await waitFor(() => {
        expect(getByText(/введите текст сообщения/i)).toBeInTheDocument();
      });
    });
  });

  describe('Command Validation', () => {
    it('validates command format', async () => {
      const { getByRole, getByText } = renderWithTheme(<ChatPage />);
      const input = getByRole('textbox');

      // Неверный формат команды
      fireEvent.change(input, { target: { value: '/ invalid' } });
      fireEvent.submit(input.closest('form'));

      await waitFor(() => {
        expect(getByText(/неверный формат команды/i)).toBeInTheDocument();
      });
    });

    it('validates unknown commands', async () => {
      const { getByRole, getByText } = renderWithTheme(<ChatPage />);
      const input = getByRole('textbox');

      // Несуществующая команда
      fireEvent.change(input, { target: { value: '/unknown' } });
      fireEvent.submit(input.closest('form'));

      await waitFor(() => {
        expect(getByText(/неизвестная команда/i)).toBeInTheDocument();
      });
    });
  });

  describe('Settings Validation', () => {
    it('validates agent name', async () => {
      const { getByText, getByLabelText } = renderWithTheme(<ChatPage />);
      
      fireEvent.click(getByText('Настройки'));
      const nameInput = getByLabelText(/имя агента/i);

      // Пустое имя
      fireEvent.change(nameInput, { target: { value: '' } });
      fireEvent.click(getByText('Сохранить'));

      await waitFor(() => {
        expect(getByText(/введите имя агента/i)).toBeInTheDocument();
      });
    });

    it('validates agent role', async () => {
      const { getByText, getByLabelText } = renderWithTheme(<ChatPage />);
      
      fireEvent.click(getByText('Настройки'));
      const roleInput = getByLabelText(/роль агента/i);

      // Слишком короткая роль
      fireEvent.change(roleInput, { target: { value: 'AI' } });
      fireEvent.click(getByText('Сохранить'));

      await waitFor(() => {
        expect(getByText(/роль должна содержать минимум 3 символа/i)).toBeInTheDocument();
      });
    });
  });

  describe('Data Format Validation', () => {
    it('validates message timestamps', async () => {
      const invalidMessages = [
        ...mockMessages,
        { text: 'Invalid', timestamp: 'not-a-date' }
      ];

      const { getByText } = renderWithTheme(
        <ChatPage initialMessages={invalidMessages} />
      );

      await waitFor(() => {
        expect(getByText(/ошибка формата даты/i)).toBeInTheDocument();
      });
    });

    it('validates session data', async () => {
      const invalidSession = {
        id: null,
        startTime: 'invalid-time',
        tokensUsed: 'not-a-number'
      };

      const { getByText } = renderWithTheme(
        <ChatPage initialSession={invalidSession} />
      );

      await waitFor(() => {
        expect(getByText(/ошибка формата данных сессии/i)).toBeInTheDocument();
      });
    });
  });

  describe('API Response Validation', () => {
    it('validates response format', async () => {
      global.fetch = jest.fn(() =>
        Promise.resolve({
          ok: true,
          json: () => Promise.resolve({ invalid: 'format' })
        })
      );

      const { getByRole, getByText } = renderWithTheme(<ChatPage />);
      const input = getByRole('textbox');

      fireEvent.change(input, { target: { value: 'Test message' } });
      fireEvent.submit(input.closest('form'));

      await waitFor(() => {
        expect(getByText(/некорректный формат ответа/i)).toBeInTheDocument();
      });
    });

    it('validates response content', async () => {
      global.fetch = jest.fn(() =>
        Promise.resolve({
          ok: true,
          json: () => Promise.resolve({
            response: '',
            tokensUsed: -1
          })
        })
      );

      const { getByRole, getByText } = renderWithTheme(<ChatPage />);
      const input = getByRole('textbox');

      fireEvent.change(input, { target: { value: 'Test message' } });
      fireEvent.submit(input.closest('form'));

      await waitFor(() => {
        expect(getByText(/некорректные данные ответа/i)).toBeInTheDocument();
      });
    });
  });

  describe('State Validation', () => {
    it('validates message state updates', async () => {
      const { getByRole, getByText } = renderWithTheme(<ChatPage />);
      const input = getByRole('textbox');

      // Попытка добавить невалидное сообщение
      const invalidMessage = { invalid: 'format' };
      fireEvent.change(input, { target: { value: JSON.stringify(invalidMessage) } });
      fireEvent.submit(input.closest('form'));

      await waitFor(() => {
        expect(getByText(/ошибка формата сообщения/i)).toBeInTheDocument();
      });
    });

    it('validates stats updates', async () => {
      const { getByRole, getByText } = renderWithTheme(<ChatPage />);
      const input = getByRole('textbox');

      // Имитируем некорректное обновление статистики
      global.fetch = jest.fn(() =>
        Promise.resolve({
          ok: true,
          json: () => Promise.resolve({
            response: 'Test',
            tokensUsed: 'invalid'
          })
        })
      );

      fireEvent.change(input, { target: { value: 'Test message' } });
      fireEvent.submit(input.closest('form'));

      await waitFor(() => {
        expect(getByText(/ошибка обновления статистики/i)).toBeInTheDocument();
      });
    });
  });

  describe('Security Validation', () => {
    it('validates against XSS', async () => {
      const { getByRole, container } = renderWithTheme(<ChatPage />);
      const input = getByRole('textbox');

      const xssAttempt = '<script>alert("xss")</script>';
      fireEvent.change(input, { target: { value: xssAttempt } });
      fireEvent.submit(input.closest('form'));

      await waitFor(() => {
        expect(container.innerHTML).not.toContain('<script>');
      });
    });

    it('validates file uploads', async () => {
      const { getByTestId, getByText } = renderWithTheme(<ChatPage />);
      const fileInput = getByTestId('file-input');

      const file = new File(['test'], 'test.exe', { type: 'application/x-msdownload' });
      fireEvent.change(fileInput, { target: { files: [file] } });

      await waitFor(() => {
        expect(getByText(/недопустимый тип файла/i)).toBeInTheDocument();
      });
    });
  });

  describe('Performance Validation', () => {
    it('validates message batch size', async () => {
      const { getByRole, getByText } = renderWithTheme(<ChatPage />);
      const input = getByRole('textbox');

      // Пытаемся отправить слишком много сообщений одновременно
      for (let i = 0; i < 100; i++) {
        fireEvent.change(input, { target: { value: `Message ${i}` } });
        fireEvent.submit(input.closest('form'));
      }

      await waitFor(() => {
        expect(getByText(/слишком много сообщений/i)).toBeInTheDocument();
      });
    });

    it('validates response time', async () => {
      jest.useFakeTimers();
      const { getByRole, getByText } = renderWithTheme(<ChatPage />);
      const input = getByRole('textbox');

      fireEvent.change(input, { target: { value: 'Test message' } });
      fireEvent.submit(input.closest('form'));

      jest.advanceTimersByTime(30000);

      await waitFor(() => {
        expect(getByText(/превышено время ожидания/i)).toBeInTheDocument();
      });

      jest.useRealTimers();
    });
  });
});
