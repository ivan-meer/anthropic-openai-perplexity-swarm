import React from 'react';
import { render, fireEvent, waitFor } from '@testing-library/react';
import { renderWithTheme } from './testUtils';
import ChatPage from '../index';
import { mockMessages } from './__mocks__/mockData';

// Мок для i18next
jest.mock('react-i18next', () => ({
  useTranslation: () => ({
    t: key => key,
    i18n: {
      changeLanguage: jest.fn(),
      language: 'ru'
    }
  })
}));

describe('ChatPage Localization', () => {
  describe('Language Switching', () => {
    it('changes language', async () => {
      const { getByRole, getByLabelText } = renderWithTheme(<ChatPage />);
      const languageSelect = getByLabelText(/язык/i);

      fireEvent.change(languageSelect, { target: { value: 'en' } });

      await waitFor(() => {
        expect(document.documentElement).toHaveAttribute('lang', 'en');
      });
    });

    it('persists language preference', async () => {
      const { getByLabelText } = renderWithTheme(<ChatPage />);
      const languageSelect = getByLabelText(/язык/i);

      fireEvent.change(languageSelect, { target: { value: 'en' } });

      expect(localStorage.getItem('language')).toBe('en');
    });

    it('loads saved language preference', () => {
      localStorage.setItem('language', 'fr');
      
      const { getByLabelText } = renderWithTheme(<ChatPage />);
      const languageSelect = getByLabelText(/язык/i);

      expect(languageSelect.value).toBe('fr');
    });
  });

  describe('Text Translation', () => {
    it('translates UI elements', () => {
      const { getByText } = renderWithTheme(<ChatPage />);

      expect(getByText('chat.title')).toBeInTheDocument();
      expect(getByText('chat.input.placeholder')).toBeInTheDocument();
      expect(getByText('chat.settings.title')).toBeInTheDocument();
    });

    it('translates error messages', async () => {
      const { getByRole, getByText } = renderWithTheme(<ChatPage />);
      const input = getByRole('textbox');

      fireEvent.change(input, { target: { value: '' } });
      fireEvent.submit(input.closest('form'));

      await waitFor(() => {
        expect(getByText('errors.empty_message')).toBeInTheDocument();
      });
    });

    it('translates notifications', async () => {
      const { getByRole, getByText } = renderWithTheme(<ChatPage />);
      const input = getByRole('textbox');

      fireEvent.change(input, { target: { value: 'Test message' } });
      fireEvent.submit(input.closest('form'));

      await waitFor(() => {
        expect(getByText('notifications.message_sent')).toBeInTheDocument();
      });
    });
  });

  describe('Date Formatting', () => {
    it('formats dates according to locale', () => {
      const messages = [{
        ...mockMessages[0],
        timestamp: new Date('2024-01-01T12:00:00')
      }];

      const { getByText } = renderWithTheme(
        <ChatPage initialMessages={messages} />
      );

      expect(getByText('01.01.2024')).toBeInTheDocument();
    });

    it('formats relative time', () => {
      const messages = [{
        ...mockMessages[0],
        timestamp: new Date(Date.now() - 5 * 60 * 1000) // 5 минут назад
      }];

      const { getByText } = renderWithTheme(
        <ChatPage initialMessages={messages} />
      );

      expect(getByText('time.minutes_ago')).toBeInTheDocument();
    });
  });

  describe('Number Formatting', () => {
    it('formats numbers according to locale', () => {
      const { getByTestId } = renderWithTheme(<ChatPage />);
      const stats = getByTestId('chat-stats');

      expect(stats).toHaveTextContent('1 000'); // Пробел как разделитель тысяч в русской локали
    });

    it('formats currency values', () => {
      const { getByTestId } = renderWithTheme(<ChatPage />);
      const stats = getByTestId('chat-stats');

      expect(stats).toHaveTextContent('1 000 ₽');
    });
  });

  describe('RTL Support', () => {
    it('switches text direction for RTL languages', async () => {
      const { getByLabelText, container } = renderWithTheme(<ChatPage />);
      const languageSelect = getByLabelText(/язык/i);

      fireEvent.change(languageSelect, { target: { value: 'ar' } });

      await waitFor(() => {
        expect(container.firstChild).toHaveStyle({ direction: 'rtl' });
      });
    });

    it('aligns text correctly in RTL mode', async () => {
      const { getByLabelText, getAllByTestId } = renderWithTheme(
        <ChatPage initialMessages={mockMessages} />
      );
      const languageSelect = getByLabelText(/язык/i);

      fireEvent.change(languageSelect, { target: { value: 'ar' } });

      await waitFor(() => {
        const messages = getAllByTestId('chat-message');
        expect(messages[0]).toHaveStyle({ textAlign: 'right' });
      });
    });
  });

  describe('Pluralization', () => {
    it('handles plural forms', () => {
      const { getByTestId } = renderWithTheme(<ChatPage />);
      const stats = getByTestId('chat-stats');

      expect(stats).toHaveTextContent('messages.count.many');
    });

    it('handles zero case', () => {
      const { getByTestId } = renderWithTheme(<ChatPage />);
      const stats = getByTestId('chat-stats');

      expect(stats).toHaveTextContent('messages.count.zero');
    });
  });

  describe('Message Translation', () => {
    it('translates system messages', async () => {
      const { getByRole, getAllByTestId } = renderWithTheme(<ChatPage />);
      const input = getByRole('textbox');

      fireEvent.change(input, { target: { value: '/help' } });
      fireEvent.submit(input.closest('form'));

      await waitFor(() => {
        const messages = getAllByTestId('chat-message');
        expect(messages[messages.length - 1]).toHaveTextContent('commands.help.description');
      });
    });

    it('shows original message with translation', async () => {
      const { getByRole, getAllByTestId } = renderWithTheme(<ChatPage />);
      const input = getByRole('textbox');

      fireEvent.change(input, { target: { value: '/translate Hello' } });
      fireEvent.submit(input.closest('form'));

      await waitFor(() => {
        const messages = getAllByTestId('chat-message');
        const lastMessage = messages[messages.length - 1];
        expect(lastMessage).toHaveTextContent('Hello');
        expect(lastMessage).toHaveTextContent('Привет');
      });
    });
  });

  describe('Accessibility', () => {
    it('translates ARIA labels', () => {
      const { getByRole } = renderWithTheme(<ChatPage />);
      const input = getByRole('textbox');

      expect(input).toHaveAttribute('aria-label', 'aria.message_input');
    });

    it('translates error announcements', async () => {
      const { getByRole } = renderWithTheme(<ChatPage />);
      const input = getByRole('textbox');

      fireEvent.change(input, { target: { value: '' } });
      fireEvent.submit(input.closest('form'));

      await waitFor(() => {
        const alert = document.querySelector('[role="alert"]');
        expect(alert).toHaveTextContent('aria.error_message');
      });
    });
  });

  describe('Dynamic Content', () => {
    it('updates translations on content change', async () => {
      const { getByRole, getAllByTestId } = renderWithTheme(<ChatPage />);
      const input = getByRole('textbox');

      fireEvent.change(input, { target: { value: 'Test message' } });
      fireEvent.submit(input.closest('form'));

      await waitFor(() => {
        const messages = getAllByTestId('chat-message');
        expect(messages[messages.length - 1]).toHaveTextContent('message.sent');
      });
    });

    it('handles interpolation', async () => {
      const { getByTestId } = renderWithTheme(<ChatPage />);
      const stats = getByTestId('chat-stats');

      expect(stats).toHaveTextContent('stats.messages_count');
      expect(stats.textContent).toMatch(/\d+/);
    });
  });
});
