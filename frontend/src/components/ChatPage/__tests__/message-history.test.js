import React from 'react';
import { render, fireEvent, waitFor } from '@testing-library/react';
import { renderWithTheme } from './testUtils';
import ChatPage from '../index';
import { mockMessages } from './__mocks__/mockData';

describe('ChatPage Message History', () => {
  describe('Message Storage', () => {
    beforeEach(() => {
      localStorage.clear();
      sessionStorage.clear();
    });

    it('persists messages to local storage', async () => {
      const { getByRole } = renderWithTheme(<ChatPage />);
      const input = getByRole('textbox');

      fireEvent.change(input, { target: { value: 'Test message' } });
      fireEvent.submit(input.closest('form'));

      await waitFor(() => {
        const storedMessages = JSON.parse(localStorage.getItem('chatMessages'));
        expect(storedMessages).toContainEqual(
          expect.objectContaining({ text: 'Test message' })
        );
      });
    });

    it('loads messages from local storage', () => {
      localStorage.setItem('chatMessages', JSON.stringify(mockMessages));
      
      const { getAllByTestId } = renderWithTheme(<ChatPage />);
      const messages = getAllByTestId('chat-message');

      expect(messages).toHaveLength(mockMessages.length);
    });

    it('handles storage quota exceeded', async () => {
      const largeMessage = 'a'.repeat(10 * 1024 * 1024); // 10MB
      const { getByRole, getByText } = renderWithTheme(<ChatPage />);
      const input = getByRole('textbox');

      // Симулируем превышение квоты хранилища
      Object.defineProperty(localStorage, 'setItem', {
        writable: true,
        value: jest.fn(() => {
          throw new Error('QuotaExceededError');
        })
      });

      fireEvent.change(input, { target: { value: largeMessage } });
      fireEvent.submit(input.closest('form'));

      await waitFor(() => {
        expect(getByText(/превышен лимит хранилища/i)).toBeInTheDocument();
      });
    });
  });

  describe('Message Loading', () => {
    it('loads messages in chunks', async () => {
      const manyMessages = Array.from({ length: 1000 }, (_, i) => ({
        text: `Message ${i}`,
        sender: 'user',
        timestamp: new Date()
      }));

      const { container } = renderWithTheme(
        <ChatPage initialMessages={manyMessages} />
      );

      const initialMessageCount = container.querySelectorAll('[data-testid="chat-message"]').length;
      expect(initialMessageCount).toBeLessThan(manyMessages.length);

      // Прокручиваем вверх для загрузки следующей порции
      const messagesContainer = container.querySelector('[data-testid="messages-container"]');
      fireEvent.scroll(messagesContainer, { target: { scrollTop: 0 } });

      await waitFor(() => {
        const newMessageCount = container.querySelectorAll('[data-testid="chat-message"]').length;
        expect(newMessageCount).toBeGreaterThan(initialMessageCount);
      });
    });

    it('shows loading indicator while fetching history', async () => {
      const { getByTestId } = renderWithTheme(
        <ChatPage initialMessages={mockMessages} />
      );
      const messagesContainer = getByTestId('messages-container');

      fireEvent.scroll(messagesContainer, { target: { scrollTop: 0 } });

      await waitFor(() => {
        expect(getByTestId('loading-indicator')).toBeInTheDocument();
      });
    });
  });

  describe('Message Management', () => {
    it('deletes messages', async () => {
      const { getAllByTestId } = renderWithTheme(
        <ChatPage initialMessages={mockMessages} />
      );
      const deleteButtons = getAllByTestId('delete-message');
      const initialCount = getAllByTestId('chat-message').length;

      fireEvent.click(deleteButtons[0]);

      await waitFor(() => {
        const newCount = document.querySelectorAll('[data-testid="chat-message"]').length;
        expect(newCount).toBe(initialCount - 1);
      });
    });

    it('edits messages', async () => {
      const { getAllByTestId, getByRole } = renderWithTheme(
        <ChatPage initialMessages={mockMessages} />
      );
      const editButtons = getAllByTestId('edit-message');

      fireEvent.click(editButtons[0]);
      const input = getByRole('textbox');
      fireEvent.change(input, { target: { value: 'Edited message' } });
      fireEvent.submit(input.closest('form'));

      await waitFor(() => {
        const messages = document.querySelectorAll('[data-testid="chat-message"]');
        expect(messages[0]).toHaveTextContent('Edited message');
      });
    });

    it('groups messages by date', () => {
      const messagesFromDifferentDays = [
        {
          text: 'Day 1 message',
          sender: 'user',
          timestamp: new Date('2024-01-01')
        },
        {
          text: 'Day 2 message',
          sender: 'user',
          timestamp: new Date('2024-01-02')
        }
      ];

      const { getAllByTestId } = renderWithTheme(
        <ChatPage initialMessages={messagesFromDifferentDays} />
      );
      const dateSeparators = getAllByTestId('date-separator');

      expect(dateSeparators).toHaveLength(2);
    });
  });

  describe('Search and Filter', () => {
    it('searches through message history', async () => {
      const { getByPlaceholderText, getAllByTestId } = renderWithTheme(
        <ChatPage initialMessages={mockMessages} />
      );
      const searchInput = getByPlaceholderText(/поиск/i);

      fireEvent.change(searchInput, { target: { value: mockMessages[0].text } });

      await waitFor(() => {
        const visibleMessages = getAllByTestId('chat-message');
        expect(visibleMessages).toHaveLength(1);
        expect(visibleMessages[0]).toHaveTextContent(mockMessages[0].text);
      });
    });

    it('filters messages by sender', async () => {
      const { getByRole, getAllByTestId } = renderWithTheme(
        <ChatPage initialMessages={mockMessages} />
      );
      const filterSelect = getByRole('combobox');

      fireEvent.change(filterSelect, { target: { value: 'user' } });

      await waitFor(() => {
        const visibleMessages = getAllByTestId('chat-message');
        visibleMessages.forEach(message => {
          expect(message).toHaveAttribute('data-sender', 'user');
        });
      });
    });
  });

  describe('Export and Import', () => {
    it('exports message history', async () => {
      const { getByText } = renderWithTheme(
        <ChatPage initialMessages={mockMessages} />
      );
      const exportButton = getByText(/экспорт/i);

      // Мокируем создание и скачивание файла
      const mockCreateElement = jest.spyOn(document, 'createElement');
      const mockClick = jest.fn();
      mockCreateElement.mockReturnValue({ click: mockClick });

      fireEvent.click(exportButton);

      expect(mockClick).toHaveBeenCalled();
      expect(mockCreateElement).toHaveBeenCalledWith('a');
    });

    it('imports message history', async () => {
      const { getByLabelText, getAllByTestId } = renderWithTheme(<ChatPage />);
      const fileInput = getByLabelText(/импорт/i);

      const file = new File(
        [JSON.stringify(mockMessages)],
        'messages.json',
        { type: 'application/json' }
      );

      fireEvent.change(fileInput, { target: { files: [file] } });

      await waitFor(() => {
        const messages = getAllByTestId('chat-message');
        expect(messages).toHaveLength(mockMessages.length);
      });
    });
  });

  describe('History Navigation', () => {
    it('restores scroll position', async () => {
      const manyMessages = Array.from({ length: 50 }, (_, i) => ({
        text: `Message ${i}`,
        sender: 'user',
        timestamp: new Date()
      }));

      const { getByTestId } = renderWithTheme(
        <ChatPage initialMessages={manyMessages} />
      );
      const container = getByTestId('messages-container');

      // Сохраняем позицию прокрутки
      fireEvent.scroll(container, { target: { scrollTop: 500 } });
      const scrollPosition = container.scrollTop;

      // Перезагружаем компонент
      const { getByTestId: getByTestIdAfterRerender } = renderWithTheme(
        <ChatPage initialMessages={manyMessages} />
      );
      const newContainer = getByTestIdAfterRerender('messages-container');

      expect(newContainer.scrollTop).toBe(scrollPosition);
    });

    it('handles message history pagination', async () => {
      const manyMessages = Array.from({ length: 100 }, (_, i) => ({
        text: `Message ${i}`,
        sender: 'user',
        timestamp: new Date()
      }));

      const { getByTestId, getAllByTestId } = renderWithTheme(
        <ChatPage initialMessages={manyMessages} />
      );
      const container = getByTestId('messages-container');
      const initialMessageCount = getAllByTestId('chat-message').length;

      fireEvent.scroll(container, { target: { scrollTop: 0 } });

      await waitFor(() => {
        const newMessageCount = document.querySelectorAll('[data-testid="chat-message"]').length;
        expect(newMessageCount).toBeGreaterThan(initialMessageCount);
      });
    });
  });

  describe('History Cleanup', () => {
    it('cleans up old messages', async () => {
      const oldMessages = mockMessages.map(msg => ({
        ...msg,
        timestamp: new Date('2020-01-01')
      }));

      localStorage.setItem('chatMessages', JSON.stringify(oldMessages));
      
      const { getByText } = renderWithTheme(<ChatPage />);
      const cleanupButton = getByText(/очистить историю/i);

      fireEvent.click(cleanupButton);
      fireEvent.click(getByText(/подтвердить/i));

      await waitFor(() => {
        const storedMessages = JSON.parse(localStorage.getItem('chatMessages'));
        expect(storedMessages).toHaveLength(0);
      });
    });

    it('compresses message history', async () => {
      const largeMessages = Array.from({ length: 1000 }, (_, i) => ({
        text: 'a'.repeat(1000),
        sender: 'user',
        timestamp: new Date()
      }));

      const { getByText } = renderWithTheme(
        <ChatPage initialMessages={largeMessages} />
      );
      const compressButton = getByText(/сжать историю/i);

      fireEvent.click(compressButton);

      await waitFor(() => {
        const storedMessages = localStorage.getItem('chatMessages');
        expect(storedMessages.length).toBeLessThan(
          JSON.stringify(largeMessages).length
        );
      });
    });
  });
});
