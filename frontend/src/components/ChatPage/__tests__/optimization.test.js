import React from 'react';
import { render, fireEvent, waitFor } from '@testing-library/react';
import { renderWithTheme } from './testUtils';
import ChatPage from '../index';
import { mockMessages, mockAgent } from './__mocks__/mockData';

describe('ChatPage Optimization', () => {
  describe('Memoization', () => {
    it('memoizes expensive calculations', () => {
      const renderSpy = jest.spyOn(React, 'createElement');
      const { rerender } = renderWithTheme(<ChatPage />);

      const initialRenderCount = renderSpy.mock.calls.length;
      rerender(<ChatPage />);

      expect(renderSpy.mock.calls.length - initialRenderCount).toBeLessThan(5);
    });

    it('uses React.memo for child components', () => {
      const renderSpy = jest.spyOn(React, 'memo');
      renderWithTheme(<ChatPage />);

      expect(renderSpy).toHaveBeenCalled();
    });

    it('uses useMemo for complex computations', () => {
      const memoSpy = jest.spyOn(React, 'useMemo');
      renderWithTheme(<ChatPage />);

      expect(memoSpy).toHaveBeenCalled();
    });
  });

  describe('Lazy Loading', () => {
    it('lazy loads non-critical components', async () => {
      const { getByText, queryByTestId } = renderWithTheme(<ChatPage />);

      expect(queryByTestId('settings-modal')).toBeNull();

      fireEvent.click(getByText('Настройки'));

      await waitFor(() => {
        expect(queryByTestId('settings-modal')).toBeInTheDocument();
      });
    });

    it('lazy loads images', () => {
      const { container } = renderWithTheme(<ChatPage />);
      const images = container.querySelectorAll('img');

      images.forEach(img => {
        expect(img).toHaveAttribute('loading', 'lazy');
      });
    });
  });

  describe('Virtual Scrolling', () => {
    it('renders only visible messages', () => {
      const manyMessages = Array.from({ length: 1000 }, (_, i) => ({
        text: `Message ${i}`,
        sender: i % 2 === 0 ? 'user' : 'ai',
        timestamp: new Date()
      }));

      const { container } = renderWithTheme(
        <ChatPage initialMessages={manyMessages} />
      );

      const renderedMessages = container.querySelectorAll('[data-testid="chat-message"]');
      expect(renderedMessages.length).toBeLessThan(manyMessages.length);
    });

    it('updates visible messages on scroll', async () => {
      const manyMessages = Array.from({ length: 100 }, (_, i) => ({
        text: `Message ${i}`,
        sender: 'user',
        timestamp: new Date()
      }));

      const { container } = renderWithTheme(
        <ChatPage initialMessages={manyMessages} />
      );

      const messagesContainer = container.querySelector('[data-testid="messages-container"]');
      fireEvent.scroll(messagesContainer, { target: { scrollTop: 1000 } });

      await waitFor(() => {
        const visibleMessages = container.querySelectorAll('[data-testid="chat-message"]');
        expect(visibleMessages[0].textContent).not.toContain('Message 0');
      });
    });
  });

  describe('Debouncing and Throttling', () => {
    it('debounces input changes', async () => {
      jest.useFakeTimers();
      const { getByRole } = renderWithTheme(<ChatPage />);
      const input = getByRole('textbox');

      const changes = Array.from({ length: 10 }, (_, i) => `Change ${i}`);
      changes.forEach(change => {
        fireEvent.change(input, { target: { value: change } });
      });

      jest.runAllTimers();

      expect(input.value).toBe(changes[changes.length - 1]);
      jest.useRealTimers();
    });

    it('throttles scroll event handlers', async () => {
      const scrollSpy = jest.fn();
      const { container } = renderWithTheme(
        <ChatPage onScroll={scrollSpy} />
      );

      const messagesContainer = container.querySelector('[data-testid="messages-container"]');
      for (let i = 0; i < 100; i++) {
        fireEvent.scroll(messagesContainer);
      }

      expect(scrollSpy.mock.calls.length).toBeLessThan(20);
    });
  });

  describe('Memory Management', () => {
    it('cleans up resources on unmount', () => {
      const { unmount } = renderWithTheme(<ChatPage />);
      const cleanupSpy = jest.spyOn(React, 'useEffect').mock.calls[0][0];

      unmount();

      expect(cleanupSpy).toHaveBeenCalled();
    });

    it('limits message history size', async () => {
      const { getByRole } = renderWithTheme(<ChatPage />);
      const input = getByRole('textbox');

      for (let i = 0; i < 1000; i++) {
        fireEvent.change(input, { target: { value: `Message ${i}` } });
        fireEvent.submit(input.closest('form'));
      }

      const messages = document.querySelectorAll('[data-testid="chat-message"]');
      expect(messages.length).toBeLessThanOrEqual(500);
    });
  });

  describe('Event Optimization', () => {
    it('uses event delegation', () => {
      const { container } = renderWithTheme(
        <ChatPage initialMessages={mockMessages} />
      );

      const messagesContainer = container.querySelector('[data-testid="messages-container"]');
      const eventListeners = window.getEventListeners(messagesContainer);

      expect(eventListeners.click).toBeDefined();
      expect(eventListeners.click.length).toBe(1);
    });

    it('removes event listeners on cleanup', () => {
      const { unmount, container } = renderWithTheme(<ChatPage />);
      const messagesContainer = container.querySelector('[data-testid="messages-container"]');
      
      unmount();

      const eventListeners = window.getEventListeners(messagesContainer);
      expect(eventListeners).toEqual({});
    });
  });

  describe('Rendering Optimization', () => {
    it('uses CSS containment', () => {
      const { container } = renderWithTheme(<ChatPage />);
      const messagesContainer = container.querySelector('[data-testid="messages-container"]');

      expect(messagesContainer).toHaveStyle({
        contain: 'content'
      });
    });

    it('uses will-change for animations', () => {
      const { container } = renderWithTheme(<ChatPage />);
      const animatedElements = container.querySelectorAll('[style*="will-change"]');

      expect(animatedElements.length).toBeGreaterThan(0);
    });
  });

  describe('Network Optimization', () => {
    it('batches API requests', async () => {
      const fetchSpy = jest.spyOn(global, 'fetch');
      const { getByRole } = renderWithTheme(<ChatPage />);
      const input = getByRole('textbox');

      for (let i = 0; i < 5; i++) {
        fireEvent.change(input, { target: { value: `Message ${i}` } });
        fireEvent.submit(input.closest('form'));
      }

      await waitFor(() => {
        expect(fetchSpy.mock.calls.length).toBeLessThan(5);
      });
    });

    it('caches responses', async () => {
      const fetchSpy = jest.spyOn(global, 'fetch');
      const { getByRole } = renderWithTheme(<ChatPage />);
      const input = getByRole('textbox');

      // Отправляем одинаковые сообщения
      fireEvent.change(input, { target: { value: 'Test message' } });
      fireEvent.submit(input.closest('form'));
      fireEvent.change(input, { target: { value: 'Test message' } });
      fireEvent.submit(input.closest('form'));

      await waitFor(() => {
        expect(fetchSpy.mock.calls.length).toBe(1);
      });
    });
  });

  describe('State Management Optimization', () => {
    it('uses batch updates', async () => {
      const setStateSpy = jest.spyOn(React, 'useState');
      const { getByRole } = renderWithTheme(<ChatPage />);
      const input = getByRole('textbox');

      fireEvent.change(input, { target: { value: 'Test message' } });
      fireEvent.submit(input.closest('form'));

      expect(setStateSpy.mock.calls.length).toBeLessThan(
        input.value.length + 2
      );
    });

    it('prevents unnecessary re-renders', () => {
      const renderSpy = jest.spyOn(React, 'createElement');
      const { rerender } = renderWithTheme(
        <ChatPage key="1" nonEssentialProp="test" />
      );

      const initialRenderCount = renderSpy.mock.calls.length;
      rerender(<ChatPage key="1" nonEssentialProp="changed" />);

      expect(renderSpy.mock.calls.length).toBe(initialRenderCount);
    });
  });
});
