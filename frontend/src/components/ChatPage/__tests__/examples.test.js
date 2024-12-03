import React from 'react';
import { render, fireEvent, waitFor } from '@testing-library/react';
import { renderWithTheme } from './testUtils';
import ChatPage from '../index';
import { examples } from '../examples';

describe('ChatPage Examples', () => {
  describe('Basic Usage', () => {
    it('demonstrates basic message sending', async () => {
      const { getByRole } = renderWithTheme(
        <ChatPage {...examples.basic} />
      );
      const input = getByRole('textbox');

      fireEvent.change(input, { target: { value: 'Hello' } });
      fireEvent.submit(input.closest('form'));

      await waitFor(() => {
        const messages = document.querySelectorAll('[data-testid="chat-message"]');
        expect(messages).toHaveLength(1);
        expect(messages[0]).toHaveTextContent('Hello');
      });
    });

    it('shows basic agent response', async () => {
      const { getByRole, getAllByTestId } = renderWithTheme(
        <ChatPage {...examples.basic} />
      );
      const input = getByRole('textbox');

      fireEvent.change(input, { target: { value: 'Hello' } });
      fireEvent.submit(input.closest('form'));

      await waitFor(() => {
        const messages = getAllByTestId('chat-message');
        expect(messages).toHaveLength(2);
        expect(messages[1]).toHaveTextContent(/привет/i);
      });
    });
  });

  describe('Custom Agent', () => {
    it('uses custom agent configuration', () => {
      const { getByTestId } = renderWithTheme(
        <ChatPage {...examples.customAgent} />
      );
      const agentInfo = getByTestId('agent-info');

      expect(agentInfo).toHaveTextContent(examples.customAgent.initialAgent.name);
    });

    it('demonstrates agent capabilities', async () => {
      const { getByRole, getAllByTestId } = renderWithTheme(
        <ChatPage {...examples.customAgent} />
      );
      const input = getByRole('textbox');

      fireEvent.change(input, { target: { value: '/capabilities' } });
      fireEvent.submit(input.closest('form'));

      await waitFor(() => {
        const messages = getAllByTestId('chat-message');
        const lastMessage = messages[messages.length - 1];
        examples.customAgent.initialAgent.capabilities.forEach(capability => {
          expect(lastMessage).toHaveTextContent(capability);
        });
      });
    });
  });

  describe('Custom Commands', () => {
    it('executes custom command', async () => {
      const { getByRole, getAllByTestId } = renderWithTheme(
        <ChatPage {...examples.customCommands} />
      );
      const input = getByRole('textbox');

      fireEvent.change(input, { target: { value: '/custom test' } });
      fireEvent.submit(input.closest('form'));

      await waitFor(() => {
        const messages = getAllByTestId('chat-message');
        const lastMessage = messages[messages.length - 1];
        expect(lastMessage).toHaveTextContent('Custom command executed');
      });
    });

    it('shows custom command help', async () => {
      const { getByRole, getAllByTestId } = renderWithTheme(
        <ChatPage {...examples.customCommands} />
      );
      const input = getByRole('textbox');

      fireEvent.change(input, { target: { value: '/help custom' } });
      fireEvent.submit(input.closest('form'));

      await waitFor(() => {
        const messages = getAllByTestId('chat-message');
        const lastMessage = messages[messages.length - 1];
        expect(lastMessage).toHaveTextContent(/custom command description/i);
      });
    });
  });

  describe('Custom Theme', () => {
    it('applies custom theme', () => {
      const { container } = renderWithTheme(
        <ChatPage {...examples.customTheme} />
      );

      expect(container.firstChild).toHaveStyle({
        backgroundColor: examples.customTheme.theme.colors.background
      });
    });

    it('applies custom typography', () => {
      const { container } = renderWithTheme(
        <ChatPage {...examples.customTheme} />
      );

      expect(container.firstChild).toHaveStyle({
        fontFamily: examples.customTheme.theme.typography.fontFamily
      });
    });
  });

  describe('Custom Notifications', () => {
    it('shows custom notifications', async () => {
      const { getByRole, getByTestId } = renderWithTheme(
        <ChatPage {...examples.customNotifications} />
      );
      const input = getByRole('textbox');

      fireEvent.change(input, { target: { value: 'Test message' } });
      fireEvent.submit(input.closest('form'));

      await waitFor(() => {
        const toast = getByTestId('toast');
        expect(toast).toHaveTextContent(/custom notification/i);
      });
    });

    it('handles custom notification actions', async () => {
      const { getByRole, getByText } = renderWithTheme(
        <ChatPage {...examples.customNotifications} />
      );
      const input = getByRole('textbox');

      fireEvent.change(input, { target: { value: 'Test message' } });
      fireEvent.submit(input.closest('form'));

      const actionButton = await waitFor(() => getByText(/действие/i));
      fireEvent.click(actionButton);

      await waitFor(() => {
        expect(examples.customNotifications.onNotificationAction).toHaveBeenCalled();
      });
    });
  });

  describe('Custom Stats', () => {
    it('shows custom statistics', () => {
      const { getByTestId } = renderWithTheme(
        <ChatPage {...examples.customStats} />
      );
      const stats = getByTestId('chat-stats');

      expect(stats).toHaveTextContent(/пользовательская статистика/i);
    });

    it('updates custom metrics', async () => {
      const { getByRole, getByTestId } = renderWithTheme(
        <ChatPage {...examples.customStats} />
      );
      const input = getByRole('textbox');

      fireEvent.change(input, { target: { value: 'Test message' } });
      fireEvent.submit(input.closest('form'));

      await waitFor(() => {
        const stats = getByTestId('chat-stats');
        expect(stats).toHaveTextContent(/обновлено/i);
      });
    });
  });

  describe('Error Handling', () => {
    it('demonstrates error handling', async () => {
      const { getByRole, getByTestId } = renderWithTheme(
        <ChatPage {...examples.errorHandling} />
      );
      const input = getByRole('textbox');

      fireEvent.change(input, { target: { value: '/error' } });
      fireEvent.submit(input.closest('form'));

      await waitFor(() => {
        const errorMessage = getByTestId('error-message');
        expect(errorMessage).toHaveTextContent(/пример обработки ошибки/i);
      });
    });

    it('shows error recovery', async () => {
      const { getByRole, getByText } = renderWithTheme(
        <ChatPage {...examples.errorHandling} />
      );
      const input = getByRole('textbox');

      fireEvent.change(input, { target: { value: '/error' } });
      fireEvent.submit(input.closest('form'));

      const retryButton = await waitFor(() => getByText(/повторить/i));
      fireEvent.click(retryButton);

      await waitFor(() => {
        expect(examples.errorHandling.onRetry).toHaveBeenCalled();
      });
    });
  });

  describe('Performance Optimization', () => {
    it('demonstrates message virtualization', () => {
      const manyMessages = Array.from({ length: 1000 }, (_, i) => ({
        text: `Message ${i}`,
        sender: 'user',
        timestamp: new Date()
      }));

      const { container } = renderWithTheme(
        <ChatPage {...examples.performance} initialMessages={manyMessages} />
      );

      const renderedMessages = container.querySelectorAll('[data-testid="chat-message"]');
      expect(renderedMessages.length).toBeLessThan(manyMessages.length);
    });

    it('shows optimized rendering', async () => {
      const { getByRole, getAllByTestId } = renderWithTheme(
        <ChatPage {...examples.performance} />
      );
      const input = getByRole('textbox');

      // Быстрая отправка сообщений
      for (let i = 0; i < 10; i++) {
        fireEvent.change(input, { target: { value: `Message ${i}` } });
        fireEvent.submit(input.closest('form'));
      }

      await waitFor(() => {
        const messages = getAllByTestId('chat-message');
        expect(messages).toHaveLength(10);
      });
    });
  });
});
