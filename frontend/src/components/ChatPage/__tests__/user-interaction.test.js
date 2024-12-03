import React from 'react';
import { render, fireEvent, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { renderWithTheme } from './testUtils';
import ChatPage from '../index';
import { mockMessages, mockAgent } from './__mocks__/mockData';

describe('ChatPage User Interaction', () => {
  describe('Message Input', () => {
    it('handles text input correctly', async () => {
      const { getByRole } = renderWithTheme(<ChatPage />);
      const input = getByRole('textbox');

      await userEvent.type(input, 'Hello, world!');
      expect(input).toHaveValue('Hello, world!');
    });

    it('supports multiline input', async () => {
      const { getByRole } = renderWithTheme(<ChatPage />);
      const input = getByRole('textbox');

      await userEvent.type(input, 'Line 1{enter}Line 2');
      expect(input.value).toContain('\n');
    });

    it('handles paste events', async () => {
      const { getByRole } = renderWithTheme(<ChatPage />);
      const input = getByRole('textbox');

      await userEvent.paste(input, 'Pasted text');
      expect(input).toHaveValue('Pasted text');
    });
  });

  describe('Message Sending', () => {
    it('sends message on button click', async () => {
      const { getByRole, getByText } = renderWithTheme(<ChatPage />);
      const input = getByRole('textbox');
      const sendButton = getByText(/отправить/i);

      await userEvent.type(input, 'Test message');
      fireEvent.click(sendButton);

      expect(input).toHaveValue('');
    });

    it('sends message on Enter key', async () => {
      const { getByRole } = renderWithTheme(<ChatPage />);
      const input = getByRole('textbox');

      await userEvent.type(input, 'Test message{enter}');
      expect(input).toHaveValue('');
    });

    it('prevents empty message sending', async () => {
      const { getByRole, getByText } = renderWithTheme(<ChatPage />);
      const input = getByRole('textbox');
      const sendButton = getByText(/отправить/i);

      fireEvent.click(sendButton);
      expect(getByText(/введите сообщение/i)).toBeInTheDocument();
    });
  });

  describe('Message Actions', () => {
    it('shows message actions on hover', async () => {
      const { getAllByTestId } = renderWithTheme(
        <ChatPage initialMessages={mockMessages} />
      );
      const message = getAllByTestId('chat-message')[0];

      await userEvent.hover(message);
      expect(document.querySelector('[data-testid="message-actions"]')).toBeVisible();
    });

    it('copies message text', async () => {
      const { getAllByTestId, getByText } = renderWithTheme(
        <ChatPage initialMessages={mockMessages} />
      );
      const message = getAllByTestId('chat-message')[0];

      await userEvent.hover(message);
      const copyButton = getByText(/копировать/i);
      await userEvent.click(copyButton);

      expect(getByText(/скопировано/i)).toBeInTheDocument();
    });

    it('edits user message', async () => {
      const { getAllByTestId, getByText, getByRole } = renderWithTheme(
        <ChatPage initialMessages={mockMessages} />
      );
      const message = getAllByTestId('chat-message')[0];

      await userEvent.hover(message);
      const editButton = getByText(/редактировать/i);
      await userEvent.click(editButton);

      const input = getByRole('textbox');
      expect(input).toHaveValue(mockMessages[0].text);
    });
  });

  describe('Commands', () => {
    it('shows command suggestions', async () => {
      const { getByRole, getByTestId } = renderWithTheme(<ChatPage />);
      const input = getByRole('textbox');

      await userEvent.type(input, '/');
      expect(getByTestId('command-suggestions')).toBeVisible();
    });

    it('autocompletes commands', async () => {
      const { getByRole } = renderWithTheme(<ChatPage />);
      const input = getByRole('textbox');

      await userEvent.type(input, '/he');
      await userEvent.tab();

      expect(input).toHaveValue('/help');
    });

    it('executes commands', async () => {
      const { getByRole, getByText } = renderWithTheme(<ChatPage />);
      const input = getByRole('textbox');

      await userEvent.type(input, '/help{enter}');
      expect(getByText(/доступные команды/i)).toBeInTheDocument();
    });
  });

  describe('Settings', () => {
    it('opens settings modal', async () => {
      const { getByText } = renderWithTheme(<ChatPage />);
      const settingsButton = getByText(/настройки/i);

      await userEvent.click(settingsButton);
      expect(document.querySelector('[role="dialog"]')).toBeVisible();
    });

    it('updates agent settings', async () => {
      const { getByText, getByLabelText } = renderWithTheme(<ChatPage />);
      
      await userEvent.click(getByText(/настройки/i));
      await userEvent.type(getByLabelText(/имя агента/i), 'New Name');
      await userEvent.click(getByText(/сохранить/i));

      expect(getByText(/настройки агента успешно обновлены/i)).toBeInTheDocument();
    });
  });

  describe('Scroll Behavior', () => {
    it('scrolls to bottom on new message', async () => {
      const { getByRole, getByTestId } = renderWithTheme(<ChatPage />);
      const input = getByRole('textbox');
      const container = getByTestId('messages-container');

      await userEvent.type(input, 'Test message{enter}');
      expect(container.scrollTop).toBe(container.scrollHeight - container.clientHeight);
    });

    it('maintains scroll position when viewing history', async () => {
      const manyMessages = Array.from({ length: 50 }, (_, i) => ({
        text: `Message ${i}`,
        sender: 'user',
        timestamp: new Date()
      }));

      const { getByTestId } = renderWithTheme(
        <ChatPage initialMessages={manyMessages} />
      );
      const container = getByTestId('messages-container');

      const initialScrollTop = container.scrollTop;
      await userEvent.scroll(container, { target: { scrollTop: 500 } });
      expect(container.scrollTop).toBe(500);
    });
  });

  describe('Loading States', () => {
    it('shows typing indicator', async () => {
      const { getByRole, getByTestId } = renderWithTheme(<ChatPage />);
      const input = getByRole('textbox');

      await userEvent.type(input, 'Test message{enter}');
      expect(getByTestId('typing-indicator')).toBeVisible();
    });

    it('disables input while sending', async () => {
      const { getByRole } = renderWithTheme(<ChatPage />);
      const input = getByRole('textbox');

      await userEvent.type(input, 'Test message{enter}');
      expect(input).toBeDisabled();
    });
  });

  describe('Error Handling', () => {
    it('shows error messages', async () => {
      global.fetch = jest.fn(() => Promise.reject(new Error('Network error')));

      const { getByRole, getByText } = renderWithTheme(<ChatPage />);
      const input = getByRole('textbox');

      await userEvent.type(input, 'Test message{enter}');
      expect(getByText(/ошибка/i)).toBeInTheDocument();
    });

    it('allows retry after error', async () => {
      global.fetch = jest.fn()
        .mockImplementationOnce(() => Promise.reject(new Error('Network error')))
        .mockImplementationOnce(() => Promise.resolve({
          ok: true,
          json: () => Promise.resolve({ response: 'Success' })
        }));

      const { getByRole, getByText } = renderWithTheme(<ChatPage />);
      const input = getByRole('textbox');

      await userEvent.type(input, 'Test message{enter}');
      await userEvent.click(getByText(/повторить/i));

      expect(getByText('Success')).toBeInTheDocument();
    });
  });

  describe('Keyboard Navigation', () => {
    it('supports keyboard shortcuts', async () => {
      const { getByRole } = renderWithTheme(<ChatPage />);
      const input = getByRole('textbox');

      await userEvent.keyboard('{ctrl}k');
      expect(input).toHaveFocus();
    });

    it('handles Escape key', async () => {
      const { getByText, queryByRole } = renderWithTheme(<ChatPage />);
      
      await userEvent.click(getByText(/настройки/i));
      await userEvent.keyboard('{escape}');

      expect(queryByRole('dialog')).not.toBeInTheDocument();
    });
  });

  describe('Mobile Interactions', () => {
    it('supports touch events', async () => {
      const { getAllByTestId } = renderWithTheme(
        <ChatPage initialMessages={mockMessages} />
      );
      const message = getAllByTestId('chat-message')[0];

      await userEvent.click(message);
      expect(document.querySelector('[data-testid="message-actions"]')).toBeVisible();
    });

    it('handles long press', async () => {
      const { getAllByTestId } = renderWithTheme(
        <ChatPage initialMessages={mockMessages} />
      );
      const message = getAllByTestId('chat-message')[0];

      fireEvent.touchStart(message);
      await new Promise(resolve => setTimeout(resolve, 500));
      fireEvent.touchEnd(message);

      expect(document.querySelector('[data-testid="context-menu"]')).toBeVisible();
    });
  });
});
