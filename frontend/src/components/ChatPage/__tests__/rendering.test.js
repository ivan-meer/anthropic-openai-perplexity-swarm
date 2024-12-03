import React from 'react';
import { render, fireEvent, waitFor } from '@testing-library/react';
import { renderWithTheme } from './testUtils';
import ChatPage from '../index';
import { mockMessages, mockAgent } from './__mocks__/mockData';

describe('ChatPage Rendering', () => {
  describe('Initial Render', () => {
    it('renders without crashing', () => {
      const { container } = renderWithTheme(<ChatPage />);
      expect(container.firstChild).toBeInTheDocument();
    });

    it('renders with initial messages', () => {
      const { getAllByTestId } = renderWithTheme(
        <ChatPage initialMessages={mockMessages} />
      );
      const messages = getAllByTestId('chat-message');
      expect(messages).toHaveLength(mockMessages.length);
    });

    it('renders with initial agent', () => {
      const { getByTestId } = renderWithTheme(
        <ChatPage initialAgent={mockAgent} />
      );
      const agentInfo = getByTestId('agent-info');
      expect(agentInfo).toHaveTextContent(mockAgent.name);
    });
  });

  describe('Conditional Rendering', () => {
    it('shows loading state', async () => {
      const { getByRole, getByTestId } = renderWithTheme(<ChatPage />);
      const input = getByRole('textbox');

      fireEvent.change(input, { target: { value: 'Test message' } });
      fireEvent.submit(input.closest('form'));

      expect(getByTestId('loading-indicator')).toBeInTheDocument();
    });

    it('shows error state', async () => {
      global.fetch = jest.fn(() => Promise.reject(new Error('API Error')));

      const { getByRole, getByTestId } = renderWithTheme(<ChatPage />);
      const input = getByRole('textbox');

      fireEvent.change(input, { target: { value: 'Test message' } });
      fireEvent.submit(input.closest('form'));

      await waitFor(() => {
        expect(getByTestId('error-message')).toBeInTheDocument();
      });
    });

    it('shows empty state', () => {
      const { getByTestId } = renderWithTheme(<ChatPage />);
      expect(getByTestId('empty-state')).toBeInTheDocument();
    });
  });

  describe('Dynamic Rendering', () => {
    it('updates message list on new message', async () => {
      const { getByRole, getAllByTestId } = renderWithTheme(
        <ChatPage initialMessages={mockMessages} />
      );
      const input = getByRole('textbox');
      const initialCount = mockMessages.length;

      fireEvent.change(input, { target: { value: 'New message' } });
      fireEvent.submit(input.closest('form'));

      await waitFor(() => {
        const messages = getAllByTestId('chat-message');
        expect(messages).toHaveLength(initialCount + 1);
      });
    });

    it('updates agent info on settings change', async () => {
      const { getByRole, getByTestId } = renderWithTheme(
        <ChatPage initialAgent={mockAgent} />
      );

      fireEvent.click(getByRole('button', { name: /настройки/i }));
      const nameInput = getByRole('textbox', { name: /имя агента/i });
      fireEvent.change(nameInput, { target: { value: 'New Name' } });
      fireEvent.click(getByRole('button', { name: /сохранить/i }));

      await waitFor(() => {
        const agentInfo = getByTestId('agent-info');
        expect(agentInfo).toHaveTextContent('New Name');
      });
    });
  });

  describe('Layout Rendering', () => {
    it('maintains correct layout structure', () => {
      const { container } = renderWithTheme(<ChatPage />);

      expect(container.querySelector('header')).toBeInTheDocument();
      expect(container.querySelector('main')).toBeInTheDocument();
      expect(container.querySelector('footer')).toBeInTheDocument();
    });

    it('adjusts layout for different screen sizes', () => {
      const { container, rerender } = renderWithTheme(<ChatPage />);

      // Desktop
      expect(container.firstChild).toHaveStyle({
        padding: expect.any(String),
        maxWidth: expect.any(String)
      });

      // Tablet
      window.innerWidth = 768;
      window.dispatchEvent(new Event('resize'));
      rerender(<ChatPage />);

      expect(container.firstChild).toHaveStyle({
        padding: expect.any(String)
      });

      // Mobile
      window.innerWidth = 375;
      window.dispatchEvent(new Event('resize'));
      rerender(<ChatPage />);

      expect(container.firstChild).toHaveStyle({
        padding: expect.any(String)
      });
    });
  });

  describe('Component Composition', () => {
    it('renders child components in correct order', () => {
      const { container } = renderWithTheme(<ChatPage />);
      const children = container.firstChild.children;

      expect(children[0]).toHaveAttribute('data-testid', 'header');
      expect(children[1]).toHaveAttribute('data-testid', 'messages-container');
      expect(children[2]).toHaveAttribute('data-testid', 'input-container');
    });

    it('renders optional components when needed', () => {
      const { getByTestId, queryByTestId } = renderWithTheme(
        <ChatPage showStats showCommands />
      );

      expect(getByTestId('stats-container')).toBeInTheDocument();
      expect(getByTestId('commands-container')).toBeInTheDocument();
    });
  });

  describe('Performance Optimization', () => {
    it('uses memo for message components', () => {
      const { getAllByTestId, rerender } = renderWithTheme(
        <ChatPage initialMessages={mockMessages} />
      );

      const messages = getAllByTestId('chat-message');
      const initialProps = messages.map(msg => msg.textContent);

      rerender(<ChatPage initialMessages={mockMessages} key="rerender" />);
      const newMessages = getAllByTestId('chat-message');
      const newProps = newMessages.map(msg => msg.textContent);

      expect(newProps).toEqual(initialProps);
    });

    it('implements virtual scrolling for large lists', () => {
      const manyMessages = Array.from({ length: 1000 }, (_, i) => ({
        text: `Message ${i}`,
        sender: 'user',
        timestamp: new Date()
      }));

      const { container } = renderWithTheme(
        <ChatPage initialMessages={manyMessages} />
      );

      const renderedMessages = container.querySelectorAll('[data-testid="chat-message"]');
      expect(renderedMessages.length).toBeLessThan(manyMessages.length);
    });
  });

  describe('Style Application', () => {
    it('applies theme styles correctly', () => {
      const { container } = renderWithTheme(<ChatPage />);

      expect(container.firstChild).toHaveStyle({
        backgroundColor: expect.any(String),
        color: expect.any(String),
        fontFamily: expect.any(String)
      });
    });

    it('applies dynamic styles', async () => {
      const { getAllByTestId } = renderWithTheme(
        <ChatPage initialMessages={mockMessages} />
      );
      const messages = getAllByTestId('chat-message');

      fireEvent.mouseEnter(messages[0]);
      expect(messages[0]).toHaveStyle({
        backgroundColor: expect.any(String)
      });

      fireEvent.mouseLeave(messages[0]);
      expect(messages[0]).not.toHaveStyle({
        backgroundColor: expect.any(String)
      });
    });
  });

  describe('Accessibility Rendering', () => {
    it('renders with correct ARIA attributes', () => {
      const { getByRole } = renderWithTheme(<ChatPage />);

      expect(getByRole('main')).toHaveAttribute('aria-label', 'Чат');
      expect(getByRole('textbox')).toHaveAttribute('aria-label', 'Сообщение');
    });

    it('maintains focus management', async () => {
      const { getByRole } = renderWithTheme(<ChatPage />);
      const input = getByRole('textbox');

      fireEvent.change(input, { target: { value: 'Test message' } });
      fireEvent.submit(input.closest('form'));

      await waitFor(() => {
        expect(document.activeElement).toBe(input);
      });
    });
  });

  describe('Error Boundaries', () => {
    it('renders error fallback on error', () => {
      const ErrorComponent = () => {
        throw new Error('Test error');
      };

      const { getByText } = renderWithTheme(
        <ChatPage>
          <ErrorComponent />
        </ChatPage>
      );

      expect(getByText(/произошла ошибка/i)).toBeInTheDocument();
    });

    it('recovers from errors', async () => {
      const ErrorComponent = () => {
        throw new Error('Test error');
      };

      const { getByText } = renderWithTheme(
        <ChatPage>
          <ErrorComponent />
        </ChatPage>
      );

      fireEvent.click(getByText(/повторить/i));

      await waitFor(() => {
        expect(getByText(/чат с ai-агентами/i)).toBeInTheDocument();
      });
    });
  });
});
