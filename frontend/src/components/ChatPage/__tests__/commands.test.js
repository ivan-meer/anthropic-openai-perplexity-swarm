import React from 'react';
import { render, fireEvent, waitFor } from '@testing-library/react';
import { renderWithTheme } from './testUtils';
import ChatPage from '../index';
import { mockMessages, mockAgent } from './__mocks__/mockData';

describe('ChatPage Commands', () => {
  describe('Command Recognition', () => {
    it('recognizes command syntax', async () => {
      const { getByRole, getByTestId } = renderWithTheme(<ChatPage />);
      const input = getByRole('textbox');

      fireEvent.change(input, { target: { value: '/' } });

      await waitFor(() => {
        expect(getByTestId('command-suggestions')).toBeVisible();
      });
    });

    it('differentiates commands from regular messages', async () => {
      const { getByRole } = renderWithTheme(<ChatPage />);
      const input = getByRole('textbox');

      // Обычное сообщение
      fireEvent.change(input, { target: { value: 'Hello world' } });
      fireEvent.submit(input.closest('form'));

      // Команда
      fireEvent.change(input, { target: { value: '/help' } });
      fireEvent.submit(input.closest('form'));

      await waitFor(() => {
        const messages = document.querySelectorAll('[data-testid="chat-message"]');
        expect(messages[0]).toHaveAttribute('data-type', 'user');
        expect(messages[1]).toHaveAttribute('data-type', 'system');
      });
    });

    it('handles invalid commands', async () => {
      const { getByRole, getByText } = renderWithTheme(<ChatPage />);
      const input = getByRole('textbox');

      fireEvent.change(input, { target: { value: '/invalidcommand' } });
      fireEvent.submit(input.closest('form'));

      await waitFor(() => {
        expect(getByText(/неизвестная команда/i)).toBeInTheDocument();
      });
    });
  });

  describe('Built-in Commands', () => {
    it('executes /help command', async () => {
      const { getByRole, getByText } = renderWithTheme(<ChatPage />);
      const input = getByRole('textbox');

      fireEvent.change(input, { target: { value: '/help' } });
      fireEvent.submit(input.closest('form'));

      await waitFor(() => {
        expect(getByText(/доступные команды/i)).toBeInTheDocument();
      });
    });

    it('executes /clear command', async () => {
      const { getByRole, queryByTestId } = renderWithTheme(
        <ChatPage initialMessages={mockMessages} />
      );
      const input = getByRole('textbox');

      fireEvent.change(input, { target: { value: '/clear' } });
      fireEvent.submit(input.closest('form'));

      await waitFor(() => {
        expect(queryByTestId('chat-message')).toBeNull();
      });
    });

    it('executes /settings command', async () => {
      const { getByRole, getByTestId } = renderWithTheme(<ChatPage />);
      const input = getByRole('textbox');

      fireEvent.change(input, { target: { value: '/settings' } });
      fireEvent.submit(input.closest('form'));

      await waitFor(() => {
        expect(getByTestId('settings-modal')).toBeVisible();
      });
    });

    it('executes /export command', async () => {
      const { getByRole } = renderWithTheme(<ChatPage />);
      const input = getByRole('textbox');

      // Мок для создания и скачивания файла
      const mockCreateElement = jest.spyOn(document, 'createElement');
      const mockClick = jest.fn();
      mockCreateElement.mockReturnValue({ click: mockClick });

      fireEvent.change(input, { target: { value: '/export' } });
      fireEvent.submit(input.closest('form'));

      expect(mockClick).toHaveBeenCalled();
    });
  });

  describe('Command Arguments', () => {
    it('parses command arguments', async () => {
      const { getByRole, getByText } = renderWithTheme(<ChatPage />);
      const input = getByRole('textbox');

      fireEvent.change(input, { target: { value: '/search keyword' } });
      fireEvent.submit(input.closest('form'));

      await waitFor(() => {
        expect(getByText(/результаты поиска.*keyword/i)).toBeInTheDocument();
      });
    });

    it('validates required arguments', async () => {
      const { getByRole, getByText } = renderWithTheme(<ChatPage />);
      const input = getByRole('textbox');

      fireEvent.change(input, { target: { value: '/search' } });
      fireEvent.submit(input.closest('form'));

      await waitFor(() => {
        expect(getByText(/укажите ключевое слово/i)).toBeInTheDocument();
      });
    });

    it('handles optional arguments', async () => {
      const { getByRole } = renderWithTheme(<ChatPage />);
      const input = getByRole('textbox');

      // С опциональным аргументом
      fireEvent.change(input, { target: { value: '/stats detailed' } });
      fireEvent.submit(input.closest('form'));

      // Без опционального аргумента
      fireEvent.change(input, { target: { value: '/stats' } });
      fireEvent.submit(input.closest('form'));

      await waitFor(() => {
        const messages = document.querySelectorAll('[data-testid="chat-message"]');
        expect(messages[0]).toHaveTextContent(/подробная статистика/i);
        expect(messages[1]).toHaveTextContent(/общая статистика/i);
      });
    });
  });

  describe('Command Suggestions', () => {
    it('shows command suggestions', async () => {
      const { getByRole, getAllByTestId } = renderWithTheme(<ChatPage />);
      const input = getByRole('textbox');

      fireEvent.change(input, { target: { value: '/' } });

      await waitFor(() => {
        const suggestions = getAllByTestId('command-suggestion');
        expect(suggestions.length).toBeGreaterThan(0);
      });
    });

    it('filters suggestions based on input', async () => {
      const { getByRole, getAllByTestId } = renderWithTheme(<ChatPage />);
      const input = getByRole('textbox');

      fireEvent.change(input, { target: { value: '/h' } });

      await waitFor(() => {
        const suggestions = getAllByTestId('command-suggestion');
        suggestions.forEach(suggestion => {
          expect(suggestion.textContent.toLowerCase()).toContain('h');
        });
      });
    });

    it('selects suggestion with keyboard', async () => {
      const { getByRole } = renderWithTheme(<ChatPage />);
      const input = getByRole('textbox');

      fireEvent.change(input, { target: { value: '/' } });
      fireEvent.keyDown(input, { key: 'ArrowDown' });
      fireEvent.keyDown(input, { key: 'Enter' });

      expect(input.value).toMatch(/^\/\w+/);
    });
  });

  describe('Custom Commands', () => {
    it('registers custom commands', async () => {
      const customCommands = [
        {
          name: 'custom',
          description: 'Custom command',
          execute: jest.fn()
        }
      ];

      const { getByRole } = renderWithTheme(
        <ChatPage customCommands={customCommands} />
      );
      const input = getByRole('textbox');

      fireEvent.change(input, { target: { value: '/custom' } });
      fireEvent.submit(input.closest('form'));

      expect(customCommands[0].execute).toHaveBeenCalled();
    });

    it('handles custom command errors', async () => {
      const customCommands = [
        {
          name: 'error',
          description: 'Error command',
          execute: () => { throw new Error('Custom error'); }
        }
      ];

      const { getByRole, getByText } = renderWithTheme(
        <ChatPage customCommands={customCommands} />
      );
      const input = getByRole('textbox');

      fireEvent.change(input, { target: { value: '/error' } });
      fireEvent.submit(input.closest('form'));

      await waitFor(() => {
        expect(getByText(/ошибка выполнения команды/i)).toBeInTheDocument();
      });
    });
  });

  describe('Command History', () => {
    it('maintains command history', async () => {
      const { getByRole } = renderWithTheme(<ChatPage />);
      const input = getByRole('textbox');

      // Выполняем несколько команд
      fireEvent.change(input, { target: { value: '/help' } });
      fireEvent.submit(input.closest('form'));
      fireEvent.change(input, { target: { value: '/stats' } });
      fireEvent.submit(input.closest('form'));

      // Проверяем историю
      fireEvent.keyDown(input, { key: 'ArrowUp' });
      expect(input.value).toBe('/stats');
      fireEvent.keyDown(input, { key: 'ArrowUp' });
      expect(input.value).toBe('/help');
    });

    it('navigates command history with keyboard', async () => {
      const { getByRole } = renderWithTheme(<ChatPage />);
      const input = getByRole('textbox');

      fireEvent.change(input, { target: { value: '/help' } });
      fireEvent.submit(input.closest('form'));

      fireEvent.keyDown(input, { key: 'ArrowUp' });
      expect(input.value).toBe('/help');
      fireEvent.keyDown(input, { key: 'ArrowDown' });
      expect(input.value).toBe('');
    });
  });

  describe('Command Documentation', () => {
    it('shows command help', async () => {
      const { getByRole, getByText } = renderWithTheme(<ChatPage />);
      const input = getByRole('textbox');

      fireEvent.change(input, { target: { value: '/help export' } });
      fireEvent.submit(input.closest('form'));

      await waitFor(() => {
        expect(getByText(/экспорт истории чата/i)).toBeInTheDocument();
      });
    });

    it('shows command examples', async () => {
      const { getByRole, getByText } = renderWithTheme(<ChatPage />);
      const input = getByRole('textbox');

      fireEvent.change(input, { target: { value: '/help search' } });
      fireEvent.submit(input.closest('form'));

      await waitFor(() => {
        expect(getByText(/пример:/i)).toBeInTheDocument();
      });
    });
  });

  describe('Command Permissions', () => {
    it('checks command permissions', async () => {
      const { getByRole, getByText } = renderWithTheme(
        <ChatPage userRole="guest" />
      );
      const input = getByRole('textbox');

      fireEvent.change(input, { target: { value: '/settings' } });
      fireEvent.submit(input.closest('form'));

      await waitFor(() => {
        expect(getByText(/недостаточно прав/i)).toBeInTheDocument();
      });
    });

    it('hides restricted commands from suggestions', async () => {
      const { getByRole, queryByText } = renderWithTheme(
        <ChatPage userRole="guest" />
      );
      const input = getByRole('textbox');

      fireEvent.change(input, { target: { value: '/' } });

      await waitFor(() => {
        expect(queryByText('/admin')).toBeNull();
      });
    });
  });
});
